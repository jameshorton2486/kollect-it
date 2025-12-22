<# 
.SYNOPSIS
    Comprehensive Footer.tsx fixes - colors, font sizes, and text removal
    
.DESCRIPTION
    This script updates Footer.tsx to:
    1. Make all navigation links white (Shop, Company, Policies columns)
    2. Make contact info and tagline white
    3. Delete "Updates when new pieces arrive." text
    4. Delete "We work with collectors and estates." text
    5. Make copyright text white
    6. Increase font size of Logo and section headers (Shop, Company, Policies)
    
.EXAMPLE
    .\Fix-Footer-Colors.ps1
    
.EXAMPLE
    .\Fix-Footer-Colors.ps1 -WhatIf
#>

[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter()]
    [string]$ProjectRoot = ".",
    
    [Parameter()]
    [switch]$NoBackup
)

# Configuration
$TargetFile = "src/components/Footer.tsx"
$BackupDir = "backups/style-fixes"

# Main Script
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Footer.tsx Comprehensive Fix Script" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Resolve project root
$ProjectRoot = Resolve-Path $ProjectRoot -ErrorAction Stop
Write-Host "Project Root: $ProjectRoot" -ForegroundColor Gray

# Check if target file exists
$FilePath = Join-Path $ProjectRoot $TargetFile
if (-not (Test-Path $FilePath)) {
    Write-Host "ERROR: File not found: $TargetFile" -ForegroundColor Red
    Write-Host "Make sure you're running this from your project root directory." -ForegroundColor Yellow
    exit 1
}

Write-Host "Target File: $TargetFile" -ForegroundColor Gray
Write-Host ""

# Read file content
$OriginalContent = Get-Content $FilePath -Raw
$ModifiedContent = $OriginalContent

# Create backup
$BackupFile = $null
if (-not $NoBackup) {
    $BackupPath = Join-Path $ProjectRoot $BackupDir
    if (-not (Test-Path $BackupPath)) {
        New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null
    }
    
    $Timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
    $BackupFile = Join-Path $BackupPath "Footer_$Timestamp.tsx.bak"
    
    if ($PSCmdlet.ShouldProcess($FilePath, "Create backup")) {
        Copy-Item $FilePath $BackupFile
        Write-Host "Backup created: backups/style-fixes/Footer_$Timestamp.tsx.bak`n" -ForegroundColor Gray
    }
}

Write-Host "APPLYING CHANGES" -ForegroundColor Yellow
Write-Host "----------------`n" -ForegroundColor Yellow

$ChangeCount = 0

# ===========================================
# FIX 1: Increase Logo font size (text-xl -> text-2xl)
# ===========================================
Write-Host "  [1] LOGO SIZE" -ForegroundColor Cyan
$pattern1 = 'font-serif text-xl tracking-tight'
$replace1 = 'font-serif text-2xl tracking-tight'
if ($ModifiedContent -match [regex]::Escape($pattern1)) {
    if ($PSCmdlet.ShouldProcess("Logo", "Increase size to text-2xl")) {
        $ModifiedContent = $ModifiedContent -replace [regex]::Escape($pattern1), $replace1
        Write-Host "      Logo: text-xl -> text-2xl" -ForegroundColor Green
        $ChangeCount++
    }
} else {
    Write-Host "      Logo: Already updated or pattern not found" -ForegroundColor Gray
}

# ===========================================
# FIX 2: Increase Section Headers font size
# (Shop, Company, Policies) - text-sm -> text-base
# ===========================================
Write-Host "  [2] SECTION HEADERS (Shop, Company, Policies)" -ForegroundColor Cyan
$pattern2 = 'text-sm font-semibold tracking-\[0\.15em\] uppercase text-lux-gold mb-3'
$replace2 = 'text-base font-semibold tracking-[0.12em] uppercase text-lux-gold mb-4'
if ($ModifiedContent -match $pattern2) {
    if ($PSCmdlet.ShouldProcess("Section headers", "Increase size to text-base")) {
        $ModifiedContent = $ModifiedContent -replace $pattern2, $replace2
        Write-Host "      Headers: text-sm -> text-base, mb-3 -> mb-4" -ForegroundColor Green
        $ChangeCount++
    }
} else {
    Write-Host "      Headers: Already updated or pattern not found" -ForegroundColor Gray
}

# ===========================================
# FIX 3: Make tagline white
# ===========================================
Write-Host "  [3] TAGLINE (Curated antiques...)" -ForegroundColor Cyan
$pattern3 = 'text-sm leading-relaxed text-gray-300'
$replace3 = 'text-sm leading-relaxed text-white'
if ($ModifiedContent -match [regex]::Escape($pattern3)) {
    if ($PSCmdlet.ShouldProcess("Tagline", "Change to white")) {
        $ModifiedContent = $ModifiedContent -replace [regex]::Escape($pattern3), $replace3
        Write-Host "      Tagline: text-gray-300 -> text-white" -ForegroundColor Green
        $ChangeCount++
    }
} else {
    Write-Host "      Tagline: Already updated or pattern not found" -ForegroundColor Gray
}

# ===========================================
# FIX 4: Make contact info section white
# ===========================================
Write-Host "  [4] CONTACT INFO (San Antonio, phone, email)" -ForegroundColor Cyan
$pattern4 = 'space-y-1 text-sm text-gray-300'
$replace4 = 'space-y-1 text-sm text-white'
if ($ModifiedContent -match [regex]::Escape($pattern4)) {
    if ($PSCmdlet.ShouldProcess("Contact info", "Change to white")) {
        $ModifiedContent = $ModifiedContent -replace [regex]::Escape($pattern4), $replace4
        Write-Host "      Contact: text-gray-300 -> text-white" -ForegroundColor Green
        $ChangeCount++
    }
} else {
    Write-Host "      Contact: Already updated or pattern not found" -ForegroundColor Gray
}

# ===========================================
# FIX 5: Make ALL navigation links white with gold hover
# ===========================================
Write-Host "  [5] NAVIGATION LINKS (all columns)" -ForegroundColor Cyan
$pattern5 = 'text-sm text-gray-300 hover:text-white transition-colors'
$replace5 = 'text-sm text-white hover:text-lux-gold transition-colors'
if ($ModifiedContent -match [regex]::Escape($pattern5)) {
    if ($PSCmdlet.ShouldProcess("Nav links", "Change to white with gold hover")) {
        $ModifiedContent = $ModifiedContent -replace [regex]::Escape($pattern5), $replace5
        Write-Host "      Nav links: text-gray-300 -> text-white, hover -> gold" -ForegroundColor Green
        $ChangeCount++
    }
} else {
    Write-Host "      Nav links: Already updated or pattern not found" -ForegroundColor Gray
}

# ===========================================
# FIX 6: Delete "Updates when new pieces arrive." line
# ===========================================
Write-Host "  [6] DELETE NEWSLETTER SUBTITLE" -ForegroundColor Cyan
# Try multiple possible patterns (in case previous partial fixes were applied)
$newsletterPatterns = @(
    '<p className="text-sm text-gray-600 mt-0.5">Updates when new pieces arrive.</p>',
    '<p className="text-sm text-white/60 mt-0.5">Updates when new pieces arrive.</p>',
    '<p className="text-sm text-white/70 mt-0.5">Updates when new pieces arrive.</p>'
)
$foundNewsletter = $false
foreach ($pattern in $newsletterPatterns) {
    if ($ModifiedContent -match [regex]::Escape($pattern)) {
        if ($PSCmdlet.ShouldProcess("Newsletter subtitle", "Delete line")) {
            $ModifiedContent = $ModifiedContent -replace [regex]::Escape($pattern), ''
            Write-Host "      Deleted: Updates when new pieces arrive." -ForegroundColor Green
            $ChangeCount++
            $foundNewsletter = $true
            break
        }
    }
}
if (-not $foundNewsletter) {
    Write-Host "      Newsletter subtitle: Already removed or not found" -ForegroundColor Gray
}

# ===========================================
# FIX 7: Delete "We work with collectors and estates." line
# ===========================================
Write-Host "  [7] DELETE CONSIGN SUBTITLE" -ForegroundColor Cyan
# Try multiple possible patterns
$consignPatterns = @(
    '<p className="text-sm text-gray-600 mt-0.5">We work with collectors and estates.</p>',
    '<p className="text-sm text-white/60 mt-0.5">We work with collectors and estates.</p>',
    '<p className="text-sm text-white/70 mt-0.5">We work with collectors and estates.</p>'
)
$foundConsign = $false
foreach ($pattern in $consignPatterns) {
    if ($ModifiedContent -match [regex]::Escape($pattern)) {
        if ($PSCmdlet.ShouldProcess("Consign subtitle", "Delete line")) {
            $ModifiedContent = $ModifiedContent -replace [regex]::Escape($pattern), ''
            Write-Host "      Deleted: We work with collectors and estates." -ForegroundColor Green
            $ChangeCount++
            $foundConsign = $true
            break
        }
    }
}
if (-not $foundConsign) {
    Write-Host "      Consign subtitle: Already removed or not found" -ForegroundColor Gray
}

# ===========================================
# FIX 8: Fix email placeholder contrast
# ===========================================
Write-Host "  [8] EMAIL INPUT PLACEHOLDER" -ForegroundColor Cyan
$pattern8 = 'placeholder:text-gray-700'
$replace8 = 'placeholder:text-white/40'
if ($ModifiedContent -match [regex]::Escape($pattern8)) {
    if ($PSCmdlet.ShouldProcess("Email placeholder", "Change to white/40")) {
        $ModifiedContent = $ModifiedContent -replace [regex]::Escape($pattern8), $replace8
        Write-Host "      Placeholder: text-gray-700 -> text-white/40" -ForegroundColor Green
        $ChangeCount++
    }
} else {
    Write-Host "      Placeholder: Already updated or pattern not found" -ForegroundColor Gray
}

# ===========================================
# FIX 9: Make copyright bar white
# ===========================================
Write-Host "  [9] COPYRIGHT BAR" -ForegroundColor Cyan
$pattern9 = 'gap-2 text-sm text-gray-600'
$replace9 = 'gap-2 text-sm text-white/70'
if ($ModifiedContent -match [regex]::Escape($pattern9)) {
    if ($PSCmdlet.ShouldProcess("Copyright bar", "Change to white/70")) {
        $ModifiedContent = $ModifiedContent -replace [regex]::Escape($pattern9), $replace9
        Write-Host "      Copyright: text-gray-600 -> text-white/70" -ForegroundColor Green
        $ChangeCount++
    }
} else {
    Write-Host "      Copyright: Already updated or pattern not found" -ForegroundColor Gray
}

# ===========================================
# FIX 10: Clean up any extra whitespace from deletions
# ===========================================
$ModifiedContent = $ModifiedContent -replace "(\r?\n)\s*(\r?\n)\s*(\r?\n)", "`$1`$2"

# Write changes to file
if ($PSCmdlet.ShouldProcess($FilePath, "Save changes")) {
    Set-Content -Path $FilePath -Value $ModifiedContent -NoNewline
    Write-Host "`nFile updated successfully!" -ForegroundColor Green
}

# Summary
Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "  SUMMARY" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "  MADE WHITE:" -ForegroundColor Cyan
Write-Host "    - Tagline (Curated antiques...)" -ForegroundColor White
Write-Host "    - Contact info (San Antonio, phone, email)" -ForegroundColor White
Write-Host "    - All nav links (About, FAQ, Shipping, Privacy, etc.)" -ForegroundColor White
Write-Host "    - Copyright (c) 2025 Kollect-It..." -ForegroundColor White
Write-Host ""
Write-Host "  INCREASED SIZE:" -ForegroundColor Cyan
Write-Host "    - Logo: text-xl -> text-2xl" -ForegroundColor White
Write-Host "    - Section headers (Shop, Company, Policies): text-sm -> text-base" -ForegroundColor White
Write-Host ""
Write-Host "  DELETED:" -ForegroundColor Cyan
Write-Host "    - 'Updates when new pieces arrive.'" -ForegroundColor White
Write-Host "    - 'We work with collectors and estates.'" -ForegroundColor White
Write-Host ""
Write-Host "  FIXED CONTRAST:" -ForegroundColor Cyan
Write-Host "    - Email placeholder -> text-white/40" -ForegroundColor White

Write-Host "`nNEXT STEPS" -ForegroundColor Cyan
Write-Host "----------" -ForegroundColor Cyan
Write-Host "  1. Run 'npm run dev' to test locally" -ForegroundColor White
Write-Host "  2. Check footer appearance" -ForegroundColor White
Write-Host "  3. If issues, restore from: backups/style-fixes/" -ForegroundColor White

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Fix complete!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan