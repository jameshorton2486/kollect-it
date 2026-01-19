/**
 * PRODUCTION VERSION: Claude Product Analyzer
 * 
 * Uses deterministic prompts with strict schemas
 * Replaces: claude-product-analyzer.ts
 */

import {
  PRODUCT_ANALYSIS_SYSTEM_PROMPT,
  buildProductAnalysisUserPrompt,
  PRODUCT_ANALYSIS_CONFIG,
  type ProductAnalysisPromptInput,
} from "./prompts/claude/product-analysis.prompt";
import {
  validateProductAnalysis,
  type ProductAnalysisSchema,
} from "./prompts/schemas/product-analysis.schema";
import { getAnthropicClient } from "./client";

/**
 * Analyze a product image using Claude AI (Production Version)
 * Returns structured product metadata validated against strict schema
 * 
 * Note: Anthropic client is lazy-loaded inside the function to prevent
 * execution during Next.js build time (which doesn't have API keys)
 */
export async function analyzeProductImageWithClaude(
  imageUrl: string,
  category: string,
  notes?: string,
): Promise<ProductAnalysisSchema> {
  console.log(`[Claude] Analyzing ${category} item from: ${imageUrl}`);
  if (notes) {
    console.log(`[Claude] User provided notes: ${notes.substring(0, 50)}...`);
  }

  const input: ProductAnalysisPromptInput = {
    imageUrl,
    category,
    notes,
  };

  const userPrompt = buildProductAnalysisUserPrompt(input);

  try {
    // Lazy-load Anthropic client to prevent execution during build
    const client = await getAnthropicClient();
    
    const response = await client.messages.create({
      model: PRODUCT_ANALYSIS_CONFIG.model,
      max_tokens: PRODUCT_ANALYSIS_CONFIG.maxTokens,
      temperature: PRODUCT_ANALYSIS_CONFIG.temperature,
      system: PRODUCT_ANALYSIS_SYSTEM_PROMPT,
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
    if (!content || content.type !== "text") {
      throw new Error("Claude did not return text response");
    }

    if (!("text" in content)) {
      throw new Error("Claude response content does not contain text");
    }

    console.log("[Claude] Received response, parsing JSON...");

    // Parse JSON with multiple fallback strategies
    let analysis: unknown;
    try {
      // Strategy 1: Direct parse
      analysis = JSON.parse(content.text);
    } catch (e) {
      // Strategy 2: Extract from markdown code blocks
      const jsonMatch = content.text.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[1]);
      } else {
        // Strategy 3: Find JSON object in response
        const objectMatch = content.text.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          analysis = JSON.parse(objectMatch[0]);
        } else {
          throw new Error(
            "Could not extract JSON from Claude response. Response: " +
              content.text.substring(0, 200),
          );
        }
      }
    }

    // Validate against strict schema (throws if invalid)
    validateProductAnalysis(analysis);

    console.log(`[Claude] Analysis complete: "${analysis.title}"`);
    return analysis;
  } catch (error) {
    console.error("[Claude] Analysis failed:", error);

    // Provide detailed error context
    if (error instanceof Error) {
      throw new Error(`Claude analysis failed: ${error.message}`);
    }
    throw new Error(
      `Claude analysis failed: ${typeof error === "string" ? error : "Unknown error"}`,
    );
  }
}

