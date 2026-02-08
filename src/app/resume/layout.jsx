// src/app/resume/layout.jsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ResumeLayout({ children }) {
  const pathname = usePathname();

  const sections = [
    {
      id: "internships",
      title: "Internships",
      description: "Industry experience",
      href: "/resume/internships",
    },
    {
      id: "skills",
      title: "Skills",
      description: "Technical expertise",
      href: "/resume/skills",
    },
    {
      id: "certifications",
      title: "Certifications",
      description: "Professional certifications",
      href: "/resume/certifications",
    },
    {
      id: "publications",
      title: "Publications",
      description: "Research papers",
      href: "/resume/publications",
    },
    {
      id: "educations",
      title: "Education",
      description: "Academic background",
      href: "/resume/educations",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-32">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
        {/* SIDEBAR NAVIGATION - PERSISTENT */}
        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-xl shadow-2xl">
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold tracking-wide text-white/90">
                Resume
              </h3>
              <div className="mt-1 h-[2px] w-12 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500" />
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2">
              {sections.map((section) => {
                const isActive = pathname === section.href;

                return (
                  <Link
                    key={section.id}
                    href={section.href}
                    className="block"
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      className={`rounded-lg p-4 transition-all duration-300 ${isActive
                        ? "bg-purple-500/10 shadow-lg shadow-purple-500/20 border border-purple-500/30"
                        : "hover:bg-white/5 border border-transparent"
                        }`}
                    >
                      <h4
                        className={`text-sm font-semibold transition-colors duration-300 ${isActive
                          ? "text-purple-300"
                          : "text-gray-400 hover:text-white"
                          }`}
                      >
                        {section.title}
                      </h4>
                      <p className="mt-1 text-xs text-gray-500">
                        {section.description}
                      </p>

                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-purple-400"
                        >
                          <motion.span
                            animate={{ opacity: [1, 0.4, 1] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                            }}
                          >
                            ●
                          </motion.span>
                          Viewing now
                        </motion.div>
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center justify-center gap-1">
                <div className="h-1 w-1 rounded-full bg-purple-500/40" />
                <div className="h-1 w-1 rounded-full bg-purple-500/60" />
                <div className="h-1 w-1 rounded-full bg-purple-500/80" />
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}