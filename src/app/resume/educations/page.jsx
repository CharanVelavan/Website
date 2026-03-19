"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GraduationCap, Calendar, Award } from "lucide-react";

const education = [
  {
    degree: "M.E. Communication Systems",
    duration: "2025 – Present",
    institute: "SSN College of Engineering",
    score: "CGPA: 8.3",
    logo: "/images/intern/ssn/logo.png",
    logoNeedsWhiteBg: true,
    url: "https://www.ssn.edu.in",
    current: true,
    accent: "from-purple-500/20 to-fuchsia-500/5",
  },
  {
    degree: "B.E. Electronics & Communication Engineering",
    duration: "2021 – 2025",
    institute: "St. Joseph's College of Engineering",
    score: "CGPA: 8.24",
    logo: null,
    url: "https://www.sjce.ac.in",
    current: false,
    accent: "from-blue-500/15 to-cyan-500/5",
  },
  {
    degree: "12th Grade",
    duration: "2021",
    institute: "Narayana E-Techno School",
    score: "Grade: 87%",
    logo: null,
    url: null,
    current: false,
    accent: "from-emerald-500/15 to-teal-500/5",
  },
];

function InitialAvatar({ name }) {
  return (
    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-white/10 flex-shrink-0 flex items-center justify-center">
      <GraduationCap size={24} className="text-purple-300" />
    </div>
  );
}

export default function EducationPage() {
  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* ── HEADER ── */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="mb-3 text-sm uppercase tracking-widest text-purple-400 font-medium">
            Academics
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Education
          </h1>
          <p className="mt-4 max-w-2xl text-gray-400 leading-relaxed">
            Academic background and formal training in communication systems and
            electronics engineering.
          </p>
        </motion.header>

        {/* ── TIMELINE ── */}
        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-7 top-6 bottom-6 w-px bg-gradient-to-b from-purple-500/60 via-purple-500/20 to-transparent hidden md:block" />

          <div className="space-y-6">
            {education.map((item, index) => (
              <motion.div
                key={item.degree}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative md:pl-20"
              >
                {/* timeline dot */}
                <div className={`absolute left-[13px] top-8 w-[18px] h-[18px] rounded-full border-2 hidden md:flex items-center justify-center z-10 ${item.current ? "border-purple-400 bg-purple-500/20" : "border-purple-500/60 bg-[#0a0a0a]"}`}>
                  <div className={`w-2 h-2 rounded-full ${item.current ? "bg-purple-400" : "bg-purple-500/50"}`} />
                </div>

                {/* card */}
                <div className={`group rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300`}>

                  {/* gradient header */}
                  <div className={`flex items-center gap-4 p-5 sm:p-6 bg-gradient-to-r ${item.accent} border-b border-white/10`}>
                    {/* logo or icon */}
                    {item.logo ? (
                      <div className={`w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center p-2 shadow-lg ring-1 ring-white/10 ${item.logoNeedsWhiteBg ? "bg-white" : "bg-white/10"}`}>
                        <img
                          src={item.logo}
                          alt={item.institute}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <InitialAvatar name={item.institute} />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h2 className="text-lg font-bold text-white group-hover:text-purple-200 transition-colors leading-snug">
                          {item.degree}
                        </h2>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {item.current && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-400 font-medium">
                              Current
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[11px] text-gray-400 bg-white/5 rounded-full px-2.5 py-1 border border-white/10 whitespace-nowrap">
                            <Calendar size={9} />
                            {item.duration}
                          </span>
                        </div>
                      </div>
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-400 hover:text-purple-300 transition-colors mt-1 block"
                        >
                          {item.institute}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-400 mt-1">{item.institute}</p>
                      )}
                    </div>
                  </div>

                  {/* score */}
                  <div className="px-5 sm:px-6 py-4 bg-white/[0.02] flex items-center gap-2">
                    <Award size={14} className="text-purple-400" />
                    <span className="text-sm font-semibold text-purple-300">{item.score}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
