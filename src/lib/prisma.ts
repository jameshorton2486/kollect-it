import { PrismaClient } from "@prisma/client";
import { validateDatabaseUrl } from "@/lib/db-validate";

// Note: Don't manually load dotenv here!
// - Next.js automatically loads .env.local for local development
// - Vercel automatically injects environment variables for production
// Manual dotenv.config() can interfere with these automatic mechanisms

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  validateDatabaseUrl();
  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
