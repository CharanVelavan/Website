// src/components/Certifications.jsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const certifications = [
    {
        id: "cisco-networking",
        title: "Networking Basics",
        issuer: "Cisco",
        logo: "/images/certifications/cisco-logo.png",
        badge: "/images/certifications/cisco-badge.png",
        issueDate: "Jan 2025",
        credentialUrl: "https://www.credly.com/badges/30c43656-aa39-469c-b329-f451b9fb5e52/linked_in_profile",
        skills: [],
    },
    {
        id: "dadb-5g",
        title: "5G Communication Technology",
        issuer: "DADB - German Academy of Digital Education",
        logo: "/images/certifications/dadb-logo.png",
        badge: "/images/certifications/dadb-badge.png",
        issueDate: "May 2024",
        credentialUrl: "https://certificates.dadb.com/972500ed-dbda-4072-b68c-3816936e31da?key=7b805f21aa8724a36dc1f755c31f5416c608e282b092d5195b674fc7932f66af#acc.saZzY5Pb",
        skills: ["Embedded Linux", "5G"],
    },
];

const cardVariants = {
    rest: {
        y: 0,
        boxShadow: "0 0 0 rgba(0,0,0,0)",
    },
    hover: {
        y: -8,
        boxShadow: "0 20px 40px rgba(0,0,0,0.35), 0 0 40px rgba(168,85,247,0.35)",
        borderColor: "rgba(168,85,247,0.6)",
        transition: { duration: 0.35, ease: "easeOut" },
    },
};

export default function Certifications() {
    return (
        <section id="certifications" className="py-20 md:py-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* ================= HEADER ================= */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <p className="mb-3 text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400">
                        Professional Development
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Certifications
                    </h2>
                    <p className="mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
                        Industry-recognized certifications in networking and emerging technologies.
                    </p>
                </motion.header>

                {/* ================= TILES ================= */}
                <div className="grid gap-6 md:grid-cols-2">
                    {certifications.map((cert, index) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            variants={cardVariants}
                            whileHover="hover"
                            animate="rest"
                            className="cursor-pointer rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0b0b] p-6 overflow-hidden hover:border-purple-500/60 transition-colors"
                        >
                            {/* Logo and Badge */}
                            <div className="flex items-start justify-between mb-4">
                                <img
                                    src={cert.logo}
                                    alt={`${cert.issuer} logo`}
                                    className="h-10 w-auto object-contain"
                                />
                                {cert.badge && (
                                    <img
                                        src={cert.badge}
                                        alt={`${cert.title} badge`}
                                        className="h-16 w-16 object-contain"
                                    />
                                )}
                            </div>

                            {/* Title */}
                            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                {cert.title}
                            </h3>

                            {/* Issuer */}
                            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">{cert.issuer}</p>

                            {/* Issue Date */}
                            <p className="mb-4 text-xs uppercase tracking-widest text-gray-500">
                                Issued {cert.issueDate}
                            </p>

                            {/* Skills */}
                            {cert.skills && cert.skills.length > 0 && (
                                <div className="mb-4 flex flex-wrap gap-2">
                                    {cert.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1 text-xs rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-300"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Credential Link */}
                            <a
                                href={cert.credentialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-purple-500 dark:text-purple-400 hover:text-purple-400 dark:hover:text-purple-300 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <span>Show credential</span>
                                <ExternalLink size={14} />
                            </a>
                        </motion.div>
                    ))}
                </div>

                {/* View All Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 text-center"
                >
                    <Link
                        href="/resume/certifications"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <span>View all certifications</span>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
