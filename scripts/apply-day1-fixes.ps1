# Kollect-It Day 1 Fixes - Batch Apply
# Applies all critical Day 1 fixes with automatic backups
# Usage: .\apply-day1-fixes.ps1 [-DryRun] [-NoBackup]

param(
    [switch]$DryRun,
    [switch]$NoBackup
)

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  KOLLECT-IT DAY 1 FIXES" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "  [DRY RUN MODE - No changes will be made]" -ForegroundColor Yellow
    Write-Host ""
}

$fixesApplied = 0
$fixesFailed = 0

# Create backup directory
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = "backups/day1-fixes-$timestamp"

if (-not $NoBackup -and -not $DryRun) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    Write-Host "Backup directory: $backupDir" -ForegroundColor DarkGray
    Write-Host ""
}

# ============================================
# FIX 1: Admin Dashboard Gray Class
# ============================================
Write-Host "[FIX 1] Admin Dashboard - Last Gray Class" -ForegroundColor Yellow

$adminDashPath = "src/app/admin/dashboard/page.tsx"
$oldPattern = 'bg-gray-100 text-gray-800'
$newPattern = 'bg-lux-cream text-lux-gray-dark'

if (Test-Path $adminDashPath) {
    $content = Get-Content $adminDashPath -Raw
    
    if ($content -match [regex]::Escape($oldPattern)) {
        if (-not $DryRun) {
            # Backup
            if (-not $NoBackup) {
                Copy-Item $adminDashPath "$backupDir/page.tsx.backup"
            }
            
            # Apply fix
            $newContent = $content -replace [regex]::Escape($oldPattern), $newPattern
            Set-Content -Path $adminDashPath -Value $newContent -NoNewline
            
            Write-Host "  [APPLIED] $adminDashPath" -ForegroundColor Green
            Write-Host "    Changed: $oldPattern -> $newPattern" -ForegroundColor DarkGray
        } else {
            Write-Host "  [WOULD FIX] $adminDashPath" -ForegroundColor Cyan
            Write-Host "    Would change: $oldPattern -> $newPattern" -ForegroundColor DarkGray
        }
        $fixesApplied++
    } else {
        Write-Host "  [SKIP] Pattern not found (already fixed?)" -ForegroundColor DarkGray
    }
} else {
    Write-Host "  [ERROR] File not found: $adminDashPath" -ForegroundColor Red
    $fixesFailed++
}

Write-Host ""

# ============================================
# FIX 2: Desktop App Env Template
# ============================================
Write-Host "[FIX 2] Desktop App Env Template - Variable Name" -ForegroundColor Yellow

$desktopEnvPath = "desktop-app-env-template.txt"
$oldVar = 'SERVICE_API_KEY'
$newVar = 'PRODUCT_INGEST_API_KEY'

if (Test-Path $desktopEnvPath) {
    $content = Get-Content $desktopEnvPath -Raw
    
    if ($content -match $oldVar) {
        if (-not $DryRun) {
            # Backup
            if (-not $NoBackup) {
                Copy-Item $desktopEnvPath "$backupDir/desktop-app-env-template.txt.backup"
            }
            
            # Apply fix
            $newContent = $content -replace $oldVar, $newVar
            Set-Content -Path $desktopEnvPath -Value $newContent -NoNewline
            
            Write-Host "  [APPLIED] $desktopEnvPath" -ForegroundColor Green
            Write-Host "    Changed: $oldVar -> $newVar" -ForegroundColor DarkGray
        } else {
            Write-Host "  [WOULD FIX] $desktopEnvPath" -ForegroundColor Cyan
            Write-Host "    Would change: $oldVar -> $newVar" -ForegroundColor DarkGray
        }
        $fixesApplied++
    } else {
        Write-Host "  [SKIP] Variable not found (already fixed?)" -ForegroundColor DarkGray
    }
} else {
    Write-Host "  [SKIP] File not found: $desktopEnvPath" -ForegroundColor DarkGray
}

Write-Host ""

# ============================================
# FIX 3: Website Env Template
# ============================================
Write-Host "[FIX 3] Website Env Template - Variable Name" -ForegroundColor Yellow

$websiteEnvPath = "env_vars_template.txt"

if (Test-Path $websiteEnvPath) {
    $content = Get-Content $websiteEnvPath -Raw
    
    if ($content -match $oldVar) {
        if (-not $DryRun) {
            # Backup
            if (-not $NoBackup) {
                Copy-Item $websiteEnvPath "$backupDir/env_vars_template.txt.backup"
            }
            
            # Apply fix
            $newContent = $content -replace $oldVar, $newVar
            Set-Content -Path $websiteEnvPath -Value $newContent -NoNewline
            
            Write-Host "  [APPLIED] $websiteEnvPath" -ForegroundColor Green
            Write-Host "    Changed: $oldVar -> $newVar" -ForegroundColor DarkGray
        } else {
            Write-Host "  [WOULD FIX] $websiteEnvPath" -ForegroundColor Cyan
            Write-Host "    Would change: $oldVar -> $newVar" -ForegroundColor DarkGray
        }
        $fixesApplied++
    } else {
        Write-Host "  [SKIP] Variable not found (already fixed?)" -ForegroundColor DarkGray
    }
} else {
    Write-Host "  [SKIP] File not found: $websiteEnvPath" -ForegroundColor DarkGray
}

Write-Host ""

# ============================================
# SUMMARY
# ============================================
Write-Host "======================================" -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "  DRY RUN COMPLETE" -ForegroundColor Yellow
    Write-Host "  Would apply $fixesApplied fix(es)" -ForegroundColor Yellow
    Write-Host "  Run without -DryRun to apply changes" -ForegroundColor Yellow
} else {
    if ($fixesFailed -eq 0) {
        Write-Host "  [SUCCESS] Applied $fixesApplied fix(es)" -ForegroundColor Green
        if (-not $NoBackup) {
            Write-Host "  Backups saved to: $backupDir" -ForegroundColor DarkGray
        }
    } else {
        Write-Host "  Applied $fixesApplied fix(es), $fixesFailed failed" -ForegroundColor Yellow
    }
}

Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Return exit code
if ($fixesFailed -gt 0) {
    exit 1
} else {
    exit 0
}
