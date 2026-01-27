# ============================================================================
# Kollect-It Vercel Environment Variable Verification
# ============================================================================
# Purpose: Verify all required environment variables are set in Vercel
# Usage: .\scripts\verify-vercel-env-final.ps1 [-Environment production|preview|development]
# ============================================================================

param(
    [string]$Environment = "production"
)

$ErrorActionPreference = "Stop"

function Write-Status {
    param(
        [string]$Message,
        [string]$Type = "Info"
    )
    
    $colors = @{
        "Success" = "Green"
        "Error" = "Red"
        "Warning" = "Yellow"
        "Info" = "Cyan"
        "Header" = "Magenta"
    }
    
    $color = $colors[$Type] ?? "White"
    Write-Host $Message -ForegroundColor $color
}

# Check if Vercel CLI is installed
Write-Status "Checking Vercel CLI..." "Info"
try {
    $vercelVersion = vercel --version 2>&1
    Write-Status "  ✅ Vercel CLI found: $vercelVersion" "Success"
} catch {
    Write-Status "  ❌ Vercel CLI not found. Install with: npm i -g vercel" "Error"
    exit 1
}

# Check if logged in
Write-Status "`nChecking Vercel authentication..." "Info"
try {
    $whoami = vercel whoami 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Status "  ✅ Logged in as: $whoami" "Success"
    } else {
        Write-Status "  ❌ Not logged in. Run: vercel login" "Error"
        exit 1
    }
} catch {
    Write-Status "  ❌ Authentication check failed" "Error"
    exit 1
}

# Required environment variables
$requiredVars = @(
    "DATABASE_URL",
    "DIRECT_URL",
    "NEXTAUTH_SECRET",
    "PRODUCT_INGEST_API_KEY"
)

# Recommended environment variables
$recommendedVars = @(
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "STRIPE_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY",
    "IMAGEKIT_PRIVATE_KEY",
    "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
    "ANTHROPIC_API_KEY",
    "EMAIL_HOST",
    "EMAIL_PORT",
    "EMAIL_USER",
    "EMAIL_PASSWORD",
    "EMAIL_FROM",
    "ADMIN_EMAIL"
)

Write-Status "`n╔════════════════════════════════════════════════════════╗" "Header"
Write-Status "║  VERIFYING VERCEL ENVIRONMENT VARIABLES                ║" "Header"
Write-Status "╚════════════════════════════════════════════════════════╝`n" "Header"
Write-Status "Environment: $Environment`n" "Info"

# List environment variables
Write-Status "Fetching environment variables from Vercel..." "Info"
try {
    $envList = vercel env ls $Environment 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Status "  ❌ Failed to list environment variables" "Error"
        Write-Host $envList
        exit 1
    }
    
    Write-Status "`nRequired Variables:" "Info"
    $missing = @()
    foreach ($var in $requiredVars) {
        if ($envList -match $var) {
            Write-Status "  ✅ $var" "Success"
        } else {
            Write-Status "  ❌ $var (MISSING)" "Error"
            $missing += $var
        }
    }
    
    Write-Status "`nRecommended Variables:" "Info"
    foreach ($var in $recommendedVars) {
        if ($envList -match $var) {
            Write-Status "  ✅ $var" "Success"
        } else {
            Write-Status "  ⚠️  $var (not set)" "Warning"
        }
    }
    
    if ($missing.Count -gt 0) {
        Write-Status "`n❌ MISSING REQUIRED VARIABLES:" "Error"
        foreach ($var in $missing) {
            Write-Status "  - $var" "Error"
        }
        Write-Status "`nAdd missing variables with:" "Info"
        Write-Status "  vercel env add $($missing[0]) $Environment" "Info"
        exit 1
    } else {
        Write-Status "`n✅ All required environment variables are set!" "Success"
        exit 0
    }
} catch {
    Write-Status "  ❌ Error fetching environment variables" "Error"
    Write-Host $_.Exception.Message
    exit 1
}
