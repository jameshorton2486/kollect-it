#!/usr/bin/env pwsh
# CRITICAL SECURITY REMEDIATION SCRIPT
# This removes credential files from Git history permanently

Write-Host "`n🚨 CRITICAL SECURITY ISSUE DETECTED" -ForegroundColor Red
Write-Host "Real API keys and credentials were committed to Git history in commit 9aef523" -ForegroundColor Yellow
Write-Host ""

Write-Host "Files exposed in history:" -ForegroundColor Yellow
Write-Host "  - CHAT GPT API KEY.docx"
Write-Host "  - Claude API Key.docx"
Write-Host "  - Google Workspace.docx"
Write-Host "  - KI - Suprabase (2).docx"
Write-Host "  - env File.docx"
Write-Host ""

Write-Host "⚠️  WARNING: This script will rewrite Git history!" -ForegroundColor Red
Write-Host "   - All collaborators must re-clone the repository" -ForegroundColor Yellow
Write-Host "   - Force push will be required" -ForegroundColor Yellow
Write-Host ""

$confirmation = Read-Host "Type 'REMOVE' to proceed with history rewrite"

if ($confirmation -ne "REMOVE") {
    Write-Host "Aborted. No changes made." -ForegroundColor Green
    exit 0
}

Write-Host "`nStep 1: Creating backup branch..." -ForegroundColor Cyan
git branch backup-before-history-rewrite 2>$null

Write-Host "Step 2: Removing credential files from history..." -ForegroundColor Cyan
git filter-branch --force --index-filter `
  'git rm --cached --ignore-unmatch "CHAT GPT API KEY.docx" "Claude API Key.docx" "Google Workspace.docx" "KI - Suprabase (2).docx" "env File.docx"' `
  --prune-empty --tag-name-filter cat -- --all

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Git filter-branch failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Step 3: Cleaning up refs..." -ForegroundColor Cyan
Remove-Item -Path .git/refs/original -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Step 4: Garbage collection..." -ForegroundColor Cyan
git reflog expire --expire=now --all
git gc --prune=now --aggressive

Write-Host "`n✅ History rewrite complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps (MANUAL - DO NOT RUN AUTOMATICALLY):" -ForegroundColor Yellow
Write-Host "  1. ROTATE ALL API KEYS IMMEDIATELY (they are compromised)" -ForegroundColor Red
Write-Host "     - Stripe: https://dashboard.stripe.com/apikeys"
Write-Host "     - ImageKit: https://imagekit.io/dashboard/developer/api-keys"
Write-Host "     - OpenAI: https://platform.openai.com/api-keys"
Write-Host "     - Claude: https://console.anthropic.com/settings/keys"
Write-Host "     - Supabase: https://app.supabase.com/project/_/settings/api"
Write-Host "     - Google OAuth: https://console.cloud.google.com/apis/credentials"
Write-Host ""
Write-Host "  2. Force push to GitHub (will rewrite remote history):" -ForegroundColor Yellow
Write-Host "     git push origin --force --all"
Write-Host "     git push origin --force --tags"
Write-Host ""
Write-Host "  3. Notify all collaborators to re-clone the repository" -ForegroundColor Yellow
Write-Host ""
Write-Host "  4. Update .env.local with new rotated keys" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  If you DON'T force push, the credentials remain exposed on GitHub!" -ForegroundColor Red
