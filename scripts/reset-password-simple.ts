import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as readline from "readline";

// Load environment
config({ path: ".env" });
config({ path: ".env.local", override: true });

const prisma = new PrismaClient();

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  console.log("🔐 Simple Password Reset\n");

  // Get email
  let email = process.env.ADMIN_EMAIL;
  if (!email) {
    email = await prompt("Email: ");
  }
  email = email.toLowerCase().trim();
  console.log(`📧 Target: ${email}`);

  // Check user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, role: true, password: true },
  });

  if (!existingUser) {
    console.log("\n User not found!");
    console.log("   Creating new admin user instead...\n");
  } else {
    console.log(
      ` User exists (role: ${existingUser.role}, has password: ${!!existingUser.password})`,
    );
  }

  // Get password
  let password = process.env.ADMIN_PASSWORD;
  if (!password) {
    password = await prompt("New password (8+ chars): ");
  }

  if (password.length < 8) {
    console.error(" Password must be at least 8 characters");
    process.exit(1);
  }

  // Hash and save
  console.log("\n Hashing password...");
  const hash = await bcrypt.hash(password, 10);
  console.log(`   Hash: ${hash.substring(0, 20)}...`);

  console.log(" Saving to database...");
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hash,
      role: "admin",
    },
    create: {
      email,
      password: hash,
      role: "admin",
      name: process.env.ADMIN_NAME || "Admin",
    },
  });

  console.log("\n SUCCESS!");
  console.log(`   Email: ${user.email}`);
  console.log(`   Role: ${user.role}`);
  console.log("   Password: (the one you entered)");

  // Verify it worked
  console.log("\n🔍 Verifying password...");
  const verify = await prisma.user.findUnique({
    where: { email },
    select: { password: true },
  });

  if (verify?.password) {
    const isValid = await bcrypt.compare(password, verify.password);
    if (isValid) {
      console.log(" Password verification PASSED!");
    } else {
      console.log(" Password verification FAILED!");
    }
  }

  console.log("\n🌐 Now test login at:");
  console.log("   http://localhost:3000/login");
  console.log("   https://kollect-it.com/login");

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(" Error:", e);
  await prisma.$disconnect();
  process.exit(1);
});
