// src/components/Education.jsx
"use client";

import { motion } from "framer-motion";

const education = [
  {
    degree: "M.E. Communication Systems",
    duration: "2025 – Present",
    institute: "SSN College of Engineering",
    score: "CGPA: 8.3",
  },
  {
    degree: "B.E. Electronics & Communication Engineering",
    duration: "2021 – 2025",
    institute: "St. Joseph's College of Engineering",
    score: "CGPA: 8.24",
  },
  {
    degree: "12th Grade",
    duration: "2021",
    institute: "Narayana E-Techno School",
    score: "Grade 87%",
  },
];

export default function Education() {
  return (
    <section id="education" className="py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* SECTION HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <p className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">
            Academics
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Education
          </h2>
          <p className="mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
            Academic background and formal training in communication systems and
            electronics engineering.
          </p>
        </motion.header>

        {/* LIST */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {education.map((item, index) => (
            <motion.div
              key={item.degree}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-8 transition-all duration-300 hover:border-black/30 dark:hover:border-white/30 hover:shadow-2xl hover:shadow-purple-500/20"
            >
              {/* Hover glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 relative z-10 group-hover:text-purple-500 dark:group-hover:text-purple-300 transition-colors">
                {item.degree}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 relative z-10">
                {item.institute}
              </p>

              <p className="text-xs uppercase tracking-widest text-gray-500 mb-4 relative z-10">
                {item.duration}
              </p>

              <span className="inline-block text-sm px-4 py-2 rounded-full border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 group-hover:border-purple-400/40 group-hover:bg-purple-500/5 transition-all relative z-10">
                {item.score}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
