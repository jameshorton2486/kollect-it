/**
 * Environment Variable Security Tests
 * 
 * Ensures no server-only secrets leak to client code.
 */

import { describe, test, expect } from 'bun:test';
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';

// Server-only environment variables that must NEVER appear in client code
const SERVER_ONLY_VARS = [
  'DATABASE_URL',
  'DIRECT_URL',
  'NEXTAUTH_SECRET',
  'ANTHROPIC_API_KEY',
  'OPENAI_API_KEY',
  'IMAGEKIT_PRIVATE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'EMAIL_PASSWORD',
  'SERVICE_API_KEY',
];

// Patterns that indicate hardcoded secrets
const SECRET_PATTERNS = [
  /sk-ant-[a-zA-Z0-9-_]{20,}/g,      // Anthropic API key
  /sk-[a-zA-Z0-9]{32,}/g,             // OpenAI API key
  /private_[a-zA-Z0-9]{20,}/g,        // ImageKit private key
  /sk_(live|test)_[a-zA-Z0-9]{20,}/g, // Stripe secret key
  /whsec_[a-zA-Z0-9]{20,}/g,          // Stripe webhook secret
];

// Directories that should NOT contain server secrets
const CLIENT_DIRS = [
  'src/components',
  'src/contexts',
  'src/hooks',
];

/**
 * Recursively get all TypeScript files in a directory
 */
function getFilesRecursive(dir: string, files: string[] = []): string[] {
  if (!existsSync(dir)) return files;
  
  const items = readdirSync(dir);
  
  for (const item of items) {
    if (item.startsWith('.') || item === 'node_modules') continue;
    
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      getFilesRecursive(fullPath, files);
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

describe('Environment Variable Security', () => {

  test('server-only env vars are not referenced in client code', () => {
    const violations: { file: string; variable: string; line: number }[] = [];

    for (const dir of CLIENT_DIRS) {
      const files = getFilesRecursive(dir);

      for (const file of files) {
        const content = readFileSync(file, 'utf-8');
        const lines = content.split('\n');

        for (const envVar of SERVER_ONLY_VARS) {
          lines.forEach((line, index) => {
            if (line.includes(envVar) && !line.trim().startsWith('//')) {
              violations.push({
                file: file.replace(process.cwd() + '/', ''),
                variable: envVar,
                line: index + 1,
              });
            }
          });
        }
      }
    }

    if (violations.length > 0) {
      console.error('❌ Server-only env vars found in client code:');
      violations.forEach(v => 
        console.error(`  - ${v.file}:${v.line} - ${v.variable}`)
      );
    }

    // This MUST pass - security critical
    expect(violations).toHaveLength(0);
  });

  test('no hardcoded API keys in source code', () => {
    const violations: { file: string; pattern: string }[] = [];
    const allFiles = getFilesRecursive('src');

    for (const file of allFiles) {
      // Skip test files and templates
      if (file.includes('.test.') || file.includes('template') || file.includes('.example')) {
        continue;
      }

      const content = readFileSync(file, 'utf-8');

      for (const pattern of SECRET_PATTERNS) {
        const matches = content.match(pattern);
        if (matches) {
          violations.push({
            file: file.replace(process.cwd() + '/', ''),
            pattern: matches[0].substring(0, 20) + '...',
          });
        }
      }
    }

    if (violations.length > 0) {
      console.error('❌ Hardcoded API keys found:');
      violations.forEach(v => 
        console.error(`  - ${v.file}: ${v.pattern}`)
      );
    }

    // This MUST pass - security critical
    expect(violations).toHaveLength(0);
  });

  test('env template does not contain real secrets', () => {
    const templateFiles = [
      'env_vars_template.txt',
      '.env.example',
      'desktop-app-env-template.txt',
    ];

    const violations: { file: string; pattern: string }[] = [];

    for (const templateFile of templateFiles) {
      if (!existsSync(templateFile)) continue;

      const content = readFileSync(templateFile, 'utf-8');

      for (const pattern of SECRET_PATTERNS) {
        const matches = content.match(pattern);
        if (matches) {
          violations.push({
            file: templateFile,
            pattern: matches[0].substring(0, 20) + '...',
          });
        }
      }
    }

    if (violations.length > 0) {
      console.warn('⚠️ Possible real secrets in template files:');
      violations.forEach(v => 
        console.warn(`  - ${v.file}: ${v.pattern}`)
      );
      console.warn('  Please verify these are placeholder values, not real keys.');
    }

    // Phase 2: Warn only
    // Phase 3: Uncomment to enforce
    // expect(violations).toHaveLength(0);
  });

  test('NEXT_PUBLIC_ prefix used correctly', () => {
    const allFiles = getFilesRecursive('src');
    const violations: { file: string; variable: string }[] = [];

    // Find process.env usages without NEXT_PUBLIC_ in client components
    for (const dir of CLIENT_DIRS) {
      const files = getFilesRecursive(dir);

      for (const file of files) {
        const content = readFileSync(file, 'utf-8');
        
        // Find all process.env.SOMETHING usages
        const envUsages = content.match(/process\.env\.([A-Z_]+)/g) || [];
        
        for (const usage of envUsages) {
          const varName = usage.replace('process.env.', '');
          if (!varName.startsWith('NEXT_PUBLIC_') && !varName.startsWith('NODE_ENV')) {
            violations.push({
              file: file.replace(process.cwd() + '/', ''),
              variable: varName,
            });
          }
        }
      }
    }

    if (violations.length > 0) {
      console.warn('⚠️ Non-public env vars accessed in client code:');
      violations.forEach(v => 
        console.warn(`  - ${v.file}: ${v.variable}`)
      );
    }

    // This should eventually be enforced
    // expect(violations).toHaveLength(0);
  });
});
