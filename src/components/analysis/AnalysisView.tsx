/**
 * F006 - Analysis Result Display (updated F007 - AI explanation integration)
 *
 * Shows grade badge, verdict, AI explanation, summary bar, and ingredient list.
 * The AI explanation is fetched async after mount; the static verdict shows immediately.
 */

"use client";

import { useState, useEffect } from "react";
import type { AnalysisResult } from "@/lib/analyzer/types";
import type { ExplainRequest, ExplainIngredient } from "@/lib/explainer/types";
import { GradeBadge } from "@/components/grade";
import { IngredientList } from "./IngredientList";
import { SummaryBar } from "./SummaryBar";

interface AnalysisViewProps {
  result: AnalysisResult;
  onScanAnother: () => void;
}

/** Build the request payload for /api/explain */
function buildExplainPayload(result: AnalysisResult): ExplainRequest {
  const ingredients: ExplainIngredient[] = result.ingredients.map((i) => ({
    name: i.original,
    flag: i.flag,
    explanation: i.explanation,
  }));

  return {
    grade: result.grade,
    score: result.score,
    ingredients,
    summary: {
      harmfulCount: result.summary.harmfulCount,
      cautionCount: result.summary.cautionCount,
      safeCount: result.summary.safeCount,
      unknownCount: result.summary.unknownCount,
      topIngredientIsProtein: result.summary.topIngredientIsProtein,
    },
  };
}

export function AnalysisView({ result, onScanAnother }: AnalysisViewProps) {
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchExplanation(): Promise<void> {
      try {
        const payload = buildExplainPayload(result);
        const response = await fetch("/api/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          setAiLoading(false);
          return;
        }

        const data = (await response.json()) as { explanation: string };
        if (!cancelled && data.explanation) {
          setAiExplanation(data.explanation);
        }
      } catch {
        // Silently fail — static verdict is always visible
      } finally {
        if (!cancelled) {
          setAiLoading(false);
        }
      }
    }

    fetchExplanation();

    return () => {
      cancelled = true;
    };
  }, [result]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-8">
      {/* Grade Badge */}
      <GradeBadge grade={result.grade} score={result.score} />

      {/* Verdict */}
      <p
        className="text-center text-base text-neutral-300"
        data-testid="verdict"
      >
        {result.verdict}
      </p>

      {/* AI Explanation */}
      {aiLoading && (
        <p
          className="text-center text-sm text-neutral-500 italic"
          data-testid="ai-loading"
        >
          Generating detailed analysis…
        </p>
      )}
      {!aiLoading && aiExplanation && (
        <div
          className="rounded-xl bg-neutral-800/50 px-4 py-3"
          data-testid="ai-explanation"
        >
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-neutral-500">
            AI Analysis
          </p>
          <p className="text-sm leading-relaxed text-neutral-300">
            {aiExplanation}
          </p>
        </div>
      )}

      {/* Profile Warnings */}
      {result.profileWarnings && result.profileWarnings.length > 0 && (
        <div
          className="rounded-xl bg-amber-900/30 border border-amber-700/50 px-4 py-3"
          data-testid="profile-warnings"
        >
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-amber-400">
            Personalized Alerts
          </p>
          <ul className="space-y-1">
            {result.profileWarnings.map((warning, idx) => (
              <li
                key={idx}
                className="text-sm leading-relaxed text-amber-200"
              >
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary Stats */}
      <SummaryBar summary={result.summary} />

      {/* Ingredient List */}
      <IngredientList ingredients={result.ingredients} />

      {/* Actions */}
      <button
        type="button"
        onClick={onScanAnother}
        className="mt-2 w-full rounded-full bg-neutral-700 px-8 py-3 font-medium text-white transition-colors hover:bg-neutral-600 active:scale-95"
      >
        Scan Another
      </button>
    </div>
  );
}
