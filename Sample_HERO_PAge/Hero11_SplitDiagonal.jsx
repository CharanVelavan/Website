"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, ArrowRight, Download, ChevronDown } from "lucide-react";

/**
 * HERO 11 — Split Diagonal
 *
 * Concept: A bold diagonal split — dark left half with text, teal/emerald
 * right half with photo. The diagonal line creates strong visual tension.
 * Modern editorial feel with bold geometric shapes.
 *
 * Palette: Teal (#14b8a6), Emerald (#059669), White on Dark (#0f172a)
 */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: d, ease: "easeOut" } }),
};

export default function Hero11_SplitDiagonal() {
  const reduce = useReducedMotion();

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden">
      {/* Split background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0f172a]" />
        <div
          className="absolute inset-0 bg-gradient-to-br from-teal-500 to-emerald-600"
          style={{ clipPath: "polygon(55% 0, 100% 0, 100% 100%, 35% 100%)" }}
        />
      </div>

      {/* Diagonal line accent */}
      <div className="absolute inset-0 -z-5 pointer-events-none">
        <div className="absolute top-0 bottom-0 w-px bg-white/20" style={{ left: "45%", transform: "rotate(-10deg) scaleY(1.5)", transformOrigin: "top" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 min-h-screen flex flex-col justify-center pt-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — Dark side */}
          <motion.div initial="hidden" animate="visible" className="order-2 lg:order-1">
            <motion.div variants={fadeUp} custom={0.1} className="mb-5">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-medium">
                <span className="relative flex h-2 w-2"><span className="absolute inset-0 rounded-full bg-teal-400 animate-ping opacity-50" /><span className="relative rounded-full h-2 w-2 bg-teal-400" /></span>
                Available for Work
              </span>
            </motion.div>

            <motion.p variants={fadeUp} custom={0.2} className="text-sm uppercase tracking-[0.25em] text-teal-400 font-semibold mb-3">
              Embedded Developer
            </motion.p>

            <motion.h1 variants={fadeUp} custom={0.3} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.85] text-white">
              CHA
              <span className="text-teal-400">RAN</span>
            </motion.h1>

            <motion.div variants={fadeUp} custom={0.35} className="mt-2 flex items-center gap-3">
              <div className="h-1 w-12 bg-teal-400 rounded-full" />
              <span className="text-lg text-white/60 font-light tracking-wide">Velavan</span>
            </motion.div>

            <motion.p variants={fadeUp} custom={0.5} className="mt-6 text-base text-slate-400 max-w-md leading-relaxed">
              Engineering AI communication systems, autonomous UAV networks,
              and modern web applications. Where embedded meets elegant.
            </motion.p>

            <motion.div variants={fadeUp} custom={0.6} className="mt-8 flex flex-wrap gap-3">
              <a href="/projects" className="group px-6 py-3 text-sm bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-500/30 hover:scale-105 active:scale-[0.98] transition-all inline-flex items-center gap-2">
                Projects <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="/resume.pdf" download className="px-6 py-3 text-sm border border-white/20 text-white/70 rounded-xl hover:border-teal-400/50 hover:text-teal-300 transition-all inline-flex items-center gap-2">
                <Download className="h-4 w-4" /> Resume
              </a>
            </motion.div>

            <motion.div variants={fadeUp} custom={0.7} className="mt-6 flex gap-3">
              <a href="https://github.com/charanvelavan" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl border border-white/10 text-slate-400 hover:text-teal-400 hover:border-teal-400/40 transition-all" aria-label="GitHub"><Github size={18} /></a>
              <a href="https://www.linkedin.com/in/charan-velavan/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl border border-white/10 text-slate-400 hover:text-teal-400 hover:border-teal-400/40 transition-all" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </motion.div>

            <motion.div variants={fadeUp} custom={0.8} className="mt-10 grid grid-cols-4 gap-6">
              {[{ v: "5+", l: "Projects" }, { v: "4", l: "Awards" }, { v: "15+", l: "Tech" }, { v: "1", l: "Paper" }].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-bold text-teal-400">{s.v}</div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">{s.l}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Teal side with photo */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative w-[260px] sm:w-[300px] md:w-[360px] lg:w-[400px] aspect-[3/4]">
              {/* Geometric accent */}
              <div className="absolute -top-4 -right-4 w-full h-full border-2 border-white/20 rounded-3xl" />

              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                <Image src="/test.png" alt="Charan" fill sizes="400px" className="object-cover object-[50%_15%]" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent" />
              </div>

              {/* Floating badge */}
              <motion.div
                animate={reduce ? {} : { y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 px-4 py-3 rounded-2xl bg-[#0f172a] border border-teal-500/30 shadow-xl"
              >
                <p className="text-xs text-teal-400 font-semibold">B.Tech ECE</p>
                <p className="text-[10px] text-slate-500">Electronics & Comm.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <motion.button animate={reduce ? {} : { y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })} aria-label="Scroll down">
          <span className="text-xs uppercase tracking-widest text-white/30">Scroll</span>
          <ChevronDown className="h-5 w-5 text-teal-400" />
        </motion.button>
      </motion.div>
    </section>
  );
}
