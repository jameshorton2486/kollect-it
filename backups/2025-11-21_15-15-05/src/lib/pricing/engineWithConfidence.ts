/**
 * Intelligent Pricing Engine with Confidence Scoring
 * Phase 3 - Three-source pricing with confidence intervals
 */

import {
  PricingInput,
  PricingResult,
  ConfidenceFactor,
  ProductCondition,
  RarityLevel,
} from "./types";
import {
  categoryBaseMultiplier,
  conditionMultiplier,
  rarityMultiplier,
  getAgeMultiplier,
  getDecadeBonus,
  confidenceFactors,
  priceRangeMultipliers,
  sourceWeights,
  multiplierBoundaries,
} from "./rules";

/**
 * Calculate historical price from comparable sales
 */
function calculateHistoricalPrice(comps: number[] | undefined): {
  price: number;
  confidence: number;
  reasoning: string;
} {
  if (!comps || comps.length === 0) {
    return {
      price: 0,
      confidence: 0,
      reasoning: "No comparable sales data available",
    };
  }

  const sortedComps = comps.sort((a, b) => a - b);

  // Use median and quartile analysis
  const median = sortedComps[Math.floor(sortedComps.length / 2)];
  const q1 = sortedComps[Math.floor(sortedComps.length / 4)];
  const q3 = sortedComps[Math.floor((sortedComps.length * 3) / 4)];

  // Weight median higher for stability
  const historicalPrice = median * 0.5 + ((q1 + q3) / 2) * 0.5;

  // Confidence increases with number of comps and narrow range
  const range = q3 - q1;
  const rangeConfidence = Math.max(0, 100 - (range / median) * 100);
  const countConfidence = Math.min(100, comps.length * 15);

  const overallConfidence = (rangeConfidence + countConfidence) / 2;

  return {
    price: historicalPrice,
    confidence: Math.min(100, overallConfidence),
    reasoning: `Based on ${comps.length} comparable sales (median: $${median.toFixed(2)}, range: $${q1.toFixed(2)}-$${q3.toFixed(2)})`,
  };
}

/**
 * Calculate market price from trend data
 */
function calculateMarketPrice(
  marketData: PricingInput["marketTrendData"],
  categoryMultiplier: number,
): { price: number; confidence: number; reasoning: string } {
  if (!marketData) {
    return {
      price: 0,
      confidence: 0,
      reasoning: "No market trend data available",
    };
  }

  const trendMultiplier =
    marketData.trendDirection === "up"
      ? 1.1
      : marketData.trendDirection === "down"
        ? 0.9
        : 1.0;

  const marketPrice =
    marketData.averagePrice * trendMultiplier * categoryMultiplier;

  // Confidence based on price range tightness
  const range = marketData.priceRange[1] - marketData.priceRange[0];
  const rangePercent = (range / marketData.averagePrice) * 100;
  const confidence = Math.max(0, 100 - rangePercent);

  return {
    price: marketPrice,
    confidence: Math.min(100, confidence),
    reasoning: `Market average: $${marketData.averagePrice.toFixed(2)}, trend: ${marketData.trendDirection}, category multiplier: ${categoryMultiplier.toFixed(2)}x`,
  };
}

/**
 * Calculate AI-suggested price with multipliers
 */
function calculateAIPrice(
  baseAIPrice: number,
  category: string,
  condition: string,
  rarity: string,
  estimatedAge: string,
): { adjustedPrice: number; multipliers: Record<string, number> } {
  const multipliers: Record<string, number> = {};
  let totalMultiplier = 1.0;

  // Category multiplier
  const catMult =
    categoryBaseMultiplier[category] ?? categoryBaseMultiplier["default"];
  multipliers["category"] = catMult;
  totalMultiplier *= catMult;

  // Condition multiplier
  const condMult = conditionMultiplier[condition as ProductCondition] ?? 1.0;
  multipliers["condition"] = condMult;
  totalMultiplier *= condMult;

  // Rarity multiplier
  const rarityMult = rarityMultiplier[rarity as RarityLevel] ?? 1.0;
  multipliers["rarity"] = rarityMult;
  totalMultiplier *= rarityMult;

  // Age multiplier
  const ageMult = getAgeMultiplier(estimatedAge);
  multipliers["age"] = ageMult;
  totalMultiplier *= ageMult;

  // Decade bonus
  const decadeMult = getDecadeBonus(estimatedAge);
  multipliers["decade"] = decadeMult;
  totalMultiplier *= decadeMult;

  // Apply boundaries
  totalMultiplier = Math.max(
    multiplierBoundaries.MIN,
    Math.min(multiplierBoundaries.MAX, totalMultiplier),
  );

  return {
    adjustedPrice: baseAIPrice * totalMultiplier,
    multipliers,
  };
}

/**
 * Calculate confidence factors and adjustments
 */
function calculateConfidenceFactors(
  input: PricingInput,
  historicalPrice: number,
  marketPrice: number,
): ConfidenceFactor[] {
  const factors: ConfidenceFactor[] = [];

  // AI confidence
  if (input.aiConfidence >= 90) {
    factors.push({
      factor: "Excellent AI Confidence",
      impact: confidenceFactors.EXCELLENT_AI_CONFIDENCE,
      reasoning: `AI analysis was ${input.aiConfidence}% confident`,
    });
  } else if (input.aiConfidence >= 70) {
    factors.push({
      factor: "Good AI Confidence",
      impact: confidenceFactors.GOOD_AI_CONFIDENCE,
      reasoning: `AI analysis was ${input.aiConfidence}% confident`,
    });
  }

  // Historical comps
  if (input.historicalComps && input.historicalComps.length > 0) {
    factors.push({
      factor: "Comparable Sales Data",
      impact: confidenceFactors.COMPARABLE_SALES_FOUND,
      reasoning: `Found ${input.historicalComps.length} comparable sales`,
    });

    if (input.historicalComps.length >= 5) {
      factors.push({
        factor: "Multiple Comparable Sales",
        impact: confidenceFactors.MULTIPLE_COMPARABLE_SALES,
        reasoning: `${input.historicalComps.length} data points provide strong validation`,
      });
    }
  } else {
    factors.push({
      factor: "Limited Comparable Sales",
      impact: confidenceFactors.LIMITED_COMPS_PENALTY,
      reasoning: "Few or no comparable sales found for this item",
    });
  }

  // Rarity impact
  if (input.rarity === "EXTREMELY_RARE" || input.rarity === "VERY_RARE") {
    factors.push({
      factor: "Rare Item Pricing Challenge",
      impact: confidenceFactors.RARE_ITEM_PENALTY,
      reasoning: `${input.rarity} items are harder to price accurately`,
    });
  }

  // Market trend
  if (input.marketTrendData) {
    if (input.marketTrendData.trendDirection === "up") {
      factors.push({
        factor: "Trending Market",
        impact: confidenceFactors.TRENDING_UP,
        reasoning: "Market for this category is trending upward",
      });
    } else if (input.marketTrendData.trendDirection === "down") {
      factors.push({
        factor: "Declining Market",
        impact: confidenceFactors.TRENDING_DOWN,
        reasoning: "Market for this category is declining",
      });
    }
  }

  // Price agreement
  if (historicalPrice > 0 && marketPrice > 0) {
    const agreement =
      Math.abs(historicalPrice - marketPrice) /
      ((historicalPrice + marketPrice) / 2);
    if (agreement < 0.2) {
      factors.push({
        factor: "Strong Price Agreement",
        impact: confidenceFactors.REASONABLE_RANGE,
        reasoning: "Historical and market prices align well",
      });
    }
  }

  return factors;
}

/**
 * Main pricing engine function
 */
export async function calculatePriceWithConfidence(
  input: PricingInput,
): Promise<PricingResult> {
  // Step 1: Calculate AI price with multipliers
  const { adjustedPrice: aiPrice, multipliers } = calculateAIPrice(
    input.aiPrice,
    input.category,
    input.condition,
    input.rarity,
    input.estimatedAge,
  );

  // Step 2: Calculate historical price
  const historicalPricing = calculateHistoricalPrice(input.historicalComps);

  // Step 3: Calculate market price
  const categoryMultiplier =
    categoryBaseMultiplier[input.category] ?? categoryBaseMultiplier["default"];
  const marketPricing = calculateMarketPrice(
    input.marketTrendData,
    categoryMultiplier,
  );

  // Step 4: Calculate confidence factors
  const confidenceFactorsList = calculateConfidenceFactors(
    input,
    historicalPricing.price,
    marketPricing.price,
  );

  // Step 5: Blend prices with weights
  let weightedPrice = aiPrice * sourceWeights.ai;
  let totalWeight = sourceWeights.ai;
  let baseConfidence = input.aiConfidence;

  if (historicalPricing.price > 0) {
    weightedPrice += historicalPricing.price * sourceWeights.historical;
    totalWeight += sourceWeights.historical;
    baseConfidence = (baseConfidence + historicalPricing.confidence) / 2;
  }

  if (marketPricing.price > 0) {
    weightedPrice += marketPricing.price * sourceWeights.market;
    totalWeight += sourceWeights.market;
    baseConfidence = (baseConfidence + marketPricing.confidence) / 2;
  }

  const suggestedPrice = weightedPrice / totalWeight;

  // Step 6: Adjust confidence based on factors
  let confidenceAdjustment = 0;
  confidenceFactorsList.forEach((factor) => {
    confidenceAdjustment += factor.impact;
  });

  let finalConfidence = Math.max(
    0,
    Math.min(100, baseConfidence + confidenceAdjustment),
  );

  // Step 7: Calculate price range
  const multiplier =
    finalConfidence >= 80
      ? priceRangeMultipliers.HIGH_CONFIDENCE
      : finalConfidence >= 60
        ? priceRangeMultipliers.MEDIUM_CONFIDENCE
        : priceRangeMultipliers.LOW_CONFIDENCE;

  const lowRange = suggestedPrice * multiplier.low;
  const highRange = suggestedPrice * multiplier.high;

  // Step 8: Build result
  const result: PricingResult = {
    suggestedPrice: Math.round(suggestedPrice * 100) / 100,
    lowRange: Math.round(lowRange * 100) / 100,
    highRange: Math.round(highRange * 100) / 100,
    confidence: Math.round(finalConfidence),
    breakdown: {
      aiPrice: {
        price: Math.round(aiPrice * 100) / 100,
        confidence: input.aiConfidence,
        reasoning: `AI base price: $${input.aiPrice.toFixed(2)}, multipliers applied: category (${multipliers["category"]?.toFixed(2)}x), condition (${multipliers["condition"]?.toFixed(2)}x), rarity (${multipliers["rarity"]?.toFixed(2)}x), age (${multipliers["age"]?.toFixed(2)}x)`,
      },
      historicalPrice:
        historicalPricing.price > 0
          ? {
              price: historicalPricing.price,
              confidence: historicalPricing.confidence,
              reasoning: historicalPricing.reasoning,
            }
          : undefined,
      marketPrice:
        marketPricing.price > 0
          ? {
              price: marketPricing.price,
              confidence: marketPricing.confidence,
              reasoning: marketPricing.reasoning,
            }
          : undefined,
    },
    sources: [
      {
        name: "ai",
        price: aiPrice,
        confidence: input.aiConfidence,
        weight: sourceWeights.ai * 100,
        reasoning:
          "AI-generated price with category, condition, and rarity adjustments",
      },
      ...(historicalPricing.price > 0
        ? [
            {
              name: "historical" as const,
              price: historicalPricing.price,
              confidence: historicalPricing.confidence,
              weight: sourceWeights.historical * 100,
              reasoning: historicalPricing.reasoning,
            },
          ]
        : []),
      ...(marketPricing.price > 0
        ? [
            {
              name: "market" as const,
              price: marketPricing.price,
              confidence: marketPricing.confidence,
              weight: sourceWeights.market * 100,
              reasoning: marketPricing.reasoning,
            },
          ]
        : []),
    ],
    timestamp: new Date(),
  };

  return result;
}

/**
 * Simpler function for quick pricing without all details
 */
export function calculateSimplePrice(
  basePrice: number,
  category: string,
  condition: string,
  rarity: string,
  estimatedAge: string,
): number {
  const categoryMult = categoryBaseMultiplier[category] ?? 1.0;
  const conditionMult =
    conditionMultiplier[condition as ProductCondition] ?? 1.0;
  const rarityMult = rarityMultiplier[rarity as RarityLevel] ?? 1.0;
  const ageMult = getAgeMultiplier(estimatedAge);
  const decadeMult = getDecadeBonus(estimatedAge);

  let totalMult =
    categoryMult * conditionMult * rarityMult * ageMult * decadeMult;
  totalMult = Math.max(
    multiplierBoundaries.MIN,
    Math.min(multiplierBoundaries.MAX, totalMult),
  );

  return Math.round(basePrice * totalMult * 100) / 100;
}

