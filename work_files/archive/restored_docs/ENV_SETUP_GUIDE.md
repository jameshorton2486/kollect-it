# 🔐 Environment Variables Setup Guide

## ✅ Your .env.local File Location

**Location**: `C:\Users\james\kollect-it-marketplace-1\.env.local`

This is **CORRECT**! ✅ The `.env.local` file should be at the root of your project.

---

## 📋 What Was Added vs What You Need to Fill In

### What I Did ✅

I added all the **variable names** with **placeholder values** to your `.env.local` file. All missing variables are now present in the file.

### What YOU Need to Do ⚠️

You need to **replace all placeholder values** with your **actual credentials**. The variables are there, but they have empty or placeholder values that need to be filled in.

---

## 🔴 Required Variables - Fill These In

### 1. Database Connection (Supabase)

```env
# Get from: Supabase Dashboard → Settings → Database
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
```

**Where to get**: 
- Go to your Supabase project
- Settings → Database
- Copy "Connection string (pooled)" for DATABASE_URL (port 6543)
- Copy "Connection string (direct)" for DIRECT_URL (port 5432)

### 2. Authentication Secrets

```env
# Generate this with: openssl rand -base64 32
NEXTAUTH_SECRET=your-generated-32-plus-character-secret-here

# Development URL (already set)
NEXTAUTH_URL=http://localhost:3000
```

**How to generate NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

### 3. ImageKit (Image CDN)

```env
# Get from: https://imagekit.io/dashboard/developer/api-keys
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_xxxxxxxxxxxx
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id/
IMAGEKIT_PRIVATE_KEY=private_xxxxxxxxxxxx
```

**Where to get**:
- ImageKit Dashboard → Developer Options → API Keys
- Copy Public Key, Private Key, and URL Endpoint

### 4. Stripe (Payment Processing)

```env
# Get from: https://dashboard.stripe.com/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx

# Get from: https://dashboard.stripe.com/webhooks
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
```

**Where to get**:
- Stripe Dashboard → Developers → API Keys
- Copy Publishable Key and Secret Key
- For Webhook Secret: Developers → Webhooks → Your webhook

### 5. Google OAuth

```env
# Get from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
```

**Where to get**:
- Google Cloud Console → APIs & Services → Credentials
- Create OAuth 2.0 Client ID if needed
- Copy Client ID and Client Secret

### 6. Application Email

```env
# Already set to default
NEXT_PUBLIC_APP_EMAIL=noreply@kollect-it.com
```

---

## 🟡 Recommended Variables - Fill These In

### Email Configuration (Google Workspace SMTP)

```env
# Already set with defaults
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@kollect-it.com

# YOU NEED TO ADD: Google App Password
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # 16-character Google App Password

# Already set
EMAIL_FROM="Kollect-It <noreply@kollect-it.com>"
ADMIN_EMAIL=james@kollect-it.com
```

**How to get EMAIL_PASSWORD**:
1. Enable 2FA on your Google Workspace account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate App Password for "Mail"
4. Copy the 16-character password

---

## 📝 Development vs Production

### Development (.env.local)

Use **test/development credentials**:
- Stripe test keys (`pk_test_`, `sk_test_`)
- Development database
- `NEXTAUTH_URL=http://localhost:3000`
- Local email (or console logging)

### Production (Vercel Environment Variables)

Use **production credentials**:
- Stripe live keys (`pk_live_`, `sk_live_`)
- Production database
- `NEXTAUTH_URL=https://your-domain.com`
- Production email configuration

**To set production variables**:
1. Go to Vercel Dashboard
2. Your Project → Settings → Environment Variables
3. Add each variable for "Production"

---

## ✅ Verification Checklist

After filling in values, verify:

- [ ] All 12 required variables have actual values (not empty)
- [ ] `NEXTAUTH_SECRET` is 32+ characters
- [ ] `DATABASE_URL` includes `?pgbouncer=true` and port 6543
- [ ] `DIRECT_URL` uses port 5432 (no pgbouncer)
- [ ] Stripe keys start with correct prefixes (`pk_`, `sk_`, `whsec_`)
- [ ] Email variables are set if you want email functionality

**Check what's missing**:
```bash
npx tsx scripts/check-missing-env.ts
```

---

## 🚨 Important Notes

1. **I only added the variable NAMES** - you need to fill in the VALUES
2. **Never commit `.env.local`** - it's in `.gitignore` for security
3. **Use different keys for dev and production**
4. **Generate NEXTAUTH_SECRET** - don't use placeholder values

---

## 📚 Quick Reference

- **Full Variable Reference**: `ENV_VARIABLES_REFERENCE.md`
- **Auth Setup**: `AUTH_SETUP.md`
- **What's Missing**: `MISSING_ENV_SUMMARY.md`

---

**Summary**: Variables are added ✅ | You need to fill in the values ⚠️
