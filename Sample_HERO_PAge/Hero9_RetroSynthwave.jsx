"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, ArrowRight, Download, ChevronDown } from "lucide-react";

/**
 * HERO 9 — Retro Synthwave
 *
 * Concept: 80s retrowave aesthetic with a gradient sunset, perspective
 * grid floor, and chrome/neon text. The sun pulses behind the avatar.
 * Mountain silhouette at the horizon line. Nostalgic yet modern.
 *
 * Palette: Hot Orange (#f97316), Magenta (#d946ef), Deep Purple (#7c3aed) on dark (#0c0015)
 */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: "easeOut" } }),
};

export default function Hero9_RetroSynthwave() {
  const reduce = useReducedMotion();

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-[#0c0015]">
      {/* Synthwave sun */}
      <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 w-[500px] h-[250px] md:w-[700px] md:h-[350px] -z-10">
        <div className="w-full h-full rounded-t-full bg-gradient-to-t from-orange-500 via-pink-500 to-purple-600 opacity-60" />
        {/* Sun lines */}
        {[20, 35, 48, 58, 66, 73, 78, 82, 85].map((top, i) => (
          <div key={i} className="absolute left-0 right-0 bg-[#0c0015]" style={{ top: `${top}%`, height: `${2 + i * 0.5}%` }} />
        ))}
      </div>

      {/* Perspective grid */}
      <div className="absolute bottom-0 left-0 right-0 h-[45%] -z-5 overflow-hidden" style={{ perspective: "400px" }}>
        <div
          className="absolute inset-0 origin-bottom"
          style={{
            transform: "rotateX(60deg)",
            backgroundImage: `linear-gradient(rgba(249,115,22,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.15) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Mountain silhouette */}
      <div className="absolute bottom-[28%] left-0 right-0 -z-[3]">
        <svg viewBox="0 0 1440 200" className="w-full" preserveAspectRatio="none">
          <polygon fill="#0c0015" points="0,200 200,80 400,130 600,50 800,110 1000,30 1200,90 1440,60 1440,200" />
        </svg>
      </div>

      {/* Ambient glow */}
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/10 rounded-full blur-[100px] -z-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 min-h-screen flex flex-col justify-center pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <motion.div initial="hidden" animate="visible" className="order-2 lg:order-1">
            <motion.p variants={fadeUp} custom={0.1} className="text-sm uppercase tracking-[0.3em] text-orange-400 font-bold mb-4">
              Embedded Developer
            </motion.p>

            <motion.h1 variants={fadeUp} custom={0.2} className="text-6xl sm:text-7xl md:text-8xl font-black leading-[0.85] tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-200 to-pink-400" style={{ WebkitTextStroke: "1px rgba(249,115,22,0.2)" }}>
                CHARAN
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">
                VELAVAN
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={0.4} className="mt-6 text-base text-gray-400 max-w-lg leading-relaxed">
              Fusing embedded systems with modern web tech — crafting
              AI-driven communication platforms, UAV networks, and
              experiences from the future.
            </motion.p>

            <motion.div variants={fadeUp} custom={0.5} className="mt-8 flex flex-wrap gap-3">
              <a href="/projects" className="group px-6 py-3 text-sm font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white rounded-lg hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:scale-105 active:scale-[0.98] transition-all inline-flex items-center gap-2">
                Projects <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="/resume.pdf" download className="px-6 py-3 text-sm border border-orange-500/30 text-orange-300 rounded-lg hover:bg-orange-500/10 transition-all inline-flex items-center gap-2">
                <Download className="h-4 w-4" /> Resume
              </a>
            </motion.div>

            <motion.div variants={fadeUp} custom={0.6} className="mt-6 flex gap-3">
              <a href="https://github.com/charanvelavan" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg border border-orange-500/20 text-gray-400 hover:text-orange-400 hover:border-orange-500/50 transition-all" aria-label="GitHub"><Github size={18} /></a>
              <a href="https://www.linkedin.com/in/charan-velavan/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg border border-pink-500/20 text-gray-400 hover:text-pink-400 hover:border-pink-500/50 transition-all" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </motion.div>

            <motion.div variants={fadeUp} custom={0.7} className="mt-10 grid grid-cols-4 gap-6">
              {[{ v: "5+", l: "Projects" }, { v: "4", l: "Awards" }, { v: "15+", l: "Tech" }, { v: "1", l: "Paper" }].map((s, i) => (
                <div key={s.l}>
                  <div className={`text-2xl font-black ${["text-orange-400", "text-pink-400", "text-purple-400", "text-orange-400"][i]}`}>{s.v}</div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-600 mt-1">{s.l}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Avatar in front of sun */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative w-[240px] sm:w-[300px] md:w-[360px] aspect-square">
              {/* Sun glow behind */}
              <motion.div
                animate={reduce ? {} : { scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-gradient-to-t from-orange-500/40 via-pink-500/30 to-purple-500/20 blur-2xl"
              />

              <div className="absolute inset-[5%] rounded-full overflow-hidden ring-2 ring-orange-500/40 shadow-[0_0_60px_rgba(249,115,22,0.3)]">
                <Image src="/test.png" alt="Charan" fill sizes="360px" className="object-cover object-[50%_15%]" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0015]/60 to-transparent" />
              </div>

              {/* Chrome reflection line */}
              <div className="absolute top-[15%] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <motion.button animate={reduce ? {} : { y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })} aria-label="Scroll down">
          <span className="text-xs uppercase tracking-widest text-gray-700">Scroll</span>
          <ChevronDown className="h-5 w-5 text-orange-400" />
        </motion.button>
      </motion.div>
    </section>
  );
}
