"use client";

import { motion, useMotionValue, useTransform, animate, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

export default function Counter({ value, duration = 1.2 }) {
  // Start at the real value so the server HTML (crawlers, no-JS, screen readers
  // before hydration) shows the number, not 0. The count-up runs after mount.
  const count = useMotionValue(value);
  const rounded = useTransform(count, latest => Math.round(latest));
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      count.set(value);
      return;
    }
    count.set(0);
    const controls = animate(count, value, {
      duration,
      ease: "easeOut",
    });

    return controls.stop;
  }, [count, value, duration, shouldReduceMotion]);

  return (
    <motion.span>
      {rounded}
    </motion.span>
  );
}
