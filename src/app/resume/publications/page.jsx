// src/app/resume/publications/page.jsx
"use client";

import { motion } from "framer-motion";
import { ExternalLink, BookOpen, Calendar } from "lucide-react";

const publications = [
  {
    id: "icoei-2025",
    number: "01",
    logo: "/images/publications/icoei-logo.png",
    logoNeedsWhiteBg: true,
    date: "Jan 2025",
    status: "Published",
    statusColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    title: "5G and Edge Computing Enabled Search and Rescue Drones",
    venue: "IEEE 8th International Conference on Trends in Electronics and Informatics (ICOEI 2025)",
    venueShort: "IEEE ICOEI 2025",
    abstract:
      "This work showcases the integral roles of AI, edge computing, and 5G in search and rescue operations during disaster response. The deployed YOLOv8n model was trained on both color and monochrome images to enhance performance in complex environments. A Raspberry Pi 5 Model B with a Hailo AI Kit enables cost-effective, low-latency real-time inferencing of live camera feeds, while the 5G network's URLLC and eMBB support high-resolution streaming and low-latency communication. AWS S3 provides cloud storage for data review and detections.",
    link: "/papers/5G_and_Edge_Computing_Enabled_Search_and_Rescue_Drones.pdf",
    tags: ["5G", "Edge AI", "YOLOv8", "Hailo", "Disaster Response"],
    accent: "from-blue-500/15 to-cyan-500/5",
  },
  {
    id: "journal-optics-2025",
    number: "02",
    logo: "/images/publications/springer-logo.png",
    logoNeedsWhiteBg: true,
    date: "Sep 2025",
    status: "Published",
    statusColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    title: "Design and Implementation of Miniaturized Dual-Mode Terahertz Bandpass Filter Based on Swastik Slotted Fractals",
    venue: "Journal of Optics (Springer)",
    venueShort: "Springer – Journal of Optics",
    abstract:
      "This article presents the design of a miniaturized bandpass filter featuring a square patch perturbed microstrip resonator configuration with Swastik fractal slots for applications in the terahertz regime. The dual-mode filter demonstrates two transmission zeros on the passband edges, leading to substantial improvement in selectivity. Measuring 8 × 8 µm², the filter demonstrates notable performance at 3.88 THz with a return loss exceeding 38.32 dB and a low insertion loss of 1.63 dB.",
    link: "/papers/SSN PAPER.pdf",
    tags: ["Terahertz", "Bandpass Filter", "Fractal Geometry", "CST Studio", "RF Design"],
    accent: "from-purple-500/15 to-fuchsia-500/5",
  },
];

export default function PublicationsPage() {
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
          Research
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Publications
        </h1>
        <p className="mt-4 max-w-2xl text-gray-400 leading-relaxed">
          Peer-reviewed research publications in AI-enabled disaster response,
          5G communications, edge computing, and terahertz RF circuit design.
        </p>
      </motion.header>

      {/* ── PAPERS ── */}
      <div className="space-y-8">
        {publications.map((pub, index) => (
          <motion.div
            key={pub.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
          >
            {/* gradient header */}
            <div className={`relative flex items-center justify-between gap-5 p-5 sm:p-6 bg-gradient-to-r ${pub.accent} border-b border-white/10`}>
              {/* left: number + logo + venue */}
              <div className="flex items-center gap-4 min-w-0">
                {/* paper number */}
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-400 font-mono">{pub.number}</span>
                </div>
                {/* logo */}
                <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center p-2 shadow-md ring-1 ring-white/10 ${pub.logoNeedsWhiteBg ? "bg-white" : "bg-white/10"}`}>
                  <img
                    src={pub.logo}
                    alt={pub.venueShort}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 truncate">
                    {pub.venueShort}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-[11px] text-gray-500">
                      <Calendar size={9} />
                      {pub.date}
                    </span>
                    <span className={`text-[11px] rounded-full border px-2.5 py-0.5 font-medium ${pub.statusColor}`}>
                      {pub.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* card body */}
            <div className="p-5 sm:p-6 bg-white/[0.02] space-y-5">

              {/* title */}
              <h2 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors leading-snug">
                {pub.title}
              </h2>

              {/* full venue */}
              <p className="text-xs uppercase tracking-widest text-gray-500">{pub.venue}</p>

              {/* abstract */}
              <div className="rounded-xl bg-white/[0.03] border border-white/8 p-4">
                <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1.5">
                  <BookOpen size={11} />
                  Abstract
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">{pub.abstract}</p>
              </div>

              {/* tags */}
              <div className="flex flex-wrap gap-2">
                {pub.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 text-[11px] rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300">
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              {pub.link && (
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400/50 transition-all group/btn"
                >
                  Read Paper
                  <ExternalLink size={13} className="opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
