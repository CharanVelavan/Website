// src/components/Publications.jsx
"use client";

import { motion } from "framer-motion";
import { FileText, ExternalLink, Calendar, Award } from "lucide-react";

const publications = [
  {
    date: "Jan 2025",
    status: "Published",
    title:
      "5G and Edge Computing Enabled Search and Rescue Drones",
    venue: "IEEE 8th International Conference on Trends in Electronics and Informatics (ICOEI 2025)",
    abstract:
      "This work showcases the integral roles of AI, edge computing, and 5G in search and rescue operations during disaster response. The deployed YOLOv8n model was trained on both color and monochrome images to enhance performance in complex environments. A Raspberry Pi 5 Model B with a Hailo AI Kit enables cost-effective, low-latency real-time inferencing of live camera feeds, while the 5G network's URLLC and eMBB support high-resolution streaming and low-latency communication. AWS S3 provides cloud storage for data review and detections. The system was successfully tested in simulated disaster conditions with impressive results, advancing intelligent disaster response to save lives.",
    link: "https://doi.org/10.1109/ICOEI65986.2025.11013465",
  },
  {
    date: "Sep 2025",
    status: "Published",
    title:
      "Design and Implementation of Miniaturized Dual-Mode Terahertz Bandpass Filter Based on Swastik Slotted Fractals",
    venue: "Journal of Optics (Springer)",
    abstract:
      "This article presents the design of a miniaturized bandpass filter featuring a square patch perturbed microstrip resonator configuration with Swastik fractal slots for applications in the terahertz regime. The dual-mode filter demonstrates two transmission zeros on the passband edges, leading to substantial improvement in selectivity. The terahertz filter exhibits appreciable size reduction through integration of Swastik fractal slots into the resonator, achieving miniaturization without compromising desirable filter characteristics. The bandpass filter, measuring 8 × 8 µm², demonstrates notable performance at 3.88 THz with a return loss exceeding 38.32 dB and a low insertion loss of 1.63 dB.",
    link: "https://doi.org/10.1007/s12596-025-02915-0",
  },
];

const cardVariants = {
  rest: {
    y: 0,
    boxShadow: "0 0 0 rgba(0,0,0,0)",
  },
  hover: {
    y: -8,
    boxShadow:
      "0 20px 40px rgba(0,0,0,0.35), 0 0 40px rgba(59,130,246,0.35)",
    borderColor: "rgba(59,130,246,0.6)",
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function Publications() {
  return (
    <section id="publications" className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* SECTION HEADER */}
        <div className="mb-12">
          <p className="mb-3 text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Research
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Publications
          </h2>
          <p className="mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
            Peer-reviewed research publications focused on AI-enabled disaster response systems,
            5G communications, edge computing, and terahertz RF circuit design.
          </p>
        </div>

        {/* PUBLICATIONS GRID */}
        <div className="grid gap-6 md:grid-cols-2">
          {publications.map((paper, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="rest"
              whileHover="hover"
              animate="rest"
              className="cursor-pointer rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0b0b] p-6 h-full flex flex-col hover:border-blue-500/60 transition-colors"
            >
              {/* Header with Icon and Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <FileText className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                  </div>
                  {paper.status && (
                    <span className="text-xs rounded-full border border-blue-400/40 bg-blue-500/10 px-3 py-1 text-blue-600 dark:text-blue-300 font-medium">
                      {paper.status}
                    </span>
                  )}
                </div>
                {paper.date && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{paper.date}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 leading-tight">
                  {paper.title || "Upcoming publication"}
                </h3>

                {/* Venue */}
                {paper.venue && (
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">{paper.venue}</p>
                  </div>
                )}

                {/* Abstract */}
                {paper.abstract && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 line-clamp-4">
                    {paper.abstract}
                  </p>
                )}
              </div>

              {/* Action Button */}
              {paper.link && (
                <a
                  href={paper.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-blue-400 hover:bg-blue-400/10 transition-all w-fit group"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>Read Paper</span>
                  <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
