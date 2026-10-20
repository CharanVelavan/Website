# Apple design guidance for a web portfolio + typography pairings (Charan Velavan)

Research digest, 2026-10-20. Read-only research; nothing in the repo was changed.

Confidence tags used throughout:
- **[HIG]**: quoted or paraphrased from Apple HIG JSON fetched today (`developer.apple.com/tutorials/data/design/human-interface-guidelines/<page>.json`, change logs as recent as Dec 2025 and Sep 2026).
- **[apple.com]**: measured from the live CSS of `apple.com/macbook-pro/` (`/v/macbook-pro/ax/built/styles/overview.built.css`, 1.1 MB) and `globalheader.css`.
- **[GF]**: from the Google Fonts metadata API (`fonts.google.com/metadata/fonts`), plus woff2 files downloaded from the css2 API and inspected with fontTools.
- **[next]**: checked against `next@16.1.6` `font-data.json`, which is the version in this repo's package.json.
- **[FFL]**: the ITF Free Font License v2.0 text (17 Aug 2026), read from inside the Fontshare download kits.
- **[skill]**: third-party agent skills. These are interpretations, not Apple sources.
- **[knowledge]**: my own background knowledge, not re-verified today. Treat it as likely, not certain.

Raw sources saved alongside this file:
- `research/dl/*.txt`: HIG page extracts for typography, color, dark-mode, motion, accessibility, layout, materials, buttons, branding, scroll-views, designing-for-ios.
- `research/applecom/`: apple.com HTML and CSS.
- `research/skills/`: SKILL.md files.
- `research/gf/meta.json`: Google Fonts metadata.
- `research/fs/`: Fontshare kits and license.

---

# PART A: Apple design guidance, translated for the web

## A1. Top-level principles

- **Current HIG (2025+, Liquid Glass era): Hierarchy, Harmony, Consistency.** [skill: Ksanbal quotes the HIG entry page; createwithswift.com and others agree]
  - **Hierarchy**: controls and interface elements "elevate and distinguish" the content beneath them. Split every screen into a content layer and a control layer.
  - **Harmony**: align the UI with hardware and software. Use concentric shapes, where corner radii derive from the parent's radius minus its padding.
  - **Consistency**: use platform conventions so the design adapts across sizes and devices.
- **Legacy HIG (iOS 7 to iOS 18): Clarity, Deference, Depth.** These are still the most useful shorthand for a portfolio.
  - **Clarity**: legible text at every size, precise icons, and adornment kept subtle.
  - **Deference**: the UI never competes with the content.
  - **Depth**: layering and motion convey hierarchy.
- **Branding rules apply directly to a personal site.** [HIG branding]
  - "Ensure branding always defers to content."
  - "Apply your app's accent color judiciously … use it intentionally for primary actions or status indicators."
  - "Consider using a custom font … for headlines and subheadings while using system fonts for body copy and captions, because the system fonts are designed for optimal legibility at small sizes."
  - "Resist the temptation to display your logo throughout."
- **Layout.** [HIG layout]
  - Order content by importance, top to bottom and leading to trailing.
  - Align elements to make them scannable, and use indentation to show hierarchy.
  - Group related items with negative space, containers or separators.
  - Use progressive disclosure.
  - "Differentiate controls from content."

## A2. Typography

### A2.1 Hard numbers [HIG typography / accessibility]

| Platform | Default size | Minimum size |
|---|---|---|
| iOS / iPadOS | 17 pt | 11 pt |
| macOS | 13 pt | 10 pt |
| visionOS | 17 pt | 12 pt |
| watchOS | 16 pt | 12 pt |
| tvOS | 29 pt | 23 pt |

- On the web, 1 pt in these tables corresponds to 1 CSS px. **Body at 17px is the Apple reference** (apple.com body is 17px/1.47).
- **Never set text below 11–12px.** Captions and legal text should sit at 12px or larger.
- **Avoid light weights.** "Prefer Regular, Medium, Semibold, or Bold … avoid Ultralight, Thin, and Light." If you do use a thin custom weight, go larger than the minimums.
- **"Minimize the number of typefaces you use."** Mixing many typefaces obscures hierarchy.
- **Leading:**
  - Use loose leading for wide columns and long passages.
  - Use tight leading only where height is constrained.
  - "If you need to display three or more lines of text, avoid tight leading even in areas where height is limited."
- **Text resizing:**
  - Support enlarging text to at least 200%. On the web this means rem/em units and layouts that reflow.
  - Keep truncation to a minimum.
  - Stack layouts and reduce the column count at large text sizes.

**iOS "Large (default)" Dynamic Type scale** (size/leading in pt, emphasized weight in brackets). This is a good skeleton for a web type scale:

| Style | Weight | Size | Leading | Line-height ratio |
|---|---|---|---|---|
| Large Title | Regular [Bold] | 34 | 41 | 1.21 |
| Title 1 | Regular [Bold] | 28 | 34 | 1.21 |
| Title 2 | Regular [Bold] | 22 | 28 | 1.27 |
| Title 3 | Regular [Semibold] | 20 | 25 | 1.25 |
| Headline | Semibold | 17 | 22 | 1.29 |
| Body | Regular | 17 | 22 | 1.29 |
| Callout | Regular | 16 | 21 | 1.31 |
| Subhead | Regular | 15 | 20 | 1.33 |
| Footnote | Regular | 13 | 18 | 1.38 |
| Caption 1 | Regular | 12 | 16 | 1.33 |
| Caption 2 | Regular | 11 | 13 | 1.18 |

- **macOS scale:** Large Title 26/32, Title1 22/26, Title2 17/22, Title3 15/20, Headline 13/16 Bold, Body 13/16, Caption 10/13.
- **visionOS** adds Extra Large Title 1/2 "for wide, editorial-style layouts".
- These are app UI leadings. For web long-form, apple.com itself uses about 1.47 on 17px body (see A2.3).

### A2.2 Tracking by size and SF optical sizes [HIG]

SF and New York ship as variable fonts with dynamic optical sizing. Text and Display designs merge into one continuous design that interpolates by point size, and the system adjusts tracking at every size.

SF Pro tracking, iOS/macOS (1/1000 em, which is ×0.001 em in CSS):

| px | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 20 | 22 | 24 | 28 | 32 | 40 | 48 | 64 | 80+ |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| em | +.012 | +.006 | 0 | −.006 | −.011 | −.016 | −.020 | −.026 | −.025 | −.023 | −.012 | +.003 | +.014 | +.013 | +.010 | +.008 | +.004 | 0 |

- **Small text is tracked open and 13–20px is tightened.** That is the SF Text cut.
- **Tracking jumps positive above about 23px.** This is the switch to the SF Display cut, which already has tight spacing built in. It is font-specific, so **do not copy SF numbers onto another font.**
- **New York (serif) tightens steadily with size:** +0.016 at 10, 0 at 15, −0.010 at 20, −0.014 at 40, −0.016 at 72–160, −0.018 at 220+. This is a good model for any serif display.
- **Generic web rule:**
  - Labels and small caps (11–12px): +0.01 to +0.06em.
  - Body (15–18px): 0 to −0.015em.
  - Headings (24–48px): −0.01 to −0.02em.
  - Display (64px+) in a grotesk without an opsz axis: −0.02 to −0.04em.
  - If a font has an `opsz` axis, use `font-optical-sizing: auto` (Inter, Newsreader, Fraunces, Big Shoulders, Bricolage) and track less.
- **Inter's own dynamic-metrics formula** (rsms, Inter v3 site): `tracking_em = −0.0223 + 0.185·e^(−0.1745·px)`.
  - Results: 12px → 0, 14 → −0.006, 16 → −0.011, 17 → −0.013, 20 → −0.017, 24 → −0.020, 32 → −0.022, 48+ → −0.022.

### A2.3 What apple.com actually ships [apple.com CSS, measured]

- **Two fonts with the size split at 19–20px:**
  - SF Pro Text for 17px and below (body, buttons, badges).
  - SF Pro Display for 19px and above.
  - Fallback stack: `SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif`.
- **Weights in use are 400 and 600 only.** All headlines are 600 (semibold), never 700+, which keeps big type calm.
- **Body:** `17px / 1.4706 / 400 / −0.022em`.
  - Reduced body: `14px / 1.4286 / −0.016em`.
  - Small: `12px / 1.333 / −0.01em`.
  - Tiny: `10px / −0.006em`.
- **Headline classes** (desktop / ≤1068px tablet / ≤734px mobile):

| Class | Desktop | Tablet | Mobile |
|---|---|---|---|
| `typography-headline-super` | 80px / 1.05 / 600 / −0.015em | 64 / 1.0625 / −0.009em | 48 / 1.083 / −0.003em |
| `typography-headline-elevated` | 64 | 48 | 40 / 1.1 / 0em |
| `typography-headline` | 48 | 40 | 32 / 1.125 / +0.004em |
| `typography-headline-reduced` | 40 | 32 | 28 / 1.143 / +0.007em |
| `typography-eyebrow-super` | 32 | 28 | 24, 600, +0.004 to +0.009em |
| `typography-intro` | 21px / 1.381 / 400 / +0.011em | | 19px / 1.42 / +0.012em |

- **Stat blocks:** big value at 80/64/48px, line-height 1, 600 weight, small caption at 17px.
- **What this means for the portfolio:**
  - Headline line-height falls to about 1.05 at 80px and about 1.1–1.14 at 28–40px.
  - Body line-height is about 1.47.
  - Tracking moves from slightly negative at display sizes to slightly positive for 19–32px Display text. That is SF-specific; for other fonts, keep display slightly negative.
  - Size steps are 80/64/56/48/40/32/28/24/21/19/17/14/12, roughly a 1.2–1.25 ratio.

## A3. Color [HIG color, dark-mode, accessibility]

- **Contrast minimums.** The HIG adopts WCAG AA:

| Text size | Weight | Minimum contrast |
|---|---|---|
| Up to 17pt | All | 4.5:1 |
| 18pt and up | All | 3:1 |
| Any size | Bold | 3:1 |

  - Dark Mode page: "no lower than 4.5:1 … For custom foreground and background colors, strive for a contrast ratio of **7:1, especially in small text**."
  - The HIG also names APCA as an acceptable measure.
- **Semantic, not literal.** Define colors by role, such as label, secondaryLabel, tertiaryLabel, quaternaryLabel, separator, link and the background levels.
  - "Avoid redefining the semantic meanings" (for example, a separator color must not be reused as a text color).
  - Supply light, dark and increased-contrast variants. On the web: CSS custom properties plus `prefers-color-scheme` and `prefers-contrast: more`.
- **Don't rely on color alone.** Pair it with shape, icon or text. Watch red/green and blue/orange pairs.
- **One accent, used sparingly.**
  - Keep prominent buttons to "one or two per view".
  - "Avoid using the same color to mean different things."
  - If the content is colorful (photos, renders), keep the controls monochrome.
- **iOS system colors 2025 ("unified"), light / dark [HIG image alt text]:**

| Color | Light | Dark |
|---|---|---|
| Blue | 0,136,255 | 0,145,255 |
| Indigo | 97,85,245 | 109,124,255 |
| Purple | 203,48,224 | 219,52,242 |
| Teal | 0,195,208 | 0,210,224 |
| Cyan | 0,192,232 | 60,211,254 |
| Green | 52,199,89 | 48,209,88 |
| Orange | 255,141,40 | 255,146,48 |
| Red | 255,56,60 | 255,66,69 |

  - Accessible (increased-contrast) dark variants: Blue 92,184,255; Purple 234,141,255; Cyan 109,217,255.
- **iOS gray ramp, dark:**

| Gray | Value |
|---|---|
| systemGray | 142,142,147 |
| Gray2 | 99,99,102 |
| Gray3 | 72,72,74 |
| Gray4 | 58,58,60 (#3A3A3C) |
| Gray5 | 44,44,46 (#2C2C2E) |
| Gray6 | 28,28,30 (#1C1C1E) |

- **UIKit dark semantic values [knowledge, consistent with the gray ramp above]:**

| Role | Base | Elevated |
|---|---|---|
| systemBackground | #000000 | #1C1C1E |
| secondarySystemBackground | #1C1C1E | #2C2C2E |
| tertiarySystemBackground | #2C2C2E | #3A3A3C |

  - Labels: label #FFF, secondaryLabel rgba(235,235,245,.60), tertiaryLabel rgba(235,235,245,.30), quaternaryLabel rgba(235,235,245,.16–.18).
  - Separator: rgba(84,84,88,.65).

## A4. Dark mode [HIG dark-mode]

- **Base vs elevated.** "Two sets of background colors — called base and elevated — to enhance the perception of depth when one dark interface is layered above another."
  - Base colors are dimmer and make background interfaces recede.
  - Elevated colors are brighter and make foreground interfaces (popovers, sheets, modals) appear to advance.
  - **The base can be true black. Elevated surfaces are never pure black.** They are lighter greys (#1C1C1E, #2C2C2E). Depth in dark mode comes from lighter surfaces, not shadows.
- **"These colors aren't necessarily inversions of their light counterparts."**
- **"Soften the color of white backgrounds."** Slightly darken images that have white backgrounds so they don't glow. This matters for PCB and CAD screenshots and white-background product photos.
- **Test with Increase Contrast and Reduce Transparency, separately and together.** On the web: `prefers-contrast: more` and `prefers-reduced-transparency: reduce`.
- **Don't add a site-specific theme toggle that ignores the system.** "Avoid offering an app-specific appearance setting."
  - Exception: "it can make sense for an app that supports immersive media viewing to use a permanently dark appearance."
  - A dark-only portfolio is defensible on those grounds, but then contrast must be excellent.
- **apple.com dark theme tokens** (`.theme-dark`, measured):

| Token | Value |
|---|---|
| body background | rgb(0,0,0) |
| fill-secondary | rgb(22,22,23) #161617 |
| fill-tertiary | rgb(29,29,31) #1D1D1F |
| alt dark section background | rgb(29,29,31) |
| body/headline text | rgb(245,245,247) #F5F5F7, not pure white |
| secondary text | rgb(134,134,139) #86868B, or rgba(255,255,255,.56) |
| secondary-alt | rgb(210,210,215) |
| tertiary | rgb(110,110,115) |
| link | rgb(41,151,255) #2997FF |
| primary button | rgb(0,113,227) #0071E3 (hover #0076DF, active #006EDB) |
| focus ring | 2px solid #0071E3, offset 1–3px |
| neutral badge | bg rgba(245,245,247,.14), text rgb(210,210,215) |
| fills | gray-tertiary rgb(66,66,69), quaternary rgb(51,51,54) |

  - Light theme: text #1D1D1F, secondary #6E6E73 or #86868B, alt background #F5F5F7, links #0066CC.
  - **Lesson:** Apple uses #000 as the base, a #161617/#1D1D1F elevated tier, and #F5F5F7 for text. That is a tiny, restrained neutral ramp plus one blue.
  - The current prototype uses #0a0a0a. Anthropic's frontend-design skill lists "tinted near-black (#0B0B0B, #111) standing in for black" as an AI-generated tell. Prefer either true #000 base with #161617/#1D1D1F elevated (Apple), or a deliberately hued dark.

## A5. Materials and vibrancy [HIG materials]

- **Liquid Glass is for the control and navigation layer only.** "Don't use Liquid Glass in the content layer." Use it sparingly and limit it "to the most important functional elements."
  - On the web, that means the navbar, a floating button and the mobile menu. It does not mean cards.
- **Variants:**
  - Regular blurs the backdrop and adjusts its luminosity. Use it where there is text.
  - Clear is highly translucent. Use it only over rich media. Over bright media, "consider adding a dark dimming layer of 35% opacity."
- **Standard materials** (ultra-thin, thin, regular, thick):
  - Thicker is more opaque and better for fine text.
  - Thinner keeps more context.
  - Use "vibrant" label colors on top of them, and don't use quaternary text on thin materials.
- **apple.com nav implementation [measured]:**
  - Dark: `background: rgba(22,22,23,.8); backdrop-filter: saturate(180%) blur(20px)`.
  - Light: `rgba(250,250,252,.8)`.
  - Wrapped in `@supports (backdrop-filter: initial)` with an opaque fallback.
  - The current prototype's glass recipe (`backdrop-blur-sm bg-white/5 border-white/10`) applied to content cards is the opposite of Apple's rule. Reserve blur for navigation.
- **Scroll edge effect.** [HIG scroll-views] Apple uses a blur or fade under floating bars instead of a solid bar background, only when content scrolls behind floating UI, and one per view.
- **Performance [skill, sensible]:** never animate large `blur()` or `backdrop-filter` surfaces.

## A6. Buttons, touch targets, spacing [HIG buttons / accessibility]

- **Hit region of at least 44×44 pt.** The minimum on iOS is 28×28; macOS default/minimum is 28/20; visionOS uses 60×60. On the web, give every interactive element 44×44 CSS px or larger, padding included.
- **Spacing between controls:** about 12pt of padding around bezeled elements and about 24pt around borderless ones.
- **Always include a press state.** On the web: `:active`, `:focus-visible` and hover (gated behind `@media (hover:hover)`, as apple.com does).
- **Use style, not size, to mark the preferred option.** Keep prominent buttons to one or two per view.
- **Labels:** start with a verb and keep them short. Use familiar icons for familiar actions.
- **Don't give a destructive action the primary role.** Show an activity indicator inside the button for slow actions.
- **apple.com button:**
  - Pill radius 980px.
  - 14px text, padding 9px × 16px (content-box), min-width basis 60px, 1px border.
  - Large variant: 17px text.
  - Other radii in use: 5/6/10/12/28/56px and 999px pills. Tiles and cards sit at 28px or more.

## A7. Motion [HIG motion / accessibility]

- **"Add motion purposefully … Don't add motion for the sake of adding motion."** Gratuitous animation can make people "feel disconnected or physically uncomfortable."
- **"Make motion optional."** Never use motion as the only carrier of information.
- **"Aim for brevity and precision in feedback animations."**
- **"Generally avoid adding motion to UI interactions that occur frequently."**
- **"Let people cancel motion … don't make people wait for an animation to complete."** Interruptible means animating from current values, with no input blocked while a timeline runs. With GSAP, use `overwrite: 'auto'` and never lock scroll during intros.
- **Feedback should follow the gesture.** Something that slides down to reveal should dismiss by sliding up or down.
- **When Reduce Motion is on, reduce automatic and repetitive animation** (zooming, scaling, peripheral motion):
  - Tighten springs.
  - Track animations directly to gestures.
  - Avoid z-axis depth animation.
  - Replace x/y/z transitions with fades.
  - Avoid animating into or out of blurs.
  - On the web: `@media (prefers-reduced-motion: reduce)`, plus `useReducedMotion()` in Framer Motion and `gsap.matchMedia()`.
- **Avoid sustained oscillation near 0.2 Hz** (visionOS rule, but a good general rule). No autoplaying audio or video without controls. Respect flashing-light sensitivity.
- **apple.com timings [measured]:**
  - Opacity fades: 200–400ms (`opacity 400ms ease-in-out`, `opacity .2s ease-out`).
  - Transforms: about 200–500ms.
  - Signature curve: `cubic-bezier(0.66, 0, 0.1, 1)`, a strong ease-out.
  - The few springy curves (`cubic-bezier(0.3,2,0.5,1)`) are used only on small elements.
  - `prefers-reduced-motion` blocks set `animation: none` with a static end state.
- **Default durations [skill]:** button feedback 150–200ms, modal 300–350ms, avoid more than 500ms on frequent paths.
- **Anthropic frontend-design skill:** "fade-and-slide-up entrances on each section and hover transitions on every card are the generic default and read as AI-generated. A single orchestrated moment … lands better."

## A8. How apple.com product pages tell a story on scroll [apple.com HTML/CSS measured + knowledge]

- **Sections.** Each page is a vertical stack of `section`s with names like section-welcome, highlights, performance, display, camera, battery, macos, environment and values.
  - Sections alternate `theme-dark` and `background-alt` (#000 vs #1D1D1F/#F5F5F7). The background shift, not dividers, marks chapter breaks.
  - Section padding is generous: `--global-section-padding` 144px desktop, 120px at ≤1068px, 112px at ≤734px. Some variants go to 160–216px.
- **Sticky "pinned stage" chapters.**
  - `.sticky-content { position: sticky; top: var(--r-localnav-height); height: calc(100vh - var(--r-localnav-height)) }` sits inside a container several viewports tall (e.g. `+200vh`).
  - The stage pins while scroll progress scrubs content: chip renders, frame sequences, text crossfades. It unpins when the chapter ends.
  - Only about 2–3 such chapters run per page. The rest is static and calm.
  - The local sub-nav ("localnav") is sticky under the global nav.
- **Big type, few words.**
  - A chapter opens with an eyebrow at 21–32px/600, a headline-super at 80px/600/1.05 with 2–6 words, and an intro paragraph at 21px/1.38 in secondary grey with key phrases in primary white.
  - Then come **stat blocks**: huge numeral at 80/64/48px with line-height 1, plus a 17px caption. For an engineering portfolio these map well onto metrics like range, latency or payload.
- **Restrained color.**
  - Neutrals plus one blue (#0071E3/#2997FF) for links and buttons. The product's own color appears only in imagery or a gradient headline.
  - About 10 distinct colors in the whole CSS. Accent text gradients are rare and reserved for the hero.
- **Media.**
  - Full-bleed media.
  - Horizontal "media-card-set" galleries use `scroll-snap-type: x mandatory`, hidden scrollbars, paddle nav buttons and staggered translate-y.
  - Content width: `width: 87.5%; max-width: var(--global-content-max-width)` (980px historically; 1260px on this page's gallery), with `env(safe-area-inset-*)` respected.
  - Breakpoints are 734 / 1068 / 1440px.
- **Progressive disclosure.** "Learn more" opens modals or overlays (`modal-close-button` is sticky) instead of long inline text. A "Compare" or index section closes the page.
- **Accessibility.**
  - Scroll effects are enhancements gated by a JS class (`html.chip-hero-enhanced`), so the static fallback is content-complete.
  - `prefers-reduced-motion` is honored.
  - Focus rings are visible (2px #0071E3).

## A9. Third-party Apple-design agent skills reviewed

| Skill | What it is | Verdict |
|---|---|---|
| `ebuntario/apple-hig` (SKILL.md plus 68 refs, "Last verified 2026-04-20") | Native-platform HIG rules: 44pt targets, Dynamic Type, semantic colors, no hex literals, Reduce Motion, SF Symbols first, sentence case | Best quality. Its typography, dark-mode and motion refs match the HIG. It is native-app oriented, but has a "web mockup, Apple-native feel" path (typography + color + layout + sf-symbols) |
| `raintree-technology/apple-hig-skills` ("HIG Doctor", 14 skills, 431 audit rules incl. 122 React/Next.js and 25 CSS rules; `npx hig-doctor .`) | Principles: content over chrome, accessibility first, semantic colors, purposeful motion with crossfade fallback | Good. The CLI could audit this Next.js repo with HIG-aligned web rules |
| `Ksanbal/apple-hig-codex-skill` | Korean-authored compact guide. Cites the current HIG principles Hierarchy / Harmony / Consistency; heuristics are content first, native before novel, progressive disclosure, forgiveness | Useful summary |
| `heyman333/atelier-ui` apple-ui-designer | Philosophy: "native over custom, subtle over expressive … prefer removal over addition"; avoid heavy gradients and neon, harsh borders, dense layouts | Taste guidance, iOS-focused |
| `ihlamury/design-skills` apple-ui-skills | Auto-"extracted" from apple.com | **Unreliable.** Claims apple.com uses Inter, `text-primary #808080` and `surface-raised #0858DC`, which contradicts the measured CSS (SF Pro, #1D1D1F/#F5F5F7). Its generic web rules are fine: animate only transform/opacity, ≤200ms feedback, `h-dvh`, never remove focus, `tabular-nums`, `text-balance` |
| Zenn article "apple_design_skills" (JP) | How-to for building an apple-design skill to avoid "AI-looking" UI | Background only |

## A10. Concrete checklist for the portfolio

1. **Type scale (px), desktop → mobile:**
   - Hero 80→48, weight 600, line-height 1.05, tracking −0.015em.
   - Chapter H2 56–64→40.
   - H3 28–32→24.
   - Intro 21→19, line-height 1.38.
   - Body 17, line-height 1.47.
   - Small 14.
   - Caption 12, never below 11.
   - Use two weights (400/600), three at most.
2. **Color tokens:**
   - Base #000 (or a deliberately hued dark).
   - Elevated #161617 and #1D1D1F.
   - Text #F5F5F7.
   - Secondary #86868B or a ≈60% alpha; make sure secondary text on #000 is at least 4.5:1, ideally 7:1 for small text.
   - Separator about rgba(255,255,255,.12–.16).
   - One accent.
   - Increased-contrast variants under `prefers-contrast: more`.
3. **Blur only on the navbar and mobile menu:** `rgba(22,22,23,.8) + saturate(180%) blur(20px)`, gated by `@supports`. Content cards get flat elevated fills, not glass.
4. **Hit areas:** 44×44px or larger, about 12px between bezeled controls, visible `:focus-visible` (2px accent, 2–3px offset), press states, hover gated behind `(hover:hover)`.
5. **Motion:**
   - One or two pinned, scroll-scrubbed chapters (e.g. a drone or robot hero sequence, an RF/5G system diagram assembling).
   - Everything else static or simple fades of 200–400ms with `cubic-bezier(.66,0,.1,1)`.
   - Every animation interruptible, with a full `prefers-reduced-motion` path: no pinning, fades only, final states shown.
6. **Stat blocks for metrics** (e.g. "120 km range", "<10 ms latency"): numeral 64–80px, weight 600, line-height 1, `font-variant-numeric: tabular-nums`, 17px caption.
7. **Image care:** darken white-background images (`filter: brightness(.9)` or a pre-processed variant) and keep them full-bleed with snap galleries.
8. **Single theme is OK if deliberate** (HIG allows permanently dark for media-focused experiences). Don't add a theme toggle that ignores the OS setting.

---

# PART B: Typography for an engineering/robotics portfolio

## B0. Context and constraints

- **Current setup.** The prototype uses Archivo Narrow 700 for display, Geist for body and Geist Mono for labels. `src/app/layout.js` already imports `Geist, Geist_Mono` from `next/font/google`.
- **The subject** is robotics, drones, 5G and RF. The type should feel precise, engineered and confident, not "startup SaaS".
- **Archivo Narrow** on GF is static-ish (wght 400–700, about 11.8KB per weight, latin). Its parent, **Archivo**, is variable with **wdth 62–125** and wght 100–900 (90KB latin for the full variable file). One file covers condensed display and normal body, which is a strict upgrade if you keep the industrial direction.
- **Google Fonts strips extras.** Google Fonts and next/font/google serve files without stylistic sets or character variants. Geist from GF has only `tnum` and `frac`. The npm `geist@1.8.1` package's `Geist-Variable.woff2` (69KB) keeps `ss01–ss11`, `case`, `tnum` and `dlig`. If you want Inter's `cv11` single-storey a, `ss01` open digits or slashed zero, self-host from rsms.me or the npm `geist` package with `next/font/local`.
- **Tamil and Indic coverage.** None of the mainstream Latin picks (Inter, Geist, Plex, Satoshi and so on) include Tamil.
  - **IBM Plex Sans Tamil does not exist.** Plex covers Devanagari, Arabic, Hebrew, Thai, CJK and Cyrillic.
  - Families with Tamil on GF: Noto Sans Tamil, Noto Serif Tamil, Anek Tamil, Catamaran, Mukta Malar, Hind Madurai, Baloo Thambi 2, Arima, Tiro Tamil, Pavanam, Meera Inimai. Google Sans (GF 2025-12, pop #4) also has Tamil but is Google's brand face; avoid it.
  - Tamil subset woff2 sizes: Noto Sans Tamil VF 82KB, Anek Tamil VF 198KB, Catamaran VF 42KB, Mukta Malar 400 17KB, Hind Madurai 400 13KB.
  - Load the Tamil face with `preload: false`. Via `unicode-range` it is fetched only if Tamil glyphs render (e.g. the name "சரண் வேலவன்" in the footer or hero).
- **Fontshare licensing (ITF Free Font License v2.0, 17 Aug 2026) [FFL]** covers Satoshi, General Sans, Switzer, Cabinet Grotesk and Clash Grotesk.
  - Allowed: free personal and commercial use. "You may self-host the Font Software on your own servers … including through standard webfont technologies such as CSS @font-face." `next/font/local` is therefore fine.
  - Not allowed: modifying, **subsetting or format conversion**, and distribution "through another … repository … publicly accessible servers."
  - ⚠ This repo (`github.com/CharanVelavan/Website`) is on GitHub. If it is public, committing Fontshare woff2 files to it is arguably redistribution via a public repository. Options:
    - keep the repo private;
    - load via the Fontshare API CSS (`api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap`);
    - fetch the files at build time from outside the repo.
  - Google Fonts (OFL) has none of these problems.

## B1. Overused / "AI-default" fonts (flag list)

| Font | Why it reads as a default |
|---|---|
| **Inter** | GF popularity rank #5. The most-used UI face on the web. Anthropic's frontend-design skill (earlier versions) explicitly lists "Inter, Roboto, Arial, system fonts" as overused. Fine as a neutral SF surrogate, but zero distinctiveness |
| **Geist / Geist Mono** | The **Next.js `create-next-app` default** and Vercel's brand face. On a Next.js site it signals "didn't change the template". The prototype already uses it |
| **Space Grotesk** (#56) | The mirrored Anthropic skill text cites it as the example of convergence: "NEVER converge on common choices (Space Grotesk, for example)". Also a 2021–22 Web3 cliché |
| **Poppins** (#8), **Montserrat** (#7), **Roboto**, **Open Sans**, **Lato** | Generic defaults |
| **DM Sans** (#21), **Manrope** (#30), **Plus Jakarta Sans** (#35), **Outfit** (#33), **Figtree** (#40) | 2022–25 SaaS-template staples |
| **Playfair Display**, **DM Serif Display**, **Instrument Serif** | The "serif-italic accent word in the headline" trend of AI-startup branding (2024–25 Substack commentary). Anthropic's skill lists "Accenting just a single word … in italic" and "warm cream + high-contrast serif + terracotta" as generated-page tells |
| **Satoshi**, **General Sans**, **Clash Display / Grotesk**, **Cabinet Grotesk** | Fontshare darlings, ubiquitous on Framer/Webflow templates and Awwwards portfolios [knowledge] |
| **JetBrains Mono / Geist Mono / Space Mono for tiny uppercase labels** | Anthropic's skill: "a monospace face for small data labels", "a tracked-out ALL-CAPS eyebrow label above every heading" and "'→' appended to link text" are template tells. Using mono is fine when the content really is data (coordinates, part numbers, frequencies, code), not as decoration |
| **Condensed uppercase "industrial" display + mono labels + near-black #0a0a0a** | This combination (the current prototype) is itself close to a recognizable generated "engineering portfolio" look. Distinctiveness has to come from the treatment and the content |

**Less-overused alternatives** with GF popularity rank in brackets (higher number means rarer): Archivo variable widths (#45, but the wide and condensed axes are rarely used), Newsreader (#117), Schibsted Grotesk (#104), Fragment Mono (#611), Martian Mono (#690), Mona Sans (#427), Hubot Sans (#1331), Big Shoulders (#512), Anek Latin (#528), Atkinson Hyperlegible Next (#399) and Mono (#1046), Host Grotesk (#403), Hanken Grotesk (#143).

## B2. Six pairings

File sizes are measured latin-subset woff2 from the GF css2 API, which is what next/font/google self-hosts. "VF" means variable font. All families are confirmed present in `next@16.1.6` font-data. Remember `axes: ['wdth']` or `['opsz']` in the next/font call to get non-weight axes.

### 1. Apple-like neutral grotesk: **Inter (opsz) display + Inter body + JetBrains Mono** (or system-ui SF on Apple devices)

- **Feel:** closest free analogue to SF Pro. Neutral, engineered, invisible; content-first, exactly "deference".
- **Why it fits:** Inter 4 on GF has an **opsz 14–32 axis**, a Text cut and a Display cut in one file. Like SF it adapts optically with `font-optical-sizing: auto`. One family doing everything matches Apple's "minimize typefaces".
- **Even more Apple:** use the system stack first, `font-family: system-ui, -apple-system, BlinkMacSystemFont, var(--font-inter), sans-serif`. This gives real SF Pro with dynamic optical sizes on Apple devices at 0 bytes, and Inter elsewhere. SF can't be web-served (Apple's license is for mockups and Apple platforms), but referencing the local system font is fine.
- **Weights:** VF wght 100–900. Use 400, 500, 600 only (Apple uses 400/600).
- **Sizes and tracking:**
  - Display 64–80px, weight 600, line-height 1.05, tracking about −0.022em (Inter formula), or let opsz=32 handle it and use −0.015em.
  - Body 17px/1.47/400, tracking −0.013em.
  - Captions 12px, tracking 0.
  - Mono labels 12–13px, +0.02em.
- **Variable:** yes (opsz, wght). Italic is a separate file.
- **File size:** Inter opsz+wght VF 73KB latin; JetBrains Mono VF 40KB. For Inter's `cv`/`ss` features, self-host the full rsms build.
- **Tamil:** none. Pair with **Noto Sans Tamil** VF (82KB tamil subset, wdth 62.5–100, wght 100–900); its neutral humanist-grotesk design matches Inter.
- **Who uses it:** Inter is "applications ranging from computer interfaces … to NASA instrumentation" (rsms). Linear, GitLab (GitLab Sans is Inter-based) and countless SaaS [knowledge]. JetBrains Mono is the JetBrains IDE default.
- **⚠ Flag:** Inter is the #1 "AI default". It gives Apple-ness, not distinctiveness. Make the type treatment (scale, weight contrast, layout) carry the identity.
- **Variant:** keep **Geist** (29KB VF) as the neutral grotesk, but load it from the `geist` npm package (69KB, full `ss01–ss11`) via `next/font/local`. Geist is also an AI and Next default.

### 2. Technical / engineering: **IBM Plex Sans (wdth 75–100) display + IBM Plex Sans body + IBM Plex Mono**

- **Feel:** engineered, mechanical, rational, with an "instrument panel" tone. It is a corporate-industrial superfamily from a hardware and research company. It suits RF, 5G and robotics without sci-fi kitsch.
- **Why it fits:**
  - One coherent system: Plex Sans for prose; Plex Sans at wdth 75–85 (condensed) for headlines and spec tables; Plex Mono for real data (frequencies, part numbers, code).
  - Plex has angled terminals and a squarish "engineered" bowl. That is distinct from Inter while staying neutral.
  - IBM Plex Sans Devanagari and Plex Sans Condensed exist if needed.
- **Weights:**
  - Sans VF wght 100–700, wdth 75–100. Use 400 and 600; 700 for display.
  - Mono is static on GF. Load 400 and 500 (about 10KB each latin).
- **Sizes and tracking:**
  - Display 56–72px, Plex Sans wdth 85, weight 600, line-height 1.05, tracking −0.02em.
  - Body 17px/1.5/400, tracking 0 (Plex is already spaced for text).
  - Mono 13–14px, tracking 0.
- **Variable:** Sans yes (wght, wdth); Mono no.
- **File size:** Sans VF 60KB latin, plus Mono 2×10KB.
- **Tamil:** **none, and there is no Plex Tamil.** Use Noto Sans Tamil.
- **Who uses it:** IBM corporate and the Carbon Design System [knowledge, high confidence]. Also widely used in dev tooling and docs.
- **Overuse:** moderate (Plex Sans #51, Mono #69), but it still reads "engineering", not "template".
- **Alternatives in the same lane:**
  - **Mona Sans (wdth 75–125) + Hubot Sans + Martian Mono.** GitHub's open families; Martian Mono is by Evil Martians and has a wdth 75–112.5 axis. Very technical, much rarer (Mona #427, Martian #690). VF sizes 98KB, 93KB and 38KB.
  - **Space Grotesk + Space Mono.** Technical but flagged overused.

### 3. Editorial serif display: **Newsreader (opsz 6–72) display + Schibsted Grotesk body + Fragment Mono**

- **Feel:** a research journal or long-form engineering feature, like an IEEE Spectrum or Quanta-style case study. Authoritative and human, which frames projects as stories and papers.
- **Why it fits:**
  - Newsreader (Production Type, commissioned by Google Fonts) has a real **opsz axis up to 72**. At display sizes it becomes sharp and high-contrast, the same idea as New York's tracking and optical behavior in the HIG.
  - Schibsted Grotesk was drawn for a news-media group (Schibsted, by Bakken & Bæck), so it is built to sit beside editorial serifs.
  - Fragment Mono is a Helvetica-flavoured monospace that blends with the grotesk for figure captions and data.
- **Weights:**
  - Newsreader VF wght 200–800. Display at 400–500 (serifs look best lighter at large sizes); 600 for small headings; italic optional.
  - Schibsted VF wght 400–900. Use 400, 500 and 700.
  - Fragment Mono: 400 plus italic only.
- **Sizes and tracking:**
  - Display 64–96px with opsz auto, weight 400–500, line-height 1.0–1.08, tracking −0.01 to −0.02em. Follow New York's curve: −0.014em at 40px, −0.016em at 72px+.
  - Body (Schibsted) 17–18px/1.5, tracking 0.
  - If you set body in Newsreader for essays, use 18–19px/1.6 with opsz auto (Anthropic's skill: serif body needs more line-height).
- **Variable:** Newsreader and Schibsted yes; Fragment Mono no.
- **File size:** Newsreader VF 132KB latin (heavy, because of the opsz masters). Consider loading only the roman, or fixing opsz with a static instance. Schibsted 47KB, Fragment Mono 15KB.
- **Tamil:** pair with **Noto Serif Tamil** (99KB tamil) for any Tamil display text, or Tiro Tamil (Fiona Ross / Tiro Typeworks).
- **Who uses it:** Schibsted Grotesk is used by Schibsted's own brands [knowledge]. Newsreader has no single dominant brand, which is a plus.
- **⚠ Flag:**
  - Don't use **Instrument Serif** (static 400 only, 15KB). It is the 2024–25 "AI-startup serif" cliché, especially with italic accent words. **Fraunces** (opsz 9–144, SOFT, WONK; 67KB) is a characterful alternative, but its wonky soft style reads "lifestyle/food", not robotics.
  - Avoid the "one italic word in the headline" move entirely.

### 4. Modern geometric: **Satoshi display + Satoshi body + Martian Mono** (Fontshare). GF-safe alternative: **Host Grotesk** or **Manrope**

- **Feel:** contemporary, crisp and slightly friendly geometric-grotesk. Clean product-launch energy.
- **Why it fits:** reads modern and premium at display sizes, with good x-height for body. Martian Mono's wide, squarish mono echoes the geometry.
- **Weights:** Satoshi VF wght 300–900, upright and italic VF files. Use 400, 500 and 700; 900 for a single hero word if wanted. It has `tnum`, `case` and `ss01–ss04` (verified in the kit).
- **Sizes and tracking:**
  - Display 64–88px, weight 700, line-height 1.0–1.05, tracking −0.03em. Geometrics need more negative tracking at large sizes.
  - Body 17px/1.5/400, tracking −0.005em.
- **Variable:** yes (wght).
- **File size:** Satoshi-Variable.woff2 42.6KB, italic VF 43.8KB. General Sans VF 38KB (wght 200–700). Switzer VF 43KB (wght 100–900). Martian Mono VF 38KB.
- **Licensing:** FFL v2.0 allows self-hosting but forbids subsetting or conversion and repository redistribution. Read the B0 caveat about a public repo.
- **Tamil:** none. Use Noto Sans Tamil or Catamaran.
- **Who uses it:** the most-downloaded Fontshare family, common on Framer/Webflow sites and design portfolios [knowledge].
- **⚠ Flag:** Satoshi and General Sans are heavily overused in 2023–26 portfolios. **GF-safe, rarer substitutes:**
  - **Host Grotesk** (Element Type 2024, VF 300–800, 20KB!, pop #403).
  - **Funnel Display + Funnel Sans** (NORD ID 2024, 18KB display).
  - **Manrope** (VF 200–800, 25KB, but common, #30).

### 5. Condensed / industrial: **Archivo (wdth 62–125) display + Archivo body + JetBrains Mono**, or **Big Shoulders + Barlow + IBM Plex Mono**

- **5a, Archivo:** the natural evolution of the current Archivo Narrow 700.
  - **Feel:** grotesque with 19th-century American industrial roots, built by Omnibus-Type for high-performance typography.
  - One variable file covers ExtraCondensed (wdth 62) for big uppercase or sentence-case hero lines, normal width for body, and Expanded (wdth 112–125) for occasional wide labels or numbers. That gives a coherent industrial voice from one family. It is much more flexible than Archivo Narrow, which has one fixed width and only wght 400–700.
  - **Weights:** VF wght 100–900. Use display 700–800 at wdth 62–75, body 400 at wdth 100, and 600 for UI.
  - **Sizes and tracking:**
    - Condensed display 72–120px, line-height 0.92–1.0, tracking −0.01 to 0em. Condensed faces need *less* negative tracking; uppercase condensed needs +0.01 to +0.02em.
    - Body 17px/1.5, tracking 0.
  - `tnum` is present.
  - **Variable:** yes (wdth, wght). **File size:** 90KB latin, which replaces both Archivo Narrow and Geist with one file. JetBrains Mono VF 40KB.
- **5b, Big Shoulders + Barlow:**
  - Big Shoulders (Patric King for the **City of Chicago** design system; GF 2025 version with **opsz 10–72**, wght 100–900, 58KB) gives a rugged, signage-like, infrastructure feel.
  - Barlow is a slightly rounded, low-contrast grotesk drawn from California highway and public signage [knowledge]. It has static weights at about 15.6KB each (load 400, 500, 600), plus Barlow Condensed and Semi Condensed.
  - Big Shoulders sets 600–800 uppercase at 80–140px, line-height 0.9, tracking +0.005em.
- **Other condensed options:**
  - Sofia Sans Extra Condensed (VF wght 1–1000, 40KB).
  - Saira (wdth 50–125, 99KB).
  - Mona Sans at wdth 75.
  - Avoid **Oswald** (#19), **Bebas Neue** (#41) and **Anton** (#79), which are overused poster defaults.
- **Tamil:** **Anek Tamil** (Ek Type) has a matching **wdth 75–125** axis, so condensed Tamil can sit next to condensed Latin. VF latin 99KB plus 198KB tamil, so subset or limit its use.
- **Who uses it:** Archivo is Omnibus-Type's flagship; Big Shoulders is used by the City of Chicago [knowledge].
- **⚠ Flag:** condensed uppercase + mono labels + #0a0a0a is a recognizable generated "tech portfolio" look. If you keep this direction, use sentence case and real content-driven numbering.

### 6. Humanist (Indic-native): **Anek Latin display + Atkinson Hyperlegible Next body + Atkinson Hyperlegible Mono** (+ Anek Tamil)

- **Feel:** warm, human and highly legible. "Engineer who cares about people", with an accessibility story built in.
- **Why it fits:**
  - **Atkinson Hyperlegible Next** (Braille Institute, 2025 VF wght 200–800) is designed to maximize character distinction (I/l/1, 0/O) for low-vision readers. That lines up with the HIG's accessibility emphasis and benefits technical text full of part numbers.
  - The **Atkinson Hyperlegible Mono** companion (VF 200–800) is ideal for real data.
  - **Anek Latin** (Ek Type, Mumbai; VF wdth 75–125, wght 100–800) is the Latin member of a multi-script superfamily designed alongside Anek Tamil, Devanagari and others. A condensed bold Anek headline can carry Charan's name in **both Latin and Tamil with the same design DNA**, a distinctive, personal touch no template has.
- **Weights:**
  - Anek display 600–700 at wdth 87.5 (semi-condensed).
  - Atkinson body 400 and 600.
  - Mono 400.
- **Sizes and tracking:**
  - Display 56–80px, line-height 1.05, tracking −0.01em.
  - Body 17–18px/1.55, tracking 0 (Atkinson is wide and open; don't tighten it).
  - Mono 13–14px.
- **Variable:** all three yes.
- **File size:** Anek Latin VF 104KB (heavy, because of two axes; consider limiting to wdth 75–100 with a static instance). Atkinson Next 34KB, Mono 18KB, Anek Tamil 198KB tamil subset (load only where used, `preload:false`).
- **Who uses it:** Atkinson is the Braille Institute's typeface. Anek was commissioned via Google Fonts from Ek Type [knowledge].
- **Overuse:** low (Anek #528, Atkinson Next #399, Mono #1046).
- **Alternatives:**
  - **Catamaran** (VF 100–900, Latin+Tamil, by Tamil type designer Pria Ravichandran; 33KB latin + 42KB tamil) as a single humanist family.
  - **Mukta** / **Mukta Malar** (Ek Type, static).
  - **Fira Sans + Fira Code** (Mozilla humanist; Fira Sans static on GF, about 17KB per weight).

## B3. Quick comparison

| # | Display | Body | Mono | Latin bytes (VF) | Tamil partner | Distinctiveness | Apple-likeness |
|---|---|---|---|---|---|---|---|
| 1 | Inter opsz / system SF | Inter | JetBrains Mono | 73K + 40K | Noto Sans Tamil | Low (⚠ default) | Highest |
| 2 | IBM Plex Sans wdth 85 | IBM Plex Sans | IBM Plex Mono | 60K + 20K | Noto Sans Tamil | Medium | High |
| 3 | Newsreader opsz | Schibsted Grotesk | Fragment Mono | 132K + 47K + 15K | Noto Serif Tamil | High | Medium (NY analogue) |
| 4 | Satoshi | Satoshi | Martian Mono | 43K + 38K | Noto Sans Tamil / Catamaran | Low–Med (⚠ overused; FFL caveat) | Medium |
| 5a | Archivo wdth 62–75 | Archivo wdth 100 | JetBrains Mono | 90K + 40K | Anek Tamil (wdth) | Medium–High | Low–Med |
| 6 | Anek Latin wdth 87.5 | Atkinson Hyperlegible Next | Atkinson Hyperlegible Mono | 104K + 34K + 18K | Anek Tamil (same DNA) | High | Medium |

**My recommendation for this brief:**
- **#2 (Plex)** or **#5a (Archivo VF)** as the engineering voice. 5a is the least disruptive upgrade of the current prototype.
- Borrow from #1 the Apple discipline: two weights, 17px/1.47 body, apple.com's 80/64/48 headline steps, and `system-ui` where appropriate.
- Consider #6's Anek Latin/Tamil idea for the name lockup as the one memorable typographic move.
- Retire Geist and Geist Mono if the aim is to not look like a Next.js template, and use mono only for genuine data.

## B4. next/font snippets (illustrative)

```js
// #5a Archivo VF (replaces Archivo Narrow + Geist)
import { Archivo, JetBrains_Mono, Anek_Tamil } from "next/font/google";
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" }); // wght is included by default for VF
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const tamil = Anek_Tamil({ subsets: ["tamil"], axes: ["wdth"], variable: "--font-tamil", preload: false, display: "swap" });
// CSS: .display { font-family: var(--font-archivo); font-variation-settings: "wdth" 68; font-weight: 750; }
//      .num { font-variant-numeric: tabular-nums; }

// #1 Inter with optical sizes (+ system SF first on Apple devices)
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], axes: ["opsz"], variable: "--font-inter" });
// body { font-family: system-ui, -apple-system, BlinkMacSystemFont, var(--font-inter), sans-serif; font-optical-sizing: auto; }

// Fontshare (#4): self-host via next/font/local ONLY if the repo is private (see FFL caveat)
import localFont from "next/font/local";
const satoshi = localFont({ src: [{ path: "../fonts/Satoshi-Variable.woff2", weight: "300 900", style: "normal" }], variable: "--font-satoshi" });
```

## Sources

- Apple HIG JSON:
  - `https://developer.apple.com/tutorials/data/design/human-interface-guidelines/{typography,color,dark-mode,motion,accessibility,layout,materials,buttons,branding,scroll-views,designing-for-ios}.json`
- apple.com CSS:
  - `https://www.apple.com/v/macbook-pro/ax/built/styles/overview.built.css`
  - `https://www.apple.com/api-www/global-elements/global-header/v1/assets/globalheader.css`
- Skills (raw.githubusercontent.com):
  - `ebuntario/apple-hig` (SKILL.md and references/foundations/*)
  - `raintree-technology/apple-hig-skills` (README, skills/hig-foundations)
  - `Ksanbal/apple-hig-codex-skill`
  - `heyman333/atelier-ui` (apple-ui-designer)
  - `ihlamury/design-skills` (skills/apple)
  - `anthropics/skills` (frontend-design)
- Search results:
  - [awesome.ecosyste.ms raintree](https://awesome.ecosyste.ms/projects/github.com%2Fraintree-technology%2Fapple-hig-skills)
  - [Ksanbal](https://github.com/Ksanbal/apple-hig-codex-skill)
  - [Zenn apple design skills](https://zenn.dev/tmasuyama1114/articles/apple_design_skills)
  - [claudemarketplaces apple-ui-skills](https://claudemarketplaces.com/skills/ihlamury/design-skills/apple-ui-skills)
  - [createwithswift: Hierarchy, Harmony, Consistency](https://www.createwithswift.com/liquid-glass-redefining-design-through-hierarchy-harmony-and-consistency/)
  - [Serif renaissance in AI branding](https://keyavadgama.substack.com/p/the-serif-renaissance-in-ai-branding)
  - [ITF/Fontshare intro](https://www.indiantypefoundry.com/news/introducing-fontshare)
- Fonts:
  - Google Fonts metadata `https://fonts.google.com/metadata/fonts` and css2 API files
  - Fontshare kits `https://api.fontshare.com/v2/fonts/download/{satoshi,general-sans,switzer,clash-grotesk,cabinet-grotesk}`, containing License/FFL.txt v2.0
  - npm `geist@1.8.1`, `@fontsource-variable/inter@5.3.0`
  - `unpkg.com/next@16.1.6/dist/compiled/@next/font/dist/google/font-data.json`
  - rsms.me/inter (Inter v3 dynmetrics archive)
  - IBM/plex README (no Tamil)
