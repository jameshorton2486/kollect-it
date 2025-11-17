# ============================================
# KOLLECT-IT COLOR TOKEN CLEANUP
# Finds and replaces legacy gold tokens/usages
# ============================================

param(
    [string]$RootPath = "c:\Users\james\kollect-it-marketplace-1\src"
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  KOLLECT-IT COLOR TOKEN CLEANUP" -ForegroundColor Cyan
Write-Host "  Root: $RootPath" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

if (!(Test-Path $RootPath)) {
    Write-Host "ERROR: Path not found: $RootPath" -ForegroundColor Red
    exit 1
}

# Patterns to replace
$replacements = @(
    @{ From = "text-accent-gold"; To = "text-gold" },
    @{ From = "bg-accent-gold"; To = "bg-gold" },
    @{ From = "border-accent-gold"; To = "border-gold" },
    @{ From = "hover:text-accent-gold"; To = "hover:text-gold" },
    @{ From = "hover:bg-accent-gold"; To = "hover:bg-gold" },
    @{ From = "var\(--color-gold\)"; To = "hsl(var(--gold-500))" }
)

$files = Get-ChildItem -Path (Join-Path $RootPath "*") -Recurse -File -Include "*.tsx","*.ts"

$changedCount = 0

foreach ($file in $files) {
    try {
        if (!(Test-Path $file.FullName)) {
            Write-Host "Skipping non-existent file: $($file.FullName)" -ForegroundColor Yellow
            continue
        }

        $content = Get-Content -Raw $file.FullName
        $original = $content

        foreach ($rule in $replacements) {
            $content = $content -replace $rule.From, $rule.To
        }

        if ($content -ne $original) {
            Set-Content $file.FullName $content
            $changedCount++
            Write-Host "Updated:" $file.FullName -ForegroundColor Green
        }
    }
    catch {
        Write-Host "Error processing file $($file.FullName): $($_.Exception.Message)" -ForegroundColor Red
        continue
    }
}

Write-Host ""
Write-Host "Cleanup complete. Files changed: $changedCount" -ForegroundColor Green
Write-Host ""