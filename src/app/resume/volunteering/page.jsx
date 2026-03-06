// src/app/resume/volunteering/page.jsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const volunteeringEntries = [
    // ── TOASTMASTERS – CLUB PRESIDENT ────────────────────────────────────────
    {
        id: "toastmasters-president",
        company: "Toastmasters International",
        logo: "/images/intern/toastmasters/logo.png",
        role: "Club President",
        type: "Part-time",
        duration: "Jan 2026 – Present",
        location: "",
        description: [
            "Leading the club as President, overseeing all operations and member development.",
            "Cultivating an inclusive environment that empowers members to grow as public speakers and leaders.",
        ],
        skills: ["Public Speaking", "Leadership"],
    },

    // ── TOASTMASTERS – VPPR ──────────────────────────────────────────────────
    {
        id: "toastmasters-vppr",
        company: "Toastmasters International",
        logo: "/images/intern/toastmasters/logo.png",
        role: "Vice President Public Relations (VPPR)",
        type: "Part-time",
        duration: "Jun 2023 – Dec 2023",
        location: "Chennai, Tamil Nadu, India · On-site",
        description: [
            "Led dynamic communication initiatives at TMI@EastCoast Toastmasters Club, promoting members' public speaking prowess.",
            "Crafted compelling narratives to showcase the club's achievements and shaped its public story.",
            "Contributed to TMI@EastCoast's vibrant and inclusive communication culture.",
        ],
        skills: ["Strategic Public Relations Planning", "Poster Design", "Public Speaking"],
    },

    // ── TOASTMASTERS – MEMBER ────────────────────────────────────────────────
    {
        id: "toastmasters-member",
        company: "Toastmasters International",
        logo: "/images/intern/toastmasters/logo.png",
        role: "Member",
        type: "Part-time",
        duration: "Jul 2022 – Present · 3 yrs 8 mos",
        location: "",
        description: [
            "Active member for over 3 years, continuously developing public speaking, leadership, and communication skills.",
            "Participated in table topics, prepared speeches, and evaluation contests.",
        ],
        skills: ["Public Speaking", "Leadership"],
    },
];

export default function VolunteeringPage() {
    return (
        <main className="mx-auto max-w-5xl px-4 sm:px-6 pt-24 pb-tab-safe">
            {/* ================= HEADER ================= */}
            <header className="mb-16">
                <p className="mb-4 text-sm uppercase tracking-widest text-gray-400">
                    Resume
                </p>
                <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                    Volunteering Work
                </h1>
                <p className="mt-6 max-w-3xl leading-relaxed text-gray-400">
                    Community involvement, leadership roles, and voluntary contributions beyond professional work.
                </p>
            </header>

            {/* ================= ENTRIES ================= */}
            <section className="space-y-16">
                {volunteeringEntries.map((entry, index) => (
                    <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="group rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
                    >
                        {/* Company Logo Header */}
                        <div className="relative h-32 bg-white/[0.02] flex items-center justify-center border-b border-white/10">
                            <img
                                src={entry.logo}
                                alt={`${entry.company} logo`}
                                className="h-16 w-auto object-contain"
                            />
                        </div>

                        {/* Content */}
                        <div className="p-5 sm:p-6 md:p-8">
                            <div className="mb-2 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                                <h2 className="text-2xl font-semibold text-white">
                                    {entry.company}
                                </h2>
                                <span className="text-sm text-gray-400">{entry.duration}</span>
                            </div>

                            <p className="mb-1 text-sm font-medium text-purple-300">
                                {entry.role}{entry.type && <span className="ml-2 text-gray-500 text-xs font-normal">· {entry.type}</span>}
                            </p>

                            {entry.location && (
                                <p className="mb-4 text-xs text-gray-500">{entry.location}</p>
                            )}

                            <ul className="list-disc space-y-2 pl-6 text-gray-400 mb-4">
                                {entry.description.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>

                            {/* Skills Tags */}
                            {entry.skills && entry.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {entry.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1 text-xs rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}
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
