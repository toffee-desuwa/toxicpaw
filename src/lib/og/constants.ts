/**
 * F024 - OG Image Constants
 *
 * Hex color values for grade badges in OG images.
 * ImageResponse uses Satori which requires inline styles, not Tailwind classes.
 */

import type { Grade } from "@/lib/analyzer/types";

/** Hex color for each grade (used in OG image generation) */
export const GRADE_HEX: Record<Grade, string> = {
  A: "#10b981",
  B: "#84cc16",
  C: "#f59e0b",
  D: "#f97316",
  F: "#dc2626",
};

/** OG image dimensions (landscape — Twitter, Facebook, LinkedIn) */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** Square share image dimensions (小红书, Instagram, WeChat) */
export const SQUARE_WIDTH = 1080;
export const SQUARE_HEIGHT = 1080;

/** Share image format type */
export type ShareFormat = "og" | "square";
