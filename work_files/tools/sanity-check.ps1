<#
=====================================================================
 KOLLECT-IT — LOCAL SANITY CHECK SCRIPT
 Purpose: Run all local validations before manual deployment tasks.
 Location: tools/sanity-check.ps1
=====================================================================
#>

$ErrorActionPreference = "Stop"

function Write-Section {
    param (
        [string]$Title
    )
    Write-Host ""
    Write-Host "------------------------------------------" -ForegroundColor Yellow
    Write-Host " $Title" -ForegroundColor Yellow
    Write-Host "------------------------------------------" -ForegroundColor Yellow
}

function Run-Step {
    param (
        [string]$Title,
        [scriptblock]$Script
    )

    Write-Section $Title

    try {
        & $Script
        Write-Host "✓ $Title completed." -ForegroundColor Green
    }
    catch {
        Write-Host "✗ $Title FAILED." -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        Write-Host ""
        Write-Host "Stopping sanity check due to failure." -ForegroundColor Red
        exit 1
    }
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "     KOLLECT-IT LOCAL SANITY CHECK        " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# ========== 0. Precheck: bun installed ==========
Write-Section "PRECHECK: bun CLI availability"

if (-not (Get-Command bun -ErrorAction SilentlyContinue)) {
    Write-Host "✗ 'bun' command not found on PATH." -ForegroundColor Red
    Write-Host "Install Bun or open the correct terminal where Bun is available." -ForegroundColor Red
    exit 1
}
else {
    Write-Host "✓ 'bun' is available." -ForegroundColor Green
}

# ========== 1. Confirm .env.local exists ==========
Write-Section "CHECKING .env.local"

if (-not (Test-Path ".env.local")) {
    Write-Host "✗ ERROR: .env.local is missing in project root." -ForegroundColor Red
    Write-Host "Create .env.local before running this sanity check." -ForegroundColor Red
    exit 1
}
else {
    Write-Host "✓ .env.local found." -ForegroundColor Green
}

# ========== 2. Install dependencies ==========
Run-Step -Title "Install dependencies (bun install)" -Script {
    bun install
}

# ========== 3. TypeScript typecheck ==========
Run-Step -Title "Typecheck (bun run typecheck)" -Script {
    bun run typecheck
}

# ========== 4. Build verification ==========
Run-Step -Title "Build (bun run build)" -Script {
    bun run build
}

# ========== 5. Image pipeline test (optional) ==========
Write-Section "Image pipeline (bun run images:sync)"

if (Test-Path ".\assets\raw-images") {
    try {
        Write-Host "Found assets\raw-images — running image pipeline..." -ForegroundColor Cyan
        bun run images:sync
        Write-Host "✓ Image pipeline completed." -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Image pipeline FAILED, but this may be optional." -ForegroundColor Yellow
        Write-Host $_.Exception.Message -ForegroundColor Yellow
        Write-Host "You can re-run this step separately once images are configured." -ForegroundColor Yellow
    }
}
else {
    Write-Host "⚠ assets\raw-images not found — skipping image pipeline." -ForegroundColor Yellow
}

# ========== 6. Final summary ==========
Write-Section "FINAL SUMMARY"

Write-Host "✓ All critical local checks passed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "You can now proceed with MANUAL_TASKS_REQUIRED.md items" -ForegroundColor Cyan
Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "   LOCAL SANITY CHECK COMPLETE — GOOD TO GO!  " -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
