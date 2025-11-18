Param()
Write-Host "`n🔍 ImageKit Diagnostic" -ForegroundColor Cyan
$root = Get-Location
$missingPatterns = @(
  'latest1.jpg','latest2.jpg','latest3.jpg','latest4.jpg','feature-rare-books-17th-modern.jpg'
)
$srcFiles = Get-ChildItem -Path $root -Recurse -Include *.tsx,*.ts,*.jsx,*.js -ErrorAction SilentlyContinue
$found = @()
foreach($f in $srcFiles){
  $content = Get-Content $f.FullName -Raw
  foreach($p in $missingPatterns){
    if($content -match [Regex]::Escape($p)){
      $found += [PSCustomObject]@{File=$f.FullName; Pattern=$p}
    }
  }
}
if($found.Count -eq 0){
  Write-Host "✅ No references to missing ImageKit demo images in source." -ForegroundColor Green
}else{
  Write-Host "⚠️ Found references to missing images:" -ForegroundColor Yellow
  $found | Format-Table -AutoSize
}
# Check placeholder usage
$placeholderHits = ($srcFiles | Select-String -Pattern 'via.placeholder.com' -ErrorAction SilentlyContinue)
Write-Host "Placeholder references: $($placeholderHits.Count)" -ForegroundColor White
if($placeholderHits.Count -gt 0){ Write-Host "✅ Placeholder images active (temporary fix)." -ForegroundColor Green }
# Endpoint check
$envFile = '.env.local'
if(Test-Path $envFile){
  $envContent = Get-Content $envFile -Raw
  if($envContent -match 'NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT'){ Write-Host "✅ NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT set" -ForegroundColor Green } else { Write-Host "❌ Missing NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT" -ForegroundColor Red }
}else{ Write-Host "❌ .env.local not found" -ForegroundColor Red }
Write-Host "🔁 Recommendation: Upload real assets or centralize paths in src/lib/images.ts" -ForegroundColor Cyan
