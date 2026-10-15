import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase web config is public by design (it only identifies the project);
// access is controlled by the Firestore security rules. Analytics is not
// initialised: the app does not track its users (see context.md, Core Values).
const firebaseConfig = {
  apiKey: 'AIzaSyAkstbM2KJWTA_SbPi2-FzofTHYc8pAg0M',
  authDomain: 'safety-plan-trevor.firebaseapp.com',
  projectId: 'safety-plan-trevor',
  storageBucket: 'safety-plan-trevor.firebasestorage.app',
  messagingSenderId: '608700911274',
  appId: '1:608700911274:web:761eea4b5cd9a2ba640ad3',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
