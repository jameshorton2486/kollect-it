import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Add Missing Environment Variables to .env.local
 * 
 * This script safely appends missing variables to your .env.local file
 * without overwriting existing values.
 */

const envFilePath = path.join(process.cwd(), '.env.local');

// Missing variables with helpful comments
const MISSING_VARS = {
  // CRITICAL - Required
  DATABASE_URL: {
    comment: '# Database Connection (Supabase PostgreSQL - Pooled, port 6543)',
    placeholder: 'postgresql://user:password@host:6543/database?pgbouncer=true',
    required: true,
  },
  NEXTAUTH_SECRET: {
    comment: '# NextAuth Secret (generate with: openssl rand -base64 32)',
    placeholder: 'your-32-plus-character-secret-here',
    required: true,
  },
  NEXTAUTH_URL: {
    comment: '# NextAuth URL',
    placeholder: 'http://localhost:3000',
    required: true,
  },
  NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: {
    comment: '# ImageKit Public Key (get from: https://imagekit.io/dashboard/developer/api-keys)',
    placeholder: 'public_xxxxxxxxxxxx',
    required: true,
  },
  NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: {
    comment: '# ImageKit URL Endpoint (get from: https://imagekit.io/dashboard/developer/api-keys)',
    placeholder: 'https://ik.imagekit.io/your-id/',
    required: true,
  },
  IMAGEKIT_PRIVATE_KEY: {
    comment: '# ImageKit Private Key (get from: https://imagekit.io/dashboard/developer/api-keys)',
    placeholder: 'private_xxxxxxxxxxxx',
    required: true,
  },
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: {
    comment: '# Stripe Publishable Key (get from: https://dashboard.stripe.com/apikeys)',
    placeholder: 'pk_test_xxxxxxxxxxxx',
    required: true,
  },
  STRIPE_SECRET_KEY: {
    comment: '# Stripe Secret Key (get from: https://dashboard.stripe.com/apikeys)',
    placeholder: 'sk_test_xxxxxxxxxxxx',
    required: true,
  },
  STRIPE_WEBHOOK_SECRET: {
    comment: '# Stripe Webhook Secret (get from: https://dashboard.stripe.com/webhooks)',
    placeholder: 'whsec_xxxxxxxxxxxx',
    required: true,
  },
  GOOGLE_CLIENT_ID: {
    comment: '# Google OAuth Client ID (get from: https://console.cloud.google.com/apis/credentials)',
    placeholder: 'xxxxx.apps.googleusercontent.com',
    required: true,
  },
  GOOGLE_CLIENT_SECRET: {
    comment: '# Google OAuth Client Secret (get from: https://console.cloud.google.com/apis/credentials)',
    placeholder: 'xxxxx',
    required: true,
  },
  NEXT_PUBLIC_APP_EMAIL: {
    comment: '# Application Email Address',
    placeholder: 'noreply@kollect-it.com',
    required: true,
  },
  // RECOMMENDED
  DIRECT_URL: {
    comment: '# Database Direct Connection (Supabase - Direct, port 5432, needed for migrations)',
    placeholder: 'postgresql://user:password@host:5432/database',
    required: false,
  },
  EMAIL_HOST: {
    comment: '# Email SMTP Host (see AUTH_SETUP.md for email configuration)',
    placeholder: 'smtp.gmail.com',
    required: false,
  },
  EMAIL_PORT: {
    comment: '# Email SMTP Port',
    placeholder: '587',
    required: false,
  },
  EMAIL_USER: {
    comment: '# Email SMTP User',
    placeholder: 'noreply@kollect-it.com',
    required: false,
  },
  EMAIL_PASSWORD: {
    comment: '# Email SMTP Password (Google App Password - see AUTH_SETUP.md)',
    placeholder: 'xxxx xxxx xxxx xxxx',
    required: false,
  },
  EMAIL_FROM: {
    comment: '# Email From Address',
    placeholder: '"Kollect-It <noreply@kollect-it.com>"',
    required: false,
  },
  ADMIN_EMAIL: {
    comment: '# Admin Email Address (for notifications)',
    placeholder: 'james@kollect-it.com',
    required: false,
  },
};

function readExistingEnv(): Map<string, string> {
  const existing = new Map<string, string>();
  
  if (!fs.existsSync(envFilePath)) {
    console.log('📝 Creating new .env.local file...\n');
    return existing;
  }

  const content = fs.readFileSync(envFilePath, 'utf-8');
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    // Parse KEY=VALUE
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      existing.set(key, value);
    }
  }

  return existing;
}

function generateNEXTAUTH_SECRET(): string {
  // Generate a placeholder that shows it needs to be replaced
  return 'CHANGE_THIS_TO_A_32_PLUS_CHARACTER_SECRET_GENERATE_WITH_openssl_rand_base64_32';
}

function main() {
  console.log('🔧 Adding Missing Environment Variables to .env.local\n');
  console.log('─'.repeat(60));

  const existing = readExistingEnv();
  const missing: string[] = [];
  const toAdd: Array<{ key: string; config: typeof MISSING_VARS[string] }> = [];

  // Check what's missing
  for (const [key, config] of Object.entries(MISSING_VARS)) {
    if (!existing.has(key)) {
      missing.push(key);
      toAdd.push({ key, config });
    }
  }

  if (missing.length === 0) {
    console.log('✅ All variables are already present in .env.local!');
    return;
  }

  console.log(`\n📋 Found ${missing.length} missing variable(s):\n`);
  toAdd.forEach(({ key, config }) => {
    const icon = config.required ? '🔴' : '🟡';
    console.log(`  ${icon} ${key} ${config.required ? '(required)' : '(recommended)'}`);
  });

  // Read existing file content
  let fileContent = '';
  if (fs.existsSync(envFilePath)) {
    fileContent = fs.readFileSync(envFilePath, 'utf-8');
    // Ensure file ends with newline
    if (!fileContent.endsWith('\n')) {
      fileContent += '\n';
    }
  }

  // Add missing variables
  fileContent += '\n# ============================================\n';
  fileContent += '# Added by add-missing-env.ts script\n';
  fileContent += `# Generated: ${new Date().toISOString()}\n`;
  fileContent += '# ============================================\n\n';

  for (const { key, config } of toAdd) {
    fileContent += `${config.comment}\n`;
    
    // Special handling for NEXTAUTH_SECRET
    if (key === 'NEXTAUTH_SECRET') {
      fileContent += `NEXTAUTH_SECRET=${generateNEXTAUTH_SECRET()}\n\n`;
    } else {
      fileContent += `${key}=${config.placeholder}\n\n`;
    }
  }

  // Write to file
  fs.writeFileSync(envFilePath, fileContent, 'utf-8');

  console.log('\n✅ Successfully added missing variables to .env.local!');
  console.log('\n📝 Next Steps:');
  console.log('─'.repeat(60));
  console.log('1. Open .env.local in your editor');
  console.log('2. Fill in the placeholder values for each variable');
  console.log('3. Generate NEXTAUTH_SECRET with: openssl rand -base64 32');
  console.log('4. See AUTH_SETUP.md for detailed setup instructions');
  console.log('5. See ENV_VARIABLES_REFERENCE.md for all variable details');
  console.log('\n⚠️  IMPORTANT: Replace all placeholder values with your actual credentials!\n');
}

main();
