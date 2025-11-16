# ============================================
# ANALYZE TSX FILES FOR COLOR SYSTEM COMPLIANCE
# Identifies hardcoded colors and deprecated tokens
# ============================================

param(
    [string]$FilesFolder = "extracted-tsx-contents",
    [string]$OutputFile = "COLOR-COMPLIANCE-REPORT.md"
)

$ErrorActionPreference = "Stop"

# Colors for terminal output
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

Write-Header "TSX COLOR SYSTEM COMPLIANCE ANALYZER"

# Patterns to detect
$patterns = @{
    "Hardcoded Hex Colors" = '#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}'
    "Hardcoded RGB Colors" = 'rgb\([^)]+\)|rgba\([^)]+\)'
    "Old Token Names" = '(text-accent-gold|bg-brandAccent|text-neutral-primary|color-accent-gold)'
    "Inline Styles" = 'style=\{.*?(color|background|bg).*?\}'
    "CTA Button Pattern" = '(bg-cta|button.*primary|CTA)'
    "Gold Text Pattern" = '(text-gold|gold|accent)'
}

if (!(Test-Path $FilesFolder)) {
    Write-Host "$($colors.red)Error: Folder not found: $FilesFolder$($colors.reset)"
    exit 1
}

$files = Get-ChildItem -Path $FilesFolder -Filter "*.txt" | Where-Object { $_.Name -ne "00-EXTRACTION-SUMMARY.txt" }

Write-Host "Analyzing $($files.Count) files for compliance issues..."
Write-Host ""

$report = @()
$report += "# Color System Compliance Report"
$report += ""
$report += "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$report += "Files Analyzed: $($files.Count)"
$report += ""
$report += "---"
$report += ""

$totalIssues = 0
$issuesByFile = @{}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Extract actual filename from content
    $header = ($content -split "`n")[0]
    $actualFile = $header -replace "FILE: ", ""
    
    Write-Host "Analyzing: $($file.Name)" -NoNewline
    
    $fileIssues = @()
    $issuesInFile = 0
    
    foreach ($pattern in $patterns.GetEnumerator()) {
        $patternName = $pattern.Key
        $patternValue = $pattern.Value
        
        $matches = [regex]::Matches($content, $patternValue)
        
        if ($matches.Count -gt 0) {
            $issuesInFile += $matches.Count
            
            $fileIssues += @{
                Type = $patternName
                Count = $matches.Count
                Matches = $matches | ForEach-Object { $_.Value } | Select-Object -Unique
            }
        }
    }
    
    if ($issuesInFile -gt 0) {
        Write-Host " $($colors.yellow)$issuesInFile issues$($colors.reset)"
        $totalIssues += $issuesInFile
        $issuesByFile[$actualFile] = $fileIssues
    } else {
        Write-Host " $($colors.green)✓ Clean$($colors.reset)"
    }
}

Write-Host ""
Write-Host "Total Issues Found: $($colors.yellow)$totalIssues$($colors.reset)"
Write-Host ""

# Generate detailed report
$report += "## Summary"
$report += ""
$report += "- **Files Analyzed:** $($files.Count)"
$report += "- **Total Issues:** $totalIssues"
$report += "- **Files with Issues:** $($issuesByFile.Count)"
$report += "- **Compliance Rate:** $(([math]::Round((($files.Count - $issuesByFile.Count) / $files.Count) * 100, 1)))%"
$report += ""
$report += "---"
$report += ""

# Detailed findings
if ($issuesByFile.Count -gt 0) {
    $report += "## Issues by File"
    $report += ""
    
    foreach ($file in $issuesByFile.GetEnumerator() | Sort-Object -Property Value.Count -Descending) {
        $fileName = $file.Key
        $issues = $file.Value
        $totalIssuesInFile = ($issues | Measure-Object -Property Count -Sum).Sum
        
        $report += "### $fileName"
        $report += ""
        $report += "**Total Issues:** $totalIssuesInFile"
        $report += ""
        
        foreach ($issue in $issues | Sort-Object -Property Count -Descending) {
            $report += "#### $($issue.Type)"
            $report += ""
            $report += "Count: **$($issue.Count)**"
            $report += ""
            
            if ($issue.Matches.Count -le 10) {
                $report += "**Occurrences:**"
                foreach ($match in $issue.Matches) {
                    $report += "- \`$match\`"
                }
            } else {
                $report += "**Occurrences (first 10):**"
                foreach ($match in $issue.Matches | Select-Object -First 10) {
                    $report += "- \`$match\`"
                }
                $report += "- ... and $($issue.Matches.Count - 10) more"
            }
            $report += ""
        }
    }
} else {
    $report += "## ✅ All Files Are Compliant!"
    $report += ""
    $report += "No color system compliance issues detected."
    $report += ""
}

# Recommendations
$report += "---"
$report += ""
$report += "## Recommendations"
$report += ""
$report += "### For Files with Issues:"
$report += ""
$report += "1. **Replace Hardcoded Hex Colors** with Tailwind tokens:"
$report += "   - \`#1E1E1E\` → \`text-ink\` / \`bg-ink\`"
$report += "   - \`#B1874C\` → \`text-gold\` / \`bg-gold\`"
$report += "   - \`#1E3A5F\` → \`bg-cta\`"
$report += "   - \`#E0DDD9\` → \`border-neutral\`"
$report += ""
$report += "2. **Update Old Token Names** to new semantic system:"
$report += "   - \`text-accent-gold\` → \`text-gold\`"
$report += "   - \`bg-brandAccent\` → \`bg-gold\`"
$report += "   - \`text-neutral-primary\` → \`text-ink\`"
$report += ""
$report += "3. **Convert Inline Styles** to Tailwind classes:"
$report += "   - \`style={{ color: '#1E1E1E' }}\` → \`className='text-ink'\`"
$report += ""
$report += "### Priority Order:"
$report += ""
$report += "1. **Critical:** Header.tsx, Footer.tsx, Hero.tsx (visible on every page)"
$report += "2. **High:** ProductCard.tsx, LatestArrivalsClient.tsx"
$report += "3. **Medium:** Other component files"
$report += "4. **Low:** UI utility components"
$report += ""

# Color reference
$report += "---"
$report += ""
$report += "## New Color System Reference"
$report += ""
$report += "### Text Colors"
$report += "| Token | Hex | Use Case |"
$report += "|-------|-----|----------|"
$report += "| \`text-ink\` | #1E1E1E | Primary text, headings |"
$report += "| \`text-ink-secondary\` | #5A5A5A | Body text, descriptions |"
$report += "| \`text-ink-muted\` | #8C8C8C | Captions, labels |"
$report += "| \`text-gold\` | #B1874C | Accents, badges, hover states |"
$report += "| \`text-link\` | #5C7BA0 | Links |"
$report += ""
$report += "### Background Colors"
$report += "| Token | Hex | Use Case |"
$report += "|-------|-----|----------|"
$report += "| \`bg-white\` | #FFFFFF | Main canvas, cards |"
$report += "| \`bg-surface-1\` | #F5F3F0 | Alternating sections, footer |"
$report += "| \`bg-surface-2\` | #FAFAF9 | Elevated, hover states |"
$report += "| \`bg-gold\` | #B1874C | Badges, highlights |"
$report += "| \`bg-cta\` | #1E3A5F | Primary buttons |"
$report += ""
$report += "### Border Colors"
$report += "| Token | Hex | Use Case |"
$report += "|-------|-----|----------|"
$report += "| \`border-neutral\` | #E0DDD9 | Card borders, dividers |"
$report += "| \`border-gold\` | #B1874C | Decorative borders |"
$report += ""

# Action items
$report += "---"
$report += ""
$report += "## Action Items"
$report += ""

$criticalFiles = @("Header.tsx", "Hero.tsx", "Footer.tsx", "ProductCard.tsx")
$report += "### Files Requiring Updates:"
$report += ""

foreach ($file in $issuesByFile.Keys) {
    $status = if ($criticalFiles | Where-Object { $file -match $_ }) { "🔴 **CRITICAL**" } else { "🟡 **High**" }
    $report += "- [ ] $status - $file"
}

$report += ""
$report += "---"
$report += ""
$report += "Generated by: TSX Compliance Analyzer"
$report += "Output: $OutputFile"

# Save report
$report | Out-File -FilePath $OutputFile -Encoding UTF8

Write-Header "REPORT GENERATED"

Write-Host "Report saved to: $($colors.cyan)$OutputFile$($colors.reset)"
Write-Host ""
Write-Host "Key Findings:"
Write-Host "  • Files Analyzed: $($files.Count)"
Write-Host "  • Total Issues: $totalIssues"
Write-Host "  • Files with Issues: $($issuesByFile.Count)"
Write-Host ""

if ($issuesByFile.Count -gt 0) {
    Write-Host "Top Files Needing Updates:"
    $issuesByFile.GetEnumerator() | Sort-Object { ($_.Value | Measure-Object -Property Count -Sum).Sum } -Descending | Select-Object -First 5 | ForEach-Object {
        $count = ($_.Value | Measure-Object -Property Count -Sum).Sum
        Write-Host "  $($colors.yellow)$count issues$($colors.reset) - $($_.Key)"
    }
} else {
    Write-Host "$($colors.green)✓ All files are compliant!$($colors.reset)"
}

Write-Host ""
Write-Host "Next Step: Review $OutputFile for detailed recommendations"
Write-Host ""
