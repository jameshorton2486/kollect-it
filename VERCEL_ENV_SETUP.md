# Vercel Environment Variables Setup Guide

## Issue: NEXTAUTH_URL Missing in Production

Your production deployment needs `NEXTAUTH_URL` to be set correctly.

---

## Quick Fix

### Step 1: Add NEXTAUTH_URL to Vercel

Run this command in your terminal:

```powershell
vercel env add NEXTAUTH_URL production
```

**When prompted:**
- **Value:** Enter `https://kollect-it-marketplace-1.vercel.app`
- **Apply to:** Select `Production` (and optionally Preview/Development)

### Step 2: Verify It Was Added

```powershell
vercel env ls | Select-String "NEXTAUTH"
```

You should see:
```
NEXTAUTH_URL    production    https://kollect-it-marketplace-1.vercel.app
```

### Step 3: Redeploy

```powershell
vercel --prod
```

---

## Complete Environment Variables Checklist

### Required for Production:

| Variable | Value | Status |
|----------|-------|--------|
| `NEXTAUTH_URL` | `https://kollect-it-marketplace-1.vercel.app` | ⚠️ Add if missing |
| `NEXTAUTH_SECRET` | (32+ character secret) | ⚠️ Add if missing |
| `DATABASE_URL` | (Your database URL) | ✅ Should exist |
| `DIRECT_URL` | (Your direct DB URL) | ✅ Should exist |

### Optional but Recommended:

- `NEXT_PUBLIC_SITE_URL` - `https://kollect-it-marketplace-1.vercel.app`
- `STRIPE_SECRET_KEY` - For payments
- `IMAGEKIT_PRIVATE_KEY` - For image hosting
- Other service API keys

---

## Adding Multiple Environment Variables

### For Production:
```powershell
vercel env add NEXTAUTH_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production
```

### For All Environments (Production + Preview + Development):
```powershell
vercel env add NEXTAUTH_URL
# Select: Production, Preview, Development
```

---

## Generate NEXTAUTH_SECRET

If you need to generate a new secret:

```powershell
# PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))

# Or use OpenSSL (if installed)
openssl rand -base64 32
```

---

## Verify All Variables

```powershell
# List all environment variables
vercel env ls

# Check specific variable
vercel env ls | Select-String "NEXTAUTH"
vercel env ls | Select-String "DATABASE"
```

---

## After Adding Variables

1. **Redeploy to apply changes:**
   ```powershell
   vercel --prod
   ```

2. **Test production:**
   - Visit: https://kollect-it-marketplace-1.vercel.app
   - Try logging in
   - Check for authentication errors

---

## Troubleshooting

### "NEXTAUTH_URL is not set"
- ✅ Run: `vercel env add NEXTAUTH_URL production`
- ✅ Enter: `https://kollect-it-marketplace-1.vercel.app`
- ✅ Redeploy: `vercel --prod`

### "Invalid NEXTAUTH_SECRET"
- ✅ Generate a new secret (see above)
- ✅ Run: `vercel env add NEXTAUTH_SECRET production`
- ✅ Enter the generated secret
- ✅ Redeploy

### Variables not updating after redeploy
- Wait 1-2 minutes for Vercel to sync
- Check Vercel dashboard → Settings → Environment Variables
- Force a new deployment: `vercel --prod --force`

---

## Localhost Note

For local development, make sure `.env.local` has:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
```

**Note:** Use `http://localhost:3000` (not `http://localhost:300`)

---

## Quick Reference Commands

```powershell
# Add environment variable
vercel env add VARIABLE_NAME production

# List all variables
vercel env ls

# Remove variable (if needed)
vercel env rm VARIABLE_NAME production

# Redeploy production
vercel --prod
```

---

**After completing these steps, your production site should work correctly!** 🎉
