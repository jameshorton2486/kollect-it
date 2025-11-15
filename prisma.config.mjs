// Load environment variables from .env.local (or .env as fallback)
import "dotenv/config";

// Prisma configuration
export default {
  schema: "./prisma/schema.prisma",
};
