"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, ArrowRight, Download, ChevronDown, Star } from "lucide-react";

/**
 * HERO 13 — Constellation Map
 *
 * Concept: A night-sky background with twinkling stars. Key skills and
 * traits are positioned as constellation nodes connected by lines,
 * forming a star map. The avatar sits at the center of the constellation.
 * Gold/amber accents on deep navy.
 *
 * Palette: Gold (#fbbf24), Amber (#f59e0b), Warm White on Deep Navy (#070b1a)
 */

const constellationNodes = [
  { x: 15, y: 20, label: "React" },
  { x: 28, y: 35, label: "Next.js" },
  { x: 10, y: 55, label: "IoT" },
  { x: 25, y: 70, label: "Python" },
  { x: 75, y: 18, label: "UAV" },
  { x: 85, y: 40, label: "AI/ML" },
  { x: 90, y: 60, label: "C/C++" },
  { x: 78, y: 75, label: "MQTT" },
];

const connections = [
  [0, 1], [1, 2], [2, 3], [4, 5], [5, 6], [6, 7], [1, 4], [3, 7],
];

function StarField() {
  const reduce = useReducedMotion();
  return (
    <div className="absolute inset-0 -z-10">
      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div
          key={i}
          animate={reduce ? {} : { opacity: [0.1, 0.7, 0.1] }}
          transition={{ duration: 2 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
          className="absolute rounded-full bg-amber-100"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
          }}
        />
      ))}
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: "easeOut" } }),
};

export default function Hero13_ConstellationMap() {
  const reduce = useReducedMotion();

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-[#070b1a]">
      <StarField />

      {/* Constellation SVG overlay */}
      <svg className="absolute inset-0 w-full h-full -z-5 pointer-events-none opacity-40" preserveAspectRatio="none">
        {/* Lines */}
        {connections.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={`${constellationNodes[a].x}%`}
            y1={`${constellationNodes[a].y}%`}
            x2={`${constellationNodes[b].x}%`}
            y2={`${constellationNodes[b].y}%`}
            stroke="rgba(251,191,36,0.3)"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.5 + i * 0.15 }}
          />
        ))}
        {/* Nodes */}
        {constellationNodes.map((node, i) => (
          <motion.circle
            key={i}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r="3"
            fill="rgba(251,191,36,0.6)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
          />
        ))}
      </svg>

      {/* Constellation labels */}
      {constellationNodes.map((node, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.2 + i * 0.1 }}
          className="absolute text-[9px] text-amber-400/60 font-mono tracking-wider hidden md:block pointer-events-none"
          style={{ left: `${node.x + 1.5}%`, top: `${node.y + 1}%` }}
        >
          {node.label}
        </motion.span>
      ))}

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] -z-10" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 min-h-screen flex flex-col items-center justify-center text-center pt-20 pb-24">

        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mb-8"
        >
          <div className="relative w-28 h-28 md:w-36 md:h-36">
            <motion.div
              animate={reduce ? {} : { rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-3 rounded-full border border-dashed border-amber-500/30"
            />
            <div className="absolute inset-0 rounded-full overflow-hidden ring-2 ring-amber-500/30 shadow-[0_0_40px_rgba(251,191,36,0.15)]">
              <Image src="/test.png" alt="Charan" fill sizes="144px" className="object-cover object-[50%_15%]" priority />
            </div>
          </div>
          {/* Star icon */}
          <div className="absolute -top-2 -right-2 p-1.5 rounded-full bg-[#070b1a] border border-amber-500/40">
            <Star size={12} className="text-amber-400 fill-amber-400" />
          </div>
        </motion.div>

        <motion.p variants={fadeUp} custom={0.3} initial="hidden" animate="visible" className="text-xs uppercase tracking-[0.3em] text-amber-400/70 font-semibold mb-3">
          Embedded Developer
        </motion.p>

        <motion.h1 variants={fadeUp} custom={0.4} initial="hidden" animate="visible" className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9]">
          <span className="text-white">Charan</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
            Velavan
          </span>
        </motion.h1>

        <motion.p variants={fadeUp} custom={0.6} initial="hidden" animate="visible" className="mt-6 text-lg text-slate-400 max-w-xl leading-relaxed">
          Mapping the intersection of embedded systems, AI, and modern web —
          connecting the dots between hardware and software like constellations in code.
        </motion.p>

        <motion.div variants={fadeUp} custom={0.7} initial="hidden" animate="visible" className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="/projects" className="group px-6 py-3 text-sm bg-gradient-to-r from-amber-500 to-yellow-500 text-[#070b1a] font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105 active:scale-[0.98] transition-all inline-flex items-center gap-2">
            Explore Projects <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="/resume.pdf" download className="px-6 py-3 text-sm border border-amber-500/30 text-amber-300 rounded-xl hover:bg-amber-500/10 transition-all inline-flex items-center gap-2">
            <Download className="h-4 w-4" /> Resume
          </a>
        </motion.div>

        <motion.div variants={fadeUp} custom={0.8} initial="hidden" animate="visible" className="mt-6 flex gap-4">
          <a href="https://github.com/charanvelavan" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full border border-amber-500/20 text-slate-400 hover:text-amber-400 hover:border-amber-400/50 transition-all" aria-label="GitHub"><Github size={18} /></a>
          <a href="https://www.linkedin.com/in/charan-velavan/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full border border-amber-500/20 text-slate-400 hover:text-amber-400 hover:border-amber-400/50 transition-all" aria-label="LinkedIn"><Linkedin size={18} /></a>
        </motion.div>

        <motion.div variants={fadeUp} custom={0.9} initial="hidden" animate="visible" className="mt-12 flex gap-12">
          {[{ v: "5+", l: "Projects" }, { v: "4", l: "Awards" }, { v: "15+", l: "Tech" }, { v: "1", l: "Paper" }].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-2xl font-bold text-amber-400">{s.v}</div>
              <p className="text-[10px] uppercase tracking-wider text-slate-600 mt-1">{s.l}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <motion.button animate={reduce ? {} : { y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })} aria-label="Scroll down">
          <span className="text-xs uppercase tracking-widest text-slate-700">Scroll</span>
          <ChevronDown className="h-5 w-5 text-amber-400/50" />
        </motion.button>
      </motion.div>
    </section>
  );
}
