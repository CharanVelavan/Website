// src/components/ProjectsTimeline.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { projects } from "@/lib/projects";

export default function ProjectsTimeline() {
  const pathname = usePathname();
  const currentSlug = pathname?.split("/").pop();
  const activeIndex = projects.findIndex((p) => p.slug === currentSlug);

  return (
    <aside className="hidden lg:block sticky top-24 h-fit max-h-[calc(100vh-7rem)] w-[280px] -ml-8 xl:-ml-16 2xl:-ml-20">
      {/* Glassmorphic Container */}
      <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-semibold tracking-wide text-white/90">
              Projects
            </h3>
            <span className="text-xs font-medium text-purple-400">
              {projects.length}
            </span>
          </div>
          <div className="mt-1 h-[2px] w-12 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500" />
        </div>

        {/* Scrollable Timeline Container */}
        <div className="relative max-h-[calc(100vh-20rem)] overflow-y-auto overflow-x-hidden pr-2 scrollbar-hide">
          {/* Base line - thicker */}
          <div className="absolute left-[10px] top-2 h-[calc(100%-16px)] w-[2px] bg-gradient-to-b from-purple-500/30 via-purple-500/10 to-transparent" />

          {/* Active progress line - thicker with glow */}
          <motion.div
            className="absolute left-[10px] top-2 w-[2px] bg-gradient-to-b from-purple-400 via-fuchsia-500 to-purple-600 shadow-[0_0_12px_rgba(168,85,247,0.8)]"
            initial={{ height: 0 }}
            animate={{
              height:
                activeIndex >= 0
                  ? `${(activeIndex / (projects.length - 1)) * 100}%`
                  : "0%",
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />

          <ul className="space-y-4">
            {projects.map((project, index) => {
              const isActive = project.slug === currentSlug;
              const isPassed = activeIndex >= 0 && index < activeIndex;

              return (
                <motion.li
                  key={project.slug}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="relative"
                >
                  {/* Dot indicator */}
                  <div className="absolute left-0 top-[6px] flex items-center justify-center z-10">
                    <motion.div
                      className={`relative h-5 w-5 rounded-full border-2 transition-all duration-300 ${
                        isActive
                          ? "border-purple-400 bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                          : isPassed
                          ? "border-purple-500/40 bg-purple-500/20"
                          : "border-white/20 bg-white/5"
                      }`}
                      whileHover={{ scale: 1.2 }}
                    >
                      {/* Inner glow for active */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-white/40"
                          animate={{
                            scale: [1, 1.4, 1],
                            opacity: [0.6, 0, 0.6],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      )}
                    </motion.div>
                  </div>

                  {/* Content */}
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group block pl-10"
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      className={`rounded-lg p-2.5 transition-all duration-300 ${
                        isActive
                          ? "bg-purple-500/10 shadow-lg shadow-purple-500/20"
                          : "hover:bg-white/5"
                      }`}
                    >
                      {/* Title */}
                      <h4
                        className={`text-sm font-semibold leading-tight transition-colors duration-300 line-clamp-2 ${
                          isActive
                            ? "text-purple-300"
                            : "text-gray-400 group-hover:text-white"
                        }`}
                      >
                        {project.title}
                      </h4>

                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-purple-400"
                        >
                          <motion.span
                            animate={{ opacity: [1, 0.4, 1] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                            }}
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
              <div className="h-1 w-1 rounded-full bg-purple-500/40" />
              <div className="h-1 w-1 rounded-full bg-purple-500/60" />
              <div className="h-1 w-1 rounded-full bg-purple-500/80" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}