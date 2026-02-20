# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

**Next.js 16 App Router** portfolio site (JavaScript, not TypeScript). Uses React 19, Tailwind CSS v4, Framer Motion, and GSAP.

### Data Layer

All content lives in two files — treat them as the single source of truth:
- `src/lib/projects.js` — array of project objects (slug, images, metrics, links, role, companies, architecture)
- `src/lib/achievements.js` — array of achievement objects (slug, year, category, impact, images)

Dynamic routes (`/projects/[slug]`, `/achievements/[slug]`) derive their content by matching the `slug` field from these arrays.

### Page Structure

`src/app/page.js` is a `"use client"` component that composes the entire homepage in vertical section order. Each section maps to a component in `src/components/`. The homepage initializes a scroll manager (`src/lib/scroll-utils.js`) using Intersection Observer to track the active section for navigation highlighting.

`src/app/layout.js` wraps all pages with the Navbar and Geist font setup. The `/resume/*` routes have their own `layout.jsx`.

### Component Conventions

- Path alias `@/*` maps to `src/*` (configured in `jsconfig.json`)
- Interactive components use `"use client"` directive; data-only pages are server components by default
- Styling: Tailwind utility classes only — no separate `.css` files per component. All global styles are in `src/app/globals.css`
- Design tokens: background `#0a0a0a`, accents `purple-400`/`blue-400`, glassmorphism via `backdrop-blur-sm bg-white/5 border-white/10`
- Animations use Framer Motion for React component transitions; GSAP is used for more complex timeline animations

### Navigation System

Multiple overlapping navigation components coordinate via the scroll manager:
- `Navbar.jsx` — fixed top bar, auto-hides on scroll
- `SectionNav.jsx` — desktop sidebar, appears after the hero section
- `MobileNav.jsx` — hamburger menu for mobile
- `OnboardingTour.jsx`, `FloatingActionButton.jsx`, `NavigationHints.jsx`, `ScrollProgress.jsx`, `SectionIndicator.jsx` — UX enhancement layer

### Adding Content

To add a new project or achievement, append an entry to the respective `src/lib/` data file with a unique `slug`. The listing page and detail page will pick it up automatically. Place associated images under `public/images/projects/` or `public/images/achievements/`.
