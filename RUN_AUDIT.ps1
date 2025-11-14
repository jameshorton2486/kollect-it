# Kollect-It Marketplace - Simple Audit Script
# Version: 1.0 - Windows Compatible

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [string]$ProjectPath,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipAutoFix
)

$ErrorActionPreference = "Continue"
$StartTime = Get-Date
$AuditTimestamp = Get-Date -Format "yyyyMMdd-HHmmss"

# Create output directories
Write-Host "`nKOLLECT-IT AUTONOMOUS AUDIT SYSTEM" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Audit ID: $AuditTimestamp`n" -ForegroundColor White

# Detect project location
if (-not $ProjectPath) {
    $ProjectPath = Get-Location
}

Write-Host "[1/8] Environment & Configuration..." -ForegroundColor Yellow
Set-Location $ProjectPath

# Create audit output structure
$outputDirs = @(
    "audit-output",
    "audit-output\reports\CRITICAL",
    "audit-output\reports\HIGH",
    "audit-output\reports\MEDIUM",
    "audit-output\reports\LOW"
)

foreach ($dir in $outputDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -Path $dir -ItemType Directory -Force | Out-Null
    }
}

# Check git status
$gitStatus = git status --porcelain 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Not a git repository" -ForegroundColor Yellow
} else {
    # Create audit branch
    $branchName = "automated-audit-$AuditTimestamp"
    Write-Host "Creating branch: $branchName" -ForegroundColor Cyan
    git checkout -b $branchName 2>&1 | Out-Null
}

# Environment audit
$envReport = @"
# Environment Audit
Generated: $(Get-Date)

## Environment Files
"@

$envFiles = @(".env.local", ".env", ".env.example")
foreach ($file in $envFiles) {
    if (Test-Path $file) {
        $envReport += "`n- Found: $file"
    } else {
        $envReport += "`n- Missing: $file"
    }
}

$envReport | Out-File "audit-output\reports\HIGH\ENV_AUDIT.md" -Encoding UTF8

Write-Host "[2/8] Dependencies..." -ForegroundColor Yellow

# Dependency audit
if (Test-Path "package.json") {
    $depReport = "# Dependency Audit`nGenerated: $(Get-Date)`n`n"
    
    # Run npm audit
    try {
        $auditJson = npm audit --json 2>&1 | Out-String
        $depReport += "## Security Audit`n`nRan npm audit - check console output`n`n"
    } catch {
        $depReport += "## Security Audit`n`nCould not run npm audit`n`n"
    }
    
    # Auto-fix if enabled
    if (-not $SkipAutoFix) {
        Write-Host "  - Running npm prune..." -ForegroundColor Gray
        npm prune 2>&1 | Out-Null
        
        Write-Host "  - Running npm dedupe..." -ForegroundColor Gray
        npm dedupe 2>&1 | Out-Null
        
        $changes = git status --porcelain 2>&1
        if ($changes) {
            git add package-lock.json 2>&1 | Out-Null
            git commit -m "chore: dependency cleanup - audit $AuditTimestamp" 2>&1 | Out-Null
        }
    }
    
    $depReport | Out-File "audit-output\reports\HIGH\DEPENDENCIES_AUDIT.md" -Encoding UTF8
}

Write-Host "[3/8] Code Quality..." -ForegroundColor Yellow

# Code quality
if (-not $SkipAutoFix) {
    # Run Prettier if available
    if (Test-Path "node_modules\.bin\prettier.cmd") {
        Write-Host "  - Formatting code..." -ForegroundColor Gray
        & "node_modules\.bin\prettier.cmd" --write "**/*.{ts,tsx,js,jsx,json,md}" --log-level silent 2>&1 | Out-Null
        
        $changes = git diff --name-only 2>&1
        if ($changes) {
            git add -A 2>&1 | Out-Null
            git commit -m "style: format code - audit $AuditTimestamp" 2>&1 | Out-Null
        }
    }
    
    # Run ESLint if available
    if (Test-Path "node_modules\.bin\eslint.cmd") {
        Write-Host "  - Running ESLint..." -ForegroundColor Gray
        & "node_modules\.bin\eslint.cmd" . --ext .ts,.tsx,.js,.jsx --fix 2>&1 | Out-Null
        
        $changes = git diff --name-only 2>&1
        if ($changes) {
            git add -A 2>&1 | Out-Null
            git commit -m "style: eslint fixes - audit $AuditTimestamp" 2>&1 | Out-Null
        }
    }
}

$codeReport = "# Code Quality Audit`nGenerated: $(Get-Date)`n`n"
$codeReport += "Automated fixes applied (if enabled)`n"
$codeReport | Out-File "audit-output\reports\MEDIUM\CODE_QUALITY.md" -Encoding UTF8

Write-Host "[4/8] TypeScript..." -ForegroundColor Yellow

# TypeScript check
if (Test-Path "tsconfig.json") {
    $tsReport = "# TypeScript Audit`nGenerated: $(Get-Date)`n`n"
    
    Write-Host "  - Running type check..." -ForegroundColor Gray
    $tscOutput = npx tsc --noEmit 2>&1 | Out-String
    $tsReport += "## Type Check Results`n`n``````$tscOutput```````n"
    
    $tsReport | Out-File "audit-output\reports\MEDIUM\TYPESCRIPT_AUDIT.md" -Encoding UTF8
}

Write-Host "[5/8] Security..." -ForegroundColor Yellow

# Security scan
$secReport = "# Security Audit`nGenerated: $(Get-Date)`n`n"
$secReport += "## Hardcoded Secrets Scan`n`n"

$secretPatterns = @(
    "sk-[a-zA-Z0-9]{20,}",
    "pk_live_[a-zA-Z0-9]{24,}",
    "sk_live_[a-zA-Z0-9]{24,}"
)

$foundSecrets = 0
foreach ($pattern in $secretPatterns) {
    $matches = Select-String -Path "src\**\*" -Pattern $pattern -ErrorAction SilentlyContinue
    if ($matches) {
        $foundSecrets += $matches.Count
        $secReport += "WARNING: Found potential secrets matching pattern: $pattern`n"
    }
}

if ($foundSecrets -eq 0) {
    $secReport += "No obvious hardcoded secrets found.`n"
}

$secReport | Out-File "audit-output\reports\HIGH\SECURITY_AUDIT.md" -Encoding UTF8

Write-Host "[6/8] Performance..." -ForegroundColor Yellow

# Performance check
$perfReport = "# Performance Audit`nGenerated: $(Get-Date)`n`n"
$perfReport += "## React Performance`n`n"

$missingKeys = Select-String -Path "src\**\*.tsx" -Pattern "\.map\(" -Context 0,3 -ErrorAction SilentlyContinue |
    Where-Object { $_.Context.PostContext -notmatch 'key=' }

if ($missingKeys) {
    $perfReport += "Found $($missingKeys.Count) potential missing key props`n"
} else {
    $perfReport += "No obvious missing key props found`n"
}

$perfReport | Out-File "audit-output\reports\MEDIUM\PERFORMANCE_AUDIT.md" -Encoding UTF8

Write-Host "[7/8] Database..." -ForegroundColor Yellow

# Database audit
if (Test-Path "prisma\schema.prisma") {
    $dbReport = "# Database Audit`nGenerated: $(Get-Date)`n`n"
    
    $schema = Get-Content "prisma\schema.prisma" -Raw
    $models = [regex]::Matches($schema, "model\s+(\w+)")
    
    $dbReport += "## Models Found: $($models.Count)`n`n"
    foreach ($model in $models) {
        $dbReport += "- $($model.Groups[1].Value)`n"
    }
    
    $dbReport | Out-File "audit-output\reports\MEDIUM\DATABASE_AUDIT.md" -Encoding UTF8
}

Write-Host "[8/8] Documentation..." -ForegroundColor Yellow

# Documentation audit
$docReport = "# Documentation Audit`nGenerated: $(Get-Date)`n`n"

if (Test-Path "README.md") {
    $readme = Get-Content "README.md" -Raw
    $docReport += "README.md exists ($($readme.Length) characters)`n`n"
} else {
    $docReport += "WARNING: No README.md found`n`n"
}

# Find TODO comments
$todos = Select-String -Path "src\**\*" -Pattern "//\s*(TODO|FIXME)" -ErrorAction SilentlyContinue
if ($todos) {
    $docReport += "Found $($todos.Count) TODO/FIXME comments`n"
}

$docReport | Out-File "audit-output\reports\LOW\DOCUMENTATION_AUDIT.md" -Encoding UTF8

# Generate summary
$endTime = Get-Date
$duration = $endTime - $StartTime

$summary = @"
# KOLLECT-IT AUDIT SUMMARY

Audit ID: $AuditTimestamp
Started: $($StartTime.ToString("yyyy-MM-dd HH:mm:ss"))
Completed: $($endTime.ToString("yyyy-MM-dd HH:mm:ss"))
Duration: $($duration.ToString("hh\:mm\:ss"))

## Reports Generated

All reports available in: audit-output\reports\

### By Priority

- CRITICAL: Check audit-output\reports\CRITICAL\
- HIGH: Check audit-output\reports\HIGH\
- MEDIUM: Check audit-output\reports\MEDIUM\
- LOW: Check audit-output\reports\LOW\

## Automated Fixes

"@

if ($SkipAutoFix) {
    $summary += "Automated fixes were SKIPPED`n`n"
} else {
    $summary += @"
Automated fixes APPLIED:
- Dependencies pruned and deduped
- Code formatted with Prettier (if available)
- ESLint fixes applied (if available)

All changes committed to branch: $branchName

"@
}

$summary += @"

## Next Steps

1. Review this summary
2. Check CRITICAL and HIGH priority reports
3. Test your application: npm run dev
4. If everything works:
   git checkout main
   git merge $branchName
   git push origin main

## Review Reports

# View all reports
ls audit-output\reports\ -Recurse -Filter *.md

# View critical issues
ls audit-output\reports\CRITICAL\

# View high priority
ls audit-output\reports\HIGH\

---

Generated by Kollect-It Autonomous Audit System v1.0
"@

$summary | Out-File "audit-output\AUDIT_SUMMARY.md" -Encoding UTF8

# Display completion message
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "AUDIT COMPLETE!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Duration: $($duration.ToString("hh\:mm\:ss"))" -ForegroundColor Cyan
Write-Host "`nView summary: audit-output\AUDIT_SUMMARY.md" -ForegroundColor Yellow
Write-Host "View reports: audit-output\reports\`n" -ForegroundColor Yellow

if ($branchName) {
    Write-Host "Branch created: $branchName" -ForegroundColor Cyan
}

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. code audit-output\AUDIT_SUMMARY.md" -ForegroundColor Gray
Write-Host "  2. ls audit-output\reports\CRITICAL\" -ForegroundColor Gray
Write-Host "  3. npm run dev (test your app)" -ForegroundColor Gray

if ($branchName) {
    Write-Host "  4. git checkout main && git merge $branchName`n" -ForegroundColor Gray
}
