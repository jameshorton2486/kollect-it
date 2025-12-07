/**
 * Generates the correct DIRECT_URL from your DATABASE_URL
 * This script will show you exactly what to add to .env.local
 */

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function generateDirectUrl(databaseUrl: string): string {
  // Replace port 6543 with 5432
  let directUrl = databaseUrl.replace(':6543/', ':5432/');
  
  // For Supabase pooler URLs, we might need to adjust the hostname
  // But let's start with just changing the port
  return directUrl;
}

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('🔧 DIRECT_URL Generator\n');
  console.log('This script will help you add DIRECT_URL to .env.local\n');

  // Check if .env.local exists
  const envPath = path.join(process.cwd(), '.env.local');
  const envExists = fs.existsSync(envPath);

  if (!envExists) {
    console.log('❌ .env.local file not found in project root');
    console.log('   Please create it first with your DATABASE_URL');
    rl.close();
    process.exit(1);
  }

  // Read current .env.local
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');

  // Find DATABASE_URL
  const dbUrlLine = lines.find(line => line.trim().startsWith('DATABASE_URL='));
  
  if (!dbUrlLine) {
    console.log('❌ DATABASE_URL not found in .env.local');
    console.log('   Please add DATABASE_URL first');
    rl.close();
    process.exit(1);
  }

  // Extract the URL value
  const dbUrlMatch = dbUrlLine.match(/DATABASE_URL=["']?([^"'\s]+)["']?/);
  if (!dbUrlMatch) {
    console.log('❌ Could not parse DATABASE_URL');
    rl.close();
    process.exit(1);
  }

  const databaseUrl = dbUrlMatch[1];
  console.log('✅ Found DATABASE_URL');
  console.log(`   ${databaseUrl.substring(0, 60)}...\n`);

  // Check if DIRECT_URL already exists
  const directUrlLine = lines.find(line => line.trim().startsWith('DIRECT_URL='));
  
  if (directUrlLine) {
    console.log('⚠️  DIRECT_URL already exists in .env.local');
    const directUrlMatch = directUrlLine.match(/DIRECT_URL=["']?([^"'\s]+)["']?/);
    if (directUrlMatch) {
      const existingDirectUrl = directUrlMatch[1];
      const portMatch = existingDirectUrl.match(/:(\d+)\//);
      const port = portMatch ? portMatch[1] : null;
      
      if (port === '5432') {
        console.log('✅ DIRECT_URL is already configured correctly!');
        console.log(`   Port: ${port} (correct)`);
        rl.close();
        process.exit(0);
      } else {
        console.log(`⚠️  DIRECT_URL uses port ${port}, should be 5432`);
        console.log('   You need to update it\n');
      }
    }
  }

  // Generate DIRECT_URL
  let directUrl = generateDirectUrl(databaseUrl);
  
  // For Supabase, check if we need to use a different hostname
  if (databaseUrl.includes('pooler.supabase.com')) {
    console.log('📋 Detected Supabase connection');
    console.log('   For Supabase, you may need the direct connection URL from your dashboard');
    console.log('   Check: Supabase Dashboard → Settings → Database → Connection string\n');
    
    const useDirect = await question('Do you have the direct connection URL from Supabase? (y/n): ');
    
    if (useDirect.toLowerCase() === 'y') {
      const customUrl = await question('Paste the direct connection URL (port 5432): ');
      if (customUrl.trim()) {
        directUrl = customUrl.trim();
      }
    }
  }

  console.log('\n📝 Add this line to your .env.local file:\n');
  console.log(`DIRECT_URL="${directUrl}"\n`);

  // Offer to add it automatically
  const autoAdd = await question('Would you like me to add it automatically? (y/n): ');
  
  if (autoAdd.toLowerCase() === 'y') {
    // Check if DIRECT_URL already exists
    if (directUrlLine) {
      // Replace existing line
      const newLines = lines.map(line => 
        line.trim().startsWith('DIRECT_URL=') 
          ? `DIRECT_URL="${directUrl}"`
          : line
      );
      fs.writeFileSync(envPath, newLines.join('\n'), 'utf-8');
      console.log('✅ Updated DIRECT_URL in .env.local');
    } else {
      // Add new line after DATABASE_URL
      const dbUrlIndex = lines.findIndex(line => line.trim().startsWith('DATABASE_URL='));
      const newLines = [
        ...lines.slice(0, dbUrlIndex + 1),
        `DIRECT_URL="${directUrl}"`,
        ...lines.slice(dbUrlIndex + 1)
      ];
      fs.writeFileSync(envPath, newLines.join('\n'), 'utf-8');
      console.log('✅ Added DIRECT_URL to .env.local');
    }
    
    console.log('\n✨ Next steps:');
    console.log('   1. Run: npx prisma generate');
    console.log('   2. Run: npx prisma db push');
    console.log('   3. Run: npx tsx scripts/seed-categories.ts');
  } else {
    console.log('\n📋 Manual steps:');
    console.log('   1. Open .env.local');
    console.log('   2. Add this line (after DATABASE_URL):');
    console.log(`      DIRECT_URL="${directUrl}"`);
    console.log('   3. Save the file');
    console.log('   4. Run: npx prisma db push');
  }

  rl.close();
}

main().catch((e) => {
  console.error('❌ Error:', e);
  rl.close();
  process.exit(1);
});
