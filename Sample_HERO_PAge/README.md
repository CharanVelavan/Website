# Sample Hero Pages

5 creative hero page concepts built with **React 19**, **Framer Motion**, **Tailwind CSS v4**, and **Next.js**.

## Hero Concepts

### 1. Cinematic Terminal (`Hero1_CinematicTerminal.jsx`)
A split-screen hero with a live terminal animation that "boots up" the portfolio by typing commands. The right side reveals a cinematic photo with a film-grain overlay. Content fades in after the terminal sequence completes.

### 2. 3D Card Perspective (`Hero2_3DCardPerspective.jsx`)
A centered hero featuring a large floating 3D card that tilts and rotates with the mouse cursor. The card contains avatar, name, role, and stats — with a dot-grid background and perspective lines converging to the card center.

### 3. Bento Grid (`Hero3_BentoGrid.jsx`)
A modern dashboard-style bento grid layout where hero information is distributed across glass-morphism cards of varying sizes — name, photo, stats, tech stack marquee, CTAs, education, and social links — all in a scannable grid.

### 4. Spotlight Reveal (`Hero4_SpotlightReveal.jsx`)
A dark, mysterious hero with a spotlight that follows the cursor, revealing glowing text underneath a dark overlay. On mobile, the spotlight auto-animates in a smooth loop. Features dramatic text with gradient masks.

### 5. Magnetic Particles (`Hero5_MagneticParticles.jsx`)
An interactive canvas of floating particles magnetically attracted to the cursor. The name uses a "gravity drop" letter animation. Features a rotating conic-gradient ring around the avatar and particle connection lines.

## Usage

To try any hero, import it into `src/app/page.js`:

```jsx
import Hero from "@/../Sample_HERO_PAge/Hero3_BentoGrid";

// Replace the existing <Hero /> with the imported one
```

All heroes are designed as drop-in replacements for the existing `src/components/Hero.jsx`.
