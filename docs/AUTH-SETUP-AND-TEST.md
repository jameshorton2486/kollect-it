# Auth setup and test

Use this to add NextAuth env vars and verify login (local and Vercel).

**This project uses database auth:** users and password hashes live in the `User` table. You do **not** add `ADMIN_EMAIL` or `ADMIN_PASSWORD_HASH` to env for login.

---

## 1. Add env vars (local)

Create or edit **`.env.local`** in the repo root. Add (use your own values; do not commit real secrets):

```bash
NEXTAUTH_SECRET=<at least 32 characters>
NEXTAUTH_URL=http://localhost:3000
```

**Generate values (optional):**

- **NEXTAUTH_SECRET** (32+ chars):
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```
- **NEXTAUTH_URL** for local: `http://localhost:3000`

Do **not** add `ADMIN_EMAIL` or `ADMIN_PASSWORD_HASH` for login; auth uses the database.

---

## 2. Add env vars (Vercel)

1. Open [Vercel Dashboard](https://vercel.com/dashboard) → your team → project **kollect-it**.
2. **Settings** → **Environment Variables**.
3. Add:
   - **NEXTAUTH_SECRET** = same value as local (or a new 32+ char secret for production).
   - **NEXTAUTH_URL** = `https://kollect-it.com` (or your production URL).
4. Scope: **Production** (and Preview if you use it).
5. **Save** → **Redeploy** so the new vars are used.

---

## 3. Verify env and auth API

From repo root:

```bash
bun run verify:auth
```

Or directly:

```bash
bun run scripts/verify-auth-env.ts
```

You should see:

- `NEXTAUTH_SECRET: set (length >= 32)`
- `NEXTAUTH_URL` set (or a warning that it’s OK to leave unset for local).
- `DATABASE_URL: set`
- If the dev server is running: `Auth API responded: /api/auth/providers OK`

If something is missing, add it to `.env` or `.env.local` and run the script again.

---

## 4. Ensure user has a password (database)

Login checks the **User** table and compares the password with bcrypt. The user must exist and have a password set.

From repo root (same DB as the app):

```bash
node reset-my-pw.js
```

You should see: `Password set to: Texas1234` and `Updated user: jameshorton2486@gmail.com`.

- **Local:** Script uses `.env` / `.env.local`; that’s the same DB as `bun run dev`.
- **Production:** To fix production login, run the script once with `DATABASE_URL` set to the **production** URL (see `docs/LOGIN-TROUBLESHOOTING.md`).

---

## 5. Test login (local)

1. Start the app: `bun run dev`
2. Open: http://localhost:3000/login
3. Sign in with:
   - **Email:** `jameshorton2486@gmail.com`
   - **Password:** `Texas1234`
4. You should be redirected to `/account` and have a session.

If it fails: check the terminal where `bun run dev` is running for auth logs; see `docs/LOGIN-TROUBLESHOOTING.md`.

---

## 6. Test login (production)

After setting NEXTAUTH_SECRET and NEXTAUTH_URL in Vercel and redeploying:

1. Open: https://kollect-it.com/login (or your production URL).
2. Sign in with the same email and password as above (only if that user’s password was set in the **production** DB; see step 4).

---

## Summary

| Step | Action |
|------|--------|
| 1 | Add `NEXTAUTH_SECRET` and `NEXTAUTH_URL` to `.env.local` |
| 2 | Add same (or production URL) to Vercel → Redeploy |
| 3 | Run `bun run scripts/verify-auth-env.ts` |
| 4 | Run `node reset-my-pw.js` (same DB as the app) |
| 5 | Test at `/login` with your email and password |

**Note:** The old `scripts/test-auth-config.ts` expects `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` in env; this project does **not** use those for auth. Use `scripts/verify-auth-env.ts` and the steps above instead.
