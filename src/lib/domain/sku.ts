// Centralized SKU validation and formatting logic.

export interface SkuValidationResult {
  valid: boolean;
  error?: string;
  parsed?: {
    prefix: string;
    year: number;
    sequence: number;
    formatted: string; // Normalized uppercase format
  };
}

/**
 * Known category prefixes for validation and auto-completion
 */
export const CATEGORY_PREFIXES: Record<string, string> = {
  MILI: "Militaria",
  COLL: "Collectibles",
  BOOK: "Rare Books",
  ARTS: "Fine Art",
  KOL: "General", // Legacy/catch-all prefix
};

/**
 * Validate SKU format: PREFIX-YYYY-NNNN
 *
 * Accepts:
 * - 3-4 letter prefix (case-insensitive, normalized to uppercase)
 * - 4-digit year (2020 to current year + 1)
 * - 4-digit sequence (0001-9999)
 */
export function validateSKU(
  sku: string | null | undefined,
): SkuValidationResult {
  if (!sku || typeof sku !== "string") {
    return {
      valid: false,
      error: "SKU is required",
    };
  }

  const trimmed = sku.trim().toUpperCase();

  // Pattern: 3-4 uppercase letters, hyphen, 4-digit year, hyphen, 4-digit sequence
  const SKU_PATTERN = /^([A-Z]{3,4})-(\d{4})-(\d{4})$/;
  const match = trimmed.match(SKU_PATTERN);

  if (!match) {
    return {
      valid: false,
      error:
        `Invalid SKU format: "${sku}". ` +
        "Expected: PREFIX-YYYY-NNNN (e.g., MILI-2026-0001)",
    };
  }

  const prefix = match[1] as string;
  const yearStr = match[2] as string;
  const sequenceStr = match[3] as string;

  const year = parseInt(yearStr, 10);
  const sequence = parseInt(sequenceStr, 10);
  const currentYear = new Date().getFullYear();

  if (year < 2020 || year > currentYear + 1) {
    return {
      valid: false,
      error: `SKU year ${year} is invalid. Must be between 2020 and ${currentYear + 1}`,
    };
  }

  if (sequence < 1 || sequence > 9999) {
    return {
      valid: false,
      error: `SKU sequence ${sequence} is invalid. Must be between 0001 and 9999`,
    };
  }

  return {
    valid: true,
    parsed: {
      prefix,
      year,
      sequence,
      formatted: `${prefix}-${year}-${sequenceStr}`,
    },
  };
}

/**
 * Format a SKU from components
 */
export function formatSKU(
  prefix: string,
  year?: number | null,
  sequence?: number | null,
): string {
  const safePrefix = (prefix || "KOL").toUpperCase().substring(0, 4);
  const safeYear = year ?? new Date().getFullYear();
  const safeSequence = sequence ?? 1;

  return `${safePrefix}-${safeYear}-${safeSequence.toString().padStart(4, "0")}`;
}

/**
 * Parse SKU components from a SKU string
 */
export function parseSKU(
  sku: string,
): { prefix: string; year: number; sequence: number } | null {
  const validation = validateSKU(sku);
  return validation.valid && validation.parsed
    ? {
        prefix: validation.parsed.prefix,
        year: validation.parsed.year,
        sequence: validation.parsed.sequence,
      }
    : null;
}

/**
 * Get suggested prefix based on category
 */
export function getSuggestedPrefix(categorySlug: string): string {
  const slug = categorySlug.toLowerCase();

  if (slug.includes("milit")) return "MILI";
  if (slug.includes("collect")) return "COLL";
  if (slug.includes("book") || slug.includes("rare")) return "BOOK";
  if (slug.includes("art") || slug.includes("fine")) return "ARTS";

  return slug.substring(0, 4).toUpperCase();
}

/**
 * Check if a SKU prefix is known/valid
 */
export function isKnownPrefix(prefix: string): boolean {
  return prefix.toUpperCase() in CATEGORY_PREFIXES;
}

