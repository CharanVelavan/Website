// src/components/Timeline.jsx
// Generic timeline sidebar used on both project and achievement detail pages.
// Replaces ProjectsTimeline.jsx and AchievementsTimeline.jsx.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

const accentStyles = {
  purple: {
    headerColor: "text-purple-400",
    headerBar: "from-purple-500 to-fuchsia-500",
    baseLine: "from-purple-500/30 via-purple-500/10 to-transparent",
    activeLine: "from-purple-400 via-fuchsia-500 to-purple-600",
    activeGlow: "shadow-[0_0_12px_rgba(168,85,247,0.8)]",
    activeDot: "border-purple-400 bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)]",
    passedDot: "border-purple-500/40 bg-purple-500/20",
    activeCard: "bg-purple-500/10 shadow-lg shadow-purple-500/20",
    activeTitle: "text-purple-300",
    activeIndicator: "text-purple-400",
    footerDots: ["bg-purple-500/40", "bg-purple-500/60", "bg-purple-500/80"],
    yearBadge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    yearText: "text-purple-400",
  },
  blue: {
    headerColor: "text-blue-400",
    headerBar: "from-blue-500 to-cyan-500",
    baseLine: "from-blue-500/30 via-blue-500/10 to-transparent",
    activeLine: "from-blue-400 via-cyan-500 to-blue-600",
    activeGlow: "shadow-[0_0_12px_rgba(59,130,246,0.8)]",
    activeDot: "border-blue-400 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]",
    passedDot: "border-blue-500/40 bg-blue-500/20",
    activeCard: "bg-blue-500/10 shadow-lg shadow-blue-500/20",
    activeTitle: "text-blue-300",
    activeIndicator: "text-blue-400",
    footerDots: ["bg-blue-500/40", "bg-blue-500/60", "bg-blue-500/80"],
    yearBadge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    yearText: "text-blue-400",
  },
};

/**
 * Generic timeline sidebar for detail pages.
 *
 * @param {Object[]} items     - Array of items to list. Each must have `slug` and `title`.
 *                               Optional: `year`, `category` (renders meta badges for achievements).
 * @param {string}   basePath  - URL prefix for item links, e.g. "/projects" or "/achievements".
 * @param {"purple"|"blue"} accent - Color accent theme.
 * @param {string}   title     - Header label shown at the top of the sidebar.
 */
export default function Timeline({ items, basePath, accent = "purple", title }) {
  const pathname = usePathname();
  const currentSlug = pathname?.split("/").pop();
  const activeIndex = items.findIndex((item) => item.slug === currentSlug);
  const styles = accentStyles[accent] || accentStyles.purple;
  const shouldReduceMotion = useReducedMotion();

  return (
    <aside className="hidden lg:block sticky top-24 h-fit max-h-[calc(100vh-7rem)] w-[280px] -ml-8 xl:-ml-16 2xl:-ml-20">
      <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-semibold tracking-wide text-white/90">{title}</h3>
            <span className={`text-xs font-medium ${styles.headerColor}`}>{items.length}</span>
          </div>
          <div className={`mt-1 h-[2px] w-12 rounded-full bg-gradient-to-r ${styles.headerBar}`} />
        </div>

        {/* Scrollable Timeline Container */}
        <div className="relative max-h-[calc(100vh-20rem)] overflow-y-auto overflow-x-hidden pr-2 scrollbar-hide">
          {/* Base line */}
          <div className={`absolute left-[10px] top-2 h-[calc(100%-16px)] w-[2px] bg-gradient-to-b ${styles.baseLine}`} />

          {/* Active progress line */}
          <motion.div
            className={`absolute left-[10px] top-2 w-[2px] bg-gradient-to-b ${styles.activeLine} ${styles.activeGlow}`}
            initial={{ height: 0 }}
            animate={{
              height:
                activeIndex >= 0
                  ? `${(activeIndex / Math.max(items.length - 1, 1)) * 100}%`
                  : "0%",
            }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4, ease: "easeOut" }}
          />

          <ul className="space-y-4">
            {items.map((item, index) => {
              const isActive = item.slug === currentSlug;
              const isPassed = activeIndex >= 0 && index < activeIndex;

              return (
                <motion.li
                  key={item.slug}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { delay: index * 0.05, duration: 0.3 }
                  }
                  className="relative"
                >
                  {/* Dot indicator */}
                  <div className="absolute left-0 top-[6px] flex items-center justify-center z-10">
                    <motion.div
                      className={`relative h-5 w-5 rounded-full border-2 transition-all duration-300 ${
                        isActive
                          ? styles.activeDot
                          : isPassed
                          ? styles.passedDot
                          : "border-white/20 bg-white/5"
                      }`}
                      whileHover={shouldReduceMotion ? undefined : { scale: 1.2 }}
                    >
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-white/40"
                          animate={
                            shouldReduceMotion
                              ? { scale: 1, opacity: 0.6 }
                              : { scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }
                          }
                          transition={
                            shouldReduceMotion
                              ? { duration: 0 }
                              : { duration: 2, repeat: Infinity, ease: "easeInOut" }
                          }
                        />
                      )}
                    </motion.div>
                  </div>

                  {/* Content */}
                  <Link href={`${basePath}/${item.slug}`} className="group block pl-10">
                    <motion.div
                      whileHover={shouldReduceMotion ? undefined : { x: 4 }}
                      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
                      className={`rounded-lg p-2.5 transition-all duration-300 ${
                        isActive ? styles.activeCard : "hover:bg-white/5"
                      }`}
                    >
                      <h4
                        className={`text-sm font-semibold leading-tight transition-colors duration-300 line-clamp-2 ${
                          isActive ? styles.activeTitle : "text-gray-400 group-hover:text-white"
                        }`}
                      >
                        {item.title}
                      </h4>

                      {/* Year + Category meta (rendered for achievements) */}
                      {(item.year || item.category) && (
                        <div className="mt-1.5 flex items-center gap-2">
                          {item.year && (
                            <span
                              className={`text-[10px] font-medium ${
                                isActive ? styles.yearText : "text-gray-500"
                              }`}
                            >
                              {item.year}
                            </span>
                          )}
                          {item.category && (
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                isActive
                                  ? styles.yearBadge
                                  : "bg-white/5 text-gray-500 border-white/10"
                              }`}
                            >
                              {item.category}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={shouldReduceMotion ? { duration: 0 } : undefined}
                          className={`mt-2 flex items-center gap-1.5 text-[10px] font-medium ${styles.activeIndicator}`}
                        >
                          <motion.span
                            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: [1, 0.4, 1] }}
                            transition={
                              shouldReduceMotion
                                ? { duration: 0 }
                                : { duration: 1.5, repeat: Infinity }
                            }
                          >
                            ●
                          </motion.span>
                          Viewing now
                        </motion.div>
                      )}
                    </motion.div>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* Footer decoration */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-[10px] text-gray-500">
            <span>Portfolio 2025</span>
            <div className="flex gap-1">
              {styles.footerDots.map((cls, i) => (
                <div key={i} className={`h-1 w-1 rounded-full ${cls}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
