//stats.jsx
"use client";

import { motion } from "framer-motion";
import Counter from "./Counter";

const stats = [
  { label: "Major Projects", value: 5 },
  { label: "Achievements Won", value: 4 },
  { label: "Technologies Used", value: 15 },
  { label: "Research Publications", value: 1 },
];

export default function Stats() {
  return (
    <section className="py-32">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">

        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="text-4xl md:text-5xl font-bold">
              <Counter value={stat.value} />
            </div>

            <p className="mt-2 text-sm text-gray-400 uppercase tracking-widest">
              {stat.label}
            </p>
          </motion.div>
        ))}

      </div>
    </section>
  );
}
