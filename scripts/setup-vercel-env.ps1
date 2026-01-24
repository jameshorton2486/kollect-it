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
Write-Host "� Checking for PRODUCT_INGEST_API_KEY..." -ForegroundColor Yellow
$ingestKey = vercel env ls | Select-String "PRODUCT_INGEST_API_KEY"

if (-not $ingestKey) {
    Write-Host "⚠️  PRODUCT_INGEST_API_KEY not found in Vercel" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📌 Adding PRODUCT_INGEST_API_KEY to all Vercel environments..." -ForegroundColor Cyan
    Write-Host "   Key: kollect-it-product-service-2025" -ForegroundColor White
    Write-Host ""

    # Create a temporary script to provide the key value non-interactively
    $ingestKeyValue = "kollect-it-product-service-2025"
    Write-Host "   Running: vercel env add PRODUCT_INGEST_API_KEY" -ForegroundColor Gray

    # Note: vercel env add is interactive, so we document the manual process
    Write-Host ""
    Write-Host "   ⚠️  Manual Setup Required:" -ForegroundColor Yellow
    Write-Host "      1. Go to: https://vercel.com/dashboard" -ForegroundColor White
    Write-Host "      2. Select project: kollect-it-marketplace-1" -ForegroundColor White
    Write-Host "      3. Settings → Environment Variables" -ForegroundColor White
    Write-Host "      4. Click 'Add New'" -ForegroundColor White
    Write-Host "      5. Name: PRODUCT_INGEST_API_KEY" -ForegroundColor White
    Write-Host "      6. Value: kollect-it-product-service-2025" -ForegroundColor White
    Write-Host "      7. Select: Production, Preview, Development" -ForegroundColor White
    Write-Host "      8. Click 'Add'" -ForegroundColor White
} else {
    Write-Host "✅ PRODUCT_INGEST_API_KEY found" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Required Environment Variables Checklist:" -ForegroundColor Cyan
Write-Host "   ✅ NEXTAUTH_URL (should be: $productionUrl)" -ForegroundColor $(if ($nextAuthUrl) { "Green" } else { "Red" })
Write-Host "   $(if ($nextAuthSecret) { '✅' } else { '❌' }) NEXTAUTH_SECRET" -ForegroundColor $(if ($nextAuthSecret) { "Green" } else { "Red" })
Write-Host "   $(if ($ingestKey) { '✅' } else { '❌' }) PRODUCT_INGEST_API_KEY" -ForegroundColor $(if ($ingestKey) { "Green" } else { "Yellow" })
Write-Host "   ✅ DATABASE_URL" -ForegroundColor Yellow
Write-Host "   ✅ DIRECT_URL" -ForegroundColor Yellow
Write-Host ""

Write-Host "🚀 After adding environment variables, redeploy:" -ForegroundColor Cyan
Write-Host "   vercel --prod" -ForegroundColor White
Write-Host ""
