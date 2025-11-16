# =====================================================
# Kollect-It Environment Variables Setup
# =====================================================
# Generates templates and guides you through configuration
# Usage: .\setup-env-vars.ps1 [-GenerateSecrets]

param(
    [switch]$GenerateSecrets,
    [switch]$CopyToClipboard
)

function Write-Status {
    param($Message, $Type = "Info")
    
    switch ($Type) {
        "Success" { Write-Host "✓ $Message" -ForegroundColor Green }
        "Error" { Write-Host "✗ $Message" -ForegroundColor Red }
        "Warning" { Write-Host "⚠ $Message" -ForegroundColor Yellow }
        "Info" { Write-Host "→ $Message" -ForegroundColor Cyan }
        "Header" { 
            Write-Host "`n$Message" -ForegroundColor Cyan
            Write-Host ("=" * $Message.Length) -ForegroundColor Cyan
        }
    }
}

Write-Status "⚙️  Kollect-It Environment Variables Setup" "Header"

# =====================================================
# 1. Generate NEXTAUTH_SECRET if requested
# =====================================================
$nextAuthSecret = ""
if ($GenerateSecrets) {
    Write-Status "Generating NEXTAUTH_SECRET..." "Info"
    # Generate random base64 string (32 bytes = 44 chars in base64)
    $bytes = New-Object byte[] 32
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($bytes)
    $nextAuthSecret = [Convert]::ToBase64String($bytes)
    Write-Status "Generated: $nextAuthSecret" "Success"
}

# =====================================================
# 2. Create .env.production Template
# =====================================================
Write-Status "`nCreating environment templates..." "Info"

$envTemplate = @"
# =====================================================
# Kollect-It Production Environment Variables
# =====================================================
# Copy these to Vercel Dashboard → Settings → Environment Variables
# DO NOT commit this file to Git!

# ===== DATABASE (Supabase) =====
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres"

# Find your connection string:
# 1. Go to: https://supabase.com/dashboard/project/[project-id]/settings/database
# 2. Copy "Connection string" (URI format)
# 3. Replace [PASSWORD] with your database password
# 4. Use port 5432 (NOT 6543 for Prisma)

# ===== AUTHENTICATION (NextAuth.js) =====
NEXTAUTH_URL="https://your-app-name.vercel.app"
$(if ($nextAuthSecret) { "NEXTAUTH_SECRET=`"$nextAuthSecret`"" } else { "NEXTAUTH_SECRET=`"[Run: openssl rand -base64 32 OR use GenerateSecrets flag]`"" })

# Update NEXTAUTH_URL with your actual Vercel deployment URL
# Generate NEXTAUTH_SECRET: openssl rand -base64 32

# ===== GOOGLE OAUTH =====
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-client-secret"

# Setup Google OAuth:
# 1. Go to: https://console.cloud.google.com/apis/credentials
# 2. Create OAuth 2.0 Client ID
# 3. Authorized redirect URIs: https://your-app.vercel.app/api/auth/callback/google
# 4. Copy Client ID and Client Secret

# ===== GOOGLE ANALYTICS =====
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Setup Google Analytics:
# 1. Go to: https://analytics.google.com/
# 2. Create GA4 Property
# 3. Copy Measurement ID (starts with G-)

# ===== EMAIL (Google Workspace SMTP) =====
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="noreply@your-domain.com"
EMAIL_SERVER_PASSWORD="[16-character Google App Password]"
EMAIL_FROM="noreply@your-domain.com"

# Setup Google Workspace Email:
# 1. Enable 2-Step Verification: https://myaccount.google.com/security
# 2. Generate App Password: https://myaccount.google.com/apppasswords
# 3. Select "Mail" and "Other (Custom name)"
# 4. Name it "Kollect-It Server"
# 5. Copy the 16-character password

# ===== STRIPE PAYMENTS =====
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# For testing, use test keys:
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
# STRIPE_SECRET_KEY="sk_test_..."

# Setup Stripe:
# 1. Dashboard: https://dashboard.stripe.com/apikeys
# 2. Copy publishable and secret keys
# 3. Webhooks: https://dashboard.stripe.com/webhooks
# 4. Add endpoint: https://your-app.vercel.app/api/webhooks/stripe
# 5. Select events: payment_intent.succeeded, checkout.session.completed
# 6. Copy webhook secret

# ===== IMAGEKIT CDN =====
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="public_..."
IMAGEKIT_PRIVATE_KEY="private_..."
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your-id"

# Setup ImageKit:
# 1. Dashboard: https://imagekit.io/dashboard/developer/api-keys
# 2. Copy Public Key, Private Key, and URL Endpoint
# 3. Configure allowed origins in ImageKit settings

# ===== GOOGLE DRIVE API =====
GOOGLE_DRIVE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_DRIVE_CLIENT_SECRET="GOCSPX-your-secret"
GOOGLE_DRIVE_REFRESH_TOKEN="1//0g..."
GOOGLE_DRIVE_FOLDER_ID="1ABC..."

# Setup Google Drive:
# 1. Same as Google OAuth (can reuse credentials)
# 2. Enable Google Drive API
# 3. Create refresh token (see documentation)
# 4. Create a folder in Drive and copy its ID from URL

# ===== REDIS (Optional - for caching) =====
# REDIS_URL="redis://default:[password]@[host]:6379"

# Setup Redis (Optional):
# 1. Upstash: https://upstash.com/ (free tier available)
# 2. Redis Labs: https://redis.com/
# 3. Copy connection URL

# ===== OPTIONAL: MONITORING =====
# SENTRY_DSN="https://...@sentry.io/..."
# LOGROCKET_APP_ID="your-app/project"

"@

# Save to file
$envTemplate | Out-File -FilePath ".env.production.template" -Encoding UTF8
Write-Status "Created: .env.production.template" "Success"

# =====================================================
# 3. Create Vercel Environment Variables Guide
# =====================================================
$vercelGuide = @"
# =====================================================
# HOW TO ADD ENVIRONMENT VARIABLES TO VERCEL
# =====================================================

STEP 1: Go to Vercel Dashboard
https://vercel.com/dashboard

STEP 2: Select Your Project
Click on "kollect-it" (or your project name)

STEP 3: Go to Settings
Click "Settings" tab → "Environment Variables"

STEP 4: Add Variables One by One
For EACH variable in .env.production.template:
1. Enter Variable NAME (e.g., DATABASE_URL)
2. Enter Variable VALUE (e.g., postgresql://...)
3. Select: Production, Preview, Development (check all 3)
4. Click "Add"

STEP 5: Redeploy
After adding all variables:
- Go to "Deployments" tab
- Click "..." menu on latest deployment
- Click "Redeploy"

# =====================================================
# QUICK COPY FORMAT (for faster input)
# =====================================================
# Copy each line and split at the = sign in Vercel UI:

DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://...
NEXTAUTH_SECRET=$(if ($nextAuthSecret) { $nextAuthSecret } else { "[GENERATE THIS]" })
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
EMAIL_SERVER_PASSWORD=...
STRIPE_SECRET_KEY=...
IMAGEKIT_PRIVATE_KEY=...

# NOTE: Values with "..." need to be replaced with actual values
# See .env.production.template for setup instructions

# =====================================================
# ENVIRONMENT VARIABLE VALIDATION
# =====================================================
# After adding all variables, test with:
vercel env pull .env.vercel
# Then check .env.vercel file has all required variables

"@

$vercelGuide | Out-File -FilePath "VERCEL_ENV_SETUP.md" -Encoding UTF8
Write-Status "Created: VERCEL_ENV_SETUP.md" "Success"

# =====================================================
# 4. Create Quick Reference Card
# =====================================================
$quickRef = @"
# =====================================================
# ENVIRONMENT VARIABLES QUICK REFERENCE
# =====================================================

CRITICAL (Must Configure):
✓ DATABASE_URL              → Supabase connection string
✓ NEXTAUTH_URL              → Your Vercel app URL
✓ NEXTAUTH_SECRET           → Random 32-byte string
✓ GOOGLE_CLIENT_ID          → Google OAuth
✓ GOOGLE_CLIENT_SECRET      → Google OAuth

IMPORTANT (Needed for features):
⚠ EMAIL_SERVER_PASSWORD     → Google App Password
⚠ STRIPE_SECRET_KEY         → Payment processing
⚠ IMAGEKIT_PRIVATE_KEY      → Image CDN

OPTIONAL (Can add later):
○ GOOGLE_ANALYTICS_ID       → Analytics
○ REDIS_URL                 → Performance caching
○ SENTRY_DSN                → Error tracking

# =====================================================
# SETUP ORDER (recommended)
# =====================================================
1. Database (Supabase)        → 5 minutes
2. Authentication (NextAuth)  → 10 minutes
3. Email (Google Workspace)   → 15 minutes
4. Payments (Stripe)          → 20 minutes
5. CDN (ImageKit)             → 10 minutes
6. Analytics (optional)       → 10 minutes

Total setup time: ~60-70 minutes

"@

$quickRef | Out-File -FilePath "ENV_QUICK_REFERENCE.md" -Encoding UTF8
Write-Status "Created: ENV_QUICK_REFERENCE.md" "Success"

# =====================================================
# 5. Check Existing .env.local
# =====================================================
Write-Status "`nChecking existing configuration..." "Info"
if (Test-Path .env.local) {
    $envLocal = Get-Content .env.local -Raw
    
    $allVars = @(
        "DATABASE_URL", "NEXTAUTH_URL", "NEXTAUTH_SECRET",
        "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET",
        "EMAIL_SERVER_PASSWORD", "STRIPE_SECRET_KEY",
        "IMAGEKIT_PRIVATE_KEY", "GOOGLE_ANALYTICS_ID"
    )
    
    $configured = 0
    $missing = @()
    
    foreach ($var in $allVars) {
        if ($envLocal -match "$var\s*=\s*.+") {
            $configured++
        } else {
            $missing += $var
        }
    }
    
    Write-Status "Configured: $configured / $($allVars.Count) variables" "Info"
    
    if ($missing.Count -gt 0) {
        Write-Status "Missing variables:" "Warning"
        foreach ($var in $missing) {
            Write-Host "  - $var" -ForegroundColor Yellow
        }
    }
} else {
    Write-Status ".env.local not found" "Warning"
}

# =====================================================
# Summary and Next Steps
# =====================================================
Write-Status "`n📊 Setup Complete!" "Header"
Write-Host ""
Write-Host "Generated files:" -ForegroundColor Cyan
Write-Host "✓ .env.production.template   - Full template with instructions" -ForegroundColor Green
Write-Host "✓ VERCEL_ENV_SETUP.md        - Vercel configuration guide" -ForegroundColor Green
Write-Host "✓ ENV_QUICK_REFERENCE.md     - Quick lookup reference" -ForegroundColor Green
Write-Host ""

if ($nextAuthSecret) {
    Write-Host "🔐 Generated NEXTAUTH_SECRET:" -ForegroundColor Cyan
    Write-Host $nextAuthSecret -ForegroundColor Yellow
    Write-Host ""
    
    if ($CopyToClipboard) {
        $nextAuthSecret | Set-Clipboard
        Write-Host "✓ Copied to clipboard!" -ForegroundColor Green
        Write-Host ""
    }
}

Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Open .env.production.template" -ForegroundColor White
Write-Host "2. Follow instructions to get each value" -ForegroundColor White
Write-Host "3. Copy variables to Vercel Dashboard" -ForegroundColor White
Write-Host "4. Use VERCEL_ENV_SETUP.md as guide" -ForegroundColor White
Write-Host ""
Write-Host "⏱️  Estimated time: 60-70 minutes for full setup" -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 Pro tip: Start with critical variables (DATABASE_URL, NEXTAUTH)" -ForegroundColor Cyan
Write-Host "   Then add optional ones as you need features" -ForegroundColor Cyan
Write-Host ""
