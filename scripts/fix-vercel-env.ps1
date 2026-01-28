# ============================================
# Fix Vercel Environment Variables
# ============================================
# This script helps fix common Vercel env var issues
# Run: .\scripts\fix-vercel-env.ps1

Write-Host "🔧 Vercel Environment Variable Fixer" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found. Install with: npm i -g vercel" -ForegroundColor Red
    exit 1
}

# Check if project is linked (try to link if not)
Write-Host "Checking Vercel project link..." -ForegroundColor Yellow
$linkCheck = vercel link --yes 2>&1 | Out-String
if ($LASTEXITCODE -ne 0 -and $linkCheck -notmatch "Linked to") {
    Write-Host "⚠️  Project not linked. Attempting to link..." -ForegroundColor Yellow
    Write-Host "   (You may need to select your project interactively)" -ForegroundColor Gray
    vercel link
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to link project. Please run: vercel link" -ForegroundColor Red
        Write-Host "   Then run this script again." -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "✅ Vercel project linked" -ForegroundColor Green
Write-Host ""

# Pull current env vars
Write-Host "📥 Pulling environment variables from Vercel..." -ForegroundColor Cyan
vercel env pull .env.local
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Environment variables pulled successfully" -ForegroundColor Green
}
else {
    Write-Host "❌ Failed to pull environment variables" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Issues Found:" -ForegroundColor Yellow
Write-Host ""

# Check for issues
$issues = @()

# Check STRIPE_WEBHOOK_SECRET
$webhookSecret = (Get-Content .env.local | Select-String 'STRIPE_WEBHOOK_SECRET="([^"]+)"').Matches.Groups[1].Value
if ($webhookSecret -match "YOUR_https://" -or $webhookSecret.Length -lt 20) {
    $issues += "STRIPE_WEBHOOK_SECRET is malformed or placeholder"
    Write-Host "  ❌ STRIPE_WEBHOOK_SECRET: Malformed value detected" -ForegroundColor Red
    Write-Host "     Current: $($webhookSecret.Substring(0, [Math]::Min(50, $webhookSecret.Length)))..." -ForegroundColor Gray
    Write-Host "     Fix: Get correct value from Stripe Dashboard → Webhooks → Signing Secret" -ForegroundColor Yellow
}
else {
    Write-Host "  ✅ STRIPE_WEBHOOK_SECRET: Looks valid" -ForegroundColor Green
}

# Check NEXTAUTH_URL
$nextAuthUrl = (Get-Content .env.local | Select-String 'NEXTAUTH_URL="([^"]+)"').Matches.Groups[1].Value
if ($nextAuthUrl -ne "https://kollect-it.com" -and $nextAuthUrl -notmatch "kollect-it\.com") {
    $issues += "NEXTAUTH_URL is not set to production domain"
    Write-Host "  ⚠️  NEXTAUTH_URL: Not set to production domain" -ForegroundColor Yellow
    Write-Host "     Current: $nextAuthUrl" -ForegroundColor Gray
    Write-Host "     Should be: https://kollect-it.com" -ForegroundColor Yellow
}
else {
    Write-Host "  ✅ NEXTAUTH_URL: Correct" -ForegroundColor Green
}

# Check DATABASE_URL token length
$dbUrl = (Get-Content .env.local | Select-String 'DATABASE_URL="([^"]+)"').Matches.Groups[1].Value
if ($dbUrl -match 'postgres://postgres:([^@]+)@') {
    $dbToken = $matches[1]
    if ($dbToken.Length -lt 20) {
        $issues += "DATABASE_URL may need Supabase Opaque Token migration"
        Write-Host "  ⚠️  DATABASE_URL: Token is short ($($dbToken.Length) chars)" -ForegroundColor Yellow
        Write-Host "     May need to regenerate from Supabase Dashboard if connection fails" -ForegroundColor Yellow
    }
    else {
        Write-Host "  ✅ DATABASE_URL: Token length looks good" -ForegroundColor Green
    }
}

# Check PRODUCT_INGEST_API_KEY match
$vercelKey = (Get-Content .env.local | Select-String 'PRODUCT_INGEST_API_KEY="([^"]+)"').Matches.Groups[1].Value
$desktopKey = ""
if (Test-Path "product-application\desktop-app\.env") {
    $desktopKey = (Get-Content "product-application\desktop-app\.env" | Select-String "PRODUCT_INGEST_API_KEY=([^\r\n]+)").Matches.Groups[1].Value.Trim()
    if ($vercelKey -eq $desktopKey) {
        Write-Host "  ✅ PRODUCT_INGEST_API_KEY: Matches desktop app" -ForegroundColor Green
    }
    else {
        $issues += "PRODUCT_INGEST_API_KEY mismatch between Vercel and desktop app"
        Write-Host "  ❌ PRODUCT_INGEST_API_KEY: MISMATCH!" -ForegroundColor Red
        Write-Host "     Vercel: $($vercelKey.Substring(0, 20))..." -ForegroundColor Gray
        Write-Host "     Desktop: $($desktopKey.Substring(0, 20))..." -ForegroundColor Gray
    }
}
else {
    Write-Host "  ⚠️  Desktop app .env not found - cannot verify PRODUCT_INGEST_API_KEY match" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 Summary:" -ForegroundColor Cyan
if ($issues.Count -eq 0) {
    Write-Host "  ✅ No critical issues found!" -ForegroundColor Green
}
else {
    Write-Host "  Found $($issues.Count) issue(s) that need attention:" -ForegroundColor Yellow
    foreach ($issue in $issues) {
        Write-Host "    - $issue" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "  See docs/ENV-SYNC-REPORT.md for detailed fix instructions" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "💡 Quick Fix Commands:" -ForegroundColor Cyan
Write-Host ""

# Offer to fix NEXTAUTH_URL automatically if it's wrong
if ($issues -contains "NEXTAUTH_URL is not set to production domain") {
    $fix = Read-Host "  Fix NEXTAUTH_URL automatically? (Y/n)"
    if ($fix -ne "n" -and $fix -ne "N") {
        Write-Host "  🔧 Updating NEXTAUTH_URL..." -ForegroundColor Cyan
        vercel env rm NEXTAUTH_URL production 2>&1 | Out-Null
        echo "https://kollect-it.com" | vercel env add NEXTAUTH_URL production
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ NEXTAUTH_URL updated successfully" -ForegroundColor Green
            $issues = $issues | Where-Object { $_ -ne "NEXTAUTH_URL is not set to production domain" }
        }
        else {
            Write-Host "  ❌ Failed to update NEXTAUTH_URL. Run manually:" -ForegroundColor Red
        }
    }
}

if ($issues.Count -gt 0) {
    Write-Host ""
    Write-Host "  # Fix STRIPE_WEBHOOK_SECRET:" -ForegroundColor Gray
    Write-Host "  vercel env rm STRIPE_WEBHOOK_SECRET production" -ForegroundColor White
    Write-Host "  vercel env add STRIPE_WEBHOOK_SECRET production" -ForegroundColor White
    Write-Host "  # Get value from: Stripe Dashboard → Webhooks → Signing Secret" -ForegroundColor Gray
    Write-Host ""

    if ($issues -contains "DATABASE_URL may need Supabase Opaque Token migration") {
        Write-Host "  # Fix DATABASE_URL (if connection fails):" -ForegroundColor Gray
        Write-Host "  vercel env rm DATABASE_URL production" -ForegroundColor White
        Write-Host "  vercel env add DATABASE_URL production" -ForegroundColor White
        Write-Host "  # Get new connection string from: Supabase Dashboard → Settings → Database" -ForegroundColor Gray
        Write-Host ""
    }
}

Write-Host ""
Write-Host "📄 Full report saved to: docs/ENV-SYNC-REPORT.md" -ForegroundColor Cyan
Write-Host ""
