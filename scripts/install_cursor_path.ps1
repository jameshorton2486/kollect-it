#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Install 'cursor' command in PATH

.DESCRIPTION
    Adds Cursor executable directory to the system PATH so you can run 'cursor' from anywhere.

.EXAMPLE
    .\scripts\install_cursor_path.ps1
#>

$ErrorActionPreference = "Stop"

Write-Host "`n🔧 Installing 'cursor' command in PATH`n" -ForegroundColor Cyan

# Common Cursor installation paths
$possiblePaths = @(
    "$env:LOCALAPPDATA\Programs\cursor",
    "$env:PROGRAMFILES\Cursor",
    "$env:PROGRAMFILES(X86)\Cursor"
)

$cursorExe = $null
$cursorDir = $null

# Find Cursor executable
foreach ($path in $possiblePaths) {
    $exePath = Join-Path $path "Cursor.exe"
    if (Test-Path $exePath) {
        $cursorExe = $exePath
        $cursorDir = $path
        Write-Host "✅ Found Cursor at: $cursorExe" -ForegroundColor Green
        break
    }
}

# If not found, search more broadly
if (-not $cursorExe) {
    Write-Host "🔍 Searching for Cursor installation..." -ForegroundColor Yellow
    
    $searchPaths = @(
        "$env:LOCALAPPDATA\Programs",
        "$env:PROGRAMFILES",
        "$env:PROGRAMFILES(X86)"
    )
    
    foreach ($searchPath in $searchPaths) {
        if (Test-Path $searchPath) {
            $found = Get-ChildItem -Path $searchPath -Filter "Cursor.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
            if ($found) {
                $cursorExe = $found.FullName
                $cursorDir = $found.DirectoryName
                Write-Host "✅ Found Cursor at: $cursorExe" -ForegroundColor Green
                break
            }
        }
    }
}

if (-not $cursorExe) {
    Write-Host "`n❌ Cursor executable not found!" -ForegroundColor Red
    Write-Host "`nPlease install Cursor first:" -ForegroundColor Yellow
    Write-Host "  1. Download from: https://cursor.sh" -ForegroundColor White
    Write-Host "  2. Install Cursor" -ForegroundColor White
    Write-Host "  3. Run this script again`n" -ForegroundColor White
    exit 1
}

# Check if already in PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -like "*$cursorDir*") {
    Write-Host "`n✅ Cursor directory already in User PATH" -ForegroundColor Green
    Write-Host "   Location: $cursorDir`n" -ForegroundColor Gray
    
    # Test if 'cursor' command works
    $env:Path = [Environment]::GetEnvironmentVariable("Path", "User") + ";" + [Environment]::GetEnvironmentVariable("Path", "Machine")
    try {
        $cursorVersion = & cursor --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ 'cursor' command is working!" -ForegroundColor Green
            Write-Host "   Version: $cursorVersion`n" -ForegroundColor Gray
        }
    } catch {
        Write-Host "⚠️  'cursor' command not yet available in current session" -ForegroundColor Yellow
        Write-Host "   Restart your terminal to use 'cursor' command`n" -ForegroundColor Yellow
    }
    exit 0
}

# Add to User PATH
Write-Host "`n📝 Adding Cursor to User PATH..." -ForegroundColor Yellow
Write-Host "   Directory: $cursorDir" -ForegroundColor Gray

$newPath = if ($currentPath) {
    "$currentPath;$cursorDir"
} else {
    $cursorDir
}

try {
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Host "✅ Successfully added to User PATH!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to update PATH: $_" -ForegroundColor Red
    exit 1
}

# Update current session PATH
$env:Path = "$env:Path;$cursorDir"

Write-Host "`n✅ Installation complete!`n" -ForegroundColor Green

# Test the command
Write-Host "🧪 Testing 'cursor' command..." -ForegroundColor Cyan
try {
    $cursorVersion = & cursor --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 'cursor' command is working!" -ForegroundColor Green
        Write-Host "   Version: $cursorVersion`n" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  Command may not be available until terminal restart" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Command not yet available in current session" -ForegroundColor Yellow
    Write-Host "   This is normal - restart your terminal to use 'cursor' command`n" -ForegroundColor Yellow
}

Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Restart your terminal (or open a new one)" -ForegroundColor White
Write-Host "   2. Test: cursor --version" -ForegroundColor White
Write-Host "   3. Use: cursor . (to open current directory in Cursor)`n" -ForegroundColor White
