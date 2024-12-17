import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBmwUhMXj1N5InZmvz-yjV1MfJA_RTFQTo",
  authDomain: "grouppay13.firebaseapp.com",
  projectId: "grouppay13",
  storageBucket: "grouppay13.firebasestorage.app",
  messagingSenderId: "97278699831",
  appId: "1:97278699831:web:3ce42d4b6490fb355f92b2",
  measurementId: "G-M45DLHM53X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app; 