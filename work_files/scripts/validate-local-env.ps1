Write-Host "🔍 Validating LOCAL environment (.env.local)..." -ForegroundColor Cyan

# Load .env.local manually
$envPath = ".env.local"

if (!(Test-Path $envPath)) {
    Write-Host "❌ .env.local not found in current directory." -ForegroundColor Red
    exit
}

# Load variables
Get-Content $envPath | ForEach-Object {
    if ($_ -match "^\s*#") { return }
    if ($_ -match "(.+?)=(.*)") {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        set-item -path "Env:$name" -value $value
    }
}

function CheckVar($name, $minLen = 1) {
    $value = Get-Item -Path "Env:$name" -ErrorAction SilentlyContinue

    if (!$value) {
        Write-Host "❌ $name is NOT set" -ForegroundColor Red
        return
    }

    if ($value.Value.Length -lt $minLen) {
        Write-Host ⚠️ $name is too short (len: $($value.Value.Length))" -ForegroundColor Yellow
    } else {
        Write-Host "✅ $name OK (len: $($value.Value.Length))"
    }
}

Write-Host "`n🔧 Checking required variables...`n"

CheckVar "NEXTAUTH_URL" 10
CheckVar "NEXTAUTH_SECRET" 32
CheckVar "DATABASE_URL" 20
CheckVar "DIRECT_URL" 20

Write-Host "`n📨 Checking email configuration...`n"

CheckVar "EMAIL_HOST" 1
CheckVar "EMAIL_USER" 3
CheckVar "EMAIL_PASSWORD" 10
CheckVar "EMAIL_FROM" 3

Write-Host "`n🌐 Checking URL formats...`n"

if ($env:NEXTAUTH_URL -notmatch "^http://localhost:3000$") {
    Write-Host "❌ NEXTAUTH_URL must be http://localhost:3000 for local dev" -ForegroundColor Red
} else {
    Write-Host "✅ NEXTAUTH_URL format OK"
}

if ($env:DATABASE_URL -notmatch "6543") {
    Write-Host "⚠️ DATABASE_URL should use port 6543 for pooled connections"
} else {
    Write-Host "✅ DATABASE_URL port OK"
}

if ($env:DIRECT_URL -notmatch "5432") {
    Write-Host "⚠️ DIRECT_URL should use port 5432"
} else {
    Write-Host "✅ DIRECT_URL port OK"
}

Write-Host "`n✨ Local environment validation complete.`n"
