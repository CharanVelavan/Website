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

v5 (stages 0–8 done, see `plan/v5-plan.md`) lives in `prototype/v5/` and builds the same way. Switzer is inlined at build time from Fontshare, so the built pages and the font cache are git-ignored:

```bash
cd design/prototype && python3 assemble5.py && python3 mktest5.py   # writes living-lab-v5.html and test-v5.html
tools/check.sh shots/<name>                                         # standard screenshots: 4 sections × desktop/phone × light/dark
node tools/taste-audit.js test-v5.html ['#/projects/Birds-AI']      # local Taste-style audit at 1440, 768 and 412px
node tools/settings-check.js test-v5.html <outDir>                  # every theme and mode, page and 3D in step
node tools/motion-strip.js test-v5.html <outDir>                    # frame strips of the five main moves
node tools/contrast.js v5/settings.js                               # text contrast in all 16 theme/mode pairs
node tools/chapters.js test-v5.html <outDir> '#/projects/<slug>' desk|phone [dark]   # every chapter of one case study
node tools/stop.js test-v5.html <outDir> desk|phone 7 8             # the lab held on plinth k (year order)
node tools/lite.js test-v5.html <outDir> '#/projects/<slug>'...      # Lite page and print PDF per case study
node tools/a11y.js test-v5.html <outDir>                            # keyboard-only and reduced-motion checks
python3 tools/grid.py out.png <cols> <width> img...                 # contact sheet
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

1. Decided: Switzer, Bottle and yellow by default, every other palette as a theme in Settings.
2. Answered: the repo is public, so Switzer loads from Fontshare and is never committed.
3. Decided: the scroll morph into 3D runs on all seven projects.
4. Decided: add a Tamil name lockup (Anek Tamil, loaded only for those letters).
5. Phase 0 (live-site fixes) is done in `src/`, not yet committed or deployed.
6. Confirm the draft "What went wrong" entries and the Nephele LiDAR and ROS2 text.
