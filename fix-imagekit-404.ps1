Param([switch]$Placeholders)
Write-Host "`n🛠 ImageKit 404 Fix Script" -ForegroundColor Cyan
$root = Get-Location
$targets = @(
  @{File='src\\components\\home\\LatestArrivalsClient.tsx'; Replacements=@(
    @{Old='https://ik.imagekit.io/kollectit/latest1.jpg'; New='https://via.placeholder.com/400x300/D4AF37/FFFFFF?text=Victorian+Mirror'},
    @{Old='https://ik.imagekit.io/kollectit/latest2.jpg'; New='https://via.placeholder.com/400x300/D4AF37/FFFFFF?text=Art+Deco+Figurine'},
    @{Old='https://ik.imagekit.io/kollectit/latest3.jpg'; New='https://via.placeholder.com/400x300/D4AF37/FFFFFF?text=1966+Poster'},
    @{Old='https://ik.imagekit.io/kollectit/latest4.jpg'; New='https://via.placeholder.com/400x300/D4AF37/FFFFFF?text=Tsavorite+Garnet'}
  )},
  @{File='src\\components\\home\\FeaturedCollection.tsx'; Replacements=@(
    @{Old='https://ik.imagekit.io/kollectit/feature-rare-books-17th-modern.jpg'; New='https://via.placeholder.com/1200x900/8B4513/FFFFFF?text=Rare+Books+Collection'}
  )}
)
if(!$Placeholders){
  Write-Host "ℹ️ Run with -Placeholders to enforce placeholder substitution." -ForegroundColor Yellow
  Write-Host "   Example: ./fix-imagekit-404.ps1 -Placeholders" -ForegroundColor Yellow
  return
}
foreach($t in $targets){
  $filePath = Join-Path $root $t.File
  if(!(Test-Path $filePath)){ Write-Host "⚠️ Missing file $($t.File)" -ForegroundColor Yellow; continue }
  $content = Get-Content $filePath -Raw
  $modified = $false
  foreach($rep in $t.Replacements){
    if($content -match [Regex]::Escape($rep.Old)){
      $content = $content -replace [Regex]::Escape($rep.Old), $rep.New
      $modified = $true
      Write-Host "✅ Replaced $($rep.Old)" -ForegroundColor Green
    }
  }
  if($modified){ Set-Content -Path $filePath -Value $content; Write-Host "💾 Updated $($t.File)" -ForegroundColor Cyan } else { Write-Host "✔ Already updated: $($t.File)" -ForegroundColor Green }
}
Write-Host "🔁 Done. Rebuild dev server to apply: npm run dev" -ForegroundColor Cyan
