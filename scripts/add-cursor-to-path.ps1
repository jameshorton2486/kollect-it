# Add Cursor to PATH
# Run this script as Administrator or it will only add to user PATH

Write-Host "`n🔧 Adding Cursor to PATH`n" -ForegroundColor Cyan

# Common Cursor installation paths
$cursorPaths = @(
    "$env:LOCALAPPDATA\Programs\cursor",
    "$env:ProgramFiles\Cursor",
    "$env:ProgramFiles(x86)\Cursor"
)

$cursorExe = $null
$cursorDir = $null

# Find Cursor installation
foreach ($path in $cursorPaths) {
    if (Test-Path $path) {
        $exe = Get-ChildItem -Path $path -Filter "cursor.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($exe) {
            $cursorExe = $exe.FullName
            $cursorDir = $exe.DirectoryName
            Write-Host "✅ Found Cursor at: $cursorExe" -ForegroundColor Green
            break
        }
    }
}

if (-not $cursorDir) {
    Write-Host "❌ Could not find Cursor installation" -ForegroundColor Red
    Write-Host "`nPlease install Cursor first, or provide the path manually." -ForegroundColor Yellow
    Write-Host "`nCommon installation locations:" -ForegroundColor Cyan
    Write-Host "  • $env:LOCALAPPDATA\Programs\cursor" -ForegroundColor White
    Write-Host "  • $env:ProgramFiles\Cursor" -ForegroundColor White
    exit 1
}

# Get current PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")

# Check if already in PATH
if ($currentPath -split ';' | Where-Object { $_ -eq $cursorDir }) {
    Write-Host "`n✅ Cursor directory already in PATH" -ForegroundColor Green
    Write-Host "   Directory: $cursorDir" -ForegroundColor White
    Write-Host "`nTo verify, restart your terminal and run: cursor --version`n" -ForegroundColor Yellow
    exit 0
}

# Add to PATH
try {
    $newPath = $currentPath + ";" + $cursorDir
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    
    Write-Host "`n✅ Added Cursor to PATH" -ForegroundColor Green
    Write-Host "   Directory: $cursorDir" -ForegroundColor White
    Write-Host "`n⚠️  IMPORTANT: Restart your terminal for changes to take effect" -ForegroundColor Yellow
    Write-Host "`nAfter restarting, test with: cursor --version`n" -ForegroundColor Cyan
    
    # Optionally update current session PATH (won't persist but allows immediate testing)
    $env:Path = $env:Path + ";" + $cursorDir
    Write-Host "💡 Updated current session PATH (temporary)" -ForegroundColor Gray
    Write-Host "   You can test now, but restart terminal for permanent change`n" -ForegroundColor Gray
    
} catch {
    Write-Host "`n❌ Failed to add to PATH" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`nTry running PowerShell as Administrator`n" -ForegroundColor Yellow
    exit 1
}
