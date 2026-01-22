/**
 * Parse image filename to detect type and suggest order
 * Used for smart image ordering in galleries
 * Slot-safe: handles null/undefined input gracefully
 */
export function parseImageMetadata(filename: string | null | undefined): {
  type: string;
  order: number;
  suggestedAlt: string;
} {
  if (!filename) {
    return {
      type: "unknown",
      order: 999,
      suggestedAlt: "Product image",
    };
  }

  const lower = filename.toLowerCase();
  const baseName = filename.replace(/\.[^/.]+$/, ""); // Remove extension

  // Main/hero image
  if (lower.includes("main")) {
    return {
      type: "main",
      order: 0,
      suggestedAlt: "Main product view",
    };
  }

  // Signature/authentication
  if (lower.includes("signature")) {
    const num = extractNumber(filename);
    return {
      type: "signature",
      order: 10 + num,
      suggestedAlt: `Signature detail ${num > 0 ? num : ""}`.trim(),
    };
  }

  // Condition photos
  if (lower.includes("condition")) {
    const num = extractNumber(filename);
    return {
      type: "condition",
      order: 20 + num,
      suggestedAlt: `Condition view ${num > 0 ? num : ""}`.trim(),
    };
  }

  // Provenance
  if (
    lower.includes("provenance") ||
    lower.includes("label") ||
    lower.includes("papers")
  ) {
    const num = extractNumber(filename);
    return {
      type: "provenance",
      order: 30 + num,
      suggestedAlt: `Provenance documentation ${num > 0 ? num : ""}`.trim(),
    };
  }

  // Detail shots
  if (
    lower.includes("detail") ||
    lower.includes("close") ||
    lower.includes("zoom")
  ) {
    const num = extractNumber(filename);
    return {
      type: "detail",
      order: 40 + num,
      suggestedAlt: `Detail view ${num > 0 ? num : ""}`.trim(),
    };
  }

  // Spine (books)
  if (lower.includes("spine")) {
    const num = extractNumber(filename);
    return {
      type: "spine",
      order: 15 + num,
      suggestedAlt: `Spine view ${num > 0 ? num : ""}`.trim(),
    };
  }

  // Cover (books)
  if (lower.includes("cover")) {
    const num = extractNumber(filename);
    return {
      type: "cover",
      order: 5 + num,
      suggestedAlt: `Cover ${num > 0 ? num : ""}`.trim(),
    };
  }

  // Back view
  if (lower.includes("back") || lower.includes("reverse")) {
    const num = extractNumber(filename);
    return {
      type: "back",
      order: 25 + num,
      suggestedAlt: `Back view ${num > 0 ? num : ""}`.trim(),
    };
  }

  // Frame (art)
  if (lower.includes("frame")) {
    const num = extractNumber(filename);
    return {
      type: "frame",
      order: 35 + num,
      suggestedAlt: `Frame detail ${num > 0 ? num : ""}`.trim(),
    };
  }

  // Default/additional
  return {
    type: "additional",
    order: 50,
    suggestedAlt: baseName.replace(/-|_/g, " "),
  };
}

/**
 * Extract number from filename string
 * Slot-safe: handles null/undefined input gracefully
 */
function extractNumber(filename: string | null | undefined): number {
  if (!filename) return 0;
  const match = filename.match(/(\d+)/);
  return match && match[1] ? parseInt(match[1], 10) : 0;
}

// =============================================================================
// UNIFIED SKU VALIDATION
// =============================================================================
// Supports BOTH formats for backwards compatibility:
// - Legacy: SKU-YYYY-XXX (e.g., SKU-2025-001)
// - New:    PREFIX-YYYY-NNNN (e.g., MILI-2025-0001, COLL-2025-0042)
// =============================================================================

/**
 * Validate SKU format - supports both legacy and new formats
 * 
 * Legacy format: SKU-YYYY-XXX (3-digit sequence)
 * New format: PREFIX-YYYY-NNNN (3-4 letter prefix, 4-digit sequence)
 * 
 * Returns parsed data with backwards-compatible 'number' field
 * Slot-safe: handles null/undefined input gracefully
 */
export function validateSKU(sku: string | null | undefined): {
  valid: boolean;
  error?: string;
  parsed?: { 
    year: number; 
    number: number;    // Backwards compatible field name
    sequence?: number; // New field name (same value)
    prefix?: string;   // Category prefix (new field)
  };
} {
  if (!sku) {
    return {
      valid: false,
      error: "SKU is required",
    };
  }

  const trimmed = sku.trim().toUpperCase();

  // Try new format first: PREFIX-YYYY-NNNN (3-4 letter prefix, 4-digit sequence)
  const newPattern = /^([A-Z]{3,4})-(\d{4})-(\d{4})$/;
  const newMatch = trimmed.match(newPattern);

  if (newMatch) {
    const prefix = newMatch[1] as string;
    const yearStr = newMatch[2] as string;
    const sequenceStr = newMatch[3] as string;

    const year = parseInt(yearStr, 10);
    const sequence = parseInt(sequenceStr, 10);
    const currentYear = new Date().getFullYear();

    if (year < 2020 || year > currentYear + 1) {
      return {
        valid: false,
        error: `Year must be between 2020 and ${currentYear + 1}`,
      };
    }

    if (sequence < 1 || sequence > 9999) {
      return {
        valid: false,
        error: "Sequence number must be between 0001 and 9999",
      };
    }

    return {
      valid: true,
      parsed: { 
        year, 
        number: sequence,    // Backwards compatible
        sequence,            // New field name
        prefix,              // Category prefix
      },
    };
  }

  // Try legacy format: SKU-YYYY-XXX (3-digit sequence)
  const legacyPattern = /^SKU-(\d{4})-(\d{3})$/;
  const legacyMatch = trimmed.match(legacyPattern);

  if (legacyMatch) {
    const yearStr = legacyMatch[1];
    const numberStr = legacyMatch[2];
    
    if (!yearStr || !numberStr) {
      return {
        valid: false,
        error: "Invalid SKU format",
      };
    }

    const year = parseInt(yearStr, 10);
    const number = parseInt(numberStr, 10);
    const currentYear = new Date().getFullYear();

    if (year < 2020 || year > currentYear + 1) {
      return {
        valid: false,
        error: `Year must be between 2020 and ${currentYear + 1}`,
      };
    }

    if (number < 1 || number > 999) {
      return {
        valid: false,
        error: "Number must be between 001 and 999",
      };
    }

    return {
      valid: true,
      parsed: { 
        year, 
        number,
        sequence: number,
        prefix: 'SKU',
      },
    };
  }

  // Neither format matched
  return {
    valid: false,
    error: "SKU must be in format: PREFIX-YYYY-NNNN (e.g., MILI-2025-0001) or SKU-YYYY-XXX (e.g., SKU-2025-001)",
  };
}

/**
 * Format SKU from components
 * Supports both legacy (3-digit) and new (4-digit) formats
 * Slot-safe: handles null/undefined inputs gracefully
 * 
 * @param yearOrPrefix - Year (legacy) or category prefix (new format)
 * @param number - Sequence number
 * @param year - Year (only needed when using prefix)
 */
export function formatSKU(
  yearOrPrefix: number | string | null | undefined, 
  number: number | null | undefined,
  year?: number | null
): string {
  const safeNumber = number ?? 1;

  // If first param is a string, use new format with prefix
  if (typeof yearOrPrefix === 'string') {
    const safePrefix = yearOrPrefix.toUpperCase().substring(0, 4) || 'KOL';
    const safeYear = year ?? new Date().getFullYear();
    return `${safePrefix}-${safeYear}-${safeNumber.toString().padStart(4, "0")}`;
  }

  // Otherwise use legacy format
  const safeYear = yearOrPrefix ?? new Date().getFullYear();
  return `SKU-${safeYear}-${safeNumber.toString().padStart(3, "0")}`;
}

/**
 * Format SKU in new unified format (PREFIX-YYYY-NNNN)
 * 
 * @param prefix - Category prefix (3-4 letters, e.g., MILI, COLL, BOOK)
 * @param year - Year (defaults to current year)
 * @param sequence - Sequence number (defaults to 1)
 */
export function formatUnifiedSKU(
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
 * Category prefix mapping for SKU generation
 */
export const SKU_CATEGORY_PREFIXES: Record<string, string> = {
  'militaria': 'MILI',
  'collectibles': 'COLL',
  'rare-books': 'BOOK',
  'fine-art': 'ARTS',
  // Default fallback
  'default': 'KOL',
};

/**
 * Get the appropriate SKU prefix for a category
 */
export function getCategoryPrefix(categorySlug: string): string {
  const slug = categorySlug.toLowerCase();
  return SKU_CATEGORY_PREFIXES[slug] || SKU_CATEGORY_PREFIXES['default'];
}
