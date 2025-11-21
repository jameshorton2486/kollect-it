/**
 * Pricing Rules and Multipliers
 * Phase 3 - Category-based and condition-based pricing adjustments
 */

import { ProductCondition, RarityLevel } from "./types";

/**
 * Category-based pricing multipliers
 * Adjust base price based on product category
 */
export const categoryBaseMultiplier: Record<string, number> = {
  "Vintage Watches": 1.8,
  "Antique Furniture": 1.5,
  "Fine Art": 2.5,
  "Coins & Currency": 1.6,
  "Stamps & Philately": 1.3,
  Jewelry: 2.0,
  "Books & Manuscripts": 1.4,
  "Ceramics & Pottery": 1.5,
  Glass: 1.2,
  Memorabilia: 1.3,
  "Musical Instruments": 1.9,
  "Toys & Games": 1.1,
  "Sports Equipment": 1.2,
  Militaria: 1.4,
  Photography: 1.7,
  default: 1.0,
};

/**
 * Condition-based pricing multipliers
 * Adjust price based on product condition
 */
export const conditionMultiplier: Record<ProductCondition, number> = {
  EXCELLENT: 1.0,
  VERY_GOOD: 0.85,
  GOOD: 0.7,
  FAIR: 0.5,
  POOR: 0.3,
};

/**
 * Rarity-based pricing multipliers
 * Adjust price significantly based on rarity
 */
export const rarityMultiplier: Record<RarityLevel, number> = {
  COMMON: 0.8,
  UNCOMMON: 1.0,
  RARE: 1.5,
  VERY_RARE: 2.5,
  EXTREMELY_RARE: 4.0,
};

/**
 * Age-based appreciation multipliers
 * Vintage items appreciate over time
 */
export const getAgeMultiplier = (yearOrDecade: string): number => {
  const year = parseInt(yearOrDecade);
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;

  if (age < 0) return 1.0; // Invalid year
  if (age < 10) return 0.9; // Recent
  if (age < 25) return 1.0; // Contemporary
  if (age < 50) return 1.2; // Vintage
  if (age < 100) return 1.5; // Antique
  return 2.0; // Very old
};

/**
 * Historical year patterns - particularly valuable decades
 */
export const getDecadeBonus = (year: string): number => {
  const yearNum = parseInt(year);
  const decade = Math.floor(yearNum / 10) * 10;

  const highDemandDecades: Record<number, number> = {
    1920: 1.15, // Art Deco
    1930: 1.12, // Art Deco continuation
    1950: 1.1, // Mid-century modern
    1960: 1.15, // Space age / psychedelic
    1970: 1.08, // Retro/vintage
    1980: 1.05, // Emerging collectible
  };

  return highDemandDecades[decade] ?? 1.0;
};

/**
 * Confidence scoring factors
 * Higher values = more confident pricing
 */
export const confidenceFactors = {
  EXCELLENT_AI_CONFIDENCE: 25, // AI was 90%+ confident
  GOOD_AI_CONFIDENCE: 15,
  COMPARABLE_SALES_FOUND: 20, // Historical comps available
  MULTIPLE_COMPARABLE_SALES: 15, // Multiple data points increase confidence
  RECENT_MARKET_DATA: 20, // Data from last 30 days
  REASONABLE_RANGE: 10, // Price range is tight
  VERIFIED_CONDITION: 15, // Condition independently verified
  AUTHENTICATED: 20, // Item authenticated by expert
  RARE_ITEM_PENALTY: -20, // Very rare items harder to price
  LIMITED_COMPS_PENALTY: -15, // Few comparable sales
  TRENDING_UP: 10, // Market trending up
  TRENDING_DOWN: -10, // Market trending down
};

/**
 * Price range multipliers
 * Defines the confidence interval around the suggested price
 */
export const priceRangeMultipliers = {
  HIGH_CONFIDENCE: { low: 0.85, high: 1.15 }, // ±15%
  MEDIUM_CONFIDENCE: { low: 0.75, high: 1.25 }, // ±25%
  LOW_CONFIDENCE: { low: 0.65, high: 1.35 }, // ±35%
};

/**
 * Get price range multipliers based on overall confidence
 */
export const getPriceRangeByConfidence = (confidence: number) => {
  if (confidence >= 80) return priceRangeMultipliers.HIGH_CONFIDENCE;
  if (confidence >= 60) return priceRangeMultipliers.MEDIUM_CONFIDENCE;
  return priceRangeMultipliers.LOW_CONFIDENCE;
};

/**
 * Source weighting for final price calculation
 * AI (50%) + Historical (30%) + Market (20%)
 */
export const sourceWeights = {
  ai: 0.5,
  historical: 0.3,
  market: 0.2,
};

/**
 * Minimum and maximum multiplier boundaries
 * Prevents extreme outliers
 */
export const multiplierBoundaries = {
  MIN: 0.1, // Items worth at least 10% of base
  MAX: 10.0, // Items worth at most 10x the base
};

