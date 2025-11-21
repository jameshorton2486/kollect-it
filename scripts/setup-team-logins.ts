import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const users = [
  { email: "admin@kollect-it.com", password: "KollectIt@2025Admin", name: "Admin User" },
  { email: "James@kollect-it.com", password: "James@KI-2025", name: "James Horton" },
  { email: "billing@kollect-it.com", password: "billing@KI-2025", name: "Billing Dept" },
  { email: "info@kollect-it.com", password: "info@KI-2025", name: "Info" },
  { email: "support@kollect-it.com", password: "support@KI-2025", name: "Support" },
  { email: "jameshorton2486@gmail.com", password: "james@KI-2025", name: "James Personal" },
];

async function main() {
  console.log("🔐 Setting up team logins...");

  for (const user of users) {
    // Normalize email to lowercase to avoid case-sensitivity issues
    const normalizedEmail = user.email.toLowerCase();
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    const upsertedUser = await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: {
        password: hashedPassword,
        role: "admin", // Granting admin access to all these team accounts
        name: user.name,
      },
      create: {
        email: normalizedEmail,
        password: hashedPassword,
        name: user.name,
        role: "admin",
      },
    });
    
    console.log(`✅ Configured: ${upsertedUser.email}`);
  }
  
  console.log("🎉 All accounts set up successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
