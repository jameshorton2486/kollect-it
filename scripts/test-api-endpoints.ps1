# ============================================
# API Endpoint Health Checks
# ============================================
# Tests critical API endpoints
# ============================================

param(
    [string]$BaseUrl = "https://kollect-it.com",
    [string]$ApiKey = $env:PRODUCT_INGEST_API_KEY
)

Write-Host "🧪 Testing API Endpoints" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl" -ForegroundColor Gray
Write-Host ""

$errors = 0

# Test 1: Ingest endpoint - wrong auth
Write-Host "1. Ingest endpoint (wrong auth)..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/admin/products/ingest" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer WRONG_KEY" } `
        -ErrorAction SilentlyContinue
    
    if ($response.StatusCode -eq 401) {
        Write-Host " ✅ (401 as expected)" -ForegroundColor Green
    } else {
        Write-Host " ⚠️  Expected 401, got $($response.StatusCode)" -ForegroundColor Yellow
        $errors++
    }
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host " ✅ (401 as expected)" -ForegroundColor Green
    } else {
        Write-Host " ❌ Unexpected error" -ForegroundColor Red
        $errors++
    }
}

# Test 2: Ingest endpoint - invalid SKU
if ($ApiKey) {
    Write-Host "2. Ingest endpoint (invalid SKU)..." -NoNewline
    try {
        $body = @{
            sku = "BAD-SKU-FORMAT"
            title = "Test"
            description = "Test"
            price = 100
            category = "test"
            images = @()
        } | ConvertTo-Json
        
        $response = Invoke-WebRequest -Uri "$BaseUrl/api/admin/products/ingest" `
            -Method POST `
            -Headers @{
                "Authorization" = "Bearer $ApiKey"
                "Content-Type" = "application/json"
            } `
            -Body $body `
            -ErrorAction SilentlyContinue
        
        if ($response.StatusCode -eq 400) {
            Write-Host " ✅ (400 as expected)" -ForegroundColor Green
        } else {
            Write-Host " ⚠️  Expected 400, got $($response.StatusCode)" -ForegroundColor Yellow
            $errors++
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 400) {
            Write-Host " ✅ (400 as expected)" -ForegroundColor Green
        } else {
            Write-Host " ❌ Unexpected error (status: $statusCode)" -ForegroundColor Red
            $errors++
        }
    }
} else {
    Write-Host "2. Ingest endpoint (invalid SKU)..." -NoNewline
    Write-Host " ⚠️  Skipped (PRODUCT_INGEST_API_KEY not set)" -ForegroundColor Yellow
}

# Test 3: Products endpoint
Write-Host "3. Products endpoint..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/products" `
        -Method GET `
        -ErrorAction SilentlyContinue
    
    if ($response.StatusCode -eq 200) {
        Write-Host " ✅" -ForegroundColor Green
    } else {
        Write-Host " ⚠️  Status: $($response.StatusCode)" -ForegroundColor Yellow
        $errors++
    }
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 200) {
        Write-Host " ✅" -ForegroundColor Green
    } else {
        Write-Host " ❌ Status: $statusCode" -ForegroundColor Red
        $errors++
    }
}

Write-Host ""
if ($errors -eq 0) {
    Write-Host "✅ All API tests passed" -ForegroundColor Green
    exit 0
} else {
    Write-Host "❌ $errors test(s) failed" -ForegroundColor Red
    exit 1
}
