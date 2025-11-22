# QUICK ENV CHECK - Run this to verify your .env.local file
# Usage: .\check-env.ps1

Write-Host "`n🔍 KOLLECT-IT ENVIRONMENT VARIABLE CHECKER" -ForegroundColor Cyan
Write-Host "=========================================`n" -ForegroundColor Cyan

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ ERROR: .env.local file not found!" -ForegroundColor Red
    Write-Host "`nCreate it by running:" -ForegroundColor Yellow
    Write-Host "  copy .env.example .env.local" -ForegroundColor White
    Write-Host "  code .env.local" -ForegroundColor White
    exit 1
}

Write-Host "✅ Found .env.local file`n" -ForegroundColor Green

# Required variables
$required = @(
    "DATABASE_URL",
    "DIRECT_URL",
    "NEXTAUTH_URL",
    "NEXTAUTH_SECRET",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY",
    "IMAGEKIT_PRIVATE_KEY",
    "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT",
    "NEXT_PUBLIC_APP_URL"
)

# Load .env.local
$envContent = Get-Content ".env.local" -Raw
$envVars = @{}

# Parse env file
$envContent -split "`n" | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
        $parts = $line -split "=", 2
        $key = $parts[0].Trim()
        $value = $parts[1].Trim().Trim('"')
        $envVars[$key] = $value
    }
}

# Check each required variable
$missing = @()
$placeholder = @()
$found = 0

Write-Host "Checking Required Variables:" -ForegroundColor Yellow
Write-Host "----------------------------`n" -ForegroundColor Yellow

foreach ($var in $required) {
    if ($envVars.ContainsKey($var) -and $envVars[$var]) {
        $value = $envVars[$var]
        
        # Check for placeholder/example values
        if ($value -match "generate-with|your-|example|placeholder|\.\.\.|password@host") {
            Write-Host "⚠️  $var" -ForegroundColor Yellow -NoNewline
            Write-Host " (has placeholder value - needs real value)" -ForegroundColor DarkYellow
            $placeholder += $var
        } else {
            # Mask sensitive values
            $masked = if ($value.Length -gt 12) {
                $value.Substring(0, 6) + "..." + $value.Substring($value.Length - 4)
            } else {
                "****"
            }
            Write-Host "✅ $var" -ForegroundColor Green -NoNewline
            Write-Host " ($masked)" -ForegroundColor DarkGray
            $found++
        }
    } else {
        Write-Host "❌ $var" -ForegroundColor Red -NoNewline
        Write-Host " (MISSING)" -ForegroundColor DarkRed
        $missing += $var
    }
}

# Specific checks
Write-Host "`nSpecific Validations:" -ForegroundColor Yellow
Write-Host "---------------------`n" -ForegroundColor Yellow

# Check database ports
if ($envVars["DATABASE_URL"] -match ":(\d+)/") {
    $port = $matches[1]
    if ($port -eq "6543") {
        Write-Host "✅ DATABASE_URL port is correct (6543)" -ForegroundColor Green
    } else {
        Write-Host "❌ DATABASE_URL should use port 6543 (found: $port)" -ForegroundColor Red
    }
}

if ($envVars["DIRECT_URL"] -match ":(\d+)/") {
    $port = $matches[1]
    if ($port -eq "5432") {
        Write-Host "✅ DIRECT_URL port is correct (5432)" -ForegroundColor Green
    } else {
        Write-Host "❌ DIRECT_URL should use port 5432 (found: $port)" -ForegroundColor Red
    }
}

# Check Stripe keys
if ($envVars["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"] -match "^pk_test_") {
    Write-Host "✅ Using Stripe TEST keys (correct for development)" -ForegroundColor Green
} elseif ($envVars["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"] -match "^pk_live_") {
    Write-Host "⚠️  Using Stripe LIVE keys (switch to test keys first)" -ForegroundColor Yellow
}

# Check NEXTAUTH_URL
if ($envVars["NEXTAUTH_URL"] -eq "http://localhost:3000") {
    Write-Host "✅ NEXTAUTH_URL set to localhost (correct for local testing)" -ForegroundColor Green
} elseif ($envVars["NEXTAUTH_URL"] -match "kollect-it.com") {
    Write-Host "⚠️  NEXTAUTH_URL set to production (should be localhost for local testing)" -ForegroundColor Yellow
}

# Summary
Write-Host "`n📊 SUMMARY" -ForegroundColor Cyan
Write-Host "==========" -ForegroundColor Cyan
Write-Host "Found:        $found / $($required.Count)" -ForegroundColor $(if ($found -eq $required.Count) { "Green" } else { "Yellow" })
Write-Host "Missing:      $($missing.Count)" -ForegroundColor $(if ($missing.Count -eq 0) { "Green" } else { "Red" })
Write-Host "Placeholders: $($placeholder.Count)" -ForegroundColor $(if ($placeholder.Count -eq 0) { "Green" } else { "Yellow" })

Write-Host "`n" -NoNewline

if ($missing.Count -gt 0) {
    Write-Host "❌ FAILED - Missing required variables!" -ForegroundColor Red
    Write-Host "`nMissing variables:" -ForegroundColor Yellow
    $missing | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    Write-Host "`nAdd these to your .env.local file" -ForegroundColor Yellow
    exit 1
} elseif ($placeholder.Count -gt 0) {
    Write-Host "⚠️  WARNING - Some variables have placeholder values!" -ForegroundColor Yellow
    Write-Host "`nPlaceholder variables:" -ForegroundColor Yellow
    $placeholder | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
    Write-Host "`nReplace these with actual values before deploying" -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "✅ SUCCESS - All required variables are present!" -ForegroundColor Green
    Write-Host "`nNext step: Test the connections with:" -ForegroundColor Cyan
    Write-Host "  bun run scripts/test-env-complete.ts" -ForegroundColor White
    exit 0
}