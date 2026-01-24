# Kollect-It Full Production Audit Runner
# ==========================================
# This script runs a comprehensive production readiness audit using Codex CLI

# Configuration - UPDATE THIS PATH if needed
$KollectItRepo = "C:\Users\james\kollect-it"

# Colors for output
function Write-Step { param($msg) Write-Host "`n[$((Get-Date).ToString('HH:mm:ss'))] $msg" -ForegroundColor Cyan }
function Write-Success { param($msg) Write-Host $msg -ForegroundColor Green }
function Write-Warning { param($msg) Write-Host $msg -ForegroundColor Yellow }

# Header
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Kollect-It Full Production Audit" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Navigate to repo
Write-Step "Navigating to Kollect-It repository..."
if (!(Test-Path $KollectItRepo)) {
    Write-Host "ERROR: Repository not found at $KollectItRepo" -ForegroundColor Red
    exit 1
}
Set-Location $KollectItRepo
Write-Success "  Current directory: $(Get-Location)"

# Step 2: Check if audit file exists, if not create it
$AuditFile = "$KollectItRepo\KOLLECT_IT_FULL_AUDIT.md"
if (!(Test-Path $AuditFile)) {
    Write-Warning "  Audit file not found. Please copy KOLLECT_IT_FULL_AUDIT.md to your repo first."
    exit 1
}
Write-Success "  Audit file found: $AuditFile"

# Step 3: Run Codex
Write-Step "Starting Codex full-auto audit..."
Write-Host ""
Write-Host "  Codex will now scan your entire codebase and fix issues automatically."
Write-Host "  This may take 15-30 minutes depending on codebase size."
Write-Host ""
Write-Warning "  Press Ctrl+C at any time to stop."
Write-Host ""

# Run Codex with full-auto mode
codex --full-auto -m o4-mini

# Step 4: Post-audit commands
Write-Host ""
Write-Step "Codex audit complete. Running verification..."

Write-Host "`n  Running: npx prisma generate" -ForegroundColor Gray
npx prisma generate

Write-Host "`n  Running: npm run build" -ForegroundColor Gray
npm run build

# Step 5: Summary
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  AUDIT COMPLETE" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

if ($LASTEXITCODE -eq 0) {
    Write-Success "Build passed! Ready for deployment."
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Review changes: git diff" -ForegroundColor White
    Write-Host "  2. Commit: git add . && git commit -m 'audit: production readiness fixes'" -ForegroundColor White
    Write-Host "  3. Push: git push" -ForegroundColor White
    Write-Host "  4. Deploy: vercel --prod" -ForegroundColor White
} else {
    Write-Warning "Build had errors. Review the output above."
}

Write-Host ""
