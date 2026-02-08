// src/app/achievements/page.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { achievements } from "@/lib/achievements";
import { Award, Trophy, Users, Lightbulb } from "lucide-react";

const iconMap = {
    Innovation: Lightbulb,
    Hackathon: Trophy,
    Competition: Award,
    default: Award,
};

export default function AchievementsPage() {
    return (
        <div className="relative">
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
                        <span className="text-sm uppercase tracking-[0.2em] text-blue-400 font-medium">
                            Recognition
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Achievements & Awards
                    </h1>
                    <p className="mt-6 max-w-3xl text-lg text-gray-400 leading-relaxed">
                        Recognition and awards received for innovation, technical excellence,
                        and competitive achievements in hackathons, innovation challenges, and
                        national competitions. Each achievement represents dedication to
                        solving real-world problems through technology.
                    </p>
                </motion.header>

                {/* ACHIEVEMENTS GRID */}
                <section className="grid md:grid-cols-2 gap-8">
                    {achievements.map((achievement, index) => {
                        const IconComponent = iconMap[achievement.category] || iconMap.default;
                        const hasImage = achievement.images && achievement.images.length > 0 && achievement.images[0];

                        return (
                            <motion.div
                                key={achievement.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link
                                    href={`/achievements/${achievement.slug}`}
                                    className="group block h-full"
                                >
                                    <div className="relative h-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
                                        {/* Image Section */}
                                        <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-br from-blue-900/20 to-cyan-900/20">
                                            {hasImage ? (
                                                <>
                                                    {/* Actual Image */}
                                                    <Image
                                                        src={achievement.images[0]}
                                                        alt={achievement.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    {/* Gradient Overlay for better text readability */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
                                                </>
                                            ) : (
                                                <>
                                                    {/* Placeholder gradient */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-50" />
                                                    {/* Icon Overlay */}
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <IconComponent className="h-20 w-20 text-white/30 group-hover:text-white/50 transition-colors" />
                                                    </div>
                                                </>
                                            )}

                                            {/* Category Badge */}
                                            <div className="absolute top-4 right-4 z-10">
                                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white">
                                                    {achievement.category}
                                                </span>
                                            </div>

                                            {/* Year Badge */}
                                            <div className="absolute top-4 left-4 z-10">
                                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-500/30 text-blue-300">
                                                    {achievement.year}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-6 md:p-8">
                                            {/* Title */}
                                            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 group-hover:text-blue-300 transition-colors">
                                                {achievement.title}
                                            </h2>

                                            {/* Description */}
                                            <p className="text-gray-400 leading-relaxed mb-6 group-hover:text-gray-300 transition-colors">
                                                {achievement.shortDescription}
                                            </p>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {achievement.tags.slice(0, 3).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="text-xs px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-all"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Read More Link */}
                                            <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-blue-300 transition-colors">
                                                <span>Read full story</span>
                                                <svg
                                                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
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

                                        {/* Hover Glow Effect */}
                                        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-blue-500/10 to-cyan-500/10" />
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </section>
            </main>
        </div>
    );
}
