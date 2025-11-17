# =====================================================
# Kollect-It Vercel Deployment Script
# =====================================================
# Automates Git commit and push to trigger Vercel deploy
# Usage: .\deploy-to-vercel.ps1 [-Message "Custom commit message"]

param(
    [string]$Message = "",
    [switch]$SkipChecks,
    [switch]$Force
)

$ErrorActionPreference = "Stop"

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

Write-Status "🚀 Deploying Kollect-It to Vercel" "Header"

# =====================================================
# 1. Pre-flight Checks (unless skipped)
# =====================================================
if (-not $SkipChecks) {
    Write-Status "Running pre-flight checks..." "Info"
    
    # Check if pre-deploy-check script exists
    if (Test-Path ".\scripts\pre-deploy-check.ps1") {
        & .\scripts\pre-deploy-check.ps1
        if ($LASTEXITCODE -ne 0 -and -not $Force) {
            Write-Status "Pre-flight checks failed. Use -Force to deploy anyway." "Error"
            exit 1
        }
    } elseif (Test-Path ".\pre-deploy-check.ps1") {
        & .\pre-deploy-check.ps1
        if ($LASTEXITCODE -ne 0 -and -not $Force) {
            Write-Status "Pre-flight checks failed. Use -Force to deploy anyway." "Error"
            exit 1
        }
    } else {
        Write-Status "Pre-flight check script not found - proceeding anyway" "Warning"
    }
}

# =====================================================
# 2. Check Git Status
# =====================================================
Write-Status "`nChecking Git status..." "Info"
$gitStatus = git status --porcelain 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Status "Not a git repository!" "Error"
    exit 1
}

if (-not $gitStatus -and -not $Force) {
    Write-Status "No changes to commit. Use -Force to push anyway." "Warning"
    $continue = Read-Host "Continue? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 0
    }
}

# =====================================================
# 3. Stage Changes
# =====================================================
Write-Status "`nStaging changes..." "Info"
git add -A

$stagedFiles = git diff --cached --name-only
if ($stagedFiles) {
    Write-Status "Staged files:" "Info"
    foreach ($file in $stagedFiles) {
        Write-Host "  - $file" -ForegroundColor Gray
    }
} else {
    Write-Status "No files staged" "Warning"
}

# =====================================================
# 4. Commit Changes
# =====================================================
Write-Status "`nCreating commit..." "Info"

if ([string]::IsNullOrWhiteSpace($Message)) {
    Write-Host "Enter commit message (or press Enter for default):" -ForegroundColor Yellow
    $Message = Read-Host
    
    if ([string]::IsNullOrWhiteSpace($Message)) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
        $Message = "Deploy: Phase 6 Analytics & Dashboards - $timestamp"
    }
}

Write-Status "Commit message: $Message" "Info"

try {
    git commit -m $Message
    Write-Status "Commit created successfully" "Success"
} catch {
    if ($_.Exception.Message -match "nothing to commit") {
        Write-Status "Nothing to commit - proceeding to push" "Warning"
    } else {
        Write-Status "Commit failed: $($_.Exception.Message)" "Error"
        exit 1
    }
}

# =====================================================
# 5. Push to GitHub
# =====================================================
Write-Status "`nPushing to GitHub..." "Info"

# Get current branch
$branch = git branch --show-current
Write-Status "Current branch: $branch" "Info"

# Temporarily disable SSL verification (for Windows Git certificate issues)
Write-Status "Configuring Git..." "Info"
git config --global http.sslVerify false

try {
    Write-Status "Pushing to origin/$branch..." "Info"
    git push origin $branch
    
    if ($LASTEXITCODE -eq 0) {
        Write-Status "Push successful! 🎉" "Success"
    } else {
        Write-Status "Push failed" "Error"
        exit 1
    }
} finally {
    # Re-enable SSL verification
    git config --global http.sslVerify true
}

# =====================================================
# 6. Deployment Information
# =====================================================
Write-Status "`n📋 Deployment Status" "Header"

# Try to get remote URL
$remoteUrl = git remote get-url origin 2>&1
if ($remoteUrl -match "github.com[:/](.+?)\.git") {
    $repoPath = $matches[1]
    Write-Status "Repository: https://github.com/$repoPath" "Info"
}

Write-Host ""
Write-Host "✨ GitHub push complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Go to Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Your deployment should auto-trigger in ~30 seconds" -ForegroundColor White
Write-Host "3. Build time: 2-3 minutes" -ForegroundColor White
Write-Host "4. Monitor at: https://vercel.com/[your-username]/kollect-it/deployments" -ForegroundColor White
Write-Host ""
Write-Host "🔍 If deployment doesn't start:" -ForegroundColor Yellow
Write-Host "- Verify GitHub integration in Vercel" -ForegroundColor White
Write-Host "- Check Vercel project settings" -ForegroundColor White
Write-Host "- Manually trigger: vercel --prod" -ForegroundColor White
Write-Host ""

# =====================================================
# 7. Open Vercel Dashboard (optional)
# =====================================================
$openDashboard = Read-Host "Open Vercel dashboard in browser? (Y/n)"
if ($openDashboard -ne "n" -and $openDashboard -ne "N") {
    Write-Status "Opening Vercel dashboard..." "Info"
    Start-Process "https://vercel.com/dashboard"
}

Write-Host "`n✅ Deployment script complete!" -ForegroundColor Green
Write-Host ""
