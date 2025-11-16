# ============================================
# KOLLECT-IT TSX FILE SCANNER & ORGANIZER
# Identifies all .tsx files, detects duplicates
# ============================================

param(
    [switch]$PrintContents = $false,
    [switch]$FindDuplicates = $true,
    [string]$OutputFile = "tsx-file-report.txt"
)

$ErrorActionPreference = "Stop"

# Colors for output
$colors = @{
    reset = "`e[0m"
    green = "`e[32m"
    yellow = "`e[33m"
    red = "`e[31m"
    blue = "`e[34m"
    cyan = "`e[36m"
    bold = "`e[1m"
    dim = "`e[2m"
}

function Write-Header {
    param([string]$Text)
    Write-Host ""
    Write-Host "$($colors.bold)$($colors.cyan)$('=' * 60)$($colors.reset)"
    Write-Host "$($colors.bold)$($colors.cyan)$Text$($colors.reset)"
    Write-Host "$($colors.bold)$($colors.cyan)$('=' * 60)$($colors.reset)"
    Write-Host ""
}

function Write-Success {
    param([string]$Text, [string]$Details = "")
    $detail = if ($Details) { " $($colors.dim)($Details)$($colors.reset)" } else { "" }
    Write-Host "  $($colors.green)✓$($colors.reset) $Text$detail"
}

function Write-Warning {
    param([string]$Text, [string]$Details = "")
    $detail = if ($Details) { " $($colors.dim)($Details)$($colors.reset)" } else { "" }
    Write-Host "  $($colors.yellow)⚠$($colors.reset) $Text$detail"
}

function Write-Error {
    param([string]$Text, [string]$Details = "")
    $detail = if ($Details) { " $($colors.dim)($Details)$($colors.reset)" } else { "" }
    Write-Host "  $($colors.red)✗$($colors.reset) $Text$detail"
}

function Get-FileSize {
    param([long]$Bytes)
    if ($Bytes -lt 1KB) { return "$Bytes B" }
    if ($Bytes -lt 1MB) { return "{0:N1} KB" -f ($Bytes / 1KB) }
    return "{0:N1} MB" -f ($Bytes / 1MB)
}

# Main execution
Write-Header "KOLLECT-IT TSX FILE SCANNER"

Write-Host "Scanning project for .tsx files..." -ForegroundColor Cyan
Write-Host ""

# Get current directory
$projectRoot = Get-Location
Write-Host "Project Root: $projectRoot" -ForegroundColor DarkGray
Write-Host ""

# Scan for all .tsx files
$allTsxFiles = Get-ChildItem -Path $projectRoot -Recurse -Filter "*.tsx" -ErrorAction SilentlyContinue

Write-Host "Found $($allTsxFiles.Count) .tsx files" -ForegroundColor Cyan
Write-Host ""

# Categorize files
$categories = @{
    "Layout & Pages" = @()
    "Components - UI (Shadcn)" = @()
    "Components - Products" = @()
    "Components - Home" = @()
    "Components - Admin" = @()
    "Components - Other" = @()
    "Root & App" = @()
}

$duplicateNames = @{}

foreach ($file in $allTsxFiles) {
    $relativePath = $file.FullName.Replace($projectRoot.Path + '\', '')
    $fileName = $file.Name
    
    # Track duplicates
    if ($duplicateNames.ContainsKey($fileName)) {
        $duplicateNames[$fileName] += @($relativePath)
    } else {
        $duplicateNames[$fileName] = @($relativePath)
    }
    
    # Categorize
    if ($relativePath -match "app.*layout|app.*page") {
        $categories["Root & App"] += @{ Path = $relativePath; Size = $file.Length }
    }
    elseif ($relativePath -match "components.*ui") {
        $categories["Components - UI (Shadcn)"] += @{ Path = $relativePath; Size = $file.Length }
    }
    elseif ($relativePath -match "components.*product") {
        $categories["Components - Products"] += @{ Path = $relativePath; Size = $file.Length }
    }
    elseif ($relativePath -match "components.*home") {
        $categories["Components - Home"] += @{ Path = $relativePath; Size = $file.Length }
    }
    elseif ($relativePath -match "components.*admin|dashboard") {
        $categories["Components - Admin"] += @{ Path = $relativePath; Size = $file.Length }
    }
    else {
        $categories["Components - Other"] += @{ Path = $relativePath; Size = $file.Length }
    }
}

# Print by category
Write-Header "FILES ORGANIZED BY CATEGORY"

foreach ($category in $categories.GetEnumerator() | Where-Object { $_.Value.Count -gt 0 }) {
    Write-Host "$($colors.bold)$($colors.blue)$($category.Key)$($colors.reset)"
    Write-Host "$($colors.dim)($($category.Value.Count) files)$($colors.reset)"
    Write-Host ""
    
    foreach ($file in $category.Value) {
        $size = Get-FileSize $file.Size
        Write-Host "  • $($file.Path) $($colors.dim)($size)$($colors.reset)"
    }
    Write-Host ""
}

# Find and report duplicates
if ($FindDuplicates) {
    Write-Header "DUPLICATE FILE NAMES (POTENTIAL ISSUE)"
    
    $duplicates = $duplicateNames.GetEnumerator() | Where-Object { $_.Value.Count -gt 1 }
    
    if ($duplicates.Count -eq 0) {
        Write-Success "No duplicate file names found"
        Write-Host ""
    } else {
        Write-Warning "Found $($duplicates.Count) duplicate file names"
        Write-Host ""
        
        foreach ($dup in $duplicates) {
            Write-Host "$($colors.bold)$($colors.yellow)$($dup.Key)$($colors.reset)"
            foreach ($path in $dup.Value) {
                Write-Host "  • $path"
            }
            Write-Host ""
        }
    }
}

# List files needed for deployment
Write-Header "CRITICAL FILES FOR DEPLOYMENT"

$criticalFiles = @(
    "src/app/layout.tsx",
    "src/app/page.tsx",
    "src/components/Header.tsx",
    "src/components/Hero.tsx",
    "src/components/Footer.tsx"
)

$found = 0
$missing = 0

foreach ($file in $criticalFiles) {
    $fullPath = Join-Path $projectRoot $file
    if (Test-Path $fullPath) {
        Write-Success "Found: $file"
        $found++
    } else {
        Write-Warning "Not found: $file"
        $missing++
    }
}

Write-Host ""
Write-Host "Summary: $found found, $missing missing" -ForegroundColor Cyan
Write-Host ""

# Export to file
Write-Header "EXPORTING REPORT"

$report = @()
$report += "KOLLECT-IT TSX FILES REPORT"
$report += "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$report += ""
$report += "TOTAL FILES: $($allTsxFiles.Count)"
$report += ""

foreach ($category in $categories.GetEnumerator() | Where-Object { $_.Value.Count -gt 0 }) {
    $report += ""
    $report += $category.Key
    $report += "$('=' * 60)"
    foreach ($file in $category.Value) {
        $size = Get-FileSize $file.Size
        $report += "$($file.Path) [$size]"
    }
}

$report | Out-File -FilePath $OutputFile -Encoding UTF8

Write-Success "Report saved to: $OutputFile"
Write-Host ""

# Next steps
Write-Header "NEXT STEPS"

Write-Host "1. $($colors.bold)Review duplicate files$($colors.reset)"
Write-Host "   - Check if different files with same names exist"
Write-Host "   - Example: src/components/Header.tsx vs src/app/components/Header.tsx"
Write-Host ""

Write-Host "2. $($colors.bold)Run extraction script$($colors.reset)"
Write-Host "   - Use: $($colors.cyan)02-EXTRACT-TSX-CONTENTS.ps1$($colors.reset)"
Write-Host ""

Write-Host "3. $($colors.bold)Review extracted files$($colors.reset)"
Write-Host "   - Check output folder for all .tsx contents"
Write-Host "   - Identify which are critical for deployment"
Write-Host ""

Write-Host "4. $($colors.bold)Create deployment package$($colors.reset)"
Write-Host "   - Copy critical files to deployment-new/02-COMPONENTS/"
Write-Host ""

Write-Host "$($colors.green)✓ Scan complete!$($colors.reset)"
Write-Host ""
