/**
 * F006 - Summary Bar Component (polished F013, i18n F019)
 *
 * Visual summary showing counts of safe/caution/harmful/unknown ingredients.
 * Each stat in its own mini-card with color accent for screenshot clarity.
 */

import type { AnalysisSummary } from "@/lib/analyzer/types";
import { useTranslation } from "@/lib/i18n";

interface SummaryBarProps {
  summary: AnalysisSummary;
}

export function SummaryBar({ summary }: SummaryBarProps) {
  const { t } = useTranslation("analysis");

  const items = [
    { count: summary.safeCount, label: t("safe"), color: "text-emerald-400", border: "border-emerald-500/20" },
    { count: summary.cautionCount, label: t("caution"), color: "text-amber-400", border: "border-amber-500/20" },
    { count: summary.harmfulCount, label: t("harmful"), color: "text-red-400", border: "border-red-500/20" },
    { count: summary.unknownCount, label: t("unknown"), color: "text-neutral-400", border: "border-neutral-700" },
  ];

  return (
    <div
      className="grid grid-cols-4 gap-2"
      data-testid="summary-bar"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className={`rounded-xl border ${item.border} bg-neutral-900/80 p-3 text-center`}
        >
          <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-neutral-500">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}
