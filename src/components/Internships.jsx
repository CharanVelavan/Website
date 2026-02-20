// src/components/Internships.jsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const cardVariants = {
  rest: {
    y: 0,
    boxShadow: "0 0 0 rgba(0,0,0,0)",
  },
  hover: {
    y: -8,
    boxShadow:
      "0 20px 40px rgba(0,0,0,0.35), 0 0 40px rgba(168,85,247,0.35)",
    borderColor: "rgba(168,85,247,0.6)",
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const logoVariants = {
  rest: {
    scale: 1,
    filter: "grayscale(0%)",
  },
  hover: {
    scale: 1.05,
    filter: "grayscale(0%) brightness(1.1)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export default function Internships() {
  return (
    <section id="internships" className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* ================= HEADER ================= */}
        <div className="mb-12">
          <p className="mb-3 text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Experience
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Internships</h2>
        </div>

        {/* ================= TILES ================= */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* ZOHO */}
          <Link href="/resume/internships" className="block">
            <motion.div
              variants={cardVariants}
              initial="rest"
              whileHover="hover"
              animate="rest"
              className="cursor-pointer rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0b0b] p-6 h-full flex flex-col hover:border-purple-500/60 transition-colors"
            >
              {/* Logo Container */}
              <div className="mb-6 flex items-center justify-center h-20 bg-black/5 dark:bg-white/5 rounded-xl p-4 backdrop-blur-sm">
                <motion.div variants={logoVariants} className="relative w-full h-full">
                  <Image
                    src="/images/intern/zoho/zoho.svg"
                    alt="ZOHO Corporation"
                    fill
                    className="object-contain"
                  />
                </motion.div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="mb-1 text-xl font-semibold text-gray-900 dark:text-white">
                  ZOHO Corporation
                </h3>
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                  Technical Support Intern
                </p>
                <p className="mb-4 text-xs uppercase tracking-widest text-gray-500">
                  Jan 2025 – Jun 2025
                </p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-400">
                  <li>ManageEngine Endpoint Central support</li>
                  <li>Enterprise software asset management</li>
                </ul>
              </div>
            </motion.div>
          </Link>

          {/* SSN */}
          <Link href="/resume/internships" className="block">
            <motion.div
              variants={cardVariants}
              initial="rest"
              whileHover="hover"
              animate="rest"
              className="cursor-pointer rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0b0b] p-6 h-full flex flex-col hover:border-purple-500/60 transition-colors"
            >
              {/* Logo Container */}
              <div className="mb-6 flex items-center justify-center h-20 bg-black/5 dark:bg-white/5 rounded-xl p-4 backdrop-blur-sm">
                <motion.div variants={logoVariants} className="relative w-full h-full">
                  <Image
                    src="/images/intern/ssn/logo.png"
                    alt="SSN College of Engineering"
                    fill
                    className="object-contain"
                  />
                </motion.div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="mb-1 text-xl font-semibold text-gray-900 dark:text-white">
                  SSN College of Engineering
                </h3>
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                  Research Intern (THz RF)
                </p>
                <p className="mb-4 text-xs uppercase tracking-widest text-gray-500">
                  May 2024 – Jul 2024
                </p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-400">
                  <li>Fractal-based THz bandpass filter design</li>
                  <li>CST & MATLAB simulations</li>
                </ul>
              </div>
            </motion.div>
          </Link>

          {/* Techphosis */}
          <Link href="/resume/internships" className="block">
            <motion.div
              variants={cardVariants}
              initial="rest"
              whileHover="hover"
              animate="rest"
              className="cursor-pointer rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0b0b] p-6 h-full flex flex-col hover:border-purple-500/60 transition-colors"
            >
              {/* Logo Container */}
              <div className="mb-6 flex items-center justify-center h-20 bg-black/5 dark:bg-white/5 rounded-xl p-4 backdrop-blur-sm">
                <motion.div variants={logoVariants} className="relative w-full h-full">
                  <Image
                    src="/images/intern/techphosis/logo.png"
                    alt="Techphosis"
                    fill
                    className="object-contain"
                  />
                </motion.div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="mb-1 text-xl font-semibold text-gray-900 dark:text-white">Techphosis</h3>
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">5G / O-RAN Intern</p>
                <p className="mb-4 text-xs uppercase tracking-widest text-gray-500">
                  Mar 2024 – May 2024
                </p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-400">
                  <li>5G O-RAN implementation with USRP B210</li>
                  <li>CU/DU integration and RAN analysis</li>
                </ul>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </section>
  );
}
