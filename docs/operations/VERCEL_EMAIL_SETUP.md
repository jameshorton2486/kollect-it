# Vercel Email Configuration Setup

> Quick reference for setting up email credentials in Vercel production environment

## Environment Variables to Add

**Location:** Vercel Dashboard → kollect-it → Settings → Environment Variables

Add these 6 variables (select **Production** environment for each):

| Variable Name | Value |
|---|---|
| `EMAIL_FROM` | `Kollect-It <info@kollect-it.com>` |
| `EMAIL_HOST` | `smtp.zoho.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_USER` | `info@kollect-it.com` |
| `EMAIL_PASSWORD` | `[Your Zoho App Password]` |
| `ADMIN_EMAIL` | `info@kollect-it.com` |

---

## Step-by-Step Setup

### 1. Generate Zoho Mail App Password

If you haven't already:

1. Go to [Zoho Mail Settings](https://mail.zoho.com/zm/#settings/general)
2. Navigate to **Security** → **App Passwords**
3. Click **Generate New Password**
4. Enter name: `Kollect-It Production`
5. Click **Generate**
6. Copy the app password (you won't see it again!)

### 2. Add Variables to Vercel

For each variable:

1. Go to **Vercel Dashboard → kollect-it → Settings → Environment Variables**
2. Click **"Add New"**
3. **Name:** Paste the variable name (e.g., `EMAIL_FROM`)
4. **Value:** Paste the value exactly
5. **Environment:** Select `Production`
6. Click **Save**
7. Repeat for all 6 variables

---

## Verification

After adding all variables:

- ✅ Next deployment will use these credentials
- ✅ Email service will be fully operational
- ✅ Admin notifications will work at `james@kollect-it.com`

**Check deployment status:** https://vercel.com/dashboard → kollect-it

---

## Related Documentation

- [Vercel Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
- [Email Integration Guide](../integrations/)
- [Deployment Checklist](../operations/)

**Last Updated:** January 17, 2026
