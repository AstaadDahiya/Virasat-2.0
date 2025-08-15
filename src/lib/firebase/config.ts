// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  projectId: "virasat-2",
  appId: "1:798603741672:web:20ec4fa1812a3ac0c4bc5d",
  storageBucket: "virasat-2.firebasestorage.app",
  apiKey: "AIzaSyBKchKk21zAAbS7kmMpRYpKkEGj8k5dJqY",
  authDomain: "virasat-2.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "798603741672"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
