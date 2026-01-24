#!/usr/bin/env pwsh
# Update PRODUCT_INGEST_API_KEY in Vercel
# Usage: ./update-vercel-api-key.ps1

$ErrorActionPreference = "Stop"

$API_KEY = "kollect-it-FLLkdujgZVJeJuClg502hThAvGxuqfi7FNaxsHt1xVZDXPgJlU34CmkY3r73C-Gx"

Write-Host "🔑 Updating PRODUCT_INGEST_API_KEY in Vercel..." -ForegroundColor Cyan
Write-Host ""

# Production
Write-Host "Adding to Production..." -ForegroundColor Yellow
Write-Output $API_KEY | vercel env add PRODUCT_INGEST_API_KEY production

# Preview
Write-Host "Adding to Preview..." -ForegroundColor Yellow
Write-Output $API_KEY | vercel env add PRODUCT_INGEST_API_KEY preview

# Development
Write-Host "Adding to Development..." -ForegroundColor Yellow
Write-Output $API_KEY | vercel env add PRODUCT_INGEST_API_KEY development

Write-Host ""
Write-Host "✅ PRODUCT_INGEST_API_KEY updated in all environments" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update Python desktop app .env with new key"
Write-Host "2. Run: vercel --prod"
