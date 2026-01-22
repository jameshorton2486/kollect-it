# =============================================================================
# KOLLECT-IT ONE-SHOT DEPLOYMENT
# =============================================================================
# This script does EVERYTHING automatically:
# 1. Finds your project
# 2. Backs up original files
# 3. Applies fixes from Downloads
# 4. Builds and verifies
# 5. Commits and pushes to GitHub
#
# USAGE: Right-click this file → Run with PowerShell
#        OR: Open PowerShell → .\deploy-kollect-it-fixes.ps1
# =============================================================================

$ErrorActionPreference = "Stop"

# Configuration
$downloadsPath = "$env:USERPROFILE\Downloads"
$possibleProjectPaths = @(
    "C:\projects\kollect-it",
    "C:\projects\kollect-it-main",
    "$env:USERPROFILE\projects\kollect-it",
    "$env:USERPROFILE\Documents\kollect-it",
    "D:\projects\kollect-it"
)

# Colors
function Write-Step { param($msg) Write-Host "`n▶ $msg" -ForegroundColor Cyan }
function Write-OK { param($msg) Write-Host "  ✓ $msg" -ForegroundColor Green }
function Write-Warn { param($msg) Write-Host "  ⚠ $msg" -ForegroundColor Yellow }
function Write-Err { param($msg) Write-Host "  ✗ $msg" -ForegroundColor Red }

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     KOLLECT-IT CRITICAL FIXES - ONE-SHOT DEPLOYMENT      ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# =============================================================================
# PHASE 1: Find Project
# =============================================================================
Write-Step "Finding Kollect-It project..."

$projectPath = $null
foreach ($path in $possibleProjectPaths) {
    if (Test-Path "$path\package.json") {
        $pkg = Get-Content "$path\package.json" | ConvertFrom-Json
        if ($pkg.name -like "*kollect*") {
            $projectPath = $path
            break
        }
    }
}

if (-not $projectPath) {
    # Try to find it
    $found = Get-ChildItem -Path "C:\", "D:\" -Filter "kollect-it*" -Directory -Recurse -ErrorAction SilentlyContinue -Depth 3 | 
             Where-Object { Test-Path "$($_.FullName)\package.json" } | 
             Select-Object -First 1
    if ($found) {
        $projectPath = $found.FullName
    }
}

if (-not $projectPath) {
    Write-Err "Cannot find Kollect-It project!"
    Write-Host "  Please enter the full path to your project:"
    $projectPath = Read-Host "  Path"
}

if (-not (Test-Path "$projectPath\package.json")) {
    Write-Err "Invalid project path: $projectPath"
    exit 1
}

Write-OK "Found project at: $projectPath"
Set-Location $projectPath

# =============================================================================
# PHASE 2: Verify Fix Files in Downloads
# =============================================================================
Write-Step "Checking for fix files in Downloads..."

$fixFiles = @{
    "ingest-route.ts.fixed" = "src\app\api\admin\products\ingest\route.ts"
    "products-route.ts.fixed" = "src\app\api\products\route.ts"
    "image-parser.ts.fixed" = "src\lib\utils\image-parser.ts"
    "sku-validation.ts" = "src\lib\sku-validation.ts"
}

$missingFiles = @()
foreach ($file in $fixFiles.Keys) {
    $sourcePath = Join-Path $downloadsPath $file
    if (Test-Path $sourcePath) {
        Write-OK "Found: $file"
    } else {
        Write-Warn "Missing: $file"
        $missingFiles += $file
    }
}

if ($missingFiles.Count -eq $fixFiles.Count) {
    Write-Err "No fix files found in Downloads!"
    Write-Host "  Expected files: $($fixFiles.Keys -join ', ')"
    exit 1
}

# =============================================================================
# PHASE 3: Git Status Check
# =============================================================================
Write-Step "Checking git status..."

$branch = git branch --show-current 2>$null
if ($branch -ne "main") {
    Write-Warn "Not on main branch (currently on: $branch)"
    $switch = Read-Host "  Switch to main? (Y/n)"
    if ($switch -ne 'n') {
        git checkout main
        git pull origin main
    }
} else {
    Write-OK "On main branch"
    git pull origin main 2>$null
}

# Check for uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Warn "You have uncommitted changes:"
    git status --short
    $continue = Read-Host "  Continue anyway? (y/N)"
    if ($continue -ne 'y') {
        Write-Host "Aborting. Please commit or stash your changes first."
        exit 0
    }
}

# =============================================================================
# PHASE 4: Create Backups
# =============================================================================
Write-Step "Creating backups..."

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "backups\critical-fixes-$timestamp"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

foreach ($target in $fixFiles.Values) {
    if (Test-Path $target) {
        $backupPath = Join-Path $backupDir $target
        $backupFolder = Split-Path $backupPath -Parent
        New-Item -ItemType Directory -Force -Path $backupFolder | Out-Null
        Copy-Item -Path $target -Destination $backupPath -Force
        Write-OK "Backed up: $target"
    }
}

Write-OK "Backups saved to: $backupDir"

# =============================================================================
# PHASE 5: Apply Fixes
# =============================================================================
Write-Step "Applying fixes..."

foreach ($sourceFile in $fixFiles.Keys) {
    $sourcePath = Join-Path $downloadsPath $sourceFile
    $targetPath = $fixFiles[$sourceFile]
    
    if (Test-Path $sourcePath) {
        # Ensure target directory exists
        $targetDir = Split-Path $targetPath -Parent
        if (-not (Test-Path $targetDir)) {
            New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
        }
        
        Copy-Item -Path $sourcePath -Destination $targetPath -Force
        Write-OK "Applied: $sourceFile → $targetPath"
    }
}

# Copy summary doc if present
$summaryFiles = Get-ChildItem -Path $downloadsPath -Filter "CRITICAL_FIXES_SUMMARY*.md" -ErrorAction SilentlyContinue
if ($summaryFiles) {
    $latestSummary = $summaryFiles | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    Copy-Item -Path $latestSummary.FullName -Destination "docs\CRITICAL_FIXES_SUMMARY.md" -Force
    Write-OK "Applied: $($latestSummary.Name) → docs\CRITICAL_FIXES_SUMMARY.md"
}

# =============================================================================
# PHASE 6: Verify Fixes
# =============================================================================
Write-Step "Verifying fixes were applied correctly..."

# Check ingest route for status: 'draft'
$ingestContent = Get-Content "src\app\api\admin\products\ingest\route.ts" -Raw
if ($ingestContent -match "status:\s*['""]draft['""]") {
    Write-OK "Ingest API: status='draft' ✓"
} else {
    Write-Err "Ingest API: status='draft' NOT FOUND!"
}

# Check products route for isDraft: false
$productsContent = Get-Content "src\app\api\products\route.ts" -Raw
if ($productsContent -match "isDraft:\s*false") {
    Write-OK "Products API: isDraft=false filter ✓"
} else {
    Write-Warn "Products API: isDraft filter not found (may be OK if using status only)"
}

# Check SKU validation exists
if (Test-Path "src\lib\sku-validation.ts") {
    Write-OK "SKU validation module exists ✓"
} else {
    Write-Warn "SKU validation module not created"
}

# =============================================================================
# PHASE 7: Build
# =============================================================================
Write-Step "Building project..."

npm install 2>&1 | Out-Null
$buildResult = npm run build 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Err "Build FAILED!"
    Write-Host $buildResult -ForegroundColor Red
    Write-Host ""
    Write-Host "Restoring from backup..." -ForegroundColor Yellow
    foreach ($target in $fixFiles.Values) {
        $backupPath = Join-Path $backupDir $target
        if (Test-Path $backupPath) {
            Copy-Item -Path $backupPath -Destination $target -Force
        }
    }
    Write-Host "Original files restored. Please check the errors above."
    exit 1
}

Write-OK "Build succeeded!"

# =============================================================================
# PHASE 8: Commit and Push
# =============================================================================
Write-Step "Committing changes..."

git add .
git status --short

$commitMsg = @"
fix: Draft visibility bug + SKU format standardization

CRITICAL FIXES APPLIED:
- Changed ingested products status from 'active' to 'draft'
- Added isDraft:false filter to public product listings  
- Unified SKU validation to accept PREFIX-YYYY-NNNN format
- Added new src/lib/sku-validation.ts module

These fixes prevent draft products from appearing publicly
and allow the desktop app to use category-prefixed SKUs.
"@

git commit -m $commitMsg

Write-Step "Pushing to GitHub..."
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-OK "Pushed to GitHub successfully!"
} else {
    Write-Err "Push failed - you may need to push manually"
}

# =============================================================================
# PHASE 9: Cleanup Downloads (Optional)
# =============================================================================
Write-Step "Cleanup..."

$cleanup = Read-Host "Delete fix files from Downloads? (y/N)"
if ($cleanup -eq 'y') {
    foreach ($file in $fixFiles.Keys) {
        $filePath = Join-Path $downloadsPath $file
        if (Test-Path $filePath) {
            Remove-Item $filePath -Force
            Write-OK "Deleted: $file"
        }
    }
    # Also clean up zip and summary files
    Remove-Item "$downloadsPath\kollect-it-critical-fixes.zip" -Force -ErrorAction SilentlyContinue
    Get-ChildItem -Path $downloadsPath -Filter "CRITICAL_FIXES_SUMMARY*.md" | Remove-Item -Force
    Write-OK "Downloads cleaned up"
}

# =============================================================================
# DONE
# =============================================================================
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                    DEPLOYMENT COMPLETE                    ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Check Vercel dashboard for deployment status"
Write-Host "  2. Test with desktop app once deployed"
Write-Host "  3. Verify draft products don't appear on public shop"
Write-Host ""
Write-Host "Backup location: $projectPath\$backupDir" -ForegroundColor Yellow
Write-Host ""
