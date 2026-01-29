const path = require("path");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

// Load same env as Next.js so we use the same DATABASE_URL (local: .env + .env.local)
require("dotenv").config();
require("dotenv").config({ path: path.join(process.cwd(), ".env.local") });

const EMAIL = process.env.RESET_PW_EMAIL || process.env.ADMIN_EMAIL || "";
const NEW_PASSWORD = process.env.RESET_PW_PASSWORD || process.env.ADMIN_PASSWORD || "";

async function main() {
  if (!EMAIL || !NEW_PASSWORD) {
    console.error("ERROR: Set RESET_PW_EMAIL and RESET_PW_PASSWORD (or ADMIN_EMAIL and ADMIN_PASSWORD) in env.");
    console.error("Example: RESET_PW_EMAIL=you@example.com RESET_PW_PASSWORD=YourPass node reset-my-pw.js");
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error("ERROR: DATABASE_URL is not set. Add it to .env or .env.local in the repo root.");
    process.exit(1);
  }

  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
  } catch (e) {
    console.error("ERROR: Could not connect to database.", e.message);
    process.exit(1);
  }

  const hash = await bcrypt.hash(NEW_PASSWORD, 12);
  const user = await prisma.user.update({
    where: { email: EMAIL },
    data: { password: hash },
  }).catch((e) => {
    if (e.code === "P2025") {
      console.error("ERROR: No user found with email:", EMAIL);
      process.exit(1);
    }
    throw e;
  });

  const ok = await bcrypt.compare(NEW_PASSWORD, user.password);
  if (!ok) {
    console.error("ERROR: Password verification failed after update.");
    process.exit(1);
  }

  console.log("Password set to:", NEW_PASSWORD);
  console.log("Updated user:", user.email);
  console.log("");
  console.log("Log in with this EXACT email:", EMAIL);
  console.log("If you use the app at localhost, this script used your local DB.");
  console.log("If you use the app on Vercel, this only changed your LOCAL DB — run this script with DATABASE_URL from Vercel to fix production login.");
  await prisma.$disconnect();
}

main();
