#!/usr/bin/env node
// Simple environment check for Kollect-It

// Load .env/.env.local (Bun will also load dotenvx, this is just a backup)
try {
  require("dotenv").config();
} catch {
  // If dotenv isn't installed, it's fine – env may already be loaded
}

const REQUIRED_VARS = [
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "DATABASE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error("\n❌ Missing required environment variables:\n");
  for (const key of missing) {
    console.error(`  - ${key}`);
  }
  console.error(
    "\nUpdate your .env.local file and try again.\n" +
      "Hint: check the DEPO-PRO / Kollect-It env docs we wrote."
  );
  process.exit(1);
}

console.log("✅ Environment check passed – all required env vars are set.");
process.exit(0);
