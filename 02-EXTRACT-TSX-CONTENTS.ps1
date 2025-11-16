# ============================================
# EXTRACT TSX FILE CONTENTS
# Pulls all .tsx file contents into organized output
# ============================================

param(
    [string[]]$SpecificFiles = @(),
    [string]$OutputFolder = "extracted-tsx-contents",
    [switch]$ScreenOutput = $true
)

$ErrorActionPreference = "Stop"

# Colors
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

# Create output folder
if (!(Test-Path $OutputFolder)) {
    New-Item -ItemType Directory -Path $OutputFolder | Out-Null
}

Write-Header "KOLLECT-IT TSX CONTENT EXTRACTOR"

# Define critical files to extract
$criticalFiles = @(
    # Layout & Pages
    "src/app/layout.tsx",
    "src/app/page.tsx",
    
    # Main components
    "src/components/Header.tsx",
    "src/components/Hero.tsx",
    "src/components/Footer.tsx",
    
    # Home components
    "src/components/home/LatestArrivalsClient.tsx",
    "src/components/home/FeaturedCollection.tsx",
    "src/components/home/TrustStrip.tsx",
    
    # Product components
    "src/components/products/ProductCard.tsx",
    "src/components/products/ProductGrid.tsx",
    
    # UI components (shadcn)
    "src/components/ui/button.tsx",
    "src/components/ui/card.tsx"
)

# Override if specific files provided
if ($SpecificFiles.Count -gt 0) {
    $criticalFiles = $SpecificFiles
}

Write-Host "Target files to extract: $($criticalFiles.Count)"
Write-Host ""

$extracted = 0
$missing = 0
$files_info = @()

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "$($colors.green)✓$($colors.reset) $file" -NoNewline
        
        $content = Get-Content $file -Raw
        $lines = ($content | Measure-Object -Line).Lines
        
        Write-Host " $($colors.dim)($lines lines)$($colors.reset)"
        
        $extracted++
        $files_info += @{
            Path = $file
            Content = $content
            Lines = $lines
            SafeName = ($file -replace '[/\\:]', '_' -replace '^src_', '')
        }
    } else {
        Write-Host "$($colors.yellow)?$($colors.reset) NOT FOUND: $file"
        $missing++
    }
}

Write-Host ""
Write-Host "Summary: $extracted extracted, $missing missing"
Write-Host ""

# Save each file to individual output files
Write-Header "SAVING EXTRACTED FILES"

foreach ($fileInfo in $files_info) {
    $safeName = $fileInfo.SafeName
    $outputPath = Join-Path $OutputFolder "$safeName.txt"
    
    # Create header for the file
    $output = @()
    $output += "FILE: $($fileInfo.Path)"
    $output += "Lines: $($fileInfo.Lines)"
    $output += "Extracted: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    $output += ""
    $output += "=" * 70
    $output += ""
    $output += $fileInfo.Content
    
    $output | Out-File -FilePath $outputPath -Encoding UTF8
    
    Write-Host "  $($colors.green)✓$($colors.reset) $outputPath"
}

Write-Host ""

# Create master summary file
Write-Header "CREATING MASTER SUMMARY"

$summaryPath = Join-Path $OutputFolder "00-EXTRACTION-SUMMARY.txt"
$summary = @()

$summary += "KOLLECT-IT TSX EXTRACTION REPORT"
$summary += "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$summary += ""
$summary += "EXTRACTION RESULTS"
$summary += "=" * 70
$summary += "Total Targeted: $($criticalFiles.Count)"
$summary += "Successfully Extracted: $extracted"
$summary += "Missing: $missing"
$summary += ""

if ($missing -gt 0) {
    $summary += "MISSING FILES (Need to locate or create):"
    $summary += "=" * 70
    foreach ($file in $criticalFiles) {
        if (!(Test-Path $file)) {
            $summary += "  - $file"
        }
    }
    $summary += ""
}

$summary += "EXTRACTED FILES"
$summary += "=" * 70
foreach ($fileInfo in $files_info) {
    $summary += ""
    $summary += "File: $($fileInfo.Path)"
    $summary += "Lines: $($fileInfo.Lines)"
    $summary += "Output: $($fileInfo.SafeName).txt"
    $summary += ""
    
    # Extract first few lines
    $preview = ($fileInfo.Content -split "`n")[0..4] | Where-Object { $_ -and $_.Trim() }
    if ($preview.Count -gt 0) {
        $summary += "Preview:"
        foreach ($line in $preview) {
            $summary += "  $($line.Trim())"
        }
    }
}

$summary += ""
$summary += "NEXT STEPS"
$summary += "=" * 70
$summary += "1. Review files in: $OutputFolder"
$summary += "2. Check for hardcoded colors (look for #, rgb, bg-, text-)"
$summary += "3. Identify which files need color system updates"
$summary += "4. Copy clean versions to deployment-new/02-COMPONENTS/"

$summary | Out-File -FilePath $summaryPath -Encoding UTF8

Write-Host ""
Write-Success "Master summary saved to: $summaryPath"
Write-Host ""

# Display on screen if requested
if ($ScreenOutput) {
    Write-Header "FILE CONTENTS PREVIEW"
    
    foreach ($fileInfo in $files_info) {
        Write-Host "$($colors.bold)$($colors.blue)$($fileInfo.Path)$($colors.reset)"
        Write-Host "$($colors.dim)($($fileInfo.Lines) lines)$($colors.reset)"
        Write-Host ""
        Write-Host $fileInfo.Content
        Write-Host ""
        Write-Host "$($colors.dim)$('-' * 70)$($colors.reset)"
        Write-Host ""
    }
}

Write-Header "EXTRACTION COMPLETE"

Write-Host "Output Location: $OutputFolder"
Write-Host ""
Write-Host "Files saved:"
Get-ChildItem $OutputFolder | ForEach-Object { Write-Host "  • $($_.Name)" }
Write-Host ""

Write-Host "$($colors.green)✓ Ready to review for color system updates$($colors.reset)"
Write-Host ""
