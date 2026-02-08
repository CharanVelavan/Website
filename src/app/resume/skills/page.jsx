// src/app/resume/skills/page.jsx
"use client";

import { motion } from "framer-motion";

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

export default function SkillsPage() {
    return (
        <div>
            {/* PAGE HEADER */}
            <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
            >
                <div className="mb-4">
                    <span className="text-sm uppercase tracking-[0.2em] text-purple-400 font-medium">
                        Technical Expertise
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Technical Skills
                </h1>
                <p className="mt-4 max-w-3xl text-lg text-gray-400 leading-relaxed">
                    A comprehensive overview of my technical skills across programming
                    languages, frameworks, tools, and technologies. These skills have been
                    developed through academic coursework, personal projects, internships,
                    and continuous self-learning.
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

            {/* ADDITIONAL INFO */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-12 rounded-2xl border border-purple-500/30 bg-purple-500/5 p-8"
            >
                <h3 className="text-xl font-semibold text-white mb-4">
                    Continuous Learning
                </h3>
                <p className="text-gray-400 leading-relaxed">
                    I am constantly expanding my skill set through online courses,
                    documentation, hands-on projects, and staying updated with the latest
                    industry trends. My approach to learning emphasizes practical
                    application and building real-world solutions.
                </p>
            </motion.div>
        </div>
    );
}
