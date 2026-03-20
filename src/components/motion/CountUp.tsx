"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  className?: string;
  formatter?: (value: number) => string;
}

export function CountUp({
  from = 0,
  to,
  duration = 1,
  delay = 0,
  className,
  formatter,
}: CountUpProps) {
  const [display, setDisplay] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate: (value) => {
          setDisplay(Math.round(value));
        },
      });
      return () => controls.stop();
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [from, to, duration, delay]);

  const formatted = formatter ? formatter(display) : String(display);

  return (
    <span ref={ref} className={className}>
      {formatted}
    </span>
  );
}
