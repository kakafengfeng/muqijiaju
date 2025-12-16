import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
let app;
let auth;
let db;

try {
  // Check if firebase is already initialized
  if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig);
  } else {
    app = firebase.app();
  }
  auth = firebase.auth();
  db = firebase.firestore();
} catch (error) {
  console.warn("Firebase initialization failed. Please check your firebase.ts config.", error);
}

export { auth, db };