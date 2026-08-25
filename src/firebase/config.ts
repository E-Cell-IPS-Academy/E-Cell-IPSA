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
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
}

// Your web app's Firebase configuration (loaded from environment variables)
const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Fail loudly if env vars weren't baked into the build. NEXT_PUBLIC_* variables
// are inlined at BUILD time — adding them in Vercel does nothing until you
// REDEPLOY.
if (!firebaseConfig.apiKey) {
  console.error(
    "[firebase] Missing NEXT_PUBLIC_FIREBASE_* env vars. Add them in your " +
      "host (Vercel → Settings → Environment Variables) and then REDEPLOY — " +
      "Next.js inlines env at build time, so existing builds won't pick them up."
  );
}

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
// Analytics touches window/indexedDB and must never run during SSR/build.
const analytics: Analytics | null =
  typeof window !== "undefined" ? getAnalytics(app) : null;
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { auth, db, analytics };
export default app;
