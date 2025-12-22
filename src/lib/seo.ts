/**
 * SEO Utilities
 * 
 * Provides helper functions for generating SEO metadata,
 * canonical URLs, and validating SEO fields
 */

export interface SEOData {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string;
  keywords?: string[];
}

/**
 * Clean text for SEO (strip emojis, normalize whitespace)
 */
export function cleanSeoText(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Remove emojis
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Truncate text to max length for SEO
 */
export function truncateSeoText(text: string, maxLength: number): string {
  const cleaned = cleanSeoText(text);
  if (cleaned.length <= maxLength) return cleaned;
  
  // Truncate at word boundary
  const truncated = cleaned.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated.substring(0, maxLength - 3) + '...';
}

/**
 * Generate SEO title from product title
 * Max 60 characters for optimal display in search results
 */
export function generateSeoTitle(productTitle: string, siteName: string = "Kollect-It"): string {
  const cleaned = cleanSeoText(productTitle);
  const maxTitleLength = 60 - siteName.length - 3; // Reserve space for " | SiteName"
  
  if (cleaned.length <= maxTitleLength) {
    return `${cleaned} | ${siteName}`;
  }
  
  return `${truncateSeoText(cleaned, maxTitleLength)} | ${siteName}`;
}

/**
 * Generate SEO description
 * Max 155 characters for optimal display in search results
 */
export function generateSeoDescription(
  description: string,
  fallback: string = "Curated antique and collectible offered by Kollect-It."
): string {
  if (!description || description.trim().length === 0) {
    return fallback;
  }
  
  return truncateSeoText(description, 155);
}

/**
 * Convert to sentence case (first letter capitalized, rest lowercase)
 */
export function toSentenceCase(text: string): string {
  if (!text || text.length === 0) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Validate SEO title (should be ≤60 chars)
 */
export function validateSeoTitle(title: string): { valid: boolean; error?: string } {
  const cleaned = cleanSeoText(title);
  
  if (cleaned.length === 0) {
    return { valid: false, error: "SEO title cannot be empty" };
  }
  
  if (cleaned.length > 60) {
    return { 
      valid: false, 
      error: `SEO title too long (${cleaned.length}/60 characters). Optimal length is 50-60 characters.` 
    };
  }
  
  return { valid: true };
}

/**
 * Validate SEO description (should be ≤155 chars)
 */
export function validateSeoDescription(description: string): { valid: boolean; error?: string } {
  const cleaned = cleanSeoText(description);
  
  if (cleaned.length === 0) {
    return { valid: false, error: "SEO description cannot be empty" };
  }
  
  if (cleaned.length > 155) {
    return { 
      valid: false, 
      error: `SEO description too long (${cleaned.length}/155 characters). Optimal length is 120-155 characters.` 
    };
  }
  
  return { valid: true };
}

/**
 * Generate canonical URL for product
 */
export function generateCanonicalUrl(slug: string, baseUrl: string = "https://kollect-it.com"): string {
  return `${baseUrl}/product/${slug}`;
}
