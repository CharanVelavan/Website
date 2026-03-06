"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Home, Briefcase, Award, Building2, Mail, FileText } from "lucide-react";
import scrollManager from "@/lib/scroll-utils";
import { usePathname, useRouter } from "next/navigation";

// 6 primary tabs — covers all major sections + resume
const TABS = [
  { id: "hero", label: "Home", icon: Home, path: "/" },
  { id: "work", label: "Projects", icon: Briefcase, path: "/projects" },
  { id: "achievements", label: "Awards", icon: Award, path: "/achievements" },
  { id: "internships", label: "Experience", icon: Building2, path: "/#internships" },
  { id: "resume", label: "Resume", icon: FileText, path: "/resume" },
  { id: "contact", label: "Contact", icon: Mail, path: "/#contact" },
];

export default function MobileTabBar() {
  const [activeSection, setActiveSection] = useState("hero");
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const unsubscribe = scrollManager.subscribe((state) => {
      if (pathname === "/" && state.activeSection) {
        setActiveSection(state.activeSection);
      }
    });
    return unsubscribe;
  }, [pathname]);

  const getIsActive = (tab) => {
    if (tab.path === "/") return pathname === "/" && activeSection === "hero";
    if (tab.path.startsWith("/#")) return pathname === "/" && activeSection === tab.id;
    if (tab.path === "/resume") return pathname.startsWith("/resume");
    return pathname.startsWith(tab.path);
  };

  const handleTabPress = (tab) => {
    if (tab.path.startsWith("/#") || tab.path === "/") {
      if (pathname === "/") {
        scrollManager.scrollToSection(tab.id);
      } else {
        router.push(tab.path);
      }
    } else {
      router.push(tab.path);
    }
  };

  return (
    <AnimatePresence>
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { type: "spring", damping: 28, stiffness: 260 }
        }
        className="fixed bottom-0 left-0 right-0 z-[70] lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-label="Mobile navigation"
      >
        {/* Gradient fade above the bar */}
        <div className="h-8 bg-gradient-to-t from-[#f8f7f4]/95 dark:from-[#0a0a0a]/95 to-transparent pointer-events-none" />

        <div className="bg-[#f8f7f4]/95 dark:bg-[#0a0a0a]/95 backdrop-blur-2xl border-t border-black/10 dark:border-white/10 px-1">
          <div className="flex items-stretch justify-around" style={{ height: "3.75rem" }}>
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = getIsActive(tab);

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => handleTabPress(tab)}
                  className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-xl min-w-0"
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.85 }}
                  aria-label={`Navigate to ${tab.label}`}
                >
                  {/* Active pill indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="tab-active-pill"
                      className="absolute top-1 h-0.5 w-5 rounded-full bg-purple-400"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 400, damping: 30 }
                      }
                    />
                  )}

                  {/* Icon with background pill when active */}
                  <motion.div
                    animate={{
                      color: isActive ? "#c084fc" : "#9ca3af",
                      scale: isActive ? 1.1 : 1,
                    }}
                    transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
                    className={`flex items-center justify-center rounded-full transition-all ${isActive
                        ? "bg-purple-500/15 w-9 h-6"
                        : "w-9 h-6"
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.div>

                  {/* Label */}
                  <motion.span
                    animate={{
                      color: isActive ? "#c084fc" : "#6b7280",
                      fontWeight: isActive ? "600" : "400",
                    }}
                    className="text-[9px] leading-none truncate max-w-full px-0.5"
                  >
                    {tab.label}
                  </motion.span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
}
