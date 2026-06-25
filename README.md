<div align="center">

# E-Cell IPS Academy

### Official website of the Entrepreneurship Cell, IPS Academy — Indore

Startup incubation · Mentorship · Events & workshops · Innovation hub

[![Live Site](https://img.shields.io/badge/Live-ecell.ipsacademy.org-8B5CF6?style=for-the-badge)](https://ecell.ipsacademy.org)
&nbsp;
![React](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

</div>

---

## Overview

This is the official web platform for **E-Cell IPS Academy**, the Entrepreneurship Cell of IPS Academy, Indore. It serves as the public face of the cell and the content-management backend that powers it — showcasing events, workshops, startups, mentorship programs, and funding opportunities, with an admin panel for managing all of it.

## Tech Stack

| Layer       | Technology                                          |
| ----------- | --------------------------------------------------- |
| Framework   | React 19 + TypeScript                               |
| Build tool  | Vite 7                                              |
| Styling     | Tailwind CSS                                        |
| Animation   | Framer Motion · GSAP · Three.js / React Three Fiber |
| Backend     | Firebase (Authentication + Cloud Firestore)         |
| Media       | Cloudinary (unsigned client-side uploads)           |
| Routing     | React Router DOM                                    |
| Icons       | lucide-react                                        |
| Data export | xlsx                                                |

## Features

- **Public site** — Home, About, Team, Alumni, Startups, Incubation, Mentorship, Funding, Workshops, Competitions, Events, Resources, Blog, FAQ, Contact, Hiring.
- **User accounts** — Firebase email/password + Google sign-in (login, signup, password reset, dashboard).
- **Admin panel** (`/admin/login`) — manage blogs, events, gallery, startups, team, hero/announcements, about content, and site settings, with Cloudinary-backed image uploads.
- **SEO-ready** — rich meta tags, Open Graph, Twitter cards, and JSON-LD structured data baked into `index.html`.

## Getting Started

### Prerequisites

- **Node.js 20.6+**
- **pnpm** (this project uses pnpm, not npm) — `npm install -g pnpm`
- A Firebase project (Authentication + Firestore enabled)
- A Cloudinary account with an **unsigned** upload preset

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Create your local environment file
cp .env.example .env
# then open .env and fill in your real values

# 3. Start the dev server
pnpm dev
```

The app runs at `http://localhost:5173`.

## Environment Variables

All client-side config is loaded from environment variables — see [`.env.example`](.env.example) for the full list and copy it to `.env`.

> ⚠️ **Important:** Every `VITE_*` variable is **inlined into the production bundle** and is publicly visible to anyone who opens the site. Only put public-safe values (Firebase web config, Cloudinary cloud name + unsigned preset) in `VITE_*` vars. **Never** put a true secret (Cloudinary API secret, database password, service-account key) in a `VITE_*` variable — those belong on a backend only.

| Variable                                      | Description                                                                           |
| --------------------------------------------- | ------------------------------------------------------------------------------------- |
| `VITE_FIREBASE_*`                             | Firebase web app config (public by design — secure data via Firestore Security Rules) |
| `VITE_CLOUDINARY_CLOUD_NAME`                  | Cloudinary cloud name                                                                 |
| `VITE_CLOUDINARY_UPLOAD_PRESET`               | Cloudinary **unsigned** upload preset                                                 |
| `VITE_ADMIN_USERNAME` / `VITE_ADMIN_PASSWORD` | Admin-panel login (see security note below)                                           |

## Scripts

| Command             | Description                                     |
| ------------------- | ----------------------------------------------- |
| `pnpm dev`          | Start the Vite dev server                       |
| `pnpm build`        | Type-check and build for production (`dist/`)   |
| `pnpm preview`      | Preview the production build locally            |
| `pnpm lint`         | Run ESLint                                      |
| `pnpm lint:fix`     | Run ESLint with autofix                         |
| `pnpm format`       | Format the codebase with Prettier               |
| `pnpm format:check` | Check formatting without writing                |
| `pnpm test:e2e`     | Run Playwright end-to-end tests                 |
| `pnpm seed:admin`   | Provision an admin user in Firebase (see below) |

### Code quality & git hooks

- **Prettier** formats the code; **ESLint** lints it.
- **Husky** runs a **pre-commit** hook (via **lint-staged**) that auto-formats and lint-fixes staged files, and a **commit-msg** hook that enforces [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, …).
- **Playwright** drives end-to-end smoke tests in `e2e/`.

## Seeding an Admin

`pnpm seed:admin` provisions an administrator in **Firebase Authentication** (creates the user, sets an `admin: true` custom claim, and writes an `admins/{uid}` document in Firestore). It uses the Firebase **Admin SDK**, so it requires a **service-account key**.

```bash
# 1. In the Firebase Console:
#    Project Settings → Service accounts → Generate new private key
#    Save the JSON file (it is gitignored — never commit it).

# 2. Run the seeder (flags or env vars):
pnpm seed:admin -- \
  --service-account ./serviceAccountKey.json \
  --email admin@ecell.ipsacademy.org \
  --password "a-strong-password" \
  --name "E-Cell Admin" \
  --role "Super Admin"
```

You can also set `FIREBASE_SERVICE_ACCOUNT`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_ADMIN_NAME`, and `SEED_ADMIN_ROLE` in the environment instead of passing flags. The script is idempotent — re-running it updates the existing user.

> The current `/admin/login` page performs a client-side credential check (`VITE_ADMIN_*`), which is **not real security** — the values ship in the browser bundle. The seeder lays the groundwork for proper server-verified admin auth; migrating `AdminLogin` to Firebase Auth + custom claims is the recommended next step.

## Project Structure

```
src/
├── components/      # Reusable UI, sections, illustrations
├── context/         # React context (AuthContext)
├── firebase/        # Firebase initialization (config.ts)
├── pages/           # Route pages
│   └── admin/       # Admin management pages
├── services/        # Auth and data services
├── types/           # Shared TypeScript types
└── main.tsx         # App entry
scripts/
└── seed-admin.mjs   # Firebase admin seeder
```

## Deployment

`pnpm build` outputs static assets to `dist/`. Deploy to any static host (Vercel, Netlify, Firebase Hosting, etc.). **Set every `VITE_*` variable in your host's environment settings** — they are read at build time, so a build without them will ship empty config.

## Security Notes

- Secrets must never be committed. `.env` is gitignored; only `.env.example` (placeholders) is tracked.
- Service-account keys (`serviceAccountKey.json`, `*service-account*.json`) are gitignored.
- Protect your Firestore data with **Security Rules** — the Firebase web API key is not a secret and does not protect your database on its own.

## License

© E-Cell IPS Academy. All rights reserved.
