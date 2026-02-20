"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import scrollManager from "@/lib/scroll-utils";
import { getSectionById } from "@/lib/nav-config";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { href: "/", label: "Home", section: "hero" },
  { href: "/#about", label: "About", section: "about" },
  { href: "/projects", label: "Projects", section: null }, // Always go to projects page
  { href: "/achievements", label: "Achievements", section: null }, // Always go to achievements page
  { href: "/resume", label: "Experience", section: null },
  { href: "/#contact", label: "Contact", section: "contact" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = scrollManager.subscribe((state) => {
      setIsScrolled(state.isScrolled);
      if (pathname === "/" && state.activeSection) {
        setActiveSection(state.activeSection);
      }
    });

    return unsubscribe;
  }, [pathname]);

  const handleNavClick = (e, href, section) => {
    if (section && pathname === "/") {
      e.preventDefault();
      scrollManager.scrollToSection(section);
    }
  };

  const isActive = (item) => {
    if (pathname === "/" && item.section) {
      return activeSection === item.section;
    }
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-black/10 dark:border-white/10 transition-all ${
        isScrolled
          ? "bg-[#f8f7f4]/90 dark:bg-[#0a0a0a]/90"
          : "bg-[#f8f7f4]/40 dark:bg-[#0a0a0a]/40"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / Name */}
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold tracking-wide"
        >
          <Link href="/" className="group flex items-center gap-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 group-hover:from-purple-300 group-hover:to-blue-300 transition-all">
              Charan Velavan
            </span>
            <motion.span
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
              className="text-gray-400 text-lg"
            >
              :)
            </motion.span>
          </Link>
        </motion.h1>

        {/* Mobile section badge — shows current section name on mobile when scrolled */}
        {pathname === "/" && (
          <AnimatePresence mode="wait">
            {isScrolled && activeSection && activeSection !== "hero" && (
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-medium"
              >
                <span>{getSectionById(activeSection)?.emoji}</span>
                <span>{getSectionById(activeSection)?.shortLabel}</span>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Navigation Links - Hidden on mobile (we have MobileNav for that) */}
        <ul className="hidden lg:flex gap-1 text-sm">
          {navItems.map((item, index) => {
            const active = isActive(item);

            return (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.section)}
                  className="relative px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group"
                >
                  {/* Hover background */}
                  <span className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors" />

                  {/* Active background */}
                  {active && (
                    <motion.span
                      layoutId="navbar-active"
                      className="absolute inset-0 rounded-lg bg-purple-500/20 border border-purple-500/30"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Text */}
                  <span className="relative z-10 font-medium">
                    {item.label}
                  </span>

                  {/* Animated underline on hover */}
                  <motion.span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: "70%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.li>
            );
          })}
        </ul>

        {/* Theme Toggle - Desktop */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex items-center gap-3"
        >
          <ThemeToggle />
        </motion.div>

        {/* CTA Button - Desktop only */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block"
        >
          <a
            href="/resume.pdf"
            download
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white font-medium text-sm shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-105 inline-flex items-center gap-2"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Resume
          </a>
        </motion.div>
      </nav>
    </motion.header>
  );
}

