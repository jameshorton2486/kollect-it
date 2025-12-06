import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const credentialsToTest = [
  { email: "admin@kollect-it.com", password: "KollectIt@2025Admin" },
  { email: "James@kollect-it.com", password: "James@KI-2025" },
  { email: "billing@kollect-it.com", password: "billing@KI-2025" },
  { email: "info@kollect-it.com", password: "info@KI-2025" },
  { email: "support@kollect-it.com", password: "support@KI-2025" },
  { email: "jameshorton2486@gmail.com", password: "james@KI-2025" },
];

async function main() {
  console.log("🔍 Testing credentials against database...");
  
  for (const cred of credentialsToTest) {
    const normalizedEmail = cred.email.toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      console.log(`❌ ${cred.email}: User NOT FOUND in database`);
      continue;
    }

    if (!user.password) {
      console.log(`❌ ${cred.email}: User has NO PASSWORD set`);
      continue;
    }

    const isValid = await bcrypt.compare(cred.password, user.password);
    
    if (isValid) {
      console.log(`✅ ${cred.email}: Password CORRECT`);
    } else {
      console.log(`❌ ${cred.email}: Password INCORRECT`);
      // Debug info
      console.log(`   Input: ${cred.password}`);
      console.log(`   Hash:  ${user.password.substring(0, 20)}...`);
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
