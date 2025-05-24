// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, onSnapshot, setLogLevel } from "firebase/firestore";

// Your web app's Firebase configuration using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID // Optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Set log level (optional, for debugging)
// Note: setLogLevel is not directly exported from 'firebase/firestore' in v9+ modular SDK.
// If you need detailed Firestore logs, you might need to check Firebase documentation for current practices.
// For now, we'll omit this or you can use the global firebase.firestore.setLogLevel('debug') if using compat libraries.
// With modular SDK, detailed logging is often configured differently or might be less necessary.
// console.log("Firebase SDK Version:", firebase.SDK_VERSION); // If you need to check

export { auth, db, onAuthStateChanged, signInAnonymously, signInWithCustomToken, doc, getDoc, setDoc, onSnapshot };

// Custom App ID for structuring data (not a Firebase config value)
export const customAppId = 'daily-tracker-react-app';