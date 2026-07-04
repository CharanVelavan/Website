"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, ArrowRight, Download, Sparkles, ChevronDown } from "lucide-react";

/**
 * HERO 2 — 3D Card Perspective
 *
 * Concept: A centered hero with a large floating 3D card that tilts and
 * rotates based on mouse position, creating a premium interactive feel.
 * The card contains the avatar, name, and role — everything else orbits
 * around it. The background features a subtle dot-grid with perspective
 * lines converging to the card center.
 */

function useMouseTilt(ref) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const springX = useSpring(0, { stiffness: 150, damping: 20 });
  const springY = useSpring(0, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    springX.set(y * -20);
    springY.set(x * 20);
    setTilt({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    springX.set(0);
    springY.set(0);
    setTilt({ x: 0, y: 0 });
  };

  return { springX, springY, tilt, handleMouseMove, handleMouseLeave };
}

const stats = [
  { value: "5+", label: "Projects" },
  { value: "4", label: "Awards" },
  { value: "15+", label: "Technologies" },
  { value: "1", label: "Publication" },
];

export default function Hero2_3DCardPerspective() {
  const shouldReduceMotion = useReducedMotion();
  const cardRef = useRef(null);
  const { springX, springY, tilt, handleMouseMove, handleMouseLeave } = useMouseTilt(cardRef);

  const rotateX = shouldReduceMotion ? 0 : springX;
  const rotateY = shouldReduceMotion ? 0 : springY;

  // Spotlight gradient that follows cursor
  const spotlightBg = `radial-gradient(600px circle at ${50 + tilt.x * 0.5}% ${50 + tilt.y * 0.5}%, rgba(168,85,247,0.08), transparent 60%)`;

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-[#0a0a0a]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dot grid background */}
      <div
        className="absolute inset-0 -z-10 opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Perspective lines */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] opacity-[0.04]"
          style={{
            backgroundImage: `conic-gradient(from 0deg, transparent 0deg, rgba(168,85,247,0.5) 1deg, transparent 2deg, transparent 30deg, rgba(168,85,247,0.5) 31deg, transparent 32deg, transparent 60deg, rgba(168,85,247,0.5) 61deg, transparent 62deg, transparent 90deg, rgba(168,85,247,0.5) 91deg, transparent 92deg, transparent 120deg, rgba(168,85,247,0.5) 121deg, transparent 122deg, transparent 150deg, rgba(168,85,247,0.5) 151deg, transparent 152deg, transparent 180deg, rgba(168,85,247,0.5) 181deg, transparent 182deg, transparent 210deg, rgba(168,85,247,0.5) 211deg, transparent 212deg, transparent 240deg, rgba(168,85,247,0.5) 241deg, transparent 242deg, transparent 270deg, rgba(168,85,247,0.5) 271deg, transparent 272deg, transparent 300deg, rgba(168,85,247,0.5) 301deg, transparent 302deg, transparent 330deg, rgba(168,85,247,0.5) 331deg, transparent 332deg)`,
          }}
        />
      </div>

      {/* Spotlight follows cursor */}
      <div className="absolute inset-0 -z-5 pointer-events-none transition-all duration-300" style={{ background: spotlightBg }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 min-h-screen flex flex-col items-center justify-center gap-12 pt-20 pb-24" style={{ perspective: "1200px" }}>

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-400 text-xs font-medium">
            <Sparkles size={14} />
            Available for Collaboration
          </span>
        </motion.div>

        {/* 3D Card */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, scale: 0.8, rotateX: 15 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative w-full max-w-2xl"
        >
          {/* Card glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-purple-500/40 via-fuchsia-500/20 to-blue-500/40 blur-sm" />

          {/* Card body */}
          <div className="relative rounded-3xl border border-white/10 bg-black/70 backdrop-blur-xl p-8 md:p-12 overflow-hidden">
            {/* Inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />

            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <motion.div
                style={{ translateZ: 40 }}
                className="relative w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden ring-2 ring-purple-500/30 shadow-2xl shadow-purple-500/20 flex-shrink-0"
              >
                <Image
                  src="/test.png"
                  alt="Charan"
                  fill
                  sizes="176px"
                  className="object-cover object-[50%_15%]"
                  priority
                />
              </motion.div>

              {/* Info */}
              <div className="text-center md:text-left flex-1" style={{ transform: "translateZ(30px)" }}>
                <p className="text-xs uppercase tracking-[0.2em] text-purple-400 font-semibold mb-2">
                  Embedded Developer
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                  <span className="text-white">Charan</span>{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    Velavan
                  </span>
                </h1>
                <p className="mt-4 text-gray-400 leading-relaxed max-w-md">
                  Crafting modern web apps, AI communication systems, and
                  next-gen UAV network technologies.
                </p>

                {/* CTAs inside card */}
                <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
                  <a
                    href="/projects"
                    className="group px-5 py-2.5 text-sm bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all inline-flex items-center gap-2"
                  >
                    Projects
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href="/resume.pdf"
                    download
                    className="px-5 py-2.5 text-sm border border-white/15 text-gray-300 rounded-xl hover:border-purple-500/40 hover:bg-purple-500/10 transition-all inline-flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Resume
                  </a>
                </div>
              </div>
            </div>

            {/* Stats row inside card */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-4 gap-4" style={{ transform: "translateZ(20px)" }}>
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-300 to-fuchsia-400">
                    {s.value}
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Social links below card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-4"
        >
          {[
            { href: "https://github.com/charanvelavan", Icon: Github, label: "GitHub" },
            { href: "https://www.linkedin.com/in/charan-velavan/", Icon: Linkedin, label: "LinkedIn" },
          ].map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-white/10 hover:border-purple-400 hover:bg-purple-400/10 hover:scale-110 active:scale-95 transition-all"
              aria-label={label}
            >
              <Icon size={20} />
            </a>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.button
            animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
            aria-label="Scroll down"
          >
            <span className="text-xs uppercase tracking-widest text-gray-600">Explore</span>
            <ChevronDown className="h-5 w-5 text-purple-400" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
