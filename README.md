<div align="center">

# E-Cell IPS Academy

### Official website of the Entrepreneurship Cell, IPS Academy — Indore

Startup incubation · Mentorship · Events & workshops · Innovation hub

[![Live Site](https://img.shields.io/badge/Live-ecell.ipsacademy.org-8B5CF6?style=for-the-badge)](https://ecell.ipsacademy.org)
&nbsp;
![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

</div>

---

## Overview

This is the official web platform for **E-Cell IPS Academy**, the Entrepreneurship Cell of IPS Academy, Indore. It serves as the public face of the cell and the content-management backend that powers it — showcasing events, workshops, startups, mentorship programs, and funding opportunities, with an admin panel for managing all of it.

## Tech Stack

| Layer       | Technology                                          |
| ----------- | --------------------------------------------------- |
| Framework   | Next.js 15 (App Router) + React 19 + TypeScript     |
| Styling     | Tailwind CSS v4                                      |
| Animation   | Framer Motion · GSAP · Three.js / React Three Fiber |
| Backend     | Firebase (Authentication + Cloud Firestore)         |
| Email       | Next.js Route Handler + nodemailer                  |
| Media       | Cloudinary (unsigned client-side uploads)           |
| Routing     | Next.js App Router (`src/app`)                      |
| Icons       | lucide-react                                        |
| Data export | xlsx                                                |

## Features

- **Public site** — Home, About, Team, Alumni, Startups, Incubation, Mentorship, Funding, Workshops, Competitions, Events, Resources, Blog, FAQ, Contact, Hiring.
- **User accounts** — Firebase email/password + Google sign-in (login, signup, password reset, dashboard).
- **Admin panel** (`/admin/login`) — manage blogs, events, gallery, startups, team, hero/announcements, about content, and site settings, with Cloudinary-backed image uploads.
- **Certificate mailer** — a server-side API route (`/api/send-certificate-emails`) emails issued certificates via nodemailer; SMTP credentials stay on the server.
- **SEO-ready** — rich meta tags, Open Graph, Twitter cards, and JSON-LD structured data via the Next.js Metadata API in `src/app/layout.tsx`.

## Getting Started

### Prerequisites

- **Node.js 20.9+**
- **npm** (a `package-lock.json` is committed; the project standardizes on npm)
- A Firebase project (Authentication + Firestore enabled)
- A Cloudinary account with an **unsigned** upload preset

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your local environment file
cp .env.example .env.local
# then open .env.local and fill in your real values

# 3. Start the dev server
npm run dev
```

The app runs at `http://localhost:3000`.

## Environment Variables

All config is loaded from environment variables — see [`.env.example`](.env.example) for the full list and copy it to `.env.local`.

> ⚠️ **Important:** Every `NEXT_PUBLIC_*` variable is **inlined into the production bundle** and is publicly visible to anyone who opens the site. Only put public-safe values (Firebase web config, Cloudinary cloud name + unsigned preset) in `NEXT_PUBLIC_*` vars. **Never** put a true secret (Cloudinary API secret, SMTP password, service-account key) in a `NEXT_PUBLIC_` variable — those belong on the server only.

### Client (`NEXT_PUBLIC_*` — safe to expose)

| Variable                                                    | Description                                                                           |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_FIREBASE_*`                                    | Firebase web app config (public by design — secure data via Firestore Security Rules) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`                         | Cloudinary cloud name                                                                 |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`                      | Cloudinary **unsigned** upload preset                                                 |
| `NEXT_PUBLIC_CERT_MAILER_URL`                               | Certificate mailer endpoint (defaults to `/api/send-certificate-emails`)              |
| `NEXT_PUBLIC_CERT_MAIL_API_KEY`                             | Shared key sent to the mailer route (must equal server `ADMIN_API_KEY`)               |
| `NEXT_PUBLIC_ADMIN_USERNAME` / `NEXT_PUBLIC_ADMIN_PASSWORD` | Admin-panel login (see security note below)                                           |

### Server-side only (never bundled into the client)

| Variable                                    | Description                                                        |
| ------------------------------------------- | ------------------------------------------------------------------ |
| `SMTP_USER` / `SMTP_PASS`                   | Mailbox + app password used by the certificate mailer route        |
| `SMTP_SERVICE` / `SMTP_HOST` / `SMTP_PORT`  | Optional transport overrides (defaults to Gmail SMTP on port 465)  |
| `SMTP_FROM`                                 | Optional From address (defaults to `SMTP_USER`)                    |
| `ADMIN_API_KEY`                             | Optional shared secret guarding the mailer route                   |
| `CORS_ORIGIN`                               | Optional; only needed for cross-origin calls to the mailer route   |
| `FIREBASE_SERVICE_ACCOUNT` + `SEED_ADMIN_*` | Used only by `npm run seed:admin` (see below)                      |

## Scripts

| Command               | Description                                       |
| --------------------- | ------------------------------------------------- |
| `npm run dev`         | Start the Next.js dev server (`localhost:3000`)   |
| `npm run build`       | Production build (`next build`, output in `.next`) |
| `npm run start`       | Serve the production build (`next start`)         |
| `npm run lint`        | Run ESLint                                        |
| `npm run lint:fix`    | Run ESLint with autofix                           |
| `npm run format`      | Format the codebase with Prettier                 |
| `npm run format:check`| Check formatting without writing                  |
| `npm run test:e2e`    | Run Playwright end-to-end tests                   |
| `npm run seed:admin`  | Provision an admin user in Firebase (see below)   |

### Code quality

- **Prettier** formats the code; **ESLint** (`eslint-config-next`) lints it. Linting is run separately from the build (`next.config.ts` sets `eslint.ignoreDuringBuilds: true`).
- **Playwright** drives end-to-end smoke tests in `e2e/`.

## Seeding an Admin

`npm run seed:admin` provisions an administrator in **Firebase Authentication** (creates the user, sets an `admin: true` custom claim, and writes an `admins/{uid}` document in Firestore). It uses the Firebase **Admin SDK**, so it requires a **service-account key**.

```bash
# 1. In the Firebase Console:
#    Project Settings → Service accounts → Generate new private key
#    Save the JSON file (it is gitignored — never commit it).

# 2. Run the seeder (flags or env vars):
npm run seed:admin -- \
  --service-account ./serviceAccountKey.json \
  --email admin@ecell.ipsacademy.org \
  --password "a-strong-password" \
  --name "E-Cell Admin" \
  --role "Super Admin"
```

You can also set `FIREBASE_SERVICE_ACCOUNT`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_ADMIN_NAME`, and `SEED_ADMIN_ROLE` in the environment instead of passing flags. The script is idempotent — re-running it updates the existing user.

> The current `/admin/login` page performs a client-side credential check (`NEXT_PUBLIC_ADMIN_*`), which is **not real security** — the values ship in the browser bundle. The seeder lays the groundwork for proper server-verified admin auth; migrating `AdminLogin` to Firebase Auth + custom claims is the recommended next step.

## Project Structure

```
src/
├── app/             # Next.js App Router — routes, layouts, API route handlers
│   ├── (public)/    #   public route group (home, about, blog, events, …) + layout
│   ├── admin/       #   admin login + (protected) dashboard routes
│   ├── api/         #   route handlers (send-certificate-emails)
│   ├── layout.tsx   #   root layout (metadata, providers, analytics)
│   └── providers.tsx#   client providers (Auth, Toasts, …)
├── screens/         # Page-level components rendered by the App Router routes
├── features/        # Self-contained feature modules (certificates, …)
├── shared/          # Cross-cutting building blocks (ui, hooks, feedback, lib)
├── components/      # Shared components (core: Navbar/Footer/Loader; admin shell)
├── context/         # React context (AuthContext)
├── hooks/           # Reusable hooks (useAdminAuth)
├── firebase/        # Firebase initialization (config.ts)
├── services/        # Auth and data services
└── types/           # Shared TypeScript types
scripts/
└── seed-admin.mjs   # Firebase admin seeder
```

## Deployment

The app is designed for **Vercel** (zero-config Next.js). Push to your connected Git repository, or deploy with the Vercel CLI. `next build` produces the `.next` output; Vercel builds and serves it automatically.

**Set every environment variable in your host's project settings** (Vercel → Project → Settings → Environment Variables). `NEXT_PUBLIC_*` vars are inlined at build time, so add them before building; server-side vars (SMTP, `ADMIN_API_KEY`, seed vars) are read at request time by the API route.

> This repo standardizes on **npm**. `vercel.json` pins the install command to `npm install`, and a `package-lock.json` is committed. If you prefer a different package manager, update `vercel.json` and commit the matching lockfile.

## Security Notes

- Secrets must never be committed. `.env.local` (and all `.env*` except `.env.example`) is gitignored; only `.env.example` (placeholders) is tracked.
- Service-account keys (`serviceAccountKey.json`, `*service-account*.json`) are gitignored.
- SMTP credentials and `ADMIN_API_KEY` are **server-side only** — they are used by the `/api/send-certificate-emails` route and are never exposed to the browser.
- Protect your Firestore data with **Security Rules** — the Firebase web API key is not a secret and does not protect your database on its own.

## License

© E-Cell IPS Academy. All rights reserved.
