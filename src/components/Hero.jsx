"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, ArrowRight, Download, ChevronDown, Cpu, Radio, Zap } from "lucide-react";
import Counter from "@/components/Counter";

/* ── Stagger helpers ── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const wordVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" },
  }),
};

/* ── Orbital icons around the avatar ── */
const orbitIcons = [
  { Icon: Cpu, delay: "0s", duration: "14s" },
  { Icon: Radio, delay: "-4.7s", duration: "14s" },
  { Icon: Zap, delay: "-9.3s", duration: "14s" },
];

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const gradientOpacity = useTransform(scrollY, [0, 7500], [1, 0]);

  return (
    <section id="hero" className="relative min-h-screen pt-20 pb-12 md:pt-28 md:pb-16 pb-tab-safe overflow-hidden">
      {/* ═══ PARTICLE GRID BACKGROUND ═══ */}
      <div className="absolute inset-0 -z-20 particle-grid animate-grid-pulse pointer-events-none" />


      {/* ═══ ANIMATED GRADIENT BLOBS ═══ */}
      <motion.div
        style={{ opacity: gradientOpacity }}
        className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? { x: 0, y: 0 }
              : { x: [0, 50, 0], y: [0, 30, 0] }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 20, repeat: Infinity, ease: "easeInOut" }
          }
          className="absolute -top-40 -left-40 h-[250px] w-[250px] md:h-[600px] md:w-[600px] rounded-full bg-purple-500/30 blur-3xl"
        />
        <motion.div
          animate={
            shouldReduceMotion
              ? { x: 0, y: 0 }
              : { x: [0, -50, 0], y: [0, -30, 0] }
          }
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 25, repeat: Infinity, ease: "easeInOut" }
          }
          className="absolute top-1/3 -right-40 h-[250px] w-[250px] md:h-[600px] md:w-[600px] rounded-full bg-blue-500/30 blur-3xl"
        />
      </motion.div>

      {/* ═══ CONTENT GRID ═══ */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-start">
          {/* ── LEFT COLUMN ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col pt-4 md:pt-8"
          >
            {/* Status badge */}
            <motion.div variants={wordVariants} className="mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-status-ping" />
                  <span className="relative rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                Open to Opportunities
              </span>
            </motion.div>

            {/* Role label — letter-by-letter reveal with cursor */}
            <p className="text-sm md:text-base uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-5 font-medium flex items-center">
              {"Embedded Developer".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.22, delay: 0.32 + i * 0.04, ease: "easeOut" }}
                  className="inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
              {/* Blinking cursor fades out after typing completes */}
              <motion.span
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 0, 1, 0, 1, 0, 0] }}
                transition={{
                  duration: 2.1,
                  delay: 0.32 + 18 * 0.04,
                  ease: "steps(1)",
                  times: [0, 0.14, 0.28, 0.43, 0.57, 0.71, 1],
                }}
                className="inline-block ml-[2px] w-[1.5px] h-[0.85em] bg-purple-400 translate-y-[1px]"
              />
            </p>

            {/* Main heading – word-by-word stagger */}
            <motion.h1
              variants={containerVariants}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[0.9]"
            >
              <motion.span variants={wordVariants} className="inline-block">
                Hello{" "}
              </motion.span>
              <motion.span variants={wordVariants} className="inline-block">
                I&apos;m
              </motion.span>
              <br />
              <motion.span
                variants={wordVariants}
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-500 animate-text-shimmer"
                style={{ backgroundSize: "200% auto" }}
              >
                Charan
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={wordVariants}
              className="mt-6 md:mt-8 max-w-xl text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed"
            >
              I build modern web applications and work on AI-driven communication
              systems, UAV networks, and next-generation technologies.
            </motion.p>

            {/* CTA BUTTONS */}
            <motion.div
              variants={wordVariants}
              className="mt-6 md:mt-10 flex flex-wrap items-center gap-3"
            >
              <a
                href="/projects"
                className="group px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-400 hover:to-blue-400 transition-all hover:shadow-lg hover:shadow-purple-500/40 hover:scale-105 active:scale-[0.98] inline-flex items-center gap-2"
              >
                View Projects
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="/resume.pdf"
                download
                className="group px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base border border-purple-500/40 text-purple-600 dark:text-purple-300 rounded-xl hover:border-purple-500/70 hover:bg-purple-500/10 transition-all hover:scale-105 active:scale-[0.98] inline-flex items-center gap-2"
              >
                <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
                Resume
              </a>

              <a
                href="#contact"
                className="px-2 py-2.5 text-sm md:text-base text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Contact Me
              </a>
            </motion.div>

            {/* SOCIAL LINKS */}
            <motion.div variants={wordVariants} className="mt-6 md:mt-8 flex gap-3">
              <a
                href="https://github.com/charanvelavan"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full border border-black/15 dark:border-white/15 hover:border-purple-400 hover:bg-purple-400/10 transition-all hover:scale-110 active:scale-95 animate-glow-pulse"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>

              <a
                href="https://www.linkedin.com/in/charan-velavan/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full border border-black/15 dark:border-white/15 hover:border-purple-400 hover:bg-purple-400/10 transition-all hover:scale-110 active:scale-95 animate-glow-pulse"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </motion.div>

            {/* STATS */}
            <motion.div
              variants={containerVariants}
              className="mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8"
            >
              {[
                { value: 5, label: "Major Projects" },
                { value: 4, label: "Achievements" },
                { value: 15, label: "Technologies" },
                { value: 1, label: "Publications" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  variants={wordVariants}
                  className="group p-3 md:p-0"
                >
                  <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
                    <Counter value={item.value} />
                  </div>
                  <p className="text-[10px] md:text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-1 group-hover:text-gray-300 transition">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT COLUMN – AVATAR WITH ORBITS ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex justify-center md:justify-end pt-4 md:pt-8"
          >
            <div className="relative aspect-square w-[200px] xs:w-[240px] sm:w-[300px] md:w-[400px] lg:w-[460px]">
              {/* REVOLVING DASHED RING */}
              <motion.div
                animate={shouldReduceMotion ? { rotate: 0 } : { rotate: 360 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 20, repeat: Infinity, ease: "linear" }
                }
                className="absolute inset-[3%] rounded-full border-2 border-dashed border-purple-400/60"
              />

              {/* PULSING RING */}
              <motion.div
                animate={
                  shouldReduceMotion
                    ? { scale: 1, opacity: 0.6 }
                    : { scale: [1, 1.05, 1], opacity: [0.4, 0.8, 0.4] }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }
                className="absolute inset-0 rounded-full border border-purple-500/40"
              />

              {/* ACCENT RINGS */}
              <div className="absolute inset-0 rounded-full border border-purple-500/20 scale-[1.05]" />
              <div className="absolute inset-0 rounded-full border border-blue-500/20 scale-[1.1]" />

              {/* ORBITAL TECH ICONS */}
              {!shouldReduceMotion && orbitIcons.map(({ Icon, delay, duration }, i) => (
                <div
                  key={i}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div
                    className="absolute animate-orbit"
                    style={{
                      "--orbit-radius": "52%",
                      "--orbit-duration": duration,
                      animationDelay: delay,
                    }}
                  >
                    <div className="p-1.5 md:p-2 rounded-full bg-[#0a0a0a]/80 border border-purple-500/40 backdrop-blur-sm shadow-lg shadow-purple-500/20">
                      <Icon className="h-3 w-3 md:h-4 md:w-4 text-purple-400" />
                    </div>
                  </div>
                </div>
              ))}

              {/* IMAGE */}
              <div className="absolute inset-[8%] rounded-full overflow-hidden ring-4 ring-purple-500/30 shadow-2xl shadow-purple-500/30">
                <Image
                  src="/test.png"
                  alt="Charan"
                  fill
                  sizes="(max-width: 640px) 260px, (max-width: 1024px) 420px, 480px"
                  className="object-cover object-[50%_15%] transition-transform duration-700 hover:scale-105"
                  priority
                />
              </div>

              {/* ANIMATED GLOW */}
              <motion.div
                animate={
                  shouldReduceMotion
                    ? { scale: 1, opacity: 0.4 }
                    : { scale: [1, 1.1, 1], opacity: [0.25, 0.45, 0.25] }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }
                className="absolute -inset-16 md:-inset-20 bg-gradient-to-br from-purple-500/20 via-fuchsia-500/15 to-blue-500/20 blur-3xl -z-10"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-28 lg:bottom-20 left-1/2 -translate-x-1/2"
      >
        <motion.button
          animate={shouldReduceMotion ? { y: 0 } : { y: [0, 10, 0] }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          aria-label="Scroll to next section"
        >
          <span className="text-xs uppercase tracking-widest text-gray-500">Scroll Down</span>
          <ChevronDown className="h-6 w-6 text-purple-400" />
        </motion.button>
      </motion.div>
    </section>
  );
}
