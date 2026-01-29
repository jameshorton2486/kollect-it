# Login troubleshooting

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
