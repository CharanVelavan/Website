// src/app/resume/certifications/page.jsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
        description: "Foundational knowledge in networking concepts, protocols, and technologies.",
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
        description: "Comprehensive understanding of 5G communication systems and technologies.",
    },
];

export default function CertificationsPage() {
    return (
        <main className="mx-auto max-w-5xl px-6 py-12">
            {/* ================= HEADER ================= */}
            <header className="mb-16">
                <p className="mb-4 text-sm uppercase tracking-widest text-gray-400">
                    Resume
                </p>
                <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                    Certifications
                </h1>
                <p className="mt-6 max-w-3xl leading-relaxed text-gray-400">
                    Industry-recognized certifications in networking and emerging technologies.
                </p>
            </header>

            {/* ================= CERTIFICATIONS ================= */}
            <section className="space-y-16">
                {certifications.map((cert, index) => (
                    <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="group rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
                    >
                        {/* Logo Header */}
                        <div className="relative h-32 bg-white/[0.02] flex items-center justify-between px-8 border-b border-white/10">
                            <img
                                src={cert.logo}
                                alt={`${cert.issuer} logo`}
                                className="h-12 w-auto object-contain"
                            />
                            {cert.badge && (
                                <img
                                    src={cert.badge}
                                    alt={`${cert.title} badge`}
                                    className="h-20 w-20 object-contain"
                                />
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                                <h2 className="text-2xl font-semibold text-white">
                                    {cert.title}
                                </h2>
                                <span className="text-sm text-gray-400">Issued {cert.issueDate}</span>
                            </div>

                            <p className="mb-6 text-sm uppercase tracking-widest text-gray-400">
                                {cert.issuer}
                            </p>

                            {cert.description && (
                                <p className="text-gray-400 leading-relaxed mb-6">
                                    {cert.description}
                                </p>
                            )}

                            {/* Skills */}
                            {cert.skills && cert.skills.length > 0 && (
                                <div className="mb-6 flex flex-wrap gap-2">
                                    <span className="text-sm text-gray-500">Skills:</span>
                                    {cert.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1 text-sm rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300"
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
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all"
                            >
                                <span>Show credential</span>
                                <ExternalLink size={16} />
                            </a>
                        </div>
                    </motion.div>
                ))}
            </section>

            {/* ================= BACK LINK ================= */}
            <div className="mt-24">
                <Link
                    href="/resume"
                    className="text-sm text-gray-400 transition hover:text-white"
                >
                    ← Back to Resume
                </Link>
            </div>
        </main>
    );
}
