# ============================================================================
# Kollect-It API Endpoint Health Check Script
# ============================================================================
# Purpose: Test critical API endpoints for production readiness
# Usage: .\scripts\test-api-endpoints-final.ps1 [-BaseUrl https://kollect-it.com]
# ============================================================================

param(
    [string]$BaseUrl = "https://kollect-it.com"
)

$ErrorActionPreference = "Continue"

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

$script:FAILED = $false
$script:TESTS_PASSED = 0
$script:TESTS_FAILED = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [string]$Body = $null,
        [int]$ExpectedStatus = 200,
        [string]$ExpectedContent = $null
    )
    
    Write-Status "`nTesting: $Name" "Info"
    Write-Status "  URL: $Url" "Info"
    Write-Status "  Method: $Method" "Info"
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            ContentType = "application/json"
            ErrorAction = "Stop"
        }
        
        if ($Body) {
            $params.Body = $Body
        }
        
        $response = Invoke-WebRequest @params
        $statusCode = $response.StatusCode
        
        if ($statusCode -eq $ExpectedStatus) {
            Write-Status "  ✅ Status: $statusCode (expected $ExpectedStatus)" "Success"
            $script:TESTS_PASSED++
            
            if ($ExpectedContent -and $response.Content -notmatch $ExpectedContent) {
                Write-Status "  ⚠️  Response content doesn't match expected pattern" "Warning"
            }
            
            return $true
        } else {
            Write-Status "  ❌ Status: $statusCode (expected $ExpectedStatus)" "Error"
            $script:TESTS_FAILED++
            $script:FAILED = $true
            return $false
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq $ExpectedStatus) {
            Write-Status "  ✅ Status: $statusCode (expected $ExpectedStatus)" "Success"
            $script:TESTS_PASSED++
            return $true
        } else {
            Write-Status "  ❌ Request failed: $($_.Exception.Message)" "Error"
            Write-Status "  Status: $statusCode (expected $ExpectedStatus)" "Error"
            $script:TESTS_FAILED++
            $script:FAILED = $true
            return $false
        }
    }
}

Write-Status "╔════════════════════════════════════════════════════════╗" "Header"
Write-Status "║  API ENDPOINT HEALTH CHECKS                           ║" "Header"
Write-Status "╚════════════════════════════════════════════════════════╝`n" "Header"
Write-Status "Base URL: $BaseUrl`n" "Info"

# Test 1: Products endpoint (public)
Test-Endpoint `
    -Name "Products List (Public)" `
    -Url "$BaseUrl/api/products" `
    -Method "GET" `
    -ExpectedStatus 200

# Test 2: Ingest endpoint - wrong auth (should reject)
Test-Endpoint `
    -Name "Ingest API - Wrong Auth (Should Reject)" `
    -Url "$BaseUrl/api/admin/products/ingest" `
    -Method "POST" `
    -Headers @{ "x-api-key" = "WRONG_KEY" } `
    -Body '{"sku":"TEST-2026-0001","title":"Test"}' `
    -ExpectedStatus 401

# Test 3: Ingest endpoint - invalid SKU (should reject)
$apiKey = $env:PRODUCT_INGEST_API_KEY
if (-not $apiKey) {
    Write-Status "`n⚠️  PRODUCT_INGEST_API_KEY not set - skipping authenticated tests" "Warning"
} else {
    Test-Endpoint `
        -Name "Ingest API - Invalid SKU (Should Reject)" `
        -Url "$BaseUrl/api/admin/products/ingest" `
        -Method "POST" `
        -Headers @{ "x-api-key" = $apiKey } `
        -Body '{"sku":"BAD-SKU-FORMAT","title":"Test","description":"Test","price":100,"category":"fine-art","images":[]}' `
        -ExpectedStatus 400
}

# Test 4: Health check (if exists)
Test-Endpoint `
    -Name "Health Check" `
    -Url "$BaseUrl/api/health" `
    -Method "GET" `
    -ExpectedStatus 200

# Summary
Write-Status "`n╔════════════════════════════════════════════════════════╗" "Header"
Write-Status "║  TEST SUMMARY                                           ║" "Header"
Write-Status "╚════════════════════════════════════════════════════════╝`n" "Header"

Write-Status "Tests Passed: $script:TESTS_PASSED" "Success"
Write-Status "Tests Failed: $script:TESTS_FAILED" $(if ($script:TESTS_FAILED -gt 0) { "Error" } else { "Success" })

if ($script:FAILED) {
    Write-Status "`n❌ SOME TESTS FAILED" "Error"
    Write-Status "Review the errors above before proceeding." "Error"
    exit 1
} else {
    Write-Status "`n✅ ALL TESTS PASSED" "Success"
    exit 0
}
