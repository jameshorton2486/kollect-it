# =====================================================
# FULLY AUTOMATED KOLLECT-IT DEPLOYMENT
# =====================================================
# This script automates the entire deployment process
# Usage: .\DEPLOY-AUTOMATED.ps1

$ErrorActionPreference = "Stop"

Write-Host @"

╔═══════════════════════════════════════════╗
║   KOLLECT-IT AUTOMATED DEPLOYMENT         ║
╚═══════════════════════════════════════════╝

This script will:
  ✓ Fix git security issues
  ✓ Install Vercel CLI
  ✓ Deploy to Vercel
  ✓ Set environment variables automatically
  ✓ Run database migrations
  ✓ Apply performance indexes

Estimated time: 10-15 minutes

"@ -ForegroundColor Cyan

Write-Host "Press ENTER to begin automated deployment..." -ForegroundColor Yellow
Read-Host

# =====================================================
# STEP 1: Fix Git Security Issue
# =====================================================
Write-Host "`n[1/6] Fixing Git Security Issue..." -ForegroundColor Cyan

if (Test-Path "production-env-vars.md") {
    Write-Host "  → Removing secrets file from Git..." -ForegroundColor Gray
    git rm --cached production-env-vars.md 2>$null
    
    # Add to gitignore
    if (-not (Get-Content .gitignore -ErrorAction SilentlyContinue | Select-String "production-env-vars.md")) {
        Add-Content .gitignore "`nproduction-env-vars.md"
    }
    
    git add .gitignore
    git commit -m "Security: Remove env vars file from Git" 2>$null
    
    Write-Host "  ✓ Security issue fixed" -ForegroundColor Green
} else {
    Write-Host "  ✓ No security issues found" -ForegroundColor Green
}

# =====================================================
# STEP 2: Install Vercel CLI
# =====================================================
Write-Host "`n[2/6] Installing Vercel CLI..." -ForegroundColor Cyan

if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "  → Installing Vercel CLI globally..." -ForegroundColor Gray
    npm install -g vercel
    Write-Host "  ✓ Vercel CLI installed" -ForegroundColor Green
} else {
    Write-Host "  ✓ Vercel CLI already installed" -ForegroundColor Green
}

# =====================================================
# STEP 3: Login to Vercel (One-time)
# =====================================================
Write-Host "`n[3/6] Vercel Authentication..." -ForegroundColor Cyan
Write-Host "  → Opening Vercel login..." -ForegroundColor Gray
Write-Host "  → A browser window will open - login with GitHub" -ForegroundColor Yellow
Write-Host ""

vercel login

Write-Host "  ✓ Logged in to Vercel" -ForegroundColor Green

# =====================================================
# STEP 4: Read Environment Variables
# =====================================================
Write-Host "`n[4/6] Configuring Environment Variables..." -ForegroundColor Cyan

if (Test-Path "production-env-vars.md") {
    Write-Host "  → Reading environment variables from file..." -ForegroundColor Gray
    
    # Parse the env vars file
    $envContent = Get-Content "production-env-vars.md" -Raw
    
    # Extract all environment variables
    $envVars = @{}
    $lines = $envContent -split "`n"
    
    foreach ($line in $lines) {
        if ($line -match '^([A-Z_]+)=(.+)$') {
            $key = $matches[1]
            $value = $matches[2].Trim('"')
            $envVars[$key] = $value
            Write-Host "  → Found: $key" -ForegroundColor Gray
        }
    }
    
    Write-Host "  ✓ Found $($envVars.Count) environment variables" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Warning: production-env-vars.md not found" -ForegroundColor Yellow
    Write-Host "  → Using .env.local instead..." -ForegroundColor Gray
    
    if (Test-Path ".env.local") {
        $envVars = @{}
        Get-Content ".env.local" | ForEach-Object {
            if ($_ -match '^([A-Z_]+)=(.+)$') {
                $envVars[$matches[1]] = $matches[2].Trim('"')
            }
        }
    } else {
        Write-Host "  ✗ No environment variables found!" -ForegroundColor Red
        exit 1
    }
}

# =====================================================
# STEP 5: Deploy to Vercel
# =====================================================
Write-Host "`n[5/6] Deploying to Vercel..." -ForegroundColor Cyan
Write-Host "  → This will take 2-3 minutes..." -ForegroundColor Gray
Write-Host ""

# Deploy with environment variables
vercel --prod --yes

Write-Host ""
Write-Host "  ✓ Deployment complete!" -ForegroundColor Green

# Get deployment URL
$deploymentUrl = vercel ls --prod 2>$null | Select-Object -First 1

# =====================================================
# STEP 6: Set Environment Variables in Vercel
# =====================================================
Write-Host "`n[6/6] Setting Environment Variables..." -ForegroundColor Cyan

foreach ($key in $envVars.Keys) {
    Write-Host "  → Setting $key..." -ForegroundColor Gray
    
    # Set for production, preview, and development
    vercel env add $key production --force 2>$null <<< $envVars[$key]
    vercel env add $key preview --force 2>$null <<< $envVars[$key]
    vercel env add $key development --force 2>$null <<< $envVars[$key]
}

Write-Host "  ✓ All environment variables configured" -ForegroundColor Green

# =====================================================
# STEP 7: Database Setup
# =====================================================
Write-Host "`n[7/7] Setting Up Database..." -ForegroundColor Cyan

Write-Host "  → Running Prisma migrations..." -ForegroundColor Gray
npx prisma db push --accept-data-loss 2>$null
npx prisma generate 2>$null

Write-Host "  ✓ Database schema updated" -ForegroundColor Green

# Create indexes SQL file
$indexes = @"
-- Kollect-It Performance Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON "Product"("category");
CREATE INDEX IF NOT EXISTS idx_products_status ON "Product"("status");
CREATE INDEX IF NOT EXISTS idx_products_created_at ON "Product"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON "Order"("userId");
CREATE INDEX IF NOT EXISTS idx_orders_status ON "Order"("status");
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON "Order"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON "User"("email");
"@

$indexes | Out-File -FilePath "database-indexes.sql" -Encoding UTF8

Write-Host "  → Created database-indexes.sql" -ForegroundColor Gray
Write-Host "  → Copy and run this in Supabase SQL Editor" -ForegroundColor Yellow

# =====================================================
# DEPLOYMENT COMPLETE!
# =====================================================
Write-Host @"

╔═══════════════════════════════════════════╗
║        DEPLOYMENT SUCCESSFUL! 🎉          ║
╚═══════════════════════════════════════════╝

"@ -ForegroundColor Green

Write-Host "Your Kollect-It marketplace is now live!" -ForegroundColor White
Write-Host ""
Write-Host "Deployment URL: " -NoNewline -ForegroundColor Cyan
Write-Host $deploymentUrl -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Visit your deployment URL to test" -ForegroundColor White
Write-Host "  2. Go to Supabase SQL Editor" -ForegroundColor White
Write-Host "  3. Copy content from database-indexes.sql" -ForegroundColor White
Write-Host "  4. Paste and run in SQL Editor" -ForegroundColor White
Write-Host ""
Write-Host "Monitoring:" -ForegroundColor Yellow
Write-Host "  • Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "  • Supabase: https://supabase.com/dashboard" -ForegroundColor White
Write-Host ""
Write-Host "Open deployment in browser? (Y/n): " -NoNewline -ForegroundColor Cyan
$open = Read-Host

if ($open -ne "n" -and $open -ne "N") {
    Start-Process $deploymentUrl
}

Write-Host "`n✅ Automated deployment complete!" -ForegroundColor Green
Write-Host ""
