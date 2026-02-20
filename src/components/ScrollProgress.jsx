"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import scrollManager from "@/lib/scroll-utils";
import { NAV_SECTIONS } from "@/lib/nav-config";

// Build color map from centralized config
const sectionColors = Object.fromEntries(NAV_SECTIONS.map((s) => [s.id, s.color]));

export default function ScrollProgress() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [currentSection, setCurrentSection] = useState("hero");
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        // Subscribe to scroll manager
        const unsubscribe = scrollManager.subscribe((state) => {
            setScrollProgress(state.scrollProgress);
            if (state.activeSection) {
                setCurrentSection(state.activeSection);
            }
        });

        return unsubscribe;
    }, []);

    const colorClass = sectionColors[currentSection] || sectionColors.hero;

    return (
        <>
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-gray-300/50 dark:bg-gray-800/50 backdrop-blur-sm z-[60]">
                <motion.div
                    className={`h-full bg-gradient-to-r ${colorClass} shadow-lg shadow-purple-500/50`}
                    style={{
                        width: `${scrollProgress}%`,
                        willChange: "width"
                    }}
                    transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.1 }}
                />
            </div>

            {/* Percentage Indicator - Shows on hover */}
            <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="fixed top-2 left-1/2 -translate-x-1/2 z-[61] px-3 py-1 rounded-full bg-gray-100/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-300 dark:border-purple-500/30 text-xs font-medium text-purple-500 dark:text-purple-400 pointer-events-none"
            >
                {Math.round(scrollProgress)}%
            </motion.div>
        </>
    );
}
