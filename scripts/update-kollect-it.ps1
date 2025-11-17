# Kollect-It Deployment Update Script
# Purpose: Clean up old documentation files and copy fresh deployment package

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Kollect-It Deployment Update Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Define paths
$targetDir = "C:\Users\james\kollect-it-marketplace-1"
$sourceDir = "C:\Users\james\Downloads\kollect-it-deployment-package"

# Files to delete (documentation files from refactor)
$filesToDelete = @(
    "Kollect-It Color System Refactor - COMPLETE.md",
    "kollect-it-refactor-progress.md",
    "kollect-it-color-reference.md",
    "kollect-it-analysis.md",
    "TOKEN_QUICK_REFERENCE.md",
    "REFACTOR_COMPLETE.md",
    "REFACTOR_COMPLETE (1).md"
)

Write-Host "Step 1: Checking directories..." -ForegroundColor Yellow

# Check if target directory exists
if (-Not (Test-Path $targetDir)) {
    Write-Host "ERROR: Target directory does not exist: $targetDir" -ForegroundColor Red
    Write-Host "Please verify the path and try again." -ForegroundColor Red
    exit 1
}

# Check if source directory exists
if (-Not (Test-Path $sourceDir)) {
    Write-Host "ERROR: Source directory does not exist: $sourceDir" -ForegroundColor Red
    Write-Host "Please verify the path and try again." -ForegroundColor Red
    exit 1
}

Write-Host "✓ Both directories found" -ForegroundColor Green
Write-Host ""

# Step 2: Delete old documentation files
Write-Host "Step 2: Cleaning up old documentation files..." -ForegroundColor Yellow

$deletedCount = 0
foreach ($file in $filesToDelete) {
    $fullPath = Join-Path $targetDir $file
    if (Test-Path $fullPath) {
        try {
            Remove-Item $fullPath -Force
            Write-Host "  ✓ Deleted: $file" -ForegroundColor Green
            $deletedCount++
        }
        catch {
            Write-Host "  ✗ Failed to delete: $file" -ForegroundColor Red
            Write-Host "    Error: $_" -ForegroundColor Red
        }
    }
    else {
        Write-Host "  - Not found: $file (skipping)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Deleted $deletedCount file(s)" -ForegroundColor Cyan
Write-Host ""

# Step 3: Copy files from deployment package
Write-Host "Step 3: Copying deployment package..." -ForegroundColor Yellow

try {
    # Get count of files to copy
    $sourceFiles = Get-ChildItem -Path $sourceDir -File
    $totalFiles = $sourceFiles.Count
    
    Write-Host "Found $totalFiles file(s) to copy" -ForegroundColor Cyan
    Write-Host ""
    
    # Copy with progress
    $copiedCount = 0
    foreach ($file in $sourceFiles) {
        $destination = Join-Path $targetDir $file.Name
        Copy-Item -Path $file.FullName -Destination $destination -Force
        $copiedCount++
        Write-Host "  ✓ Copied: $($file.Name)" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Successfully copied $copiedCount file(s)" -ForegroundColor Green
}
catch {
    Write-Host ""
    Write-Host "ERROR: Failed to copy files" -ForegroundColor Red
    Write-Host "Error details: $_" -ForegroundColor Red
    exit 1
}

# Step 4: Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Update Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  - Documentation files deleted: $deletedCount" -ForegroundColor White
Write-Host "  - Deployment files copied: $copiedCount" -ForegroundColor White
Write-Host ""
Write-Host "Target directory: $targetDir" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Navigate to: $targetDir" -ForegroundColor White
Write-Host "  2. Review the copied files" -ForegroundColor White
Write-Host "  3. Run 'npm install' if needed" -ForegroundColor White
Write-Host "  4. Run 'npm run dev' to test" -ForegroundColor White
Write-Host ""