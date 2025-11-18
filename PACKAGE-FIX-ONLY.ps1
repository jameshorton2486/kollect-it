# ============================================================================
# QUICK PACKAGE.JSON FIX SCRIPT
# ============================================================================
# This script only fixes package.json issues without installing dependencies
# Use this for quick fixes or when you want to review changes before installing
#
# USAGE: .\PACKAGE-FIX-ONLY.ps1
# ============================================================================

param(
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host " KOLLECT-IT PACKAGE.JSON QUICK FIX" -ForegroundColor Cyan
Write-Host "============================================================================`n" -ForegroundColor Cyan

# ============================================================================
# BACKUP
# ============================================================================

$backupPath = "package.json.backup.$(Get-Date -Format 'yyyyMMddHHmmss')"

if (-not $DryRun) {
    Write-Host "[1/5] Creating backup..." -ForegroundColor Yellow
    Copy-Item "package.json" $backupPath
    Write-Host "      Backup created: $backupPath" -ForegroundColor Green
} else {
    Write-Host "[1/5] Would create backup: $backupPath" -ForegroundColor Yellow
}

# ============================================================================
# READ AND PARSE
# ============================================================================

Write-Host "[2/5] Reading package.json..." -ForegroundColor Yellow

$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json

# ============================================================================
# FIX 1: UPDATE NEXT.JS VERSION
# ============================================================================

Write-Host "[3/5] Checking Next.js version..." -ForegroundColor Yellow

if ($packageJson.dependencies.next -match "^14\.") {
    $oldVersion = $packageJson.dependencies.next
    $packageJson.dependencies.next = "^15.0.0"
    Write-Host "      Updated Next.js: $oldVersion -> ^15.0.0" -ForegroundColor Green
} elseif ($packageJson.dependencies.next -match "^15\.") {
    Write-Host "      Next.js version already correct (15.x)" -ForegroundColor Green
} else {
    Write-Host "      WARNING: Unexpected Next.js version: $($packageJson.dependencies.next)" -ForegroundColor Red
}

# ============================================================================
# FIX 2: MOVE PRISMA TO DEVDEPENDENCIES
# ============================================================================

Write-Host "[4/5] Checking Prisma placement..." -ForegroundColor Yellow

$prismaInDeps = $packageJson.dependencies.PSObject.Properties.Name -contains "prisma"
$prismaInDevDeps = $packageJson.devDependencies.PSObject.Properties.Name -contains "prisma"

if ($prismaInDeps) {
    $prismaVersion = $packageJson.dependencies.prisma
    
    # Add to devDependencies if not already there
    if (-not $prismaInDevDeps) {
        $packageJson.devDependencies | Add-Member -MemberType NoteProperty -Name "prisma" -Value $prismaVersion -Force
        Write-Host "      Added Prisma to devDependencies: $prismaVersion" -ForegroundColor Green
    }
    
    # Remove from dependencies
    $packageJson.dependencies.PSObject.Properties.Remove("prisma")
    Write-Host "      Removed Prisma from dependencies" -ForegroundColor Green
} else {
    Write-Host "      Prisma already in correct location" -ForegroundColor Green
}

# ============================================================================
# FIX 3: REMOVE PLATFORM-SPECIFIC SCRIPTS
# ============================================================================

Write-Host "[5/5] Checking platform-specific scripts..." -ForegroundColor Yellow

$scriptsToRemove = @("logs:view", "logs:errors", "logs:watch")
$removed = 0

foreach ($script in $scriptsToRemove) {
    if ($packageJson.scripts.PSObject.Properties.Name -contains $script) {
        $packageJson.scripts.PSObject.Properties.Remove($script)
        $removed++
    }
}

if ($removed -gt 0) {
    Write-Host "      Removed $removed platform-specific script(s)" -ForegroundColor Green
} else {
    Write-Host "      No platform-specific scripts found" -ForegroundColor Green
}

# ============================================================================
# SAVE
# ============================================================================

Write-Host "`nSaving changes..." -ForegroundColor Yellow

if (-not $DryRun) {
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json" -Encoding UTF8
    Write-Host "package.json updated successfully!" -ForegroundColor Green
    Write-Host "`nChanges saved. Original backed up to:" -ForegroundColor Green
    Write-Host "  $backupPath" -ForegroundColor Cyan
} else {
    Write-Host "DRY RUN - No changes were made" -ForegroundColor Yellow
    Write-Host "`nChanges that would be made:" -ForegroundColor Yellow
    $packageJson | ConvertTo-Json -Depth 10 | Write-Host
}

# ============================================================================
# NEXT STEPS
# ============================================================================

Write-Host "`n============================================================================" -ForegroundColor Cyan
Write-Host " NEXT STEPS" -ForegroundColor Cyan
Write-Host "============================================================================`n" -ForegroundColor Cyan

if (-not $DryRun) {
    Write-Host "1. Review the changes in package.json" -ForegroundColor White
    Write-Host "2. Run: npm install --legacy-peer-deps" -ForegroundColor White
    Write-Host "3. Run: npm run db:generate" -ForegroundColor White
    Write-Host "4. Run: npm run dev" -ForegroundColor White
    Write-Host "`nIf something goes wrong, restore with:" -ForegroundColor Yellow
    Write-Host "  Copy-Item $backupPath package.json -Force" -ForegroundColor Cyan
} else {
    Write-Host "Run without --DryRun to apply changes" -ForegroundColor White
}

Write-Host ""
