#!/usr/bin/env bun
/**
 * Verify NextAuth environment and (optionally) that the auth API responds.
 *
 * This project uses DATABASE auth: users and passwords are in the User table.
 * You do NOT need ADMIN_EMAIL or ADMIN_PASSWORD_HASH in env.
 *
 * Required: NEXTAUTH_SECRET (32+ chars), DATABASE_URL.
 * Recommended: NEXTAUTH_URL (http://localhost:3000 local, https://your-domain.com production).
 *
 * Run: bun run scripts/verify-auth-env.ts
 * Or:  node --import tsx scripts/verify-auth-env.ts
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load .env then .env.local (same as Next.js)
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local") });

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  console.log("🔐 NextAuth env verification\n");

  let ok = true;

  // NEXTAUTH_SECRET (required)
  if (!NEXTAUTH_SECRET || NEXTAUTH_SECRET.length < 32) {
    console.log("❌ NEXTAUTH_SECRET: missing or shorter than 32 characters");
    ok = false;
  } else {
    console.log("✅ NEXTAUTH_SECRET: set (length >= 32)");
  }

  // NEXTAUTH_URL (recommended)
  if (!NEXTAUTH_URL) {
    console.log("⚠️  NEXTAUTH_URL: not set (OK for local; set in production to your site URL)");
  } else if (!NEXTAUTH_URL.startsWith("http")) {
    console.log("❌ NEXTAUTH_URL: should be a full URL (e.g. http://localhost:3000 or https://kollect-it.com)");
    ok = false;
  } else {
    console.log("✅ NEXTAUTH_URL:", NEXTAUTH_URL);
  }

  // DATABASE_URL (required for credentials auth)
  if (!DATABASE_URL) {
    console.log("❌ DATABASE_URL: missing (required for login)");
    ok = false;
  } else {
    console.log("✅ DATABASE_URL: set");
  }

  if (!ok) {
    console.log("\nAdd the missing vars to .env or .env.local, then run this script again.");
    process.exit(1);
  }

  // Optional: ping auth API if local
  const base = NEXTAUTH_URL || "http://localhost:3000";
  if (base.startsWith("http://localhost") || base.startsWith("http://127.0.0.1")) {
    try {
      const res = await fetch(`${base}/api/auth/providers`, { method: "GET" });
      if (res.ok) {
        const data = (await res.json()) as Record<string, unknown>;
        console.log("\n✅ Auth API responded: /api/auth/providers OK");
        if (data && typeof data === "object" && Object.keys(data).length > 0) {
          console.log("   Providers:", Object.keys(data).join(", "));
        }
      } else {
        console.log("\n⚠️  Auth API returned", res.status, "- is the dev server running? (bun run dev)");
      }
    } catch (e) {
      console.log("\n⚠️  Could not reach auth API (is dev server running? bun run dev)");
    }
  } else {
    console.log("\n(Skip API ping for non-local NEXTAUTH_URL)");
  }

  console.log("\n---");
  console.log("Auth uses the database (User table). To fix login:");
  console.log("  1. Ensure the user exists and has a password: node reset-my-pw.js");
  console.log("  2. Use the same DATABASE_URL as the app (local vs production).");
  console.log("  3. Test: open", NEXTAUTH_URL || "http://localhost:3000", "/login and sign in.");
  console.log("---\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
