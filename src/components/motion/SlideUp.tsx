"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface SlideUpProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  offset?: number;
  className?: string;
}

const variants: Variants = {
  hidden: (custom: { offset: number }) => ({
    opacity: 0,
    y: custom.offset,
  }),
  visible: (custom: { duration: number; delay: number }) => ({
    opacity: 1,
    y: 0,
    transition: { duration: custom.duration, delay: custom.delay, ease: "easeOut" },
  }),
};

export function SlideUp({
  children,
  duration = 0.5,
  delay = 0,
  offset = 24,
  className,
}: SlideUpProps) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      custom={{ duration, delay, offset }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
