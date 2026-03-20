"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface ScaleInProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  initialScale?: number;
  className?: string;
}

const variants: Variants = {
  hidden: (custom: { initialScale: number }) => ({
    opacity: 0,
    scale: custom.initialScale,
  }),
  visible: (custom: { duration: number; delay: number }) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: custom.duration,
      delay: custom.delay,
      ease: [0.34, 1.56, 0.64, 1],
    },
  }),
};

export function ScaleIn({
  children,
  duration = 0.5,
  delay = 0,
  initialScale = 0.8,
  className,
}: ScaleInProps) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      custom={{ duration, delay, initialScale }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
