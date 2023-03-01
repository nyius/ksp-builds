import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';
import { getFirestore } from 'firebase/firestore';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

import { config } from './config';

const firebaseConfig = {
	apiKey: config.FIREBASE_API_KEY,
	authDomain: config.FIREBASE_AUTH_DOMAIN,
	projectId: config.FIREBASE_PROJECT_ID,
	storageBucket: config.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: config.FIREBASE_MESSENGER_SENDING_ID,
	appId: config.FIREBASE_APP_ID,
	measurementId: config.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore();
export const googleProvider = new GoogleAuthProvider();
export const auth = getAuth();
export const functions = getFunctions(app);
export const storage = getStorage();
