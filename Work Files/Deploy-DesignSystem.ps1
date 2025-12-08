# ============================================================================
# KOLLECT-IT DESIGN SYSTEM DEPLOYMENT SCRIPT
# Version: 2.0
# Purpose: Safely deploy design system updates with automatic backups
# ============================================================================

param(
    [switch]$DryRun = $false,
    [switch]$Force = $false
)

# Configuration
$ProjectRoot = "C:\Users\james\kollect-it-marketplace-1"
$WorkFilesDir = "$ProjectRoot\Work Files"
$BackupDir = "$ProjectRoot\backups\design-system-$(Get-Date -Format 'yyyy-MM-dd-HHmmss')"
$LogFile = "$BackupDir\deployment.log"

# File mappings: Source (Work Files) -> Destination (Project)
$FileMappings = @{
    # Core files
    "layout.tsx" = "src\app\layout.tsx"
    "globals.css" = "src\app\globals.css"
    
    # Batch 1 Components (from previous work)
    "batch1-components\Footer.tsx" = "src\components\Footer.tsx"
    "batch1-components\ProductCard.tsx" = "src\components\ProductCard.tsx"
    "batch1-components\ProductReviews.tsx" = "src\components\product\ProductReviews.tsx"
    "batch1-components\RelatedProducts.tsx" = "src\components\product\RelatedProducts.tsx"
    "batch1-components\AesopSection.tsx" = "src\components\AesopSection.tsx"
    "batch1-components\ContactForm.tsx" = "src\components\forms\ContactForm.tsx"
}

# Colors for output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) { Write-Output $args }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"
    
    # Create backup dir if needed for log
    if (-not (Test-Path $BackupDir)) {
        New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
    }
    
    Add-Content -Path $LogFile -Value $logMessage
    
    switch ($Level) {
        "ERROR" { Write-Host $logMessage -ForegroundColor Red }
        "WARN" { Write-Host $logMessage -ForegroundColor Yellow }
        "SUCCESS" { Write-Host $logMessage -ForegroundColor Green }
        default { Write-Host $logMessage }
    }
}

function Show-Banner {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "  KOLLECT-IT DESIGN SYSTEM DEPLOYMENT" -ForegroundColor Cyan
    Write-Host "  Typography: Cormorant Garamond + Inter" -ForegroundColor Gray
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host ""
    
    if ($DryRun) {
        Write-Host "  [DRY RUN MODE - No changes will be made]" -ForegroundColor Yellow
        Write-Host ""
    }
}

function Test-Prerequisites {
    Write-Log "Checking prerequisites..."
    
    # Check project directory
    if (-not (Test-Path $ProjectRoot)) {
        Write-Log "Project directory not found: $ProjectRoot" "ERROR"
        return $false
    }
    
    # Check Work Files directory
    if (-not (Test-Path $WorkFilesDir)) {
        Write-Log "Work Files directory not found: $WorkFilesDir" "ERROR"
        return $false
    }
    
    # Check for at least one source file
    $hasFiles = $false
    foreach ($source in $FileMappings.Keys) {
        $sourcePath = Join-Path $WorkFilesDir $source
        if (Test-Path $sourcePath) {
            $hasFiles = $true
            break
        }
    }
    
    if (-not $hasFiles) {
        Write-Log "No source files found in Work Files directory" "WARN"
        Write-Host ""
        Write-Host "Expected files:" -ForegroundColor Yellow
        foreach ($source in $FileMappings.Keys) {
            Write-Host "  - $source" -ForegroundColor Gray
        }
        return $false
    }
    
    Write-Log "Prerequisites check passed" "SUCCESS"
    return $true
}

function Show-FileSummary {
    Write-Host ""
    Write-Host "FILES TO DEPLOY:" -ForegroundColor Cyan
    Write-Host "----------------" -ForegroundColor Cyan
    
    $filesToDeploy = @()
    $filesMissing = @()
    
    foreach ($source in $FileMappings.Keys) {
        $sourcePath = Join-Path $WorkFilesDir $source
        $destPath = Join-Path $ProjectRoot $FileMappings[$source]
        
        if (Test-Path $sourcePath) {
            $status = if (Test-Path $destPath) { "[UPDATE]" } else { "[NEW]" }
            Write-Host "  $status $source -> $($FileMappings[$source])" -ForegroundColor Green
            $filesToDeploy += @{
                Source = $sourcePath
                Destination = $destPath
                SourceName = $source
                DestName = $FileMappings[$source]
            }
        } else {
            Write-Host "  [SKIP] $source (not found)" -ForegroundColor Gray
            $filesMissing += $source
        }
    }
    
    Write-Host ""
    Write-Host "Summary: $($filesToDeploy.Count) files to deploy, $($filesMissing.Count) files not found" -ForegroundColor Cyan
    Write-Host ""
    
    return $filesToDeploy
}

function Backup-File {
    param([string]$FilePath, [string]$RelativePath)
    
    if (Test-Path $FilePath) {
        $backupPath = Join-Path $BackupDir $RelativePath
        $backupFolder = Split-Path $backupPath -Parent
        
        if (-not (Test-Path $backupFolder)) {
            New-Item -ItemType Directory -Path $backupFolder -Force | Out-Null
        }
        
        if (-not $DryRun) {
            Copy-Item -Path $FilePath -Destination $backupPath -Force
        }
        
        Write-Log "Backed up: $RelativePath"
        return $true
    }
    return $false
}

function Deploy-File {
    param(
        [string]$SourcePath,
        [string]$DestPath,
        [string]$SourceName,
        [string]$DestName
    )
    
    # Backup existing file
    if (Test-Path $DestPath) {
        Backup-File -FilePath $DestPath -RelativePath $DestName | Out-Null
    }
    
    # Create destination directory if needed
    $destFolder = Split-Path $DestPath -Parent
    if (-not (Test-Path $destFolder)) {
        if (-not $DryRun) {
            New-Item -ItemType Directory -Path $destFolder -Force | Out-Null
        }
        Write-Log "Created directory: $destFolder"
    }
    
    # Copy file
    if (-not $DryRun) {
        Copy-Item -Path $SourcePath -Destination $DestPath -Force
    }
    
    Write-Log "Deployed: $SourceName -> $DestName" "SUCCESS"
    return $true
}

function Show-PostDeployInstructions {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host "  DEPLOYMENT COMPLETE!" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "NEXT STEPS:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Test locally:" -ForegroundColor White
    Write-Host "   cd $ProjectRoot" -ForegroundColor Gray
    Write-Host "   npm run dev" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Check these pages:" -ForegroundColor White
    Write-Host "   - Homepage (verify new Inter font)" -ForegroundColor Gray
    Write-Host "   - Footer (verify gold accents)" -ForegroundColor Gray
    Write-Host "   - Any product card (verify colors)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. If something looks wrong:" -ForegroundColor White
    Write-Host "   - Backups are in: $BackupDir" -ForegroundColor Gray
    Write-Host "   - Run: .\Restore-Backup.ps1 (if I create one)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. If everything looks good:" -ForegroundColor White
    Write-Host "   git add ." -ForegroundColor Gray
    Write-Host "   git commit -m 'Design system: Inter font + typography utilities'" -ForegroundColor Gray
    Write-Host ""
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

Show-Banner

if (-not (Test-Prerequisites)) {
    Write-Host "Deployment aborted due to failed prerequisites." -ForegroundColor Red
    exit 1
}

$filesToDeploy = Show-FileSummary

if ($filesToDeploy.Count -eq 0) {
    Write-Host "No files to deploy. Exiting." -ForegroundColor Yellow
    exit 0
}

# Confirmation
if (-not $Force -and -not $DryRun) {
    Write-Host "Do you want to proceed with deployment? (Y/N)" -ForegroundColor Yellow
    $confirm = Read-Host
    if ($confirm -notmatch '^[Yy]') {
        Write-Host "Deployment cancelled." -ForegroundColor Yellow
        exit 0
    }
}

# Create backup directory
if (-not $DryRun) {
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
    Write-Log "Created backup directory: $BackupDir"
}

# Deploy files
Write-Host ""
Write-Host "DEPLOYING FILES..." -ForegroundColor Cyan
Write-Host ""

$successCount = 0
$errorCount = 0

foreach ($file in $filesToDeploy) {
    try {
        $result = Deploy-File -SourcePath $file.Source -DestPath $file.Destination -SourceName $file.SourceName -DestName $file.DestName
        if ($result) { $successCount++ }
    }
    catch {
        Write-Log "Failed to deploy $($file.SourceName): $_" "ERROR"
        $errorCount++
    }
}

Write-Host ""
Write-Log "Deployment finished: $successCount succeeded, $errorCount failed" $(if ($errorCount -gt 0) { "WARN" } else { "SUCCESS" })

if (-not $DryRun -and $errorCount -eq 0) {
    Show-PostDeployInstructions
}

if ($DryRun) {
    Write-Host ""
    Write-Host "[DRY RUN COMPLETE - No files were modified]" -ForegroundColor Yellow
    Write-Host "Run without -DryRun to actually deploy files." -ForegroundColor Gray
}
