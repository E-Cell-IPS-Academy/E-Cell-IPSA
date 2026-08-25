// This project was migrated from Vite to Next.js.
//
// The Vite-era ESLint flat config that used to live here imported packages that
// are no longer dependencies (typescript-eslint, eslint-plugin-react-refresh,
// globals, eslint-config-prettier, @eslint/js), so it could no longer load.
//
// ESLint resolves `eslint.config.js` BEFORE `eslint.config.mjs`, so this file
// must not be a stale override. It now simply re-exports the canonical Next.js
// config. This file is safe to delete — once removed, ESLint will use
// `eslint.config.mjs` directly.
export { default } from "./eslint.config.mjs";
