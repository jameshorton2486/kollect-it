import { config } from "dotenv";
import { resolve } from "path";
import * as readline from "readline";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });

import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer: string) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  const email = (process.env.TEST_EMAIL || "").trim().toLowerCase();
  if (!email) {
    console.error("Set TEST_EMAIL (e.g. $env:TEST_EMAIL=\"info@kollect-it.com\") or run with prompt.");
    process.exit(1);
  }

  console.log("🔐 Verify password for:", email, "\n");

  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });

  if (!user) {
    console.log("❌ USER NOT FOUND. No user with that email.");
    await prisma.$disconnect();
    process.exit(1);
  }

  if (!user.password) {
    console.log("❌ User has no password set. Run create-admin.ts to set one.");
    await prisma.$disconnect();
    process.exit(1);
  }

  const password = await prompt("Enter password: ");
  if (!password) {
    console.log("❌ No password entered.");
    await prisma.$disconnect();
    process.exit(1);
  }

  const valid = await bcrypt.compare(password, user.password);
  await prisma.$disconnect();

  if (valid) {
    console.log("\n✅ PASSWORD IS CORRECT\n");
  } else {
    console.log("\n❌ PASSWORD IS INCORRECT\n");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
