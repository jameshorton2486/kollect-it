# Kollect-It Pre-Deployment Verification Script
# Run before pushing to production
# Usage: .\verify-deployment.ps1

param(
    [switch]$SkipBuild,
    [switch]$Verbose
)

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  KOLLECT-IT DEPLOYMENT VERIFICATION" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$errors = @()
$warnings = @()

# 1. Check for gray classes
Write-Host "[1/6] Checking design system consistency..." -ForegroundColor Yellow
$grayClasses = Get-ChildItem -Path "src" -Recurse -Include "*.tsx","*.ts" -ErrorAction SilentlyContinue | 
    Select-String -Pattern "text-gray-|bg-gray-" -SimpleMatch
if ($grayClasses) {
    $count = ($grayClasses | Measure-Object).Count
    $errors += "Found $count non-standard gray class(es):"
    $grayClasses | ForEach-Object { 
        $errors += "  - $($_.Filename):$($_.LineNumber)"
        if ($Verbose) {
            Write-Host "    $($_.Line.Trim())" -ForegroundColor DarkGray
        }
    }
} else {
    Write-Host "  [PASS] No gray class inconsistencies" -ForegroundColor Green
}

# 2. Check env template consistency
Write-Host "[2/6] Checking env templates..." -ForegroundColor Yellow
$desktopEnvPath = "desktop-app-env-template.txt"
$websiteEnvPath = "env_vars_template.txt"

if (Test-Path $desktopEnvPath) {
    $desktopEnv = Get-Content $desktopEnvPath -Raw
    if ($desktopEnv -match "SERVICE_API_KEY") {
        $errors += "desktop-app-env-template.txt uses SERVICE_API_KEY (should be PRODUCT_INGEST_API_KEY)"
    } else {
        Write-Host "  [PASS] Desktop env template uses correct variable name" -ForegroundColor Green
    }
} else {
    $warnings += "desktop-app-env-template.txt not found"
}

if (Test-Path $websiteEnvPath) {
    $websiteEnv = Get-Content $websiteEnvPath -Raw
    if ($websiteEnv -match "SERVICE_API_KEY") {
        $errors += "env_vars_template.txt uses SERVICE_API_KEY (should be PRODUCT_INGEST_API_KEY)"
    }
}

# 3. Check TypeScript
Write-Host "[3/6] Running TypeScript check..." -ForegroundColor Yellow
try {
    $tsOutput = bun x tsc --noEmit 2>&1
    if ($LASTEXITCODE -ne 0) {
        $errors += "TypeScript errors found"
        if ($Verbose) {
            $tsOutput | ForEach-Object { Write-Host "    $_" -ForegroundColor DarkGray }
        }
    } else {
        Write-Host "  [PASS] TypeScript check passed" -ForegroundColor Green
    }
} catch {
    $warnings += "Could not run TypeScript check (bun not available?)"
}

# 4. Check critical files exist
Write-Host "[4/6] Checking critical files..." -ForegroundColor Yellow
$criticalFiles = @(
    "src/app/api/admin/products/ingest/route.ts",
    "src/lib/email.ts",
    "src/app/sitemap.ts",
    "src/app/robots.ts",
    "prisma/schema.prisma"
)
$missingFiles = @()
foreach ($file in $criticalFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}
if ($missingFiles.Count -gt 0) {
    $errors += "Missing critical files: $($missingFiles -join ', ')"
} else {
    Write-Host "  [PASS] All critical files present" -ForegroundColor Green
}

# 5. Check for console.log in production code (optional)
Write-Host "[5/6] Checking for debug statements..." -ForegroundColor Yellow
$consoleLogs = Get-ChildItem -Path "src/app" -Recurse -Include "*.tsx","*.ts" -ErrorAction SilentlyContinue | 
    Select-String -Pattern "console\.log\(" -SimpleMatch |
    Where-Object { $_.Path -notlike "*test*" -and $_.Path -notlike "*spec*" }
if ($consoleLogs) {
    $count = ($consoleLogs | Measure-Object).Count
    $warnings += "Found $count console.log statement(s) in production code"
} else {
    Write-Host "  [PASS] No console.log in production code" -ForegroundColor Green
}

# 6. Build test (optional)
if (-not $SkipBuild) {
    Write-Host "[6/6] Testing build..." -ForegroundColor Yellow
    try {
        $buildOutput = bun run build 2>&1
        if ($LASTEXITCODE -ne 0) {
            $errors += "Build failed"
            if ($Verbose) {
                $buildOutput | Select-Object -Last 20 | ForEach-Object { 
                    Write-Host "    $_" -ForegroundColor DarkGray 
                }
            }
        } else {
            Write-Host "  [PASS] Build succeeded" -ForegroundColor Green
        }
    } catch {
        $warnings += "Could not run build test"
    }
} else {
    Write-Host "[6/6] Skipping build test (-SkipBuild)" -ForegroundColor DarkGray
}

# Summary
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan

if ($warnings.Count -gt 0) {
    Write-Host "  WARNINGS ($($warnings.Count)):" -ForegroundColor Yellow
    $warnings | ForEach-Object { Write-Host "    - $_" -ForegroundColor Yellow }
}

if ($errors.Count -eq 0) {
    Write-Host ""
    Write-Host "  [SUCCESS] ALL CHECKS PASSED" -ForegroundColor Green
    Write-Host "  Ready to deploy to production!" -ForegroundColor Green
    $exitCode = 0
} else {
    Write-Host ""
    Write-Host "  [FAILED] $($errors.Count) ISSUE(S) FOUND:" -ForegroundColor Red
    $errors | ForEach-Object { Write-Host "    - $_" -ForegroundColor Red }
    $exitCode = 1
}

Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

exit $exitCode
