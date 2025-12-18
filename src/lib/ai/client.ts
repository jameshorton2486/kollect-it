/**
 * Shared AI Client Helper
 * 
 * Provides safe, lazy-loaded AI clients that prevent build-time execution.
 * All AI SDK clients must be created through these helpers to ensure:
 * - No module-scope instantiation (prevents build failures)
 * - Graceful handling of missing API keys
 * - Cached instances for performance
 */

import type OpenAI from "openai";
import type Anthropic from "@anthropic-ai/sdk";

/**
 * Cached OpenAI client (lazy-loaded, never at module scope)
 */
let cachedOpenAIClient: OpenAI | null = null;

/**
 * Cached Anthropic client (lazy-loaded, never at module scope)
 */
let cachedAnthropicClient: Anthropic | null = null;

/**
 * Get OpenAI client instance
 * 
 * @throws Error if OPENAI_API_KEY is not configured
 * @returns OpenAI client instance
 */
export async function getOpenAIClient(): Promise<OpenAI> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  if (cachedOpenAIClient) {
    return cachedOpenAIClient;
  }

  // Dynamic import to prevent execution during build
  const OpenAI = (await import("openai")).default;

  cachedOpenAIClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  return cachedOpenAIClient;
}

/**
 * Get Anthropic client instance
 * 
 * @throws Error if ANTHROPIC_API_KEY is not configured
 * @returns Anthropic client instance
 */
export async function getAnthropicClient(): Promise<Anthropic> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  if (cachedAnthropicClient) {
    return cachedAnthropicClient;
  }

  // Dynamic import to prevent execution during build
  const Anthropic = (await import("@anthropic-ai/sdk")).default;

  cachedAnthropicClient = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  return cachedAnthropicClient;
}

/**
 * Check if OpenAI is configured (for diagnostics)
 */
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

/**
 * Check if Anthropic is configured (for diagnostics)
 */
export function isAnthropicConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}
