import type { Grade } from "@/lib/analyzer/types";

/** Background color classes for grade badges — shared across all components */
export const GRADE_COLORS: Record<Grade, string> = {
  A: "bg-emerald-500",
  B: "bg-lime-500",
  C: "bg-amber-500",
  D: "bg-orange-500",
  F: "bg-red-600",
};

/** Human-readable grade labels */
export const GRADE_LABELS: Record<Grade, string> = {
  A: "Excellent",
  B: "Good",
  C: "Average",
  D: "Below Average",
  F: "Poor",
};

/** Text color classes for grade scores/text */
export const GRADE_TEXT_COLORS: Record<Grade, string> = {
  A: "text-emerald-400",
  B: "text-lime-400",
  C: "text-amber-400",
  D: "text-orange-400",
  F: "text-red-400",
};

/** Numeric order for grade sorting (A=0, F=4) */
export const GRADE_ORDER: Record<Grade, number> = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  F: 4,
};

/** Full style set for the large GradeBadge component */
export const GRADE_STYLES: Record<
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
