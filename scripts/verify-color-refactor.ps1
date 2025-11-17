# ============================================
# KOLLECT-IT REFACTOR VERIFICATION
# Scans for legacy tokens and validates build
# ============================================

param(
    [string]$RootPath = "c:\Users\james\kollect-it-marketplace-1\src",
    [switch]$Fix = $false
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  KOLLECT-IT REFACTOR VERIFICATION" -ForegroundColor Cyan
Write-Host "  Root: $RootPath" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

if (!(Test-Path $RootPath)) {
    Write-Host "ERROR: Path not found: $RootPath" -ForegroundColor Red
    exit 1
}

# Patterns to check for (legacy tokens)
$badPatterns = @(
    "text-accent-gold",
    "bg-accent-gold", 
    "border-accent-gold",
    "var\(--color-accent-gold\)",
    "--color-accent-gold",
    "var\(--color-gold\)",
    "#B1874C",
    "#1E1E1E"
)

Write-Host "🔍 Scanning for legacy color tokens..." -ForegroundColor Yellow
Write-Host ""

$issuesFound = 0
$files = Get-ChildItem -Path (Join-Path $RootPath "*") -Recurse -File -Include "*.tsx","*.ts","*.css"

foreach ($pattern in $badPatterns) {
    $results = $files | Select-String -Pattern $pattern -AllMatches

    if ($results) {
        Write-Host "⚠️  Found legacy pattern: '$pattern'" -ForegroundColor Red
        foreach ($result in $results) {
            Write-Host "   📁 $($result.Filename):$($result.LineNumber)" -ForegroundColor Gray
            Write-Host "      $($result.Line.Trim())" -ForegroundColor Gray
        }
        Write-Host ""
        $issuesFound += $results.Count
    }
}

if ($issuesFound -eq 0) {
    Write-Host "✅ No legacy color tokens found!" -ForegroundColor Green
} else {
    Write-Host "❌ Found $issuesFound legacy token usage(s)" -ForegroundColor Red
    
    if ($Fix) {
        Write-Host ""
        Write-Host "🔧 Running cleanup script..." -ForegroundColor Yellow
        & ".\scripts\clean-color-tokens.ps1"
    } else {
        Write-Host ""
        Write-Host "💡 To fix automatically, run:" -ForegroundColor Cyan
        Write-Host "   .\scripts\verify-refactor.ps1 -Fix" -ForegroundColor Cyan
        Write-Host "   OR" -ForegroundColor Cyan
        Write-Host "   .\scripts\clean-color-tokens.ps1" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "🏗️  Testing build..." -ForegroundColor Yellow

try {
    $buildResult = & npm run build 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build successful!" -ForegroundColor Green
    } else {
        Write-Host "❌ Build failed!" -ForegroundColor Red
        Write-Host "Build output:" -ForegroundColor Gray
        Write-Host $buildResult -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Build command failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  VERIFICATION COMPLETE" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan