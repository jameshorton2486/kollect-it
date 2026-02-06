import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });

import { prisma } from "../src/lib/prisma";

const TARGET_EMAIL = "info@kollect-it.com";

async function main() {
  console.log("🔍 User audit (all users in database)\n");
  console.log("=".repeat(60));

  const users = await prisma.user.findMany({
    orderBy: { email: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      password: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  console.log(`\nTotal users: ${users.length}\n`);

  let targetFound = false;
  for (const u of users) {
    const isTarget = u.email.toLowerCase() === TARGET_EMAIL.toLowerCase();
    if (isTarget) targetFound = true;

    const hasPassword = !!u.password;
    const passwordPreview = u.password
      ? `${u.password.substring(0, 7)}... (${u.password.length} chars)`
      : "NULL";
    const validBcrypt = hasPassword && /^\$2[aby]?\$/.test(u.password!);
    const emailLower = u.email === u.email.toLowerCase();

    console.log(`Email:     ${u.email}`);
    console.log(`  ID:       ${u.id}`);
    console.log(`  Name:     ${u.name ?? "(none)"}`);
    console.log(`  Role:     ${u.role}`);
    console.log(`  Password: ${passwordPreview} ${hasPassword ? (validBcrypt ? "✅" : "⚠️ not bcrypt?") : "❌ MISSING"}`);
    console.log(`  Email lowercase: ${emailLower ? "✅" : "❌ (case mismatch risk)"}`);
    console.log(`  Email verified:  ${u.emailVerified ?? "no"}`);
    console.log(`  Created:  ${u.createdAt.toISOString()}`);
    if (isTarget) {
      console.log(`  >>> TARGET USER (${TARGET_EMAIL}) <<<`);
    }
    console.log("");
  }

  console.log("=".repeat(60));
  if (!targetFound) {
    console.log(`\n❌ ${TARGET_EMAIL} was NOT FOUND in the database.`);
    console.log("   Run: $env:ADMIN_EMAIL=\"info@kollect-it.com\"; npx tsx scripts/create-admin.ts");
  } else {
    console.log(`\n✅ ${TARGET_EMAIL} was found. Check password and email case above.`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
