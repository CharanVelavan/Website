// src/app/resume/internships/page.jsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, MapPin, Calendar, Award } from "lucide-react";
import ImageGallery from "@/components/ImageGallery";

const internships = [
  // ── ZOHO ──────────────────────────────────────────────────────────────────
  {
    id: "zoho",
    company: "ZOHO Corporation",
    logo: "/images/intern/zoho/zoho.svg",
    role: "Project Trainee – Software Inventory Management",
    type: "Full-time",
    duration: "Jan 2025 – Jun 2025 · 6 mos",
    location: "Chennai, Tamil Nadu, India · On-site",
    description: [
      "Worked with ManageEngine Endpoint Central to manage and automate software across Zoho's assets.",
      "Collaborated with legal, compliance, and engineering teams to ensure adherence to licensing and policy requirements.",
      "Managed and categorized 3,000+ software titles, improving asset tracking and governance.",
      "Assisted in requirement gathering, documentation, and product knowledge transfer for cross-functional teams.",
      "Gained experience in remote assistance workflows and process automation.",
    ],
    certificate: "/certificates/zoho-certificate.pdf",
    images: [
      "/images/intern/zoho/image1.jpg",
      "/images/intern/zoho/image2.jpg",
    ],
  },

  // ── OPTICA ────────────────────────────────────────────────────────────────
  {
    id: "optica-sjce",
    company: "OPTICA SJCE",
    logo: "/images/intern/optica/logo.png",
    role: "Volunteer",
    type: "Full-time",
    duration: "Jun 2022 – May 2025 · 3 yrs",
    location: "Chennai, Tamil Nadu, India · On-site",
    description: [
      "Volunteered for 3 years with OPTICA SJCE, contributing to optics and photonics-related events and initiatives.",
      "Supported the organization of technical workshops, seminars, and competitions.",
    ],
  },

  // ── SSN RESEARCH ──────────────────────────────────────────────────────────
  {
    id: "ssn",
    company: "Sri Sivasubramaniya Nadar College Of Engineering",
    logo: "/images/intern/ssn/logo.png",
    role: "Research Intern",
    type: "Internship",
    duration: "Jun 2024 – Aug 2024 · 3 mos",
    location: "Chennai, Tamil Nadu, India · On-site",
    description: [
      "Designed a dual-mode bandpass filter using fractal-based Swastik slots on a square patch resonator for THz applications at 3.88 THz.",
      "Achieved an ultra-compact footprint of 7.99 × 7.99 µm² with insertion loss of 1.637 dB and return loss exceeding 38.32 dB.",
      "Used CST Studio Suite and MATLAB to design and simulate fractal-based bandpass filters.",
      "Targeted medical imaging applications requiring high-frequency, high-performance filtering solutions.",
    ],
    certificate: "/certificates/ssn-certificate.pdf",
    images: [
      "/images/intern/ssn/image1.jpg",
    ],
    skills: ["Antenna Design", "CST Microwave Studio"],
  },

  // ── TECHPHOSIS ──────────────────────────────────────────────────────────────
  {
    id: "techphosis",
    company: "Techphosis",
    logo: "/images/intern/techphosis/logo.png",
    role: "5G Network Engineer Intern",
    duration: "Mar 2024 – May 2024",
    description: [
      "Implemented a 5G-based O-RAN architecture using open-source tools and USRP B210 SDR, emphasizing openness and interoperability.",
      "Integrated O-RAN components including Central Unit (CU) and Distributed Unit (DU) for scalable 5G deployments.",
      "Gained in-depth understanding of 5G protocol layers and their interactions across RAN and core networks.",
      "Analyzed RAN and core network logs to derive insights into network performance and latency optimization.",
      "Developed practical skills in SDR programming and signal processing for real-world 5G applications.",
    ],
    certificate: "/certificates/techphosis-certificate.pdf",
    images: [
      "/images/intern/techphosis/image1.jpg",
      "/images/intern/techphosis/image2.jpg",
    ],
  },
];

export default function InternshipsPage() {
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
          Internships &amp; Experience
        </h1>
        <p className="mt-4 max-w-2xl text-gray-400 leading-relaxed">
          Hands-on industry and research experience across networking, RF design,
          and enterprise systems.
        </p>
      </motion.header>

      {/* ── TIMELINE ── */}
      <div className="relative">
        {/* vertical connector line */}
        <div className="absolute left-7 top-6 bottom-6 w-px bg-gradient-to-b from-purple-500/60 via-purple-500/20 to-transparent hidden md:block" />

        <div className="space-y-8">
          {internships.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative md:pl-20"
            >
              {/* timeline dot */}
              <div className="absolute left-[13px] top-8 w-[18px] h-[18px] rounded-full border-2 border-purple-500 bg-[#0a0a0a] hidden md:flex items-center justify-center z-10">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
              </div>

              {/* card */}
              <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent overflow-hidden hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">

                {/* card header */}
                <div className="flex items-start gap-4 p-5 sm:p-6 border-b border-white/8">
                  <div className="w-14 h-14 rounded-xl bg-white flex-shrink-0 flex items-center justify-center p-2 shadow-lg ring-1 ring-black/5">
                    <img
                      src={item.logo}
                      alt={item.company}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h2 className="text-base font-bold text-white group-hover:text-purple-200 transition-colors leading-snug">
                        {item.company}
                      </h2>
                      <span className="flex items-center gap-1.5 text-[11px] text-gray-400 bg-white/5 rounded-full px-2.5 py-1 border border-white/10 whitespace-nowrap flex-shrink-0">
                        <Calendar size={10} />
                        {item.duration}
                      </span>
                    </div>
                    <p className="text-purple-400 text-sm font-medium mt-1">
                      {item.role}
                      {item.type && (
                        <span className="ml-2 text-[11px] font-normal text-gray-500 bg-white/5 rounded-full px-2 py-0.5 border border-white/10">
                          {item.type}
                        </span>
                      )}
                    </p>
                    {item.location && (
                      <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <MapPin size={10} />
                        {item.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* card body */}
                <div className="p-5 sm:p-6 space-y-5">

                  {/* description */}
                  <ul className="space-y-2.5">
                    {item.description.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-300 leading-relaxed">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-purple-500/80 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>

                  {/* skills */}
                  {item.skills && item.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.skills.map((skill) => (
                        <span key={skill} className="px-3 py-1 text-xs rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* certificate */}
                  {item.certificate && (
                    <a
                      href={item.certificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400/50 transition-all group/btn"
                    >
                      <Award size={14} />
                      View Certificate
                      <ExternalLink size={12} className="opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                    </a>
                  )}

                  {/* gallery */}
                  {item.images && item.images.length > 0 && (
                    <div className="pt-2 border-t border-white/8">
                      <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-3">Gallery</p>
                      <ImageGallery images={item.images} title={item.company} />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── BACK ── */}
      <div className="mt-24">
        <Link href="/resume" className="text-sm text-gray-400 hover:text-white transition-colors">
          ← Back to Resume
        </Link>
      </div>
    </main>
  );
}
