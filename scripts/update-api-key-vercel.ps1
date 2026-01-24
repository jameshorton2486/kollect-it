#!/usr/bin/env pwsh
# Update PRODUCT_INGEST_API_KEY in Vercel (automated)
# Removes old key and adds new one

$ErrorActionPreference = "Stop"

$NEW_KEY = "kollect-it-FLLkdujgZVJeJuClg502hThAvGxuqfi7FNaxsHt1xVZDXPgJlU34CmkY3r73C-Gx"

Write-Host "🔑 Updating PRODUCT_INGEST_API_KEY in Vercel..." -ForegroundColor Cyan
Write-Host ""

# Remove from all environments
Write-Host "Removing old keys..." -ForegroundColor Yellow
"y" | vercel env rm PRODUCT_INGEST_API_KEY production 2>$null
"y" | vercel env rm PRODUCT_INGEST_API_KEY preview 2>$null
"y" | vercel env rm PRODUCT_INGEST_API_KEY development 2>$null

Start-Sleep -Seconds 2

# Add new key
Write-Host ""
Write-Host "Adding new key to Production..." -ForegroundColor Yellow
Write-Output $NEW_KEY | vercel env add PRODUCT_INGEST_API_KEY production

Write-Host "Adding new key to Preview..." -ForegroundColor Yellow
Write-Output $NEW_KEY | vercel env add PRODUCT_INGEST_API_KEY preview

Write-Host "Adding new key to Development..." -ForegroundColor Yellow
Write-Output $NEW_KEY | vercel env add PRODUCT_INGEST_API_KEY development

Write-Host ""
Write-Host "✅ PRODUCT_INGEST_API_KEY updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Key: $NEW_KEY" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Run 'vercel --prod' to deploy" -ForegroundColor Yellow
