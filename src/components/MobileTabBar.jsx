"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Briefcase, Award, Building2, Mail } from "lucide-react";
import scrollManager from "@/lib/scroll-utils";
import { usePathname } from "next/navigation";

// 5 primary tabs — covers the most-visited sections on mobile
const TABS = [
  { id: "hero", label: "Home", icon: Home },
  { id: "work", label: "Projects", icon: Briefcase },
  { id: "achievements", label: "Awards", icon: Award },
  { id: "internships", label: "Experience", icon: Building2 },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function MobileTabBar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  // All hooks must be called before any early returns
  useEffect(() => {
    // Only subscribe on the homepage
    if (pathname !== "/") return;

    const unsubscribe = scrollManager.subscribe((state) => {
      if (state.activeSection) {
        setActiveSection(state.activeSection);
      }

      // Hide on scroll-down (>8px delta), show on scroll-up
      const currentY = state.scrollY;
      if (currentY > lastScrollY.current + 8 && currentY > 100) {
        setIsVisible(false);
      } else if (currentY < lastScrollY.current - 4) {
        setIsVisible(true);
      }
      lastScrollY.current = currentY;
    });

    return unsubscribe;
  }, [pathname]);

  // Only render on the homepage
  if (pathname !== "/") return null;

  const handleTabPress = (tab) => {
    scrollManager.scrollToSection(tab.id);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 260 }}
          className="fixed bottom-0 left-0 right-0 z-[70] lg:hidden"
          aria-label="Mobile navigation"
        >
          {/* Gradient fade above the bar so content doesn't abruptly end */}
          <div className="h-6 bg-gradient-to-t from-[#f8f7f4] dark:from-[#0a0a0a] to-transparent pointer-events-none" />

          <div className="bg-[#f8f7f4]/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-black/10 dark:border-white/10 px-2">
            <div className="flex items-stretch justify-around h-16">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSection === tab.id;

                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => handleTabPress(tab)}
                    className="relative flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-xl"
                    whileTap={{ scale: 0.88 }}
                    aria-label={`Navigate to ${tab.label}`}
                  >
                    {/* Active pill indicator above the icon */}
                    {isActive && (
                      <motion.div
                        layoutId="tab-active-pill"
                        className="absolute top-1.5 h-0.5 w-6 rounded-full bg-purple-400"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}

                    {/* Icon */}
                    <motion.div
                      animate={{
                        color: isActive ? "#c084fc" : "#6b7280",
                        scale: isActive ? 1.12 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.div>

                    {/* Label */}
                    <motion.span
                      animate={{ color: isActive ? "#c084fc" : "#6b7280" }}
                      className="text-[10px] font-medium leading-none"
                    >
                      {tab.label}
                    </motion.span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
