/**
 * Strict schema for product analysis output
 * This is the contract that Claude must follow
 */

export interface ProductAnalysisSchema {
  // Core identification
  title: string; // 5-10 words, professional marketplace title
  description: string; // 300-400 words, detailed description
  shortDescription: string; // 50-75 words, summary for cards

  // Metadata
  estimatedEra: string; // Standard format: "Late 19th Century", "1920s", "18th Century"
  rarity: "Common" | "Uncommon" | "Rare" | "Very Rare" | "Extremely Rare";
  authenticity:
    | "Believed authentic"
    | "Attributed"
    | "School of"
    | "Possibly reproduction";

  // Value assessment
  suggestedPrice: number; // USD, must be > 0
  priceReasoning: string; // 2-3 sentences explaining price
  investmentPotential: string; // 2-3 sentences on investment value
  historicalContext: string; // 2-3 sentences on historical significance

  // SEO
  keywords: string[]; // Exactly 5 keywords
  seoTitle: string; // Exactly 50-60 characters
  seoDescription: string; // Exactly 150-160 characters
}

/**
 * Validation function - throws if schema is invalid
 */
export function validateProductAnalysis(
  data: unknown,
): asserts data is ProductAnalysisSchema {
  if (typeof data !== "object" || data === null) {
    throw new Error("Product analysis must be an object");
  }

  const analysis = data as Partial<ProductAnalysisSchema>;

  // Required string fields
  const requiredStrings: (keyof ProductAnalysisSchema)[] = [
    "title",
    "description",
    "shortDescription",
    "estimatedEra",
    "priceReasoning",
    "investmentPotential",
    "historicalContext",
    "seoTitle",
    "seoDescription",
  ];

  for (const field of requiredStrings) {
    if (
      !analysis[field] ||
      typeof analysis[field] !== "string" ||
      (analysis[field] as string).trim().length === 0
    ) {
      throw new Error(`Missing or invalid required field: ${field}`);
    }
  }

  // Validate rarity enum
  const validRarity = [
    "Common",
    "Uncommon",
    "Rare",
    "Very Rare",
    "Extremely Rare",
  ];
  if (!analysis.rarity || !validRarity.includes(analysis.rarity)) {
    throw new Error(
      `Invalid rarity: ${analysis.rarity}. Must be one of: ${validRarity.join(", ")}`,
    );
  }

  // Validate authenticity enum
  const validAuthenticity = [
    "Believed authentic",
    "Attributed",
    "School of",
    "Possibly reproduction",
  ];
  if (
    !analysis.authenticity ||
    !validAuthenticity.includes(analysis.authenticity)
  ) {
    throw new Error(
      `Invalid authenticity: ${analysis.authenticity}. Must be one of: ${validAuthenticity.join(", ")}`,
    );
  }

  // Validate price
  if (
    typeof analysis.suggestedPrice !== "number" ||
    analysis.suggestedPrice <= 0 ||
    !isFinite(analysis.suggestedPrice)
  ) {
    throw new Error(
      `Invalid suggestedPrice: ${analysis.suggestedPrice}. Must be a positive number`,
    );
  }

  // Validate keywords array
  if (
    !Array.isArray(analysis.keywords) ||
    analysis.keywords.length !== 5 ||
    !analysis.keywords.every((k) => typeof k === "string" && k.trim().length > 0)
  ) {
    throw new Error(
      "keywords must be an array of exactly 5 non-empty strings",
    );
  }

  // Validate SEO title length
  const seoTitle = analysis.seoTitle!; // Already validated above
  if (seoTitle.length < 50 || seoTitle.length > 60) {
    throw new Error(
      `seoTitle must be exactly 50-60 characters, got ${seoTitle.length}`,
    );
  }

  // Validate SEO description length
  const seoDescription = analysis.seoDescription!; // Already validated above
  if (seoDescription.length < 150 || seoDescription.length > 160) {
    throw new Error(
      `seoDescription must be exactly 150-160 characters, got ${seoDescription.length}`,
    );
  }

  // Validate description word counts
  const description = analysis.description!; // Already validated above
  const descriptionWords = description.split(/\s+/).length;
  if (descriptionWords < 300 || descriptionWords > 400) {
    throw new Error(
      `description must be 300-400 words, got ${descriptionWords}`,
    );
  }

  const shortDescription = analysis.shortDescription!; // Already validated above
  const shortDescWords = shortDescription.split(/\s+/).length;
  if (shortDescWords < 50 || shortDescWords > 75) {
    throw new Error(
      `shortDescription must be 50-75 words, got ${shortDescWords}`,
    );
  }
}

