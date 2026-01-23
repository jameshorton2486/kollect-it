#!/usr/bin/env tsx
/**
 * Fix Prisma Relation Name Mismatches
 * 
 * This script finds and reports all files using incorrect Prisma relation names.
 * 
 * Schema uses: Image, Category, Subcategory (capitalized)
 * Code uses: images, category, subcategory (lowercase)
 * 
 * Run this to see all files that need fixing:
 *   npx tsx scripts/fix-prisma-relations.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, 'src');

// Patterns to search for
const patterns = [
  {
    wrong: /images:\s*\{/g,
    correct: 'Image: {',
    description: 'images: → Image:'
  },
  {
    wrong: /images:\s*true/g,
    correct: 'Image: true',
    description: 'images: true → Image: true'
  },
  {
    wrong: /category:\s*true/g,
    correct: 'Category: true',
    description: 'category: true → Category: true'
  },
  {
    wrong: /category:\s*\{/g,
    correct: 'Category: {',
    description: 'category: { → Category: {'
  },
  {
    wrong: /subcategory:\s*true/g,
    correct: 'Subcategory: true',
    description: 'subcategory: true → Subcategory: true'
  },
  {
    wrong: /subcategory:\s*\{/g,
    correct: 'Subcategory: {',
    description: 'subcategory: { → Subcategory: {'
  },
];

// Property access patterns (product.images → product.Image)
const propertyPatterns = [
  {
    wrong: /product\.images/g,
    correct: 'product.Image',
    description: 'product.images → product.Image'
  },
  {
    wrong: /product\.category/g,
    correct: 'product.Category',
    description: 'product.category → product.Category'
  },
  {
    wrong: /product\.subcategory/g,
    correct: 'product.Subcategory',
    description: 'product.subcategory → product.Subcategory'
  },
];

async function findFiles() {
  const files = await glob('**/*.{ts,tsx}', {
    cwd: srcDir,
    ignore: ['node_modules/**', '.next/**']
  });
  
  return files.map(f => path.join(srcDir, f));
}

async function scanFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const issues: Array<{ line: number; pattern: string; description: string }> = [];
  
  const lines = content.split('\n');
  
  // Check include/select patterns
  for (const pattern of patterns) {
    const matches = content.matchAll(pattern.wrong);
    for (const match of matches) {
      const lineNum = content.substring(0, match.index).split('\n').length;
      issues.push({
        line: lineNum,
        pattern: pattern.description,
        description: `Line ${lineNum}: ${pattern.description}`
      });
    }
  }
  
  // Check property access patterns
  for (const pattern of propertyPatterns) {
    const matches = content.matchAll(pattern.wrong);
    for (const match of matches) {
      const lineNum = content.substring(0, match.index).split('\n').length;
      issues.push({
        line: lineNum,
        pattern: pattern.description,
        description: `Line ${lineNum}: ${pattern.description}`
      });
    }
  }
  
  return issues;
}

async function main() {
  console.log('🔍 Scanning for Prisma relation name mismatches...\n');
  
  const files = await findFiles();
  const results: Array<{ file: string; issues: Array<{ line: number; pattern: string; description: string }> }> = [];
  
  for (const file of files) {
    const issues = await scanFile(file);
    if (issues.length > 0) {
      results.push({
        file: path.relative(projectRoot, file),
        issues
      });
    }
  }
  
  if (results.length === 0) {
    console.log('✅ No issues found! All relation names are correct.\n');
    return;
  }
  
  console.log(`❌ Found ${results.length} files with relation name mismatches:\n`);
  
  for (const result of results) {
    console.log(`📄 ${result.file}`);
    for (const issue of result.issues) {
      console.log(`   Line ${issue.line}: ${issue.pattern}`);
    }
    console.log('');
  }
  
  console.log(`\n📊 Summary: ${results.length} files need fixing`);
  console.log(`\n💡 Next step: Run automated fix or manually update each file.`);
}

main().catch(console.error);
