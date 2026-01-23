#!/usr/bin/env tsx
/**
 * Bulk Fix Prisma Relation Names
 * 
 * Automatically fixes all Prisma relation name mismatches:
 * - images: → Image:
 * - category: → Category:
 * - subcategory: → Subcategory:
 * - product.images → product.Image
 * - product.category → product.Category
 * - product.subcategory → product.Subcategory
 * 
 * Usage:
 *   npx tsx scripts/fix-prisma-relations-bulk.ts
 * 
 * This will update all files automatically.
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, 'src');

// Replacement patterns
const replacements = [
  // Include/select patterns
  { from: /images:\s*\{/g, to: 'Image: {' },
  { from: /images:\s*true/g, to: 'Image: true' },
  { from: /category:\s*true/g, to: 'Category: true' },
  { from: /category:\s*\{/g, to: 'Category: {' },
  { from: /subcategory:\s*true/g, to: 'Subcategory: true' },
  { from: /subcategory:\s*\{/g, to: 'Subcategory: {' },
  
  // Property access patterns
  { from: /product\.images/g, to: 'product.Image' },
  { from: /product\.category/g, to: 'product.Category' },
  { from: /product\.subcategory/g, to: 'product.Subcategory' },
  
  // Also handle other variable names
  { from: /item\.images/g, to: 'item.Image' },
  { from: /item\.category/g, to: 'item.Category' },
  { from: /p\.images/g, to: 'p.Image' },
  { from: /p\.category/g, to: 'p.Category' },
];

async function findFiles() {
  const files = await glob('**/*.{ts,tsx}', {
    cwd: srcDir,
    ignore: ['node_modules/**', '.next/**']
  });
  
  return files.map(f => path.join(srcDir, f));
}

async function fixFile(filePath: string): Promise<{ changed: boolean; changes: number }> {
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  let totalChanges = 0;
  
  for (const replacement of replacements) {
    const matches = content.match(replacement.from);
    if (matches) {
      content = content.replace(replacement.from, replacement.to);
      totalChanges += matches.length;
    }
  }
  
  const changed = content !== originalContent;
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
  }
  
  return { changed, changes: totalChanges };
}

async function main() {
  console.log('🔧 Fixing Prisma relation names...\n');
  
  const files = await findFiles();
  const results: Array<{ file: string; changed: boolean; changes: number }> = [];
  
  for (const file of files) {
    const result = await fixFile(file);
    if (result.changed) {
      results.push({
        file: path.relative(projectRoot, file),
        ...result
      });
    }
  }
  
  if (results.length === 0) {
    console.log('✅ No files needed fixing!\n');
    return;
  }
  
  console.log(`✅ Fixed ${results.length} files:\n`);
  
  let totalChanges = 0;
  for (const result of results) {
    console.log(`   ${result.file} (${result.changes} changes)`);
    totalChanges += result.changes;
  }
  
  console.log(`\n📊 Total: ${totalChanges} replacements made`);
  console.log(`\n💡 Next step: Run 'npx prisma generate' then test the app.`);
}

main().catch(console.error);
