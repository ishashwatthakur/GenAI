import { initializeApp, getApp, getApps, FirebaseApp, FirebaseOptions } from "firebase/app";
import { getAuth, signInAnonymously, signInWithCustomToken, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Parse the Firebase config from environment variables.
const firebaseConfigString = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
let firebaseConfig: FirebaseOptions | null = null;
if (firebaseConfigString) {
    try {
        firebaseConfig = JSON.parse(firebaseConfigString);
    } catch (e) {
        console.error("Failed to parse NEXT_PUBLIC_FIREBASE_CONFIG. Please check your .env.local file.", e);
    }
} else {
    console.error("NEXT_PUBLIC_FIREBASE_CONFIG is not set in .env.local file.");
}

// Initialize Firebase App safely.
// This prevents re-initialization on hot reloads in development.
const app: FirebaseApp = !getApps().length && firebaseConfig 
    ? initializeApp(firebaseConfig) 
    : getApp();

// Initialize and export Firebase services.
// If config was missing, these will throw an error, which is better than failing silently.
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// --- Authentication Logic ---
// We wrap this in a self-executing function to handle the async logic cleanly
// without blocking the export of `auth` and `db`.

(async () => {
    // This code only runs on the client-side
    if (typeof window !== 'undefined') {
        const token = process.env.NEXT_PUBLIC_INITIAL_AUTH_TOKEN;

        try {
            if (token) {
                await signInWithCustomToken(auth, token);
                console.log("Firebase: Signed in with custom token.");
            } else {
                await signInAnonymously(auth);
                console.log("Firebase: Signed in anonymously (no token provided).");
            }
        } catch (error) {
            console.error("Firebase: Custom token sign-in failed. Falling back to anonymous.", error);
            try {
                await signInAnonymously(auth);
                console.log("Firebase: Signed in anonymously as fallback.");
            } catch (fallbackError) {
                console.error("Firebase: Fallback anonymous sign-in also failed.", fallbackError);
            }
        }
    }
})();