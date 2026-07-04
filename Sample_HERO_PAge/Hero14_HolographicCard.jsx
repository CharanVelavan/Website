"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, ArrowRight, Download, ChevronDown } from "lucide-react";

/**
 * HERO 14 — Holographic Card
 *
 * Concept: A single large holographic/iridescent card that shifts colors
 * as you move the mouse — like a Pokémon holographic card effect.
 * Rainbow prismatic reflections, subtle sparkle overlay.
 *
 * Palette: Iridescent Rainbow shifting — base dark (#09090b)
 */

export default function Hero14_HolographicCard() {
  const reduce = useReducedMotion();
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const rotX = useSpring(0, { stiffness: 100, damping: 20 });
  const rotY = useSpring(0, { stiffness: 100, damping: 20 });

  const handleMouseMove = (e) => {
    if (!cardRef.current || reduce) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x: x * 100, y: y * 100 });
    rotX.set((y - 0.5) * -15);
    rotY.set((x - 0.5) * 15);
  };

  const handleMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
    setMousePos({ x: 50, y: 50 });
  };

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-[#09090b]">
      {/* Subtle grid */}
      <div className="absolute inset-0 -z-10 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 min-h-screen flex flex-col items-center justify-center pt-20 pb-24" style={{ perspective: "1000px" }}>

        {/* Holographic card */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, scale: 0.85, rotateX: 20 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ rotateX: reduce ? 0 : rotX, rotateY: reduce ? 0 : rotY, transformStyle: "preserve-3d" }}
          className="relative w-full max-w-3xl rounded-3xl overflow-hidden cursor-default"
        >
          {/* Holographic gradient overlay */}
          <div
            className="absolute inset-0 z-30 pointer-events-none opacity-30 mix-blend-color-dodge transition-all duration-200"
            style={{
              background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%,
                rgba(255,100,100,0.4) 0%,
                rgba(255,200,50,0.3) 15%,
                rgba(100,255,100,0.3) 30%,
                rgba(50,200,255,0.3) 45%,
                rgba(150,100,255,0.3) 60%,
                rgba(255,100,200,0.2) 75%,
                transparent 100%)`,
            }}
          />

          {/* Sparkle overlay */}
          <div
            className="absolute inset-0 z-20 pointer-events-none opacity-10"
            style={{
              backgroundImage: `radial-gradient(1px 1px at ${mousePos.x + 5}% ${mousePos.y + 3}%, white, transparent),
                radial-gradient(1px 1px at ${mousePos.x - 8}% ${mousePos.y + 12}%, white, transparent),
                radial-gradient(1px 1px at ${mousePos.x + 15}% ${mousePos.y - 7}%, white, transparent)`,
            }}
          />

          {/* Card border shimmer */}
          <div className="absolute -inset-px rounded-3xl z-10" style={{
            background: `conic-gradient(from ${mousePos.x * 3.6}deg, #ff6b6b, #ffd93d, #6bff6b, #6bc5ff, #d96bff, #ff6b9d, #ff6b6b)`,
            opacity: 0.5,
          }} />

          {/* Card body */}
          <div className="relative z-10 m-[1px] rounded-3xl bg-[#111113]/95 backdrop-blur-xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">

              {/* Avatar */}
              <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-2xl overflow-hidden flex-shrink-0 ring-1 ring-white/10 shadow-2xl" style={{ transform: "translateZ(30px)" }}>
                <Image src="/test.png" alt="Charan" fill sizes="208px" className="object-cover object-[50%_15%]" priority />
                {/* Holo overlay on image */}
                <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{
                  background: `linear-gradient(${mousePos.x * 2}deg, rgba(255,100,100,0.5), rgba(100,255,200,0.5), rgba(100,100,255,0.5))`,
                }} />
              </div>

              {/* Info */}
              <div className="text-center md:text-left flex-1" style={{ transform: "translateZ(20px)" }}>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-gray-400 mb-4">
                  Embedded Developer
                </span>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                  <span className="text-white">Charan</span>{" "}
                  <span className="text-transparent bg-clip-text" style={{
                    backgroundImage: `linear-gradient(${90 + mousePos.x}deg, #ff6b6b, #ffd93d, #6bff6b, #6bc5ff, #d96bff)`,
                  }}>
                    Velavan
                  </span>
                </h1>

                <p className="mt-4 text-gray-400 leading-relaxed max-w-md">
                  Building the next generation of AI communication systems,
                  UAV networks, and immersive web experiences that shine.
                </p>

                <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
                  <a href="/projects" className="group px-6 py-2.5 text-sm bg-white text-black font-semibold rounded-xl hover:scale-105 active:scale-[0.98] transition-all inline-flex items-center gap-2">
                    Projects <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a href="/resume.pdf" download className="px-6 py-2.5 text-sm border border-white/15 text-gray-300 rounded-xl hover:bg-white/10 transition-all inline-flex items-center gap-2">
                    <Download className="h-4 w-4" /> Resume
                  </a>
                </div>

                <div className="mt-6 flex justify-center md:justify-start gap-3">
                  <a href="https://github.com/charanvelavan" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full border border-white/10 text-gray-500 hover:text-white hover:border-white/30 transition-all" aria-label="GitHub"><Github size={16} /></a>
                  <a href="https://www.linkedin.com/in/charan-velavan/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full border border-white/10 text-gray-500 hover:text-white hover:border-white/30 transition-all" aria-label="LinkedIn"><Linkedin size={16} /></a>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-4 gap-4" style={{ transform: "translateZ(15px)" }}>
              {[{ v: "5+", l: "Projects" }, { v: "4", l: "Awards" }, { v: "15+", l: "Tech" }, { v: "1", l: "Paper" }].map((s) => (
                <div key={s.l} className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-white">{s.v}</div>
                  <p className="text-[9px] uppercase tracking-wider text-gray-600 mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Instruction */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-6 text-xs text-gray-600">
          Move your cursor over the card
        </motion.p>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <motion.button animate={reduce ? {} : { y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })} aria-label="Scroll down">
          <span className="text-xs uppercase tracking-widest text-gray-700">Scroll</span>
          <ChevronDown className="h-5 w-5 text-gray-500" />
        </motion.button>
      </motion.div>
    </section>
  );
}
