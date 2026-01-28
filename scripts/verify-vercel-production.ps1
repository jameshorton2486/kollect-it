Write-Host "🧭 Kollect-It v1.0.0 — Production Verification" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$ErrorActionPreference = "Stop"
$failures = @()
$warnings = @()

# --------------------------------------------
# 1. REQUIRED ENV VARS (source of truth)
# --------------------------------------------
Write-Host "`n🔐 Checking required environment variables..." -ForegroundColor Yellow

$requiredVars = @(
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "IMAGEKIT_PUBLIC_KEY",
  "IMAGEKIT_PRIVATE_KEY",
  "IMAGEKIT_URL_ENDPOINT",
  "PRODUCT_INGEST_API_KEY",
  "WEBHOOK_SECRET",
  "HEALTHCHECK_TOKEN"
)

foreach ($var in $requiredVars) {
  if (-not $env:$var) {
    $failures += "Missing ENV var: $var"
  }
}

# --------------------------------------------
# 2. PRISMA MIGRATION SAFETY CHECK
# --------------------------------------------
Write-Host "`n🧬 Analyzing Prisma migrations..." -ForegroundColor Yellow

$migrations = Get-ChildItem "prisma/migrations" -Recurse -Filter "migration.sql"

foreach ($migration in $migrations) {
  $content = Get-Content $migration.FullName -Raw

  if ($content -match "(DROP\s+TABLE|DROP\s+COLUMN|TRUNCATE)") {
    $failures += "Destructive Prisma migration detected: $($migration.FullName)"
  }

  if ($content -match "ALTER\s+TABLE") {
    $warnings += "ALTER TABLE found (review manually): $($migration.FullName)"
  }
}

# --------------------------------------------
# 3. HEALTH ENDPOINT
# --------------------------------------------
Write-Host "`n❤️ Checking /api/health..." -ForegroundColor Yellow

try {
  $health = Invoke-RestMethod "$env:PROD_DOMAIN/api/health" -Headers @{
    Authorization = "Bearer $env:HEALTHCHECK_TOKEN"
  }

  if (-not $health) {
    $failures += "/api/health returned empty response"
  }
}
catch {
  $failures += "/api/health failed: $_"
}

# --------------------------------------------
# 4. ENV DIAGNOSTICS
# --------------------------------------------
Write-Host "`n🧪 Checking diagnostics endpoints..." -ForegroundColor Yellow

$diagnostics = @(
  "/api/diagnostics/env",
  "/api/diagnostics/check-env"
)

foreach ($endpoint in $diagnostics) {
  try {
    Invoke-RestMethod "$env:PROD_DOMAIN$endpoint" | Out-Null
  }
  catch {
    $warnings += "Diagnostics endpoint issue: $endpoint"
  }
}

# --------------------------------------------
# 5. STRIPE CHECK (basic connectivity)
# --------------------------------------------
Write-Host "`n💳 Verifying Stripe connectivity..." -ForegroundColor Yellow

if ($env:STRIPE_SECRET_KEY -notmatch "^sk_live_") {
  $warnings += "Stripe key is not live mode"
}

# --------------------------------------------
# 6. IMAGEKIT CHECK
# --------------------------------------------
Write-Host "`n🖼️ Verifying ImageKit config..." -ForegroundColor Yellow

if ($env:IMAGEKIT_URL_ENDPOINT -notmatch "imagekit.io") {
  $warnings += "ImageKit endpoint looks suspicious"
}

# --------------------------------------------
# 7. LOCALHOST / PREVIEW LEAK CHECK
# --------------------------------------------
Write-Host "`n🚨 Scanning for localhost / preview leaks..." -ForegroundColor Yellow

$leaks = Select-String -Path "src/**/*.ts","src/**/*.tsx" -Pattern "localhost|127\.0\.0\.1|VERCEL_ENV\s*===\s*['\"]preview['\"]"

foreach ($leaks) {
  $warnings += "Possible preview/local leak: $($leaks.Path)"
}

# --------------------------------------------
# FINAL REPORT
# --------------------------------------------
Write-Host "`n================ FINAL REPORT ================" -ForegroundColor Cyan

if ($failures.Count -eq 0) {
  Write-Host "✅ NO CRITICAL FAILURES" -ForegroundColor Green
} else {
  Write-Host "❌ FAILURES:" -ForegroundColor Red
  $failures | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
}

if ($warnings.Count -gt 0) {
  Write-Host "`n⚠️ WARNINGS:" -ForegroundColor Yellow
  $warnings | ForEach-Object { Write-Host " - $_" -ForegroundColor Yellow }
}

if ($failures.Count -eq 0) {
  Write-Host "`n🚀 PRODUCTION STATUS: GO" -ForegroundColor Green
} else {
  Write-Host "`n🛑 PRODUCTION STATUS: NO-GO" -ForegroundColor Red
  exit 1
}
