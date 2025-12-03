<# 
.SYNOPSIS
    Kollect-It Pre-Launch Fix Deployment Script
    
.DESCRIPTION
    This script deploys all the fixes needed before launching Kollect-It:
    - Forgot password pages and API routes
    - Reset password pages and API routes
    - Contact form API
    - Newsletter API improvements
    - Email templates
    - Prisma schema updates
    - Admin reports auth fix
    
.NOTES
    Run from the root of your kollect-it project directory
    Example: .\scripts\deploy-prelaunch-fixes.ps1
#>

param(
    [switch]$SkipPrisma,
    [switch]$SkipGit,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

# Colors for output
function Write-Step { param($msg) Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Write-Success { param($msg) Write-Host "    ✓ $msg" -ForegroundColor Green }
function Write-Warning { param($msg) Write-Host "    ! $msg" -ForegroundColor Yellow }
function Write-Error { param($msg) Write-Host "    ✗ $msg" -ForegroundColor Red }

# Check we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Error "Not in project root. Please run from kollect-it directory."
    exit 1
}

$projectName = (Get-Content package.json | ConvertFrom-Json).name
if ($projectName -ne "kollect-it-marketplace") {
    Write-Error "Wrong project. Expected kollect-it-marketplace."
    exit 1
}

Write-Host @"
╔═══════════════════════════════════════════════════════════════════╗
║           KOLLECT-IT PRE-LAUNCH FIX DEPLOYMENT                   ║
╚═══════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Magenta

if ($DryRun) {
    Write-Warning "DRY RUN MODE - No files will be modified"
}

# ============================================
# STEP 1: Create Directory Structure
# ============================================
Write-Step "Creating directory structure..."

$directories = @(
    "src/app/forgot-password",
    "src/app/reset-password",
    "src/app/api/auth/forgot-password",
    "src/app/api/auth/reset-password",
    "src/app/api/auth/verify-reset-token",
    "src/app/api/contact"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        if (-not $DryRun) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
        }
        Write-Success "Created: $dir"
    } else {
        Write-Warning "Exists: $dir"
    }
}

# ============================================
# STEP 2: Backup existing files
# ============================================
Write-Step "Backing up existing files..."

$backupDir = "backups/prelaunch-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
if (-not $DryRun) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

$filesToBackup = @(
    "src/lib/email.ts",
    "src/app/api/newsletter/subscribe/route.ts",
    "src/app/api/admin/reports/route.ts",
    "src/components/forms/ContactForm.tsx",
    "prisma/schema.prisma"
)

foreach ($file in $filesToBackup) {
    if (Test-Path $file) {
        if (-not $DryRun) {
            $backupPath = Join-Path $backupDir ($file -replace "/", "_")
            Copy-Item $file $backupPath
        }
        Write-Success "Backed up: $file"
    }
}

# ============================================
# STEP 3: Instructions for manual file copy
# ============================================
Write-Step "File deployment instructions..."

Write-Host @"

The following files need to be copied from the Claude output to your project.
You can copy them from the outputs folder or use the content provided.

FILES TO CREATE/REPLACE:
"@ -ForegroundColor White

$fileList = @"
1. src/app/forgot-password/page.tsx          [NEW]
2. src/app/reset-password/page.tsx           [NEW]
3. src/app/api/auth/forgot-password/route.ts [NEW]
4. src/app/api/auth/reset-password/route.ts  [NEW]
5. src/app/api/auth/verify-reset-token/route.ts [NEW]
6. src/app/api/contact/route.ts              [NEW]
7. src/app/api/newsletter/subscribe/route.ts [REPLACE]
8. src/app/api/admin/reports/route.ts        [REPLACE]
9. src/lib/email.ts                          [REPLACE]
10. src/components/forms/ContactForm.tsx     [REPLACE]
11. src/emails/PasswordResetEmail.tsx        [NEW]
12. src/emails/PasswordChangedEmail.tsx      [NEW]
13. src/emails/ContactNotificationEmail.tsx  [NEW]
14. src/emails/NewsletterWelcomeEmail.tsx    [NEW]
15. prisma/schema.prisma                     [REPLACE]
"@

Write-Host $fileList -ForegroundColor Yellow

# ============================================
# STEP 4: Prisma Migration
# ============================================
if (-not $SkipPrisma) {
    Write-Step "Database migration instructions..."
    
    Write-Host @"
    
OPTION A - Run SQL directly in Supabase:
-----------------------------------------
1. Go to your Supabase Dashboard
2. Open SQL Editor
3. Copy and run the contents of: prisma/migrations/add_auth_contact_newsletter.sql

OPTION B - Use Prisma migrate (after updating schema.prisma):
-------------------------------------------------------------
1. Update your prisma/schema.prisma with the new models
2. Run: bun x prisma migrate dev --name add_prelaunch_features
3. Run: bun x prisma generate

"@ -ForegroundColor White
}

# ============================================
# STEP 5: Environment Variables Check
# ============================================
Write-Step "Environment variables to configure..."

Write-Host @"

Make sure these are set in your .env.local and Vercel:
-------------------------------------------------------
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@kollect-it.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM="Kollect-It <noreply@kollect-it.com>"
ADMIN_EMAIL=james@kollect-it.com

"@ -ForegroundColor White

# ============================================
# STEP 6: Git Commands
# ============================================
if (-not $SkipGit) {
    Write-Step "Git commands to run after copying files..."

    Write-Host @"

After copying all files, run these commands:
--------------------------------------------
git add -A
git status
git commit -m "feat: Add password reset, contact form, and newsletter functionality"
git push origin main

"@ -ForegroundColor White
}

# ============================================
# STEP 7: Testing Checklist
# ============================================
Write-Step "Post-deployment testing checklist..."

Write-Host @"

TEST THESE FEATURES:
--------------------
[ ] Visit /forgot-password - Should show reset form
[ ] Submit forgot password form - Should show success message
[ ] Check email OR console logs for reset URL
[ ] Visit /reset-password?token=xxx - Should show password form
[ ] Reset password - Should succeed and redirect to login
[ ] Visit /contact - Form should submit successfully
[ ] Check database for ContactSubmission record
[ ] Submit newsletter form in footer
[ ] Check database for NewsletterSubscriber record
[ ] Access /api/admin/reports (logged in as admin)

"@ -ForegroundColor White

# ============================================
# COMPLETE
# ============================================
Write-Host @"

╔═══════════════════════════════════════════════════════════════════╗
║                    DEPLOYMENT SCRIPT COMPLETE                     ║
╚═══════════════════════════════════════════════════════════════════╝

Next steps:
1. Copy all files from Claude's output to your project
2. Run the SQL migration in Supabase
3. Run: bun x prisma generate
4. Test locally: bun run dev
5. Commit and push to deploy

"@ -ForegroundColor Green
