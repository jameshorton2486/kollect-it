<#
.SYNOPSIS
    Complete Kollect-It deployment workflow.

.DESCRIPTION
    This script orchestrates the full deployment process:
    1. Generate secrets
    2. Configure Vercel
    3. Set up Stripe webhook
    4. Verify DNS
    5. Test API endpoints
    6. Set up desktop app
    7. Run pre-flight check

.PARAMETER SkipSecrets
    Skip secret generation (use existing)

.PARAMETER SkipVercel
    Skip Vercel configuration

.PARAMETER SkipStripe
    Skip Stripe webhook setup

.PARAMETER DesktopAppPath
    Path to desktop app (optional)

.EXAMPLE
    .\08-full-deployment.ps1
    
.EXAMPLE
    .\08-full-deployment.ps1 -SkipSecrets -SkipVercel

.NOTES
    This is the main deployment script. Run this for a complete setup.
#>

param(
    [switch]$SkipSecrets,
    [switch]$SkipVercel,
    [switch]$SkipStripe,
    [string]$DesktopAppPath = ""
)

# Load common functions
. "$PSScriptRoot\lib\common-functions.ps1"

# ============================================================================
# Banner
# ============================================================================

Clear-Host
Write-Host ""
Write-Host "  ██╗  ██╗ ██████╗ ██╗     ██╗     ███████╗ ██████╗████████╗      ██╗████████╗" -ForegroundColor $Colors.Header
Write-Host "  ██║ ██╔╝██╔═══██╗██║     ██║     ██╔════╝██╔════╝╚══██╔══╝      ██║╚══██╔══╝" -ForegroundColor $Colors.Header
Write-Host "  █████╔╝ ██║   ██║██║     ██║     █████╗  ██║        ██║   █████╗██║   ██║   " -ForegroundColor $Colors.Header
Write-Host "  ██╔═██╗ ██║   ██║██║     ██║     ██╔══╝  ██║        ██║   ╚════╝██║   ██║   " -ForegroundColor $Colors.Header
Write-Host "  ██║  ██╗╚██████╔╝███████╗███████╗███████╗╚██████╗   ██║         ██║   ██║   " -ForegroundColor $Colors.Header
Write-Host "  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝ ╚═════╝   ╚═╝         ╚═╝   ╚═╝   " -ForegroundColor $Colors.Header
Write-Host ""
Write-Host "                    Production Deployment Automation" -ForegroundColor $Colors.Info
Write-Host ""
Write-Host ("=" * 75) -ForegroundColor $Colors.Header
Write-Host ""

# ============================================================================
# Deployment Steps Overview
# ============================================================================

Write-Host "This script will perform the following steps:" -ForegroundColor $Colors.Info
Write-Host ""
Write-Host "  1. Generate Secrets" -ForegroundColor $(if ($SkipSecrets) { "DarkGray" } else { "White" })
Write-Host "  2. Configure Vercel Environment Variables" -ForegroundColor $(if ($SkipVercel) { "DarkGray" } else { "White" })
Write-Host "  3. Set Up Stripe Webhook" -ForegroundColor $(if ($SkipStripe) { "DarkGray" } else { "White" })
Write-Host "  4. Verify DNS Configuration" -ForegroundColor White
Write-Host "  5. Test API Endpoints" -ForegroundColor White
Write-Host "  6. Configure Desktop App" -ForegroundColor White
Write-Host "  7. Run Pre-Flight Check" -ForegroundColor White
Write-Host ""

if ($SkipSecrets) { Write-Host "  (Skipping: Secrets)" -ForegroundColor "DarkGray" }
if ($SkipVercel) { Write-Host "  (Skipping: Vercel)" -ForegroundColor "DarkGray" }
if ($SkipStripe) { Write-Host "  (Skipping: Stripe)" -ForegroundColor "DarkGray" }

Write-Host ""
if (-not (Confirm-Action -Message "Continue with deployment?" -DefaultYes $true)) {
    Write-Host "Deployment cancelled." -ForegroundColor $Colors.Info
    exit 0
}

# ============================================================================
# Track Progress
# ============================================================================

$stepResults = @{}
$startTime = Get-Date

function Complete-Step {
    param([string]$Name, [bool]$Success)
    $stepResults[$Name] = $Success
    if ($Success) {
        Write-Success "Completed: $Name"
    }
    else {
        Write-Failure "Failed: $Name"
    }
    Write-Host ""
}

# ============================================================================
# Step 1: Generate Secrets
# ============================================================================

if (-not $SkipSecrets) {
    Write-Header "Step 1: Generate Secrets"
    
    $secretsFile = "$PSScriptRoot\config\.env.secrets"
    
    if (Test-Path $secretsFile) {
        Write-Warn "Secrets file already exists"
        if (Confirm-Action -Message "Regenerate secrets? (This will overwrite existing)") {
            & "$PSScriptRoot\01-generate-secrets.ps1"
            Complete-Step -Name "Generate Secrets" -Success ($LASTEXITCODE -eq 0)
        }
        else {
            Write-Host "Using existing secrets file" -ForegroundColor $Colors.Info
            Complete-Step -Name "Generate Secrets" -Success $true
        }
    }
    else {
        & "$PSScriptRoot\01-generate-secrets.ps1"
        Complete-Step -Name "Generate Secrets" -Success ($LASTEXITCODE -eq 0)
    }
    
    # Pause for user to fill in API keys
    Write-Host ""
    Write-Header "ACTION REQUIRED"
    Write-Host "Before continuing, you must fill in the API keys in the secrets file:" -ForegroundColor $Colors.Warning
    Write-Host ""
    Write-Host "  notepad `"$secretsFile`"" -ForegroundColor White
    Write-Host ""
    Write-Host "Replace all PLACEHOLDER values with real API keys from:" -ForegroundColor $Colors.Info
    Write-Host "  - Supabase:  https://supabase.com/dashboard" -ForegroundColor White
    Write-Host "  - Stripe:    https://dashboard.stripe.com/apikeys" -ForegroundColor White
    Write-Host "  - ImageKit:  https://imagekit.io/dashboard/developer/api-keys" -ForegroundColor White
    Write-Host "  - Anthropic: https://console.anthropic.com/settings/keys" -ForegroundColor White
    Write-Host "  - Resend:    https://resend.com/api-keys" -ForegroundColor White
    Write-Host ""
    
    Read-Host "Press ENTER when you have filled in all API keys"
    
    # Verify no placeholders remain
    $envVars = Read-EnvFile -Path $secretsFile
    $placeholders = $envVars.GetEnumerator() | Where-Object { $_.Value -match "PLACEHOLDER" }
    
    if ($placeholders.Count -gt 0) {
        Write-Failure "Found $($placeholders.Count) placeholder values still in secrets file:"
        foreach ($ph in $placeholders) {
            Write-Host "  - $($ph.Key)" -ForegroundColor $Colors.Warning
        }
        Write-Host ""
        Write-Host "Please fill in all values before continuing." -ForegroundColor $Colors.Warning
        exit 1
    }
    
    Write-Success "All API keys configured"
}
else {
    Complete-Step -Name "Generate Secrets" -Success $true
}

# ============================================================================
# Step 2: Configure Vercel
# ============================================================================

if (-not $SkipVercel) {
    Write-Header "Step 2: Configure Vercel Environment Variables"
    
    if (-not (Test-CommandExists "vercel")) {
        Write-Warn "Vercel CLI not installed. Skipping automatic configuration."
        Write-Host "Install with: npm install -g vercel" -ForegroundColor $Colors.Info
        Write-Host "Then run: .\02-setup-vercel-env.ps1" -ForegroundColor White
        Complete-Step -Name "Vercel Configuration" -Success $false
    }
    else {
        & "$PSScriptRoot\02-setup-vercel-env.ps1"
        Complete-Step -Name "Vercel Configuration" -Success ($LASTEXITCODE -eq 0)
    }
}
else {
    Complete-Step -Name "Vercel Configuration" -Success $true
}

# ============================================================================
# Step 3: Stripe Webhook
# ============================================================================

if (-not $SkipStripe) {
    Write-Header "Step 3: Set Up Stripe Webhook"
    
    if (-not (Test-CommandExists "stripe")) {
        Write-Warn "Stripe CLI not installed. Skipping automatic webhook setup."
        Write-Host "Download from: https://stripe.com/docs/stripe-cli" -ForegroundColor $Colors.Info
        Write-Host ""
        Write-Host "Manual setup:" -ForegroundColor $Colors.Info
        Write-Host "  1. Go to https://dashboard.stripe.com/webhooks" -ForegroundColor White
        Write-Host "  2. Add endpoint: https://kollect-it.com/api/webhooks/stripe" -ForegroundColor White
        Write-Host "  3. Select events: checkout.session.completed, payment_intent.succeeded" -ForegroundColor White
        Write-Host "  4. Copy webhook secret to Vercel as STRIPE_WEBHOOK_SECRET" -ForegroundColor White
        Complete-Step -Name "Stripe Webhook" -Success $false
    }
    else {
        & "$PSScriptRoot\03-setup-stripe-webhook.ps1"
        Complete-Step -Name "Stripe Webhook" -Success ($LASTEXITCODE -eq 0)
    }
}
else {
    Complete-Step -Name "Stripe Webhook" -Success $true
}

# ============================================================================
# Step 4: DNS Verification
# ============================================================================

Write-Header "Step 4: Verify DNS Configuration"

& "$PSScriptRoot\04-verify-dns.ps1"
$dnsSuccess = $LASTEXITCODE -eq 0
Complete-Step -Name "DNS Verification" -Success $dnsSuccess

if (-not $dnsSuccess) {
    Write-Warn "DNS issues detected. You may need to configure Bluehost DNS records."
    Write-Host ""
    if (-not (Confirm-Action -Message "Continue anyway?")) {
        Write-Host "Deployment paused. Fix DNS and re-run." -ForegroundColor $Colors.Info
        exit 1
    }
}

# ============================================================================
# Step 5: API Testing
# ============================================================================

Write-Header "Step 5: Test API Endpoints"

& "$PSScriptRoot\05-test-api-endpoints.ps1"
Complete-Step -Name "API Testing" -Success ($LASTEXITCODE -eq 0)

# ============================================================================
# Step 6: Desktop App Setup
# ============================================================================

Write-Header "Step 6: Configure Desktop App"

if (-not [string]::IsNullOrWhiteSpace($DesktopAppPath)) {
    & "$PSScriptRoot\07-desktop-app-setup.ps1" -DesktopAppPath $DesktopAppPath
    Complete-Step -Name "Desktop App Setup" -Success ($LASTEXITCODE -eq 0)
}
else {
    Write-Host "Desktop app path not provided. Skipping setup." -ForegroundColor $Colors.Info
    Write-Host "Run later with: .\07-desktop-app-setup.ps1 -DesktopAppPath 'path\to\desktop-app'" -ForegroundColor White
    Complete-Step -Name "Desktop App Setup" -Success $true
}

# ============================================================================
# Step 7: Pre-Flight Check
# ============================================================================

Write-Header "Step 7: Final Pre-Flight Check"

& "$PSScriptRoot\06-pre-flight-check.ps1"
$preflightSuccess = $LASTEXITCODE -eq 0
Complete-Step -Name "Pre-Flight Check" -Success $preflightSuccess

# ============================================================================
# Deployment Summary
# ============================================================================

$endTime = Get-Date
$duration = $endTime - $startTime

Write-Host ""
Write-Host ("=" * 75) -ForegroundColor $Colors.Header
Write-Header "Deployment Summary"

Write-Host "Duration: $([math]::Round($duration.TotalMinutes, 1)) minutes" -ForegroundColor $Colors.Info
Write-Host ""

$passedSteps = ($stepResults.GetEnumerator() | Where-Object { $_.Value }).Count
$totalSteps = $stepResults.Count

Write-Host "Steps Completed: $passedSteps / $totalSteps" -ForegroundColor $(if ($passedSteps -eq $totalSteps) { $Colors.Success } else { $Colors.Warning })
Write-Host ""

foreach ($step in $stepResults.GetEnumerator()) {
    $icon = if ($step.Value) { "[OK]" } else { "[FAIL]" }
    $color = if ($step.Value) { $Colors.Success } else { $Colors.Error }
    Write-Host "  $icon $($step.Key)" -ForegroundColor $color
}

# ============================================================================
# Final Status
# ============================================================================

Write-Host ""
Write-Host ("=" * 75) -ForegroundColor $Colors.Header

if ($preflightSuccess -and $passedSteps -ge ($totalSteps - 1)) {
    Write-Host ""
    Write-Host "  ==> DEPLOYMENT COMPLETE - READY FOR LAUNCH!" -ForegroundColor $Colors.Success
    Write-Host ""
    Write-Host "  Your Kollect-It marketplace is live at:" -ForegroundColor White
    Write-Host "  https://kollect-it.com" -ForegroundColor $Colors.Info
    Write-Host ""
}
else {
    Write-Host ""
    Write-Host "  [!]  DEPLOYMENT INCOMPLETE" -ForegroundColor $Colors.Warning
    Write-Host ""
    Write-Host "  Some steps require attention. Review the issues above" -ForegroundColor White
    Write-Host "  and run the individual scripts to fix them." -ForegroundColor White
    Write-Host ""
}

Write-Host ("=" * 75) -ForegroundColor $Colors.Header
Write-Host ""
