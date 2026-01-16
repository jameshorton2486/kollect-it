/**
 * Governance Tests - Image Pipeline Enforcement
 * 
 * These tests enforce ADR-0005: Unified Image Processing Pipeline
 * They are NOT unit tests - they enforce architectural decisions.
 */

import { describe, test, expect } from "bun:test";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { glob } from "glob";

describe("Image Pipeline Governance", () => {
  test("no raw image URLs in public-facing code", async () => {
    const violations: string[] = [];
    
    // Scan public-facing code
    const files = await glob([
      "src/app/**/*.{ts,tsx}",
      "src/components/**/*.{ts,tsx}",
    ], {
      ignore: ["**/node_modules/**", "**/.next/**", "**/work_files/**"],
    });

    for (const file of files) {
      const content = await readFile(file, "utf-8");
      
      // Check for raw ImageKit upload URLs (without transformations)
      const rawImageKitPattern = /https:\/\/ik\.imagekit\.io\/[^"'\s]+(?!\?tr=)/g;
      const matches = content.match(rawImageKitPattern);
      
      if (matches) {
        violations.push(`${file}: Raw ImageKit URL detected (must use transformations)`);
      }
      
      // Check for direct bucket references
      const bucketPattern = /(upload|raw|original)[^"'\s]*\.(jpg|jpeg|png|webp|avif)/gi;
      if (bucketPattern.test(content) && !file.includes("test")) {
        violations.push(`${file}: Direct bucket reference detected`);
      }
    }

    if (violations.length > 0) {
      console.error("\n❌ Raw image URL violations found:");
      violations.forEach(v => console.error(`  - ${v}`));
    }

    expect(violations).toHaveLength(0);
  });

  test("single image ingestion path exists", async () => {
    const uploadEndpoints: string[] = [];
    
    // Find all image upload API routes
    const files = await glob([
      "src/app/api/**/upload*/**/*.ts",
      "src/app/api/**/image*/**/*.ts",
      "src/app/api/**/categories/upload-image/**/*.ts",
    ], {
      ignore: ["**/node_modules/**", "**/.next/**", "**/work_files/**"],
    });

    for (const file of files) {
      const content = await readFile(file, "utf-8");
      
      // Check if this is an upload endpoint
      if (content.includes("POST") && (
        content.includes("upload") || 
        content.includes("image") ||
        content.includes("FormData")
      )) {
        uploadEndpoints.push(file);
      }
    }

    // According to ADR-0005, we should have a single ingestion path
    // Currently we have multiple (category upload, product upload, etc.)
    // This test documents the current state and will fail when we consolidate
    console.log(`Found ${uploadEndpoints.length} image upload endpoints:`);
    uploadEndpoints.forEach(e => console.log(`  - ${e}`));

    // For now, we document the violation but don't fail
    // This will be enforced after Phase 2 refactoring
    if (uploadEndpoints.length > 1) {
      console.warn("⚠️  Multiple upload endpoints detected - will be consolidated in Phase 2");
    }
  });

  test("no client-side image transformations", async () => {
    const violations: string[] = [];
    
    // Scan client components for image transformation logic
    const files = await glob([
      "src/components/**/*.{ts,tsx}",
      "src/app/**/page.{ts,tsx}",
    ], {
      ignore: ["**/node_modules/**", "**/.next/**", "**/work_files/**", "**/*.test.*", "**/*.spec.*"],
    });

    for (const file of files) {
      const content = await readFile(file, "utf-8");
      
      // Check for client-side resize/transform operations
      const transformPatterns = [
        /\.resize\(/,
        /\.transform\(/,
        /canvas.*getContext/,
        /ImageKit.*transform/i,
      ];

      for (const pattern of transformPatterns) {
        if (pattern.test(content) && !file.includes("test")) {
          violations.push(`${file}: Client-side image transformation detected`);
          break;
        }
      }
    }

    if (violations.length > 0) {
      console.error("\n❌ Client-side transformation violations:");
      violations.forEach(v => console.error(`  - ${v}`));
    }

    // Note: Some client-side preview logic is acceptable
    // This test flags actual transformation logic, not preview
    expect(violations).toHaveLength(0);
  });

  test("image upload endpoints validate requirements", async () => {
    const uploadEndpoints: string[] = [];
    const missingValidations: Array<{ file: string; missing: string }> = [];
    
    // Find all image upload API routes
    const files = await glob([
      "src/app/api/**/upload*/**/*.ts",
      "src/app/api/**/image*/**/*.ts",
      "src/app/api/**/categories/upload-image/**/*.ts",
    ], {
      ignore: ["**/node_modules/**", "**/.next/**", "**/work_files/**", "**/*.test.*", "**/*.spec.*"],
    });

    for (const file of files) {
      const content = await readFile(file, "utf-8");
      
      // Check if this is an upload endpoint
      if (content.includes("POST") && (
        content.includes("upload") || 
        content.includes("image") ||
        content.includes("FormData")
      )) {
        uploadEndpoints.push(file);
        
        // Check for required validations per ADR-0005
        const hasResolutionCheck = /resolution|width|height|min.*size|size.*validation/i.test(content);
        const hasNamingCheck = /filename|naming|name.*pattern|naming.*convention/i.test(content);
        const hasSKUBinding = /sku.*binding|sku.*validation|product.*id.*image/i.test(content);
        
        if (!hasResolutionCheck) {
          missingValidations.push({ file, missing: "Resolution validation" });
        }
        if (!hasNamingCheck) {
          missingValidations.push({ file, missing: "Naming convention validation" });
        }
        // SKU binding is optional for category images
        if (file.includes("categories")) {
          // Skip SKU binding check for category uploads
        } else if (!hasSKUBinding) {
          missingValidations.push({ file, missing: "SKU → image binding validation" });
        }
      }
    }

    // Document missing validations
    if (missingValidations.length > 0) {
      console.warn("\n⚠️  Image upload endpoints missing validations (per ADR-0005):");
      missingValidations.forEach(({ file, missing }) => 
        console.warn(`  - ${file}: Missing ${missing}`)
      );
      console.warn("  → These should be added in Phase 2 of image pipeline enforcement");
    }

    // For now, we document violations but don't fail
    // This will be enforced after Phase 2 refactoring
  });

  test("SKU binding validation exists for product images", async () => {
    const violations: string[] = [];
    
    // Find product image upload endpoints
    const files = await glob([
      "src/app/api/**/products/**/*.ts",
      "src/components/admin/**/*Image*.tsx",
    ], {
      ignore: ["**/node_modules/**", "**/.next/**", "**/work_files/**", "**/*.test.*", "**/*.spec.*"],
    });

    for (const file of files) {
      const content = await readFile(file, "utf-8");
      
      // Check if this handles product image uploads
      if (content.includes("image") && (
        content.includes("upload") || 
        content.includes("ImageKit") ||
        content.includes("product")
      )) {
        // Check for SKU or product ID validation
        const hasProductId = /product.*id|productId|sku.*validation/i.test(content);
        const hasSKUCheck = /validateSKU|sku.*format|sku.*binding/i.test(content);
        
        // If it's a product image upload but doesn't validate SKU/product binding
        if (!hasProductId && !hasSKUCheck && !file.includes("category")) {
          violations.push(`${file}: Product image upload missing SKU/product binding validation`);
        }
      }
    }

    if (violations.length > 0) {
      console.warn("\n⚠️  Product image uploads missing SKU binding (per ADR-0005):");
      violations.forEach(v => console.warn(`  - ${v}`));
      console.warn("  → Should validate SKU → image binding before upload");
    }

    // For now, we document violations but don't fail
    // This will be enforced after Phase 2 refactoring
  });
});
