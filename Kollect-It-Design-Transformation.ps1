#!/usr/bin/env pwsh
# =============================================================================
# Kollect-It Design Transformation - Git Commit & Push Script
# =============================================================================

param(
    [string]$CommitMessage = "feat(design): implement luxury design transformation with lux color palette",
    [switch]$DryRun = $false
)

$ErrorActionPreference = "Stop"

# Colors for output
function Write-Success { param($msg) Write-Host "✓ $msg" -ForegroundColor Green }
function Write-Info { param($msg) Write-Host "→ $msg" -ForegroundColor Cyan }
function Write-Warning { param($msg) Write-Host "⚠ $msg" -ForegroundColor Yellow }
function Write-Error { param($msg) Write-Host "✗ $msg" -ForegroundColor Red }

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  Kollect-It Design Transformation - Commit & Push" -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Error "Not in a git repository. Please run from the project root."
    exit 1
}

# Step 1: Show current status
Write-Info "Checking git status..."
Write-Host ""
git status --short
Write-Host ""

# Step 2: Delete backup files if they exist
Write-Info "Cleaning up backup files..."
$backupFiles = @()

foreach ($file in $backupFiles) {
    if (Test-Path $file) {
        if (-not $DryRun) {
            Remove-Item $file -Force
            Write-Success "Deleted: $file"
        } else {
            Write-Info "[DRY RUN] Would delete: $file"
        }
    }
}

# Step 3: Delete old duplicate component files (if using new ones from src/components/)
Write-Info "Checking for old duplicate components to remove..."
$oldComponents = @(
    "src/components/home/FeaturedCollection.tsx",
    "src/components/home/ProcessOverview.tsx",
    "src/components/home/TrustStrip.tsx"
)

# Only delete if the new versions exist in src/components/
$newComponentsExist = (Test-Path "src/components/FeaturedCollection.tsx") -and 
                      (Test-Path "src/components/ProcessOverview.tsx") -and 
                      (Test-Path "src/components/TrustStrip.tsx")

if ($newComponentsExist) {
    foreach ($file in $oldComponents) {
        if (Test-Path $file) {
            if (-not $DryRun) {
                Remove-Item $file -Force
                Write-Success "Deleted old component: $file"
            } else {
                Write-Info "[DRY RUN] Would delete: $file"
            }
        }
    }
} else {
    Write-Warning "New components not found in src/components/. Skipping deletion of old components."
}

# Step 4: Stage all changes
Write-Host ""
Write-Info "Staging all changes..."
if (-not $DryRun) {
    git add -A
    Write-Success "All changes staged"
} else {
    Write-Info "[DRY RUN] Would stage all changes"
}

# Step 5: Show what will be committed
Write-Host ""
Write-Info "Changes to be committed:"
Write-Host ""
git diff --cached --stat
Write-Host ""

# Step 6: Create commit
$fullCommitMessage = @"
$CommitMessage

Design Transformation Changes:
- Added lux color palette to tailwind.config.ts and globals.css
- Updated Header.tsx with luxury styling and underline animations
- Updated Footer.tsx with dark carbon background and full link sections
- Updated Hero.tsx to use lux design tokens
- Updated button.tsx variants to use lux palette
- Updated TrustStrip.tsx with horizontal ribbon design
- Updated FeaturedCollection.tsx with dark editorial style
- Updated ProcessOverview.tsx with timeline layout
- Fixed page.tsx imports to use correct component paths
- Removed backup files and duplicate components

Design System:
- Core neutrals: lux-black, lux-carbon, lux-charcoal, lux-gray-*, lux-silver, lux-pearl, lux-cream, lux-white
- Warm accents: lux-espresso, lux-taupe, lux-sage
- Gold accents: lux-gold, lux-gold-light
"@

Write-Info "Creating commit..."
if (-not $DryRun) {
    git commit -m "$fullCommitMessage"
    Write-Success "Commit created"
} else {
    Write-Info "[DRY RUN] Would create commit with message:"
    Write-Host $fullCommitMessage -ForegroundColor Gray
}

# Step 7: Push to remote
Write-Host ""
Write-Info "Pushing to remote..."
if (-not $DryRun) {
    git push
    Write-Success "Pushed to remote"
} else {
    Write-Info "[DRY RUN] Would push to remote"
}

# Done
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✓ Design transformation committed and pushed successfully!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

# Show recent commits
Write-Info "Recent commits:"
git log --oneline -5
Write-Host ""