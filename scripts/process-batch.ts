#!/usr/bin/env node
/**
 * KOLLECT-IT: Batch Product Generator
 *
 * Processes multiple products from JSON file
 * Useful for bulk product imports
 *
 * Usage: bun run process-batch batch-products.json
 */

import * as fs from "fs";
import * as path from "path";

interface BatchProduct {
  category: string;
  name: string;
  condition: string;
  photos: Array<{
    url: string;
    user_description?: string;
  }>;
  [key: string]: unknown;
}

interface BatchResult {
  batch_id: string;
  timestamp: string;
  total_products: number;
  total_photos: number;
  output_file: string;
}

class BatchProcessor {
  async processBatchFile(filePath: string): Promise<BatchResult> {
    console.log("📋 KOLLECT-IT Batch Processor");
    console.log("═══════════════════════════════\n");

    // Read batch file
    if (!fs.existsSync(filePath)) {
      throw new Error(`Batch file not found: ${filePath}`);
    }

    let batchProducts: BatchProduct[] = [];

    try {
      const content = fs.readFileSync(filePath, "utf-8");
      batchProducts = JSON.parse(content);

      if (!Array.isArray(batchProducts)) {
        throw new Error("Batch file must be a JSON array of products");
      }
    } catch (error) {
      throw new Error(
        `Failed to parse batch file: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    console.log(`📦 Loaded ${batchProducts.length} products from batch file\n`);

    // Validate products
    const validationResults = batchProducts.map((product, index) => {
      const errors = this.validateProduct(product);
      return {
        index,
        name: product.name || "Unknown",
        valid: errors.length === 0,
        errors,
      };
    });

    const validProducts = validationResults.filter((r) => r.valid);
    const invalidProducts = validationResults.filter((r) => !r.valid);

    console.log(`✅ Valid: ${validProducts.length}`);
    console.log(`❌ Invalid: ${invalidProducts.length}\n`);

    if (invalidProducts.length > 0) {
      console.log("📝 Invalid products:");
      for (const invalid of invalidProducts) {
        console.log(`   • ${invalid.name} (index ${invalid.index})`);
        for (const error of invalid.errors) {
          console.log(`     - ${error}`);
        }
      }
      console.log();
    }

    // Generate batch ID
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const timestamp = new Date().toISOString();

    // Count total photos
    let totalPhotos = 0;
    for (const product of batchProducts) {
      if (Array.isArray(product.photos)) {
        totalPhotos += product.photos.length;
      }
    }

    // Create batch manifest
    const batchManifest = {
      batch_id: batchId,
      timestamp,
      total_products: batchProducts.length,
      valid_products: validProducts.length,
      invalid_products: invalidProducts.length,
      total_photos: totalPhotos,
      products: batchProducts.map((product, index) => ({
        index,
        name: product.name,
        category: product.category,
        photos: Array.isArray(product.photos) ? product.photos.length : 0,
        valid: validationResults[index]?.valid || false,
        errors: validationResults[index]?.errors || [],
      })),
    };

    // Save manifest
    const outputDir = "./batches";
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFile = path.join(outputDir, `${batchId}-manifest.json`);
    fs.writeFileSync(outputFile, JSON.stringify(batchManifest, null, 2));

    console.log(`📄 Batch manifest saved: ${outputFile}\n`);
    console.log("📊 Summary:");
    console.log(`   Batch ID: ${batchId}`);
    console.log(`   Total Products: ${batchProducts.length}`);
    console.log(`   Total Photos: ${totalPhotos}`);
    console.log(`   Output: ${outputFile}\n`);

    // Print next steps
    console.log("🚀 Next steps:");
    console.log("   1. Review batch manifest");
    console.log("   2. Submit to AI Agent v3 for product.json generation");
    console.log("   3. Save output to Google Drive (/Kollect-It/Products/)");
    console.log("   4. Run: bun run sync-from-google-drive\n");

    return {
      batch_id: batchId,
      timestamp,
      total_products: batchProducts.length,
      total_photos: totalPhotos,
      output_file: outputFile,
    };
  }

  private validateProduct(product: BatchProduct): string[] {
    const errors: string[] = [];

    // Check required fields
    if (!product.category) {
      errors.push("Missing required field: category");
    } else if (
      ![
        "fine_art",
        "collectibles",
        "books_and_manuscripts",
        "militaria_and_historical",
      ].includes(product.category as string)
    ) {
      errors.push(`Invalid category: ${product.category}`);
    }

    if (!product.name) {
      errors.push("Missing required field: name");
    }

    if (!product.condition) {
      errors.push("Missing required field: condition");
    } else if (
      !["poor", "fair", "good", "very_good", "excellent"].includes(
        product.condition as string,
      )
    ) {
      errors.push(`Invalid condition: ${product.condition}`);
    }

    if (!Array.isArray(product.photos) || product.photos.length === 0) {
      errors.push("Missing required field: photos (at least 1 required)");
    } else if (product.photos.length > 20) {
      errors.push(`Too many photos: ${product.photos.length} (max 20)`);
    }

    return errors;
  }
}

// Main execution
async function main() {
  const batchFile = process.argv[2];

  if (!batchFile) {
    console.error("❌ Usage: bun run process-batch <batch-file.json>");
    console.error("Example: bun run process-batch batch-products.json");
    process.exit(1);
  }

  try {
    const processor = new BatchProcessor();
    await processor.processBatchFile(batchFile);
    console.log("✅ Batch processing complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Batch processing failed:", error);
    process.exit(1);
  }
}

main();
