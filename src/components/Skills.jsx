// src/components/Skills.jsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const skillsData = [
    {
        category: "Programming Languages",
        skills: ["Python", "C", "C++", "Shell Scripting", "MATLAB"],
    },
    {
        category: "5G & Wireless Technologies",
        skills: [
            "5G / O-RAN",
            "CU & DU Architecture",
            "RAN",
            "srsRAN",
            "Open5GS",
            "USRP B210",
            "POWDER Wireless",
            "SDR Programming",
        ],
    },
    {
        category: "Embedded Systems & IoT",
        skills: [
            "Raspberry Pi 5",
            "STM32 Boards",
            "Hailo AI Kit",
            "OpenST Linux",
            "Custom Drone Development",
            "PCB Design (EasyEDA, KiCad)",
            "Solidworks",
        ],
    },
    {
        category: "AI & Machine Learning",
        skills: [
            "YOLO",
            "TensorFlow",
            "TensorFlow Lite",
            "CNN",
            "DNN",
            "Meta Llama 2.0",
            "Computer Vision",
            "Sentiment Analysis",
            "Face Recognition",
        ],
    },
    {
        category: "Cloud & DevOps",
        skills: [
            "AWS (DynamoDB, Lambda, S3, Polly, Rekognition, API Gateway)",
            "Docker",
            "GitHub Actions",
            "Linux",
            "YAML",
            "Firebase",
            "Google Colab",
        ],
    },
    {
        category: "RF & Circuit Design",
        skills: [
            "CST Studio Suite",
            "RF Design",
            "Bandpass Filter Design",
            "Terahertz Applications",
            "Fractal-based Design",
        ],
    },
    {
        category: "Networking & Tools",
        skills: [
            "Cisco Intersight",
            "Cisco DevNet",
            "Cisco Umbrella",
            "Log Analysis",
            "Performance Optimization",
            "System Debugging",
        ],
    },
    {
        category: "Frameworks & Development",
        skills: [
            "Flask",
            "Streamlit",
            "Flutter Flow",
            "MIT App Inventor",
            "VS Code",
            "PyCharm",
            "Terminal",
        ],
    },
];

const cardVariants = {
    rest: {
        y: 0,
        boxShadow: "0 0 0 rgba(0,0,0,0)",
        borderColor: "rgba(255,255,255,0.1)",
    },
    hover: {
        y: -8,
        boxShadow: "0 20px 40px rgba(0,0,0,0.35), 0 0 40px rgba(168,85,247,0.35)",
        borderColor: "rgba(168,85,247,0.6)",
        transition: { duration: 0.35, ease: "easeOut" },
    },
};

export default function Skills({ showViewAll = true }) {
    return (
        <section id="skills" className="py-20 md:py-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* SECTION HEADER */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <p className="mb-3 text-sm uppercase tracking-widest text-gray-400">
                        Technical Expertise
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Technical Skills
                    </h2>
                    <p className="mt-4 max-w-2xl text-gray-400">
                        A comprehensive overview of my technical skills across programming,
                        frameworks, tools, and technologies.
                    </p>
                </motion.header>

                {/* SKILLS GRID */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {skillsData.map((category, categoryIndex) => (
                        <motion.div
                            key={category.category}
                            variants={cardVariants}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover="hover"
                            animate="rest"
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                            className="rounded-2xl border bg-[#0b0b0b] p-6 h-full flex flex-col"
                        >
                            {/* Category Title */}
                            <h3 className="text-xl font-semibold text-white mb-4 pb-3 border-b border-white/10">
                                {category.category}
                            </h3>

                            {/* Skills Tags */}
                            <div className="flex flex-wrap gap-2">
                                {category.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1.5 text-xs rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* View All Link */}
                {showViewAll && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 text-center"
                    >
                        <Link
                            href="/resume/skills"
                            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            <span>View all skills</span>
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
