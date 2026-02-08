// src/components/ImageGallery.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageGallery({ images, title }) {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const scrollContainerRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    const openLightbox = (index) => {
        setSelectedIndex(index);
    };

    const closeLightbox = () => {
        setSelectedIndex(null);
    };

    const goToPrevious = () => {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    };

    const goToNext = () => {
        setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    };

    const handleKeyDown = (e) => {
        if (selectedIndex === null) return;

        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") goToPrevious();
        if (e.key === "ArrowRight") goToNext();
    };

    // Keyboard listener
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedIndex]);

    // Auto-scroll effect with seamless infinite loop
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container || isHovered) return;

        const scrollSpeed = 0.5; // pixels per frame (slower for smoother effect)
        let animationFrameId;

        const autoScroll = () => {
            // Get the width of one set of images
            const singleSetWidth = container.scrollWidth / 3; // We have 3 copies

            // Scroll continuously
            container.scrollLeft += scrollSpeed;

            // When we've scrolled past the first set, reset to the beginning
            // This creates the seamless loop effect
            if (container.scrollLeft >= singleSetWidth) {
                container.scrollLeft = 0;
            }

            animationFrameId = requestAnimationFrame(autoScroll);
        };

        animationFrameId = requestAnimationFrame(autoScroll);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isHovered]);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
    };

    if (!images || images.length === 0) return null;

    // Triple the images for seamless infinite scroll
    const tripleImages = [...images, ...images, ...images];

    return (
        <>
            {/* Horizontal Scrolling Gallery */}
            <div
                className="relative group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Left Arrow */}
                <button
                    onClick={scrollLeft}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Right Arrow */}
                <button
                    onClick={scrollRight}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {tripleImages.map((image, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: (index % images.length) * 0.1 }}
                            className="flex-shrink-0 cursor-pointer group/item relative"
                            onClick={() => openLightbox(index % images.length)}
                        >
                            {/* Image at natural size */}
                            <div className="relative h-64 w-auto rounded-xl overflow-hidden border border-white/10">
                                <img
                                    src={image}
                                    alt={`${title} - Image ${(index % images.length) + 1}`}
                                    className="h-full w-auto object-contain"
                                    style={{ maxWidth: 'none' }}
                                />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                                    <div className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                                        <svg
                                            className="w-12 h-12 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                        onClick={closeLightbox}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute top-4 left-4 z-50 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm">
                            {selectedIndex + 1} / {images.length}
                        </div>

                        {/* Previous Button */}
                        {images.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToPrevious();
                                }}
                                className="absolute left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6 text-white" />
                            </button>
                        )}

                        {/* Next Button */}
                        {images.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToNext();
                                }}
                                className="absolute right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <ChevronRight className="w-6 h-6 text-white" />
                            </button>
                        )}

                        {/* Main Image */}
                        <motion.div
                            key={selectedIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="relative max-w-7xl max-h-[90vh] w-full h-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={images[selectedIndex]}
                                alt={`${title} - Image ${selectedIndex + 1}`}
                                fill
                                className="object-contain"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </>
    );
}
