# Taste Skill (tasteskill.dev): research digest

Researched 2026-10-20. Sources were read in full from the live site and two GitHub repos (shallow clones in
`scratchpad/research/repo` and `.../research/classics`;
site HTML/text in `.../research/dl/`). Quotes are verbatim. "FAIL" and "WARN" are the skill's own inspector/linter levels.

---

## 1. What it is, sources, variants

**What:** "The anti-slop frontend framework for AI agents. Open-source skill files that stop Cursor, Claude Code, Codex
and more from shipping generic frontends." By Leon Lin (@lexnlin) and blueemi. MIT. Distributed as SKILL.md files.

**Sources / URLs**
- Site: https://www.tasteskill.dev/ (pages: `/docs`, `/guide`, `/changelog`, `/blog`). The site's /docs and /guide still
  describe the *v2-experimental* rule set (dials, em-dash ban, locks, pre-flight). The repo has since moved on.
- Main repo: https://github.com/Leonxlnx/taste-skill (now holds ONE skill: `skills/taste-skill/`, install name
  `design-taste-frontend`, v2.1.3 dated 2026-10-19). Raw: `https://raw.githubusercontent.com/Leonxlnx/taste-skill/main/skills/taste-skill/SKILL.md`
  - `references/`: type.md, colour.md, layout.md, copy.md, imagery.md, motion.md, scenes.md, critique.md, tells.md,
    research.md, app-screens.md
  - `scripts/`: draw.mjs (deals a direction), assets.mjs (open-licence image search), lint.mjs (static ban scan),
    inspect.mjs + lib/rules.mjs (real-browser inspector at 1440/768/390), scenes.mjs
  - `library/`: 20 directions, type systems (49 families), palettes, heroes, sections, motions, photos, 247 studied sites
- Classics repo: https://github.com/Leonxlnx/taste-skill-classics (older skills, opt-in only, moved Oct 2026)
- Image-gen skills moved to https://github.com/Leonxlnx/imagegen-skills (imagegen-frontend-web, imagegen-frontend-mobile,
  brandkit, image-to-code). Not fetched in depth (they make image boards, not web rules).
- `full-output-enforcement` (output-skill) removed; replaced by https://github.com/Leonxlnx/unlazy
- `redesign-existing-projects` (redesign-skill) retired and folded into v2; its last full text was recovered from git history.
- Related: https://tastecode.dev (desktop app with design agent).

**Install:** `npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"`; Claude Code:
`/plugin marketplace add Leonxlnx/taste-skill` then `/plugin install taste-skill@taste-skill`. Scripts need Node 22+ and
Chrome/Edge/Chromium; no API keys.

**Variants / presets (13 listed on the site)**

| Skill (install name) | Status | What it is |
| --- | --- | --- |
| taste-skill v2 (`design-taste-frontend`) | Current default | Study-based (247 curated sites + 100 Awwwards SOTD). Deals a researched direction, strict no-ornament house style, browser inspector, screenshot critique loop. Also covers app screens (v2.1). |
| taste-skill-v2-experimental (`design-taste-frontend-v2-experimental`) | Classic | Previous default; single file, 3 dials, brief inference, locks, em-dash ban, 50-box pre-flight. What the website docs describe. |
| taste-skill-v1 (`design-taste-frontend-v1`) | Legacy | Original: 3 dials (8/6/4), "Creative Arsenal", Bento 2.0. |
| gpt-tasteskill (`gpt-taste`) | Classic | GPT/Codex variant: simulated RNG, AIDA structure, GSAP. |
| soft-skill (`high-end-visual-design`) | Style | Calm, "$150k agency" look: double-bezel cards, pill buttons, spring motion. |
| minimalist-skill (`minimalist-ui`) | Style | Notion/Linear editorial: warm monochrome, 1px #EAEAEA borders, pastels. |
| brutalist-skill (`industrial-brutalist-ui`) | Style | Swiss print or CRT terminal; mono, 0 radius, hazard red. |
| stitch-skill (`stitch-design-taste`) | Export | Google Stitch rules + DESIGN.md. |
| redesign-skill | Retired into v2 | Audit-first upgrade checklist. |
| output-skill | Removed | Anti-laziness (no placeholders). |
| image-to-code, imagegen-frontend-web/mobile, brandkit | Moved | Image-generation boards. |

The classics' v1/v2-exp **dial presets** (DESIGN_VARIANCE / MOTION_INTENSITY / VISUAL_DENSITY, 1-10): baseline 8/6/4;
"Portfolio (Designer / studio)" 8/7/3; **"Portfolio (Developer)" 6/5/4**; Landing SaaS 7/6/4; Agency 9/8/3; Premium
consumer 7/6/3; Editorial/Blog 6/4/3; Public-sector 3/2/5. Minimalist briefs 5-6/3-4/2-3.

**IMPORTANT: the versions contradict each other.** v1/v2-exp/soft/stitch *recommend* Geist, Geist Mono, glass with
`border-white/10`, spring physics and diffusion shadows. Current v2 *bans* monospace (Geist Mono is a lint FAIL), glass,
gradients, shadows at rest, eyebrows, hairlines and violet/indigo. For an audit, treat **current v2 as the authoritative
standard** and the v2-exp rules as a second, compatible-where-not-contradicted checklist (section 2.12).

---

## 2. Every concrete rule (current v2 unless marked)

### 2.0 The process (v2 "run") in short
1. Read brief; inventory 8-12 things only this client has ("its name and what the name means", place, numbers, constraints, rituals, artefacts).
2. Write the argument: one claim + proof per section; "Delete any section that has no claim." This avoids "the stock sequence of hero, logos, three features, testimonial, pricing, call to action."
3. Draw direction (`draw.mjs`, 3 of 20 options); "Adopt it. Do not blend it with the layout you would have made anyway."
4. Idea sentence: "On this page, **[something that belongs to the subject]** becomes **[the device the direction calls for]**." Competitor test: swap in the nearest competitor; if it still works, it's a category idea. "'Clean and modern' is not an idea."
   **One live thing:** one interaction made from the idea, real content, works with a thumb, plain no-JS fallback, never blocks reading, "one thing, not a playground". "In blind tests every winning page had one."
5. Copy deck before markup.
6. Build "still" (motion off): tokens -> hero -> sections (neighbours never share a layout; "Carry the idea into every section, pricing, FAQ and footer included") -> imagery -> live thing -> scroll scenes -> fullness -> frame -> states/semantics.
7. Gate: `lint.mjs`, `inspect.mjs` (and `scenes.mjs`). "Fix every FAIL. Treat each WARN as wrong unless you can defend it to a designer in one sentence."
8. Look: critique screenshots (14 passes, scoring, caps), fix top 3, up to 3 rounds.
9. Move: motion layer (required).
10. Report; "Do not claim a check you did not run."

Portfolio-specific lines: "For a person: who and what they do" on the first screen. "A portfolio whose work is invented for
the brief draws each piece as a finished still of that work... never as a pictogram". Signature move: "A portfolio wants the
index with preview"; "the carried picture for a portfolio whose index and case pages are both built."

### 2.1 House rules table (verbatim, all measured by inspector)

| Rule | Instead |
| --- | --- |
| **Headlines: two lines or fewer, at every width.** Every `h1`-`h6`, and the main line of the first screen whatever its tag. | Cut words. Then widen the measure. Size last. |
| **A clear title on the first screen**, in the page's one `h1`, and a heading on every section. | Say what this is. |
| **Equal outer margins; no section huddled on one side** with the other half of the screen empty. | Close every void with something on its far side. |
| **No blank stretches** taller than about half a screen. | Normal section gap; one deliberate rest per page. |
| **Statements are paragraphs.** Large intro/quote = `<p>`/`<blockquote>`, "36px or less on desktop, 24px on a phone", "about 25 words, three lines". | Larger = headline, two-line rule applies. |
| **No eyebrows.** "No small label above a heading, no pill badge above the headline, no "New ·" chip." | Put it in the heading/first sentence, or drop it. |
| **No monospace** outside real code blocks. | Text face; tabular figures. |
| **No index numbering.** "No 01 / 02 / 03, no (001), no "Step 2"." | Order by position/size/words; real `<ol>`. |
| **No thin rules.** "No hairline dividers, no 1px outlined boxes, no grid lines, crosshairs or crop marks." | Space, tone step, scale, filled shape. |
| **No gradients.** "Not as backgrounds, not on buttons, not in text." | Flat colour or real photo. "A neutral scrim under text on a photo is the one exception." |
| **No shadows on things at rest.** No glows. | Tone step; "Shadows only on what truly floats: a menu, a dialog." |
| **No assistant palette.** "No yellow-cream ground with terracotta or rust; no violet or indigo." | Dealt palette. |
| **No tiny uppercase letter-spaced labels.** | Sentence case at readable size. |
| **No icon-topped feature cards, no rows of identical cards.** | Dealt section blueprint. |
| **No glass.** "No backdrop blur panels, no floating pill navigation." | "A plain bar: wordmark, a few links, one action." |
| **No emoji, no gradient blobs, no decorative shapes, no fake dashboards of grey bars.** | Real picture / real interface fragment / nothing. |
| **No styled accent word** in a headline (italic, serif, coloured, underlined). | "One face, one colour." |
| **Two typefaces at most,** usually one. | Dealt type system. |

Exempt: real code in `<pre>/<code>` (mono OK), real tables and form fields (lines OK), interface fragments with `data-ui`.
"Removing ornament leaves space. Never fill it with another ornament." Brand exceptions via `--allow <rule>` must be reported.

### 2.2 Typography

**Font choices**
- v2 never names a "use this" font ("every published 'use this instead' list has become the next wave of tells"); it deals
  one from its library. Library families: Albert Sans, Anton, Archivo, Barlow (+Condensed), Bebas Neue, Besley, Big
  Shoulders, Bodoni Moda, Boska, Bricolage Grotesque, Cabinet Grotesk, Chillax, Chivo, Clash Grotesk, EB Garamond,
  Epilogue, Erode, Figtree, Gambarino, General Sans, Hanken Grotesk, Imbue, Jost, League Spartan, Libre Franklin,
  Literata, Newsreader, Onest, Panchang, Pilcrow Rounded, Public Sans, Red Hat Display/Text, Rokkitt, Roundo, STIX Two
  Text, Schibsted Grotesk, Sentient, Source Serif 4, Stack Sans Headline/Text, Switzer, TikTok Sans, Unbounded, Work Sans,
  Young Serif, Zilla Slab, Zodiak. **Geist is not in the library** (inspector has a `font-not-dealt` rule).
- **lint `default-font` WARN** ("A default typeface. Use the faces named by the drawn direction."): Inter, Poppins,
  Montserrat, Roboto, Open Sans, Space Grotesk, Instrument Serif, Playfair Display, Plus Jakarta Sans, Outfit, Sora, Lato,
  Nunito, Raleway (Google Fonts URL, font-family, or `next/font/google` import).
- **lint `mono` FAIL** ("Monospace type. Only literal code may be monospace."): `font-mono`, any `font-family` with
  mono/monospace/Courier/Consolas/Menlo/Monaco, **JetBrains/Geist/IBM Plex/Space/DM/Roboto/Fragment/Azeret/Red Hat/Martian/
  Commit/Departure/Fira Mono, `Geist_Mono`, `GeistMono`, Fira Code, `ui-monospace`.** (Next.js default `Geist_Mono` import trips this.)
- Third-wave tell: "High-contrast or soft serif display as the shortcut to 'premium'"; "Oversized italic serif headline".
- Classic variants: v1 "**NO Inter Font:** Banned. Use `Geist`, `Outfit`, `Cabinet Grotesk`, or `Satoshi`." v2-exp:
  Inter "Discouraged as default"; "Specifically BANNED as defaults: `Fraunces` and `Instrument_Serif`"; serif "very
  discouraged as the default" ("creative brief = serif" is "the single most-tested AI tell"). soft-skill bans "Inter,
  Roboto, Arial, Open Sans, Helvetica". minimalist bans "Inter", "Roboto", "Open Sans". stitch bans Inter and generic
  serifs (Times New Roman, Georgia, Garamond, Palatino). Serif never in dashboards (v1/v2-exp/stitch).

**Counts and scale**
- "Two typefaces at most, usually one." Inspector: >3 families (>=2% share) FAIL `font-count`; exactly 3 WARN.
- "Two or three sizes do the visible work: one very large, one small, nothing in between." "Five sizes on a page is the
  ceiling." Inspector WARN `size-count` over 9 distinct sizes ("A page needs about five: display, heading, lead, body, small").
- Headline-to-body ratio: study median 4.3, top 4.7; "the display size should be at least four times the body size on
  desktop"; critique asks "Is the jump from body text to headline decisive (three times or more)?"
- Largest type: top sites median 8.4vw vs weak 5.0vw; hero median 72px (5.0vw), top 6.0vw; phone hero median 40px.
- Inspector FAIL `focal-point`: first screen with largest type under 4.5vw AND no picture covering 30% of viewport AND no UI fragment.
- Suggested scale (type.md): `--step-small` 13-14px; `--step-body` 17-19px; `--step-lead` 20-26px; `--step-head` 32-64px; `--step-display` clamp(3rem, 1rem + 9vw, 9rem) (per direction; monument wordmark 16-24vw).
- Section headings: study median 57px (40-96px middle half), "about three and a half times the body size".
- Title: one `h1` on the first screen "at display size (32px or more on desktop; ... mostly 50-150px)". Inspector WARN `small-title` under 32px desktop / 26px phone; FAIL `no-title` if no visible h1 or h1 not on first screen; WARN `many-h1`; WARN `name-only-title` if h1 is a bare name (<=3 words) and nothing on screen explains it ("If the `h1` is the name, the line under it, at 18px or more, says what the thing is").
- Inspector FAIL `late-title`: title not readable 1.2s after load.

**Display type settings**
- "Display type: tracking -0.02 to -0.05em, leading 0.85-1.05." Example `.display { line-height: 0.95; letter-spacing: -0.035em; text-wrap: balance; max-width: 14ch; }`. Study hero median tracking -0.01em, leading 1.0.
- "Tracking scales with size... Set tracking per step, not once for all headings."
- All caps: "slightly open tracking (0 to +0.03em) even at display size, and leading around 0.9." copy.md: "No all-caps for anything longer than three words; if you set caps, add 0.02-0.06em tracking."
- Optical alignment: pull large headline left ~0.04-0.06em (`margin-left: -0.05em`).
- "Never add a text shadow, an outline stroke, or a gradient fill to display type."
- Weight: "Big type does not need to be bold" (hero weights: regular 48%, bold+ 22%). "Everything bold. If every line is emphasised, none is." "Do not change weight on hover; the line reflows."
- Italic only "for titles of works and real emphasis inside paragraphs, never as decoration." "Do not mix two faces inside one headline." Inspector WARN `mixed-font-headline`.
- v2-exp: italic descender clearance, `leading-[1.1]` min + `pb-1` when italic display words contain y g j p q.

**Text settings**
- "Text: 16-20px, leading 1.45-1.6, 45-75 characters per line." Inspector: body under 15px FAIL `body-size`, under 16px WARN (desktop). Measure WARN `measure` past ~88 chars.
- Lead size leading 1.3-1.4. `p { max-width: 62ch; text-wrap: pretty }`.
- "No text under 13px." Inspector: >3 text blocks under 13px FAIL `small-text`, 1-3 WARN.
- "Secondary text is the same face in a softer ink (`--muted`), not a lighter weight and not smaller than 13px."
- "Running text is in the full ink at 16px or more; grey is for secondary notes." Inspector WARN `grey-body` if body contrast < 7:1.
- "Left-aligned by default. Centre at most one moment." Inspector WARN `all-centred` over 72% centred text (>=4 headings). "Do not centre paragraphs longer than three lines. Do not justify."
- Light on dark: "drop one weight step or add 0.01em tracking, and raise leading slightly."
- Micro: curly quotes, real ellipsis, en dash for ranges (v2; note v2-exp instead bans en/em dashes entirely), `&nbsp;` before orphan words, `tabular-nums` for prices/tables, `text-underline-offset: 0.18em; text-decoration-thickness: 0.07em`, `hyphens: none` on headings, space above heading >= 2x space below, `::selection` in accent, visible `:focus-visible` in accent.
- Fonts: use the sheet's `<link>`, "Request only the weights you use (usually two or three in total)", same-kind fallback stack, `next/font/google` or `@font-face` with `font-display: swap`; preload the display font. Inspector WARN `font-fallback` if a declared face did not load.

### 2.3 Colour
- "One ground, one ink, one accent. The accent appears on the action and perhaps one other thing."
- Roles: `--bg`, `--surface` ("one tone step from the ground", "2-6 lightness points from --bg"), `--ink`, `--muted`, `--accent`, `--accent-ink`, optional `--field-n`. "Use the tokens for every colour in the build. A raw hex in a component is a second palette starting. Do not add greys between the roles."
- Proportion: "**Ground:** 70-90% of the page." "**Accent:** under 5% of any screen. It marks the action and at most one other recurring thing. The moment it appears in five places it stops meaning 'here'." "The accent is not for headings, icons, bullets, borders or underlines unless the direction sheet says so. A headline is ink."
- "Surfaces are separated by a small step in tone, never by a line or a shadow." "Do not nest a panel inside a panel." "A thick bar (4px or more) ... is a graphic element ... A 1px line is not."
- Fields: "A section may change the whole field colour. Nothing fades into anything." Fields meet "edge to edge with a hard line"; each field has its own ink; "Never put `--muted` on a coloured field"; neighbouring fields differ in lightness. Top sites median 2 section grounds vs 1.
- **Banned (inspector):** cream + terracotta together FAIL `palette-claude`; terracotta alone FAIL `palette-terracotta` (HSL hue 6-30, sat 0.38-0.85, light 0.42-0.72); cream WARN `palette-cream` (hue 22-62, sat >= 0.16, light 0.88-0.995); **violet/indigo FAIL `palette-purple` (hue 244-295, sat >= 0.42, light 0.3-0.8)**. "The first wave of generated pages was purple; it still reads that way."
- **lint `purple` FAIL:** any Tailwind `bg|text|from|to|via|border|ring|fill|stroke|shadow|decoration|outline-(purple|violet|indigo|fuchsia)-NNN`, or hex #6366f1 #8b5cf6 #7c3aed #a855f7 #4f46e5 #a78bfa #818cf8 #9333ea #6d28d9 #c084fc. ("Indigo / violet — the generated-page accent.") Note: Tailwind `blue-400` is hue ~213, outside the purple band.
- lint `claude-palette` FAIL: #d97757 #da7756 #c15f3c #cc785c #bd5d3a #f0eee6 #faf9f5 #f5f4ed #eeece2 #e8e6dc.
- Tells: "Violet / indigo gradients on hero, buttons and glows" banned; "Near-black ground with one neon accent and a glow" banned (via shadow, gradient).
- Warmth: "from a low-chroma stone, bone or putty ground (saturation under about 15%), from a deep green, brown or oxblood ink, from photographs, or from a full warm field... Warmth is not beige."
- **Dark pages:** `color-scheme: dark` on root; "The ground is a deep tone with a slight tint from the palette, and the ink is a soft light, not `#fff` on `#000`, unless the palette deals exactly that"; check `--muted` 4.5:1; "Depth on dark comes from a lighter surface step, never from glows or coloured light"; lighter weights. (Study: 41% dark, 12% pure black — pure black is not banned in v2, only discouraged by the stark rule; v1/v2-exp/stitch: "NO Pure Black: Never use `#000000`"; v2-exp also "no pure `#ffffff`".)
- Photos: interface neutral when photos carry colour; "Do not wash a photograph with the brand colour"; scrim "black or the ink colour, 30-55% opacity" is the one allowed gradient.
- Buttons neutral (black/white/grey) on 52% of sites; "A coloured button is a choice, not a requirement."
- Inspector WARN `default-link` if browser blue/purple link colour shows.
- Classics: "Max 1 Accent Color. Saturation < 80%" (v1, v2-exp, stitch, redesign); "Do not fluctuate between warm and cool grays" ; v2-exp "COLOR CONSISTENCY LOCK"; v2-exp bans premium-consumer beige/brass/espresso hexes (#f5f1ea #f7f5f1 #fbf8f1 #efeae0 #ece6db #faf7f1 #e8dfcb; #b08947 #b6553a #9a2436 #9c6e2a #bc7c3a #7d5621; #1a1714 #1a1814 #1b1814). App mode lint WARN framework default colours #3b82f6 #2563eb #1d4ed8 #60a5fa #10b981 #22c55e #ef4444 #f59e0b.

### 2.4 Layout and spacing
- Margins: "One grid, one pair of tight margins (16-32px), used everywhere; large things run to the edges." `--margin: clamp(1rem, 2.2vw, 2rem)`; "never under 16px at any width". Phone margins 16-20px.
- "Do not wrap the page in a `max-width: 1200px; margin: auto` container by reflex." Constrain only text measure in `ch`. Very wide screens: cap ~1760-1920px. (Contrast: v1 "`max-w-[1400px] mx-auto` or `max-w-7xl`".)
- Inspector FAIL `off-centre` when left/right margins differ by >= max(40px, 4.5% width) desktop (14px phone); WARN when they differ by >= 16px (12px phone). "The navigation sits on the same margins as the content."
- "Text blocks share two or three left edges on the whole page." Inspector WARN `ragged-edges` if >6 distinct left edges and top 3 hold <60%.
- "Asymmetry inside the grid, never in the frame." Inspector FAIL `lopsided` (2+ sections with content on one side leaving >=42% width empty), WARN for one; WARN `empty-middle` (>=45% width of nothing between edges).
- Section gaps: "120-240px on desktop (the study's median is about 240)", "72-112px on a phone"; "clearly larger than any gap inside one". "More than about 40% of a screen of plain ground between two sections is a hole."
- Inspector FAIL `blank-gap`: any empty stretch >= 60% of viewport height, or 2+ >= 42%; WARN for one >= 42%. FAIL `empty-screens` (2+ near-empty desktop screens). WARN `hero-void` (one empty block >= 28% of first screen).
- "Size a section to its content. `min-height: 100vh` belongs to a section that fills the screen, not to a footer or a lone heading." lint WARN `h-screen` for `h-screen`/`height: 100vh` ("Use 100svh / 100dvh").
- "Each section has a different composition from its neighbours; none is a card grid." "A shape used three times is the template showing." "A repeated module is for archives only (a work index, a menu, a schedule)." "Break the system once."
- Headings on every section: 82% of studied text sections open with one. Inspector FAIL `untitled-section` (2+ sections with >=30 words, >=200px tall, no heading), WARN for one.
- Edge text: FAIL `edge-text` if text within 16px (desktop) / 12px (phone) of screen edge; WARN 12-15px on phone.
- FAIL `overflow` (horizontal scroll). WARN `side-scroll` rows. FAIL `covered-text` / anything lying over a headline. WARN `one-sided-bleed`.
- "Short pages are fine. A quarter of the studied sites are one or two screens."
- Phone is "a second composition": re-author line breaks, re-crop to portrait, "Touch targets at least 44px high", body 16-18px.
- How pages fail (study): stock template; "Centred headline, pill badge, two buttons, screenshot or tile grid below"; distinctive hero then stock modules; default typeface; small/low-contrast text; undersized headline; never says what it is; gates/preloaders; desktop-shrunk phone layout; fixed elements on content.
- Classics: v2-exp "Hero MUST fit in the initial viewport", hero subtext "max 20 words AND max 3-4 lines", "HERO TOP PADDING CAP ... max `pt-24`", "HERO STACK DISCIPLINE (max 4 text elements)", "Navigation MUST render on a single line on desktop", "Navigation height cap: 80px max desktop, default 64-72px", "Section-Layout-Repetition Ban" (8 sections need >= 4 layout families), "ZIGZAG ALTERNATION CAP" (max 2 consecutive image+text splits), "BENTO CELL COUNT RULE" (N items -> N cells), "SPLIT-HEADER BAN", "Page Theme Lock" (no mid-page light/dark flip, unlike v2 which encourages colour chapters), "Mobile collapse must be explicit per section". v1: "ANTI-CENTER BIAS: Centered Hero/H1 sections are strictly BANNED when DESIGN_VARIANCE > 4"; "Grid over Flex-Math". Redesign-skill: optical vertical padding (bottom slightly larger), CTAs bottom-aligned in card groups.

### 2.5 Components
- **Buttons:** "flat, one fill colour, either square-cornered or fully round, decided once (top sites: 52% square, 23% pill; the 9-16px 'soft' radius is the weak-site default)." "Most strong heroes have no button at all, or one." Inspector FAIL `button-fx` for gradient or shadow/glow on buttons. Labels: "Name the action or the thing... One to three words." "One primary button per screen; a second action is a plain text link." "No arrow glyph on every link and button." Inspector WARN `first-action` if no button in first screen (critique cap: usability <= 7). lint WARN `cta-copy`: "Learn more", "Get started", "Click here", "Read more", "Discover more", "Explore now", "Submit".
- **Navigation:** "wordmark, three to five plain links, one action. No bar chrome." "all at text size on the page ground with no bar, border or background. Median link count in the study is 3." Fixed nav "must never sit on top of content". Phone: wordmark + one action, links in a full-screen sheet opened by a text button ("Menu"). "On desktop it takes no more than about a tenth of the first screen; on a phone it is one row." Inspector WARN `pill-nav` (floating rounded pill). Link labels single nouns.
- **Footer:** "a designed close, not a sitemap: on most strong sites the name returns at full width." "Link-column footers appear in the panel's notes only as criticism." Practical facts at readable size.
- **Cards:** inspector FAIL `icon-cards` (row of identical cards each topped with small icon); WARN `card-rows` (2+ rows of identical boxed cards). Radius: "One medium border radius (12-16px) on everything" is a structural tell -> "Square or fully round, chosen once." FAIL `outlined-box` at 3+ 1px-outlined boxes (WARN 1-2). WARN `dashed`. WARN `glass` for 2+ backdrop-blur surfaces ("One blurred sticky bar at most").
- **Forms:** fields filled with `--surface`, `border: 0`, `outline: 2px solid var(--accent); outline-offset: 2px` on focus. (v1/v2-exp: label above input, error below, `gap-2`, "No placeholder-as-label. Ever.")
- **States (v2 step 6.9):** "Real links and buttons, visible focus, alt text". Redesign order includes "states (hover, focus, loading, empty, error)". Classics: skeleton loaders not spinners, composed empty states, inline errors, `:active` `scale(0.98)` / `-translate-y-[1px]`.
- **Proof:** "Proof is never invented: no customers, quotes, reviews, press, logos or business statistics."
- **Software fragments:** build real HTML fragment at true size, believable content, no device frames ("No laptop, no phone frame"), mark root with `data-ui`. "Grey bars standing in for text are worse than no image."
- No checkout: primary button to real destination or `mailto:` with subject/body; "Never fake a payment form."

### 2.6 Motion / animation
- Motion is **required** but built last: "a page that needs animation to look finished is not finished." Inspector FAIL `still-page` if fewer than **8** elements move during load + scroll (video counts x4), WARN under **16**.
- Layer: (1) one signature move; (2) per-section entrances "heading, then the text, then the picture, staggered by 60-90ms, rising 16-32px with opacity, triggered once ... Not one fade for the whole block, and never content that stays hidden if the script fails"; (3) "Feedback on every control: press, hover and focus"; (4) "One moving picture".
- "Transform and opacity only" (plus clip-path); never width/height/top/left/margin/padding (accordion grid-rows excepted). `will-change` only while animating.
- Tokens: `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`; `--ease-expo: cubic-bezier(0.16, 1, 0.3, 1)`; `--ease-in-out: cubic-bezier(0.76, 0, 0.24, 1)`; `--ease-soft: cubic-bezier(0.33, 1, 0.68, 1)`; `--ease-exit: cubic-bezier(0.55, 0.055, 0.675, 0.19)`; `--t-press: 140ms; --t-hover: 180ms; --t-ui: 240ms; --t-reveal: 800ms; --t-open: 1200ms; --stagger-line: 90ms; --stagger-item: 70ms`.
- Rules for motion (verbatim numbers): load sequence "settled by 1.2 s, with four elements at most"; "No preloader, no counter, no gate, no custom cursor, no wheel capture"; "No overshoot"; durations "Press 140ms; hover colour 180-200ms; hover that moves 300-400ms; menus 240ms; reveals 700-900ms; picture openings 1,100-1,300ms; exits 60-70% of the matching entrance"; staggers "Lines 80-110ms; list items 50-90ms; characters 20-40ms and only in a heading of one to three words; four steps at most in any one sequence"; reveals "Fire once, when the element's top is 85-90% of the way down the viewport; rise 12-32px ...; nothing in view stays hidden for more than 900ms; nothing above the fold waits for scroll"; parallax "under 8% of the element; scale between 0.94 and 1.15"; "One signature move ...; one moving picture; one marquee at most"; "Fills start at 45% ink; dims no lower than 40%; blur at most 8px"; "nothing moves across text being read"; view transitions "480ms at most".
- Easing: "`ease-in` makes interfaces feel slow ... do not use it." lint WARN `ease-in`, WARN `transition-all` ("Name the properties (transform, opacity)"), WARN `scale-zero` ("Start at 0.95-0.98 with opacity 0"), WARN `bounce` (`animate-bounce|ping|pulse`).
- Reduced motion: "`prefers-reduced-motion: reduce` means fewer and gentler, not none: keep opacity and colour changes, drop travel, scale, parallax and autoplay." Hidden states only inside `no-preference` and under `html.js`. Inspector FAIL `reduced-hidden` if 2+ first-screen text blocks stay invisible under reduced motion.
- Generated-motion tells: "The same fade-up on every block. A dozen staggered entrances in the hero. Hover lift or zoom on every card and image. Bounce or elastic easing ... Infinite loops that mean nothing: pulsing dots, floating shapes, shimmering text, rotating badges. A reveal that never fires and leaves a blank band." Also scramble/typewriter text ("not used"), custom cursors, scroll hijacking, endless loops without off switch (loops pause off screen, stop under reduced motion).
- Smooth scroll only via Lenis lerp 0.1-0.14, off for touch and reduced motion. Scroll scenes: 2-3 per page, 1-4 screens each; inspector WARN >4 scenes or >60% of page.
- Classics: "NEVER use `window.addEventListener('scroll')`" (v1/v2-exp/soft/minimalist); no `useState` for continuous animation, use motion values; isolate perpetual animation in memoized client leaf components; `useEffect` cleanup; never mix GSAP/Three with Framer Motion in same tree (v1). (v1/stitch/soft *recommend* spring `stiffness: 100, damping: 20` and perpetual loops; v2 bans the loops.)

### 2.7 Imagery
- "**The floor, which the inspector checks:** at least four real pictures on the page, usually six to twelve ... SVG drawings do not count." Inspector FAIL `few-pictures` (<4 at >=1100px), WARN `no-real-pictures` (<2 real photos), WARN `no-footage` (no video), WARN `no-poster`, FAIL `broken-image`.
- Priority: project's own -> generated -> open-collection real pictures (credited) -> drawn in code from the subject -> dealt photos -> type and colour alone. "No image is better than a placeholder, an icon, or an abstract shape."
- "When the project has footage or a real picture of its own process or product, the first screen shows it, large (about 40% of the screen or more)." Top sites: hero media >= half the first screen 68% of the time.
- "One dominant image beats six small ones." "A picture leads its screen or stays small": leading picture >= 60% of its screen; accent < 10%. About 30-40% of page area is picture; >= 1 screen in 4 carries none.
- Ratios: "Two ratios for at least 75% of the pictures"; defaults 4:5 portraits, 16:9 or 3:2 landscapes.
- "Square corners on every picture (94% in the study). If the direction rounds them, one radius of 4px for every picture and clip."
- "No frames: no borders, no shadows, no device mock-ups, no browser chrome around pictures."
- One treatment for the page (untouched / greyscale / multiply / darkened). "Not treatments: colour washes over photographs, duotone overlays, blur, grain overlays, vignettes, tilted 'polaroid' frames with shadows."
- Text on pictures: "only display text, one short line and one action"; contrast 4.5:1 (3:1 for 24px+) measured at text position; scrim "a solid block at 40-55% black, or a fade from 55% black to transparent over the lower third. Never a coloured overlay."
- "Nothing ever lies on top of a headline or a statement (the inspector fails it)."
- Markup: always width/height or aspect-ratio; `loading="lazy"` except hero (`fetchpriority="high"`); real alt text, decorative repeats `alt=""`; background colour on container; serve at 2x CSS width, cap ~2400px.
- Video: 5-15s muted inline loops with poster, paused out of view; hero 1920x1080 < 10MB, inline 1280x720 < 5MB.
- Drawing: draw the subject's own things, one graphic language, three levels of detail, no "gradient-shaded 3D-looking blobs, isometric clip art, generic line illustrations of people at laptops, abstract floating shapes, icons in squares."
- Type-only pages legitimate: "one statement at 10-14vw"; do not add "icons in squares, abstract gradients, dot grids, wave dividers, floating shapes, emoji, generic line illustrations, or an empty box where a picture 'will go'."
- Classics: picsum `https://picsum.photos/seed/{x}/w/h` placeholders; "Div-based fake screenshots are banned"; "Even minimalist sites need real images" (2-3 minimum, v2-exp); no generic egg/Lucide avatars.

### 2.8 Copywriting
- Headline budget: "about 32 characters or fewer (four to six words)"; up to ~42 if phone size drops to mid-30s. Formula: chars per line ~= line width / (font size x k), k 0.40 condensed / 0.50 most / 0.58 wide or caps. Inspector WARN `hero-words` over 10 words ("Gallery median is 5"). Section headings "two to five words". "Never fix a long headline only by shrinking it." Avoid orphan word on line two.
- Supporting line: "One sentence, at most about 22 words", directly under headline (32-48px below), says plainly what it is; never repeats the headline.
- First screen: "For a person: who and what they do."
- Headline shapes to avoid: mad-lib ("The AI-powered platform for modern teams"), tricolon ("Fast. Simple. Secure."), correction ("It's not just a tool, it's a workflow"; "More than a ..."), "X, reimagined / redefined / made simple", "Welcome to ...", "Meet ...", unasked question, "a headline that needs its colon", one word styled differently. "Sentence case. No full stop unless the direction's voice uses them everywhere."
- lint `copy` WARN list (verbatim regex terms): unlock, unleash, supercharge, seamless(ly), elevate, empower(s/ing), revolutionise/ize, game-changer/changing, cutting-edge, next-gen(eration), world-class, best-in-class, all-in-one, effortless(ly), blazing(ly) fast, lightning fast, reimagine(d/ing), delve, tapestry, leverage, synergy, streamline, robust, holistic, turbocharge, "transform the way", "take your ... to the next level", "say goodbye to", "in today's", "the future of", "built for the modern", "not just ..., it's/but", "more than (just) a".
- Performative labels: "Field notes", "The details", "Our philosophy", "Quietly trusted by", "On our desks". "A section heading can simply be 'Pricing'."
- Furniture text banned: "locale or time strips, 'Est. 2024', coordinates, version stamps, 'Scroll', '(Scroll to explore)', fake photo credits, status lines such as 'Available for work' with a dot, strings of words separated by middle dots or slashes."
- Em dash: v2 "One or two on a page read as writing; ten read as a model." lint WARN `em-dash` if > 4 across source. (v2-exp: "Em-dash (`—`) is COMPLETELY banned", en dash as separator too.)
- "Explainer captions that narrate the design"; "Step labels that duplicate numbers: 'Step 1', 'Phase 02'"; "Three parallel items everywhere ... Use the number the content has."
- lint FAIL `lorem` ("lorem ipsum|dolor sit amet"). App mode FAIL placeholder data: John/Jane Doe, Acme, example.com, Firstname Lastname, 123 Main St.
- Body: "Prefer the specific noun and the real number"; "ask whether a different company could print it unchanged; if so, sharpen it or cut it." Median study page 575 words.
- Classics: no generic names ("John Doe", "Sarah Chan", "Jack Su"), no startup names ("Acme", "Nexus", "SmartFlow"), no fake-round numbers (`99.99%`, `50%`, `1234567`); v2-exp "NO DUPLICATE CTA INTENT" (one label per intent, e.g. contact), CTA label must not wrap on desktop, "3 words max for primary CTAs"; quotes max 3 lines; "Copy self-audit"; redesign-skill: sentence case not Title Case, no "Oops!", no exclamation marks in success messages, active voice.

### 2.9 "AI slop" anti-pattern registry (tells.md, dated)
- **First wave 2023-24:** violet/indigo gradients (banned); gradient headline text (banned); glass panels (warned at 2+); glowing/gradient "Get started" button (banned); soft grey drop shadow under every card (banned); three identical icon feature cards (banned); emoji as icons (banned); centred headline + subtitle + two buttons + screenshot below (draw avoids); same typeface on every generated page (warned).
- **Second wave 2025:** eyebrow/kicker (banned); pill badge above hero ("New", "Beta", "Introducing") (banned); one word in italic serif/colour/underline (warned); bento grid of rounded tiles (warned as card rows); near-black ground with one neon accent and glow (banned); floating rounded pill nav with blur (warned); fake dashboard hero of grey bars/donuts; decorative status dot "Available for work"/pulsing "live" (lint bounce); fade-and-rise on every section.
- **Third wave 2025-26:** yellow-cream + terracotta/rust/clay (banned); serif display as shortcut to premium; oversized italic serif headline; "Broadsheet cosplay: hairline rules everywhere, zero radius, dense columns" (banned via hairline); performative labels.
- **Gallery fashion banned as house style:** monospace micro-labels; index numbering 01/02/03; thin rules/1px boxes; design-tool chrome (crosshairs, crop marks, dashed guides, rulers); "Agency micro-meta: local time, coordinates, weather, version stamps, '©2026 — Scroll', middle-dot strings"; tiny uppercase letter-spaced captions (banned at 3+).
- **Structural:** 3-4 line display sentence headline (banned); stock section order; every section same layout; everything centred (warned >72%); one medium 12-16px radius on everything; nine nearly equal font sizes (warned >9); invented social proof; "Text or a CSS box where a picture belongs".
- **Why removal is not enough:** "A page with every tell removed and nothing put in their place is an empty page with good manners, and that is a tell too (the 'avoidance aesthetic')."
- lint hairline FAIL patterns: `<hr`, `divide-x|y`, `h-px`/`w-px`, `border-top|bottom|left|right: 0.5px|1px`, Tailwind `border-t|b|l|r|x|y` (1px), `height: 1px` (tables/forms/sr-only/focus outlines exempt). Inspector: 2+ hairlines FAIL, 1 WARN.
- lint gradient FAIL: `linear|radial|conic-gradient(`, `bg-gradient-*`, `bg-linear-*`, Tailwind `from-*`/`via-*`. gradient-text FAIL: `bg-clip-text`, `background-clip: text`, `text-transparent`.
- lint shadow FAIL: any `box-shadow` (not none), Tailwind `shadow`, `shadow-sm|md|lg|xl|2xl|inner|[..]`, `drop-shadow`, `text-shadow`.
- lint eyebrow FAIL: classes named eyebrow, kicker, overline, pretitle, suptitle, tagline-label, section-label, section-tag. micro-label FAIL: `uppercase` + `tracking-wide|wider|widest|[..]` + `text-xs|[10-13px]` on one element. numbering FAIL: `>01<`, `"01"`, `decimal-leading-zero`, `>Step 1<`/Phase/No./Chapter; WARN `padStart(2,'0')`. emoji FAIL (U+1F300-1FAFF, 2700-27BF, 2600-26FF). glass WARN `backdrop-blur`/`backdrop-filter`.
- v2-exp extra bans (site /docs "Anti-Slop Ban System"): section-numbering eyebrows ("00 / INDEX", "001 · Capabilities"); hero version labels (V0.6, BETA, INVITE-ONLY); decorative photo-credit captions; hero decoration text strips ("BRAND. MOTION. SPATIAL.", "TYPE / FORM / MOTION"); pills overlaid on images; version footers ("v1.4.2", "Build 0048"); "Locale, city, time, weather strips ... banned for 99% of briefs"; scroll cues ("Scroll, down-arrow icons, Scroll to explore"); "Decorative status dots: Zero by default"; border-t + border-b on every row; div-based fake product UI; three-equal-card feature rows; "AI-purple and mesh blob gradients"; hand-rolled decorative SVG illustrations; `window.addEventListener('scroll')`; vertical rotated text; `<br>`-broken italic headlines; "01 / 4" pagination; middle dot max 1 per line; "Quietly in use at"; "From the field"/"Field notes"/"Currently on the bench"; fake-precise numbers; scoring bars with filled tracks; floating top-right sub-text in section headers.
- v1 tells: "NO Neon/Outer Glows", "NO Pure Black", "NO Oversaturated Accents", "NO Excessive Gradient Text", "NO Custom Mouse Cursors", "NO Inter Font", "NO Oversized H1s", "NO 3-Column Card Layouts", Jane Doe effect, "NO Broken Unsplash Links", no default shadcn.

### 2.10 Accessibility
- Contrast: "Body text 4.5:1 or better; display type and large numerals 3:1 or better; the dealt palettes meet 7:1 for ink on ground." Inspector FAIL `contrast` under 2.6:1, WARN below needed ratio; body WARN under 7:1 (`grey-body`). "Do not lower opacity on text to make it 'soft' unless you have checked the resulting ratio." "Focus states and hover states increase contrast, never reduce it."
- Visible `:focus-visible` outline in accent (2px, offset 2px); styled `::selection`.
- "Real links and buttons, visible focus, alt text"; one `h1`; every section headed; touch targets >= 44px; no text < 13px; phone margins >= 16px; no horizontal overflow; nothing covering text; fixed nav must not cover content.
- Reduced motion mandatory: reduced page = finished page; loops stop. Content visible with JS off (`html.js` gating). Live thing needs plain no-script fallback.
- No custom cursor, no scroll hijacking, no gates/preloaders ("Sound is a control on the page, off by default"). Sideways gallery needs keyboard support.
- v2-exp: WCAG AA for body (AAA target hero), button contrast check, form contrast check, dark mode "mandatory for any consumer-facing page", test both modes. Redesign-skill: skip-to-content link, semantic HTML (nav/main/article/section), `aria-expanded` on collapse controls, `aria-hidden` alone does not remove from tab order, alt never empty on meaningful images, active nav state, custom 404, meta/OG tags, favicon, no dead `#` links.

### 2.11 Performance
- Animate transform/opacity/clip-path only; `will-change` transient; "Do not drive many children from one changing CSS variable on a parent"; pause loops off screen/tab hidden.
- Images: width/height, lazy below fold, hero `fetchpriority="high"`, 2x CSS width capped ~2400px, ground colour behind images; video size caps; preload display font; request only used weights; `font-display: swap`.
- First paint: headline/sentence/picture in HTML on first frame; "settled by 1.2 s"; no preloader.
- lint WARN `transition-all`, `h-screen` (100vh jumps on mobile).
- v2-exp Core Web Vitals: "LCP < 2.5s", "INP < 200ms", "CLS < 0.1"; hero `next/image priority`; lazy-load heavy libs (Three.js); grain only on fixed pointer-events-none layers; "NEVER spam arbitrary `z-50` or `z-10`". v1/soft: backdrop-blur only on fixed/sticky elements, never scrolling containers.

### 2.12 Special case: redesign/review of an existing site (v2)
1. Record the before: `inspect.mjs <url> --out .taste-skill/before`, lint source; read framework/styling; list what must survive.
2. "A review stops here." Critique the before screenshots, list findings with inspector measurements, "name the three changes that would move the page most."
3. Keep stack, content, what works; no framework migration.
4. Order: "type (faces and scale), colour (one ground, one ink, one accent), the frame (margins, section rhythm, a title on the first screen and a heading on every section), states (hover, focus, loading, empty, error), then the stock components (icon cards, pill badges, gradient blobs, card grids)".
5. Prove it: inspect after, compare at every width, report before/after measurements.
(v2-exp: never silently change URL slugs, primary nav labels, form field names, logo, legal copy.)

---

## 3. Checklists and scoring rubrics

### 3.1 v2 critique: fourteen passes (on screenshots, never code)
1. One second, then five (one focal answer; stranger can say what/for whom/what next).
2. Squint (two or three large masses).
3. Cover the logo (could it be a competitor? does the idea reach pricing/FAQ/footer?).
4. Edges (count distinct left x positions; 2-3 good, 6 bad).
5. Space and frame (gaps, holes vs rests, equal margins, half-empty sections, blank > half screen).
6. Type (body-to-headline >= 3x, <= 5 sizes, orphans, measure ~75, centred > 3 lines).
7. Colour (proportions; accent on one action + one detail).
8. Images (>= 4 real, one moving, shared ratios, one grade, no grey boxes/fake screens).
9. Sameness (one word per section layout; same word twice in a row or three times = template).
10. Phone (own composition).
11. Fullness (each screen a poster; not a wireframe).
12. Substance (full content; primary action a real button on first screen).
13. Collisions (nothing over headline/button; nothing off phone edge; no sideways-scrolling rows).
14. The competitor and the live thing.

### 3.2 Score (Awwwards-weighted)
`overall = 0.4·design + 0.3·usability + 0.2·creativity + 0.1·content` (each 1-10).
- Design 9-10 "every screen holds as a poster"; 8 confident; 7 clean, little tension; 6 "tidy but anonymous. Reads as a kit"; <=5 weak hierarchy, default type.
- Usability 9-10 know what/who/what to do without scrolling, flawless phone; 8 minor friction; 7 one real problem; <=6 hunt or breaks.
- Creativity 9-10 subject-specific unseen concept; 8 clear idea + one memorable move; 7 tasteful known approach; <=6 category default.
- Content 9-10 every line only about this subject; 7-8 concrete, some generic; <=6 slogans/filler/stock.
- Calibration: real Sites of the Day ~7.5-8.0; "An honest 8.5 is rare. If your first score for your own work is 9, score it again".

### 3.3 Caps (override arithmetic)
- Any inspector FAIL: overall <= **6.0**.
- Headline of 3+ lines, eyebrow, mono labels, 01/02/03, decorative gradient, shadow at rest, decorative hairline visible: overall <= **6.5**.
- Page could belong to anyone (pass 3): creativity <= **6**. Idea passes for nearest competitor: creativity <= **7**. No live thing: creativity <= **7.5**.
- Fewer than four real pictures: design <= **6.5**. Barely moves / one identical fade everywhere: design <= **7**. Two+ mostly-empty desktop screens or small grey running text: design <= **6.5**. Unequal margins, lopsided section, or blank > half screen: design <= **6.5**.
- Placeholder (grey box, lorem, "Image here"): content <= **5**. Missing/thin requested section: content <= **6**.
- No real primary button on first screen: usability <= **7**. Five-second pass fails: usability <= **6**. Untitled text section: usability <= **7**. Anything covering a headline: usability <= **6**. Blank band from failed reveal / clipped content: usability <= **5**.

### 3.4 Critique write-up format
```
ROUND n
Seen in one second: …
Idea (one sentence): …
Live thing: …
Layout words by section: hero=… / …=… / …
Scores: design _ · usability _ · creativity _ · content _ → overall _._
Caps applied: …
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. … 2. … 3. …
```
Fix order: idea -> hierarchy -> composition -> typography -> imagery -> colour -> detail -> motion. Max 3 rounds; "If round three still scores under 7.5, say so plainly".

### 3.5 v2 report gate ("Do not report until all of these are true")
- `inspect.mjs` shows 0 FAIL at 1440, 768 and 390 on the final page; every screenshot opened after last change; scenes.mjs clean if scenes; "A stranger reading the first screen for five seconds can say what this is and what to do"; "Every section has a heading; the margins match on both sides; no stretch of the page is empty"; critique written down.

### 3.6 Automated checks (runnable; Node 22 is installed here, Chrome needed for inspect)
- `node <skill>/scripts/lint.mjs <src>` (static; Node 18+, no browser) and `node <skill>/scripts/inspect.mjs <url>` (1440/768/390, screenshots to `.taste-skill/inspect/`). Full inspector rule IDs: headline-lines, statement-length, focal-point, hero-words, mixed-font-headline, eyebrow, mono, numbering, micro-label, emoji, gradient, gradient-text, shadow, text-shadow, button-fx, hairline, outlined-box, dashed, glass, icon-cards, card-rows, pill-nav, palette-claude, palette-terracotta, palette-cream, palette-purple, default-link, contrast, font-count, font-fallback, size-count, body-size, measure, small-text, all-centred, ui-wrapper, overflow, broken-image, no-hero, first-action, grey-body, blend-text, covered-text, clipped-text, pinned-over-picture, empty-screens, long-pin, side-scroll, few-pictures, no-real-pictures, no-footage, still-page, off-centre, lopsided, blank-gap, no-title, small-title, many-h1, name-only-title, empty-middle, untitled-section, edge-text, ragged-edges, late-title, reduced-hidden, no-poster, hero-void, one-sided-bleed, font-not-dealt (+ app-screen rules).
- Evals (`evals/evals.json`) expected output for a page: "headlines of two lines or fewer at 1440/768/390, no eyebrow labels, no monospace, no index numbering, no thin rules, no gradients or shadows, a non-default palette and type system, a pricing section that is not three cards, and no invented customers or statistics."

### 3.7 v2-experimental "FINAL PRE-FLIGHT CHECK" (site's "No box, no ship"; 50 boxes, condensed)
Design read declared; dials reasoned; zero em/en dashes; Page Theme Lock; Color Consistency Lock; Shape Consistency Lock; button contrast AA; no CTA wrap at desktop; form contrast; serif not Fraunces/Instrument Serif; no beige+brass palette; italic descender clearance; hero fits viewport (headline <= 2 lines, subtext <= 20 words and <= 4 lines, CTA visible); hero top padding <= pt-24; hero <= 4 text elements; eyebrow count <= ceil(sections/3); no split-header; no 3+ zigzags; no duplicate CTA intent; logo wall logos only, under hero, real SVGs; bento background diversity and exact cell count; copy self-audit; motion motivated; <= 1 marquee; nav one line, <= 80px; no repeated layout family (>= 4 families / 8 sections); long lists use right component; real images, no div fake screenshots; no pills on images; no decorative photo credits; no version footers; no micro-meta sentences; no hero decoration strip; no floating top-right sub-text; no filled-track score bars; no locale strips; no scroll cues; no hero version labels; no section-number eyebrows; no decorative dots; no border-t+b every row; sane content density; quotes <= 3 lines; motion claimed = motion shown; GSAP skeletons correct; no scroll listeners; reduced motion for MOTION > 3; dark mode tokens tested; explicit mobile collapse; `min-h-[100dvh]` never `h-screen`; useEffect cleanup; empty/loading/error states; cards omitted where possible; icons from Phosphor/HugeIcons/Radix/Tabler only; motion isolated in memoized client leaves; no AI tells; CWV plausible; one design system.

### 3.8 v1 pre-flight (7 boxes)
Global state appropriate; mobile collapse guaranteed; `min-h-[100dvh]` not `h-screen`; useEffect cleanup; empty/loading/error states; cards omitted in favour of spacing; perpetual animations isolated.

---

## 4. Quick cross-reference to this repo's stated design tokens (from CLAUDE.md)
CLAUDE.md says: Geist font setup; background `#0a0a0a`; accents `purple-400`/`blue-400`; glassmorphism via
`backdrop-blur-sm bg-white/5 border-white/10`; Framer Motion + GSAP; many overlapping nav/UX widgets
(OnboardingTour, FloatingActionButton, NavigationHints, ScrollProgress, SectionIndicator, SectionNav). Against v2:
- `purple-400` -> lint FAIL `purple` and inspector FAIL `palette-purple` (Tailwind purple-400 #c084fc is in the hex list). Two accents also break "one accent".
- `backdrop-blur-sm` -> WARN glass (FAIL-level house rule "No glass"); `border-white/10` on boxes -> outlined-box / hairline.
- Geist Mono (if imported, the Next.js default) -> lint FAIL `mono`. Geist itself is not banned, but is not a dealt face.
- `#0a0a0a` is fine (v1/v2-exp even recommend off-black); v2 wants a slight palette tint and soft-light ink, not #fff.
- Widgets like a floating action button, scroll-progress hairline bar, section indicator "01/05" counters, onboarding tour, "Scroll" hints, pulsing dots would hit: index numbering, scroll cues, hairline progress bars ("become a plain count in the body face ('2 of 4')"), floating elements covering content, gates before content, decorative status dots, nav taking > 1/10 of first screen.
