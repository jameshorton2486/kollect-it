#!/usr/bin/env pwsh
$ErrorActionPreference = "Stop"

function Info { param($m) Write-Host "→ $m" -ForegroundColor Cyan }
function Ok   { param($m) Write-Host "✓ $m" -ForegroundColor Green }

Info "Removing .next & .turbo..."
Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ".turbo" -ErrorAction SilentlyContinue

Info "Reinstalling dependencies..."
npm install

Info "Regenerating Prisma client (if set up)..."
npx prisma generate

Ok "Done. Start dev with: npm run dev"
