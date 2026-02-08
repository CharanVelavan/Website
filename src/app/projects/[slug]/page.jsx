// src/app/projects/[slug]/page.jsx
"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getProjectBySlug } from "@/lib/projects";
import { useParams } from "next/navigation";
import ProjectsTimeline from "@/components/ProjectsTimeline";
import CompaniesSection from "@/components/CompaniesSection";
import ImageGallery from "@/components/ImageGallery";
import ImageZoomModal from "@/components/ImageZoomModal";

export default function ProjectSlugPage() {
  const params = useParams();
  const slug = params?.slug;

  const project = getProjectBySlug(slug);
  if (!project) return notFound();

  const externalLink = project.links?.demo || project.links?.report;

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-24">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr] xl:grid-cols-[280px_1fr_240px] xl:gap-6">
        {/* ================= LEFT SIDEBAR (Timeline) ================= */}
        <ProjectsTimeline />

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

            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              {project.title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-400">
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
                  : "border border-white/10 bg-white/5 text-gray-300 hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-white hover:shadow-lg hover:shadow-purple-500/20"
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
          <section className="space-y-20">
            {/* IMAGE GALLERY */}
            {project.images && project.images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="mb-6 text-2xl font-semibold text-white flex items-center gap-2">
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
                <h2 className="mb-6 text-2xl font-semibold text-white flex items-center gap-2">
                  <span className="text-purple-400">🎬</span>
                  Project Media
                </h2>

                {/* Videos Section - Support both single video and array of videos */}
                {(project.media.video || project.media.videos) && (
                  <div className="mb-10 grid gap-6 md:grid-cols-2">
                    {/* Handle single video (backward compatibility) */}
                    {project.media.video && !project.media.videos && (
                      <div
                        className={`overflow-hidden rounded-2xl border border-white/10 bg-black/50 ${project.media.video.src === "/videos/Linkein.mp4"
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
                          <p className="mt-2 text-sm text-gray-400 italic text-center">
                            {project.media.video.caption}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Handle multiple videos */}
                    {project.media.videos && project.media.videos.map((video, index) => (
                      <div
                        key={index}
                        className={`overflow-hidden rounded-2xl border border-white/10 bg-black/50 ${video.aspectRatio === "portrait" || video.src === "/videos/Linkein.mp4"
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
                          <p className="mt-2 text-sm text-gray-400 italic text-center px-4">
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
                          className="rounded-xl border border-white/10"
                        />
                        {img.caption && (
                          <figcaption className="mt-2 text-sm text-gray-400">
                            {img.caption}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* METRICS */}
            {project.metrics?.enabled && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="mb-6 text-2xl font-semibold text-white flex items-center gap-2">
                  <span className="text-purple-400">📊</span>
                  Results & Impact
                </h2>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {project.metrics.results.map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-6 transition hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/20"
                    >
                      <div className="mb-4 bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-4xl font-bold text-transparent">
                        {metric.value}
                      </div>

                      <div className="mb-3 text-sm uppercase tracking-widest text-gray-300 font-medium">
                        {metric.label}
                      </div>

                      <p className="text-sm text-gray-400 leading-relaxed">
                        {metric.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
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
                <h2 className="mb-6 text-2xl font-semibold text-white flex items-center gap-2">
                  <span className="text-purple-400">👤</span>
                  My Role & Contributions
                </h2>

                <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-8">
                  <p className="mb-6 text-lg font-medium text-white">
                    {project.role.position}
                  </p>

                  <div className="mb-8">
                    <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-4">
                      Key Responsibilities
                    </h3>
                    <ul className="space-y-3">
                      {project.role.responsibilities.map((item, index) => (
                        <li key={index} className="flex gap-3 text-gray-300 leading-relaxed">
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
                <h2 className="mb-6 text-2xl font-semibold text-white flex items-center gap-2">
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
              <h2 className="mb-4 text-2xl font-semibold text-white">Problem</h2>
              <p className="leading-relaxed text-gray-400 whitespace-pre-line">
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
              <h2 className="mb-4 text-2xl font-semibold text-white">Approach</h2>
              {Array.isArray(project.details.approach) ? (
                <ul className="space-y-3">
                  {project.details.approach.map((item, index) => (
                    <li key={index} className="flex gap-3 text-gray-400 leading-relaxed">
                      <span className="text-purple-400 mt-1 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="leading-relaxed text-gray-400 whitespace-pre-line">
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
              <h2 className="mb-4 text-2xl font-semibold text-white">Outcome</h2>
              {Array.isArray(project.details.outcome) ? (
                <ul className="space-y-3">
                  {project.details.outcome.map((item, index) => (
                    <li key={index} className="flex gap-3 text-gray-400 leading-relaxed">
                      <span className="text-purple-400 mt-1 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="leading-relaxed text-gray-400 whitespace-pre-line">
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
              <h2 className="mb-4 text-2xl font-semibold text-white">Tech Stack</h2>
              <div className="flex flex-wrap gap-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-4 py-1 text-sm text-gray-300 hover:border-purple-500/40 hover:bg-purple-500/5 transition"
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
            className="mt-16 pt-8 border-t border-white/10 text-center"
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