/**
 * F007 - AI Explanation Generation Types
 *
 * Pre-implementation thinking:
 * 1. What: Claude API generates 2-3 sentence plain-language explanation of why
 *    food is good/bad, tailored for non-expert pet owners. Cached per ingredient combo.
 * 2. Key design decisions:
 *    - Server-side only (API key stays secret) via Next.js route handler
 *    - In-memory cache keyed by sorted ingredient names hash (simple, effective)
 *    - Graceful degradation: if API unavailable, fall back to existing verdict
 * 3. Risks: API key missing, rate limits, slow responses, malformed output
 * 4. Simplest: POST /api/explain with analysis summary, return 2-3 sentences
 * 5. Acceptance: generates specific explanation referencing actual ingredients,
 *    caches duplicate requests, degrades gracefully without API key
 */

import type { Grade } from "../analyzer/types";

/** Request payload sent to /api/explain */
export interface ExplainRequest {
  grade: Grade;
  score: number;
  ingredients: ExplainIngredient[];
  summary: {
    harmfulCount: number;
    cautionCount: number;
    safeCount: number;
    unknownCount: number;
    topIngredientIsProtein: boolean;
  };
}

/** Simplified ingredient info for the prompt */
export interface ExplainIngredient {
  name: string;
  flag: "red" | "yellow" | "green" | "unknown";
  explanation: string;
}

/** Response from /api/explain */
export interface ExplainResponse {
  explanation: string;
  cached: boolean;
}
