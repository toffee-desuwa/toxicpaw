"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

const variants: Variants = {
  hidden: { opacity: 0 },
  visible: (custom: { duration: number; delay: number }) => ({
    opacity: 1,
    transition: { duration: custom.duration, delay: custom.delay, ease: "easeOut" },
  }),
};

export function FadeIn({
  children,
  duration = 0.5,
  delay = 0,
  className,
}: FadeInProps) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      custom={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
