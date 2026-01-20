# 📋 Environment Variables Reference

Complete list of all environment variables needed for Kollect-It marketplace.

---

## 🔴 CRITICAL (Required)

These variables are **required** for the application to function:

### Authentication

```env
# NextAuth.js configuration
NEXTAUTH_URL=http://localhost:3000          # Your app URL (http://localhost:3000 for dev)
NEXTAUTH_SECRET=<32+ character random string>  # Generate: openssl rand -base64 32
```

### Database

```env
# Supabase PostgreSQL connections
DATABASE_URL=postgresql://user:password@host:6543/database?pgbouncer=true
DIRECT_URL=postgresql://user:password@host:5432/database
```

### ImageKit (Image CDN)

```env
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_xxxxxxxxxxxx
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id/
IMAGEKIT_PRIVATE_KEY=private_xxxxxxxxxxxx
```

### Stripe (Payment Processing)

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
```

### Google OAuth

```env
GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxx
```

### Application

```env
NEXT_PUBLIC_APP_EMAIL=noreply@kollect-it.com
```

---

## 🟡 RECOMMENDED (Highly Recommended)

These are **highly recommended** for full functionality:

### Email Configuration (Google Workspace SMTP)

```env
# Email service for password resets, notifications, etc.
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@kollect-it.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # 16-character Google App Password
EMAIL_FROM="Kollect-It <noreply@kollect-it.com>"
ADMIN_EMAIL=james@kollect-it.com
```

**Note**: If email is not configured, password reset URLs will be logged to console instead of being emailed.

---

## 🟢 OPTIONAL (Nice to Have)

These variables are optional:

```env
# Google Analytics (optional tracking)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Auto-detected on Vercel, but can be set manually
VERCEL_URL=your-app.vercel.app
```

---

## 📝 Complete .env.local Template

Here's a complete template with all variables:

```env
# ============================================
# CRITICAL - Required Variables
# ============================================

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-32-plus-character-secret-here-generate-with-openssl-rand-base64-32

# Database (Supabase)
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres

# ImageKit (Image CDN)
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_xxxxx
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/xxxxx/
IMAGEKIT_PRIVATE_KEY=private_xxxxx

# Stripe (Payment Processing)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Google OAuth
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx

# Application
NEXT_PUBLIC_APP_EMAIL=noreply@kollect-it.com

# ============================================
# RECOMMENDED - Email Configuration
# ============================================

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@kollect-it.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM="Kollect-It <noreply@kollect-it.com>"
ADMIN_EMAIL=james@kollect-it.com

# ============================================
# OPTIONAL - Analytics & Other
# ============================================

NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 🔍 How to Check What's Missing

Run this script to see what variables are missing from your `.env.local`:

```bash
npx tsx scripts/check-missing-env.ts
```

Or use the existing check script:

```bash
npx tsx scripts/check-env.ts
```

---

## 📚 Setup Guides

- **Authentication Setup**: See `AUTH_SETUP.md`
- **Database Setup**: See Supabase documentation
- **Stripe Setup**: See Stripe dashboard
- **ImageKit Setup**: See ImageKit dashboard
- **Email Setup**: See `AUTH_SETUP.md` → Email Configuration section

---

## 🔐 Security Notes

1. **Never commit `.env.local` to version control**
   - It's already in `.gitignore`
   - Always use `.env.example` as a template

2. **Generate secure secrets**:
   ```bash
   # For NEXTAUTH_SECRET
   openssl rand -base64 32
   ```

3. **Use different keys for development and production**
   - Test keys for development (Stripe, etc.)
   - Production keys only in production environment

4. **Rotate secrets regularly**
   - Especially if compromised
   - Update NEXTAUTH_SECRET periodically

---

## ✅ Quick Verification Checklist

- [ ] All CRITICAL variables are set
- [ ] `NEXTAUTH_SECRET` is 32+ characters
- [ ] `DATABASE_URL` uses port 6543 with `?pgbouncer=true`
- [ ] `DIRECT_URL` uses port 5432 (no pgbouncer)
- [ ] Stripe keys start with correct prefixes (`pk_`, `sk_`, `whsec_`)
- [ ] Email variables are set if you want email functionality
- [ ] All URLs are valid and accessible

---

**Last Updated**: January 2025
