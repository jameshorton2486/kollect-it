# Google Workspace Email Setup Guide

This guide will help you configure Google Workspace SMTP for Kollect-It email functionality.

## Prerequisites

- Google Workspace account (or Gmail with 2FA enabled)
- Access to Google Account settings

## Step 1: Enable 2-Factor Authentication

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already enabled
3. Complete the setup process

## Step 2: Generate App Password

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. If prompted, sign in again
3. Select **App**: Choose "Mail"
4. Select **Device**: Choose "Other (Custom name)"
5. Enter name: `Kollect-It Production`
6. Click **Generate**
7. **Copy the 16-character password** (you won't see it again!)

The password will look like: `abcd efgh ijkl mnop` (remove spaces when using)

## Step 3: Configure Environment Variables

### Local Development (.env.local)

Open `.env.local` and add:

```env
# ===============================
# EMAIL (Google Workspace SMTP)
# ===============================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@kollect-it.com
EMAIL_PASSWORD=abcdefghijklmnop
EMAIL_FROM="Kollect-It <noreply@kollect-it.com>"
ADMIN_EMAIL=james@kollect-it.com
```

**Important:**
- Replace `noreply@kollect-it.com` with your actual Google Workspace email
- Replace `abcdefghijklmnop` with your generated App Password (16 characters, no spaces)
- Replace `james@kollect-it.com` with your admin email address

### Vercel Production

1. Go to [Vercel Dashboard](https://vercel.com/[your-team]/kollect-it/settings/environment-variables)
2. Add each variable:
   - `EMAIL_HOST` = `smtp.gmail.com`
   - `EMAIL_PORT` = `587`
   - `EMAIL_USER` = `noreply@kollect-it.com` (your email)
   - `EMAIL_PASSWORD` = `your-16-char-app-password` (no spaces)
   - `EMAIL_FROM` = `"Kollect-It <noreply@kollect-it.com>"`
   - `ADMIN_EMAIL` = `james@kollect-it.com`
3. Select environments: ✅ Production, ✅ Preview, ✅ Development
4. Click **Save** for each variable

## Step 4: Test Email Configuration

Run the email test script:

```bash
bun run scripts/test-services.ts
```

Look for:
```
✅ TEST 4: Email Configuration (Google Workspace SMTP)
✅ SMTP connection verified
   Host: smtp.gmail.com
   Port: 587
   Sender: Kollect-It <noreply@kollect-it.com>
```

## Step 5: Test Email Sending

After deployment, test that emails actually send:

1. **Password Reset Test:**
   - Go to `/forgot-password`
   - Enter your email
   - Check inbox for reset email

2. **Order Confirmation Test:**
   - Place a test order
   - Verify order confirmation email arrives

3. **Admin Notification Test:**
   - Place an order
   - Check admin email for new order notification

## Troubleshooting

### "Invalid login" or "Authentication failed"

- Verify App Password is correct (16 characters, no spaces)
- Ensure 2FA is enabled on Google account
- Check that `EMAIL_USER` matches your Google account email exactly

### "Connection timeout"

- Verify `EMAIL_HOST` is `smtp.gmail.com`
- Verify `EMAIL_PORT` is `587` (not 465)
- Check firewall/network settings

### "Emails not sending"

- Check Vercel logs: `vercel logs`
- Verify all environment variables are set in Vercel
- Ensure `EMAIL_FROM` format is correct: `"Name <email@domain.com>"`

### "App Password not working"

- Regenerate App Password in Google Account
- Ensure you're using the App Password, not your regular password
- Verify 2FA is enabled

## Security Notes

⚠️ **Never commit `.env.local` to Git**

⚠️ **App Passwords are sensitive** - treat them like API keys

⚠️ **Rotate App Passwords periodically** (every 90 days recommended)

## Next Steps

After email is configured:

1. ✅ Test password reset flow
2. ✅ Test order confirmation emails
3. ✅ Verify admin notifications work
4. ✅ Run production audit: `docs/CODEX-PRODUCTION-AUDIT-PROMPT.md`

---

**Last Updated:** 2026-01-21  
**Status:** ✅ Ready for configuration
