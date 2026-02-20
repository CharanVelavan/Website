"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, Linkedin } from "lucide-react";
import scrollManager from "@/lib/scroll-utils";
import { NAV_SECTIONS } from "@/lib/nav-config";
import ThemeToggle from "@/components/ThemeToggle";

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");

    useEffect(() => {
        // Subscribe to scroll manager
        const unsubscribe = scrollManager.subscribe((state) => {
            if (state.activeSection) {
                setActiveSection(state.activeSection);
            }
        });

        return unsubscribe;
    }, []);

    const scrollToSection = (id) => {
        scrollManager.scrollToSection(id);
        setIsOpen(false);
    };

    return (
        <>
            {/* Hamburger Button - Only visible on mobile/tablet */}
            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-6 right-6 z-[90] lg:hidden p-3 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-purple-500/30 shadow-lg shadow-purple-500/20 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-110"
                aria-label="Toggle menu"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X className="h-6 w-6 text-purple-400" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="menu"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Menu className="h-6 w-6 text-purple-400" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[80] lg:hidden"
                        />

                        {/* Slide-in Menu */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-l border-purple-500/30 shadow-2xl z-[85] lg:hidden overflow-y-auto"
                        >
                            <div className="p-6">
                                {/* Header */}
                                <div className="mb-8 pt-16">
                                    <div className="flex items-center justify-between mb-2">
                                        <motion.h2
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
                                        >
                                            Navigation
                                        </motion.h2>
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.15 }}
                                        >
                                            <ThemeToggle />
                                        </motion.div>
                                    </div>
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 }}
                                        className="text-sm text-gray-500 dark:text-gray-400 mt-1"
                                    >
                                        Explore my portfolio
                                    </motion.p>
                                </div>

                                {/* Navigation Items */}
                                <nav className="space-y-2 mb-8">
                                    {NAV_SECTIONS.map((item, index) => {
                                        const Icon = item.icon;
                                        const isActive = activeSection === item.id;

                                        return (
                                            <motion.button
                                                key={item.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.05 * index }}
                                                onClick={() => scrollToSection(item.id)}
                                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${isActive
                                                    ? "bg-purple-500/20 border border-purple-500/50 text-gray-900 dark:text-white"
                                                    : "hover:bg-black/5 dark:hover:bg-white/5 border border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                                    }`}
                                            >
                                                <Icon className={`h-5 w-5 ${isActive ? "text-purple-400" : ""}`} />
                                                <span className="font-medium">{item.label}</span>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeIndicator"
                                                        className="ml-auto h-2 w-2 rounded-full bg-purple-400"
                                                    />
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </nav>

                                {/* Divider */}
                                <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-6" />

                                {/* Social Links */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="space-y-3"
                                >
                                    <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-3">Connect</p>
                                    <div className="flex gap-3">
                                        <a
                                            href="https://github.com/charanvelavan"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-black/10 dark:border-white/20 hover:border-purple-400 hover:bg-purple-400/10 transition-all"
                                        >
                                            <Github className="h-5 w-5" />
                                            <span className="text-sm">GitHub</span>
                                        </a>
                                        <a
                                            href="https://www.linkedin.com/in/charan-velavan/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-black/10 dark:border-white/20 hover:border-purple-400 hover:bg-purple-400/10 transition-all"
                                        >
                                            <Linkedin className="h-5 w-5" />
                                            <span className="text-sm">LinkedIn</span>
                                        </a>
                                    </div>
                                </motion.div>

                                {/* Resume Download */}
                                <motion.a
                                    href="/resume.pdf"
                                    download
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 transition-all text-white font-medium shadow-lg shadow-purple-500/30"
                                >
                                    Download Resume
                                </motion.a>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
