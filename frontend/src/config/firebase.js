import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

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
const analytics = getAnalytics(app);
export const auth = getAuth(app); 