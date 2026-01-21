<#
.SYNOPSIS
    Sets up the Kollect-It desktop application environment.

.DESCRIPTION
    This script:
    1. Creates the .env file for the desktop app
    2. Verifies Python environment
    3. Tests API connectivity
    4. Validates category mapping

.PARAMETER DesktopAppPath
    Path to the desktop app directory

.EXAMPLE
    .\07-desktop-app-setup.ps1
    
.EXAMPLE
    .\07-desktop-app-setup.ps1 -DesktopAppPath "C:\Projects\kollect-it\product-application\desktop-app"

.NOTES
    Run after Vercel environment is configured.
#>

param(
    [string]$DesktopAppPath = ""
)

# Load common functions
. "$PSScriptRoot\lib\common-functions.ps1"

Write-Header "Desktop Application Setup"

# ============================================================================
# Find Desktop App Directory
# ============================================================================

if ([string]::IsNullOrWhiteSpace($DesktopAppPath)) {
    # Try common locations
    $possiblePaths = @(
        ".\product-application\desktop-app",
        "..\kollect-it\product-application\desktop-app",
        "$env:USERPROFILE\Projects\kollect-it\product-application\desktop-app",
        "$env:USERPROFILE\Documents\kollect-it\product-application\desktop-app"
    )
    
    foreach ($path in $possiblePaths) {
        if (Test-Path "$path\main.py") {
            $DesktopAppPath = Resolve-Path $path
            break
        }
    }
}

if ([string]::IsNullOrWhiteSpace($DesktopAppPath) -or -not (Test-Path "$DesktopAppPath\main.py")) {
    Write-Failure "Could not find desktop app directory"
    Write-Host ""
    Write-Host "Please provide the path:" -ForegroundColor $Colors.Info
    Write-Host "  .\07-desktop-app-setup.ps1 -DesktopAppPath 'C:\path\to\desktop-app'" -ForegroundColor White
    exit 1
}

Write-Host "Desktop App Path: $DesktopAppPath" -ForegroundColor $Colors.Info
Write-Host ""

# ============================================================================
# Load Secrets
# ============================================================================

$secretsFile = "$PSScriptRoot\config\.env.secrets"

if (-not (Test-Path $secretsFile)) {
    Write-Failure "Secrets file not found: $secretsFile"
    Write-Host "  Run 01-generate-secrets.ps1 first" -ForegroundColor $Colors.Warning
    exit 1
}

$envVars = Read-EnvFile -Path $secretsFile

# Required variables for desktop app
$requiredVars = @(
    "PRODUCT_INGEST_API_KEY",
    "ANTHROPIC_API_KEY",
    "IMAGEKIT_PRIVATE_KEY",
    "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY"
)

$missingVars = @()
foreach ($var in $requiredVars) {
    if (-not $envVars.ContainsKey($var) -or $envVars[$var] -match "PLACEHOLDER") {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Failure "Missing required variables in secrets file:"
    foreach ($var in $missingVars) {
        Write-Host "  - $var" -ForegroundColor $Colors.Warning
    }
    Write-Host ""
    Write-Host "Edit the secrets file and add these values:" -ForegroundColor $Colors.Info
    Write-Host "  notepad `"$secretsFile`"" -ForegroundColor White
    exit 1
}

Write-Success "All required variables found"

# ============================================================================
# Create Desktop App .env File
# ============================================================================

Write-Header "Creating Desktop App .env"

$desktopEnvFile = "$DesktopAppPath\.env"
$backupFile = "$desktopEnvFile.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

# Backup existing .env if present
if (Test-Path $desktopEnvFile) {
    Copy-Item $desktopEnvFile $backupFile
    Write-Warn "Backed up existing .env to $backupFile"
}

# Create new .env content
$desktopEnvContent = @"
# ============================================================================
# KOLLECT-IT DESKTOP APP ENVIRONMENT
# Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
# ============================================================================

# API Authentication - MUST match Vercel PRODUCT_INGEST_API_KEY
PRODUCT_INGEST_API_KEY=$($envVars["PRODUCT_INGEST_API_KEY"])

# ImageKit CDN Credentials
IMAGEKIT_PUBLIC_KEY=$($envVars["NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY"])
IMAGEKIT_PRIVATE_KEY=$($envVars["IMAGEKIT_PRIVATE_KEY"])

# Anthropic AI for product analysis
ANTHROPIC_API_KEY=$($envVars["ANTHROPIC_API_KEY"])

# Website Connection
WEBSITE_URL=https://kollect-it.com
"@

$desktopEnvContent | Out-File -FilePath $desktopEnvFile -Encoding UTF8
Write-Success "Created $desktopEnvFile"

# ============================================================================
# Verify Python Environment
# ============================================================================

Write-Header "Checking Python Environment"

# Check Python
$pythonCmd = $null
if (Test-CommandExists "python") {
    $pythonCmd = "python"
}
elseif (Test-CommandExists "python3") {
    $pythonCmd = "python3"
}

if ($pythonCmd) {
    $pythonVersion = & $pythonCmd --version 2>&1
    Write-Success "Python found: $pythonVersion"
    
    # Check if requirements.txt exists
    $requirementsFile = "$DesktopAppPath\requirements.txt"
    if (Test-Path $requirementsFile) {
        Write-Host ""
        Write-Step "Checking if virtual environment exists..."
        
        $venvPath = "$DesktopAppPath\venv"
        if (Test-Path $venvPath) {
            Write-Success "Virtual environment found at $venvPath"
        }
        else {
            Write-Warn "No virtual environment found"
            Write-Host ""
            if (Confirm-Action -Message "Create virtual environment?") {
                Write-Step "Creating virtual environment..."
                Push-Location $DesktopAppPath
                & $pythonCmd -m venv venv
                Pop-Location
                Write-Success "Virtual environment created"
            }
        }
        
        Write-Host ""
        Write-Host "To install dependencies:" -ForegroundColor $Colors.Info
        Write-Host "  cd `"$DesktopAppPath`"" -ForegroundColor White
        Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor White
        Write-Host "  pip install -r requirements.txt" -ForegroundColor White
    }
}
else {
    Write-Failure "Python not found"
    Write-Host "  Install Python 3.8+ from https://python.org" -ForegroundColor $Colors.Warning
}

# ============================================================================
# Test API Connectivity
# ============================================================================

Write-Header "Testing API Connectivity"

$apiKey = $envVars["PRODUCT_INGEST_API_KEY"]
$apiUrl = "https://kollect-it.com/api/admin/products/ingest"

Write-Step "Testing connection to $apiUrl..."

try {
    $headers = @{
        "Authorization" = "Bearer $apiKey"
    }
    
    $response = Invoke-WebRequest -Uri $apiUrl -Headers $headers -Method GET -TimeoutSec 10 -UseBasicParsing
    
    if ($response.StatusCode -eq 200) {
        Write-Success "API connection successful!"
        
        # Parse response to show categories
        $data = $response.Content | ConvertFrom-Json
        if ($data.categories) {
            Write-Host ""
            Write-Host "Available Categories:" -ForegroundColor $Colors.Info
            foreach ($cat in $data.categories) {
                Write-Host "  - $($cat.name) ($($cat.slug))" -ForegroundColor White
            }
        }
    }
}
catch {
    $status = [int]$_.Exception.Response.StatusCode
    if ($status -eq 401) {
        Write-Failure "API returned 401 Unauthorized"
        Write-Host "  The PRODUCT_INGEST_API_KEY may not match Vercel" -ForegroundColor $Colors.Warning
    }
    elseif ($status -eq 404) {
        Write-Failure "API endpoint not found (404)"
        Write-Host "  Check that the website is deployed correctly" -ForegroundColor $Colors.Warning
    }
    else {
        Write-Failure "API connection failed: $($_.Exception.Message)"
    }
}

# ============================================================================
# Summary
# ============================================================================

Write-Header "Setup Complete"

Write-Host "Desktop app .env file: $desktopEnvFile" -ForegroundColor $Colors.Info
Write-Host ""

Write-Host "To run the desktop app:" -ForegroundColor $Colors.Info
Write-Host "  cd `"$DesktopAppPath`"" -ForegroundColor White
Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host "  python main.py" -ForegroundColor White
Write-Host ""

Write-Header "Important Reminders"

Write-Host "1. The PRODUCT_INGEST_API_KEY must exactly match Vercel" -ForegroundColor $Colors.Warning
Write-Host "   Desktop: $desktopEnvFile" -ForegroundColor White
Write-Host "   Vercel: Settings → Environment Variables" -ForegroundColor White
Write-Host ""

Write-Host "2. SKU format must be: KOL-YYYY-NNNN" -ForegroundColor $Colors.Warning
Write-Host "   Example: KOL-2026-0001" -ForegroundColor White
Write-Host ""

Write-Host "3. Test with a single product first before batch uploads" -ForegroundColor $Colors.Warning
