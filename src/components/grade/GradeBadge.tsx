/**
 * F006 - Grade Badge Component (polished F013, i18n F019)
 *
 * Large, eye-catching letter grade (A-F) with color coding and glow effect.
 * Designed for emotional impact — "fear-driven UX" per design principles.
 */

import type { Grade } from "@/lib/analyzer/types";
import { GRADE_STYLES } from "@/lib/grade";
import { useTranslation } from "@/lib/i18n";

interface GradeBadgeProps {
  grade: Grade;
  score: number;
}

export function GradeBadge({ grade, score }: GradeBadgeProps) {
  const style = GRADE_STYLES[grade];
  const { t } = useTranslation("grade");

  const gradeLabel = t(grade);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`flex h-32 w-32 items-center justify-center rounded-full ${style.bg} ${style.text} ring-4 ${style.ring} shadow-2xl ${style.glow}`}
        role="img"
        aria-label={t("gradeLabel", { grade, label: gradeLabel })}
      >
        <span className="text-6xl font-black tracking-tight">{grade}</span>
      </div>
      <div className="text-center">
        <p className="text-xl font-bold text-neutral-100">
          {gradeLabel}
        </p>
        <p className="mt-1 text-sm font-medium text-neutral-400">
          {t("scoreLabel", { score })}
        </p>
      </div>
    </div>
  );
}
