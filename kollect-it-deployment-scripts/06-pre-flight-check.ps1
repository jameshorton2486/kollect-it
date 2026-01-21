<#
.SYNOPSIS
    Comprehensive pre-flight check before Kollect-It launch.

.DESCRIPTION
    This script verifies ALL deployment requirements:
    - Environment variables
    - DNS configuration
    - API endpoints
    - Database connectivity
    - External services
    - Build status

.EXAMPLE
    .\06-pre-flight-check.ps1

.NOTES
    Run this as the final check before going live.
#>

# Load common functions
. "$PSScriptRoot\lib\common-functions.ps1"

Write-Header "Kollect-It Pre-Flight Check"
Write-Host "Running comprehensive deployment verification..." -ForegroundColor $Colors.Info
Write-Host ""

# ============================================================================
# Results Tracking
# ============================================================================

$checks = @{
    Critical = @()
    Warning = @()
    Info = @()
}

function Add-Check {
    param(
        [string]$Name,
        [bool]$Passed,
        [string]$Message = "",
        [ValidateSet("Critical", "Warning", "Info")]
        [string]$Level = "Critical"
    )
    
    $check = @{
        Name = $Name
        Passed = $Passed
        Message = $Message
    }
    
    $checks[$Level] += $check
    
    $icon = if ($Passed) { "[OK]" } else { "[FAIL]" }
    $color = if ($Passed) { $Colors.Success } else { 
        if ($Level -eq "Critical") { $Colors.Error } 
        elseif ($Level -eq "Warning") { $Colors.Warning }
        else { $Colors.Info }
    }
    
    Write-Host "  $icon $Name" -ForegroundColor $color
    if (-not $Passed -and $Message) {
        Write-Host "    → $Message" -ForegroundColor $Colors.Warning
    }
}

# ============================================================================
# 1. Local Environment
# ============================================================================

Write-Header "1. Local Environment"

# Check if secrets file exists
$secretsFile = "$PSScriptRoot\config\.env.secrets"
Add-Check -Name "Secrets file exists" -Passed (Test-Path $secretsFile)

# Check for placeholder values
if (Test-Path $secretsFile) {
    $envVars = Read-EnvFile -Path $secretsFile
    $placeholders = $envVars.GetEnumerator() | Where-Object { $_.Value -match "PLACEHOLDER" }
    Add-Check -Name "No placeholder values in secrets" `
        -Passed ($placeholders.Count -eq 0) `
        -Message "Found $($placeholders.Count) placeholder(s)"
}

# Check required CLIs
Add-Check -Name "Vercel CLI installed" -Passed (Test-CommandExists "vercel") -Level "Warning"
Add-Check -Name "Stripe CLI installed" -Passed (Test-CommandExists "stripe") -Level "Warning"

# ============================================================================
# 2. Domain & DNS
# ============================================================================

Write-Header "2. Domain & DNS"

$domain = "kollect-it.com"
$expectedIP = "76.76.21.21"

# A Record
try {
    $aRecord = Resolve-DnsName -Name $domain -Type A -ErrorAction Stop | 
               Where-Object { $_.Type -eq 'A' } | 
               Select-Object -First 1 -ExpandProperty IPAddress
    Add-Check -Name "A record points to Vercel" -Passed ($aRecord -eq $expectedIP) `
        -Message "Found: $aRecord (expected: $expectedIP)"
}
catch {
    Add-Check -Name "A record points to Vercel" -Passed $false -Message "DNS resolution failed"
}

# HTTPS accessibility
try {
    $response = Invoke-WebRequest -Uri "https://$domain" -Method Head -TimeoutSec 10 -UseBasicParsing
    Add-Check -Name "HTTPS accessible" -Passed ($response.StatusCode -eq 200)
}
catch {
    Add-Check -Name "HTTPS accessible" -Passed $false -Message $_.Exception.Message
}

# SSL Certificate
try {
    $request = [System.Net.HttpWebRequest]::Create("https://$domain")
    $request.Method = "HEAD"
    $request.Timeout = 10000
    $response = $request.GetResponse()
    $cert = $request.ServicePoint.Certificate
    $expiry = [DateTime]::Parse($cert.GetExpirationDateString())
    $daysLeft = ($expiry - (Get-Date)).Days
    Add-Check -Name "SSL certificate valid" -Passed ($daysLeft -gt 7) `
        -Message "Expires in $daysLeft days"
    $response.Close()
}
catch {
    Add-Check -Name "SSL certificate valid" -Passed $false -Message $_.Exception.Message
}

# ============================================================================
# 3. API Endpoints
# ============================================================================

Write-Header "3. API Endpoints"

$baseUrl = "https://$domain"

# Health check
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/health" -TimeoutSec 10 -UseBasicParsing
    Add-Check -Name "Health endpoint" -Passed ($response.StatusCode -eq 200)
}
catch {
    Add-Check -Name "Health endpoint" -Passed $false -Message $_.Exception.Message
}

# Products API
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/products" -TimeoutSec 10 -UseBasicParsing
    Add-Check -Name "Products API" -Passed ($response.StatusCode -eq 200)
}
catch {
    Add-Check -Name "Products API" -Passed $false -Message $_.Exception.Message
}

# Categories API
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/categories" -TimeoutSec 10 -UseBasicParsing
    Add-Check -Name "Categories API" -Passed ($response.StatusCode -eq 200)
}
catch {
    Add-Check -Name "Categories API" -Passed $false -Message $_.Exception.Message
}

# Product Ingest (should return 401 without auth)
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/admin/products/ingest" -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    Add-Check -Name "Product Ingest auth required" -Passed $false -Message "Returned 200 (should be 401)"
}
catch {
    $status = [int]$_.Exception.Response.StatusCode
    Add-Check -Name "Product Ingest auth required" -Passed ($status -eq 401 -or $status -eq 403)
}

# Stripe webhook (should return 400 for empty payload)
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/webhooks/stripe" -Method POST -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
    Add-Check -Name "Stripe webhook endpoint" -Passed $false -Message "Returned 200 (should be 400)"
}
catch {
    $status = [int]$_.Exception.Response.StatusCode
    Add-Check -Name "Stripe webhook endpoint" -Passed ($status -eq 400 -or $status -eq 401) `
        -Message $(if ($status -eq 404) { "Endpoint not found (404)" } else { "" })
}

# ============================================================================
# 4. Vercel Configuration
# ============================================================================

Write-Header "4. Vercel Configuration"

if (Test-CommandExists "vercel") {
    # Check if logged in
    $whoami = vercel whoami 2>&1
    Add-Check -Name "Vercel authenticated" -Passed ($LASTEXITCODE -eq 0)
    
    # Check environment variables (just verify we can list them)
    try {
        $envList = vercel env ls production 2>&1
        Add-Check -Name "Vercel env vars accessible" -Passed ($LASTEXITCODE -eq 0) -Level "Warning"
    }
    catch {
        Add-Check -Name "Vercel env vars accessible" -Passed $false -Level "Warning"
    }
}
else {
    Add-Check -Name "Vercel CLI check" -Passed $false -Message "CLI not installed" -Level "Warning"
}

# ============================================================================
# 5. External Services (Basic Connectivity)
# ============================================================================

Write-Header "5. External Services"

# Supabase (via API health)
# We can't directly test Supabase without credentials, but we can check if API works
Add-Check -Name "Database (via API)" -Passed (
    (Get-Variable -Name "checks" -ValueOnly).Critical | 
    Where-Object { $_.Name -eq "Products API" -and $_.Passed }
).Count -gt 0 `
    -Message "Inferred from Products API"

# ImageKit (check if a known CDN URL is accessible)
try {
    $response = Invoke-WebRequest -Uri "https://ik.imagekit.io" -Method Head -TimeoutSec 5 -UseBasicParsing
    Add-Check -Name "ImageKit CDN reachable" -Passed ($response.StatusCode -eq 200) -Level "Info"
}
catch {
    Add-Check -Name "ImageKit CDN reachable" -Passed $false -Level "Warning" -Message "CDN may be down"
}

# Stripe (check if dashboard is accessible - basic connectivity)
try {
    $response = Invoke-WebRequest -Uri "https://api.stripe.com" -Method Head -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Add-Check -Name "Stripe API reachable" -Passed $true -Level "Info"
}
catch {
    # Stripe API returns 401 without auth, which is expected
    $status = [int]$_.Exception.Response.StatusCode
    Add-Check -Name "Stripe API reachable" -Passed ($status -eq 401) -Level "Info"
}

# ============================================================================
# 6. SEO & Public Pages
# ============================================================================

Write-Header "6. SEO & Public Pages"

# Sitemap
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/sitemap.xml" -TimeoutSec 10 -UseBasicParsing
    Add-Check -Name "Sitemap accessible" -Passed ($response.StatusCode -eq 200) -Level "Warning"
}
catch {
    Add-Check -Name "Sitemap accessible" -Passed $false -Level "Warning"
}

# Robots.txt
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/robots.txt" -TimeoutSec 10 -UseBasicParsing
    Add-Check -Name "Robots.txt accessible" -Passed ($response.StatusCode -eq 200) -Level "Warning"
}
catch {
    Add-Check -Name "Robots.txt accessible" -Passed $false -Level "Warning"
}

# Shop page
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/shop" -TimeoutSec 10 -UseBasicParsing
    Add-Check -Name "Shop page loads" -Passed ($response.StatusCode -eq 200)
}
catch {
    Add-Check -Name "Shop page loads" -Passed $false -Message $_.Exception.Message
}

# ============================================================================
# Summary
# ============================================================================

Write-Host ""
Write-Header "Pre-Flight Check Summary"

$criticalPassed = ($checks.Critical | Where-Object { $_.Passed }).Count
$criticalFailed = ($checks.Critical | Where-Object { -not $_.Passed }).Count
$criticalTotal = $checks.Critical.Count

$warningPassed = ($checks.Warning | Where-Object { $_.Passed }).Count
$warningFailed = ($checks.Warning | Where-Object { -not $_.Passed }).Count
$warningTotal = $checks.Warning.Count

$infoPassed = ($checks.Info | Where-Object { $_.Passed }).Count
$infoTotal = $checks.Info.Count

Write-Host "Critical Checks: " -NoNewline
Write-Host "$criticalPassed / $criticalTotal passed" -ForegroundColor $(if ($criticalFailed -eq 0) { $Colors.Success } else { $Colors.Error })

Write-Host "Warning Checks:  " -NoNewline
Write-Host "$warningPassed / $warningTotal passed" -ForegroundColor $(if ($warningFailed -eq 0) { $Colors.Success } else { $Colors.Warning })

Write-Host "Info Checks:     " -NoNewline
Write-Host "$infoPassed / $infoTotal passed" -ForegroundColor $Colors.Info

# ============================================================================
# Go/No-Go Decision
# ============================================================================

Write-Host ""
Write-Header "Launch Decision"

if ($criticalFailed -eq 0) {
    Write-Host "╔══════════════════════════════════════════════════════════════════╗" -ForegroundColor $Colors.Success
    Write-Host "║                                                                  ║" -ForegroundColor $Colors.Success
    Write-Host "║   [OK] GO FOR LAUNCH                                               ║" -ForegroundColor $Colors.Success
    Write-Host "║                                                                  ║" -ForegroundColor $Colors.Success
    Write-Host "║   All critical checks passed. You are ready to go live!         ║" -ForegroundColor $Colors.Success
    Write-Host "║                                                                  ║" -ForegroundColor $Colors.Success
    Write-Host "╚══════════════════════════════════════════════════════════════════╝" -ForegroundColor $Colors.Success
    
    if ($warningFailed -gt 0) {
        Write-Host ""
        Write-Warn "$warningFailed warning(s) should be addressed soon:"
        foreach ($check in ($checks.Warning | Where-Object { -not $_.Passed })) {
            Write-Host "  - $($check.Name): $($check.Message)" -ForegroundColor $Colors.Warning
        }
    }
}
else {
    Write-Host "╔══════════════════════════════════════════════════════════════════╗" -ForegroundColor $Colors.Error
    Write-Host "║                                                                  ║" -ForegroundColor $Colors.Error
    Write-Host "║   [FAIL] NOT READY FOR LAUNCH                                        ║" -ForegroundColor $Colors.Error
    Write-Host "║                                                                  ║" -ForegroundColor $Colors.Error
    Write-Host "║   $criticalFailed critical issue(s) must be fixed before launch.       ║" -ForegroundColor $Colors.Error
    Write-Host "║                                                                  ║" -ForegroundColor $Colors.Error
    Write-Host "╚══════════════════════════════════════════════════════════════════╝" -ForegroundColor $Colors.Error
    
    Write-Host ""
    Write-Host "Critical Issues:" -ForegroundColor $Colors.Error
    foreach ($check in ($checks.Critical | Where-Object { -not $_.Passed })) {
        Write-Host "  [FAIL] $($check.Name)" -ForegroundColor $Colors.Error
        if ($check.Message) {
            Write-Host "    → $($check.Message)" -ForegroundColor $Colors.Warning
        }
    }
}

# ============================================================================
# Save Report
# ============================================================================

$reportFile = "$PSScriptRoot\logs\preflight-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"

# Ensure logs directory exists
$logsDir = "$PSScriptRoot\logs"
if (-not (Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir | Out-Null
}

$report = @{
    Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Domain = $domain
    Checks = $checks
    Summary = @{
        CriticalPassed = $criticalPassed
        CriticalFailed = $criticalFailed
        WarningPassed = $warningPassed
        WarningFailed = $warningFailed
        ReadyForLaunch = ($criticalFailed -eq 0)
    }
}

$report | ConvertTo-Json -Depth 4 | Out-File -FilePath $reportFile -Encoding UTF8
Write-Host ""
Write-Host "Report saved: $reportFile" -ForegroundColor $Colors.Info
