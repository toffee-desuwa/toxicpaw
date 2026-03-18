/**
 * F006 - Grade Badge Component
 *
 * Large, eye-catching letter grade (A-F) with color coding.
 * Designed for emotional impact — "fear-driven UX" per design principles.
 */

import type { Grade } from "@/lib/analyzer/types";

const GRADE_STYLES: Record<Grade, { bg: string; ring: string; text: string }> = {
  A: { bg: "bg-emerald-500", ring: "ring-emerald-400/30", text: "text-white" },
  B: { bg: "bg-lime-500", ring: "ring-lime-400/30", text: "text-white" },
  C: { bg: "bg-amber-500", ring: "ring-amber-400/30", text: "text-white" },
  D: { bg: "bg-orange-500", ring: "ring-orange-400/30", text: "text-white" },
  F: { bg: "bg-red-600", ring: "ring-red-500/30", text: "text-white" },
};

const GRADE_LABELS: Record<Grade, string> = {
  A: "Excellent",
  B: "Good",
  C: "Average",
  D: "Below Average",
  F: "Poor",
};

interface GradeBadgeProps {
  grade: Grade;
  score: number;
}

export function GradeBadge({ grade, score }: GradeBadgeProps) {
  const style = GRADE_STYLES[grade];

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`flex h-28 w-28 items-center justify-center rounded-full ${style.bg} ${style.text} ring-4 ${style.ring} shadow-lg`}
        role="img"
        aria-label={`Grade ${grade}: ${GRADE_LABELS[grade]}`}
      >
        <span className="text-5xl font-black">{grade}</span>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-neutral-200">
          {GRADE_LABELS[grade]}
        </p>
        <p className="text-sm text-neutral-400">Score: {score}/100</p>
      </div>
    </div>
  );
}
