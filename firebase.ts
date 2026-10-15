import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase 项目：muqijiaju（Web 应用）
const firebaseConfig = {
  apiKey: "AIzaSyChqqRoVnF-047si4hdu9NAGhXadeDkkGE",
  authDomain: "muqijiaju.firebaseapp.com",
  projectId: "muqijiaju",
  storageBucket: "muqijiaju.firebasestorage.app",
  messagingSenderId: "291334390675",
  appId: "1:291334390675:web:94b605546d88fc3d229e66"
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;

try {
  // Check if firebase is already initialized to prevent hot-reload errors
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.warn("Firebase initialization failed. If you haven't configured your API keys, this is expected.", error);
}

export { auth, db, storage };