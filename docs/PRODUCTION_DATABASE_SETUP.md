# Production database setup (Prisma + Supabase + Vercel)

This doc explains how to configure the database connection so Prisma works in production on Vercel (e.g. with Supabase Postgres) and how to avoid SASL authentication failures.

**Full env list and categories:** [PRODUCTION_ENV_SETUP.md](PRODUCTION_ENV_SETUP.md).

**Local build:** To run `npm run build` locally without a database, ensure `VERCEL` and `VERCEL_ENV` are not set (e.g. don’t put them in `.env`). The runtime DB guard only enforces strict checks on Vercel Production; locally it will only warn and the build can complete.

---

## Which env vars Prisma uses

The app uses **only** these for the database:

| Variable       | Purpose |
|----------------|--------|
| `DATABASE_URL` | Main connection string Prisma uses at runtime for queries. |
| `DIRECT_URL`   | Direct connection used for migrations (e.g. `prisma migrate`). |

Do **not** rely on `POSTGRES_URL`, `SUPABASE_DB_URL`, or any other name in application code. Prisma reads only `DATABASE_URL` and `DIRECT_URL` from `schema.prisma`.

---

## Correct Supabase connection string for production

Supabase exposes two kinds of Postgres URLs:

1. **Direct connection** (required for Prisma runtime on Vercel to avoid SASL issues)
   - Port **5432**
   - Use this for **both** `DATABASE_URL` and `DIRECT_URL` in production.

2. **Connection pooler (PgBouncer / transaction mode)**
   - Often port **6543**
   - Can cause `FATAL: SASL authentication failed` with Prisma in production.
   - Do **not** use the pooler URL for Prisma runtime.

**Required:** In Vercel, set:

- `DATABASE_URL` = Supabase **direct** connection string (port 5432).
- `DIRECT_URL` = Same direct connection string (port 5432).

Example format (replace with your host, user, password, db name):

```txt
postgresql://postgres.[ref]:[YOUR-PASSWORD]@db.[project-ref].supabase.co:5432/postgres
```

Or the non-pooled direct host from Supabase Dashboard → Settings → Database → “Connection string” → “URI” (direct, port 5432).

---

## Why pooled URLs cause SASL failures

Prisma uses persistent connections and expects direct Postgres behavior. Supabase pooler URLs often use PgBouncer in **transaction pooling** mode, which can break SASL/SCRAM authentication flows and result in:

- `FATAL: SASL authentication failed`
- `PrismaClientInitializationError`

To eliminate this class of failures, **do not** use pooled/PgBouncer URLs for Prisma runtime. Always use the **direct** Postgres connection (port 5432) for both `DATABASE_URL` and `DIRECT_URL`.

---

## Required Vercel env vars (Production)

In Vercel → your project → Settings → Environment Variables (Production), set:

| Variable       | Required | Notes |
|----------------|----------|--------|
| `DATABASE_URL` | Yes      | Postgres URI; must start with `postgresql://` or `postgres://`. **Direct** connection only (port 5432). |
| `DIRECT_URL`   | Yes      | Same direct Postgres URI (used for migrations). |
| `NEXTAUTH_SECRET` | Yes   | 32+ chars. Required for auth sessions. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Client key (public). |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only key (admin/service). |

No other DB-related env vars are required for Prisma.

---

## Vercel CLI: add required env vars (Production)

Run the following in PowerShell. It prompts for each value and adds it to Vercel Production:

```powershell
# Generate a strong NEXTAUTH_SECRET locally (32+ chars) using Node crypto
$nextAuthSecret = node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"

# DATABASE_URL and DIRECT_URL must be the DIRECT Postgres connection (port 5432)
# Retrieve from Supabase Dashboard → Settings → Database → Connection string → Direct (port 5432)
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production

# Auth secret (paste generated value)
vercel env add NEXTAUTH_SECRET production

# Supabase keys (fetch via CLI or Dashboard → Settings → API Keys)
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
```

Notes:
- Do **not** paste secrets into chat or commit them to git.
- If a value is wrong, re-run the same command to overwrite.

---

## CLI source of truth (inspect production env safely)

Use Vercel CLI to pull production env vars into a local file and inspect structure
**without printing secrets**:

```powershell
vercel env pull .env.production --environment=production
```

Then parse `DATABASE_URL` and `DIRECT_URL` locally and confirm:

- Scheme: `postgresql://` or `postgres://`
- Host: `db.<project-ref>.supabase.co`
- Port: `5432`
- Not a pooler host or port `6543`

If the URLs are pooled or malformed, replace them in Vercel with the **direct**
Supabase connection string.

---

## Supabase keys (CLI + Dashboard)

Use the Supabase CLI **only** to verify the linked project and fetch API keys (anon + service role):

```bash
supabase link --project-ref <your-project-ref>
```

Then fetch API keys:

```bash
supabase projects api-keys --project-ref <your-project-ref>
```

If the CLI output is not available, use Supabase Dashboard → Settings → API Keys.

---

## Common failure causes (including SASL)

| Symptom | Cause | Fix |
|--------|--------|-----|
| `FATAL: SASL authentication failed` | Pooled/PgBouncer URL, wrong password, or wrong user. | Use **direct** connection (port 5432). Regenerate DB password in Supabase if needed; update `DATABASE_URL` and `DIRECT_URL` in Vercel. |
| `DATABASE_URL is missing` | Env var not set in Vercel for the environment (e.g. Production). | Add `DATABASE_URL` (and `DIRECT_URL`) in Vercel, then redeploy. |
| `DATABASE_URL must start with postgresql://` | Value is not a Postgres URL (typo, wrong var, or extra quotes). | Fix in Vercel so the value is exactly a URI starting with `postgresql://` or `postgres://`. |
| Health check shows `database: "disconnected"` | Connection refused, SASL, or network. | Check Vercel logs for the logged error; fix URL and credentials as above. |

---

## How to verify production DB connectivity

1. **Health check (server)**
   Call `GET /api/health` with an admin session (or with `x-healthcheck-token` if `HEALTHCHECK_TOKEN` is set).
   - `database: "connected"` → Prisma can run `SELECT 1`.
   - `database: "disconnected"` → Check Vercel logs for the logged error message (e.g. SASL or connection refused).

2. **Vercel logs**
   After deploy, open Vercel → Project → Logs. If the first request that uses Prisma fails, you’ll see either:
   - `[DB] DATABASE_URL is missing...` or `[DB] DATABASE_URL must start with postgresql://...` (from fail-fast validation), or
   - `[Health] Database check failed...` with the underlying error (e.g. SASL).

3. **No silent crashes**
   The app validates `DATABASE_URL` before creating Prisma and logs DB failures in the health check, so misconfiguration should produce clear errors instead of silent failures.

---

## Fail-fast validation (what the app does)

- Before creating the Prisma client, the app checks that `DATABASE_URL` exists, starts with `postgresql://` or `postgres://`, and is **not** a pooled/PgBouncer URL.
- In **production**, if that check fails, the app throws immediately so it does not boot with a bad or missing URL.
- See `src/lib/db-validate.ts` and `src/lib/prisma.ts`.

---

## Build-time guard (Vercel)

The build runs a production env guard before `next build`. It fails the build if required variables are missing or malformed:

- `scripts/verify-production-env.ts`
- Wired via `prebuild` in `package.json`

---

## Summary

- Prisma uses **only** `DATABASE_URL` and `DIRECT_URL`.
- Use a **direct** Postgres connection string (port 5432) for both in production to avoid SASL issues.
- Set both in Vercel (Production), redeploy, and verify with `/api/health` and Vercel logs.
