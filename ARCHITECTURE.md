# Architecture

This project uses a **feature-based, layered architecture**. The goal is small, focused files that are easy for new contributors to read, test, and extend — instead of 1,000+ line page components.

> **Worked example:** `src/features/events` is the reference implementation. When in doubt, copy its structure.

## The big picture

```
src/
├── app entry          main.tsx, App.tsx (routing)
├── features/          self-contained product areas (events, blog, …)
│   └── <feature>/
│       ├── types.ts            domain types + constants for the feature
│       ├── <feature>Service.ts data layer — Firestore reads/writes only
│       ├── hooks/              React state + orchestration (use<Feature>)
│       ├── components/         feature-specific UI (cards, forms, details)
│       ├── <Feature>AdminPage.tsx  the page that composes the above
│       └── index.ts            public API (barrel) for the feature
├── shared/            cross-cutting, feature-agnostic building blocks
│   ├── ui/            design system: Button, Card, Input, Modal, Table, …
│   ├── hooks/         useCollection, useCloudinaryUpload, …
│   ├── feedback/      ToastProvider / useToast
│   └── lib/           tiny utilities (cn, …)
├── components/admin/  admin shell: AdminLayout, PageHeader, ImageUploader
├── firebase/          Firebase initialization (config.ts)
└── pages/             route entry points (thin — delegate to features)
```

## Layering rules

Dependencies point **downward** only:

```
page  →  hooks  →  service  →  firebase
  ↓
shared/ui, shared/feedback   (presentational only)
```

- **`types.ts`** — interfaces, unions, constants, and an `EMPTY_*` default. No logic.
- **Service** (`<feature>Service.ts`) — the only place that talks to Firestore for this feature. Pure async functions (`listX`, `createX`, `updateX`, `deleteX`). No React, no UI.
- **Hook** (`use<Feature>`) — owns state, calls the service, exposes operations. Operations **throw** on error so the page decides how to surface them. No JSX.
- **Components** — presentational. Receive data + callbacks via props. Build them from `@/shared/ui`, never raw styled `<div>`s when a primitive exists.
- **Page** (`<Feature>AdminPage.tsx`) — wires the hook + components together, handles modals/filters, and shows feedback with `useToast()`.

## Imports & the `@` alias

Use the `@` alias for cross-area imports (configured in `vite.config.ts` + `tsconfig.app.json`):

```ts
import { Button, Card, Modal } from "@/shared/ui";
import { useToast } from "@/shared/feedback";
import { db } from "@/firebase/config";
```

Use relative imports **within** a feature (`./types`, `./hooks/useEvents`).

## The shared UI kit

A small, subtle, professional design system (slate neutrals + a single indigo accent). Prefer these over bespoke markup:

| Component                                    | Purpose                                                                             |
| -------------------------------------------- | ----------------------------------------------------------------------------------- |
| `Button`                                     | actions — `variant` (primary/secondary/outline/ghost/danger), `loading`, `leftIcon` |
| `Card` (+ `CardHeader/Title/Content/Footer`) | surfaces                                                                            |
| `Input` / `Textarea` / `Select`              | labeled, accessible form controls with `error`/`hint`                               |
| `Modal`                                      | portal dialog (Esc / backdrop close)                                                |
| `ConfirmDialog`                              | destructive-action confirmation                                                     |
| `Table` (+ `THead/TBody/TR/TH/TD`)           | data tables                                                                         |
| `Badge`                                      | status pills — `tone` (neutral/success/warning/danger/info)                         |
| `EmptyState`                                 | empty lists                                                                         |
| `Spinner`                                    | loading                                                                             |

Shared hooks: `useCollection<T>(path, …constraints)` (leak-safe real-time Firestore subscription) and `useCloudinaryUpload()` (the single, secret-free unsigned upload path). For image fields use `<ImageUploader>` from `@/components/admin`.

## Admin theme (subtle, not flashy)

The public site is dark/animated; the **admin** is intentionally calm and utilitarian:

- Background `bg-slate-50`, surfaces `bg-white` with `border-slate-200`, `shadow-sm`.
- Text `text-slate-900 / 600 / 400`. Accent `indigo-600`. Danger `red-600`.
- Rounded `rounded-lg/xl`, generous spacing, minimal motion. No gradients or glassmorphism.

## Migrating an old admin page (checklist)

Using `src/features/events` as the template, for each remaining page (`AdminBlogsComplete`, `AdminStartupsComplete`, `AdminGalleryComplete`, `AdminTeamManagement`, `AdminUsersComplete`, …):

1. Create `src/features/<feature>/`.
2. Move domain types + constants into `types.ts` (add an `EMPTY_*` default).
3. Extract all Firestore calls into `<feature>Service.ts` (delete the inline `XService`/`CloudinaryService` classes — uploads now go through `useCloudinaryUpload` / `<ImageUploader>`).
4. Put state + operations in `hooks/use<Feature>.ts`.
5. Split the UI into `components/` (list/card, form, details) using `@/shared/ui`.
6. Compose them in `<Feature>AdminPage.tsx` with `PageHeader`, `useToast`, and `ConfirmDialog`.
7. Re-export from `index.ts`, then make `src/pages/admin/Admin<X>.tsx` a one-line re-export so routing keeps working.
8. `pnpm build && pnpm lint` must pass, then commit (`refactor(<feature>): …`).

## Conventions

- **File size:** if a file passes ~200 lines, look for a component or hook to extract.
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) — enforced by commitlint (`feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`).
- **Formatting/linting:** Prettier + ESLint run automatically on commit (Husky + lint-staged). Don't hand-format.
- **Tooling:** pnpm for everything (`pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm format`, `pnpm test:e2e`). See the [README](README.md).

## Migration status

- ✅ Shared UI kit, hooks, admin shell, `@` alias
- ✅ `events` — fully migrated (reference)
- ⏳ `blogs`, `startups`, `gallery`, `team`, `users`, `hero`, `about`, `contact`, `settings` — follow the checklist above
