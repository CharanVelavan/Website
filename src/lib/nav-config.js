// src/lib/nav-config.js
// Single source of truth for all navigation section definitions.
// Import NAV_SECTIONS from here instead of defining arrays in each component.

import {
  Home,
  User,
  Briefcase,
  Award,
  Building2,
  Code,
  FileText,
  BookOpen,
  GraduationCap,
  Mail,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    id: "hero",
    label: "Home",
    shortLabel: "Home",
    emoji: "🏠",
    icon: Home,
    color: "from-purple-500 to-blue-500",
    showInSidebar: false,
  },
  {
    id: "about",
    label: "About Me",
    shortLabel: "About",
    emoji: "👨‍💻",
    icon: User,
    color: "from-blue-500 to-cyan-500",
    showInSidebar: true,
  },
  {
    id: "work",
    label: "Projects",
    shortLabel: "Projects",
    emoji: "🚀",
    icon: Briefcase,
    color: "from-purple-500 to-pink-500",
    showInSidebar: true,
  },
  {
    id: "achievements",
    label: "Achievements",
    shortLabel: "Achievements",
    emoji: "🏆",
    icon: Award,
    color: "from-pink-500 to-orange-500",
    showInSidebar: true,
  },
  {
    id: "internships",
    label: "Internships",
    shortLabel: "Internships",
    emoji: "💼",
    icon: Building2,
    color: "from-orange-500 to-yellow-500",
    showInSidebar: true,
  },
  {
    id: "skills",
    label: "Skills",
    shortLabel: "Skills",
    emoji: "⚡",
    icon: Code,
    color: "from-yellow-500 to-lime-500",
    showInSidebar: true,
  },
  {
    id: "certifications",
    label: "Certifications",
    shortLabel: "Certs",
    emoji: "📜",
    icon: FileText,
    color: "from-yellow-500 to-green-500",
    showInSidebar: true,
  },
  {
    id: "publications",
    label: "Publications",
    shortLabel: "Publications",
    emoji: "📚",
    icon: BookOpen,
    color: "from-green-500 to-teal-500",
    showInSidebar: true,
  },
  {
    id: "education",
    label: "Education",
    shortLabel: "Education",
    emoji: "🎓",
    icon: GraduationCap,
    color: "from-teal-500 to-blue-500",
    showInSidebar: true,
  },
  {
    id: "contact",
    label: "Contact",
    shortLabel: "Contact",
    emoji: "💬",
    icon: Mail,
    color: "from-blue-500 to-purple-500",
    showInSidebar: true,
  },
];

/** Lookup a section definition by its id. Returns null if not found. */
export function getSectionById(id) {
  return NAV_SECTIONS.find((s) => s.id === id) || null;
}
