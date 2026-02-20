"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white"
        >
          Get In Touch
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-xl text-gray-600 dark:text-gray-400 mb-8"
        >
          I&apos;m currently open to collaborations, research discussions,
          and interesting projects. Feel free to reach out.
        </motion.p>

        {/* Contact Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {/* Email */}
          <a
            href="mailto:Charanvelavan12@gmail.com"
            className="inline-flex items-center gap-3 px-6 py-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-black/10 dark:hover:bg-white/10 hover:border-purple-500/50 transition-all group"
          >
            <Mail className="h-5 w-5 text-purple-500 dark:text-purple-400 group-hover:text-purple-400 dark:group-hover:text-purple-300 transition-colors" />
            <span>Charanvelavan12@gmail.com</span>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/charan-velavan/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-black/10 dark:hover:bg-white/10 hover:border-blue-500/50 transition-all group"
          >
            <Linkedin className="h-5 w-5 text-blue-500 dark:text-blue-400 group-hover:text-blue-400 dark:group-hover:text-blue-300 transition-colors" />
            <span>LinkedIn Profile</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
