"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, ArrowRight, Download, ChevronDown } from "lucide-react";

/**
 * HERO 5 — Magnetic Particles
 *
 * Concept: A dark hero with an interactive canvas of floating particles
 * that are magnetically attracted to the cursor, creating organic flowing
 * shapes. The text uses a "gravity" reveal — letters fall from above and
 * settle into place. The avatar has a particle ring that reacts to scroll.
 * Very premium, very physics-driven.
 */

function ParticleCanvas() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef([]);
  const shouldReduceMotion = useReducedMotion();

  const initParticles = useCallback((width, height) => {
    const count = Math.min(Math.floor((width * height) / 6000), 200);
    return Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      baseX: 0,
      baseY: 0,
      vx: 0,
      vy: 0,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
    })).map((p) => ({ ...p, baseX: p.x, baseY: p.y }));
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = initParticles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particlesRef.current) {
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 180;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          p.vx += dx * force * 0.01;
          p.vy += dy * force * 0.01;
        }

        // Spring back to base
        p.vx += (p.baseX - p.x) * 0.02;
        p.vy += (p.baseY - p.y) * 0.02;

        // Damping
        p.vx *= 0.92;
        p.vy *= 0.92;

        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha})`;
        ctx.fill();
      }

      // Draw connections
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.08 * (1 - dist / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [shouldReduceMotion, initParticles]);

  if (shouldReduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}

const letterVariants = {
  hidden: { opacity: 0, y: -60, rotateX: 90 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      delay: 0.5 + i * 0.05,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function Hero5_MagneticParticles() {
  const shouldReduceMotion = useReducedMotion();
  const name = "Charan";

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-[#050505]">
      <ParticleCanvas />

      {/* Gradient underlay */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#050505] to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 min-h-screen flex flex-col items-center justify-center text-center pt-20 pb-24">

        {/* Avatar with particle ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="relative mb-10"
        >
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            {/* Rotating gradient ring */}
            <motion.div
              animate={shouldReduceMotion ? {} : { rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 rounded-full"
              style={{
                background: "conic-gradient(from 0deg, #a855f7, #3b82f6, #a855f7, transparent, #a855f7)",
                WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
              }}
            />

            <div className="absolute inset-0 rounded-full overflow-hidden ring-2 ring-white/10">
              <Image
                src="/test.png"
                alt="Charan"
                fill
                sizes="160px"
                className="object-cover object-[50%_15%]"
                priority
              />
            </div>
          </div>

          {/* Status dot */}
          <div className="absolute -bottom-1 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#050505] border border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-40" />
              <span className="relative rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">Available</span>
          </div>
        </motion.div>

        {/* Role */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs uppercase tracking-[0.3em] text-purple-400/80 font-semibold mb-4"
        >
          Embedded Developer
        </motion.p>

        {/* Name — gravity drop letters */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black leading-[0.85] tracking-tighter" style={{ perspective: "600px" }}>
          <span className="sr-only">{name}</span>
          <span aria-hidden="true" className="inline-flex">
            {name.split("").map((letter, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-600 hover:from-purple-300 hover:to-purple-600 transition-all duration-300 cursor-default"
              >
                {letter}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-6 text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed"
        >
          Building the future with modern web technologies, AI-driven systems,
          and next-generation UAV networks.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="mt-8 flex flex-wrap justify-center items-center gap-4"
        >
          <a
            href="/projects"
            className="group relative px-8 py-3.5 text-sm font-semibold text-white rounded-full overflow-hidden inline-flex items-center gap-2 hover:scale-105 active:scale-[0.98] transition-transform"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full" />
            <span className="absolute inset-[1px] bg-[#050505] rounded-full" />
            <span className="absolute inset-[1px] bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full" />
            <span className="relative z-10 flex items-center gap-2">
              View Projects
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
          <a
            href="/resume.pdf"
            download
            className="px-8 py-3.5 text-sm text-gray-400 border border-white/10 rounded-full hover:border-purple-500/40 hover:text-white hover:bg-white/5 transition-all inline-flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Resume
          </a>
        </motion.div>

        {/* Socials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8 flex gap-4"
        >
          <a
            href="https://github.com/charanvelavan"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full border border-white/10 text-gray-500 hover:text-white hover:border-purple-400 hover:bg-purple-400/10 hover:scale-110 active:scale-95 transition-all"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/charan-velavan/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full border border-white/10 text-gray-500 hover:text-white hover:border-purple-400 hover:bg-purple-400/10 hover:scale-110 active:scale-95 transition-all"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          className="mt-14 flex flex-wrap justify-center gap-10 md:gap-16"
        >
          {[
            { value: "5+", label: "Projects" },
            { value: "4", label: "Awards" },
            { value: "15+", label: "Technologies" },
            { value: "1", label: "Publication" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{s.value}</div>
              <p className="text-[10px] uppercase tracking-widest text-gray-600 mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.button
            animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
            aria-label="Scroll down"
          >
            <span className="text-xs uppercase tracking-widest text-gray-700">Scroll</span>
            <ChevronDown className="h-5 w-5 text-purple-400/50" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
