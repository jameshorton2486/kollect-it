<#
.SYNOPSIS
    Fixes color inconsistencies in ProductCard.tsx

.DESCRIPTION
    This script standardizes the color system in ProductCard.tsx by replacing
    Tailwind gray-* classes with the Kollect-It design system ink-* and lux-* classes.

    Changes made:
    - text-gray-300 -> text-lux-gray-dark (for placeholder icons)
    - text-gray-600 -> text-ink-600 (for secondary/muted text)

.NOTES
    Author: Claude (Anthropic)
    Date: December 2024
    For: Kollect-It Style Consistency Project

.EXAMPLE
    .\Fix-ProductCard-Colors.ps1

.EXAMPLE
    .\Fix-ProductCard-Colors.ps1 -WhatIf
    Shows what changes would be made without actually making them
#>

[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter()]
    [string]$ProjectRoot = ".",

    [Parameter()]
    [switch]$NoBackup
)

# Configuration
$TargetFile = "src/components/ProductCard.tsx"
$BackupDir = "backups/style-fixes"

# Color replacement mappings
$Replacements = @(
    @{
        Description = "Placeholder icon color (subtle gray for icons)"
        Find = 'text-gray-300'
        Replace = 'text-lux-gray-dark'
    },
    @{
        Description = "Secondary text color (muted text)"
        Find = 'text-gray-600'
        Replace = 'text-ink-600'
    }
)

# Functions
function Write-ColorOutput {
    param(
        [string]$Text,
        [string]$Color = "White"
    )
    Write-Host $Text -ForegroundColor $Color
}

function Get-RelativePath {
    param([string]$Path)
    return $Path.Replace($ProjectRoot, ".").Replace("\", "/")
}

# Main Script
Write-ColorOutput "`n========================================" "Cyan"
Write-ColorOutput "  ProductCard.tsx Color Fix Script" "Cyan"
Write-ColorOutput "========================================`n" "Cyan"

# Resolve project root
$ProjectRoot = Resolve-Path $ProjectRoot -ErrorAction Stop
Write-ColorOutput "Project Root: $ProjectRoot" "Gray"

# Check if target file exists
$FilePath = Join-Path $ProjectRoot $TargetFile
if (-not (Test-Path $FilePath)) {
    Write-ColorOutput "ERROR: File not found: $TargetFile" "Red"
    Write-ColorOutput "Make sure you're running this from your project root directory." "Yellow"
    exit 1
}

Write-ColorOutput "Target File: $TargetFile" "Gray"
Write-ColorOutput ""

# Read file content
$OriginalContent = Get-Content $FilePath -Raw
$ModifiedContent = $OriginalContent

# Count occurrences before changes
Write-ColorOutput "ANALYSIS" "Yellow"
Write-ColorOutput "--------" "Yellow"

$TotalChanges = 0
foreach ($replacement in $Replacements) {
    $count = ([regex]::Matches($OriginalContent, [regex]::Escape($replacement.Find))).Count
    if ($count -gt 0) {
        Write-ColorOutput "  Found $count instance(s) of '$($replacement.Find)'" "White"
        Write-ColorOutput "    -> Will replace with '$($replacement.Replace)'" "Green"
        Write-ColorOutput "    Purpose: $($replacement.Description)" "Gray"
        $TotalChanges += $count
    }
}

if ($TotalChanges -eq 0) {
    Write-ColorOutput "`nNo changes needed - file already uses correct color classes!" "Green"
    exit 0
}

Write-ColorOutput "`nTotal changes to make: $TotalChanges" "Cyan"

# Create backup unless -NoBackup specified
$BackupFile = $null
if (-not $NoBackup) {
    $BackupPath = Join-Path $ProjectRoot $BackupDir
    if (-not (Test-Path $BackupPath)) {
        New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null
    }

    $Timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
    $BackupFile = Join-Path $BackupPath "ProductCard_$Timestamp.tsx.bak"

    if ($PSCmdlet.ShouldProcess($FilePath, "Create backup")) {
        Copy-Item $FilePath $BackupFile
        Write-ColorOutput "`nBackup created: $(Get-RelativePath $BackupFile)" "Gray"
    }
}

# Apply replacements
Write-ColorOutput "`nAPPLYING CHANGES" "Yellow"
Write-ColorOutput "----------------" "Yellow"

foreach ($replacement in $Replacements) {
    $beforeCount = ([regex]::Matches($ModifiedContent, [regex]::Escape($replacement.Find))).Count

    if ($beforeCount -gt 0) {
        $changeDesc = "$($replacement.Find) -> $($replacement.Replace)"
        if ($PSCmdlet.ShouldProcess($changeDesc, "Replace")) {
            $ModifiedContent = $ModifiedContent -replace [regex]::Escape($replacement.Find), $replacement.Replace
            Write-ColorOutput "  [OK] Replaced '$($replacement.Find)' -> '$($replacement.Replace)' ($beforeCount instances)" "Green"
        }
    }
}

# Write changes to file
if ($PSCmdlet.ShouldProcess($FilePath, "Save changes")) {
    Set-Content -Path $FilePath -Value $ModifiedContent -NoNewline
    Write-ColorOutput "`nFile updated successfully!" "Green"
}

# Show diff summary
Write-ColorOutput "`nSUMMARY" "Yellow"
Write-ColorOutput "-------" "Yellow"
Write-ColorOutput "  File: $TargetFile" "White"
Write-ColorOutput "  Changes: $TotalChanges replacement(s)" "White"

if (-not $NoBackup -and $BackupFile -and -not $WhatIfPreference) {
    Write-ColorOutput "  Backup: $(Get-RelativePath $BackupFile)" "White"
}

Write-ColorOutput "`nCOLOR MAPPING REFERENCE" "Yellow"
Write-ColorOutput "-----------------------" "Yellow"
Write-ColorOutput "  text-gray-300 -> text-lux-gray-dark  (HSL 28 8% 80%  - Hex #cdc9c6)" "Gray"
Write-ColorOutput "  text-gray-600 -> text-ink-600         (HSL 26 12% 48% - Hex #7f7971)" "Gray"

Write-ColorOutput "`nNEXT STEPS" "Cyan"
Write-ColorOutput "----------" "Cyan"
Write-ColorOutput "  1. Run 'npm run dev' to test locally" "White"
Write-ColorOutput "  2. Check product listings for visual consistency" "White"
if ($BackupFile) {
    Write-ColorOutput "  3. If issues, restore from backup in backups/style-fixes/" "White"
}

Write-ColorOutput "`n========================================" "Cyan"
Write-ColorOutput "  Fix complete!" "Green"
Write-ColorOutput "========================================`n" "Cyan"