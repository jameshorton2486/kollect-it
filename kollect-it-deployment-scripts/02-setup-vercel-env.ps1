<#
.SYNOPSIS
    Sets up Vercel environment variables using the Vercel CLI.

.DESCRIPTION
    This script reads the .env.secrets file and pushes all environment
    variables to your Vercel project using the Vercel CLI.

.PARAMETER ProjectName
    The Vercel project name (default: kollect-it-marketplace-1)

.PARAMETER Environment
    Target environment: production, preview, or development (default: production)

.EXAMPLE
    .\02-setup-vercel-env.ps1
    
.EXAMPLE
    .\02-setup-vercel-env.ps1 -Environment preview

.NOTES
    Requires: Vercel CLI (npm install -g vercel)
    Run 01-generate-secrets.ps1 first to create the secrets file.
#>

param(
    [string]$ProjectName = "kollect-it-marketplace-1",
    [ValidateSet("production", "preview", "development")]
    [string]$Environment = "production"
)

# Load common functions
. "$PSScriptRoot\lib\common-functions.ps1"

Write-Header "Vercel Environment Variable Setup"

# ============================================================================
# Check Prerequisites
# ============================================================================

Write-Step "Checking prerequisites..."

Assert-CommandExists -Command "vercel" -InstallInstructions "npm install -g vercel"

# Check if logged in to Vercel
Write-Step "Checking Vercel authentication..."
$vercelWhoami = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Failure "Not logged in to Vercel"
    Write-Host "  Run: vercel login" -ForegroundColor $Colors.Warning
    exit 1
}
Write-Success "Logged in as: $vercelWhoami"

# ============================================================================
# Load Secrets File
# ============================================================================

$secretsFile = "$PSScriptRoot\config\.env.secrets"

if (-not (Test-Path $secretsFile)) {
    Write-Failure "Secrets file not found: $secretsFile"
    Write-Host "  Run 01-generate-secrets.ps1 first" -ForegroundColor $Colors.Warning
    exit 1
}

Write-Step "Loading secrets from $secretsFile..."
$envVars = Read-EnvFile -Path $secretsFile

# Check for placeholder values
$placeholders = $envVars.GetEnumerator() | Where-Object { $_.Value -match "PLACEHOLDER" }
if ($placeholders.Count -gt 0) {
    Write-Failure "Found $($placeholders.Count) placeholder values that need to be filled in:"
    foreach ($ph in $placeholders) {
        Write-Host "  - $($ph.Key)" -ForegroundColor $Colors.Warning
    }
    Write-Host ""
    Write-Host "Edit the secrets file first:" -ForegroundColor $Colors.Info
    Write-Host "  notepad `"$secretsFile`"" -ForegroundColor White
    exit 1
}

Write-Success "Loaded $($envVars.Count) environment variables"

# ============================================================================
# Link to Vercel Project (if not already linked)
# ============================================================================

Write-Step "Linking to Vercel project..."

# Check if .vercel folder exists
if (-not (Test-Path ".vercel")) {
    Write-Warn "Project not linked. Running vercel link..."
    vercel link --yes
    if ($LASTEXITCODE -ne 0) {
        Write-Failure "Failed to link project"
        exit 1
    }
}
Write-Success "Project linked"

# ============================================================================
# Set Environment Variables
# ============================================================================

Write-Header "Setting Environment Variables on Vercel"

$successCount = 0
$failCount = 0
$total = $envVars.Count

foreach ($entry in $envVars.GetEnumerator()) {
    $key = $entry.Key
    $value = $entry.Value
    
    # Skip empty values
    if ([string]::IsNullOrWhiteSpace($value)) {
        Write-Warn "Skipping empty variable: $key"
        continue
    }
    
    Write-Host "  Setting $key..." -NoNewline
    
    # Use Vercel CLI to set the environment variable
    # Note: Vercel CLI 50.4.8 doesn't support --yes flag, using interactive mode
    # The value is piped via stdin
    $result = echo $value | vercel env add $key $Environment --force 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host " OK" -ForegroundColor $Colors.Success
        $successCount++
    }
    else {
        Write-Host " FAILED" -ForegroundColor $Colors.Error
        Write-Host "    Error: $result" -ForegroundColor $Colors.Warning
        $failCount++
    }
}

# ============================================================================
# Summary
# ============================================================================

Write-Host ""
Write-Header "Summary"

Write-Host "Environment: $Environment" -ForegroundColor $Colors.Info
Write-Host "Variables set: $successCount / $total" -ForegroundColor $(if ($failCount -eq 0) { $Colors.Success } else { $Colors.Warning })

if ($failCount -gt 0) {
    Write-Warn "$failCount variables failed to set"
}

# ============================================================================
# Trigger Redeployment
# ============================================================================

Write-Host ""
if (Confirm-Action -Message "Trigger a redeployment to apply changes?" -DefaultYes $true) {
    Write-Step "Triggering redeployment..."
    
    vercel --prod --yes 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Redeployment triggered!"
    }
    else {
        Write-Warn "Redeployment may have failed. Check Vercel dashboard."
    }
}

# ============================================================================
# Next Steps
# ============================================================================

Write-Host ""
Write-Header "Next Steps"

Write-Host "1. Verify variables in Vercel Dashboard:" -ForegroundColor $Colors.Info
Write-Host "   https://vercel.com/james-hortons-projects-6d806c91/$ProjectName/settings/environment-variables" -ForegroundColor White
Write-Host ""

Write-Host "2. Set up Stripe webhook:" -ForegroundColor $Colors.Info
Write-Host "   .\03-setup-stripe-webhook.ps1" -ForegroundColor White
Write-Host ""

Write-Host "3. Configure DNS (manual step):" -ForegroundColor $Colors.Info
Write-Host "   See Section 11 of deployment guide" -ForegroundColor White
