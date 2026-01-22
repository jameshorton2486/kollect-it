# Update Vercel Environment Variables
# 
# This script helps you update DATABASE_URL and DIRECT_URL in Vercel
# 
# Usage:
#   .\scripts\update-vercel-env.ps1

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Update Vercel Environment Variables                  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install it with:" -ForegroundColor Yellow
    Write-Host "  npm install -g vercel" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "✅ Vercel CLI found" -ForegroundColor Green
Write-Host ""

# Read DATABASE_URL from .env.local
$envLocalPath = Join-Path $PSScriptRoot "..\.env.local"
if (-not (Test-Path $envLocalPath)) {
    Write-Host "❌ .env.local file not found!" -ForegroundColor Red
    Write-Host "   Expected at: $envLocalPath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please create .env.local first with your DATABASE_URL and DIRECT_URL" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host "📄 Reading .env.local..." -ForegroundColor Cyan

# Parse .env.local
$envContent = Get-Content $envLocalPath
$databaseUrl = ""
$directUrl = ""

foreach ($line in $envContent) {
    if ($line -match '^DATABASE_URL="(.+)"$') {
        $databaseUrl = $matches[1]
    } elseif ($line -match "^DATABASE_URL=(.+)$") {
        $databaseUrl = $matches[1]
    } elseif ($line -match '^DIRECT_URL="(.+)"$') {
        $directUrl = $matches[1]
    } elseif ($line -match "^DIRECT_URL=(.+)$") {
        $directUrl = $matches[1]
    }
}

if ([string]::IsNullOrEmpty($databaseUrl)) {
    Write-Host "❌ DATABASE_URL not found in .env.local!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please add DATABASE_URL to .env.local first" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

if ([string]::IsNullOrEmpty($directUrl)) {
    Write-Host "⚠️  DIRECT_URL not found in .env.local (optional)" -ForegroundColor Yellow
}

Write-Host "✅ Found DATABASE_URL" -ForegroundColor Green
if (-not [string]::IsNullOrEmpty($directUrl)) {
    Write-Host "✅ Found DIRECT_URL" -ForegroundColor Green
}
Write-Host ""

# Mask passwords for display
$maskedDatabaseUrl = $databaseUrl -replace ':([^:@]+)@', ':****@'
$maskedDirectUrl = if ($directUrl) { $directUrl -replace ':([^:@]+)@', ':****@' } else { "" }

Write-Host "📋 Values to set in Vercel:" -ForegroundColor Cyan
Write-Host "─".PadRight(60, "─") -ForegroundColor Gray
Write-Host "DATABASE_URL: $($maskedDatabaseUrl.Substring(0, [Math]::Min(60, $maskedDatabaseUrl.Length)))..." -ForegroundColor White
if ($directUrl) {
    Write-Host "DIRECT_URL:   $($maskedDirectUrl.Substring(0, [Math]::Min(60, $maskedDirectUrl.Length)))..." -ForegroundColor White
}
Write-Host "─".PadRight(60, "─") -ForegroundColor Gray
Write-Host ""

# Confirm
Write-Host "⚠️  This will update Vercel environment variables for PRODUCTION" -ForegroundColor Yellow
$confirm = Read-Host "Continue? (y/N)"

if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host ""
    Write-Host "❌ Cancelled" -ForegroundColor Red
    Write-Host ""
    exit 0
}

Write-Host ""
Write-Host "🔄 Updating Vercel environment variables..." -ForegroundColor Cyan
Write-Host ""

# Update DATABASE_URL
Write-Host "1. Setting DATABASE_URL..." -ForegroundColor Yellow
try {
    # Use echo to pipe value to vercel env add
    $databaseUrl | vercel env add DATABASE_URL production 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ DATABASE_URL updated successfully" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Manual update may be required" -ForegroundColor Yellow
        Write-Host "   Run: vercel env add DATABASE_URL production" -ForegroundColor White
        Write-Host "   Then paste: $databaseUrl" -ForegroundColor White
    }
} catch {
    Write-Host "   ⚠️  Error updating DATABASE_URL" -ForegroundColor Yellow
    Write-Host "   Error: $_" -ForegroundColor Red
}

Write-Host ""

# Update DIRECT_URL if present
if (-not [string]::IsNullOrEmpty($directUrl)) {
    Write-Host "2. Setting DIRECT_URL..." -ForegroundColor Yellow
    try {
        $directUrl | vercel env add DIRECT_URL production 2>&1 | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ DIRECT_URL updated successfully" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Manual update may be required" -ForegroundColor Yellow
            Write-Host "   Run: vercel env add DIRECT_URL production" -ForegroundColor White
            Write-Host "   Then paste: $directUrl" -ForegroundColor White
        }
    } catch {
        Write-Host "   ⚠️  Error updating DIRECT_URL" -ForegroundColor Yellow
        Write-Host "   Error: $_" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "✅ Environment variable update complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Go to Vercel dashboard and verify variables are set" -ForegroundColor White
Write-Host "   2. Redeploy your application" -ForegroundColor White
Write-Host "   3. Test database connection: npx tsx scripts/test-db-connection.ts" -ForegroundColor White
Write-Host ""
