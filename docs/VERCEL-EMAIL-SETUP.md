# Vercel Email Setup for info@kollect-it.com

Step-by-step guide to configure Zoho Mail (info@kollect-it.com) on Vercel and verify delivery.

**Security:** Never paste your Zoho app password into chat, docs, or code. If you expose it by mistake, regenerate it in Zoho (Security → App Passwords) and update `EMAIL_PASSWORD` in Vercel.

---

## Production: Missing EMAIL_HOST / EMAIL_PORT

If production already has `EMAIL_USER`, `EMAIL_PASSWORD`, and `EMAIL_FROM` but **email still doesn’t send**, the app is likely missing `EMAIL_HOST` and `EMAIL_PORT`. The code uses these (not `EMAIL_SERVER`).

**Add the two missing variables:**

```powershell
vercel env add EMAIL_HOST production
# When prompted, enter: smtp.zoho.com

vercel env add EMAIL_PORT production
# When prompted, enter: 587
```

Use **587** for Zoho (TLS); **465** is also valid (SSL). Then redeploy: `vercel --prod`, and test email from the live site.

---

## Step 1: Get Your Zoho App Password

If you haven't already:

1. Go to <https://accounts.zoho.com/home#security>
2. Enable **Two-Factor Authentication** (required for app passwords)
3. Go to <https://mail.zoho.com/zm/#settings/general>
4. Click **Security** → **App Passwords**
5. Click **Generate New Password**
6. Name it: **Kollect-It Production**
7. **Copy the password immediately** — you won't see it again

---

## Step 2: Add Environment Variables to Vercel

### Option A: Vercel Dashboard (recommended)

1. Go to <https://vercel.com/dashboard>
2. Click your **kollect-it** project
3. **Settings** → **Environment Variables**
4. Add each variable below. Select **all** environments: ✅ Production, ✅ Preview, ✅ Development

| Name | Value |
|------|--------|
| `EMAIL_HOST` | `smtp.zoho.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_USER` | `info@kollect-it.com` |
| `EMAIL_PASSWORD` | *(paste your Zoho app password)* |
| `EMAIL_FROM` | `Kollect-It <info@kollect-it.com>` |
| `ADMIN_EMAIL` | `info@kollect-it.com` |

### Option B: Vercel CLI

From your project folder (PowerShell or bash), run each command and when prompted enter the value, then select **Production**, **Preview**, and **Development**:

```bash
vercel login

# 1. EMAIL_HOST → smtp.zoho.com
vercel env add EMAIL_HOST production preview development

# 2. EMAIL_PORT → 587
vercel env add EMAIL_PORT production preview development

# 3. EMAIL_USER → info@kollect-it.com
vercel env add EMAIL_USER production preview development

# 4. EMAIL_PASSWORD → (paste your Zoho app password when prompted; never commit or paste in chat)
vercel env add EMAIL_PASSWORD production preview development

# 5. EMAIL_FROM → Kollect-It <info@kollect-it.com>
vercel env add EMAIL_FROM production preview development

# 6. ADMIN_EMAIL → info@kollect-it.com
vercel env add ADMIN_EMAIL production preview development
```

Use the values from the table in Option A. After adding all, redeploy (Step 3).

---

## Step 3: Trigger a Redeploy

Environment variables only take effect after a new deployment.

**Option A — Dashboard:** Project → **Deployments** → latest production deployment → ⋮ menu → **Redeploy**

**Option B — CLI:**

```powershell
vercel --prod
```

---

## Step 4: Verify Configuration

### Check status (admin only)

- **Dashboard:** Log in at <https://kollect-it.com> as admin, then open **GET** `/api/admin/email/test` (or use the admin email settings page if you have one).
- **PowerShell** (replace with your session cookie after logging in):

```powershell
Invoke-WebRequest -Uri "https://kollect-it.com/api/admin/email/test" -Method GET -Headers @{"Cookie"="next-auth.session-token=YOUR_SESSION_TOKEN"}
```

### Send a test email (easiest: browser console)

1. Log into <https://kollect-it.com> as admin
2. Open DevTools (F12) → **Console**
3. Run:

```javascript
fetch('/api/admin/email/test', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({to: 'jameshorton2486@gmail.com'})
}).then(r => r.json()).then(console.log)
```

**Success** looks like:

```json
{
  "success": true,
  "message": "Test email sent to jameshorton2486@gmail.com",
  "messageId": "..."
}
```

---

## Step 5: Full Validation Checklist

| Test | Action | Expected result |
|------|--------|------------------|
| ✅ Test email | Run browser console command above | Email arrives in your inbox |
| ✅ Password reset | Go to `/forgot-password`, enter your email | Reset email arrives (if forgot-password is re-enabled) |
| ✅ Contact form | Submit form at `/contact` | Notification arrives at <info@kollect-it.com> |
| ✅ Order (when ready) | Place test order | Confirmation to customer + admin notification to <info@kollect-it.com> |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Invalid login" | Regenerate Zoho app password; ensure 2FA is enabled |
| Emails logged but not sent | Ensure both `EMAIL_USER` and `EMAIL_PASSWORD` are set in Vercel |
| 403 Unauthorized | Log in as admin before calling email endpoints |
| Connection timeout | Use `EMAIL_PORT=587` (not 465) |

---

See also: [EMAIL-INFO-AT-KOLLECT-IT.md](EMAIL-INFO-AT-KOLLECT-IT.md) and [ZOHO_MAIL_EMAIL_SETUP.md](ZOHO_MAIL_EMAIL_SETUP.md).
