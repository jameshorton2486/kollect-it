/**
 * Parse image filename to detect type and suggest order
 * Used for smart image ordering in galleries
 */
export function parseImageMetadata(filename: string): {
  type: string;
  order: number;
  suggestedAlt: string;
} {
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
 * Extract number from filename like "condition-01.jpg" → 1
 */
function extractNumber(filename: string): number {
  const match = filename.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Validate SKU format: SKU-YYYY-XXX
 */
export function validateSKU(sku: string): {
  valid: boolean;
  error?: string;
  parsed?: { year: number; number: number };
} {
  const pattern = /^SKU-(\d{4})-(\d{3})$/;
  const match = sku.match(pattern);

  if (!match) {
    return {
      valid: false,
      error: "SKU must be in format: SKU-YYYY-XXX (e.g., SKU-2025-001)",
    };
  }

  const year = parseInt(match[1], 10);
  const number = parseInt(match[2], 10);

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
    parsed: { year, number },
  };
}

/**
 * Format SKU from components
 */
export function formatSKU(year: number, number: number): string {
  return `SKU-${year}-${number.toString().padStart(3, "0")}`;
}
