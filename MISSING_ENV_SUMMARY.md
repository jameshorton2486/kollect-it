# 🔍 Missing Environment Variables Summary

Based on codebase analysis, here are all the environment variables you need for Kollect-It:

---

## 🔴 CRITICAL - Must Have (App won't work without these)

Based on `src/lib/env.ts` validation, these are **required**:

### 1. Authentication (NextAuth.js)
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<32+ character random string>
```
- **Generate NEXTAUTH_SECRET**: `openssl rand -base64 32`

### 2. Database (Supabase PostgreSQL)
```env
DATABASE_URL=postgresql://user:password@host:6543/database?pgbouncer=true
DIRECT_URL=postgresql://user:password@host:5432/database
```

### 3. ImageKit (Image CDN)
```env
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_xxxxx
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/xxxxx/
IMAGEKIT_PRIVATE_KEY=private_xxxxx
```

### 4. Stripe (Payment Processing)
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### 5. Google OAuth
```env
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
```

### 6. Application Email
```env
NEXT_PUBLIC_APP_EMAIL=noreply@kollect-it.com
```

---

## 🟡 RECOMMENDED - Highly Recommended

### Email Configuration (Google Workspace SMTP)

**Note**: The app uses **Nodemailer with Google Workspace SMTP**, NOT Resend.

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@kollect-it.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # 16-character Google App Password
EMAIL_FROM="Kollect-It <noreply@kollect-it.com>"
ADMIN_EMAIL=james@kollect-it.com
```

**Without email config**: Password reset URLs will be logged to console instead of being emailed.

---

## 🟢 OPTIONAL

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Google Analytics
```

---

## 📋 Quick Check Commands

### Check what's missing:
```bash
# Use the comprehensive script
npx tsx scripts/check-missing-env.ts

# Or the existing script (needs updating)
npx tsx scripts/check-env.ts
```

### Fix authentication issues:
```bash
npx tsx scripts/fix-auth.ts
```

### Check users in database:
```bash
npx tsx check-users.ts
```

---

## 📝 Complete Template

Copy this into your `.env.local` and fill in the values:

```env
# ============================================
# 🔴 CRITICAL - Required
# ============================================

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# Database
DATABASE_URL=
DIRECT_URL=

# ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=
IMAGEKIT_PRIVATE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Application
NEXT_PUBLIC_APP_EMAIL=noreply@kollect-it.com

# ============================================
# 🟡 RECOMMENDED - Email (Google Workspace SMTP)
# ============================================

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@kollect-it.com
EMAIL_PASSWORD=
EMAIL_FROM="Kollect-It <noreply@kollect-it.com>"
ADMIN_EMAIL=james@kollect-it.com

# ============================================
# 🟢 OPTIONAL
# ============================================

NEXT_PUBLIC_GA_ID=
```

---

## 📚 Documentation

- **Full Auth Setup**: `AUTH_SETUP.md`
- **Complete Reference**: `ENV_VARIABLES_REFERENCE.md`
- **Main README**: `README.md`

---

## ⚠️ Important Notes

1. **Email uses Google Workspace SMTP** (not Resend)
   - Some docs may mention Resend, but code uses Nodemailer
   - See `src/lib/email.ts` for implementation

2. **DIRECT_URL is recommended** (not in old check script)
   - Needed for Prisma migrations
   - Use port 5432 (no pgbouncer)

3. **NEXTAUTH_SECRET must be 32+ characters**
   - Shorter secrets will cause validation errors

4. **Password reset works without email**
   - URLs are logged to console if email not configured
   - Check terminal when running `bun run dev`

---

**To find out exactly what YOU are missing**, run:

```bash
npx tsx scripts/check-missing-env.ts
```

This will check your actual `.env.local` file and tell you what's missing!
