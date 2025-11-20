# ============================================================================
# KOLLECT-IT: IMMEDIATE EPERM FIX
# ============================================================================
# Fixes the "EPERM: operation not permitted" error on .next/trace
# This script safely cleans the .next directory and kills blocking processes
# ============================================================================

Write-Host "=== KOLLECT-IT: IMMEDIATE EPERM FIX ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill any Node.js processes that might be locking files
Write-Host "[1/4] Checking for running Node.js processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "Found $($nodeProcesses.Count) Node.js process(es) running" -ForegroundColor Yellow
    Write-Host "Stopping Node.js processes..." -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "✓ Node.js processes stopped" -ForegroundColor Green
} else {
    Write-Host "✓ No Node.js processes running" -ForegroundColor Green
}

# Step 2: Remove .next directory completely
Write-Host ""
Write-Host "[2/4] Removing .next directory..." -ForegroundColor Yellow
$nextDir = "C:\Users\james\kollect-it-marketplace-1\.next"
if (Test-Path $nextDir) {
    try {
        # Try normal removal first
        Remove-Item -Path $nextDir -Recurse -Force -ErrorAction Stop
        Write-Host "✓ .next directory removed successfully" -ForegroundColor Green
    } catch {
        Write-Host "! Standard removal failed, trying alternative method..." -ForegroundColor Yellow
        # Use robocopy to clear the directory (Windows workaround for locked files)
        $emptyDir = "$env:TEMP\empty_$(Get-Random)"
        New-Item -ItemType Directory -Path $emptyDir -Force | Out-Null
        robocopy $emptyDir $nextDir /MIR /R:0 /W:0 /NFL /NDL /NJH /NJS /NC /NS /NP | Out-Null
        Remove-Item -Path $emptyDir -Force
        Remove-Item -Path $nextDir -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "✓ .next directory removed using alternative method" -ForegroundColor Green
    }
} else {
    Write-Host "✓ .next directory doesn't exist (already clean)" -ForegroundColor Green
}

# Step 3: Clear any temp files that might be locked
Write-Host ""
Write-Host "[3/4] Clearing temporary files..." -ForegroundColor Yellow
$tempDirs = @(
    "$env:TEMP\next-*",
    "C:\Users\james\kollect-it-marketplace-1\.next",
    "C:\Users\james\kollect-it-marketplace-1\node_modules\.cache"
)

foreach ($pattern in $tempDirs) {
    if (Test-Path $pattern) {
        Remove-Item -Path $pattern -Recurse -Force -ErrorAction SilentlyContinue
    }
}
Write-Host "✓ Temporary files cleared" -ForegroundColor Green

# Step 4: Verify ports are free
Write-Host ""
Write-Host "[4/4] Checking port availability..." -ForegroundColor Yellow
$portsToCheck = @(3000, 3001)
foreach ($port in $portsToCheck) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connection) {
        $processId = $connection.OwningProcess
        Write-Host "! Port $port is in use by process $processId" -ForegroundColor Yellow
        try {
            Stop-Process -Id $processId -Force
            Write-Host "✓ Process $processId stopped" -ForegroundColor Green
        } catch {
            Write-Host "! Could not stop process $processId automatically" -ForegroundColor Red
        }
    } else {
        Write-Host "✓ Port $port is available" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "=== FIX COMPLETE ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm run dev" -ForegroundColor White
Write-Host "2. If error persists, restart your computer and try again" -ForegroundColor White
Write-Host "3. Check that antivirus isn't blocking Node.js" -ForegroundColor White
Write-Host ""
