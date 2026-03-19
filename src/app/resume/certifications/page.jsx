// src/app/resume/certifications/page.jsx
"use client";

import { motion } from "framer-motion";
import { ExternalLink, BadgeCheck, Calendar } from "lucide-react";

const certifications = [
  {
    id: "cisco-networking",
    title: "Networking Basics",
    issuer: "Cisco",
    issuerShort: "Cisco",
    logo: "/images/certifications/cisco-logo.png",
    badge: "/images/certifications/cisco-badge.png",
    issueDate: "Jan 2025",
    credentialUrl: "https://www.credly.com/badges/30c43656-aa39-469c-b329-f451b9fb5e52/linked_in_profile",
    skills: [],
    description: "Foundational knowledge in networking concepts, protocols, and technologies.",
    accent: "from-blue-500/20 to-cyan-500/5",
    darkLogoBg: false,
  },
  {
    id: "dadb-5g",
    title: "5G Communication Technology",
    issuer: "DADB – German Academy of Digital Education",
    issuerShort: "DADB",
    logo: "/images/certifications/dadb-logo.png",
    badge: "/images/certifications/dadb-badge.png",
    issueDate: "May 2024",
    credentialUrl: "https://certificates.dadb.com/972500ed-dbda-4072-b68c-3816936e31da?key=7b805f21aa8724a36dc1f755c31f5416c608e282b092d5195b674fc7932f66af#acc.saZzY5Pb",
    skills: ["Embedded Linux", "5G"],
    description: "Comprehensive understanding of 5G communication systems and technologies.",
    accent: "from-purple-500/20 to-fuchsia-500/5",
    darkLogoBg: true,
  },
];

export default function CertificationsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 pt-24 pb-tab-safe">

      {/* ── HEADER ── */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <p className="mb-3 text-sm uppercase tracking-widest text-purple-400 font-medium">
          Resume
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Certifications
        </h1>
        <p className="mt-4 max-w-2xl text-gray-400 leading-relaxed">
          Industry-recognized certifications in networking and emerging technologies.
        </p>
      </motion.header>

      {/* ── CARDS ── */}
      <div className="space-y-6">
        {certifications.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
          >
            {/* gradient accent header */}
            <div className={`relative flex items-center justify-between gap-6 p-6 bg-gradient-to-r ${cert.accent} border-b border-white/10`}>
              {/* left: logo + meta */}
              <div className="flex items-center gap-5 min-w-0">
                <div className={`w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center p-2.5 shadow-lg ring-1 ring-white/10 ${cert.darkLogoBg ? "bg-white" : "bg-white/10 backdrop-blur-sm"}`}>
                  <img
                    src={cert.logo}
                    alt={`${cert.issuer} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                      {cert.issuerShort}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-gray-500">
                      <Calendar size={9} />
                      {cert.issueDate}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors leading-snug">
                    {cert.title}
                  </h2>
                  <p className="text-sm text-gray-400 mt-0.5 truncate">{cert.issuer}</p>
                </div>
              </div>

              {/* right: badge */}
              {cert.badge && (
                <div className="flex-shrink-0">
                  <img
                    src={cert.badge}
                    alt={`${cert.title} badge`}
                    className="w-20 h-20 object-contain drop-shadow-xl"
                  />
                </div>
              )}
            </div>

            {/* card body */}
            <div className="p-6 bg-white/[0.02] space-y-5">

              {/* description */}
              <p className="text-gray-400 leading-relaxed">{cert.description}</p>

              {/* skills */}
              {cert.skills && cert.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {cert.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 text-xs rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* credential link */}
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400/50 transition-all group/btn"
              >
                <BadgeCheck size={15} />
                Show Credential
                <ExternalLink size={12} className="opacity-50 group-hover/btn:opacity-100 transition-opacity" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
