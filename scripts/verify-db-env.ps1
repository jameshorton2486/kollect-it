#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Verify Supabase connection environment variables without exposing credentials.

.DESCRIPTION
  Checks that DATABASE_URL and DIRECT_URL are properly configured with correct ports.
  Does NOT test actual connectivity (to avoid exposure in logs).
#>

Write-Host "=== Supabase Environment Verification ===" -ForegroundColor Cyan

# Load .env.local if it exists
$envLocalPath = Join-Path $PSScriptRoot ".." ".env.local"
if (Test-Path $envLocalPath) {
  Write-Host "📄 Loading .env.local..." -ForegroundColor Green
  Get-Content $envLocalPath | ForEach-Object {
    if ($_ -match "^\s*#" -or $_ -eq "") { return }
    $key, $value = $_ -split "=", 2
    [System.Environment]::SetEnvironmentVariable($key.Trim(), $value.Trim())
  }
}
else {
  Write-Host "⚠️  .env.local not found at $envLocalPath" -ForegroundColor Yellow
  Write-Host "    Please create it with DATABASE_URL and DIRECT_URL" -ForegroundColor Yellow
  exit 1
}

# Verification table
$checks = @(
  @{
    Var   = "DATABASE_URL"
    Port  = "6543"
    Flag  = "?pgbouncer=true"
    Usage = "Application (Runtime)"
  },
  @{
    Var   = "DIRECT_URL"
    Port  = "5432"
    Flag  = "(none)"
    Usage = "Migrations & db pull"
  }
)

$allValid = $true

foreach ($check in $checks) {
  $value = [System.Environment]::GetEnvironmentVariable($check.Var)

  if (-not $value) {
    Write-Host "❌ $($check.Var) is missing!" -ForegroundColor Red
    $allValid = $false
    continue
  }

  $hasPort = $value -match ":$($check.Port)"
  $hasFlag = ($check.Flag -eq "(none)") -or ($value -match [regex]::Escape($check.Flag))

  $status = if ($hasPort -and $hasFlag) { "✅" } else { "❌" }
  Write-Host "$status $($check.Var)"
  Write-Host "   Port $($check.Port): $(if ($hasPort) { 'Found' } else { 'NOT FOUND' })"
  Write-Host "   Flag: $($check.Flag) - $(if ($hasFlag) { 'Found' } else { 'NOT FOUND' })"
  Write-Host "   Usage: $($check.Usage)"
  Write-Host ""

  if (-not ($hasPort -and $hasFlag)) {
    $allValid = $false
  }
}

if ($allValid) {
  Write-Host "✅ All environment variables look correct!" -ForegroundColor Green
  Write-Host ""
  Write-Host "Next steps:" -ForegroundColor Cyan
  Write-Host "  1. Run: bun x prisma db pull" -ForegroundColor Gray
  Write-Host "  2. Run: bun x prisma migrate dev" -ForegroundColor Gray
}
else {
  Write-Host "❌ Some variables need fixing. Please update .env.local" -ForegroundColor Red
  exit 1
}
