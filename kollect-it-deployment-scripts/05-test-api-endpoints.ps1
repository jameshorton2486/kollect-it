<#
.SYNOPSIS
    Tests all critical API endpoints for Kollect-It.

.DESCRIPTION
    This script tests:
    1. Health check endpoint
    2. Public API endpoints (products, categories)
    3. Protected API endpoints (product ingest)
    4. Stripe webhook endpoint

.PARAMETER BaseUrl
    The base URL to test (default: https://kollect-it.com)

.PARAMETER ApiKey
    The PRODUCT_INGEST_API_KEY for testing protected endpoints

.EXAMPLE
    .\05-test-api-endpoints.ps1
    
.EXAMPLE
    .\05-test-api-endpoints.ps1 -BaseUrl "https://kollect-it-preview.vercel.app"

.NOTES
    No external dependencies required.
#>

param(
    [string]$BaseUrl = "https://kollect-it.com",
    [string]$ApiKey = ""
)

# Load common functions
. "$PSScriptRoot\lib\common-functions.ps1"

Write-Header "API Endpoint Testing"

# Remove trailing slash if present
$BaseUrl = $BaseUrl.TrimEnd('/')

Write-Host "Base URL: $BaseUrl" -ForegroundColor $Colors.Info
Write-Host ""

# Load API key from secrets file if not provided
if ([string]::IsNullOrWhiteSpace($ApiKey)) {
    $secretsFile = "$PSScriptRoot\config\.env.secrets"
    if (Test-Path $secretsFile) {
        $envVars = Read-EnvFile -Path $secretsFile
        $ApiKey = $envVars["PRODUCT_INGEST_API_KEY"]
    }
}

# ============================================================================
# Test Results Tracking
# ============================================================================

$results = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [int[]]$ExpectedStatus = @(200),
        [string]$Description = ""
    )
    
    $result = @{
        Name = $Name
        Url = $Url
        Method = $Method
        Status = $null
        Success = $false
        Message = ""
        Duration = 0
    }
    
    Write-Host "Testing: $Name" -NoNewline
    if ($Description) {
        Write-Host " ($Description)" -ForegroundColor $Colors.Info -NoNewline
    }
    Write-Host ""
    Write-Host "  $Method $Url" -ForegroundColor White
    
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            TimeoutSec = 30
            UseBasicParsing = $true
        }
        
        if ($Headers.Count -gt 0) {
            $params.Headers = $Headers
        }
        
        $response = Invoke-WebRequest @params -ErrorAction Stop
        $stopwatch.Stop()
        
        $result.Status = $response.StatusCode
        $result.Duration = $stopwatch.ElapsedMilliseconds
        
        if ($ExpectedStatus -contains $response.StatusCode) {
            $result.Success = $true
            $result.Message = "OK"
            Write-Host "  OK - HTTP $($response.StatusCode) ($($result.Duration)ms)" -ForegroundColor $Colors.Success
        }
        else {
            $result.Message = "Unexpected status code"
            Write-Host "  [FAIL] HTTP $($response.StatusCode) - Expected: $($ExpectedStatus -join ', ')" -ForegroundColor $Colors.Warning
        }
    }
    catch {
        $stopwatch.Stop()
        $result.Duration = $stopwatch.ElapsedMilliseconds
        
        if ($_.Exception.Response) {
            $result.Status = [int]$_.Exception.Response.StatusCode
            
            # Some endpoints are expected to return 401/403 without auth
            if ($ExpectedStatus -contains $result.Status) {
                $result.Success = $true
                $result.Message = "OK (expected status)"
                Write-Host "  [OK] HTTP $($result.Status) (expected)" -ForegroundColor $Colors.Success
            }
            else {
                $result.Message = $_.Exception.Message
                Write-Host "  [FAIL] HTTP $($result.Status): $($_.Exception.Message)" -ForegroundColor $Colors.Error
            }
        }
        else {
            $result.Message = $_.Exception.Message
            Write-Host "  [FAIL] Error: $($_.Exception.Message)" -ForegroundColor $Colors.Error
        }
    }
    
    Write-Host ""
    return $result
}

# ============================================================================
# Public Endpoints
# ============================================================================

Write-Header "Public Endpoints"

# Health Check
$results += Test-Endpoint -Name "Health Check" `
    -Url "$BaseUrl/api/health" `
    -Description "Basic health check"

# Homepage
$results += Test-Endpoint -Name "Homepage" `
    -Url "$BaseUrl" `
    -Description "Main website"

# Products API
$results += Test-Endpoint -Name "Products API" `
    -Url "$BaseUrl/api/products" `
    -Description "Product listing"

# Categories API
$results += Test-Endpoint -Name "Categories API" `
    -Url "$BaseUrl/api/categories" `
    -Description "Category listing"

# Search API
$results += Test-Endpoint -Name "Search API" `
    -Url "$BaseUrl/api/search?q=test" `
    -Description "Product search"

# Shop Page
$results += Test-Endpoint -Name "Shop Page" `
    -Url "$BaseUrl/shop" `
    -Description "Shop page"

# Sitemap
$results += Test-Endpoint -Name "Sitemap" `
    -Url "$BaseUrl/sitemap.xml" `
    -Description "SEO sitemap"

# Robots.txt
$results += Test-Endpoint -Name "Robots.txt" `
    -Url "$BaseUrl/robots.txt" `
    -Description "SEO robots file"

# ============================================================================
# Protected Endpoints (Without Auth - Should Return 401)
# ============================================================================

Write-Header "Protected Endpoints (Auth Check)"

# Admin Products (should require auth)
$results += Test-Endpoint -Name "Admin Products (No Auth)" `
    -Url "$BaseUrl/api/admin/products" `
    -ExpectedStatus @(401, 403) `
    -Description "Should reject without auth"

# Product Ingest (should require API key)
$results += Test-Endpoint -Name "Product Ingest (No Auth)" `
    -Url "$BaseUrl/api/admin/products/ingest" `
    -ExpectedStatus @(401, 403) `
    -Description "Should reject without API key"

# ============================================================================
# Protected Endpoints (With Auth)
# ============================================================================

if (-not [string]::IsNullOrWhiteSpace($ApiKey)) {
    Write-Header "Protected Endpoints (With API Key)"
    
    $authHeaders = @{
        "Authorization" = "Bearer $ApiKey"
    }
    
    # Product Ingest with API key
    $results += Test-Endpoint -Name "Product Ingest (With Auth)" `
        -Url "$BaseUrl/api/admin/products/ingest" `
        -Headers $authHeaders `
        -ExpectedStatus @(200, 405) `
        -Description "Should accept with valid API key"
    
    # Next SKU endpoint
    $results += Test-Endpoint -Name "Next SKU" `
        -Url "$BaseUrl/api/admin/products/next-sku" `
        -Headers $authHeaders `
        -Description "Get next available SKU"
}
else {
    Write-Warn "No API key provided - skipping authenticated endpoint tests"
    Write-Host "  Provide with: -ApiKey 'your-key'" -ForegroundColor White
    Write-Host "  Or add to config\.env.secrets" -ForegroundColor White
    Write-Host ""
}

# ============================================================================
# Stripe Webhook Endpoint
# ============================================================================

Write-Header "Stripe Webhook"

# Stripe webhook should return 400 for invalid payload (not 404)
$results += Test-Endpoint -Name "Stripe Webhook" `
    -Url "$BaseUrl/api/webhooks/stripe" `
    -Method "POST" `
    -ExpectedStatus @(400, 401) `
    -Description "Should exist but reject invalid payload"

# ============================================================================
# Summary
# ============================================================================

Write-Header "Test Results Summary"

$passed = ($results | Where-Object { $_.Success }).Count
$failed = ($results | Where-Object { -not $_.Success }).Count
$total = $results.Count

Write-Host "Passed: $passed / $total" -ForegroundColor $(if ($failed -eq 0) { $Colors.Success } else { $Colors.Warning })

if ($failed -gt 0) {
    Write-Host ""
    Write-Host "Failed Tests:" -ForegroundColor $Colors.Error
    foreach ($result in ($results | Where-Object { -not $_.Success })) {
        Write-Host "  - $($result.Name): $($result.Message)" -ForegroundColor $Colors.Warning
    }
}

# ============================================================================
# Performance Summary
# ============================================================================

Write-Host ""
Write-Header "Performance Summary"

$avgDuration = ($results | Where-Object { $_.Duration -gt 0 } | Measure-Object -Property Duration -Average).Average
$maxDuration = ($results | Where-Object { $_.Duration -gt 0 } | Measure-Object -Property Duration -Maximum).Maximum
$slowest = $results | Sort-Object Duration -Descending | Select-Object -First 1

Write-Host "Average Response Time: $([math]::Round($avgDuration, 0))ms" -ForegroundColor White
Write-Host "Slowest Endpoint: $($slowest.Name) ($($slowest.Duration)ms)" -ForegroundColor White

if ($maxDuration -gt 5000) {
    Write-Warn "Some endpoints are slow (>5s). Consider optimization."
}
elseif ($maxDuration -gt 2000) {
    Write-Warn "Some endpoints are moderately slow (>2s)."
}
else {
    Write-Success "All endpoints respond quickly (<2s)"
}

# ============================================================================
# Export Results
# ============================================================================

$resultsFile = "$PSScriptRoot\logs\api-test-results-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"

# Ensure logs directory exists
$logsDir = "$PSScriptRoot\logs"
if (-not (Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir | Out-Null
}

$results | ConvertTo-Json -Depth 3 | Out-File -FilePath $resultsFile -Encoding UTF8
Write-Host ""
Write-Host "Results saved to: $resultsFile" -ForegroundColor $Colors.Info

# ============================================================================
# Next Steps
# ============================================================================

Write-Host ""
Write-Header "Next Steps"

if ($failed -eq 0) {
    Write-Host "1. All tests passed! Run the pre-flight check:" -ForegroundColor $Colors.Info
    Write-Host "   .\06-pre-flight-check.ps1" -ForegroundColor White
}
else {
    Write-Host "1. Fix failing endpoints before proceeding" -ForegroundColor $Colors.Warning
    Write-Host ""
    Write-Host "2. Check Vercel logs for errors:" -ForegroundColor $Colors.Info
    Write-Host "   https://vercel.com/james-hortons-projects-6d806c91/kollect-it-marketplace-1/logs" -ForegroundColor White
}
