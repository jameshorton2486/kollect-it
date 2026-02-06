import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * TEST SCRIPT: Tests login credentials against database
 *
 * SECURITY NOTE: This script tests credentials from environment variables only
 * Passwords are NOT hardcoded - they must be provided via env vars
 *
 * Required environment variables:
 * - ADMIN_PASSWORD
 * - JAMES_PASSWORD
 * - BILLING_PASSWORD
 * - INFO_PASSWORD
 * - SUPPORT_PASSWORD
 * - JAMES_PERSONAL_PASSWORD (for info@kollect-it.com)
 */

const getCredentialsToTest = () => {
  const passwords = {
    ADMIN: process.env.ADMIN_PASSWORD,
    JAMES: process.env.JAMES_PASSWORD,
    BILLING: process.env.BILLING_PASSWORD,
    INFO: process.env.INFO_PASSWORD,
    SUPPORT: process.env.SUPPORT_PASSWORD,
    JAMES_PERSONAL: process.env.JAMES_PERSONAL_PASSWORD,
  };

  // For testing, we allow partial credentials - just warn if missing
  const warnings: string[] = [];
  Object.entries(passwords).forEach(([key, value]) => {
    if (!value) {
      const envVarName = key === "JAMES_PERSONAL" ? "JAMES_PERSONAL_PASSWORD" : `${key}_PASSWORD`;
      warnings.push(`   - ${envVarName}`);
    }
  });

  if (warnings.length > 0) {
    console.warn("⚠️  WARNING: Some password environment variables are not set:");
    warnings.forEach(w => console.warn(w));
    console.warn("   Credentials with missing passwords will be skipped.\n");
  }

  const credentials = [];
  if (passwords.ADMIN) credentials.push({ email: "admin@kollect-it.com", password: passwords.ADMIN });
  if (passwords.JAMES) credentials.push({ email: "James@kollect-it.com", password: passwords.JAMES });
  if (passwords.BILLING) credentials.push({ email: "billing@kollect-it.com", password: passwords.BILLING });
  if (passwords.INFO) credentials.push({ email: "info@kollect-it.com", password: passwords.INFO });
  if (passwords.SUPPORT) credentials.push({ email: "support@kollect-it.com", password: passwords.SUPPORT });
  if (passwords.JAMES_PERSONAL) credentials.push({ email: "info@kollect-it.com", password: passwords.JAMES_PERSONAL });

  if (credentials.length === 0) {
    throw new Error("No credentials provided via environment variables. Set at least one *_PASSWORD env var.");
  }

  return credentials;
};

async function main() {
  console.log("🔍 Testing credentials against database...");
  console.log("💡 This script uses passwords from environment variables only\n");

  const credentialsToTest = getCredentialsToTest();

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
