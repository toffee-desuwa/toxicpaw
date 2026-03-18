/**
 * F006 - Analysis Result Display
 *
 * Pre-implementation thinking:
 * 1. What: Beautiful mobile UI showing grade badge, ingredient list with flags, and verdict.
 * 2. Design decisions:
 *    - Grade badge at top for immediate emotional impact (fear-driven UX)
 *    - Verdict below grade for quick understanding before scrolling
 *    - Summary bar shows counts at a glance, then detailed ingredient list below
 * 3. Risks: Long ingredient lists on small screens — solved with scrollable list
 * 4. Simplest: Compose GradeBadge + SummaryBar + IngredientList vertically
 * 5. Acceptance: renders grade, all ingredients with correct flags, verdict text
 */

import type { AnalysisResult } from "@/lib/analyzer/types";
import { GradeBadge } from "@/components/grade";
import { IngredientList } from "./IngredientList";
import { SummaryBar } from "./SummaryBar";

interface AnalysisViewProps {
  result: AnalysisResult;
  onScanAnother: () => void;
}

export function AnalysisView({ result, onScanAnother }: AnalysisViewProps) {
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
