// src/lib/sku-validation.ts
// =============================================================================
// UNIFIED SKU VALIDATION MODULE
// =============================================================================
// 
// This module standardizes SKU format across all Kollect-It systems:
// - Desktop App (product ingestion)
// - Admin Tools (manual product creation)
// - Public API (product display)
// 
// STANDARD FORMAT: PREFIX-YYYY-NNNN
// - PREFIX: 3-4 uppercase letters (category code)
// - YYYY: 4-digit year (2020-current+1)
// - NNNN: 4-digit sequence number (0001-9999)
// 
// Examples:
// - MILI-2025-0001 (Militaria)
// - COLL-2025-0042 (Collectibles)
// - BOOK-2026-0001 (Rare Books)
// - ARTS-2025-0003 (Fine Art)
// - KOL-2025-0001 (General/Legacy)
// =============================================================================

export interface SkuValidationResult {
  valid: boolean;
  error?: string;
  parsed?: {
    prefix: string;
    year: number;
    sequence: number;
    formatted: string;  // Normalized uppercase format
  };
}

/**
 * Known category prefixes for validation and auto-completion
 */
export const CATEGORY_PREFIXES: Record<string, string> = {
  'MILI': 'Militaria',
  'COLL': 'Collectibles', 
  'BOOK': 'Rare Books',
  'ARTS': 'Fine Art',
  'KOL': 'General',  // Legacy/catch-all prefix
};

/**
 * Validate SKU format: PREFIX-YYYY-NNNN
 * 
 * Accepts:
 * - 3-4 letter prefix (case-insensitive, normalized to uppercase)
 * - 4-digit year (2020 to current year + 1)
 * - 4-digit sequence (0001-9999)
 * 
 * @param sku The SKU string to validate
 * @returns Validation result with parsed components if valid
 */
export function validateSKU(sku: string | null | undefined): SkuValidationResult {
  if (!sku || typeof sku !== 'string') {
    return {
      valid: false,
      error: 'SKU is required',
    };
  }

  const trimmed = sku.trim().toUpperCase();
  
  // Pattern: 3-4 uppercase letters, hyphen, 4-digit year, hyphen, 4-digit sequence
  const SKU_PATTERN = /^([A-Z]{3,4})-(\d{4})-(\d{4})$/;
  const match = trimmed.match(SKU_PATTERN);

  if (!match) {
    return {
      valid: false,
      error: `Invalid SKU format: "${sku}". Expected: PREFIX-YYYY-NNNN (e.g., MILI-2025-0001)`,
    };
  }

  const prefix = match[1] as string;
  const yearStr = match[2] as string;
  const sequenceStr = match[3] as string;

  const year = parseInt(yearStr, 10);
  const sequence = parseInt(sequenceStr, 10);
  const currentYear = new Date().getFullYear();

  // Validate year range
  if (year < 2020 || year > currentYear + 1) {
    return {
      valid: false,
      error: `SKU year ${year} is invalid. Must be between 2020 and ${currentYear + 1}`,
    };
  }

  // Validate sequence (must be 1-9999)
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
 * 
 * @param prefix Category prefix (3-4 letters)
 * @param year Year (defaults to current year)
 * @param sequence Sequence number (defaults to 1)
 * @returns Formatted SKU string
 */
export function formatSKU(
  prefix: string,
  year?: number | null,
  sequence?: number | null
): string {
  const safePrefix = (prefix || 'KOL').toUpperCase().substring(0, 4);
  const safeYear = year ?? new Date().getFullYear();
  const safeSequence = sequence ?? 1;
  
  return `${safePrefix}-${safeYear}-${safeSequence.toString().padStart(4, '0')}`;
}

/**
 * Parse SKU components from a SKU string
 * 
 * @param sku The SKU string to parse
 * @returns Parsed components or null if invalid
 */
export function parseSKU(sku: string): { prefix: string; year: number; sequence: number } | null {
  const validation = validateSKU(sku);
  return validation.valid && validation.parsed 
    ? { prefix: validation.parsed.prefix, year: validation.parsed.year, sequence: validation.parsed.sequence }
    : null;
}

/**
 * Get suggested prefix based on category
 * 
 * @param categorySlug Category slug or name
 * @returns Suggested prefix for the category
 */
export function getSuggestedPrefix(categorySlug: string): string {
  const slug = categorySlug.toLowerCase();
  
  if (slug.includes('milit')) return 'MILI';
  if (slug.includes('collect')) return 'COLL';
  if (slug.includes('book') || slug.includes('rare')) return 'BOOK';
  if (slug.includes('art') || slug.includes('fine')) return 'ARTS';
  
  // Default to first 4 letters of category
  return slug.substring(0, 4).toUpperCase();
}

/**
 * Check if a SKU prefix is known/valid
 * 
 * @param prefix The prefix to check
 * @returns True if prefix is in known list
 */
export function isKnownPrefix(prefix: string): boolean {
  return prefix.toUpperCase() in CATEGORY_PREFIXES;
}

/**
 * Legacy format support - validate old SKU format (SKU-YYYY-XXX)
 * For backwards compatibility during migration
 * 
 * @param sku The SKU string to validate
 * @returns Validation result
 */
export function validateLegacySKU(sku: string | null | undefined): SkuValidationResult {
  if (!sku || typeof sku !== 'string') {
    return { valid: false, error: 'SKU is required' };
  }

  const LEGACY_PATTERN = /^SKU-(\d{4})-(\d{3})$/;
  const match = sku.toUpperCase().match(LEGACY_PATTERN);

  if (!match) {
    return {
      valid: false,
      error: `Invalid legacy SKU format: "${sku}". Expected: SKU-YYYY-XXX (e.g., SKU-2025-001)`,
    };
  }

  const yearStr = match[1] as string;
  const sequenceStr = match[2] as string;
  
  return {
    valid: true,
    parsed: {
      prefix: 'SKU',
      year: parseInt(yearStr, 10),
      sequence: parseInt(sequenceStr, 10),
      formatted: sku.toUpperCase(),
    },
  };
}

/**
 * Migrate legacy SKU to new format
 * Converts SKU-YYYY-XXX to KOL-YYYY-0XXX
 * 
 * @param legacySku The legacy SKU to migrate
 * @returns New format SKU or null if invalid
 */
export function migrateLegacySKU(legacySku: string): string | null {
  const validation = validateLegacySKU(legacySku);
  if (!validation.valid || !validation.parsed) return null;
  
  // Convert 3-digit sequence to 4-digit
  const newSequence = validation.parsed.sequence.toString().padStart(4, '0');
  return `KOL-${validation.parsed.year}-${newSequence}`;
}
