/**
 * F006 - Grade Badge Component (polished F013)
 *
 * Large, eye-catching letter grade (A-F) with color coding and glow effect.
 * Designed for emotional impact — "fear-driven UX" per design principles.
 */

import type { Grade } from "@/lib/analyzer/types";

const GRADE_STYLES: Record<
  Grade,
  { bg: string; ring: string; text: string; glow: string }
> = {
  A: {
    bg: "bg-emerald-500",
    ring: "ring-emerald-400/30",
    text: "text-white",
    glow: "shadow-emerald-500/40",
  },
  B: {
    bg: "bg-lime-500",
    ring: "ring-lime-400/30",
    text: "text-white",
    glow: "shadow-lime-500/40",
  },
  C: {
    bg: "bg-amber-500",
    ring: "ring-amber-400/30",
    text: "text-white",
    glow: "shadow-amber-500/40",
  },
  D: {
    bg: "bg-orange-500",
    ring: "ring-orange-400/30",
    text: "text-white",
    glow: "shadow-orange-500/40",
  },
  F: {
    bg: "bg-red-600",
    ring: "ring-red-500/30",
    text: "text-white",
    glow: "shadow-red-500/40",
  },
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
    <div className="flex flex-col items-center gap-4">
      <div
        className={`flex h-32 w-32 items-center justify-center rounded-full ${style.bg} ${style.text} ring-4 ${style.ring} shadow-2xl ${style.glow}`}
        role="img"
        aria-label={`Grade ${grade}: ${GRADE_LABELS[grade]}`}
      >
        <span className="text-6xl font-black tracking-tight">{grade}</span>
      </div>
      <div className="text-center">
        <p className="text-xl font-bold text-neutral-100">
          {GRADE_LABELS[grade]}
        </p>
        <p className="mt-1 text-sm font-medium text-neutral-400">
          Score: {score}/100
        </p>
      </div>
    </div>
  );
}
