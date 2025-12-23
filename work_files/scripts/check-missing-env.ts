import 'dotenv/config';

/**
 * Check Missing Environment Variables
 * 
 * Compares your current .env.local against all required and optional variables
 * for the Kollect-It application.
 */

// Required variables (app won't work without these)
const REQUIRED_VARS = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY',
  'NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT',
  'IMAGEKIT_PRIVATE_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'NEXT_PUBLIC_APP_EMAIL',
];

// Highly recommended (app will work but features will be limited)
const RECOMMENDED_VARS = [
  'DIRECT_URL',  // Needed for migrations
  'EMAIL_HOST',  // Email functionality
  'EMAIL_PORT',  // Email functionality
  'EMAIL_USER',  // Email functionality
  'EMAIL_PASSWORD',  // Email functionality
  'EMAIL_FROM',  // Email functionality
  'ADMIN_EMAIL',  // Admin notifications
];

// Optional variables (nice to have but not critical)
const OPTIONAL_VARS = [
  'VERCEL_URL',  // Auto-detected on Vercel
];

interface VarStatus {
  name: string;
  set: boolean;
  value?: string;
  issue?: string;
}

function checkVar(name: string): VarStatus {
  const value = process.env[name];
  const set = !!value && value.trim() !== '';

  const status: VarStatus = {
    name,
    set,
    value: set ? (value!.length > 30 ? value!.substring(0, 30) + '...' : value!) : undefined,
  };

  // Additional validation
  if (set) {
    // Check NEXTAUTH_SECRET length
    if (name === 'NEXTAUTH_SECRET' && value!.length < 32) {
      status.issue = `Too short (${value!.length} chars, need 32+)`;
    }

    // Check URL format
    if (name.includes('URL') && !value!.startsWith('http')) {
      status.issue = 'Invalid URL format';
    }

    // Check Stripe keys format
    if (name === 'STRIPE_SECRET_KEY' && !value!.startsWith('sk_')) {
      status.issue = "Should start with 'sk_'";
    }
    if (name === 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY' && !value!.startsWith('pk_')) {
      status.issue = "Should start with 'pk_'";
    }
    if (name === 'STRIPE_WEBHOOK_SECRET' && !value!.startsWith('whsec_')) {
      status.issue = "Should start with 'whsec_'";
    }

    // Check email configuration completeness
    if (name === 'EMAIL_USER' && !process.env.EMAIL_PASSWORD) {
      status.issue = 'EMAIL_PASSWORD also needed';
    }
    if (name === 'EMAIL_PASSWORD' && !process.env.EMAIL_USER) {
      status.issue = 'EMAIL_USER also needed';
    }
  }

  return status;
}

function printSection(title: string, vars: VarStatus[], category: 'required' | 'recommended' | 'optional') {
  const missing = vars.filter(v => !v.set);
  const set = vars.filter(v => v.set);
  
  const icon = category === 'required' ? '🔴' : category === 'recommended' ? '🟡' : '🟢';
  
  console.log(`\n${icon} ${title} (${set.length}/${vars.length} set)`);
  console.log('─'.repeat(60));

  // Show set variables first
  if (set.length > 0) {
    set.forEach(v => {
      const checkmark = v.issue ? '⚠️ ' : '✅';
      console.log(`  ${checkmark} ${v.name}`);
      if (v.issue) {
        console.log(`     ⚠️  ${v.issue}`);
      }
      if (v.value && !v.issue) {
        console.log(`     → ${v.value}`);
      }
    });
  }

  // Show missing variables
  if (missing.length > 0) {
    missing.forEach(v => {
      console.log(`  ❌ ${v.name}`);
    });
  }
}

function generateMissingTemplate(missing: VarStatus[]): string {
  if (missing.length === 0) return '';

  let template = '\n# Missing Variables - Add these to your .env.local:\n\n';
  
  missing.forEach(v => {
    template += `# ${v.name}\n`;
    
    // Add helpful comments
    if (v.name === 'NEXTAUTH_SECRET') {
      template += `# Generate with: openssl rand -base64 32\n`;
      template += `${v.name}=\n\n`;
    } else if (v.name === 'DATABASE_URL') {
      template += `# Format: postgresql://user:password@host:6543/database?pgbouncer=true\n`;
      template += `${v.name}=\n\n`;
    } else if (v.name === 'DIRECT_URL') {
      template += `# Format: postgresql://user:password@host:5432/database\n`;
      template += `${v.name}=\n\n`;
    } else if (v.name.startsWith('EMAIL_')) {
      template += `# See AUTH_SETUP.md for email configuration\n`;
      template += `${v.name}=\n\n`;
    } else if (v.name.startsWith('STRIPE_')) {
      template += `# Get from: https://dashboard.stripe.com/apikeys\n`;
      template += `${v.name}=\n\n`;
    } else if (v.name.startsWith('IMAGEKIT') || v.name.includes('IMAGEKIT')) {
      template += `# Get from: https://imagekit.io/dashboard/developer/api-keys\n`;
      template += `${v.name}=\n\n`;
    } else if (v.name.startsWith('GOOGLE_')) {
      template += `# Get from: https://console.cloud.google.com/apis/credentials\n`;
      template += `${v.name}=\n\n`;
    } else {
      template += `${v.name}=\n\n`;
    }
  });

  return template;
}

async function main() {
  console.log('🔍 Checking Environment Variables for Kollect-It\n');
  console.log('─'.repeat(60));

  // Check all variables
  const required = REQUIRED_VARS.map(checkVar);
  const recommended = RECOMMENDED_VARS.map(checkVar);
  const optional = OPTIONAL_VARS.map(checkVar);

  // Print results
  printSection('REQUIRED Variables', required, 'required');
  printSection('RECOMMENDED Variables', recommended, 'recommended');
  printSection('OPTIONAL Variables', optional, 'optional');

  // Summary
  const allRequiredSet = required.every(v => v.set && !v.issue);
  const missingRequired = required.filter(v => !v.set);
  const missingRecommended = recommended.filter(v => !v.set);
  const hasIssues = [...required, ...recommended, ...optional].some(v => v.issue);

  console.log('\n' + '═'.repeat(60));
  console.log('📊 SUMMARY');
  console.log('═'.repeat(60));

  if (allRequiredSet && !hasIssues) {
    console.log('✅ All required variables are set correctly!');
  } else {
    if (missingRequired.length > 0) {
      console.log(`\n❌ Missing ${missingRequired.length} required variable(s):`);
      missingRequired.forEach(v => console.log(`   - ${v.name}`));
    }
    if (hasIssues) {
      console.log(`\n⚠️  ${[...required, ...recommended].filter(v => v.issue).length} variable(s) have issues`);
    }
  }

  if (missingRecommended.length > 0) {
    console.log(`\n🟡 ${missingRecommended.length} recommended variable(s) missing (optional but recommended)`);
  }

  // Generate template for missing variables
  const allMissing = [...missingRequired, ...missingRecommended];
  if (allMissing.length > 0) {
    console.log('\n' + '═'.repeat(60));
    console.log('📝 MISSING VARIABLES TEMPLATE');
    console.log('═'.repeat(60));
    console.log(generateMissingTemplate(allMissing));
  }

  // Next steps
  console.log('\n' + '═'.repeat(60));
  console.log('📚 NEXT STEPS');
  console.log('═'.repeat(60));
  console.log('1. Review AUTH_SETUP.md for authentication setup');
  console.log('2. Check README.md for service-specific setup guides');
  console.log('3. Run: npx tsx scripts/fix-auth.ts (for auth issues)');
  console.log('4. Run: npx tsx scripts/check-env.ts (alternative check)');
  console.log('\n');
}

main().catch(console.error);
