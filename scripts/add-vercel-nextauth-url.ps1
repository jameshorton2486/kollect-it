# Add NEXTAUTH_URL to Vercel Production
Write-Host "🔧 Adding NEXTAUTH_URL to Vercel..." -ForegroundColor Cyan
Write-Host ""

$productionUrl = "https://kollect-it-marketplace-1.vercel.app"

Write-Host "Adding NEXTAUTH_URL for production environment..." -ForegroundColor Yellow
Write-Host "Value: $productionUrl" -ForegroundColor White
Write-Host ""

# Use vercel env add command
# Note: This will prompt interactively, so we'll guide the user
Write-Host "📝 Run this command manually:" -ForegroundColor Yellow
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
    Get-Content $tempFile | vercel env add NEXTAUTH_URL production
    
    Remove-Item $tempFile -ErrorAction SilentlyContinue
    
    Write-Host ""
    Write-Host "✅ NEXTAUTH_URL added successfully!" -ForegroundColor Green
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
