# Running without Zoho for a week

You can run the app for a week (or longer) without configuring Zoho or any email. Nothing will break.

---

## What’s already in place

1. **Password reset is disabled**
   - The “Forgot password” link is hidden on the login page.
   - The `/forgot-password` page shows “Password reset temporarily unavailable. Contact support.”
   - The API routes for reset are still there but not used. When you’re ready for email, you re-enable the UI and configure Zoho.

2. **Email is off when Zoho isn’t configured**
   - Email sending only runs if **EMAIL_USER** and **EMAIL_PASSWORD** are set in `.env` / `.env.local` (or in Vercel).
   - If those are **not** set, the app treats email as disabled: `sendEmail` no-ops and logs `[Email Disabled] To: ..., Subject: ...` instead of sending. No errors, no crashes.

3. **Login and everything else work**
   - Login uses the database (User table + password). No email required.
   - Browsing, account, admin, checkout, etc. work. Only features that *send* email (password reset, order emails, contact form, etc.) will “do nothing” until you add Zoho.

---

## What you do (nothing extra)

- **Do not** add Zoho credentials to `.env.local` or Vercel this week.
- **Do not** set `EMAIL_USER` or `EMAIL_PASSWORD` if you don’t want to use Zoho yet.
- If they’re already set and you want to turn email off for a week, remove or comment out `EMAIL_USER` and `EMAIL_PASSWORD` in `.env.local` (and in Vercel if you prefer production to also send no email).

That’s it. The app is already built to run without Zoho.

---

## When you’re ready to use Zoho (e.g. next week)

1. Add Zoho env vars (see `docs/ZOHO_MAIL_EMAIL_SETUP.md`):
   - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_FROM` (and in Vercel for production).
2. Re-enable the “Forgot password” link and the forgot-password form (see `docs/EMAIL-SIMPLIFICATION-SUMMARY.md` or the handoff summary for the exact file/UI changes to revert).
3. Redeploy if you changed Vercel env.

No auth or database changes are required.
