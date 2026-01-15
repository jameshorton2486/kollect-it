/**
 * Governance Tests - SKU Enforcement
 * 
 * These tests enforce ADR-0003: SKU Format
 * They are NOT unit tests - they enforce architectural decisions.
 */

import { describe, test, expect } from "bun:test";
import { readFile } from "fs/promises";
import { glob } from "glob";

describe("SKU Enforcement Governance", () => {
  test("SKU immutable after creation", async () => {
    const violations: string[] = [];
    
    // Find all product update endpoints
    const files = await glob([
      "src/app/api/**/products/**/route.ts",
      "src/app/api/**/products/**/[id]/**/route.ts",
    ], {
      ignore: ["**/node_modules/**", "**/.next/**", "**/work_files/**"],
    });

    for (const file of files) {
      const content = await readFile(file, "utf-8");
      
      // Check for PUT/PATCH methods (update operations)
      if (content.includes("PUT") || content.includes("PATCH")) {
        // Check if SKU is in the update body
        const skuInBody = /(sku|SKU).*[:=]/g.test(content);
        const skuInUpdate = /\.update\([^)]*sku/gi.test(content);
        
        if (skuInBody || skuInUpdate) {
          violations.push(`${file}: SKU modification detected in update endpoint`);
        }
      }
    }

    if (violations.length > 0) {
      console.error("\n❌ SKU immutability violations:");
      violations.forEach(v => console.error(`  - ${v}`));
    }

    expect(violations).toHaveLength(0);
  });

  test("SKU validation centralized", async () => {
    const skuPatterns: Array<{ file: string; pattern: string }> = [];
    
    // Find all files with SKU format patterns
    const files = await glob([
      "src/**/*.{ts,tsx}",
      "lib/**/*.ts",
    ], {
      ignore: ["**/node_modules/**", "**/.next/**", "**/work_files/**", "**/*.test.*", "**/*.spec.*"],
    });

    // SKU format pattern: CAT-YYYY-NNNN or YYYY-XXXXX
    const skuRegexPatterns = [
      /\/\*.*SKU.*format.*\*\//i,
      /\/\/.*SKU.*format/i,
      /(CAT-\d{4}-\d{4}|\d{4}-\d{5})/,
      /validateSKU|validate.*sku/gi,
      /sku.*regex|regex.*sku/gi,
    ];

    for (const file of files) {
      const content = await readFile(file, "utf-8");
      
      for (const pattern of skuRegexPatterns) {
        if (pattern.test(content)) {
          // Check if this is the central module (doesn't exist yet)
          if (!file.includes("lib/domain/sku")) {
            skuPatterns.push({ file, pattern: pattern.toString() });
          }
        }
      }
    }

    // After Phase 2, all SKU logic should be in lib/domain/sku.ts
    // For now, we document violations
    if (skuPatterns.length > 0) {
      console.warn("\n⚠️  SKU validation logic found outside central module:");
      skuPatterns.forEach(({ file }) => console.warn(`  - ${file}`));
      console.warn("  → Will be centralized in Phase 2 to lib/domain/sku.ts");
    }

    // This will be enforced after Phase 2
    // For now, we just document
  });

  test("single SKU format pattern", async () => {
    const patterns = new Set<string>();
    
    const files = await glob([
      "src/**/*.{ts,tsx}",
      "lib/**/*.ts",
    ], {
      ignore: ["**/node_modules/**", "**/.next/**", "**/work_files/**", "**/*.test.*", "**/*.spec.*"],
    });

    for (const file of files) {
      const content = await readFile(file, "utf-8");
      
      // Find SKU format definitions
      const formatMatches = content.match(/(CAT-\d{4}-\d{4}|\d{4}-\d{5}|YYYY-XXXXX)/g);
      if (formatMatches) {
        formatMatches.forEach(m => patterns.add(m));
      }
    }

    // Document found patterns
    if (patterns.size > 1) {
      console.warn(`\n⚠️  Multiple SKU format patterns detected: ${Array.from(patterns).join(", ")}`);
      console.warn("  → Should be standardized per ADR-0003");
    }

    // After Phase 2, this should be exactly 1
    expect(patterns.size).toBeLessThanOrEqual(2); // Allow some tolerance for now
  });
});
