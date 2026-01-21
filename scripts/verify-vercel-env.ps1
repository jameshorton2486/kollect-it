# ============================================
# Vercel Environment Variable Verification
# ============================================
# Checks Vercel environment variables via CLI
# ============================================

param(
    [string]$Environment = "production"
)

Write-Host "🔍 Verifying Vercel Environment Variables" -ForegroundColor Cyan
Write-Host "Environment: $Environment" -ForegroundColor Gray
Write-Host ""

# Check if Vercel CLI is installed
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found" -ForegroundColor Red
    Write-Host "   Install: npm install -g vercel" -ForegroundColor Yellow
    exit 1
}

# Check if logged in
$whoami = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not logged in to Vercel" -ForegroundColor Red
    Write-Host "   Run: vercel login" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Logged in as: $whoami" -ForegroundColor Green
Write-Host ""

# List environment variables
Write-Host "📋 Environment Variables:" -ForegroundColor Yellow
$envList = vercel env ls $Environment 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host $envList
} else {
    Write-Host "❌ Failed to list environment variables" -ForegroundColor Red
    Write-Host $envList
    exit 1
}

Write-Host ""
Write-Host "✅ Verification complete" -ForegroundColor Green
