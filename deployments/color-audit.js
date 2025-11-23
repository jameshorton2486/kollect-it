#!/usr/bin/env node

/**
 * COLOR AUDIT SCRIPT FOR KOLLECT-IT
 * 
 * This script scans your codebase for hardcoded colors and generates a report
 * showing what needs to be updated to use the design system.
 * 
 * Usage: node color-audit.js
 */

const fs = require('fs');
const path = require('path');

// Design system colors for reference
const DESIGN_TOKENS = {
  // Text colors
  '#1E1E1E': 'text-ink-900',
  '#404040': 'text-ink-800',
  '#5A5A5A': 'text-ink-700',
  '#737373': 'text-ink-600',
  '#8C8C8C': 'text-ink-500',
  '#A6A6A6': 'text-ink-400',
  
  // Backgrounds
  '#FFFFFF': 'bg-surface-0',
  '#F9F8F6': 'bg-surface-50',
  '#F5F3F0': 'bg-surface-100',
  '#F0EDE9': 'bg-surface-200',
  '#E8E5E1': 'bg-surface-300',
  '#333333': 'bg-surface-800',
  
  // Gold
  '#D4B882': 'bg-gold-300',
  '#CEAE70': 'bg-gold-400',
  '#C5A264': 'bg-gold-500',
  '#C9A66B': 'bg-gold-500', // Legacy gold
  '#A58642': 'bg-gold-600',
  '#B88D50': 'bg-gold-600', // Legacy gold hover
  '#856B35': 'bg-gold-700',
  
  // CTA Navy
  '#2D4E79': 'bg-cta-400',
  '#24426C': 'bg-cta-500',
  '#1E3A5F': 'bg-cta-600',
  '#1A3050': 'bg-cta-700',
  '#15263D': 'bg-cta-800',
  
  // Semantic
  '#E53E3E': 'bg-semantic-error-500',
  '#38A169': 'bg-semantic-success-500',
  '#ED8936': 'bg-semantic-warning-500',
  '#5C7BA0': 'bg-semantic-info-500',
  
  // Borders
  '#E0DDD9': 'border-border-300',
  
  // Legacy WordPress colors
  '#3A3A3A': 'text-ink-800',
  '#F7F6F2': 'bg-surface-50',
  '#EAE6DD': 'bg-surface-200',
};

const results = {
  filesScanned: 0,
  filesWithIssues: 0,
  totalIssues: 0,
  issuesByFile: {},
  colorFrequency: {},
};

// Patterns to search for
const COLOR_PATTERNS = [
  // Hex colors
  /#[0-9A-Fa-f]{6}\b/g,
  /#[0-9A-Fa-f]{3}\b/g,
  
  // RGB/RGBA
  /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+)?\s*\)/g,
  
  // HSL (not using variables)
  /hsl\(\s*\d+\s*,?\s*\d+%?\s*,?\s*\d+%?\s*\)/g,
  
  // Tailwind colors that should be replaced
  /(?:text|bg|border)-(?:black|white|gray-\d+|blue-\d+|yellow-\d+|amber-\d+)\b/g,
];

// Directories to scan
const SCAN_DIRS = [
  'src/app',
  'src/components',
  'src/lib',
];

// Files to ignore
const IGNORE_PATTERNS = [
  'node_modules',
  '.next',
  'dist',
  'build',
  '.git',
  'globals.css', // This is our source of truth
  'tailwind.config',
];

function shouldIgnoreFile(filePath) {
  return IGNORE_PATTERNS.some(pattern => filePath.includes(pattern));
}

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const issues = [];
    
    // Check each pattern
    COLOR_PATTERNS.forEach(pattern => {
      let match;
      const regex = new RegExp(pattern.source, pattern.flags);
      
      while ((match = regex.exec(content)) !== null) {
        const color = match[0];
        const lineNumber = content.substring(0, match.index).split('\n').length;
        const line = content.split('\n')[lineNumber - 1].trim();
        
        // Skip if it's a comment
        if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
          continue;
        }
        
        // Track color frequency
        results.colorFrequency[color] = (results.colorFrequency[color] || 0) + 1;
        
        issues.push({
          color,
          line: lineNumber,
          context: line,
          suggestion: DESIGN_TOKENS[color.toUpperCase()] || 'MANUAL REVIEW NEEDED',
        });
      }
    });
    
    if (issues.length > 0) {
      results.filesWithIssues++;
      results.totalIssues += issues.length;
      results.issuesByFile[filePath] = issues;
    }
    
    results.filesScanned++;
  } catch (error) {
    console.error(`Error scanning ${filePath}:`, error.message);
  }
}

function scanDirectory(dir) {
  try {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      
      if (shouldIgnoreFile(fullPath)) {
        return;
      }
      
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (stat.isFile() && (
        fullPath.endsWith('.tsx') ||
        fullPath.endsWith('.ts') ||
        fullPath.endsWith('.jsx') ||
        fullPath.endsWith('.js') ||
        fullPath.endsWith('.css')
      )) {
        scanFile(fullPath);
      }
    });
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error.message);
  }
}

function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('KOLLECT-IT COLOR AUDIT REPORT');
  console.log('='.repeat(80) + '\n');
  
  console.log(`📁 Files Scanned: ${results.filesScanned}`);
  console.log(`⚠️  Files With Issues: ${results.filesWithIssues}`);
  console.log(`🎨 Total Color Issues: ${results.totalIssues}\n`);
  
  if (results.totalIssues === 0) {
    console.log('✅ No hardcoded colors found! Your design system is properly applied.\n');
    return;
  }
  
  // Most common colors
  console.log('\n📊 MOST FREQUENTLY USED COLORS:\n');
  const sortedColors = Object.entries(results.colorFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  sortedColors.forEach(([color, count]) => {
    const suggestion = DESIGN_TOKENS[color.toUpperCase()] || 'NEEDS REVIEW';
    console.log(`  ${color.padEnd(20)} → ${count} occurrences → Suggested: ${suggestion}`);
  });
  
  // Detailed file breakdown
  console.log('\n\n📋 DETAILED BREAKDOWN BY FILE:\n');
  
  Object.entries(results.issuesByFile)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([filePath, issues]) => {
      console.log(`\n📄 ${filePath} (${issues.length} issues):`);
      
      issues.slice(0, 5).forEach(issue => {
        console.log(`   Line ${issue.line}: ${issue.color}`);
        console.log(`   → Suggestion: ${issue.suggestion}`);
        console.log(`   Context: ${issue.context.substring(0, 80)}...`);
        console.log('');
      });
      
      if (issues.length > 5) {
        console.log(`   ... and ${issues.length - 5} more issues\n`);
      }
    });
  
  // Summary recommendations
  console.log('\n\n💡 RECOMMENDED ACTIONS:\n');
  console.log('1. Use the APPLY-COLOR-SYSTEM-PROMPT.md with your AI coding assistant');
  console.log('2. Focus on files with the most issues first');
  console.log('3. Run this script again after making changes to verify');
  console.log('4. Test the site thoroughly after updates\n');
  
  // Generate quick fix suggestions
  console.log('🔧 QUICK FIX EXAMPLES:\n');
  console.log('   Find:    className="text-black"');
  console.log('   Replace: className="text-ink-900"\n');
  console.log('   Find:    className="bg-white"');
  console.log('   Replace: className="bg-surface-0"\n');
  console.log('   Find:    style={{ color: "#000000" }}');
  console.log('   Replace: className="text-ink-900"\n');
}

// Main execution
console.log('🔍 Scanning Kollect-It codebase for hardcoded colors...\n');

SCAN_DIRS.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`Scanning ${dir}...`);
    scanDirectory(dir);
  } else {
    console.log(`⚠️  Directory ${dir} not found, skipping...`);
  }
});

generateReport();

// Save detailed report to file
const reportPath = 'color-audit-report.json';
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`\n💾 Detailed report saved to: ${reportPath}\n`);

process.exit(results.totalIssues > 0 ? 1 : 0);
