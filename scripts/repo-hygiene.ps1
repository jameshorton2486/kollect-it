Write-Host "Running Kollect-It Repo Hygiene Check..."

$forbiddenFolders = @(
    ".next",
    ".idea",
    ".venv",
    ".vercel"
)

foreach ($folder in $forbiddenFolders) {
    if (Test-Path $folder) {
        Write-Host "Removing forbidden folder: $folder"
        Remove-Item -Recurse -Force $folder
    }
}

$gitignorePath = ".gitignore"

$requiredIgnores = @(
    ".next/",
    ".idea/",
    ".venv/",
    ".vercel/",
    "node_modules/",
    "*.log"
)

if (!(Test-Path $gitignorePath)) {
    Write-Host ".gitignore missing - creating"
    New-Item .gitignore | Out-Null
}

$gitignoreContent = Get-Content $gitignorePath -ErrorAction SilentlyContinue

foreach ($rule in $requiredIgnores) {
    if ($gitignoreContent -notcontains $rule) {
        Write-Host "Adding rule to .gitignore: $rule"
        Add-Content $gitignorePath $rule
    }
}

Write-Host "Repo hygiene complete."
