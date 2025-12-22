# PowerShell script to commit and push all changes to main branch

Write-Host "Checking for changes..." -ForegroundColor Cyan
git status

Write-Host "`nStaging all changes..." -ForegroundColor Cyan
git add -A

Write-Host "`nChecking what will be committed..." -ForegroundColor Cyan
git status

Write-Host "`nCommitting changes..." -ForegroundColor Cyan
git commit -m "feat: Apply Cursor AI changes and updates"

Write-Host "`nPushing to main branch..." -ForegroundColor Cyan
git push origin main

Write-Host "`n✅ Done! All changes have been committed and pushed." -ForegroundColor Green

