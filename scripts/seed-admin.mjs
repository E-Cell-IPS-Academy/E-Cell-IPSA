#!/usr/bin/env node
/**
 * Seed / provision an admin user in Firebase.
 *
 * Creates (or updates) a Firebase Authentication user, sets an `admin: true`
 * custom claim with a role, and writes an `admins/{uid}` document in Firestore.
 *
 * Requires the Firebase Admin SDK and a service-account key.
 *   Firebase Console → Project Settings → Service accounts → Generate new private key
 *
 * Usage:
 *   npm run seed:admin -- \
 *     --service-account ./serviceAccountKey.json \
 *     --email admin@ecell.ipsacademy.org \
 *     --password "a-strong-password" \
 *     --name "E-Cell Admin" \
 *     --role "Super Admin"
 *
 * Env var fallbacks: FIREBASE_SERVICE_ACCOUNT, SEED_ADMIN_EMAIL,
 *   SEED_ADMIN_PASSWORD, SEED_ADMIN_NAME, SEED_ADMIN_ROLE
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// ── Tiny CLI flag parser (--key value | --key=value) ────────────────────────
function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    if (key.includes("=")) {
      const [k, ...v] = key.split("=");
      args[k] = v.join("=");
    } else if (argv[i + 1] && !argv[i + 1].startsWith("--")) {
      args[key] = argv[++i];
    } else {
      args[key] = true;
    }
  }
  return args;
}

const VALID_ROLES = ["Super Admin", "Content Admin", "Event Admin"];
const PERMISSIONS_BY_ROLE = {
  "Super Admin": [
    "manage_events",
    "manage_users",
    "manage_content",
    "view_analytics",
    "manage_settings",
  ],
  "Content Admin": ["manage_content", "view_analytics"],
  "Event Admin": ["manage_events", "view_analytics"],
};

function fail(message) {
  console.error(`\n❌ ${message}\n`);
  process.exit(1);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const serviceAccountPath =
    args["service-account"] ||
    process.env.FIREBASE_SERVICE_ACCOUNT ||
    "./serviceAccountKey.json";
  const email = args.email || process.env.SEED_ADMIN_EMAIL;
  const password = args.password || process.env.SEED_ADMIN_PASSWORD;
  const name = args.name || process.env.SEED_ADMIN_NAME || "Admin";
  const role = args.role || process.env.SEED_ADMIN_ROLE || "Super Admin";

  if (!email || !password) {
    fail(
      "Missing --email and/or --password (or SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD)."
    );
  }
  if (password.length < 8) {
    fail("Password must be at least 8 characters.");
  }
  if (!VALID_ROLES.includes(role)) {
    fail(`Invalid role "${role}". Valid roles: ${VALID_ROLES.join(", ")}`);
  }

  // Load the service-account key
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(
      readFileSync(resolve(process.cwd(), serviceAccountPath), "utf8")
    );
  } catch {
    fail(
      `Could not read service-account key at "${serviceAccountPath}".\n` +
        "Generate one in Firebase Console → Project Settings → Service accounts,\n" +
        "then pass it with --service-account <path> or FIREBASE_SERVICE_ACCOUNT."
    );
  }

  // Import firebase-admin lazily so the helpful errors above run first
  let admin;
  try {
    admin = await import("firebase-admin");
  } catch {
    fail("firebase-admin is not installed. Run: npm install -D firebase-admin");
  }

  const app = admin.default.initializeApp({
    credential: admin.default.credential.cert(serviceAccount),
  });
  const auth = admin.default.auth(app);
  const db = admin.default.firestore(app);

  const permissions = PERMISSIONS_BY_ROLE[role];

  // Create or update the Auth user (idempotent)
  let user;
  try {
    user = await auth.getUserByEmail(email);
    await auth.updateUser(user.uid, { password, displayName: name });
    console.log(`↻ Updated existing user: ${email} (${user.uid})`);
  } catch (e) {
    if (e?.code === "auth/user-not-found") {
      user = await auth.createUser({
        email,
        password,
        displayName: name,
        emailVerified: true,
      });
      console.log(`＋ Created user: ${email} (${user.uid})`);
    } else {
      throw e;
    }
  }

  // Custom claims drive server-verified authorization (use in Security Rules / token checks)
  await auth.setCustomUserClaims(user.uid, { admin: true, role });

  // Firestore admin record
  await db.collection("admins").doc(user.uid).set(
    {
      uid: user.uid,
      email,
      name,
      role,
      permissions,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  console.log(`\n✅ Admin provisioned successfully`);
  console.log(`   email:       ${email}`);
  console.log(`   role:        ${role}`);
  console.log(`   permissions: ${permissions.join(", ")}`);
  console.log(`   custom claim: { admin: true, role: "${role}" }\n`);
  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ Seeding failed:", err?.message || err, "\n");
  process.exit(1);
});
