"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import scrollManager from "@/lib/scroll-utils";
import { NAV_SECTIONS } from "@/lib/nav-config";

export default function SectionIndicator() {
    const [currentSection, setCurrentSection] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Subscribe to scroll manager
        const unsubscribe = scrollManager.subscribe((state) => {
            setIsVisible(state.scrollY > 300);
            if (state.activeSection) {
                const section = NAV_SECTIONS.find((s) => s.id === state.activeSection);
                setCurrentSection(section);
            }
        });

        return unsubscribe;
    }, []);

    return (
        <AnimatePresence>
            {isVisible && currentSection && currentSection.id !== "hero" && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-6 left-1/2 -translate-x-1/2 z-[55] hidden md:block"
                >
                    <motion.div
                        key={currentSection.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-gray-100/90 dark:bg-gray-900/80 backdrop-blur-md border border-gray-300 dark:border-purple-500/30 shadow-lg shadow-purple-500/20"
                    >
                        <span className="text-xl">{currentSection.emoji}</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {currentSection.label}
                        </span>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
