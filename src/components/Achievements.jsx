"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Award, Trophy, Lightbulb } from "lucide-react";
import { achievements, featuredAchievementSlugs } from "@/lib/achievements";

const iconMap = {
  Innovation: Lightbulb,
  Hackathon: Trophy,
  Competition: Award,
  default: Award,
};

export default function Achievements() {
  // Get featured achievements
  const featuredAchievements = achievements.filter((a) =>
    featuredAchievementSlugs.includes(a.slug)
  );

  return (
    <section id="achievements" className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* SECTION HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-sm uppercase tracking-widest text-gray-400 mb-4">
            Recognition
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Achievements & Awards
          </h2>
          <p className="mt-4 max-w-2xl text-gray-400">
            Recognition and awards received for innovation, technical excellence,
            and competitive achievements in hackathons and national competitions.
          </p>
        </motion.header>

        {/* ACHIEVEMENTS GRID */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {featuredAchievements.map((achievement, index) => {
            const IconComponent = iconMap[achievement.category] || iconMap.default;

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Link href={`/achievements/${achievement.slug}`}>
                  <div className="group relative h-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-white/30 hover:shadow-2xl hover:shadow-purple-500/20">
                    {/* Image Section */}
                    <div className="relative h-24 sm:h-48 overflow-hidden bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                      {/* Placeholder gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-50" />

                      {/* Icon Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <IconComponent className="h-8 w-8 sm:h-16 sm:w-16 text-white/30 group-hover:text-white/50 transition-colors" />
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                        <span className="px-1.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-xs font-medium rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white">
                          {achievement.category}
                        </span>
                      </div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Content Section */}
                    <div className="p-2.5 sm:p-6">
                      {/* Date */}
                      <p className="text-[9px] sm:text-xs uppercase tracking-widest text-purple-400 mb-1.5 sm:mb-3 font-medium">
                        {achievement.year}
                      </p>

                      {/* Title */}
                      <h3 className="text-xs sm:text-lg font-semibold text-white mb-1.5 sm:mb-3 group-hover:text-purple-300 transition-colors line-clamp-2">
                        {achievement.title}
                      </h3>

                      {/* Description */}
                      <p className="text-[10px] sm:text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors line-clamp-2 sm:line-clamp-3">
                        {achievement.shortDescription}
                      </p>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
                  </div>
                </Link>
              </motion.div>
            );
          })}

          {/* VIEW ALL ACHIEVEMENTS TILE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: featuredAchievements.length * 0.1 }}
            whileHover={{ y: -8 }}
          >
            <Link href="/achievements">
              <div className="group relative h-full rounded-2xl border border-white/10 bg-white/[0.02] hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 flex flex-col items-center justify-center min-h-[150px] sm:min-h-[300px] p-3 sm:p-8">
                {/* Hover glow */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20" />

                {/* Icon */}
                <div className="relative z-10 mb-3 sm:mb-6 h-10 w-10 sm:h-20 sm:w-20 rounded-full bg-purple-500/10 border-2 border-purple-500/30 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:border-purple-500/50 transition-all">
                  <Award className="h-5 w-5 sm:h-10 sm:w-10 text-purple-400 group-hover:text-purple-300 transition-colors" />
                </div>

                {/* Text */}
                <h3 className="relative z-10 text-sm sm:text-2xl font-semibold text-white mb-1 sm:mb-3 group-hover:text-purple-300 transition-colors text-center">
                  View All Achievements
                </h3>

                <p className="relative z-10 text-gray-400 text-center group-hover:text-gray-300 transition-colors hidden sm:block">
                  Explore the complete list with detailed stories
                </p>

                {/* Arrow */}
                <div className="relative z-10 mt-3 sm:mt-6 flex items-center gap-1 sm:gap-2 text-purple-400 group-hover:text-purple-300 transition-colors">
                  <span className="text-[10px] sm:text-sm font-medium">See all</span>
                  <svg
                    className="h-3 w-3 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1"
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
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
