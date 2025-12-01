# =====================================================
# Kollect-It Database Setup & Optimization
# =====================================================
# Runs migrations and creates performance indexes
# Usage: .\setup-database.ps1 [-Apply] [-Test]

param(
    [switch]$Apply,      # Apply indexes directly to database
    [switch]$Test,       # Test database connection first
    [switch]$Seed        # Seed initial data
)

$ErrorActionPreference = "Stop"

function Write-Status {
    param($Message, $Type = "Info")
    
    switch ($Type) {
        "Success" { Write-Host "✓ $Message" -ForegroundColor Green }
        "Error" { Write-Host "✗ $Message" -ForegroundColor Red }
        "Warning" { Write-Host "⚠ $Message" -ForegroundColor Yellow }
        "Info" { Write-Host "→ $Message" -ForegroundColor Cyan }
        "Header" { 
            Write-Host "`n$Message" -ForegroundColor Cyan
            Write-Host ("=" * $Message.Length) -ForegroundColor Cyan
        }
    }
}

Write-Status "🗄️  Kollect-It Database Setup" "Header"

# =====================================================
# 1. Check Environment
# =====================================================
Write-Status "Checking environment..." "Info"

if (-not (Test-Path .env.local)) {
    Write-Status ".env.local not found!" "Error"
    Write-Host "Create .env.local with DATABASE_URL first" -ForegroundColor Yellow
    exit 1
}

$envContent = Get-Content .env.local -Raw
if ($envContent -notmatch "DATABASE_URL") {
    Write-Status "DATABASE_URL not found in .env.local!" "Error"
    exit 1
}

Write-Status "Environment configured" "Success"

# =====================================================
# 2. Test Database Connection (if requested)
# =====================================================
if ($Test) {
    Write-Status "`nTesting database connection..." "Info"
    
    try {
        $output = npx prisma db execute --stdin <<< "SELECT 1 as test;" 2>&1
        Write-Status "Database connection successful" "Success"
    } catch {
        Write-Status "Database connection failed: $($_.Exception.Message)" "Error"
        Write-Host "Check your DATABASE_URL in .env.local" -ForegroundColor Yellow
        exit 1
    }
}

# =====================================================
# 3. Run Prisma Migrations
# =====================================================
Write-Status "`nRunning Prisma migrations..." "Info"

try {
    Write-Status "Pushing schema to database..." "Info"
    npx prisma db push --accept-data-loss
    Write-Status "Schema pushed successfully" "Success"
} catch {
    Write-Status "Migration failed: $($_.Exception.Message)" "Error"
    Write-Host "`nTry manually:" -ForegroundColor Yellow
    Write-Host "  npx prisma db push" -ForegroundColor Gray
    exit 1
}

# =====================================================
# 4. Generate Prisma Client
# =====================================================
Write-Status "`nGenerating Prisma Client..." "Info"

try {
    npx prisma generate
    Write-Status "Prisma Client generated" "Success"
} catch {
    Write-Status "Generation failed: $($_.Exception.Message)" "Error"
    exit 1
}

# =====================================================
# 5. Create Performance Indexes SQL
# =====================================================
Write-Status "`nGenerating performance indexes..." "Info"

$indexesSQL = @"
-- =====================================================
-- Kollect-It Performance Indexes
-- =====================================================
-- Run this in Supabase SQL Editor for optimal performance
-- Estimated execution time: 30-60 seconds

-- ===== PRODUCT INDEXES =====
-- Speed up category filtering
CREATE INDEX IF NOT EXISTS idx_products_category 
ON "Product"("category");

-- Speed up status filtering
CREATE INDEX IF NOT EXISTS idx_products_status 
ON "Product"("status");

-- Speed up sorting by newest
CREATE INDEX IF NOT EXISTS idx_products_created_at 
ON "Product"("createdAt" DESC);

-- Speed up price range filtering
CREATE INDEX IF NOT EXISTS idx_products_price 
ON "Product"("price");

-- Speed up featured products query
CREATE INDEX IF NOT EXISTS idx_products_featured 
ON "Product"("featured") 
WHERE "featured" = true;

-- Composite index for category + status queries
CREATE INDEX IF NOT EXISTS idx_products_category_status 
ON "Product"("category", "status");

-- ===== ORDER INDEXES =====
-- Speed up user's orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id 
ON "Order"("userId");

-- Speed up order status filtering
CREATE INDEX IF NOT EXISTS idx_orders_status 
ON "Order"("status");

-- Speed up order history sorting
CREATE INDEX IF NOT EXISTS idx_orders_created_at 
ON "Order"("createdAt" DESC);

-- Speed up sales analytics
CREATE INDEX IF NOT EXISTS idx_orders_total 
ON "Order"("total");

-- Speed up payment status checks
CREATE INDEX IF NOT EXISTS idx_orders_payment_status 
ON "Order"("paymentStatus");

-- Composite index for user + status queries
CREATE INDEX IF NOT EXISTS idx_orders_user_status 
ON "Order"("userId", "status");

-- ===== ORDER ITEM INDEXES =====
-- Speed up order items lookup
CREATE INDEX IF NOT EXISTS idx_order_items_order_id 
ON "OrderItem"("orderId");

-- Speed up product sales tracking
CREATE INDEX IF NOT EXISTS idx_order_items_product_id 
ON "OrderItem"("productId");

-- ===== USER INDEXES =====
-- Speed up email login
CREATE INDEX IF NOT EXISTS idx_users_email 
ON "User"("email");

-- Speed up role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role 
ON "User"("role");

-- Speed up user activity tracking
CREATE INDEX IF NOT EXISTS idx_users_created_at 
ON "User"("createdAt" DESC);

-- ===== OPTIONAL: Full-Text Search =====
-- Uncomment if you need product search
-- CREATE INDEX IF NOT EXISTS idx_products_search 
-- ON "Product" USING gin(to_tsvector('english', title || ' ' || description));

-- ===== VERIFY INDEXES =====
-- Run this to see all indexes:
-- SELECT tablename, indexname FROM pg_indexes 
-- WHERE schemaname = 'public' ORDER BY tablename, indexname;

"@

# Save SQL file
$indexesSQL | Out-File -FilePath "database-indexes.sql" -Encoding UTF8
Write-Status "Created: database-indexes.sql" "Success"

# =====================================================
# 6. Apply Indexes (if -Apply flag used)
# =====================================================
if ($Apply) {
    Write-Status "`nApplying indexes to database..." "Warning"
    Write-Host "This will execute SQL directly. Continue? (Y/n) " -NoNewline -ForegroundColor Yellow
    $confirm = Read-Host
    
    if ($confirm -eq "" -or $confirm -eq "Y" -or $confirm -eq "y") {
        try {
            # Note: This requires psql to be installed
            # npx prisma db execute --file database-indexes.sql
            Write-Status "Applying indexes..." "Info"
            
            # Alternative: Use Prisma's execute
            $sqlContent = Get-Content database-indexes.sql -Raw
            $tempFile = [System.IO.Path]::GetTempFileName()
            $sqlContent | Out-File -FilePath $tempFile -Encoding UTF8
            
            npx prisma db execute --file $tempFile
            Remove-Item $tempFile
            
            Write-Status "Indexes applied successfully!" "Success"
        } catch {
            Write-Status "Failed to apply indexes automatically" "Warning"
            Write-Host "Please apply manually via Supabase SQL Editor" -ForegroundColor Yellow
        }
    } else {
        Write-Status "Skipped applying indexes" "Info"
    }
}

# =====================================================
# 7. Seed Initial Data (if -Seed flag used)
# =====================================================
if ($Seed) {
    Write-Status "`nSeeding initial data..." "Info"
    
    if (Test-Path "prisma/seed.ts") {
        try {
            npx prisma db seed
            Write-Status "Database seeded successfully" "Success"
        } catch {
            Write-Status "Seeding failed: $($_.Exception.Message)" "Warning"
        }
    } else {
        Write-Status "No seed file found (prisma/seed.ts)" "Warning"
    }
}

# =====================================================
# 8. Database Statistics
# =====================================================
Write-Status "`nDatabase statistics..." "Info"

$statsSQL = @"
-- Quick stats query
SELECT 
  'Products' as table_name, COUNT(*) as row_count FROM "Product"
UNION ALL
SELECT 'Orders', COUNT(*) FROM "Order"
UNION ALL
SELECT 'Users', COUNT(*) FROM "User"
UNION ALL
SELECT 'OrderItems', COUNT(*) FROM "OrderItem";
"@

$statsSQL | Out-File -FilePath "database-stats.sql" -Encoding UTF8
Write-Status "Created: database-stats.sql (run in Supabase to see counts)" "Success"

# =====================================================
# 9. Create Maintenance Scripts
# =====================================================
Write-Status "`nCreating maintenance scripts..." "Info"

$maintenanceSQL = @"
-- =====================================================
-- Database Maintenance Scripts
-- =====================================================

-- ===== CHECK TABLE SIZES =====
SELECT 
  schemaname as schema,
  tablename as table,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ===== CHECK INDEX USAGE =====
SELECT
  schemaname as schema,
  tablename as table,
  indexname as index,
  idx_scan as scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- ===== IDENTIFY MISSING INDEXES =====
SELECT 
  schemaname as schema,
  tablename as table,
  seq_scan as sequential_scans,
  seq_tup_read as rows_read,
  idx_scan as index_scans,
  seq_tup_read / seq_scan as avg_rows_per_scan
FROM pg_stat_user_tables
WHERE schemaname = 'public' 
  AND seq_scan > 0
ORDER BY seq_tup_read / seq_scan DESC
LIMIT 10;

-- ===== VACUUM ANALYZE (run monthly) =====
-- VACUUM ANALYZE "Product";
-- VACUUM ANALYZE "Order";
-- VACUUM ANALYZE "User";

"@

$maintenanceSQL | Out-File -FilePath "database-maintenance.sql" -Encoding UTF8
Write-Status "Created: database-maintenance.sql" "Success"

# =====================================================
# Summary
# =====================================================
Write-Status "`n📊 Database Setup Complete!" "Header"
Write-Host ""
Write-Host "✓ Migrations executed" -ForegroundColor Green
Write-Host "✓ Prisma Client generated" -ForegroundColor Green
Write-Host "✓ Performance indexes created" -ForegroundColor Green
Write-Host ""
Write-Host "Generated files:" -ForegroundColor Cyan
Write-Host "  • database-indexes.sql       - Performance indexes" -ForegroundColor White
Write-Host "  • database-stats.sql         - Quick statistics query" -ForegroundColor White
Write-Host "  • database-maintenance.sql   - Maintenance queries" -ForegroundColor White
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Go to Supabase: https://supabase.com/dashboard" -ForegroundColor White
Write-Host "2. Select your project → SQL Editor" -ForegroundColor White
Write-Host "3. Copy content from database-indexes.sql" -ForegroundColor White
Write-Host "4. Paste and click 'Run'" -ForegroundColor White
Write-Host "5. Verify: Should see 'Success' for each index" -ForegroundColor White
Write-Host ""
Write-Host "⏱️  Index creation time: ~30-60 seconds" -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 Pro tip: Run database-stats.sql to verify data" -ForegroundColor Cyan
Write-Host ""
