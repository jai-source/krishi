// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { DEMO_MODE } from "./demoConfig";

// Import local Firebase simulation for immediate functionality
import { auth as localAuth, db as localDb } from "./localFirebase";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef",
};

let auth, db;

// Use local Firebase simulation for full functionality without external dependencies
if (import.meta.env.DEV || DEMO_MODE || !import.meta.env.VITE_FIREBASE_API_KEY?.startsWith('AIza')) {
  // Use local Firebase simulation
  auth = localAuth;
  db = localDb;
  console.log("🚀 Using Local Firebase Simulation");
  console.log("✅ Full authentication and database functionality available");
  console.log("💾 Data persisted in localStorage");
} else {
  try {
    // Use real Firebase for production
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("🔥 Real Firebase initialized successfully");
    console.log(`📡 Project ID: ${firebaseConfig.projectId}`);
  } catch (error) {
    console.error("❌ Firebase initialization failed:", error);
    console.log("🔄 Falling back to local simulation");
    auth = localAuth;
    db = localDb;
  }
}

export { auth, db };
