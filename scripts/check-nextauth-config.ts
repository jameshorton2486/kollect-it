import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
const DATABASE_URL = process.env.DATABASE_URL;

const PRODUCTION_URL = "https://kollect-it.com";

function main() {
  console.log("🔐 NextAuth configuration check\n");
  console.log("=".repeat(50));

  let hasError = false;
  let hasWarn = false;

  // NEXTAUTH_SECRET
  if (!NEXTAUTH_SECRET) {
    console.log("❌ NEXTAUTH_SECRET: not set");
    hasError = true;
  } else if (NEXTAUTH_SECRET.length < 32) {
    console.log("❌ NEXTAUTH_SECRET: must be at least 32 characters (current:", NEXTAUTH_SECRET.length, ")");
    hasError = true;
  } else {
    console.log("✅ NEXTAUTH_SECRET: set (length", NEXTAUTH_SECRET.length, ")");
  }

  // NEXTAUTH_URL
  const nextAuthUrl = NEXTAUTH_URL?.trim() ?? "";
  if (!nextAuthUrl) {
    console.log("⚠️  NEXTAUTH_URL: not set (should be", PRODUCTION_URL, "for production)");
    hasWarn = true;
  } else if (nextAuthUrl !== PRODUCTION_URL && nextAuthUrl.includes("kollect-it")) {
    console.log("⚠️  NEXTAUTH_URL:", JSON.stringify(nextAuthUrl), "(expected", PRODUCTION_URL + ")");
    hasWarn = true;
  } else {
    console.log("✅ NEXTAUTH_URL:", nextAuthUrl);
  }

  // DATABASE_URL
  if (!DATABASE_URL || DATABASE_URL.trim() === "") {
    console.log("❌ DATABASE_URL: not set");
    hasError = true;
  } else {
    console.log("✅ DATABASE_URL: present");
  }

  console.log("=".repeat(50));
  if (hasError) {
    console.log("\nFix any ❌ items above. See docs/LOGIN-TROUBLESHOOTING.md");
    process.exit(1);
  }
  if (hasWarn) {
    console.log("\nReview ⚠️  items for production.");
  }
  console.log("\n✅ NextAuth config OK for login.\n");
}

main();
