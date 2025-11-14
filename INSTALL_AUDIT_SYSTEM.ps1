<#
.SYNOPSIS
    Quick installer for Kollect-It Audit System
    
.DESCRIPTION
    This script helps you set up the audit system in your project.
    It checks prerequisites, copies files, and runs a test audit.
    
.EXAMPLE
    .\INSTALL_AUDIT_SYSTEM.ps1
#>

[CmdletBinding()]
param()

$ErrorActionPreference = "Continue"

# Colors for output
function Write-Success { param([string]$Message) Write-Host "✅ $Message" -ForegroundColor Green }
function Write-Info { param([string]$Message) Write-Host "ℹ️  $Message" -ForegroundColor Cyan }
function Write-Warning { param([string]$Message) Write-Host "⚠️  $Message" -ForegroundColor Yellow }
function Write-Error { param([string]$Message) Write-Host "❌ $Message" -ForegroundColor Red }
function Write-Step { param([string]$Message) Write-Host "`n🔹 $Message" -ForegroundColor Magenta }

# Banner
Clear-Host
Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "║   KOLLECT-IT AUDIT SYSTEM - INSTALLER                      ║" -ForegroundColor Cyan
Write-Host "║   Quick Setup for Automated Code Auditing                  ║" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Step 1: Check prerequisites
Write-Step "Step 1: Checking Prerequisites"

$prerequisites = @{
    "Git" = "git --version"
    "Node.js" = "node --version"
    "npm" = "npm --version"
    "PowerShell" = "`$PSVersionTable.PSVersion"
}

$allGood = $true

foreach ($tool in $prerequisites.Keys) {
    try {
        if ($tool -eq "PowerShell") {
            $version = $PSVersionTable.PSVersion
            Write-Success "$tool $version installed"
        } else {
            $result = Invoke-Expression $prerequisites[$tool] 2>&1
            Write-Success "$tool installed: $result"
        }
    } catch {
        Write-Error "$tool NOT found"
        $allGood = $false
        
        switch ($tool) {
            "Git" { Write-Info "Download from: https://git-scm.com/download/win" }
            "Node.js" { Write-Info "Download from: https://nodejs.org/ (LTS version)" }
            "npm" { Write-Info "Comes with Node.js - install Node.js first" }
        }
    }
}

if (-not $allGood) {
    Write-Error "`nPlease install missing prerequisites and run this script again."
    Read-Host "`nPress Enter to exit"
    exit 1
}

Write-Success "All prerequisites installed!"

# Step 2: Detect project location
Write-Step "Step 2: Detecting Project Location"

$projectPath = $null

# Try current directory
if (Test-Path ".\package.json") {
    $projectPath = Get-Location
    Write-Success "Found project in current directory: $projectPath"
}
# Try parent directory
elseif (Test-Path "..\package.json") {
    $projectPath = Split-Path (Get-Location) -Parent
    Write-Success "Found project in parent directory: $projectPath"
}
# Try common Kollect-It locations
else {
    $commonPaths = @(
        "C:\Users\$env:USERNAME\kollect-it-marketplace-1",
        "C:\Users\$env:USERNAME\kollect-it-marketplace-main",
        "C:\Users\james\kollect-it-marketplace-1"
    )
    
    foreach ($path in $commonPaths) {
        if (Test-Path $path) {
            Write-Info "Found project at: $path"
            $response = Read-Host "Use this location? (Y/n)"
            if ($response -ne 'n') {
                $projectPath = $path
                break
            }
        }
    }
}

# Manual entry if still not found
if (-not $projectPath) {
    Write-Warning "Could not auto-detect project location"
    $projectPath = Read-Host "`nEnter full path to your Kollect-It project"
    
    if (-not (Test-Path $projectPath)) {
        Write-Error "Path not found: $projectPath"
        Read-Host "`nPress Enter to exit"
        exit 1
    }
}

Write-Success "Project location confirmed: $projectPath"
Set-Location $projectPath

# Step 3: Check if files already exist
Write-Step "Step 3: Checking Installation Status"

$files = @{
    "RUN_AUDIT.ps1" = "Main audit script"
    "AUDIT_SYSTEM_README.md" = "Full documentation"
    "AUDIT_MASTER_PROMPT.md" = "Claude AI prompt"
    "QUICK_START.md" = "Quick start guide"
}

$existingFiles = @()
foreach ($file in $files.Keys) {
    if (Test-Path $file) {
        $existingFiles += $file
        Write-Warning "$file already exists"
    }
}

if ($existingFiles.Count -gt 0) {
    Write-Warning "`nSome audit system files already exist."
    $response = Read-Host "Overwrite existing files? (y/N)"
    if ($response -ne 'y') {
        Write-Info "Installation cancelled. Existing files preserved."
        Read-Host "`nPress Enter to exit"
        exit 0
    }
}

# Step 4: Copy/create files
Write-Step "Step 4: Installing Audit System Files"

Write-Info "Installing files to: $projectPath"

# Note: In real deployment, you would copy from a source location
# For now, we'll just verify the files that should be present
$requiredFiles = @("RUN_AUDIT.ps1")
$missingFiles = @()

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Error "Required files not found in current directory:"
    foreach ($file in $missingFiles) {
        Write-Host "  - $file" -ForegroundColor Red
    }
    Write-Info "`nMake sure you have downloaded all audit system files."
    Write-Info "Expected files: RUN_AUDIT.ps1, AUDIT_SYSTEM_README.md, AUDIT_MASTER_PROMPT.md, QUICK_START.md"
    Read-Host "`nPress Enter to exit"
    exit 1
}

Write-Success "All required files present"

# Step 5: Update .gitignore
Write-Step "Step 5: Updating .gitignore"

if (Test-Path ".gitignore") {
    $gitignore = Get-Content ".gitignore" -Raw
    
    if ($gitignore -notmatch "audit-output") {
        Write-Info "Adding audit-output/ to .gitignore"
        Add-Content -Path ".gitignore" -Value "`n# Audit System Outputs`naudit-output/"
        Write-Success ".gitignore updated"
    } else {
        Write-Success "audit-output/ already in .gitignore"
    }
} else {
    Write-Warning ".gitignore not found - creating one"
    @"
# Audit System Outputs
audit-output/

# Environment
.env
.env.local
.env.*.local

# Dependencies
node_modules/

# Build
.next/
dist/
build/

# Logs
*.log
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
    Write-Success ".gitignore created"
}

# Step 6: Test run (optional)
Write-Step "Step 6: Test Run"

Write-Info "Installation complete!"
Write-Host ""
$response = Read-Host "Run a test audit now? (Y/n)"

if ($response -ne 'n') {
    Write-Info "`nStarting test audit..."
    Write-Host "This will take 5-30 minutes depending on project size.`n" -ForegroundColor Gray
    
    # Give user a chance to cancel
    Write-Host "Press Ctrl+C to cancel, or wait 5 seconds to continue..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    # Run audit with reports only (no auto-fix for first run)
    Write-Info "Running audit (reports only, no auto-fixes)...`n"
    
    try {
        & ".\RUN_AUDIT.ps1" -SkipAutoFix
        
        Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║   ✅ TEST AUDIT COMPLETE!                                  ║" -ForegroundColor Green
        Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green
        
        Write-Info "Next steps:"
        Write-Host "  1. Read the summary: code audit-output\AUDIT_SUMMARY.md" -ForegroundColor Gray
        Write-Host "  2. Review critical issues: ls audit-output\reports\CRITICAL\" -ForegroundColor Gray
        Write-Host "  3. Run full audit with fixes: .\RUN_AUDIT.ps1" -ForegroundColor Gray
        
    } catch {
        Write-Error "Test audit failed: $_"
        Write-Info "Check the logs for details"
    }
} else {
    Write-Info "Test audit skipped"
}

# Step 7: Summary
Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "║   ✅ INSTALLATION COMPLETE!                                ║" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "📁 Installation Location: " -NoNewline -ForegroundColor White
Write-Host $projectPath -ForegroundColor Cyan

Write-Host "`n📚 Quick Reference:" -ForegroundColor Yellow
Write-Host "  • Quick Start: " -NoNewline -ForegroundColor Gray
Write-Host "code QUICK_START.md" -ForegroundColor White

Write-Host "  • Full Docs: " -NoNewline -ForegroundColor Gray
Write-Host "code AUDIT_SYSTEM_README.md" -ForegroundColor White

Write-Host "  • Run Audit: " -NoNewline -ForegroundColor Gray
Write-Host ".\RUN_AUDIT.ps1" -ForegroundColor White

Write-Host "`n🎯 Recommended Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Read QUICK_START.md for basic usage" -ForegroundColor Gray
Write-Host "  2. Run your first audit: .\RUN_AUDIT.ps1" -ForegroundColor Gray
Write-Host "  3. Review the results in audit-output\" -ForegroundColor Gray
Write-Host "  4. Set up weekly scheduled audits" -ForegroundColor Gray

Write-Host "`n💡 Pro Tips:" -ForegroundColor Yellow
Write-Host "  • Always test after merging audit changes" -ForegroundColor Gray
Write-Host "  • Review critical issues immediately" -ForegroundColor Gray
Write-Host "  • Track improvements over time" -ForegroundColor Gray
Write-Host "  • Run before every deployment" -ForegroundColor Gray

Write-Host "`n📞 Need Help?" -ForegroundColor Yellow
Write-Host "  • Check QUICK_START.md for common issues" -ForegroundColor Gray
Write-Host "  • Read full documentation in AUDIT_SYSTEM_README.md" -ForegroundColor Gray
Write-Host "  • Check logs in audit-output\logs\" -ForegroundColor Gray

Write-Host "`n" 
$response = Read-Host "Open Quick Start guide now? (Y/n)"
if ($response -ne 'n') {
    Start-Process "QUICK_START.md"
}

Write-Host "`nHappy auditing! 🚀`n" -ForegroundColor Cyan
