"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, ArrowRight, Download, Terminal, ChevronDown } from "lucide-react";

/**
 * HERO 1 — Cinematic Terminal
 *
 * Concept: A split-screen hero where the left side features a live terminal
 * animation that "boots up" the portfolio, typing out commands and responses.
 * The right side reveals a cinematic photo with film-grain overlay and
 * dramatic lighting. Once the terminal sequence completes, the full content
 * fades in with a smooth transition.
 */

const terminalLines = [
  { type: "command", text: "$ whoami", delay: 0 },
  { type: "response", text: "Charan Velavan — Embedded Developer", delay: 800 },
  { type: "command", text: "$ cat skills.txt", delay: 1600 },
  { type: "response", text: "React · Next.js · IoT · UAV Systems · AI/ML", delay: 2400 },
  { type: "command", text: "$ ./launch-portfolio.sh", delay: 3200 },
  { type: "response", text: "[OK] Portfolio loaded successfully.", delay: 4000 },
];

function TerminalLine({ line, isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className={`font-mono text-sm md:text-base ${
            line.type === "command"
              ? "text-emerald-400"
              : "text-gray-400"
          }`}
        >
          {line.text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Hero1_CinematicTerminal() {
  const shouldReduceMotion = useReducedMotion();
  const [visibleLines, setVisibleLines] = useState(shouldReduceMotion ? terminalLines.length : 0);
  const [bootComplete, setBootComplete] = useState(shouldReduceMotion);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const timers = terminalLines.map((line, i) =>
      setTimeout(() => setVisibleLines(i + 1), line.delay)
    );

    const completeTimer = setTimeout(() => setBootComplete(true), 4800);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(completeTimer);
    };
  }, [shouldReduceMotion]);

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Scanline overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)]" />

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[120px] -z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] -z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-24 md:pt-32 min-h-screen flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT — Terminal */}
          <div className="order-2 lg:order-1">
            {/* Terminal window */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md shadow-2xl shadow-purple-500/10 overflow-hidden"
            >
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="ml-2 text-xs text-gray-500 font-mono flex items-center gap-1.5">
                  <Terminal size={12} />
                  portfolio — bash
                </span>
              </div>

              {/* Terminal body */}
              <div className="p-5 md:p-6 space-y-2 min-h-[200px]">
                {terminalLines.map((line, i) => (
                  <TerminalLine key={i} line={line} isVisible={i < visibleLines} />
                ))}

                {/* Blinking cursor */}
                {!bootComplete && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-2.5 h-5 bg-emerald-400 mt-1"
                  />
                )}
              </div>
            </motion.div>

            {/* Content that appears after boot */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={bootComplete ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-10"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-purple-400 font-semibold mb-3">
                Embedded Developer
              </p>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9]">
                <span className="text-white">Hello, I&apos;m</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400">
                  Charan
                </span>
              </h1>

              <p className="mt-6 text-lg text-gray-400 max-w-lg leading-relaxed">
                Building modern web experiences, AI-driven communication systems,
                and next-generation UAV networks.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="/projects"
                  className="group px-6 py-3 text-sm bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 active:scale-[0.98] transition-all inline-flex items-center gap-2"
                >
                  View Projects
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="/resume.pdf"
                  download
                  className="group px-6 py-3 text-sm border border-white/15 text-gray-300 rounded-xl hover:border-purple-500/50 hover:bg-purple-500/10 transition-all inline-flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Resume
                </a>
              </div>

              {/* Socials */}
              <div className="mt-6 flex gap-3">
                <a href="https://github.com/charanvelavan" target="_blank" rel="noopener noreferrer"
                  className="p-3 rounded-full border border-white/10 hover:border-purple-400 hover:bg-purple-400/10 transition-all"
                  aria-label="GitHub">
                  <Github size={18} />
                </a>
                <a href="https://www.linkedin.com/in/charan-velavan/" target="_blank" rel="noopener noreferrer"
                  className="p-3 rounded-full border border-white/10 hover:border-purple-400 hover:bg-purple-400/10 transition-all"
                  aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — Cinematic Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={bootComplete ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative w-[280px] sm:w-[340px] md:w-[400px] lg:w-[460px] aspect-[3/4]">
              {/* Film grain overlay */}
              <div className="absolute inset-0 z-20 rounded-3xl opacity-20 mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]" />

              {/* Dramatic color border */}
              <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-blue-500 opacity-60" />

              {/* Image container */}
              <div className="absolute inset-[2px] rounded-3xl overflow-hidden bg-gray-900">
                <Image
                  src="/test.png"
                  alt="Charan"
                  fill
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 400px, 460px"
                  className="object-cover object-[50%_15%]"
                  priority
                />
                {/* Bottom gradient fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-70" />
              </div>

              {/* Floating glow behind */}
              <div className="absolute -inset-20 bg-gradient-to-br from-purple-600/20 to-blue-600/15 blur-3xl rounded-full -z-10" />
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={bootComplete ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.button
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
            aria-label="Scroll down"
          >
            <span className="text-xs uppercase tracking-widest text-gray-600">Scroll</span>
            <ChevronDown className="h-5 w-5 text-purple-400" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
