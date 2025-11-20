Write-Host "🔍 Build Verification Checklist" -ForegroundColor Cyan
Write-Host "═" * 50

# Check 1: TypeScript
Write-Host "`n1. Checking TypeScript..." -ForegroundColor Yellow
bun x tsc --noEmit
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ No TypeScript errors" -ForegroundColor Green
} else {
    Write-Host "   ❌ TypeScript errors found" -ForegroundColor Red
    exit 1
}

# Check 2: Prisma Client
Write-Host "`n2. Checking Prisma Client..." -ForegroundColor Yellow
if (Test-Path "node_modules\.prisma\client") {
    Write-Host "   ✅ Prisma Client generated" -ForegroundColor Green
} else {
    Write-Host "   ❌ Prisma Client not generated" -ForegroundColor Red
    Write-Host "   Run: bun x prisma generate" -ForegroundColor Yellow
    exit 1
}

# Check 3: Build
Write-Host "`n3. Testing build..." -ForegroundColor Yellow
bun run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Build successful" -ForegroundColor Green
} else {
    Write-Host "   ❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n" + "═" * 50
Write-Host "✅ All build checks passed!" -ForegroundColor Green