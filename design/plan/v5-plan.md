# Prototype v5 plan

Status: stages 0–8 done; waiting on your sign-off before phase 3 (Figma). Nothing ships: no commits, pushes or deploys until you say so. Review happens on the private prototype artifact and screenshots.

v5 is phase 2 of the rebuild plan: re-skin and restructure the v4.2 prototype with the decisions below, so it passes Taste's inspector and is ready to be drawn in Figma (phase 3) and built in Next.js (phase 4).

## Decided

| Topic | Decision |
| --- | --- |
| Type | Switzer only, 400 and 600. Loaded from Fontshare at runtime because the repo is public; never committed. Mono survives only in the terminal and code snippets. |
| Default theme | Bottle and yellow. Light: page `#F7F7F7`, ink `#0D2A1C`, yellow `#F6E016` on the main button with green text, links in the ink colour. Dark: page `#10241A`, ink `#E8E6D8`, yellow `#F4D96C`. |
| Other themes | Picked in a Settings panel: Burnt sienna, Burgundy white and blue, Blueprint, Sheet and biro, Slate and teal, Stone and sage, Signal. v4's six palettes (Clay, Cobalt, Moss, Graphite, Oxblood, Harbour) are removed. |
| 3D | Every project keeps its own bay and the photo-to-3D scroll morph (all seven already have one). |
| The lab | Ring of plinths around the central bench, sized for at least 10 projects. |
| Flight path | The track around the outside of the ring, in year order. |
| Name | Tamil lockup சரண் வேலவன் next to Charan Velavan, set in Anek Tamil, loaded only for those letters. |
| Projects | 12 plinths: the 7 existing, 2 new (5G Sewer Skimmer, Solar Sailor), the ITU swarm project updated, and 3 placeholders. |

## Content

Read from the three folders you gave, without changing them. Private files (`.env`, `.alexa-devices.json`, `tools/alexa-session/.private`) were not opened, and nothing from them goes on the site.

### Updated: 300-UAV swarm network (ITU Buildathon 4.0)
Source: `SSN/ai/itu/Charan/ITU`.

- **Keep** the Buildathon story as it is: three delivery modes (6G unicast, 5G eMBMS multicast, ATSC 3.0 broadcast), 2nd place, ITU document FG-AINN-I-215, up to 98% bandwidth saved.
- **Tell the whole project, not the paper.** The case study follows the system as it grew:
  - The Buildathon build: three delivery modes, the edge classifier, the 300-UAV twin and the dashboard.
  - What it became: a two-path version (5G or ATSC 3.0) built on TSDSI TR 6026's Multicast Broadcast Offload System (MBOS). A classifier picks the path when its confidence is high; rule-based fallback decides otherwise.
  - Model numbers from `outcome_model_op/training_report.json`: 10,000 samples, 99.65% held-out accuracy. Results described in words (higher throughput, lower cellular load, lower UAV battery drain than 5G alone), with no invented percentages.
- **The paper gets one line**: "A paper on this work is being written." No title, no venue, no PDF.
- **Collaborators**, by name and organisation, no emails: Yogender Raju R and Kaythry P (SSN), Preksha Shah (Free Stream Technologies), Rashmi Kamran (EdgeBeam Wireless), Sangsu Kim (One Media 3.0).
- **New images**: from `ieee_figures/` (throughput vs swarm size, backhaul load vs UAV count, battery drain by mode, control-latency CDF, decision distribution, 3D altitude view), plus `arch_diagram_preview.png` and `metrics_panel.png`. They'll be converted to WebP at 1600px.
- **3D bay**: add a broadcast tower and a 5G cell to the existing swarm scene, with a chapter showing traffic splitting between the two paths.

### New: 5G Sewer Skimmer
Source: `SSN/TCOE HACKATHON`. Placed next to WaterBot on the ring, and WaterBot's "Next project" points to it.

- **What it is**: a catamaran robot that skims floating waste and inspects covered sewers, so workers don't have to enter them. A 5G uplink carries 720p/15fps video (about 2 Mbps of a 10 Mbps budget) to an edge AI server. A pole-mounted 5G CPE at the manhole relays the link.
- **Build**: Fusion 360 parametric model with 36 named bodies, LOA 2768 mm and a beam of 1310 mm. Twin Ø200 mm ducted thrusters steer it by differential thrust. A 31° grated intake ramp feeds an 830 × 740 × 295 mm draining debris basket. A bow gantry carries a dome camera, side cameras, an LED bar, GNSS and H₂S/CH₄ sensing; a sonar below profiles silt. A Raspberry Pi 5 handles vision and networking; an STM32G474 runs a 1 kHz motor and safety loop. The BOM is ₹68k–₹78k.
- **Safety**: if the link drops, it holds at 2 s, retries out to 30 s, then returns to the last checkpoint.
- **Being honest about status** (the folder is explicit about this): the video is a Blender simulation, not footage. No hull has been built, no water trial has been run, and the 5G figures are calculated, not measured. The case study will carry a "What is real" table taken from the jury README.
- **What I did**: designed the robot in Fusion 360 (the full parametric CAD model) and made the simulation video that explains how it works.
- **The video leads the case study**: `Sharing/5G_Surface_Skimmer_Sewer_Simulation.mp4` opens the Overview, captioned as a simulation of the CAD design.
- **The hackathon gets one line**: "We've applied with this project to the TCOE India Emerging Technologies Hackathon 2026." No submission ID, rounds or stage. The story is the robot.
- **Media**: `Sharing/5G_Surface_Skimmer_Sewer_Simulation.mp4` (4.8 MB, 720p, used as is), `sewer_interior_robot.png`, `sewer_section_5g_cpe.png`, `sim/skimmer_still_1280x720.png` and the CAD thumbnail. The 30 MB `round2_flow_1080p.mp4` will be cut to a short, small clip, or left out.
- **3D bay**: the vessel is built in three.js to the body-map dimensions, inside a box sewer (2400 × 2200 mm, 750 mm of flow) with the manhole relay. The scroll story goes: skim → sense → link → link-loss fallback.

### New: Solar Sailor, an Alexa skill
Source: `Projects/Personal/Alexa-Chat`.

- **What it is**: an Alexa skill, built for personal use. You say "Alexa, open Solar Sailor", ask a question, and an OpenAI model answers through a Cloudflare Worker. The session stays open for follow-up questions. It also schedules lights and the AC through the existing Alexa account links.
- **Build**: TypeScript Worker with the cf CLI. Every request is checked before any paid call: Alexa signature and certificate chain, the expected skill, the owner account, a seven-second deadline and request-ID deduplication. A persistent SQLite budget ledger caps spending at $2 a month, tracked in microdollars. Smart-home control goes through Tuya and Alexa.
- **Testing**: 202 Vitest tests plus 6 Workers networking checks, a strict typecheck and a production build.
- **Left out on purpose**: the Worker URL, deployment and account IDs, device names, and the note that the smart-home adapter uses undocumented Amazon endpoints (it can be called "experimental" without saying why).
- **Approved to show.** Media: the folder has no photos; until you send an Echo photo or screen recording, the case study uses a diagram of the request path.
- **3D bay**: an Echo speaker on the plinth with a voice ring. The scroll story follows one question: voice → signature check → budget reserve → model → spoken answer.

### Placeholders: projects 10, 11 and 12
- Each gets a plinth, a "Coming soon" card and a neutral crate object, plus an entry in `PROJECTS` with `placeholder: true`. That one flag hides them from the Work grid, the timeline and search, and stops them opening a case study.
- When you send the details, filling one in means replacing that entry and, if it has one, adding a bay file.

### Timeline additions
- 2026 · 5G Sewer Skimmer (in build).
- 2026 · Solar Sailor (Alexa skill).

## Stages

Each stage ends with headless screenshots at 1440 × 900 and 412 × 915 (light and dark) and an update to the private prototype artifact for you to check. The next stage starts after you sign off.

### 0. Set up v5 (small)
- Copy `prototype/v4/` to `prototype/v5/`; v4 stays as it is for comparison.
- `assemble5.py` and `mktest5.py`, writing `living-lab-v5.html`.
- Move the screenshot scripts (`shot.js`, `seq.js`: lab, flight path and contact at several scroll points, phone and desktop) into `prototype/` so every stage is checked the same way.

### 1. Tokens and type
- One set of CSS variables per theme and mode: page, surface, ink, secondary, accent, accent text, button text, plus the 3D set (terrain base, contour line, link line, packet).
- 3D colours come from the same variables. `tintWorld` and `ACC_KEYS` in `scene.js` are replaced by named material slots (`link`, `packet`, `pin`, `hot`) that read the active theme, so no colour is hard-coded in a bay. In light Bottle and yellow, link lines use the bottle green and packets the yellow.
- Type scale, five steps: 14 / 17 / 21 / 40 / 80px (display 48 → 80 with viewport). Body 17 / 1.47. Weights 400 and 600.
- Remove Geist, Geist Mono and Archivo Narrow. Numbers use Switzer's tabular figures instead of mono.
- Done when: no text under 13px, one family in use (plus the terminal mono), contrast at least 4.5:1 for all text in every theme and mode.

### 2. Settings panel
- Replaces the palette button and panel (`palette.js`). One "Settings" button in the header opens a sheet:
  - Theme: the eight themes as swatches, Bottle and yellow first and marked default.
  - Appearance: System, Light, Dark.
  - Experience: 3D or Lite.
  - Sound: on or off (the word, not ♪).
- Choices are saved on the device. A first visit gets Bottle and yellow, appearance from the system, and 3D (Lite if the device is slow or the user prefers reduced motion).
- Opens instantly from the keyboard; 240ms from a tap (see stage 4). Every control 44px. Closes with Escape and on a tap outside.
- Done when: switching theme or mode updates the page and the 3D world in the same frame, with no reload.

### 3. Taste and Apple clean-up
- Remove: eyebrows and index numbers ("01 · The lab", 01–07 on tiles, chips and tags), the custom "Open case study" cursor, the "Open to work" status dot (replaced by a Contact link), glass captions on photos (captions go below), every blurred surface except the header.
- Copy: no em dashes, no stock phrasing. Headings carry the meaning.
- One visible h1 on the first screen: the name and what you do.
- Interaction and motion: handled in stage 4.
- Phone: 44px targets everywhere, `100svh` hero, `100dvh` shells, `theme-color` per theme and mode, safe areas.
- Done when: Taste's inspector shows 0 fails at 1440, 768 and 412px (with any warnings written down with a reason).

### 4. Motion pass
Every animation gets a job (feedback, showing where something came from, or explaining the project) or it goes. One set of tokens drives CSS, the Web Animations calls and the 3D camera, so the page and the world move the same way.

**Tokens** (added to the stage 1 token file):

| Token | Value | Used for |
| --- | --- | --- |
| `--dur-1` | 120ms | Press feedback, small fades |
| `--dur-2` | 180ms | Hover reveals, labels, tag changes, sheet close |
| `--dur-3` | 240ms | Settings sheet open, card swaps, theme change |
| `--dur-4` | 400ms | Large surfaces: chapter cards, case-study panel |
| `--dur-5` | 640ms | The photo flight into a case study (rare, illustrative) |
| `--ease-out` | `cubic-bezier(.23,1,.32,1)` | Anything entering or leaving |
| `--ease-in-out` | `cubic-bezier(.645,.045,.355,1)` | Anything already on screen that moves or resizes |
| `--ease-drawer` | `cubic-bezier(.32,.72,0,1)` | The Settings sheet and phone panels |
| `linear` | | Progress bar and the ticker only |

Exits run at about 75% of their entry time. Only `transform` and `opacity` animate; `will-change` is set only while something is moving.

**What changes, from what v4.2 does today:**

1. **Scroll-driven camera.** Today the camera follows scroll with `x += (target − x) × dt × 4` and spin momentum decays by 0.92 per frame, so a 120Hz phone moves differently from a 60Hz laptop. Both become frame-rate-independent damping (`1 − e^(−k·dt)`), tuned once.
2. **Chapters hold, then move.** Today the camera is always in motion between chapters (`ease(sp − i)` across the whole section). Each chapter will hold still for its middle 40% so the card can be read, and travel only in the gaps, with in-out easing. Wheel steps and trackpad flicks then land on a still frame instead of mid-flight.
3. **One idle motion at a time.** The camera bob, Nephele's head turn, the hologram spin and the hull bob all run constantly. Keep only the motion of the object in focus; everything else rests. The CSS loops (swarm dots blinking, the scroll-hint nudge) go; the ticker stays, linear, and pauses on hover and when off-screen.
4. **Work grid hovers.** Today hovering grows rows and tiles with `flex-grow`, reveals captions with `max-height`, and zooms photos over 1.2s. The tile sizes become fixed (the layout no longer shifts under the cursor); hover lifts the photo with `scale(1.03)` over 240ms and fades in the one-line summary below it (captions move below photos in stage 3). Press is `scale(.97)` for 120ms on every tile and button. Hover only on `(hover: hover) and (pointer: fine)`.
5. **Photo to 3D.** The photo flight into a case study animates `left/top/width/height` today. It becomes a FLIP move (translate and scale, with `clip-path` for the aspect change), 640ms ease-out, then the photo dissolves into the live 3D bay over 400ms as the camera settles. Going back plays the same path in reverse at 480ms, landing on the tile you came from.
6. **Chapter cards.** Cards fade and rise 12px over 400ms as their chapter arrives and fade out faster as it leaves (on phone this replaces the current scroll-linked fade). Card text never moves on its own while you read.
7. **Labels and pins.** 3D labels fade in over 180ms with a 4px rise; on the flight path the track draws itself as the camera rises, and pins appear in year order 40ms apart. No pop or bounce.
8. **Settings sheet.** Opens with `--ease-drawer` over 240ms (from the button on desktop, from the bottom on phone, scale from .96 not 0), closes in 180ms. Opened from the keyboard it appears instantly. Switching theme cross-fades page colours over 240ms and moves the 3D materials to the new colours over the same 240ms, so both change together.
9. **Ring of plinths (built in stage 5 on these rules).** Scrolling moves the camera around the ring and it settles on each plinth with the same hold-then-move rhythm; the front plinth's light comes up and its name and Open button fade in over 180ms; the others dim to 60%. Drag on desktop and swipe on phone turn the ring with momentum and snap to the nearest plinth with a spring (no bounce), and can be interrupted mid-turn.
10. **Interruptions.** Every transition can be reversed mid-way: CSS transitions instead of keyframes for state changes, Web Animations handles cancelled on route change, and the camera always eases from where it is, never from where it was going.

**Reduced motion.** Today it turns off every transition, which also kills fades and leaves some content popping in. Instead: fades and colour changes stay (120ms), camera flights become cuts, idle motion and the ticker stop, the photo flight becomes a cross-fade, and nothing starts hidden.

**How it's checked.** Frame-by-frame screenshot strips of the five main moves (hero to lab, lab to flight path, opening a case study, going back, switching theme) at 60fps on desktop and a throttled phone profile, compared before and after. A short screen recording of each for you to judge the feel.

Done when: no animation in the prototype uses a value outside the tokens, nothing animates layout properties, the camera feels the same at 60Hz and 120Hz, and the reduced-motion pass shows every piece of content.

### 5. The ring of plinths
- The bench stays at the centre with the drone on it. Each of the 12 projects gets a plinth on a ring around it (radius about 3.2, 30° apart; the ring is built from `PROJECTS`, so adding a project adds a plinth).
- Plinths are ordered by year, so each flight-path pin lands at the foot of its own project.
- Lab chapter: scrolling turns the ring (the camera orbits) and brings one project to the front at a time. The front plinth gets the name and an "Open" button; the others show only their object. On phone only the front one is labelled.
- Flight-path chapter: the camera rises over the ring; the track runs round the outside; pins alternate heights; items without a project (Now, M.E. at SSN) sit on the track between plinths.
- New projects get a bespoke object: the sewer skimmer vessel and the Echo. The three placeholders get a crate and a "Coming soon" card, so the ring never has a gap.
- Opening a project still flies into its bay from its plinth; the bench objects (Nephele, WaterBot, the THz filter and so on) move from the bench to their plinths.
- Budget on phones: pixel ratio up to 1.5, under 50 draw calls in the ring view (shared plinth geometry, instanced pins), shadows only on the front three plinths, render paused when idle or off-screen.
- Done when: all 12 plinths read clearly at 412px, labels never overlap, and phone frame time stays under 8ms on the screenshot harness's throttled profile.

### 6. New case studies
- Sewer Skimmer and Solar Sailor: case-study content, media and 3D bays as described under Content.
- Swarm project: add the Paper chapter, figures and the two-path bay addition.
- Done when: both new case studies run the full photo-to-3D morph on desktop and phone, and work in Lite mode and the print view.

### 7. Tamil name lockup
- "Charan Velavan" with the Tamil name beside it in the hero and the footer, Anek Tamil loaded with only the needed letters (Google Fonts `text=` subset).
- The Tamil text is marked `lang="ta"` and is read by screen readers once.
- Done when: the lockup fits on one line at 412px and shows no fallback flash.

### 8. Check and hand over
- Full screenshot pass: home chapters, all seven case studies, Lite mode, print view, light and dark, desktop and phone.
- Taste inspector and linter, keyboard-only pass, reduced-motion pass.
- Update `design/README.md` and the rebuild plan page; publish the prototype artifact.
- Then phase 3 (Figma) can start from v5's tokens.

## Questions before or during v5

1. Optional: an Echo photo or screen recording for Solar Sailor.

Answered: Tamil spelling சரண் வேலவன். The ITU paper is a draft, so the site only says one is being written. Co-authors can be named. The Sewer Skimmer case study is about the project; the hackathon gets one line. Solar Sailor can be shown, and it is presented as an Alexa skill first. Your Sewer Skimmer role is the Fusion 360 CAD and the simulation video. Burnt sienna stays in Settings as it is. The four draft "What went wrong" entries (Bird's AI, Nephele 2.0, 5G O-RAN, WaterBot) are dropped; the three confirmed ones stay.

## Progress

- **Stage 0 done.** `prototype/v5/` copied from v4.2; `assemble5.py` writes `living-lab-v5.html`, `mktest5.py` writes `test-v5.html`; `prototype/tools/check.sh` runs the standard screenshot pass (hero, lab, flight path, contact × desktop/phone × light/dark) with `shot.js` and `seq.js`. Draft "What went wrong" entries removed from `v5/cases.js`.
- **Stage 1 done.** Switzer 400/600 everywhere (inlined at build from `.fontcache/`, git-ignored with the built pages); terminal and code use the system mono; Geist, Geist Mono and Archivo Narrow are gone, including from the 3D screen textures. Five sizes (`--t1`–`--t5`: 14 / 17 / 21 / 30–40 / 48–80), body 17/1.47, nothing under 14px. Themes live in `v5/settings.js`: eight themes, each with light and dark values; cards, lines and the 3D ground are derived. The 3D world uses named colour slots (`SLOT.link`, `SLOT.packet`) recoloured from the theme. `tools/contrast.js` checks 11 text pairs in all 16 theme/mode combinations; all pass 4.5:1 after darkening the accent text (not the button fill) in Blueprint, Stone and sage, and Signal light.
- **Stage 2 done.** The palette, 3D and sound buttons are replaced by one Settings button (and the S key) that opens a sheet with Theme, Appearance (System/Light/Dark), Experience (3D/Lite) and Sound (On/Off). It opens in 240ms from a tap or instantly from the keyboard, closes with Escape, Done or a tap outside, and returns focus to the button. Every control is at least 44px. `tools/settings-check.js` confirms that the page background, the 3D sky and the browser `theme-color` match after every switch, with no reload and no errors.
- **Stage 3 done.** Eyebrows, index numbers (tiles, chips, labels, stats, lists), the custom cursor, the "Open to work" dot, the profile tilt, glass, outlined boxes, hairline dividers, shadows at rest, the dashed tile and uppercase labels are gone. The first screen's one h1 is the name, with what you do in the line under it; each case study's cover title is its h1. Grid captions sit below the pictures; case-study media captions too. 66 em dashes rewritten by hand. Phone: 44px targets everywhere (header, chips, tabs, buttons), `100svh` hero, the keyboard-help button hidden on phones. `tools/taste-audit.js` (a local stand-in for Taste's inspector) reports 0 fails at 1440, 768 and 412px on the home chapters and case studies. Two things it can't judge and that Taste would likely warn about: the 3D chapters leave the canvas side "empty" (the 3D fills it), and the case-study cover keeps its title on the photo over a dark scrim (not glass).
- **Stage 4 done.** Tokens `--dur-1`–`--dur-5` (120/180/240/400/640ms) and `--ease-out`, `--ease-in-out`, `--ease-drawer`; every transition uses them and only transform and opacity move (colour fades excepted). Camera smoothing and drag momentum are frame-rate independent (`damp()`); the camera holds still for the middle 40% of each stop. The grid no longer resizes under the cursor: hover lifts the picture 3% (fine pointers only), press is `scale(.97)` on every tile and button. The photo flight is a FLIP move (transform plus `clip-path`), 640ms in and 480ms back to the tile it came from. Chapter cards fade and rise 12px. The flight path draws itself, then its pins come up in year order 40ms apart. The Settings sheet closes with a 180ms fade; a theme change cross-fades the page and moves the 3D colours over about 240ms. The tickers pause off screen and under the pointer; the blinking dots and the nudging hint are gone. Reduced motion keeps 120ms fades, cuts the camera, stops loops and hides nothing. `tools/motion-strip.js` captures frame strips of the five main moves.
- **Stage 5 done.** `RING` (cases.js) lists 12 plinths in year order: WaterBot, DEMS, Bird's AI, Nephele, 5G O-RAN, THz filter, UAV swarm, 5G Sewer Skimmer, Solar Sailor and three "Coming soon" crates. `ring.js` builds a plinth per entry (30° apart, radius 3.2): the bench objects moved onto their plinths, Bird's AI's plinth holds a patch of the test field with a detection box (the drone stays on the bench), and new models for the skimmer (catamaran, ramp, basket, gantry) and the Echo. The lab chapter has one scroll stop per plinth; the camera orbits round the ring and holds on each one; the front plinth lights its lip, lifts its object, gets the only label (Open, "Case study soon" or "Coming soon") and is the only thing with idle motion. The flight path is a circle outside the ring with each pin at the foot of its project. Rendering stops while the hero covers the screen.
  - Not met yet: draw calls are 150–230 in the ring view (target under 50 on phones); the bench drone alone is about 150 meshes. Merging each plinth object and a single-mesh stand-in for the drone on the home page would fix it. Phone frame time could not be measured meaningfully in the software-GL harness. The "others dim to 60%" idea was left out (front plinth highlight and the single label carried it).
  - Assumed: Nephele's place in the year order (2024, between Bird's AI and the O-RAN testbed).
- **Hero column (after stage 5, your call).** The hero's left column is back to the v4 design: portrait card with "Open to work", tilt, the 05–01 stack list with lines. Taste's audit flags it (numbering, shadow, hairlines); that is deliberate and the only home-page failure.
- **Stage 6 done.** Two new case studies with media and bays. 5G Sewer Skimmer (`bay-ss.js`): a cut-away box sewer at half scale with the catamaran built to the CAD dimensions; chapters for the hull, skimming (debris rides the ramp into the basket), sensing (light, sonar pings, gas into the louvre), the 5G link through the manhole relay to an edge server, link loss (hold, retry, back to the checkpoint) and a "What is real" table. The simulation video opens the Overview, captioned as a simulation. Solar Sailor (`bay-sa.js`): the Echo on a side table, then one question through Alexa, the Worker's six check lights, the budget ledger (reserve, then settle), the model and back as speech; the lamp and AC for scheduling; a 202-square test board. Its cover is a render of the bay (no photo yet). The swarm case has a "Two paths" chapter (MBOS, classifier on 10,000 samples at 99.65%, results in words, the paper line, collaborators), eight new figures, and a broadcast tower and 5G cell in its bay. Nine projects in the grid; counts come from `PROJECTS`. Both new case studies run the morph on desktop and phone and work in Lite and print. The 30 MB `round2_flow_1080p.mp4` was left out.
- **Stage 7 done.** சரண் வேலவன் in Anek Tamil 600, subset by Google Fonts to just those letters (2 KB) and inlined at build, so there is no fallback flash. It sits beside the name on the hero card (one line at 412 and 360px; on the narrow desktop card it takes the next line) and in the footer, marked `lang="ta"`.
- **Stage 8 done.** Standard 16-shot pass, every case study opened on desktop and phone with no errors, Lite and print for the new ones, Taste audit 0 fails on all case studies (home fails only on the restored hero column), settings check clean, contrast at least 4.5:1 in all 16 theme/mode pairs, keyboard pass (59 focus stops, all with a visible ring; Escape now returns focus to the tile that opened the case study), reduced motion (Lite by default, nothing hidden). The ▶ on video tiles became an SVG icon. New tools: `chapters.js`, `stop.js`, `lite.js`, `a11y.js`, `grid.py`.
  - Still open: draw calls in the ring view (150–230); phone frame time not measured in software GL; the prototype artifact is not republished (only on your say-so).


## Not in v5

- Shipping anything to the live site, including the finished phase 0 fixes.
- Figma frames (phase 3) and the Next.js build (phase 4).

## Lab layouts (built, checked and republished 2026-10-21)

You asked for every lab design to compare: a **Lab layout** switch in Settings (Ring, Carousel, Tower, Shelves, Sites). It switches live, with no reload, and the choice is kept in `localStorage` (`lab-layout`). In every layout a click on an object opens its case study, and the drone on the bench opens Bird's AI. In the carousel you drag to turn it and zoom with a pinch, ctrl + scroll or the +/− buttons.

- Code: `v5/layouts.js` (loaded after `ring.js`); hooks in `frame.js` (`homeKey`/`homeCam` ask the layout, `LAY.front`/`LAY.settled`/`LAY.frame`/`LAY.tl`, holder height from `p.base`), `ring.js` (plinths keep `ped`, `lip`, `base`, `objTop`), `settings.js` (`onLabLayout`), `body.html` (Settings section), `extra.css` (`#zoomctl`, `.seg.wrap`).
- Tests (run each on its own; in parallel SwiftShader slows and the timings read wrong):
  - `node tools/layouts.js test-v5.html shots/v5-layouts desk|phone [layout...]`: stops, flight path, click to open, and for the carousel a slow drag, a flick, the way back, a pinch (phone), the zoom buttons.
  - `node tools/layout-checks.js test-v5.html [layout...]`: draw calls, flight-path pins on screen, keyboard focus never on something hidden, reduced motion with 3D chosen.
  - `mktest5.py` now also exposes `window.__car`, `window.__lays` and `window.__project` (test build only).

### Bench layout (added 2026-10-21, published as artifact version 10)
You asked for the projects next to the table, as a workbench, like v4 had. **Bench** is now the second option in the switch, after Ring.
- **Layout:** an L of workbenches round the desk. The back bench (6 m, with a pegboard wall) holds, left to right: THz filter, DEMS, O-RAN radio, UAV swarm, Echo and the Bird's AI field patch. The right-hand bench holds WaterBot, the sewer skimmer and one crate. Nephele stands on the floor at the left end; two crates are stacked on the floor at the front right. The drone stays on the desk, and clicking it still opens Bird's AI.
- **Camera:** it pans left to right along the benches, slightly above them, and stands further back for tall objects (Nephele). The flight path has its own shot on desktop and on phone.
- **Settings:** the six layout buttons sit in two rows of three on every screen.
- **Results:** a click opens the right case study on desktop and on phone, with no errors. Draw calls: overview 218, a stop about 20, flight path 232. Keyboard and reduced-motion checks pass.
- **Still open:** in the flight-path shot only 4 of 10 pin labels show, because the pins along the back bench sit close and overlap. On phone the whole lab is wider than the screen, so the far edge of the side bench is clipped.

### What changed on 2026-10-21
1. **Carousel drag fixed.** The old release kept the throw speed per pointer move with no cap, so a 300px drag flung the ring about nine plinths. The label also waited for the speed to fall under 0.002, about 3.5s, and the ring then came to rest on a "Coming soon" crate. Now the throw speed is measured over time and smoothed. Release picks the plinth the throw would reach, at most three away, and eases there (`car.snap`). The label shows once the ring is within 12% of a plinth of that target, so it no longer flashes over plinths it is passing. Reduced motion snaps with no glide. A pinch that starts mid-drag also snaps.
2. **Carousel zoom** now pivots on the front object, so zooming in keeps it beside the card and no longer pushes it off the right edge. Zoom range is 0.55–1.6.
3. **Tower** moved back to z −4.6: the ground-floor camera had been standing inside the bench. Floor names now show in close-up, on the back wall between the card and the project. The tower has its own flight-path camera (square on, not from above), so all five floors are in frame on desktop and phone.
4. **Shelves** camera is higher, so the counter no longer fills the lower half of the frame.
5. **Sites** pads have concrete sides, with the site's surface on top only.
6. The **flight-path wide shot** (Shelves, Sites) sits further left of the card.
7. **Phone:** the zoom buttons moved to the top right, under the header, because the chapter card covered them at the bottom.
8. **Settings row:** `.seg.wrap` uses a 23px radius once it wraps (button radius plus padding), and on a phone it breaks 3 + 2, never 4 + 1.
9. **Keyboard:** the zoom buttons were in the tab order while hidden, in every layout. They now use `visibility` with the fade.

### Results (desktop 1440×900 and phone 412×915, no page errors)
- In all five layouts, clicking the front object opens the right case study, on desktop and on phone. Carousel: a slow drag of one plinth brings up the next project; after a flick the label shows in about 0.5–1.1s; pinch zooms (zoomT 1.00 → 0.55) and the page does not scroll.
- Draw calls (overview / stop / flight path): Ring 216/176/250, Carousel 142/138/252, Tower 147/62/247, Shelves 226/24/233, Sites 13/14/233. The flight path is the heaviest shot in every layout, and none is above Ring's.
- Reduced motion with 3D chosen: the front label is up at once, and the carousel lands on the next plinth within 250ms of a drag.
- Keyboard: 20 tabs from the chapter card land on nothing hidden.

### Still open
- Flight-path labels: overlap culling hides some (Ring 7/10, Tower 8/10, Shelves 5/10, Sites 7/10). The pins are all there, but Shelves loses the most because its wall is long and seen at a slant; on a phone the wall is small at the top of the frame.
- Once you drag the carousel, the front project no longer matches the chapter card. Scrolling turns it on from wherever you left it. It can come to rest on a "Coming soon" crate, which opens nothing (as intended).
- The carousel has no arrow-key turn; keyboard users turn it by scrolling.
- The click in the test sometimes needs to land 80–240px below the label (thin objects such as antennas leave gaps); people can also click the label itself.
- Republished on 2026-10-21 (artifact versions 9 and 10).
