/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Firebase web config (safe to expose in client bundles — secured via Firebase Security Rules)
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;

  // Cloudinary — client-side unsigned uploads only (cloud name + unsigned preset are public by design)
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
  readonly VITE_CLOUDINARY_UPLOAD_PRESET: string;

  // Admin login (NOTE: client-side check only — not real security; see .env.example)
  readonly VITE_ADMIN_USERNAME: string;
  readonly VITE_ADMIN_PASSWORD: string;

  // Certificate mailer backend (see /certificate-mailer-backend). Optional —
  // omit to use a same-origin /api/send-certificate-emails instead.
  readonly VITE_CERT_MAILER_URL?: string;
  readonly VITE_CERT_MAIL_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
