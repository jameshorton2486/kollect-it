# 📋 KOLLECT-IT MANUAL EXECUTION PLAN

**For:** You (James) to execute in PowerShell and service dashboards  
**Time:** 3-4 hours (can be broken into 2-hour sessions)  
**Prerequisites:** Windows PC, PowerShell, admin access to all services

---

## 🎯 OVERVIEW

This plan covers 9 major steps:
0. Safety & Backup (10 min)
1. Install Bun (15 min)
2. Fix Environment Variables (20 min)
3. Database Setup (20 min)
4. Local Testing (30 min)
5. External Services (45 min)
6. Vercel Preparation (30 min)
7. Production Deployment (15 min)
8. Post-Deployment Verification (20 min)

**Total:** 3-4 hours

---

# STEP 0: SAFETY & BACKUP (10 minutes)

## 0.1 Create Full Backup

Open PowerShell and run:

```powershell
# Navigate to parent directory
cd C:\Users\james

# Create timestamped backup
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$source = "C:\Users\james\kollect-it-marketplace-1"
$destination = "C:\Users\james\kollect-it-backup-$timestamp"

Write-Host "Creating backup..." -ForegroundColor Cyan
Copy-Item $source $destination -Recurse -Force

Write-Host "✅ Backup created: $destination" -ForegroundColor Green
Write-Host "Size: $((Get-ChildItem $destination -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB) MB" -ForegroundColor Green
```

## 0.2 Verify Git Status

```powershell
cd C:\Users\james\kollect-it-marketplace-1

# Check current branch
git branch --show-current
# Should show: main

# Check for uncommitted changes
git status

# If there are uncommitted changes:
if ((git status --porcelain).Length -gt 0) {
    Write-Host "⚠️  Uncommitted changes found. Committing..." -ForegroundColor Yellow
    git add .
    git commit -m "Pre-production checkpoint - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    git push origin main
    Write-Host "✅ Changes committed and pushed" -ForegroundColor Green
} else {
    Write-Host "✅ No uncommitted changes" -ForegroundColor Green
}
```

## 0.3 Create Checkpoint Tag

```powershell
# Tag this point in case you need to rollback
git tag "pre-production-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
git push origin --tags

Write-Host "✅ Git tag created" -ForegroundColor Green
```

**✅ CHECKPOINT 0:** Backup created, code committed, tag created

---

# STEP 1: INSTALL BUN & CLEAN ARTIFACTS (15 minutes)

## 1.1 Check if Bun is Already Installed

```powershell
# Test if Bun exists
$bunExists = Get-Command bun -ErrorAction SilentlyContinue

if ($bunExists) {
    $version = bun --version
    Write-Host "✅ Bun already installed: v$version" -ForegroundColor Green
} else {
    Write-Host "⚠️  Bun not found. Installing..." -ForegroundColor Yellow
}
```

## 1.2 Install Bun (if needed)

```powershell
# Only run if Bun not installed
if (-not $bunExists) {
    # Install Bun
    powershell -c "irm bun.sh/install.ps1 | iex"
    
    Write-Host "⚠️  RESTART PowerShell now, then continue from Step 1.3" -ForegroundColor Yellow
    # User must restart PowerShell here
}
```

**⚠️ If you just installed Bun: CLOSE and REOPEN PowerShell before continuing!**

## 1.3 Verify Bun Installation

```powershell
# Run this in NEW PowerShell window
bun --version

# Should show something like: 1.1.34

# Verify installation location
Write-Host "Bun location: $(Get-Command bun).Source" -ForegroundColor Cyan
```

## 1.4 Remove npm Artifacts

```powershell
cd C:\Users\james\kollect-it-marketplace-1

Write-Host "Cleaning npm artifacts..." -ForegroundColor Cyan

# Remove package-lock.json
if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json" -Force
    Write-Host "✅ Removed package-lock.json" -ForegroundColor Green
} else {
    Write-Host "✓ No package-lock.json found" -ForegroundColor Gray
}

# Remove node_modules (will reinstall with Bun)
if (Test-Path "node_modules") {
    Write-Host "Removing node_modules (this takes 30-60 seconds)..." -ForegroundColor Yellow
    Remove-Item "node_modules" -Recurse -Force
    Write-Host "✅ Removed node_modules" -ForegroundColor Green
} else {
    Write-Host "✓ No node_modules found" -ForegroundColor Gray
}

# Remove .bun cache (optional but recommended)
if (Test-Path ".bun") {
    Remove-Item ".bun" -Recurse -Force
    Write-Host "✅ Removed .bun cache" -ForegroundColor Green
}
```

## 1.5 Install Dependencies with Bun

```powershell
cd C:\Users\james\kollect-it-marketplace-1

Write-Host "Installing dependencies with Bun..." -ForegroundColor Cyan
Write-Host "This will take 2-4 minutes..." -ForegroundColor Yellow

# Install all dependencies
bun install

# Verify installation
if (Test-Path "node_modules") {
    $moduleCount = (Get-ChildItem node_modules -Directory).Count
    Write-Host "✅ Dependencies installed: $moduleCount packages" -ForegroundColor Green
} else {
    Write-Host "❌ Installation failed - node_modules not created" -ForegroundColor Red
    Write-Host "Try running: bun install --verbose" -ForegroundColor Yellow
    exit 1
}
```

**✅ CHECKPOINT 1:** Bun installed, npm artifacts removed, dependencies installed with Bun

---

# STEP 2: FIX CRITICAL ENVIRONMENT VARIABLES (20 minutes)

## 2.1 Verify .env.local Exists

```powershell
cd C:\Users\james\kollect-it-marketplace-1

if (Test-Path ".env.local") {
    Write-Host "✅ .env.local exists" -ForegroundColor Green
} else {
    Write-Host "⚠️  Creating .env.local from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "✅ Created .env.local" -ForegroundColor Green
}

# Open in VS Code
code .env.local
```

## 2.2 Critical Production Blockers - Fix These Now!

Open `.env.local` in VS Code and verify/update these values:

### 🚨 BLOCKER #1: NEXTAUTH_URL

**For LOCAL development (keep this for now):**
```env
NEXTAUTH_URL="http://localhost:3000"
```

**Note:** You'll change this to `https://kollect-it.com` in Vercel later (Step 6).

### 🚨 BLOCKER #2: NEXTAUTH_SECRET

If this is missing or looks like a placeholder:

```powershell
# Generate a secure secret
$bytes = [System.Byte[]]::new(32)
$rng = [System.Security.Cryptography.RNGCryptoServiceProvider]::new()
$rng.GetBytes($bytes)
$secret = [Convert]::ToBase64String($bytes)

Write-Host "Your NEXTAUTH_SECRET:"
Write-Host $secret -ForegroundColor Green
Write-Host ""
Write-Host "Copy this and paste it in .env.local as:"
Write-Host 'NEXTAUTH_SECRET="' -NoNewline
Write-Host $secret -ForegroundColor Cyan -NoNewline
Write-Host '"'
```

### 🚨 BLOCKER #3: RESEND_API_KEY

**Action Required:** Get API key from Resend

1. Go to https://resend.com
2. Sign up (free tier: 100 emails/day)
3. After signup, click **API Keys** in sidebar
4. Click **Create API Key**
5. Name it: "Kollect-It Production"
6. Copy the key (starts with `re_`)

Add to .env.local:
```env
RESEND_API_KEY="re_[PASTE_YOUR_KEY_HERE]"
EMAIL_FROM="noreply@kollect-it.com"
```

### 🚨 BLOCKER #4: STRIPE_WEBHOOK_SECRET (LOCAL)

**For local testing, you need Stripe CLI:**

```powershell
# Check if Stripe CLI installed
$stripeExists = Get-Command stripe -ErrorAction SilentlyContinue

if (-not $stripeExists) {
    Write-Host "Installing Stripe CLI..." -ForegroundColor Cyan
    winget install stripe.stripe-cli
    Write-Host "✅ Stripe CLI installed" -ForegroundColor Green
    Write-Host "⚠️  Restart PowerShell, then continue" -ForegroundColor Yellow
    # Restart required
}
```

**After restart (if you installed Stripe CLI):**

```powershell
# Login to Stripe
stripe login
# Opens browser, authorize the CLI

# Start webhook listener (keep this running in a separate PowerShell window)
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# This outputs a webhook signing secret like: whsec_...
# Copy it and add to .env.local:
```

```env
STRIPE_WEBHOOK_SECRET="whsec_[PASTE_LOCAL_SECRET_HERE]"
```

**Note:** This is only for local testing. You'll create a production webhook in Step 6.

## 2.3 Verify All Required Variables

Run this verification script:

```powershell
cd C:\Users\james\kollect-it-marketplace-1

# Check for required variables
$required = @(
    'DATABASE_URL',
    'DIRECT_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY',
    'IMAGEKIT_PRIVATE_KEY',
    'NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT',
    'RESEND_API_KEY',
    'ADMIN_EMAIL'
)

Write-Host "Checking environment variables..." -ForegroundColor Cyan
$envContent = Get-Content ".env.local" -Raw

$missing = @()
foreach ($var in $required) {
    if ($envContent -notmatch "$var=") {
        $missing += $var
        Write-Host "❌ Missing: $var" -ForegroundColor Red
    } else {
        Write-Host "✅ Found: $var" -ForegroundColor Green
    }
}

if ($missing.Count -gt 0) {
    Write-Host ""
    Write-Host "⚠️  Missing $($missing.Count) required variables" -ForegroundColor Yellow
    Write-Host "Add these to .env.local before continuing" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "✅ All required variables present!" -ForegroundColor Green
}
```

## 2.4 Example Complete .env.local

Your file should look like this (with your actual values):

```env
# DATABASE (Supabase)
DATABASE_URL="postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# NEXTAUTH
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[YOUR_GENERATED_SECRET]"

# STRIPE (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # Local webhook secret from Stripe CLI

# IMAGEKIT
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="public_..."
IMAGEKIT_PRIVATE_KEY="private_..."
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/[YOUR_ID]"

# EMAIL (Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@kollect-it.com"

# AI SERVICES (Optional)
CLAUDE_API_KEY="sk-ant-api03-..." # Optional
OPENAI_API_KEY="sk-..." # Optional

# ADMIN
ADMIN_EMAIL="admin@kollect-it.com"

# SITE URLs (Local Development)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NODE_ENV="development"
```

**✅ CHECKPOINT 2:** All critical environment variables set in .env.local

---

# STEP 3: SUPABASE DATABASE SETUP (20 minutes)

## 3.1 Verify Supabase Connection

1. Open browser: https://supabase.com/dashboard
2. Sign in
3. Select your **Kollect-It** project
4. Check project status: Should be **Active** (not paused)

## 3.2 Verify Connection Strings

In Supabase Dashboard:
1. Click **Settings** (gear icon)
2. Click **Database**
3. Scroll to **Connection String**

**Transaction Pooler (port 6543):**
```
postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```
→ This should match your `DATABASE_URL` in .env.local

**Session Pooler (port 5432):**
```
postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```
→ This should match your `DIRECT_URL` in .env.local

**If they don't match:** Update .env.local with the correct strings.

## 3.3 Test Database Connection

```powershell
cd C:\Users\james\kollect-it-marketplace-1

Write-Host "Testing database connection..." -ForegroundColor Cyan

# Test connection
bun x prisma db pull

# Expected output: "Prisma schema loaded from prisma/schema.prisma"
# If you see this, connection works!
```

**If connection fails:**
- Verify DATABASE_URL and DIRECT_URL are correct
- Check Supabase project is not paused
- Check your IP is not blocked (Supabase → Settings → Database → Connection pooling)

## 3.4 Generate Prisma Client

```powershell
cd C:\Users\james\kollect-it-marketplace-1

Write-Host "Generating Prisma Client..." -ForegroundColor Cyan
bun x prisma generate

# Expected output: "✔ Generated Prisma Client"
```

## 3.5 Apply Database Migrations

```powershell
cd C:\Users\james\kollect-it-marketplace-1

Write-Host "Applying database migrations..." -ForegroundColor Cyan
bun x prisma migrate deploy

# Expected output:
# "X migrations found in prisma/migrations"
# "✔ All migrations have been successfully applied"
```

## 3.6 Verify Tables in Database

```powershell
# Open Prisma Studio to view database
bun x prisma studio

# Opens in browser at http://localhost:5555
```

**In Prisma Studio, verify these tables exist:**
- ✅ User
- ✅ Product
- ✅ Category
- ✅ Order
- ✅ OrderItem
- ✅ CartItem
- ✅ WishlistItem
- ✅ Image
- ✅ Review
- ✅ ScheduledReport
- ✅ ReportAuditLog
- ✅ AIGeneratedProduct

**If tables are missing:**
```powershell
# Reset and re-run migrations
bun x prisma migrate reset --skip-seed
bun x prisma migrate deploy
```

## 3.7 Create Admin User

```powershell
cd C:\Users\james\kollect-it-marketplace-1

Write-Host "Creating admin user..." -ForegroundColor Cyan
bun run scripts/create-admin.ts

# Expected output:
# "✅ Admin user created successfully"
# "Email: admin@kollect-it.com"
# "Password: KollectIt@2025Admin"
```

**WRITE DOWN THESE CREDENTIALS:**
- Email: `admin@kollect-it.com`
- Password: `KollectIt@2025Admin` (or custom if script prompts)

**Verify admin exists:**
```powershell
# In Prisma Studio (should still be open at localhost:5555)
# Click "User" table
# You should see admin@kollect-it.com with role: "admin"
```

**✅ CHECKPOINT 3:** Database connected, migrations applied, admin user created

---

# STEP 4: LOCAL DEVELOPMENT TESTING (30 minutes)

## 4.1 Start Development Server

Open a NEW PowerShell window (keep Stripe CLI running in other window):

```powershell
cd C:\Users\james\kollect-it-marketplace-1

# Enable file logging
$env:LOG_TO_FILE = "true"

Write-Host "Starting development server..." -ForegroundColor Cyan
Write-Host "This will take 30-60 seconds..." -ForegroundColor Yellow

# Start dev server
bun run dev
```

**Expected output:**
```
  ▲ Next.js 15.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in [time]ms
```

**If server fails to start:**
- Check for error messages
- Verify all environment variables set
- Check port 3000 not in use: `netstat -ano | findstr :3000`

## 4.2 Test Homepage

Open browser: **http://localhost:3000**

**Check:**
- [ ] Homepage loads without errors
- [ ] No console errors (F12 → Console tab)
- [ ] Images load (if any products exist)
- [ ] Navigation menu works
- [ ] Footer displays

**If page doesn't load:**
- Check PowerShell for error messages
- Check browser console for errors
- Verify server is running

## 4.3 Test Admin Login

Open browser: **http://localhost:3000/admin/login**

**Login with:**
- Email: `admin@kollect-it.com`
- Password: `KollectIt@2025Admin`

**Check:**
- [ ] Login form appears
- [ ] After login, redirects to `/admin/dashboard`
- [ ] No console errors

**If login fails:**
- Verify admin user exists in Prisma Studio
- Check NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL is `http://localhost:3000`

## 4.4 Test Admin Dashboard

After logging in, you should see: **http://localhost:3000/admin/dashboard**

**Check:**
- [ ] Metrics display (Revenue, Orders, Products, Customers)
- [ ] Charts render
- [ ] No console errors
- [ ] Sidebar navigation works
- [ ] Can click different menu items

**Explore these pages:**
- Orders: http://localhost:3000/admin/orders
- Products (approval queue): http://localhost:3000/admin/products
- Analytics: http://localhost:3000/admin/analytics
- Settings: http://localhost:3000/admin/settings

## 4.5 Test Checkout Flow (If Products Exist)

**If you have products:**

1. Go to homepage: http://localhost:3000
2. Find a product
3. Click "Add to Cart"
4. Go to cart: http://localhost:3000/cart
5. Click "Checkout"
6. Fill in shipping info
7. Use Stripe test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/25`
   - CVC: `123`
8. Complete payment

**Check:**
- [ ] Payment processes successfully
- [ ] Order created in database
- [ ] Email sent (check Resend dashboard)
- [ ] No console errors

**If no products exist yet:**
Skip this test for now. You'll add products after deployment.

## 4.6 Check Error Logs

```powershell
cd C:\Users\james\kollect-it-marketplace-1

# Check if logs directory created
if (Test-Path "logs") {
    Write-Host "✅ Logs directory exists" -ForegroundColor Green
    
    # Check for recent errors
    $errorLogs = Get-ChildItem "logs" -Filter "error-*.log" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    
    if ($errorLogs) {
        Write-Host "Most recent error log:"
        Get-Content $errorLogs.FullName -Tail 20
    } else {
        Write-Host "✅ No error logs" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  Logs directory not created yet" -ForegroundColor Yellow
}
```

## 4.7 Final Local Verification Checklist

**Before proceeding to deployment:**

- [ ] ✅ Dev server starts without errors
- [ ] ✅ Homepage loads
- [ ] ✅ Admin login works
- [ ] ✅ Admin dashboard displays correctly
- [ ] ✅ No critical console errors
- [ ] ✅ Test payment works (if tested)

**If any of these fail:** Check 04-TROUBLESHOOTING.md before proceeding.

**✅ CHECKPOINT 4:** Local site fully functional

---

# STEP 5: EXTERNAL SERVICES VERIFICATION (45 minutes)

## 5.1 Stripe Platform Audit (15 minutes)

**Dashboard:** https://dashboard.stripe.com

### 5.1.1 Verify API Keys

1. Go to **Developers → API keys**
2. Verify you're in **Test mode** (toggle in top-right)
3. Check keys match .env.local:
   - Publishable key: `pk_test_...`
   - Secret key: `sk_test_...`

### 5.1.2 Verify Local Webhook (Already Running)

1. Go to **Developers → Webhooks**
2. You should see webhook from Stripe CLI (if still running)
3. Or re-start it:

```powershell
# In separate PowerShell window
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### 5.1.3 Test Payment Verification

1. Go to **Payments** in Stripe Dashboard
2. If you completed a test checkout, you should see it here
3. Click on payment to see details

### 5.1.4 Note for Production

**You'll create a DIFFERENT webhook for production in Step 6.**

## 5.2 ImageKit Platform Audit (10 minutes)

**Dashboard:** https://imagekit.io/dashboard

### 5.2.1 Verify Credentials

1. Click **Developer options** → **API keys**
2. Verify keys match .env.local:
   - [ ] Public key: `public_...`
   - [ ] Private key: `private_...`
   - [ ] URL endpoint: `https://ik.imagekit.io/[YOUR_ID]`

### 5.2.2 Verify Folder Structure

1. Click **Media library**
2. Ensure these folders exist:
   - `/products`
   - `/categories`
   - `/thumbnails`

**If folders don't exist:**
- Click **New folder** button
- Create each folder

### 5.2.3 Test Upload (Optional)

```powershell
cd C:\Users\james\kollect-it-marketplace-1

# Test ImageKit connection
bun run scripts/test-imagekit.ts

# Should output: "✅ ImageKit connection successful"
```

## 5.3 Resend Platform Audit (10 minutes)

**Dashboard:** https://resend.com/dashboard

### 5.3.1 Verify API Key

1. Click **API Keys** in sidebar
2. Verify key you created exists
3. Key should match RESEND_API_KEY in .env.local

### 5.3.2 Check Email Sends (If You Tested Checkout)

1. Click **Logs** in sidebar
2. Should see recent email if you tested checkout
3. Click email to see details

### 5.3.3 Domain Verification (Production Only - Skip for Now)

**For production emails (later):**
1. Click **Domains** → **Add Domain**
2. Enter: `kollect-it.com`
3. Add DNS records to your registrar
4. Wait for verification (~15 minutes)

**Skip this for now** - you'll do it after deployment if needed.

## 5.4 Supabase Platform Audit (5 minutes)

**Dashboard:** https://supabase.com/dashboard

### 5.4.1 Verify Project Status

1. Select Kollect-It project
2. Check status: **Active** (not paused)
3. Check region: Should be near your users

### 5.4.2 Check Database Size

1. Go to **Database** → **Roles**
2. Note current database size
3. Free tier: 500MB limit

### 5.4.3 Check Table Structure

1. Go to **Table Editor**
2. Verify tables exist:
   - User, Product, Category, Order, etc.

## 5.5 Vercel Platform Check (5 minutes)

**Dashboard:** https://vercel.com/dashboard

### 5.5.1 Verify Project Exists

1. Look for "kollect-it" project
2. If it exists: Great! Note the URL
3. If not: You'll create it in Step 6

### 5.5.2 Check GitHub Connection

1. If project exists, click it
2. Go to **Settings** → **Git**
3. Verify connected to: `jameshorton2486/kollect-it`

**If project doesn't exist yet:** You'll create it in Step 6.

**✅ CHECKPOINT 5:** All external services verified and ready

---

# STEP 6: VERCEL DEPLOYMENT PREPARATION (30 minutes)

## 6.1 Connect Vercel Project to GitHub (if not already)

**Dashboard:** https://vercel.com/dashboard

### If Project Already Exists:
- Skip to 6.2

### If Project Doesn't Exist:

1. Click **Add New** → **Project**
2. Click **Import** next to your GitHub repo: `kollect-it`
3. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (default)
   - **Build Command:** Leave default
   - **Output Directory:** Leave default
4. Click **Deploy** (we'll cancel this)
5. Click **Cancel Deployment** (we're not ready yet)

## 6.2 Configure Production Environment Variables

**CRITICAL:** Vercel needs ALL environment variables.

1. Go to project → **Settings** → **Environment Variables**
2. For each variable below, click **Add New**
3. **Environment:** Select **Production**

### Add These Variables:

```env
# DATABASE (Same as local)
DATABASE_URL = [Your Supabase pooled connection]
DIRECT_URL = [Your Supabase direct connection]

# NEXTAUTH (DIFFERENT from local!)
NEXTAUTH_URL = https://kollect-it.com
NEXTAUTH_SECRET = [Same as local]

# STRIPE (Test mode for now)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = [Same as local OR pk_live_... for production]
STRIPE_SECRET_KEY = [Same as local OR sk_live_... for production]
STRIPE_WEBHOOK_SECRET = [Production webhook - see Step 6.3]

# IMAGEKIT (Same as local)
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY = [Same as local]
IMAGEKIT_PRIVATE_KEY = [Same as local]
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT = [Same as local]

# EMAIL (Same as local)
RESEND_API_KEY = [Same as local]
EMAIL_FROM = noreply@kollect-it.com

# AI SERVICES (Optional - same as local)
CLAUDE_API_KEY = [Same as local if you have it]
OPENAI_API_KEY = [Same as local if you have it]

# SITE CONFIG (Production URLs)
ADMIN_EMAIL = admin@kollect-it.com
NEXT_PUBLIC_APP_URL = https://kollect-it.com
NEXT_PUBLIC_SITE_URL = https://kollect-it.com
NODE_ENV = production

# GOOGLE DRIVE (Optional - only if using)
GOOGLE_DRIVE_FOLDER_ID = [Same as local if you have it]
GOOGLE_CLIENT_EMAIL = [Same as local if you have it]
GOOGLE_PRIVATE_KEY = [Same as local if you have it]
GOOGLE_DRIVE_REFRESH_TOKEN = [Same as local if you have it]
```

**⚠️ IMPORTANT:** For STRIPE_WEBHOOK_SECRET, we'll get the production value in Step 6.3.

## 6.3 Create Production Stripe Webhook

**Dashboard:** https://dashboard.stripe.com

**CRITICAL:** Must do BEFORE deploying!

1. Go to **Developers → Webhooks**
2. Click **Add endpoint**
3. Configure:
   - **Endpoint URL:** `https://kollect-it.com/api/webhooks/stripe`
   - **Description:** Kollect-It Production
   - **Version:** Latest API version
   - **Events to listen to:** Select these events:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.refunded`
4. Click **Add endpoint**
5. Click **Reveal** next to **Signing secret**
6. Copy the secret (starts with `whsec_`)
7. Go back to Vercel → Settings → Environment Variables
8. Update `STRIPE_WEBHOOK_SECRET` with this production value

## 6.4 Configure Build Settings

**In Vercel:**

1. Go to **Settings** → **General**
2. Verify:
   - **Framework:** Next.js
   - **Node.js Version:** 20.x (or latest)
3. Go to **Settings** → **Build & Development**
4. Update if needed:
   - **Build Command:** `bun install && bun x prisma generate && bun run build`
   - **Install Command:** `bun install`

## 6.5 Pre-Deployment Build Test

**Test locally that build works:**

```powershell
cd C:\Users\james\kollect-it-marketplace-1

Write-Host "Testing production build..." -ForegroundColor Cyan
Write-Host "This will take 1-3 minutes..." -ForegroundColor Yellow

# Run production build
bun run build

# Expected output:
# ✓ Creating an optimized production build
# ✓ Compiled successfully
# ✓ Collecting page data
# ✓ Generating static pages
# ✓ Finalizing page optimization

Write-Host "Build time:" (Measure-Command { bun run build }).TotalSeconds "seconds"
```

**If build fails:**
```powershell
# Check for TypeScript errors
bun x tsc --noEmit

# Check for Prisma issues
bun x prisma generate

# Try build again
bun run build
```

**Don't proceed until build succeeds locally!**

## 6.6 Final Pre-Deploy Checklist

```powershell
cd C:\Users\james\kollect-it-marketplace-1

Write-Host "Pre-deployment checklist:" -ForegroundColor Cyan
Write-Host ""

# Check 1: Clean git status
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "❌ Uncommitted changes" -ForegroundColor Red
} else {
    Write-Host "✅ Git clean" -ForegroundColor Green
}

# Check 2: .env.local not in git
if (git ls-files | Select-String ".env.local") {
    Write-Host "❌ .env.local is tracked in git!" -ForegroundColor Red
} else {
    Write-Host "✅ .env.local not tracked" -ForegroundColor Green
}

# Check 3: package-lock.json not in git
if (git ls-files | Select-String "package-lock.json") {
    Write-Host "⚠️  package-lock.json in git" -ForegroundColor Yellow
} else {
    Write-Host "✅ No package-lock.json" -ForegroundColor Green
}

# Check 4: Build succeeds
Write-Host "⏳ Testing build..." -ForegroundColor Yellow
$buildResult = bun run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build succeeds" -ForegroundColor Green
} else {
    Write-Host "❌ Build fails" -ForegroundColor Red
}
```

## 6.7 Commit and Push Final Changes

```powershell
cd C:\Users\james\kollect-it-marketplace-1

# Stage all changes
git add .

# Commit with timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
git commit -m "Production ready: $timestamp"

# Push to GitHub (triggers Vercel deployment)
git push origin main

Write-Host "✅ Code pushed to GitHub" -ForegroundColor Green
Write-Host "🚀 Deployment will start automatically in Vercel" -ForegroundColor Cyan
```

**✅ CHECKPOINT 6:** Vercel configured, environment variables set, code pushed

---

# STEP 7: PRODUCTION DEPLOYMENT (15 minutes)

## 7.1 Monitor Deployment in Vercel

1. Go to **Vercel Dashboard** → Your Project
2. Click **Deployments** tab
3. Watch latest deployment:

**Deployment Stages:**
```
🔄 Queued (10-30 seconds)
🔄 Building (2-5 minutes)
   - Installing dependencies
   - Generating Prisma Client
   - Building application
   - Optimizing assets
🔄 Deploying (30-60 seconds)
✅ Ready
```

## 7.2 Watch Build Logs

Click the deployment → **Building** tab

**Watch for these successes:**
```
✓ bun install
✓ bun x prisma generate
✓ bun run build
✓ Optimizing pages
✓ Compiled successfully
```

**If build fails:**
1. Click **Function Logs**
2. Find first error
3. Fix issue locally
4. Push fix: `git commit -am "Fix: [issue]" && git push`
5. Wait for new deployment

## 7.3 Configure Custom Domain

**In Vercel:**

1. Go to **Settings** → **Domains**
2. Click **Add**
3. Enter: `kollect-it.com`
4. Click **Add**

**Vercel will show DNS records to add:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## 7.4 Update DNS at Registrar

**Go to your domain registrar (Bluehost, GoDaddy, etc.):**

1. Find DNS management
2. Add/Update these records:

```
Type: A
Host: @
Points to: 76.76.21.21
TTL: Automatic
```

```
Type: CNAME
Host: www
Points to: cname.vercel-dns.com
TTL: Automatic
```

3. Save changes
4. DNS propagation: 5-60 minutes

## 7.5 Verify SSL Certificate

**In Vercel:**

1. Go to **Settings** → **Domains**
2. Wait for `kollect-it.com` to show ✅ Valid
3. SSL certificate auto-provisions (5-10 minutes)

## 7.6 Test Production URLs

**Wait for DNS propagation, then test:**

```powershell
# Test DNS resolution
nslookup kollect-it.com

# Test HTTPS
curl -I https://kollect-it.com

# Should return: 200 OK
```

**In browser:**
- https://kollect-it.com
- https://www.kollect-it.com

Both should load with 🔒 (SSL valid)

**✅ CHECKPOINT 7:** Production site deployed and accessible

---

# STEP 8: POST-DEPLOYMENT VERIFICATION (20 minutes)

## 8.1 Test Production Homepage

Open: **https://kollect-it.com**

**Check:**
- [ ] Page loads without errors
- [ ] SSL certificate valid (🔒 in browser)
- [ ] No console errors (F12 → Console)
- [ ] Images load (if products exist)
- [ ] Navigation works
- [ ] Footer displays

## 8.2 Test Production Admin Login

Open: **https://kollect-it.com/admin/login**

**Login with:**
- Email: `admin@kollect-it.com`
- Password: `KollectIt@2025Admin`

**Check:**
- [ ] Login form loads
- [ ] Can login successfully
- [ ] Redirects to dashboard
- [ ] No console errors

## 8.3 Test Production Admin Dashboard

After login: **https://kollect-it.com/admin/dashboard**

**Check:**
- [ ] Metrics display
- [ ] Charts render
- [ ] Database connected (data loads)
- [ ] No console errors
- [ ] All pages accessible

## 8.4 Test Production Payment (Use Test Card)

**If you have products:**

1. Go to https://kollect-it.com
2. Add product to cart
3. Proceed to checkout
4. Use Stripe test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/25`
   - CVC: `123`
5. Complete payment

**Check:**
- [ ] Payment processes
- [ ] Order created in database
- [ ] Email sent (check Resend dashboard)
- [ ] Webhook received (check Stripe dashboard → Webhooks)

## 8.5 Verify Stripe Webhook

**Dashboard:** https://dashboard.stripe.com

1. Go to **Developers → Webhooks**
2. Click your production endpoint
3. Check **Recent Events**
4. Should show events from test payment

**If no events showing:**
- Verify webhook URL is correct
- Check webhook secret in Vercel matches
- Try another test payment

## 8.6 Run Lighthouse Audit

**In Chrome:**

1. Open: https://kollect-it.com
2. Press F12 → **Lighthouse** tab
3. Select: Performance, Accessibility, Best Practices, SEO
4. Click **Analyze page load**

**Target Scores:**
- Performance: 90+ ✅
- Accessibility: 90+ ✅
- Best Practices: 90+ ✅
- SEO: 90+ ✅

**If scores are low:**
- Check Performance tips
- Optimize images
- Fix accessibility issues

## 8.7 Security Headers Check

```powershell
# Test security headers
$response = Invoke-WebRequest -Uri "https://kollect-it.com" -Method Head
$response.Headers

# Should include:
# X-Content-Type-Options: nosniff
# X-Frame-Options: SAMEORIGIN
# X-XSS-Protection: 1; mode=block
```

## 8.8 Enable Monitoring

### Vercel Analytics:

1. Go to **Analytics** tab in Vercel
2. Click **Enable Analytics**
3. Free tier: 100k requests/month

### Vercel Web Vitals:

1. Go to **Speed Insights** tab
2. Click **Enable**
3. Tracks Core Web Vitals

### Error Tracking:

**Already configured in your codebase:**
- Error logs to `logs/` directory
- Enhanced logger with redaction
- API error handling

## 8.9 Production Verification Checklist

**Complete this checklist:**

- [ ] ✅ Site loads at https://kollect-it.com
- [ ] ✅ SSL certificate valid
- [ ] ✅ Admin login works
- [ ] ✅ Admin dashboard displays
- [ ] ✅ Test payment processes
- [ ] ✅ Webhook events received
- [ ] ✅ No console errors
- [ ] ✅ Lighthouse score >90
- [ ] ✅ Analytics enabled
- [ ] ✅ DNS working (both www and non-www)

## 8.10 Document Production Details

**Save this information:**

```
PRODUCTION DEPLOYMENT
Date: [TODAY'S DATE]
Vercel Project: kollect-it
Production URL: https://kollect-it.com
Git Commit: [Get with: git rev-parse HEAD]
Deployment ID: [From Vercel]

Admin Credentials:
Email: admin@kollect-it.com
Password: KollectIt@2025Admin

External Services:
- Supabase: [Project name]
- Stripe: Test mode (use live keys when ready)
- ImageKit: [URL endpoint]
- Resend: [API key last 4 digits]

Notes:
[Any issues encountered]
[Next steps]
```

**✅ CHECKPOINT 8:** Production site fully verified and operational!

---

# 🎉 CONGRATULATIONS!

Your Kollect-It marketplace is now LIVE IN PRODUCTION!

## What You've Accomplished:
- ✅ Installed Bun and set up environment
- ✅ Configured database with Supabase
- ✅ Created admin user
- ✅ Tested locally
- ✅ Configured all external services
- ✅ Deployed to Vercel
- ✅ Configured custom domain with SSL
- ✅ Verified everything works

## Your Site is Now:
- 🌐 Live at https://kollect-it.com
- 🔒 Secured with SSL
- 💳 Processing payments (test mode)
- 📧 Sending emails
- 🎨 Optimizing images
- 📊 Tracking analytics

## Next Steps:

1. **Switch to Stripe Live Mode (when ready):**
   - Get live API keys
   - Update in Vercel
   - Test with real card

2. **Add Products:**
   - Use admin panel to add products
   - Upload images
   - Set prices

3. **Configure Domain Email (optional):**
   - Verify domain in Resend
   - Change EMAIL_FROM to your@kollect-it.com

4. **Run Autonomous Plan (recommended):**
   - Open 02-AUTONOMOUS-PLAN.md
   - Let AI agent clean up code
   - Takes 45-60 minutes

5. **Launch Marketing:**
   - Announce to customers
   - Share on social media
   - Start selling!

---

## 📊 Time Tracking

**Record your actual time:**

- Step 0: _____ minutes (target: 10)
- Step 1: _____ minutes (target: 15)
- Step 2: _____ minutes (target: 20)
- Step 3: _____ minutes (target: 20)
- Step 4: _____ minutes (target: 30)
- Step 5: _____ minutes (target: 45)
- Step 6: _____ minutes (target: 30)
- Step 7: _____ minutes (target: 15)
- Step 8: _____ minutes (target: 20)

**Total: _____ hours**

---

## 🔧 If You Encountered Issues:

Check **04-TROUBLESHOOTING.md** for solutions to common problems.

---

## 📝 Post-Launch Notes:

Record any issues, learnings, or modifications:

```
[Your notes here]
```

---

**You did it! Your marketplace is live! 🚀**
