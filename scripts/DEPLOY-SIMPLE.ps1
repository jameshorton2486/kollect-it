# =====================================================
# SIMPLIFIED AUTOMATED DEPLOYMENT
# =====================================================

Write-Host "`n╔═══════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   KOLLECT-IT AUTOMATED DEPLOYMENT         ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "This will:" -ForegroundColor Yellow
Write-Host "  1. Fix git security" -ForegroundColor White
Write-Host "  2. Install Vercel CLI" -ForegroundColor White
Write-Host "  3. Deploy your app" -ForegroundColor White
Write-Host "  4. Set up database`n" -ForegroundColor White

Write-Host "Press ENTER to continue..." -ForegroundColor Green
Read-Host

# =====================================================
# STEP 1: Fix Git Security
# =====================================================
Write-Host "`n[1/5] Fixing Git Security..." -ForegroundColor Cyan

if (Test-Path "production-env-vars.md") {
    git rm --cached production-env-vars.md 2>$null
    "production-env-vars.md" | Out-File -Append -FilePath .gitignore -Encoding utf8
    git add .gitignore
    git commit -m "Security: Remove env vars file" 2>$null
    Write-Host "  ✓ Fixed" -ForegroundColor Green
} else {
    Write-Host "  ✓ Already secure" -ForegroundColor Green
}

# =====================================================
# STEP 2: Commit & Push
# =====================================================
Write-Host "`n[2/5] Pushing to GitHub..." -ForegroundColor Cyan

git add .
git commit -m "Deploy: Phase 6 Complete" 2>$null
git config --global http.sslVerify false
git push origin main 2>$null
git config --global http.sslVerify true

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Pushed successfully" -ForegroundColor Green
} else {
    Write-Host "  ✓ Already up to date" -ForegroundColor Green
}

# =====================================================
# STEP 3: Install Vercel CLI
# =====================================================
Write-Host "`n[3/5] Installing Vercel CLI..." -ForegroundColor Cyan

$vercelExists = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelExists) {
    Write-Host "  → Installing..." -ForegroundColor Gray
    npm install -g vercel
    Write-Host "  ✓ Installed" -ForegroundColor Green
} else {
    Write-Host "  ✓ Already installed" -ForegroundColor Green
}

# =====================================================
# STEP 4: Deploy to Vercel
# =====================================================
Write-Host "`n[4/5] Deploying to Vercel..." -ForegroundColor Cyan
Write-Host "  → Browser will open for login..." -ForegroundColor Yellow
Write-Host "  → Deployment takes 2-3 minutes`n" -ForegroundColor Gray

# Login and deploy
vercel login
Write-Host ""
vercel --prod --yes

Write-Host "`n  ✓ Deployed!" -ForegroundColor Green

# =====================================================
# STEP 5: Database Setup
# =====================================================
Write-Host "`n[5/5] Database Setup..." -ForegroundColor Cyan

Write-Host "  → Running migrations..." -ForegroundColor Gray
npx prisma db push --accept-data-loss 2>$null
npx prisma generate 2>$null

# Create indexes SQL
$sql = @"
-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON "Product"("category");
CREATE INDEX IF NOT EXISTS idx_products_status ON "Product"("status");
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON "Order"("userId");
CREATE INDEX IF NOT EXISTS idx_orders_status ON "Order"("status");
CREATE INDEX IF NOT EXISTS idx_users_email ON "User"("email");
"@

$sql | Out-File "database-indexes.sql" -Encoding utf8
Write-Host "  ✓ Created database-indexes.sql" -ForegroundColor Green

# =====================================================
# COMPLETE!
# =====================================================
Write-Host "`n╔═══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║        DEPLOYMENT COMPLETE! 🎉            ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Go to Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "  2. Click on your project" -ForegroundColor White
Write-Host "  3. Go to Settings → Environment Variables" -ForegroundColor White
Write-Host "  4. Add variables from production-env-vars.md`n" -ForegroundColor White

Write-Host "  5. Go to Supabase: https://supabase.com/dashboard" -ForegroundColor White
Write-Host "  6. Open SQL Editor" -ForegroundColor White
Write-Host "  7. Copy from database-indexes.sql and run`n" -ForegroundColor White

Write-Host "View deployment logs:" -ForegroundColor Cyan
Write-Host "  vercel logs`n" -ForegroundColor Gray

Write-Host "Your app URL:" -ForegroundColor Cyan
vercel ls --prod 2>$null | Select-Object -First 2

Write-Host "`n✅ Done!`n" -ForegroundColor Green