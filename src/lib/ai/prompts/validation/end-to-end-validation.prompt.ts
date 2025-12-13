/**
 * PRODUCTION PROMPT: End-to-End Validation
 * 
 * This prompt validates that the entire product analysis pipeline works correctly.
 * Used for: Testing the complete flow from image to validated product data
 * 
 * Ownership: Cursor (code validation)
 */

import type { CombinedProductAnalysis } from "../../product-generator";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-100
}

/**
 * Validates a complete product analysis result
 * This is a code-based validation (Cursor ownership)
 */
export function validateProductAnalysisResult(
  analysis: CombinedProductAnalysis,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  // Critical validations (errors)
  if (!analysis.title || analysis.title.trim().length === 0) {
    errors.push("Title is missing or empty");
    score -= 20;
  }

  if (analysis.title && analysis.title.length < 10) {
    errors.push("Title is too short (minimum 10 characters)");
    score -= 10;
  }

  if (
    !analysis.description ||
    analysis.description.trim().length < 500 ||
    analysis.description.split(/\s+/).length < 300
  ) {
    errors.push("Description is too short (minimum 300 words)");
    score -= 15;
  }

  if (
    analysis.suggestedPrice <= 0 ||
    !isFinite(analysis.suggestedPrice)
  ) {
    errors.push("Invalid suggested price");
    score -= 20;
  }

  if (!analysis.rarity || !["Common", "Uncommon", "Rare", "Very Rare", "Extremely Rare"].includes(analysis.rarity)) {
    errors.push("Invalid rarity value");
    score -= 10;
  }

  if (
    !analysis.seoTitle ||
    analysis.seoTitle.length < 50 ||
    analysis.seoTitle.length > 60
  ) {
    errors.push(`SEO title length invalid (got ${analysis.seoTitle?.length || 0}, need 50-60)`);
    score -= 10;
  }

  if (
    !analysis.seoDescription ||
    analysis.seoDescription.length < 150 ||
    analysis.seoDescription.length > 160
  ) {
    errors.push(`SEO description length invalid (got ${analysis.seoDescription?.length || 0}, need 150-160)`);
    score -= 10;
  }

  if (!analysis.keywords || analysis.keywords.length !== 5) {
    errors.push(`Keywords count invalid (got ${analysis.keywords?.length || 0}, need 5)`);
    score -= 5;
  }

  // Warnings (non-blocking)
  if (analysis.imageQuality < 7) {
    warnings.push(`Image quality is low (${analysis.imageQuality}/10) - may affect sales`);
  }

  if (analysis.hasDefects && !analysis.defectDescription) {
    warnings.push("Item has defects but no description provided");
  }

  if (analysis.suggestedPrice < 50) {
    warnings.push("Price seems unusually low - verify market value");
  }

  if (analysis.suggestedPrice > 100000) {
    warnings.push("Price seems unusually high - verify market value");
  }

  if (analysis.shortDescription && analysis.shortDescription.split(/\s+/).length < 50) {
    warnings.push("Short description is below recommended word count");
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    score: Math.max(0, score),
  };
}

/**
 * Generates a validation report
 */
export function generateValidationReport(
  analysis: CombinedProductAnalysis,
  validation: ValidationResult,
): string {
  const lines: string[] = [];

  lines.push("=".repeat(60));
  lines.push("PRODUCT ANALYSIS VALIDATION REPORT");
  lines.push("=".repeat(60));
  lines.push("");

  lines.push(`Status: ${validation.isValid ? "✅ VALID" : "❌ INVALID"}`);
  lines.push(`Score: ${validation.score}/100`);
  lines.push("");

  if (validation.errors.length > 0) {
    lines.push("ERRORS:");
    validation.errors.forEach((error) => {
      lines.push(`  ❌ ${error}`);
    });
    lines.push("");
  }

  if (validation.warnings.length > 0) {
    lines.push("WARNINGS:");
    validation.warnings.forEach((warning) => {
      lines.push(`  ⚠️  ${warning}`);
    });
    lines.push("");
  }

  lines.push("ANALYSIS SUMMARY:");
  lines.push(`  Title: ${analysis.title}`);
  lines.push(`  Price: $${analysis.suggestedPrice.toLocaleString()}`);
  lines.push(`  Rarity: ${analysis.rarity}`);
  lines.push(`  Image Quality: ${analysis.imageQuality}/10`);
  lines.push(`  Has Defects: ${analysis.hasDefects ? "Yes" : "No"}`);
  lines.push("");

  lines.push("=".repeat(60));

  return lines.join("\n");
}

