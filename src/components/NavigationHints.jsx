"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowDown } from "lucide-react";
import scrollManager from "@/lib/scroll-utils";

export default function NavigationHints() {
    const [showScrollHint, setShowScrollHint] = useState(true);
    const [showSectionHints, setShowSectionHints] = useState(true);

    useEffect(() => {
        // Subscribe to scroll manager for scroll hint
        const unsubscribe = scrollManager.subscribe((state) => {
            if (state.scrollY > 100) {
                setShowScrollHint(false);
            }
        });

        // Hide section hints after some interactions
        const handleInteraction = () => {
            const interactionCount = parseInt(localStorage.getItem("portfolio-interactions") || "0");
            if (interactionCount > 3) {
                setShowSectionHints(false);
            } else {
                localStorage.setItem("portfolio-interactions", String(interactionCount + 1));
            }
        };

        window.addEventListener("click", handleInteraction);

        // Check if user has interacted before
        const interactions = parseInt(localStorage.getItem("portfolio-interactions") || "0");
        if (interactions > 3) {
            setShowSectionHints(false);
        }

        // Auto-hide scroll hint after 5 seconds
        const timer = setTimeout(() => setShowScrollHint(false), 5000);

        return () => {
            unsubscribe();
            window.removeEventListener("click", handleInteraction);
            clearTimeout(timer);
        };
    }, []);

    // Check for reduced motion preference
    const prefersReducedMotion = typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

    if (prefersReducedMotion) return null;

    return (
        <>
            {/* Scroll Down Hint - At bottom of viewport initially */}
            <AnimatePresence>
                {showScrollHint && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed bottom-32 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
                    >
                        <motion.div
                            animate={{
                                y: [0, 12, 0],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="flex flex-col items-center gap-2"
                        >
                            <span className="text-xs uppercase tracking-widest text-purple-400/80 font-medium">
                                Explore More
                            </span>
                            <ArrowDown className="h-6 w-6 text-purple-400" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Section Transition Hints */}
            <AnimatePresence>
                {showSectionHints && (
                    <>
                        {/* Pulsing dots at section boundaries */}
                        {["work", "achievements", "publications"].map((sectionId, index) => (
                            <motion.div
                                key={sectionId}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ delay: index * 0.2 }}
                                className="absolute left-0 pointer-events-none z-30"
                                style={{
                                    top: `${(index + 1) * 25}vh`,
                                }}
                            >
                                <motion.div
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.3, 0.6, 0.3],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: index * 0.3,
                                    }}
                                    className="h-3 w-3 rounded-full bg-purple-400/50 blur-sm"
                                />
                            </motion.div>
                        ))}
                    </>
                )}
            </AnimatePresence>

            {/* Mobile Swipe Hint */}
            <AnimatePresence>
                {showSectionHints && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="fixed bottom-20 left-6 z-40 md:hidden pointer-events-none"
                    >
                        <motion.div
                            animate={{
                                x: [0, 10, 0],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="flex items-center gap-2 px-3 py-2 rounded-full bg-purple-100 dark:bg-purple-500/20 backdrop-blur-sm border border-purple-300 dark:border-purple-400/30"
                        >
                            <span className="text-xs text-purple-600 dark:text-purple-300">Swipe to explore</span>
                            <ChevronDown className="h-4 w-4 text-purple-400 rotate-[-90deg]" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
