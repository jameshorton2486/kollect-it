# Production env and launch checklist

Use this to fix “site URL not appearing,” login/cookie issues, and to confirm required env vars for https://kollect-it.com.

---

## 1. Site URL (fix login redirects and cookies)

**Problem:** If `NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL`, or `NEXT_PUBLIC_APP_URL` are missing or wrong, you get login redirect issues, cookies not sticking, and “URL not appearing.”

**Fix:** In Vercel → your project (e.g. kollect-it or kollect-it-marketplace-1) → **Settings** → **Environment Variables** → **Production**, set **all three** to the same value:

| Variable | Value |
|----------|--------|
| `NEXTAUTH_URL` | `https://kollect-it.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://kollect-it.com` |
| `NEXT_PUBLIC_APP_URL` | `https://kollect-it.com` |

Then **Redeploy** (Deployments → latest production → ⋮ → Redeploy, or `vercel --prod`). Env vars only apply after a new deployment.

---

## 2. Required environment variables (production)

Keep these in Vercel for production. Do not remove.

| Category | Variables |
|----------|-----------|
| **Database** | `DATABASE_URL`, `DIRECT_URL` (if used by Prisma) |
| **Auth** | `NEXTAUTH_SECRET`, `NEXTAUTH_URL` |
| **Site URL** | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_URL` |
| **Email (Zoho)** | `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_FROM`, `ADMIN_EMAIL` |
| **ImageKit** | `NEXT_PUBLIC_IMAGEKIT_*`, `IMAGEKIT_PRIVATE_KEY` (or whatever your ImageKit vars are) |
| **Stripe** | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |
| **Other** | `PRODUCT_INGEST_API_KEY`, `WEBHOOK_SECRET`, etc. as used in `src/` or Prisma |

This app uses **Zoho SMTP** for email only (no Resend). Auth is **Credentials only** (no Google OAuth). You can remove from Vercel: `RESEND_API_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.

---

## 3. Safe to remove (if unused)

Only remove if you’ve confirmed they’re not referenced in `src/` or Prisma:

- `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — remove only if Supabase is not used for anything in this app
- Duplicate or legacy keys (e.g. old `SERVICE_API_KEY`, duplicate `OPEN_AI_KEY` / `ANTHROPIC_API_KEY`)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — not used (Credentials-only auth)
- `RESEND_API_KEY` — not used (Zoho SMTP only)

**Rule of thumb:** If it’s not referenced in `src/` or in Prisma config, it can be removed after a quick grep.

---

## 4. Why you can’t log in (“Invalid email or password”)

The message means **your email is not in the `User` table yet**. Kollect-It does not auto-create admins; you must create the first admin user once.

---

## 5. Create yourself as admin (one-time)

From repo root in PowerShell:

```powershell
$env:DATABASE_URL = "PASTE_PRODUCTION_DATABASE_URL"
$env:ADMIN_EMAIL = "jameshorton2486@gmail.com"
$env:ADMIN_PASSWORD = "YourStrongPasswordHere"
npx tsx scripts/create-admin.ts
Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue
Remove-Item Env:ADMIN_PASSWORD -ErrorAction SilentlyContinue
```

Get `DATABASE_URL` from Vercel → Environment Variables (Production). Do not commit or paste it. After the script succeeds, log in with that email and password.

Full details: [LOGIN-TROUBLESHOOTING.md](LOGIN-TROUBLESHOOTING.md).

---

## 6. Where to sign in

- **Main login:** https://kollect-it.com/login
- **Admin:** https://kollect-it.com/admin/login
- After login: `/admin`, `/admin/dashboard`, `/admin/products`, etc.

---

## 7. Do not do (today)

- Do **not** touch Bluehost, WordPress, or DNS for this fix.
- Do **not** rebuild the Vercel project from scratch.
- Do **not** rotate secrets randomly; only change what’s needed (e.g. URL vars, create admin).

---

## 8. Status at a glance

| Area | Action |
|------|--------|
| **DNS** | ✅ Correct if kollect-it.com points to Vercel |
| **Email** | ✅ Configured when Zoho `EMAIL_*` vars are set (see [VERCEL-EMAIL-SETUP.md](VERCEL-EMAIL-SETUP.md)) |
| **Hosting** | ✅ Use the correct Vercel project |
| **Auth** | ⚠️ Create admin once (Step 5) |
| **Env vars** | ⚠️ Set URL vars (Step 1); remove only unused (Step 3) |
| **Launch** | 🟡 One step left: create admin + confirm URL vars and redeploy |
