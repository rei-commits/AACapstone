import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Firebase configuration object
 * Contains API keys and other configuration settings
 * These values should be moved to environment variables in production
 */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase app with configuration
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);        // Authentication
export const db = getFirestore(app);     // Firestore Database
export const storage = getStorage(app);   // Storage

export default app; 