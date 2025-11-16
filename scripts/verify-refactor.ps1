# Kollect-It Refactor Verification Script
# Checks if the color system refactor was applied correctly

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Kollect-It Refactor Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "C:\Users\james\kollect-it-marketplace-1"
$allGood = $true

# Test 1: Check globals.css
Write-Host "Test 1: Checking globals.css..." -ForegroundColor Yellow

$globalsPath = Join-Path $projectRoot "src\app\globals.css"
if (Test-Path $globalsPath) {
    $content = Get-Content $globalsPath -Raw
    
    # Check for new consolidated tokens
    $checks = @{
        "New Ink Token" = $content -match "--ink-900: 0 0% 12%"
        "New Gold Token" = $content -match "--gold-500: 36 41% 50%"
        "New Surface Token" = $content -match "--surface-1: 30 20% 96%"
        "New CTA Token" = $content -match "--cta-500: 212 52% 25%"
        "Single Source Comment" = $content -match "KOLLECT-IT DESIGN TOKENS - Single Source of Truth"
    }
    
    foreach ($check in $checks.GetEnumerator()) {
        if ($check.Value) {
            Write-Host "  ✓ $($check.Key)" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $($check.Key) - MISSING" -ForegroundColor Red
            $allGood = $false
        }
    }
    
    # Check for OLD tokens that should be removed
    $oldTokenChecks = @{
        "Old --color-accent" = $content -match "--color-accent: #B1874C"
        "Old --color-text-primary" = $content -match "--color-text-primary: #2C2C2C"
        "Old --color-muted-gold" = $content -match "--color-muted-gold"
    }
    
    Write-Host ""
    Write-Host "  Checking for old tokens (should NOT be present):" -ForegroundColor Cyan
    foreach ($check in $oldTokenChecks.GetEnumerator()) {
        if ($check.Value) {
            Write-Host "    ⚠ $($check.Key) - STILL PRESENT (should be removed)" -ForegroundColor Yellow
            $allGood = $false
        } else {
            Write-Host "    ✓ $($check.Key) - Correctly removed" -ForegroundColor Green
        }
    }
} else {
    Write-Host "  ✗ globals.css not found!" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""

# Test 2: Check tailwind.config.ts
Write-Host "Test 2: Checking tailwind.config.ts..." -ForegroundColor Yellow

$tailwindPath = Join-Path $projectRoot "tailwind.config.ts"
if (Test-Path $tailwindPath) {
    $content = Get-Content $tailwindPath -Raw
    
    $checks = @{
        "New Ink Color" = $content -match 'ink:\s*\{'
        "New Gold Color" = $content -match 'gold:\s*\{'
        "New Surface Color" = $content -match 'surface:\s*\{'
        "New CTA Color" = $content -match 'cta:\s*\{'
        "Clean Comment Header" = $content -match "KOLLECT-IT COLOR SYSTEM"
    }
    
    foreach ($check in $checks.GetEnumerator()) {
        if ($check.Value) {
            Write-Host "  ✓ $($check.Key)" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $($check.Key) - MISSING" -ForegroundColor Red
            $allGood = $false
        }
    }
    
    # Check for old tokens that should be removed
    Write-Host ""
    Write-Host "  Checking for old tokens (should NOT be present):" -ForegroundColor Cyan
    $oldTokens = @{
        "Old brandAccent" = $content -match 'brandAccent:\s*\{'
        "Old neutral primary" = $content -match 'neutral:\s*\{'
        "Old backgrounds canvas" = $content -match 'backgrounds:\s*\{'
    }
    
    foreach ($check in $oldTokens.GetEnumerator()) {
        if ($check.Value) {
            Write-Host "    ⚠ $($check.Key) - STILL PRESENT (should be removed)" -ForegroundColor Yellow
            $allGood = $false
        } else {
            Write-Host "    ✓ $($check.Key) - Correctly removed" -ForegroundColor Green
        }
    }
} else {
    Write-Host "  ✗ tailwind.config.ts not found!" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""

# Test 3: Check Hero.tsx
Write-Host "Test 3: Checking Hero.tsx..." -ForegroundColor Yellow

$heroPath = Join-Path $projectRoot "src\components\Hero.tsx"
if (Test-Path $heroPath) {
    $content = Get-Content $heroPath -Raw
    
    $checks = @{
        "Uses bg-ink (not hard-coded)" = ($content -match 'bg-ink') -and ($content -notmatch 'bg-\[#1a1a1a\]')
        "Uses text-gold (not hard-coded)" = ($content -match 'text-gold') -and ($content -notmatch 'text-\[#D3AF37\]')
        "No hard-coded #D3AF37" = $content -notmatch '#D3AF37'
        "No hard-coded #1a1a1a" = $content -notmatch '#1a1a1a'
    }
    
    foreach ($check in $checks.GetEnumerator()) {
        if ($check.Value) {
            Write-Host "  ✓ $($check.Key)" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $($check.Key) - NEEDS UPDATE" -ForegroundColor Red
            $allGood = $false
        }
    }
} else {
    Write-Host "  ✗ Hero.tsx not found!" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""

# Test 4: Check Header.tsx
Write-Host "Test 4: Checking Header.tsx..." -ForegroundColor Yellow

$headerPath = Join-Path $projectRoot "src\components\Header.tsx"
if (Test-Path $headerPath) {
    $content = Get-Content $headerPath -Raw
    
    $checks = @{
        "Light header (bg-white)" = $content -match 'bg-white'
        "Uses text-ink" = $content -match 'text-ink'
        "Uses text-gold for logo" = $content -match 'text-gold'
        "No hard-coded #1a1a1a" = $content -notmatch 'bg-\[#1a1a1a\]'
        "No hard-coded #D3AF37" = $content -notmatch 'text-\[#D3AF37\]'
    }
    
    foreach ($check in $checks.GetEnumerator()) {
        if ($check.Value) {
            Write-Host "  ✓ $($check.Key)" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $($check.Key) - NEEDS UPDATE" -ForegroundColor Red
            $allGood = $false
        }
    }
} else {
    Write-Host "  ✗ Header.tsx not found!" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""

# Test 5: Check Footer.tsx
Write-Host "Test 5: Checking Footer.tsx..." -ForegroundColor Yellow

$footerPath = Join-Path $projectRoot "src\components\Footer.tsx"
if (Test-Path $footerPath) {
    $content = Get-Content $footerPath -Raw
    
    $checks = @{
        "Light footer (bg-surface-1)" = $content -match 'bg-surface-1'
        "Uses text-ink" = $content -match 'text-ink'
        "No dark background" = $content -notmatch 'bg-\[#1a1a1a\]'
    }
    
    foreach ($check in $checks.GetEnumerator()) {
        if ($check.Value) {
            Write-Host "  ✓ $($check.Key)" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $($check.Key) - NEEDS UPDATE" -ForegroundColor Red
            $allGood = $false
        }
    }
} else {
    Write-Host "  ✗ Footer.tsx not found!" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""

# Test 6: Check home components
Write-Host "Test 6: Checking home components..." -ForegroundColor Yellow

$homeComponents = @(
    "LatestArrivalsClient.tsx",
    "FeaturedCollection.tsx",
    "TrustStrip.tsx"
)

foreach ($component in $homeComponents) {
    $componentPath = Join-Path $projectRoot "src\components\home\$component"
    if (Test-Path $componentPath) {
        $content = Get-Content $componentPath -Raw
        
        $hasOldToken = $content -match 'text-accent-gold|bg-accent-gold'
        $hasNewToken = $content -match 'text-gold|bg-gold'
        
        if ($hasNewToken -and -not $hasOldToken) {
            Write-Host "  ✓ $component - Using new tokens" -ForegroundColor Green
        } elseif ($hasOldToken) {
            Write-Host "  ✗ $component - Still has OLD tokens (text-accent-gold)" -ForegroundColor Red
            $allGood = $false
        } else {
            Write-Host "  ? $component - No gold tokens found" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "✓ REFACTOR APPLIED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host ""
    Write-Host "All checks passed. Your color system is refactored!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Run: npm run dev" -ForegroundColor White
    Write-Host "  2. Open: http://localhost:3000" -ForegroundColor White
    Write-Host "  3. Verify: Light header, cream footer, gold accents" -ForegroundColor White
} else {
    Write-Host "⚠ REFACTOR NOT FULLY APPLIED" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Some files need updating. Here's what to do:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1: Manual Update (Recommended)" -ForegroundColor Cyan
    Write-Host "  1. Open docs/REFACTOR_COMPLETE (1).md" -ForegroundColor White
    Write-Host "  2. Find the 'BEFORE & AFTER EXAMPLES' section" -ForegroundColor White
    Write-Host "  3. Update each failing file with the new tokens" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 2: Re-copy from backup" -ForegroundColor Cyan
    Write-Host "  If you have a backup of the refactored files" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 3: Ask Claude for help" -ForegroundColor Cyan
    Write-Host "  Share which files failed and Claude can help update them" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""