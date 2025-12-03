# Environment Variables for Password Reset

## 🔑 Required Variables (Password Reset Won't Work Without These)

Add these to your `.env.local` file:

```env
# Database Connection (REQUIRED)
DATABASE_URL="postgresql://user:password@host:port/database?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://user:password@host:port/database"

# NextAuth Configuration (REQUIRED)
NEXTAUTH_URL="http://localhost:3000"  # Use your production URL in production
NEXTAUTH_SECRET="your-secret-key-at-least-32-characters-long"
```

### How to Get These:

1. **DATABASE_URL & DIRECT_URL**: 
   - From Supabase Dashboard → Settings → Database
   - Copy the "Connection string" (pooled) for DATABASE_URL
   - Copy the "Connection string" (direct) for DIRECT_URL

2. **NEXTAUTH_URL**:
   - **Local development**: `http://localhost:3000`
   - **Production**: Your actual domain (e.g., `https://kollect-it.com`)

3. **NEXTAUTH_SECRET**:
   - Generate a random 32+ character string
   - You can use: `openssl rand -base64 32` or any password generator

---

## 📧 Optional: Email Configuration (For Sending Reset Emails)

If you want password reset **emails** to be sent automatically, add these:

```env
# Email Configuration (OPTIONAL - but recommended)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="noreply@kollect-it.com"
EMAIL_PASSWORD="your-google-app-password"
EMAIL_FROM="Kollect-It <noreply@kollect-it.com>"
ADMIN_EMAIL="james@kollect-it.com"
```

### What Happens Without Email Config?

✅ **Password reset will still work!** 
- The reset URL will be **logged to your console** instead of emailed
- You can copy the URL from the console and use it manually
- This is fine for development/testing

### How to Set Up Gmail SMTP:

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Kollect-It"
   - Copy the 16-character password
3. **Use that password** for `EMAIL_PASSWORD`

---

## 📋 Complete .env.local Example

Here's a complete example for local development:

```env
# ============================================
# REQUIRED - Password Reset Won't Work Without These
# ============================================
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-32-character-secret-key-here-minimum
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres

# ============================================
# OPTIONAL - For Sending Reset Emails
# ============================================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@kollect-it.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM="Kollect-It <noreply@kollect-it.com>"
ADMIN_EMAIL=james@kollect-it.com

# ============================================
# Other Required Variables (for full app functionality)
# ============================================
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your-imagekit-key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_APP_EMAIL=james@kollect-it.com
```

---

## ✅ Testing Password Reset

### Without Email Config (Development):
1. Visit `/forgot-password`
2. Enter your email
3. Check your **console/terminal** for the reset URL
4. Copy and paste the URL into your browser
5. Set your new password

### With Email Config:
1. Visit `/forgot-password`
2. Enter your email
3. Check your email inbox for the reset link
4. Click the link and set your new password

---

## 🔍 Troubleshooting

### "Cannot change password" - Check:

1. **Is DATABASE_URL set?**
   ```powershell
   # Check if it's loaded
   echo $env:DATABASE_URL
   ```

2. **Is NEXTAUTH_URL correct?**
   - Must match your actual URL
   - Local: `http://localhost:3000`
   - Production: `https://kollect-it.com`

3. **Is NEXTAUTH_SECRET at least 32 characters?**
   - Generate a new one if needed

4. **Check console logs:**
   - Look for error messages
   - Look for reset URLs (if email not configured)

5. **Database tables exist?**
   - Make sure you ran the migration
   - User table should have `resetToken` and `resetTokenExpiry` columns

---

## 🚀 Quick Setup Commands

```powershell
# 1. Create .env.local if it doesn't exist
if (!(Test-Path .env.local)) { Copy-Item .env.example .env.local }

# 2. Generate a secure NEXTAUTH_SECRET
# Use: https://generate-secret.vercel.app/32

# 3. Restart your dev server after adding variables
bun run dev
```

---

## 📝 Notes

- **Email is optional** - Password reset works without it (URLs logged to console)
- **Database is required** - Password reset tokens are stored in the database
- **NEXTAUTH_URL must match** - The reset link uses this to build the URL
- **Restart dev server** - After adding/changing .env.local, restart with `bun run dev`

---

**Need help?** Check the console logs - they'll tell you exactly what's missing!
