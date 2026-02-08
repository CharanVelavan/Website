// src/app/projects/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/lib/projects";

function ProjectImageSlideshow({ images, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;

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
          transition={{ duration: 0.5 }}
        >
          <Image
            src={images[currentIndex]}
            alt={title}
            fill
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />

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
  // Collect all unique companies from all projects
  const allCompanies = projects.reduce((acc, project) => {
    if (project.companies?.enabled && project.companies?.list) {
      project.companies.list.forEach((company) => {
        if (!acc.find((c) => c.name === company.name)) {
          acc.push(company);
        }
      });
    }
    return acc;
  }, []);

  // Duplicate companies for continuous effect
  const leftSideLogos = [...allCompanies, ...allCompanies, ...allCompanies];
  const rightSideLogos = [...allCompanies, ...allCompanies, ...allCompanies];

  return (
    <div className="relative">
      {/* LEFT SIDEBAR - Waterfall logos */}
      {allCompanies.length > 0 && (
        <div className="hidden xl:block fixed left-8 top-32 bottom-8 w-20 overflow-hidden">
          <motion.div
            className="flex flex-col gap-6"
            animate={{
              y: [0, -2000],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {leftSideLogos.map((company, idx) => (
              <motion.div
                key={`left - ${idx} `}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.6, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ opacity: 1, scale: 1.1 }}
                className="h-16 w-16 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-3 flex-shrink-0"
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
        <div className="hidden xl:block fixed right-8 top-32 bottom-8 w-20 overflow-hidden">
          <motion.div
            className="flex flex-col gap-6"
            animate={{
              y: [-2000, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {rightSideLogos.map((company, idx) => (
              <motion.div
                key={`right - ${idx} `}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.6, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ opacity: 1, scale: 1.1 }}
                className="h-16 w-16 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-3 flex-shrink-0"
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
      <main className="mx-auto max-w-7xl px-6 py-32">
        {/* PAGE HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="mb-4">
            <span className="text-sm uppercase tracking-[0.2em] text-purple-400 font-medium">
              Portfolio
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Projects
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-gray-400 leading-relaxed">
            A collection of technical projects spanning robotics, embedded systems,
            wireless networks, and AI. Each project demonstrates hands-on engineering
            experience and problem-solving across multiple domains.
          </p>
        </motion.header>

        {/* PROJECTS GRID */}
        <section className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const hasImage = project.images && project.images.length > 0 && project.images[0];

            return (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="group block h-full"
                >
                  <div className="relative h-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1">
                    {/* Image Section */}
                    <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-br from-purple-900/20 to-pink-900/20">
                      <ProjectImageSlideshow images={project.images} title={project.title} />

                      {/* Company Logos Badge (top right) */}
                      {project.companies?.enabled &&
                        project.companies?.list?.length > 0 && (
                          <div className="absolute top-4 right-4 flex gap-2 z-10">
                            {project.companies.list.slice(0, 2).map((company) => (
                              <div
                                key={company.name}
                                className="h-12 w-12 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 p-2 flex items-center justify-center"
                                title={company.name}
                              >
                                <img
                                  src={company.logo}
                                  alt={`${company.name} logo`}
                                  className="h-full w-full object-contain opacity-90"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Role Badge (top left) */}
                      {project.role?.position && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-500/30 text-purple-300">
                            {project.role.position}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className={`p-6 md:p-8 ${project.slug === "nephele-community-robot" ? "pb-36" : ""}`}>
                      {/* Title */}
                      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 group-hover:text-purple-300 transition-colors">
                        {project.title}
                      </h2>

                      {/* Description */}
                      <p className="text-gray-400 leading-relaxed mb-6 group-hover:text-gray-300 transition-colors">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-all"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
                  </div>
                </Link>

                {/* Nephele special buttons - positioned absolutely over the card */}
                {project.slug === "nephele-community-robot" && project.links?.demo && (
                  <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col gap-3">
                    <a
                      href={project.links.demo}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 bg-[length:200%_100%] animate-gradient text-white font-bold text-sm shadow-lg shadow-purple-500/40 hover:shadow-xl hover:shadow-purple-500/60 transition-all hover:scale-105"
                    >
                      <span>Talk with Nephele</span>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                    <Link
                      href={`/projects/${project.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <span>View details</span>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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