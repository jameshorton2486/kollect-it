#!/usr/bin/env node
/**
 * KOLLECT-IT: Product JSON Validator
 *
 * Validates generated product.json against schema
 * Checks word counts, pricing ranges, confidence bounds, etc.
 *
 * Usage: bun run validate-product <product-file.json>
 */

import * as fs from "fs";

interface ValidationReport {
  valid: boolean;
  timestamp: string;
  file: string;
  errors: string[];
  warnings: string[];
  checks: {
    [key: string]: {
      passed: boolean;
      details: string;
    };
  };
}

class ProductValidator {
  private report: ValidationReport = {
    valid: true,
    timestamp: new Date().toISOString(),
    file: "",
    errors: [],
    warnings: [],
    checks: {},
  };

  async validateFile(filePath: string): Promise<ValidationReport> {
    this.report.file = filePath;

    console.log("🔍 KOLLECT-IT Product Validator\n");

    // Read file
    if (!fs.existsSync(filePath)) {
      this.report.errors.push(`File not found: ${filePath}`);
      this.report.valid = false;
      return this.report;
    }

    let product: Record<string, unknown>;

    try {
      const content = fs.readFileSync(filePath, "utf-8");
      product = JSON.parse(content);
    } catch (error) {
      this.report.errors.push(
        `Invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
      );
      this.report.valid = false;
      return this.report;
    }

    // Run checks
    this.checkRequiredFields(product);
    this.checkDataTypes(product);
    this.checkDescriptionWordCount(product);
    this.checkPricing(product);
    this.checkPhotos(product);
    this.checkKeywords(product);
    this.checkMetadata(product);

    // Final status
    if (this.report.errors.length > 0) {
      this.report.valid = false;
    }

    return this.report;
  }

  private checkRequiredFields(product: Record<string, unknown>) {
    const required = [
      "product_id",
      "category",
      "name",
      "condition",
      "photos",
      "description",
      "pricing",
      "seo",
      "metadata",
    ];

    const missing = required.filter((field) => !(field in product));

    this.report.checks["required_fields"] = {
      passed: missing.length === 0,
      details:
        missing.length === 0
          ? "All required fields present"
          : `Missing: ${missing.join(", ")}`,
    };

    if (missing.length > 0) {
      this.report.errors.push(`Missing required fields: ${missing.join(", ")}`);
    }
  }

  private checkDataTypes(product: Record<string, unknown>) {
    const typeChecks = [
      { field: "product_id", expected: "string" },
      { field: "category", expected: "string" },
      { field: "name", expected: "string" },
      { field: "condition", expected: "string" },
      { field: "photos", expected: "array" },
    ];

    const errors: string[] = [];

    for (const check of typeChecks) {
      const value = product[check.field];
      const actualType = Array.isArray(value) ? "array" : typeof value;

      if (actualType !== check.expected) {
        errors.push(
          `${check.field}: expected ${check.expected}, got ${actualType}`,
        );
      }
    }

    this.report.checks["data_types"] = {
      passed: errors.length === 0,
      details: errors.length === 0 ? "All types correct" : errors.join("; "),
    };

    if (errors.length > 0) {
      this.report.errors.push(...errors);
    }
  }

  private checkDescriptionWordCount(product: Record<string, unknown>) {
    const description = product.description as
      | Record<string, unknown>
      | undefined;

    if (!description?.body || typeof description.body !== "string") {
      this.report.checks["description_body"] = {
        passed: false,
        details: "Missing or invalid description.body",
      };
      this.report.errors.push("Missing or invalid description.body");
      return;
    }

    const bodyWordCount = (description.body as string).split(/\s+/).length;
    const bodyValid = bodyWordCount >= 250 && bodyWordCount <= 350;

    this.report.checks["description_body"] = {
      passed: bodyValid,
      details: `Word count: ${bodyWordCount} (expected 250–350)`,
    };

    if (!bodyValid) {
      this.report.warnings.push(
        `Description body word count: ${bodyWordCount} (should be 250–350)`,
      );
    }

    // Check SEO meta
    if (!description?.seo_meta || typeof description.seo_meta !== "string") {
      this.report.checks["description_seo_meta"] = {
        passed: false,
        details: "Missing or invalid description.seo_meta",
      };
      this.report.errors.push("Missing or invalid description.seo_meta");
      return;
    }

    const metaWordCount = (description.seo_meta as string).split(/\s+/).length;
    const metaValid = metaWordCount >= 50 && metaWordCount <= 70;

    this.report.checks["description_seo_meta"] = {
      passed: metaValid,
      details: `Word count: ${metaWordCount} (expected 50–70)`,
    };

    if (!metaValid) {
      this.report.warnings.push(
        `SEO meta word count: ${metaWordCount} (should be 50–70)`,
      );
    }
  }

  private checkPricing(product: Record<string, unknown>) {
    const pricing = product.pricing as Record<string, unknown> | undefined;

    if (!pricing) {
      this.report.checks["pricing"] = {
        passed: false,
        details: "Missing pricing object",
      };
      this.report.errors.push("Missing pricing object");
      return;
    }

    const errors: string[] = [];

    // Check price order
    const low = pricing.low_estimate as number | undefined;
    const high = pricing.high_estimate as number | undefined;
    const suggested = pricing.suggested_price as number | undefined;

    if (
      typeof low !== "number" ||
      typeof high !== "number" ||
      typeof suggested !== "number"
    ) {
      errors.push("Pricing fields must be numbers");
    } else {
      if (low >= suggested) {
        errors.push(`low_estimate (${low}) >= suggested_price (${suggested})`);
      }
      if (suggested >= high) {
        errors.push(
          `suggested_price (${suggested}) >= high_estimate (${high})`,
        );
      }
    }

    // Check confidence
    const confidence = pricing.confidence as number | undefined;
    if (typeof confidence !== "number" || confidence < 0 || confidence > 1) {
      errors.push("Confidence must be a number between 0.0 and 1.0");
    }

    this.report.checks["pricing"] = {
      passed: errors.length === 0,
      details:
        errors.length === 0
          ? `Range: $${low} - $${high}, suggested: $${suggested}, confidence: ${confidence}`
          : errors.join("; "),
    };

    if (errors.length > 0) {
      this.report.errors.push(...errors);
    }
  }

  private checkPhotos(product: Record<string, unknown>) {
    const photos = product.photos as Array<Record<string, unknown>> | undefined;

    if (!Array.isArray(photos) || photos.length === 0) {
      this.report.checks["photos"] = {
        passed: false,
        details: "Missing photos array or empty",
      };
      this.report.errors.push("Photos array missing or empty");
      return;
    }

    if (photos.length > 20) {
      this.report.warnings.push(
        `Too many photos: ${photos.length} (recommended max 20)`,
      );
    }

    const missingUrls = photos.filter(
      (p) => !p.url || typeof p.url !== "string",
    );

    this.report.checks["photos"] = {
      passed: missingUrls.length === 0,
      details: `${photos.length} photos, ${missingUrls.length} missing URLs`,
    };

    if (missingUrls.length > 0) {
      this.report.errors.push(`${missingUrls.length} photos missing URLs`);
    }
  }

  private checkKeywords(product: Record<string, unknown>) {
    const seo = product.seo as Record<string, unknown> | undefined;

    if (!seo) {
      this.report.checks["keywords"] = {
        passed: false,
        details: "Missing SEO object",
      };
      return;
    }

    const primary = seo.primary_keywords as string[] | undefined;
    const secondary = seo.secondary_keywords as string[] | undefined;

    const primaryValid =
      Array.isArray(primary) && primary.length >= 3 && primary.length <= 6;
    const secondaryValid =
      Array.isArray(secondary) &&
      secondary.length >= 4 &&
      secondary.length <= 10;

    const passed = primaryValid && secondaryValid;

    this.report.checks["keywords"] = {
      passed,
      details: `Primary: ${primary?.length || 0} (3–6), Secondary: ${secondary?.length || 0} (4–10)`,
    };

    if (!primaryValid) {
      this.report.warnings.push(
        `Primary keywords: ${primary?.length || 0} (should be 3–6)`,
      );
    }
    if (!secondaryValid) {
      this.report.warnings.push(
        `Secondary keywords: ${secondary?.length || 0} (should be 4–10)`,
      );
    }
  }

  private checkMetadata(product: Record<string, unknown>) {
    const metadata = product.metadata as Record<string, unknown> | undefined;

    if (!metadata) {
      this.report.checks["metadata"] = {
        passed: false,
        details: "Missing metadata object",
      };
      this.report.errors.push("Missing metadata object");
      return;
    }

    const validationPassed = metadata.validation_passed === true;
    const googleDriveReady = metadata.google_drive_ready === true;
    const imagekitReady = metadata.imagekit_ready === true;

    this.report.checks["metadata"] = {
      passed: validationPassed,
      details: `validation_passed: ${validationPassed}, google_drive_ready: ${googleDriveReady}, imagekit_ready: ${imagekitReady}`,
    };

    if (!validationPassed) {
      this.report.errors.push("Metadata validation_passed is false");
    }
  }

  printReport() {
    console.log("📋 Validation Report");
    console.log("═══════════════════════════════\n");

    // Overall status
    const status = this.report.valid ? "✅ VALID" : "❌ INVALID";
    console.log(`Status: ${status}\n`);

    // Checks
    console.log("📊 Checks:");
    for (const [name, result] of Object.entries(this.report.checks)) {
      const icon = result.passed ? "✅" : "❌";
      console.log(`   ${icon} ${name}: ${result.details}`);
    }
    console.log();

    // Errors
    if (this.report.errors.length > 0) {
      console.log("🚨 Errors:");
      for (const error of this.report.errors) {
        console.log(`   • ${error}`);
      }
      console.log();
    }

    // Warnings
    if (this.report.warnings.length > 0) {
      console.log("⚠️  Warnings:");
      for (const warning of this.report.warnings) {
        console.log(`   • ${warning}`);
      }
      console.log();
    }

    console.log(`📄 File: ${this.report.file}`);
    console.log(`🕐 Timestamp: ${this.report.timestamp}\n`);
  }
}

// Main execution
async function main() {
  const productFile = process.argv[2];

  if (!productFile) {
    console.error("❌ Usage: bun run validate-product <product-file.json>");
    console.error("Example: bun run validate-product product-2025-0001.json");
    process.exit(1);
  }

  try {
    const validator = new ProductValidator();
    const report = await validator.validateFile(productFile);
    validator.printReport();

    // Save report
    const reportFile = productFile.replace(".json", "-validation.json");
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`💾 Report saved: ${reportFile}`);

    process.exit(report.valid ? 0 : 1);
  } catch (error) {
    console.error("❌ Validation failed:", error);
    process.exit(1);
  }
}

main();
