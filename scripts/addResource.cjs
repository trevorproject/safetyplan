// Adds one crisis resource to the Firestore `resources` collection.
// Run from the project root: `npm run add-resource`
// Needs serviceAccountKey.json in the project root (git-ignored, never commit it).
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require(path.join(__dirname, '..', 'serviceAccountKey.json'));

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function addResource() {
  const docRef = await db.collection('resources').add({
    name: 'Safe Space Hotline',
    description: '24/7 support line',
    region: 'MX',
    type: 'hotline',
    url: 'https://example.com/mx-hotline',
    hours: '24/7',
    languages: ['es'],
    isActive: true,
    order: 1,
  });
  console.log(`Document written with ID: ${docRef.id}`);
}

addResource().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
