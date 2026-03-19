/**
 * F010 - Social Sharing Card
 *
 * PRE-IMPLEMENTATION THINKING:
 * 1. What: A visually striking card that renders grade + food name + key findings,
 *    designed to be captured as an image via html2canvas for sharing.
 * 2. Decisions:
 *    - Use DOM-based rendering (not canvas drawing) so we can reuse Tailwind styles
 *    - Card is 375px wide (mobile screenshot width) with dark theme
 *    - Show: grade circle, score, food name, verdict, top harmful/safe counts
 * 3. Edge cases: Long food names, no harmful ingredients, all unknown ingredients
 * 4. Simplest: A styled div with ref for html2canvas capture
 * 5. Tests: Renders grade, food name, verdict, stats; ref is forwarded
 */

import { forwardRef } from "react";
import type { AnalysisResult } from "@/lib/analyzer/types";
import type { Grade } from "@/lib/analyzer/types";

const GRADE_COLORS: Record<Grade, string> = {
  A: "bg-emerald-500",
  B: "bg-lime-500",
  C: "bg-amber-500",
  D: "bg-orange-500",
  F: "bg-red-600",
};

const GRADE_LABELS: Record<Grade, string> = {
  A: "Excellent",
  B: "Good",
  C: "Average",
  D: "Below Average",
  F: "Poor",
};

interface ShareCardProps {
  result: AnalysisResult;
  foodName?: string;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  function ShareCard({ result, foodName }, ref) {
    const harmfulIngredients = result.ingredients
      .filter((i) => i.flag === "red")
      .slice(0, 3)
      .map((i) => i.original);

    const safeIngredients = result.ingredients
      .filter((i) => i.flag === "green")
      .slice(0, 3)
      .map((i) => i.original);

    return (
      <div
        ref={ref}
        data-testid="share-card"
        className="w-[375px] bg-neutral-900 p-6"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-lg font-bold text-red-500">ToxicPaw</p>
          <p className="text-xs text-neutral-500">Pet Food Scanner</p>
        </div>

        {/* Food Name */}
        {foodName && (
          <p
            className="mb-4 truncate text-center text-base font-semibold text-neutral-200"
            data-testid="share-food-name"
          >
            {foodName}
          </p>
        )}

        {/* Grade Circle + Score */}
        <div className="mb-4 flex flex-col items-center gap-2">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-full ${GRADE_COLORS[result.grade]} shadow-lg`}
          >
            <span className="text-4xl font-black text-white">
              {result.grade}
            </span>
          </div>
          <p className="text-sm font-medium text-neutral-300">
            {GRADE_LABELS[result.grade]} · {result.score}/100
          </p>
        </div>

        {/* Verdict */}
        <p
          className="mb-4 text-center text-sm leading-relaxed text-neutral-400"
          data-testid="share-verdict"
        >
          {result.verdict}
        </p>

        {/* Stats Row */}
        <div
          className="mb-4 grid grid-cols-4 gap-2 rounded-xl bg-neutral-800 p-3"
          data-testid="share-stats"
        >
          <div className="text-center">
            <p className="text-lg font-bold text-emerald-400">
              {result.summary.safeCount}
            </p>
            <p className="text-[10px] text-neutral-500">Safe</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-amber-400">
              {result.summary.cautionCount}
            </p>
            <p className="text-[10px] text-neutral-500">Caution</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-red-400">
              {result.summary.harmfulCount}
            </p>
            <p className="text-[10px] text-neutral-500">Harmful</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-neutral-400">
              {result.summary.unknownCount}
            </p>
            <p className="text-[10px] text-neutral-500">Unknown</p>
          </div>
        </div>

        {/* Key Findings */}
        {harmfulIngredients.length > 0 && (
          <div className="mb-3" data-testid="share-harmful">
            <p className="mb-1 text-xs font-medium text-red-400">
              ⚠ Harmful Ingredients
            </p>
            <p className="text-xs text-neutral-400">
              {harmfulIngredients.join(", ")}
            </p>
          </div>
        )}

        {safeIngredients.length > 0 && (
          <div className="mb-3" data-testid="share-safe">
            <p className="mb-1 text-xs font-medium text-emerald-400">
              ✓ Quality Ingredients
            </p>
            <p className="text-xs text-neutral-400">
              {safeIngredients.join(", ")}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 border-t border-neutral-800 pt-3">
          <p className="text-center text-[10px] text-neutral-600">
            Scanned with ToxicPaw · AI-Powered Pet Food Safety
          </p>
        </div>
      </div>
    );
  },
);
