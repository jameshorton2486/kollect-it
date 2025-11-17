# Kollect-It Audit System - Installation Verification Script
# Version: 1.0
# Purpose: Verify all files are in the correct location and ready to use

[CmdletBinding()]
param()

$ErrorActionPreference = "Continue"

# Clear screen for clean output
Clear-Host

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "KOLLECT-IT AUDIT SYSTEM" -ForegroundColor Cyan
Write-Host "Installation Verification" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check current directory
$currentDir = Get-Location
Write-Host "Current Directory: $currentDir`n" -ForegroundColor White

# Define required files
$requiredFiles = @{
    "RUN_AUDIT.ps1" = @{
        Description = "Main audit script"
        MinSize = 10000
        Required = $true
    }
    "INSTALL_AUDIT_SYSTEM.ps1" = @{
        Description = "Installation helper"
        MinSize = 8000
        Required = $false
    }
    "START_HERE.md" = @{
        Description = "Entry point documentation"
        MinSize = 5000
        Required = $true
    }
    "QUICK_START.md" = @{
        Description = "Quick reference guide"
        MinSize = 8000
        Required = $true
    }
    "AUDIT_SYSTEM_README.md" = @{
        Description = "Complete documentation"
        MinSize = 10000
        Required = $true
    }
    "AUDIT_MASTER_PROMPT.md" = @{
        Description = "Claude AI integration"
        MinSize = 10000
        Required = $false
    }
    "PACKAGE_OVERVIEW.md" = @{
        Description = "Package contents guide"
        MinSize = 8000
        Required = $false
    }
    "github-actions-audit-workflow.yml" = @{
        Description = "GitHub Actions workflow"
        MinSize = 4000
        Required = $false
    }
}

# Check if this looks like a project directory
$projectChecks = @{
    "package.json" = "Node.js project file"
    "src\" = "Source code directory"
    ".git\" = "Git repository"
}

# Results tracking
$allGood = $true
$requiredMissing = @()
$optionalMissing = @()
$fileSizeIssues = @()

# Banner
Write-Host "=== AUDIT SYSTEM FILES ===" -ForegroundColor Yellow
Write-Host ""

# Check each required file
foreach ($file in $requiredFiles.Keys | Sort-Object) {
    $fileInfo = $requiredFiles[$file]
    $status = ""
    $color = "Green"
    
    if (Test-Path $file) {
        $actualFile = Get-Item $file
        $size = $actualFile.Length
        
        # Check file size
        if ($size -lt $fileInfo.MinSize) {
            $status = "FOUND (WARNING: File may be truncated - $size bytes)"
            $color = "Yellow"
            $fileSizeIssues += $file
            if ($fileInfo.Required) {
                $allGood = $false
            }
        } else {
            $status = "FOUND ($size bytes)"
            $color = "Green"
        }
    } else {
        $status = "MISSING"
        $color = "Red"
        
        if ($fileInfo.Required) {
            $allGood = $false
            $requiredMissing += $file
        } else {
            $optionalMissing += $file
        }
    }
    
    # Display result
    $required = if ($fileInfo.Required) { "[REQUIRED]" } else { "[OPTIONAL]" }
    Write-Host "  $required " -NoNewline -ForegroundColor $(if ($fileInfo.Required) { "Red" } else { "Gray" })
    Write-Host "$file" -NoNewline -ForegroundColor White
    Write-Host " - $status" -ForegroundColor $color
    Write-Host "    Description: $($fileInfo.Description)" -ForegroundColor Gray
}

Write-Host ""

# Check project structure
Write-Host "=== PROJECT STRUCTURE ===" -ForegroundColor Yellow
Write-Host ""

$projectGood = $true
foreach ($check in $projectChecks.Keys) {
    if (Test-Path $check) {
        Write-Host "  [OK] $check - $($projectChecks[$check])" -ForegroundColor Green
    } else {
        Write-Host "  [MISSING] $check - $($projectChecks[$check])" -ForegroundColor Yellow
        $projectGood = $false
    }
}

Write-Host ""

# Check prerequisites
Write-Host "=== PREREQUISITES ===" -ForegroundColor Yellow
Write-Host ""

$prerequisites = @{
    "Git" = "git --version"
    "Node.js" = "node --version"
    "npm" = "npm --version"
    "PowerShell" = "`$PSVersionTable.PSVersion.ToString()"
}

$prereqGood = $true
foreach ($tool in $prerequisites.Keys) {
    try {
        if ($tool -eq "PowerShell") {
            $version = $PSVersionTable.PSVersion.ToString()
            Write-Host "  [OK] $tool $version" -ForegroundColor Green
        } else {
            $version = Invoke-Expression $prerequisites[$tool] 2>&1 | Select-Object -First 1
            Write-Host "  [OK] $tool - $version" -ForegroundColor Green
        }
    } catch {
        Write-Host "  [MISSING] $tool - NOT INSTALLED" -ForegroundColor Red
        $prereqGood = $false
        $allGood = $false
    }
}

Write-Host ""

# Check for old/duplicate files
Write-Host "=== CHECKING FOR DUPLICATE/OLD FILES ===" -ForegroundColor Yellow
Write-Host ""

$possibleDuplicates = @(
    "RUN_AUDIT_CLEAN.ps1",
    "RUN_AUDIT (1).ps1",
    "START_HERE (1).md",
    ".audit-system\"
)

$foundDuplicates = @()
foreach ($dup in $possibleDuplicates) {
    if (Test-Path $dup) {
        $foundDuplicates += $dup
        Write-Host "  [FOUND] $dup - Consider removing" -ForegroundColor Yellow
    }
}

if ($foundDuplicates.Count -eq 0) {
    Write-Host "  [OK] No duplicate files found" -ForegroundColor Green
}

Write-Host ""

# Final summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VERIFICATION SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($allGood -and $projectGood -and $prereqGood) {
    Write-Host "STATUS: READY TO RUN!" -ForegroundColor Green
    Write-Host ""
    Write-Host "All required files are in place." -ForegroundColor Green
    Write-Host "Project structure looks good." -ForegroundColor Green
    Write-Host "All prerequisites are installed." -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run the audit:" -ForegroundColor Yellow
    Write-Host "  .\RUN_AUDIT.ps1" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "STATUS: ISSUES FOUND" -ForegroundColor Red
    Write-Host ""
    
    # Report missing required files
    if ($requiredMissing.Count -gt 0) {
        Write-Host "REQUIRED FILES MISSING:" -ForegroundColor Red
        foreach ($file in $requiredMissing) {
            Write-Host "  - $file" -ForegroundColor Red
        }
        Write-Host ""
    }
    
    # Report file size issues
    if ($fileSizeIssues.Count -gt 0) {
        Write-Host "FILE SIZE WARNINGS:" -ForegroundColor Yellow
        foreach ($file in $fileSizeIssues) {
            Write-Host "  - $file (may be corrupted or incomplete)" -ForegroundColor Yellow
        }
        Write-Host ""
    }
    
    # Report optional missing files
    if ($optionalMissing.Count -gt 0) {
        Write-Host "OPTIONAL FILES MISSING (not critical):" -ForegroundColor Yellow
        foreach ($file in $optionalMissing) {
            Write-Host "  - $file" -ForegroundColor Yellow
        }
        Write-Host ""
    }
    
    # Report project structure issues
    if (-not $projectGood) {
        Write-Host "PROJECT STRUCTURE:" -ForegroundColor Yellow
        Write-Host "  This may not be the correct directory." -ForegroundColor Yellow
        Write-Host "  Expected to find: package.json, src folder, .git folder" -ForegroundColor Yellow
        Write-Host ""
    }
    
    # Report prerequisite issues
    if (-not $prereqGood) {
        Write-Host "PREREQUISITES MISSING:" -ForegroundColor Red
        Write-Host "  Install missing tools before running audit." -ForegroundColor Red
        Write-Host "  Git: https://git-scm.com/download/win" -ForegroundColor Gray
        Write-Host "  Node.js: https://nodejs.org/" -ForegroundColor Gray
        Write-Host ""
    }
}

# Cleanup suggestions
if ($foundDuplicates.Count -gt 0) {
    Write-Host "CLEANUP SUGGESTIONS:" -ForegroundColor Yellow
    Write-Host "  Consider removing duplicate/old files:" -ForegroundColor Yellow
    foreach ($dup in $foundDuplicates) {
        Write-Host "    Remove-Item '$dup' -Recurse -Force" -ForegroundColor Gray
    }
    Write-Host ""
}

# Detailed instructions based on status
if ($requiredMissing.Count -gt 0) {
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host "HOW TO FIX MISSING FILES" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Download missing files from Claude's outputs" -ForegroundColor White
    Write-Host "2. Save them to: $currentDir" -ForegroundColor White
    Write-Host "3. Run this verification script again" -ForegroundColor White
    Write-Host ""
    Write-Host "Or copy all files from Downloads:" -ForegroundColor White
    Write-Host '  $files = @("RUN_AUDIT.ps1", "START_HERE.md", "QUICK_START.md", "AUDIT_SYSTEM_README.md")' -ForegroundColor Gray
    Write-Host '  foreach ($f in $files) {' -ForegroundColor Gray
    Write-Host '    Copy-Item "C:\Users\james\Downloads\$f" -Destination "." -Force' -ForegroundColor Gray
    Write-Host '  }' -ForegroundColor Gray
    Write-Host ""
}

# Directory recommendation
if (-not $projectGood) {
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host "WRONG DIRECTORY?" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "This doesn't look like your Kollect-It project directory." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Try navigating to your project:" -ForegroundColor White
    Write-Host "  cd C:\Users\james\kollect-it-marketplace-1" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Then run this verification script again:" -ForegroundColor White
    Write-Host "  .\VERIFY_INSTALLATION.ps1" -ForegroundColor Gray
    Write-Host ""
}

# Final action items
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NEXT STEPS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($allGood -and $projectGood -and $prereqGood) {
    Write-Host "1. Read START_HERE.md:" -ForegroundColor White
    Write-Host "   code START_HERE.md" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Run the audit:" -ForegroundColor White
    Write-Host "   .\RUN_AUDIT.ps1" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "1. Fix issues listed above" -ForegroundColor White
    Write-Host "2. Run this verification script again" -ForegroundColor White
    Write-Host "3. Once all checks pass, run the audit" -ForegroundColor White
    Write-Host ""
}

# Exit with appropriate code
if ($allGood -and $projectGood -and $prereqGood) {
    exit 0
} else {
    exit 1
}
