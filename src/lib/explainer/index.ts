/**
 * F007 - AI Explanation Generator
 *
 * Uses Claude API to generate plain-language explanations of ingredient analysis.
 * Includes an in-memory cache keyed by sorted ingredient names to reduce API costs.
 */

import Anthropic from "@anthropic-ai/sdk";
import type { ExplainRequest, ExplainResponse } from "./types";

/** Cache: sorted ingredient key -> explanation text */
const explanationCache = new Map<string, string>();

/** Build a deterministic cache key from ingredients */
export function buildCacheKey(ingredients: ExplainRequest["ingredients"]): string {
  return ingredients
    .map((i) => `${i.name}:${i.flag}`)
    .sort()
    .join("|");
}

/** Build the prompt for Claude */
export function buildPrompt(request: ExplainRequest): string {
  const redItems = request.ingredients.filter((i) => i.flag === "red");
  const yellowItems = request.ingredients.filter((i) => i.flag === "yellow");
  const greenItems = request.ingredients.filter((i) => i.flag === "green");

  let ingredientSummary = "";
  if (redItems.length > 0) {
    ingredientSummary += `Flagged ingredients: ${redItems.map((i) => `${i.name} (${i.explanation})`).join(", ")}. `;
  }
  if (yellowItems.length > 0) {
    ingredientSummary += `Ingredients flagged for review: ${yellowItems.map((i) => i.name).join(", ")}. `;
  }
  if (greenItems.length > 0) {
    ingredientSummary += `Safe ingredients: ${greenItems.map((i) => i.name).join(", ")}. `;
  }

  return `You are a pet nutrition analyst explaining an algorithmic pet food ingredient analysis. This is not veterinary advice.

The food received an algorithmic grade of ${request.grade} (score: ${request.score}/100).
- ${request.summary.harmfulCount} flagged, ${request.summary.cautionCount} for review, ${request.summary.safeCount} safe, ${request.summary.unknownCount} unknown ingredients
- First ingredient is quality protein: ${request.summary.topIngredientIsProtein ? "yes" : "no"}

${ingredientSummary}

Write exactly 2-3 sentences in plain language explaining why our algorithm assigned this grade. Frame findings as algorithmic observations, not definitive safety judgments. Recommend consulting a veterinarian for personalized dietary advice. Use a warm but informative tone. Do not use markdown formatting.`;
}

/**
 * Generate an AI explanation for the given analysis.
 * Returns cached result if available.
 * Throws if ANTHROPIC_API_KEY is not set.
 */
export async function generateExplanation(
  request: ExplainRequest
): Promise<ExplainResponse> {
  const cacheKey = buildCacheKey(request.ingredients);

  // Check cache first
  const cached = explanationCache.get(cacheKey);
  if (cached) {
    return { explanation: cached, cached: true };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }

  const client = new Anthropic({ apiKey });
  const prompt = buildPrompt(request);

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 256,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  const explanation = textBlock ? textBlock.text.trim() : "";

  if (explanation) {
    explanationCache.set(cacheKey, explanation);
  }

  return { explanation, cached: false };
}

/** Clear the explanation cache (for testing) */
export function clearCache(): void {
  explanationCache.clear();
}

/** Get current cache size (for testing) */
export function getCacheSize(): number {
  return explanationCache.size;
}

export type { ExplainRequest, ExplainResponse, ExplainIngredient } from "./types";
