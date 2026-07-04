"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, ArrowRight, Download, ChevronDown } from "lucide-react";

/**
 * HERO 8 — Minimal Zen
 *
 * Concept: Ultra-clean, Japanese-inspired minimalism. Massive whitespace,
 * a single red accent, elegant serif + sans-serif type pairing.
 * Content centered with intentional breathing room. Feels like a
 * high-end design agency site.
 *
 * Palette: Warm White (#faf9f6), Deep Black (#1a1a1a), Vermillion Red (#dc2626)
 */

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (d = 0) => ({ opacity: 1, transition: { duration: 0.8, delay: d } }),
};

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: d, ease: "easeOut" } }),
};

export default function Hero8_MinimalZen() {
  const reduce = useReducedMotion();

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-[#faf9f6]">
      {/* Subtle paper texture */}
      <div className="absolute inset-0 -z-10 opacity-[0.3]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="max-w-6xl mx-auto px-8 md:px-16 min-h-screen flex flex-col justify-center pt-24 pb-24">
        {/* Top line */}
        <motion.div variants={fadeIn} custom={0.1} initial="hidden" animate="visible" className="flex items-center gap-4 mb-16">
          <div className="w-12 h-px bg-red-600" />
          <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-medium">Portfolio 2026</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left — Content */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <motion.h1
              variants={slideUp} custom={0.2} initial="hidden" animate="visible"
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] font-light leading-[0.9] text-[#1a1a1a] tracking-tight"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Charan
              <span className="block text-red-600">Velavan</span>
            </motion.h1>

            <motion.div variants={slideUp} custom={0.4} initial="hidden" animate="visible" className="mt-8 flex items-start gap-6">
              <div className="w-px h-24 bg-red-600/40 flex-shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-red-600 font-semibold mb-3">Embedded Developer</p>
                <p className="text-base text-gray-600 max-w-md leading-relaxed">
                  Bridging hardware and software — building AI communication systems,
                  UAV networks, and modern web applications with precision and purpose.
                </p>
              </div>
            </motion.div>

            <motion.div variants={slideUp} custom={0.6} initial="hidden" animate="visible" className="mt-10 flex flex-wrap items-center gap-4">
              <a href="/projects" className="group px-7 py-3 text-sm bg-[#1a1a1a] text-[#faf9f6] font-medium rounded-none hover:bg-red-600 transition-colors inline-flex items-center gap-2">
                View Work <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="/resume.pdf" download className="px-7 py-3 text-sm border border-[#1a1a1a]/20 text-[#1a1a1a] hover:border-red-600 hover:text-red-600 transition-colors inline-flex items-center gap-2">
                <Download className="h-4 w-4" /> Resume
              </a>
            </motion.div>

            <motion.div variants={slideUp} custom={0.7} initial="hidden" animate="visible" className="mt-8 flex gap-3">
              <a href="https://github.com/charanvelavan" target="_blank" rel="noopener noreferrer" className="p-3 border border-[#1a1a1a]/10 text-[#1a1a1a]/60 hover:text-red-600 hover:border-red-600/40 transition-all" aria-label="GitHub"><Github size={18} /></a>
              <a href="https://www.linkedin.com/in/charan-velavan/" target="_blank" rel="noopener noreferrer" className="p-3 border border-[#1a1a1a]/10 text-[#1a1a1a]/60 hover:text-red-600 hover:border-red-600/40 transition-all" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </motion.div>
          </div>

          {/* Right — Photo */}
          <motion.div
            variants={slideUp} custom={0.3} initial="hidden" animate="visible"
            className="lg:col-span-5 order-1 lg:order-2 flex justify-center"
          >
            <div className="relative w-[240px] sm:w-[280px] md:w-[320px] lg:w-[360px] aspect-[3/4]">
              {/* Red accent line */}
              <div className="absolute -top-4 -left-4 w-20 h-20 border-t-2 border-l-2 border-red-600" />
              <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-2 border-r-2 border-red-600" />

              <div className="relative w-full h-full overflow-hidden bg-gray-200">
                <Image src="/test.png" alt="Charan" fill sizes="360px" className="object-cover object-[50%_15%] grayscale hover:grayscale-0 transition-all duration-700" priority />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom stats */}
        <motion.div variants={fadeIn} custom={1} initial="hidden" animate="visible" className="mt-20 pt-8 border-t border-[#1a1a1a]/10 grid grid-cols-4 gap-8 max-w-lg">
          {[{ v: "5+", l: "Projects" }, { v: "4", l: "Awards" }, { v: "15+", l: "Technologies" }, { v: "1", l: "Publication" }].map((s) => (
            <div key={s.l}>
              <div className="text-2xl md:text-3xl font-light text-[#1a1a1a]" style={{ fontFamily: "Georgia, serif" }}>{s.v}</div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">{s.l}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <motion.button animate={reduce ? {} : { y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })} aria-label="Scroll down">
          <span className="text-xs uppercase tracking-widest text-gray-400">Scroll</span>
          <ChevronDown className="h-5 w-5 text-red-600" />
        </motion.button>
      </motion.div>
    </section>
  );
}
