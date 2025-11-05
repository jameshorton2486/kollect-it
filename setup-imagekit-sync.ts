#!/usr/bin/env bun
/**
 * Automated ImageKit Sync Setup Wizard
 * Handles Google Drive to ImageKit configuration with interactive prompts
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import * as readline from 'readline';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

interface SetupConfig {
  imagekitPublicKey: string;
  imagekitPrivateKey: string;
  imagekitUrlEndpoint: string;
  googleDriveFolderId: string;
  webhookSecret: string;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function log(message: string, color: keyof typeof colors = 'reset'): void {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title: string): void {
  console.log('\n');
  log(`${'='.repeat(60)}`, 'cyan');
  log(`  ${title}`, 'bright');
  log(`${'='.repeat(60)}`, 'cyan');
}

function logSuccess(message: string): void {
  log(`✅ ${message}`, 'green');
}

function logWarning(message: string): void {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message: string): void {
  log(`❌ ${message}`, 'red');
}

async function checkDependencies(): Promise<void> {
  logSection('Step 1: Checking Dependencies');

  const dependencies = ['imagekit', 'googleapis', 'dotenv'];
  const missing: string[] = [];

  for (const dep of dependencies) {
    try {
      require.resolve(dep);
      logSuccess(`${dep} is installed`);
    } catch {
      missing.push(dep);
      logWarning(`${dep} is not installed`);
    }
  }

  if (missing.length > 0) {
    log(`\nInstalling missing dependencies: ${missing.join(', ')}`, 'blue');
    try {
      execSync(`bun add ${missing.join(' ')}`, { stdio: 'inherit' });
      logSuccess('Dependencies installed');
    } catch (error) {
      logError('Failed to install dependencies');
      throw error;
    }
  }
}

async function getGoogleCloudSetup(): Promise<{ folderId: string }> {
  logSection('Step 2: Google Cloud Configuration');

  log('To get your Google Drive Folder ID:', 'blue');
  log('1. Go to https://console.cloud.google.com/', 'blue');
  log('2. Create a new project: "Kollect-It ImageKit Sync"', 'blue');
  log('3. Enable Google Drive API (APIs & Services > Library > Google Drive API > Enable)', 'blue');
  log('4. Create Service Account (APIs & Services > Credentials > + Create Credentials)', 'blue');
  log('5. Create JSON Key and save as google-credentials.json in project root', 'blue');
  log('6. Share your Drive folder with the service account email', 'blue');
  log('7. Copy your Drive folder ID from the URL after /folders/', 'blue');

  const folderId = await question(
    `\n${colors.cyan}Enter your Google Drive Folder ID: ${colors.reset}`
  );

  if (!folderId || folderId.trim().length === 0) {
    logError('Folder ID cannot be empty');
    return getGoogleCloudSetup();
  }

  logSuccess(`Google Drive Folder ID: ${folderId}`);
  return { folderId };
}

async function getImageKitSetup(): Promise<{
  publicKey: string;
  privateKey: string;
  urlEndpoint: string;
}> {
  logSection('Step 3: ImageKit Configuration');

  log('To get your ImageKit credentials:', 'blue');
  log('1. Go to https://imagekit.io and sign in', 'blue');
  log('2. Go to Settings > API Keys', 'blue');
  log('3. Copy your Public Key (starts with public_)', 'blue');
  log('4. Copy your Private Key (long alphanumeric string)', 'blue');
  log('5. Copy your URL Endpoint (https://ik.imagekit.io/yoursubdomain)', 'blue');

  const publicKey = await question(
    `\n${colors.cyan}Enter ImageKit Public Key: ${colors.reset}`
  );
  const privateKey = await question(
    `${colors.cyan}Enter ImageKit Private Key: ${colors.reset}`
  );
  const urlEndpoint = await question(
    `${colors.cyan}Enter ImageKit URL Endpoint: ${colors.reset}`
  );

  if (!publicKey || !privateKey || !urlEndpoint) {
    logError('All ImageKit credentials are required');
    return getImageKitSetup();
  }

  logSuccess('ImageKit credentials configured');
  return { publicKey, privateKey, urlEndpoint };
}

async function getWebhookSecret(): Promise<string> {
  logSection('Step 4: Webhook Security');

  log('A webhook secret secures your /api/sync-images endpoint', 'blue');
  log('Generate one with: openssl rand -base64 32', 'blue');

  const secret = await question(
    `\n${colors.cyan}Enter or generate a webhook secret (min 32 characters): ${colors.reset}`
  );

  if (!secret || secret.trim().length < 32) {
    logError('Webhook secret must be at least 32 characters');
    return getWebhookSecret();
  }

  logSuccess('Webhook secret configured');
  return secret;
}

async function checkGoogleCredentialsFile(): Promise<void> {
  logSection('Step 5: Google Service Account Key');

  const credFile = './google-credentials.json';

  if (existsSync(credFile)) {
    logSuccess('google-credentials.json found');
    return;
  }

  logWarning('google-credentials.json not found');
  log(
    'You need to download it from Google Cloud Console:',
    'blue'
  );
  log('1. Go to APIs & Services > Service Accounts', 'blue');
  log('2. Click on your service account', 'blue');
  log('3. Go to KEYS tab', 'blue');
  log('4. Add Key > Create new key > JSON', 'blue');
  log('5. Save the downloaded file as google-credentials.json in project root', 'blue');

  const done = await question(
    `\n${colors.cyan}Have you saved google-credentials.json in the project root? (yes/no): ${colors.reset}`
  );

  if (done.toLowerCase() !== 'yes' && done.toLowerCase() !== 'y') {
    logError('Please download and save google-credentials.json before continuing');
    process.exit(1);
  }

  if (!existsSync(credFile)) {
    logError('google-credentials.json still not found');
    return checkGoogleCredentialsFile();
  }

  logSuccess('google-credentials.json is in place');
}

async function createEnvLocal(config: SetupConfig): Promise<void> {
  logSection('Step 6: Creating .env.local');

  const envContent = `# ============================================================
# ImageKit Configuration
# ============================================================
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=${config.imagekitPublicKey}
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=${config.imagekitUrlEndpoint}
IMAGEKIT_PUBLIC_KEY=${config.imagekitPublicKey}
IMAGEKIT_PRIVATE_KEY=${config.imagekitPrivateKey}
IMAGEKIT_URL_ENDPOINT=${config.imagekitUrlEndpoint}

# ============================================================
# Google Drive Configuration
# ============================================================
GOOGLE_DRIVE_FOLDER_ID=${config.googleDriveFolderId}
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json

# ============================================================
# Webhook Security
# ============================================================
WEBHOOK_SECRET=${config.webhookSecret}

# ============================================================
# Application Configuration
# ============================================================
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
`;

  writeFileSync('.env.local', envContent);
  logSuccess('.env.local created with your configuration');
}

async function runFirstSync(): Promise<void> {
  logSection('Step 7: Running First Sync');

  log('Now running your first sync to upload images from Google Drive to ImageKit...', 'blue');
  log('This may take a few minutes depending on your image count', 'blue');

  try {
    execSync('bun run scripts/sync-drive-to-imagekit.ts', { stdio: 'inherit' });
    logSuccess('First sync completed!');
  } catch (error) {
    logWarning('Sync encountered an error - this is normal if it\'s your first run');
    log('Check sync-results.json for details', 'blue');
  }
}

async function displayNextSteps(): Promise<void> {
  logSection('Setup Complete! 🎉');

  log('Your ImageKit sync is now configured!', 'green');
  log('\nNext steps:', 'bright');
  log('1. Check sync-results.json for upload details', 'blue');
  log('2. Visit your ImageKit dashboard to verify images were uploaded', 'blue');
  log('3. Use ProductImage component in your pages:', 'blue');
  log('   import { ProductImage } from "@/components/ProductImage";', 'blue');
  log('   <ProductImage path="/products/image.jpg" alt="Product" />', 'blue');

  log('\nUseful commands:', 'bright');
  log('bun run sync-images                    # Run sync again', 'cyan');
  log('bun run sync-images:watch             # Watch mode for changes', 'cyan');
  log('bun run sync-status                    # Check last sync status', 'cyan');
  log('bun run sync-help                      # Show help and troubleshooting', 'cyan');

  log('\nDocumentation:', 'bright');
  log('docs/IMAGEKIT-SETUP.md                # Detailed setup guide', 'cyan');
  log('docs/IMAGEKIT-QUICK-REFERENCE.md      # Quick reference', 'cyan');

  log('\nFor more help:', 'bright');
  log('bun run sync:help                      # Comprehensive help', 'cyan');
}

async function main(): Promise<void> {
  try {
    log('\n', 'cyan');
    log('╔════════════════════════════════════════════════════════╗', 'cyan');
    log('║      Kollect-It ImageKit Sync Setup Wizard             ║', 'cyan');
    log('║   Automated Google Drive to ImageKit Configuration     ║', 'cyan');
    log('╚════════════════════════════════════════════════════════╝', 'cyan');

    // Step 1: Check dependencies
    await checkDependencies();

    // Step 2: Get Google Cloud setup
    const googleSetup = await getGoogleCloudSetup();

    // Step 3: Get ImageKit setup
    const imagekitSetup = await getImageKitSetup();

    // Step 4: Get webhook secret
    const webhookSecret = await getWebhookSecret();

    // Step 5: Check for Google credentials file
    await checkGoogleCredentialsFile();

    // Step 6: Create .env.local
    const config: SetupConfig = {
      imagekitPublicKey: imagekitSetup.publicKey,
      imagekitPrivateKey: imagekitSetup.privateKey,
      imagekitUrlEndpoint: imagekitSetup.urlEndpoint,
      googleDriveFolderId: googleSetup.folderId,
      webhookSecret: webhookSecret,
    };

    await createEnvLocal(config);

    // Step 7: Ask if user wants to run first sync
    const runSync = await question(
      `\n${colors.cyan}Run first sync now? (yes/no): ${colors.reset}`
    );

    if (runSync.toLowerCase() === 'yes' || runSync.toLowerCase() === 'y') {
      await runFirstSync();
    }

    // Display next steps
    await displayNextSteps();

    rl.close();
  } catch (error) {
    logError(`Setup failed: ${error instanceof Error ? error.message : String(error)}`);
    rl.close();
    process.exit(1);
  }
}

main();
