<#
.SYNOPSIS
    Sets up Stripe webhook using the Stripe CLI.

.DESCRIPTION
    This script:
    1. Creates a webhook endpoint pointing to your Kollect-It API
    2. Retrieves the webhook signing secret
    3. Optionally updates Vercel with the webhook secret

.PARAMETER WebhookUrl
    The webhook endpoint URL (default: https://kollect-it.com/api/webhooks/stripe)

.PARAMETER LiveMode
    Use live mode instead of test mode (default: false for safety)

.EXAMPLE
    .\03-setup-stripe-webhook.ps1
    
.EXAMPLE
    .\03-setup-stripe-webhook.ps1 -LiveMode

.NOTES
    Requires: Stripe CLI (https://stripe.com/docs/stripe-cli)
#>

param(
    [string]$WebhookUrl = "https://kollect-it.com/api/webhooks/stripe",
    [switch]$LiveMode
)

# Load common functions
. "$PSScriptRoot\lib\common-functions.ps1"

Write-Header "Stripe Webhook Setup"

# ============================================================================
# Check Prerequisites
# ============================================================================

Write-Step "Checking prerequisites..."

Assert-CommandExists -Command "stripe" -InstallInstructions "Download from https://stripe.com/docs/stripe-cli"

# Check if logged in to Stripe
Write-Step "Checking Stripe authentication..."
$stripeStatus = stripe config --list 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Failure "Not logged in to Stripe CLI"
    Write-Host "  Run: stripe login" -ForegroundColor $Colors.Warning
    exit 1
}
Write-Success "Stripe CLI authenticated"

# ============================================================================
# Mode Selection
# ============================================================================

$modeFlag = if ($LiveMode) { "--live" } else { "" }
$modeText = if ($LiveMode) { "LIVE" } else { "TEST" }

Write-Host ""
Write-Host "Mode: $modeText" -ForegroundColor $(if ($LiveMode) { $Colors.Warning } else { $Colors.Info })

if (-not $LiveMode) {
    Write-Warn "Running in TEST mode. Use -LiveMode flag for production."
}

if ($LiveMode) {
    Write-Host ""
    Write-Warn "[!]  LIVE MODE - This will affect real payments!"
    if (-not (Confirm-Action -Message "Continue with LIVE mode?")) {
        Write-Host "Aborted." -ForegroundColor $Colors.Info
        exit 0
    }
}

# ============================================================================
# Define Webhook Events
# ============================================================================

$webhookEvents = @(
    "checkout.session.completed",
    "checkout.session.expired",
    "payment_intent.succeeded",
    "payment_intent.payment_failed"
)

Write-Host ""
Write-Step "Webhook will listen for these events:"
foreach ($event in $webhookEvents) {
    Write-Host "  - $event" -ForegroundColor White
}

# ============================================================================
# Check for Existing Webhook
# ============================================================================

Write-Host ""
Write-Step "Checking for existing webhooks..."

$existingWebhooks = stripe webhook_endpoints list $modeFlag --limit 100 2>&1 | ConvertFrom-Json -ErrorAction SilentlyContinue

$existingEndpoint = $null
if ($existingWebhooks -and $existingWebhooks.data) {
    $existingEndpoint = $existingWebhooks.data | Where-Object { $_.url -eq $WebhookUrl }
}

if ($existingEndpoint) {
    Write-Warn "Webhook already exists for $WebhookUrl"
    Write-Host "  ID: $($existingEndpoint.id)" -ForegroundColor White
    Write-Host "  Status: $($existingEndpoint.status)" -ForegroundColor White
    
    if (Confirm-Action -Message "Delete and recreate?") {
        Write-Step "Deleting existing webhook..."
        stripe webhook_endpoints delete $existingEndpoint.id $modeFlag 2>&1 | Out-Null
        Write-Success "Deleted existing webhook"
    }
    else {
        Write-Host ""
        Write-Host "To get the existing webhook secret, go to:" -ForegroundColor $Colors.Info
        Write-Host "  https://dashboard.stripe.com/webhooks/$($existingEndpoint.id)" -ForegroundColor White
        exit 0
    }
}

# ============================================================================
# Create Webhook Endpoint
# ============================================================================

Write-Host ""
Write-Step "Creating webhook endpoint..."

$eventsArg = $webhookEvents -join ","

# Create the webhook
$createResult = stripe webhook_endpoints create `
    --url $WebhookUrl `
    --enabled-events $eventsArg `
    $modeFlag 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Failure "Failed to create webhook"
    Write-Host $createResult -ForegroundColor $Colors.Warning
    exit 1
}

# Parse the result to get the webhook secret
$webhookData = $createResult | ConvertFrom-Json -ErrorAction SilentlyContinue

if (-not $webhookData) {
    Write-Failure "Could not parse webhook response"
    Write-Host $createResult
    exit 1
}

$webhookId = $webhookData.id
$webhookSecret = $webhookData.secret

Write-Success "Webhook created successfully!"
Write-Host ""
Write-Host "  Webhook ID: $webhookId" -ForegroundColor White
Write-Host "  URL: $WebhookUrl" -ForegroundColor White

# ============================================================================
# Display Webhook Secret
# ============================================================================

Write-Host ""
Write-Header "Webhook Signing Secret"

Write-Host "STRIPE_WEBHOOK_SECRET=$webhookSecret" -ForegroundColor $Colors.Success
Write-Host ""

# Save to secrets file
$secretsFile = "$PSScriptRoot\config\.env.secrets"
if (Test-Path $secretsFile) {
    Write-Step "Updating secrets file..."
    
    $content = Get-Content $secretsFile -Raw
    if ($content -match "STRIPE_WEBHOOK_SECRET=.*") {
        $content = $content -replace "STRIPE_WEBHOOK_SECRET=.*", "STRIPE_WEBHOOK_SECRET=$webhookSecret"
    }
    else {
        $content += "`nSTRIPE_WEBHOOK_SECRET=$webhookSecret"
    }
    $content | Out-File -FilePath $secretsFile -Encoding UTF8
    Write-Success "Updated $secretsFile"
}

# ============================================================================
# Update Vercel (Optional)
# ============================================================================

Write-Host ""
if (Test-CommandExists "vercel") {
    if (Confirm-Action -Message "Update Vercel with webhook secret?") {
        Write-Step "Updating Vercel environment variable..."
        
        echo $webhookSecret | vercel env add STRIPE_WEBHOOK_SECRET production --yes --force 2>&1 | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Updated STRIPE_WEBHOOK_SECRET on Vercel"
        }
        else {
            Write-Warn "Failed to update Vercel. Add manually."
        }
    }
}

# ============================================================================
# Test Webhook
# ============================================================================

Write-Host ""
if (Confirm-Action -Message "Send a test webhook event?") {
    Write-Step "Sending test event (checkout.session.completed)..."
    
    stripe trigger checkout.session.completed $modeFlag 2>&1
    
    Write-Host ""
    Write-Host "Check your Vercel logs to see if the webhook was received:" -ForegroundColor $Colors.Info
    Write-Host "  https://vercel.com/james-hortons-projects-6d806c91/kollect-it-marketplace-1/logs" -ForegroundColor White
}

# ============================================================================
# Summary
# ============================================================================

Write-Host ""
Write-Header "Summary"

Write-Host "[OK] Webhook created: $webhookId" -ForegroundColor $Colors.Success
Write-Host "[OK] URL: $WebhookUrl" -ForegroundColor $Colors.Success
Write-Host "[OK] Events: $($webhookEvents.Count) configured" -ForegroundColor $Colors.Success
Write-Host ""

Write-Host "View in Stripe Dashboard:" -ForegroundColor $Colors.Info
$dashboardUrl = if ($LiveMode) { 
    "https://dashboard.stripe.com/webhooks" 
} else { 
    "https://dashboard.stripe.com/test/webhooks" 
}
Write-Host "  $dashboardUrl" -ForegroundColor White

# ============================================================================
# Next Steps
# ============================================================================

Write-Host ""
Write-Header "Next Steps"

Write-Host "1. Verify DNS configuration:" -ForegroundColor $Colors.Info
Write-Host "   .\04-verify-dns.ps1" -ForegroundColor White
Write-Host ""

Write-Host "2. If in TEST mode, remember to recreate in LIVE mode before launch:" -ForegroundColor $Colors.Info
Write-Host "   .\03-setup-stripe-webhook.ps1 -LiveMode" -ForegroundColor White
