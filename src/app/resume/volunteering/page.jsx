// src/app/resume/volunteering/page.jsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

// All Toastmasters roles grouped under one organization
const organizations = [
  {
    id: "toastmasters",
    company: "Toastmasters International",
    subtitle: "TMI@EastCoast · Chennai, India",
    logo: "/images/intern/toastmasters/Toastmasters.png",
    totalDuration: "Jul 2022 – Present",
    roles: [
      {
        title: "Club President",
        type: "Part-time",
        duration: "Jan 2026 – Present",
        description: [
          "Leading the club as President, overseeing all operations and member development.",
          "Cultivating an inclusive environment that empowers members to grow as public speakers and leaders.",
        ],
        skills: ["Public Speaking", "Leadership", "Club Management"],
        current: true,
      },
      {
        title: "Vice President Public Relations (VPPR)",
        type: "Part-time",
        duration: "Jun 2023 – Dec 2023",
        description: [
          "Led dynamic communication initiatives at TMI@EastCoast Toastmasters Club, promoting members' public speaking prowess.",
          "Crafted compelling narratives to showcase the club's achievements and shaped its public story.",
          "Contributed to TMI@EastCoast's vibrant and inclusive communication culture.",
        ],
        skills: ["Strategic Public Relations Planning", "Poster Design", "Public Speaking"],
      },
      {
        title: "Member",
        type: "Part-time",
        duration: "Jul 2022 – Present · 3 yrs 8 mos",
        description: [
          "Active member for over 3 years, continuously developing public speaking, leadership, and communication skills.",
          "Participated in table topics, prepared speeches, and evaluation contests.",
        ],
        skills: ["Public Speaking", "Leadership"],
      },
    ],
  },
];

export default function VolunteeringPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 pt-24 pb-tab-safe">

      {/* ── HEADER ── */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <p className="mb-3 text-sm uppercase tracking-widest text-purple-400 font-medium">
          Resume
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Volunteering
        </h1>
        <p className="mt-4 max-w-2xl text-gray-400 leading-relaxed">
          Community involvement, leadership roles, and voluntary contributions beyond professional work.
        </p>
      </motion.header>

      {/* ── ORGANIZATIONS ── */}
      <div className="space-y-8">
        {organizations.map((org, orgIndex) => (
          <motion.div
            key={org.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: orgIndex * 0.1 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent overflow-hidden hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
          >
            {/* org header */}
            <div className="flex items-center gap-5 p-5 sm:p-6 border-b border-white/10">
              <div className="w-16 h-16 rounded-xl bg-white flex-shrink-0 flex items-center justify-center p-2 shadow-lg ring-1 ring-black/5">
                <img
                  src={org.logo}
                  alt={org.company}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h2 className="text-xl font-bold text-white">{org.company}</h2>
                  <span className="flex items-center gap-1.5 text-[11px] text-gray-400 bg-white/5 rounded-full px-2.5 py-1 border border-white/10 whitespace-nowrap flex-shrink-0">
                    <Calendar size={10} />
                    {org.totalDuration}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{org.subtitle}</p>
              </div>
            </div>

            {/* roles timeline */}
            <div className="p-5 sm:p-6">
              <div className="relative">
                {/* connecting line */}
                <div className="absolute left-[8px] top-4 bottom-4 w-px bg-gradient-to-b from-purple-500/60 via-purple-500/25 to-transparent" />

                <div className="space-y-7">
                  {org.roles.map((role, roleIndex) => (
                    <div key={roleIndex} className="relative pl-7">
                      {/* dot */}
                      <div className={`absolute left-0 top-[5px] w-4 h-4 rounded-full border-2 flex items-center justify-center ${role.current ? "border-purple-400 bg-purple-500/20" : "border-purple-500/60 bg-[#0a0a0a]"}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${role.current ? "bg-purple-400" : "bg-purple-500/60"}`} />
                      </div>

                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-purple-300">{role.title}</h3>
                          {role.current && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-400 font-medium">
                              Current
                            </span>
                          )}
                        </div>
                        <span className="flex items-center gap-1.5 text-[11px] text-gray-500 whitespace-nowrap">
                          <Calendar size={9} />
                          {role.duration}
                        </span>
                      </div>

                      <ul className="space-y-1.5 mb-3">
                        {role.description.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-400 leading-relaxed">
                            <span className="mt-2 w-1 h-1 rounded-full bg-gray-500/60 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>

                      {role.skills && role.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {role.skills.map((skill) => (
                            <span key={skill} className="px-2.5 py-1 text-[11px] rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── BACK ── */}
      <div className="mt-24">
        <Link href="/resume" className="text-sm text-gray-400 hover:text-white transition-colors">
          ← Back to Resume
        </Link>
      </div>
    </main>
  );
}
