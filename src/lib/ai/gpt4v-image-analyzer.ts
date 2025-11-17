import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyze image quality using GPT-4V
 * Returns assessment of photo quality for marketplace listings
 */
export async function analyzeImageQualityWithGPT4V(imageUrl: string) {
  console.log("[GPT-4V] Analyzing image quality...");

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4-vision-preview",
      max_tokens: 1000,
      temperature: 0.5,
      messages: [
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
              text: `Analyze this product image for marketplace quality. Return ONLY valid JSON (no markdown):
{
  "imageQuality": 1-10 scale,
  "hasDefects": true/false,
  "defectDescription": "description of any visible damage or issues",
  "photographyNotes": "assessment of photo quality, lighting, focus, composition",
  "suggestedImprovements": ["improvement1", "improvement2"]
}

Focus on:
- Image sharpness and focus
- Lighting quality
- Background clarity
- Color accuracy
- Visible damage/wear on item
- Overall marketplace suitability`,
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

    let analysis;
    try {
      // Try to extract JSON from content
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (e) {
      console.error("[GPT-4V] Parse error:", e);
      // Return default if parsing fails
      analysis = {
        imageQuality: 7,
        hasDefects: false,
        defectDescription: "Unable to analyze",
        photographyNotes: "Standard quality image",
        suggestedImprovements: [],
      };
    }

    console.log(
      `[GPT-4V] Quality analysis complete: ${analysis.imageQuality}/10`,
    );
    return analysis;
  } catch (error) {
    console.error("[GPT-4V] Analysis failed:", error);
    throw new Error(
      `Image quality analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

