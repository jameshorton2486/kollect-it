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
const POOLER_HOST_FRAGMENT = "pooler.supabase.com";
const POOLER_QUERY_FRAGMENT = "pgbouncer";
const POOLER_PORT = "6543";
const DIRECT_PORT = "5432";
const SUPABASE_DIRECT_HOST = /^db\..+\.supabase\.co$/i;

export class DatabaseUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseUrlError";
  }
}

function isPooledConnection(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.host.toLowerCase();
    const query = parsed.search.toLowerCase();
    return (
      host.includes(POOLER_HOST_FRAGMENT) ||
      parsed.port === POOLER_PORT ||
      query.includes(POOLER_QUERY_FRAGMENT)
    );
  } catch {
    return false;
  }
}

/** True when running on Vercel in production (strict checks apply). */
function isVercelProduction(): boolean {
  return process.env.VERCEL === "1" && process.env.VERCEL_ENV === "production";
}

/**
 * Validates that DATABASE_URL exists and is a Postgres URL.
 * Call this before creating PrismaClient (e.g. from lib/prisma.ts).
 * On Vercel Production, throws immediately so the app does not boot with bad creds.
 * Local builds (including NODE_ENV=production) only warn so build can complete without DB.
 */
export function validateDatabaseUrl(): void {
  const url = process.env.DATABASE_URL;
  const strict = isVercelProduction();

  if (url == null || String(url).trim() === "") {
    const msg =
      "[DB] DATABASE_URL is missing. Set it in Vercel (Production) or .env.local. " +
      "See docs/PRODUCTION_ENV_SETUP.md.";
    if (strict) throw new DatabaseUrlError(msg);
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
    if (strict) throw new DatabaseUrlError(msg);
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
    if (strict) throw new DatabaseUrlError(msg);
    console.warn(msg);
    return;
  }

  const host = parsed.hostname || "unknown";

  if (isPooledConnection(trimmed)) {
    const msg =
      "[DB] DATABASE_URL appears to be a pooled/PgBouncer URL. " +
      "Prisma runtime requires a direct Postgres connection (port 5432). " +
      `Host: ${host}. ` +
      "Retrieve the direct connection string from Supabase Dashboard → Settings → Database.";
    if (strict) throw new DatabaseUrlError(msg);
    console.warn(msg);
    return;
  }

  if (strict && parsed.port !== DIRECT_PORT) {
    const msg =
      "[DB] DATABASE_URL must use the direct Postgres port 5432 in production. " +
      `Host: ${host}.`;
    throw new DatabaseUrlError(msg);
  }

  if (strict && !SUPABASE_DIRECT_HOST.test(host)) {
    const msg =
      "[DB] DATABASE_URL host must be the Supabase direct host (db.<project-ref>.supabase.co) in production. " +
      `Host: ${host}.`;
    throw new DatabaseUrlError(msg);
  }
}
