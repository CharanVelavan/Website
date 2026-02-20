"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronUp, Home, Briefcase, Award, Mail, Download, Menu as MenuIcon } from "lucide-react";
import scrollManager from "@/lib/scroll-utils";

const quickActions = [
    { id: "top", label: "Top", icon: ChevronUp, action: "scroll-top" },
    { id: "projects", label: "Projects", icon: Briefcase, action: "scroll", target: "work" },
    { id: "achievements", label: "Achievements", icon: Award, action: "scroll", target: "achievements" },
    { id: "contact", label: "Contact", icon: Mail, action: "scroll", target: "contact" },
    { id: "resume", label: "Resume", icon: Download, action: "download", href: "/resume.pdf" },
];

export default function FloatingActionButton() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isTourActive, setIsTourActive] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        const media = window.matchMedia("(min-width: 1024px)");
        const handleMedia = () => setIsDesktop(media.matches);
        handleMedia();
        media.addEventListener("change", handleMedia);

        // Subscribe to scroll manager
        const unsubscribe = scrollManager.subscribe((state) => {
            setIsVisible(state.scrollY > 400);
        });

        // Check if tour is active (once on mount) — SSR-safe
        try {
            const tourCompleted = typeof window !== "undefined"
                ? localStorage.getItem("portfolio-tour-completed")
                : null;
            setIsTourActive(!tourCompleted);
        } catch {
            setIsTourActive(false);
        }

        return () => {
            unsubscribe();
            media.removeEventListener("change", handleMedia);
        };
    }, []);

    const handleAction = (action) => {
        if (action.action === "scroll-top") {
            scrollManager.scrollToTop();
        } else if (action.action === "scroll" && action.target) {
            scrollManager.scrollToSection(action.target);
        } else if (action.action === "download" && action.href) {
            window.location.href = action.href;
        }
        setIsExpanded(false);
    };

    // Hide FAB during tour
    if (isTourActive || !isDesktop) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed bottom-6 right-6 z-50">
                    {/* Quick Action Menu */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                className="absolute bottom-20 right-0 flex flex-col gap-3 mb-2"
                            >
                                {quickActions.slice(0, -1).reverse().map((action, index) => {
                                    const Icon = action.icon;
                                    return (
                                        <motion.button
                                            key={action.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => handleAction(action)}
                                            className="group flex items-center gap-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-purple-500/30 rounded-full px-4 py-3 shadow-lg shadow-purple-500/20 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-purple-400 transition-all hover:scale-105"
                                            aria-label={action.label}
                                        >
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white whitespace-nowrap">
                                                {action.label}
                                            </span>
                                            <Icon className="h-4 w-4 text-purple-400" />
                                        </motion.button>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main FAB Button */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`relative p-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all hover:scale-110 ${isExpanded ? "rotate-45" : ""
                            }`}
                        aria-label="Quick actions"
                    >
                        <motion.div
                            animate={{ rotate: isExpanded ? 45 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <MenuIcon className="h-6 w-6 text-white" />
                        </motion.div>

                        {/* Pulse animation when not expanded */}
                        {!isExpanded && !shouldReduceMotion && (
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 0, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute inset-0 rounded-full bg-purple-400"
                            />
                        )}
                    </motion.button>

                    {/* Download Resume - Always visible as secondary action */}
                    {!isExpanded && (
                        <motion.a
                            href="/resume.pdf"
                            download
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="absolute -top-16 right-0 p-3 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-purple-500/30 shadow-lg shadow-purple-500/20 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-purple-400 transition-all hover:scale-110 group"
                            aria-label="Download Resume"
                        >
                            <Download className="h-5 w-5 text-purple-400 group-hover:text-purple-300" />
                        </motion.a>
                    )}
                </div>
            )}
        </AnimatePresence>
    );
}
