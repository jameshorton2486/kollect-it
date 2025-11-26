#!/usr/bin/env pwsh
$ErrorActionPreference = "Stop"

function Info { param($m) Write-Host "→ $m" -ForegroundColor Cyan }
function Ok   { param($m) Write-Host "✓ $m" -ForegroundColor Green }

$root = (Get-Location).Path
$categoriesDir = Join-Path $root "public/images/categories"
$productsDir   = Join-Path $root "public/images/products"

New-Item -ItemType Directory -Force -Path $categoriesDir | Out-Null
New-Item -ItemType Directory -Force -Path $productsDir | Out-Null

$categorySvg = @"
<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="4" width="56" height="56" rx="8" fill="#F5F2EB"/>
  <path d="M16 44 L26 24 L36 36 L44 20 L52 44 Z" fill="#C9A16B" opacity="0.9"/>
</svg>
"@

$placeholderSvg = @"
<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#F5F2EB"/>
  <rect x="40" y="40" width="320" height="220" rx="16" fill="#E3DDD0"/>
  <path d="M80 220 L150 140 L210 200 L260 150 L320 220 Z" fill="#C9A16B" opacity="0.9"/>
</svg>
"@

Set-Content -LiteralPath (Join-Path $categoriesDir "art.svg") -Value $categorySvg -Encoding UTF8
Set-Content -LiteralPath (Join-Path $categoriesDir "militaria.svg") -Value $categorySvg -Encoding UTF8
Set-Content -LiteralPath (Join-Path $productsDir "placeholder.svg") -Value $placeholderSvg -Encoding UTF8

Ok "Created: art.svg, militaria.svg, products/placeholder.svg"
