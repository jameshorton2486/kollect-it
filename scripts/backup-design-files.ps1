param(
    [Parameter(Mandatory = $true)]
    [string[]]$Files
)

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupFolder = "design-backups/$timestamp"

New-Item -ItemType Directory -Force -Path $backupFolder | Out-Null

foreach ($file in $Files) {
    if (Test-Path $file) {
        $target = Join-Path $backupFolder (Split-Path $file -Leaf)
        Copy-Item -Path $file -Destination $target -Force
        Write-Host "✓ Backed up: $file → $target"
    }
    else {
        Write-Host "⚠ File not found: $file"
    }
}

Write-Host "`nBackup complete → $backupFolder"
