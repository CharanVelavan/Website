"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, ArrowRight, Download, ChevronDown, Zap } from "lucide-react";

/**
 * HERO 7 — Neon Cyberpunk
 *
 * Concept: Cyberpunk-inspired hero with neon glow effects, glitch text,
 * a CRT scanline overlay, and hot pink/cyan neon signs against a dark
 * city-grid background.
 *
 * Palette: Hot Pink (#ec4899), Cyan (#06b6d4), Yellow (#eab308) on dark (#0a0a0f)
 */

const glitchKeyframes = `
@keyframes glitch1 {
  0%, 100% { clip-path: inset(40% 0 61% 0); transform: translate(-2px, 2px); }
  20% { clip-path: inset(92% 0 1% 0); transform: translate(1px, -1px); }
  40% { clip-path: inset(43% 0 1% 0); transform: translate(-1px, 3px); }
  60% { clip-path: inset(25% 0 58% 0); transform: translate(3px, 1px); }
  80% { clip-path: inset(54% 0 7% 0); transform: translate(-3px, -2px); }
}
@keyframes glitch2 {
  0%, 100% { clip-path: inset(65% 0 13% 0); transform: translate(2px, -1px); }
  20% { clip-path: inset(15% 0 62% 0); transform: translate(-1px, 2px); }
  40% { clip-path: inset(78% 0 2% 0); transform: translate(1px, -3px); }
  60% { clip-path: inset(8% 0 74% 0); transform: translate(-2px, 1px); }
  80% { clip-path: inset(36% 0 39% 0); transform: translate(3px, 2px); }
}
`;

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: "easeOut" } }),
};

export default function Hero7_NeonCyberpunk() {
  const reduce = useReducedMotion();

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-[#0a0a0f]">
      <style dangerouslySetInnerHTML={{ __html: glitchKeyframes }} />

      {/* Grid floor */}
      <div className="absolute inset-0 -z-10" style={{
        backgroundImage: `linear-gradient(rgba(236,72,153,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(236,72,153,0.05) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        perspective: "500px",
        transform: "rotateX(45deg)",
        transformOrigin: "center 120%",
      }} />

      {/* Scanlines */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.15)_2px,rgba(255,255,255,0.15)_4px)]" />

      {/* Neon glow blobs */}
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-pink-500/15 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-20 right-20 w-[250px] h-[250px] bg-cyan-500/15 rounded-full blur-[100px] -z-10" />
      <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] bg-yellow-500/8 rounded-full blur-[80px] -z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 min-h-screen flex flex-col justify-center pt-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left */}
          <motion.div initial="hidden" animate="visible" className="order-2 lg:order-1">
            <motion.div variants={fadeUp} custom={0.1} className="mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/40 text-pink-400 text-xs font-mono uppercase tracking-wider">
                <Zap size={12} /> System Online
              </span>
            </motion.div>

            <motion.p variants={fadeUp} custom={0.2} className="text-sm uppercase tracking-[0.3em] text-cyan-400 font-mono mb-4">
              &gt; Embedded_Developer
            </motion.p>

            {/* Glitch heading */}
            <motion.div variants={fadeUp} custom={0.3} className="relative">
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.85] text-white">
                CHARAN
              </h1>
              {/* Glitch layers */}
              {!reduce && (
                <>
                  <h1 className="absolute inset-0 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.85] text-pink-500 opacity-70" style={{ animation: "glitch1 3s infinite linear" }} aria-hidden="true">CHARAN</h1>
                  <h1 className="absolute inset-0 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.85] text-cyan-400 opacity-70" style={{ animation: "glitch2 3s infinite linear" }} aria-hidden="true">CHARAN</h1>
                </>
              )}
            </motion.div>

            <motion.div variants={fadeUp} custom={0.4} className="mt-2 flex items-center gap-3">
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-pink-500 to-transparent" />
              <span className="text-xs font-mono text-yellow-400 tracking-wider">VELAVAN</span>
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-cyan-500 to-transparent" />
            </motion.div>

            <motion.p variants={fadeUp} custom={0.5} className="mt-6 text-base text-gray-400 max-w-lg leading-relaxed font-mono">
              // Building AI-driven systems, UAV networks, and next-gen
              web experiences. Where hardware meets code.
            </motion.p>

            <motion.div variants={fadeUp} custom={0.6} className="mt-8 flex flex-wrap gap-3">
              <a href="/projects" className="group px-6 py-3 text-sm font-mono font-bold bg-pink-500 text-black rounded-lg hover:bg-pink-400 hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all inline-flex items-center gap-2">
                PROJECTS <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="/resume.pdf" download className="px-6 py-3 text-sm font-mono border-2 border-cyan-500/50 text-cyan-400 rounded-lg hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all inline-flex items-center gap-2">
                <Download className="h-4 w-4" /> RESUME
              </a>
            </motion.div>

            <motion.div variants={fadeUp} custom={0.7} className="mt-6 flex gap-3">
              <a href="https://github.com/charanvelavan" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg border border-pink-500/30 text-gray-400 hover:text-pink-400 hover:border-pink-500 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all" aria-label="GitHub"><Github size={18} /></a>
              <a href="https://www.linkedin.com/in/charan-velavan/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg border border-cyan-500/30 text-gray-400 hover:text-cyan-400 hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </motion.div>
          </motion.div>

          {/* Right — Neon framed photo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative w-[260px] sm:w-[320px] md:w-[380px] aspect-[3/4]">
              {/* Neon border */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-pink-500 via-yellow-500 to-cyan-500 opacity-80" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500 via-yellow-500 to-cyan-500 opacity-40 blur-xl" />

              <div className="absolute inset-[3px] rounded-2xl overflow-hidden bg-[#0a0a0f]">
                <Image src="/test.png" alt="Charan" fill sizes="380px" className="object-cover object-[50%_15%]" priority />
                {/* CRT overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-60" />
              </div>

              {/* Corner brackets */}
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-pink-500" />
              <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-cyan-500" />
              <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-cyan-500" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-pink-500" />
            </div>
          </motion.div>
        </div>

        {/* Stats — neon style */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-16 grid grid-cols-4 gap-6 max-w-xl">
          {[{ v: "5+", l: "Projects", c: "text-pink-400" }, { v: "4", l: "Awards", c: "text-cyan-400" }, { v: "15+", l: "Tech", c: "text-yellow-400" }, { v: "1", l: "Paper", c: "text-pink-400" }].map((s) => (
            <div key={s.l} className="text-center">
              <div className={`text-2xl md:text-3xl font-black font-mono ${s.c}`}>{s.v}</div>
              <p className="text-[10px] uppercase tracking-wider text-gray-600 font-mono mt-1">{s.l}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30">
        <motion.button animate={reduce ? {} : { y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })} aria-label="Scroll down">
          <span className="text-xs uppercase tracking-widest text-gray-700 font-mono">Scroll</span>
          <ChevronDown className="h-5 w-5 text-pink-400" />
        </motion.button>
      </motion.div>
    </section>
  );
}
