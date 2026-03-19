/**
 * F006 - Grade Badge Component (polished F013)
 *
 * Large, eye-catching letter grade (A-F) with color coding and glow effect.
 * Designed for emotional impact — "fear-driven UX" per design principles.
 */

import type { Grade } from "@/lib/analyzer/types";
import { GRADE_STYLES, GRADE_LABELS } from "@/lib/grade";

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
