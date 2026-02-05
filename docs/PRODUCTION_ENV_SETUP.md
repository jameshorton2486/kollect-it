# Production environment setup (Vercel + Supabase)

Source of truth for production environment variables. Use this to fix SASL/Prisma failures and avoid broken deploys.

**Do not invent or commit values.** Set these in Vercel → Project → Settings → Environment Variables (Production).

---

## Required env vars by category

### Core / required

| Variable | Purpose |
|---------|--------|
| `ADMIN_EMAIL` | Admin contact / notification target (e.g. info@kollect-it.com). |
| `DATABASE_URL` | **Prisma runtime connection.** Must start with `postgresql://`. Use **direct** Supabase Postgres (port 5432). See below. |
| `DIRECT_URL` | **Prisma migrations only.** Direct Postgres URL (same as DATABASE_URL or direct host). Not used at runtime. |
| `NEXTAUTH_SECRET` | NextAuth JWT signing (32+ chars). |
| `NEXTAUTH_URL` | Site URL for auth (e.g. https://kollect-it.com). |
| `NEXT_PUBLIC_APP_URL` | Public app URL (e.g. https://kollect-it.com). |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (e.g. https://kollect-it.com). |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (if using Supabase features). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (if using Supabase features). |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (server-only; if used). |

### Email (SMTP)

| Variable | Purpose |
|----------|--------|
| `EMAIL_HOST` | SMTP host (e.g. smtp.zoho.com). |
| `EMAIL_PORT` | SMTP port (e.g. 587). |
| `EMAIL_USER` | SMTP login (e.g. info@kollect-it.com). |
| `EMAIL_PASSWORD` | SMTP password (e.g. Zoho app password). |
| `EMAIL_FROM` | From address (e.g. "Kollect-It <info@kollect-it.com>"). |
| `EMAIL_SERVER` | Optional; app uses EMAIL_HOST + EMAIL_PORT + EMAIL_USER + EMAIL_PASSWORD when set. |

### Payments (Stripe)

| Variable | Purpose |
|----------|--------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key. |
| `STRIPE_SECRET_KEY` | Stripe secret key (server-only). |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret. |

### Images (ImageKit)

| Variable | Purpose |
|----------|--------|
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key (server-only). |
| `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` | ImageKit public key. |
| `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint. |

### AI / LLM (optional)

| Variable | Purpose |
|----------|--------|
| `OPENAI_API_KEY` | OpenAI API key (if used). |
| `OPEN_AI_KEY` | Legacy OpenAI key (if still referenced). |
| `ANTHROPIC_API_KEY` | Anthropic API key (if used). |
| `CLAUDE_API_KEY` | Claude key (if used). |

### Health check (optional but recommended)

| Variable | Purpose |
|----------|--------|
| `HEALTHCHECK_TOKEN` | Secret token for `GET /api/health` without an admin session. Send in header: `x-healthcheck-token: <token>`. If unset, only an admin session can access the health endpoint. See [HEALTHCHECK.md](HEALTHCHECK.md). |

### Other

| Variable | Purpose |
|----------|--------|
| `PRODUCT_INGEST_API_KEY` | Desktop/app ingest API auth. |
| `SERVICE_API_KEY` | Internal service auth (if used). |

**Not used (safe to remove from Vercel):** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (auth is Credentials-only, no Google OAuth), `RESEND_API_KEY` (email is Zoho SMTP only).

### Platform (set by Vercel)

`NODE_ENV`, `VERCEL_*`, `TURBO_*`, `NX_*` — do not set manually for production.

---

## DATABASE_URL vs DIRECT_URL

| Variable | Used by | When |
|----------|--------|------|
| **DATABASE_URL** | Prisma **runtime** (all queries in the app). | Every request that touches the DB. |
| **DIRECT_URL** | Prisma **migrations only** (`prisma migrate`, `prisma db push`). | Never used for app queries. |

- **Runtime uses only `DATABASE_URL`.** The app never reads `DIRECT_URL` for queries.
- Prisma schema defines both: `url = env("DATABASE_URL")`, `directUrl = env("DIRECT_URL")`.
- Do **not** use `POSTGRES_URL`, `SUPABASE_DB_URL`, or any other name in code. Only these two.

---

## Correct Supabase connection string (avoid SASL)

**Problem:** `FATAL: SASL authentication failed` usually means wrong URL type or credentials.

- **Use a DIRECT Postgres connection** for `DATABASE_URL` (and for `DIRECT_URL`):
  - Port **5432** (direct), not the pooler port (e.g. 6543).
  - Supabase Dashboard → Settings → Database → “Connection string” → **URI** (direct).
- **Do not** use the transaction-mode pooler URL for Prisma runtime; it can cause SASL errors.
- Pooled URLs (PgBouncer, port 6543) are only safe if configured for **session** mode and correct auth; when in doubt, use direct (5432) for both vars.

Example format (replace placeholders):

```text
postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres
```

Or the non-pooled direct host from Supabase.

---

## Common production failure modes

| Symptom | Cause | Fix |
|--------|--------|-----|
| **PrismaClientInitializationError / SASL authentication failed** | Wrong or pooled `DATABASE_URL`, or bad credentials. | Set `DATABASE_URL` (and `DIRECT_URL`) to the **direct** Postgres URI (port 5432). Regenerate DB password in Supabase if needed; update both vars in Vercel and redeploy. |
| **DATABASE_URL is missing** | Var not set in Vercel for the environment (e.g. Production). | Add `DATABASE_URL` (and `DIRECT_URL`) in Vercel → Production, then redeploy. |
| **DATABASE_URL must start with postgresql://** | Value is empty, wrong var, or malformed. | Fix in Vercel so the value is exactly a URI starting with `postgresql://` or `postgres://`. |
| **Health check: database disconnected** | Connection refused, SASL, or network. | Check Vercel logs for the logged error; fix URL and credentials as above. |
| **Auth / redirect / cookie issues** | `NEXTAUTH_URL` or `NEXT_PUBLIC_*` URL mismatch. | Set `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SITE_URL` to the same production URL (e.g. https://kollect-it.com) and redeploy. |

---

## Vercel-specific notes

1. **Scoping:** Add variables for **Production** (and Preview/Development if you use them). Redeploy after changing env; env vars apply only to new deployments.
2. **Sensitive values:** Never commit real values. Use Vercel dashboard or `vercel env add` for secrets.
3. **Build vs runtime:** Prisma generates the client at build time; runtime connects using `DATABASE_URL`. Ensure `DATABASE_URL` is set for the Production environment so both build and runtime see it.
4. **Fail-fast:** The app validates `DATABASE_URL` before creating the Prisma client. If it’s missing or malformed in production, the app throws a clear error instead of starting with a broken DB.

---

## How to verify production

1. **Health check:** `GET /api/health` requires either an admin session or the `x-healthcheck-token` header. See [HEALTHCHECK.md](HEALTHCHECK.md) for auth options and how to set `HEALTHCHECK_TOKEN`. Check response for `database: "connected"` and required env vars.
2. **Vercel logs:** After deploy, open Project → Logs. Look for `[DB]` or `[Health]` messages if the DB check fails.
3. **No silent failures:** Missing or invalid `DATABASE_URL` in production causes an immediate fatal error with a message pointing to this doc.

---

## See also

- **Database-only details:** [PRODUCTION_DATABASE_SETUP.md](PRODUCTION_DATABASE_SETUP.md)
- **Launch checklist and URLs:** [PRODUCTION-ENV-AND-LAUNCH.md](PRODUCTION-ENV-AND-LAUNCH.md)
