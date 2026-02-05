# Production database setup (Prisma + Supabase + Vercel)

This doc explains how to configure the database connection so Prisma works in production on Vercel (e.g. with Supabase Postgres) and how to avoid SASL authentication failures.

**Full env list and categories:** [PRODUCTION_ENV_SETUP.md](PRODUCTION_ENV_SETUP.md).

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

1. **Direct connection** (recommended for Prisma with Vercel to avoid SASL issues)
   - Port **5432**
   - Use this for **both** `DATABASE_URL` and `DIRECT_URL` in production if you hit SASL errors with the pooler.

2. **Connection pooler (PgBouncer / transaction mode)**
   - Often port **6543**
   - Can cause `FATAL: SASL authentication failed` with Prisma in some setups.
   - If you use it, ensure the pooler is in **session** mode (not transaction) and that the user/password are correct for the pooler.

**Recommendation:** In Vercel, set:

- `DATABASE_URL` = Supabase **direct** connection string (Session mode in dashboard, or the “Direct connection” URI with port 5432).
- `DIRECT_URL` = Same direct connection string (or the same URI).

Example format (replace with your host, user, password, db name):

```txt
postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres
```

Or the non-pooled direct host from Supabase Dashboard → Settings → Database → “Connection string” → “URI” (direct, port 5432).

---

## Required Vercel env vars

In Vercel → your project → Settings → Environment Variables (Production), set:

| Variable       | Required | Notes |
|----------------|----------|--------|
| `DATABASE_URL` | Yes      | Postgres URI; must start with `postgresql://` or `postgres://`. Prefer **direct** connection (port 5432) to avoid SASL. |
| `DIRECT_URL`   | Yes      | Same direct Postgres URI (used for migrations). |

No other DB-related env vars are required for Prisma.

---

## Common failure causes (including SASL)

| Symptom | Cause | Fix |
|--------|--------|-----|
| `FATAL: SASL authentication failed` | Wrong URL (e.g. pooler in transaction mode), wrong password, or wrong user. | Use **direct** connection (port 5432). Regenerate DB password in Supabase if needed; update `DATABASE_URL` and `DIRECT_URL` in Vercel. |
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

- Before creating the Prisma client, the app checks that `DATABASE_URL` exists and starts with `postgresql://` or `postgres://`.
- In **production**, if that check fails, the app throws immediately so it does not boot with a bad or missing URL.
- See `src/lib/db-validate.ts` and `src/lib/prisma.ts`.

---

## Summary

- Prisma uses **only** `DATABASE_URL` and `DIRECT_URL`.
- Use a **direct** Postgres connection string (port 5432) for both in production to avoid SASL issues.
- Set both in Vercel (Production), redeploy, and verify with `/api/health` and Vercel logs.
