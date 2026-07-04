"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, ArrowRight, Download, ChevronDown, CircuitBoard, Cpu, Radio, Wifi } from "lucide-react";

/**
 * HERO 12 — Blueprint / Technical Drawing
 *
 * Concept: Engineering blueprint aesthetic with technical grid, dimension
 * lines, annotation callouts, and a schematic feel. Perfect for an
 * embedded developer — feels like reading a PCB layout or CAD drawing.
 *
 * Palette: Blueprint Blue (#1e40af), Cyan Lines (#38bdf8), White text on Navy (#0c1929)
 */

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (d = 0) => ({ opacity: 1, transition: { duration: 0.6, delay: d } }),
};

export default function Hero12_BlueprintTech() {
  const reduce = useReducedMotion();

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-[#0c1929]">
      {/* Blueprint grid */}
      <div className="absolute inset-0 -z-10 opacity-30" style={{
        backgroundImage: `
          linear-gradient(rgba(56,189,248,0.15) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56,189,248,0.15) 1px, transparent 1px),
          linear-gradient(rgba(56,189,248,0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56,189,248,0.07) 1px, transparent 1px)
        `,
        backgroundSize: "100px 100px, 100px 100px, 20px 20px, 20px 20px",
      }} />

      {/* Cross-hair markers */}
      {[{ t: "10%", l: "15%" }, { t: "80%", l: "85%" }, { t: "20%", l: "70%" }].map((pos, i) => (
        <div key={i} className="absolute -z-5 opacity-20" style={{ top: pos.t, left: pos.l }}>
          <div className="w-8 h-px bg-sky-400 absolute top-1/2 left-1/2 -translate-x-1/2" />
          <div className="h-8 w-px bg-sky-400 absolute top-1/2 left-1/2 -translate-y-1/2" />
          <div className="w-4 h-4 rounded-full border border-sky-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 min-h-screen flex flex-col justify-center pt-20 pb-24">
        {/* Title block (like a blueprint title block) */}
        <motion.div variants={fadeIn} custom={0.1} initial="hidden" animate="visible" className="mb-12">
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-sky-400/30 bg-sky-400/5">
            <CircuitBoard size={14} className="text-sky-400" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-sky-400 font-mono">REV 2026.03 — SHEET 1 OF 1</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <motion.div initial="hidden" animate="visible" className="lg:col-span-7 order-2 lg:order-1">
            <motion.p variants={fadeIn} custom={0.2} className="text-xs uppercase tracking-[0.25em] text-sky-400 font-mono mb-4">
              // DESIGNATION: EMBEDDED DEVELOPER
            </motion.p>

            <motion.h1 variants={fadeIn} custom={0.3} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.85] font-mono">
              <span className="text-white">CHARAN</span>
              <br />
              <span className="text-sky-400">VELAVAN</span>
            </motion.h1>

            {/* Dimension line */}
            <motion.div variants={fadeIn} custom={0.4} className="mt-4 flex items-center gap-2 max-w-sm">
              <div className="flex-1 flex items-center">
                <div className="w-px h-3 bg-sky-400/40" />
                <div className="flex-1 h-px bg-sky-400/40" />
                <div className="w-px h-3 bg-sky-400/40" />
              </div>
              <span className="text-[10px] text-sky-400/60 font-mono">462px</span>
            </motion.div>

            <motion.p variants={fadeIn} custom={0.5} className="mt-6 text-sm text-slate-400 max-w-lg leading-relaxed font-mono">
              /* Specializing in AI-driven communication systems,
              autonomous UAV networks, IoT platforms, and modern web
              applications. Hardware-software integration expert. */
            </motion.p>

            {/* Annotation callouts */}
            <motion.div variants={fadeIn} custom={0.55} className="mt-6 flex flex-wrap gap-3">
              {[
                { icon: Cpu, label: "IoT / Embedded" },
                { icon: Radio, label: "UAV Systems" },
                { icon: Wifi, label: "AI / ML" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 px-3 py-1.5 border border-sky-400/20 bg-sky-400/5 text-xs text-sky-300 font-mono">
                  <Icon size={12} /> {label}
                </div>
              ))}
            </motion.div>

            <motion.div variants={fadeIn} custom={0.6} className="mt-8 flex flex-wrap gap-3">
              <a href="/projects" className="group px-6 py-3 text-sm font-mono font-bold bg-sky-500 text-[#0c1929] rounded-none hover:bg-sky-400 transition-colors inline-flex items-center gap-2">
                VIEW_PROJECTS <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="/resume.pdf" download className="px-6 py-3 text-sm font-mono border border-sky-400/30 text-sky-400 hover:bg-sky-400/10 transition-all inline-flex items-center gap-2">
                <Download className="h-4 w-4" /> RESUME.PDF
              </a>
            </motion.div>

            <motion.div variants={fadeIn} custom={0.7} className="mt-6 flex gap-3">
              <a href="https://github.com/charanvelavan" target="_blank" rel="noopener noreferrer" className="p-3 border border-sky-400/20 text-slate-400 hover:text-sky-400 hover:border-sky-400/50 transition-all" aria-label="GitHub"><Github size={18} /></a>
              <a href="https://www.linkedin.com/in/charan-velavan/" target="_blank" rel="noopener noreferrer" className="p-3 border border-sky-400/20 text-slate-400 hover:text-sky-400 hover:border-sky-400/50 transition-all" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </motion.div>
          </motion.div>

          {/* Right — Technical drawing of photo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-5 order-1 lg:order-2 flex justify-center"
          >
            <div className="relative w-[260px] sm:w-[300px] md:w-[350px] lg:w-[380px] aspect-square">
              {/* Technical corners */}
              <div className="absolute -inset-4">
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-sky-400/50" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-sky-400/50" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-sky-400/50" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-sky-400/50" />
              </div>

              {/* Dashed circle overlay */}
              <div className="absolute inset-0 rounded-full border border-dashed border-sky-400/20" />
              <div className="absolute inset-[15%] rounded-full border border-dashed border-sky-400/15" />

              {/* Crosshair */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-sky-400/10" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-sky-400/10" />

              {/* Image */}
              <div className="absolute inset-[5%] rounded-full overflow-hidden border border-sky-400/30">
                <Image src="/test.png" alt="Charan" fill sizes="380px" className="object-cover object-[50%_15%]" priority />
                <div className="absolute inset-0 bg-sky-900/20 mix-blend-color" />
              </div>

              {/* Annotation */}
              <div className="absolute -right-2 top-1/4 flex items-center gap-2">
                <div className="w-8 h-px bg-sky-400/40" />
                <span className="text-[9px] text-sky-400/50 font-mono whitespace-nowrap">SUBJECT_01</span>
              </div>

              <div className="absolute -inset-8 rounded-full bg-sky-500/5 blur-xl -z-10" />
            </div>
          </motion.div>
        </div>

        {/* Stats — blueprint table */}
        <motion.div variants={fadeIn} custom={0.9} initial="hidden" animate="visible" className="mt-16 border border-sky-400/20 bg-sky-400/5 p-4 max-w-xl">
          <div className="grid grid-cols-4 gap-4">
            {[{ v: "5+", l: "PROJECTS" }, { v: "4", l: "AWARDS" }, { v: "15+", l: "TECH" }, { v: "1", l: "PAPERS" }].map((s) => (
              <div key={s.l} className="text-center">
                <div className="text-xl font-bold text-sky-400 font-mono">{s.v}</div>
                <p className="text-[9px] uppercase tracking-wider text-sky-400/50 font-mono mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <motion.button animate={reduce ? {} : { y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2 cursor-pointer font-mono" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })} aria-label="Scroll down">
          <span className="text-[10px] uppercase tracking-widest text-sky-400/40">// SCROLL</span>
          <ChevronDown className="h-5 w-5 text-sky-400/60" />
        </motion.button>
      </motion.div>
    </section>
  );
}
