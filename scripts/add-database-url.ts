/**
 * Add DATABASE_URL to .env.local
 * 
 * SECURITY FEATURES:
 * - Never logs full connection strings or passwords
 * - Validates input format before writing
 * - Creates backup before modifying files
 * - Masks sensitive data in all output
 * 
 * Usage:
 *   npx tsx scripts/add-database-url.ts
 *   npx tsx scripts/add-database-url.ts --verify   # Just verify current config
 */

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// ============================================
// SECURITY: Mask sensitive data in output
// ============================================

function maskConnectionString(url: string): string {
  try {
    // Match postgresql://user:password@host:port/database
    const match = url.match(/^(postgresql:\/\/[^:]+:)([^@]+)(@.+)$/);
    if (match) {
      const passwordLength = match[2].length;
      const maskedPassword = '*'.repeat(Math.min(passwordLength, 8));
      return `${match[1]}${maskedPassword}${match[3]}`;
    }
    // If pattern doesn't match, mask everything after ://
    const protocolEnd = url.indexOf('://');
    if (protocolEnd !== -1) {
      return url.substring(0, protocolEnd + 3) + '***MASKED***';
    }
    return '***INVALID_FORMAT***';
  } catch {
    return '***MASKED***';
  }
}

function extractProjectRef(url: string): string | null {
  // Extract project reference from Supabase URL
  // Format: postgres.[PROJECT_REF]:password@...
  const match = url.match(/postgres\.([a-z0-9]+):/i);
  return match ? match[1] : null;
}

function extractPort(url: string): string | null {
  const match = url.match(/:(\d{4})\//);
  return match ? match[1] : null;
}

// ============================================
// VALIDATION
// ============================================

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function validateConnectionString(url: string, type: 'pooled' | 'direct'): ValidationResult {
  const result: ValidationResult = { valid: true, errors: [], warnings: [] };

  // Check basic format
  if (!url.startsWith('postgresql://') && !url.startsWith('postgres://')) {
    result.valid = false;
    result.errors.push('URL must start with postgresql:// or postgres://');
  }

  // Check for Supabase format
  if (!url.includes('supabase.com')) {
    result.warnings.push('URL does not appear to be a Supabase connection');
  }

  // Check port based on type
  const port = extractPort(url);
  if (type === 'pooled') {
    if (port !== '6543') {
      result.warnings.push(`Pooled connection should use port 6543, found: ${port || 'unknown'}`);
    }
    if (!url.includes('pgbouncer=true')) {
      result.warnings.push('Pooled connection should include ?pgbouncer=true');
    }
  } else if (type === 'direct') {
    if (port !== '5432') {
      result.warnings.push(`Direct connection should use port 5432, found: ${port || 'unknown'}`);
    }
  }

  // Check for common mistakes
  if (url.includes('[') || url.includes(']')) {
    result.valid = false;
    result.errors.push('URL contains placeholder brackets [ ] - replace with actual values');
  }

  if (url.includes('YOUR') || url.includes('your') || url.includes('PASSWORD')) {
    result.valid = false;
    result.errors.push('URL contains placeholder text - replace with actual values');
  }

  return result;
}

// ============================================
// FILE OPERATIONS
// ============================================

function createBackup(filePath: string): string | null {
  if (!fs.existsSync(filePath)) return null;
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${filePath}.backup-${timestamp}`;
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

function readEnvFile(filePath: string): Map<string, string> {
  const env = new Map<string, string>();
  
  if (!fs.existsSync(filePath)) return env;
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    const match = trimmed.match(/^([^=]+)=["']?(.+?)["']?$/);
    if (match) {
      env.set(match[1], match[2]);
    }
  }
  
  return env;
}

function writeEnvFile(filePath: string, updates: Map<string, string>): void {
  let content = '';
  
  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath, 'utf-8');
  }
  
  const lines = content.split('\n');
  const updatedKeys = new Set<string>();
  
  // Update existing lines
  const newLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return line;
    
    const match = trimmed.match(/^([^=]+)=/);
    if (match && updates.has(match[1])) {
      updatedKeys.add(match[1]);
      const value = updates.get(match[1])!;
      // Use quotes if value contains special characters
      if (value.includes('?') || value.includes('&') || value.includes(' ')) {
        return `${match[1]}="${value}"`;
      }
      return `${match[1]}=${value}`;
    }
    return line;
  });
  
  // Add new keys that weren't updated
  for (const [key, value] of updates) {
    if (!updatedKeys.has(key)) {
      // Find the right position to insert (after DATABASE section)
      const dbIndex = newLines.findIndex(line => line.includes('DATABASE_URL'));
      if (dbIndex !== -1 && key === 'DIRECT_URL') {
        // Insert after DATABASE_URL
        if (value.includes('?') || value.includes('&') || value.includes(' ')) {
          newLines.splice(dbIndex + 1, 0, `${key}="${value}"`);
        } else {
          newLines.splice(dbIndex + 1, 0, `${key}=${value}`);
        }
      } else {
        // Add at the end
        if (value.includes('?') || value.includes('&') || value.includes(' ')) {
          newLines.push(`${key}="${value}"`);
        } else {
          newLines.push(`${key}=${value}`);
        }
      }
    }
  }
  
  fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8');
}

// ============================================
// USER INTERACTION
// ============================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

function printHeader(): void {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║           Kollect-It Database URL Configuration            ║');
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log('║  🔒 SECURITY: Passwords are NEVER logged or displayed      ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
}

function printInstructions(): void {
  console.log('📋 To get your connection strings:');
  console.log('');
  console.log('   1. Go to: https://supabase.com/dashboard');
  console.log('   2. Select your Kollect-It project');
  console.log('   3. Click: Settings → Database');
  console.log('   4. Scroll to: Connection string → URI tab');
  console.log('');
  console.log('   You need TWO connection strings:');
  console.log('   • Transaction mode (port 6543) → DATABASE_URL');
  console.log('   • Session mode (port 5432)     → DIRECT_URL');
  console.log('');
}

// ============================================
// MAIN FUNCTIONS
// ============================================

async function verifyConfig(): Promise<void> {
  const envPath = path.join(process.cwd(), '.env.local');
  
  console.log('🔍 Verifying current configuration...\n');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found');
    console.log('   Run this script without --verify to create it');
    return;
  }
  
  const env = readEnvFile(envPath);
  
  // Check DATABASE_URL
  const dbUrl = env.get('DATABASE_URL');
  if (dbUrl) {
    console.log('✅ DATABASE_URL found');
    console.log(`   Masked: ${maskConnectionString(dbUrl)}`);
    const validation = validateConnectionString(dbUrl, 'pooled');
    validation.warnings.forEach(w => console.log(`   ⚠️  ${w}`));
    validation.errors.forEach(e => console.log(`   ❌ ${e}`));
    
    const projectRef = extractProjectRef(dbUrl);
    if (projectRef) {
      console.log(`   Project: ${projectRef}`);
    }
  } else {
    console.log('❌ DATABASE_URL not found');
  }
  
  console.log('');
  
  // Check DIRECT_URL
  const directUrl = env.get('DIRECT_URL');
  if (directUrl) {
    console.log('✅ DIRECT_URL found');
    console.log(`   Masked: ${maskConnectionString(directUrl)}`);
    const validation = validateConnectionString(directUrl, 'direct');
    validation.warnings.forEach(w => console.log(`   ⚠️  ${w}`));
    validation.errors.forEach(e => console.log(`   ❌ ${e}`));
  } else {
    console.log('❌ DIRECT_URL not found');
    console.log('   This is required for Prisma migrations');
  }
  
  console.log('');
  
  // Test connection suggestion
  console.log('📝 To test the connection, run:');
  console.log('   npx prisma db pull');
}

async function addDatabaseUrl(): Promise<void> {
  const envPath = path.join(process.cwd(), '.env.local');
  const env = readEnvFile(envPath);
  
  // Check current state
  const hasDbUrl = env.has('DATABASE_URL');
  const hasDirectUrl = env.has('DIRECT_URL');
  
  if (hasDbUrl && hasDirectUrl) {
    console.log('✅ Both DATABASE_URL and DIRECT_URL already exist\n');
    const overwrite = await question('Do you want to update them? (y/n): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('\n👋 No changes made');
      return;
    }
  }
  
  printInstructions();
  
  const updates = new Map<string, string>();
  
  // Get DATABASE_URL (pooled)
  console.log('─'.repeat(60));
  console.log('Step 1: Pooled Connection (DATABASE_URL)');
  console.log('─'.repeat(60));
  
  if (hasDbUrl) {
    console.log(`Current: ${maskConnectionString(env.get('DATABASE_URL')!)}`);
    const update = await question('Update DATABASE_URL? (y/n): ');
    if (update.toLowerCase() !== 'y') {
      console.log('Keeping existing DATABASE_URL\n');
    } else {
      const dbUrl = await question('Paste your pooled connection string (port 6543): ');
      const validation = validateConnectionString(dbUrl.trim(), 'pooled');
      
      if (!validation.valid) {
        console.log('❌ Invalid connection string:');
        validation.errors.forEach(e => console.log(`   ${e}`));
        rl.close();
        process.exit(1);
      }
      
      validation.warnings.forEach(w => console.log(`⚠️  ${w}`));
      updates.set('DATABASE_URL', dbUrl.trim());
    }
  } else {
    const dbUrl = await question('Paste your pooled connection string (port 6543): ');
    const validation = validateConnectionString(dbUrl.trim(), 'pooled');
    
    if (!validation.valid) {
      console.log('❌ Invalid connection string:');
      validation.errors.forEach(e => console.log(`   ${e}`));
      rl.close();
      process.exit(1);
    }
    
    validation.warnings.forEach(w => console.log(`⚠️  ${w}`));
    updates.set('DATABASE_URL', dbUrl.trim());
  }
  
  console.log('');
  
  // Get DIRECT_URL
  console.log('─'.repeat(60));
  console.log('Step 2: Direct Connection (DIRECT_URL)');
  console.log('─'.repeat(60));
  
  if (hasDirectUrl) {
    console.log(`Current: ${maskConnectionString(env.get('DIRECT_URL')!)}`);
    const update = await question('Update DIRECT_URL? (y/n): ');
    if (update.toLowerCase() !== 'y') {
      console.log('Keeping existing DIRECT_URL\n');
    } else {
      const directUrl = await question('Paste your direct connection string (port 5432): ');
      const validation = validateConnectionString(directUrl.trim(), 'direct');
      
      if (!validation.valid) {
        console.log('❌ Invalid connection string:');
        validation.errors.forEach(e => console.log(`   ${e}`));
        rl.close();
        process.exit(1);
      }
      
      validation.warnings.forEach(w => console.log(`⚠️  ${w}`));
      updates.set('DIRECT_URL', directUrl.trim());
    }
  } else {
    const directUrl = await question('Paste your direct connection string (port 5432): ');
    const validation = validateConnectionString(directUrl.trim(), 'direct');
    
    if (!validation.valid) {
      console.log('❌ Invalid connection string:');
      validation.errors.forEach(e => console.log(`   ${e}`));
      rl.close();
      process.exit(1);
    }
    
    validation.warnings.forEach(w => console.log(`⚠️  ${w}`));
    updates.set('DIRECT_URL', directUrl.trim());
  }
  
  // Confirm changes
  if (updates.size === 0) {
    console.log('\n👋 No changes to make');
    return;
  }
  
  console.log('\n─'.repeat(60));
  console.log('Summary of changes:');
  console.log('─'.repeat(60));
  
  for (const [key, value] of updates) {
    console.log(`${key}: ${maskConnectionString(value)}`);
  }
  
  const confirm = await question('\nApply these changes? (y/n): ');
  if (confirm.toLowerCase() !== 'y') {
    console.log('\n👋 No changes made');
    return;
  }
  
  // Create backup and write
  const backup = createBackup(envPath);
  if (backup) {
    console.log(`\n📦 Backup created: ${path.basename(backup)}`);
  }
  
  writeEnvFile(envPath, updates);
  console.log('✅ .env.local updated successfully');
  
  // Next steps
  console.log('\n─'.repeat(60));
  console.log('✨ Next steps:');
  console.log('─'.repeat(60));
  console.log('1. Test connection:     npx prisma db pull');
  console.log('2. Generate client:     npx prisma generate');
  console.log('3. Push schema:         npx prisma db push');
}

// ============================================
// ENTRY POINT
// ============================================

async function main(): Promise<void> {
  printHeader();
  
  const args = process.argv.slice(2);
  const verifyOnly = args.includes('--verify') || args.includes('-v');
  
  try {
    if (verifyOnly) {
      await verifyConfig();
    } else {
      await addDatabaseUrl();
    }
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  // SECURITY: Don't log the full error as it might contain credentials
  console.error('❌ An error occurred');
  if (error instanceof Error) {
    // Only log message, not stack trace which might contain sensitive data
    console.error(`   ${error.message}`);
  }
  rl.close();
  process.exit(1);
});
