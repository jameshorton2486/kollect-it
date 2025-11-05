#!/usr/bin/env bun
/**
 * ImageKit Sync Help & Documentation
 * Comprehensive help system with troubleshooting and best practices
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset'): void {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title: string): void {
  console.log('\n');
  log(`${'='.repeat(60)}`, 'cyan');
  log(`  ${title}`, 'bright');
  log(`${'='.repeat(60)}`, 'cyan');
}

function main(): void {
  log('\n', 'cyan');
  log('╔════════════════════════════════════════════════════════╗', 'cyan');
  log('║     Kollect-It ImageKit Sync - Help & Reference        ║', 'cyan');
  log('╚════════════════════════════════════════════════════════╝', 'cyan');

  // Available Commands
  logSection('📋 Available Commands');

  log('Setup & Configuration:', 'bright');
  log('  bun run setup:imagekit               Interactive setup wizard', 'blue');
  log('  bun run sync:help                    Show this help message', 'blue');

  log('\nSyncing Operations:', 'bright');
  log('  bun run sync-images                  Run sync once', 'blue');
  log('  bun run sync-images:watch            Auto-sync on file changes', 'blue');
  log('  bun run sync-status                  View last sync results', 'blue');

  // Quick Start
  logSection('🚀 Quick Start');

  log('First time setup:', 'bright');
  log('  1. bun run setup:imagekit', 'cyan');
  log('  2. Follow the interactive prompts', 'cyan');
  log('  3. Wait for first sync to complete', 'cyan');

  log('\nRegular usage:', 'bright');
  log('  # Sync new images from Google Drive', 'cyan');
  log('  bun run sync-images', 'cyan');
  log('  ', 'cyan');
  log('  # Check what was synced', 'cyan');
  log('  bun run sync-status', 'cyan');

  // Configuration
  logSection('⚙️  Configuration');

  log('Environment Variables (.env.local):', 'bright');
  log('  IMAGEKIT_PRIVATE_KEY              Your ImageKit private key', 'blue');
  log('  IMAGEKIT_PUBLIC_KEY               Your ImageKit public key', 'blue');
  log('  IMAGEKIT_URL_ENDPOINT             Your ImageKit URL endpoint', 'blue');
  log('  GOOGLE_DRIVE_FOLDER_ID            Google Drive folder with images', 'blue');
  log('  GOOGLE_APPLICATION_CREDENTIALS    Path to google-credentials.json', 'blue');
  log('  WEBHOOK_SECRET                    Secret for /api/sync-images', 'blue');

  log('\nGetting Credentials:', 'bright');
  log('  ImageKit:      https://imagekit.io → Settings → API Keys', 'cyan');
  log('  Google Cloud:  https://console.cloud.google.com → Service Accounts', 'cyan');
  log('  Google Drive:  Open folder URL → Copy ID after /folders/', 'cyan');

  // Using ProductImage Component
  logSection('🖼️  Using ProductImage Component');

  log('Basic Usage:', 'bright');
  log(`${colors.blue}import { ProductImage } from '@/components/ProductImage';
  
<ProductImage
  path="/products/item.jpg"
  alt="Product image"
  width={400}
  height={300}
/>`, 'reset');

  log('\nMultiple Images (Grid):', 'bright');
  log(`${colors.blue}import { ProductImageGrid } from '@/components/ProductImage';

<ProductImageGrid
  images={[
    { path: '/products/1.jpg', alt: 'View 1' },
    { path: '/products/2.jpg', alt: 'View 2' },
  ]}
  imageSize="medium"
/>`, 'reset');

  log('\nResponsive Image:', 'bright');
  log(`${colors.blue}import { ResponsiveProductImage } from '@/components/ProductImage';

<ResponsiveProductImage
  path="/products/hero.jpg"
  alt="Featured product"
  sizes="full"
/>`, 'reset');

  log('\nSize Options:', 'bright');
  log('  small         240px width', 'blue');
  log('  medium        480px width', 'blue');
  log('  large         720px width', 'blue');
  log('  full          100% width', 'blue');

  // API Endpoint
  logSection('🔌 API Endpoint');

  log('Trigger Sync via API:', 'bright');
  log(`${colors.blue}curl -X POST http://localhost:3000/api/sync-images \\
  -H "Content-Type: application/json" \\
  -d '{"secret":"your_webhook_secret"}'`, 'reset');

  log('\nResponse:', 'bright');
  log(`${colors.blue}{
  "status": "syncing",
  "syncId": "sync_1730750000000_abc123",
  "message": "Image sync started in background"
}`, 'reset');

  log('\nCheck Status:', 'bright');
  log(`${colors.blue}curl http://localhost:3000/api/sync-images?syncId=sync_1730750000000_abc123`, 'reset');

  // Troubleshooting
  logSection('🔧 Troubleshooting');

  log('Issue: "google-credentials.json not found"', 'bright');
  log('  → Download from Google Cloud Console', 'yellow');
  log('  → Save in project root', 'yellow');
  log('  → Update .env.local with correct path', 'yellow');

  log('\nIssue: "Service account doesn\'t have access"', 'bright');
  log('  → Share Google Drive folder with service account email', 'yellow');
  log('  → Give "Viewer" permission', 'yellow');
  log('  → Wait 30 seconds for changes to propagate', 'yellow');

  log('\nIssue: "ImageKit authentication failed"', 'bright');
  log('  → Double-check private key in .env.local', 'yellow');
  log('  → Verify key hasn\'t been rotated in ImageKit', 'yellow');
  log('  → Check for extra spaces or line breaks', 'yellow');

  log('\nIssue: "Rate limit exceeded"', 'bright');
  log('  → Script already includes 500ms delays', 'yellow');
  log('  → Check sync-results.json for details', 'yellow');
  log('  → Try running again after 5 minutes', 'yellow');

  log('\nIssue: "Module not found" errors', 'bright');
  log('  → Run: bun install', 'yellow');
  log('  → Clear cache: rm -rf .bun node_modules', 'yellow');
  log('  → Try again: bun run setup:imagekit', 'yellow');

  log('\nIssue: "Build fails with TypeScript errors"', 'bright');
  log('  → Run: bun run build', 'yellow');
  log('  → Check console for specific errors', 'yellow');
  log('  → Verify all files were created', 'yellow');

  // Performance Tips
  logSection('⚡ Performance Tips');

  log('Optimize Syncs:', 'bright');
  log('  • Use skipExisting=true to skip re-uploads', 'blue');
  log('  • Batch large migrations during off-peak hours', 'blue');
  log('  • Consider folder-based organization in ImageKit', 'blue');
  log('  • Archive old images to reduce sync time', 'blue');

  log('\nOptimize Images:', 'bright');
  log('  • Keep images under 10MB', 'blue');
  log('  • Use WebP format when possible', 'blue');
  log('  • Optimize before uploading to Drive', 'blue');
  log('  • Remove unnecessary metadata', 'blue');

  // Security Best Practices
  logSection('🔒 Security Best Practices');

  log('Credential Management:', 'bright');
  log('  ✅ Use environment variables (.env.local)', 'green');
  log('  ✅ Add .env.local to .gitignore (already done)', 'green');
  log('  ✅ Never commit credentials', 'green');
  log('  ✅ Rotate keys quarterly', 'green');
  log('  ✅ Use webhook secret on API endpoint', 'green');

  log('\nService Account:', 'bright');
  log('  ✅ Give "Viewer" permission only (not Editor)', 'green');
  log('  ✅ Use dedicated service account per environment', 'green');
  log('  ✅ Disable service account when not needed', 'green');
  log('  ✅ Review access logs regularly', 'green');

  // Files Reference
  logSection('📁 Important Files');

  log('Configuration:', 'bright');
  log('  .env.local                         Your credentials (not committed)', 'blue');
  log('  .env.local.example                 Template for .env.local', 'blue');
  log('  google-credentials.json            Google service account key', 'blue');

  log('\nScripts:', 'bright');
  log('  setup-imagekit-sync.ts             Interactive setup wizard', 'blue');
  log('  scripts/sync-drive-to-imagekit.ts  Main sync script', 'blue');
  log('  scripts/sync-status.ts             Status checker', 'blue');

  log('\nCode:', 'bright');
  log('  types/imagekit.ts                  TypeScript type definitions', 'blue');
  log('  src/components/ProductImage.tsx    React image components', 'blue');
  log('  src/app/api/sync-images/route.ts   Webhook API endpoint', 'blue');

  log('\nDocumentation:', 'bright');
  log('  docs/IMAGEKIT-SETUP.md             Complete setup guide', 'blue');
  log('  docs/IMAGEKIT-QUICK-REFERENCE.md   Quick reference card', 'blue');

  // Resources
  logSection('📚 Additional Resources');

  log('Documentation:', 'bright');
  log('  ImageKit:       https://docs.imagekit.io/', 'cyan');
  log('  Google Drive:   https://developers.google.com/drive/api', 'cyan');
  log('  Next.js Images: https://nextjs.org/docs/app/building-your-application/optimizing/images', 'cyan');

  log('\nStatus & Monitoring:', 'bright');
  log('  • Check sync-results.json for detailed logs', 'cyan');
  log('  • Monitor upload count and sizes', 'cyan');
  log('  • Review ImageKit dashboard for uploads', 'cyan');
  log('  • Check build status with: bun run build', 'cyan');

  // Footer
  logSection('✅ Ready to Get Started?');

  log('Run this command to begin setup:', 'bright');
  log('  bun run setup:imagekit', 'green');

  log('\nFor detailed setup instructions, see:', 'bright');
  log('  docs/IMAGEKIT-SETUP.md', 'cyan');

  log('\n');
}

main();
