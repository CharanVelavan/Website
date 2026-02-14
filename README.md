# Charan Velavan Portfolio

A premium personal portfolio built with **Next.js App Router**, focused on projects in **5G systems, AI/ML, embedded robotics, and cloud-native applications**. The site combines rich UI animation, data-driven content modules, and dynamic detail pages for projects and achievements.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19
- **Styling:** Tailwind CSS v4 + custom global CSS
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Tooling:** ESLint + PostCSS

## Features

- Home landing page composed of modular sections (hero, about, projects showcase, resume segments, contact).
- Dedicated **Projects** page and dynamic project detail pages (`/projects/[slug]`).
- Dedicated **Achievements** page and dynamic achievement detail pages (`/achievements/[slug]`).
- Resume sub-routes for internships, certifications, publications, education, and skills.
- Enhanced navigation system with section tracking, onboarding tour, scroll progress, section indicator, mobile nav, and floating action button.
- Centralized data model in `src/lib/projects.js` and `src/lib/achievements.js`.

## Project Structure

```text
.
├── src
│   ├── app
│   │   ├── layout.js
│   │   ├── page.js
│   │   ├── globals.css
│   │   ├── projects
│   │   │   ├── page.jsx
│   │   │   └── [slug]/page.jsx
│   │   ├── achievements
│   │   │   ├── page.jsx
│   │   │   └── [slug]/page.jsx
│   │   ├── resume
│   │   │   ├── layout.jsx
│   │   │   ├── page.jsx
│   │   │   ├── internships/page.jsx
│   │   │   ├── certifications/page.jsx
│   │   │   ├── publications/page.jsx
│   │   │   ├── educations/page.jsx
│   │   │   └── skills/page.jsx
│   │   └── nephele-launch/page.jsx
│   ├── components
│   └── lib
├── public
│   ├── images
│   └── papers
├── package.json
└── README.md
```

## Content & Data Model

### Projects (`src/lib/projects.js`)
Projects are stored as objects with rich metadata, including:
- `title`, `slug`, `description`, `summary`
- `details` (problem, approach, outcome)
- `tags`
- `media` and `images`
- `metrics` block
- `role` block
- `architecture` block
- `companies` block

Current project entries:
1. Bird's AI – 5G Search & Rescue Drone (`Birds-AI`)
2. Nephele 2.0 – Interaction Robot (`nephele-community-robot`)
3. 5G Network Implementation (`5g-network-implementation`)
4. Domestic Emotion Monitoring System (`emotion-monitoring-system`)
5. THz Bandpass Filter (`thz-bandpass-filter`)

### Achievements (`src/lib/achievements.js`)
Achievements are also data-driven and include dynamic slug-based routing.

Current achievement entries:
1. Inventors Challenge 2023 Winner (`inventors-challenge-23`)
2. SIH 2023 Finalist (`sih-23-finalist`)
3. SIH 2022 Finalist (`sih-22-finalist`)
4. NBUC '24 First Place (`nbuc-24-first-place`)

## Navigation & UX Architecture

The homepage uses a coordinated scroll/navigation system:
- `scroll-utils.js` maintains section state, active section detection, and smooth scrolling helpers.
- Multiple UI helpers subscribe to this state (section nav, scroll progress, hints, etc.).
- Section IDs are standardized via `DEFAULT_SECTIONS` to keep navigation components consistent.

## Getting Started

### Prerequisites
- Node.js 18+ (recommended)
- npm (lockfile is included)

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## Editing Content

### Add or edit a project
1. Update or add a project object in `src/lib/projects.js`.
2. Add corresponding media files under `public/images/projects/...` (and videos if needed).
3. Ensure `slug` is unique and URL-safe.

### Add or edit an achievement
1. Update or add an achievement object in `src/lib/achievements.js`.
2. Add gallery images under `public/images/achievements/...`.
3. Ensure `slug` is unique and URL-safe.

## Notes

- The repository includes some backup and draft files (e.g., `*.backup`, `Draft_Codes/*`) that are not part of runtime behavior.
- Route-level pages and reusable sections are intentionally separated to keep content and layout concerns modular.
