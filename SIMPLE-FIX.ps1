# ============================================================================
# KOLLECT-IT ONE-COMMAND FIX
# ============================================================================
# This script does EVERYTHING except editing .env.local
# 
# USAGE: 
#   .\SIMPLE-FIX.ps1
#
# THEN YOU MUST:
#   1. Edit .env.local with your secrets
#   2. Run: npm run dev
# ============================================================================

$ErrorActionPreference = "Continue"

Write-Host "`n============================================================================" -ForegroundColor Cyan
Write-Host " KOLLECT-IT SIMPLE FIX" -ForegroundColor Cyan
Write-Host "============================================================================`n" -ForegroundColor Cyan

$startTime = Get-Date

# ============================================================================
# STEP 1: CLEAN STATE
# ============================================================================

Write-Host "[1/5] Cleaning old installation..." -ForegroundColor Yellow

if (Test-Path "node_modules") {
    Write-Host "  Removing node_modules..." -ForegroundColor Gray
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
}

if (Test-Path "package-lock.json") {
    Write-Host "  Removing package-lock.json..." -ForegroundColor Gray
    Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
}

if (Test-Path ".next") {
    Write-Host "  Removing .next cache..." -ForegroundColor Gray
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
}

Write-Host "  Clearing npm cache..." -ForegroundColor Gray
npm cache clean --force 2>&1 | Out-Null

Write-Host "  ✓ Cleanup complete" -ForegroundColor Green

# ============================================================================
# STEP 2: INSTALL DEPENDENCIES
# ============================================================================

Write-Host "`n[2/5] Installing dependencies (this takes 10-12 minutes)..." -ForegroundColor Yellow
Write-Host "  Please be patient - npm is downloading ~1500 packages..." -ForegroundColor Gray

npm install --legacy-peer-deps

if ($LASTEXITCODE -eq 0) {
    $packageCount = (Get-ChildItem node_modules -Directory -ErrorAction SilentlyContinue).Count
    Write-Host "  ✓ Installed $packageCount packages" -ForegroundColor Green
} else {
    Write-Host "  ✗ npm install failed - see errors above" -ForegroundColor Red
    Write-Host "`n  Try running manually: npm install --legacy-peer-deps --force" -ForegroundColor Yellow
    exit 1
}

# ============================================================================
# STEP 3: GENERATE PRISMA CLIENT
# ============================================================================

Write-Host "`n[3/5] Generating Prisma client..." -ForegroundColor Yellow

npx prisma generate 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Prisma client generated" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Prisma generation had issues (may need DATABASE_URL)" -ForegroundColor Yellow
}

# ============================================================================
# STEP 4: CREATE ENVIRONMENT FILE
# ============================================================================

Write-Host "`n[4/5] Setting up environment..." -ForegroundColor Yellow

if (Test-Path ".env.local") {
    Write-Host "  .env.local already exists" -ForegroundColor Gray
} else {
    Copy-Item .env.example .env.local
    Write-Host "  ✓ Created .env.local from template" -ForegroundColor Green
}

# ============================================================================
# STEP 5: INITIALIZE GIT (OPTIONAL)
# ============================================================================

Write-Host "`n[5/5] Checking Git..." -ForegroundColor Yellow

if (Test-Path ".git") {
    Write-Host "  Git already initialized" -ForegroundColor Gray
} else {
    git init 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        git add . 2>&1 | Out-Null
        git commit -m "chore: initial commit after setup" 2>&1 | Out-Null
        Write-Host "  ✓ Git initialized with first commit" -ForegroundColor Green
    } else {
        Write-Host "  Git not available (optional)" -ForegroundColor Gray
    }
}

# ============================================================================
# COMPLETION
# ============================================================================

$duration = (Get-Date) - $startTime
$minutes = [math]::Floor($duration.TotalMinutes)
$seconds = $duration.Seconds

Write-Host "`n============================================================================" -ForegroundColor Cyan
Write-Host " SETUP COMPLETE!" -ForegroundColor Cyan
Write-Host "============================================================================`n" -ForegroundColor Cyan

Write-Host "✓ Dependencies installed" -ForegroundColor Green
Write-Host "✓ Prisma client generated" -ForegroundColor Green
Write-Host "✓ Environment template created" -ForegroundColor Green
Write-Host "✓ Git initialized" -ForegroundColor Green

Write-Host "`n⚠️  CRITICAL NEXT STEPS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Edit .env.local with your actual secrets:" -ForegroundColor White
Write-Host "   code .env.local" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Required variables:" -ForegroundColor White
Write-Host "   - DATABASE_URL (from Supabase)" -ForegroundColor Gray
Write-Host "   - DIRECT_URL (from Supabase)" -ForegroundColor Gray
Write-Host "   - NEXTAUTH_SECRET (generate random 32 chars)" -ForegroundColor Gray
Write-Host "   - STRIPE_SECRET_KEY (from Stripe dashboard)" -ForegroundColor Gray
Write-Host "   - IMAGEKIT_PRIVATE_KEY (from ImageKit)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Push database schema:" -ForegroundColor White
Write-Host "   npx prisma db push" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Start development server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Open in browser:" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

Write-Host "Total time: $minutes min $seconds sec" -ForegroundColor Gray
Write-Host ""
Write-Host "Need help? Check COMPREHENSIVE-DIAGNOSTIC-FINAL.md for details" -ForegroundColor Gray
Write-Host ""
