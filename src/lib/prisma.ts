import { PrismaClient } from "@prisma/client";

// Note: Don't manually load dotenv here!
// - Next.js automatically loads .env.local for local development
// - Vercel automatically injects environment variables for production
// Manual dotenv.config() can interfere with these automatic mechanisms

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

