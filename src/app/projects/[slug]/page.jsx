// src/app/projects/[slug]/page.jsx
"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getProjectBySlug, projects } from "@/lib/projects";
import { useParams } from "next/navigation";
import Timeline from "@/components/Timeline";
import CompaniesSection from "@/components/CompaniesSection";
import ImageGallery from "@/components/ImageGallery";
import ImageZoomModal from "@/components/ImageZoomModal";
import GlowCard from "@/components/GlowCard";

export default function ProjectSlugPage() {
  const params = useParams();
  const slug = params?.slug;

  const project = getProjectBySlug(slug);
  if (!project) return notFound();

  const externalLink = project.links?.demo || project.links?.report;

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 pt-28 pb-tab-safe lg:py-24">
      {/* MOBILE STICKY BACK BAR + horizontal project strip — hidden on desktop */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[70] bg-[#f8f7f4]/95 dark:bg-black/85 backdrop-blur-md border-b border-black/10 dark:border-white/10">
        {/* Back row */}
        <div className="flex items-center gap-3 px-4 py-2.5">
          <Link
            href="/projects"
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors flex-shrink-0"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Projects</span>
          </Link>
          <span className="text-black/20 dark:text-white/20">›</span>
          <span className="text-sm text-purple-500 dark:text-purple-400 font-medium truncate">{project.title}</span>
        </div>
        {/* Horizontal project nav strip */}
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-2.5 snap-x-mandatory">
            {projects.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className={`snap-start flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all ${p.slug === project.slug
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 font-semibold'
                    : 'border-white/10 text-gray-400 hover:border-purple-500/30 hover:text-white'
                  }`}
              >
                {p.title.split("–")[0].split("—")[0].trim()}
              </Link>
            ))}
          </div>
          {/* Right-edge fade — visual cue that more items are scrollable */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#f8f7f4]/95 dark:from-black/85 to-transparent" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr] xl:grid-cols-[280px_1fr_240px] xl:gap-6">
        {/* ================= LEFT SIDEBAR (Timeline) ================= */}
        <Timeline items={projects} basePath="/projects" accent="purple" title="Projects" />

        {/* ================= MAIN CONTENT ================= */}
        <main className="w-full max-w-4xl min-w-0">
          {/* BACK BUTTON */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Projects</span>
            </Link>
          </motion.div>

          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gray-500">Project</p>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
              {project.title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              {project.summary}
            </p>

            {externalLink && (
              <motion.a
                href={externalLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mt-8 inline-flex items-center gap-3 rounded-xl px-8 py-4 text-base font-bold backdrop-blur-sm transition-all ${project.links?.customButtonText
                  ? "bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 bg-[length:200%_100%] animate-gradient text-white shadow-xl shadow-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/60 border-2 border-purple-400/50"
                  : "border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-gray-900 dark:hover:text-white hover:shadow-lg hover:shadow-purple-500/20"
                  }`}
              >
                <span>{project.links?.customButtonText || "View Project"}</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.a>
            )}
          </motion.header>

          {/* ================= CONTENT ================= */}
          <section className="space-y-12 md:space-y-20">
            {/* RECOGNITION BANNER — links to achievements earned via this project */}
            {project.recognition?.enabled && project.recognition.achievements?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 via-yellow-500/5 to-amber-500/5 p-5 md:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                      <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-widest text-amber-400/80 font-medium mb-2">Recognition</p>
                    <div className="flex flex-wrap gap-2">
                      {project.recognition.achievements.map((ach) => (
                        <Link
                          key={ach.slug}
                          href={`/achievements/${ach.slug}`}
                          className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/15 transition-all"
                        >
                          <span className="text-sm font-medium text-amber-700 dark:text-amber-200 group-hover:text-amber-800 dark:group-hover:text-amber-100 transition-colors">{ach.title}</span>
                          <svg className="h-3.5 w-3.5 text-amber-400/60 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* METRICS — first thing visible, before any scrolling */}
            {project.metrics?.enabled && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  {project.metrics.results.map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.08 }}
                      whileHover={{ scale: 1.03 }}
                    >
                      <GlowCard borderRadius={12}>
                        <div className="p-5 md:p-6">
                          <div className="mb-2 bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-3xl md:text-4xl font-bold text-transparent leading-none">
                            {metric.value}
                          </div>
                          <div className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-medium mb-2">
                            {metric.label}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed hidden sm:block">
                            {metric.description}
                          </p>
                        </div>
                      </GlowCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* IMAGE GALLERY */}
            {project.images && project.images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-purple-400">📸</span>
                  Project Gallery
                </h2>
                <ImageGallery images={project.images} title={project.title} />
              </motion.div>
            )}

            {/* MEDIA */}
            {project.media?.enabled && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-purple-400">🎬</span>
                  Project Media
                </h2>

                {/* Videos Section - Support both single video and array of videos */}
                {(project.media.video || project.media.videos) && (
                  <div className="mb-10 grid gap-6 md:grid-cols-2">
                    {/* Handle single video (backward compatibility) */}
                    {project.media.video && !project.media.videos && (
                      <div
                        className={`overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/50 ${project.media.video.src === "/videos/Linkein.mp4"
                          ? "w-full max-w-[360px] mx-auto aspect-[9/16]" // Portrait: smaller, maintains 9:16 ratio
                          : "col-span-full aspect-video" // Landscape: full width
                          }`}
                      >
                        <video
                          src={project.media.video.src}
                          controls
                          playsInline
                          className="h-full w-full object-contain"
                        />
                        {project.media.video.caption && (
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic text-center">
                            {project.media.video.caption}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Handle multiple videos */}
                    {project.media.videos && project.media.videos.map((video, index) => (
                      <div
                        key={index}
                        className={`overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-black/50 ${video.aspectRatio === "portrait" || video.src === "/videos/Linkein.mp4"
                          ? "w-full max-w-[360px] mx-auto aspect-[9/16]" // Portrait: smaller, maintains 9:16 ratio
                          : "aspect-video" // Landscape: 16:9 ratio
                          } ${video.aspectRatio === "landscape" ? "col-span-full md:col-span-1" : ""
                          }`}
                      >
                        <video
                          src={video.src}
                          controls
                          playsInline
                          className="h-full w-full object-contain"
                        />
                        {video.caption && (
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic text-center px-4">
                            {video.caption}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Images Section */}
                {project.media.images && (
                  <div className="grid gap-6 md:grid-cols-2">
                    {project.media.images.map((img) => (
                      <figure key={img.src}>
                        <img
                          src={img.src}
                          alt={img.alt}
                          className="rounded-xl border border-black/10 dark:border-white/10"
                        />
                        {img.caption && (
                          <figcaption className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {img.caption}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ROLE */}
            {project.role?.enabled && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-purple-400">👤</span>
                  My Role & Contributions
                </h2>

                <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-8">
                  <p className="mb-6 text-lg font-medium text-gray-900 dark:text-white">
                    {project.role.position}
                  </p>

                  <div className="mb-8">
                    <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-4">
                      Key Responsibilities
                    </h3>
                    <ul className="space-y-3">
                      {project.role.responsibilities.map((item, index) => (
                        <li key={index} className="flex gap-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                          <span className="text-purple-400 mt-1 flex-shrink-0">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {project.role.technologies && project.role.technologies.length > 0 && (
                    <div>
                      <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-4">
                        Technologies Used
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.role.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ARCHITECTURE */}
            {project.architecture?.enabled && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-purple-400">🏗️</span>
                  System Architecture
                </h2>
                <ImageZoomModal
                  src={project.architecture.diagram}
                  alt="System Architecture Diagram"
                  caption={project.architecture.caption}
                />
              </motion.div>
            )}

            {/* PROBLEM */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">Problem</h2>
              <p className="leading-relaxed text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {project.details.problem}
              </p>
            </motion.div>

            {/* APPROACH */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">Approach</h2>
              {Array.isArray(project.details.approach) ? (
                <ul className="space-y-3">
                  {project.details.approach.map((item, index) => (
                    <li key={index} className="flex gap-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                      <span className="text-purple-400 mt-1 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="leading-relaxed text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {project.details.approach}
                </p>
              )}
            </motion.div>

            {/* OUTCOME */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">Outcome</h2>
              {Array.isArray(project.details.outcome) ? (
                <ul className="space-y-3">
                  {project.details.outcome.map((item, index) => (
                    <li key={index} className="flex gap-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                      <span className="text-purple-400 mt-1 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="leading-relaxed text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {project.details.outcome}
                </p>
              )}
            </motion.div>

            {/* TECH STACK */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">Tech Stack</h2>
              <div className="flex flex-wrap gap-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-black/10 dark:border-white/10 px-4 py-1 text-sm text-gray-600 dark:text-gray-300 hover:border-purple-500/40 hover:bg-purple-500/5 transition"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </section>

          {/* BACK TO TOP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-16 pt-8 border-t border-black/10 dark:border-white/10 text-center"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to All Projects</span>
            </Link>
          </motion.div>
        </main>

        {/* ================= RIGHT SIDEBAR (Companies) ================= */}
        <CompaniesSection companies={project.companies} />
      </div>
    </div>
  );
}