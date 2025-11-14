# 🚀 Kollect-It Complete Deployment Guide

## Phase 6: Analytics & Dashboards - Production Ready

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### **CRITICAL: Complete These BEFORE Deployment**

#### 1. LOCAL TESTING (Do This First!)

```powershell
# In your project directory: C:\Users\james\kollect-it-marketplace-1

# Step 1: Clean install (fixes MODULE_NOT_FOUND error)
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force
npm install

# Step 2: Build locally to catch errors
npm run build

# Step 3: Test locally
npm run dev
# Open: http://localhost:3000
```

**✅ Verify Locally:**

- [ ] Homepage loads
- [ ] Login/signup works
- [ ] Product pages display
- [ ] Admin dashboard accessible (if logged in as admin)
- [ ] No console errors in browser DevTools

---

## 🔧 AUTOMATED DEPLOYMENT SCRIPTS

### **Script 1: Pre-Flight Check**

Save as: `scripts/pre-deploy-check.ps1`

```powershell
# Pre-Deployment Verification Script
# Run in PowerShell from project root

Write-Host "🔍 Kollect-It Pre-Deployment Check" -ForegroundColor Cyan
Write-Host "==================================`n" -ForegroundColor Cyan

# Check Node version
Write-Host "✓ Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "  Node.js: $nodeVersion" -ForegroundColor Green

# Check if required files exist
Write-Host "`n✓ Checking required files..." -ForegroundColor Yellow
$requiredFiles = @(
    "package.json",
    "next.config.js",
    ".env.local",
    "prisma/schema.prisma",
    "src/app/layout.tsx"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ MISSING: $file" -ForegroundColor Red
    }
}

# Check environment variables
Write-Host "`n✓ Checking .env.local..." -ForegroundColor Yellow
$envContent = Get-Content .env.local -Raw
$requiredVars = @(
    "DATABASE_URL",
    "NEXTAUTH_URL",
    "NEXTAUTH_SECRET",
    "GOOGLE_CLIENT_ID",
    "IMAGEKIT_PRIVATE_KEY"
)

foreach ($var in $requiredVars) {
    if ($envContent -match $var) {
        Write-Host "  ✓ $var" -ForegroundColor Green
    } else {
        Write-Host "  ✗ MISSING: $var" -ForegroundColor Red
    }
}

# Check Git status
Write-Host "`n✓ Checking Git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "  ⚠ Uncommitted changes detected:" -ForegroundColor Yellow
    Write-Host $gitStatus -ForegroundColor Gray
} else {
    Write-Host "  ✓ Working directory clean" -ForegroundColor Green
}

# Build test
Write-Host "`n✓ Testing build..." -ForegroundColor Yellow
npm run build 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Build successful" -ForegroundColor Green
} else {
    Write-Host "  ✗ Build failed - fix errors before deploying" -ForegroundColor Red
}

Write-Host "`n🎯 Pre-deployment check complete!" -ForegroundColor Cyan
Write-Host "If all checks passed, proceed to deployment.`n" -ForegroundColor Green
```

---

### **Script 2: Vercel Deployment**

Save as: `scripts/deploy-to-vercel.ps1`

```powershell
# Vercel Deployment Script
# Run after pre-flight check passes

Write-Host "🚀 Deploying Kollect-It to Vercel" -ForegroundColor Cyan
Write-Host "==================================`n" -ForegroundColor Cyan

# Ensure all changes committed
Write-Host "✓ Committing changes..." -ForegroundColor Yellow
git add .
$commitMsg = Read-Host "Enter commit message (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    $commitMsg = "Deploy Phase 6: Analytics & Dashboards"
}
git commit -m $commitMsg

# Push to GitHub
Write-Host "`n✓ Pushing to GitHub..." -ForegroundColor Yellow
git config --global http.sslVerify false
git push origin main
git config --global http.sslVerify true

Write-Host "`n✓ Push complete!" -ForegroundColor Green
Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Go to: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Your deployment should auto-trigger" -ForegroundColor White
Write-Host "3. Wait 2-3 minutes for build to complete" -ForegroundColor White
Write-Host "4. Check deployment logs if errors occur`n" -ForegroundColor White
```

---

### **Script 3: Environment Variables Setup**

Save as: `scripts/setup-env-vars.ps1`

```powershell
# Environment Variables Configuration Helper
# Generates .env.production template

Write-Host "⚙️  Environment Variables Setup" -ForegroundColor Cyan
Write-Host "==================================`n" -ForegroundColor Cyan

$envTemplate = @"
# ===== DATABASE =====
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# ===== AUTHENTICATION =====
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="[Run: openssl rand -base64 32]"

# ===== GOOGLE SERVICES =====
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# ===== EMAIL (Google Workspace) =====
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="noreply@your-domain.com"
EMAIL_SERVER_PASSWORD="[Google App Password]"
EMAIL_FROM="noreply@your-domain.com"

# ===== STRIPE =====
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# ===== IMAGEKIT =====
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="your-public-key"
IMAGEKIT_PRIVATE_KEY="your-private-key"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your-id"

# ===== REDIS (Optional) =====
REDIS_URL="redis://default:[password]@[host]:6379"
"@

$envTemplate | Out-File -FilePath ".env.production" -Encoding UTF8

Write-Host "✓ Created .env.production template" -ForegroundColor Green
Write-Host "`n📋 Action Items:" -ForegroundColor Cyan
Write-Host "1. Open .env.production in your editor" -ForegroundColor White
Write-Host "2. Replace all [PLACEHOLDER] values" -ForegroundColor White
Write-Host "3. Copy these to Vercel Dashboard → Settings → Environment Variables" -ForegroundColor White
Write-Host "4. DO NOT commit .env.production to Git!`n" -ForegroundColor Yellow
```

---

### **Script 4: Database Setup**

Save as: `scripts/setup-database.ps1`

```powershell
# Database Migration & Optimization
# Run AFTER deploying to Vercel

Write-Host "🗄️  Database Setup & Optimization" -ForegroundColor Cyan
Write-Host "==================================`n" -ForegroundColor Cyan

Write-Host "✓ Running Prisma migrations..." -ForegroundColor Yellow
npx prisma migrate deploy

Write-Host "`n✓ Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

Write-Host "`n✓ Creating performance indexes..." -ForegroundColor Yellow
Write-Host "  Copy and run these in Supabase SQL Editor:`n" -ForegroundColor Gray

$indexes = @"
-- Product Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON "Product"("category");
CREATE INDEX IF NOT EXISTS idx_products_status ON "Product"("status");
CREATE INDEX IF NOT EXISTS idx_products_created_at ON "Product"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_products_price ON "Product"("price");
CREATE INDEX IF NOT EXISTS idx_products_featured ON "Product"("featured") WHERE "featured" = true;

-- Order Indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON "Order"("userId");
CREATE INDEX IF NOT EXISTS idx_orders_status ON "Order"("status");
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON "Order"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_orders_total ON "Order"("total");
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON "Order"("paymentStatus");

-- OrderItem Indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON "OrderItem"("orderId");
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON "OrderItem"("productId");

-- User Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON "User"("email");
CREATE INDEX IF NOT EXISTS idx_users_role ON "User"("role");
CREATE INDEX IF NOT EXISTS idx_users_created_at ON "User"("createdAt" DESC);

-- Composite Indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON "Order"("userId", "status");
CREATE INDEX IF NOT EXISTS idx_products_category_status ON "Product"("category", "status");
"@

$indexes | Out-File -FilePath "database-indexes.sql" -Encoding UTF8
Write-Host $indexes -ForegroundColor Gray

Write-Host "`n✓ Saved to: database-indexes.sql" -ForegroundColor Green
Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Go to Supabase Dashboard → SQL Editor" -ForegroundColor White
Write-Host "2. Copy content from database-indexes.sql" -ForegroundColor White
Write-Host "3. Paste and run in SQL Editor`n" -ForegroundColor White
```

---

## 📝 STEP-BY-STEP DEPLOYMENT PROCESS

### **PHASE 1: Pre-Deployment (15 minutes)**

#### Step 1.1: Fix Node Module Error

```powershell
cd C:\Users\james\kollect-it-marketplace-1

# Clean install
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm cache clean --force
npm install
```

#### Step 1.2: Local Testing

```powershell
# Build to verify no errors
npm run build

# Test locally
npm run dev
```

**Test these pages locally:**

- [ ] http://localhost:3000 (Homepage)
- [ ] http://localhost:3000/products (Product listings)
- [ ] http://localhost:3000/admin (Admin dashboard - requires login)
- [ ] http://localhost:3000/api/health (API health check)

#### Step 1.3: Run Pre-Flight Check

```powershell
# Save the script above, then run:
.\scripts\pre-deploy-check.ps1
```

---

### **PHASE 2: Vercel Setup (20 minutes)**

#### Step 2.1: Create Vercel Account/Project

1. Go to: https://vercel.com/signup
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Import `jameshorton2486/kollect-it`
5. **STOP! Don't click Deploy yet**

#### Step 2.2: Configure Build Settings

**Framework Preset:** Next.js
**Build Command:** `npm run build`
**Output Directory:** `.next`
**Install Command:** `npm install`

#### Step 2.3: Add Environment Variables

Click "Environment Variables" and add ALL from `.env.production`

**Quick copy format (one per line):**

```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-here
... (all others)
```

**Important:**

- Select "Production, Preview, Development" for all variables
- Click "Add" after each one

#### Step 2.4: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes
3. Check build logs for errors
4. If successful, copy your deployment URL

---

### **PHASE 3: Database Configuration (10 minutes)**

#### Step 3.1: Update Database Connection

1. Go to Supabase Dashboard
2. Settings → Database
3. Copy connection string
4. Update in Vercel: Settings → Environment Variables → `DATABASE_URL`

#### Step 3.2: Run Migrations

```powershell
# Ensure DATABASE_URL in .env.local points to production
npx prisma migrate deploy
npx prisma generate
```

#### Step 3.3: Apply Performance Indexes

```powershell
# Generate SQL file
.\scripts\setup-database.ps1

# Then in Supabase:
# 1. Go to SQL Editor
# 2. Copy content from database-indexes.sql
# 3. Click "Run"
```

---

### **PHASE 4: Third-Party Services (30 minutes)**

#### Step 4.1: Google Analytics

1. Go to: https://analytics.google.com/
2. Admin → Create Property
3. Property name: "Kollect-It Marketplace"
4. Get Measurement ID (G-XXXXXXXXXX)
5. Add to Vercel environment variables:
   - `GOOGLE_ANALYTICS_ID`
   - `GA_MEASUREMENT_ID`

#### Step 4.2: Google Workspace Email

1. Go to: https://myaccount.google.com/apppasswords
2. Enable 2-Step Verification (if not enabled)
3. Create app password:
   - App: Mail
   - Device: Kollect-It Server
4. Copy 16-character password
5. Add to Vercel:
   - `EMAIL_SERVER_PASSWORD=your-app-password`

**Test email:**

```powershell
curl -X POST https://your-app.vercel.app/api/admin/emails/test `
  -H "Content-Type: application/json" `
  -d '{"to":"your-email@domain.com"}'
```

#### Step 4.3: Stripe Webhooks

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "+ Add endpoint"
3. Endpoint URL: `https://your-app.vercel.app/api/webhooks/stripe`
4. Select events:
   - `payment_intent.succeeded`
   - `checkout.session.completed`
   - `charge.succeeded`
5. Copy webhook secret
6. Add to Vercel: `STRIPE_WEBHOOK_SECRET`

---

### **PHASE 5: Post-Deployment Testing (20 minutes)**

#### Step 5.1: Health Checks

```powershell
# Replace YOUR-APP with your Vercel URL

# API Health
curl https://YOUR-APP.vercel.app/api/health

# Database Connection
curl https://YOUR-APP.vercel.app/api/admin/dashboard/metrics
```

#### Step 5.2: Admin Dashboard Testing

1. Go to: `https://YOUR-APP.vercel.app/admin`
2. Login as admin
3. Test each page:
   - [ ] Dashboard (metrics load)
   - [ ] Sales Analytics (charts render)
   - [ ] Product Analytics (data displays)
   - [ ] Orders (list loads)
   - [ ] Products (CRUD operations)
   - [ ] Settings (save works)

#### Step 5.3: Mobile Testing

1. Open on mobile device
2. Test admin dashboard responsiveness
3. Verify hamburger menu works
4. Check touch targets (buttons clickable)

---

### **PHASE 6: Monitoring Setup (10 minutes)**

#### Step 6.1: Enable Vercel Analytics

1. Vercel Dashboard → Project → Analytics
2. Enable Speed Insights (free)
3. Enable Web Analytics (free)

#### Step 6.2: Set Up Alerts

1. Vercel → Settings → Notifications
2. Enable:
   - [ ] Deployment failed
   - [ ] Domain configuration
   - [ ] Build errors

---

## 🔍 TESTING CHECKLIST

### **Critical Functionality**

- [ ] User registration works
- [ ] User login works
- [ ] Products display correctly
- [ ] Product search functional
- [ ] Shopping cart works
- [ ] Checkout process complete
- [ ] Admin login restricted
- [ ] Admin dashboard loads
- [ ] Analytics display data
- [ ] Email notifications send

### **Performance Metrics**

- [ ] Homepage loads < 2 seconds
- [ ] API responses < 500ms
- [ ] No console errors
- [ ] Images load from ImageKit
- [ ] Mobile responsive
- [ ] No layout shifts

---

## 🚨 TROUBLESHOOTING COMMON ISSUES

### Issue 1: Build Fails on Vercel

**Solution:**

```powershell
# Check build locally first
npm run build

# If error, check:
# 1. TypeScript errors
# 2. Missing environment variables
# 3. Import paths (use @ aliases)
```

### Issue 2: Database Connection Fails

**Solution:**

1. Verify DATABASE_URL format
2. Check Supabase is using port 5432 (not 6543)
3. Ensure IP allowlist includes Vercel

### Issue 3: Module Not Found Errors

**Solution:**

```powershell
# Clean reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Issue 4: Images Don't Load

**Solution:**

1. Verify ImageKit credentials in environment variables
2. Check ImageKit dashboard for API limits
3. Regenerate API keys if needed

### Issue 5: Email Doesn't Send

**Solution:**

1. Verify Google App Password (not regular password)
2. Check 2-Step Verification enabled
3. Test SMTP settings:

```
Host: smtp.gmail.com
Port: 587
```

---

## 📊 SUCCESS METRICS

### Day 1 (Immediate)

- [ ] All pages load without errors
- [ ] Admin can login and access dashboard
- [ ] Analytics show initial data
- [ ] Error rate < 1%

### Week 1

- [ ] Uptime > 99.5%
- [ ] Average page load < 2s
- [ ] No critical bugs reported
- [ ] Email notifications working

### Month 1

- [ ] Google Analytics tracking users
- [ ] Performance metrics stable
- [ ] Database optimized
- [ ] Zero security incidents

---

## 🎯 QUICK REFERENCE COMMANDS

```powershell
# Local Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npx prisma studio       # Open database GUI
npx prisma db push      # Push schema changes
npx prisma migrate deploy  # Run migrations

# Git
git add .               # Stage changes
git commit -m "message" # Commit changes
git push origin main    # Push to GitHub

# Deployment
vercel                  # Deploy to preview
vercel --prod          # Deploy to production
vercel logs            # View deployment logs
```

---

## 📞 SUPPORT RESOURCES

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Supabase Docs:** https://supabase.com/docs

---

## ✅ DEPLOYMENT COMPLETE

Once all phases are complete, your Kollect-It marketplace is live!

**Final Steps:**

1. Monitor for 24-48 hours
2. Gather user feedback
3. Address any issues
4. Plan Phase 7 features

**Congratulations! 🎉**
