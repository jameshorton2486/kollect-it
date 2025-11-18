Param()
Write-Host "`n📝 Logging Diagnostic" -ForegroundColor Cyan
$loggerPath = Join-Path (Get-Location) 'src\lib\enhanced-logger.ts'
if(Test-Path $loggerPath){ Write-Host "✅ enhanced-logger.ts exists" -ForegroundColor Green } else { Write-Host "❌ enhanced-logger.ts missing" -ForegroundColor Red }
$authPath = Join-Path (Get-Location) 'src\lib\auth.ts'
if(Test-Path $authPath){
  $authContent = Get-Content $authPath -Raw
  if($authContent -match 'enhanced-logger'){ Write-Host "✅ auth.ts uses enhanced logger" -ForegroundColor Green } else { Write-Host "⚠️ auth.ts not importing enhanced logger" -ForegroundColor Yellow }
}
# Ensure logs dir
$logsDir = Join-Path (Get-Location) 'logs'
if(!(Test-Path $logsDir)){ Write-Host "📂 Creating logs/ directory" -ForegroundColor Yellow; New-Item -ItemType Directory -Path $logsDir | Out-Null }
# Create test log entry
$today = (Get-Date).ToString('yyyy-MM-dd')
$testFile = Join-Path $logsDir "info-$today.log"
$entry = @{ timestamp = (Get-Date).ToString('o'); level='info'; message='Diagnostic test entry'; context=@{ script='diagnose-logging.ps1' } } | ConvertTo-Json -Compress
Add-Content -Path $testFile -Value $entry
Write-Host "✅ Test log entry written: $testFile" -ForegroundColor Green
# Count log files
$logFiles = Get-ChildItem $logsDir -File -Include *.log -ErrorAction SilentlyContinue
Write-Host "📊 Log file count: $($logFiles.Count)" -ForegroundColor White
if($env:LOG_TO_FILE){ Write-Host "ENV LOG_TO_FILE=$($env:LOG_TO_FILE)" -ForegroundColor White } else { Write-Host "LOG_TO_FILE not set (set to 'true' for file logging)." -ForegroundColor Yellow }
Write-Host "🔁 Next: Trigger login, then run npm run error-summary" -ForegroundColor Cyan
