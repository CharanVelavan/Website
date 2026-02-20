// src/components/CompaniesSection.jsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function CompaniesSection({ companies }) {
  if (!companies?.enabled || !companies?.list?.length) return null;

  return (
    <aside className="hidden xl:block sticky top-24 h-fit w-[240px] -mr-8 2xl:-mr-20">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl border border-black/10 dark:border-white/10 bg-gray-50 dark:bg-gradient-to-br dark:from-white/5 dark:to-white/[0.02] p-6 backdrop-blur-xl shadow-2xl"
      >
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold tracking-wide text-gray-900/90 dark:text-white/90">
            Associated With
          </h3>
          <div className="mt-1 h-[2px] w-12 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500" />
        </div>

        {/* Companies List */}
        <ul className="space-y-4">
          {companies.list.map((company, index) => (
            <motion.li
              key={company.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {company.url ? (
                <a
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-lg p-3 transition-all hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 flex-shrink-0 rounded-lg bg-black/10 dark:bg-white/10 p-2 transition-all group-hover:bg-black/20 dark:group-hover:bg-white/20 overflow-hidden">
                      <Image
                        src={company.logo}
                        alt={`${company.name} logo`}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors group-hover:text-gray-900 dark:group-hover:text-white truncate">
                        {company.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Partner</p>
                    </div>
                  </div>
                </a>
              ) : (
                <div className="block rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 flex-shrink-0 rounded-lg bg-black/10 dark:bg-white/10 overflow-hidden">
                      <Image
                        src={company.logo}
                        alt={`${company.name} logo`}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-300 truncate">
                        {company.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Partner</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.li>
          ))}
        </ul>

        {/* Footer decoration */}
        <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10">
          <div className="flex items-center justify-center gap-1">
            <div className="h-1 w-1 rounded-full bg-purple-500/40" />
            <div className="h-1 w-1 rounded-full bg-purple-500/60" />
            <div className="h-1 w-1 rounded-full bg-purple-500/80" />
          </div>
        </div>
      </motion.div>
    </aside>
  );
}
