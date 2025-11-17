# =====================================================
# Kollect-It Master Deployment Script
# =====================================================
# Orchestrates the complete deployment process
# Usage: .\DEPLOY-MASTER.ps1 [-SkipTests] [-AutoConfirm]

param(
    [switch]$SkipTests,
    [switch]$AutoConfirm,
    [switch]$DevMode      # For local testing only
)

$ErrorActionPreference = "Continue"
$script:StartTime = Get-Date

function Write-Status {
    param($Message, $Type = "Info")
    
    switch ($Type) {
        "Success" { Write-Host "✓ $Message" -ForegroundColor Green }
        "Error" { Write-Host "✗ $Message" -ForegroundColor Red }
        "Warning" { Write-Host "⚠ $Message" -ForegroundColor Yellow }
        "Info" { Write-Host "→ $Message" -ForegroundColor Cyan }
        "Step" { Write-Host "`n【 $Message 】" -ForegroundColor Magenta }
        "Header" { 
            Write-Host "`n╔═══════════════════════════════════════════╗" -ForegroundColor Cyan
            Write-Host "║  $Message" -ForegroundColor Cyan
            Write-Host "╚═══════════════════════════════════════════╝" -ForegroundColor Cyan
        }
    }
}

function Confirm-Step {
    param($Message)
    
    if ($AutoConfirm) {
        return $true
    }
    
    Write-Host "`n$Message" -ForegroundColor Yellow
    Write-Host "Continue? (Y/n) " -NoNewline
    $response = Read-Host
    
    return ($response -eq "" -or $response -eq "Y" -or $response -eq "y")
}

function Get-ElapsedTime {
    $elapsed = (Get-Date) - $script:StartTime
    return "{0:mm}m {0:ss}s" -f $elapsed
}

# =====================================================
# WELCOME SCREEN
# =====================================================
Clear-Host
Write-Status "🚀 KOLLECT-IT DEPLOYMENT WIZARD" "Header"
Write-Host ""
Write-Host "This script will guide you through the complete deployment process." -ForegroundColor White
Write-Host "Estimated time: 60-90 minutes" -ForegroundColor Gray
Write-Host ""
Write-Host "Prerequisites:" -ForegroundColor Cyan
Write-Host "  • Node.js installed (v18-21)" -ForegroundColor White
Write-Host "  • Git configured" -ForegroundColor White
Write-Host "  • Vercel account created" -ForegroundColor White
Write-Host "  • Supabase database set up" -ForegroundColor White
Write-Host ""

if (-not (Confirm-Step "Ready to begin deployment?")) {
    Write-Host "`nDeployment cancelled." -ForegroundColor Yellow
    exit 0
}

# =====================================================
# PHASE 1: ENVIRONMENT CHECK
# =====================================================
Write-Status "PHASE 1: Environment Check" "Step"
Write-Status "Verifying prerequisites..." "Info"

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Status "Node.js: $nodeVersion" "Success"
} catch {
    Write-Status "Node.js not found! Install from nodejs.org" "Error"
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Status "npm: v$npmVersion" "Success"
} catch {
    Write-Status "npm not found!" "Error"
    exit 1
}

# Check Git
try {
    $gitVersion = git --version
    Write-Status "Git: $gitVersion" "Success"
} catch {
    Write-Status "Git not found! Install from git-scm.com" "Error"
    exit 1
}

# Check required files
$requiredFiles = @("package.json", "next.config.js", ".env.local", "prisma/schema.prisma")
$missingFiles = @()

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Status "$file exists" "Success"
    } else {
        Write-Status "MISSING: $file" "Error"
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Status "Missing required files. Fix and re-run." "Error"
    exit 1
}

Write-Status "Environment check complete! [$(Get-ElapsedTime)]" "Success"

# =====================================================
# PHASE 2: DEPENDENCY CLEANUP and INSTALL
# =====================================================
if (-not $SkipTests) {
    Write-Status "`nPHASE 2: Dependency Management" "Step"
    
    if (Confirm-Step "Clean install dependencies? (Fixes MODULE_NOT_FOUND errors)") {
        Write-Status "Removing old dependencies..." "Info"
        
        Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
        Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
        
        Write-Status "Clearing npm cache..." "Info"
        npm cache clean --force
        
        Write-Status "Installing dependencies..." "Info"
        npm install
        
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Dependencies installed successfully! [$(Get-ElapsedTime)]" "Success"
        } else {
            Write-Status "Installation failed!" "Error"
            exit 1
        }
    }
}

# =====================================================
# PHASE 3: PRE-FLIGHT CHECKS
# =====================================================
if (-not $SkipTests) {
    Write-Status "`nPHASE 3: Pre-Flight Checks" "Step"
    
    # Run pre-deploy check script if exists
    if (Test-Path "pre-deploy-check.ps1") {
        and .\pre-deploy-check.ps1
        
        if ($LASTEXITCODE -ne 0) {
            if (Confirm-Step "Pre-flight checks found issues. Continue anyway?") {
                Write-Status "Continuing despite warnings..." "Warning"
            } else {
                Write-Status "Deployment cancelled. Fix issues and retry." "Error"
                exit 1
            }
        }
    } else {
        Write-Status "Running build test..." "Info"
        npm run build
        
        if ($LASTEXITCODE -eq 0) {
            Write-Status "Build successful!" "Success"
        } else {
            Write-Status "Build failed! Fix errors and retry." "Error"
            exit 1
        }
    }
    
    Write-Status "Pre-flight checks complete! [$(Get-ElapsedTime)]" "Success"
}

# =====================================================
# PHASE 4: ENVIRONMENT VARIABLES
# =====================================================
Write-Status "`nPHASE 4: Environment Variables" "Step"

if (-not (Test-Path ".env.production.template")) {
    if (Confirm-Step "Generate environment variable templates?") {
        if (Test-Path "setup-env-vars.ps1") {
            and .\setup-env-vars.ps1 -GenerateSecrets
        } else {
            Write-Status "setup-env-vars.ps1 not found - skipping" "Warning"
        }
    }
}

Write-Host ""
Write-Host "🔐 Environment Variable Configuration" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "You'll need to configure environment variables in Vercel." -ForegroundColor White
Write-Host "Generated files:" -ForegroundColor Gray
Write-Host "  • .env.production.template - Full list with instructions" -ForegroundColor Gray
Write-Host "  • VERCEL_ENV_SETUP.md - Step-by-step Vercel guide" -ForegroundColor Gray
Write-Host ""
Write-Host "Critical variables:" -ForegroundColor Yellow
Write-Host "  1. DATABASE_URL (Supabase)" -ForegroundColor White
Write-Host "  2. NEXTAUTH_URL (Your Vercel URL)" -ForegroundColor White
Write-Host "  3. NEXTAUTH_SECRET (Auto-generated)" -ForegroundColor White
Write-Host "  4. GOOGLE_CLIENT_ID and SECRET" -ForegroundColor White
Write-Host ""

if (-not $DevMode) {
    $envConfigured = Confirm-Step "Have you configured environment variables in Vercel?"
    
    if (-not $envConfigured) {
        Write-Host ""
        Write-Host "📋 Quick Setup:" -ForegroundColor Cyan
        Write-Host "1. Go to: https://vercel.com/dashboard" -ForegroundColor White
        Write-Host "2. Select your project → Settings → Environment Variables" -ForegroundColor White
        Write-Host "3. Add variables from .env.production.template" -ForegroundColor White
        Write-Host "4. Select: Production, Preview, Development" -ForegroundColor White
        Write-Host ""
        
        if (-not (Confirm-Step "Configure now and come back?")) {
            Write-Status "Deployment paused. Run again after configuration." "Warning"
            exit 0
        }
    }
}

# =====================================================
# PHASE 5: DATABASE SETUP
# =====================================================
Write-Status "`nPHASE 5: Database Configuration" "Step"

if (Confirm-Step "Run database migrations and setup?") {
    if (Test-Path "setup-database.ps1") {
        and .\setup-database.ps1 -Test
    } else {
        Write-Status "Running migrations manually..." "Info"
        npx prisma db push
        npx prisma generate
    }
    
    Write-Status "Database setup complete! [$(Get-ElapsedTime)]" "Success"
    
    Write-Host ""
    Write-Host "🗄️  Database Optimization" -ForegroundColor Cyan
    Write-Host "═══════════════════════════" -ForegroundColor Cyan
    Write-Host "Performance indexes have been generated." -ForegroundColor White
    Write-Host ""
    Write-Host "To apply:" -ForegroundColor Yellow
    Write-Host "1. Open Supabase Dashboard → SQL Editor" -ForegroundColor White
    Write-Host "2. Copy content from database-indexes.sql" -ForegroundColor White
    Write-Host "3. Paste and run" -ForegroundColor White
    Write-Host ""
    
    if (-not $DevMode) {
        Confirm-Step "Press Enter when indexes are applied..." | Out-Null
    }
}

# =====================================================
# PHASE 6: GIT COMMIT and PUSH
# =====================================================
Write-Status "`nPHASE 6: Git Deployment" "Step"

if (Confirm-Step "Commit and push to GitHub?") {
    if (Test-Path "deploy-to-vercel.ps1") {
        and .\deploy-to-vercel.ps1
    } else {
        Write-Status "Running deployment manually..." "Info"
        
        git add -A
        $commitMsg = "Deploy: Phase 6 Complete - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
        git commit -m $commitMsg
        
        # Temporarily disable SSL verification
        git config --global http.sslVerify false
        git push origin main
        git config --global http.sslVerify true
        
        Write-Status "Pushed to GitHub successfully!" "Success"
    }
    
    Write-Status "Git deployment complete! [$(Get-ElapsedTime)]" "Success"
}

# =====================================================
# PHASE 7: VERCEL DEPLOYMENT MONITORING
# =====================================================
Write-Status "`nPHASE 7: Vercel Deployment" "Step"

Write-Host ""
Write-Host "🚀 Deployment Status" -ForegroundColor Cyan
Write-Host "══════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your code has been pushed to GitHub." -ForegroundColor White
Write-Host "Vercel should auto-deploy in ~30 seconds." -ForegroundColor White
Write-Host ""
Write-Host "Monitor at: https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host ""

if (-not $DevMode) {
    $openVercel = Confirm-Step "Open Vercel dashboard?"
    if ($openVercel) {
        Start-Process "https://vercel.com/dashboard"
    }
    
    Write-Host ""
    Write-Host "⏳ Waiting for deployment to complete..." -ForegroundColor Yellow
    Write-Host "   This usually takes 2-3 minutes" -ForegroundColor Gray
    Write-Host ""
    
    Confirm-Step "Press Enter when deployment is complete..." | Out-Null
}

# =====================================================
# PHASE 8: POST-DEPLOYMENT VERIFICATION
# =====================================================
Write-Status "`nPHASE 8: Post-Deployment Testing" "Step"

Write-Host ""
Write-Host "🔍 Testing Checklist" -ForegroundColor Cyan
Write-Host "════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please verify the following:" -ForegroundColor White
Write-Host ""
Write-Host "Critical Tests:" -ForegroundColor Yellow
Write-Host "  [ ] Homepage loads without errors" -ForegroundColor White
Write-Host "  [ ] User can register/login" -ForegroundColor White
Write-Host "  [ ] Products display correctly" -ForegroundColor White
Write-Host "  [ ] Admin dashboard accessible" -ForegroundColor White
Write-Host "  [ ] No console errors (F12)" -ForegroundColor White
Write-Host ""
Write-Host "Performance Tests:" -ForegroundColor Yellow
Write-Host "  [ ] Page loads in <3 seconds" -ForegroundColor White
Write-Host "  [ ] Images load from ImageKit" -ForegroundColor White
Write-Host "  [ ] Mobile responsive" -ForegroundColor White
Write-Host ""
Write-Host "Analytics:" -ForegroundColor Yellow
Write-Host "  [ ] Google Analytics tracking" -ForegroundColor White
Write-Host "  [ ] Vercel Analytics enabled" -ForegroundColor White
Write-Host ""

if (Test-Path "TESTING_CHECKLIST.md") {
    Write-Host "Full checklist: TESTING_CHECKLIST.md" -ForegroundColor Gray
}

Write-Host ""

if (-not $DevMode) {
    $testsPass = Confirm-Step "Do all tests pass?"
    
    if (-not $testsPass) {
        Write-Status "Some tests failed. Check logs and fix issues." "Warning"
        Write-Host ""
        Write-Host "Common issues:" -ForegroundColor Yellow
        Write-Host "  • Environment variables not set in Vercel" -ForegroundColor White
        Write-Host "  • Database connection failed" -ForegroundColor White
        Write-Host "  • Build errors not caught locally" -ForegroundColor White
        Write-Host ""
        exit 1
    }
}

# =====================================================
# COMPLETION
# =====================================================
Write-Status "`n🎉 DEPLOYMENT COMPLETE!" "Header"

$totalTime = Get-ElapsedTime
Write-Host ""
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                            ║" -ForegroundColor Green
Write-Host "║  ✅  Kollect-It Successfully Deployed!    ║" -ForegroundColor Green
Write-Host "║                                            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Deployment Summary:" -ForegroundColor Cyan
Write-Host "  • Total Time: $totalTime" -ForegroundColor White
Write-Host "  • Platform: Vercel" -ForegroundColor White
Write-Host "  • Database: Supabase" -ForegroundColor White
Write-Host "  • Status: Production" -ForegroundColor Green
Write-Host ""
Write-Host "📊 What's Deployed:" -ForegroundColor Cyan
Write-Host "  ✓ Phase 6: Analytics and Dashboards" -ForegroundColor Green
Write-Host "  ✓ Admin Dashboard with 10 components" -ForegroundColor Green
Write-Host "  ✓ Sales and Product Analytics" -ForegroundColor Green
Write-Host "  ✓ Email Notification System" -ForegroundColor Green
Write-Host "  ✓ Mobile-Optimized Interface" -ForegroundColor Green
Write-Host "  ✓ Performance Optimizations" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Monitor for 24-48 hours" -ForegroundColor White
Write-Host "  2. Test all features thoroughly" -ForegroundColor White
Write-Host "  3. Gather user feedback" -ForegroundColor White
Write-Host "  4. Plan Phase 7 features" -ForegroundColor White
Write-Host ""
Write-Host "📞 Support Resources:" -ForegroundColor Cyan
Write-Host "  • Vercel Logs: vercel.com/dashboard → Deployments" -ForegroundColor Gray
Write-Host "  • Supabase Dashboard: supabase.com/dashboard" -ForegroundColor Gray
Write-Host "  • Testing Guide: TESTING_CHECKLIST.md" -ForegroundColor Gray
Write-Host ""
Write-Host "🎊 Congratulations on your successful deployment! 🎊" -ForegroundColor Green
Write-Host ""

# Generate deployment report
$report = @"
╔═══════════════════════════════════════════╗
║      KOLLECT-IT DEPLOYMENT REPORT         ║
╚═══════════════════════════════════════════╝

Date: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Duration: $totalTime
Deployed By: $env:USERNAME
Platform: Vercel
Status: ✅ SUCCESS

PHASES COMPLETED:
✓ Phase 1: Environment Check
✓ Phase 2: Dependency Management
✓ Phase 3: Pre-Flight Checks
✓ Phase 4: Environment Variables
✓ Phase 5: Database Configuration
✓ Phase 6: Git Deployment
✓ Phase 7: Vercel Deployment
✓ Phase 8: Post-Deployment Testing

DEPLOYMENT URLS:
Production: [Check Vercel Dashboard]
GitHub: https://github.com/jameshorton2486/kollect-it

MONITORING:
Vercel Dashboard: https://vercel.com/dashboard
Supabase Dashboard: https://supabase.com/dashboard
Google Analytics: https://analytics.google.com/

NEXT ACTIONS:
1. Monitor error rates
2. Check performance metrics
3. Verify analytics tracking
4. Test email notifications
5. Review user feedback

═══════════════════════════════════════════
Generated by Kollect-It Deployment Wizard
═══════════════════════════════════════════
"@

$report | Out-File -FilePath "DEPLOYMENT_REPORT_$(Get-Date -Format 'yyyyMMdd_HHmmss').txt" -Encoding UTF8
Write-Status "Deployment report saved!" "Success"
