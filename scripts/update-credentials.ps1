#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Update google-credentials.json with a new service account key from Google Cloud
.DESCRIPTION
    This script helps you quickly update the credentials file after downloading
    a new service account key from Google Cloud Console
.EXAMPLE
    .\scripts\update-credentials.ps1
#>

param(
    [string]$CredentialsPath = "$(pwd)\google-credentials.json",
    [string]$DownloadPath = "$env:USERPROFILE\Downloads"
)

Write-Host "🔑 Google Credentials Update Script" -ForegroundColor Cyan
Write-Host ""

# Check for new credential files in Downloads
Write-Host "📂 Looking for new credential files in Downloads..." -ForegroundColor Yellow
$credFiles = Get-ChildItem -Path $DownloadPath -Filter "*imagekit*.json" -ErrorAction SilentlyContinue | 
             Where-Object { $_.LastWriteTime -gt (Get-Date).AddMinutes(-30) }

if ($credFiles.Count -eq 0) {
    Write-Host "❌ No recent credential files found in Downloads" -ForegroundColor Red
    Write-Host "   Please download a new service account key from Google Cloud Console first" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Steps:" -ForegroundColor Cyan
    Write-Host "  1. Go to: https://console.cloud.google.com/" -ForegroundColor Gray
    Write-Host "  2. Select: kollect-it-imagekit project" -ForegroundColor Gray
    Write-Host "  3. Go to: APIs & Services → Credentials" -ForegroundColor Gray
    Write-Host "  4. Click on: imagekit-sync service account" -ForegroundColor Gray
    Write-Host "  5. Go to: KEYS tab" -ForegroundColor Gray
    Write-Host "  6. Click: + CREATE KEY → JSON → Create" -ForegroundColor Gray
    Write-Host "  7. The file will download to: $DownloadPath" -ForegroundColor Gray
    exit 1
}

Write-Host "✅ Found $($credFiles.Count) credential file(s):" -ForegroundColor Green
$credFiles | ForEach-Object { Write-Host "   - $($_.Name)" -ForegroundColor Green }
Write-Host ""

if ($credFiles.Count -gt 1) {
    Write-Host "📋 Multiple files found. Using the most recent:" -ForegroundColor Yellow
    $latestCred = $credFiles | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    Write-Host "   $($latestCred.Name)" -ForegroundColor Green
} else {
    $latestCred = $credFiles[0]
}

# Verify it's valid JSON
Write-Host ""
Write-Host "🔍 Validating JSON..." -ForegroundColor Yellow
try {
    $json = Get-Content $latestCred.FullName | ConvertFrom-Json
    Write-Host "✅ JSON is valid" -ForegroundColor Green
    Write-Host "   Type: $($json.type)" -ForegroundColor Gray
    Write-Host "   Project: $($json.project_id)" -ForegroundColor Gray
    Write-Host "   Email: $($json.client_email)" -ForegroundColor Gray
} catch {
    Write-Host "❌ JSON is invalid: $_" -ForegroundColor Red
    exit 1
}

# Backup old credentials
Write-Host ""
Write-Host "💾 Backing up old credentials..." -ForegroundColor Yellow
if (Test-Path $CredentialsPath) {
    $backupPath = "$CredentialsPath.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item -Path $CredentialsPath -Destination $backupPath
    Write-Host "✅ Backup saved to: $backupPath" -ForegroundColor Green
}

# Copy new credentials
Write-Host ""
Write-Host "📋 Copying new credentials..." -ForegroundColor Yellow
Copy-Item -Path $latestCred.FullName -Destination $CredentialsPath -Force
Write-Host "✅ Credentials updated: $CredentialsPath" -ForegroundColor Green

# Verify the new file
Write-Host ""
Write-Host "✔️  Final verification:" -ForegroundColor Yellow
$newJson = Get-Content $CredentialsPath | ConvertFrom-Json
Write-Host "   Type: $($newJson.type)" -ForegroundColor Green
Write-Host "   Key ID: $($newJson.private_key_id)" -ForegroundColor Green
Write-Host "   Email: $($newJson.client_email)" -ForegroundColor Green

Write-Host ""
Write-Host "✅ Done! Your credentials have been updated." -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run: bun run sync-images" -ForegroundColor Gray
Write-Host "  2. Check output for errors" -ForegroundColor Gray
Write-Host "  3. Verify images in ImageKit dashboard: https://imagekit.io/dashboard" -ForegroundColor Gray
