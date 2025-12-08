# =============================================================================
# KOLLECT-IT DESIGN SYSTEM DEPLOYMENT SCRIPT
# Version 1.0 - December 2025
# =============================================================================
# 
# WHAT THIS SCRIPT DOES:
# 1. Creates timestamped backups of all original files
# 2. Copies updated files from Work Files to correct project locations
# 3. Logs all changes for easy rollback
#
# HOW TO USE:
# 1. Download all files from Claude to your Downloads folder
# 2. Copy files to: C:\Users\james\kollect-it-marketplace-1\Work Files
# 3. Open PowerShell in your project directory
# 4. Run: .\Work Files\Deploy-Design-System.ps1
#
# =============================================================================

param(
    [switch]$DryRun = $false,
    [switch]$SkipBackup = $false
)

# Configuration
$ProjectRoot = "C:\Users\james\kollect-it-marketplace-1"
$WorkFilesDir = "$ProjectRoot\Work Files"
$BackupDir = "$ProjectRoot\backups\design-system-$(Get-Date -Format 'yyyy-MM-dd-HHmmss')"
$LogFile = "$BackupDir\deployment-log.txt"

# Color output helpers
function Write-Success { param($Message) Write-Host "✓ $Message" -ForegroundColor Green }
function Write-Info { param($Message) Write-Host "→ $Message" -ForegroundColor Cyan }
function Write-Warning { param($Message) Write-Host "⚠ $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "✗ $Message" -ForegroundColor Red }

# File mapping: Work Files → Project Location
$FileMapping = @{
    # Core Files
    "layout.tsx"         = "src\app\layout.tsx"
    "globals.css"        = "src\app\globals.css"
    
    # Batch 1 Components
    "Footer.tsx"         = "src\components\Footer.tsx"
    "ProductCard.tsx"    = "src\components\ProductCard.tsx"
    "ProductReviews.tsx" = "src\components\product\ProductReviews.tsx"
    "RelatedProducts.tsx"= "src\components\product\RelatedProducts.tsx"
    "AesopSection.tsx"   = "src\components\AesopSection.tsx"
    "ContactForm.tsx"    = "src\components\forms\ContactForm.tsx"
}

# Banner
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  KOLLECT-IT DESIGN SYSTEM DEPLOYMENT" -ForegroundColor Magenta
Write-Host "  $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

if ($DryRun) {
    Write-Warning "DRY RUN MODE - No files will be modified"
    Write-Host ""
}

# Verify project directory exists
if (-not (Test-Path $ProjectRoot)) {
    Write-Error "Project directory not found: $ProjectRoot"
    exit 1
}

# Verify Work Files directory exists
if (-not (Test-Path $WorkFilesDir)) {
    Write-Error "Work Files directory not found: $WorkFilesDir"
    Write-Info "Please create the folder and copy the downloaded files there."
    exit 1
}

# Check which files are available
Write-Info "Checking available files in Work Files..."
Write-Host ""

$AvailableFiles = @{}
$MissingFiles = @()

foreach ($SourceFile in $FileMapping.Keys) {
    $SourcePath = Join-Path $WorkFilesDir $SourceFile
    if (Test-Path $SourcePath) {
        $AvailableFiles[$SourceFile] = $FileMapping[$SourceFile]
        Write-Host "  [FOUND] $SourceFile" -ForegroundColor Green
    } else {
        $MissingFiles += $SourceFile
        Write-Host "  [MISSING] $SourceFile" -ForegroundColor Yellow
    }
}

Write-Host ""

if ($AvailableFiles.Count -eq 0) {
    Write-Error "No deployment files found in Work Files directory!"
    Write-Info "Expected files: $($FileMapping.Keys -join ', ')"
    exit 1
}

# Confirm deployment
Write-Host "Files to deploy: $($AvailableFiles.Count)" -ForegroundColor Cyan
if ($MissingFiles.Count -gt 0) {
    Write-Warning "Missing files (will be skipped): $($MissingFiles -join ', ')"
}
Write-Host ""

if (-not $DryRun) {
    $Confirm = Read-Host "Proceed with deployment? (y/n)"
    if ($Confirm -ne 'y' -and $Confirm -ne 'Y') {
        Write-Info "Deployment cancelled."
        exit 0
    }
}

# Create backup directory
if (-not $SkipBackup -and -not $DryRun) {
    Write-Info "Creating backup directory: $BackupDir"
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
    
    # Initialize log file
    "KOLLECT-IT DESIGN SYSTEM DEPLOYMENT LOG" | Out-File $LogFile
    "Generated: $(Get-Date)" | Out-File $LogFile -Append
    "=" * 60 | Out-File $LogFile -Append
    "" | Out-File $LogFile -Append
}

# Process each file
$SuccessCount = 0
$ErrorCount = 0

Write-Host ""
Write-Info "Deploying files..."
Write-Host ""

foreach ($SourceFile in $AvailableFiles.Keys) {
    $RelativeDest = $AvailableFiles[$SourceFile]
    $SourcePath = Join-Path $WorkFilesDir $SourceFile
    $DestPath = Join-Path $ProjectRoot $RelativeDest
    
    Write-Host "  Processing: $SourceFile → $RelativeDest" -ForegroundColor White
    
    if ($DryRun) {
        Write-Host "    [DRY RUN] Would copy $SourceFile to $RelativeDest" -ForegroundColor Gray
        $SuccessCount++
        continue
    }
    
    try {
        # Create backup if destination exists
        if ((Test-Path $DestPath) -and -not $SkipBackup) {
            $BackupPath = Join-Path $BackupDir $SourceFile
            
            # Create subdirectory in backup if needed
            $BackupSubDir = Split-Path $BackupPath -Parent
            if (-not (Test-Path $BackupSubDir)) {
                New-Item -ItemType Directory -Path $BackupSubDir -Force | Out-Null
            }
            
            Copy-Item -Path $DestPath -Destination $BackupPath -Force
            Write-Host "    [BACKUP] Original saved to backup directory" -ForegroundColor Gray
            "BACKUP: $RelativeDest → $BackupPath" | Out-File $LogFile -Append
        }
        
        # Ensure destination directory exists
        $DestDir = Split-Path $DestPath -Parent
        if (-not (Test-Path $DestDir)) {
            New-Item -ItemType Directory -Path $DestDir -Force | Out-Null
        }
        
        # Copy new file
        Copy-Item -Path $SourcePath -Destination $DestPath -Force
        Write-Success "  Deployed: $SourceFile"
        "DEPLOYED: $SourcePath → $DestPath" | Out-File $LogFile -Append
        $SuccessCount++
        
    } catch {
        Write-Error "  Failed: $SourceFile - $($_.Exception.Message)"
        "ERROR: $SourceFile - $($_.Exception.Message)" | Out-File $LogFile -Append
        $ErrorCount++
    }
}

# Summary
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  DEPLOYMENT COMPLETE" -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""
Write-Host "  Successful: $SuccessCount" -ForegroundColor Green
if ($ErrorCount -gt 0) {
    Write-Host "  Errors: $ErrorCount" -ForegroundColor Red
}
if ($MissingFiles.Count -gt 0) {
    Write-Host "  Skipped (missing): $($MissingFiles.Count)" -ForegroundColor Yellow
}

if (-not $DryRun -and -not $SkipBackup) {
    Write-Host ""
    Write-Host "  Backup location: $BackupDir" -ForegroundColor Cyan
    Write-Host "  Log file: $LogFile" -ForegroundColor Cyan
}

Write-Host ""

# Next steps
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "  1. Run 'npm run dev' to test locally" -ForegroundColor White
Write-Host "  2. Check homepage, footer, product cards" -ForegroundColor White
Write-Host "  3. If issues, restore from backup: $BackupDir" -ForegroundColor White
Write-Host ""

# Rollback instructions
if (-not $DryRun -and -not $SkipBackup) {
    Write-Host "TO ROLLBACK:" -ForegroundColor Yellow
    Write-Host "  Copy files from $BackupDir back to their original locations" -ForegroundColor White
    Write-Host ""
}
