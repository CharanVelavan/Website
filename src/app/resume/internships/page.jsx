// src/app/resume/internships/page.jsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
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

  // ── PRODIGY INFOTECH ──────────────────────────────────────────────────────
  {
    id: "techphosis",
    company: "Techphosis",
    logo: "/images/intern/techphosis/logo.png",
    role: "Internship Report",
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
      {/* ================= HEADER ================= */}
      <header className="mb-16">
        <p className="mb-4 text-sm uppercase tracking-widest text-gray-400">
          Resume
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
          Internships & Experience
        </h1>
        <p className="mt-6 max-w-3xl leading-relaxed text-gray-400">
          Hands-on industry and research experience across networking, RF design,
          and enterprise systems.
        </p>
      </header>

      {/* ================= INTERNSHIPS ================= */}
      <section className="space-y-16">
        {internships.map((internship, index) => (
          <motion.div
            key={internship.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="group rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
          >
            {/* Company Logo Header */}
            <div className="relative h-32 bg-white/[0.02] flex items-center justify-center border-b border-white/10">
              <img
                src={internship.logo}
                alt={`${internship.company} logo`}
                className="h-16 w-auto object-contain"
              />
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 md:p-8">
              <div className="mb-2 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <h2 className="text-2xl font-semibold text-white">
                  {internship.company}
                </h2>
                <span className="text-sm text-gray-400">{internship.duration}</span>
              </div>

              <p className="mb-1 text-sm font-medium text-purple-300">
                {internship.role}{internship.type && <span className="ml-2 text-gray-500 text-xs font-normal">· {internship.type}</span>}
              </p>

              {internship.location && (
                <p className="mb-4 text-xs text-gray-500">{internship.location}</p>
              )}

              <ul className="list-disc space-y-2 pl-6 text-gray-400 mb-4">
                {internship.description.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>

              {/* Skills Tags */}
              {internship.skills && internship.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {internship.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-xs rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Certificate Button */}
              {internship.certificate && (
                <div className="mb-6">
                  <a
                    href={internship.certificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all"
                  >
                    <span>View Certificate</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}

              {/* Image Gallery */}
              {internship.images && internship.images.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Gallery</h3>
                  <ImageGallery images={internship.images} title={internship.company} />
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
