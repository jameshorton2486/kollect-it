import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Kollect-It Auth Fix Script\n');
  
  // 1. Check database connection
  console.log('1️⃣ Testing database connection...');
  try {
    await prisma.$connect();
    console.log('   ✅ Database connected\n');
  } catch (e) {
    console.log('   ❌ Database connection failed:', e);
    process.exit(1);
  }
  
  // 2. Check/create admin user
  console.log('2️⃣ Checking admin user...');
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@kollect-it.com';
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword) {
    console.error('❌ ERROR: ADMIN_PASSWORD environment variable is required');
    console.error('   Set ADMIN_PASSWORD in .env.local before running this script');
    process.exit(1);
  }
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword, role: 'admin' },
    create: { email: adminEmail, password: hashedPassword, name: 'Admin', role: 'admin' },
  });
  console.log(`   ✅ Admin user ready: ${admin.email}\n`);
  
  // 3. List all users
  console.log('3️⃣ Current users in database:');
  const users = await prisma.user.findMany({
    select: { email: true, role: true, password: true },
  });
  
  for (const user of users) {
    const hasPassword = user.password ? '🔐' : '⚠️ NO PASSWORD';
    console.log(`   - ${user.email} (${user.role}) ${hasPassword}`);
  }
  
  // 4. Check environment
  console.log('\n4️⃣ Environment check:');
  const vars = ['NEXTAUTH_URL', 'NEXTAUTH_SECRET', 'DATABASE_URL', 'EMAIL_USER'];
  for (const v of vars) {
    const value = process.env[v];
    const status = value ? `✅ Set (${value.substring(0, 20)}...)` : '❌ NOT SET';
    console.log(`   ${v}: ${status}`);
  }
  
  // 5. Validate NEXTAUTH_SECRET length
  console.log('\n5️⃣ Validating NEXTAUTH_SECRET...');
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    console.log('   ❌ NEXTAUTH_SECRET is not set');
  } else if (secret.length < 32) {
    console.log(`   ⚠️  NEXTAUTH_SECRET is only ${secret.length} characters (should be 32+)`);
    console.log('   💡 Generate a new one: openssl rand -base64 32');
  } else {
    console.log(`   ✅ NEXTAUTH_SECRET is ${secret.length} characters`);
  }
  
  // 6. Check email configuration
  console.log('\n6️⃣ Email configuration:');
  const emailVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASSWORD', 'EMAIL_FROM'];
  let emailConfigured = true;
  for (const v of emailVars) {
    const value = process.env[v];
    if (!value) {
      console.log(`   ❌ ${v} is not set`);
      emailConfigured = false;
    } else {
      // Mask sensitive values
      if (v === 'EMAIL_PASSWORD') {
        console.log(`   ✅ ${v}: Set (${value.substring(0, 3)}***)`);
      } else {
        console.log(`   ✅ ${v}: ${value}`);
      }
    }
  }
  
  if (!emailConfigured) {
    console.log('\n   📝 Email not configured - reset URLs will be logged to console');
    console.log('   💡 See AUTH_SETUP.md for email setup instructions');
  } else {
    console.log('   ✅ Email fully configured');
  }
  
  console.log('\n✅ Fix script complete!');
  console.log('\n📋 Login Credentials:');
  console.log('─'.repeat(50));
  console.log(`   Email:    ${adminEmail}`);
  console.log(`   Password: [Set via ADMIN_PASSWORD environment variable]`);
  console.log('─'.repeat(50));
  console.log('\n🌐 Login at:');
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  console.log(`   ${baseUrl}/admin/login`);
  console.log(`   ${baseUrl}/login`);
  console.log('\n📚 For troubleshooting, see: AUTH_SETUP.md\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
