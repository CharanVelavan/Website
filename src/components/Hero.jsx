"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, ArrowRight, Download, ChevronDown } from "lucide-react";
import Counter from "@/components/Counter";

export default function Hero() {
  const { scrollY } = useScroll();
  const gradientOpacity = useTransform(scrollY, [0, 7500], [1, 0]);

  return (
    <section id="hero" className="relative min-h-screen pt-20 pb-12 md:pt-28 md:pb-16 overflow-hidden">
      {/* FIXED BACKGROUND GRADIENTS */}
      <motion.div
        style={{ opacity: gradientOpacity }}
        className="fixed inset-0 -z-10 pointer-events-none"
      >
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-purple-500/30 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-blue-500/30 blur-3xl"
        />
      </motion.div>

      {/* CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* LEFT COLUMN */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col pt-4 md:pt-8"
          >
            <p className="text-base md:text-lg uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6">
              Embedded Developer
            </p>

            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold leading-[0.9]">
              Hello I'm <br />
              <span className="text-fuchsia-500">Charan</span>
            </h1>

            <p className="mt-8 max-w-xl text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed">
              I build modern web applications and work on AI-driven communication
              systems, UAV networks, and next-generation technologies.
            </p>

            {/* CTA BUTTONS */}
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="/projects"
                className="group px-6 py-3 text-base bg-purple-500 text-black font-medium rounded-lg hover:bg-purple-400 transition-all hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 inline-flex items-center gap-2"
              >
                View Projects
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="/resume.pdf"
                download
                className="group px-6 py-3 text-base border border-purple-500/30 bg-purple-500/10 rounded-lg hover:border-purple-500/50 hover:bg-purple-500/20 transition-all hover:scale-105 inline-flex items-center gap-2"
              >
                <Download className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
                Resume
              </a>

              <a
                href="#contact"
                className="px-6 py-3 text-base border border-black/20 dark:border-white/20 rounded-lg hover:border-black/50 dark:hover:border-white/50 hover:bg-black/5 dark:hover:bg-white/5 transition-all hover:scale-105"
              >
                Contact Me
              </a>
            </div>

            {/* SOCIAL LINKS */}
            <div className="mt-8 flex gap-4">
              <a
                href="https://github.com/charanvelavan"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full border border-black/20 dark:border-white/20 hover:border-purple-400 hover:bg-purple-400/10 transition-all hover:scale-110"
                aria-label="GitHub"
              >
                <Github size={22} />
              </a>

              <a
                href="https://www.linkedin.com/in/charan-velavan/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full border border-black/20 dark:border-white/20 hover:border-purple-400 hover:bg-purple-400/10 transition-all hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin size={22} />
              </a>
            </div>

            {/* STATS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8"
            >
              {[
                { value: 5, label: "Major Projects" },
                { value: 4, label: "Achievements" },
                { value: 15, label: "Technologies" },
                { value: 1, label: "Publications" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
                    <Counter value={item.value} />
                  </div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-1 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN – AVATAR */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center md:justify-end"
          >
            {/* RESPONSIVE CIRCLE */}
            <div className="relative aspect-square w-[260px] sm:w-[320px] md:w-[420px] lg:w-[480px]">
              {/* REVOLVING DASHED RING (CLOSER) */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[3%] rounded-full border-2 border-dashed border-purple-400/70"
              />

              {/* PULSING RING */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full border border-purple-500/40"
              />

              {/* ACCENT RINGS (TIGHT) */}
              <div className="absolute inset-0 rounded-full border border-purple-500/20 scale-[1.05]" />
              <div className="absolute inset-0 rounded-full border border-blue-500/20 scale-[1.1]" />

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
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-20 bg-gradient-to-br from-purple-500/20 via-fuchsia-500/20 to-blue-500/20 blur-3xl -z-10"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2"
      >
        <motion.button
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
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