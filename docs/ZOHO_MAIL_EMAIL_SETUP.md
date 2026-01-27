# Zoho Mail Email Setup Guide

This guide will help you configure Zoho Mail SMTP for Kollect-It email functionality.

## Prerequisites

- Zoho Mail account (free): https://www.zoho.com/mail/
- Access to Zoho Mail settings

## Step 1: Enable 2-Factor Authentication

1. Go to [Zoho Account Security](https://accounts.zoho.com/home#security)
2. Enable **Two-Factor Authentication** if not already enabled
3. Complete the setup process

## Step 2: Generate App Password

1. Go to [Zoho Mail Settings](https://mail.zoho.com/zm/#settings/general)
2. Navigate to **Security** → **App Passwords**
3. Click **Generate New Password**
4. Enter name: `Kollect-It Production`
5. Click **Generate**
6. **Copy the app password** (you won't see it again!)

## Step 3: Configure Environment Variables

### Local Development (.env.local)

Open `.env.local` and add:

```env
# ===============================
# EMAIL (Zoho Mail SMTP)
# ===============================
EMAIL_HOST=smtp.zoho.com
EMAIL_PORT=587
EMAIL_USER=info@kollect-it.com
EMAIL_PASSWORD=your-zoho-app-password
EMAIL_FROM="Kollect-It <info@kollect-it.com>"
ADMIN_EMAIL=info@kollect-it.com
```

**Important:**
- Replace `info@kollect-it.com` with your actual Zoho Mail email
- Replace `your-zoho-app-password` with your generated App Password
- Replace `info@kollect-it.com` in ADMIN_EMAIL with your admin email address

### Vercel Production

1. Go to [Vercel Dashboard](https://vercel.com/[your-team]/kollect-it/settings/environment-variables)
2. Add each variable:
   - `EMAIL_HOST` = `smtp.zoho.com`
   - `EMAIL_PORT` = `587`
   - `EMAIL_USER` = `info@kollect-it.com` (your email)
   - `EMAIL_PASSWORD` = `your-zoho-app-password` (from Step 2)
   - `EMAIL_FROM` = `"Kollect-It <info@kollect-it.com>"`
   - `ADMIN_EMAIL` = `info@kollect-it.com`
3. Select environments: ✅ Production, ✅ Preview, ✅ Development
4. Click **Save** for each variable

## Step 4: Test Email Configuration

Run the email test script:

```bash
bun run scripts/test-services.ts
```

Look for:
```
✅ TEST 4: Email Configuration (Zoho Mail SMTP)
✅ SMTP connection verified
   Host: smtp.zoho.com
   Port: 587
   Sender: Kollect-It <info@kollect-it.com>
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

- Verify App Password is correct
- Ensure 2FA is enabled on Zoho account
- Check that `EMAIL_USER` matches your Zoho Mail email exactly

### "Connection timeout"

- Verify `EMAIL_HOST` is `smtp.zoho.com`
- Verify `EMAIL_PORT` is `587` (not 465)
- Check firewall/network settings

### "Emails not sending"

- Check Vercel logs: `vercel logs`
- Verify all environment variables are set in Vercel
- Ensure `EMAIL_FROM` format is correct: `"Name <email@domain.com>"`

### "App Password not working"

- Regenerate App Password in Zoho Mail settings
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

**Last Updated:** January 21, 2026  
**Status:** ✅ Ready for configuration
