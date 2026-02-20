"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import scrollManager from "@/lib/scroll-utils";
import { NAV_SECTIONS } from "@/lib/nav-config";

// Sidebar only shows sections after hero
const sections = NAV_SECTIONS.filter((s) => s.showInSidebar);

export default function SectionNav() {
    const [activeSection, setActiveSection] = useState("about");
    const [isVisible, setIsVisible] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        // Subscribe to scroll manager
        const unsubscribe = scrollManager.subscribe((state) => {
            setIsVisible(state.scrollY > 300);
            if (state.activeSection) {
                setActiveSection(state.activeSection);
            }
        });

        return unsubscribe;
    }, []);

    const scrollToSection = (id) => {
        scrollManager.scrollToSection(id);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.nav
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={shouldReduceMotion ? { duration: 0 } : undefined}
                    className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
                    style={{ willChange: "transform, opacity" }}
                >
                    <div className="flex flex-col gap-4">
                        {sections.map((section, index) => {
                            const isActive = activeSection === section.id;
                            return (
                                <motion.button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className="group flex items-center gap-3"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={shouldReduceMotion ? { duration: 0 } : { delay: index * 0.05 }}
                                    aria-label={`Navigate to ${section.label}`}
                                >
                                    {/* Dot indicator */}
                                    <div className="relative">
                                        <div
                                            className={`h-2 w-2 rounded-full transition-all duration-300 ${isActive
                                                    ? "bg-purple-400 scale-125"
                                                    : "bg-gray-400 dark:bg-gray-600 group-hover:bg-gray-600 dark:group-hover:bg-gray-400"
                                                }`}
                                        />
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeIndicator"
                                                className="absolute inset-0 rounded-full bg-purple-400/30 scale-150"
                                                transition={
                                                    shouldReduceMotion
                                                        ? { duration: 0 }
                                                        : { type: "spring", stiffness: 300, damping: 30 }
                                                }
                                            />
                                        )}
                                    </div>

                                    {/* Label - shows on hover */}
                                    <span
                                        className={`text-xs uppercase tracking-wider transition-all duration-300 ${isActive
                                                ? "text-gray-900 dark:text-white opacity-100"
                                                : "text-gray-500 dark:text-gray-500 opacity-0 group-hover:opacity-100"
                                            }`}
                                    >
                                        {section.label}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.nav>
            )}
        </AnimatePresence>
    );
}
