"use client";

/**
 * F032 - Animated Grade Badge
 *
 * 3D flip reveal + scale bounce, animated score counter,
 * faded-in grade label, and pulsing glow effect.
 */

import { motion } from "framer-motion";
import type { Grade } from "@/lib/analyzer/types";
import { GRADE_STYLES } from "@/lib/grade";
import { useTranslation } from "@/lib/i18n";
import { CountUp } from "@/components/motion";

/** Glow color CSS custom properties per grade (used by glow-pulse animation) */
const GLOW_COLORS: Record<Grade, string> = {
  A: "rgba(16, 185, 129, 0.5)",
  B: "rgba(132, 204, 22, 0.5)",
  C: "rgba(245, 158, 11, 0.5)",
  D: "rgba(249, 115, 22, 0.5)",
  F: "rgba(220, 38, 38, 0.5)",
};

interface AnimatedGradeBadgeProps {
  grade: Grade;
  score: number;
}

export function AnimatedGradeBadge({ grade, score }: AnimatedGradeBadgeProps) {
  const style = GRADE_STYLES[grade];
  const { t } = useTranslation("grade");
  const gradeLabel = t(grade);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 3D flip + scale bounce badge */}
      <motion.div
        className={`flex h-32 w-32 items-center justify-center rounded-full ${style.bg} ${style.text} ring-4 ${style.ring} shadow-2xl`}
        role="img"
        aria-label={t("gradeLabel", { grade, label: gradeLabel })}
        data-testid="animated-grade-badge"
        initial={{ rotateY: 180, scale: 0.5, opacity: 0 }}
        animate={{ rotateY: 0, scale: 1, opacity: 1 }}
        transition={{
          duration: 0.7,
          ease: [0.34, 1.56, 0.64, 1],
        }}
        style={{
          perspective: 800,
          transformStyle: "preserve-3d",
          // Glow pulse via box-shadow animation
          animation: "glow-pulse 2s ease-in-out 0.8s infinite",
          // @ts-expect-error CSS custom property for glow color
          "--glow-color": GLOW_COLORS[grade],
        }}
      >
        <span className="text-6xl font-black tracking-tight">{grade}</span>
      </motion.div>

      {/* Label + score fade in after badge reveal */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
        data-testid="animated-grade-label"
      >
        <p className="text-xl font-bold text-neutral-100">
          {gradeLabel}
        </p>
        <p className="mt-1 text-sm font-medium text-neutral-400">
          <CountUp to={score} duration={0.8} delay={0.6} />
          <span> / 100</span>
        </p>
      </motion.div>
    </div>
  );
}
