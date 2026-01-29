# Add Environment Variables to Vercel
# This script adds all required environment variables to Vercel using the CLI

Write-Host "🔐 Adding environment variables to Vercel..." -ForegroundColor Cyan

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Login to Vercel (will prompt if not logged in)
Write-Host "`n🔑 Logging in to Vercel..." -ForegroundColor Cyan
vercel login

# Define environment variables (use your own values - do not commit real secrets)
# Edit values below or set env vars (e.g. $env:NEXTAUTH_SECRET = "your-secret") before running.
$envVars = @{
  "NEXTAUTH_SECRET" = if ($env:NEXTAUTH_SECRET) { $env:NEXTAUTH_SECRET } else { "YOUR_NEXTAUTH_SECRET_32_CHARS_MIN" }
  "NEXTAUTH_URL"    = if ($env:NEXTAUTH_URL) { $env:NEXTAUTH_URL } else { "https://kollect-it.com" }
}
# Add more keys as needed; keep real values in env or Vercel Dashboard, not in this file.

$environments = @("production", "preview", "development")

Write-Host "`n📝 Adding variables to all environments..." -ForegroundColor Cyan

foreach ($key in $envVars.Keys) {
  $value = $envVars[$key]
  Write-Host "`nAdding: $key" -ForegroundColor Yellow

  foreach ($env in $environments) {
    Write-Host "  → $env..." -NoNewline
    try {
      $tempFile = New-TemporaryFile
      Set-Content -Path $tempFile -Value $value -NoNewline
      $result = Get-Content $tempFile | vercel env add $key $env 2>&1
      Remove-Item $tempFile -Force

      if ($LASTEXITCODE -eq 0) {
        Write-Host " ✅" -ForegroundColor Green
      }
      else {
        Write-Host " (may already exist)" -ForegroundColor Gray
      }
    }
    catch {
      Write-Host " ⚠️ Error: $_" -ForegroundColor Yellow
    }
  }
}

Write-Host "`n$("=" * 60)" -ForegroundColor Cyan
Write-Host "✅ Environment variables added to Vercel!" -ForegroundColor Green
Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Redeploy: vercel --prod" -ForegroundColor Yellow
Write-Host "  2. Or visit: https://vercel.com/james-hortons-projects-6d806c91/kollect-it" -ForegroundColor Yellow
Write-Host ("=" * 60) -ForegroundColor Cyan
