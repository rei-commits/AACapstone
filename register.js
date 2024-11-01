// Import the fucntions needed from the SDKs needed
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// My web app's Firebase configuration
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
const auth = getAuth();

//inputs
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');

// submit buttons and event listeners and some preventDefault

const loginSubmit = document.getElementById('loginSubmit');
const registerSubmit = document.getElementById('registerSubmit');

// Define the login function
function login(e) {
  e.preventDefault();
  const email = loginEmail.value;
  const password = loginPassword.value;
  
//   console.log('Attempting login with:', email);  Debug log

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    //   console.log('Login successful:', userCredential.user);  Debug log
      alert('Logged in successfully!');
      window.location.href = 'create-group.html';
    })
    .catch((error) => {
    //   console.error('Login error:', error);  Debug log
      alert(error.message);
    });
}

// Define the register function
function register(e) {
  e.preventDefault();
  const email = registerEmail.value;
  const password = registerPassword.value;
  
//   console.log('Attempting registration with:', email);  Debug log

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    //   console.log('Registration successful:', userCredential.user);  Debug log
      alert('Account created successfully!');
      window.location.href = 'create-group.html';
    })
    .catch((error) => {
    //   console.error('Registration error:', error);  Debug log
      alert(error.message);
    });
}

// Update event listeners
document.getElementById('loginForm').addEventListener('submit', login);
document.getElementById('registerForm').addEventListener('submit', register);


