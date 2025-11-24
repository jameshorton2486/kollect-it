// scripts/check-env.js
/**
 * Environment Variable Checker
 * Validates all required environment variables for production deployment
 * Run with: node scripts/check-env.js
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

// Required environment variables
const REQUIRED_VARS = {
  'Database': {
    vars: ['DATABASE_URL'],
    critical: true
  },
  'Authentication': {
    vars: ['NEXTAUTH_URL', 'NEXTAUTH_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
    critical: true
  },
  'Stripe Payment': {
    vars: [
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET'
    ],
    critical: true
  },
  'Email Service': {
    vars: ['EMAIL_SERVER', 'EMAIL_FROM', 'EMAIL_USER', 'EMAIL_PASSWORD'],
    critical: true
  },
  'ImageKit CDN': {
    vars: ['NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY', 'IMAGEKIT_PRIVATE_KEY', 'NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT'],
    critical: false
  },
  'Application': {
    vars: ['NEXT_PUBLIC_APP_URL', 'NODE_ENV'],
    critical: true
  }
};

// Load environment variables
function loadEnvFile(filename) {
  const filepath = path.join(process.cwd(), filename);
  if (!fs.existsSync(filepath)) {
    return null;
  }
  
  const envContent = fs.readFileSync(filepath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    // Skip comments and empty lines
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('#') || !trimmedLine) return;
    
    const match = trimmedLine.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      env[key] = value;
    }
  });
  
  return env;
}

// Check if value looks like a production value
function isProductionValue(key, value) {
  const prodIndicators = {
    'NEXTAUTH_URL': (v) => v.includes('https://') && !v.includes('localhost'),
    'NEXT_PUBLIC_APP_URL': (v) => v.includes('https://') && !v.includes('localhost'),
    'STRIPE_SECRET_KEY': (v) => v.startsWith('sk_live_'),
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': (v) => v.startsWith('pk_live_'),
    'NODE_ENV': (v) => v === 'production',
    'DATABASE_URL': (v) => !v.includes('localhost') && !v.includes('127.0.0.1')
  };
  
  if (prodIndicators[key]) {
    return prodIndicators[key](value);
  }
  
  return null; // Unknown, don't check
}

// Main checker function
function checkEnvironment() {
  console.log(`\n${colors.bold}${colors.cyan}╔═══════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}║        KOLLECT-IT ENVIRONMENT VARIABLE CHECKER           ║${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}╚═══════════════════════════════════════════════════════════╝${colors.reset}\n`);
  
  // Try to load .env files
  const envDev = loadEnvFile('.env');
  const envProd = loadEnvFile('.env.production');
  const envLocal = loadEnvFile('.env.local');
  
  console.log('DEBUG: envLocal keys:', Object.keys(envLocal || {}));
  
  console.log(`${colors.bold}Environment Files Found:${colors.reset}`);
  console.log(`  .env            : ${envDev ? colors.green + '✓ Found' : colors.red + '✗ Missing'}${colors.reset}`);
  console.log(`  .env.production : ${envProd ? colors.green + '✓ Found' : colors.red + '✗ Missing'}${colors.reset}`);
  console.log(`  .env.local      : ${envLocal ? colors.green + '✓ Found' : colors.yellow + '⚠ Optional'}${colors.reset}\n`);
  
  // Choose which env to check (prefer production)
  const env = envProd || envDev || envLocal || process.env;
  const envName = envProd ? '.env.production' : envDev ? '.env' : envLocal ? '.env.local' : 'process.env';
  
  console.log(`${colors.bold}Checking: ${colors.cyan}${envName}${colors.reset}\n`);
  
  let totalVars = 0;
  let foundVars = 0;
  let criticalMissing = 0;
  let warnings = 0;
  
  // Check each category
  for (const [category, config] of Object.entries(REQUIRED_VARS)) {
    const criticalMarker = config.critical ? `${colors.red}*${colors.reset}` : '';
    console.log(`${colors.bold}${category}${criticalMarker}:${colors.reset}`);
    
    config.vars.forEach(varName => {
      totalVars++;
      const value = env[varName];
      
      if (!value) {
        if (config.critical) {
          console.log(`  ${colors.red}✗${colors.reset} ${varName} ${colors.red}(MISSING - REQUIRED)${colors.reset}`);
          criticalMissing++;
        } else {
          console.log(`  ${colors.yellow}⚠${colors.reset} ${varName} ${colors.yellow}(Missing - Optional)${colors.reset}`);
          warnings++;
        }
      } else {
        foundVars++;
        const prodCheck = isProductionValue(varName, value);
        
        if (prodCheck === false && envName === '.env.production') {
          console.log(`  ${colors.yellow}⚠${colors.reset} ${varName} ${colors.yellow}(Found, but looks like DEV value)${colors.reset}`);
          warnings++;
        } else {
          // Mask sensitive values
          const maskedValue = value.length > 10 ? 
            value.substring(0, 10) + '...' : 
            '***';
          console.log(`  ${colors.green}✓${colors.reset} ${varName} ${colors.reset}(${maskedValue})`);
        }
      }
    });
    
    console.log();
  }
  
  // Summary
  console.log(`${colors.bold}${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}SUMMARY:${colors.reset}`);
  console.log(`  Total Variables:     ${totalVars}`);
  console.log(`  Found:               ${colors.green}${foundVars}${colors.reset}`);
  console.log(`  Missing (Critical):  ${criticalMissing > 0 ? colors.red : colors.green}${criticalMissing}${colors.reset}`);
  console.log(`  Warnings:            ${warnings > 0 ? colors.yellow : colors.green}${warnings}${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}\n`);
  
  // Production readiness check
  if (!envProd) {
    console.log(`${colors.yellow}⚠ WARNING:${colors.reset} No .env.production file found!`);
    console.log(`  Create one by copying .env and updating values for production.\n`);
  }
  
  if (criticalMissing > 0) {
    console.log(`${colors.red}✗ FAILED:${colors.reset} ${criticalMissing} critical environment variable(s) missing.`);
    console.log(`  ${colors.red}NOT READY FOR PRODUCTION DEPLOYMENT${colors.reset}\n`);
    process.exit(1);
  } else if (warnings > 0) {
    console.log(`${colors.yellow}⚠ WARNINGS:${colors.reset} ${warnings} warning(s) detected.`);
    console.log(`  Review warnings above before deploying to production.\n`);
    process.exit(0);
  } else {
    console.log(`${colors.green}✓ SUCCESS:${colors.reset} All required environment variables are configured!`);
    console.log(`  ${colors.green}READY FOR PRODUCTION DEPLOYMENT${colors.reset}\n`);
    process.exit(0);
  }
}

// Security checks
function securityChecks() {
  console.log(`${colors.bold}${colors.cyan}SECURITY CHECKS:${colors.reset}`);
  
  const checks = [];
  
  // Check .env files are in .gitignore
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, 'utf8');
    if (gitignore.includes('.env')) {
      checks.push({ name: '.env files in .gitignore', passed: true });
    } else {
      checks.push({ name: '.env files in .gitignore', passed: false });
    }
  }
  
  checks.forEach(check => {
    const icon = check.passed ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
    console.log(`  ${icon} ${check.name}`);
  });
  
  console.log();
}

// Run checks
console.clear();
checkEnvironment();
securityChecks();