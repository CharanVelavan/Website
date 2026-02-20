"use client";

import { useEffect } from "react";
import Hero from "@/components/Hero";
import About from "@/components/About";
import FeaturedShowcase from "@/components/FeaturedShowcase";
import Internships from "@/components/Internships";
import Skills from "@/components/Skills";
import Certifications from "@/components/Certifications";
import Publications from "@/components/Publications";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import SectionNav from "@/components/SectionNav";
import OnboardingTour from "@/components/OnboardingTour";
import MobileNav from "@/components/MobileNav";
import FloatingActionButton from "@/components/FloatingActionButton";
import ScrollProgress from "@/components/ScrollProgress";
import NavigationHints from "@/components/NavigationHints";
import MobileTabBar from "@/components/MobileTabBar";
import scrollManager, { DEFAULT_SECTIONS } from "@/lib/scroll-utils";

export default function Home() {
  // Initialize scroll manager with section IDs
  useEffect(() => {
    scrollManager.init(DEFAULT_SECTIONS);

    return () => {
      scrollManager.destroy();
    };
  }, []);

  return (
    <main className="pb-16 lg:pb-0">
      {/* Navigation Enhancement Components */}
      <OnboardingTour />
      <ScrollProgress />
      <SectionNav />
      <MobileNav />
      <FloatingActionButton />
      <NavigationHints />
      <MobileTabBar />

      <Hero />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <About />
        <FeaturedShowcase />
        <Internships />
        <Skills />
        <Certifications />
        <Publications />
        <Education />
        <Contact />
      </div>
    </main>
  );
}
