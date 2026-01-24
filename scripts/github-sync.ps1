param([string]$Message,[switch]$NoPull,[switch]$Force,[string]$Branch)
$ErrorActionPreference="Stop"
$ProjectPath="C:\Users\james\kollect-it"
function Write-Success{param($msg)Write-Host "[OK] $msg" -ForegroundColor Green}
function Write-Info{param($msg)Write-Host "[INFO] $msg" -ForegroundColor Cyan}
function Write-Warn{param($msg)Write-Host "[WARN] $msg" -ForegroundColor Yellow}
function Write-Err{param($msg)Write-Host "[ERROR] $msg" -ForegroundColor Red}
function Write-Step{param($num,$msg)Write-Host "`n=== Step $num : $msg ===" -ForegroundColor Magenta}
Clear-Host
Write-Host "`n======== KOLLECT-IT GITHUB SYNC ========" -ForegroundColor Yellow
if(Test-Path $ProjectPath){Set-Location $ProjectPath;Write-Success "In project folder"}else{Write-Err "Path not found";exit 1}
if(-not(Test-Path ".git")){Write-Err "Not a git repo!";exit 1}
$currentBranch=git branch --show-current
Write-Info "Branch: $currentBranch"
Write-Host "`nGit Status:" -ForegroundColor Yellow
git status --short
$statusOutput=git status --porcelain
$changedFiles=($statusOutput|Measure-Object -Line).Lines
if($changedFiles -eq 0){Write-Warn "No changes";$c=Read-Host "Push existing commits? (y/n)";if($c -ne 'y'){exit 0}}
else{Write-Info "$changedFiles file(s) changed"}
if($changedFiles -gt 0){if(-not $Force){$s=Read-Host "`nStage all? (y/n)";if($s -ne 'y'){exit 0}};git add -A;Write-Success "Staged"}
$staged=git diff --cached --name-only
if($staged){if(-not $Message){$Message=Read-Host "Commit message"};if([string]::IsNullOrWhiteSpace($Message)){$Message="Update: "+(Get-Date -Format "yyyy-MM-dd HH:mm")};git commit -m $Message;Write-Success "Committed: $Message"}
if(-not $NoPull){Write-Info "Pulling...";git fetch origin;git pull --rebase origin $currentBranch 2>$null;Write-Success "Pulled"}
if(-not $Force){$p=Read-Host "`nPush to origin/$currentBranch? (y/n)";if($p -ne 'y'){exit 0}}
git push origin $currentBranch
Write-Success "Pushed to origin/$currentBranch"
if($currentBranch -eq "main"){Write-Host "`nVercel will auto-deploy in 1-3 min" -ForegroundColor Cyan;Write-Host "Site: https://kollect-it.com" -ForegroundColor Cyan}
Write-Host "`n======== SYNC COMPLETE! ========" -ForegroundColor Green
