import { initializeApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

// The config comes from VITE_FIREBASE_* variables (.env, never committed; see
// .env.example) so the open-source repo doesn't carry the project's details.
// Vite still embeds them in the built bundle: they identify the project, they
// are not secrets. Access is controlled by firestore.rules. Analytics is not
// initialised: the app does not track its users (see context.md, Core Values).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missing = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missing.length > 0) {
  console.error(`Firebase is not configured (missing ${missing.join(', ')}). Copy .env.example to .env and fill it in.`);
}

/**
 * `null` when the env vars are missing, so a misconfigured build still renders
 * the static resources instead of crashing (useResources reports an error).
 */
export const db: Firestore | null = missing.length === 0 ? getFirestore(initializeApp(firebaseConfig)) : null;
