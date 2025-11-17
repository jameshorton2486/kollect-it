# ============================================
# KOLLECT-IT DEPLOYMENT PREP MASTER SCRIPT
# Complete analysis & action plan generation
# ============================================

param(
    [switch]$SkipExtraction = $false,
    [switch]$SkipAnalysis = $false,
    [switch]$OpenReports = $true
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
    Write-Host "$($colors.bold)$($colors.cyan)$('=' * 70)$($colors.reset)"
    Write-Host "$($colors.bold)$($colors.cyan)  $Text$($colors.reset)"
    Write-Host "$($colors.bold)$($colors.cyan)$('=' * 70)$($colors.reset)"
    Write-Host ""
}

function Write-Section {
    param([string]$Text)
    Write-Host "$($colors.bold)$($colors.blue)▶ $Text$($colors.reset)"
    Write-Host ""
}

# Start
Write-Host ""
Write-Host "$($colors.bold)$($colors.cyan)  KOLLECT-IT DEPLOYMENT PREPARATION$($colors.reset)"
Write-Host "$($colors.bold)$($colors.cyan)  Complete Analysis & Action Plan$($colors.reset)"
Write-Host "$($colors.dim)  $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')$($colors.reset)"
Write-Host ""

Write-Section "Step 1: Scanning Project Structure"

# Step 1: Scan for TSX files
if (Test-Path "01-SCAN-TSX-FILES.ps1") {
    Write-Host "Running TSX file scanner..."
    & .\01-SCAN-TSX-FILES.ps1
} else {
    Write-Host "$($colors.yellow)⚠ Scanner script not found$($colors.reset)"
}

Write-Section "Step 2: Extracting File Contents"

if (!$SkipExtraction -and (Test-Path "02-EXTRACT-TSX-CONTENTS.ps1")) {
    Write-Host "Extracting .tsx file contents..."
    & .\02-EXTRACT-TSX-CONTENTS.ps1 -ScreenOutput $false
} else {
    Write-Host "$($colors.dim)Skipping extraction (already done or requested)$($colors.reset)"
}

Write-Section "Step 3: Analyzing Color Compliance"

if (!$SkipAnalysis -and (Test-Path "03-ANALYZE-COLOR-COMPLIANCE.ps1")) {
    Write-Host "Analyzing files for color system compliance..."
    & .\03-ANALYZE-COLOR-COMPLIANCE.ps1
} else {
    Write-Host "$($colors.dim)Skipping analysis (already done or requested)$($colors.reset)"
}

Write-Header "DEPLOYMENT PREPARATION COMPLETE"

Write-Host "📋 Generated Reports:"
Write-Host ""
Write-Host "  1. $($colors.cyan)tsx-file-report.txt$($colors.reset)"
Write-Host "     └─ Complete file listing by category"
Write-Host ""
Write-Host "  2. $($colors.cyan)extracted-tsx-contents/$($colors.reset)"
Write-Host "     └─ Individual .tsx files with contents"
Write-Host ""
Write-Host "  3. $($colors.cyan)COLOR-COMPLIANCE-REPORT.md$($colors.reset)"
Write-Host "     └─ Issues & recommendations"
Write-Host ""

Write-Host "📝 Quick Summary:"
Write-Host ""

if (Test-Path "COLOR-COMPLIANCE-REPORT.md") {
    $report = Get-Content "COLOR-COMPLIANCE-REPORT.md" -Raw
    if ($report -match "Total Issues: (\d+)") {
        $issues = $matches[1]
        Write-Host "  • Color System Issues: $($colors.yellow)$issues$($colors.reset)"
    }
}

Write-Host ""

Write-Header "NEXT STEPS"

Write-Host "1️⃣  $($colors.bold)Review Reports$($colors.reset)"
Write-Host "   □ Open COLOR-COMPLIANCE-REPORT.md"
Write-Host "   □ Check tsx-file-report.txt for file locations"
Write-Host "   □ Review extracted-tsx-contents/ folder"
Write-Host ""

Write-Host "2️⃣  $($colors.bold)Update Critical Files$($colors.reset)"
Write-Host "   □ Header.tsx (light background, gold logo)"
Write-Host "   □ Hero.tsx (dark background, gold text)"
Write-Host "   □ Footer.tsx (cream background)"
Write-Host "   □ ProductCard.tsx (gold accents)"
Write-Host ""

Write-Host "3️⃣  $($colors.bold)Replace Color Tokens$($colors.reset)"
Write-Host "   □ Update all \`#1E1E1E\` → \`text-ink\`"
Write-Host "   □ Update all \`#B1874C\` → \`text-gold\`/\`bg-gold\`"
Write-Host "   □ Replace old token names"
Write-Host ""

Write-Host "4️⃣  $($colors.bold)Test Locally$($colors.reset)"
Write-Host "   □ Run: $($colors.cyan)npm run dev$($colors.reset)"
Write-Host "   □ Check colors render correctly"
Write-Host "   □ Test on mobile"
Write-Host ""

Write-Host "5️⃣  $($colors.bold)Deploy$($colors.reset)"
Write-Host "   □ Commit changes: $($colors.cyan)git add . && git commit -m 'Apply color system refactor'$($colors.reset)"
Write-Host "   □ Push: $($colors.cyan)git push$($colors.reset)"
Write-Host "   □ Run: $($colors.cyan)DEPLOY-COMPLETE-REFACTOR.ps1$($colors.reset)"
Write-Host ""

Write-Host "---"
Write-Host ""

Write-Host "📌 Key Files for Color System:"
Write-Host ""
Write-Host "  Define tokens: $($colors.cyan)src/app/globals.css$($colors.reset)"
Write-Host "  Configure Tailwind: $($colors.cyan)tailwind.config.ts$($colors.reset)"
Write-Host ""

Write-Host "📚 Color System Reference:"
Write-Host ""
Write-Host "  TOKEN_QUICK_REFERENCE.md - Comprehensive guide"
Write-Host ""

Write-Host "$($colors.green)✓ Ready to proceed with deployment!$($colors.reset)"
Write-Host ""
