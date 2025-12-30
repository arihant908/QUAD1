// Core
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Auth
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firestore
import { getFirestore } from "firebase/firestore";

// Storage
import { getStorage } from "firebase/storage";

// Firebase config (unchanged)
const firebaseConfig = {
  apiKey: "AIzaSyBIKX3i8LLAtm7-u4Lr1MB_QH6ugzfsYA8",
  authDomain: "quad-c10ab.firebaseapp.com",
  projectId: "quad-c10ab",
  storageBucket: "quad-c10ab.appspot.com",
  messagingSenderId: "592780294070",
  appId: "1:592780294070:web:b148005ae592829186b317",
  measurementId: "G-R6CTEZG1DJ",
};

// Init
const app = initializeApp(firebaseConfig);

// Services (EXPORT ALL)
export const auth = getAuth(app);                 // ✅ FIX
export const provider = new GoogleAuthProvider(); // (if you use Google sign-in)
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
