"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  Github,
  Linkedin,
  ArrowRight,
  Download,
  MapPin,
  Briefcase,
  GraduationCap,
  Zap,
  ChevronDown,
} from "lucide-react";

/**
 * HERO 3 — Bento Grid
 *
 * Concept: A modern dashboard-inspired bento grid layout where the hero
 * information is distributed across glass-morphism cards of varying sizes.
 * Each card reveals a different facet — name, photo, stats, location,
 * tech stack, and quick links — creating an engaging, scannable layout
 * that feels like a designer's portfolio dashboard.
 */

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const card = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const techStack = [
  "React", "Next.js", "Node.js", "Python", "C/C++",
  "Tailwind", "IoT", "MQTT", "TensorFlow", "Docker",
];

export default function Hero3_BentoGrid() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Subtle gradient mesh */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        variants={shouldReduceMotion ? {} : container}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-24 md:pt-28 pb-20 min-h-screen flex flex-col justify-center"
      >
        {/* BENTO GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 auto-rows-[120px] md:auto-rows-[140px] gap-3 md:gap-4">

          {/* Card 1 — Name + Title (spans 4 cols, 2 rows) */}
          <motion.div
            variants={card}
            className="col-span-2 md:col-span-4 lg:col-span-4 row-span-2 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-8 md:p-10 flex flex-col justify-center relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
            <motion.div
              className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors duration-700"
            />
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium w-fit mb-5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-50" />
                <span className="relative rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              Open to Opportunities
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.9] relative z-10">
              <span className="text-white">Hi, I&apos;m </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400">
                Charan
              </span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-gray-400 max-w-lg relative z-10">
              Embedded developer building AI-driven communication systems, UAV networks,
              and modern web experiences.
            </p>
          </motion.div>

          {/* Card 2 — Photo (spans 2 cols, 2 rows) */}
          <motion.div
            variants={card}
            className="col-span-2 row-span-2 rounded-3xl border border-white/10 overflow-hidden relative group"
          >
            <Image
              src="/test.png"
              alt="Charan"
              fill
              sizes="(max-width: 768px) 50vw, 280px"
              className="object-cover object-[50%_15%] group-hover:scale-105 transition-transform duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white font-semibold text-lg">Charan Velavan</p>
              <p className="text-gray-400 text-sm flex items-center gap-1">
                <MapPin size={12} /> India
              </p>
            </div>
          </motion.div>

          {/* Card 3 — Quick stats (2 cols, 1 row) */}
          <motion.div
            variants={card}
            className="col-span-2 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 flex items-center justify-around"
          >
            {[
              { icon: Briefcase, value: "5+", label: "Projects" },
              { icon: Zap, value: "4", label: "Awards" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <Icon size={16} className="mx-auto text-purple-400 mb-1" />
                <div className="text-2xl font-bold text-white">{value}</div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500">{label}</p>
              </div>
            ))}
          </motion.div>

          {/* Card 4 — Tech stack marquee (2 cols, 1 row) */}
          <motion.div
            variants={card}
            className="col-span-2 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm px-5 py-4 overflow-hidden flex items-center"
          >
            <div className="overflow-hidden relative w-full">
              <motion.div
                animate={shouldReduceMotion ? {} : { x: ["0%", "-50%"] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="flex gap-3 whitespace-nowrap"
              >
                {[...techStack, ...techStack].map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 font-medium flex-shrink-0"
                  >
                    {tech}
                  </span>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Card 5 — CTA buttons (2 cols, 1 row) */}
          <motion.div
            variants={card}
            className="col-span-2 rounded-3xl border border-white/10 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm p-5 flex items-center gap-3"
          >
            <a
              href="/projects"
              className="group flex-1 text-center px-4 py-2.5 text-sm bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all inline-flex items-center justify-center gap-2"
            >
              Projects
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/resume.pdf"
              download
              className="flex-1 text-center px-4 py-2.5 text-sm border border-white/15 text-gray-300 rounded-xl hover:border-purple-500/40 hover:bg-purple-500/10 transition-all inline-flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Resume
            </a>
          </motion.div>

          {/* Card 6 — Education badge (1 col, 1 row) */}
          <motion.div
            variants={card}
            className="col-span-1 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-4 flex flex-col items-center justify-center text-center"
          >
            <GraduationCap size={20} className="text-blue-400 mb-2" />
            <p className="text-xs text-gray-400 leading-tight">B.Tech ECE</p>
          </motion.div>

          {/* Card 7 — Socials (1 col, 1 row) */}
          <motion.div
            variants={card}
            className="col-span-1 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-4 flex items-center justify-center gap-3"
          >
            <a
              href="https://github.com/charanvelavan"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full border border-white/10 hover:border-purple-400 hover:bg-purple-400/10 transition-all"
              aria-label="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/charan-velavan/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full border border-white/10 hover:border-purple-400 hover:bg-purple-400/10 transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 flex justify-center"
        >
          <motion.button
            animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
            aria-label="Scroll down"
          >
            <span className="text-xs uppercase tracking-widest text-gray-600">Scroll</span>
            <ChevronDown className="h-5 w-5 text-purple-400" />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
