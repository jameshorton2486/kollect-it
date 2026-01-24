/**
 * Cleanup Test/Demo Data from Kollect-It Database
 * 
 * SAFETY FEATURES:
 * - DRY RUN MODE (default): Shows what would be deleted without deleting
 * - Requires explicit --execute flag to perform actual deletion
 * - Protects production data with multiple safeguards
 * - Creates detailed log of all operations
 * - Confirmation prompt before destructive actions
 * 
 * Usage:
 *   npx tsx scripts/cleanup-test-data.ts              # Dry run (preview only)
 *   npx tsx scripts/cleanup-test-data.ts --execute    # Actually delete data
 *   npx tsx scripts/cleanup-test-data.ts --help       # Show help
 * 
 * What gets cleaned:
 *   - Products with "test", "demo", "sample" in title (case insensitive)
 *   - Products with SKU starting with "TEST-" or "DEMO-"
 *   - Draft products older than 30 days (optional, with --include-old-drafts)
 *   - Users with email containing "test@" or "@example.com"
 *   - Orders with status "test" or from test users
 */

import { PrismaClient } from '@prisma/client';
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// ============================================
// CONFIGURATION
// ============================================

interface CleanupConfig {
  dryRun: boolean;
  includeOldDrafts: boolean;
  oldDraftDays: number;
  verbose: boolean;
  logFile: string | null;
}

interface CleanupResult {
  table: string;
  count: number;
  items: { id: string; identifier: string }[];
}

// Patterns that identify test data
const TEST_PATTERNS = {
  productTitles: [
    /^test\s/i,
    /\stest$/i,
    /\stest\s/i,
    /^demo\s/i,
    /\sdemo$/i,
    /^sample\s/i,
    /\ssample$/i,
    /^placeholder/i,
    /^example\s/i,
  ],
  productSkus: [
    /^TEST-/i,
    /^DEMO-/i,
    /^SAMPLE-/i,
    /^TMP-/i,
  ],
  userEmails: [
    /@example\.com$/i,
    /@test\.com$/i,
    /^test@/i,
    /^demo@/i,
    /^sample@/i,
    /\+test@/i,
  ],
  // Protected patterns - NEVER delete these
  protectedEmails: [
    /james/i,
    /admin/i,
    /kollect-it\.com$/i,
  ],
};

// ============================================
// HELPERS
// ============================================

function parseArgs(): CleanupConfig {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }
  
  return {
    dryRun: !args.includes('--execute'),
    includeOldDrafts: args.includes('--include-old-drafts'),
    oldDraftDays: 30,
    verbose: args.includes('--verbose') || args.includes('-v'),
    logFile: args.includes('--log') ? `cleanup-${Date.now()}.log` : null,
  };
}

function printHelp(): void {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║             Kollect-It Test Data Cleanup                   ║
╚════════════════════════════════════════════════════════════╝

Usage:
  npx tsx scripts/cleanup-test-data.ts [options]

Options:
  --execute           Actually delete data (default is dry run)
  --include-old-drafts  Include draft products older than 30 days
  --verbose, -v       Show detailed output
  --log               Write operations to a log file
  --help, -h          Show this help message

Examples:
  # Preview what would be deleted (safe)
  npx tsx scripts/cleanup-test-data.ts

  # Actually delete test data
  npx tsx scripts/cleanup-test-data.ts --execute

  # Include old draft products in cleanup
  npx tsx scripts/cleanup-test-data.ts --execute --include-old-drafts

Safety Features:
  • DRY RUN by default - nothing deleted without --execute
  • Protected accounts (admin, james) are NEVER deleted
  • Confirmation required before deletion
  • All operations logged
`);
}

function matchesAnyPattern(value: string, patterns: RegExp[]): boolean {
  return patterns.some(pattern => pattern.test(value));
}

function isProtectedEmail(email: string): boolean {
  return matchesAnyPattern(email, TEST_PATTERNS.protectedEmails);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

function log(message: string, config: CleanupConfig): void {
  console.log(message);
  if (config.logFile) {
    fs.appendFileSync(config.logFile, message + '\n');
  }
}

// ============================================
// DATA IDENTIFICATION
// ============================================

async function findTestProducts(config: CleanupConfig): Promise<CleanupResult> {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
      sku: true,
      isDraft: true,
      createdAt: true,
    },
  });
  
  const testProducts = products.filter(product => {
    // Check title patterns
    if (matchesAnyPattern(product.title, TEST_PATTERNS.productTitles)) {
      return true;
    }
    
    // Check SKU patterns
    if (matchesAnyPattern(product.sku, TEST_PATTERNS.productSkus)) {
      return true;
    }
    
    return false;
  });
  
  return {
    table: 'Product',
    count: testProducts.length,
    items: testProducts.map(p => ({
      id: p.id,
      identifier: `${p.sku}: ${p.title.substring(0, 40)}${p.title.length > 40 ? '...' : ''}`,
    })),
  };
}

async function findOldDraftProducts(config: CleanupConfig): Promise<CleanupResult> {
  if (!config.includeOldDrafts) {
    return { table: 'Product (old drafts)', count: 0, items: [] };
  }
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - config.oldDraftDays);
  
  const oldDrafts = await prisma.product.findMany({
    where: {
      isDraft: true,
      createdAt: { lt: cutoffDate },
      // Exclude test products (already handled separately)
      NOT: {
        OR: [
          { sku: { startsWith: 'TEST-' } },
          { sku: { startsWith: 'DEMO-' } },
        ],
      },
    },
    select: {
      id: true,
      title: true,
      sku: true,
      createdAt: true,
    },
  });
  
  return {
    table: `Product (drafts older than ${config.oldDraftDays} days)`,
    count: oldDrafts.length,
    items: oldDrafts.map(p => ({
      id: p.id,
      identifier: `${p.sku}: ${p.title.substring(0, 30)}... (created ${p.createdAt.toISOString().split('T')[0]})`,
    })),
  };
}

async function findTestUsers(config: CleanupConfig): Promise<CleanupResult> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });
  
  const testUsers = users.filter(user => {
    // Never delete protected accounts
    if (isProtectedEmail(user.email)) {
      return false;
    }
    
    // Never delete admin accounts
    if (user.role === 'admin') {
      return false;
    }
    
    // Check email patterns
    return matchesAnyPattern(user.email, TEST_PATTERNS.userEmails);
  });
  
  return {
    table: 'User',
    count: testUsers.length,
    items: testUsers.map(u => ({
      id: u.id,
      identifier: `${u.email}${u.name ? ` (${u.name})` : ''}`,
    })),
  };
}

async function findTestOrders(config: CleanupConfig): Promise<CleanupResult> {
  // Get test user IDs first
  const testUsersResult = await findTestUsers(config);
  const testUserIds = testUsersResult.items.map(u => u.id);
  
  const testOrders = await prisma.order.findMany({
    where: {
      OR: [
        { status: 'test' },
        { notes: { contains: 'test', mode: 'insensitive' } },
        { userId: { in: testUserIds.length > 0 ? testUserIds : ['__none__'] } },
        { customerEmail: { contains: '@example.com' } },
        { customerEmail: { contains: '@test.com' } },
      ],
    },
    select: {
      id: true,
      orderNumber: true,
      customerEmail: true,
      total: true,
    },
  });
  
  return {
    table: 'Order',
    count: testOrders.length,
    items: testOrders.map(o => ({
      id: o.id,
      identifier: `${o.orderNumber} - ${o.customerEmail || 'no email'} ($${o.total})`,
    })),
  };
}

async function findTestAIProducts(config: CleanupConfig): Promise<CleanupResult> {
  const aiProducts = await prisma.aIGeneratedProduct.findMany({
    where: {
      OR: [
        { aiTitle: { contains: 'test', mode: 'insensitive' } },
        { aiTitle: { contains: 'demo', mode: 'insensitive' } },
        { aiTitle: { contains: 'sample', mode: 'insensitive' } },
        { status: 'REJECTED' },
      ],
    },
    select: {
      id: true,
      aiTitle: true,
      status: true,
    },
  });
  
  return {
    table: 'AIGeneratedProduct',
    count: aiProducts.length,
    items: aiProducts.map(p => ({
      id: p.id,
      identifier: `[${p.status}] ${p.aiTitle.substring(0, 40)}${p.aiTitle.length > 40 ? '...' : ''}`,
    })),
  };
}

// ============================================
// DELETION
// ============================================

async function deleteTestData(
  results: CleanupResult[],
  config: CleanupConfig
): Promise<void> {
  for (const result of results) {
    if (result.count === 0) continue;
    
    const ids = result.items.map(i => i.id);
    
    switch (result.table) {
      case 'Product':
      case `Product (drafts older than ${config.oldDraftDays} days)`:
        // Delete related data first (cascade should handle, but be explicit)
        await prisma.image.deleteMany({ where: { productId: { in: ids } } });
        await prisma.cartItem.deleteMany({ where: { productId: { in: ids } } });
        await prisma.wishlistItem.deleteMany({ where: { productId: { in: ids } } });
        await prisma.review.deleteMany({ where: { productId: { in: ids } } });
        await prisma.aIGeneratedProduct.updateMany({
          where: { productId: { in: ids } },
          data: { productId: null },
        });
        await prisma.product.deleteMany({ where: { id: { in: ids } } });
        break;
        
      case 'User':
        // Delete related data first
        await prisma.cartItem.deleteMany({ where: { userId: { in: ids } } });
        await prisma.wishlistItem.deleteMany({ where: { userId: { in: ids } } });
        await prisma.review.deleteMany({ where: { userId: { in: ids } } });
        await prisma.scheduledReport.deleteMany({ where: { userId: { in: ids } } });
        await prisma.order.updateMany({
          where: { userId: { in: ids } },
          data: { userId: null },
        });
        await prisma.user.deleteMany({ where: { id: { in: ids } } });
        break;
        
      case 'Order':
        await prisma.orderItem.deleteMany({ where: { orderId: { in: ids } } });
        await prisma.order.deleteMany({ where: { id: { in: ids } } });
        break;
        
      case 'AIGeneratedProduct':
        await prisma.aIGeneratedProduct.deleteMany({ where: { id: { in: ids } } });
        break;
    }
    
    log(`  ✅ Deleted ${result.count} records from ${result.table}`, config);
  }
}

// ============================================
// MAIN
// ============================================

async function main(): Promise<void> {
  const config = parseArgs();
  
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║           Kollect-It Test Data Cleanup                     ║');
  console.log('╠════════════════════════════════════════════════════════════╣');
  if (config.dryRun) {
    console.log('║  🔍 DRY RUN MODE - No data will be deleted                 ║');
  } else {
    console.log('║  ⚠️  EXECUTE MODE - Data WILL be deleted                   ║');
  }
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  
  if (config.logFile) {
    log(`📝 Logging to: ${config.logFile}`, config);
    log(`Started: ${new Date().toISOString()}`, config);
  }
  
  // Find all test data
  log('🔍 Scanning for test data...\n', config);
  
  const results: CleanupResult[] = [
    await findTestProducts(config),
    await findOldDraftProducts(config),
    await findTestUsers(config),
    await findTestOrders(config),
    await findTestAIProducts(config),
  ];
  
  // Display summary
  log('─'.repeat(60), config);
  log('SUMMARY', config);
  log('─'.repeat(60), config);
  
  let totalCount = 0;
  for (const result of results) {
    if (result.count > 0) {
      log(`\n📦 ${result.table}: ${result.count} records`, config);
      
      if (config.verbose) {
        for (const item of result.items) {
          log(`   • ${item.identifier}`, config);
        }
      } else if (result.count <= 5) {
        for (const item of result.items) {
          log(`   • ${item.identifier}`, config);
        }
      } else {
        // Show first 3 and last 2
        for (let i = 0; i < 3; i++) {
          log(`   • ${result.items[i].identifier}`, config);
        }
        log(`   ... and ${result.count - 5} more ...`, config);
        for (let i = result.count - 2; i < result.count; i++) {
          log(`   • ${result.items[i].identifier}`, config);
        }
      }
      totalCount += result.count;
    }
  }
  
  if (totalCount === 0) {
    log('\n✨ No test data found! Database is clean.', config);
    rl.close();
    await prisma.$disconnect();
    return;
  }
  
  log(`\n${'─'.repeat(60)}`, config);
  log(`TOTAL: ${totalCount} records to ${config.dryRun ? 'be deleted' : 'delete'}`, config);
  log('─'.repeat(60), config);
  
  if (config.dryRun) {
    log('\n🔍 This was a DRY RUN. No data was deleted.', config);
    log('   To actually delete, run with --execute flag:', config);
    log('   npx tsx scripts/cleanup-test-data.ts --execute', config);
    rl.close();
    await prisma.$disconnect();
    return;
  }
  
  // Confirmation for actual deletion
  console.log('');
  console.log('⚠️  WARNING: This action cannot be undone!');
  console.log('');
  
  const confirm = await question('Type "DELETE" to confirm deletion: ');
  
  if (confirm !== 'DELETE') {
    log('\n❌ Deletion cancelled.', config);
    rl.close();
    await prisma.$disconnect();
    return;
  }
  
  // Perform deletion
  log('\n🗑️  Deleting test data...', config);
  
  try {
    await deleteTestData(results, config);
    log('\n✅ Cleanup complete!', config);
  } catch (error) {
    log(`\n❌ Error during deletion: ${error}`, config);
    throw error;
  }
  
  rl.close();
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error('❌ Fatal error:', error);
  rl.close();
  await prisma.$disconnect();
  process.exit(1);
});
