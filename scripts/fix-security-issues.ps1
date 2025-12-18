Write-Host "Running Kollect-It automated security fix..."

# 1) Fix BOM in .gitignore
$gitignore = ".gitignore"
if (Test-Path $gitignore) {
    $content = Get-Content $gitignore -Raw
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($gitignore, $content, $utf8NoBom)
    Write-Host "Removed BOM from .gitignore"
} else {
    Write-Host ".gitignore not found"
}

# 2) Redact credentials from PRE_LAUNCH_AUDIT.md
$auditFile = "PRE_LAUNCH_AUDIT.md"
if (Test-Path $auditFile) {
    $audit = Get-Content $auditFile -Raw
    $audit = $audit `
        -replace '(?i)password\s*:\s*.+', 'Password: [REDACTED]' `
        -replace '(?i)email\s*:\s*.+@.+', 'Email: admin@example.com' `
        -replace '(?i)(admin123|KollectIt@2025Admin|KI-2025|James@KI-2025)', '[REDACTED]'
    Set-Content $auditFile $audit -Encoding UTF8
    Write-Host "Redacted credentials from PRE_LAUNCH_AUDIT.md"
} else {
    Write-Host "PRE_LAUNCH_AUDIT.md not found"
}

# 3) Fix admin verification script exit behavior
$verifyScript = "scripts/verify-admin-security.ts"
if (Test-Path $verifyScript) {
    $verify = Get-Content $verifyScript -Raw
    if ($verify -match 'process\.exit\(0\)') {
        $verify = $verify -replace 'process\.exit\(0\)', 'process.exit(1)'
        Set-Content $verifyScript $verify -Encoding UTF8
        Write-Host "Hardened verify-admin-security.ts to fail safely"
    } else {
        Write-Host "verify-admin-security.ts already hardened"
    }
} else {
    Write-Host "verify-admin-security.ts not found (skipping)"
}

# 4) Scan for leftover secrets
Write-Host "Scanning for possible leaked credentials..."
$patterns = 'password\s*:', 'admin@', '@kollect-it', 'API_KEY\s*='
$hits = Select-String -Path "*.md","scripts/*.ts" -Pattern $patterns -SimpleMatch -Recurse
if ($hits) {
    Write-Host "Possible sensitive strings still found:"
    $hits | ForEach-Object { Write-Host "  -> $($_.Path):$($_.LineNumber)" }
    Write-Host "Fix these manually before merging."
    exit 1
} else {
    Write-Host "No obvious credentials detected"
}

# 5) Stage and commit changes safely
$pathsToAdd = @()
if (Test-Path $gitignore) { $pathsToAdd += $gitignore }
if (Test-Path $auditFile) { $pathsToAdd += $auditFile }
if (Test-Path $verifyScript) { $pathsToAdd += $verifyScript }

if ($pathsToAdd.Count -gt 0) {
    git add $pathsToAdd
    # Check if there are staged changes
    git diff --cached --quiet
    $hasChanges = $LASTEXITCODE -ne 0
    if ($hasChanges) {
        git commit -m "fix(security): harden gitignore, redact audit credentials, fail admin checks safely"
        Write-Host "Security fixes applied and committed successfully!"
    } else {
        Write-Host "No changes to commit"
    }
} else {
    Write-Host "No target files found to stage"
}
