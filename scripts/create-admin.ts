import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as readline from "readline";

// Load environment - .env first, then .env.local overrides
config({ path: ".env" });
config({ path: ".env.local", override: true });

const prisma = new PrismaClient();

async function promptInput(question: string): Promise<string> {
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
  console.log("🔐 Creating/updating admin user...\n");

  // Get email from env or prompt
  const rawEmail = process.env.ADMIN_EMAIL || await promptInput("Admin email: ");

  if (!rawEmail || !rawEmail.includes("@")) {
    console.error(" Valid email address required");
    process.exit(1);
  }

  // IMPORTANT: Normalize email to lowercase
  const email = rawEmail.toLowerCase().trim();
  console.log(`📧 Email: ${email}`);

  // Get password from env or prompt
  let password = process.env.ADMIN_PASSWORD;

  if (!password) {
    password = await promptInput("Password (8+ chars, visible): ");
    const confirm = await promptInput("Confirm password: ");

    if (password !== confirm) {
      console.error(" Passwords do not match");
      process.exit(1);
    }
  }

  if (!password || password.length < 8) {
    console.error(" Password must be at least 8 characters long");
    process.exit(1);
  }

  const name = process.env.ADMIN_NAME || "Admin";

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upsert user
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: "admin",
      },
      create: {
        email,
        password: hashedPassword,
        name,
        role: "admin",
      },
    });

    console.log("\n Admin user created/updated successfully!");
    console.log("".repeat(40));
    console.log(`📧 Email:    ${user.email}`);
    console.log(`👤 Role:     ${user.role}`);
    console.log(
      `🔐 Password: ${process.env.ADMIN_PASSWORD ? "[from env]" : password}`,
    );
    console.log("".repeat(40));
    console.log("\n🌐 Login at:");
    console.log("   Local:      http://localhost:3000/login");
    console.log("   Production: https://kollect-it.com/login\n");
  } catch (error) {
    console.error(" Error creating admin user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
