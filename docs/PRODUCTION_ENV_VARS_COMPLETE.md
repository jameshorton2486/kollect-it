# 🔐 Kollect-It Production Environment Variables — Complete Checklist

**Last Updated:** 2026-01-21  
**Purpose:** Comprehensive list of ALL production secrets and keys required

---

## ✅ REQUIRED (Application Won't Work Without These)

### Database (Supabase PostgreSQL)
```env
DATABASE_URL=postgresql://postgres.[project]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[project]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```
- [ ] `DATABASE_URL` - Pooled connection (for serverless functions)
- [ ] `DIRECT_URL` - Direct connection (for migrations and Prisma)

**Where to get:** Supabase Dashboard → Project Settings → Database → Connection String

---

### Authentication (NextAuth.js)
```env
NEXTAUTH_URL=https://kollect-it.com
NEXTAUTH_SECRET=<32+ character random string>
```
- [ ] `NEXTAUTH_URL` - Production URL (`https://kollect-it.com`)
- [ ] `NEXTAUTH_SECRET` - Secure random string (min 32 chars)

**How to generate NEXTAUTH_SECRET:**
```powershell
# PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Or use OpenSSL (if available)
openssl rand -base64 32
```

---

### Stripe (Payment Processing) — LIVE MODE
```env
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
- [ ] `STRIPE_SECRET_KEY` - Live secret key (starts with `sk_live_`)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Live publishable key (starts with `pk_live_`)
- [ ] `STRIPE_WEBHOOK_SECRET` - Webhook signing secret (starts with `whsec_`)

**Where to get:**
1. Stripe Dashboard → **Switch to Live mode**
2. API Keys → Copy `sk_live_...` and `pk_live_...`
3. Webhooks → Create endpoint → Copy signing secret

**⚠️ CRITICAL:** Must be LIVE keys, not test keys (`sk_test_` / `pk_test_`)

---

### ImageKit (Image CDN)
```env
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_...
IMAGEKIT_PRIVATE_KEY=private_...
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id/
```
- [ ] `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` - Public key (starts with `public_`)
- [ ] `IMAGEKIT_PRIVATE_KEY` - Private key (starts with `private_`)
- [ ] `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` - Your ImageKit URL endpoint

**Where to get:** ImageKit Dashboard → Developer Options → API Keys

---

### Desktop App Integration
```env
PRODUCT_INGEST_API_KEY=<secure-random-string-16+chars>
```
- [ ] `PRODUCT_INGEST_API_KEY` - Shared secret for desktop app authentication (min 16 chars)

**How to generate:**
```powershell
# PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**⚠️ IMPORTANT:** This must match the key used by the desktop app

---

## 🟡 HIGHLY RECOMMENDED (Core Features Need These)

### Email Service (Zoho Mail SMTP)
```env
EMAIL_HOST=smtp.zoho.com
EMAIL_PORT=587
EMAIL_USER=info@kollect-it.com
EMAIL_PASSWORD=your-zoho-app-password
EMAIL_FROM="Kollect-It <info@kollect-it.com>"
ADMIN_EMAIL=info@kollect-it.com
```
- [ ] `EMAIL_HOST` - SMTP server (smtp.zoho.com)
- [ ] `EMAIL_PORT` - SMTP port (587)
- [ ] `EMAIL_USER` - SMTP username (your Zoho Mail email)
- [ ] `EMAIL_PASSWORD` - Zoho App Password
- [ ] `EMAIL_FROM` - Sender display name and email
- [ ] `ADMIN_EMAIL` - Admin notification recipient

**Where to get:** Zoho Mail → Settings → Security → App Passwords → Generate New Password

**Used for:**
- Password reset emails
- Order confirmations
- Admin notifications

---

### AI Services (Product Analysis)
```env
ANTHROPIC_API_KEY=sk-ant-...
```
- [ ] `ANTHROPIC_API_KEY` - Anthropic/Claude API key (starts with `sk-ant-`)

**Where to get:** Anthropic Console → API Keys → Create Key

**Used for:**
- Product description generation
- Price valuation research
- Image analysis

**Optional:** `OPENAI_API_KEY` (if using GPT-4V for image quality analysis)

---

## 🟢 OPTIONAL (Nice to Have)

**Note:** Kollect-It uses Zoho Mail SMTP via Nodemailer. All email functionality is configured through the SMTP variables above.

---

### Application URL
```env
NEXT_PUBLIC_APP_URL=https://kollect-it.com
```
- [ ] `NEXT_PUBLIC_APP_URL` - Production URL (usually auto-detected by Vercel)

---

### Google OAuth (Optional)
```env
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
```
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth client ID
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

**Where to get:** Google Cloud Console → APIs & Services → Credentials

---

## 📋 QUICK VERIFICATION SCRIPT

Run this to check all required variables in Vercel:

```powershell
.\scripts\verify-vercel-env-final.ps1 -Environment production
```

---

## 🔍 WHERE TO SET THESE IN VERCEL

1. Go to: https://vercel.com/dashboard
2. Select your project: `kollect-it` (or your project name)
3. Click **Settings** → **Environment Variables**
4. For each variable:
   - Click **Add New**
   - Enter variable name
   - Enter variable value
   - Select environment: **Production** (and Preview/Development if needed)
   - Click **Save**

---

## ✅ VERIFICATION CHECKLIST

### Required Variables (Must Have)
- [ ] `DATABASE_URL` - Supabase pooled connection
- [ ] `DIRECT_URL` - Supabase direct connection
- [ ] `NEXTAUTH_SECRET` - 32+ character random string
- [ ] `NEXTAUTH_URL` - `https://kollect-it.com`
- [ ] `STRIPE_SECRET_KEY` - Live key (`sk_live_...`)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Live key (`pk_live_...`)
- [ ] `STRIPE_WEBHOOK_SECRET` - Webhook secret (`whsec_...`)
- [ ] `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` - ImageKit public key
- [ ] `IMAGEKIT_PRIVATE_KEY` - ImageKit private key
- [ ] `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` - ImageKit URL
- [ ] `PRODUCT_INGEST_API_KEY` - Desktop app auth key

### Highly Recommended
- [ ] `EMAIL_HOST` - SMTP server
- [ ] `EMAIL_USER` - SMTP username
- [ ] `EMAIL_PASSWORD` - Google App Password
- [ ] `EMAIL_FROM` - Sender address
- [ ] `ANTHROPIC_API_KEY` - AI product analysis

### Optional
- [ ] `NEXT_PUBLIC_APP_URL` - App URL (auto-detected)
- [ ] `EMAIL_*` variables (Zoho Mail SMTP)
- [ ] `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (if using OAuth)

---

## 🚨 CRITICAL NOTES

1. **Stripe Keys:** Must be LIVE keys (`sk_live_`, `pk_live_`), NOT test keys
2. **NEXTAUTH_SECRET:** Must be unique and secure (32+ characters)
3. **PRODUCT_INGEST_API_KEY:** Must match the key in desktop app's `.env.local`
4. **Database URLs:** Use Supabase connection strings (pooled + direct)
5. **Never commit:** These values should NEVER be in Git or `.env.local` (use placeholders locally)

---

## 📊 SUMMARY BY PRIORITY

| Priority | Count | Variables |
|----------|-------|-----------|
| **Required** | 11 | DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT, PRODUCT_INGEST_API_KEY |
| **Recommended** | 2 | EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD, ANTHROPIC_API_KEY |
| **Optional** | 3-8 | NEXT_PUBLIC_APP_URL, EMAIL_* (if using SMTP), GOOGLE_* (if using OAuth) |

**Total Minimum:** 11 required variables  
**Total Recommended:** 13 variables (11 required + 2 recommended)

---

**Last Updated:** 2026-01-21  
**Next Review:** After production deployment
