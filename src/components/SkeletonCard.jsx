"use client";

import { motion } from "framer-motion";

/**
 * Animated shimmer skeleton card used as a placeholder before content
 * is revealed on projects and achievements listing pages.
 */
export default function SkeletonCard({ className = "" }) {
  return (
    <motion.div
      className={`rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Shimmer image area */}
      <div className="relative w-full aspect-video bg-black/5 dark:bg-white/5 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Shimmer text area */}
      <div className="p-5 space-y-3">
        {/* Title bar */}
        <div className="relative h-5 w-3/4 rounded-lg bg-black/8 dark:bg-white/8 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear", delay: 0.1 }}
          />
        </div>

        {/* Subtitle bar */}
        <div className="relative h-3.5 w-1/2 rounded-lg bg-black/8 dark:bg-white/8 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear", delay: 0.2 }}
          />
        </div>

        {/* Tag pills row */}
        <div className="flex gap-2 pt-1">
          {[40, 56, 48].map((w, i) => (
            <div
              key={i}
              className="relative h-5 rounded-full bg-black/8 dark:bg-white/8 overflow-hidden"
              style={{ width: `${w}px` }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.05 * i + 0.3,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
