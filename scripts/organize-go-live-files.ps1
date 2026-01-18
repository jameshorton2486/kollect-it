# ============================================================
# Kollect-It Go-Live File Organizer
# Moves go-live scripts & docs from Downloads to repo
# ============================================================

$Downloads = "C:\Users\james\Downloads"
$RepoRoot  = "C:\Users\james\kollect-it-marketplace-1"

# Destination folders
$Folders = @{
    "scripts" = Join-Path $RepoRoot "scripts"
    "docs"    = Join-Path $RepoRoot "docs"
    ".cursor" = Join-Path $RepoRoot ".cursor"
}

# Ensure destination folders exist
foreach ($folder in $Folders.Values) {
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder | Out-Null
        Write-Host "Created folder: $folder" -ForegroundColor Green
    }
}

# File → destination mapping
$FileMap = @{
    "apply-day1-fixes.ps1"                 = $Folders["scripts"]
    "verify-deployment.ps1"                = $Folders["scripts"]
    "VERCEL-ENV-VARS-CHECKLIST.md"          = $Folders["docs"]
    "FIRST-PRODUCT-TEST-CHECKLIST.md"       = $Folders["docs"]
    "KOLLECT-IT-FINAL-GO-LIVE-STRATEGY.md"  = $Folders["docs"]
    "CURSOR-AI-PROMPTS.md"                  = $Folders[".cursor"]
}

Write-Host "`nMoving Kollect-It go-live files..." -ForegroundColor Cyan

foreach ($file in $FileMap.Keys) {
    $source = Join-Path $Downloads $file
    $target = Join-Path $FileMap[$file] $file

    if (Test-Path $source) {
        # If target exists, compare timestamps
        if (Test-Path $target) {
            $sourceTime = (Get-Item $source).LastWriteTime
            $targetTime = (Get-Item $target).LastWriteTime
            
            if ($sourceTime -gt $targetTime) {
                Move-Item -Path $source -Destination $target -Force
                Write-Host "✓ Updated $file → $($FileMap[$file]) (source was newer)" -ForegroundColor Green
            } else {
                Remove-Item -Path $source -Force
                Write-Host "⊘ Skipped $file (target already exists and is newer)" -ForegroundColor Yellow
            }
        } else {
            Move-Item -Path $source -Destination $target -Force
            Write-Host "✓ Moved $file → $($FileMap[$file])" -ForegroundColor Green
        }
    }
    else {
        Write-Host "⚠ Skipped (not found): $file" -ForegroundColor Yellow
    }
}

Write-Host "`n✔ File organization complete." -ForegroundColor Cyan
Write-Host "Next step: run scripts from repo root using .\scripts\*.ps1`n"
