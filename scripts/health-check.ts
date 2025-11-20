import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function healthCheck() {
  console.log('🔍 KOLLECT-IT SYSTEM HEALTH CHECK\n');
  console.log('═'.repeat(50) + '\n');
  
  const checks = {
    database: false,
    admin: false,
    tables: false,
    env: false
  };

  // Check 1: Database Connection
  try {
    await prisma.$connect();
    checks.database = true;
    console.log('✅ Database: Connected');
  } catch (error) {
    console.error('❌ Database: Failed to connect');
    console.error('   Error:', error instanceof Error ? error.message : 'Unknown error');
  }

  // Check 2: Required Tables
  try {
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();
    
    checks.tables = true;
    console.log('✅ Tables: Accessible');
    console.log(`   - Users: ${userCount}`);
    console.log(`   - Products: ${productCount}`);
    console.log(`   - Categories: ${categoryCount}`);
  } catch (error) {
    console.error('❌ Tables: Failed to access');
  }

  // Check 3: Admin User
  try {
    const admin = await prisma.user.findFirst({
      where: { role: 'admin' }
    });
    
    if (admin) {
      checks.admin = true;
      console.log(`✅ Admin User: ${admin.email}`);
    } else {
      console.warn('⚠️  Admin User: Not found');
      console.warn('   Run: bun run scripts/create-admin.ts');
    }
  } catch (error) {
    console.error('❌ Admin User: Check failed');
  }

  // Check 4: Environment Variables
  const required = [
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'IMAGEKIT_PRIVATE_KEY',
    'RESEND_API_KEY'
  ];
  
  const missing = required.filter(v => !process.env[v]);
  
  if (missing.length === 0) {
    checks.env = true;
    console.log('✅ Environment: All required variables set');
  } else {
    console.error('❌ Environment: Missing variables:');
    missing.forEach(v => console.error(`   - ${v}`));
  }

  // Summary
  console.log('\n' + '═'.repeat(50));
  const allPassed = Object.values(checks).every(v => v);
  
  if (allPassed) {
    console.log('✅ ALL CHECKS PASSED - System Ready');
    process.exit(0);
  } else {
    console.log('❌ SOME CHECKS FAILED - Review issues above');
    process.exit(1);
  }
}

healthCheck()
  .catch((error) => {
    console.error('Health check failed:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });