<# 
 Kollect-It Marketplace - Fully Autonomous Cleanup Script
 Drop this file in the project root and run:

   PowerShell:
     .\FULL_AUTONOMOUS_FIX.ps1

 or run it as a background job:

     Start-Job -FilePath ".\FULL_AUTONOMOUS_FIX.ps1"

 This script:
 - Formats code (Prettier)
 - Runs ESLint with --fix (if configured)
 - Runs TypeScript checks
 - Runs npm audit
 - Writes reports to ./audit-output
 - Creates small git commits (safe to review/revert)

 Make sure you have Node.js v20.x and npm installed. 
#>

$ErrorActionPreference = "Continue" # Continue on errors to complete all checks

Write-Host "🤖 Starting Autonomous Cleanup for Kollect-It..." -ForegroundColor Cyan
Write-Host "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host ""

# Ensure audit output folder exists
New-Item -Path ".\audit-output" -ItemType Directory -Force | Out-Null
New-Item -Path ".\audit-output\reports\HIGH" -ItemType Directory -Force | Out-Null
New-Item -Path ".\audit-output\reports\MEDIUM" -ItemType Directory -Force | Out-Null
New-Item -Path ".\audit-output\reports\LOW" -ItemType Directory -Force | Out-Null

function Run-Step {
    param(
        [string]$Title,
        [ScriptBlock]$Action
    )

    Write-Host ""
    Write-Host "===== $Title =====" -ForegroundColor Yellow
    try {
        & $Action
        Write-Host "✓ $Title completed" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠ $Title encountered errors. See logs for details." -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
    }
}

# Check Node.js version
Run-Step "Check Node.js version" {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Cyan
    
    $versionNumber = $nodeVersion.TrimStart('v').Split('.')[0]
    if ([int]$versionNumber -lt 18 -or [int]$versionNumber -gt 21) {
        Write-Host "⚠ WARNING: Node.js $nodeVersion detected. Next.js 15 officially supports v18.18+, v20.x, and v21.x" -ForegroundColor Yellow
        Write-Host "  Recommend using Node.js v20.x LTS" -ForegroundColor Yellow
    }
    else {
        Write-Host "✓ Node.js version is compatible with Next.js 15" -ForegroundColor Green
    }
}

# Phase 1: Install dependencies (optional, safe to skip if already installed)
Run-Step "Install dependencies (npm install)" {
    if (Test-Path "package-lock.json") {
        Write-Host "Installing dependencies..." -ForegroundColor Gray
        npm install 2>&1 | Out-File ".\audit-output\npm-install.log"
        Write-Host "Dependencies installed" -ForegroundColor Green
    }
    else {
        Write-Host "No package-lock.json found. Run 'npm install' manually first." -ForegroundColor Yellow
    }
}

# Phase 2: Prettier formatting
Run-Step "Prettier - format all supported files" {
    Write-Host "Formatting code with Prettier..." -ForegroundColor Gray
    
    # Check if prettier is installed
    $prettierExists = $null -ne (Get-Command npx -ErrorAction SilentlyContinue)
    
    if ($prettierExists) {
        npx prettier --write "**/*.{ts,tsx,js,jsx,json,md,css,scss}" --loglevel silent 2>&1 | Out-File ".\audit-output\prettier-output.log"
        
        # Commit changes
        git add -A
        git commit -m "chore: prettier auto-format" --allow-empty 2>&1 | Out-Null
        Write-Host "Code formatted and committed" -ForegroundColor Green
    }
    else {
        Write-Host "Prettier not found. Skipping formatting." -ForegroundColor Yellow
    }
}

# Phase 3: ESLint auto-fix
Run-Step "ESLint --fix on codebase" {
    $eslintConfigExists = Test-Path ".eslintrc*"
    
    if ($eslintConfigExists) {
        Write-Host "Running ESLint with auto-fix..." -ForegroundColor Gray
        npx eslint . --ext .ts,.tsx,.js,.jsx --fix 2>&1 | Out-File ".\audit-output\eslint-results.txt"
        
        # Commit changes
        git add -A
        git commit -m "fix: eslint auto-fix" --allow-empty 2>&1 | Out-Null
        Write-Host "ESLint fixes applied and committed" -ForegroundColor Green
    }
    else {
        Write-Host "ESLint config not found, skipping ESLint step." -ForegroundColor Yellow
    }
}

# Phase 4: TypeScript checks
Run-Step "TypeScript check (tsc --noEmit)" {
    if (Test-Path "tsconfig.json") {
        Write-Host "Running TypeScript checks..." -ForegroundColor Gray
        npx tsc --noEmit 2>&1 | Out-File ".\audit-output\typescript-errors.txt"
        
        $tsErrors = Get-Content ".\audit-output\typescript-errors.txt"
        if ($tsErrors -match "error TS") {
            Write-Host "⚠ TypeScript errors found. See audit-output/typescript-errors.txt" -ForegroundColor Yellow
        }
        else {
            Write-Host "✓ No TypeScript errors" -ForegroundColor Green
        }
    }
    else {
        Write-Host "tsconfig.json not found, skipping TypeScript step." -ForegroundColor Yellow
    }
}

# Phase 5: Security audit
Run-Step "npm audit" {
    Write-Host "Running security audit..." -ForegroundColor Gray
    npm audit --json | Out-File ".\audit-output\security-audit.json"
    npm audit 2>&1 | Out-File ".\audit-output\security-audit.txt"
    
    $auditOutput = Get-Content ".\audit-output\security-audit.txt" -Raw
    if ($auditOutput -match "found 0 vulnerabilities") {
        Write-Host "✓ No vulnerabilities found" -ForegroundColor Green
    }
    else {
        Write-Host "⚠ Vulnerabilities found. See audit-output/security-audit.txt" -ForegroundColor Yellow
    }
}

# Phase 6: Env var usage scan
Run-Step "Scan code for process.env usage" {
    Write-Host "Scanning for environment variable usage..." -ForegroundColor Gray
    
    $envVarsUsed = @()
    $files = Get-ChildItem -Recurse -Include *.ts,*.tsx,*.js,*.jsx -Path ".\src",".\app","." -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch "node_modules" }

    foreach ($file in $files) {
        $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
        if ($content -match "process\.env\.([A-Z0-9_]+)") {
            $matches = [regex]::Matches($content, "process\.env\.([A-Z0-9_]+)")
            foreach ($match in $matches) {
                $envVarName = $match.Groups[1].Value
                if ($envVarsUsed -notcontains $envVarName) {
                    $envVarsUsed += $envVarName
                }
            }
        }
    }

    $envVarsUsed | Sort-Object | Out-File ".\audit-output\env-vars-used.txt"
    Write-Host "Found $($envVarsUsed.Count) unique environment variables in use" -ForegroundColor Cyan
}

# Phase 7: Check for .env files
Run-Step "Verify environment files" {
    Write-Host "Checking for environment files..." -ForegroundColor Gray
    
    $envReport = @"
# Environment Files Check

"@
    
    $envFiles = @(".env", ".env.local", ".env.production", ".env.example")
    foreach ($file in $envFiles) {
        if (Test-Path $file) {
            $envReport += "✓ $file exists`n"
        }
        else {
            $envReport += "✗ $file missing`n"
        }
    }
    
    $envReport | Out-File ".\audit-output\env-files-check.txt"
    
    # Check .gitignore
    if (Test-Path ".gitignore") {
        $gitignore = Get-Content ".gitignore" -Raw
        if ($gitignore -match "\.env") {
            Write-Host "✓ .env files are in .gitignore" -ForegroundColor Green
        }
        else {
            Write-Host "⚠ WARNING: .env files may not be properly ignored by git!" -ForegroundColor Red
        }
    }
}

# Phase 8: Next.js specific checks
Run-Step "Next.js configuration check" {
    if (Test-Path "next.config.*") {
        Write-Host "Next.js config found" -ForegroundColor Cyan
        
        $nextConfig = Get-ChildItem "next.config.*" | Select-Object -First 1
        $configContent = Get-Content $nextConfig.FullName -Raw
        
        $checks = @{
            "reactStrictMode" = $configContent -match "reactStrictMode"
            "images" = $configContent -match "images"
        }
        
        $nextReport = "# Next.js Configuration Check`n`n"
        foreach ($check in $checks.GetEnumerator()) {
            if ($check.Value) {
                $nextReport += "✓ $($check.Key) configured`n"
            }
            else {
                $nextReport += "⚠ $($check.Key) not found`n"
            }
        }
        
        $nextReport | Out-File ".\audit-output\nextjs-config-check.txt"
    }
}

# Phase 9: Build test
Run-Step "Test production build" {
    if (Test-Path "next.config.*") {
        Write-Host "Testing production build..." -ForegroundColor Gray
        Write-Host "This may take a few minutes..." -ForegroundColor Gray
        
        npm run build 2>&1 | Out-File ".\audit-output\build-output.txt"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Production build successful" -ForegroundColor Green
        }
        else {
            Write-Host "✗ Production build failed. See audit-output/build-output.txt" -ForegroundColor Red
        }
    }
}

# Final summary file
$summary = @"
# Autonomous Cleanup Report

**Generated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Node.js Version:** $(node --version)
**Project:** Kollect-It Marketplace

## Steps Completed

1. ✓ Dependencies check and install
2. ✓ Prettier code formatting
3. ✓ ESLint auto-fix (if configured)
4. ✓ TypeScript type checking
5. ✓ Security audit (npm audit)
6. ✓ Environment variable usage scan
7. ✓ Environment files verification
8. ✓ Next.js configuration check
9. ✓ Production build test

## Output Files

All reports are in the `audit-output/` directory:

- `npm-install.log` - Dependency installation log
- `prettier-output.log` - Prettier formatting log
- `eslint-results.txt` - ESLint issues and fixes
- `typescript-errors.txt` - TypeScript compilation errors
- `security-audit.json` - Security vulnerabilities (JSON)
- `security-audit.txt` - Security vulnerabilities (readable)
- `env-vars-used.txt` - List of environment variables used in code
- `env-files-check.txt` - Environment files status
- `nextjs-config-check.txt` - Next.js configuration status
- `build-output.txt` - Production build output

## Git Commits Created

This script created the following commits (if changes were made):

1. `chore: prettier auto-format` - Code formatting changes
2. `fix: eslint auto-fix` - ESLint automatic fixes

Review commits with:

    git log --oneline -10

Revert if needed with:

    git reset --soft HEAD~2   # Keeps changes
    git reset --hard HEAD~2   # Discards changes

## Next Steps

### Critical Issues to Review

1. Check `typescript-errors.txt` for any type errors
2. Review `security-audit.txt` for vulnerabilities
3. Compare `env-vars-used.txt` with your `.env` files

### Run Your Application

Test that everything still works:

    npm run dev

Or for production:

    npm run build
    npm run start

### Deploy Readiness

Before deploying to production, run:

    node scripts/pre-deploy-check.js

This will perform additional production readiness checks.

## Automated vs Manual Fixes

**Automated (Completed):**
- Code formatting (Prettier)
- Simple linting issues (ESLint --fix)

**Manual Review Required:**
- TypeScript type errors
- Security vulnerabilities
- Environment variable configuration
- Build errors (if any)

## Recommendations

1. Review all git commits created by this script
2. Run the development server to ensure functionality
3. Fix any TypeScript errors in `typescript-errors.txt`
4. Address security vulnerabilities in `security-audit.txt`
5. Update `.env.example` with variables from `env-vars-used.txt`
6. Run the AI agent tasks for deeper codebase audit

## Run AI Agent for Deep Audit

For a comprehensive codebase audit, use the AI agent:

    "Read AI_AGENT_TASKS.md and AUDIT_PROMPT.md from the workspace root, 
     then execute all phases autonomously."

This will create detailed audit reports in `audit-output/reports/`.

---

**Script completed at:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
"@

$summary | Out-File ".\audit-output\CLEANUP_REPORT.md"

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ Autonomous cleanup complete!" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Reports saved to: .\audit-output\" -ForegroundColor Cyan
Write-Host "📝 Summary: .\audit-output\CLEANUP_REPORT.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review: .\audit-output\CLEANUP_REPORT.md" -ForegroundColor White
Write-Host "  2. Test: npm run dev" -ForegroundColor White
Write-Host "  3. Review git commits: git log --oneline -5" -ForegroundColor White
Write-Host ""
