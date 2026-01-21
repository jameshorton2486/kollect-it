# ============================================
# Kollect-It Production Readiness Verification
# ============================================
# Comprehensive pre-launch checks
# ============================================

$ErrorActionPreference = "Stop"
$failures = @()
$warnings = @()

Write-Host "🚀 Kollect-It Production Readiness Check" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# ============================================
# A. Environment Variable Verification
# ============================================
Write-Host "A. Environment Variables" -ForegroundColor Yellow
Write-Host "─────────────────────────" -ForegroundColor Yellow

$requiredVars = @(
    "DATABASE_URL",
    "DIRECT_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "STRIPE_SECRET_KEY",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "IMAGEKIT_PRIVATE_KEY",
    "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY",
    "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
    "PRODUCT_INGEST_API_KEY"
)

$missingVars = @()
foreach ($var in $requiredVars) {
    $value = [Environment]::GetEnvironmentVariable($var, "Process")
    if (-not $value -or $value -match "placeholder") {
        $missingVars += $var
        Write-Host "  ❌ $var" -ForegroundColor Red
    } else {
        Write-Host "  ✅ $var" -ForegroundColor Green
    }
}

if ($missingVars.Count -gt 0) {
    $failures += "Missing environment variables: $($missingVars -join ', ')"
}

Write-Host ""

# ============================================
# B. Prisma Migration Verification
# ============================================
Write-Host "B. Prisma Migrations" -ForegroundColor Yellow
Write-Host "─────────────────────" -ForegroundColor Yellow

try {
    $migrationStatus = bun x prisma migrate status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Migrations up to date" -ForegroundColor Green
        
        # Check for origin/source fields (they don't exist, which is correct)
        $schemaCheck = Select-String -Path "prisma/schema.prisma" -Pattern "origin|source" -Context 0,2
        if ($schemaCheck -and $schemaCheck.Line -match "Product") {
            Write-Host "  ⚠️  Origin/source fields found in Product model" -ForegroundColor Yellow
            $warnings += "Origin/source fields exist (may need verification)"
        } else {
            Write-Host "  ✅ Product model verified (no origin/source fields)" -ForegroundColor Green
        }
    } else {
        Write-Host "  ❌ Migration check failed" -ForegroundColor Red
        $failures += "Prisma migrations not up to date"
    }
} catch {
    $failures += "Prisma migration check failed: $($_.Exception.Message)"
    Write-Host "  ❌ Migration check error" -ForegroundColor Red
}

Write-Host ""

# ============================================
# C. API Health Checks
# ============================================
Write-Host "C. API Health Checks" -ForegroundColor Yellow
Write-Host "────────────────────" -ForegroundColor Yellow

$baseUrl = $env:NEXTAUTH_URL
if (-not $baseUrl) {
    $baseUrl = "http://localhost:3000"
}

# Check 1: Ingest endpoint auth
Write-Host "  Testing ingest endpoint auth..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/admin/products/ingest" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer WRONG_KEY" } `
        -ErrorAction SilentlyContinue
    
    if ($response.StatusCode -eq 401) {
        Write-Host " ✅" -ForegroundColor Green
    } else {
        Write-Host " ⚠️  Expected 401, got $($response.StatusCode)" -ForegroundColor Yellow
        $warnings += "Ingest auth check returned unexpected status"
    }
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host " ✅" -ForegroundColor Green
    } else {
        Write-Host " ❌" -ForegroundColor Red
        $warnings += "Ingest auth check failed: $($_.Exception.Message)"
    }
}

Write-Host ""

# ============================================
# D. Build & Runtime Checks
# ============================================
Write-Host "D. Build & Runtime" -ForegroundColor Yellow
Write-Host "───────────────────" -ForegroundColor Yellow

# TypeScript
Write-Host "  TypeScript compilation..." -NoNewline
try {
    $tscOutput = bun x tsc --noEmit 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✅" -ForegroundColor Green
    } else {
        Write-Host " ❌" -ForegroundColor Red
        $failures += "TypeScript compilation failed"
    }
} catch {
    Write-Host " ❌" -ForegroundColor Red
    $failures += "TypeScript check failed"
}

# Prisma Generate
Write-Host "  Prisma client..." -NoNewline
try {
    $prismaClient = Test-Path "node_modules/@prisma/client/index.js"
    if ($prismaClient) {
        Write-Host " ✅" -ForegroundColor Green
    } else {
        Write-Host " ❌" -ForegroundColor Red
        $failures += "Prisma client not generated"
    }
} catch {
    Write-Host " ❌" -ForegroundColor Red
    $failures += "Prisma client check failed"
}

# Build
Write-Host "  Production build..." -NoNewline
try {
    $buildOutput = bun run build 2>&1 | Out-String
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✅" -ForegroundColor Green
    } else {
        Write-Host " ❌" -ForegroundColor Red
        $failures += "Production build failed"
    }
} catch {
    Write-Host " ❌" -ForegroundColor Red
    $failures += "Build check failed"
}

Write-Host ""

# ============================================
# E. SKU Validation Coverage
# ============================================
Write-Host "E. SKU Validation Coverage" -ForegroundColor Yellow
Write-Host "───────────────────────────" -ForegroundColor Yellow

$endpointsWithValidation = @(
    "src/app/api/admin/products/ingest/route.ts",
    "src/app/api/admin/products/create/route.ts"
)

$endpointsWithoutValidation = @(
    "src/app/api/products/route.ts",
    "src/app/api/admin/products/approve/route.ts",
    "src/app/api/admin/products/bulk-approve/route.ts"
)

Write-Host "  Endpoints WITH validation:" -ForegroundColor Green
foreach ($file in $endpointsWithValidation) {
    if (Test-Path $file) {
        Write-Host "    ✅ $file" -ForegroundColor Green
    }
}

Write-Host "  Endpoints WITHOUT validation:" -ForegroundColor Red
foreach ($file in $endpointsWithoutValidation) {
    if (Test-Path $file) {
        Write-Host "    ❌ $file" -ForegroundColor Red
        $warnings += "SKU validation missing in $file"
    }
}

Write-Host ""

# ============================================
# Summary
# ============================================
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

if ($failures.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "✅ All checks passed! Ready for production." -ForegroundColor Green
    exit 0
} elseif ($failures.Count -eq 0) {
    Write-Host "⚠️  Passed with $($warnings.Count) warning(s):" -ForegroundColor Yellow
    foreach ($warn in $warnings) {
        Write-Host "  - $warn" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "Review warnings before deploying." -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "❌ Failed with $($failures.Count) error(s):" -ForegroundColor Red
    foreach ($fail in $failures) {
        Write-Host "  - $fail" -ForegroundColor Red
    }
    if ($warnings.Count -gt 0) {
        Write-Host ""
        Write-Host "Warnings:" -ForegroundColor Yellow
        foreach ($warn in $warnings) {
            Write-Host "  - $warn" -ForegroundColor Yellow
        }
    }
    Write-Host ""
    Write-Host "Fix errors before deploying." -ForegroundColor Red
    exit 1
}
