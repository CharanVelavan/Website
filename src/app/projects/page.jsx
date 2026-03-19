// src/app/projects/page.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { projects } from "@/lib/projects";
import SkeletonCard from "@/components/SkeletonCard";
import GlowCard from "@/components/GlowCard";

function ProjectImageSlideshow({ images, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion || !images || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="h-20 w-20 text-white/30 group-hover:text-white/50 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
      </>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
        >
          <Image
            src={images[currentIndex]}
            alt={title}
            fill
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-[#f8f7f4] dark:from-[#0a0a0a] via-transparent to-transparent opacity-60" />

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                setCurrentIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all ${idx === currentIndex
                ? "w-6 bg-white"
                : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default function ProjectsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 380);
    return () => clearTimeout(t);
  }, []);

  // Collect all unique companies from all projects
  const allCompanies = useMemo(() =>
    projects.reduce((acc, project) => {
      if (project.companies?.enabled && project.companies?.list) {
        project.companies.list.forEach((company) => {
          if (!acc.find((c) => c.name === company.name)) {
            acc.push(company);
          }
        });
      }
      return acc;
    }, []),
  []);

  // Duplicate companies for continuous effect
  const leftSideLogos = [...allCompanies, ...allCompanies, ...allCompanies];
  const rightSideLogos = [...allCompanies, ...allCompanies, ...allCompanies];

  return (
    <div className="relative">
      {/* LEFT SIDEBAR - Waterfall logos */}
      {allCompanies.length > 0 && (
        <div className="hidden lg:block fixed left-4 xl:left-8 top-32 bottom-8 w-14 xl:w-20 overflow-hidden">
          <motion.div
            className="flex flex-col gap-6"
            animate={{
              y: shouldReduceMotion ? 0 : [0, -2000],
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 30,
              repeat: shouldReduceMotion ? 0 : Infinity,
              ease: "linear",
            }}
          >
            {leftSideLogos.map((company, idx) => (
              <motion.div
                key={`left - ${idx} `}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.6, scale: 1 }}
                transition={shouldReduceMotion ? { duration: 0 } : { delay: idx * 0.1 }}
                whileHover={shouldReduceMotion ? undefined : { opacity: 1, scale: 1.1 }}
                className="h-12 w-12 xl:h-16 xl:w-16 rounded-xl bg-black/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 p-2.5 flex-shrink-0"
                title={company.name}
              >
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="h-full w-full object-contain"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* RIGHT SIDEBAR - Waterfall logos */}
      {allCompanies.length > 0 && (
        <div className="hidden lg:block fixed right-4 xl:right-8 top-32 bottom-8 w-14 xl:w-20 overflow-hidden">
          <motion.div
            className="flex flex-col gap-6"
            animate={{
              y: shouldReduceMotion ? 0 : [-2000, 0],
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 30,
              repeat: shouldReduceMotion ? 0 : Infinity,
              ease: "linear",
            }}
          >
            {rightSideLogos.map((company, idx) => (
              <motion.div
                key={`right - ${idx} `}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.6, scale: 1 }}
                transition={shouldReduceMotion ? { duration: 0 } : { delay: idx * 0.1 }}
                whileHover={shouldReduceMotion ? undefined : { opacity: 1, scale: 1.1 }}
                className="h-12 w-12 xl:h-16 xl:w-16 rounded-xl bg-black/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 p-2.5 flex-shrink-0"
                title={company.name}
              >
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="h-full w-full object-contain"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-tab-safe">
        {/* PAGE HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6 }}
          className="mb-12 md:mb-24"
        >
          <div className="mb-4">
            <span className="text-sm uppercase tracking-[0.2em] text-purple-400 font-medium">
              Portfolio
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 dark:from-white to-gray-500 dark:to-gray-400 bg-clip-text text-transparent">
            Projects
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            A collection of technical projects spanning robotics, embedded systems,
            wireless networks, and AI. Each project demonstrates hands-on engineering
            experience and problem-solving across multiple domains.
          </p>
        </motion.header>

        {/* PROJECTS GRID */}
        <section className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-8">
          {isLoading
            ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            : projects.map((project, index) => {
              const hasImage = project.images && project.images.length > 0 && project.images[0];

              return (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 0.5, delay: index * 0.1 }
                  }
                  whileHover={{ y: -1 }}
                  className="relative"
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group block h-full"
                  >
                    <GlowCard borderRadius={16}>
                      <div className="group relative h-full overflow-hidden">
                        {/* Image Section — poster style with title overlay */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-purple-900/20 to-pink-900/20">
                          <ProjectImageSlideshow images={project.images} title={project.title} />

                          {/* Dark scrim for text legibility */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                          {/* Top-left: key metric badge */}
                          {project.metrics?.enabled && project.metrics.results.length > 0 && (
                            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
                              <div className="px-1.5 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg bg-black/60 backdrop-blur-md border border-white/20">
                                <span className="text-[10px] sm:text-base font-bold text-white leading-none">{project.metrics.results[0].value}</span>
                                <span className="text-[8px] sm:text-[10px] text-white/60 block mt-0.5 uppercase tracking-wide hidden sm:block">{project.metrics.results[0].label}</span>
                              </div>
                            </div>
                          )}

                          {/* Top-right: company logos */}
                          {project.companies?.enabled &&
                            project.companies?.list?.length > 0 && (
                              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-1 sm:gap-2 z-10">
                                {project.companies.list.slice(0, 2).map((company) => (
                                  <div
                                    key={company.name}
                                    className="h-6 w-6 sm:h-10 sm:w-10 rounded-md sm:rounded-lg bg-white/90 backdrop-blur-md border border-white/20 p-0.5 sm:p-1.5 flex items-center justify-center"
                                    title={company.name}
                                  >
                                    <img
                                      src={company.logo}
                                      alt={`${company.name} logo`}
                                      className="h-full w-full object-contain"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                          {/* Bottom: title + role overlaid on image */}
                          <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-5 z-10">
                            <h2 className="text-xs sm:text-xl font-bold text-white leading-tight group-hover:text-purple-200 transition-colors line-clamp-2">
                              {project.title}
                            </h2>
                            {project.role?.position && (
                              <span className="text-[9px] sm:text-xs text-purple-300/80 mt-0.5 sm:mt-1 block hidden sm:block">{project.role.position}</span>
                            )}
                          </div>
                        </div>

                        {/* Content Section — compact, just description + tags */}
                        <div className={`p-2.5 sm:p-5 md:p-6 ${project.slug === "nephele-community-robot" ? "sm:pb-36 pb-24" : ""}`}>
                          {/* Description */}
                          <p className="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2 sm:mb-4 line-clamp-2">
                            {project.description}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 sm:gap-1.5">
                            {project.tags.slice(0, 4).map((tag, tagIdx) => (
                              <span
                                key={tag}
                                className={`text-[9px] sm:text-xs px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-all ${tagIdx >= 2 ? "hidden sm:inline-block" : ""}`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Hover Glow Effect */}
                        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
                      </div>
                    </GlowCard>
                  </Link>

                  {/* Nephele special buttons - positioned absolutely over the card */}
                  {project.slug === "nephele-community-robot" && project.links?.demo && (
                    <div className="absolute bottom-3 left-2.5 right-2.5 sm:bottom-6 sm:left-6 sm:right-6 z-20 flex flex-col gap-1.5 sm:gap-3">
                      <a
                        href={project.links.demo}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center gap-1 sm:gap-2 px-3 py-2 sm:px-6 sm:py-3 rounded-lg bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 bg-[length:200%_100%] animate-gradient text-white font-bold text-[10px] sm:text-sm shadow-lg shadow-purple-500/40 hover:shadow-xl hover:shadow-purple-500/60 transition-all hover:scale-105"
                      >
                        <span>Talk with Nephele</span>
                        <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                      <Link
                        href={`/projects/${project.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-sm text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <span>View details</span>
                        <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </motion.div>
              );
            })}
        </section>
      </main>
    </div>
  );
}
