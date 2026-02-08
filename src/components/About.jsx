"use client";

import { motion } from "framer-motion";
import { Cpu, Radio, Brain, Cloud, Zap, Code, Antenna } from "lucide-react";

const skills = [
  {
    icon: Radio,
    title: "5G & Wireless",
    description: "O-RAN, CU/DU architecture, RF systems",
  },
  {
    icon: Brain,
    title: "AI/ML",
    description: "Computer vision, deep learning, edge AI",
  },
  {
    icon: Cpu,
    title: "Embedded Systems",
    description: "UAV systems, robotics, real-time processing",
  },
  {
    icon: Cloud,
    title: "Cloud Computing",
    description: "AWS",
  },
  {
    icon: Antenna,
    title: "RF Design",
    description: "Antenna design, THz filters, RF circuits",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Research, prototyping, problem-solving",
  },
];

export default function About() {
  return (
    <section id="about" className="py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* SECTION HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="text-sm uppercase tracking-widest text-gray-400 mb-4">
            About Me
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Building Intelligent Systems
          </h2>
        </motion.header>

        {/* MAIN CONTENT GRID */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* LEFT: ABOUT TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6 text-gray-400 leading-relaxed"
          >
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 backdrop-blur-sm">
              <p className="text-lg leading-relaxed">
                I am an{" "}
                <span className="text-white font-semibold">
                  Electronics and Communication Engineering graduate
                </span>{" "}
                with a strong focus on building real-world systems at the
                intersection of{" "}
                <span className="text-purple-400">
                  5G networks, AI/ML, and embedded platforms
                </span>
                .
              </p>

              <p className="mt-4">
                My work spans the full stack — from hardware and RF concepts to
                edge intelligence, cloud infrastructure, and production-grade
                software systems.
              </p>

              <p className="mt-4">
                I have hands-on experience developing and deploying{" "}
                <span className="text-purple-400">
                  AI-enabled UAV and robotic systems
                </span>
                , including a 5G-based search-and-rescue drone integrated with
                commercial radio infrastructure, and a swarm-enabled community
                robot powered by cloud-native services and large language
                models.
              </p>

              <p className="mt-4">
                I am particularly motivated by projects that involve{" "}
                <span className="text-white font-semibold">
                  real hardware, real networks, and real constraints
                </span>
                , and I thrive in environments that value problem-solving,
                experimentation, and continuous learning.
              </p>
            </div>
          </motion.div>

          {/* RIGHT: SKILLS GRID */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Core Expertise
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -4 }}
                  className="group rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:border-purple-500/50 hover:bg-white/[0.05] transition-all duration-300"
                >
                  <skill.icon className="h-8 w-8 text-purple-400 mb-3 group-hover:text-purple-300 transition-colors" />
                  <h4 className="text-white font-semibold mb-1 text-sm">
                    {skill.title}
                  </h4>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {skill.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* HIGHLIGHT BOX */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 rounded-xl border border-purple-500/30 bg-purple-500/5 p-6"
            >
              <div className="flex items-start gap-3">
                <Zap className="h-6 w-6 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-semibold mb-2">
                    Currently Exploring
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Next-generation wireless communication (5G, O-RAN),
                    computer vision and deep learning, embedded AI, and
                    scalable cloud architectures.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}