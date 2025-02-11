import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

/**
 * Firebase configuration object
 * Contains API keys and other configuration settings
 * These values should be moved to environment variables in production
 */
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
const auth = getAuth(app);

export { auth, analytics };
export default app; 