"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ArrowRight, Sparkles, Rocket, Award, BookOpen, Mail } from "lucide-react";

const tourSteps = [
    {
        id: "welcome",
        title: "Welcome to My Portfolio! 👋",
        description: "Let me give you a quick tour of what you'll discover here. This will only take a moment!",
        icon: Sparkles,
        action: "Start Tour",
    },
    {
        id: "projects",
        title: "Explore My Projects 🚀",
        description: "Check out my latest work in web development, AI systems, and UAV networks. Each project showcases real-world impact.",
        icon: Rocket,
        target: "work",
        action: "Next",
    },
    {
        id: "achievements",
        title: "Achievements & Recognition 🏆",
        description: "Discover awards, competitions, and milestones from my journey in technology and innovation.",
        icon: Award,
        target: "achievements",
        action: "Next",
    },
    {
        id: "publications",
        title: "Research & Publications 📚",
        description: "Explore my published research papers in AI-driven communication and advanced technologies.",
        icon: BookOpen,
        target: "publications",
        action: "Next",
    },
    {
        id: "contact",
        title: "Let's Connect! 💬",
        description: "Ready to collaborate? Reach out through the contact section or connect on social media.",
        icon: Mail,
        target: "contact",
        action: "Get Started",
    },
];

export default function OnboardingTour() {
    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [hasSeenTour, setHasSeenTour] = useState(true);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        // SSR-safe localStorage check
        try {
            const tourCompleted = typeof window !== "undefined"
                ? localStorage.getItem("portfolio-tour-completed")
                : null;
            if (!tourCompleted) {
                const t = setTimeout(() => {
                    setHasSeenTour(false);
                    setIsActive(true);
                }, 1500);
                return () => clearTimeout(t);
            }
        } catch {
            // localStorage unavailable (e.g. private browsing) — skip tour
        }
    }, []);

    const handleNext = () => {
        const step = tourSteps[currentStep];

        if (currentStep < tourSteps.length - 1) {
            // Scroll to target section if it exists
            if (step.target) {
                const element = document.getElementById(step.target);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }
            setCurrentStep(currentStep + 1);
        } else {
            completeTour();
        }
    };

    const handleSkip = () => {
        completeTour();
    };

    const completeTour = () => {
        try { localStorage.setItem("portfolio-tour-completed", "true"); } catch { /* ignore */ }
        setIsActive(false);
        setHasSeenTour(true);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const step = tourSteps[currentStep];
    const Icon = step.icon;

    if (hasSeenTour) return null;

    return (
        <AnimatePresence>
            {isActive && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        onClick={handleSkip}
                    />

                    {/* Spotlight effect on target */}
                    {step.target && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={shouldReduceMotion ? { duration: 0 } : undefined}
                            className="fixed inset-0 pointer-events-none z-[101]"
                        >
                            <div
                                className="absolute rounded-lg ring-4 ring-purple-400/50 shadow-2xl shadow-purple-500/50"
                                style={{
                                    top: document.getElementById(step.target)?.offsetTop - 20 || 0,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    width: "90%",
                                    maxWidth: "1200px",
                                    height: document.getElementById(step.target)?.offsetHeight + 40 || 200,
                                }}
                            />
                        </motion.div>
                    )}

                    {/* Tour Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={shouldReduceMotion ? { duration: 0 } : undefined}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[102] w-[90%] max-w-lg"
                    >
                        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden">
                            {/* Animated background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-50" />

                            {/* Close button */}
                            <button
                                onClick={handleSkip}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
                                aria-label="Skip tour"
                            >
                                <X className="h-5 w-5 text-gray-400" />
                            </button>

                            <div className="relative p-8">
                                {/* Icon */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={
                                        shouldReduceMotion
                                            ? { duration: 0 }
                                            : { delay: 0.2, type: "spring", stiffness: 200 }
                                    }
                                    className="mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30"
                                >
                                    <Icon className="h-8 w-8 text-purple-400" />
                                </motion.div>

                                {/* Content */}
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.3 }}
                                    className="text-2xl md:text-3xl font-bold mb-4 text-white"
                                >
                                    {step.title}
                                </motion.h2>

                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.4 }}
                                    className="text-gray-300 text-base md:text-lg leading-relaxed mb-8"
                                >
                                    {step.description}
                                </motion.p>

                                {/* Progress dots */}
                                <div className="flex gap-2 mb-6">
                                    {tourSteps.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentStep
                                                    ? "w-8 bg-purple-400"
                                                    : index < currentStep
                                                        ? "w-1.5 bg-purple-400/50"
                                                        : "w-1.5 bg-gray-600"
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSkip}
                                        className="px-6 py-3 rounded-lg border border-gray-600 hover:border-gray-500 hover:bg-white/5 transition-all text-gray-300 font-medium"
                                    >
                                        Skip Tour
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 transition-all text-white font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 inline-flex items-center justify-center gap-2 group"
                                    >
                                        {step.action}
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
