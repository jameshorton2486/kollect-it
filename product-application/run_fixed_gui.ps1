# Kollect-It GUI - Clear Cache and Run
# Works regardless of execution directory

# Get script directory dynamically
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$DesktopAppDir = Join-Path $ScriptDir "desktop-app"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $ScriptDir)
$WorkFiles = Join-Path $RepoRoot "work_files\kollect-it-gui-fixed"

$desktopApp = $DesktopAppDir

Write-Host "=== Kollect-It GUI Fix ===" -ForegroundColor Cyan

# Step 1: Copy fixed files from work_files to desktop-app
Write-Host "`n[1/4] Copying fixed files..." -ForegroundColor Yellow

if (Test-Path "$workFiles\main.py") {
    Copy-Item "$workFiles\main.py" "$desktopApp\main.py" -Force
    Write-Host "  - Copied main.py" -ForegroundColor Green
}

if (Test-Path "$workFiles\modules\theme.py") {
    Copy-Item "$workFiles\modules\theme.py" "$desktopApp\modules\theme.py" -Force
    Write-Host "  - Copied modules\theme.py" -ForegroundColor Green
}

# Step 2: Delete Python bytecode cache
Write-Host "`n[2/4] Clearing Python cache..." -ForegroundColor Yellow

$cacheDirs = @(
    "$desktopApp\__pycache__",
    "$desktopApp\modules\__pycache__"
)

foreach ($dir in $cacheDirs) {
    if (Test-Path $dir) {
        Remove-Item -Recurse -Force $dir
        Write-Host "  - Deleted: $dir" -ForegroundColor Green
    }
}

# Also delete .pyc files
Get-ChildItem -Path $desktopApp -Recurse -Filter "*.pyc" -ErrorAction SilentlyContinue | Remove-Item -Force
Write-Host "  - Cleared .pyc files" -ForegroundColor Green

# Step 3: Verify the new theme is in place
Write-Host "`n[3/4] Verifying fixes..." -ForegroundColor Yellow

$themeCheck = Select-String -Path "$desktopApp\modules\theme.py" -Pattern "1a1b26" -Quiet
if ($themeCheck) {
    Write-Host "  - New theme colors: OK" -ForegroundColor Green
} else {
    Write-Host "  - WARNING: New theme not found!" -ForegroundColor Red
}

$classCheck = Select-String -Path "$desktopApp\main.py" -Pattern "class DarkPalette" -Quiet
if (-not $classCheck) {
    Write-Host "  - Duplicate class removed: OK" -ForegroundColor Green
} else {
    Write-Host "  - WARNING: Duplicate DarkPalette still exists!" -ForegroundColor Red
}

# Step 4: Launch the app
Write-Host "`n[4/4] Launching Kollect-It..." -ForegroundColor Yellow
Write-Host ""

Set-Location $desktopApp
py -3.12 main.py