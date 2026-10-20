# 3D / Motion Skills + React Bits + Live Site: Research Digest

Date: 2026-10-20. Sources were cloned into the scratchpad (read-only):
- `freshtechbro/claudedesignskills` @ 1da73feb (2025-11-19) -> `scratchpad/research/cds`
- `DavidHDev/react-bits` @ e12c2219 (2026-10-19), sparse clone -> `scratchpad/research/rb`
- Live HTML/CSS snapshots -> `scratchpad/research/web/{home,projects,birds}.html`, `*.css`

Note: the GitHub API tree endpoint returned an error ("GitHub access to this repository is not enabled for this session"), so I used a shallow git clone through the proxy instead. The plain `http://charanvelavan.com/...` URL could not be fetched from the sandbox (DNS failure on the HTTP-only path). `https://charanvelavan.com` works and redirects with a 308 to `https://www.charanvelavan.com/`.

---

## Part 1: claudedesignskills

### 1.1 Skill inventory (`.claude/skills/`, 23 skills, each also shipped as `.zip`; mirrored under `.factory/skills`, `.factory/droids/*.md` and `plugins/`)

| Skill | What it covers | Relevant to this portfolio? |
|---|---|---|
| react-three-fiber | R3F Canvas, hooks, Drei, perf, pitfalls | YES (core) |
| web3d-integration-patterns | Meta-skill: Three/R3F + GSAP + Motion + Spring architecture | YES (core) |
| gsap-scrolltrigger | Tweens, timelines, ScrollTrigger, pin/scrub, React | YES (core; GSAP already in stack) |
| threejs-webgl | Vanilla Three.js + `references/optimization_checklist.md` (best numbers) | YES |
| motion-framer | Framer Motion / Motion components, gestures, useReducedMotion | YES (already in stack) |
| modern-web-design | 2024-25 trends, a11y, CWV, perf, design tokens, pitfalls | YES |
| animated-component-libraries | Magic UI + React Bits catalogue and perf tips | YES (React Bits) |
| lightweight-3d-effects | Zdog, Vanta.js, Vanilla-Tilt (cheap 3D/tilt) | Maybe (cheap fallbacks) |
| locomotive-scroll | Smooth scroll + ScrollTrigger scrollerProxy | Maybe (NO Lenis skill exists) |
| scroll-reveal-libraries | AOS fade/slide reveals | Low |
| react-spring-physics | React Spring + Popmotion | Low |
| spline-interactive | Spline scenes; has Next.js `ssr:false` note | Low |
| lottie-animations, rive-interactive, animejs, barba-js, pixijs-2d | Other animation runtimes | Low |
| babylonjs-engine, playcanvas-engine, aframe-webxr | Other 3D engines | No |
| blender-web-pipeline, substance-3d-texturing | Asset pipeline (glTF/Draco, texture export presets) | Only if custom models |
| skill-creator | Meta | No |

Gaps: there is no skill for Lenis, typography, a design system, or WebGL accessibility. Typography and tokens appear only inside modern-web-design.

### 1.2 Concrete rules extracted

#### Performance budgets
| Metric | threejs-webgl checklist | web3d-integration droid |
|---|---|---|
| FPS / frame time | Desktop 60fps (16.67ms); mobile 30-60fps | Desktop 16.67ms; mobile 16.67 or 33.33ms |
| Draw calls | Desktop <100; mobile <50 | Desktop <200; mobile <50 |
| Triangles visible | Desktop <1M; mobile <100K | Desktop 1-2M; mobile 100-500K |
| Texture memory | Desktop <500MB; mobile <200MB | Desktop 512MB; mobile 128MB |
| Pixel ratio | Desktop 1-2; mobile 1 | `Math.min(devicePixelRatio, 2)` |
| Texture size | 2048 max; 1024 mobile; 512 bg/UI; power-of-two; KTX2/Basis | - |
| Lights | 3-5 real-time max; 2-3 shadow casters; shadow map 1024 (mobile lower), 2048 in examples | - |
| Particles (mobile) | <1000 | React Bits: 300 if `hardwareConcurrency > 4`, else 150 |
| Instancing threshold | Use InstancedMesh for >50 identical objects | - |

Plain-English version for a portfolio hero: aim for 50 or fewer draw calls, 100K or fewer triangles, 1024px textures, DPR capped at 1.5-2, no real-time shadows on mobile.

#### R3F-specific rules (react-three-fiber/SKILL.md + references)
- `<Canvas dpr={[1, 2]}>` is the default cap. Use `gl={{ powerPreference: 'high-performance' }}` and `performance={{ min: 0.5, max: 1, debounce: 200 }}`.
- `frameloop="demand"` for static or mostly-idle scenes. Trigger renders with `invalidate()`. `setFrameloop()` can switch modes at runtime.
- Adaptive: Drei `<PerformanceMonitor onIncline/onDecline/onFallback flipflops={3} bounds>`, `<AdaptiveDpr pixelated/>`, `<AdaptiveEvents/>`. The example pattern: `const [dpr,setDpr]=useState(1.5)` with onDecline -> 1 and onIncline -> 2.
- `<Preload all/>`, `useGLTF.preload()`, `useLoader.preload()`. Use Draco via `setDecoderPath('/draco/')`.
- Wrap async assets in `<Suspense fallback>`.
- `<Detailed distances>` (LOD). Frustum culling is on by default.
- Use `useFrame` priority for ordering. Mutate refs inside `useFrame` and NEVER call setState there.
- Use `useThree(selector)`, never bare `useThree()` (it re-renders on every state change).
- Physics example uses `@react-three/rapier` (`<Physics gravity>`, `<RigidBody colliders>`, `<CuboidCollider>`).
- GSAP inside R3F: `const ctx = gsap.context(() => {...}); return () => ctx.revert()` (examples/README "Syncing with GSAP ScrollTrigger").
- Anti-patterns listed:
  - setState in useFrame
  - `new THREE.Vector3()` in JSX props (use arrays or useMemo)
  - manual TextureLoader in useEffect (use useLoader for caching)
  - conditional mount/unmount of heavy scenes (prefer the `visible` prop)
  - `useThree` outside Canvas
  - not disposing manually created geometries and materials
  - multiple libraries animating the same property (GSAP and Spring both on `position`)
  - un-killed infinite tweens

#### Mobile fallbacks
- threejs-webgl: DPR 1, no antialias, MeshLambertMaterial, 512-1024 textures, <1000 particles, disable shadows and post-processing, about 50% less geometry, aggressive LOD, pause on `visibilitychange`.
- web3d droid: viewport-based quality (`<768` low, `<1920` medium, else high), for example sphere segments 16/32/64.
- modern-web-design: "Disable expensive effects (parallax, 3D) on low-end devices"; low-end = mobile UA and `hardwareConcurrency < 4`. Test on real devices.
- React Bits ref: conditionally mount WebGL only if not Mobile UA and `hardwareConcurrency > 4`; otherwise render `<div className="gradient-bg"/>`.
- locomotive-scroll: `smartphone: { smooth: false }`.
- gsap common_patterns 13.2: on mobile `gsap.set(el, {opacity:1, y:0})` instead of scroll animations.
- Cursor effects: disable on touch devices.

#### Reduced motion
- modern-web-design: global CSS `@media (prefers-reduced-motion: reduce)` that sets animation/transition duration to 0.01ms and `scroll-behavior: auto`. In JS, check `matchMedia('(prefers-reduced-motion: reduce)')` and skip scroll animations in favour of instant reveals.
- motion-framer: `useReducedMotion()` -> `transition={{duration: 0}}` / `y: reduce ? 0 : 20`. `LazyMotion` + `domAnimation` + `m` reduces bundle size.
- React Bits: BlurText `animateBy="none"` when reduced.
- The gsap-scrolltrigger skill itself has NO reduced-motion guidance. This is a gap.

#### Next.js integration
- web3d droid "SSR & Next.js Strategies":
  1. `dynamic(() => import('../components/ThreeScene'), { ssr: false, loading: () => <div>Loading 3D...</div> })`
  2. An `isClient` flag set in useEffect
  3. Pre-render a static frame on the server, then hydrate
- Fix for "SSR hydration mismatch": render 3D on the client only. Fix for "memory leaks on route changes": dispose everything in cleanup.
- spline-interactive: `@splinetool/react-spline/next` or `dynamic(..., { ssr:false })`.
- Code-splitting: `await import('three')`. Lazy-load 3D below the fold. Show a placeholder, then load low-poly, then high-poly.
- Deployment checklist: error boundaries with graceful fallbacks, WebGL2 fallback, progressive loading, FPS and draw-call monitoring.
- (My note, not in the skill) In App Router, `dynamic(..., {ssr:false})` must be called from a `"use client"` file. `src/app/page.js` already is one.

#### ScrollTrigger patterns (gsap-scrolltrigger SKILL + references/common_patterns.md)
- Always call `gsap.registerPlugin(ScrollTrigger)`.
- Put the ScrollTrigger on the parent timeline, never on child tweens.
- Use `ease: "none"` for scrubbed animations. `scrub: true` locks to the scrollbar; `scrub: 1` adds about 1s of smoothing.
- Pinning:
  - basic: `ScrollTrigger.create({trigger, start:'top top', end:'+=500', pin:true})`
  - pinned timeline with `scrub:1`
  - `endTrigger`
  - stacked cards: per-panel `pin:true, pinSpacing:false`
  - snap: `snap:{snapTo:'labels'|[0,.33,.66,1], duration:{min:.2,max:.5}}`
  - horizontal scroll: `xPercent:-100*(n-1)`, `end:()=>'+='+offsetWidth`, `anticipatePin:1`; per-panel reveals use `containerAnimation`
- Use `ScrollTrigger.batch(".item", {onEnter, start:'top 80%', once:true})` for many reveals.
- `invalidateOnRefresh: true` with function values. `ScrollTrigger.refresh()` after images load or layout shifts. Debounce custom resize (250ms).
- `ScrollTrigger.config({ limitCallbacks:true, syncInterval })`. Animate transform and opacity only. Use `will-change` sparingly (set on start, clear on complete). Use `markers` only in development.
- React: `useGSAP(() => {...}, { scope: containerRef })` from `@gsap/react` (automatic cleanup). The skill also shows `useEffect` + `st.kill()` and `gsap.context` + `ctx.revert()`.
- Responsive: the skill uses `ScrollTrigger.matchMedia({...})`. This API is deprecated. (My note) Use `gsap.matchMedia()` with conditions, for example `mm.add({isDesktop:'(min-width:800px)', reduce:'(prefers-reduced-motion: reduce)'}, ctx => {...})`, which also reverts automatically.
- Three.js + GSAP: tween `camera.position`, `mesh.rotation` and `material.opacity` with `scrub`; call `camera.lookAt` in `onUpdate`. Drei `ScrollControls`/`useScroll().offset` is the R3F-native alternative. Do not mix it with page-level ScrollTrigger, because ScrollControls makes its own scroll container.
- Smooth-scroll integration is only covered for Locomotive (`ScrollTrigger.scrollerProxy`). For Lenis (my note): `lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0)`.
- Pitfalls:
  - two `.to()` tweens on the same property (use fromTo or `immediateRender:false`)
  - one tween for many `.section` elements (loop instead)
  - animating before the DOM is ready
  - not refreshing after layout change
  - scroll-jacking (modern-web-design pitfall 6: "Enhance scroll, don't replace it")

#### Accessibility for canvas / animated UI
- The skills do not cover canvas a11y directly. modern-web-design gives the general rules:
  - visible `:focus-visible` (3px outline, 2px offset)
  - semantic landmarks and heading order
  - `aria-label` on icon buttons
  - `aria-live="polite"` status for loaded content
  - touch targets of at least 44x44px with 8px spacing
  - WCAG AAA contrast (7:1 normal, 4.5:1 large)
  - skip links; Esc closes overlays
- Practice from the React Bits sources (good model): set `aria-hidden="true"` on the WebGL canvas and keep real text (name, title, buttons) in the DOM.
- (My note) Give decorative canvases `aria-hidden` and keep the content they show as DOM text. Interactive canvases need a keyboard alternative or must not hold essential content.

#### Other design notes (modern-web-design)
- CWV targets: LCP <2.5s, INP <200ms, CLS <0.1.
- Progressive enhancement: core content must work without JS.
- Preload fonts and the hero image, and nothing else.
- Use AVIF/WebP via `<picture>`; responsive `srcset`/`sizes`; `loading="lazy"` below the fold.
- Tokens:
  - OKLCH colours
  - fluid `clamp()` spacing scale (2xs-2xl)
  - fluid base font `clamp(1rem, .9rem + .5vw, 1.25rem)`
  - durations 150/250/400ms
  - `--ease-spring: cubic-bezier(.34,1.56,.64,1)`
- Glassmorphism: `rgba(255,255,255,.1)`, `backdrop-filter: blur(10px) saturate(180%)`, `1px rgba(255,255,255,.2)` border, 16px radius.
- "If you can't explain why an animation exists, remove it."

#### Outdated content inside the skills (do not copy blindly)
- `framer-motion-3d` (`motion.mesh`) is deprecated and has no React 19 support.
- `import create from 'zustand'` is the old default import. Zustand v4/v5 uses `import { create }`.
- `ScrollTrigger.matchMedia` is replaced by `gsap.matchMedia`.
- `three/examples/jsm/...` is now `three/addons/...`.
- Several `references/*.md` files named in the SKILL files do not exist: `hooks_guide.md`, `drei_helpers.md`, and web3d `references/`, `scripts/`, `assets/`.

---

## Part 2: React Bits components (current source, react-bits @ 2026-10-19)

reactbits.dev pages are client-rendered SPAs. The static HTML has only the title, description and install command. Details below come from the repo source (`src/tailwind/Components/*`, `public/r/*-JS-TW.json`). Install with `npx shadcn@latest add @react-bits/<Name>-JS-TW` (variants: JS/TS x CSS/TW). All three files start with `'use client'`.

### Lanyard: "Swinging 3D badge on a stretchy woven band that you can drag, throw or click to flip."
- **IMPORTANT: the current version is pure `three` (`three@^0.180.0`) and is the only dependency.** It no longer uses `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier` or `meshline`.
  - The older 2024-25 version used R3F + Drei + Rapier rope joints + meshline + a `card.glb` model + `lanyard.png`.
  - Nothing in the current repo references rapier or meshline. I did not fully verify this, because a full-history search was stopped.
  - The new version has its own Verlet-style simulation: 4 joints, 2 iterations, max step 1/960s, 72 strap samples.
  - The card is generated in code (bevelled rounded rectangle). There is no GLB.
- Props (defaults):
  - `frontImage`, `backImage`, `imageFit='cover'|'contain'`, `cardColor='#ffffff'`
  - `orientation='portrait'|'landscape'`, `finish='glossy'|'matte'|'holographic'|'metallic'`
  - `cornerRadius=0.3`, `size=0.6`, `anchor='left'|'center'|'right'`
  - `strapLength=0.5`, `strapImage`, `strapColor='#111111'`, `strapWidth=0.65`
  - `metal='silver'|'gold'|'graphite'`
  - `gravity=1`, `damping=0.5`, `elasticity=0.5`, `breeze=0.5`
  - `interactive=true`, `intro=true`, `className`, `style`
  - Usage: wrap in a sized container, for example `<div style={{width:'100%',height:600}}>`.
- Rendering:
  - `WebGLRenderer({antialias:true, alpha:true, powerPreference:'high-performance'})`, created in a try/catch (renders nothing if WebGL is unavailable)
  - NeutralToneMapping, PMREM environment
  - 2 directional lights; MeshPhysicalMaterial-style finishes (clearcoat, anisotropy, foil shader)
  - Card faces are painted to 1024px-wide canvases; anisotropy up to 8
- Perf behaviour (good):
  - `setPixelRatio(min(dpr,2))`; ResizeObserver
  - IntersectionObserver pauses the rAF loop when off-screen
  - `visibilitychange` resumes the loop
  - **the loop stops when the card is at rest** (calm >1.2s, no grab, breeze 0), so it acts as an on-demand loop
  - full dispose of geometries, materials, textures, env and renderer on unmount
- A11y / motion:
  - canvas is `aria-hidden="true"`
  - `prefers-reduced-motion` turns breeze to 0 and skips the intro drop
  - pointer drag, plus click (<450ms, <6px movement) to flip; `touchstart` is non-passive only when touching the card
  - there is no keyboard interaction, so it is decorative: do not put essential info only on the badge
- Cost: about 1,300 lines plus all of three.js (roughly 600KB raw, about 150KB gzip). Load it with `next/dynamic({ssr:false})` and only when it is near the viewport.

### Profile Card: "A framed profile card that tilts toward the cursor, with holographic foil shining through a tiled pattern."
- Deps: `@hugeicons/react`, `@hugeicons/core-free-icons` (Mail icon only). There is no WebGL; it is pure DOM/CSS (CSS variables, `mix-blend-mode`, `backdrop-blur-[20px]`, `filter`).
- Props (defaults):
  - `avatarUrl=''`, `iconUrl` (tiled holo pattern), `miniAvatarUrl`
  - `name`, `title`, `handle`, `status='Online'`, `statusColor='#22c55e'`
  - `contactText='Contact'`, `showUserInfo=true`, `onContactClick`
  - `theme='dark'|'light'`, `backdropColor`, `radius=16`
  - `holo=0.8`, `glare=0.5`, `enableTilt=true`, `tiltStrength=12`, `parallax=8`
  - `enableMobileTilt=false`, `mobileTiltSensitivity=5`, `intro=true`, `className`
  - The component is wrapped in `memo`.
- Perf / a11y:
  - a rAF spring engine that only runs while moving
  - reduced motion disables tilt angle, parallax and intro
  - `<img alt={name} loading="lazy" draggable=false>`
  - Contact is a real `<button>` with `aria-label="Contact <name>"` and a `focus-visible` outline
  - mobile gyro tilt needs a tap and, on iOS, `DeviceOrientationEvent.requestPermission()`
- Note: the avatar is `loading="lazy"`. If the card is the hero LCP element, patch it to eager / `fetchpriority="high"`. `backdrop-filter` plus a blend-mode stack is GPU-heavy on low-end Android, so keep only one card on screen.

### Magic Bento: "A bento grid of feature cards with live artwork, edge light that follows the cursor and a click wave."
- Deps: `@hugeicons/react`, `@hugeicons/core-free-icons`. There is no GSAP anymore (older versions used GSAP). It is DOM/CSS, an optional 2D `<canvas>` for stars, and inline `<style>` keyframes.
- Props (defaults):
  - `items=DEFAULT_ITEMS`: `{title, description, visual|ReactNode, image, href, target, rel, onClick, colSpan, rowSpan}`
  - `columns=4`, `rowHeight=200`, `gap=12`, `radius=20`, `theme='dark'|'light'`, `glowColor`
  - `textAutoHide=true`, `enableBorderGlow=true`, `enableSpotlight=true`, `spotlightRadius=300`
  - `enableStars=false`, `particleCount=24` (clamped 0-120)
  - `enableTilt=false`, `enableMagnetism=false`, `clickEffect=true`, `intro=true`, `disableAnimations=false`
  - `onItemClick`, `className`, `style`
  - Built-in visuals: analytics, dashboard, collaboration, automation, integration, security. Replace these with your own nodes.
- Responsive: a ResizeObserver collapses columns from N to 2 to 1 based on MIN_CELL / MIN_PAIR widths. With one column, rows use `minmax(rowHeight, auto)`.
- Perf / a11y:
  - the rAF loop only runs while "busy" and visible (IntersectionObserver); a separate IntersectionObserver gates the intro
  - `prefers-reduced-motion` or `disableAnimations` removes `data-motion`
  - cards render as `<a href>` when `href` is set; otherwise as `role="button" tabIndex=0 aria-label={title}` with Enter/Space handling
  - visuals and canvas are `aria-hidden`; titles are `<h3>`, descriptions `<p>`
  - item `image` alt is `""` (decorative), so put the meaning in title and description
- Fit: it suits a "Core Expertise" or "Projects" grid. Use `useIsomorphicLayoutEffect`, which is SSR-safe.

---

## Part 3: Live site audit (www.charanvelavan.com, Vercel behind Cloudflare, Next.js prerendered: `x-nextjs-prerender: 1`)

### 3.1 Home `/`
- Title: "Charan Velavan — Portfolio". `lang="en"`. Light and dark themes (next-themes ThemeProvider):
  - body `bg-[#f8f7f4] dark:bg-[#0a0a0a] text-gray-900 dark:text-white tracking-tight antialiased`
  - `theme-color` meta for both schemes (#0a0a0a / #f8f7f4)
- Fonts: **Geist + Geist Mono** only (next/font variable fonts, weights 100-900, `font-display:swap`, size-adjusted fallbacks). 2 woff2 files are preloaded. Body uses `var(--font-geist-sans)`; Tailwind's default stack ends in Arial.
- Colours:
  - accent is overwhelmingly purple: `purple-500/600/400`, `#a78bfa`, `#ac4bff`, `#9810fa`
  - secondary blue (`blue-500/400`, `#3080ff`); occasional cyan, fuchsia, emerald
  - light text grays `gray-600/900/500`; borders `border-black/…`, `bg-black/[0.03]`
  - CSS vars `--background:#fff|#0a0a0a`, `--foreground:#171717|#ededed`
  - CSS keyframes: grid-pulse, text-shimmer, border-flow, glow-pulse, marquee-left/right, status-ping, orbit, gradient, constellation-line, scan-line, spin(Slow). They are disabled under reduced motion; there is only 1 `focus-visible` rule in the whole CSS.
- Sections (DOM order, ids):
  1. header/nav and "Mobile navigation" nav
  2. `#hero`: "Open to Opportunities" badge, typewriter "Embedded Developer", h1 "Hello I'm Charan Velavan", tagline, View Projects / Resume / Contact Me CTAs, 4 stat counters, Scroll Down
  3. tech marquee (2 rows, duplicated)
  4. `#about`: "Building Intelligent Systems", Core Expertise (6), Currently Exploring
  5. `#work`: 4 project cards + "View All Projects (7)"
  6. `#achievements`: 3 cards + "View All (6)"
  7. `#internships`: ZOHO, SSN, Techphosis
  8. `#skills`: 8 categories
  9. `#certifications`: Cisco, DADB
  10. `#publications`: ICOEI 2025, Springer J. Optics
  11. `#education`
  12. `#contact`
- Heading outline: one h1, then h2 per section, then h3/h4. It is mostly fine, but "View All Projects" and "View All Achievements" are h3 headings, and h1 text concatenates to "Hello I'mCharan Velavan" (no space in text nodes).
- Issues seen in HTML:
  1. **Canonical, og:image, twitter:image, JSON-LD @id/url, robots.txt Sitemap and sitemap.xml `<loc>` all point to `https://charanvelavan-portfolio.vercel.app`, not www.charanvelavan.com.** The vercel.app host serves 200 (it does not redirect), so the site has duplicate content and Google will index the vercel.app URL. Source: `src/lib/site-config.js` falls back to the vercel.app URL; `NEXT_PUBLIC_SITE_URL` is evidently not set in Vercel.
  2. **Image preload storm.** The page has 15+ `<link rel=preload as=image>` (every project, achievement, logo and badge image), because plain `<img>` tags with no `loading="lazy"` are being hoisted. Examples:
     - `/images/achievements/inventors-challenge-23/win.jpeg` = **12.6 MB, 6016x4016**, served raw on the homepage and preloaded
     - `/images/projects/5g-network-implementation/1.png` = 2.0 MB (1920x1080)
     - `aws-cloud-clubs.png` is 2000x2000 for a small logo
     - most `<img>` tags have no width/height, which causes CLS
  3. Hero portrait is `/test.png` (placeholder name, 479x603 PNG, 245KB) via next/image with `srcset` up to `w=3840` (src w=3840). Logos (SSN, Techphosis) use `sizes="100vw"`, so they get 3840w. `sizes` should match the rendered size.
  4. The SIH '23 Finalist card reuses the NBUC '24 image (`nbuc-24-first-place/1.jpg`).
  5. Stat counters SSR as "0" (Major Projects 0, Achievements 0, …). Crawlers, no-JS users and screen readers before hydration see zeros.
  6. The typewriter word is emitted as per-letter spans (E|m|b|e|d…). Add `aria-label` or sr-only text.
  7. 20 unnamed buttons: the carousel dot indicators have no aria-label.
  8. Email uses Cloudflare email obfuscation, so it shows "[email protected]" without JS.
  9. `keywords` meta is identical on every page (harmless).
  10. 15 script chunks; 199KB main CSS.

### 3.2 `/projects`
- Title "Projects | Charan Velavan", own meta description; og:title and og:description are still the generic home ones; canonical is on vercel.app.
- **The SSR HTML has no project cards at all.** The only heading is h1 "Projects"; the visible text is the intro paragraph plus a logo marquee. The grid is client-rendered, so it is bad for SEO and no-JS users. Crawlers see 0 project titles.
- The logo marquee repeats 8 logos x 6 = 48 `<img>`, and all 8 are preloaded. `nokia.jpg` is a JPEG logo.

### 3.3 `/projects/Birds-AI` (also resolves at lowercase `/projects/birds-ai`, 200, so case-variant duplicates exist)
- Title "Bird's AI – 5G Search & Rescue Drone | Charan Velavan".
  - og:type article; og:image on vercel.app
  - meta description truncated mid-word with "e..." (sliced at 160 chars)
- Heading order: sidebar h3 "Projects" and 7 h4 titles come BEFORE the h1; then h2s with emoji prefixes ("📸Project Gallery", "🎬Project Media", "👤My Role & Contributions", "🏗️System Architecture"); "Associated With" h3 appears twice (mobile and desktop duplicate).
- **Wrong content copied from Nephele** (source: `src/lib/projects.js` Birds-AI entry, lines ~31-110):
  - video caption "Nephele robots interacting with visitors at university open house"
  - image alts "Nephele robot platform with sensors and display" and "Fleet management dashboard"
  - caption "Robot hardware: ROS2-enabled platform with LiDAR…"
  - the whole "My Role" block (Full-Stack Robotics Engineer, ROS2, Bedrock/Claude, fleet dashboard, 3 public events) and its technologies list
  - architecture caption "drone fleet, AWS services"
- **Placeholder links:** `links.demo = "https://example.com/uav-demo"` is rendered as "View Project"; `report: "https://example.com/uav-report"` is also in the data.
- Gallery images are emitted 3x (carousel clones) with alts "… - Image 1/2/3". `detect.png` is 1.1MB.
- The video `/videos/Birdai/Birdsai.mp4` is **100.6 MB**. Other videos: nephele 43MB, Linkein 11MB; `public/sih22/*.mp4` is 59MB. The repo's `public/` holds about 148MB of video and 49MB of images.
- The Nokia logo uses next/image `sizes=100vw`, so it is requested at 3840w.

---

## Part 4: Recommendations for adding 3D (my synthesis)
1. Load any 3D (a Lanyard-style badge or an R3F hero) with `next/dynamic(..., { ssr:false, loading: <static poster img> })` from a client component, mounted only when IntersectionObserver says it is near the viewport. Keep the h1 and CTAs as DOM text.
2. Budget: DPR `[1, 1.5]` (2 at most), `frameloop="demand"` or pause when idle or off-screen, 50 or fewer draw calls, 100K or fewer triangles, 1024px textures (KTX2 if GLB), no real-time shadows, `PerformanceMonitor` + `AdaptiveDpr`.
3. Gate the 3D on `prefers-reduced-motion`, `(pointer: coarse)` / width <768, `navigator.hardwareConcurrency <= 4`, `navigator.connection.saveData`, and a failed WebGL context. Fallback: a static image of the badge or card. ProfileCard (pure CSS) is a cheap alternative to Lanyard on mobile.
4. GSAP: use `useGSAP({scope})` + `gsap.matchMedia()` with a `reduce` condition. Use one ScrollTrigger timeline per pinned section, `ease:'none'` + `scrub`, call `ScrollTrigger.refresh()` after images load, and do not scroll-jack. Do not combine Drei ScrollControls with page ScrollTrigger.
5. Make the canvas `aria-hidden`; keep interactions decorative; leave focus-visible styles in place (currently only 1 rule site-wide).
6. Fix the non-3D issues first, because they hurt LCP far more than any 3D would:
   - the 12.6MB image
   - the preload storm
   - the `/test.png` hero and `sizes`
   - canonical/SITE_URL
   - the client-only projects grid
   - the Birds-AI copy-paste content and example.com links
