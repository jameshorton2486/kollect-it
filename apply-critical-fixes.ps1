# =============================================================================
# KOLLECT-IT CRITICAL FIXES DEPLOYMENT SCRIPT
# =============================================================================
# 
# This script applies the two critical fixes identified in the audit:
# 1. Draft Product Visibility - Prevents draft products from appearing publicly
# 2. SKU Format Standardization - Unifies SKU validation across all systems
#
# USAGE:
#   cd C:\projects\kollect-it-main
#   .\apply-critical-fixes.ps1
#
# WHAT IT DOES:
#   1. Creates timestamped backups of original files
#   2. Applies the fixed versions
#   3. Logs all changes
#   4. Provides rollback instructions
#
# =============================================================================

param(
    [switch]$DryRun = $false,
    [switch]$Rollback = $false
)

$ErrorActionPreference = "Stop"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = $scriptPath  # Assumes script is in project root

# If not in project root, try to find it
if (-not (Test-Path "$projectRoot\src\app\api")) {
    $projectRoot = Get-Location
    if (-not (Test-Path "$projectRoot\src\app\api")) {
        Write-Host "ERROR: Cannot find project root. Run from project directory." -ForegroundColor Red
        exit 1
    }
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "$projectRoot\backups\critical-fixes-$timestamp"
$logFile = "$backupDir\deployment.log"

# Files to update
$fixes = @(
    @{
        Source = "src\app\api\admin\products\ingest\route.ts.fixed"
        Target = "src\app\api\admin\products\ingest\route.ts"
        Description = "Ingest API - Fix draft visibility + SKU format"
    },
    @{
        Source = "src\app\api\products\route.ts.fixed"
        Target = "src\app\api\products\route.ts"
        Description = "Products API - Add isDraft filter"
    },
    @{
        Source = "src\lib\utils\image-parser.ts.fixed"
        Target = "src\lib\utils\image-parser.ts"
        Description = "Image parser - Unified SKU validation"
    },
    @{
        Source = "src\lib\sku-validation.ts"
        Target = "src\lib\sku-validation.ts"
        Description = "NEW: Unified SKU validation module"
        IsNew = $true
    }
)

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $logEntry = "[$timestamp] [$Level] $Message"
    Write-Host $logEntry -ForegroundColor $(
        switch ($Level) {
            "ERROR" { "Red" }
            "WARN" { "Yellow" }
            "SUCCESS" { "Green" }
            default { "White" }
        }
    )
    if (Test-Path $logFile) {
        Add-Content -Path $logFile -Value $logEntry
    }
}

function Initialize-Deployment {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " KOLLECT-IT CRITICAL FIXES DEPLOYMENT" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Timestamp: $timestamp"
    Write-Host "Project Root: $projectRoot"
    Write-Host "Backup Dir: $backupDir"
    Write-Host ""

    if ($DryRun) {
        Write-Host "[DRY RUN MODE - No changes will be made]" -ForegroundColor Yellow
        Write-Host ""
    }

    # Create backup directory
    if (-not $DryRun) {
        New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
        "Kollect-It Critical Fixes Deployment Log" | Out-File -FilePath $logFile
        "Timestamp: $timestamp" | Add-Content -Path $logFile
        "Project Root: $projectRoot" | Add-Content -Path $logFile
        "-" * 50 | Add-Content -Path $logFile
    }
}

function Backup-File {
    param([string]$FilePath)
    
    $fullPath = Join-Path $projectRoot $FilePath
    if (Test-Path $fullPath) {
        $backupPath = Join-Path $backupDir $FilePath
        $backupFolder = Split-Path $backupPath -Parent
        
        if (-not $DryRun) {
            New-Item -ItemType Directory -Force -Path $backupFolder | Out-Null
            Copy-Item -Path $fullPath -Destination $backupPath -Force
        }
        
        Write-Log "Backed up: $FilePath" "INFO"
        return $true
    }
    return $false
}

function Apply-Fix {
    param(
        [string]$SourceFile,
        [string]$TargetFile,
        [string]$Description,
        [bool]$IsNew = $false
    )
    
    $sourcePath = Join-Path $projectRoot $SourceFile
    $targetPath = Join-Path $projectRoot $TargetFile
    
    Write-Host ""
    Write-Host "Processing: $Description" -ForegroundColor Cyan
    Write-Host "  Source: $SourceFile"
    Write-Host "  Target: $TargetFile"
    
    # Check source exists
    if (-not (Test-Path $sourcePath)) {
        Write-Log "ERROR: Source file not found: $SourceFile" "ERROR"
        return $false
    }
    
    # Backup target if it exists
    if (-not $IsNew) {
        if (Test-Path $targetPath) {
            Backup-File $TargetFile
        } else {
            Write-Log "WARNING: Target file not found (will create): $TargetFile" "WARN"
        }
    }
    
    # Apply fix
    if (-not $DryRun) {
        $targetFolder = Split-Path $targetPath -Parent
        if (-not (Test-Path $targetFolder)) {
            New-Item -ItemType Directory -Force -Path $targetFolder | Out-Null
        }
        Copy-Item -Path $sourcePath -Destination $targetPath -Force
    }
    
    Write-Log "Applied: $Description" "SUCCESS"
    return $true
}

function Show-Summary {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host " DEPLOYMENT COMPLETE" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "FIXES APPLIED:" -ForegroundColor Cyan
    Write-Host "1. Draft products now have status='draft' (not 'active')"
    Write-Host "2. Public API now filters isDraft=false"
    Write-Host "3. SKU validation accepts PREFIX-YYYY-NNNN format"
    Write-Host ""
    Write-Host "BACKUP LOCATION:" -ForegroundColor Yellow
    Write-Host "  $backupDir"
    Write-Host ""
    Write-Host "TO ROLLBACK:" -ForegroundColor Yellow
    Write-Host "  Copy files from backup folder to restore original versions"
    Write-Host ""
    Write-Host "NEXT STEPS:" -ForegroundColor Cyan
    Write-Host "1. Run: npm run build"
    Write-Host "2. Test locally: npm run dev"
    Write-Host "3. Verify ingest API: test with desktop app"
    Write-Host "4. Commit changes: git add . && git commit -m 'Fix: Draft visibility + SKU format'"
    Write-Host "5. Deploy: git push origin main"
    Write-Host ""
}

function Confirm-Deployment {
    if ($DryRun) { return $true }
    
    Write-Host ""
    Write-Host "This will modify the following files:" -ForegroundColor Yellow
    foreach ($fix in $fixes) {
        Write-Host "  - $($fix.Target)"
    }
    Write-Host ""
    $response = Read-Host "Continue? (y/N)"
    return $response -eq 'y' -or $response -eq 'Y'
}

# =============================================================================
# MAIN EXECUTION
# =============================================================================

Initialize-Deployment

if (-not (Confirm-Deployment)) {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    exit 0
}

$success = $true
foreach ($fix in $fixes) {
    $result = Apply-Fix `
        -SourceFile $fix.Source `
        -TargetFile $fix.Target `
        -Description $fix.Description `
        -IsNew ($fix.IsNew -eq $true)
    
    if (-not $result) {
        $success = $false
        Write-Log "Failed to apply: $($fix.Description)" "ERROR"
    }
}

if ($success) {
    # Clean up .fixed files after successful deployment
    if (-not $DryRun) {
        foreach ($fix in $fixes) {
            $fixedFile = Join-Path $projectRoot $fix.Source
            if ($fixedFile -like "*.fixed" -and (Test-Path $fixedFile)) {
                Remove-Item -Path $fixedFile -Force
                Write-Log "Cleaned up: $($fix.Source)" "INFO"
            }
        }
    }
    Show-Summary
} else {
    Write-Host ""
    Write-Host "DEPLOYMENT FAILED - Check errors above" -ForegroundColor Red
    Write-Host "Backup files available at: $backupDir" -ForegroundColor Yellow
    exit 1
}
