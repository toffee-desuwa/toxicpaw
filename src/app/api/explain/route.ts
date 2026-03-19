/**
 * F007 - AI Explanation API Route
 *
 * POST /api/explain
 * Accepts analysis summary, returns AI-generated plain-language explanation.
 * Falls back to empty explanation if API key is missing (client uses existing verdict).
 */

import { NextResponse } from "next/server";
import { generateExplanation } from "@/lib/explainer";
import type { ExplainRequest } from "@/lib/explainer/types";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as ExplainRequest;

    // Basic validation
    if (!body.grade || !body.ingredients || !Array.isArray(body.ingredients)) {
      return NextResponse.json(
        { error: "Invalid request: grade and ingredients are required" },
        { status: 400 }
      );
    }

    const result = await generateExplanation(body);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    // If API key is missing, return graceful fallback
    if (message.includes("ANTHROPIC_API_KEY")) {
      return NextResponse.json(
        { explanation: "", cached: false, fallback: true },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: `Explanation generation failed: ${message}` },
      { status: 500 }
    );
  }
}
