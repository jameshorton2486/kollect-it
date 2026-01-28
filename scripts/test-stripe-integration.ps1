# ============================================
# Stripe Integration Test Script
# ============================================
# Tests all Stripe components and configuration
# Verifies keys, webhooks, and integration health

Write-Host "🧪 Stripe Integration Test Suite" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"
$testsPassed = 0
$testsFailed = 0
$warnings = @()

# ============================================
# 1. Environment Variables Check
# ============================================
Write-Host "📋 Test 1: Environment Variables" -ForegroundColor Yellow
Write-Host ""

$requiredVars = @{
  "STRIPE_SECRET_KEY"                  = $env:STRIPE_SECRET_KEY
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" = $env:NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  "STRIPE_WEBHOOK_SECRET"              = $env:STRIPE_WEBHOOK_SECRET
}

foreach ($varName in $requiredVars.Keys) {
  $value = $requiredVars[$varName]

  if ([string]::IsNullOrEmpty($value)) {
    Write-Host "  ❌ ${varName}: MISSING" -ForegroundColor Red
    $testsFailed++
  }
  else {
    # Check format
    $prefix = $value.Substring(0, [Math]::Min(10, $value.Length))

    switch ($varName) {
      "STRIPE_SECRET_KEY" {
        if ($value.StartsWith("sk_test_")) {
          Write-Host "  ⚠️  ${varName}: TEST MODE (prefix: sk_test_...)" -ForegroundColor Yellow
          $warnings += "Using Stripe TEST mode keys"
          $testsPassed++
        }
        elseif ($value.StartsWith("sk_live_")) {
          Write-Host "  ✅ ${varName}: LIVE MODE (prefix: sk_live_...)" -ForegroundColor Green
          $testsPassed++
        }
        else {
          Write-Host "  ❌ ${varName}: Invalid format (should start with sk_test_ or sk_live_)" -ForegroundColor Red
          $testsFailed++
        }
      }
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" {
        if ($value.StartsWith("pk_test_")) {
          Write-Host "  ⚠️  ${varName}: TEST MODE (prefix: pk_test_...)" -ForegroundColor Yellow
          $warnings += "Using Stripe TEST mode publishable key"
          $testsPassed++
        }
        elseif ($value.StartsWith("pk_live_")) {
          Write-Host "  ✅ ${varName}: LIVE MODE (prefix: pk_live_...)" -ForegroundColor Green
          $testsPassed++
        }
        else {
          Write-Host "  ❌ ${varName}: Invalid format (should start with pk_test_ or pk_live_)" -ForegroundColor Red
          $testsFailed++
        }
      }
      "STRIPE_WEBHOOK_SECRET" {
        if ($value.StartsWith("whsec_")) {
          Write-Host "  ✅ ${varName}: Valid format (prefix: whsec_...)" -ForegroundColor Green
          $testsPassed++
        }
        else {
          Write-Host "  ❌ ${varName}: Invalid format (should start with whsec_)" -ForegroundColor Red
          Write-Host "     Current value starts with: $prefix" -ForegroundColor Gray
          $testsFailed++
        }
      }
    }
  }
}

Write-Host ""

# ============================================
# 2. Key Matching Check (Test/Live consistency)
# ============================================
Write-Host "📋 Test 2: Key Mode Consistency" -ForegroundColor Yellow
Write-Host ""

$secretKey = $env:STRIPE_SECRET_KEY
$publishableKey = $env:NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

if ($secretKey -and $publishableKey) {
  $secretIsLive = $secretKey.StartsWith("sk_live_")
  $publishableIsLive = $publishableKey.StartsWith("pk_live_")

  if ($secretIsLive -eq $publishableIsLive) {
    $mode = if ($secretIsLive) { "LIVE" } else { "TEST" }
    Write-Host "  ✅ Keys match: Both are in $mode mode" -ForegroundColor Green
    $testsPassed++
  }
  else {
    Write-Host "  ❌ Key mismatch: Secret and publishable keys are in different modes!" -ForegroundColor Red
    Write-Host "     Secret key: $(if ($secretIsLive) { 'LIVE' } else { 'TEST' })" -ForegroundColor Gray
    Write-Host "     Publishable key: $(if ($publishableIsLive) { 'LIVE' } else { 'TEST' })" -ForegroundColor Gray
    $testsFailed++
  }
}
else {
  Write-Host "  ⚠️  Skipping: Keys not available" -ForegroundColor Yellow
}

Write-Host ""

# ============================================
# 3. Stripe API Connection Test
# ============================================
Write-Host "📋 Test 3: Stripe API Connection" -ForegroundColor Yellow
Write-Host ""

if ($env:STRIPE_SECRET_KEY) {
  try {
    $headers = @{
      "Authorization" = "Bearer $($env:STRIPE_SECRET_KEY)"
    }

    $response = Invoke-RestMethod -Uri "https://api.stripe.com/v1/balance" -Headers $headers -Method Get

    Write-Host "  ✅ API Connection successful" -ForegroundColor Green
    Write-Host "     Available balance: $($response.available[0].amount / 100) $($response.available[0].currency.ToUpper())" -ForegroundColor Gray
    Write-Host "     Pending balance: $($response.pending[0].amount / 100) $($response.pending[0].currency.ToUpper())" -ForegroundColor Gray
    $testsPassed++
  }
  catch {
    Write-Host "  ❌ API Connection failed" -ForegroundColor Red
    Write-Host "     Error: $($_.Exception.Message)" -ForegroundColor Gray
    $testsFailed++
  }
}
else {
  Write-Host "  ⚠️  Skipping: STRIPE_SECRET_KEY not set" -ForegroundColor Yellow
}

Write-Host ""

# ============================================
# 4. Webhook Configuration Check
# ============================================
Write-Host "📋 Test 4: Webhook Configuration" -ForegroundColor Yellow
Write-Host ""

if ($env:STRIPE_SECRET_KEY) {
  try {
    $headers = @{
      "Authorization" = "Bearer $($env:STRIPE_SECRET_KEY)"
    }

    $webhooks = Invoke-RestMethod -Uri "https://api.stripe.com/v1/webhook_endpoints" -Headers $headers -Method Get

    if ($webhooks.data.Count -eq 0) {
      Write-Host "  ⚠️  No webhook endpoints configured in Stripe" -ForegroundColor Yellow
      $warnings += "No webhook endpoints found - events won't be received"
    }
    else {
      Write-Host "  ✅ Found $($webhooks.data.Count) webhook endpoint(s)" -ForegroundColor Green

      foreach ($webhook in $webhooks.data) {
        Write-Host ""
        Write-Host "     Webhook: $($webhook.id)" -ForegroundColor Cyan
        Write-Host "     URL: $($webhook.url)" -ForegroundColor Gray
        Write-Host "     Status: $($webhook.status)" -ForegroundColor $(if ($webhook.status -eq "enabled") { "Green" } else { "Yellow" })
        Write-Host "     Events: $($webhook.enabled_events.Count) event types" -ForegroundColor Gray

        # Check for required events
        $requiredEvents = @(
          "checkout.session.completed",
          "payment_intent.succeeded",
          "payment_intent.payment_failed"
        )

        $missingEvents = @()
        foreach ($event in $requiredEvents) {
          if ($webhook.enabled_events -notcontains $event) {
            $missingEvents += $event
          }
        }

        if ($missingEvents.Count -gt 0) {
          Write-Host "     ⚠️  Missing required events: $($missingEvents -join ', ')" -ForegroundColor Yellow
          $warnings += "Webhook missing required events: $($missingEvents -join ', ')"
        }

        # Check if webhook URL matches expected domain
        $expectedDomains = @("kollect-it.com", "vercel.app")
        $urlMatchesExpected = $false
        foreach ($domain in $expectedDomains) {
          if ($webhook.url -like "*$domain*") {
            $urlMatchesExpected = $true
            break
          }
        }

        if (-not $urlMatchesExpected) {
          Write-Host "     ⚠️  Webhook URL doesn't match expected domain" -ForegroundColor Yellow
          $warnings += "Webhook URL unexpected: $($webhook.url)"
        }
      }
      $testsPassed++
    }
  }
  catch {
    Write-Host "  ❌ Failed to fetch webhook configuration" -ForegroundColor Red
    Write-Host "     Error: $($_.Exception.Message)" -ForegroundColor Gray
    $testsFailed++
  }
}
else {
  Write-Host "  ⚠️  Skipping: STRIPE_SECRET_KEY not set" -ForegroundColor Yellow
}

Write-Host ""

# ============================================
# 5. Database Schema Check
# ============================================
Write-Host "📋 Test 5: Database Schema (StripeWebhookEvent)" -ForegroundColor Yellow
Write-Host ""

if (Test-Path "prisma/schema.prisma") {
  $schemaContent = Get-Content "prisma/schema.prisma" -Raw

  if ($schemaContent -match "model StripeWebhookEvent") {
    Write-Host "  ✅ StripeWebhookEvent model exists in schema" -ForegroundColor Green
    $testsPassed++

    # Check for required fields
    $requiredFields = @("stripeEventId", "eventType", "processed", "payload")
    $missingFields = @()

    foreach ($field in $requiredFields) {
      if ($schemaContent -notmatch "$field\s+") {
        $missingFields += $field
      }
    }

    if ($missingFields.Count -gt 0) {
      Write-Host "  ⚠️  Missing fields in StripeWebhookEvent: $($missingFields -join ', ')" -ForegroundColor Yellow
      $warnings += "Database schema missing fields: $($missingFields -join ', ')"
    }
  }
  else {
    Write-Host "  ❌ StripeWebhookEvent model not found in schema" -ForegroundColor Red
    Write-Host "     Webhook idempotency won't work without this!" -ForegroundColor Gray
    $testsFailed++
  }
}
else {
  Write-Host "  ⚠️  Skipping: prisma/schema.prisma not found" -ForegroundColor Yellow
}

Write-Host ""

# ============================================
# 6. Code Integration Check
# ============================================
Write-Host "📋 Test 6: Code Integration Files" -ForegroundColor Yellow
Write-Host ""

$requiredFiles = @{
  "src/lib/stripe.ts"                                   = "Stripe configuration"
  "src/app/api/webhooks/stripe/route.ts"                = "Webhook handler"
  "src/app/api/checkout/create-payment-intent/route.ts" = "Payment intent creation"
}

foreach ($filePath in $requiredFiles.Keys) {
  if (Test-Path $filePath) {
    Write-Host "  ✅ $($requiredFiles[$filePath]): $filePath" -ForegroundColor Green
    $testsPassed++
  }
  else {
    Write-Host "  ❌ $($requiredFiles[$filePath]): NOT FOUND at $filePath" -ForegroundColor Red
    $testsFailed++
  }
}

Write-Host ""

# ============================================
# 7. Test Webhook Signature Verification
# ============================================
Write-Host "📋 Test 7: Webhook Secret Format" -ForegroundColor Yellow
Write-Host ""

$webhookSecret = $env:STRIPE_WEBHOOK_SECRET

if ($webhookSecret) {
  if ($webhookSecret.StartsWith("whsec_")) {
    if ($webhookSecret.Length -gt 20) {
      Write-Host "  ✅ Webhook secret format valid" -ForegroundColor Green
      Write-Host "     Length: $($webhookSecret.Length) characters" -ForegroundColor Gray
      $testsPassed++
    }
    else {
      Write-Host "  ⚠️  Webhook secret seems too short" -ForegroundColor Yellow
      $warnings += "Webhook secret length suspicious: $($webhookSecret.Length) chars"
      $testsPassed++
    }
  }
  else {
    Write-Host "  ❌ Webhook secret format invalid" -ForegroundColor Red
    Write-Host "     Should start with 'whsec_'" -ForegroundColor Gray
    Write-Host "     Current: $($webhookSecret.Substring(0, [Math]::Min(20, $webhookSecret.Length)))..." -ForegroundColor Gray
    $testsFailed++
  }
}
else {
  Write-Host "  ❌ Webhook secret not set" -ForegroundColor Red
  $testsFailed++
}

Write-Host ""

# ============================================
# Summary
# ============================================
Write-Host "📊 Test Summary" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ✅ Passed: $testsPassed" -ForegroundColor Green
Write-Host "  ❌ Failed: $testsFailed" -ForegroundColor $(if ($testsFailed -eq 0) { "Green" } else { "Red" })
Write-Host "  ⚠️  Warnings: $($warnings.Count)" -ForegroundColor $(if ($warnings.Count -eq 0) { "Green" } else { "Yellow" })
Write-Host ""

if ($warnings.Count -gt 0) {
  Write-Host "⚠️  Warnings:" -ForegroundColor Yellow
  foreach ($warning in $warnings) {
    Write-Host "  - $warning" -ForegroundColor Yellow
  }
  Write-Host ""
}

if ($testsFailed -eq 0 -and $warnings.Count -eq 0) {
  Write-Host "🎉 All tests passed! Stripe integration is healthy." -ForegroundColor Green
}
elseif ($testsFailed -eq 0) {
  Write-Host "✅ All critical tests passed (but see warnings above)" -ForegroundColor Green
}
else {
  Write-Host "❌ Some tests failed. Fix the issues above before going to production." -ForegroundColor Red
}

Write-Host ""

# Return exit code
exit $(if ($testsFailed -eq 0) { 0 } else { 1 })
