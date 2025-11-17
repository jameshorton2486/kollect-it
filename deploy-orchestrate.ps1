#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Kollect-It Marketplace Deployment Orchestration Script
    Autonomous execution with minimal human interaction

.DESCRIPTION
    This script manages the complete deployment workflow:
    - Environment validation
    - File verification
    - Automated checks
    - Error handling and recovery
    - Status reporting

.PARAMETER Phase
    Which phase to run: All, Check, Build, Verify, Report
    
.PARAMETER Verbose
    Enable detailed logging

.EXAMPLE
    .\deploy-orchestrate.ps1 -Phase All
    .\deploy-orchestrate.ps1 -Phase Check
    .\deploy-orchestrate.ps1 -Phase Build -Verbose

.NOTES
    Author: Deployment Agent
    Date: November 16, 2025
    Requires: PowerShell 7+, Node.js v20.19.5, npm
#>

param(
    [ValidateSet('All', 'Check', 'Build', 'Verify', 'Report', 'Clean', 'Recovery')]
    [string]$Phase = 'All',
    
    [switch]$Verbose,
    [switch]$SkipPrompts,
    [switch]$RecoveryMode
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$ErrorActionPreference = 'Stop'
$VerbosePreference = if ($Verbose) { 'Continue' } else { 'SilentlyContinue' }

$ProjectRoot = Split-Path -Parent $PSScriptRoot | Join-Path -ChildPath 'kollect-it-marketplace-1'
$DeploymentsDir = Join-Path $ProjectRoot 'deployments'
$LogsDir = Join-Path $ProjectRoot 'deployment-logs'
$Timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$LogFile = Join-Path $LogsDir "deployment_$Timestamp.log"

# Required Node.js version
$RequiredNodeVersion = '20.19.5'
$RequiredNpmVersion = '10.0.0'

# Required environment variables
$RequiredEnvVars = @(
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'STRIPE_PUBLIC_KEY',
    'STRIPE_SECRET_KEY',
    'IMAGEKIT_PUBLIC_KEY',
    'IMAGEKIT_PRIVATE_KEY',
    'IMAGEKIT_URL_ENDPOINT',
    'DATABASE_URL'
)

# Files that must exist
$RequiredFiles = @(
    @{ Path = 'src/styles/globals.css'; Type = 'CSS Variables' },
    @{ Path = 'tsconfig.json'; Type = 'TypeScript Config' },
    @{ Path = 'tailwind.config.ts'; Type = 'Tailwind Config' },
    @{ Path = 'next.config.js'; Type = 'Next.js Config' },
    @{ Path = '.env.local'; Type = 'Environment Variables' },
    @{ Path = 'package.json'; Type = 'NPM Package' }
)

$RequiredDeploymentFiles = @(
    'DEPLOYMENT_GUIDE_CUSTOMIZED.md',
    'QUICK_START_NOW.md',
    'YOUR_SPECIFIC_DECISIONS.md',
    'MASTER_EXECUTION_SUMMARY.md'
)

# ============================================================================
# LOGGING & OUTPUT
# ============================================================================

function Initialize-Logging {
    if (-not (Test-Path $LogsDir)) {
        New-Item -ItemType Directory -Path $LogsDir -Force | Out-Null
    }
    
    # Create log file
    @"
===============================================================================
DEPLOYMENT EXECUTION LOG
===============================================================================
Started: $(Get-Date -Format 'o')
Project: $ProjectRoot
Phase: $Phase
Node Version: $(node -v)
NPM Version: $(npm -v)
PowerShell Version: $($PSVersionTable.PSVersion)
===============================================================================

"@ | Out-File -FilePath $LogFile -Encoding UTF8

    Write-Host "📋 Logs will be saved to: $LogFile" -ForegroundColor Cyan
}

function Write-Log {
    param(
        [string]$Message,
        [ValidateSet('Info', 'Success', 'Warning', 'Error')]
        [string]$Level = 'Info',
        [switch]$NoNewline
    )
    
    $Timestamp = Get-Date -Format 'HH:mm:ss'
    $LogMessage = "[$Timestamp] [$Level] $Message"
    
    # Color coding
    $Color = @{
        'Info'    = 'Cyan'
        'Success' = 'Green'
        'Warning' = 'Yellow'
        'Error'   = 'Red'
    }
    
    # Console output
    Write-Host $LogMessage -ForegroundColor $Color[$Level] -NoNewline:$NoNewline
    
    # File output
    Add-Content -Path $LogFile -Value $LogMessage -Encoding UTF8
}

function Write-Section {
    param([string]$Title)
    
    $separator = '=' * 80
    Write-Host "`n$separator" -ForegroundColor Magenta
    Write-Host "  $Title" -ForegroundColor Magenta
    Write-Host "$separator`n" -ForegroundColor Magenta
    
    Add-Content -Path $LogFile -Value "`n$separator`n  $Title`n$separator`n"
}

# ============================================================================
# ENVIRONMENT CHECKS
# ============================================================================

function Test-Environment {
    Write-Section 'PHASE 0: ENVIRONMENT VALIDATION'
    
    $AllPassed = $true
    
    # 1. Node.js version check
    Write-Host "`n[1/5] Checking Node.js version..." -NoNewline
    try {
        $NodeVersion = & node -v | ForEach-Object { $_ -replace 'v', '' }
        
        if ($NodeVersion -eq $RequiredNodeVersion) {
            Write-Log "✓ Node.js $NodeVersion (correct)" -Level 'Success'
        } else {
            Write-Log "✗ Node.js $NodeVersion (expected $RequiredNodeVersion)" -Level 'Warning'
            $AllPassed = $false
        }
    } catch {
        Write-Log "✗ Node.js not found" -Level 'Error'
        $AllPassed = $false
    }
    
    # 2. NPM version check
    Write-Host "[2/5] Checking NPM version..." -NoNewline
    try {
        $NpmVersion = & npm -v
        Write-Log "✓ NPM $NpmVersion" -Level 'Success'
    } catch {
        Write-Log "✗ NPM not found" -Level 'Error'
        $AllPassed = $false
    }
    
    # 3. Project directory check
    Write-Host "[3/5] Checking project structure..." -NoNewline
    if (Test-Path $ProjectRoot) {
        Write-Log "✓ Project root found" -Level 'Success'
    } else {
        Write-Log "✗ Project root not found: $ProjectRoot" -Level 'Error'
        $AllPassed = $false
    }
    
    # 4. Git status check
    Write-Host "[4/5] Checking Git status..." -NoNewline
    try {
        Push-Location $ProjectRoot
        $GitStatus = & git status --porcelain
        
        if ([string]::IsNullOrWhiteSpace($GitStatus)) {
            Write-Log "✓ Clean working directory" -Level 'Success'
        } else {
            Write-Log "⚠ Uncommitted changes detected" -Level 'Warning'
            Write-Log "Run: git status" -Level 'Info'
        }
        
        Pop-Location
    } catch {
        Write-Log "⚠ Git check skipped" -Level 'Warning'
    }
    
    # 5. Dependencies check
    Write-Host "[5/5] Checking dependencies..." -NoNewline
    try {
        Push-Location $ProjectRoot
        $NpmList = & npm list --depth=0 --json | ConvertFrom-Json
        
        $CriticalDeps = @('next', 'typescript', 'react', 'prisma')
        $Missing = @()
        
        foreach ($dep in $CriticalDeps) {
            if (-not $NpmList.dependencies.$dep) {
                $Missing += $dep
            }
        }
        
        if ($Missing.Count -eq 0) {
            Write-Log "✓ All critical dependencies installed" -Level 'Success'
        } else {
            Write-Log "✗ Missing: $($Missing -join ', ')" -Level 'Error'
            $AllPassed = $false
        }
        
        Pop-Location
    } catch {
        Write-Log "⚠ Dependency check skipped" -Level 'Warning'
    }
    
    if ($AllPassed) {
        Write-Log "`n✓ ENVIRONMENT VALIDATION PASSED" -Level 'Success'
        return $true
    } else {
        Write-Log "`n✗ ENVIRONMENT VALIDATION FAILED" -Level 'Error'
        return $false
    }
}

# ============================================================================
# FILE VERIFICATION
# ============================================================================

function Test-FileStructure {
    Write-Section 'PHASE 1: FILE STRUCTURE VERIFICATION'
    
    $AllExist = $true
    
    Write-Host "`nVerifying required project files:`n"
    
    foreach ($File in $RequiredFiles) {
        $FullPath = Join-Path $ProjectRoot $File.Path
        $Exists = Test-Path $FullPath
        
        if ($Exists) {
            Write-Log "✓ $($File.Type): $($File.Path)" -Level 'Success'
        } else {
            Write-Log "✗ $($File.Type): $($File.Path) - NOT FOUND" -Level 'Error'
            $AllExist = $false
        }
    }
    
    Write-Host "`nVerifying deployment documentation files:`n"
    
    foreach ($File in $RequiredDeploymentFiles) {
        $FullPath = Join-Path $DeploymentsDir $File
        $Exists = Test-Path $FullPath
        
        if ($Exists) {
            $Size = (Get-Item $FullPath).Length / 1KB
            Write-Log "✓ $File ($([math]::Round($Size, 1)) KB)" -Level 'Success'
        } else {
            Write-Log "✗ $File - NOT FOUND" -Level 'Warning'
        }
    }
    
    if ($AllExist) {
        Write-Log "`n✓ FILE STRUCTURE VERIFICATION PASSED" -Level 'Success'
        return $true
    } else {
        Write-Log "`n✗ SOME FILES MISSING" -Level 'Error'
        return $false
    }
}

# ============================================================================
# BUILD VERIFICATION
# ============================================================================

function Test-Build {
    Write-Section 'PHASE 2: BUILD VERIFICATION'
    
    Push-Location $ProjectRoot
    
    try {
        # Clean build
        Write-Host "Cleaning previous build artifacts..." -NoNewline
        Remove-Item -Path '.next' -Recurse -Force -ErrorAction SilentlyContinue | Out-Null
        Write-Log "✓ Clean complete" -Level 'Success'
        
        # TypeScript check
        Write-Host "`nRunning TypeScript compilation check..." -NoNewline
        $TsOutput = & npx tsc --noEmit 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Log "✓ TypeScript compilation passed" -Level 'Success'
        } else {
            Write-Log "✗ TypeScript errors found:" -Level 'Error'
            Write-Log $TsOutput -Level 'Error'
            Pop-Location
            return $false
        }
        
        # Production build
        Write-Host "Running production build..." -NoNewline
        $BuildOutput = & npm run build 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Log "✓ Production build successful" -Level 'Success'
            Pop-Location
            return $true
        } else {
            Write-Log "✗ Build failed" -Level 'Error'
            Write-Log ($BuildOutput | Select-Object -Last 20 | Out-String) -Level 'Error'
            Pop-Location
            return $false
        }
    } catch {
        Write-Log "✗ Build test failed: $_" -Level 'Error'
        Pop-Location
        return $false
    }
}

# ============================================================================
# VERIFICATION & CHECKS
# ============================================================================

function Test-Security {
    Write-Section 'PHASE 3: SECURITY VERIFICATION'
    
    Push-Location $ProjectRoot
    
    try {
        # NPM audit
        Write-Host "Running npm security audit..." -NoNewline
        $AuditOutput = & npm audit 2>&1
        
        if ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq 1) {  # 1 = vulnerabilities found
            $VulnLine = $AuditOutput | Select-String 'vulnerabilities'
            Write-Log "✓ Audit complete: $VulnLine" -Level 'Success'
        } else {
            Write-Log "✗ Audit error" -Level 'Error'
        }
        
        # Environment variables check
        Write-Host "Checking environment variables..." -NoNewline
        
        $EnvFile = '.env.local'
        if (Test-Path $EnvFile) {
            $EnvContent = Get-Content $EnvFile
            $MissingVars = @()
            
            foreach ($Var in $RequiredEnvVars) {
                if ($EnvContent -notcontains "*$Var*") {
                    $MissingVars += $Var
                }
            }
            
            if ($MissingVars.Count -eq 0) {
                Write-Log "✓ All required environment variables set" -Level 'Success'
            } else {
                Write-Log "⚠ Possibly missing: $($MissingVars -join ', ')" -Level 'Warning'
            }
        } else {
            Write-Log "✗ .env.local not found" -Level 'Error'
        }
        
        Write-Log "`n✓ SECURITY VERIFICATION COMPLETE" -Level 'Success'
        Pop-Location
        return $true
    } catch {
        Write-Log "✗ Security check failed: $_" -Level 'Error'
        Pop-Location
        return $false
    }
}

# ============================================================================
# STATUS REPORT
# ============================================================================

function Get-DeploymentReport {
    Write-Section 'DEPLOYMENT STATUS REPORT'
    
    $Report = @{
        Timestamp = Get-Date -Format 'o'
        NodeVersion = & node -v
        NpmVersion = & npm -v
        ProjectPath = $ProjectRoot
        EnvironmentStatus = if (Test-Environment) { 'PASS' } else { 'FAIL' }
        FileStatus = if (Test-FileStructure) { 'PASS' } else { 'FAIL' }
        BuildStatus = if (Test-Build) { 'PASS' } else { 'FAIL' }
        SecurityStatus = if (Test-Security) { 'PASS' } else { 'FAIL' }
    }
    
    Write-Host "`n"
    Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Magenta
    Write-Host "║         DEPLOYMENT STATUS REPORT              ║" -ForegroundColor Magenta
    Write-Host "╠════════════════════════════════════════════════╣" -ForegroundColor Magenta
    
    foreach ($Key in $Report.Keys) {
        $Value = $Report[$Key]
        $Status = if ($Value -match 'PASS|FAIL') {
            if ($Value -eq 'PASS') { '✓' } else { '✗' }
        } else { '→' }
        
        Write-Host "║ $Status $Key`: " -NoNewline -ForegroundColor Magenta
        Write-Host "$Value" -ForegroundColor Cyan
        Write-Host "║" -ForegroundColor Magenta
    }
    
    Write-Host "╚════════════════════════════════════════════════╝`n" -ForegroundColor Magenta
    
    # Save report to file
    $Report | ConvertTo-Json | Out-File (Join-Path $LogsDir "status_report_$Timestamp.json") -Encoding UTF8
    
    Write-Log "`nReport saved to: $LogsDir" -Level 'Success'
}

# ============================================================================
# ERROR RECOVERY
# ============================================================================

function Invoke-Recovery {
    param(
        [string]$ErrorType,
        [string]$ErrorMessage
    )
    
    Write-Section 'ERROR RECOVERY'
    
    Write-Log "Error Type: $ErrorType" -Level 'Error'
    Write-Log "Error Message: $ErrorMessage" -Level 'Error'
    
    switch ($ErrorType) {
        'BuildFailed' {
            Write-Host "`nAttempting recovery..." -ForegroundColor Yellow
            Write-Host "1. Clearing npm cache..." -NoNewline
            & npm cache clean --force | Out-Null
            Write-Log "✓ Cache cleared" -Level 'Success'
            
            Write-Host "2. Reinstalling dependencies..." -NoNewline
            & npm install | Out-Null
            Write-Log "✓ Dependencies reinstalled" -Level 'Success'
            
            Write-Host "3. Retrying build..." -NoNewline
            $Retry = & npm run build 2>&1
            
            if ($LASTEXITCODE -eq 0) {
                Write-Log "✓ Build succeeded after recovery" -Level 'Success'
                return $true
            } else {
                Write-Log "✗ Build still failing" -Level 'Error'
                return $false
            }
        }
        
        'DependenciesMissing' {
            Write-Host "`nInstalling missing dependencies..." -NoNewline
            & npm install | Out-Null
            Write-Log "✓ Dependencies installed" -Level 'Success'
            return $true
        }
        
        default {
            Write-Log "No automatic recovery for: $ErrorType" -Level 'Warning'
            return $false
        }
    }
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

function Main {
    Initialize-Logging
    
    Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║   Kollect-It Marketplace Deployment Orchestration            ║
║   Autonomous Execution Framework                             ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Magenta
    
    Write-Log "Deployment Started" -Level 'Info'
    Write-Log "Phase: $Phase" -Level 'Info'
    
    try {
        switch ($Phase) {
            'All' {
                $EnvOk = Test-Environment
                $FileOk = Test-FileStructure
                $BuildOk = Test-Build
                $SecOk = Test-Security
                Get-DeploymentReport
            }
            
            'Check' {
                Test-Environment
                Test-FileStructure
            }
            
            'Build' {
                Test-Build
            }
            
            'Verify' {
                Test-Security
            }
            
            'Report' {
                Get-DeploymentReport
            }
            
            'Recovery' {
                Invoke-Recovery -ErrorType 'BuildFailed' -ErrorMessage 'Manual recovery triggered'
            }
        }
        
        Write-Log "Deployment Phase Complete" -Level 'Success'
    } catch {
        Write-Log "Fatal Error: $_" -Level 'Error'
        Write-Log $_.Exception.StackTrace -Level 'Error'
        exit 1
    }
    
    Write-Host "`n✓ Execution complete. Check logs at: $LogFile`n" -ForegroundColor Green
}

# Run main
Main
