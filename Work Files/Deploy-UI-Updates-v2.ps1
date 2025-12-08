# ===========================================
# KOLLECT-IT DESIGN SYSTEM DEPLOYMENT SCRIPT
# Version 2.0 - December 2025
# ===========================================
#
# This script:
# 1. Creates timestamped backups of original files
# 2. Deploys font configuration
# 3. Deploys Batch 1 components
# 4. Logs all changes
#
# USAGE: 
#   1. Place all files from Claude in "Work Files" folder
#   2. Run this script from project root
#   3. Review changes and test
#
# ===========================================

# Configuration
$ProjectRoot = "C:\Users\james\kollect-it-marketplace-1"
$WorkFilesDir = "$ProjectRoot\Work Files"
$BackupDir = "$ProjectRoot\backups\ui-updates"
$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$LogFile = "$BackupDir\deployment-log-$Timestamp.txt"

# Create backup directory
New-Item -ItemType Directory -Path "$BackupDir\$Timestamp" -Force | Out-Null

# Logging function
function Write-Log {
    param([string]$Message)
    $LogMessage = "$(Get-Date -Format 'HH:mm:ss') - $Message"
    Write-Host $LogMessage
    Add-Content -Path $LogFile -Value $LogMessage
}

Write-Log "=========================================="
Write-Log "KOLLECT-IT DESIGN SYSTEM DEPLOYMENT"
Write-Log "Timestamp: $Timestamp"
Write-Log "=========================================="

# ===========================================
# STEP 1: FONT CONFIGURATION
# ===========================================

Write-Log ""
Write-Log "STEP 1: Font Configuration"
Write-Log "--------------------------"

$FontsSource = "$WorkFilesDir\fonts.ts"
$FontsDest = "$ProjectRoot\src\lib\fonts.ts"

if (Test-Path $FontsSource) {
    # Create lib directory if it doesn't exist
    $LibDir = "$ProjectRoot\src\lib"
    if (!(Test-Path $LibDir)) {
        New-Item -ItemType Directory -Path $LibDir -Force | Out-Null
        Write-Log "Created directory: src/lib/"
    }
    
    # Backup existing file if it exists
    if (Test-Path $FontsDest) {
        Copy-Item $FontsDest "$BackupDir\$Timestamp\fonts.ts.bak"
        Write-Log "Backed up existing fonts.ts"
    }
    
    # Deploy new file
    Copy-Item $FontsSource $FontsDest
    Write-Log "✓ Deployed fonts.ts to src/lib/"
} else {
    Write-Log "⚠ fonts.ts not found in Work Files (optional)"
}

# ===========================================
# STEP 2: BATCH 1 COMPONENTS
# ===========================================

Write-Log ""
Write-Log "STEP 2: Batch 1 Components"
Write-Log "--------------------------"

# Define file mappings: Source (in Work Files) -> Destination (in project)
$Batch1Files = @{
    "batch1-components\Footer.tsx" = "src\components\Footer.tsx"
    "batch1-components\ProductCard.tsx" = "src\components\ProductCard.tsx"
    "batch1-components\ProductReviews.tsx" = "src\components\product\ProductReviews.tsx"
    "batch1-components\RelatedProducts.tsx" = "src\components\product\RelatedProducts.tsx"
    "batch1-components\AesopSection.tsx" = "src\components\AesopSection.tsx"
    "batch1-components\ContactForm.tsx" = "src\components\forms\ContactForm.tsx"
}

$DeployedCount = 0
$SkippedCount = 0

foreach ($file in $Batch1Files.GetEnumerator()) {
    $SourcePath = "$WorkFilesDir\$($file.Key)"
    $DestPath = "$ProjectRoot\$($file.Value)"
    $FileName = Split-Path $file.Key -Leaf
    
    if (Test-Path $SourcePath) {
        # Create backup of original
        if (Test-Path $DestPath) {
            $BackupPath = "$BackupDir\$Timestamp\$FileName.bak"
            Copy-Item $DestPath $BackupPath
            Write-Log "Backed up: $FileName"
        }
        
        # Ensure destination directory exists
        $DestDir = Split-Path $DestPath -Parent
        if (!(Test-Path $DestDir)) {
            New-Item -ItemType Directory -Path $DestDir -Force | Out-Null
        }
        
        # Deploy file
        Copy-Item $SourcePath $DestPath
        Write-Log "✓ Deployed: $($file.Value)"
        $DeployedCount++
    } else {
        Write-Log "⚠ Not found: $($file.Key)"
        $SkippedCount++
    }
}

# ===========================================
# STEP 3: TYPOGRAPHY CSS (Manual Step)
# ===========================================

Write-Log ""
Write-Log "STEP 3: Typography CSS"
Write-Log "--------------------------"

$TypographySource = "$WorkFilesDir\typography-additions.css"
if (Test-Path $TypographySource) {
    # Copy to Work Files for reference, but don't auto-deploy
    Write-Log "⚠ typography-additions.css found"
    Write-Log "  → This file contains CSS to ADD to globals.css"
    Write-Log "  → You must manually copy the contents into src/app/globals.css"
    Write-Log "  → Add it inside or after the @layer utilities section"
} else {
    Write-Log "typography-additions.css not found (optional)"
}

# ===========================================
# SUMMARY
# ===========================================

Write-Log ""
Write-Log "=========================================="
Write-Log "DEPLOYMENT SUMMARY"
Write-Log "=========================================="
Write-Log "Files deployed: $DeployedCount"
Write-Log "Files skipped: $SkippedCount"
Write-Log "Backups saved to: backups\ui-updates\$Timestamp"
Write-Log "Log file: $LogFile"
Write-Log ""
Write-Log "MANUAL STEPS REQUIRED:"
Write-Log "1. Update src/app/layout.tsx to use fontVariables (see layout-update-instructions.tsx)"
Write-Log "2. Add typography-additions.css content to src/app/globals.css"
Write-Log "3. Run 'npm run dev' to test locally"
Write-Log "4. Check browser for any errors"
Write-Log ""

# Pause for review
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
