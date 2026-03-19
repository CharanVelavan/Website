// src/app/resume/skills/page.jsx
"use client";

import { motion } from "framer-motion";

const skillsData = [
  {
    category: "Programming Languages",
    icon: "< />",
    color: "from-blue-500/20 to-cyan-500/5",
    border: "group-hover:border-blue-500/40",
    dot: "bg-blue-400",
    skills: ["Python", "C", "C++", "Shell Scripting", "MATLAB"],
  },
  {
    category: "5G & Wireless",
    icon: "📡",
    color: "from-purple-500/20 to-fuchsia-500/5",
    border: "group-hover:border-purple-500/40",
    dot: "bg-purple-400",
    skills: ["5G / O-RAN", "CU & DU Architecture", "RAN", "srsRAN", "Open5GS", "USRP B210", "POWDER Wireless", "SDR Programming"],
  },
  {
    category: "Embedded Systems & IoT",
    icon: "🔌",
    color: "from-orange-500/20 to-amber-500/5",
    border: "group-hover:border-orange-500/40",
    dot: "bg-orange-400",
    skills: ["Raspberry Pi 5", "STM32 Boards", "Hailo AI Kit", "OpenST Linux", "Custom Drone Development", "PCB Design (EasyEDA, KiCad)", "Solidworks"],
  },
  {
    category: "AI & Machine Learning",
    icon: "🧠",
    color: "from-pink-500/20 to-rose-500/5",
    border: "group-hover:border-pink-500/40",
    dot: "bg-pink-400",
    skills: ["YOLO", "TensorFlow", "TensorFlow Lite", "CNN", "DNN", "Meta Llama 2.0", "Computer Vision", "Sentiment Analysis", "Face Recognition"],
  },
  {
    category: "Cloud & DevOps",
    icon: "☁",
    color: "from-sky-500/20 to-blue-500/5",
    border: "group-hover:border-sky-500/40",
    dot: "bg-sky-400",
    skills: ["AWS (DynamoDB, Lambda, S3, Polly, Rekognition, API Gateway)", "Docker", "GitHub Actions", "Linux", "YAML", "Firebase", "Google Colab"],
  },
  {
    category: "RF & Circuit Design",
    icon: "〰",
    color: "from-emerald-500/20 to-teal-500/5",
    border: "group-hover:border-emerald-500/40",
    dot: "bg-emerald-400",
    skills: ["CST Studio Suite", "RF Design", "Bandpass Filter Design", "Terahertz Applications", "Fractal-based Design"],
  },
  {
    category: "Networking & Tools",
    icon: "🌐",
    color: "from-indigo-500/20 to-violet-500/5",
    border: "group-hover:border-indigo-500/40",
    dot: "bg-indigo-400",
    skills: ["Cisco Intersight", "Cisco DevNet", "Cisco Umbrella", "Log Analysis", "Performance Optimization", "System Debugging"],
  },
  {
    category: "Frameworks & Dev Tools",
    icon: "⚙",
    color: "from-yellow-500/20 to-amber-500/5",
    border: "group-hover:border-yellow-500/40",
    dot: "bg-yellow-400",
    skills: ["Flask", "Streamlit", "Flutter Flow", "MIT App Inventor", "VS Code", "PyCharm", "Terminal"],
  },
];

export default function SkillsPage() {
  return (
    <div>
      {/* ── HEADER ── */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <p className="mb-3 text-sm uppercase tracking-widest text-purple-400 font-medium">
          Technical Expertise
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Technical Skills
        </h1>
        <p className="mt-4 max-w-2xl text-gray-400 leading-relaxed">
          A comprehensive overview of skills across programming, embedded systems,
          AI, cloud, and wireless technologies — developed through projects,
          internships, and research.
        </p>
      </motion.header>

      {/* ── GRID ── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {skillsData.map((cat, i) => (
          <motion.div
            key={cat.category}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className={`group rounded-2xl border border-white/10 ${cat.border} bg-gradient-to-br ${cat.color} bg-[#0b0b0b] overflow-hidden hover:shadow-xl transition-all duration-300`}
          >
            {/* category header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
              <span className="text-lg leading-none">{cat.icon}</span>
              <h3 className="text-sm font-semibold text-white">{cat.category}</h3>
              <span className="ml-auto text-[11px] text-gray-500 bg-white/5 rounded-full px-2 py-0.5 border border-white/10">
                {cat.skills.length}
              </span>
            </div>

            {/* skill chips */}
            <div className="px-5 py-4 flex flex-wrap gap-2">
              {cat.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full bg-white/5 border border-white/10 text-gray-300 hover:border-white/20 hover:text-white transition-all"
                >
                  <span className={`w-1 h-1 rounded-full ${cat.dot} flex-shrink-0`} />
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── CONTINUOUS LEARNING ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-8 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/5 p-6"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">🚀</span>
          <div>
            <h3 className="text-base font-semibold text-white mb-2">Continuous Learning</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Constantly expanding my skill set through hands-on projects, research,
              and staying up-to-date with the latest in 5G, edge AI, and embedded systems.
              My approach emphasises building real-world solutions over theoretical knowledge alone.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
