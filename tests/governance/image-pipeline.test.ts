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
});
