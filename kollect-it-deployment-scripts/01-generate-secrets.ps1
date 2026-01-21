<#
.SYNOPSIS
    Generates all required secrets for Kollect-It deployment.

.DESCRIPTION
    This script generates:
    - NEXTAUTH_SECRET (32-byte base64)
    - PRODUCT_INGEST_API_KEY (32-byte hex)
    
    It creates a .env.secrets file that you then populate with API keys
    from the various service dashboards.

.EXAMPLE
    .\01-generate-secrets.ps1
    
.NOTES
    Run this FIRST before any other deployment scripts.
#>

# Load common functions
. "$PSScriptRoot\lib\common-functions.ps1"

Write-Header "Kollect-It Secret Generator"

# ============================================================================
# Generate Secrets
# ============================================================================

Write-Step "Generating NEXTAUTH_SECRET..."
$nextAuthSecret = Generate-SecureString -Length 32
Write-Success "Generated NEXTAUTH_SECRET"

Write-Step "Generating PRODUCT_INGEST_API_KEY..."
$productIngestKey = Generate-HexString -Length 32
Write-Success "Generated PRODUCT_INGEST_API_KEY"

# ============================================================================
# Create Secrets File
# ============================================================================

$secretsFile = "$PSScriptRoot\config\.env.secrets"

$secretsContent = @"
# ============================================================================
# KOLLECT-IT DEPLOYMENT SECRETS
# Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
# ============================================================================
# 
# INSTRUCTIONS:
# 1. The secrets below have been auto-generated
# 2. Fill in the PLACEHOLDER values from your service dashboards
# 3. Run 02-setup-vercel-env.ps1 to push these to Vercel
#
# ============================================================================

# ============================================================================
# AUTO-GENERATED SECRETS (DO NOT CHANGE)
# ============================================================================
NEXTAUTH_SECRET=$nextAuthSecret
PRODUCT_INGEST_API_KEY=$productIngestKey

# ============================================================================
# DATABASE (Copy from Supabase Dashboard)
# Dashboard: https://supabase.com/dashboard → Settings → Database
# ============================================================================
DATABASE_URL=PLACEHOLDER_COPY_FROM_SUPABASE
DIRECT_URL=PLACEHOLDER_COPY_FROM_SUPABASE

# ============================================================================
# AUTHENTICATION
# ============================================================================
NEXTAUTH_URL=https://kollect-it.com

# ============================================================================
# STRIPE (Copy from Stripe Dashboard)
# Dashboard: https://dashboard.stripe.com/apikeys
# IMPORTANT: Use LIVE keys for production (sk_live_, pk_live_)
# ============================================================================
STRIPE_SECRET_KEY=PLACEHOLDER_sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=PLACEHOLDER_pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=PLACEHOLDER_whsec_xxxxx

# ============================================================================
# IMAGEKIT (Copy from ImageKit Dashboard)
# Dashboard: https://imagekit.io/dashboard/developer/api-keys
# ============================================================================
IMAGEKIT_PRIVATE_KEY=PLACEHOLDER_private_xxxxx
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=PLACEHOLDER_public_xxxxx
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/kollectit

# ============================================================================
# ANTHROPIC AI (Copy from Anthropic Console)
# Dashboard: https://console.anthropic.com/settings/keys
# ============================================================================
ANTHROPIC_API_KEY=PLACEHOLDER_sk-ant-xxxxx

# ============================================================================
# EMAIL - RESEND (Copy from Resend Dashboard)
# Dashboard: https://resend.com/api-keys
# ============================================================================
RESEND_API_KEY=PLACEHOLDER_re_xxxxx
EMAIL_FROM=Kollect-It <noreply@kollect-it.com>
ADMIN_EMAIL=james@kollect-it.com
"@

# Ensure config directory exists
$configDir = "$PSScriptRoot\config"
if (-not (Test-Path $configDir)) {
    New-Item -ItemType Directory -Path $configDir | Out-Null
}

$secretsContent | Out-File -FilePath $secretsFile -Encoding UTF8

Write-Host ""
Write-Success "Created secrets file: $secretsFile"
Write-Host ""

# ============================================================================
# Display Instructions
# ============================================================================

Write-Header "Next Steps"

Write-Host "1. Open the secrets file:" -ForegroundColor $Colors.Info
Write-Host "   notepad `"$secretsFile`"" -ForegroundColor White
Write-Host ""

Write-Host "2. Replace PLACEHOLDER values with real API keys from:" -ForegroundColor $Colors.Info
Write-Host "   - Supabase:  https://supabase.com/dashboard" -ForegroundColor White
Write-Host "   - Stripe:    https://dashboard.stripe.com/apikeys" -ForegroundColor White
Write-Host "   - ImageKit:  https://imagekit.io/dashboard/developer/api-keys" -ForegroundColor White
Write-Host "   - Anthropic: https://console.anthropic.com/settings/keys" -ForegroundColor White
Write-Host "   - Resend:    https://resend.com/api-keys" -ForegroundColor White
Write-Host ""

Write-Host "3. Run the Vercel setup script:" -ForegroundColor $Colors.Info
Write-Host "   .\02-setup-vercel-env.ps1" -ForegroundColor White
Write-Host ""

# ============================================================================
# Also create desktop app .env template
# ============================================================================

$desktopEnvFile = "$PSScriptRoot\config\.env.desktop-app"

$desktopEnvContent = @"
# ============================================================================
# KOLLECT-IT DESKTOP APP ENVIRONMENT
# Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
# ============================================================================
# Copy this file to: product-application/desktop-app/.env
# ============================================================================

# API Authentication (MUST match Vercel PRODUCT_INGEST_API_KEY)
PRODUCT_INGEST_API_KEY=$productIngestKey

# ImageKit Credentials (copy from dashboard)
IMAGEKIT_PUBLIC_KEY=PLACEHOLDER_public_xxxxx
IMAGEKIT_PRIVATE_KEY=PLACEHOLDER_private_xxxxx

# Anthropic AI (copy from dashboard)
ANTHROPIC_API_KEY=PLACEHOLDER_sk-ant-xxxxx

# Website Connection
WEBSITE_URL=https://kollect-it.com
"@

$desktopEnvContent | Out-File -FilePath $desktopEnvFile -Encoding UTF8

Write-Success "Created desktop app env template: $desktopEnvFile"
Write-Host ""

# ============================================================================
# Summary
# ============================================================================

Write-Header "Generated Values (Save These!)"

Write-Host "NEXTAUTH_SECRET:" -ForegroundColor $Colors.Info
Write-Host "  $nextAuthSecret" -ForegroundColor White
Write-Host ""

Write-Host "PRODUCT_INGEST_API_KEY:" -ForegroundColor $Colors.Info
Write-Host "  $productIngestKey" -ForegroundColor White
Write-Host ""

Write-Warn "These values are also saved in $secretsFile"
Write-Warn "Keep this file secure and do NOT commit it to git!"
