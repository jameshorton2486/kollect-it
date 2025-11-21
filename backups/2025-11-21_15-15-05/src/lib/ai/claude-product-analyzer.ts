import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

/**
 * Analyze a product image using Claude AI
 * Returns structured product metadata for marketplace
 */
export async function analyzeProductImageWithClaude(
  imageUrl: string,
  category: string,
  notes?: string,
) {
  console.log(`[Claude] Analyzing ${category} item from: ${imageUrl}`);
  if (notes) console.log(`[Claude] User provided notes: ${notes.substring(0, 50)}...`);

  const systemPrompt = `You are an expert luxury collectibles appraiser and marketplace specialist. Your task is to analyze product images and generate professional marketplace listings for a luxury collectibles platform (Kollect-It).

Key responsibilities:
1. Analyze items with expertise in their historical, cultural, and market value
2. Provide accurate metadata: era, rarity, condition, authenticity
3. Write compelling descriptions that appeal to serious collectors and investors
4. Suggest realistic pricing based on condition, rarity, and market trends
5. Generate SEO-optimized titles and descriptions
6. Identify investment potential

IMPORTANT: Return ONLY valid JSON. Do not include markdown, backticks, or any explanation text.`;

  const userPrompt = `Analyze this ${category} item for a luxury marketplace. You must return ONLY a valid JSON object (no markdown, no code blocks, no explanation).

${category} Context:
- Antique Books: Focus on edition, condition, binding, rarity, author, publication date
- Fine Art: Focus on artist, period, medium, condition, style, provenance
- Collectibles: Focus on rarity, condition, original packaging, year, manufacturer
- Militaria: Focus on era, authenticity, condition, historical significance, provenance

${notes ? `\nSeller's Notes:\n${notes}\n\nIncorporate these details into your analysis where relevant.` : ""}

Return ONLY this JSON structure (all fields required):
{
  "title": "Professional marketplace title that would appear in search (5-10 words, no quotes in JSON)",
  "description": "300-400 words - detailed description for buyers. Include condition assessment, historical context, what makes it valuable, and who might be interested. Write in professional but accessible language for collectors.",
  "shortDescription": "50-75 words - summary for product cards and search results",
  "estimatedEra": "Time period using standard format (e.g., 'Late 19th Century', '1920s', '18th Century')",
  "rarity": "One of: Common, Uncommon, Rare, Very Rare, Extremely Rare",
  "authenticity": "One of: Believed authentic, Attributed, School of, Possibly reproduction",
  "investmentPotential": "2-3 sentence assessment of investment value and market trends",
  "historicalContext": "2-3 sentences explaining historical significance and why collectors value this",
  "suggestedPrice": 0.00,
  "priceReasoning": "2-3 sentences explaining the price based on condition, rarity, market data, and comparable sales",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "seoTitle": "SEO-optimized title exactly 50-60 characters, no special chars",
  "seoDescription": "SEO description exactly 150-160 characters, compelling for search results"
}`;

  try {
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "url",
                url: imageUrl,
              },
            },
            {
              type: "text",
              text: userPrompt,
            },
          ],
        },
      ],
    });

    // Extract text response
    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Claude did not return text response");
    }

    console.log("[Claude] Received response, parsing JSON...");

    // Parse JSON carefully
    let analysis;
    try {
      // Try direct parse first
      analysis = JSON.parse(content.text);
    } catch (e) {
      // If it fails, try to extract JSON from markdown code blocks
      const jsonMatch = content.text.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[1]);
      } else {
        // Last resort: try to find JSON object in response
        const objectMatch = content.text.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          analysis = JSON.parse(objectMatch[0]);
        } else {
          throw new Error("Could not extract JSON from Claude response");
        }
      }
    }

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "shortDescription",
      "estimatedEra",
      "rarity",
      "authenticity",
      "suggestedPrice",
      "keywords",
      "seoTitle",
      "seoDescription",
    ];

    for (const field of requiredFields) {
      if (!analysis[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    console.log(`[Claude] Analysis complete: "${analysis.title}"`);
    return analysis;
  } catch (error) {
    console.error("[Claude] Analysis failed:", error);
    throw new Error(
      `Claude analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

