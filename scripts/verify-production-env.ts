/* eslint-disable no-console */
/**
 * Build-time guard for Vercel Production.
 * Fails the build if required env vars are missing or malformed.
 *
 * This runs before `next build` via the `prebuild` script.
 */

const REQUIRED_VERCEL_PROD_VARS = [
  "DATABASE_URL",
  "DIRECT_URL",
  "NEXTAUTH_SECRET",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

const POSTGRES_PREFIX = "postgresql://";
const POSTGRES_PREFIX_ALT = "postgres://";
const POOLER_HOST_FRAGMENT = "pooler.supabase.com";
const POOLER_QUERY_FRAGMENT = "pgbouncer";
const POOLER_PORT = "6543";
const DIRECT_PORT = "5432";
const SUPABASE_DIRECT_HOST = /^db\..+\.supabase\.co$/i;

function isProductionBuild(): boolean {
  return (
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production"
  );
}

function parseUrl(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function isPooledConnection(url: URL): boolean {
  const host = url.host.toLowerCase();
  const query = url.search.toLowerCase();
  return (
    host.includes(POOLER_HOST_FRAGMENT) ||
    url.port === POOLER_PORT ||
    query.includes(POOLER_QUERY_FRAGMENT)
  );
}

function validateDatabaseUrl(
  name: "DATABASE_URL" | "DIRECT_URL",
  value: string | undefined,
  errors: string[],
): void {
  if (!value || value.trim().length === 0) {
    errors.push(`${name} is missing.`);
    return;
  }

  const trimmed = value.trim();
  if (
    !trimmed.startsWith(POSTGRES_PREFIX) &&
    !trimmed.startsWith(POSTGRES_PREFIX_ALT)
  ) {
    errors.push(`${name} must start with postgresql:// or postgres://.`);
    return;
  }

  const parsed = parseUrl(trimmed);
  if (!parsed) {
    errors.push(`${name} is not a valid URL.`);
    return;
  }

  if (isPooledConnection(parsed)) {
    errors.push(
      `${name} appears to be a pooled/PgBouncer URL (host: ${parsed.hostname}). ` +
        "Use the direct Postgres connection (port 5432) from Supabase Dashboard → Settings → Database.",
    );
    return;
  }

  if (parsed.port !== DIRECT_PORT) {
    errors.push(
      `${name} must use the direct Postgres port 5432 in production (host: ${parsed.hostname}).`,
    );
    return;
  }

  if (!SUPABASE_DIRECT_HOST.test(parsed.hostname)) {
    errors.push(
      `${name} must use the Supabase direct host (db.<project-ref>.supabase.co) in production (host: ${parsed.hostname}).`,
    );
  }
}

function validateSecretLength(
  name: "NEXTAUTH_SECRET",
  value: string | undefined,
  minLength: number,
  errors: string[],
): void {
  if (!value || value.trim().length === 0) {
    errors.push(`${name} is missing.`);
    return;
  }
  if (value.trim().length < minLength) {
    errors.push(`${name} must be at least ${minLength} characters.`);
  }
}

function validateNonEmpty(
  name: "NEXT_PUBLIC_SUPABASE_ANON_KEY" | "SUPABASE_SERVICE_ROLE_KEY",
  value: string | undefined,
  minLength: number,
  errors: string[],
): void {
  if (!value || value.trim().length === 0) {
    errors.push(`${name} is missing.`);
    return;
  }
  if (value.trim().length < minLength) {
    errors.push(`${name} looks too short (expected ${minLength}+ characters).`);
  }
}

function run(): void {
  if (!isProductionBuild()) {
    console.log(
      "[Env Guard] Skipping strict production checks (non-production build).",
    );
    return;
  }

  const errors: string[] = [];

  validateDatabaseUrl("DATABASE_URL", process.env.DATABASE_URL, errors);
  validateDatabaseUrl("DIRECT_URL", process.env.DIRECT_URL, errors);
  validateSecretLength(
    "NEXTAUTH_SECRET",
    process.env.NEXTAUTH_SECRET,
    32,
    errors,
  );
  validateNonEmpty(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    20,
    errors,
  );
  validateNonEmpty(
    "SUPABASE_SERVICE_ROLE_KEY",
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    20,
    errors,
  );

  if (errors.length > 0) {
    console.error("❌ Production environment validation failed:");
    for (const err of errors) {
      console.error(`- ${err}`);
    }
    console.error(
      "Fix the missing/malformed variables in Vercel → Settings → Environment Variables (Production), then redeploy.",
    );
    process.exit(1);
  }

  console.log("✅ Production environment validation passed.");
  console.log(
    `Validated: ${REQUIRED_VERCEL_PROD_VARS.join(", ")} (values not logged)`,
  );
}

run();
