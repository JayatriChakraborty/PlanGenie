
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIZ24VlMiW39sJ-l2UK6a9k0RcbUOMXbk",
  authDomain: "plangenie-549fc.firebaseapp.com",
  projectId: "plangenie-549fc",
  storageBucket: "plangenie-549fc.firebasestorage.app",
  messagingSenderId: "992654916278",
  appId: "1:992654916278:web:1968c00e3be014e1df8417"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };
