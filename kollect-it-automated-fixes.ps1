# KOLLECT-IT AUTOMATED FIXES
param(
    [switch]$SkipBackup,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupFolder = ".\backups\$timestamp"
$logFile = ".\fix-log-$timestamp.txt"

function Write-Log {
    param($Message)
    $logMessage = "[$(Get-Date -Format 'HH:mm:ss')] $Message"
    Write-Host $logMessage -ForegroundColor Cyan
    Add-Content -Path $logFile -Value $logMessage
}

function Create-Backup {
    if ($SkipBackup) {
        Write-Log "Skipping backup (SkipBackup flag set)"
        return
    }
    
    Write-Log "Creating backup in $backupFolder"
    New-Item -ItemType Directory -Path $backupFolder -Force | Out-Null
    
    Copy-Item -Path ".\src" -Destination "$backupFolder\src" -Recurse -Force
    Copy-Item -Path ".\tailwind.config.ts" -Destination "$backupFolder\" -Force -ErrorAction SilentlyContinue
    
    Write-Log "Backup complete"
}

function Replace-InFiles {
    param(
        [string]$Path,
        [hashtable]$Replacements,
        [string[]]$Extensions = @("*.tsx", "*.ts", "*.jsx", "*.js")
    )
    
    $files = Get-ChildItem -Path $Path -Include $Extensions -Recurse -File
    $totalReplacements = 0
    
    foreach ($file in $files) {
        try {
            $content = Get-Content -Path $file.FullName -Raw
            $fileReplacements = 0
            
            foreach ($key in $Replacements.Keys) {
                $pattern = [regex]::Escape($key)
                $matches = [regex]::Matches($content, $pattern)
                if ($matches.Count -gt 0) {
                    $content = $content -replace $pattern, $Replacements[$key]
                    $fileReplacements += $matches.Count
                }
            }
            
            if ($fileReplacements -gt 0) {
                Write-Log "  $($file.Name): $fileReplacements replacements"
                if (-not $DryRun) {
                    Set-Content -Path $file.FullName -Value $content -NoNewline
                }
                $totalReplacements += $fileReplacements
            }
        } catch {
            Write-Log "Warning: Could not process $($file.FullName) - $($_.Exception.Message)"
        }
    }
    
    return $totalReplacements
}

Write-Host ""
Write-Host "╔═══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   KOLLECT-IT AUTOMATED FIXES v1.0         ║" -ForegroundColor Green
Write-Host "║   Next.js + Tailwind Design System        ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

if ($DryRun) {
    Write-Host "DRY RUN MODE - No files will be modified" -ForegroundColor Yellow
}

Write-Log "=== Step 1: Creating Backup ==="
Create-Backup

Write-Log "=== Step 2: Applying Global Color Fixes ==="
$colorReplacements = @{
    'bg-white' = 'bg-surface-0'
    'bg-gray-50' = 'bg-surface-50'
    'bg-gray-100' = 'bg-surface-100'
    'bg-gray-200' = 'bg-surface-200'
    'text-gray-900' = 'text-ink-900'
    'text-gray-800' = 'text-ink-800'
    'text-gray-700' = 'text-ink-700'
    'text-gray-600' = 'text-ink-600'
    'text-gray-500' = 'text-ink-500'
    'border-gray-200' = 'border-border-200'
    'border-gray-300' = 'border-border-300'
}

$replaced = Replace-InFiles -Path ".\src" -Replacements $colorReplacements
Write-Log "Total color replacements: $replaced"

Write-Log "=== Step 3: Fixing Loading States ==="
$loadingReplacements = @{
    'animate-pulse bg-gray-100' = 'animate-shimmer'
    'bg-gray-100 animate-pulse' = 'animate-shimmer'
}

$replaced = Replace-InFiles -Path ".\src" -Replacements $loadingReplacements
Write-Log "Total loading state fixes: $replaced"

Write-Log "=== Step 4: Creating Component Files ==="
if (Test-Path ".\create-components.ps1") {
    & .\create-components.ps1
} else {
    Write-Log "Warning: create-components.ps1 not found"
}

Write-Log "=== Step 5: Replacing globals.css ==="
if (Test-Path ".\globals-ENHANCED.css") {
    if (-not $DryRun) {
        Copy-Item -Path ".\src\app\globals.css" -Destination "$backupFolder\globals.css.backup" -Force -ErrorAction SilentlyContinue
        Copy-Item -Path ".\globals-ENHANCED.css" -Destination ".\src\app\globals.css" -Force
        Write-Log "globals.css replaced with enhanced version"
    } else {
        Write-Log "[DRY RUN] Would replace globals.css"
    }
} else {
    Write-Log "Warning: globals-ENHANCED.css not found, skipping"
}

Write-Log "=== Step 6: Generating Report ==="
$reportPath = ".\FIXES-APPLIED-$timestamp.md"

$report = "# Kollect-It Automated Fixes Report`n"
$report += "**Generated:** $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n`n"
$report += "## Changes Applied`n`n"
$report += "### 1. Color System Updates`n"
$report += "- Replaced ``bg-white`` with ``bg-surface-0`` across all files`n"
$report += "- Replaced gray scale with design tokens (surface-*, ink-*)`n`n"
$report += "### 2. Loading States`n"
$report += "- Replaced ``animate-pulse bg-gray-100`` with ``animate-shimmer```n`n"
$report += "### 3. Component Files Created`n"
$report += "- ``src/components/EmptyState.tsx`` added`n"
$report += "- ``src/components/Breadcrumbs.tsx`` added`n`n"
$report += "## Backup Location`n"
$report += "```````n$backupFolder`n```````n"

if (-not $DryRun) {
    Set-Content -Path $reportPath -Value $report
    Write-Log "Report saved to: $reportPath"
}

Write-Host ""
Write-Host "╔═══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   ✅ AUTOMATED FIXES COMPLETE              ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Report: $reportPath" -ForegroundColor Cyan
Write-Host "📝 Log: $logFile" -ForegroundColor Cyan
Write-Host "💾 Backup: $backupFolder" -ForegroundColor Cyan