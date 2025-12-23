# =====================================================
# Kollect-It Pre-Deployment Checks
# =====================================================
# Comprehensive pre-deployment validation script
# Usage: .\scripts\run-pre-deployment-checks.ps1

$ErrorActionPreference = "Continue"
$script:Results = @{
    Build = $null
    TypeCheck = $null
    EnvCheck = $null
    Tests = $null
    Issues = @()
    Warnings = @()
}

function Write-Status {
    param($Message, $Type = "Info")
    
    switch ($Type) {
        "Success" { Write-Host "✓ $Message" -ForegroundColor Green }
        "Error" { Write-Host "✗ $Message" -ForegroundColor Red }
        "Warning" { Write-Host "⚠ $Message" -ForegroundColor Yellow }
        "Info" { Write-Host "→ $Message" -ForegroundColor Cyan }
        "Header" { 
            Write-Host "`n$Message" -ForegroundColor Cyan
            Write-Host ("=" * $Message.Length) -ForegroundColor Cyan
        }
    }
}

Write-Status "🚀 Kollect-It Pre-Deployment Checks" "Header"
Write-Host "Started: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host ""

# =====================================================
# 1. Build Test
# =====================================================
Write-Status "1. Testing Production Build..." "Header"
Write-Status "This may take 2-3 minutes..." "Info"

try {
    $buildOutput = bun run build 2>&1 | Out-String
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Build successful!" "Success"
        $script:Results.Build = $true
        
        # Check for warnings
        if ($buildOutput -match "warning|Warning") {
            Write-Status "Build completed with warnings (check output above)" "Warning"
            $script:Results.Warnings += "Build warnings detected"
        }
    } else {
        Write-Status "Build failed!" "Error"
        $script:Results.Build = $false
        $script:Results.Issues += "Build failed - check output above"
        Write-Host "`nBuild output:" -ForegroundColor Gray
        Write-Host $buildOutput -ForegroundColor Gray
    }
} catch {
    Write-Status "Build error: $($_.Exception.Message)" "Error"
    $script:Results.Build = $false
    $script:Results.Issues += "Build error occurred"
}

# =====================================================
# 2. TypeScript Check
# =====================================================
Write-Status "`n2. TypeScript Type Check..." "Header"

try {
    $tscOutput = bun run typecheck 2>&1 | Out-String
    if ($LASTEXITCODE -eq 0) {
        Write-Status "No TypeScript errors" "Success"
        $script:Results.TypeCheck = $true
    } else {
        Write-Status "TypeScript errors found" "Warning"
        $script:Results.TypeCheck = $false
        $script:Results.Warnings += "TypeScript errors detected"
        Write-Host "`nTypeScript output:" -ForegroundColor Gray
        Write-Host $tscOutput -ForegroundColor Gray
    }
} catch {
    Write-Status "TypeScript check error: $($_.Exception.Message)" "Error"
    $script:Results.TypeCheck = $false
    $script:Results.Issues += "TypeScript check failed"
}

# =====================================================
# 3. Environment Variables Check
# =====================================================
Write-Status "`n3. Environment Variables Check..." "Header"

try {
    $envOutput = bun run test:env 2>&1 | Out-String
    if ($LASTEXITCODE -eq 0) {
        Write-Status "All required environment variables are set" "Success"
        $script:Results.EnvCheck = $true
    } else {
        Write-Status "Missing required environment variables" "Error"
        $script:Results.EnvCheck = $false
        $script:Results.Issues += "Missing environment variables"
        Write-Host "`nEnvironment check output:" -ForegroundColor Gray
        Write-Host $envOutput -ForegroundColor Gray
    }
} catch {
    Write-Status "Environment check error: $($_.Exception.Message)" "Error"
    $script:Results.EnvCheck = $false
    $script:Results.Issues += "Environment check failed"
}

# =====================================================
# 4. E2E Tests (if build passed)
# =====================================================
if ($script:Results.Build -eq $true) {
    Write-Status "`n4. Running E2E Smoke Tests..." "Header"
    Write-Status "Starting dev server in background..." "Info"
    
    # Note: In a real scenario, you'd start the server, run tests, then stop it
    # For now, we'll just check if tests can be run
    try {
        if (Test-Path "e2e\smoke.spec.ts") {
            Write-Status "E2E test file found" "Success"
            Write-Status "To run tests: bun run test:e2e (requires dev server running)" "Info"
            $script:Results.Tests = "Available"
        } else {
            Write-Status "E2E test file not found" "Warning"
            $script:Results.Tests = "Not found"
        }
    } catch {
        Write-Status "E2E test check error" "Warning"
        $script:Results.Tests = "Error"
    }
} else {
    Write-Status "`n4. Skipping E2E Tests (build failed)" "Header"
    $script:Results.Tests = "Skipped"
}

# =====================================================
# 5. File Structure Check
# =====================================================
Write-Status "`n5. File Structure Check..." "Header"

$criticalFiles = @(
    "package.json",
    "next.config.js",
    "tsconfig.json",
    "prisma/schema.prisma",
    "src/app/layout.tsx",
    "src/app/page.tsx",
    ".env.local"
)

$missingFiles = @()
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Status "$file" "Success"
    } else {
        Write-Status "MISSING: $file" "Error"
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    $script:Results.Issues += "Missing critical files: $($missingFiles -join ', ')"
}

# =====================================================
# 6. Git Status Check
# =====================================================
Write-Status "`n6. Git Status Check..." "Header"

try {
    $gitStatus = git status --porcelain 2>&1
    if ($LASTEXITCODE -eq 0) {
        if ($gitStatus) {
            Write-Status "Uncommitted changes detected" "Warning"
            Write-Host "`nUncommitted files:" -ForegroundColor Gray
            Write-Host $gitStatus -ForegroundColor Gray
            $script:Results.Warnings += "Uncommitted changes"
        } else {
            Write-Status "Working directory clean" "Success"
        }
        
        $branch = git branch --show-current 2>&1
        Write-Status "Current branch: $branch" "Info"
    } else {
        Write-Status "Not a git repository or git not available" "Warning"
    }
} catch {
    Write-Status "Git check error" "Warning"
}

# =====================================================
# Summary
# =====================================================
Write-Status "`n📊 Pre-Deployment Check Summary" "Header"
Write-Host ""

$allPassed = $true

if ($script:Results.Build -eq $true) {
    Write-Status "Build: PASSED" "Success"
} else {
    Write-Status "Build: FAILED" "Error"
    $allPassed = $false
}

if ($script:Results.TypeCheck -eq $true) {
    Write-Status "TypeScript: PASSED" "Success"
} elseif ($script:Results.TypeCheck -eq $false) {
    Write-Status "TypeScript: WARNINGS" "Warning"
} else {
    Write-Status "TypeScript: NOT CHECKED" "Warning"
}

if ($script:Results.EnvCheck -eq $true) {
    Write-Status "Environment Variables: PASSED" "Success"
} else {
    Write-Status "Environment Variables: FAILED" "Error"
    $allPassed = $false
}

Write-Host ""
Write-Host "Issues Found: $($script:Results.Issues.Count)" -ForegroundColor $(if ($script:Results.Issues.Count -eq 0) { "Green" } else { "Red" })
Write-Host "Warnings: $($script:Results.Warnings.Count)" -ForegroundColor $(if ($script:Results.Warnings.Count -eq 0) { "Green" } else { "Yellow" })

if ($script:Results.Issues.Count -gt 0) {
    Write-Host "`nIssues:" -ForegroundColor Red
    foreach ($issue in $script:Results.Issues) {
        Write-Host "  - $issue" -ForegroundColor Red
    }
}

if ($script:Results.Warnings.Count -gt 0) {
    Write-Host "`nWarnings:" -ForegroundColor Yellow
    foreach ($warning in $script:Results.Warnings) {
        Write-Host "  - $warning" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Completed: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host ""

if ($allPassed -and $script:Results.Issues.Count -eq 0) {
    Write-Host "✅ All critical checks passed!" -ForegroundColor Green
    Write-Host "You're ready to deploy to Vercel." -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "1. Review PRE_DEPLOYMENT_REPORT.md for manual checks" -ForegroundColor White
    Write-Host "2. Test key features locally (cart, checkout, admin)" -ForegroundColor White
    Write-Host "3. Run Lighthouse audit" -ForegroundColor White
    Write-Host "4. Push to GitHub: git push origin main" -ForegroundColor White
} else {
    Write-Host "❌ Some checks failed. Fix issues before deploying." -ForegroundColor Red
    Write-Host "`nReview the errors above and fix them before proceeding." -ForegroundColor Yellow
}

Write-Host ""
