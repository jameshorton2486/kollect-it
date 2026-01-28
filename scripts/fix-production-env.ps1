# ============================================
# Kollect-It Production Environment Fixer
# ============================================
# This script fixes critical issues identified in the audit

Write-Host "🚀 Kollect-It Production Environment Fixer" -ForegroundColor Cyan
Write-Host "This script will fix the 5 critical issues identified in your audit." -ForegroundColor Yellow

# 1. Fix Stripe Webhook (Remove and Re-add)
Write-Host "`n1. Fixing STRIPE_WEBHOOK_SECRET..." -ForegroundColor Gray
$removeOutput = vercel env rm STRIPE_WEBHOOK_SECRET production -y 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Removed malformed STRIPE_WEBHOOK_SECRET" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  STRIPE_WEBHOOK_SECRET not found (may have been removed already)" -ForegroundColor Gray
}

Write-Host "   ⚠️  To add the correct value, run:" -ForegroundColor Yellow
Write-Host "      vercel env add STRIPE_WEBHOOK_SECRET production" -ForegroundColor White
Write-Host "      (Get value from: Stripe Dashboard → Webhooks → Signing Secret)" -ForegroundColor Gray

# 2. Fix Domain Names
Write-Host "`n2. Updating Domains to https://kollect-it.com..." -ForegroundColor Gray
vercel env rm NEXTAUTH_URL production -y
"https://kollect-it.com" | vercel env add NEXTAUTH_URL production

vercel env rm NEXT_PUBLIC_APP_URL production -y
"https://kollect-it.com" | vercel env add NEXT_PUBLIC_APP_URL production

# 3. Fix Zoho Email (Clean up old localhost vars)
Write-Host "`n3. Configuring Zoho Mail SMTP..." -ForegroundColor Gray
vercel env rm EMAIL_SERVER production -y
vercel env rm EMAIL_USER production -y
vercel env rm EMAIL_PASSWORD production -y

"smtp.zoho.com" | vercel env add EMAIL_HOST production
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ EMAIL_HOST added" -ForegroundColor Green
}

"587" | vercel env add EMAIL_PORT production
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ EMAIL_PORT added (using 587 for TLS, not 465)" -ForegroundColor Green
}

Write-Host "   ⚠️  To add EMAIL_USER and EMAIL_PASSWORD, run:" -ForegroundColor Yellow
Write-Host "      vercel env add EMAIL_USER production" -ForegroundColor White
Write-Host "      (Enter: info@kollect-it.com or your Zoho email)" -ForegroundColor Gray
Write-Host ""
Write-Host "      vercel env add EMAIL_PASSWORD production" -ForegroundColor White
Write-Host "      (Enter: Your Zoho App Password - NOT regular password)" -ForegroundColor Gray

Write-Host "`n✅ Production variables updated! Run .\scripts\audit-vercel-env.ps1 to verify." -ForegroundColor Green
