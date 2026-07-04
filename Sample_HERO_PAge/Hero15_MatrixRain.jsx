"use client";

import { useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, ArrowRight, Download, ChevronDown, Shield } from "lucide-react";

/**
 * HERO 15 — Matrix Rain
 *
 * Concept: Falling matrix-style code rain in the background with a hacker
 * terminal aesthetic. Green phosphor monochrome look. The text appears
 * as if being "decoded" character by character.
 *
 * Palette: Matrix Green (#22c55e), Phosphor (#4ade80) on Black (#000000)
 */

function MatrixCanvas() {
  const canvasRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    let animId;
    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#22c55e";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.globalAlpha = 0.6 + Math.random() * 0.4;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [reduce]);

  if (reduce) return null;
  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-30" />;
}

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: "easeOut" } }),
};

export default function Hero15_MatrixRain() {
  const reduce = useReducedMotion();

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-black">
      <MatrixCanvas />

      {/* Vignette */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 min-h-screen flex flex-col justify-center pt-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <motion.div initial="hidden" animate="visible" className="order-2 lg:order-1">
            <motion.div variants={fadeUp} custom={0.1} className="mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-green-500/30 bg-green-500/5 text-green-400 text-xs font-mono">
                <Shield size={12} /> STATUS: ONLINE
              </span>
            </motion.div>

            <motion.p variants={fadeUp} custom={0.2} className="text-sm font-mono text-green-500/60 mb-3">
              {">"} user.role = "Embedded Developer"
            </motion.p>

            <motion.h1 variants={fadeUp} custom={0.3} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.85] font-mono">
              <span className="text-green-400">CHARAN</span>
            </motion.h1>
            <motion.h2 variants={fadeUp} custom={0.35} className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono text-green-600 mt-1">
              VELAVAN
            </motion.h2>

            <motion.p variants={fadeUp} custom={0.5} className="mt-6 text-sm text-green-400/60 max-w-lg leading-relaxed font-mono">
              {"> "}Systems architect specializing in AI-driven communication,
              UAV autonomous networks, IoT platforms, and modern full-stack
              web development. Building the future, one commit at a time.
            </motion.p>

            <motion.div variants={fadeUp} custom={0.6} className="mt-8 flex flex-wrap gap-3">
              <a href="/projects" className="group px-6 py-3 text-sm font-mono font-bold bg-green-500 text-black rounded-lg hover:bg-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all inline-flex items-center gap-2">
                ./PROJECTS <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="/resume.pdf" download className="px-6 py-3 text-sm font-mono border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/10 transition-all inline-flex items-center gap-2">
                <Download className="h-4 w-4" /> RESUME
              </a>
            </motion.div>

            <motion.div variants={fadeUp} custom={0.7} className="mt-6 flex gap-3">
              <a href="https://github.com/charanvelavan" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg border border-green-500/20 text-green-600 hover:text-green-400 hover:border-green-500/50 hover:shadow-[0_0_10px_rgba(34,197,94,0.2)] transition-all" aria-label="GitHub"><Github size={18} /></a>
              <a href="https://www.linkedin.com/in/charan-velavan/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg border border-green-500/20 text-green-600 hover:text-green-400 hover:border-green-500/50 hover:shadow-[0_0_10px_rgba(34,197,94,0.2)] transition-all" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </motion.div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative w-[240px] sm:w-[300px] md:w-[360px] aspect-square">
              {/* Green glow */}
              <div className="absolute -inset-8 bg-green-500/10 rounded-full blur-[60px]" />

              {/* Hex border */}
              <div className="absolute inset-0 rounded-full border-2 border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.15)]" />

              <div className="absolute inset-[4%] rounded-full overflow-hidden">
                <Image src="/test.png" alt="Charan" fill sizes="360px" className="object-cover object-[50%_15%]" priority />
                {/* Green tint */}
                <div className="absolute inset-0 bg-green-900/20 mix-blend-overlay" />
                {/* Scanline on photo */}
                <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(34,197,94,0.3)_2px,rgba(34,197,94,0.3)_4px)]" />
              </div>

              {/* Data readout */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black border border-green-500/30 rounded font-mono text-[10px] text-green-500/70 whitespace-nowrap">
                ID: CV-2026 | CLEARANCE: FULL
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div variants={fadeUp} custom={0.9} initial="hidden" animate="visible" className="mt-16 grid grid-cols-4 gap-6 max-w-md">
          {[{ v: "5+", l: "PROJECTS" }, { v: "4", l: "AWARDS" }, { v: "15+", l: "TECH" }, { v: "1", l: "PAPERS" }].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-xl font-bold text-green-400 font-mono">{s.v}</div>
              <p className="text-[9px] uppercase tracking-wider text-green-600/50 font-mono mt-1">{s.l}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <motion.button animate={reduce ? {} : { y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2 cursor-pointer font-mono" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })} aria-label="Scroll down">
          <span className="text-[10px] uppercase tracking-widest text-green-700">SCROLL</span>
          <ChevronDown className="h-5 w-5 text-green-500/50" />
        </motion.button>
      </motion.div>
    </section>
  );
}
