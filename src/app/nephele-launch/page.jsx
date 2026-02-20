"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function NepheleLaunchPage() {
    const [status, setStatus] = useState("Initializing backend...");
    const [progress, setProgress] = useState(0);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        const backendUrl = "https://nephele-backend.onrender.com/";
        const frontendUrl = "https://nephele-frontend.vercel.app/app";

        const wakeUpBackend = async () => {
            try {
                setStatus("Waking up Nephele backend...");
                setProgress(20);

                // Ping the backend to wake it up
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

                const response = await fetch(backendUrl, {
                    signal: controller.signal,
                    mode: 'no-cors' // Allow cross-origin request
                });

                clearTimeout(timeoutId);

                setStatus("Backend is ready!");
                setProgress(70);

                // Wait a moment to show success message
                await new Promise(resolve => setTimeout(resolve, 1000));

                setStatus("Redirecting to Nephele...");
                setProgress(100);

                // Redirect to frontend
                await new Promise(resolve => setTimeout(resolve, 500));
                window.location.href = frontendUrl;

            } catch (error) {
                // Even if there's an error (like CORS or timeout), the backend is likely awake
                // So we proceed to the frontend
                setStatus("Backend initialized, launching frontend...");
                setProgress(100);

                await new Promise(resolve => setTimeout(resolve, 1000));
                window.location.href = frontendUrl;
            }
        };

        wakeUpBackend();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
                className="max-w-md w-full"
            >
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {/* Logo/Icon */}
                    <motion.div
                        animate={shouldReduceMotion ? { rotate: 0 } : { rotate: 360 }}
                        transition={
                            shouldReduceMotion
                                ? { duration: 0 }
                                : { duration: 2, repeat: Infinity, ease: "linear" }
                        }
                        className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center"
                    >
                        <span className="text-3xl">🤖</span>
                    </motion.div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-white text-center mb-2">
                        Launching Nephele
                    </h1>

                    {/* Status */}
                    <p className="text-gray-400 text-center mb-6">
                        {status}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500"
                        />
                    </div>

                    {/* Info */}
                    <p className="text-xs text-gray-500 text-center mt-6">
                        Please wait while we prepare your experience...
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
