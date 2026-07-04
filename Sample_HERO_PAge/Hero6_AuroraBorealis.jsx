"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, ArrowRight, Download, ChevronDown, Wifi, Cpu, Radio } from "lucide-react";

/**
 * HERO 6 — Aurora Borealis
 *
 * Concept: Ethereal aurora waves ripple across the sky with layered
 * green/cyan/teal gradients. The text glows with northern-light colors.
 * Calm, mesmerizing, nature-meets-tech aesthetic.
 *
 * Palette: Emerald, Cyan, Teal on deep navy (#020617)
 */

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function Hero6_AuroraBorealis() {
  const reduce = useReducedMotion();

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-[#020617]">
      {/* Aurora layers */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={reduce ? {} : { x: [0, 100, -50, 0], y: [0, -30, 20, 0], scale: [1, 1.2, 0.9, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -left-1/4 w-[150%] h-[60%] bg-gradient-to-r from-emerald-500/20 via-cyan-500/15 to-teal-500/20 blur-[100px] rounded-full"
        />
        <motion.div
          animate={reduce ? {} : { x: [0, -80, 60, 0], y: [0, 40, -20, 0], scale: [1, 0.8, 1.1, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -right-1/4 w-[120%] h-[50%] bg-gradient-to-l from-cyan-500/15 via-emerald-400/10 to-transparent blur-[120px] rounded-full"
        />
        <motion.div
          animate={reduce ? {} : { x: [0, 60, -40, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/3 w-[40%] h-[70%] bg-gradient-to-b from-green-400/10 via-emerald-500/15 to-transparent blur-[80px]"
        />
      </div>

      {/* Stars */}
      <div className="absolute inset-0 -z-10">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            animate={reduce ? {} : { opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
            className="absolute w-px h-px bg-white rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 60}%` }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 min-h-screen flex flex-col justify-center pt-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left */}
          <motion.div variants={stagger} initial="hidden" animate="visible" className="order-2 lg:order-1">
            <motion.div variants={fadeUp} className="mb-5">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                <Wifi size={12} />
                Connected & Open to Work
              </span>
            </motion.div>

            <motion.p variants={fadeUp} className="text-sm uppercase tracking-[0.25em] text-cyan-400/70 font-semibold mb-4">
              Embedded Developer
            </motion.p>

            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9]">
              <span className="text-white">Hi, I&apos;m</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-teal-400">
                Charan
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-6 text-lg text-slate-400 max-w-lg leading-relaxed">
              Crafting AI-driven communication systems, UAV networks, and
              modern web experiences that bridge hardware and software.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <a href="/projects" className="group px-6 py-3 text-sm bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-105 active:scale-[0.98] transition-all inline-flex items-center gap-2">
                View Projects <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="/resume.pdf" download className="px-6 py-3 text-sm border border-emerald-500/30 text-emerald-300 rounded-xl hover:bg-emerald-500/10 transition-all inline-flex items-center gap-2">
                <Download className="h-4 w-4" /> Resume
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6 flex gap-3">
              <a href="https://github.com/charanvelavan" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full border border-emerald-500/20 text-slate-400 hover:text-emerald-300 hover:border-emerald-400 hover:bg-emerald-400/10 transition-all" aria-label="GitHub"><Github size={18} /></a>
              <a href="https://www.linkedin.com/in/charan-velavan/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full border border-emerald-500/20 text-slate-400 hover:text-emerald-300 hover:border-emerald-400 hover:bg-emerald-400/10 transition-all" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 grid grid-cols-4 gap-6">
              {[{ v: "5+", l: "Projects" }, { v: "4", l: "Awards" }, { v: "15+", l: "Technologies" }, { v: "1", l: "Publication" }].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300">{s.v}</div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">{s.l}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative w-[240px] sm:w-[300px] md:w-[380px] lg:w-[440px] aspect-square">
              {/* Aurora ring */}
              <motion.div
                animate={reduce ? {} : { rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-3 rounded-full opacity-60"
                style={{ background: "conic-gradient(from 0deg, #10b981, #06b6d4, #14b8a6, transparent, #10b981)" ,
                  WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
                }}
              />

              {/* Tech icons floating */}
              {!reduce && [
                { Icon: Cpu, top: "5%", left: "-8%", delay: 0 },
                { Icon: Radio, top: "70%", left: "-10%", delay: 1 },
                { Icon: Wifi, top: "20%", right: "-8%", delay: 2 },
              ].map(({ Icon, delay, ...pos }, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay, ease: "easeInOut" }}
                  className="absolute z-20 p-2 rounded-xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-sm shadow-lg shadow-emerald-500/10"
                  style={pos}
                >
                  <Icon size={16} className="text-emerald-400" />
                </motion.div>
              ))}

              <div className="absolute inset-0 rounded-full overflow-hidden ring-2 ring-emerald-500/30 shadow-2xl shadow-emerald-500/20">
                <Image src="/test.png" alt="Charan" fill sizes="440px" className="object-cover object-[50%_15%]" priority />
              </div>

              <div className="absolute -inset-20 bg-emerald-500/10 rounded-full blur-[80px] -z-10" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <motion.button animate={reduce ? {} : { y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })} aria-label="Scroll down">
          <span className="text-xs uppercase tracking-widest text-slate-600">Scroll</span>
          <ChevronDown className="h-5 w-5 text-emerald-400" />
        </motion.button>
      </motion.div>
    </section>
  );
}
