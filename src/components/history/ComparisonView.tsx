/**
 * F009 - Side-by-Side Comparison View (polished F013, i18n F019)
 *
 * Compares two scanned foods showing grades, scores, and ingredient breakdowns.
 * Refined visual hierarchy for screenshot quality.
 */

import type { ScanHistoryEntry } from "@/lib/history/types";
import { GRADE_COLORS } from "@/lib/grade";
import { useTranslation } from "@/lib/i18n";

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
        className={`w-12 text-right tabular-nums ${leftWins ? "text-emerald-400 font-bold" : "text-neutral-400"}`}
      >
        {leftVal}
      </span>
      <span className="flex-1 text-center text-xs font-medium uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      <span
        className={`w-12 text-left tabular-nums ${rightWins ? "text-emerald-400 font-bold" : "text-neutral-400"}`}
      >
        {rightVal}
      </span>
    </div>
  );
}

export function ComparisonView({ left, right, onClose }: ComparisonViewProps) {
  const { t } = useTranslation("history");

  return (
    <div
      className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-10"
      data-testid="comparison-view"
    >
      <h2 className="text-center text-xl font-bold text-neutral-100">
        {t("comparison")}
      </h2>

      {/* Grade badges side by side */}
      <div className="flex items-center justify-around">
        <div className="flex flex-col items-center gap-3">
          <div
            className={`flex h-18 w-18 items-center justify-center rounded-full ${GRADE_COLORS[left.result.grade]} text-white font-black text-3xl shadow-lg`}
          >
            {left.result.grade}
          </div>
          <p className="max-w-[120px] truncate text-center text-sm font-semibold text-neutral-200">
            {left.foodName || t("food1")}
          </p>
        </div>

        <span className="text-2xl font-bold text-neutral-700">{t("vs")}</span>

        <div className="flex flex-col items-center gap-3">
          <div
            className={`flex h-18 w-18 items-center justify-center rounded-full ${GRADE_COLORS[right.result.grade]} text-white font-black text-3xl shadow-lg`}
          >
            {right.result.grade}
          </div>
          <p className="max-w-[120px] truncate text-center text-sm font-semibold text-neutral-200">
            {right.foodName || t("food2")}
          </p>
        </div>
      </div>

      {/* Stats comparison */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 px-5 py-5 space-y-3">
        <StatRow
          label={t("score")}
          leftVal={left.result.score}
          rightVal={right.result.score}
        />
        <StatRow
          label={t("safe")}
          leftVal={left.result.summary.safeCount}
          rightVal={right.result.summary.safeCount}
        />
        <StatRow
          label={t("caution")}
          leftVal={left.result.summary.cautionCount}
          rightVal={right.result.summary.cautionCount}
          highlightHigher={false}
        />
        <StatRow
          label={t("harmful")}
          leftVal={left.result.summary.harmfulCount}
          rightVal={right.result.summary.harmfulCount}
          highlightHigher={false}
        />
        <StatRow
          label={t("total")}
          leftVal={left.result.summary.totalIngredients}
          rightVal={right.result.summary.totalIngredients}
        />
      </div>

      {/* Verdicts */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
            {left.foodName || t("food1")}
          </p>
          <p className="text-sm leading-relaxed text-neutral-300" data-testid="left-verdict">
            {left.result.verdict}
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
            {right.foodName || t("food2")}
          </p>
          <p className="text-sm leading-relaxed text-neutral-300" data-testid="right-verdict">
            {right.result.verdict}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-full rounded-full border border-neutral-700 bg-neutral-800 px-8 py-3.5 font-semibold text-neutral-200 transition-colors hover:bg-neutral-700 active:scale-[0.98]"
      >
        {t("backToHistory")}
      </button>
    </div>
  );
}
