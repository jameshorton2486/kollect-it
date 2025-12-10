# Verify-WorkFiles.ps1
# Script to verify that all global component files exist in the Work Files directory
# Run from the root of your Kollect-It project

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Kollect-It: Work Files Verification" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Define the expected files
$expectedFiles = @(
    "EmptyState.tsx",
    "LoadingState.tsx",
    "ErrorState.tsx",
    "PageHeader.tsx",
    "InfoCard.tsx",
    "StepCard.tsx",
    "index.ts"
)

# Check if Work Files directory exists
$workFilesPath = "Work Files"

if (-not (Test-Path $workFilesPath)) {
    Write-Host "ERROR: 'Work Files' directory not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Expected location: $((Get-Location).Path)\Work Files" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please ensure you're running this script from the project root." -ForegroundColor Yellow
    exit 1
}

Write-Host "Work Files directory found: $((Resolve-Path $workFilesPath).Path)" -ForegroundColor Green
Write-Host ""

# Track results
$found = @()
$missing = @()

# Check each file
Write-Host "Checking for required component files:" -ForegroundColor White
Write-Host "---------------------------------------" -ForegroundColor Gray

foreach ($file in $expectedFiles) {
    $filePath = Join-Path $workFilesPath $file
    
    if (Test-Path $filePath) {
        $fileInfo = Get-Item $filePath
        $size = "{0:N0}" -f $fileInfo.Length
        Write-Host "  [OK] $file ($size bytes)" -ForegroundColor Green
        $found += $file
    } else {
        Write-Host "  [MISSING] $file" -ForegroundColor Red
        $missing += $file
    }
}

Write-Host ""
Write-Host "---------------------------------------" -ForegroundColor Gray

# Summary
Write-Host ""
Write-Host "SUMMARY:" -ForegroundColor Cyan
Write-Host "  Found: $($found.Count) / $($expectedFiles.Count) files" -ForegroundColor White

if ($missing.Count -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS: All component files are present!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next step: Run the Cursor prompt to deploy these to src/components/ui/" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "WARNING: $($missing.Count) file(s) missing!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Missing files:" -ForegroundColor Yellow
    foreach ($file in $missing) {
        Write-Host "  - $file" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "These files need to be downloaded from Claude and placed in:" -ForegroundColor White
    Write-Host "  $((Resolve-Path $workFilesPath).Path)" -ForegroundColor White
    Write-Host ""
}

# Also check destination directory
Write-Host "---------------------------------------" -ForegroundColor Gray
Write-Host ""
Write-Host "Checking destination directory:" -ForegroundColor White

$destPath = "src/components/ui"

if (Test-Path $destPath) {
    Write-Host "  [OK] $destPath exists" -ForegroundColor Green
    
    # Check what's already there
    $existingFiles = Get-ChildItem $destPath -Filter "*.tsx" | Select-Object -ExpandProperty Name
    if ($existingFiles.Count -gt 0) {
        Write-Host ""
        Write-Host "  Existing files in destination:" -ForegroundColor Gray
        foreach ($existing in $existingFiles) {
            Write-Host "    - $existing" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "  [INFO] $destPath does not exist (will be created during deployment)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
