# Add NEXTAUTH_URL to Vercel Production
Write-Host "🔧 Adding NEXTAUTH_URL to Vercel..." -ForegroundColor Cyan
Write-Host ""

$productionUrl = "https://kollect-it.vercel.app"

Write-Host "Adding NEXTAUTH_URL for production environment..." -ForegroundColor Yellow
Write-Host "Value: $productionUrl" -ForegroundColor White
Write-Host ""

# Check if already exists
Write-Host "📋 Checking current environment variables..." -ForegroundColor Cyan
vercel env ls | Select-String "NEXTAUTH"

Write-Host ""
Write-Host "📝 To add NEXTAUTH_URL manually, run:" -ForegroundColor Yellow
Write-Host "   vercel env add NEXTAUTH_URL production" -ForegroundColor White
Write-Host ""
Write-Host "When prompted, enter: $productionUrl" -ForegroundColor White
Write-Host ""

# Try to add it programmatically
try {
    # Create a temporary file with the value
    $tempFile = [System.IO.Path]::GetTempFileName()
    $productionUrl | Out-File -FilePath $tempFile -Encoding utf8 -NoNewline

    Write-Host "Attempting to add via command..." -ForegroundColor Yellow
    $result = Get-Content $tempFile | vercel env add NEXTAUTH_URL production 2>&1

    Remove-Item $tempFile -ErrorAction SilentlyContinue

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ NEXTAUTH_URL added successfully!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "⚠️  Variable may already exist or interactive prompt required." -ForegroundColor Yellow
        Write-Host "   Check with: vercel env ls | Select-String 'NEXTAUTH'" -ForegroundColor White
    }
} catch {
    Write-Host ""
    Write-Host "⚠️  Interactive prompt required. Please run manually:" -ForegroundColor Yellow
    Write-Host "   vercel env add NEXTAUTH_URL production" -ForegroundColor White
    Write-Host "   Then enter: $productionUrl" -ForegroundColor White
}

Write-Host ""
Write-Host "After adding, verify with:" -ForegroundColor Cyan
Write-Host "   vercel env ls | Select-String 'NEXTAUTH'" -ForegroundColor White
Write-Host ""

Write-Host "To deploy with new environment variables:" -ForegroundColor Cyan
Write-Host "   vercel --prod" -ForegroundColor White
Write-Host ""