"use client";

import { useState } from "react";
import Hero1 from "@/../Sample_HERO_PAge/Hero6_AuroraBorealis";
import Hero2 from "@/../Sample_HERO_PAge/Hero8_MinimalZen";
import Hero3 from "@/../Sample_HERO_PAge/Hero15_MatrixRain";
import Hero4 from "@/../Sample_HERO_PAge/Hero9_RetroSynthwave";
import Hero5 from "@/../Sample_HERO_PAge/Hero5_MagneticParticles";

const heroes = [
  { id: 1, name: "Cinematic Terminal", component: Hero1 },
  { id: 2, name: "3D Card Perspective", component: Hero2 },
  { id: 3, name: "Bento Grid", component: Hero3 },
  { id: 4, name: "Spotlight Reveal", component: Hero4 },
  { id: 5, name: "Magnetic Particles", component: Hero5 },
];

export default function PreviewHeroes() {
  const [active, setActive] = useState(0);
  const ActiveHero = heroes[active].component;

  return (
    <div className="relative min-h-screen bg-[#050505]">
      {/* Floating switcher bar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1 p-1.5 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-purple-500/10">
        {heroes.map((hero, i) => (
          <button
            key={hero.id}
            onClick={() => setActive(i)}
            className={`px-3 py-2 text-xs font-medium rounded-xl transition-all whitespace-nowrap ${active === i
              ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30"
              : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
          >
            <span className="hidden sm:inline">#{hero.id} </span>
            {hero.name}
          </button>
        ))}
      </div>

      {/* Active hero */}
      <ActiveHero />

      {/* Bottom label */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 text-xs text-gray-500">
        Previewing: <span className="text-purple-400 font-medium">{heroes[active].name}</span> — {active + 1} of {heroes.length}
      </div>
    </div>
  );
}
