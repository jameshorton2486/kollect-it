# Kollect-It Product Application Launcher
# Works regardless of execution directory

# Get script directory dynamically
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$DesktopAppDir = Join-Path $ScriptDir "desktop-app"
$RepoRoot = Split-Path -Parent (Split-Path -Parent $ScriptDir)

# Verify paths exist
if (-not (Test-Path $DesktopAppDir)) {
    Write-Error "Desktop app directory not found: $DesktopAppDir"
    exit 1
}

# Change to desktop-app directory
Set-Location $DesktopAppDir

Write-Host "Repository Root: $RepoRoot" -ForegroundColor Cyan
Write-Host "Desktop App Dir: $DesktopAppDir" -ForegroundColor Cyan

# Activate virtual environment if it exists
$VenvActivate = Join-Path $DesktopAppDir "venv\Scripts\Activate.ps1"
if (Test-Path $VenvActivate) {
    Write-Host "Activating virtual environment..." -ForegroundColor Green
    & $VenvActivate
}

# Run the application
python main.py
