import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('Host: db.okthcpumncidcihdhgea.supabase.co');
    console.log('Port: 5432 (DIRECT_URL)');
    
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log('\n✅ SUCCESS - Database connected!');
    console.log('Current time from DB:', result);
    console.log('\n🎉 Your Supabase database is reachable and responding!');
  } catch (error) {
    console.error('\n❌ FAILED - Connection error:');
    console.error('Error Type:', error.code || error.name);
    console.error('Error Message:', error.message);
    console.error('\nDiagnostics:');
    console.error('- Check if Supabase database is running (not paused)');
    console.error('- Verify password: OTWKEmQXqu6yvopi');
    console.error('- Check if IP is not banned in Supabase Network settings');
    console.error('- Verify host: db.okthcpumncidcihdhgea.supabase.co');
  } finally {
    await prisma.$disconnect();
  }
}

test();
