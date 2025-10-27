import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ============================================
// 🔥 FIREBASE CONFIGURATION
// ============================================
// INSTRUCTIONS: Replace the values below with your Firebase project config
// 
// To get these values:
// 1. Go to https://console.firebase.google.com
// 2. Select your project (or create one)
// 3. Click the gear icon ⚙️ → "Project settings"
// 4. Scroll down to "Your apps" section
// 5. Click the web icon </> to add a web app (if not already added)
// 6. Copy the firebaseConfig object and paste it below
//
// NOTE: These values are safe to commit to your repository.
// Firebase security comes from Security Rules, not from hiding this config.
// ============================================





// Initialize Firebase
let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  
  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
  console.error("Make sure you've replaced the placeholder values in src/lib/firebase.js");
}

export { auth, db };
