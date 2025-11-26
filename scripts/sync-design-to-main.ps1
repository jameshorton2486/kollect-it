#!/usr/bin/env pwsh
# =============================================================================
# Kollect-It: Sync design/phase-1-global-spacing into main
# =============================================================================

param(
    [string]$SourceBranch = "design/phase-1-global-spacing",
    [string]$TargetBranch = "main",
    [switch]$DryRun = $false
)

$ErrorActionPreference = "Stop"

function Write-Info    { param($m) Write-Host "→ $m" -ForegroundColor Cyan }
function Write-Ok      { param($m) Write-Host "✓ $m" -ForegroundColor Green }
function Write-Warn    { param($m) Write-Host "⚠ $m" -ForegroundColor Yellow }
function Write-Fail    { param($m) Write-Host "✗ $m" -ForegroundColor Red }

if (-not (Test-Path ".git")) {
    Write-Fail "This folder doesn't look like a Git repo. Run from the project root."
    exit 1
}

Write-Info "Checking for uncommitted changes..."
$dirty = git status --porcelain
if ($dirty) {
    Write-Fail "Working tree is not clean. Please commit or stash changes first."
    git status
    exit 1
}

Write-Info "Fetching latest from origin..."
git fetch --all --prune

Write-Info "Updating source branch: $SourceBranch"
git checkout $SourceBranch
git pull origin $SourceBranch

Write-Info "Updating target branch: $TargetBranch"
git checkout $TargetBranch
git pull origin $TargetBranch

Write-Info "Merging $SourceBranch → $TargetBranch"
git merge --no-ff $SourceBranch

if ($LASTEXITCODE -ne 0) {
    Write-Warn "Merge has conflicts. Resolve them in VS Code, then run:"
    Write-Host "    git add ."
    Write-Host "    git commit -m 'fix: resolve design merge conflicts'"
    Write-Host "    git push origin $TargetBranch"
    exit 1
}

Write-Ok "Merge completed with no conflicts."

if ($DryRun) {
    Write-Warn "DryRun is ON – not pushing to origin."
    git status
    exit 0
}

Write-Info "Pushing updated $TargetBranch to origin..."
git push origin $TargetBranch

Write-Ok "Branch sync complete. You can now work only on '$TargetBranch'."
