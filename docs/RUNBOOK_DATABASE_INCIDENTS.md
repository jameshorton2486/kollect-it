# Runbook: Database Incidents (Prisma + Supabase + Vercel)

This runbook is the authoritative, step-by-step guide for diagnosing and resolving production database incidents, including SASL authentication failures.

---

## Required Production Env Vars

These **must** exist in Vercel → Project → Settings → Environment Variables (Production):

- `DATABASE_URL` (direct Postgres, port 5432)
- `DIRECT_URL` (direct Postgres, port 5432)
- `NEXTAUTH_SECRET` (32+ chars)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Prisma uses **only** `DATABASE_URL` for runtime queries and `DIRECT_URL` for migrations.

---

## Vercel CLI: add required env vars (Production)

Copy/paste in PowerShell to set required env vars:

```powershell
# Generate a strong NEXTAUTH_SECRET locally (32+ chars) using Node crypto
$nextAuthSecret = node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"

# DATABASE_URL and DIRECT_URL must be the DIRECT Postgres connection (port 5432)
# Supabase Dashboard → Settings → Database → Connection string → Direct (port 5432)
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production

# Auth secret (paste generated value)
vercel env add NEXTAUTH_SECRET production

# Supabase keys (fetch via CLI or Dashboard → Settings → API Keys)
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
```

---

## Symptoms & Signals

- `PrismaClientInitializationError`
- `FATAL: SASL authentication failed`
- Health check returns `{ database: "disconnected" }`
- 500s on routes that touch Prisma (orders, wishlist, etc.)

---

## Immediate Triage (2–5 minutes)

1. **Check the health endpoint**
   - `GET /api/health` (admin session or `x-healthcheck-token`)
   - If `database: "disconnected"`, proceed to env checks.

2. **Check Vercel logs**
   - Look for:
     - `[DB] DATABASE_URL is missing`
     - `[DB] DATABASE_URL must start with postgresql://`
     - `[DB] DATABASE_URL appears to be a pooled/PgBouncer URL`
     - `[Health] Database check failed` with underlying error

3. **Confirm env vars in Vercel (Production)**
   - `DATABASE_URL` and `DIRECT_URL` must be **direct** connections (port 5432).
   - Do **not** use PgBouncer/pooler URLs (typically port 6543).

4. **Use CLI as source of truth (no secrets printed)**
   ```powershell
   vercel env pull .env.production --environment=production
   ```
   Then validate:
   - `DATABASE_URL` and `DIRECT_URL` start with `postgresql://`
   - Host is `db.<project-ref>.supabase.co`
   - Port is `5432`

---

## Root Causes & Fixes

### 1) SASL authentication failures
**Cause:** `DATABASE_URL` or `DIRECT_URL` is a pooled/PgBouncer URL (transaction mode), or credentials are wrong.

**Fix:**
1. Supabase Dashboard → Settings → Database → Connection string.
2. Copy the **direct** Postgres URI (port 5432).
3. Update **both** `DATABASE_URL` and `DIRECT_URL` in Vercel (Production).
4. Redeploy.

If SASL persists after switching to direct URLs, regenerate the database password in Supabase and update both env vars in Vercel.

---

### 2) `DATABASE_URL` missing or malformed
**Cause:** Variable not set or not a valid Postgres URI.

**Fix:**
1. Set `DATABASE_URL` in Vercel → Production.
2. Ensure it starts with `postgresql://` or `postgres://`.
3. Redeploy.

---

### 3) Build fails with production env guard
**Cause:** Build-time guard detected missing/malformed env vars.

**Fix:**
1. Open Vercel → Environment Variables (Production).
2. Add/repair any missing keys listed by the guard.
3. Redeploy.

---

## Post-Fix Verification

1. `GET /api/health` → expect `database: "connected"`.
2. Run a minimal query path (e.g. load admin dashboard or orders page).
3. Monitor Vercel logs for any new Prisma errors.

---

## Notes & Constraints

- Docker is **not** required and is not used.
- Do **not** use `POSTGRES_URL` or `SUPABASE_DB_URL` in application code.
- Prisma runtime must use the **direct** Postgres connection (port 5432).
