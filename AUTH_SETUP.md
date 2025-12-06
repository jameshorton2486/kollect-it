# 🔐 Kollect-It Authentication Setup Guide

Complete guide for setting up and troubleshooting authentication in the Kollect-It marketplace.

---

## 📋 Table of Contents

1. [Required Environment Variables](#required-environment-variables)
2. [Database Connection Setup](#database-connection-setup)
3. [Auth Configuration Audit](#auth-configuration-audit)
4. [Password Reset Flow](#password-reset-flow)
5. [Email Configuration (Google Workspace SMTP)](#email-configuration)
6. [Common Issues & Fixes](#common-issues--fixes)
7. [Quick Fix Script](#quick-fix-script)
8. [Files Reference](#files-reference)
9. [Summary Checklist](#summary-checklist)

---

## Required Environment Variables

### CRITICAL - These MUST be set

```env
# Authentication URLs
NEXTAUTH_URL=http://localhost:3000          # Or your production URL
NEXTAUTH_SECRET=<32+ character random string>

# Database Connections
DATABASE_URL=postgresql://...               # Pooled connection (port 6543)
DIRECT_URL=postgresql://...                 # Direct connection (port 5432)
```

### Optional Email Variables (for sending password reset emails)

```env
# If these aren't set, reset URLs are logged to console instead
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@kollect-it.com
EMAIL_PASSWORD=<16-char Google App Password>
EMAIL_FROM="Kollect-It <noreply@kollect-it.com>"
ADMIN_EMAIL=james@kollect-it.com
```

### Generate NEXTAUTH_SECRET

```bash
# Generate a secure 32+ character secret
openssl rand -base64 32
```

---

## Database Connection Setup

### Verify Database Connection

Test the database connection works:

```bash
# Test direct database access
npx tsx scripts/test-db-connection.ts

# Or use Prisma's built-in validator
npx prisma db pull --print
```

### Connection Format

- **DATABASE_URL** (Pooled): `postgresql://user:password@host:6543/database?pgbouncer=true`
- **DIRECT_URL** (Direct): `postgresql://user:password@host:5432/database`

If connection fails:

1. Check DATABASE_URL format includes `?pgbouncer=true` for port 6543
2. Check DIRECT_URL uses port 5432 (no pgbouncer)
3. Verify credentials in Supabase Dashboard → Settings → Database

---

## Auth Configuration Audit

### NextAuth Configuration

The NextAuth configuration is in `src/lib/auth.ts`. Key things to verify:

- ✅ `NEXTAUTH_SECRET` is set in environment
- ✅ Credentials provider is properly configured
- ✅ JWT callbacks are adding user role and ID
- ✅ Sign-in page points to `/admin/login`

### Verify Auth Route Exists

```bash
# Check the route handler exists
ls -la src/app/api/auth/[...nextauth]/route.ts
```

### Check Auth Configuration

The auth is configured to:
- Use JWT strategy for sessions
- Store user role and ID in the token
- Redirect to `/admin/login` for sign-in
- Use enhanced logging for debugging

---

## Password Reset Flow

The password reset system has these components:

1. **Forgot Password Page**: `/forgot-password` → calls `/api/auth/forgot-password`
2. **Reset Email**: Generates token, stores hash in DB, sends email (or logs URL)
3. **Reset Page**: `/reset-password?token=xxx` → verifies token → calls `/api/auth/reset-password`
4. **Confirmation Email**: Optionally sends confirmation after reset

### Test Password Reset Without Email

1. Go to `/forgot-password`
2. Enter a valid user email
3. Check the terminal running `bun run dev` for the reset URL
4. Copy and paste the URL to reset the password

The console output will show:

```
[Auth] Email not configured. Reset URL for user@example.com: 
http://localhost:3000/reset-password?token=abc123...
```

### Password Reset Token Details

- **Expires**: 1 hour after generation
- **Storage**: SHA-256 hash stored in database (never plain text)
- **One-time use**: Token is cleared after successful reset

---

## Email Configuration

### Important: Google Workspace SMTP (Not Resend)

The app uses **Nodemailer with Google Workspace SMTP**, NOT Resend (despite references in `.env.example`).

**Email configuration location**: `src/lib/email.ts`

### Setup Google Workspace SMTP

1. **Enable 2FA** on your Google Workspace account

2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Kollect-It"
   - Copy the 16-character password

3. **Add to `.env.local`**:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@kollect-it.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx   # The 16-char app password
EMAIL_FROM="Kollect-It <noreply@kollect-it.com>"
ADMIN_EMAIL=james@kollect-it.com
```

### Test Email Configuration

```bash
# Send a test email (create a simple test script)
npx tsx -e "
import { sendTestEmail } from './src/lib/email';
sendTestEmail('your-email@example.com').then(console.log);
"
```

### Email Service Features

- ✅ Connection pooling for performance
- ✅ Automatic retry with exponential backoff
- ✅ Error logging and monitoring
- ✅ Falls back to console logging if not configured

---

## Common Issues & Fixes

### Issue: "Invalid credentials" on login

**Causes:**
- User doesn't exist in database
- Password hash is corrupted/null
- Email case sensitivity (database stores lowercase)

**Fix:**
```bash
# Re-create admin user with fresh password hash
npx tsx scripts/create-admin.ts
```

### Issue: "Invalid or expired reset token"

**Causes:**
- Token expired (1 hour limit)
- Token already used
- URL encoding issues

**Fix:** Request a new reset token and use it within 1 hour.

### Issue: "An error occurred" on password reset

**Causes:**
- Database connection failed
- NEXTAUTH_URL not set (reset URL builds incorrectly)

**Fix:**
```bash
# Check NEXTAUTH_URL is set correctly
echo $env:NEXTAUTH_URL   # PowerShell
# or
echo $NEXTAUTH_URL       # Bash
```

### Issue: No reset email received

**Causes:**
- Email not configured (check console for URL)
- Email in spam folder
- Google App Password incorrect

**Fix:** 
- Check terminal for logged reset URL, or
- Verify email configuration (see [Email Configuration](#email-configuration))

### Issue: Database connection fails

**Causes:**
- Incorrect DATABASE_URL format
- Wrong port (should be 6543 for pooled, 5432 for direct)
- Invalid credentials

**Fix:**
```bash
# Test both connections
npx tsx scripts/test-db-connection.ts
npx tsx scripts/test-both-connections.ts
```

---

## Quick Fix Script

Run the comprehensive fix script to diagnose and fix common issues:

```bash
npx tsx scripts/fix-auth.ts
```

This script will:
1. ✅ Test database connection
2. ✅ Check/create admin user
3. ✅ List all users in database
4. ✅ Check environment variables
5. ✅ Validate NEXTAUTH_SECRET length
6. ✅ Verify email configuration

---

## Files Reference

| File | Purpose |
|------|---------|
| `src/lib/auth.ts` | NextAuth configuration |
| `src/lib/email.ts` | Email sending (Nodemailer/SMTP) |
| `src/app/api/auth/[...nextauth]/route.ts` | NextAuth API route |
| `src/app/api/auth/forgot-password/route.ts` | Password reset token generation |
| `src/app/api/auth/reset-password/route.ts` | Password reset execution |
| `src/app/api/auth/verify-reset-token/route.ts` | Token validation |
| `prisma/schema.prisma` | User model with resetToken fields |
| `scripts/create-admin.ts` | User creation script |
| `scripts/fix-auth.ts` | Comprehensive auth fix script |
| `scripts/test-logins.ts` | Credential testing script |
| `check-users.ts` | User listing script |

---

## Summary Checklist

Use this checklist to verify your authentication setup:

- [ ] Database connection works (`npx prisma db pull --print`)
- [ ] Users exist in database (`npx tsx check-users.ts`)
- [ ] Admin user has password hash (`npx tsx scripts/test-logins.ts`)
- [ ] `NEXTAUTH_URL` is set correctly
- [ ] `NEXTAUTH_SECRET` is 32+ characters
- [ ] Can log in at `/admin/login` or `/login`
- [ ] Password reset URLs appear in console (or emails are sent)
- [ ] Reset password flow completes successfully
- [ ] Email configuration works (optional, for production)

---

## Note About Resend vs Google Workspace

The `.env.example` file may mention Resend, but the actual `src/lib/email.ts` implementation uses **Nodemailer with Google Workspace SMTP**. This is the correct configuration:

```env
# CORRECT (what the app actually uses)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@kollect-it.com
EMAIL_PASSWORD=<Google App Password>

# INCORRECT (not implemented)
# RESEND_API_KEY=re_xxx  # This is NOT used
```

If you want to switch to Resend, the `src/lib/email.ts` file would need to be rewritten to use the Resend SDK instead of Nodemailer.

---

## Quick Commands Reference

```bash
# Run fix script
npx tsx scripts/fix-auth.ts

# Create admin user
npx tsx scripts/create-admin.ts

# Check users
npx tsx check-users.ts

# Test database connection
npx tsx scripts/test-db-connection.ts

# Test login credentials
npx tsx scripts/test-logins.ts

# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

---

## Support

If you encounter issues not covered here:

1. Check the terminal logs when running `bun run dev`
2. Review the auth logs in `logs/` directory (if configured)
3. Run `npx tsx scripts/fix-auth.ts` for comprehensive diagnostics
4. Check Vercel dashboard → Logs (if deployed)

---

**Last Updated**: January 2025
**Auth System**: NextAuth.js v4 with Credentials Provider
**Email System**: Nodemailer with Google Workspace SMTP
