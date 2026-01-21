/**
 * Check Users in Database
 * Lists all users in the User table to verify admin accounts
 */

import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
config({ path: '.env.local' });

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('🔍 Checking users in database...\n');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (users.length === 0) {
      console.log('❌ No users found in database\n');
      console.log('💡 To create an admin user, run:');
      console.log('   bun run scripts/create-admin.ts\n');
      return;
    }

    console.log(`✅ Found ${users.length} user(s):\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Name: ${user.name || '(not set)'}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Email Verified: ${user.emailVerified ? 'Yes' : 'No'}`);
      console.log(`   Created: ${user.createdAt.toLocaleString()}`);
      console.log('');
    });

    // Check for admin users
    const adminUsers = users.filter(u => u.role.toLowerCase() === 'admin');
    
    if (adminUsers.length === 0) {
      console.log('⚠️  No admin users found\n');
      console.log('💡 To create an admin user, run:');
      console.log('   bun run scripts/create-admin.ts\n');
    } else {
      console.log(`✅ Found ${adminUsers.length} admin user(s):`);
      adminUsers.forEach(admin => {
        console.log(`   - ${admin.email}`);
      });
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error checking users:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
