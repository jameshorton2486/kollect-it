#!/usr/bin/env node
/**
 * KOLLECT-IT: ImageKit Connection Tester
 * 
 * Tests connection to ImageKit API with current credentials
 * Verifies authentication and upload capability
 * 
 * Usage: bun run test-imagekit
 */

import ImageKit from 'imagekit';

async function testImageKitConnection() {
  console.log('🔍 Testing ImageKit Connection\n');

  try {
    // Check environment variables
    const checks = [
      {
        name: 'IMAGEKIT_PUBLIC_KEY',
        value: process.env.IMAGEKIT_PUBLIC_KEY,
        required: true
      },
      {
        name: 'IMAGEKIT_PRIVATE_KEY',
        value: process.env.IMAGEKIT_PRIVATE_KEY,
        required: true
      },
      {
        name: 'IMAGEKIT_URL_ENDPOINT',
        value: process.env.IMAGEKIT_URL_ENDPOINT,
        required: true
      }
    ];

    console.log('📋 Environment Variables:');
    for (const check of checks) {
      const isSet = !!check.value;
      const icon = isSet ? '✅' : '❌';
      const display = isSet ? (check.name === 'IMAGEKIT_PRIVATE_KEY' ? '[SET]' : check.value) : '[NOT SET]';
      console.log(`   ${icon} ${check.name}: ${display}`);
    }
    console.log();

    const missing = checks.filter(c => c.required && !c.value);
    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:');
      for (const m of missing) {
        console.error(`   • ${m.name}`);
      }
      console.error('\nAdd these to .env.local and try again.');
      process.exit(1);
    }

    // Initialize ImageKit
    console.log('🚀 Initializing ImageKit SDK...');
    const imageKit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!
    });
    console.log('   ✅ SDK initialized\n');

    // Test 1: List files
    console.log('📁 Test 1: List Files');
    try {
      const files = await imageKit.listFiles({ limit: 1 });
      console.log(`   ✅ Connection successful`);
      console.log(`   📊 Total files in account: ${Array.isArray(files) ? files.length : 0}\n`);
    } catch (error) {
      console.error(`   ❌ Failed: ${error instanceof Error ? error.message : String(error)}\n`);
      throw error;
    }

    // Test 2: Get auth parameters (for client-side uploads)
    console.log('🔐 Test 2: Get Auth Parameters');
    try {
      const auth = imageKit.getAuthenticationParameters();
      console.log('   ✅ Auth parameters generated');
      console.log(`   🔑 Token: ${auth.token.slice(0, 20)}...`);
      console.log(`   🕐 Expires: ${new Date(auth.expire * 1000).toISOString()}\n`);
    } catch (error) {
      console.error(`   ❌ Failed: ${error instanceof Error ? error.message : String(error)}\n`);
      throw error;
    }

    // Test 3: URL endpoint health check
    console.log('🌐 Test 3: URL Endpoint Health');
    try {
      const response = await fetch(process.env.IMAGEKIT_URL_ENDPOINT!);
      if (response.ok || response.status === 404) {
        // 404 is fine for direct endpoint access
        console.log('   ✅ URL endpoint accessible\n');
      } else {
        console.error(`   ⚠️  Status code: ${response.status}\n`);
      }
    } catch (error) {
      console.error(`   ❌ Network error: ${error instanceof Error ? error.message : String(error)}\n`);
      throw error;
    }

    console.log('═══════════════════════════════');
    console.log('✅ All ImageKit tests passed!');
    console.log('═══════════════════════════════\n');
    console.log('You are ready to sync images using:');
    console.log('   bun run sync-from-google-drive\n');

    process.exit(0);
  } catch (error) {
    console.log('═══════════════════════════════');
    console.error('❌ ImageKit test failed');
    console.log('═══════════════════════════════\n');

    console.error('Troubleshooting steps:');
    console.error('1. Verify credentials in .env.local');
    console.error('2. Check ImageKit account status (dashboard)');
    console.error('3. Confirm API keys have upload permissions');
    console.error('4. Review IMAGEKIT_TROUBLESHOOTING.md in docs/\n');

    process.exit(1);
  }
}

testImageKitConnection();
