# Setup Vercel Environment Variables
# This script helps configure NEXTAUTH_URL and other required variables

Write-Host "🔧 Vercel Environment Variables Setup" -ForegroundColor Cyan
Write-Host ""

# Check current environment variables
Write-Host "📋 Current Vercel Environment Variables:" -ForegroundColor Yellow
vercel env ls
Write-Host ""

# Production URL
$productionUrl = "https://kollect-it.vercel.app"

Write-Host "🔍 Checking for NEXTAUTH_URL..." -ForegroundColor Yellow
$nextAuthUrl = vercel env ls | Select-String "NEXTAUTH_URL"

if (-not $nextAuthUrl) {
    Write-Host "❌ NEXTAUTH_URL not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "📝 To add NEXTAUTH_URL for production, run:" -ForegroundColor Cyan
    Write-Host "   vercel env add NEXTAUTH_URL production" -ForegroundColor White
    Write-Host ""
    Write-Host "   When prompted, enter: $productionUrl" -ForegroundColor White
    Write-Host ""

    $add = Read-Host "Would you like to add it now? (y/n)"
    if ($add -eq "y" -or $add -eq "Y") {
        Write-Host ""
        Write-Host "Adding NEXTAUTH_URL for production..." -ForegroundColor Yellow
        vercel env add NEXTAUTH_URL production
        Write-Host ""
        Write-Host "✅ NEXTAUTH_URL added for production" -ForegroundColor Green
    }
} else {
    Write-Host "✅ NEXTAUTH_URL found:" -ForegroundColor Green
    Write-Host $nextAuthUrl
}

Write-Host ""
Write-Host "🔍 Checking for NEXTAUTH_SECRET..." -ForegroundColor Yellow
$nextAuthSecret = vercel env ls | Select-String "NEXTAUTH_SECRET"

if (-not $nextAuthSecret) {
    Write-Host "⚠️  NEXTAUTH_SECRET not found" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📝 NEXTAUTH_SECRET is required for authentication" -ForegroundColor Cyan
    Write-Host "   To add it, run:" -ForegroundColor White
    Write-Host "   vercel env add NEXTAUTH_SECRET production" -ForegroundColor White
    Write-Host ""
    Write-Host "   Generate a secret with: openssl rand -base64 32" -ForegroundColor White
} else {
    Write-Host "✅ NEXTAUTH_SECRET found" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Required Environment Variables Checklist:" -ForegroundColor Cyan
Write-Host "   ✅ NEXTAUTH_URL (should be: $productionUrl)" -ForegroundColor $(if ($nextAuthUrl) { "Green" } else { "Red" })
Write-Host "   $(if ($nextAuthSecret) { '✅' } else { '❌' }) NEXTAUTH_SECRET" -ForegroundColor $(if ($nextAuthSecret) { "Green" } else { "Red" })
Write-Host "   ✅ DATABASE_URL" -ForegroundColor Yellow
Write-Host "   ✅ DIRECT_URL" -ForegroundColor Yellow
Write-Host ""

Write-Host "🚀 After adding environment variables, redeploy:" -ForegroundColor Cyan
Write-Host "   vercel --prod" -ForegroundColor White
Write-Host ""
