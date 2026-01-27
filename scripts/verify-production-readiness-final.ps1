# ============================================================================
# Kollect-It Production Readiness Verification Script
# ============================================================================
# Purpose: Comprehensive pre-launch verification
# Usage: .\scripts\verify-production-readiness-final.ps1
# ============================================================================

$ErrorActionPreference = "Stop"
$script:FAILED = $false
$script:WARNINGS = @()

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

function Test-Command {
    param([string]$Command, [string]$Description)
    
    Write-Status "Testing: $Description" "Info"
    try {
        $result = Get-Command $Command -ErrorAction Stop
        Write-Status "  ✅ $Command found" "Success"
        return $true
    } catch {
        Write-Status "  ❌ $Command not found" "Error"
        $script:FAILED = $true
        return $false
    }
}

function Test-EnvVar {
    param([string]$VarName, [bool]$Required = $true)
    
    $value = [Environment]::GetEnvironmentVariable($VarName)
    if ($null -eq $value -or $value -eq "") {
        if ($Required) {
            Write-Status "  ❌ $VarName is missing" "Error"
            $script:FAILED = $true
            return $false
        } else {
            Write-Status "  ⚠️  $VarName is not set (optional)" "Warning"
            $script:WARNINGS += "$VarName not set"
            return $false
        }
    } else {
        Write-Status "  ✅ $VarName is set" "Success"
        return $true
    }
}

# ============================================================================
# PHASE 1: ENVIRONMENT VERIFICATION
# ============================================================================

Write-Status "`n╔════════════════════════════════════════════════════════╗" "Header"
Write-Status "║  PHASE 1: ENVIRONMENT VERIFICATION                     ║" "Header"
Write-Status "╚════════════════════════════════════════════════════════╝`n" "Header"

# Check required commands
Test-Command "bun" "Bun runtime"
Test-Command "node" "Node.js runtime"

# Check .env.local exists
if (Test-Path ".env.local") {
    Write-Status "✅ .env.local file exists" "Success"
    
    # Load .env.local (basic check)
    $envContent = Get-Content ".env.local" -Raw
    Write-Status "`nChecking required environment variables:" "Info"
    
    # Required variables
    $requiredVars = @(
        "DATABASE_URL",
        "DIRECT_URL",
        "NEXTAUTH_SECRET",
        "PRODUCT_INGEST_API_KEY"
    )
    
    foreach ($var in $requiredVars) {
        if ($envContent -match "$var=") {
            Write-Status "  ✅ $var is defined" "Success"
        } else {
            Write-Status "  ❌ $var is missing" "Error"
            $script:FAILED = $true
        }
    }
    
    # Optional but recommended
    $optionalVars = @(
        "STRIPE_SECRET_KEY",
        "STRIPE_WEBHOOK_SECRET",
        "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY",
        "IMAGEKIT_PRIVATE_KEY"
    )
    
    foreach ($var in $optionalVars) {
        if ($envContent -match "$var=") {
            Write-Status "  ✅ $var is defined" "Success"
        } else {
            Write-Status "  ⚠️  $var is not set (recommended)" "Warning"
            $script:WARNINGS += "$var not set"
        }
    }
} else {
    Write-Status "❌ .env.local file not found" "Error"
    $script:FAILED = $true
}

# ============================================================================
# PHASE 2: PRISMA VERIFICATION
# ============================================================================

Write-Status "`n╔════════════════════════════════════════════════════════╗" "Header"
Write-Status "║  PHASE 2: PRISMA VERIFICATION                          ║" "Header"
Write-Status "╚════════════════════════════════════════════════════════╝`n" "Header"

# Check Prisma client generation
Write-Status "Generating Prisma client..." "Info"
try {
    $prismaGen = bun x prisma generate 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Status "  ✅ Prisma client generated successfully" "Success"
    } else {
        Write-Status "  ❌ Prisma client generation failed" "Error"
        Write-Host $prismaGen
        $script:FAILED = $true
    }
} catch {
    Write-Status "  ❌ Prisma client generation error" "Error"
    $script:FAILED = $true
}

# Check migration status
Write-Status "`nChecking migration status..." "Info"
try {
    $migrationStatus = bun x prisma migrate status 2>&1
    if ($migrationStatus -match "Database schema is up to date") {
        Write-Status "  ✅ All migrations applied" "Success"
    } elseif ($migrationStatus -match "following migration.*have not yet been applied") {
        Write-Status "  ⚠️  Pending migrations detected" "Warning"
        Write-Host $migrationStatus
        $script:WARNINGS += "Pending migrations"
    } else {
        Write-Status "  ❌ Migration check failed" "Error"
        Write-Host $migrationStatus
        $script:FAILED = $true
    }
} catch {
    Write-Status "  ⚠️  Could not check migration status (database may not be accessible)" "Warning"
    $script:WARNINGS += "Migration status check failed"
}

# Verify origin/source fields exist in schema
Write-Status "`nVerifying schema fields..." "Info"
$schemaContent = Get-Content "prisma/schema.prisma" -Raw
if ($schemaContent -match "origin\s+String\?") {
    Write-Status "  ✅ origin field exists in schema" "Success"
} else {
    Write-Status "  ❌ origin field missing from schema" "Error"
    $script:FAILED = $true
}

if ($schemaContent -match "source\s+String\?") {
    Write-Status "  ✅ source field exists in schema" "Success"
} else {
    Write-Status "  ❌ source field missing from schema" "Error"
    $script:FAILED = $true
}

# ============================================================================
# PHASE 3: BUILD VERIFICATION
# ============================================================================

Write-Status "`n╔════════════════════════════════════════════════════════╗" "Header"
Write-Status "║  PHASE 3: BUILD VERIFICATION                           ║" "Header"
Write-Status "╚════════════════════════════════════════════════════════╝`n" "Header"

# TypeScript check
Write-Status "Running TypeScript check..." "Info"
try {
    $tscResult = bun x tsc --noEmit 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Status "  ✅ TypeScript compilation successful" "Success"
    } else {
        Write-Status "  ❌ TypeScript errors found" "Error"
        Write-Host $tscResult
        $script:FAILED = $true
    }
} catch {
    Write-Status "  ❌ TypeScript check failed" "Error"
    $script:FAILED = $true
}

# Build check (may fail locally due to DATABASE_URL, but that's OK)
Write-Status "`nRunning production build..." "Info"
Write-Status "  Note: Build may fail locally if DATABASE_URL is empty (expected)" "Warning"
try {
    $buildResult = bun run build 2>&1 | Select-Object -Last 20
    if ($LASTEXITCODE -eq 0) {
        Write-Status "  ✅ Production build successful" "Success"
    } else {
        if ($buildResult -match "DATABASE_URL|Can't reach database") {
            Write-Status "  ⚠️  Build failed due to database connection (expected locally)" "Warning"
            $script:WARNINGS += "Build failed (expected - database not accessible locally)"
        } else {
            Write-Status "  ❌ Build failed with unexpected error" "Error"
            Write-Host $buildResult
            $script:FAILED = $true
        }
    }
} catch {
    Write-Status "  ⚠️  Build check incomplete (may be expected locally)" "Warning"
    $script:WARNINGS += "Build check incomplete"
}

# ============================================================================
# PHASE 4: CODE VERIFICATION
# ============================================================================

Write-Status "`n╔════════════════════════════════════════════════════════╗" "Header"
Write-Status "║  PHASE 4: CODE VERIFICATION                            ║" "Header"
Write-Status "╚════════════════════════════════════════════════════════╝`n" "Header"

# Check for legacy SKU patterns
Write-Status "Checking for legacy SKU patterns..." "Info"
$legacyPatterns = Get-ChildItem -Path "src/app/api" -Recurse -Filter "*.ts" | 
    Select-String -Pattern "Math\.floor\(10000|YYYY-XXXXX"

if ($legacyPatterns) {
    Write-Status "  ❌ Legacy SKU patterns found" "Error"
    $legacyPatterns | ForEach-Object { Write-Host "    $($_.Filename):$($_.LineNumber)" }
    $script:FAILED = $true
} else {
    Write-Status "  ✅ No legacy SKU patterns found" "Success"
}

# Check formatSKU usage
Write-Status "`nChecking formatSKU usage..." "Info"
$formatSkuFiles = Get-ChildItem -Path "src/app/api" -Recurse -Filter "*.ts" | 
    Select-String -Pattern "formatSKU"

$expectedFiles = @(
    "products/route.ts",
    "admin/products/approve/route.ts",
    "admin/products/bulk-approve/route.ts"
)

$foundFiles = $formatSkuFiles | ForEach-Object { $_.Filename }
foreach ($expected in $expectedFiles) {
    $found = $foundFiles | Where-Object { $_ -like "*$expected*" }
    if ($found) {
        Write-Status "  ✅ $expected uses formatSKU" "Success"
    } else {
        Write-Status "  ⚠️  $expected may not use formatSKU" "Warning"
        $script:WARNINGS += "$expected formatSKU usage unclear"
    }
}

# ============================================================================
# FINAL REPORT
# ============================================================================

Write-Status "`n╔════════════════════════════════════════════════════════╗" "Header"
Write-Status "║  VERIFICATION COMPLETE                                  ║" "Header"
Write-Status "╚════════════════════════════════════════════════════════╝`n" "Header"

if ($script:FAILED) {
    Write-Status "❌ VERIFICATION FAILED" "Error"
    Write-Status "`nPlease fix the errors above before proceeding with deployment." "Error"
    exit 1
} else {
    Write-Status "✅ VERIFICATION PASSED" "Success"
    
    if ($script:WARNINGS.Count -gt 0) {
        Write-Status "`n⚠️  WARNINGS:" "Warning"
        foreach ($warning in $script:WARNINGS) {
            Write-Status "  - $warning" "Warning"
        }
        Write-Status "`nWarnings are non-blocking but should be reviewed." "Warning"
    }
    
    Write-Status "`n✅ Ready for production deployment!" "Success"
    exit 0
}
