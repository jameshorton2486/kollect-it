/**
 * Database connection string validation (fail-fast).
 * Runs before Prisma client is used so production fails with clear errors
 * instead of opaque SASL or connection failures.
 *
 * Prisma uses ONLY env("DATABASE_URL") and env("DIRECT_URL") from schema.prisma.
 * Do not rely on POSTGRES_URL, SUPABASE_DB_URL, or any other name in application code.
 */

const POSTGRES_PREFIX = "postgresql://";
const POSTGRES_PREFIX_ALT = "postgres://";

export class DatabaseUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseUrlError";
  }
}

/**
 * Validates that DATABASE_URL exists and is a Postgres URL.
 * Call this before creating PrismaClient (e.g. from lib/prisma.ts).
 * This is a lightweight check only (no pooler/port validation).
 * It never throws to avoid blocking runtime operations.
 */
export function validateDatabaseUrl(): void {
  const url = process.env.DATABASE_URL;

  if (url == null || String(url).trim() === "") {
    const msg =
      "[DB] DATABASE_URL is missing. Set it in Vercel (Production) or .env.local. " +
      "See docs/PRODUCTION_ENV_SETUP.md.";
    console.warn(msg);
    return;
  }

  const trimmed = String(url).trim();
  if (
    !trimmed.startsWith(POSTGRES_PREFIX) &&
    !trimmed.startsWith(POSTGRES_PREFIX_ALT)
  ) {
    const msg =
      "[DB] DATABASE_URL must start with postgresql:// or postgres://. " +
      "Current value does not. Fix in Vercel or .env.local. " +
      "See docs/PRODUCTION_ENV_SETUP.md.";
    console.warn(msg);
    return;
  }

  const parsed = (() => {
    try {
      return new URL(trimmed);
    } catch {
      return null;
    }
  })();

  if (!parsed) {
    const msg =
      "[DB] DATABASE_URL is not a valid URL. Fix it in Vercel (Production) or .env.local.";
    console.warn(msg);
    return;
  }
}
