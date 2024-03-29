import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';
import { getFirestore, initializeFirestore, CACHE_SIZE_UNLIMITED, enableIndexedDbPersistence, clearIndexedDbPersistence } from 'firebase/firestore';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getPerformance } from 'firebase/performance';

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSENGER_SENDING_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
	measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, { cacheSizeBytes: CACHE_SIZE_UNLIMITED });
// clearIndexedDbPersistence(db);
enableIndexedDbPersistence(db);
// export const db = getFirestore();
export const googleProvider = new GoogleAuthProvider();
export const auth = getAuth();
export const functions = getFunctions(app);
export const storage = getStorage();
const perf = getPerformance(app);

googleProvider.setCustomParameters({
	prompt: 'select_account',
});
