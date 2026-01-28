# ============================================
# Sync Desktop App .env with Vercel Production
# ============================================
# This script syncs PRODUCT_INGEST_API_KEY and checks for Supabase key formats

Write-Host "🔄 Syncing Desktop App Environment Variables" -ForegroundColor Cyan
Write-Host ""

$desktopEnvPath = "product-application\desktop-app\.env"
$vercelEnvPath = ".env.local"

# Check if files exist
if (!(Test-Path $desktopEnvPath)) {
    Write-Host "❌ Desktop app .env not found at: $desktopEnvPath" -ForegroundColor Red
    exit 1
}

if (!(Test-Path $vercelEnvPath)) {
    Write-Host "⚠️  .env.local not found. Pulling from Vercel..." -ForegroundColor Yellow
    vercel env pull .env.local --environment=production
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to pull environment variables" -ForegroundColor Red
        exit 1
    }
}

Write-Host "📖 Reading environment files..." -ForegroundColor Cyan

# Read desktop .env
$desktopContent = Get-Content $desktopEnvPath -Raw
$desktopLines = $desktopContent -split "`r?`n"

# Read Vercel .env.local
$vercelContent = Get-Content $vercelEnvPath -Raw
$vercelLines = $vercelContent -split "`r?`n"

# Extract PRODUCT_INGEST_API_KEY from Vercel
$vercelProductKey = $null
foreach ($line in $vercelLines) {
    if ($line -match '^PRODUCT_INGEST_API_KEY=(.+)$') {
        $vercelProductKey = $matches[1].Trim('"').Trim()
        break
    }
}

# Extract PRODUCT_INGEST_API_KEY from Desktop
$desktopProductKey = $null
foreach ($line in $desktopLines) {
    if ($line -match '^PRODUCT_INGEST_API_KEY=(.+)$') {
        $desktopProductKey = $matches[1].Trim()
        break
    }
}

Write-Host ""
Write-Host "🔑 PRODUCT_INGEST_API_KEY Comparison:" -ForegroundColor Yellow

if ($vercelProductKey -and $desktopProductKey) {
    if ($vercelProductKey -eq $desktopProductKey) {
        Write-Host "  ✅ Keys match exactly!" -ForegroundColor Green
        Write-Host "     Value: $($vercelProductKey.Substring(0, 30))... (Length: $($vercelProductKey.Length))" -ForegroundColor Gray
    }
    else {
        Write-Host "  ❌ Keys DO NOT match!" -ForegroundColor Red
        Write-Host "     Vercel:   $($vercelProductKey.Substring(0, 30))... (Length: $($vercelProductKey.Length))" -ForegroundColor Gray
        Write-Host "     Desktop:  $($desktopProductKey.Substring(0, 30))... (Length: $($desktopProductKey.Length))" -ForegroundColor Gray
        Write-Host ""
        Write-Host "  🔧 Updating desktop .env to match Vercel..." -ForegroundColor Cyan

        # Update desktop .env
        $updatedLines = @()
        foreach ($line in $desktopLines) {
            if ($line -match '^PRODUCT_INGEST_API_KEY=') {
                $updatedLines += "PRODUCT_INGEST_API_KEY=$vercelProductKey"
            }
            else {
                $updatedLines += $line.TrimEnd()
            }
        }

        # Write back with LF line endings, no trailing whitespace
        $updatedContent = ($updatedLines | Where-Object { $_ -ne "" }) -join "`n"
        [System.IO.File]::WriteAllText((Resolve-Path $desktopEnvPath), $updatedContent, [System.Text.Encoding]::UTF8)

        Write-Host "  ✅ Desktop .env updated!" -ForegroundColor Green
    }
}
elseif ($vercelProductKey) {
    Write-Host "  ⚠️  PRODUCT_INGEST_API_KEY found in Vercel but not in desktop .env" -ForegroundColor Yellow
    Write-Host "  🔧 Adding to desktop .env..." -ForegroundColor Cyan

    # Add to desktop .env
    $updatedLines = $desktopLines + "PRODUCT_INGEST_API_KEY=$vercelProductKey"
    $updatedContent = ($updatedLines | Where-Object { $_ -ne "" }) -join "`n"
    [System.IO.File]::WriteAllText((Resolve-Path $desktopEnvPath), $updatedContent, [System.Text.Encoding]::UTF8)

    Write-Host "  ✅ Added to desktop .env!" -ForegroundColor Green
}
elseif ($desktopProductKey) {
    Write-Host "  ⚠️  PRODUCT_INGEST_API_KEY found in desktop .env but NOT in Vercel production" -ForegroundColor Yellow
    Write-Host "     You may need to add it to Vercel:" -ForegroundColor Gray
    Write-Host "     vercel env add PRODUCT_INGEST_API_KEY production" -ForegroundColor White
}
else {
    Write-Host "  ❌ PRODUCT_INGEST_API_KEY not found in either file!" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔍 Checking for Supabase Keys:" -ForegroundColor Yellow

# Check Supabase keys in Vercel
$vercelSupabaseAnon = $null
$vercelSupabaseService = $null

foreach ($line in $vercelLines) {
    if ($line -match '^NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)$') {
        $vercelSupabaseAnon = $matches[1].Trim('"').Trim()
    }
    if ($line -match '^SUPABASE_SERVICE_ROLE_KEY=(.+)$') {
        $vercelSupabaseService = $matches[1].Trim('"').Trim()
    }
}

# Check Supabase keys in Desktop
$desktopSupabaseAnon = $null
$desktopSupabaseService = $null

foreach ($line in $desktopLines) {
    if ($line -match '^NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)$') {
        $desktopSupabaseAnon = $matches[1].Trim()
    }
    if ($line -match '^SUPABASE_SERVICE_ROLE_KEY=(.+)$') {
        $desktopSupabaseService = $matches[1].Trim()
    }
}

if ($vercelSupabaseAnon) {
    $format = if ($vercelSupabaseAnon.StartsWith("eyJ")) { "Legacy JWT (eyJ...)" }
    elseif ($vercelSupabaseAnon.StartsWith("sb_")) { "New Opaque Token (sb_...)" }
    else { "Unknown format" }

    Write-Host "  📋 NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel:" -ForegroundColor Cyan
    Write-Host "     Format: $format" -ForegroundColor Gray
    Write-Host "     Starts with: $($vercelSupabaseAnon.Substring(0, [Math]::Min(10, $vercelSupabaseAnon.Length)))..." -ForegroundColor Gray

    if ($desktopSupabaseAnon) {
        if ($vercelSupabaseAnon -eq $desktopSupabaseAnon) {
            Write-Host "  ✅ Desktop matches Vercel" -ForegroundColor Green
        }
        else {
            Write-Host "  ⚠️  Desktop differs from Vercel - updating..." -ForegroundColor Yellow
            # Update desktop .env
            $updatedLines = @()
            foreach ($line in $desktopLines) {
                if ($line -match '^NEXT_PUBLIC_SUPABASE_ANON_KEY=') {
                    $updatedLines += "NEXT_PUBLIC_SUPABASE_ANON_KEY=$vercelSupabaseAnon"
                }
                else {
                    $updatedLines += $line.TrimEnd()
                }
            }
            $updatedContent = ($updatedLines | Where-Object { $_ -ne "" }) -join "`n"
            [System.IO.File]::WriteAllText((Resolve-Path $desktopEnvPath), $updatedContent, [System.Text.Encoding]::UTF8)
            Write-Host "  ✅ Updated desktop .env" -ForegroundColor Green
        }
    }
    else {
        Write-Host "  ℹ️  Not in desktop .env (desktop app may not need this)" -ForegroundColor Gray
    }
}
else {
    Write-Host "  ⚠️  NEXT_PUBLIC_SUPABASE_ANON_KEY not found in Vercel production" -ForegroundColor Yellow
}

if ($vercelSupabaseService) {
    $format = if ($vercelSupabaseService.StartsWith("eyJ")) { "Legacy JWT (eyJ...)" }
    elseif ($vercelSupabaseService.StartsWith("sb_")) { "New Opaque Token (sb_...)" }
    else { "Unknown format" }

    Write-Host "  📋 SUPABASE_SERVICE_ROLE_KEY in Vercel:" -ForegroundColor Cyan
    Write-Host "     Format: $format" -ForegroundColor Gray
    Write-Host "     Starts with: $($vercelSupabaseService.Substring(0, [Math]::Min(10, $vercelSupabaseService.Length)))..." -ForegroundColor Gray
}
else {
    Write-Host "  ⚠️  SUPABASE_SERVICE_ROLE_KEY not found in Vercel production" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🧹 Cleaning desktop .env (removing trailing whitespace, normalizing line endings)..." -ForegroundColor Cyan

# Final cleanup: remove trailing whitespace, ensure LF line endings
$finalContent = Get-Content $desktopEnvPath -Raw
$finalLines = ($finalContent -split "`r?`n") | ForEach-Object { $_.TrimEnd() } | Where-Object { $_ -ne "" }
$cleanContent = $finalLines -join "`n"
[System.IO.File]::WriteAllText((Resolve-Path $desktopEnvPath), $cleanContent, [System.Text.Encoding]::UTF8)

Write-Host "✅ Desktop .env cleaned and synced!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Summary:" -ForegroundColor Cyan
Write-Host "  - PRODUCT_INGEST_API_KEY: $(if ($vercelProductKey -and $desktopProductKey -and $vercelProductKey -eq $desktopProductKey) { '✅ Synced' } else { '⚠️  Check required' })" -ForegroundColor $(if ($vercelProductKey -and $desktopProductKey -and $vercelProductKey -eq $desktopProductKey) { 'Green' } else { 'Yellow' })
if ($vercelSupabaseAnon) {
    $format = if ($vercelSupabaseAnon.StartsWith("eyJ")) { "Legacy" } elseif ($vercelSupabaseAnon.StartsWith("sb_")) { "Opaque Token" } else { "Unknown" }
    Write-Host "  - Supabase Keys Format: $format" -ForegroundColor Cyan
}
Write-Host ""
