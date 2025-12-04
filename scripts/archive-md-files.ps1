# Archive Old Markdown Documentation Files
# Moves outdated documentation to archive folder

$archivePath = Join-Path $PSScriptRoot "..\archive"
if (-not (Test-Path $archivePath)) {
    New-Item -ItemType Directory -Path $archivePath -Force | Out-Null
}

$rootPath = Join-Path $PSScriptRoot ".."

# Files to archive from root
$rootFiles = @(
    "PRE_DEPLOYMENT_REPORT.md",
    "PHASES_9-14_COMPLETE_IMPLEMENTATION.md",
    "PHASES_9-14_FINAL_IMPLEMENTATION.md",
    "COMPLETE_IMPLEMENTATION_SUMMARY.md",
    "PHASE_6-8_IMPLEMENTATION_SUMMARY.md",
    "PHASE_1-5_IMPLEMENTATION_SUMMARY.md",
    "AI_AGENT_TASKS.md",
    "KOLLECT-IT_REWRITE_PLAN.md"
)

# Files to archive from subdirectories (source, destination)
$subFiles = @(
    @("fixes\kollect-it-fixes\IMPLEMENTATION_COMPLETE.md", "IMPLEMENTATION_COMPLETE.md"),
    @("fixes\kollect-it-fixes\REVIEW_REPORT.md", "REVIEW_REPORT.md"),
    @("fixes\kollect-it-fixes\README (1).md", "README_fixes.md"),
    @("fixes\kollect-it-fixes\PRE-LAUNCH-REVIEW (1).md", "PRE-LAUNCH-REVIEW.md"),
    @("scripts\test-features.md", "test-features.md"),
    @("MD Work Files\DEPLOYMENT-INSTRUCTIONS.md", "DEPLOYMENT-INSTRUCTIONS.md"),
    @("design\ai-agent-prompt-build-fixes.md", "ai-agent-prompt-build-fixes.md"),
    @("logs\error-messages.md", "error-messages.md")
)

Write-Host "Archiving markdown files..." -ForegroundColor Cyan

# Archive root files
$archived = 0
foreach ($file in $rootFiles) {
    $sourcePath = Join-Path $rootPath $file
    if (Test-Path $sourcePath) {
        $destPath = Join-Path $archivePath $file
        try {
            Move-Item -Path $sourcePath -Destination $destPath -Force
            Write-Host "  ✓ Archived: $file" -ForegroundColor Green
            $archived++
        } catch {
            Write-Host "  ✗ Failed: $file - $_" -ForegroundColor Red
        }
    }
}

# Archive subdirectory files
foreach ($filePair in $subFiles) {
    $sourcePath = Join-Path $rootPath $filePair[0]
    if (Test-Path $sourcePath) {
        $destPath = Join-Path $archivePath $filePair[1]
        try {
            Move-Item -Path $sourcePath -Destination $destPath -Force
            Write-Host "  ✓ Archived: $($filePair[0])" -ForegroundColor Green
            $archived++
        } catch {
            Write-Host "  ✗ Failed: $($filePair[0]) - $_" -ForegroundColor Red
        }
    }
}

Write-Host "`nArchive complete! $archived files moved to archive folder." -ForegroundColor Cyan
Write-Host "Archive location: $archivePath" -ForegroundColor Yellow
