Write-Host "Pre-commit repo safety check..."

$forbidden = @(".next", ".idea", ".venv", ".vercel")

foreach ($dir in $forbidden) {
    if (Test-Path $dir) {
        Write-Host "ERROR: $dir must not be committed"
        exit 1
    }
}

Write-Host "Repo safe to commit"