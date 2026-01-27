# Add missing email environment variables to .env.local
# This script adds EMAIL_HOST and EMAIL_PORT if they're missing

$envFile = ".env.local"
$envPath = Join-Path $PSScriptRoot ".." $envFile | Resolve-Path -ErrorAction SilentlyContinue

if (-not $envPath) {
    Write-Host "❌ .env.local not found in project root" -ForegroundColor Red
    Write-Host "   Please create it first or run this from the project root" -ForegroundColor Yellow
    exit 1
}

$content = Get-Content $envPath -Raw
$needsUpdate = $false
$updates = @()

# Check and add EMAIL_HOST
if ($content -notmatch "^\s*EMAIL_HOST\s*=" -and $content -notmatch "^\s*#\s*EMAIL_HOST\s*=") {
    $updates += "EMAIL_HOST=smtp.gmail.com"
    $needsUpdate = $true
    Write-Host "✅ Will add: EMAIL_HOST=smtp.gmail.com" -ForegroundColor Green
} else {
    Write-Host "ℹ️  EMAIL_HOST already exists" -ForegroundColor Cyan
}

# Check and add EMAIL_PORT
if ($content -notmatch "^\s*EMAIL_PORT\s*=" -and $content -notmatch "^\s*#\s*EMAIL_PORT\s*=") {
    $updates += "EMAIL_PORT=587"
    $needsUpdate = $true
    Write-Host "✅ Will add: EMAIL_PORT=587" -ForegroundColor Green
} else {
    Write-Host "ℹ️  EMAIL_PORT already exists" -ForegroundColor Cyan
}

if ($needsUpdate) {
    Write-Host "`n📝 Adding missing email variables to .env.local..." -ForegroundColor Yellow
    
    # Find where to add (after email section or at end)
    $emailSection = $content -match "(?s)#\s*EMAIL|EMAIL_"
    
    if ($emailSection) {
        # Add after existing email variables
        $newContent = $content
        foreach ($update in $updates) {
            # Check if it's already there (case-insensitive)
            if ($newContent -notmatch [regex]::Escape($update.Split('=')[0])) {
                # Add after last EMAIL_ variable or in email section
                if ($newContent -match "(EMAIL_\w+\s*=.*?)(\r?\n)") {
                    $newContent = $newContent -replace "($matches[1])($matches[2])", "`$1$matches[2]$update$matches[2]"
                } else {
                    # Add at end of file
                    $newContent += "`n$update`n"
                }
            }
        }
    } else {
        # Add email section
        $emailSection = @"

# ===============================
# EMAIL (Google Workspace SMTP)
# ===============================
$($updates -join "`n")
"@
        $newContent = $content.TrimEnd() + "`n`n$emailSection"
    }
    
    # Simple approach: append to end if not found
    $linesToAdd = @()
    foreach ($update in $updates) {
        $varName = $update.Split('=')[0]
        if ($content -notmatch "^\s*$varName\s*=") {
            $linesToAdd += $update
        }
    }
    
    if ($linesToAdd.Count -gt 0) {
        # Check if there's an email section comment
        if ($content -match "#\s*EMAIL|#\s*Google Workspace") {
            # Add after email section
            $emailSectionEnd = $content | Select-String -Pattern "(EMAIL_\w+|ADMIN_EMAIL)" | Select-Object -Last 1
            if ($emailSectionEnd) {
                $insertPoint = $content.IndexOf($emailSectionEnd.Line) + $emailSectionEnd.Line.Length
                $before = $content.Substring(0, $insertPoint)
                $after = $content.Substring($insertPoint)
                $newContent = $before + "`n" + ($linesToAdd -join "`n") + $after
            } else {
                $newContent = $content.TrimEnd() + "`n" + ($linesToAdd -join "`n") + "`n"
            }
        } else {
            # Add email section
            $emailSection = @"

# ===============================
# EMAIL (Google Workspace SMTP)
# ===============================
$($linesToAdd -join "`n")
"@
            $newContent = $content.TrimEnd() + $emailSection
        }
        
        Set-Content -Path $envPath -Value $newContent -NoNewline
        Write-Host "✅ Updated .env.local" -ForegroundColor Green
        Write-Host "`nAdded variables:" -ForegroundColor Cyan
        $linesToAdd | ForEach-Object { Write-Host "  • $_" -ForegroundColor White }
    } else {
        Write-Host "ℹ️  All email variables already present" -ForegroundColor Cyan
    }
} else {
    Write-Host "✅ All required email variables are already configured" -ForegroundColor Green
}

Write-Host "`n📋 Current email variables:" -ForegroundColor Cyan
$emailVars = @("EMAIL_HOST", "EMAIL_PORT", "EMAIL_USER", "EMAIL_PASSWORD", "EMAIL_FROM", "ADMIN_EMAIL")
$finalContent = Get-Content $envPath -Raw
foreach ($var in $emailVars) {
    if ($finalContent -match "^\s*$var\s*=") {
        Write-Host "  ✅ $var" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $var (missing)" -ForegroundColor Red
    }
}

Write-Host "`n💡 Next step: Test email connection with:" -ForegroundColor Yellow
Write-Host "   bun run scripts/test-services.ts" -ForegroundColor White
