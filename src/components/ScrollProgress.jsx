"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import scrollManager from "@/lib/scroll-utils";

const sectionColors = {
    hero: "from-purple-500 to-blue-500",
    about: "from-blue-500 to-cyan-500",
    work: "from-purple-500 to-pink-500",
    achievements: "from-pink-500 to-orange-500",
    internships: "from-orange-500 to-yellow-500",
    certifications: "from-yellow-500 to-green-500",
    publications: "from-green-500 to-teal-500",
    education: "from-teal-500 to-blue-500",
    contact: "from-blue-500 to-purple-500",
};

export default function ScrollProgress() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [currentSection, setCurrentSection] = useState("hero");

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
            <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800/50 backdrop-blur-sm z-[60]">
                <motion.div
                    className={`h-full bg-gradient-to-r ${colorClass} shadow-lg shadow-purple-500/50`}
                    style={{
                        width: `${scrollProgress}%`,
                        willChange: "width"
                    }}
                    transition={{ duration: 0.1 }}
                />
            </div>

            {/* Percentage Indicator - Shows on hover */}
            <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="fixed top-2 left-1/2 -translate-x-1/2 z-[61] px-3 py-1 rounded-full bg-gray-900/90 backdrop-blur-md border border-purple-500/30 text-xs font-medium text-purple-400 pointer-events-none"
            >
                {Math.round(scrollProgress)}%
            </motion.div>
        </>
    );
}
