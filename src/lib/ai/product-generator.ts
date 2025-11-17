import { analyzeProductImageWithClaude } from "./claude-product-analyzer";
import { analyzeImageQualityWithGPT4V } from "./gpt4v-image-analyzer";

/**
 * Master function: orchestrates both AI services for complete product analysis
 */
export async function generateProductAnalysis(
  imageUrl: string,
  category: string,
) {
  console.log(`\n📦 Starting product analysis...`);
  console.log(`   Category: ${category}`);
  console.log(`   Image: ${imageUrl.substring(0, 50)}...`);

  try {
    // Run both AI analyses in parallel for speed
    console.log("\n🤖 Running AI analysis (Claude + GPT-4V in parallel)...");
    const [claudeAnalysis, gpt4vAnalysis] = await Promise.all([
      analyzeProductImageWithClaude(imageUrl, category),
      analyzeImageQualityWithGPT4V(imageUrl),
    ]);

    // Combine results
    const combined = {
      ...claudeAnalysis,
      imageQuality: gpt4vAnalysis.imageQuality,
      hasImageDefects: gpt4vAnalysis.hasDefects,
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

