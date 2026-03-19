// src/app/resume/layout.jsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const sections = [
  { id: "internships",    title: "Internships",    description: "Industry experience",        href: "/resume/internships" },
  { id: "volunteering",   title: "Volunteering",   description: "Community & leadership",     href: "/resume/volunteering" },
  { id: "skills",         title: "Skills",         description: "Technical expertise",        href: "/resume/skills" },
  { id: "certifications", title: "Certifications", description: "Professional certifications", href: "/resume/certifications" },
  { id: "publications",   title: "Publications",   description: "Research papers",            href: "/resume/publications" },
  { id: "educations",     title: "Education",      description: "Academic background",        href: "/resume/educations" },
];

export default function ResumeLayout({ children }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="mx-auto max-w-7xl px-6 pt-24 pb-tab-safe lg:py-32">

      {/* ── MOBILE horizontal sub-nav (hidden on desktop) ── */}
      <nav
        className="lg:hidden sticky top-16 z-[50] -mx-6 px-4 py-2.5 mb-8 bg-[#f8f7f4]/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-b border-black/10 dark:border-white/10"
        aria-label="Resume sections"
      >
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {sections.map((section) => {
              const isActive = pathname === section.href;
              return (
                <Link
                  key={section.id}
                  href={section.href}
                  className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-purple-500/20 border-purple-500/50 text-purple-600 dark:text-purple-300 font-semibold"
                      : "border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-purple-400/40 hover:text-purple-600 dark:hover:text-white"
                  }`}
                >
                  {section.title}
                </Link>
              );
            })}
          </div>
          {/* Right-edge fade */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#f8f7f4]/95 dark:from-[#0a0a0a]/95 to-transparent" />
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">

        {/* ── DESKTOP sidebar (hidden on mobile) ── */}
        <aside className="hidden lg:block lg:sticky lg:top-24 h-fit">
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-black/5 dark:from-white/5 to-black/[0.02] dark:to-white/[0.02] p-6 backdrop-blur-xl shadow-2xl">
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold tracking-wide text-gray-900 dark:text-white/90">
                Resume
              </h3>
              <div className="mt-1 h-[2px] w-12 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500" />
            </div>

            {/* Navigation Links */}
            <nav className="space-y-2" aria-label="Resume sections">
              {sections.map((section) => {
                const isActive = pathname === section.href;
                return (
                  <Link key={section.id} href={section.href} className="block">
                    <motion.div
                      whileHover={shouldReduceMotion ? undefined : { x: 4 }}
                      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
                      className={`rounded-lg p-4 transition-all duration-300 ${
                        isActive
                          ? "bg-purple-500/10 shadow-lg shadow-purple-500/20 border border-purple-500/30"
                          : "hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <h4
                        className={`text-sm font-semibold transition-colors duration-300 ${
                          isActive
                            ? "text-purple-600 dark:text-purple-300"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        {section.title}
                      </h4>
                      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                        {section.description}
                      </p>

                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={shouldReduceMotion ? { duration: 0 } : undefined}
                          className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-purple-500 dark:text-purple-400"
                        >
                          <motion.span
                            animate={
                              shouldReduceMotion ? { opacity: 1 } : { opacity: [1, 0.4, 1] }
                            }
                            transition={{
                              duration: shouldReduceMotion ? 0 : 1.5,
                              repeat: shouldReduceMotion ? 0 : Infinity,
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

            {/* Footer dots */}
            <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10">
              <div className="flex items-center justify-center gap-1">
                <div className="h-1 w-1 rounded-full bg-purple-500/40" />
                <div className="h-1 w-1 rounded-full bg-purple-500/60" />
                <div className="h-1 w-1 rounded-full bg-purple-500/80" />
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
