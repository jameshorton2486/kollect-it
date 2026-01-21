# ============================================
# Kollect-It Pre-Deployment Preflight Check
# ============================================
# Validates environment, Prisma, TypeScript, and build
# Fails fast with clear error messages
# ============================================

$ErrorActionPreference = "Stop"
$failures = @()

Write-Host "🚀 Kollect-It Preflight Check" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# ============================================
# 1. Check Required Environment Variables
# ============================================
Write-Host "1️⃣  Checking environment variables..." -ForegroundColor Yellow

$envFile = ".env.local"
if (-not (Test-Path $envFile)) {
    $failures += ".env.local not found"
    Write-Host "   ❌ .env.local not found" -ForegroundColor Red
} else {
    Write-Host "   ✅ .env.local exists" -ForegroundColor Green
    
    # Load .env.local
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^\s*([^#=]+)=(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            if ($value -and $value -ne "" -and $value -notmatch "placeholder") {
                [Environment]::SetEnvironmentVariable($name, $value, "Process")
            }
        }
    }
    
    # Check critical vars
    $requiredVars = @(
        "DATABASE_URL",
        "NEXTAUTH_SECRET",
        "PRODUCT_INGEST_API_KEY"
    )
    
    foreach ($var in $requiredVars) {
        $value = [Environment]::GetEnvironmentVariable($var, "Process")
        if (-not $value -or $value -match "placeholder") {
            $failures += "$var is missing or placeholder"
            Write-Host "   ❌ $var is missing or placeholder" -ForegroundColor Red
        } else {
            Write-Host "   ✅ $var is set" -ForegroundColor Green
        }
    }
}

Write-Host ""

# ============================================
# 2. Check Prisma Client
# ============================================
Write-Host "2️⃣  Checking Prisma client..." -ForegroundColor Yellow

try {
    $prismaClient = Test-Path "node_modules/@prisma/client/index.js"
    if ($prismaClient) {
        Write-Host "   ✅ Prisma client generated" -ForegroundColor Green
    } else {
        $failures += "Prisma client not generated"
        Write-Host "   ❌ Prisma client not found" -ForegroundColor Red
        Write-Host "      Run: bun x prisma generate" -ForegroundColor Yellow
    }
} catch {
    $failures += "Prisma check failed: $($_.Exception.Message)"
    Write-Host "   ❌ Prisma check failed" -ForegroundColor Red
}

Write-Host ""

# ============================================
# 3. TypeScript Validation
# ============================================
Write-Host "3️⃣  Running TypeScript validation..." -ForegroundColor Yellow

try {
    $tscOutput = bun x tsc --noEmit 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ TypeScript validation passed" -ForegroundColor Green
    } else {
        $failures += "TypeScript validation failed"
        Write-Host "   ❌ TypeScript validation failed" -ForegroundColor Red
        Write-Host $tscOutput
    }
} catch {
    $failures += "TypeScript check failed: $($_.Exception.Message)"
    Write-Host "   ❌ TypeScript check failed" -ForegroundColor Red
}

Write-Host ""

# ============================================
# 4. Production Build
# ============================================
Write-Host "4️⃣  Running production build..." -ForegroundColor Yellow

try {
    $buildOutput = bun run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Production build successful" -ForegroundColor Green
    } else {
        $failures += "Production build failed"
        Write-Host "   ❌ Production build failed" -ForegroundColor Red
        Write-Host $buildOutput | Select-Object -Last 20
    }
} catch {
    $failures += "Build check failed: $($_.Exception.Message)"
    Write-Host "   ❌ Build check failed" -ForegroundColor Red
}

Write-Host ""

# ============================================
# Summary
# ============================================
Write-Host "================================" -ForegroundColor Cyan
if ($failures.Count -eq 0) {
    Write-Host "✅ All preflight checks passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ready for deployment." -ForegroundColor Green
    exit 0
} else {
    Write-Host "❌ Preflight check failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Failures:" -ForegroundColor Red
    foreach ($failure in $failures) {
        Write-Host "  - $failure" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Fix the issues above before deploying." -ForegroundColor Yellow
    exit 1
}
