Write-Host "=== Installing Phase 0: Project Safety ===" -ForegroundColor Cyan

$paths = @(
    ".cursor/rules",
    "scripts"
)

foreach ($path in $paths) {
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Host "Created $path"
    }
}

Write-Host "Copy the Phase 0 files into place, then run:"
Write-Host "python scripts/verify_project_safety.py" -ForegroundColor Yellow

Write-Host "=== Phase 0 install complete ===" -ForegroundColor Green

