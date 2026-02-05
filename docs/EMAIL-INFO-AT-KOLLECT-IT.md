# Email setup: <info@kollect-it.com> (Zoho Mail)

End-to-end path to enable sending and “receiving” with **<info@kollect-it.com>** using the existing SMTP module and Zoho Mail.

---

## 1. Zoho Mail + App Password (required for SMTP)

The app uses **SMTP credentials**, not your normal Zoho password.

1. Follow **[Zoho Mail Email Setup](ZOHO_MAIL_EMAIL_SETUP.md)** to:
   - Enable 2FA: <https://accounts.zoho.com/home#security>
   - Create an App Password: Zoho Mail → Settings → Security → App Passwords → name e.g. `Kollect-It Production`
   - Copy the app password (shown only once).

2. Set these env vars (exact values for <info@kollect-it.com>):

| Variable         | Value |
|------------------|--------|
| `EMAIL_HOST`     | `smtp.zoho.com` |
| `EMAIL_PORT`     | `587` |
| `EMAIL_USER`     | `info@kollect-it.com` |
| `EMAIL_PASSWORD` | *(your Zoho app password)* |
| `EMAIL_FROM`     | `"Kollect-It <info@kollect-it.com>"` |
| `ADMIN_EMAIL`    | `info@kollect-it.com` |

---

## 2. Where to set them

**Local:** `.env.local` in the repo root (see Zoho guide for full block).

**Vercel:** See **[VERCEL-EMAIL-SETUP.md](VERCEL-EMAIL-SETUP.md)** for step-by-step (dashboard + CLI), redeploy, and verification. In short: Project → Settings → Environment Variables; add each variable; scope to Production (and Preview/Development if needed); redeploy.

---

## 3. SMTP on/off

From `src/lib/email.ts`: sending is **enabled** only when **both** `EMAIL_USER` and `EMAIL_PASSWORD` are set. If either is missing, emails are logged only and not sent.

---

## 4. Verify from the app (admin-only)

You must be logged in as admin.

| Method | Endpoint | Purpose |
|--------|----------|---------|
| **GET**  | `/api/admin/email/test` | SMTP config status (configured or not) |
| **POST** | `/api/admin/email/test` | Send a test email. Body: `{ "to": "your-test@example.com" }` |

Example (replace with your domain and session cookie):

```bash
# Status
curl -X GET https://kollect-it.com/api/admin/email/test -H "Cookie: <your-session-cookie>"

# Send test email
curl -X POST https://kollect-it.com/api/admin/email/test \
  -H "Content-Type: application/json" \
  -H "Cookie: <your-session-cookie>" \
  -d '{"to":"your-test@gmail.com"}'
```

---

## 5. “Receiving” mail for <info@kollect-it.com>

The app **only sends** email. Inbound mail to <info@kollect-it.com> is delivered to your **Zoho Mail inbox** for that address. Set `ADMIN_EMAIL=info@kollect-it.com` so admin notifications (new orders, contact form, etc.) are sent to that mailbox.

---

## 6. Test checklist (after SMTP is set)

From the Zoho guide and app behavior:

| Test | How |
|------|-----|
| **Config status** | GET `/api/admin/email/test` (admin) |
| **Send test** | POST `/api/admin/email/test` with `{"to":"your@email.com"}` |
| **Password reset** | Re-enable “Forgot password” UI, then use `/forgot-password` |
| **Order confirmation** | Place a test order; check customer inbox |
| **Admin notification** | Place order; check <info@kollect-it.com> inbox |

---

## Summary

- Use **<info@kollect-it.com>** for `EMAIL_USER`, `EMAIL_FROM`, and `ADMIN_EMAIL`; use a Zoho **App Password** for `EMAIL_PASSWORD`.
- Sending turns on when both `EMAIL_USER` and `EMAIL_PASSWORD` are set.
- Use **GET/POST `/api/admin/email/test`** (admin session) to verify configuration and delivery.
- Receiving = reading mail in the Zoho inbox for <info@kollect-it.com>.

For full Zoho steps and troubleshooting, see **[ZOHO_MAIL_EMAIL_SETUP.md](ZOHO_MAIL_EMAIL_SETUP.md)**.
