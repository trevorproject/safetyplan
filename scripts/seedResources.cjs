// Creates or updates one Firestore document in `resources` per organization
// listed in a JSON file (scripts/resources.json by default).
//
//   npm run seed-resources                     -> writes scripts/resources.json
//   npm run seed-resources -- my-file.json     -> writes another file
//   npm run seed-resources -- --dry-run        -> only validates and prints
//
// Each entry becomes the document `resources/<id>`. When `id` is missing it is
// built from the region and the name (e.g. `mx-safe-space-hotline`), so running
// the script again updates the same documents instead of duplicating them. The
// JSON is the source of truth: every listed document is replaced with what the
// file says. Documents not listed in the file are left untouched.
//
// `image` (optional) is a local file path, relative to the JSON file. It is
// uploaded to Firebase Storage and its download URL is saved as `imageUrl`.
// Use `imageUrl` instead when the image is already online.
//
// Needs serviceAccountKey.json in the project root (git-ignored, never commit it).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');

const REGIONS = ['US', 'MX', 'GLOBAL'];
// Same rules the app applies in src/hooks/useResources.ts, so nothing written
// here is silently hidden on the resources page.
const PHONE_PATTERN = /^\+?[\d\s().-]{3,}$/;
const IMAGE_TYPES = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const filePath = path.resolve(args.find((arg) => !arg.startsWith('--')) ?? path.join(__dirname, 'resources.json'));

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function isText(value) {
  if (typeof value === 'string') return value.trim() !== '';
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return Object.entries(value).every(([key, text]) => ['en', 'es'].includes(key) && typeof text === 'string') &&
    Object.values(value).some((text) => text.trim() !== '');
}

function isHttps(value) {
  return typeof value === 'string' && value.startsWith('https://');
}

/** Returns the list of problems with an entry (empty when it is valid). */
function validate(entry, baseDir) {
  const errors = [];
  if (!REGIONS.includes(entry.region)) errors.push(`region must be one of ${REGIONS.join(', ')}`);
  if (!isText(entry.name)) errors.push('name is required (text or { "en": ..., "es": ... })');
  if (entry.description !== undefined && !isText(entry.description)) errors.push('description must be text or { "en", "es" }');
  if (entry.url !== undefined && !isHttps(entry.url)) errors.push('url must start with https://');
  if (entry.phone !== undefined && !(typeof entry.phone === 'string' && PHONE_PATTERN.test(entry.phone.trim()))) {
    errors.push('phone may only contain digits, spaces and + ( ) . -');
  }
  if (!entry.url && !entry.phone) errors.push('needs a url and/or a phone, or the app will not show it');
  if (entry.imageUrl !== undefined && !isHttps(entry.imageUrl)) errors.push('imageUrl must start with https://');
  if (entry.image !== undefined) {
    if (entry.imageUrl !== undefined) errors.push('use image (local file) or imageUrl (online), not both');
    else if (!IMAGE_TYPES[path.extname(String(entry.image)).toLowerCase()]) errors.push('image must be .png, .jpg, .jpeg or .webp');
    else if (!fs.existsSync(path.resolve(baseDir, entry.image))) errors.push(`image not found: ${entry.image}`);
  }
  if (entry.isActive !== undefined && typeof entry.isActive !== 'boolean') errors.push('isActive must be true or false');
  if (entry.order !== undefined && typeof entry.order !== 'number') errors.push('order must be a number');
  if (entry.languages !== undefined && !(Array.isArray(entry.languages) && entry.languages.every((l) => typeof l === 'string'))) {
    errors.push('languages must be a list like ["es", "en"]');
  }
  if (entry.id !== undefined && !(typeof entry.id === 'string' && /^[A-Za-z0-9_-]+$/.test(entry.id))) {
    errors.push('id may only contain letters, numbers, - and _');
  }
  return errors;
}

function documentId(entry) {
  if (entry.id) return entry.id;
  const name = typeof entry.name === 'string' ? entry.name : entry.name.en || entry.name.es;
  return `${entry.region.toLowerCase()}-${slugify(name)}`;
}

/** Uploads a local image to Storage and returns its public download URL. */
async function uploadImage(bucket, localPath, id) {
  const extension = path.extname(localPath).toLowerCase();
  const destination = `resources/${id}${extension}`;
  const token = crypto.randomUUID();
  await bucket.upload(localPath, {
    destination,
    metadata: {
      contentType: IMAGE_TYPES[extension],
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destination)}?alt=media&token=${token}`;
}

async function main() {
  const baseDir = path.dirname(filePath);
  const entries = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!Array.isArray(entries)) throw new Error(`${filePath} must contain a list ([ ... ]) of resources`);

  // Validate everything first, so a mistake in one entry writes nothing.
  const ids = new Map();
  let invalid = 0;
  entries.forEach((entry, index) => {
    const label = `#${index + 1} ${typeof entry?.name === 'string' ? entry.name : JSON.stringify(entry?.name)}`;
    const errors = entry && typeof entry === 'object' ? validate(entry, baseDir) : ['must be an object { ... }'];
    if (errors.length === 0) {
      const id = documentId(entry);
      if (ids.has(id)) errors.push(`same document id "${id}" as ${ids.get(id)}; give one of them an "id"`);
      else ids.set(id, label);
    }
    if (errors.length > 0) {
      invalid += 1;
      console.error(`✗ ${label}\n    - ${errors.join('\n    - ')}`);
    }
  });
  if (invalid > 0) {
    console.error(`\n${invalid} invalid resource(s). Nothing was written.`);
    process.exitCode = 1;
    return;
  }

  if (dryRun) {
    entries.forEach((entry) => console.log(`✓ resources/${documentId(entry)}  (${entry.region})`));
    console.log(`\nDry run: ${entries.length} valid resource(s). Nothing was written.`);
    return;
  }

  const serviceAccount = require(path.join(__dirname, '..', 'serviceAccountKey.json'));
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: `${serviceAccount.project_id}.firebasestorage.app`,
  });
  const db = getFirestore();

  for (const entry of entries) {
    const id = documentId(entry);
    const { id: _id, image, ...fields } = entry;
    if (image) fields.imageUrl = await uploadImage(getStorage().bucket(), path.resolve(baseDir, image), id);
    if (fields.phone) fields.phone = fields.phone.trim();
    await db.collection('resources').doc(id).set({ isActive: true, order: 99, ...fields });
    console.log(`✓ resources/${id}  (${entry.region})${image ? '  image uploaded' : ''}`);
  }
  console.log(`\n${entries.length} resource(s) written.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
