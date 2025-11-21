/**
 * Pricing Engine Type Definitions
 * Phase 3 - AI-Powered Product Pricing
 */

export interface PricingSource {
  name: "ai" | "historical" | "market";
  price: number;
  confidence: number; // 0-100
  weight: number; // 0-100
  reasoning?: string;
}

export interface PricingBreakdown {
  aiPrice: {
    price: number;
    confidence: number;
    reasoning: string;
  };
  historicalPrice?: {
    price: number;
    confidence: number;
    reasoning: string;
  };
  marketPrice?: {
    price: number;
    confidence: number;
    reasoning: string;
  };
}

export interface PricingResult {
  suggestedPrice: number;
  lowRange: number;
  highRange: number;
  confidence: number; // 0-100, overall confidence
  breakdown: PricingBreakdown;
  sources: PricingSource[];
  timestamp: Date;
}

export interface PricingInput {
  productTitle: string;
  category: string;
  condition: string;
  rarity: string;
  estimatedAge: string;
  aiPrice: number;
  aiConfidence: number;
  historicalComps?: number[];
  marketTrendData?: {
    averagePrice: number;
    priceRange: [number, number];
    trendDirection: "up" | "down" | "stable";
  };
}

export interface ConfidenceFactor {
  factor: string;
  impact: number; // -20 to +20
  reasoning: string;
}

export type ProductCondition =
  | "EXCELLENT"
  | "VERY_GOOD"
  | "GOOD"
  | "FAIR"
  | "POOR";
export type RarityLevel =
  | "COMMON"
  | "UNCOMMON"
  | "RARE"
  | "VERY_RARE"
  | "EXTREMELY_RARE";

