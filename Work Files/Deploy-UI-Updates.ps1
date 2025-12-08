<#
.SYNOPSIS
    Kollect-It UI Update Deployment Script
    Safely copies updated component files with automatic backups

.DESCRIPTION
    This script:
    1. Creates timestamped backups of original files
    2. Copies new files from Work Files folder to correct locations
    3. Logs all operations
    4. Supports rollback if needed

.USAGE
    1. Place updated files in: C:\Users\james\kollect-it-marketplace-1\Work Files
    2. Run this script from your project root
    3. Review the log file after execution

.AUTHOR
    Generated for Kollect-It project
#>

# ============================================
# CONFIGURATION
# ============================================

$ProjectRoot = "C:\Users\james\kollect-it-marketplace-1"
$WorkFilesDir = "$ProjectRoot\Work Files"
$BackupDir = "$ProjectRoot\backups\ui-updates"
$LogFile = "$ProjectRoot\logs\ui-deployment-$(Get-Date -Format 'yyyy-MM-dd-HHmmss').log"

# Create directories if they don't exist
New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
New-Item -ItemType Directory -Force -Path (Split-Path $LogFile) | Out-Null

# ============================================
# LOGGING FUNCTION
# ============================================

function Write-Log {
    param([string]$Message, [string]$Type = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Type] $Message"
    Write-Host $logEntry -ForegroundColor $(
        switch ($Type) {
            "ERROR" { "Red" }
            "SUCCESS" { "Green" }
            "WARNING" { "Yellow" }
            default { "White" }
        }
    )
    Add-Content -Path $LogFile -Value $logEntry
}

# ============================================
# FILE MAPPING
# Maps Work Files names to actual project paths
# ============================================

$FileMapping = @{
    # Batch 1: Shared Components
    "Footer.tsx"              = "src\components\Footer.tsx"
    "ProductCard.tsx"         = "src\components\ProductCard.tsx"
    "RelatedProducts.tsx"     = "src\components\product\RelatedProducts.tsx"
    "ProductReviews.tsx"      = "src\components\product\ProductReviews.tsx"
    "AesopSection.tsx"        = "src\components\AesopSection.tsx"
    "ContactForm.tsx"         = "src\components\forms\ContactForm.tsx"
    
    # Batch 2: Legal/Info Pages
    "terms-page.tsx"          = "src\app\terms\page.tsx"
    "privacy-page.tsx"        = "src\app\privacy\page.tsx"
    "refund-policy-page.tsx"  = "src\app\refund-policy\page.tsx"
    "cookies-page.tsx"        = "src\app\cookies\page.tsx"
    "our-process-page.tsx"    = "src\app\our-process\page.tsx"
    
    # Batch 3: Account Page
    "account-page.tsx"        = "src\app\account\page.tsx"
    
    # Batch 4: Admin Components
    "ProductUploadForm.tsx"              = "src\components\admin\ProductUploadForm.tsx"
    "ReportScheduler.tsx"                = "src\components\admin\ReportScheduler.tsx"
    "OrderDetailsPanel.tsx"              = "src\components\admin\OrderDetailsPanel.tsx"
    "SellerInquiryManager.tsx"           = "src\components\admin\SellerInquiryManager.tsx"
    "DashboardOverview.tsx"              = "src\components\admin\DashboardOverview.tsx"
    "AnalyticsDashboardWebSocket.tsx"    = "src\components\admin\AnalyticsDashboardWebSocket.tsx"
    "MetricCard.tsx"                     = "src\components\admin\charts\MetricCard.tsx"
    "RevenueByCategory.tsx"              = "src\components\admin\charts\RevenueByCategory.tsx"
    "BulkOrderActions.tsx"               = "src\components\admin\BulkOrderActions.tsx"
    "AutomatedReports.tsx"               = "src\components\admin\AutomatedReports.tsx"
    "TrafficAnalyticsDashboard.tsx"      = "src\components\admin\TrafficAnalyticsDashboard.tsx"
    
    # Batch 5: Admin Pages
    "admin-products-page.tsx"            = "src\app\admin\products\page.tsx"
    "admin-products-new-page.tsx"        = "src\app\admin\products\new\page.tsx"
    "admin-products-edit-page.tsx"       = "src\app\admin\products\[id]\edit\page.tsx"
    "admin-orders-id-page.tsx"           = "src\app\admin\orders\[id]\page.tsx"
    "admin-categories-page.tsx"          = "src\app\admin\categories\page.tsx"
    "admin-analytics-sales-page.tsx"     = "src\app\admin\analytics\sales\page.tsx"
    
    # CSS Updates
    "globals.css"             = "src\app\globals.css"
}

# ============================================
# BACKUP FUNCTION
# ============================================

function Backup-File {
    param([string]$FilePath)
    
    $fullPath = Join-Path $ProjectRoot $FilePath
    if (Test-Path $fullPath) {
        $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
        $fileName = Split-Path $FilePath -Leaf
        $backupPath = "$BackupDir\$timestamp-$fileName"
        
        Copy-Item -Path $fullPath -Destination $backupPath -Force
        Write-Log "Backed up: $FilePath -> $backupPath" "SUCCESS"
        return $true
    }
    return $false
}

# ============================================
# DEPLOYMENT FUNCTION
# ============================================

function Deploy-File {
    param(
        [string]$WorkFileName,
        [string]$TargetPath
    )
    
    $sourcePath = Join-Path $WorkFilesDir $WorkFileName
    $targetFullPath = Join-Path $ProjectRoot $TargetPath
    
    # Check if source exists
    if (-not (Test-Path $sourcePath)) {
        Write-Log "Source file not found: $WorkFileName (skipping)" "WARNING"
        return $false
    }
    
    # Create backup
    if (Test-Path $targetFullPath) {
        Backup-File -FilePath $TargetPath
    }
    
    # Ensure target directory exists
    $targetDir = Split-Path $targetFullPath
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
        Write-Log "Created directory: $targetDir"
    }
    
    # Copy file
    try {
        Copy-Item -Path $sourcePath -Destination $targetFullPath -Force
        Write-Log "Deployed: $WorkFileName -> $TargetPath" "SUCCESS"
        return $true
    }
    catch {
        Write-Log "Failed to deploy $WorkFileName : $_" "ERROR"
        return $false
    }
}

# ============================================
# ROLLBACK FUNCTION
# ============================================

function Invoke-Rollback {
    param([string]$BackupTimestamp)
    
    Write-Log "Starting rollback for timestamp: $BackupTimestamp" "WARNING"
    
    $backupFiles = Get-ChildItem -Path $BackupDir -Filter "$BackupTimestamp-*"
    
    foreach ($backup in $backupFiles) {
        $originalName = $backup.Name -replace "^\d{8}-\d{6}-", ""
        
        # Find original path from mapping
        foreach ($entry in $FileMapping.GetEnumerator()) {
            if ((Split-Path $entry.Value -Leaf) -eq $originalName) {
                $targetPath = Join-Path $ProjectRoot $entry.Value
                Copy-Item -Path $backup.FullName -Destination $targetPath -Force
                Write-Log "Restored: $originalName" "SUCCESS"
                break
            }
        }
    }
    
    Write-Log "Rollback complete" "SUCCESS"
}

# ============================================
# MAIN EXECUTION
# ============================================

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  KOLLECT-IT UI UPDATE DEPLOYMENT" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Log "Starting deployment process"
Write-Log "Project Root: $ProjectRoot"
Write-Log "Work Files: $WorkFilesDir"
Write-Log "Backup Dir: $BackupDir"

# Check if Work Files directory exists
if (-not (Test-Path $WorkFilesDir)) {
    Write-Log "Work Files directory not found. Creating it..." "WARNING"
    New-Item -ItemType Directory -Force -Path $WorkFilesDir | Out-Null
    Write-Host ""
    Write-Host "Please place your updated files in:" -ForegroundColor Yellow
    Write-Host "  $WorkFilesDir" -ForegroundColor White
    Write-Host ""
    exit 0
}

# List available files
$availableFiles = Get-ChildItem -Path $WorkFilesDir -Filter "*.tsx" -ErrorAction SilentlyContinue
$availableCss = Get-ChildItem -Path $WorkFilesDir -Filter "*.css" -ErrorAction SilentlyContinue
$allFiles = @($availableFiles) + @($availableCss) | Where-Object { $_ -ne $null }

if ($allFiles.Count -eq 0) {
    Write-Log "No files found in Work Files directory" "WARNING"
    Write-Host ""
    Write-Host "Place your updated .tsx and .css files in:" -ForegroundColor Yellow
    Write-Host "  $WorkFilesDir" -ForegroundColor White
    Write-Host ""
    Write-Host "Expected file names:" -ForegroundColor Cyan
    foreach ($name in $FileMapping.Keys | Sort-Object) {
        Write-Host "  - $name" -ForegroundColor Gray
    }
    exit 0
}

Write-Host ""
Write-Host "Found $($allFiles.Count) file(s) to deploy:" -ForegroundColor Green
foreach ($file in $allFiles) {
    Write-Host "  - $($file.Name)" -ForegroundColor White
}

Write-Host ""
$confirm = Read-Host "Proceed with deployment? (Y/N)"

if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Log "Deployment cancelled by user"
    exit 0
}

Write-Host ""

# Deploy each file
$successCount = 0
$failCount = 0

foreach ($file in $allFiles) {
    if ($FileMapping.ContainsKey($file.Name)) {
        $result = Deploy-File -WorkFileName $file.Name -TargetPath $FileMapping[$file.Name]
        if ($result) { $successCount++ } else { $failCount++ }
    }
    else {
        Write-Log "Unknown file (not in mapping): $($file.Name)" "WARNING"
        $failCount++
    }
}

# Summary
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  DEPLOYMENT SUMMARY" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Log "Deployment complete: $successCount succeeded, $failCount failed"

Write-Host ""
Write-Host "Log file: $LogFile" -ForegroundColor Gray
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "  1. Run 'npm run dev' to test locally" -ForegroundColor White
Write-Host "  2. Review changes in browser" -ForegroundColor White
Write-Host "  3. Commit if satisfied: git add . && git commit -m 'UI consistency updates'" -ForegroundColor White
Write-Host ""
Write-Host "TO ROLLBACK:" -ForegroundColor Yellow
Write-Host "  Check backups in: $BackupDir" -ForegroundColor White
Write-Host ""
