// Create /src/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Type-only imports
import type { FirebaseApp } from "firebase/app";
import type { Analytics } from "firebase/analytics";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

// Your web app's Firebase configuration
const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyAg4I31IL6HqcxlcwgBDGg_A41cIu0uUjI",
  authDomain: "swasthya-link.firebaseapp.com",
  projectId: "swasthya-link",
  storageBucket: "swasthya-link.firebasestorage.app",
  messagingSenderId: "796605318362",
  appId: "1:796605318362:web:e5009d2c29cc110fd391e3",
  measurementId: "G-50DB4HQH40",
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const analytics: Analytics = getAnalytics(app);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { auth, db, analytics };
export default app;
