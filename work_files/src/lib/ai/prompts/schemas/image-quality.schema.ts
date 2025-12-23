/**
 * Strict schema for image quality analysis output
 * This is the contract that GPT-4V must follow
 */

export interface ImageQualitySchema {
  imageQuality: number; // 1-10 scale, integer
  hasDefects: boolean;
  defectDescription: string; // Empty string if no defects
  photographyNotes: string; // Assessment of photo quality
  suggestedImprovements: string[]; // Array of improvement suggestions
}

/**
 * Validation function - throws if schema is invalid
 */
export function validateImageQuality(
  data: unknown,
): asserts data is ImageQualitySchema {
  if (typeof data !== "object" || data === null) {
    throw new Error("Image quality analysis must be an object");
  }

  const analysis = data as Partial<ImageQualitySchema>;

  // Validate imageQuality
  if (
    typeof analysis.imageQuality !== "number" ||
    !Number.isInteger(analysis.imageQuality) ||
    analysis.imageQuality < 1 ||
    analysis.imageQuality > 10
  ) {
    throw new Error(
      `imageQuality must be an integer between 1 and 10, got ${analysis.imageQuality}`,
    );
  }

  // Validate hasDefects
  if (typeof analysis.hasDefects !== "boolean") {
    throw new Error("hasDefects must be a boolean");
  }

  // Validate defectDescription
  if (typeof analysis.defectDescription !== "string") {
    throw new Error("defectDescription must be a string");
  }

  // Validate photographyNotes
  if (
    !analysis.photographyNotes ||
    typeof analysis.photographyNotes !== "string" ||
    analysis.photographyNotes.trim().length === 0
  ) {
    throw new Error("photographyNotes must be a non-empty string");
  }

  // Validate suggestedImprovements
  if (!Array.isArray(analysis.suggestedImprovements)) {
    throw new Error("suggestedImprovements must be an array");
  }

  if (
    !analysis.suggestedImprovements.every(
      (item) => typeof item === "string" && item.trim().length > 0,
    )
  ) {
    throw new Error(
      "suggestedImprovements must be an array of non-empty strings",
    );
  }
}

