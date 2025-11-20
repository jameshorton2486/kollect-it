# 🔧 KOLLECT-IT TROUBLESHOOTING GUIDE

**Comprehensive solutions to common issues**

---

## 📑 TABLE OF CONTENTS

1. [Environment & Setup Issues](#environment--setup-issues)
2. [Database Issues](#database-issues)
3. [Authentication Issues](#authentication-issues)
4. [Build & Deployment Issues](#build--deployment-issues)
5. [Stripe Payment Issues](#stripe-payment-issues)
6. [Image Loading Issues](#image-loading-issues)
7. [Email Issues](#email-issues)
8. [Performance Issues](#performance-issues)
9. [Emergency Procedures](#emergency-procedures)

---

## ENVIRONMENT & SETUP ISSUES

### Issue: `bunx: command not found`

**Cause:** System trying to use `bunx` which doesn't work properly.

**Solution:**
Always use `bun x` instead:
```powershell
# Wrong
bun x prisma generate

# Correct
bun x prisma generate
```

**Fix All Instances:**
```powershell
cd C:\Users\james\kollect-it-marketplace-1
.\scripts\verify-bun-commands.ps1
# Should show: "✅ No bun x issues found"
```

---

### Issue: `bun: command not found`

**Cause:** Bun not installed or not in PATH.

**Solution:**
```powershell
# Install Bun
powershell -c "irm bun.sh/install.ps1 | iex"

# Restart PowerShell

# Verify
bun --version
# Should show: 1.1.34 or higher
```

**If still not working after install:**
```powershell
# Check Bun location
$env:PATH

# Should include: C:\Users\james\.bun\bin
# If not, add manually:
$env:PATH += ";C:\Users\james\.bun\bin"
```

---

### Issue: `.env.local` not found

**Cause:** Environment file missing.

**Solution:**
```powershell
cd C:\Users\james\kollect-it-marketplace-1

# Create from template
Copy-Item ".env.example" ".env.local"

# Open in editor
code .env.local

# Fill in all required values (see Manual Plan Step 2)
```

---

### Issue: Missing environment variables

**Cause:** Required variables not set in .env.local.

**Diagnosis:**
```powershell
# Check which variables are missing
bun run scripts/check-env.mjs

# Or manually check .env.local exists and has:
# DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET,
# STRIPE keys, IMAGEKIT keys, RESEND_API_KEY
```

**Solution:**
Add missing variables to .env.local. See Manual Plan Step 2.2 for required values.

---

### Issue: `node_modules` not found

**Cause:** Dependencies not installed.

**Solution:**
```powershell
cd C:\Users\james\kollect-it-marketplace-1

# Install with Bun
bun install

# Verify
Test-Path "node_modules"
# Should return: True
```

---

## DATABASE ISSUES

### Issue: `P1001: Can't reach database server`

**Cause:** Database connection string incorrect or Supabase paused.

**Diagnosis:**
```powershell
# Test connection
bun x prisma db pull
```

**Solutions:**

1. **Check Supabase Status:**
   - Go to https://supabase.com/dashboard
   - Select your project
   - Ensure status is "Active" (not "Paused")

2. **Verify Connection Strings:**
   - In Supabase: Settings → Database
   - Copy "Transaction Pooler" connection (port 6543) → DATABASE_URL
   - Copy "Session Pooler" connection (port 5432) → DIRECT_URL

3. **Check Firewall/Network:**
   ```powershell
   # Test if Supabase is reachable
   Test-NetConnection aws-0-us-east-1.pooler.supabase.com -Port 6543
   ```

---

### Issue: `P2021: Table does not exist`

**Cause:** Database migrations not applied.

**Solution:**
```powershell
cd C:\Users\james\kollect-it-marketplace-1

# Apply all migrations
bun x prisma migrate deploy

# Expected output:
# "✔ All migrations have been successfully applied"
```

**If migrations fail:**
```powershell
# Reset database (WARNING: Deletes all data!)
bun x prisma migrate reset --skip-seed

# Then reapply
bun x prisma migrate deploy
```

---

### Issue: `@prisma/client` not found

**Cause:** Prisma Client not generated.

**Solution:**
```powershell
cd C:\Users\james\kollect-it-marketplace-1

# Generate Prisma Client
bun x prisma generate

# Verify
Test-Path "node_modules\.prisma\client"
# Should return: True
```

---

### Issue: Can't view database tables

**Cause:** Prisma Studio not running or database empty.

**Solution:**
```powershell
# Open Prisma Studio
bun x prisma studio

# Opens at: http://localhost:5555
# If tables are empty but exist, migrations applied correctly
# If tables don't exist, run: bun x prisma migrate deploy
```

---

## AUTHENTICATION ISSUES

### Issue: Admin login fails - "Invalid credentials"

**Cause:** Admin user doesn't exist or wrong password.

**Diagnosis:**
```powershell
# Open Prisma Studio
bun x prisma studio

# Check User table
# Look for: admin@kollect-it.com with role: "admin"
```

**Solution:**
```powershell
# Create admin user
bun run scripts/create-admin.ts

# Use credentials:
# Email: admin@kollect-it.com
# Password: KollectIt@2025Admin
```

---

### Issue: Login redirect loop

**Cause:** NEXTAUTH_URL doesn't match deployment URL.

**Diagnosis:**
Check .env.local (local) or Vercel settings (production):
- Local should be: `http://localhost:3000`
- Production should be: `https://kollect-it.com`

**Solution:**

**For Local:**
```env
# In .env.local
NEXTAUTH_URL="http://localhost:3000"
```

**For Production:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Edit `NEXTAUTH_URL`
3. Change to: `https://kollect-it.com`
4. Redeploy

---

### Issue: "NEXTAUTH_SECRET not set" error

**Cause:** Missing or empty NEXTAUTH_SECRET.

**Solution:**
```powershell
# Generate new secret
$bytes = [System.Byte[]]::new(32)
$rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::new()
$rng.GetBytes($bytes)
$secret = [Convert]::ToBase64String($bytes)

Write-Host "NEXTAUTH_SECRET=$secret"
```

Add to .env.local:
```env
NEXTAUTH_SECRET="[paste generated secret]"
```

For production, add same secret to Vercel environment variables.

---

## BUILD & DEPLOYMENT ISSUES

### Issue: `bun run build` fails with TypeScript errors

**Diagnosis:**
```powershell
# Check for TypeScript errors
bun x tsc --noEmit

# Shows all errors with file locations
```

**Common TypeScript Errors:**

**1. Type mismatch:**
```typescript
// Error: Type 'string' is not assignable to type 'number'

// Fix: Ensure correct type
const price: number = 100; // Not: "100"
```

**2. Missing property:**
```typescript
// Error: Property 'id' does not exist

// Fix: Check Prisma schema and regenerate client
bun x prisma generate
```

**3. Import errors:**
```typescript
// Error: Cannot find module

// Fix: Check import path and file exists
import { Component } from './Component'; // Check spelling
```

---

### Issue: Vercel build fails

**Diagnosis:**
1. Go to Vercel Dashboard → Deployments
2. Click failed deployment
3. Review Build Logs
4. Find first error (scroll up from bottom)

**Common Vercel Build Errors:**

**1. Environment variable missing:**
```
Error: Environment variable DATABASE_URL is not defined
```
**Fix:** Add variable in Vercel → Settings → Environment Variables

**2. Prisma generation fails:**
```
Error: Prisma schema could not be loaded
```
**Fix:** Ensure DATABASE_URL is set in Vercel

**3. Build timeout:**
```
Error: Build exceeded maximum time
```
**Fix:** Check for:
- Very large dependencies
- Infinite loops in build scripts
- Large file generation

---

### Issue: Build succeeds but site doesn't work

**Diagnosis:**
```powershell
# Test build locally first
bun run build

# Start production build locally
bun run start

# Test at: http://localhost:3000
```

**Common Runtime Errors:**

**1. API routes not working:**
- Check Vercel Function Logs
- Verify environment variables set
- Check API route syntax

**2. Database not connecting:**
- Verify DATABASE_URL in Vercel
- Check Supabase project not paused
- Test connection from Vercel location

---

### Issue: `package-lock.json` conflicts

**Cause:** Both npm and Bun used, creating conflicts.

**Solution:**
```powershell
cd C:\Users\james\kollect-it-marketplace-1

# Remove npm artifacts
Remove-Item "package-lock.json" -Force -ErrorAction SilentlyContinue
Remove-Item "node_modules" -Recurse -Force

# Reinstall with Bun only
bun install

# Verify bun.lock exists
Test-Path "bun.lock"
# Should return: True
```

---

## STRIPE PAYMENT ISSUES

### Issue: Test payment fails

**Diagnosis:**
```powershell
# Check Stripe Dashboard
# Go to: https://dashboard.stripe.com → Payments
# Look for failed payment and error message
```

**Common Stripe Errors:**

**1. "Invalid API Key":**
- Check STRIPE_SECRET_KEY in .env.local
- Ensure using correct key (test vs live)
- Verify key starts with `sk_test_` or `sk_live_`

**2. "Webhook signature verification failed":**
- Check STRIPE_WEBHOOK_SECRET matches
- For local: Use Stripe CLI webhook secret
- For production: Use Stripe Dashboard webhook secret

**3. "Payment requires authentication":**
- This is normal for test card 4000 0027 6000 3184
- Use standard test card: 4242 4242 4242 4242

---

### Issue: Webhook events not received

**Diagnosis:**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click your webhook endpoint
3. Check "Recent Events"

**Solutions:**

**For Local Development:**
```powershell
# Ensure Stripe CLI is running
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy webhook signing secret and add to .env.local:
# STRIPE_WEBHOOK_SECRET="whsec_..."
```

**For Production:**
1. Verify webhook URL: `https://kollect-it.com/api/webhooks/stripe`
2. Check webhook secret in Vercel matches Stripe
3. Test with a payment
4. Check webhook delivery attempts in Stripe

---

### Issue: "Stripe is not defined" error

**Cause:** Stripe library not loaded or incorrect import.

**Fix:**
```typescript
// Correct imports:
import Stripe from 'stripe';

// Server-side
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Client-side
import { loadStripe } from '@stripe/stripe-js';
const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
```

---

## IMAGE LOADING ISSUES

### Issue: Images not displaying (404 errors)

**Diagnosis:**
```powershell
# Test ImageKit connection
bun run scripts/test-imagekit.ts
```

**Solutions:**

**1. Check ImageKit credentials:**
```env
# In .env.local, verify:
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="public_..."
IMAGEKIT_PRIVATE_KEY="private_..."
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/[YOUR_ID]"
```

**2. Verify image exists in ImageKit:**
- Go to https://imagekit.io/dashboard
- Click Media Library
- Check if image file exists
- Verify path matches what's in database

**3. Check image URL format:**
```typescript
// Correct format:
const imageUrl = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/products/image.jpg`;

// Not:
const imageUrl = `/products/image.jpg`; // Missing endpoint
```

---

### Issue: Images load but are very slow

**Cause:** Images not optimized or using wrong size.

**Solutions:**

**1. Use ImageKit transformations:**
```typescript
// Add transformation parameters
const imageUrl = `${endpoint}/products/image.jpg?tr=w-800,h-600,q-80`;
// w-800: width 800px
// h-600: height 600px  
// q-80: quality 80%
```

**2. Use Next.js Image component:**
```typescript
import Image from 'next/image';

<Image
  src={imageUrl}
  alt="Product"
  width={800}
  height={600}
  loader={({ src, width, quality }) => {
    return `${src}?tr=w-${width},q-${quality || 75}`;
  }}
/>
```

---

## EMAIL ISSUES

### Issue: Emails not sending

**Diagnosis:**
1. Check Resend Dashboard: https://resend.com/dashboard → Logs
2. Look for recent sends and errors

**Common Causes:**

**1. API key missing:**
```env
# Check .env.local
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@kollect-it.com"
```

**2. Invalid sender email:**
- For testing: Any email works
- For production: Must verify domain first
- Go to Resend → Domains → Add Domain → kollect-it.com

**3. Rate limit reached:**
- Free tier: 100 emails/day
- Check Resend Dashboard → Billing

---

### Issue: Emails going to spam

**Solutions:**

1. **Verify domain in Resend:**
   - Add SPF, DKIM records to DNS
   - Wait for verification (15 minutes)

2. **Use proper sender name:**
```typescript
from: 'Kollect-It <noreply@kollect-it.com>',
// Not just: noreply@kollect-it.com
```

3. **Improve email content:**
   - Include plain text version
   - Avoid spam trigger words
   - Include unsubscribe link

---

## PERFORMANCE ISSUES

### Issue: Slow page loads

**Diagnosis:**
```powershell
# Check Lighthouse score
# In Chrome: F12 → Lighthouse → Analyze
```

**Common Fixes:**

**1. Enable caching:**
```typescript
// In API routes:
export const revalidate = 60; // Cache for 60 seconds
```

**2. Optimize images:**
- Use ImageKit transformations
- Serve WebP format
- Lazy load below fold

**3. Reduce bundle size:**
```powershell
# Analyze bundle
bun run build

# Check output for large chunks
# Consider code splitting for large components
```

---

### Issue: Database queries slow

**Diagnosis:**
```powershell
# Open Prisma Studio
bun x prisma studio

# Check Supabase Dashboard → Reports
# Look for slow queries
```

**Solutions:**

**1. Add indexes:**
Check `prisma/schema.prisma` for:
```prisma
model Product {
  id String @id
  slug String @unique
  categoryId String
  
  @@index([categoryId])  // Add indexes for frequently queried fields
  @@index([createdAt])
}
```

**2. Use Prisma select:**
```typescript
// Only fetch needed fields
const products = await prisma.product.findMany({
  select: {
    id: true,
    title: true,
    price: true,
    // Don't fetch large fields like description unless needed
  }
});
```

---

## EMERGENCY PROCEDURES

### Emergency: Site completely down

**Step 1: Check Service Status**
- Vercel: https://www.vercel-status.com
- Supabase: https://status.supabase.com
- Stripe: https://status.stripe.com

**Step 2: Check Vercel Logs**
1. Go to Vercel Dashboard
2. Click your project
3. Click "Deployments"
4. Click latest deployment
5. Check Function Logs

**Step 3: Rollback Deployment**
If recent deploy broke site:
1. Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

**Step 4: Emergency Fix**
```powershell
# Restore from backup
cd C:\Users\james
Copy-Item "kollect-it-backup-[TIMESTAMP]" `
          "kollect-it-marketplace-1" `
          -Recurse -Force

# Or revert Git commit
cd C:\Users\james\kollect-it-marketplace-1
git log  # Find last working commit
git revert [commit-hash]
git push origin main
```

---

### Emergency: Database corrupted/lost

**Supabase Auto-Backups:**
1. Go to Supabase Dashboard
2. Click "Backups"
3. Select backup point
4. Click "Restore"

**Manual Restore (if you have SQL dump):**
```powershell
# Connect to Supabase
bun x prisma db push

# Or use Supabase SQL editor
# Dashboard → SQL Editor → Run your backup SQL
```

---

### Emergency: Credentials compromised

**If API keys exposed:**

1. **Immediately rotate keys:**
   - **Supabase:** Reset database password
   - **Stripe:** Rotate API keys in Dashboard
   - **ImageKit:** Generate new keys
   - **Resend:** Create new API key

2. **Update everywhere:**
   - Local .env.local
   - Vercel environment variables
   - Any deployment scripts

3. **Check for malicious activity:**
   - Stripe Dashboard → Payments
   - Supabase Dashboard → Activity logs
   - Vercel → Function logs

4. **Revoke Git history (if committed):**
```powershell
# If secrets in Git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.local" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
```

---

### Emergency: Can't access anything

**Complete Reset Procedure:**

```powershell
# 1. Stop all running processes
# Close all terminals, stop dev server

# 2. Delete and restore from backup
cd C:\Users\james
Remove-Item "kollect-it-marketplace-1" -Recurse -Force
Copy-Item "kollect-it-backup-[LATEST]" `
          "kollect-it-marketplace-1" `
          -Recurse

# 3. Reinstall dependencies
cd kollect-it-marketplace-1
Remove-Item "node_modules" -Recurse -Force
bun install

# 4. Reset database
bun x prisma migrate reset --skip-seed
bun x prisma migrate deploy

# 5. Recreate admin
bun run scripts/create-admin.ts

# 6. Test
bun run dev
```

---

## PREVENTIVE MEASURES

### Daily Health Checks

```powershell
# Run every day before working
cd C:\Users\james\kollect-it-marketplace-1

# Quick health check
bun run health-check

# If issues found
bun run error-summary
```

### Weekly Backups

```powershell
# Schedule this weekly
$timestamp = Get-Date -Format "yyyyMMdd"
Copy-Item "C:\Users\james\kollect-it-marketplace-1" `
          "C:\Users\james\kollect-it-backup-$timestamp" `
          -Recurse
```

### Before Every Deploy

```powershell
# Always run before pushing to production
bun run verify-production
# Includes: health-check, typecheck, build

# Only deploy if all pass
if ($LASTEXITCODE -eq 0) {
    git push origin main
}
```

---

## GETTING HELP

### Self-Service Resources

1. **Documentation:**
   - docs/ directory
   - README.md
   - DEPLOYMENT-OVERVIEW.md

2. **Logs:**
   ```powershell
   bun run error-summary
   Get-Content logs\error-*.log -Tail 50
   ```

3. **Health Checks:**
   ```powershell
   bun run health-check
   bun run typecheck
   ```

### External Resources

- **Next.js:** https://nextjs.org/docs
- **Prisma:** https://www.prisma.io/docs
- **Stripe:** https://stripe.com/docs
- **Supabase:** https://supabase.com/docs
- **Bun:** https://bun.sh/docs

### Service Support

- **Vercel:** support@vercel.com
- **Supabase:** https://supabase.com/support
- **Stripe:** https://support.stripe.com
- **ImageKit:** support@imagekit.io
- **Resend:** support@resend.com

---

## DIAGNOSTIC COMMANDS REFERENCE

```powershell
# System health
bun run health-check

# Database status
bun x prisma studio
bun x prisma db pull

# TypeScript check
bun run typecheck
bun x tsc --noEmit

# Build test
bun run build

# Error logs
bun run error-summary
Get-Content logs\error-*.log -Tail 20

# Check for bun x usage
.\scripts\verify-bun-commands.ps1

# Environment check
# Visit: http://localhost:3000/api/diagnostics/check-env

# Git status
git status
git log --oneline -10

# Service connectivity
Test-NetConnection aws-0-us-east-1.pooler.supabase.com -Port 6543
curl -I https://kollect-it.com
```

---

**Remember: Most issues have simple fixes. Check logs, verify environment variables, and test locally first!** 🔧
