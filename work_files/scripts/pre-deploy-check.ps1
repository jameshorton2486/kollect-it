# =====================================================
# Kollect-It Pre-Deployment Check Script
# =====================================================
# Run this BEFORE deploying to catch issues early
# Usage: .\pre-deploy-check.ps1

param(
    [switch]$Verbose
)

$ErrorActionPreference = "Continue"
$script:FailureCount = 0
$script:WarningCount = 0

function Write-Status {
    param($Message, $Type = "Info")
    
    switch ($Type) {
        "Success" { Write-Host "✓ $Message" -ForegroundColor Green }
        "Error" { 
            Write-Host "✗ $Message" -ForegroundColor Red
            $script:FailureCount++
        }
        "Warning" { 
            Write-Host "⚠ $Message" -ForegroundColor Yellow
            $script:WarningCount++
        }
        "Info" { Write-Host "→ $Message" -ForegroundColor Cyan }
        "Header" { 
            Write-Host "`n$Message" -ForegroundColor Cyan
            Write-Host ("=" * $Message.Length) -ForegroundColor Cyan
        }
    }
}

Write-Status "🚀 Kollect-It Pre-Deployment Check" "Header"

# =====================================================
# 1. Node.js Version Check
# =====================================================
Write-Status "Checking Node.js version..." "Info"
try {
    $nodeVersion = node --version
    $nodeMajor = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    
    if ($nodeMajor -eq 23) {
        Write-Status "Node.js $nodeVersion (may have compatibility issues - recommend 20.x LTS)" "Warning"
    } elseif ($nodeMajor -ge 18 -and $nodeMajor -le 21) {
        Write-Status "Node.js $nodeVersion (compatible)" "Success"
    } else {
        Write-Status "Node.js $nodeVersion (unsupported - upgrade to 18.x or 20.x)" "Error"
    }
} catch {
    Write-Status "Node.js not found - install from nodejs.org" "Error"
}

# =====================================================
# 2. Required Files Check
# =====================================================
Write-Status "`nChecking required files..." "Info"
$requiredFiles = @(
    @{Path="package.json"; Critical=$true},
    @{Path="next.config.js"; Critical=$true},
    @{Path=".env.local"; Critical=$true},
    @{Path="prisma/schema.prisma"; Critical=$true},
    @{Path="src/app/layout.tsx"; Critical=$true},
    @{Path="src/app/page.tsx"; Critical=$true},
    @{Path="tsconfig.json"; Critical=$true},
    @{Path="tailwind.config.ts"; Critical=$false}
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file.Path) {
        Write-Status "$($file.Path)" "Success"
    } else {
        if ($file.Critical) {
            Write-Status "MISSING: $($file.Path)" "Error"
        } else {
            Write-Status "Missing: $($file.Path)" "Warning"
        }
    }
}

# =====================================================
# 3. Environment Variables Check
# =====================================================
Write-Status "`nChecking environment variables..." "Info"
if (Test-Path .env.local) {
    $envContent = Get-Content .env.local -Raw
    
    $criticalVars = @(
        "DATABASE_URL",
        "NEXTAUTH_URL",
        "NEXTAUTH_SECRET",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET"
    )
    
    $optionalVars = @(
        "IMAGEKIT_PRIVATE_KEY",
        "STRIPE_SECRET_KEY",
        "EMAIL_SERVER_PASSWORD",
        "GOOGLE_ANALYTICS_ID",
        "REDIS_URL"
    )
    
    foreach ($var in $criticalVars) {
        if ($envContent -match "$var\s*=\s*.+") {
            Write-Status "$var" "Success"
        } else {
            Write-Status "MISSING: $var" "Error"
        }
    }
    
    if ($Verbose) {
        Write-Status "`nOptional variables:" "Info"
        foreach ($var in $optionalVars) {
            if ($envContent -match "$var\s*=\s*.+") {
                Write-Status "$var (configured)" "Success"
            } else {
                Write-Status "$var (not configured)" "Warning"
            }
        }
    }
} else {
    Write-Status ".env.local not found" "Error"
}

# =====================================================
# 4. Dependencies Check
# =====================================================
Write-Status "`nChecking dependencies..." "Info"
if (Test-Path node_modules) {
    Write-Status "node_modules exists" "Success"
    
    # Check package.json vs installed
    if (Test-Path package.json) {
        $packageJson = Get-Content package.json | ConvertFrom-Json
        $depsCount = ($packageJson.dependencies | Get-Member -MemberType NoteProperty).Count
        $devDepsCount = ($packageJson.devDependencies | Get-Member -MemberType NoteProperty).Count
        Write-Status "Dependencies: $depsCount regular + $devDepsCount dev" "Info"
    }
} else {
    Write-Status "node_modules missing - run 'npm install'" "Error"
}

# =====================================================
# 5. Git Status Check
# =====================================================
Write-Status "`nChecking Git status..." "Info"
try {
    $gitStatus = git status --porcelain 2>&1
    if ($LASTEXITCODE -eq 0) {
        if ($gitStatus) {
            Write-Status "Uncommitted changes detected" "Warning"
            if ($Verbose) {
                Write-Host $gitStatus -ForegroundColor Gray
            }
        } else {
            Write-Status "Working directory clean" "Success"
        }
        
        # Check current branch
        $branch = git branch --show-current 2>&1
        if ($branch -eq "main" -or $branch -eq "master") {
            Write-Status "On branch: $branch" "Success"
        } else {
            Write-Status "On branch: $branch (not main/master)" "Warning"
        }
    } else {
        Write-Status "Not a git repository" "Warning"
    }
} catch {
    Write-Status "Git not installed" "Warning"
}

# =====================================================
# 6. Build Test
# =====================================================
Write-Status "`nTesting build..." "Info"
Write-Status "This may take 1-2 minutes..." "Info"

$buildOutput = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Status "Build successful ✨" "Success"
} else {
    Write-Status "Build failed - see errors above" "Error"
    if ($Verbose) {
        Write-Host "`nBuild output:" -ForegroundColor Gray
        Write-Host $buildOutput -ForegroundColor Gray
    }
}

# =====================================================
# 7. TypeScript Check (if build passed)
# =====================================================
if ($LASTEXITCODE -eq 0) {
    Write-Status "`nChecking TypeScript..." "Info"
    $tscOutput = npx tsc --noEmit 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Status "No TypeScript errors" "Success"
    } else {
        Write-Status "TypeScript errors found" "Warning"
        if ($Verbose) {
            Write-Host $tscOutput -ForegroundColor Gray
        }
    }
}

# =====================================================
# 8. Database Connection Test (optional)
# =====================================================
Write-Status "`nChecking database connection..." "Info"
if (Test-Path .env.local) {
    $envContent = Get-Content .env.local -Raw
    if ($envContent -match "DATABASE_URL") {
        Write-Status "DATABASE_URL configured" "Success"
        Write-Status "To test connection: npx prisma db pull" "Info"
    } else {
        Write-Status "DATABASE_URL not configured" "Warning"
    }
}

# =====================================================
# 9. Port Availability Check
# =====================================================
Write-Status "`nChecking port availability..." "Info"
$port = 3000
$tcpConnection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($tcpConnection) {
    Write-Status "Port $port is in use - stop dev server before deploying" "Warning"
} else {
    Write-Status "Port $port is available" "Success"
}

# =====================================================
# Summary
# =====================================================
Write-Status "`n📊 Check Summary" "Header"
Write-Host "Failures: $script:FailureCount" -ForegroundColor $(if ($script:FailureCount -eq 0) { "Green" } else { "Red" })
Write-Host "Warnings: $script:WarningCount" -ForegroundColor $(if ($script:WarningCount -eq 0) { "Green" } else { "Yellow" })

if ($script:FailureCount -eq 0) {
    Write-Host "`n✅ All critical checks passed!" -ForegroundColor Green
    Write-Host "You're ready to deploy to Vercel." -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "1. Run: .\deploy-to-vercel.ps1" -ForegroundColor White
    Write-Host "2. Or push to GitHub to trigger auto-deploy" -ForegroundColor White
} else {
    Write-Host "`n❌ Fix the errors above before deploying." -ForegroundColor Red
    Write-Host "Run with -Verbose flag for more details: .\pre-deploy-check.ps1 -Verbose" -ForegroundColor Yellow
}

Write-Host ""
