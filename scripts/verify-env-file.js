#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

console.log("\n📋 ENV.LOCAL FILE VERIFICATION\n");
console.log("=========================================\n");

const envPath = path.join(__dirname, "..", ".env.local");
const content = fs.readFileSync(envPath, "utf-8");
const lines = content.split("\n").filter(line => line.trim() && !line.startsWith("#"));

const critical = [
  "DATABASE_URL",
  "DIRECT_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY",
  "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
  "IMAGEKIT_PRIVATE_KEY",
  "ANTHROPIC_API_KEY",
  "OPENAI_API_KEY",
  "EMAIL_HOST",
  "EMAIL_PORT",
  "EMAIL_USER",
  "EMAIL_PASSWORD",
  "EMAIL_FROM",
  "ADMIN_EMAIL",
];

const optional = [
  "STRIPE_WEBHOOK_SECRET",
  "SUPABASE_SERVICE_ROLE_KEY",
];

let passed = 0;
let failed = 0;
let warnings = 0;

for (const key of critical) {
  const found = lines.some(line => line.startsWith(`${key}=`));
  if (found) {
    console.log(`✅ ${key}`);
    passed++;
  } else {
    console.log(`❌ ${key} (MISSING - CRITICAL)`);
    failed++;
  }
}

console.log("\n--- Optional Variables ---\n");

for (const key of optional) {
  const found = lines.some(line => line.startsWith(`${key}=`));
  if (found) {
    const line = lines.find(line => line.startsWith(`${key}=`));
    if (key === "STRIPE_WEBHOOK_SECRET" && line.includes("placeholder")) {
      console.log(`⚠️  ${key} (PLACEHOLDER - needs real webhook secret)`);
      warnings++;
    } else {
      console.log(`✅ ${key}`);
      passed++;
    }
  } else {
    console.log(`⚠️  ${key} (not set)`);
  }
}

console.log("\n=========================================\n");
console.log(`✅ Present: ${passed}`);
console.log(`❌ Missing: ${failed}`);
console.log(`⚠️  Warnings: ${warnings}\n`);

if (failed === 0) {
  console.log("🟢 ALL CRITICAL VARIABLES PRESENT!\n");
  if (warnings > 0) {
    console.log("⚠️  Action: Update placeholder values before deployment\n");
  }
} else {
  console.log(`🔴 ${failed} CRITICAL VARIABLES MISSING\n`);
}
