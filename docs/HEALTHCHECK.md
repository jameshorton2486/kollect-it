# Health check endpoint (`/api/health`)

`GET /api/health` returns app and database status. It is **not** public: you must use one of the two auth options below.

---

## Authentication required

The endpoint accepts **either**:

1. **Admin session** – You are logged in as an admin in the same browser (e.g. at `/login` or `/admin/login`). Open `https://kollect-it.com/api/health` in that same browser; the session cookie will authorize the request.
2. **Token header** – You send a secret token in the request header. If `HEALTHCHECK_TOKEN` is set in Vercel (Production), you can call the endpoint from scripts, monitors, or `curl` without logging in.

---

## Troubleshooting by response

| Response | Meaning | What to do |
|----------|--------|------------|
| **401 Unauthorized** | No valid admin session and no matching `x-healthcheck-token`, or token not set in Vercel. | Use an admin session (see below) or set `HEALTHCHECK_TOKEN` in Vercel and use the header (see “How to get and use the token”). |
| **404 Not Found** | Route or deployment issue. | Confirm the URL is `https://kollect-it.com/api/health` and the project is deployed. Check Vercel deployment status. |
| **500 / 502** | Server or DB error. | Check Vercel logs and [PRODUCTION_DATABASE_SETUP.md](PRODUCTION_DATABASE_SETUP.md). Ensure `DATABASE_URL` is the direct Postgres URL (port 5432). |
| **Timeout** | Request never completes. | Check Vercel and Supabase status; confirm DB is reachable and not overloaded. |

---

## Option A: Use an admin session

1. Log in as an admin at **https://kollect-it.com/login** (or `/admin/login`).
2. In the **same browser**, open: **https://kollect-it.com/api/health**.
3. You should get JSON with `status`, `database`, and `environment` (no token needed).

Use this when you only need to check health occasionally from a browser.

---

## Option B: Use a token (for scripts and monitoring)

Use this when you want to call `/api/health` from `curl`, a cron job, or an uptime monitor without using a browser session.

### 1. Check if `HEALTHCHECK_TOKEN` is already set

- Vercel → your project → **Settings** → **Environment Variables** → **Production**.
- Look for **HEALTHCHECK_TOKEN**. If it exists, use that value in the header (see “Test with curl” below). You do **not** need to regenerate it unless you want to rotate the secret.

### 2. If it’s missing: generate and add the token (without exposing it)

Generate a random token and add it to Vercel. These steps avoid printing the secret in the terminal.

**PowerShell (Windows):**

```powershell
# Generate a random token (not printed in full)
$token = node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"

# Add to Vercel Production (you will be prompted to paste the value)
vercel env add HEALTHCHECK_TOKEN production
```

When prompted for the value, paste the token from `$token` (or copy it from the Node command output if you ran it separately). Do not paste the token into chat or commit it.

**Node (any OS):**

```bash
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
```

Copy the output, then:

```bash
vercel env add HEALTHCHECK_TOKEN production
```

Paste the token when prompted.

### 3. Redeploy

Env vars apply only to **new** deployments. Redeploy production:

```bash
vercel --prod
```

Or trigger a production deploy from the Vercel dashboard.

### 4. Test with curl

Replace `<YOUR_TOKEN>` with the actual value (the one in Vercel):

```bash
curl -H "x-healthcheck-token: <YOUR_TOKEN>" https://kollect-it.com/api/health
```

You should get JSON like:

```json
{
  "status": "healthy",
  "timestamp": "2025-...",
  "database": "connected",
  "environment": { "DATABASE_URL": true, ... }
}
```

---

## Summary

- **401 Unauthorized** → Use an admin session in the browser, or set `HEALTHCHECK_TOKEN` in Vercel and send it in the `x-healthcheck-token` header.
- **How to get the token** → Vercel → Settings → Environment Variables (Production). If missing, generate with Node/PowerShell, add with `vercel env add HEALTHCHECK_TOKEN production`, redeploy, then call the endpoint with the header.
- **Admin alternative** → Log in as admin, then open `https://kollect-it.com/api/health` in the same browser.

See [PRODUCTION_ENV_SETUP.md](PRODUCTION_ENV_SETUP.md) for the full list of production env vars, including `HEALTHCHECK_TOKEN`.
