import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import ImageKit from 'imagekit';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log(`Loading environment from ${envPath}`);
  dotenv.config({ path: envPath });
} else {
  console.log('No .env.local found, using process.env');
}

const REQUIRED_VARS = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY',
  'IMAGEKIT_PRIVATE_KEY',
  'NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT',
  'NEXT_PUBLIC_APP_URL'
];

async function testEnvironment() {
  console.log('\n🔍 Starting Comprehensive Environment Check...\n');
  let errors = 0;
  let warnings = 0;

  // 1. Check Variable Existence
  console.log('1️⃣  Checking Environment Variables...');
  for (const key of REQUIRED_VARS) {
    if (!process.env[key]) {
      console.error(`❌ MISSING: ${key}`);
      errors++;
    } else {
      const value = process.env[key] || '';
      const masked = value.length > 8 ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}` : '****';
      console.log(`✅ FOUND: ${key} (${masked})`);
    }
  }

  // 2. Validate URL Formats
  console.log('\n2️⃣  Validating URL Configuration...');
  const urls = [
    { key: 'NEXTAUTH_URL', value: process.env.NEXTAUTH_URL },
    { key: 'NEXT_PUBLIC_APP_URL', value: process.env.NEXT_PUBLIC_APP_URL },
    { key: 'NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT', value: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT }
  ];

  for (const { key, value } of urls) {
    if (!value) continue;
    try {
      new URL(value);
      
      // Specific check for production vs localhost
      if (key === 'NEXTAUTH_URL') {
        if (value.includes('localhost') && process.env.NODE_ENV === 'production') {
          console.warn(`⚠️  WARNING: NEXTAUTH_URL is set to localhost in production mode!`);
          warnings++;
        }
        if (!value.startsWith('http')) {
           console.error(`❌ ERROR: ${key} must start with http:// or https://`);
           errors++;
        }
      }
      console.log(`✅ VALID URL: ${key}`);
    } catch (e) {
      console.error(`❌ INVALID URL: ${key} (${value})`);
      errors++;
    }
  }

  // 3. Test Database Connection
  console.log('\n3️⃣  Testing Database Connection...');
  if (process.env.DATABASE_URL) {
    const prisma = new PrismaClient();
    try {
      await prisma.$connect();
      console.log('✅ Database connection successful');
      
      // Quick query to verify read access
      const userCount = await prisma.user.count();
      console.log(`✅ Database read access verified (User count: ${userCount})`);
      
      await prisma.$disconnect();
    } catch (error) {
      console.error('❌ Database connection failed:', error instanceof Error ? error.message : error);
      errors++;
    }
  } else {
    console.log('⏭️  Skipping Database check (missing URL)');
  }

  // 4. Test Stripe Connection
  console.log('\n4️⃣  Testing Stripe Connection...');
  if (process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-02-24.acacia', // Updated to match likely version, or use '2023-10-16' as safe default if unsure
      });
      const balance = await stripe.balance.retrieve();
      console.log(`✅ Stripe connection successful (Live mode: ${balance.livemode})`);
    } catch (error) {
      console.error('❌ Stripe connection failed:', error instanceof Error ? error.message : error);
      errors++;
    }
  } else {
    console.log('⏭️  Skipping Stripe check (missing key)');
  }

  // 5. Test ImageKit Connection
  console.log('\n5️⃣  Testing ImageKit Connection...');
  if (process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT) {
    try {
      const imagekit = new ImageKit({
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
      });
      
      // Just check if we can list files (limit 1)
      await new Promise((resolve, reject) => {
        imagekit.listFiles({ limit: 1 }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
      });
      console.log('✅ ImageKit connection successful');
    } catch (error) {
      console.error('❌ ImageKit connection failed:', error instanceof Error ? error.message : error);
      errors++;
    }
  } else {
    console.log('⏭️  Skipping ImageKit check (missing credentials)');
  }

  // Summary
  console.log('\n📊 Diagnostic Summary');
  console.log('=====================');
  console.log(`Errors:   ${errors}`);
  console.log(`Warnings: ${warnings}`);
  
  if (errors > 0) {
    console.log('\n❌ Environment check FAILED. Please fix the errors above.');
    process.exit(1);
  } else {
    console.log('\n✅ Environment check PASSED. System is ready.');
    process.exit(0);
  }
}

testEnvironment().catch(console.error);
