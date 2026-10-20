# Design work for the portfolio rebuild

Design-stage files only. Nothing here is part of the Next.js site, and nothing in `src/` was changed. Kept in the repo so the work can move between machines.

## What is here

| Folder | What it is | Published copy |
| --- | --- | --- |
| `prototype/` | The "living lab" 3D prototype (v4.1): case studies that morph into a three.js bay on scroll, Lite mode, palette picker | https://claude.ai/artifact/NP22ZKDD3kvWC7WdFpturP |
| `plan/` | The rebuild plan: audit against Taste Skill, Emil Kowalski's skills, Apple HIG and the 3D skills, with a palette and font previewer | https://claude.ai/artifact/TPoabY2sdZEjqJdPHwYaaN |
| `boards/` | Claude Design canvas for the Bird's AI morph (laptop, phone, timing boards). Images are blob references on the canvas, not local files | https://claude.ai/artifact/76d39vCikNfHLoFYyQ5zPA |
| `research/` | Digests of each skill's rules, the Taste inspector reports for the live site and the prototype, and the contrast checker | |

Figma file for the later port: https://www.figma.com/design/pIvwgrurD9hr5QPc091TGx

## Prototype

Source lives in `prototype/v4/`. The build concatenates it into one page:

```bash
cd design/prototype/v4 && python3 ../assemble4.py   # writes prototype/living-lab-3d.html
cd .. && python3 mktest.py                          # wraps it as test.html for local browsers
```

Open `test.html` through a local server (for example `python3 -m http.server` in `design/prototype`) so the textures, video and the three.js import map load. It reads `img/`, `media/` and `og/` relative to the page.

- `v4/cases.js`: all case-study content (`CASES`), plus projects, skills and timeline data.
- `v4/ui.js`, `v4/palette.js`: page UI, routing (`#/projects/<slug>`), Lite mode, palettes.
- `v4/scene.js`, `v4/core3d.js`, `v4/frame.js`: the shared 3D world and the scroll engine.
- `v4/bay-*.js`: one 3D bay per project (ba Bird's AI, ne Nephele, sw UAV swarm, tz THz filter, or 5G O-RAN, de DEMS, wb WaterBot).
- `files.json`: the publish map used for the artifact.

The test scripts (`quick4.js`, `tour.js`, `func4.js`, `morph.js`, `pal.js`, `audit.js`, `ogmake.js`) use Playwright and write screenshots to `prototype/shots/` (create it first). `sheet.py` makes contact sheets from those shots.

## Plan page

```bash
cd design/plan && python3 build.py   # needs Pillow and network access
```

`build.py` fetches Switzer from Fontshare at build time and inlines it with four prototype photos. The output, `rebuild-plan.html`, is git-ignored because Switzer's licence does not allow redistributing the font files through a public repository.

## Status and next steps

The prototype is waiting on sign-off. Open decisions are listed at the end of the plan page:

1. Pick a palette and a type system (recommended: Blueprint with Archivo).
2. Confirm whether this repo is public (affects Switzer).
3. Decide whether the scroll morph runs on all seven projects or only Bird's AI and Nephele.
4. Decide on a Tamil name lockup.
5. Decide whether to start phase 0, the live-site fixes.
6. Confirm the draft "What went wrong" entries and the Nephele LiDAR and ROS2 text.
