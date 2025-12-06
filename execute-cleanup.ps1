# Comprehensive Kollect-It Cleanup Script
# This script safely archives/deletes files based on cleanup analysis

Write-Host "🧹 Kollect-It Comprehensive Cleanup" -ForegroundColor Cyan
Write-Host "===================================`n" -ForegroundColor Cyan

# Step 1: Ensure archive structure exists
Write-Host "📁 Creating archive structure..." -ForegroundColor Yellow
$archivePaths = @(
    "_archive",
    "_archive\backups",
    "_archive\design-backups",
    "_archive\md-work-files"
)

foreach ($path in $archivePaths) {
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Host "  ✅ Created $path" -ForegroundColor Green
    }
}

# Step 2: Move backup-phase1 folder
Write-Host "`n📦 Moving backup-phase1-20251125-100434..." -ForegroundColor Yellow
if (Test-Path "backup-phase1-20251125-100434") {
    try {
        Move-Item -Path "backup-phase1-20251125-100434" -Destination "_archive\backups\" -Force
        Write-Host "  ✅ Moved to _archive\backups\" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠️  Error: $_" -ForegroundColor Red
    }
} else {
    Write-Host "  ℹ️  Already moved or not found" -ForegroundColor Gray
}

# Step 3: Move design-backups folder
Write-Host "`n🎨 Moving design-backups..." -ForegroundColor Yellow
if (Test-Path "design-backups") {
    try {
        Move-Item -Path "design-backups" -Destination "_archive\design-backups\" -Force
        Write-Host "  ✅ Moved to _archive\design-backups\" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠️  Error: $_" -ForegroundColor Red
    }
} else {
    Write-Host "  ℹ️  Already moved or not found" -ForegroundColor Gray
}

# Step 4: Move MD Work Files folder
Write-Host "`n📝 Moving MD Work Files..." -ForegroundColor Yellow
if (Test-Path "MD Work Files") {
    try {
        Move-Item -Path "MD Work Files" -Destination "_archive\md-work-files\" -Force
        Write-Host "  ✅ Moved to _archive\md-work-files\" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠️  Error: $_" -ForegroundColor Red
    }
} else {
    Write-Host "  ℹ️  Already moved or not found" -ForegroundColor Gray
}

# Step 5: Delete log files (keep .gitkeep)
Write-Host "`n🗑️  Cleaning log files..." -ForegroundColor Yellow
$logFiles = Get-ChildItem -Path "logs" -Filter "*.log" -ErrorAction SilentlyContinue
if ($logFiles) {
    foreach ($log in $logFiles) {
        try {
            Remove-Item $log.FullName -Force
            Write-Host "  ✅ Deleted $($log.Name)" -ForegroundColor Green
        } catch {
            Write-Host "  ⚠️  Error deleting $($log.Name): $_" -ForegroundColor Red
        }
    }
} else {
    Write-Host "  ℹ️  No log files found" -ForegroundColor Gray
}

# Step 6: Delete tree_output.txt
Write-Host "`n🗑️  Deleting generated files..." -ForegroundColor Yellow
$filesToDelete = @("tree_output.txt")
foreach ($file in $filesToDelete) {
    if (Test-Path $file) {
        try {
            Remove-Item $file -Force
            Write-Host "  ✅ Deleted $file" -ForegroundColor Green
        } catch {
            Write-Host "  ⚠️  Error deleting $file : $_" -ForegroundColor Red
        }
    } else {
        Write-Host "  ℹ️  $file not found" -ForegroundColor Gray
    }
}

# Step 7: Update .gitignore
Write-Host "`n📝 Updating .gitignore..." -ForegroundColor Yellow
$gitignorePath = ".gitignore"
if (Test-Path $gitignorePath) {
    $content = Get-Content $gitignorePath -Raw
    $additions = @(
        "`n# Archive folders",
        "_archive/**",
        "archive/**",
        "`n# Log files",
        "*.log",
        "logs/*.log",
        "`n# Generated files",
        "tree_output.txt",
        "project-structure.txt"
    )
    
    $needsUpdate = $false
    foreach ($line in $additions) {
        if ($content -notmatch [regex]::Escape($line.Trim())) {
            $needsUpdate = $true
            break
        }
    }
    
    if ($needsUpdate) {
        Add-Content -Path $gitignorePath -Value "`n# Archive and generated files`n_archive/**`n*.log`nlogs/*.log`ntree_output.txt`nproject-structure.txt"
        Write-Host "  ✅ Updated .gitignore" -ForegroundColor Green
    } else {
        Write-Host "  ℹ️  .gitignore already up to date" -ForegroundColor Gray
    }
}

# Step 8: Create/Update .cursorignore
Write-Host "`n📝 Creating .cursorignore..." -ForegroundColor Yellow
$cursorignorePath = ".cursorignore"
$cursorignoreContent = @"
# Archive folders (exclude from Cursor scans)
_archive/**
archive/**
MD Work Files/**

# Generated files
*.log
tree_output.txt
project-structure.txt

# Backup files
backup-*.patch
*.backup
"@

if (-not (Test-Path $cursorignorePath)) {
    $cursorignoreContent | Out-File -FilePath $cursorignorePath -Encoding UTF8
    Write-Host "  ✅ Created .cursorignore" -ForegroundColor Green
} else {
    Write-Host "  ℹ️  .cursorignore already exists" -ForegroundColor Gray
}

# Summary
Write-Host "`n✅ Cleanup Complete!" -ForegroundColor Green
Write-Host "===================================`n" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  ✅ Archive folders created" -ForegroundColor White
Write-Host "  ✅ Backup folders moved to _archive/" -ForegroundColor White
Write-Host "  ✅ Log files cleaned" -ForegroundColor White
Write-Host "  ✅ Generated files removed" -ForegroundColor White
Write-Host "  ✅ Configuration files updated" -ForegroundColor White
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "  1. Review _archive/ folder" -ForegroundColor White
Write-Host "  2. Run: npm run build (verify no broken imports)" -ForegroundColor White
Write-Host "  3. Commit changes" -ForegroundColor White
