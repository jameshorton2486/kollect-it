# ============================================================================
# KOLLECT-IT MARKETPLACE - INTERACTIVE ENVIRONMENT SETUP
# ============================================================================
# This script helps you set up .env.local with all required variables
#
# USAGE: .\ENV-SETUP-INTERACTIVE.ps1
# ============================================================================

$ErrorActionPreference = "Stop"

Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host " KOLLECT-IT ENVIRONMENT SETUP WIZARD" -ForegroundColor Cyan
Write-Host "============================================================================`n" -ForegroundColor Cyan

# ============================================================================
# CHECK FOR EXISTING .ENV.LOCAL
# ============================================================================

if (Test-Path ".env.local") {
    Write-Host "⚠️  .env.local already exists!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Choose an option:" -ForegroundColor White
    Write-Host "  1 - Backup and create new" -ForegroundColor White
    Write-Host "  2 - Update existing (keep current values)" -ForegroundColor White
    Write-Host "  3 - Cancel" -ForegroundColor White
    Write-Host ""
    
    $choice = Read-Host "Enter choice (1-3)"
    
    switch ($choice) {
        "1" {
            $backupName = ".env.local.backup.$(Get-Date -Format 'yyyyMMddHHmmss')"
            Copy-Item ".env.local" $backupName
            Write-Host "✓ Backup created: $backupName" -ForegroundColor Green
        }
        "2" {
            Write-Host "✓ Will update existing file" -ForegroundColor Green
        }
        "3" {
            Write-Host "Setup cancelled" -ForegroundColor Yellow
            exit 0
        }
        default {
            Write-Host "Invalid choice. Exiting." -ForegroundColor Red
            exit 1
        }
    }
    Write-Host ""
}

# ============================================================================
# READ TEMPLATE
# ============================================================================

Write-Host "Reading .env.example template..." -ForegroundColor Yellow

if (-not (Test-Path ".env.example")) {
    Write-Host "ERROR: .env.example not found!" -ForegroundColor Red
    exit 1
}

$template = Get-Content ".env.example"

# ============================================================================
# COLLECT VALUES
# ============================================================================

Write-Host "`n============================================================================" -ForegroundColor Cyan
Write-Host " SECTION 1: DATABASE (SUPABASE)" -ForegroundColor Cyan
Write-Host "============================================================================`n" -ForegroundColor Cyan

Write-Host "You need two connection strings from Supabase:" -ForegroundColor White
Write-Host "  1. Pooled connection (port 6543) - for app queries" -ForegroundColor White
Write-Host "  2. Direct connection (port 5432) - for migrations" -ForegroundColor White
Write-Host ""
Write-Host "Find these at: https://app.supabase.com/project/_/settings/database" -ForegroundColor Gray
Write-Host ""

$databaseUrl = Read-Host "DATABASE_URL (pooled, port 6543)"
$directUrl = Read-Host "DIRECT_URL (direct, port 5432)"

# ============================================================================

Write-Host "`n============================================================================" -ForegroundColor Cyan
Write-Host " SECTION 2: AUTHENTICATION (NEXTAUTH)" -ForegroundColor Cyan
Write-Host "============================================================================`n" -ForegroundColor Cyan

Write-Host "NEXTAUTH_URL: For local development, use http://localhost:3000" -ForegroundColor White
$nextauthUrl = Read-Host "NEXTAUTH_URL (press Enter for default)"
if ([string]::IsNullOrWhiteSpace($nextauthUrl)) {
    $nextauthUrl = "http://localhost:3000"
}

Write-Host ""
Write-Host "NEXTAUTH_SECRET: Generate a secure random string" -ForegroundColor White
Write-Host "  Suggested: Use openssl rand -base64 32" -ForegroundColor Gray
Write-Host "  OR Press Enter to auto-generate" -ForegroundColor Gray
$nextauthSecret = Read-Host "NEXTAUTH_SECRET"

if ([string]::IsNullOrWhiteSpace($nextauthSecret)) {
    # Generate random secret
    $bytes = New-Object byte[] 32
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    $nextauthSecret = [Convert]::ToBase64String($bytes)
    Write-Host "  Generated: $nextauthSecret" -ForegroundColor Green
}

# ============================================================================

Write-Host "`n============================================================================" -ForegroundColor Cyan
Write-Host " SECTION 3: STRIPE PAYMENT PROCESSING" -ForegroundColor Cyan
Write-Host "============================================================================`n" -ForegroundColor Cyan

Write-Host "Get these from: https://dashboard.stripe.com/apikeys" -ForegroundColor Gray
Write-Host ""

$stripePublicKey = Read-Host "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_test_...)"
$stripeSecretKey = Read-Host "STRIPE_SECRET_KEY (sk_test_...)"
$stripeWebhookSecret = Read-Host "STRIPE_WEBHOOK_SECRET (whsec_...)"

# ============================================================================

Write-Host "`n============================================================================" -ForegroundColor Cyan
Write-Host " SECTION 4: IMAGEKIT IMAGE OPTIMIZATION" -ForegroundColor Cyan
Write-Host "============================================================================`n" -ForegroundColor Cyan

Write-Host "Get these from: https://imagekit.io/dashboard/developer" -ForegroundColor Gray
Write-Host ""

$imagekitPublicKey = Read-Host "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY (public_...)"
$imagekitPrivateKey = Read-Host "IMAGEKIT_PRIVATE_KEY (private_...)"
$imagekitUrlEndpoint = Read-Host "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT (https://ik.imagekit.io/...)"

# ============================================================================

Write-Host "`n============================================================================" -ForegroundColor Cyan
Write-Host " SECTION 5: OPTIONAL SERVICES" -ForegroundColor Cyan
Write-Host "============================================================================`n" -ForegroundColor Cyan

Write-Host "These are optional. Press Enter to skip any." -ForegroundColor Yellow
Write-Host ""

# Google OAuth
Write-Host "Google OAuth (for social login):" -ForegroundColor White
$googleClientId = Read-Host "GOOGLE_CLIENT_ID (optional)"
$googleClientSecret = Read-Host "GOOGLE_CLIENT_SECRET (optional)"

Write-Host ""

# Email
Write-Host "Email Configuration (for notifications):" -ForegroundColor White
$emailServer = Read-Host "EMAIL_SERVER (smtp://user:pass@smtp.example.com:587) (optional)"
$emailFrom = Read-Host "EMAIL_FROM (noreply@kollect-it.com) (optional)"

Write-Host ""

# AI Services
Write-Host "AI Services (for product analysis):" -ForegroundColor White
$claudeApiKey = Read-Host "CLAUDE_API_KEY (sk-ant-api03-...) (optional)"
$openaiApiKey = Read-Host "OPENAI_API_KEY (sk-...) (optional)"

Write-Host ""

# Admin
Write-Host "Admin Configuration:" -ForegroundColor White
$adminEmail = Read-Host "ADMIN_EMAIL (optional)"

Write-Host ""

# Site URLs
Write-Host "Site URLs (for production):" -ForegroundColor White
$appUrl = Read-Host "NEXT_PUBLIC_APP_URL (press Enter for http://localhost:3000)"
if ([string]::IsNullOrWhiteSpace($appUrl)) {
    $appUrl = "http://localhost:3000"
}

$siteUrl = Read-Host "NEXT_PUBLIC_SITE_URL (press Enter for http://localhost:3000)"
if ([string]::IsNullOrWhiteSpace($siteUrl)) {
    $siteUrl = "http://localhost:3000"
}

# ============================================================================
# BUILD .ENV.LOCAL
# ============================================================================

Write-Host "`n============================================================================" -ForegroundColor Cyan
Write-Host " GENERATING .env.local" -ForegroundColor Cyan
Write-Host "============================================================================`n" -ForegroundColor Cyan

$envContent = @"
# ============================================================================
# KOLLECT-IT MARKETPLACE - ENVIRONMENT VARIABLES
# ============================================================================
# Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
# ============================================================================

# [REQUIRED] Database (Supabase PostgreSQL)
DATABASE_URL="$databaseUrl"
DIRECT_URL="$directUrl"

# [REQUIRED] Authentication (NextAuth.js)
NEXTAUTH_URL="$nextauthUrl"
NEXTAUTH_SECRET="$nextauthSecret"

# [REQUIRED] Stripe Payment Processing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="$stripePublicKey"
STRIPE_SECRET_KEY="$stripeSecretKey"
STRIPE_WEBHOOK_SECRET="$stripeWebhookSecret"

# [REQUIRED] ImageKit Image Optimization
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="$imagekitPublicKey"
IMAGEKIT_PRIVATE_KEY="$imagekitPrivateKey"
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="$imagekitUrlEndpoint"

"@

# Add optional variables only if provided
if (-not [string]::IsNullOrWhiteSpace($googleClientId)) {
    $envContent += "`n# [OPTIONAL] Google OAuth`n"
    $envContent += "GOOGLE_CLIENT_ID=`"$googleClientId`"`n"
    if (-not [string]::IsNullOrWhiteSpace($googleClientSecret)) {
        $envContent += "GOOGLE_CLIENT_SECRET=`"$googleClientSecret`"`n"
    }
}

if (-not [string]::IsNullOrWhiteSpace($emailServer)) {
    $envContent += "`n# [OPTIONAL] Email Configuration`n"
    $envContent += "EMAIL_SERVER=`"$emailServer`"`n"
    if (-not [string]::IsNullOrWhiteSpace($emailFrom)) {
        $envContent += "EMAIL_FROM=`"$emailFrom`"`n"
    }
}

if (-not [string]::IsNullOrWhiteSpace($claudeApiKey) -or -not [string]::IsNullOrWhiteSpace($openaiApiKey)) {
    $envContent += "`n# [OPTIONAL] AI Services`n"
    if (-not [string]::IsNullOrWhiteSpace($claudeApiKey)) {
        $envContent += "CLAUDE_API_KEY=`"$claudeApiKey`"`n"
    }
    if (-not [string]::IsNullOrWhiteSpace($openaiApiKey)) {
        $envContent += "OPENAI_API_KEY=`"$openaiApiKey`"`n"
    }
}

if (-not [string]::IsNullOrWhiteSpace($adminEmail)) {
    $envContent += "`n# [OPTIONAL] Admin Configuration`n"
    $envContent += "ADMIN_EMAIL=`"$adminEmail`"`n"
}

$envContent += "`n# [OPTIONAL] Site URLs`n"
$envContent += "NEXT_PUBLIC_APP_URL=`"$appUrl`"`n"
$envContent += "NEXT_PUBLIC_SITE_URL=`"$siteUrl`"`n"

$envContent += "`n# [OPTIONAL] WebSocket`n"
$envContent += "NEXT_PUBLIC_WS_URL=`"ws://localhost:3000`"`n"

# ============================================================================
# SAVE FILE
# ============================================================================

$envContent | Set-Content ".env.local" -Encoding UTF8

Write-Host "✓ .env.local created successfully!" -ForegroundColor Green

# ============================================================================
# VALIDATION
# ============================================================================

Write-Host "`n============================================================================" -ForegroundColor Cyan
Write-Host " VALIDATION" -ForegroundColor Cyan
Write-Host "============================================================================`n" -ForegroundColor Cyan

$requiredVars = @(
    "DATABASE_URL",
    "DIRECT_URL",
    "NEXTAUTH_URL",
    "NEXTAUTH_SECRET",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY",
    "IMAGEKIT_PRIVATE_KEY",
    "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT"
)

$allValid = $true

foreach ($var in $requiredVars) {
    $value = Get-Content ".env.local" | Select-String "^$var=" | ForEach-Object { $_ -replace "^$var=`"?(.+?)`"?$", '$1' }
    
    if ([string]::IsNullOrWhiteSpace($value) -or $value -like "*...*" -or $value -like "*your*") {
        Write-Host "⚠️  $var appears to be placeholder or empty" -ForegroundColor Yellow
        $allValid = $false
    } else {
        Write-Host "✓ $var" -ForegroundColor Green
    }
}

# ============================================================================
# SUMMARY
# ============================================================================

Write-Host "`n============================================================================" -ForegroundColor Cyan
Write-Host " SETUP COMPLETE" -ForegroundColor Cyan
Write-Host "============================================================================`n" -ForegroundColor Cyan

if ($allValid) {
    Write-Host "✓ All required variables configured!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some variables may need review" -ForegroundColor Yellow
    Write-Host "   Edit .env.local to fix any placeholder values" -ForegroundColor White
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Review .env.local" -ForegroundColor White
Write-Host "  2. Run: npm run dev" -ForegroundColor White
Write-Host "  3. Open: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANT: Never commit .env.local to Git!" -ForegroundColor Yellow
Write-Host ""

# ============================================================================
# OFFER TO START DEV SERVER
# ============================================================================

Write-Host "Would you like to start the development server now? (Y/N)" -ForegroundColor White
$startServer = Read-Host

if ($startServer -eq "Y" -or $startServer -eq "y") {
    Write-Host ""
    Write-Host "Starting development server..." -ForegroundColor Yellow
    npm run dev
}
