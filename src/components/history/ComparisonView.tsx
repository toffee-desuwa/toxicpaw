/**
 * F009 - Side-by-Side Comparison View
 *
 * Compares two scanned foods showing grades, scores, and ingredient breakdowns.
 */

import type { ScanHistoryEntry } from "@/lib/history/types";
import type { Grade } from "@/lib/analyzer/types";

const GRADE_COLORS: Record<Grade, string> = {
  A: "bg-emerald-500",
  B: "bg-lime-500",
  C: "bg-amber-500",
  D: "bg-orange-500",
  F: "bg-red-600",
};

interface ComparisonViewProps {
  left: ScanHistoryEntry;
  right: ScanHistoryEntry;
  onClose: () => void;
}

function StatRow({
  label,
  leftVal,
  rightVal,
  highlightHigher = true,
}: {
  label: string;
  leftVal: number;
  rightVal: number;
  highlightHigher?: boolean;
}) {
  const leftWins = highlightHigher ? leftVal > rightVal : leftVal < rightVal;
  const rightWins = highlightHigher ? rightVal > leftVal : rightVal < leftVal;

  return (
    <div className="flex items-center gap-2 text-sm" data-testid="stat-row">
      <span
        className={`w-12 text-right font-mono ${leftWins ? "text-emerald-400 font-bold" : "text-neutral-400"}`}
      >
        {leftVal}
      </span>
      <span className="flex-1 text-center text-neutral-500">{label}</span>
      <span
        className={`w-12 text-left font-mono ${rightWins ? "text-emerald-400 font-bold" : "text-neutral-400"}`}
      >
        {rightVal}
      </span>
    </div>
  );
}

export function ComparisonView({ left, right, onClose }: ComparisonViewProps) {
  return (
    <div
      className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-8"
      data-testid="comparison-view"
    >
      <h2 className="text-center text-lg font-semibold text-neutral-200">
        Food Comparison
      </h2>

      {/* Grade badges side by side */}
      <div className="flex items-center justify-around">
        <div className="flex flex-col items-center gap-2">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full ${GRADE_COLORS[left.result.grade]} text-white font-bold text-2xl`}
          >
            {left.result.grade}
          </div>
          <p className="max-w-[120px] truncate text-center text-sm font-medium text-neutral-300">
            {left.foodName || "Food 1"}
          </p>
        </div>

        <span className="text-2xl font-bold text-neutral-600">vs</span>

        <div className="flex flex-col items-center gap-2">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full ${GRADE_COLORS[right.result.grade]} text-white font-bold text-2xl`}
          >
            {right.result.grade}
          </div>
          <p className="max-w-[120px] truncate text-center text-sm font-medium text-neutral-300">
            {right.foodName || "Food 2"}
          </p>
        </div>
      </div>

      {/* Stats comparison */}
      <div className="rounded-xl bg-neutral-800/60 px-4 py-4 space-y-3">
        <StatRow
          label="Score"
          leftVal={left.result.score}
          rightVal={right.result.score}
        />
        <StatRow
          label="Safe"
          leftVal={left.result.summary.safeCount}
          rightVal={right.result.summary.safeCount}
        />
        <StatRow
          label="Caution"
          leftVal={left.result.summary.cautionCount}
          rightVal={right.result.summary.cautionCount}
          highlightHigher={false}
        />
        <StatRow
          label="Harmful"
          leftVal={left.result.summary.harmfulCount}
          rightVal={right.result.summary.harmfulCount}
          highlightHigher={false}
        />
        <StatRow
          label="Total"
          leftVal={left.result.summary.totalIngredients}
          rightVal={right.result.summary.totalIngredients}
        />
      </div>

      {/* Verdicts */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-neutral-800/40 px-3 py-3">
          <p className="text-xs font-medium text-neutral-500 mb-1">
            {left.foodName || "Food 1"}
          </p>
          <p className="text-sm text-neutral-300" data-testid="left-verdict">
            {left.result.verdict}
          </p>
        </div>
        <div className="rounded-xl bg-neutral-800/40 px-3 py-3">
          <p className="text-xs font-medium text-neutral-500 mb-1">
            {right.foodName || "Food 2"}
          </p>
          <p className="text-sm text-neutral-300" data-testid="right-verdict">
            {right.result.verdict}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-full rounded-full bg-neutral-700 px-8 py-3 font-medium text-white transition-colors hover:bg-neutral-600 active:scale-95"
      >
        Back to History
      </button>
    </div>
  );
}
