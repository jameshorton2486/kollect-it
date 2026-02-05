# Login troubleshooting

## "Invalid email or password" or "Password reset temporarily unavailable"

**Meaning:** Your email is **not** a registered user in Kollect-It yet. The app uses **NextAuth + Prisma** (users in the `User` table), not Supabase Auth. Admins must be created explicitly.

**Fix: create your admin user in the database** (same DB that production uses).

---

## Authentication failure / script using wrong database credentials

**Diagnosis:** The create-admin script talks to whatever database `DATABASE_URL` points to. If you see auth failures after running it, the script may be using **incorrect or stale** credentials (e.g. local `.env` instead of production).

**Fix: use production env vars, then run the script.**

### 1. Pull production env vars first

From the repo root in PowerShell:

```powershell
vercel env pull .env.local --environment=production
```

This overwrites (or creates) `.env.local` with Production environment variables from Vercel, including `DATABASE_URL` with the correct Supabase production URL and password. The script loads `.env` then `.env.local`, so the pulled values will be used.

### 2. Run the create-admin script

```powershell
$env:ADMIN_EMAIL = "info@kollect-it.com"
npx tsx scripts/create-admin.ts
```

Set `ADMIN_PASSWORD` in the environment too if you want to avoid the interactive prompt:

```powershell
$env:ADMIN_EMAIL = "info@kollect-it.com"
$env:ADMIN_PASSWORD = "YourStrongPasswordHere"
npx tsx scripts/create-admin.ts
```

Then log in at https://kollect-it.com/login (or /admin/login) with that email and password.

### 3. If it still fails: verify `DATABASE_URL`

Confirm that the script is seeing the production database URL:

```powershell
Select-String "DATABASE_URL" .env.local
```

- The value should start with `postgresql://` and point to your **Supabase production** host (e.g. `aws-0-...supabase.com` or your direct Postgres host).
- The password in the URL must match the one in Supabase Dashboard → Settings → Database. If you rotated the DB password in Supabase, update `DATABASE_URL` in Vercel and run `vercel env pull .env.local --environment=production` again.

**Security:** Never commit `.env.local` or paste real `DATABASE_URL` or passwords. Add `.env.local` to `.gitignore` (it should already be there).

### 4. SASL authentication failed

If the script fails with **`FATAL: SASL authentication failed`**, `DATABASE_URL` is almost certainly the **Supabase connection pooler** (port 6543 / `pooler.supabase.com`) instead of the **direct** Postgres connection (port 5432). Prisma requires the direct connection.

**Fix:**

1. Supabase Dashboard → **Settings** → **Database**.
2. Copy the **direct** connection string (URI with port **5432**), not the “Session pooler” (6543).
3. In Vercel → Project → **Settings** → **Environment Variables** → **Production**, set `DATABASE_URL` to that direct URL (and `DIRECT_URL` to the same if you use it).
4. From repo root: `vercel env pull .env.local --environment=production`.
5. Run the script again: `$env:ADMIN_EMAIL = "info@kollect-it.com"; npx tsx scripts/create-admin.ts`.

See [PRODUCTION_DATABASE_SETUP.md](PRODUCTION_DATABASE_SETUP.md) for details.

---

## Create first admin (manual URL)

If you prefer not to pull all production vars, you can set only `DATABASE_URL` (and optionally `DIRECT_URL`) for the script run.

1. **Get production `DATABASE_URL`**
   Vercel → your project → Settings → Environment Variables → copy the value of `DATABASE_URL` (Production). It must start with `postgresql://`. Use the **direct** connection (port 5432) for Prisma. Do not commit it or paste it in chat.

   **Example format (Supabase direct):**
   ```text
   postgresql://postgres.xxxx:YOUR_PASSWORD@db.xxxx.supabase.co:5432/postgres
   ```

2. **From repo root in PowerShell**, set the URL and run the script (use your own password; never paste the real password in chat):

   ```powershell
   $env:DATABASE_URL = "postgresql://..."   # paste your real URL from Vercel
   $env:ADMIN_EMAIL = "info@kollect-it.com"
   $env:ADMIN_PASSWORD = "YourStrongPasswordHere"

   npx tsx scripts/create-admin.ts

   Remove-Item Env:DATABASE_URL, Env:ADMIN_PASSWORD -ErrorAction SilentlyContinue
   ```

3. **Log in** at https://kollect-it.com/login or https://kollect-it.com/admin/login with that email and the password you set.

**Security:** Never commit or paste real `DATABASE_URL` or passwords. If you ever paste a real password in chat, change it immediately in the app and in any password manager.

---

## "I ran the password reset script but still can't log in"

### 1. Same database

The reset script updates **whichever database** `DATABASE_URL` points to when you run it.

- **Logging in at localhost**
  Run the script from the repo root so it loads `.env` and `.env.local`. That way it uses the same DB as `bun run dev`.

- **Logging in on Vercel (production)**
  The script only updates the DB it can see. If you run it with your **local** `.env.local`, it updates the **local** DB. Production uses the **Vercel** `DATABASE_URL`, so production login is unchanged.
  To fix production: run the script once with `DATABASE_URL` set to the production URL (e.g. copy from Vercel → env vars, then run in PowerShell with that env set for that run only). Do not commit production `DATABASE_URL`.

### 2. Exact email

The script updates only this user: **<jameshorton2486@gmail.com>**.
Log in with that exact address (no extra spaces, correct spelling). If your account uses a different email, either change `EMAIL` in `reset-my-pw.js` or use a script that targets that email.

### 3. Where you sign in

- Main site login: `/login`
- Admin login: `/admin/login`
Both use the same credentials; use the one you normally use.

### 4. Verify script and DB

After running `node reset-my-pw.js` you should see:

- `Password set to: Texas1234`
- `Updated user: jameshorton2486@gmail.com`
- A note about local vs production

If you see `ERROR: DATABASE_URL is not set`, add `DATABASE_URL` to `.env` or `.env.local` in the repo root.
If you see `ERROR: No user found with email: ...`, that user does not exist in the DB the script is using; create the user or fix the email in the script.

### 5. Manual reset via existing script

To set a password for a different email or with env-based credentials:

```bash
ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=YourNewPassword bun run scripts/fix-auth.ts
```

Requires `DATABASE_URL` (and optionally `ADMIN_EMAIL` / `ADMIN_PASSWORD`) in `.env` or `.env.local`.
