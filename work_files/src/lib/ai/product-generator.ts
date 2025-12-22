/**
 * PRODUCTION VERSION: Product Generator
 * 
 * Orchestrates both AI services with production prompts
 * Replaces: product-generator.ts
 */

import { analyzeProductImageWithClaude } from "./claude-product-analyzer";
import { analyzeImageQualityWithGPT4V } from "./gpt4v-image-analyzer";
import type { ProductAnalysisSchema } from "./prompts/schemas/product-analysis.schema";
import type { ImageQualitySchema } from "./prompts/schemas/image-quality.schema";

/**
 * Combined analysis result
 */
export interface CombinedProductAnalysis
  extends ProductAnalysisSchema,
    Pick<ImageQualitySchema, "imageQuality" | "hasDefects" | "photographyNotes" | "suggestedImprovements"> {
  defectDescription?: string;
}

/**
 * Master function: orchestrates both AI services for complete product analysis
 * Production version with deterministic prompts and strict validation
 */
export async function generateProductAnalysis(
  imageUrl: string,
  category: string,
  notes?: string,
): Promise<CombinedProductAnalysis> {
  console.log(`\n📦 Starting product analysis (Production)...`);
  console.log(`   Category: ${category}`);
  if (notes) {
    console.log(`   User Notes: ${notes.substring(0, 50)}...`);
  }
  console.log(`   Image: ${imageUrl.substring(0, 50)}...`);

  try {
    // Run both AI analyses in parallel for speed
    console.log("\n🤖 Running AI analysis (Claude + GPT-4V in parallel)...");
    const [claudeAnalysis, gpt4vAnalysis] = await Promise.all([
      analyzeProductImageWithClaude(imageUrl, category, notes),
      analyzeImageQualityWithGPT4V(imageUrl),
    ]);

    // Combine results
    const combined: CombinedProductAnalysis = {
      ...claudeAnalysis,
      imageQuality: gpt4vAnalysis.imageQuality,
      hasDefects: gpt4vAnalysis.hasDefects,
      defectDescription: gpt4vAnalysis.defectDescription,
      photographyNotes: gpt4vAnalysis.photographyNotes,
      suggestedImprovements: gpt4vAnalysis.suggestedImprovements,
    };

    console.log(`\n✅ Analysis complete!`);
    console.log(`   Title: "${combined.title}"`);
    console.log(`   Suggested Price: $${combined.suggestedPrice}`);
    console.log(`   Image Quality: ${combined.imageQuality}/10`);
    console.log(`   Rarity: ${combined.rarity}`);

    return combined;
  } catch (error) {
    console.error("\n❌ Analysis failed:", error);
    throw error;
  }
}

