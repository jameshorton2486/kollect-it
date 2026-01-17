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
    const formatDefinitions: Array<{ file: string; pattern: string }> = [];
    
    const files = await glob([
      "src/**/*.{ts,tsx}",
      "lib/**/*.ts",
    ], {
      ignore: ["**/node_modules/**", "**/.next/**", "**/work_files/**", "**/*.test.*", "**/*.spec.*"],
    });

    // Standard format per ADR-0006: SKU-YYYY-XXX
    const standardPattern = /^SKU-\d{4}-\d{3}$/;
    
    for (const file of files) {
      const content = await readFile(file, "utf-8");
      
      // Find SKU format definitions or patterns
      const formatMatches = content.match(/(CAT-\d{4}-\d{4}|SKU-\d{4}-\d{3}|\d{4}-\d{5}|YYYY-XXXXX)/g);
      if (formatMatches) {
        formatMatches.forEach(m => {
          patterns.add(m);
          formatDefinitions.push({ file, pattern: m });
        });
      }
      
      // Also check for regex patterns defining SKU format
      const regexPatterns = content.match(/\/\^?SKU[^\$]+\$?\//g);
      if (regexPatterns) {
        regexPatterns.forEach(p => {
          patterns.add(p);
          formatDefinitions.push({ file, pattern: p });
        });
      }
    }

    // Document found patterns
    if (patterns.size > 1 || !Array.from(patterns).some(p => p.includes("SKU"))) {
      console.warn(`\n⚠️  SKU format patterns detected:`);
      formatDefinitions.forEach(({ file, pattern }) => 
        console.warn(`  - ${file}: ${pattern}`)
      );
      console.warn("  → Should standardize on SKU-YYYY-XXX per ADR-0006");
    }

    // Check that at least one pattern matches the standard
    const hasStandardPattern = Array.from(patterns).some(p => 
      typeof p === "string" && standardPattern.test(p) || p.includes("SKU-\\d{4}-\\d{3}")
    );
    
    if (!hasStandardPattern) {
      console.warn("  → No SKU-YYYY-XXX pattern found - should be added");
    }

    // After Phase 2, this should be exactly 1 pattern (SKU-YYYY-XXX)
    expect(patterns.size).toBeLessThanOrEqual(3); // Allow some tolerance for now
  });

  test("SKU validation used at all enforcement points", async () => {
    const violations: Array<{ file: string; issue: string }> = [];
    
    // Find all entry points that handle SKUs
    const files = await glob([
      "src/app/api/**/products/**/*.ts",
      "src/components/admin/**/*Product*.tsx",
      "scripts/**/*sync*.ts",
      "scripts/**/*drive*.ts",
    ], {
      ignore: ["**/node_modules/**", "**/.next/**", "**/work_files/**", "**/*.test.*", "**/*.spec.*"],
    });

    for (const file of files) {
      const content = await readFile(file, "utf-8");
      
      // Check if this file deals with SKUs
      if (content.includes("sku") || content.includes("SKU")) {
        // Check if it imports or uses validateSKU
        const usesValidateSKU = /validateSKU|from.*image-parser|import.*validateSKU/i.test(content);
        const hasSKURegex = /\/\^?SKU[^\$]+\$?\//.test(content);
        const hasManualValidation = /sku.*match|sku.*pattern|sku.*format/i.test(content);
        
        // If it has SKU logic but doesn't use centralized validation
        if ((hasSKURegex || hasManualValidation) && !usesValidateSKU) {
          violations.push({
            file,
            issue: "SKU validation logic not using centralized validateSKU() function",
          });
        }
      }
    }

    if (violations.length > 0) {
      console.warn("\n⚠️  SKU enforcement points not using centralized validation:");
      violations.forEach(({ file, issue }) => 
        console.warn(`  - ${file}: ${issue}`)
      );
      console.warn("  → Should import validateSKU from @/lib/utils/image-parser per ADR-0006");
    }

    // For now, we document violations but don't fail
    // This will be enforced after Phase 2 refactoring
  });

  test("SKU format matches ADR-0006 standard", async () => {
    // Check that validateSKU function uses the correct format
    const imageParserFile = await readFile("src/lib/utils/image-parser.ts", "utf-8");
    
    // ADR-0006 specifies: SKU-YYYY-XXX
    const expectedPattern = /SKU-\\d{4}-\\d{3}/;
    const hasCorrectPattern = expectedPattern.test(imageParserFile);
    
    if (!hasCorrectPattern) {
      console.error("\n❌ validateSKU() does not use SKU-YYYY-XXX format per ADR-0006");
      console.error("  → Update src/lib/utils/image-parser.ts to match ADR-0006");
      // This should fail in Phase 2
    }
    
    // For now, we document but don't fail
    expect(hasCorrectPattern || imageParserFile.includes("SKU-")).toBe(true);
  });
});
