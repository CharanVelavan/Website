# Charan Velavan — Portfolio

Personal portfolio of **Charan Velavan**, an Embedded Developer working at the intersection of 5G networks, AI/ML, UAV systems, and RF engineering. Built with Next.js App Router and a dark glassmorphism aesthetic.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion 12, GSAP 3 |
| Icons | Lucide React |
| Fonts | Geist, Geist Mono (next/font) |

---

## Features

**Pages & Sections**
- Single-page layout: Hero → About → Featured Showcase → Internships → Skills → Certifications → Publications → Education → Contact
- Dedicated routes: `/projects`, `/achievements`, `/resume` (with sub-routes: `/resume/internships`, `/resume/certifications`, `/resume/publications`, `/resume/educations`, `/resume/skills`)
- Dynamic detail pages for projects and achievements via `[slug]` routes

**Navigation**
- Auto-hiding top navbar with active-section highlight
- Desktop sidebar section navigator (appears after the hero)
- Mobile hamburger menu
- Floating action button — scroll-to-top, section shortcuts, resume download
- Scroll progress bar and current-section indicator

**UX**
- Interactive onboarding tour for first-time visitors (spotlight effect, localStorage-persisted)
- Project image slideshows with 3-second auto-rotation and manual controls
- Animated counters, staggered entrance animations, parallax hero
- Fully responsive — mobile-first with Tailwind breakpoints

---

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.js           # Root layout (Navbar, fonts, metadata)
│   ├── page.js             # Homepage — composes all sections
│   ├── projects/[slug]/    # Dynamic project detail pages
│   ├── achievements/[slug]/# Dynamic achievement detail pages
│   └── resume/             # Resume section with nested routes
├── components/             # ~30 reusable React components
└── lib/
    ├── projects.js         # All project data (single source of truth)
    ├── achievements.js     # All achievement data
    └── scroll-utils.js     # Scroll manager & active-section tracker

public/
├── images/                 # Project, achievement, internship, certification images
├── videos/                 # Video assets
├── papers/                 # Research paper PDFs
└── resume.pdf
```

---

## Content Management

All content is data-driven — no UI changes are needed to add entries.

- **Add a project** — append an object with a unique `slug` to `src/lib/projects.js`. Place images in `public/images/projects/`.
- **Add an achievement** — append to `src/lib/achievements.js`. Place images in `public/images/achievements/`.
- **Resume assets** — update `public/resume.pdf` to refresh the downloadable resume.

---

## Deployment

Optimized for **Vercel** (zero-config Next.js deployment). Also works on any Node.js host:

```bash
npm run build && npm run start
```

---

## Contact

- **Email** — Charanvelavan12@gmail.com
- **LinkedIn** — [linkedin.com/in/charan-velavan](https://www.linkedin.com/in/charan-velavan/)
