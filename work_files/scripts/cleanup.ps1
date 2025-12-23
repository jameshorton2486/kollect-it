# Kollect-It Project Cleanup Script
# This script consolidates backup folders and cleans up the project structure

Write-Host "🧹 Kollect-It Project Cleanup Script" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Step 1: Create archive structure
Write-Host "📁 Creating archive structure..." -ForegroundColor Yellow
if (-not (Test-Path "_archive")) {
    New-Item -ItemType Directory -Path "_archive" | Out-Null
    Write-Host "  ✅ Created _archive directory" -ForegroundColor Green
}

if (-not (Test-Path "_archive\backups")) {
    New-Item -ItemType Directory -Path "_archive\backups" | Out-Null
    Write-Host "  ✅ Created _archive\backups directory" -ForegroundColor Green
}

if (-not (Test-Path "_archive\design-backups")) {
    New-Item -ItemType Directory -Path "_archive\design-backups" | Out-Null
    Write-Host "  ✅ Created _archive\design-backups directory" -ForegroundColor Green
}

# Step 2: Move backup-phase1 folder
Write-Host "`n📦 Moving backup-phase1-20251125-100434..." -ForegroundColor Yellow
if (Test-Path "backup-phase1-20251125-100434") {
    Move-Item -Path "backup-phase1-20251125-100434" -Destination "_archive\backups\" -Force -ErrorAction SilentlyContinue
    if (Test-Path "_archive\backups\backup-phase1-20251125-100434") {
        Write-Host "  ✅ Moved backup-phase1-20251125-100434 to _archive\backups\" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Failed to move backup-phase1 folder" -ForegroundColor Red
    }
} else {
    Write-Host "  ℹ️  backup-phase1-20251125-100434 not found (may already be moved)" -ForegroundColor Gray
}

# Step 3: Move design-backups folder
Write-Host "`n🎨 Moving design-backups..." -ForegroundColor Yellow
if (Test-Path "design-backups") {
    Move-Item -Path "design-backups" -Destination "_archive\design-backups\" -Force -ErrorAction SilentlyContinue
    if (Test-Path "_archive\design-backups\design-backups") {
        Write-Host "  ✅ Moved design-backups to _archive\design-backups\" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Failed to move design-backups folder" -ForegroundColor Red
    }
} else {
    Write-Host "  ℹ️  design-backups not found (may already be moved)" -ForegroundColor Gray
}

# Step 4: Update .gitignore
Write-Host "`n📝 Checking .gitignore..." -ForegroundColor Yellow
$gitignorePath = ".gitignore"
if (Test-Path $gitignorePath) {
    $gitignoreContent = Get-Content $gitignorePath -Raw
    if ($gitignoreContent -notmatch "_archive/") {
        Add-Content -Path $gitignorePath -Value "`n# Archive folders`n_archive/**"
        Write-Host "  ✅ Added _archive/** to .gitignore" -ForegroundColor Green
    } else {
        Write-Host "  ℹ️  .gitignore already contains _archive/**" -ForegroundColor Gray
    }
} else {
    Write-Host "  ⚠️  .gitignore not found" -ForegroundColor Yellow
}

# Step 5: Create/Update .cursorignore
Write-Host "`n📝 Checking .cursorignore..." -ForegroundColor Yellow
$cursorignorePath = ".cursorignore"
if (-not (Test-Path $cursorignorePath)) {
    @"
# Archive folders (exclude from Cursor scans)
_archive/**
archive/**
MD Work Files/**
"@ | Out-File -FilePath $cursorignorePath -Encoding UTF8
    Write-Host "  ✅ Created .cursorignore with archive exclusions" -ForegroundColor Green
} else {
    $cursorignoreContent = Get-Content $cursorignorePath -Raw
    if ($cursorignoreContent -notmatch "_archive/") {
        Add-Content -Path $cursorignorePath -Value "`n# Archive folders`n_archive/**"
        Write-Host "  ✅ Updated .cursorignore" -ForegroundColor Green
    } else {
        Write-Host "  ℹ️  .cursorignore already configured" -ForegroundColor Gray
    }
}

# Step 6: Summary
Write-Host "`n✅ Cleanup Complete!" -ForegroundColor Green
Write-Host "====================================`n" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  - Archive structure created at _archive/" -ForegroundColor White
Write-Host "  - Backup folders moved (if found)" -ForegroundColor White
Write-Host "  - .gitignore and .cursorignore updated" -ForegroundColor White
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "  1. Review _archive/ folder contents" -ForegroundColor White
Write-Host "  2. Run: npm run build (to verify no broken imports)" -ForegroundColor White
Write-Host "  3. Commit changes when ready" -ForegroundColor White
