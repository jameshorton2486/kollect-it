/**
 * PRODUCTION VERSION: GPT-4V Image Quality Analyzer
 * 
 * Uses deterministic prompts with strict schemas
 * Replaces: gpt4v-image-analyzer.ts
 */

import {
  IMAGE_QUALITY_SYSTEM_PROMPT,
  IMAGE_QUALITY_USER_PROMPT,
  IMAGE_QUALITY_CONFIG,
} from "./prompts/gpt4v/image-quality.prompt";
import {
  validateImageQuality,
  type ImageQualitySchema,
} from "./prompts/schemas/image-quality.schema";
import { getOpenAIClient } from "./client";

/**
 * Analyze image quality using GPT-4V (Production Version)
 * Returns validated image quality assessment
 * 
 * Note: OpenAI client is lazy-loaded inside the function to prevent
 * execution during Next.js build time (which doesn't have API keys)
 */
export async function analyzeImageQualityWithGPT4V(
  imageUrl: string,
): Promise<ImageQualitySchema> {
  console.log("[GPT-4V] Analyzing image quality...");

  // Lazy-load OpenAI to prevent execution during build
  if (!process.env.OPENAI_API_KEY) {
    console.warn("[GPT-4V] OPENAI_API_KEY not configured, using fallback");
    return {
      imageQuality: 7,
      hasDefects: false,
      defectDescription: "OpenAI not configured - using default values",
      photographyNotes: "OpenAI API key missing - standard quality assumed",
      suggestedImprovements: [],
    };
  }

  try {
    // Use shared client helper (lazy-loaded, safe for build)
    const client = await getOpenAIClient();

    const response = await client.chat.completions.create({
      model: IMAGE_QUALITY_CONFIG.model,
      max_tokens: IMAGE_QUALITY_CONFIG.maxTokens,
      temperature: IMAGE_QUALITY_CONFIG.temperature,
      messages: [
        {
          role: "system",
          content: IMAGE_QUALITY_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high",
              },
            },
            {
              type: "text",
              text: IMAGE_QUALITY_USER_PROMPT,
            },
          ],
        },
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from GPT-4V");
    }

    console.log("[GPT-4V] Received response, parsing...");

    // Parse JSON with fallback strategies
    let analysis: unknown;
    try {
      // Strategy 1: Direct parse
      analysis = JSON.parse(content);
    } catch (e) {
      // Strategy 2: Extract from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[1]);
      } else {
        // Strategy 3: Find JSON object in response
        const objectMatch = content.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          analysis = JSON.parse(objectMatch[0]);
        } else {
          throw new Error(
            "Could not extract JSON from GPT-4V response. Response: " +
              content.substring(0, 200),
          );
        }
      }
    }

    // Validate against strict schema (throws if invalid)
    validateImageQuality(analysis);

    console.log(
      `[GPT-4V] Quality analysis complete: ${analysis.imageQuality}/10`,
    );
    return analysis;
  } catch (error) {
    console.error("[GPT-4V] Analysis failed:", error);

    // Return safe defaults on failure (non-blocking)
    const fallback: ImageQualitySchema = {
      imageQuality: 7,
      hasDefects: false,
      defectDescription: "Unable to analyze - using default values",
      photographyNotes: "Analysis failed - standard quality assumed",
      suggestedImprovements: [],
    };

    console.warn("[GPT-4V] Using fallback values due to error");
    return fallback;
  }
}

