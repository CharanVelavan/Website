"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { projects } from "@/lib/projects";

// Choose which projects to feature on the Home page
const featuredSlugs = [
  "Birds-AI",
  "nephele-community-robot",
  "5g-network-implementation",
  "emotion-monitoring-system",
  "thz-bandpass-filter",
];

export default function Work() {
  const featuredProjects = projects.filter((p) =>
    featuredSlugs.includes(p.slug)
  );

  return (
    <section id="work" className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* SECTION HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-sm uppercase tracking-widest text-gray-400 mb-4">
            Selected Work
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Projects & Systems
          </h2>
          <p className="mt-4 max-w-2xl text-gray-400">
            A curated selection of hands-on projects focused on AI-enabled
            systems, next-generation wireless networks, and real-world
            deployments.
          </p>
        </motion.header>

        {/* WORK GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuredProjects.map((project, index) => {
            const externalLink = project.links?.demo || project.links?.report;

            return (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="group relative h-full rounded-2xl border border-white/10 bg-white/[0.02] p-8 hover:border-white/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
                  {/* Hover glow */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />

                  <Link href={`/projects/${project.slug}`}>
                    <h3 className="text-xl font-semibold mb-4 relative z-10 text-white group-hover:text-purple-300 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-gray-400 leading-relaxed mb-6 relative z-10 group-hover:text-gray-300 transition-colors">
                      {project.description}
                    </p>
                  </Link>

                  {/* COMPANY LOGOS */}
                  {project.companies?.enabled && project.companies?.list?.length > 0 && (
                    <div className="flex items-center gap-3 flex-wrap mb-6 relative z-10">
                      {project.companies.list.map((company) => (
                        <div
                          key={company.name}
                          className="h-8 w-auto flex items-center justify-center rounded-lg bg-white/10 p-2 transition-all group-hover:bg-white/20"
                          title={company.name}
                        >
                          <img
                            src={company.logo}
                            alt={`${company.name} logo`}
                            className="h-full w-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* SINGLE ACTION BUTTON */}
                  {externalLink && (
                    <a
                      href={externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm px-4 py-2 rounded-full border border-white/20 text-gray-300 hover:text-white hover:border-purple-400 hover:bg-purple-400/10 transition-all relative z-10"
                    >
                      View demo / report
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* VIEW ALL PROJECTS TILE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: featuredProjects.length * 0.1 }}
            whileHover={{ y: -8 }}
          >
            <Link href="/projects">
              <div className="group relative h-full rounded-2xl border border-white/10 bg-white/[0.02] p-8 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 flex flex-col items-center justify-center min-h-[300px]">
                {/* Hover glow */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20" />

                {/* Icon */}
                <div className="relative z-10 mb-6 h-20 w-20 rounded-full bg-purple-500/10 border-2 border-purple-500/30 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:border-purple-500/50 transition-all">
                  <svg
                    className="h-10 w-10 text-purple-400 group-hover:text-purple-300 transition-colors"
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

                {/* Text */}
                <h3 className="relative z-10 text-2xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                  View All Projects
                </h3>

                <p className="relative z-10 text-gray-400 text-center group-hover:text-gray-300 transition-colors">
                  Explore the complete portfolio with detailed case studies
                </p>

                {/* Arrow */}
                <div className="relative z-10 mt-6 flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors">
                  <span className="text-sm font-medium">See all</span>
                  <svg
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}