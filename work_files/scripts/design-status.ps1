# Kollect-It Design Status & Diff Helper
# Purpose: Show what files have changed and track against design review log
# Usage: .\scripts\design-status.ps1

param(
    [Parameter(Mandatory=$false)]
    [switch]$ShowAll = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$ShowDetails = $false
)

# Colors for output
function Write-Success { param($Message) Write-Host $Message -ForegroundColor Green }
function Write-Info { param($Message) Write-Host $Message -ForegroundColor Cyan }
function Write-Warning { param($Message) Write-Host $Message -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host $Message -ForegroundColor Red }
function Write-Section { param($Message) Write-Host "`n$Message" -ForegroundColor Magenta }

Write-Info "═══════════════════════════════════════════════════════"
Write-Info "  Kollect-It Design Status Report"
Write-Info "═══════════════════════════════════════════════════════"
Write-Host ""

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Error "Not in a git repository. Please run from project root."
    exit 1
}

# Get current branch
$CurrentBranch = git rev-parse --abbrev-ref HEAD
Write-Info "Current Branch: $CurrentBranch"
Write-Host ""

# Check for uncommitted changes
Write-Section "═══ UNCOMMITTED CHANGES ═══"

$GitStatus = git status --porcelain

if (-not $GitStatus) {
    Write-Success "✓ No uncommitted changes (working tree clean)"
}
else {
    Write-Warning "⚠ Uncommitted changes detected:"
    Write-Host ""
    
    # Parse and categorize changes
    $ModifiedFiles = @()
    $NewFiles = @()
    $DeletedFiles = @()
    
    foreach ($Line in $GitStatus) {
        $Status = $Line.Substring(0, 2).Trim()
        $FilePath = $Line.Substring(3).Trim()
        
        switch -Wildcard ($Status) {
            "M*" { $ModifiedFiles += $FilePath }
            "A*" { $NewFiles += $FilePath }
            "D*" { $DeletedFiles += $FilePath }
            "??" { $NewFiles += $FilePath }
        }
    }
    
    if ($ModifiedFiles.Count -gt 0) {
        Write-Host "  Modified Files:" -ForegroundColor Yellow
        foreach ($File in $ModifiedFiles) {
            Write-Host "    M  $File" -ForegroundColor Yellow
        }
    }
    
    if ($NewFiles.Count -gt 0) {
        Write-Host "  New Files:" -ForegroundColor Green
        foreach ($File in $NewFiles) {
            Write-Host "    A  $File" -ForegroundColor Green
        }
    }
    
    if ($DeletedFiles.Count -gt 0) {
        Write-Host "  Deleted Files:" -ForegroundColor Red
        foreach ($File in $DeletedFiles) {
            Write-Host "    D  $File" -ForegroundColor Red
        }
    }
}

Write-Host ""

# Check design review log
Write-Section "═══ DESIGN REVIEW LOG STATUS ═══"

$LogPath = "design/DESIGN-REVIEW-LOG.md"

if (Test-Path $LogPath) {
    Write-Success "✓ Design review log found: $LogPath"
    
    # Parse the log to find unchecked items
    $LogContent = Get-Content $LogPath -Raw
    
    # Count checkboxes
    $TotalTasks = ([regex]::Matches($LogContent, '- \[[ x]\]')).Count
    $CompletedTasks = ([regex]::Matches($LogContent, '- \[x\]')).Count
    $PendingTasks = $TotalTasks - $CompletedTasks
    
    Write-Host ""
    Write-Info "Task Progress:"
    Write-Host "  Total tasks: $TotalTasks" -ForegroundColor White
    Write-Host "  Completed: $CompletedTasks" -ForegroundColor Green
    Write-Host "  Pending: $PendingTasks" -ForegroundColor Yellow
    
    if ($TotalTasks -gt 0) {
        $PercentComplete = [Math]::Round(($CompletedTasks / $TotalTasks) * 100, 1)
        Write-Host "  Progress: $PercentComplete%" -ForegroundColor $(if ($PercentComplete -ge 50) { "Green" } else { "Yellow" })
    }
    
    # Show pending tasks if verbose
    if ($ShowDetails -or $ShowAll) {
        Write-Host ""
        Write-Info "Pending Tasks (first 10):"
        
        $PendingMatches = [regex]::Matches($LogContent, '- \[ \] \*\*(.+?)\*\*')
        $Count = 0
        foreach ($Match in $PendingMatches) {
            if ($Count -ge 10) { break }
            $TaskName = $Match.Groups[1].Value
            Write-Host "  • $TaskName" -ForegroundColor White
            $Count++
        }
        
        if ($PendingMatches.Count -gt 10) {
            Write-Host "  ... and $($PendingMatches.Count - 10) more" -ForegroundColor DarkGray
        }
    }
}
else {
    Write-Warning "⚠ Design review log not found at: $LogPath"
    Write-Host "  Consider creating it with the provided template" -ForegroundColor DarkGray
}

Write-Host ""

# Check for design-related branches
Write-Section "═══ DESIGN BRANCHES ═══"

$AllBranches = git branch --all | ForEach-Object { $_.Trim() -replace '^\* ', '' -replace '^remotes/origin/', '' }
$DesignBranches = $AllBranches | Where-Object { $_ -like '*design*' } | Select-Object -Unique

if ($DesignBranches.Count -gt 0) {
    Write-Success "Found $($DesignBranches.Count) design-related branch(es):"
    foreach ($Branch in $DesignBranches) {
        $IsCurrent = $Branch -eq $CurrentBranch
        $Marker = if ($IsCurrent) { " ← current" } else { "" }
        Write-Host "  • $Branch$Marker" -ForegroundColor $(if ($IsCurrent) { "Green" } else { "White" })
    }
}
else {
    Write-Info "No design-specific branches found"
    Write-Host "  Tip: Create one with: git checkout -b design/homepage-v1" -ForegroundColor DarkGray
}

Write-Host ""

# Check recent commits
Write-Section "═══ RECENT COMMITS (Last 5) ═══"

$RecentCommits = git log --oneline -5 --pretty=format:"%h|%s|%ar" 2>$null

if ($RecentCommits) {
    foreach ($Commit in $RecentCommits) {
        $Parts = $Commit -split '\|'
        $Hash = $Parts[0]
        $Message = $Parts[1]
        $Time = $Parts[2]
        
        Write-Host "  $Hash" -ForegroundColor Yellow -NoNewline
        Write-Host "  $Message" -ForegroundColor White
        Write-Host "         $Time" -ForegroundColor DarkGray
    }
}
else {
    Write-Info "No commit history available"
}

Write-Host ""

# File change summary (since last commit or specific file)
if ($ShowAll) {
    Write-Section "═══ DETAILED FILE CHANGES ═══"
    
    $Changes = git diff --name-status HEAD 2>$null
    
    if ($Changes) {
        Write-Warning "Changes since last commit:"
        foreach ($Change in $Changes) {
            $Parts = $Change -split '\s+'
            $Status = $Parts[0]
            $File = $Parts[1]
            
            $StatusText = switch ($Status) {
                "M" { "Modified" }
                "A" { "Added" }
                "D" { "Deleted" }
                "R" { "Renamed" }
                default { "Changed" }
            }
            
            Write-Host "  [$StatusText] $File" -ForegroundColor $(
                switch ($Status) {
                    "M" { "Yellow" }
                    "A" { "Green" }
                    "D" { "Red" }
                    default { "White" }
                }
            )
        }
    }
    else {
        Write-Success "No file changes since last commit"
    }
}

Write-Host ""

# Quick actions
Write-Section "═══ QUICK ACTIONS ═══"
Write-Host "  Backup files:  .\scripts\backup-design-files.ps1 -Files 'src/components/Hero.tsx'" -ForegroundColor Cyan
Write-Host "  Create branch: git checkout -b design/component-name" -ForegroundColor Cyan
Write-Host "  View log:      code design/DESIGN-REVIEW-LOG.md" -ForegroundColor Cyan
Write-Host "  Run dev:       npm run dev" -ForegroundColor Cyan
Write-Host "  Build check:   npm run build" -ForegroundColor Cyan

Write-Host ""
Write-Info "═══════════════════════════════════════════════════════"
Write-Host ""
