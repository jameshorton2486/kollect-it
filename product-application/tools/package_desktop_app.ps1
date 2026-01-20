# Kollect-It Product Application - Internal Packaging Script
# Creates a distributable ZIP package for internal use only
# 
# Requirements:
#   - Python 3.11 or 3.12
#   - PyInstaller installed: pip install pyinstaller
#   - All dependencies from requirements.txt installed
#
# Usage:
#   .\tools\package_desktop_app.ps1

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Kollect-It Product App - Internal Build" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get script directory and project paths
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$DesktopAppDir = Join-Path $ProjectRoot "desktop-app"
$DistDir = Join-Path $ProjectRoot "dist"
$ToolsDir = Join-Path $ProjectRoot "tools"

# Verify paths
if (-not (Test-Path $DesktopAppDir)) {
    Write-Error "Desktop app directory not found: $DesktopAppDir"
    exit 1
}

if (-not (Test-Path (Join-Path $DesktopAppDir "main.py"))) {
    Write-Error "main.py not found in desktop-app directory"
    exit 1
}

Write-Host "[1/6] Checking Python environment..." -ForegroundColor Yellow

# Check Python version
try {
    $pythonVersion = python --version 2>&1
    Write-Host "  Found: $pythonVersion" -ForegroundColor Green
    
    # Check if version is 3.11 or 3.12
    if ($pythonVersion -notmatch "Python 3\.(11|12)") {
        Write-Warning "  Warning: Python 3.11 or 3.12 recommended"
    }
} catch {
    Write-Error "Python not found. Please install Python 3.11 or 3.12."
    exit 1
}

# Check PyInstaller
Write-Host "[2/6] Checking PyInstaller..." -ForegroundColor Yellow
try {
    $pyinstallerVersion = pyinstaller --version 2>&1
    Write-Host "  Found: PyInstaller $pyinstallerVersion" -ForegroundColor Green
} catch {
    Write-Error "PyInstaller not found. Install with: pip install pyinstaller"
    exit 1
}

# Clean previous build
Write-Host "[3/6] Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path $DistDir) {
    Remove-Item -Recurse -Force $DistDir
    Write-Host "  Removed old dist/ directory" -ForegroundColor Green
}

# Create dist directory
New-Item -ItemType Directory -Force -Path $DistDir | Out-Null

# Create build directory
$BuildDir = Join-Path $ProjectRoot "build"
if (Test-Path $BuildDir) {
    Remove-Item -Recurse -Force $BuildDir
}
New-Item -ItemType Directory -Force -Path $BuildDir | Out-Null

# Create spec file for PyInstaller
Write-Host "[4/6] Creating PyInstaller configuration..." -ForegroundColor Yellow

$SpecFile = Join-Path $DesktopAppDir "kollect-it-app.spec"

$SpecContent = @"
# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(
    ['main.py'],
    pathex=['$($DesktopAppDir.Replace('\', '/'))'],
    binaries=[],
    datas=[
        ('templates', 'templates'),
        ('config', 'config'),
    ],
    hiddenimports=[
        'PyQt5',
        'PIL',
        'requests',
        'anthropic',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        'matplotlib',
        'numpy.distutils',
        'scipy',
        'pandas',
        'IPython',
        'jupyter',
    ],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='KollectItProductApp',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=None,
)
"@

$SpecContent | Out-File -FilePath $SpecFile -Encoding UTF8
Write-Host "  Created spec file: $SpecFile" -ForegroundColor Green

# Run PyInstaller
Write-Host "[5/6] Building executable with PyInstaller..." -ForegroundColor Yellow
Write-Host "  This may take several minutes..." -ForegroundColor Gray

Set-Location $DesktopAppDir

try {
    pyinstaller --clean --noconfirm kollect-it-app.spec
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "PyInstaller build failed. Check errors above."
        exit 1
    }
    
    Write-Host "  Build completed successfully" -ForegroundColor Green
} catch {
    Write-Error "PyInstaller build failed: $_"
    exit 1
} finally {
    Set-Location $ProjectRoot
}

# Move build output to dist
Write-Host "[6/6] Organizing distribution package..." -ForegroundColor Yellow

$BuildOutput = Join-Path $DesktopAppDir "dist"
if (Test-Path $BuildOutput) {
    $AppFolder = Get-ChildItem -Path $BuildOutput -Directory | Select-Object -First 1
    if ($AppFolder) {
        $TargetFolder = Join-Path $DistDir "KollectItProductApp"
        if (Test-Path $TargetFolder) {
            Remove-Item -Recurse -Force $TargetFolder
        }
        Move-Item -Path $AppFolder.FullName -Destination $TargetFolder
        Write-Host "  Moved build output to dist/" -ForegroundColor Green
    }
}

# Copy README
$ReadmeSource = Join-Path $DistDir "README-INTERNAL.txt"
if (-not (Test-Path $ReadmeSource)) {
    Write-Host "  Warning: README-INTERNAL.txt not found. Creating placeholder..." -ForegroundColor Yellow
    # Will be created by the runbook task
}

# Create ZIP archive
$DateStamp = Get-Date -Format "yyyy-MM"
$ZipName = "kollect-it-product-app-internal-$DateStamp.zip"
$ZipPath = Join-Path $DistDir $ZipName

Write-Host ""
Write-Host "Creating ZIP archive..." -ForegroundColor Yellow

if (Test-Path $ZipPath) {
    Remove-Item -Force $ZipPath
}

# Create ZIP using .NET compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($TargetFolder, $ZipPath)

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Build Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Distribution package:" -ForegroundColor Cyan
Write-Host "  $ZipPath" -ForegroundColor White
Write-Host ""
Write-Host "Package contents:" -ForegroundColor Cyan
Write-Host "  - KollectItProductApp.exe (main executable)" -ForegroundColor Gray
Write-Host "  - Required DLLs and dependencies" -ForegroundColor Gray
Write-Host "  - Templates and config files" -ForegroundColor Gray
Write-Host ""
Write-Host "IMPORTANT:" -ForegroundColor Yellow
Write-Host "  - This package is for INTERNAL USE ONLY" -ForegroundColor Yellow
Write-Host "  - Do NOT redistribute outside your organization" -ForegroundColor Yellow
Write-Host "  - Secrets must be configured in main repo .env.local" -ForegroundColor Yellow
Write-Host "  - Do NOT commit this ZIP to git" -ForegroundColor Yellow
Write-Host ""
