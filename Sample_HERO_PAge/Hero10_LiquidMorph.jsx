"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, ArrowRight, Download, ChevronDown } from "lucide-react";

/**
 * HERO 10 — Liquid Morph
 *
 * Concept: Soft, organic liquid blobs morph and flow behind the content.
 * Warm coral/peach/lavender palette creates a welcoming, approachable feel.
 * Rounded UI elements, soft shadows, and playful micro-animations.
 *
 * Palette: Coral (#f97066), Peach (#fbbf24), Lavender (#a78bfa) on Cream (#fffbf5)
 */

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero10_LiquidMorph() {
  const reduce = useReducedMotion();

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-[#fffbf5]">
      {/* Liquid blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={reduce ? {} : { borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "50% 50% 30% 70% / 60% 40% 60% 40%", "30% 70% 70% 30% / 30% 30% 70% 70%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-[#f97066]/30 via-[#fbbf24]/20 to-[#a78bfa]/25 blur-[60px]"
        />
        <motion.div
          animate={reduce ? {} : { borderRadius: ["50% 50% 30% 70% / 40% 60% 40% 60%", "30% 70% 70% 30% / 70% 30% 30% 70%", "50% 50% 30% 70% / 40% 60% 40% 60%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 -left-20 w-[450px] h-[450px] bg-gradient-to-tr from-[#a78bfa]/25 via-[#f97066]/20 to-[#fbbf24]/25 blur-[60px]"
        />
        <motion.div
          animate={reduce ? {} : { borderRadius: ["70% 30% 50% 50% / 30% 70% 30% 70%", "40% 60% 60% 40% / 50% 50% 50% 50%", "70% 30% 50% 50% / 30% 70% 30% 70%"] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-gradient-to-r from-[#fbbf24]/15 to-[#f97066]/15 blur-[50px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 min-h-screen flex flex-col justify-center pt-20 pb-24">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left */}
          <div className="order-2 lg:order-1">
            <motion.div variants={fadeUp} className="mb-5">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-[#f97066]/20 text-[#f97066] text-xs font-semibold shadow-sm">
                <span className="flex h-2 w-2"><span className="relative rounded-full h-2 w-2 bg-[#f97066] animate-pulse" /></span>
                Open to Opportunities
              </span>
            </motion.div>

            <motion.p variants={fadeUp} className="text-sm uppercase tracking-[0.2em] text-[#a78bfa] font-semibold mb-3">
              Embedded Developer
            </motion.p>

            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] text-[#1a1a2e]">
              Hello, I&apos;m
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f97066] via-[#fbbf24] to-[#a78bfa]">
                Charan
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-6 text-lg text-[#6b7280] max-w-lg leading-relaxed">
              I design and build AI-driven systems, UAV networks, and
              polished web applications that blend engineering precision
              with creative design.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <a href="/projects" className="group px-6 py-3 text-sm bg-gradient-to-r from-[#f97066] to-[#a78bfa] text-white font-semibold rounded-2xl shadow-lg shadow-[#f97066]/20 hover:shadow-xl hover:shadow-[#f97066]/30 hover:scale-105 active:scale-[0.98] transition-all inline-flex items-center gap-2">
                View Projects <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="/resume.pdf" download className="px-6 py-3 text-sm bg-white/80 border border-[#e5e7eb] text-[#4b5563] rounded-2xl shadow-sm hover:shadow-md hover:border-[#a78bfa]/40 transition-all inline-flex items-center gap-2">
                <Download className="h-4 w-4" /> Resume
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6 flex gap-3">
              <a href="https://github.com/charanvelavan" target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-white/80 border border-gray-200 text-[#6b7280] hover:text-[#f97066] hover:border-[#f97066]/30 shadow-sm transition-all" aria-label="GitHub"><Github size={18} /></a>
              <a href="https://www.linkedin.com/in/charan-velavan/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-white/80 border border-gray-200 text-[#6b7280] hover:text-[#a78bfa] hover:border-[#a78bfa]/30 shadow-sm transition-all" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 grid grid-cols-4 gap-6">
              {[{ v: "5+", l: "Projects", c: "from-[#f97066] to-[#fbbf24]" }, { v: "4", l: "Awards", c: "from-[#fbbf24] to-[#a78bfa]" }, { v: "15+", l: "Tech", c: "from-[#a78bfa] to-[#f97066]" }, { v: "1", l: "Paper", c: "from-[#f97066] to-[#a78bfa]" }].map((s) => (
                <div key={s.l}>
                  <div className={`text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${s.c}`}>{s.v}</div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">{s.l}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Blobby avatar */}
          <motion.div variants={fadeUp} className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-[260px] sm:w-[320px] md:w-[380px] lg:w-[420px] aspect-square">
              <motion.div
                animate={reduce ? {} : { borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "50% 50% 30% 70% / 60% 40% 60% 40%", "30% 70% 70% 30% / 30% 30% 70% 70%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 overflow-hidden shadow-2xl shadow-[#f97066]/20"
              >
                <Image src="/test.png" alt="Charan" fill sizes="420px" className="object-cover object-[50%_15%]" priority />
              </motion.div>

              {/* Floating accent shapes */}
              <motion.div
                animate={reduce ? {} : { y: [0, -15, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#fbbf24] to-[#f97066] opacity-60 shadow-lg"
              />
              <motion.div
                animate={reduce ? {} : { y: [0, 10, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#f97066] opacity-50 shadow-lg"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <motion.button animate={reduce ? {} : { y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })} aria-label="Scroll down">
          <span className="text-xs uppercase tracking-widest text-gray-400">Scroll</span>
          <ChevronDown className="h-5 w-5 text-[#f97066]" />
        </motion.button>
      </motion.div>
    </section>
  );
}
