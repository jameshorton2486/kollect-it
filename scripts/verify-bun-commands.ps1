# Verification script for bun commands
Write-Host "🔍 Checking core project files for 'bun x' command usage..." -ForegroundColor Cyan

# Only check actual implementation files, not documentation/plan files
$results = Get-ChildItem -Recurse -Include *.ps1,*.json,*.ts,*.tsx,*.sh -Exclude node_modules,.next,.git |
    Where-Object { 
        $_.FullName -notlike "*\deployments\*" -and 
        $_.FullName -notlike "*\docs\*" -and 
        $_.Name -ne "verify-bun-commands.ps1" -and
        $_.Name -notlike "*-PLAN.md" -and
        $_.Name -notlike "*-INDEX.md" -and
        $_.Name -notlike "*-REFERENCE.md" -and
        $_.Name -notlike "*TROUBLESHOOTING.md"
    } |
    Select-String -Pattern "bunx" -CaseSensitive

if ($results) {
    Write-Host "❌ Found 'bunx' in core files:" -ForegroundColor Red
    $results | ForEach-Object {
        Write-Host "  $($_.Path):$($_.LineNumber)" -ForegroundColor Yellow
        Write-Host "    $($_.Line.Trim())" -ForegroundColor Gray
    }
    exit 1
} else {
    Write-Host "✅ Core project files verified - all using 'bun x'" -ForegroundColor Green
    Write-Host "📁 Checked: package.json, scripts, source code" -ForegroundColor Cyan
    exit 0
}