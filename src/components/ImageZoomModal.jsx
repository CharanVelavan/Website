// src/components/ImageZoomModal.jsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

export default function ImageZoomModal({ src, alt, caption }) {
    const [isOpen, setIsOpen] = useState(false);
    const [scale, setScale] = useState(1);

    const handleZoomIn = () => {
        setScale((prev) => Math.min(prev + 0.5, 3));
    };

    const handleZoomOut = () => {
        setScale((prev) => Math.max(prev - 0.5, 0.5));
    };

    const handleReset = () => {
        setScale(1);
    };

    return (
        <>
            {/* Thumbnail with zoom hint */}
            <div
                onClick={() => setIsOpen(true)}
                className="group relative cursor-zoom-in rounded-xl overflow-hidden border border-white/10 bg-white/5 p-4 hover:border-purple-500/40 transition-all"
            >
                <img src={src} alt={alt} className="w-full" />

                {/* Zoom hint overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-center">
                        <Maximize2 className="h-12 w-12 text-white mx-auto mb-2" />
                        <p className="text-white font-medium">Click to zoom</p>
                    </div>
                </div>
            </div>

            {/* Full screen modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            aria-label="Close"
                        >
                            <X className="h-6 w-6 text-white" />
                        </button>

                        {/* Zoom controls */}
                        <div className="absolute top-6 left-6 z-10 flex gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleZoomOut();
                                }}
                                disabled={scale <= 0.5}
                                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Zoom out"
                            >
                                <ZoomOut className="h-5 w-5 text-white" />
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleReset();
                                }}
                                className="px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-medium"
                            >
                                {Math.round(scale * 100)}%
                            </button>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleZoomIn();
                                }}
                                disabled={scale >= 3}
                                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Zoom in"
                            >
                                <ZoomIn className="h-5 w-5 text-white" />
                            </button>
                        </div>

                        {/* Image container */}
                        <div
                            className="h-full w-full overflow-auto p-20 flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.img
                                src={src}
                                alt={alt}
                                className="max-w-none cursor-move"
                                style={{
                                    transform: `scale(${scale})`,
                                    transition: "transform 0.3s ease-out",
                                }}
                                drag
                                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                dragElastic={0.1}
                            />
                        </div>

                        {/* Caption */}
                        {caption && (
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-center text-white text-sm max-w-3xl mx-auto">
                                    {caption}
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
