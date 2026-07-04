"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, ArrowRight, Download, ChevronDown, Eye } from "lucide-react";

/**
 * HERO 4 — Spotlight Reveal
 *
 * Concept: A dark, mysterious hero where a spotlight follows the user's
 * cursor, revealing glowing text and content underneath a dark overlay.
 * The text appears etched into the surface and only "lights up" when the
 * spotlight passes over it. Creates a dramatic, interactive discovery
 * experience. On mobile, the spotlight auto-animates.
 */

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: d, ease: "easeOut" },
  }),
};

export default function Hero4_SpotlightReveal() {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  // Auto-animate spotlight on mobile / no hover
  useEffect(() => {
    if (isHovering || shouldReduceMotion) return;

    let frame;
    let t = 0;
    const animate = () => {
      t += 0.003;
      setMouse({
        x: 50 + Math.sin(t) * 30,
        y: 50 + Math.cos(t * 0.7) * 20,
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isHovering, shouldReduceMotion]);

  const spotlightSize = isHovering ? 500 : 350;

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen overflow-hidden bg-[#050505] cursor-none md:cursor-auto"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Dark noise texture */}
      <div className="absolute inset-0 -z-10 opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Spotlight layer */}
      <div
        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(${spotlightSize}px circle at ${mouse.x}% ${mouse.y}%, transparent 0%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.97) 100%)`,
        }}
      />

      {/* Spotlight glow color */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background: `radial-gradient(${spotlightSize * 0.6}px circle at ${mouse.x}% ${mouse.y}%, rgba(168,85,247,0.07) 0%, transparent 70%)`,
        }}
      />

      {/* Custom cursor (desktop only) */}
      {isHovering && (
        <div
          className="fixed z-50 pointer-events-none hidden md:flex items-center justify-center"
          style={{
            left: `${mouse.x}%`,
            top: `${mouse.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="w-6 h-6 rounded-full border-2 border-purple-400/60 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 min-h-screen flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left — Text */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6"
          >
            {/* Hint */}
            <motion.div variants={fadeIn} custom={0.1}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/20 text-purple-400 text-xs font-medium bg-purple-500/5">
                <Eye size={12} />
                Move your cursor to explore
              </span>
            </motion.div>

            <motion.p
              variants={fadeIn}
              custom={0.2}
              className="text-sm uppercase tracking-[0.25em] text-gray-500 font-medium"
            >
              Embedded Developer
            </motion.p>

            <motion.h1
              variants={fadeIn}
              custom={0.3}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tight"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500">
                Charan
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-purple-300 via-fuchsia-400 to-purple-600">
                Velavan
              </span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              custom={0.5}
              className="text-lg md:text-xl text-gray-500 max-w-lg leading-relaxed"
            >
              I architect modern web experiences, AI-powered communication
              platforms, and autonomous UAV systems that push the boundaries
              of what&apos;s possible.
            </motion.p>

            {/* CTA */}
            <motion.div variants={fadeIn} custom={0.6} className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="/projects"
                className="group relative px-7 py-3.5 text-sm font-semibold text-white rounded-xl overflow-hidden inline-flex items-center gap-2 hover:scale-105 active:scale-[0.98] transition-transform"
              >
                {/* Animated gradient bg */}
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-blue-600 bg-[length:200%_auto] animate-text-shimmer" />
                <span className="relative z-10 flex items-center gap-2">
                  View Projects
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
              <a
                href="/resume.pdf"
                download
                className="px-7 py-3.5 text-sm border border-white/10 text-gray-400 rounded-xl hover:border-purple-500/40 hover:text-white hover:bg-white/5 transition-all inline-flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Resume
              </a>
            </motion.div>

            {/* Socials */}
            <motion.div variants={fadeIn} custom={0.7} className="flex gap-3 pt-2">
              <a
                href="https://github.com/charanvelavan"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full border border-white/10 text-gray-500 hover:text-white hover:border-purple-400 hover:bg-purple-400/10 transition-all"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/charan-velavan/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full border border-white/10 text-gray-500 hover:text-white hover:border-purple-400 hover:bg-purple-400/10 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </motion.div>
          </motion.div>

          {/* Right — Glowing Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-[260px] sm:w-[320px] md:w-[380px] lg:w-[420px] aspect-square">
              {/* Pulsing outer ring */}
              <motion.div
                animate={shouldReduceMotion ? {} : {
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full border border-purple-500/30"
              />

              {/* Hexagonal clip mask for image */}
              <div className="absolute inset-[6%] rounded-full overflow-hidden ring-2 ring-purple-500/40 shadow-[0_0_80px_rgba(168,85,247,0.3)]">
                <Image
                  src="/test.png"
                  alt="Charan"
                  fill
                  sizes="(max-width: 640px) 260px, 420px"
                  className="object-cover object-[50%_15%]"
                  priority
                />
                {/* Color tint overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-600/10 to-transparent mix-blend-overlay" />
              </div>

              {/* Ambient glow */}
              <div className="absolute -inset-20 bg-purple-600/15 rounded-full blur-[80px] -z-10" />
            </div>
          </motion.div>
        </div>

        {/* Stats bar at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-2xl"
        >
          {[
            { value: "5+", label: "Projects" },
            { value: "4", label: "Achievements" },
            { value: "15+", label: "Technologies" },
            { value: "1", label: "Publication" },
          ].map((s) => (
            <div key={s.label} className="group">
              <div className="text-3xl md:text-4xl font-bold text-white/90 group-hover:text-purple-400 transition-colors">
                {s.value}
              </div>
              <p className="text-[10px] uppercase tracking-widest text-gray-600 mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30"
        >
          <motion.button
            animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
            aria-label="Scroll down"
          >
            <span className="text-xs uppercase tracking-widest text-gray-700">Discover</span>
            <ChevronDown className="h-5 w-5 text-purple-400/60" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
