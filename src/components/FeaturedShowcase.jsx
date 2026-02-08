"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Award, Trophy, Lightbulb, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { achievements, featuredAchievementSlugs } from "@/lib/achievements";
import { projects } from "@/lib/projects";

const achievementIconMap = {
    Innovation: Lightbulb,
    Hackathon: Trophy,
    Competition: Award,
    default: Award,
};

const featuredProjectSlugs = [
    "Birds-AI",
    "nephele-community-robot",
    "5g-network-implementation",
    "emotion-monitoring-system",
];

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
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="h-16 w-16 text-white/30 group-hover:text-white/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
            </>
        );
    }

    return (
        <>
            <AnimatePresence mode="wait">
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                />
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

export default function FeaturedShowcase() {
    const featuredAchievements = achievements;

    const featuredProjects = projects
        .filter((p) => featuredProjectSlugs.includes(p.slug))
        .slice(0, 4);

    return (
        <>
            {/* PROJECTS SECTION */}
            <section id="work" className="py-20 md:py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
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
                                    <div className="group relative h-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-white/30 hover:shadow-2xl hover:shadow-purple-500/20">
                                        {/* Image Section with Slideshow */}
                                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                                            <ProjectImageSlideshow images={project.images} title={project.title} />

                                            {project.companies?.enabled && project.companies?.list?.length > 0 && (
                                                <div className="absolute top-4 right-4 z-10 flex gap-2">
                                                    {project.companies.list.slice(0, 2).map((company) => (
                                                        <div
                                                            key={company.name}
                                                            className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/10 backdrop-blur-md border border-white/20 p-1.5"
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
                                        </div>

                                        <div className="p-6">
                                            <Link href={`/projects/${project.slug}`}>
                                                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors line-clamp-2">
                                                    {project.title}
                                                </h3>

                                                <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors line-clamp-3 mb-4">
                                                    {project.description}
                                                </p>
                                            </Link>

                                            {/* Special buttons for Nephele project */}
                                            {project.slug === "nephele-community-robot" && project.links?.demo ? (
                                                <div className="flex flex-col gap-3">
                                                    <a
                                                        href={project.links.demo}
                                                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 bg-[length:200%_100%] animate-gradient text-white font-bold text-sm shadow-lg shadow-purple-500/40 hover:shadow-xl hover:shadow-purple-500/60 transition-all hover:scale-105"
                                                    >
                                                        <span>Talk with Nephele</span>
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                        </svg>
                                                    </a>
                                                    <Link
                                                        href={`/projects/${project.slug}`}
                                                        className="inline-flex items-center justify-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                                                    >
                                                        <span>View details</span>
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            ) : (
                                                <Link
                                                    href={`/projects/${project.slug}`}
                                                    className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                                                >
                                                    <span>View details</span>
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </Link>
                                            )}
                                        </div>

                                        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
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
                                <div className="group relative h-full rounded-2xl border border-white/10 bg-white/[0.02] p-10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 flex flex-col items-center justify-center min-h-[350px]">
                                    <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20" />

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

                                    <h3 className="relative z-10 text-2xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                                        View All Projects
                                    </h3>

                                    <p className="relative z-10 text-gray-400 text-center group-hover:text-gray-300 transition-colors">
                                        Explore the complete portfolio with detailed case studies
                                    </p>

                                    <div className="relative z-10 mt-6 flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors">
                                        <span className="text-sm font-medium">See all</span>
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ACHIEVEMENTS SECTION */}
            <section id="achievements" className="py-20 md:py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <motion.header
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-16"
                    >
                        <p className="text-sm uppercase tracking-widest text-gray-400 mb-4">
                            Recognition & Awards
                        </p>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                            Achievements
                        </h2>
                        <p className="mt-4 max-w-2xl text-gray-400">
                            Competitive achievements and awards recognizing innovation,
                            problem-solving excellence, and technical leadership.
                        </p>
                    </motion.header>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {featuredAchievements.slice(0, 3).map((achievement, index) => {
                            const IconComponent =
                                achievementIconMap[achievement.category] ||
                                achievementIconMap.default;

                            return (
                                <motion.div
                                    key={achievement.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ y: -8 }}
                                >
                                    <Link href={`/achievements/${achievement.slug}`}>
                                        <div className="group relative h-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-white/30 hover:shadow-2xl hover:shadow-blue-500/20">
                                            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-900/20 to-cyan-900/20">
                                                {achievement.images && achievement.images.length > 0 && achievement.images[0] ? (
                                                    <>
                                                        <img
                                                            src={achievement.images[0]}
                                                            alt={achievement.title}
                                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-50" />
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <IconComponent className="h-16 w-16 text-white/30 group-hover:text-white/50 transition-colors" />
                                                        </div>
                                                    </>
                                                )}

                                                <div className="absolute top-4 right-4 z-10">
                                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white">
                                                        {achievement.category}
                                                    </span>
                                                </div>

                                                <div className="absolute top-4 left-4 z-10">
                                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-500/30 text-blue-300">
                                                        {achievement.year}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors line-clamp-2">
                                                    {achievement.title}
                                                </h3>

                                                <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors line-clamp-3">
                                                    {achievement.shortDescription}
                                                </p>
                                            </div>

                                            <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-blue-500/10 to-cyan-500/10" />
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            whileHover={{ y: -8 }}
                            className="md:col-span-2 lg:col-span-1"
                        >
                            <Link href="/achievements">
                                <div className="group relative h-full rounded-2xl border border-white/10 bg-white/[0.02] p-10 hover:border-blue-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 flex flex-col items-center justify-center min-h-[350px]">
                                    <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-blue-500/20 to-cyan-500/20" />

                                    <div className="relative z-10 mb-6 h-20 w-20 rounded-full bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition-all">
                                        <Award className="h-10 w-10 text-blue-400 group-hover:text-blue-300 transition-colors" />
                                    </div>

                                    <h3 className="relative z-10 text-2xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">
                                        View All Achievements
                                    </h3>

                                    <p className="relative z-10 text-gray-400 text-center group-hover:text-gray-300 transition-colors">
                                        Explore all competitive achievements and awards
                                    </p>

                                    <div className="relative z-10 mt-6 flex items-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors">
                                        <span className="text-sm font-medium">See all</span>
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
}
