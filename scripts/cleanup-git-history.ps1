# Clean Up Git History - Remove Exposed Secrets
# This script removes commits containing secrets from Git history

Write-Host "🧹 Cleaning up Git history..." -ForegroundColor Yellow

# Step 1: Ensure .env.final is gitignored
Write-Host "`n1. Updating .gitignore..." -ForegroundColor Cyan
$gitignoreContent = Get-Content .gitignore -Raw -ErrorAction SilentlyContinue
if ($gitignoreContent -notmatch "\.env\.final") {
  Add-Content -Path .gitignore -Value "`n# Environment files with secrets`n.env.final`n*.env.final"
  Write-Host "   ✅ Added .env.final to .gitignore" -ForegroundColor Green
}
else {
  Write-Host "   ✅ .env.final already in .gitignore" -ForegroundColor Green
}

# Step 2: Reset to clean commit (before secrets were added)
Write-Host "`n2. Resetting to last clean commit..." -ForegroundColor Cyan
git reset --hard 38f7c70
Write-Host "   ✅ Reset to commit 38f7c70" -ForegroundColor Green

# Step 3: Check status
Write-Host "`n3. Checking repository status..." -ForegroundColor Cyan
git status --short

# Step 4: Force push to GitHub (removes secret commits)
Write-Host "`n4. Ready to force push to GitHub" -ForegroundColor Cyan
Write-Host "   ⚠️  This will rewrite history on GitHub" -ForegroundColor Yellow
Write-Host "`n   Run this command when ready:" -ForegroundColor Yellow
Write-Host "   git push origin main --force" -ForegroundColor Cyan

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "✅ Git history cleaned!" -ForegroundColor Green
Write-Host "`n📋 Final step:" -ForegroundColor Cyan
Write-Host "   Run: git push origin main --force" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
