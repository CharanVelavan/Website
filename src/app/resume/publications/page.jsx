// src/app/resume/publications/page.jsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import ImageGallery from "@/components/ImageGallery";

const publications = [
  {
    id: "icoei-2025",
    logo: "/images/publications/icoei/logo.png",
    date: "Jan 2025",
    status: "Published",
    title:
      "5G and Edge Computing Enabled Search and Rescue Drones",
    venue: "IEEE 8th International Conference on Trends in Electronics and Informatics (ICOEI 2025)",
    abstract:
      "This work showcases the integral roles of AI, edge computing, and 5G in search and rescue operations during disaster response. The deployed YOLOv8n model was trained on both color and monochrome images to enhance performance in complex environments. A Raspberry Pi 5 Model B with a Hailo AI Kit enables cost-effective, low-latency real-time inferencing of live camera feeds, while the 5G network's URLLC and eMBB support high-resolution streaming and low-latency communication. AWS S3 provides cloud storage for data review and detections. The system was successfully tested in simulated disaster conditions with impressive results, advancing intelligent disaster response to save lives.",
    link: "/papers/5G_and_Edge_Computing_Enabled_Search_and_Rescue_Drones.pdf",
    images: [],
  },
  {
    id: "journal-optics-2025",
    logo: "/images/publications/springer/logo.png",
    date: "Sep 2025",
    status: "Published",
    title:
      "Design and Implementation of Miniaturized Dual-Mode Terahertz Bandpass Filter Based on Swastik Slotted Fractals",
    venue: "Journal of Optics (Springer)",
    abstract:
      "This article presents the design of a miniaturized bandpass filter featuring a square patch perturbed microstrip resonator configuration with Swastik fractal slots for applications in the terahertz regime. The dual-mode filter demonstrates two transmission zeros on the passband edges, leading to substantial improvement in selectivity. The terahertz filter exhibits appreciable size reduction through integration of Swastik fractal slots into the resonator, achieving miniaturization without compromising desirable filter characteristics. The bandpass filter, measuring 8 × 8 µm², demonstrates notable performance at 3.88 THz with a return loss exceeding 38.32 dB and a low insertion loss of 1.63 dB.",
    link: "/papers/SSN PAPER.pdf",
    images: [],
  },
];

export default function PublicationsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      {/* ================= HEADER ================= */}
      <header className="mb-16">
        <p className="mb-4 text-sm uppercase tracking-widest text-gray-400">
          Research
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
          Publications
        </h1>
        <p className="mt-6 max-w-3xl leading-relaxed text-gray-400">
          Peer-reviewed research publications focused on AI-enabled disaster response systems,
          5G communications, edge computing, and terahertz RF circuit design.
        </p>
      </header>

      {/* ================= PUBLICATIONS ================= */}
      <section className="space-y-16">
        {publications.map((publication, index) => (
          <motion.div
            key={publication.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="group rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
          >
            {/* Publication Logo/Conference Header */}
            <div className="relative h-32 bg-white/[0.02] flex items-center justify-center border-b border-white/10">
              {publication.logo ? (
                <img
                  src={publication.logo}
                  alt={`${publication.venue} logo`}
                  className="h-16 w-auto object-contain"
                />
              ) : (
                <div className="text-center">
                  <svg
                    className="h-16 w-16 text-white/20 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-8">
              {/* META */}
              <div className="mb-4 flex items-center gap-3">
                {publication.date && (
                  <span className="text-xs uppercase tracking-widest text-gray-400">
                    {publication.date}
                  </span>
                )}
                {publication.status && (
                  <span className="text-xs rounded-full border border-purple-400/40 bg-purple-500/10 px-3 py-1 text-purple-300">
                    {publication.status}
                  </span>
                )}
              </div>

              {/* TITLE */}
              <h2 className="text-2xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                {publication.title}
              </h2>

              {/* VENUE */}
              {publication.venue && (
                <p className="text-sm text-gray-400 mb-6 uppercase tracking-widest">
                  {publication.venue}
                </p>
              )}

              {/* ABSTRACT */}
              {publication.abstract && (
                <p className="text-gray-400 leading-relaxed mb-6">
                  {publication.abstract}
                </p>
              )}

              {/* ACTION BUTTON */}
              {publication.link && (
                <div className="mb-6">
                  <a
                    href={publication.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all"
                  >
                    <span>Read Paper</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}

              {/* IMAGE GALLERY */}
              {publication.images && publication.images.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Figures & Results
                  </h3>
                  <ImageGallery
                    images={publication.images}
                    title={publication.title}
                  />
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
