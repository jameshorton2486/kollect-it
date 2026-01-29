# Fix Secret Exposure in Git History
# This script removes commits containing secrets and prevents future exposure

Write-Host "🔒 Fixing secret exposure in Git history..." -ForegroundColor Yellow

# Step 1: Ensure .env.final is in .gitignore
Write-Host "`n1. Checking .gitignore..." -ForegroundColor Cyan
$gitignoreContent = Get-Content .gitignore -Raw
if ($gitignoreContent -notmatch ".env.final") {
  Add-Content -Path .gitignore -Value "`n# Environment files with secrets (auto-added)`n.env.final`n*.env.final"
  Write-Host "   ✅ Added .env.final to .gitignore" -ForegroundColor Green
}
else {
  Write-Host "   ✅ .env.final already in .gitignore" -ForegroundColor Green
}

# Step 2: Remove .env.final from tracking
Write-Host "`n2. Removing .env.final from Git tracking..." -ForegroundColor Cyan
if (Test-Path .env.final) {
  git rm --cached .env.final 2>&1 | Out-Null
  Write-Host "   ✅ Removed from tracking (file kept locally)" -ForegroundColor Green
}

# Step 3: Reset to clean commit
Write-Host "`n3. Resetting to last clean commit (38f7c70)..." -ForegroundColor Cyan
git reset --hard 38f7c70
Write-Host "   ✅ Reset complete" -ForegroundColor Green

# Step 4: Check for any staged changes
Write-Host "`n4. Checking working directory..." -ForegroundColor Cyan
$status = git status --porcelain
if ($status) {
  Write-Host "   ⚠️  Uncommitted changes detected" -ForegroundColor Yellow
  git status --short
}
else {
  Write-Host "   ✅ Working directory clean" -ForegroundColor Green
}

# Step 5: Instructions for force push
Write-Host "`n5. Next Steps:" -ForegroundColor Cyan
Write-Host "   a. ROTATE ALL EXPOSED KEYS (Stripe, Anthropic)" -ForegroundColor Red
Write-Host "   b. Update .env.local with NEW keys" -ForegroundColor Yellow
Write-Host "   c. Update Vercel environment variables" -ForegroundColor Yellow
Write-Host "   d. Run: git push origin main --force" -ForegroundColor Yellow

Write-Host "`n⚠️  WARNING: Force push will rewrite GitHub history" -ForegroundColor Yellow
Write-Host "This is necessary to remove the exposed secrets.`n" -ForegroundColor Yellow
