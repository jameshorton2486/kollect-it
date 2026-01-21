# ============================================
# Kollect-It Ingest API Smoke Test
# ============================================
# Tests the /api/admin/products/ingest endpoint
# Never hardcodes secrets - uses environment variables
# ============================================

param(
    [string]$ApiKey = $env:PRODUCT_INGEST_API_KEY,
    [string]$BaseUrl = "http://localhost:3000"
)

Write-Host "🧪 Testing Ingest API Endpoint" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl" -ForegroundColor Gray
Write-Host ""

if (-not $ApiKey) {
    Write-Host "❌ ERROR: PRODUCT_INGEST_API_KEY not set" -ForegroundColor Red
    Write-Host "   Set it via: `$env:PRODUCT_INGEST_API_KEY = 'your-key'" -ForegroundColor Yellow
    Write-Host "   Or load from .env.local" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ API Key found (length: $($ApiKey.Length))" -ForegroundColor Green
Write-Host ""

# Test endpoint
$url = "$BaseUrl/api/admin/products/ingest"
$headers = @{
    "Authorization" = "Bearer $ApiKey"
    "Content-Type" = "application/json"
}

Write-Host "📡 Testing GET $url" -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri $url -Method GET -Headers $headers -ErrorAction Stop
    
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Gray
    Write-Host $response.Content
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "⚠️  Status: $statusCode" -ForegroundColor Yellow
    
    if ($statusCode -eq 401) {
        Write-Host "   Authentication failed - check PRODUCT_INGEST_API_KEY" -ForegroundColor Yellow
    } elseif ($statusCode -eq 404) {
        Write-Host "   Endpoint not found - is the server running?" -ForegroundColor Yellow
    } else {
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✨ Test complete" -ForegroundColor Cyan
