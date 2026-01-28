# ============================================
# Vercel Environment Variables Audit & Sync Script
# ============================================
# This script audits all Vercel environments and identifies missing keys

Write-Host "🔍 Vercel Environment Variables Audit" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found. Install with: npm i -g vercel" -ForegroundColor Red
    exit 1
}

# Define required environment variables based on codebase analysis
$requiredVars = @(
    # Critical - App won't work without these
    "DATABASE_URL",
    "DIRECT_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
    "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY",
    "IMAGEKIT_PRIVATE_KEY",
    "PRODUCT_INGEST_API_KEY",

    # Recommended
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "EMAIL_HOST",
    "EMAIL_PORT",
    "EMAIL_USER",
    "EMAIL_PASSWORD",
    "EMAIL_FROM",
    "ADMIN_EMAIL",

    # Optional but useful
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "ANTHROPIC_API_KEY"
)

# Environments to check
$environments = @("production", "development", "preview")

Write-Host "📥 Pulling environment variables from all environments..." -ForegroundColor Cyan
Write-Host ""

# Store environment data
$envData = @{}

foreach ($env in $environments) {
    Write-Host "  Checking $env..." -ForegroundColor Yellow

    # Create temp file for this environment
    $tempFile = ".env.$env.temp"

    # Pull environment variables
    $pullOutput = vercel env pull $tempFile --environment=$env 2>&1 | Out-String

    if ($LASTEXITCODE -eq 0 -and (Test-Path $tempFile)) {
        $content = Get-Content $tempFile -Raw
        $vars = @{}

        # Parse environment variables
        foreach ($line in ($content -split "`r?`n")) {
            if ($line -match '^([^=]+)=(.*)$' -and !$line.StartsWith("#")) {
                $key = $matches[1].Trim()
                $value = $matches[2].Trim('"').Trim()
                if ($key -and $value) {
                    $vars[$key] = $value
                }
            }
        }

        $envData[$env] = $vars
        Remove-Item $tempFile -ErrorAction SilentlyContinue
        Write-Host "    ✅ Found $($vars.Count) variables" -ForegroundColor Green
    }
    else {
        Write-Host "    ⚠️  Could not pull $env environment" -ForegroundColor Yellow
        $envData[$env] = @{}
    }
}

Write-Host ""
Write-Host "📊 Environment Comparison:" -ForegroundColor Cyan
Write-Host ""

# Compare environments
$productionVars = $envData["production"]
$developmentVars = $envData["development"]
$previewVars = $envData["preview"]

Write-Host "Production:     $($productionVars.Count) variables" -ForegroundColor $(if ($productionVars.Count -gt 0) { "Green" } else { "Red" })
Write-Host "Development:   $($developmentVars.Count) variables" -ForegroundColor $(if ($developmentVars.Count -gt 0) { "Green" } else { "Yellow" })
Write-Host "Preview:       $($previewVars.Count) variables" -ForegroundColor $(if ($previewVars.Count -gt 0) { "Green" } else { "Yellow" })

Write-Host ""
Write-Host "🔴 Missing in Production:" -ForegroundColor Red
Write-Host ""

$missingInProduction = @()
$availableInOtherEnvs = @{}

foreach ($var in $requiredVars) {
    if (!$productionVars.ContainsKey($var)) {
        $missingInProduction += $var

        # Check if it exists in other environments
        $foundIn = @()
        if ($developmentVars.ContainsKey($var)) { $foundIn += "development" }
        if ($previewVars.ContainsKey($var)) { $foundIn += "preview" }

        if ($foundIn.Count -gt 0) {
            $availableInOtherEnvs[$var] = $foundIn
            Write-Host "  ❌ $var" -ForegroundColor Red
            Write-Host "     ⚠️  Available in: $($foundIn -join ', ')" -ForegroundColor Yellow
        }
        else {
            Write-Host "  ❌ $var (not found in any environment)" -ForegroundColor Red
        }
    }
}

if ($missingInProduction.Count -eq 0) {
    Write-Host "  ✅ All required variables are present in production!" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Present in Production:" -ForegroundColor Green
Write-Host ""

$presentInProduction = @()
foreach ($var in $requiredVars) {
    if ($productionVars.ContainsKey($var)) {
        $presentInProduction += $var
        $value = $productionVars[$var]
        $preview = if ($value.Length -gt 30) { "$($value.Substring(0, 30))..." } else { $value }
        Write-Host "  ✅ $var = $preview" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🔍 Supabase Key Format Check:" -ForegroundColor Cyan
Write-Host ""

$supabaseAnon = $productionVars["NEXT_PUBLIC_SUPABASE_ANON_KEY"]
$supabaseService = $productionVars["SUPABASE_SERVICE_ROLE_KEY"]

if ($supabaseAnon) {
    if ($supabaseAnon.StartsWith("eyJ")) {
        Write-Host "  NEXT_PUBLIC_SUPABASE_ANON_KEY: Legacy JWT format (eyJ...)" -ForegroundColor Yellow
    }
    elseif ($supabaseAnon.StartsWith("sb_")) {
        Write-Host "  NEXT_PUBLIC_SUPABASE_ANON_KEY: New Opaque Token format (sb_...)" -ForegroundColor Green
    }
    else {
        Write-Host "  NEXT_PUBLIC_SUPABASE_ANON_KEY: Unknown format" -ForegroundColor Gray
    }
}
else {
    Write-Host "  NEXT_PUBLIC_SUPABASE_ANON_KEY: Not found in production" -ForegroundColor Red
}

if ($supabaseService) {
    if ($supabaseService.StartsWith("eyJ")) {
        Write-Host "  SUPABASE_SERVICE_ROLE_KEY: Legacy JWT format (eyJ...)" -ForegroundColor Yellow
    }
    elseif ($supabaseService.StartsWith("sb_")) {
        Write-Host "  SUPABASE_SERVICE_ROLE_KEY: New Opaque Token format (sb_...)" -ForegroundColor Green
    }
    else {
        Write-Host "  SUPABASE_SERVICE_ROLE_KEY: Unknown format" -ForegroundColor Gray
    }
}
else {
    Write-Host "  SUPABASE_SERVICE_ROLE_KEY: Not found in production" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 Generate Add Commands:" -ForegroundColor Cyan
Write-Host ""

if ($missingInProduction.Count -gt 0) {
    Write-Host "Run these commands to add missing variables to production:" -ForegroundColor Yellow
    Write-Host ""

    # Generate commands for variables available in other environments
    foreach ($var in $missingInProduction) {
        if ($availableInOtherEnvs.ContainsKey($var)) {
            $sourceEnv = $availableInOtherEnvs[$var][0]
            $value = $envData[$sourceEnv][$var]

            Write-Host "  # Copy $var from $sourceEnv" -ForegroundColor Gray
            Write-Host "  echo '$value' | vercel env add $var production" -ForegroundColor White
            Write-Host ""
        }
        else {
            Write-Host "  # Add $var (get value from service dashboard)" -ForegroundColor Gray
            Write-Host "  vercel env add $var production" -ForegroundColor White
            Write-Host ""
        }
    }

    # Generate a batch script
    $scriptContent = @"
# ============================================
# Add Missing Environment Variables to Vercel Production
# ============================================
# Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
#
# Instructions:
# 1. Review each command below
# 2. For variables with values, the value is included
# 3. For variables without values, you'll need to provide them
# 4. Run each command one at a time, or uncomment to run all

"@

    foreach ($var in $missingInProduction) {
        if ($availableInOtherEnvs.ContainsKey($var)) {
            $sourceEnv = $availableInOtherEnvs[$var][0]
            $value = $envData[$sourceEnv][$var]
            $scriptContent += "echo '$value' | vercel env add $var production`n"
        }
        else {
            $scriptContent += "# vercel env add $var production`n"
            $scriptContent += "# TODO: Get value from service dashboard`n"
        }
    }

    $scriptPath = "scripts\add-missing-vercel-env.ps1"
    $scriptContent | Out-File -FilePath $scriptPath -Encoding UTF8
    Write-Host "  💾 Generated script: $scriptPath" -ForegroundColor Green
    Write-Host "     Review and run this script to add all missing variables" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📄 Summary Report:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Total required variables: $($requiredVars.Count)" -ForegroundColor White
Write-Host "  Present in production:   $($presentInProduction.Count)" -ForegroundColor Green
Write-Host "  Missing in production:     $($missingInProduction.Count)" -ForegroundColor $(if ($missingInProduction.Count -eq 0) { "Green" } else { "Red" })
Write-Host ""

if ($missingInProduction.Count -gt 0) {
    Write-Host "  ⚠️  Action Required: Add $($missingInProduction.Count) missing variable(s) to production" -ForegroundColor Yellow
    Write-Host "     See commands above or run: .\scripts\add-missing-vercel-env.ps1" -ForegroundColor Gray
}

Write-Host ""
