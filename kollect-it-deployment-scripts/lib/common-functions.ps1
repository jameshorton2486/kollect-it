# ============================================================================
# Kollect-It Deployment Scripts - Common Functions
# ============================================================================
# This file contains shared functions used across all deployment scripts.
# Source this file at the beginning of each script:
#   . "$PSScriptRoot\lib\common-functions.ps1"
# ============================================================================

# Colors for output
$Colors = @{
    Success = "Green"
    Error   = "Red"
    Warning = "Yellow"
    Info    = "Cyan"
    Header  = "Magenta"
}

function Write-Header {
    param([string]$Text)
    Write-Host ""
    Write-Host ("=" * 70) -ForegroundColor $Colors.Header
    Write-Host "  $Text" -ForegroundColor $Colors.Header
    Write-Host ("=" * 70) -ForegroundColor $Colors.Header
    Write-Host ""
}

function Write-Step {
    param([string]$Text)
    Write-Host "[STEP] $Text" -ForegroundColor $Colors.Info
}

function Write-Success {
    param([string]$Text)
    Write-Host "[OK] $Text" -ForegroundColor $Colors.Success
}

function Write-Failure {
    param([string]$Text)
    Write-Host "[FAIL] $Text" -ForegroundColor $Colors.Error
}

function Write-Warn {
    param([string]$Text)
    Write-Host "[WARN] $Text" -ForegroundColor $Colors.Warning
}

function Test-CommandExists {
    param([string]$Command)
    $exists = $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
    return $exists
}

function Assert-CommandExists {
    param(
        [string]$Command,
        [string]$InstallInstructions
    )
    if (-not (Test-CommandExists $Command)) {
        Write-Failure "$Command is not installed"
        Write-Host "  Install with: $InstallInstructions" -ForegroundColor $Colors.Warning
        exit 1
    }
    Write-Success "$Command is installed"
}

function Generate-SecureString {
    param([int]$Length = 32)
    $bytes = New-Object byte[] $Length
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($bytes)
    return [Convert]::ToBase64String($bytes)
}

function Generate-HexString {
    param([int]$Length = 32)
    $bytes = New-Object byte[] $Length
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($bytes)
    return [BitConverter]::ToString($bytes).Replace("-", "").ToLower()
}

function Test-EnvVar {
    param([string]$Name)
    $value = [Environment]::GetEnvironmentVariable($Name)
    return (-not [string]::IsNullOrWhiteSpace($value))
}

function Read-EnvFile {
    param([string]$Path)
    $env = @{}
    if (Test-Path $Path) {
        Get-Content $Path | ForEach-Object {
            if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
                $key = $Matches[1].Trim()
                $value = $Matches[2].Trim()
                # Remove quotes if present
                if ($value -match '^["''](.*)["'']$') {
                    $value = $Matches[1]
                }
                $env[$key] = $value
            }
        }
    }
    return $env
}

function Write-EnvFile {
    param(
        [string]$Path,
        [hashtable]$Variables,
        [string]$Header = ""
    )
    
    $content = @()
    if ($Header) {
        $content += "# $Header"
        $content += "# Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        $content += ""
    }
    
    foreach ($key in $Variables.Keys | Sort-Object) {
        $value = $Variables[$key]
        $content += "$key=$value"
    }
    
    $content | Out-File -FilePath $Path -Encoding UTF8
    Write-Success "Created $Path"
}

function Test-UrlAccessible {
    param(
        [string]$Url,
        [int]$TimeoutSeconds = 10
    )
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -TimeoutSec $TimeoutSeconds -UseBasicParsing
        return $response.StatusCode -eq 200
    }
    catch {
        return $false
    }
}

function Test-DnsResolution {
    param([string]$Domain)
    try {
        $result = Resolve-DnsName -Name $Domain -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

function Get-DnsARecord {
    param([string]$Domain)
    try {
        $result = Resolve-DnsName -Name $Domain -Type A -ErrorAction Stop
        return $result | Where-Object { $_.Type -eq 'A' } | Select-Object -ExpandProperty IPAddress
    }
    catch {
        return $null
    }
}

function Confirm-Action {
    param(
        [string]$Message,
        [bool]$DefaultYes = $false
    )
    $prompt = if ($DefaultYes) { "$Message [Y/n]" } else { "$Message [y/N]" }
    $response = Read-Host $prompt
    
    if ([string]::IsNullOrWhiteSpace($response)) {
        return $DefaultYes
    }
    
    return $response -match '^[Yy]'
}

function Show-Progress {
    param(
        [string]$Activity,
        [int]$PercentComplete
    )
    Write-Progress -Activity $Activity -PercentComplete $PercentComplete
}

function Wait-WithSpinner {
    param(
        [string]$Message,
        [int]$Seconds
    )
    $spinChars = @('|', '/', '-', '\')
    $spinIndex = 0
    
    for ($i = 0; $i -lt $Seconds; $i++) {
        Write-Host "`r$Message $($spinChars[$spinIndex])" -NoNewline
        $spinIndex = ($spinIndex + 1) % 4
        Start-Sleep -Seconds 1
    }
    Write-Host "`r$Message Done!" 
}

# Functions are available when dot-sourced
