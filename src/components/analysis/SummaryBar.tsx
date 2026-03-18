/**
 * F006 - Summary Bar Component
 *
 * Visual summary showing counts of safe/caution/harmful/unknown ingredients.
 */

import type { AnalysisSummary } from "@/lib/analyzer/types";

interface SummaryBarProps {
  summary: AnalysisSummary;
}

export function SummaryBar({ summary }: SummaryBarProps) {
  const items = [
    { count: summary.safeCount, label: "Safe", color: "text-emerald-400" },
    { count: summary.cautionCount, label: "Caution", color: "text-amber-400" },
    { count: summary.harmfulCount, label: "Harmful", color: "text-red-400" },
    { count: summary.unknownCount, label: "Unknown", color: "text-neutral-400" },
  ];

  return (
    <div
      className="grid grid-cols-4 gap-2 rounded-xl bg-neutral-800/50 p-4"
      data-testid="summary-bar"
    >
      {items.map((item) => (
        <div key={item.label} className="text-center">
          <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
          <p className="text-xs text-neutral-500">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
