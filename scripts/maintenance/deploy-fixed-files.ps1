# Deploy Fixed Files to Kollect-It Project
# Run from PowerShell: .\deploy-fixed-files.ps1

$ErrorActionPreference = "Stop"

# Paths
$downloadsDir = "C:\Users\James\Downloads"
$projectDir = "C:\Users\James\kollect-it"
$backupDir = "$projectDir\backups\$(Get-Date -Format 'yyyy-MM-dd_HHmmss')"

# File mappings (download name -> project destination)
$files = @(
    @{
        DownloadPattern = "*admin-login-page-fixed*"
        Destination = "src\app\admin\login\page.tsx"
        Description = "Admin Login Page"
    },
    @{
        DownloadPattern = "*ProductReviews-fixed*"
        Destination = "src\components\product\ProductReviews.tsx"
        Description = "Product Reviews Component"
    }
)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Kollect-It Fixed Files Deployment" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Create backup directory
Write-Host "Creating backup directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
Write-Host "  Backups: $backupDir`n" -ForegroundColor Gray

# Process each file
$successCount = 0
foreach ($file in $files) {
    Write-Host "Processing: $($file.Description)" -ForegroundColor White
    
    # Find the downloaded file
    $downloadedFile = Get-ChildItem -Path $downloadsDir -Filter "$($file.DownloadPattern).tsx" -ErrorAction SilentlyContinue | 
                      Sort-Object LastWriteTime -Descending | 
                      Select-Object -First 1
    
    if (-not $downloadedFile) {
        # Try without .tsx extension (in case it was added)
        $downloadedFile = Get-ChildItem -Path $downloadsDir -Filter $file.DownloadPattern -ErrorAction SilentlyContinue | 
                          Sort-Object LastWriteTime -Descending | 
                          Select-Object -First 1
    }
    
    if (-not $downloadedFile) {
        Write-Host "  [SKIP] Download not found: $($file.DownloadPattern)" -ForegroundColor Red
        continue
    }
    
    $destPath = Join-Path $projectDir $file.Destination
    
    # Backup original if it exists
    if (Test-Path $destPath) {
        $backupName = ($file.Destination -replace "\\", "_") -replace "/", "_"
        $backupPath = Join-Path $backupDir $backupName
        Copy-Item -Path $destPath -Destination $backupPath -Force
        Write-Host "  [BACKUP] Original saved to backups folder" -ForegroundColor Gray
    }
    
    # Copy new file
    Copy-Item -Path $downloadedFile.FullName -Destination $destPath -Force
    Write-Host "  [OK] Deployed: $($file.Destination)" -ForegroundColor Green
    $successCount++
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Deployment Complete: $successCount/$($files.Count) files" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

if ($successCount -eq $files.Count) {
    Write-Host "All files deployed successfully!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "  1. cd $projectDir" -ForegroundColor White
    Write-Host "  2. npm run build  (or: npx tsc --noEmit)" -ForegroundColor White
    Write-Host "  3. git add -A && git commit -m 'fix: cleanup console.log and improve alt text'" -ForegroundColor White
} else {
    Write-Host "Some files were not found in Downloads." -ForegroundColor Yellow
    Write-Host "Check that the files downloaded correctly." -ForegroundColor Yellow
}

Write-Host ""
