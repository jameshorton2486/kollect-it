# Restores from most recent backup

param(
    [string]$BackupFolder
)

if (-not $BackupFolder) {
    # Find most recent backup
    $backups = Get-ChildItem -Path ".\backups" -Directory | Sort-Object Name -Descending
    if ($backups.Count -eq 0) {
        Write-Host "❌ No backups found" -ForegroundColor Red
        exit 1
    }
    $BackupFolder = $backups[0].FullName
}

Write-Host "Restoring from: $BackupFolder" -ForegroundColor Yellow
Write-Host "This will overwrite current files. Continue? (Y/N): " -NoNewline
$response = Read-Host

if ($response -ne "Y") {
    Write-Host "Restore cancelled" -ForegroundColor Yellow
    exit 0
}

Copy-Item -Path "$BackupFolder\src" -Destination ".\src" -Recurse -Force
Copy-Item -Path "$BackupFolder\tailwind.config.ts" -Destination ".\" -Force -ErrorAction SilentlyContinue

Write-Host "✅ Restore complete!" -ForegroundColor Green