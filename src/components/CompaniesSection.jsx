// src/components/CompaniesSection.jsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/**
 * CompaniesSection — renders associated companies.
 * - On xl+ screens: vertical sidebar (same as before)
 * - On mobile/tablet: horizontal scrolling strip at the bottom of content
 */
export default function CompaniesSection({ companies }) {
  if (!companies?.enabled || !companies?.list?.length) return null;

  const list = companies.list;

  const CompanyItem = ({ company, index }) => {
    const inner = (
      <div className="flex xl:flex-row flex-col items-center gap-2 xl:gap-3">
        <div className="relative flex-shrink-0 rounded-xl bg-white/10 dark:bg-white/90 p-2 overflow-hidden transition-all group-hover:bg-white/20 dark:group-hover:bg-white"
          style={{ width: 48, height: 48 }}>
          <Image
            src={company.logo}
            alt={`${company.name} logo`}
            fill
            className="object-contain p-1"
          />
        </div>
        <div className="flex-1 min-w-0 text-center xl:text-left">
          <p className="text-sm font-medium text-gray-300 transition-colors group-hover:text-white truncate">
            {company.name}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5 hidden xl:block">Partner</p>
        </div>
      </div>
    );

    const wrapperClass =
      "group block rounded-xl p-2.5 transition-all hover:bg-white/5 " +
      // On mobile: min-width cards for horizontal scroll
      "min-w-[100px] xl:min-w-0 flex-shrink-0 xl:flex-shrink";

    return (
      <motion.div
        key={company.name}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
      >
        {company.url ? (
          <a href={company.url} target="_blank" rel="noopener noreferrer" className={wrapperClass}>
            {inner}
          </a>
        ) : (
          <div className={wrapperClass}>{inner}</div>
        )}
      </motion.div>
    );
  };

  return (
    <>
      {/* ── MOBILE / TABLET: horizontal strip (below main content) ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="xl:hidden mt-10 rounded-2xl border border-white/10 bg-[#0a0a0a] bg-white/[0.03] backdrop-blur-sm p-4"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Associated With
          </h3>
          <div className="h-[2px] w-8 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500" />
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 snap-x-mandatory">
          {list.map((company, index) => (
            <div key={company.name} className="snap-start">
              <CompanyItem company={company} index={index} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── DESKTOP xl+: vertical sidebar ── */}
      <aside className="hidden xl:block sticky top-24 h-fit w-[240px] -mr-8 2xl:-mr-20">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl border border-white/10 bg-[#0a0a0a] bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-xl shadow-2xl"
        >
          <div className="mb-6">
            <h3 className="text-sm font-semibold tracking-wide text-white/90">
              Associated With
            </h3>
            <div className="mt-1 h-[2px] w-12 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500" />
          </div>

          <ul className="space-y-4">
            {list.map((company, index) => (
              <li key={company.name}>
                <CompanyItem company={company} index={index} />
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center justify-center gap-1">
              <div className="h-1 w-1 rounded-full bg-purple-500/40" />
              <div className="h-1 w-1 rounded-full bg-purple-500/60" />
              <div className="h-1 w-1 rounded-full bg-purple-500/80" />
            </div>
          </div>
        </motion.div>
      </aside>
    </>
  );
}
