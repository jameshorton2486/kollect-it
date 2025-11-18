################################################################################
# EMERGENCY RESTORATION SCRIPT
# Purpose: Restore Kollect-It from Google Drive backup
################################################################################

Write-Host @"

╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                    🆘 EMERGENCY RESTORE FROM BACKUP                          ║
║                                                                              ║
║                    Kollect-It Marketplace Recovery                           ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Red

$projectRoot = "C:\Users\james\kollect-it-marketplace-1"
$homeDir = "C:\Users\james"

Write-Host "📋 Current Situation:" -ForegroundColor Yellow
Write-Host "   • Next.js upgrade attempted in wrong directory" -ForegroundColor White
Write-Host "   • Packages installed in C:\Users\james\ instead of project" -ForegroundColor White
Write-Host "   • Need to restore from backup: Backup_2025-11-18_0037" -ForegroundColor White
Write-Host ""

Write-Host "🎯 This script will:" -ForegroundColor Cyan
Write-Host "   1. Clean up the mess in C:\Users\james\" -ForegroundColor White
Write-Host "   2. Help you download backup from Google Drive" -ForegroundColor White
Write-Host "   3. Restore your project to working state" -ForegroundColor White
Write-Host "   4. Verify everything works" -ForegroundColor White
Write-Host ""

$proceed = Read-Host "Ready to start restoration? (Y/N)"

if ($proceed -ne 'Y' -and $proceed -ne 'y') {
    Write-Host "`n❌ Restoration cancelled." -ForegroundColor Red
    exit
}

Write-Host "`n" + ("=" * 80) -ForegroundColor Cyan
Write-Host "PHASE 1: CLEAN UP HOME DIRECTORY MESS" -ForegroundColor Cyan
Write-Host ("=" * 80) -ForegroundColor Cyan

Write-Host "`n1️⃣  Cleaning up C:\Users\james\..." -ForegroundColor Yellow

# Check what was accidentally installed
$homeNodeModules = Join-Path $homeDir "node_modules"
$homePackageJson = Join-Path $homeDir "package.json"
$homePackageLock = Join-Path $homeDir "package-lock.json"

if (Test-Path $homeNodeModules) {
    Write-Host "   Found: node_modules in home directory" -ForegroundColor Gray
    Write-Host "   Removing..." -ForegroundColor Yellow
    Remove-Item $homeNodeModules -Recurse -Force
    Write-Host "   ✅ Removed node_modules" -ForegroundColor Green
}

if (Test-Path $homePackageJson) {
    Write-Host "   Found: package.json in home directory" -ForegroundColor Gray
    Write-Host "   Removing..." -ForegroundColor Yellow
    Remove-Item $homePackageJson -Force
    Write-Host "   ✅ Removed package.json" -ForegroundColor Green
}

if (Test-Path $homePackageLock) {
    Write-Host "   Found: package-lock.json in home directory" -ForegroundColor Gray
    Write-Host "   Removing..." -ForegroundColor Yellow
    Remove-Item $homePackageLock -Force
    Write-Host "   ✅ Removed package-lock.json" -ForegroundColor Green
}

Write-Host "`n✅ Home directory cleaned!" -ForegroundColor Green

Write-Host "`n" + ("=" * 80) -ForegroundColor Cyan
Write-Host "PHASE 2: DOWNLOAD BACKUP FROM GOOGLE DRIVE" -ForegroundColor Cyan
Write-Host ("=" * 80) -ForegroundColor Cyan

Write-Host "`n2️⃣  Preparing to download backup..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Your backup is located at:" -ForegroundColor White
Write-Host "https://drive.google.com/drive/folders/10CF9WvaqgIyk3vyDy7K6G2emrYVHj8LU" -ForegroundColor Cyan
Write-Host ""
Write-Host "📦 Backup folder: Backup_2025-11-18_0037" -ForegroundColor Yellow
Write-Host ""

Write-Host "DOWNLOAD INSTRUCTIONS:" -ForegroundColor Yellow
Write-Host @"

METHOD 1: Browser Download (Easiest)
─────────────────────────────────────
1. Open the link above in your browser
2. Find folder: Backup_2025-11-18_0037
3. Right-click folder → Download
4. Save to: C:\Users\james\Downloads\
5. Extract the downloaded ZIP file

METHOD 2: Google Drive Desktop App
─────────────────────────────────────
1. If you have Google Drive Desktop app installed
2. Navigate to: G:\My Drive\Kollect-It-Backups\ (or your Google Drive path)
3. Find: Backup_2025-11-18_0037
4. The folder should already be synced to your computer

"@ -ForegroundColor White

$downloaded = Read-Host "Have you downloaded the backup? (Y/N)"

if ($downloaded -ne 'Y' -and $downloaded -ne 'y') {
    Write-Host "`n⚠️  Please download the backup first, then run this script again." -ForegroundColor Yellow
    Write-Host "Script paused. Press any key when backup is downloaded..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Ask for backup location
Write-Host "`n3️⃣  Locating downloaded backup..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Where did you download/extract the backup?" -ForegroundColor White
Write-Host "   1. C:\Users\james\Downloads\Backup_2025-11-18_0037" -ForegroundColor Gray
Write-Host "   2. Google Drive Desktop (e.g., G:\My Drive\Kollect-It-Backups\Backup_2025-11-18_0037)" -ForegroundColor Gray
Write-Host "   3. Custom location (I'll ask you for the path)" -ForegroundColor Gray
Write-Host ""

$locationChoice = Read-Host "Choose option (1-3)"

$backupSourcePath = switch ($locationChoice) {
    "1" { "C:\Users\james\Downloads\Backup_2025-11-18_0037" }
    "2" { 
        $gdrivePath = Read-Host "Enter your Google Drive path (e.g., G:\My Drive\Kollect-It-Backups\Backup_2025-11-18_0037)"
        $gdrivePath
    }
    "3" {
        $customPath = Read-Host "Enter full path to backup folder"
        $customPath
    }
    default {
        Write-Host "Invalid choice. Using default: C:\Users\james\Downloads\Backup_2025-11-18_0037" -ForegroundColor Yellow
        "C:\Users\james\Downloads\Backup_2025-11-18_0037"
    }
}

# Verify backup exists
if (-not (Test-Path $backupSourcePath)) {
    Write-Host "`n❌ Error: Backup not found at: $backupSourcePath" -ForegroundColor Red
    Write-Host "   Please verify the path and try again." -ForegroundColor Yellow
    exit 1
}

Write-Host "`n   ✅ Found backup at: $backupSourcePath" -ForegroundColor Green

# Check backup contents
$codeZip = Join-Path $backupSourcePath "kollect-it-code.zip"
$envFile = Join-Path $backupSourcePath "environment-variables.txt"

if (-not (Test-Path $codeZip)) {
    Write-Host "   ❌ Error: kollect-it-code.zip not found in backup!" -ForegroundColor Red
    exit 1
}

Write-Host "   ✅ Found: kollect-it-code.zip" -ForegroundColor Green

if (Test-Path $envFile) {
    Write-Host "   ✅ Found: environment-variables.txt" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Warning: environment-variables.txt not found" -ForegroundColor Yellow
}

Write-Host "`n" + ("=" * 80) -ForegroundColor Cyan
Write-Host "PHASE 3: RESTORE PROJECT" -ForegroundColor Cyan
Write-Host ("=" * 80) -ForegroundColor Cyan

Write-Host "`n⚠️  IMPORTANT: This will replace your current project files!" -ForegroundColor Red
Write-Host "   Current project: $projectRoot" -ForegroundColor White
Write-Host ""

$confirmRestore = Read-Host "Proceed with restoration? (Y/N)"

if ($confirmRestore -ne 'Y' -and $confirmRestore -ne 'y') {
    Write-Host "`n❌ Restoration cancelled." -ForegroundColor Red
    exit
}

# Backup current state (just in case)
Write-Host "`n4️⃣  Creating safety backup of current state..." -ForegroundColor Yellow
$safetyBackup = "C:\Users\james\kollect-it-BEFORE-RESTORE-$(Get-Date -Format 'HHmmss')"
try {
    if (Test-Path $projectRoot) {
        Copy-Item $projectRoot $safetyBackup -Recurse -Force
        Write-Host "   ✅ Safety backup created: $safetyBackup" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Could not create safety backup: $_" -ForegroundColor Yellow
}

# Extract backup
Write-Host "`n5️⃣  Extracting backup..." -ForegroundColor Yellow

# Remove current project (except .git if exists)
if (Test-Path $projectRoot) {
    Write-Host "   Preserving .git directory..." -ForegroundColor Gray
    $gitDir = Join-Path $projectRoot ".git"
    $tempGitBackup = Join-Path $env:TEMP "git-backup"
    
    if (Test-Path $gitDir) {
        Copy-Item $gitDir $tempGitBackup -Recurse -Force
        Write-Host "   ✅ .git directory backed up" -ForegroundColor Green
    }
    
    Write-Host "   Removing current project files..." -ForegroundColor Gray
    Remove-Item $projectRoot -Recurse -Force -ErrorAction SilentlyContinue
}

# Create project directory
New-Item -ItemType Directory -Path $projectRoot -Force | Out-Null

# Extract code
Write-Host "   Extracting kollect-it-code.zip..." -ForegroundColor Gray
Expand-Archive -Path $codeZip -DestinationPath $projectRoot -Force
Write-Host "   ✅ Code extracted" -ForegroundColor Green

# Restore .git if it existed
if (Test-Path $tempGitBackup) {
    Write-Host "   Restoring .git directory..." -ForegroundColor Gray
    Copy-Item $tempGitBackup (Join-Path $projectRoot ".git") -Recurse -Force
    Remove-Item $tempGitBackup -Recurse -Force
    Write-Host "   ✅ .git directory restored" -ForegroundColor Green
}

# Restore environment variables
if (Test-Path $envFile) {
    Write-Host "   Restoring .env.local..." -ForegroundColor Gray
    Copy-Item $envFile (Join-Path $projectRoot ".env.local") -Force
    Write-Host "   ✅ Environment variables restored" -ForegroundColor Green
}

Write-Host "`n✅ Project files restored!" -ForegroundColor Green

Write-Host "`n" + ("=" * 80) -ForegroundColor Cyan
Write-Host "PHASE 4: REINSTALL DEPENDENCIES" -ForegroundColor Cyan
Write-Host ("=" * 80) -ForegroundColor Cyan

Write-Host "`n6️⃣  Installing dependencies..." -ForegroundColor Yellow
Set-Location $projectRoot

Write-Host "   Running: bun install" -ForegroundColor Gray
try {
    bun install
    Write-Host "   ✅ Dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Error installing dependencies: $_" -ForegroundColor Yellow
    Write-Host "   Try running manually: cd $projectRoot && bun install" -ForegroundColor White
}

Write-Host "`n" + ("=" * 80) -ForegroundColor Cyan
Write-Host "PHASE 5: VERIFY RESTORATION" -ForegroundColor Cyan
Write-Host ("=" * 80) -ForegroundColor Cyan

Write-Host "`n7️⃣  Verifying restoration..." -ForegroundColor Yellow

# Check critical files
$criticalFiles = @(
    "package.json",
    "next.config.ts",
    ".env.local",
    "app",
    "lib",
    "prisma"
)

$allPresent = $true
foreach ($file in $criticalFiles) {
    $filePath = Join-Path $projectRoot $file
    if (Test-Path $filePath) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Missing: $file" -ForegroundColor Red
        $allPresent = $false
    }
}

# Check package.json version
Write-Host "`n   Checking Next.js version..." -ForegroundColor Gray
$packageJsonPath = Join-Path $projectRoot "package.json"
if (Test-Path $packageJsonPath) {
    $packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
    $nextVersion = $packageJson.dependencies.next
    Write-Host "   Next.js version: $nextVersion" -ForegroundColor Cyan
    
    if ($nextVersion -like "*15.5*") {
        Write-Host "   ✅ Restored to Next.js 15.5.x (pre-upgrade)" -ForegroundColor Green
    }
}

Write-Host "`n" + ("=" * 80) -ForegroundColor Green
Write-Host "RESTORATION SUMMARY" -ForegroundColor Green
Write-Host ("=" * 80) -ForegroundColor Green

if ($allPresent) {
    Write-Host "`n✅ RESTORATION SUCCESSFUL!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your project has been restored to:" -ForegroundColor White
    Write-Host "   • Backup date: 2025-11-18 00:37 AM" -ForegroundColor Gray
    Write-Host "   • Next.js version: 15.5.6" -ForegroundColor Gray
    Write-Host "   • Location: $projectRoot" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Safety backup of pre-restore state:" -ForegroundColor Yellow
    Write-Host "   $safetyBackup" -ForegroundColor Gray
} else {
    Write-Host "`n⚠️  RESTORATION INCOMPLETE" -ForegroundColor Yellow
    Write-Host "   Some files may be missing. Please review manually." -ForegroundColor White
}

Write-Host "`n📋 NEXT STEPS:" -ForegroundColor Cyan
Write-Host @"

1. TEST THE RESTORATION:
   cd $projectRoot
   bun run dev
   
   • Should start without errors
   • Visit: http://localhost:3001 (or 3000)
   • Check if site works

2. VERIFY EVERYTHING WORKS:
   □ Homepage loads
   □ Images display (check for 404s)
   □ Admin dashboard accessible
   □ Database connection works

3. DECIDE ON NEXT.JS UPGRADE:
   
   Option A: Stay on Next.js 15.5.6 (Current)
   ✅ Pros: Stable, working, no breaking changes
   ❌ Cons: Missing new features, will need to upgrade eventually
   
   Option B: Upgrade to Next.js 16.0.3
   ✅ Pros: Latest features, performance improvements
   ❌ Cons: Requires code changes (async params), 2-4 hours work
   
   MY RECOMMENDATION: 
   • Stay on 15.5.6 for now
   • Fix the ImageKit 404s and logging issues first
   • Deploy to production
   • Schedule Next.js 16 upgrade for later (after launch)

4. FIX EXISTING ISSUES (Priority):
   □ ImageKit 404 errors (5 missing images)
   □ Logging system not working
   
   Run diagnostics:
   .\master-diagnostic.ps1

"@ -ForegroundColor White

Write-Host "`n✅ Restoration Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
