# Lab rebuild plan: an explorable 3D engineering lab as the home page

Status: stage 1 done (2026-10-21), published as artifact version 11; waiting for your sign-off before stage 2. Nothing ships: no commits, pushes or deploys until you say so.

## The goal (your words, tidied)

The home page is your lab: a warm engineering workshop like your reference image.
- **Explore (no scrolling):** visitors move round the room freely, like a real 3D room. They look around, walk up to any bench, zoom in on any project, and select it.
- **Tour (scrolling):** scrolling instead gives a guided walk through the lab, from the door to each project in turn, the way you'd walk someone round your room.
- **Near a project:** when the visitor gets close to or points at a project, its name appears (Bird's AI, Nephele…).
- **Click a project:** an overview opens right there in the lab, with images, media, a short overview, recognition and links. The camera holds on the object beside it.
- **Open the case study:** from that overview, the visitor opens the case study you have now (photo → 3D bay → scroll chapters), with better models and motion.

This covers the home page / hero and the case-study animation. The rest of the site isn't part of this plan.

## What the photos tell me (the models follow the real hardware)

| Project | Real object, from your photos | Exhibit in the lab |
| --- | --- | --- |
| Bird's AI | F450-style quad: red and white arms, black landing gear, white prop guards, GPS mast, flight controller and wiring on top | Hero, on a mat in the middle of the front bench |
| Nephele 2.0 and 3.0 | 2.0: black faceted cylinder with "NEPHELE 2.0", a white head box with a camera and a screen face (white eyes), on a round wheeled base. 3.0: white S-curve body with a tablet face (green eyes) | Standing side by side on the floor at the left end, as in the photo |
| DEMS | STM32MP135F-DK board with its LCD running a Weston/Wayland terminal | Back bench, with a laptop next to it showing the Yocto build |
| Solar Sailor | Echo Dot with the clock face | Front of the bench (the photo also puts it beside the DEMS setup) |
| THz filter | CST model: a square substrate with a front metal layer, two feed lines (#1, #2) and the recursive fractal resonator, from your paper's figure | Back bench, under a stereo microscope, with the S-parameter plot on a monitor |
| WaterBot | White foam-board box hull with a hinged mesh intake flap at the front, red tape on the seams. Inside: two batteries, an ESC and a probe. On top: the electronics plate (Arduino Uno, LoRa board, HC-05, wiring) | In the glass water tank, the boat built as it really is |
| O-RAN testbed | USRP and mini PC, from the case-study images | Back bench, with a spectrum monitor |
| UAV swarm | — (it's a simulation) | Terrain diorama with drones on rods, on the left bench |
| Sewer Skimmer | CAD model (already in the case study) | In a sunk water channel in the right bench |
| 10–12 | Coming soon | Acrylic cases on the top shelf |

## What I'll import

All libraries are loaded from jsDelivr with exact pinned versions, checked when I add them. None are in the repo.

| What | Why |
| --- | --- |
| **three.js** (stays at 0.160.0) plus its add-ons: `GLTFLoader`, `DRACOLoader` / meshopt decoder, `KTX2Loader`, `RGBELoader` | Load the real models, compressed geometry and textures, and an HDR light probe |
| **camera-controls** (yomotsu) | One camera for everything: free look, orbit, dolly, smooth fly-to between points, room boundaries, and touch gestures |
| **postprocessing** (pmndrs) and **N8AO** | Ambient occlusion, bloom on screens and LEDs, depth of field when focusing, SMAA anti-aliasing, tone mapping, vignette |
| **three-mesh-bvh** | Fast picking with many meshes, and collision so the camera can't walk through benches or walls |
| **GSAP 3** with **ScrollTrigger**, plus **Lenis** | The scroll tour, panel and label motion, and the case-study chapter transitions. GSAP is already in the site's stack. |
| **Poly Haven** (CC0) | An interior HDRI for light and reflections; props (plants, lamps, chair, books, mug); wood, metal and concrete textures. Every asset is listed in `design/prototype/CREDITS.md`. |
| **Blender** (through its MCP connection, with Blender open on your Mac) | Model the hero objects from your photos, bake light and AO into the room, and export glTF |
| **gltf-transform** (dev tool only, not shipped) | Compress the exports: meshopt geometry and WebP/KTX2 textures |

## What I'll build

### 1. The room
- Layout: a U-shaped bench with a window on the left, the top shelf and pegboard at the back, a whiteboard on the right and a floor to walk on. It follows your reference image's composition.
- Day and night: the light theme is the room by day, through the window. The dark theme is the same room at night, lit by the lamps and screens.
- Models: the hero objects come from Blender, matching the photos above. Props are CC0, and the room's light is baked so it looks rich and runs fast.

### 2. Explore mode (the default, no scrolling needed)
- **Desktop:**
  - Drag to look round, click the floor (a ring marks where you'll go) to walk there, and WASD or arrow keys to move.
  - Pinch, ctrl+wheel or +/− to zoom, and double-click an object to fly up to it.
  - Collision stops you walking through benches and walls.
- **Phone:** drag to look, tap the floor to move there, pinch to zoom, and tap an object to go to it.
- **Toolbar:** Overview (a list of every project, which is also the keyboard and screen-reader route), Tour, Reset view, and a hint ("Drag to look · Click floor to move · Click any project").

### 3. Tour mode (scroll)
- Scrolling moves the camera along a set path: in through the door, an establishing view of the room, then each project in turn (01 → 12), ending at the desk with contact details.
- Scrolling back reverses it. Any drag or click drops you into Explore from wherever you are.

### 4. Near and hover
- Within about a metre of a project, or when you point at it, the project gets a rim glow and its name chip ("01 Bird's AI") fades in with a leader line. Everything else dims a little.
- Labels never overlap: the nearest one wins, and they hide behind other objects.

### 5. The overview panel (in the lab)
- Clicking a project flies the camera to a close-up. A panel then slides in: on the right on desktop, as a bottom sheet on phone.
- The panel holds a media strip (photos and clips, opening in the lightbox), the one-line summary, quick facts (built, result, my part), recognition (awards and papers), and links.
- **Open case study →** opens the full case study. Previous and next buttons move to the neighbouring project, with the camera gliding between them. Esc closes the panel.

### 6. The case study (the current flow, enhanced)
- The flow stays the same: the photo morphs into the 3D bay, and scrolling walks through the chapters.
- The bays switch to the new models, lighting and post-processing.
- Motion gets smoother: GSAP-driven camera moves with springs, and chapter text that reveals line by line.
- Opening a case study starts from the lab close-up, so it reads as one move.

### 7. Motion standard
- Camera moves take 0.7–1.1 s and UI moves 150–250 ms, on springs rather than linear easing.
- Every object has quiet idle life:
  - Bird's AI: props turn, LEDs blink.
  - Nephele: both robots blink, and 2.0 turns its head toward the visitor.
  - WaterBot: water ripples and the boat bobs.
  - Sewer Skimmer: its channel water flows.
  - DEMS: the LCD terminal types.
  - Solar Sailor: the Echo clock shows the time.
  - O-RAN testbed: the spectrum moves.
  - UAV swarm: packets run between the drones.
- Reduced motion: cuts instead of flights, no idle loops and no depth of field. The Lite page stays as the fallback.

### 8. Phone, performance, accessibility
- 60 fps on a mid laptop and at least 30 fps on a mid phone, with under about 150 draw calls.
- Models are about 6 MB on desktop and 3 MB on phone, loaded after the first paint.
- When a device can't keep up, it drops effects in steps: post-processing first, then shadows, then idle animation.
- Every action has a keyboard path, and the Overview list mirrors the room for screen readers.

## Stages (each ends with screenshots and an artifact update for your sign-off)
1. **Greybox room and controls (medium):** the room in simple shapes, Explore and Tour, labels, and the overview panel with real content. *Checkpoint:* composition and navigation feel right before any modelling.
2. **Light and post (medium):** the HDRI, shadows, AO, bloom and depth of field, with day and night.
3. **Models (large):** Bird's AI first, for you to approve the look; then Nephele 2.0 and 3.0, WaterBot, DEMS, the Echo, the THz filter, the O-RAN testbed, the swarm diorama, the skimmer, then the room and props.
4. **Life (medium):** idle animation and the water, screen and LCD shaders.
5. **Case-study upgrade (medium):** the new models in the bays, and the enhanced chapter motion.
6. **Phone, performance and accessibility (medium):** tuning and checks.
7. **Clean-up (small):** delete the ring, `layouts.js` and the Lab layout switch.

## Stage 1 result (2026-10-21)

Your answers: Nephele 3.0 is part of the Nephele case study and stands beside 2.0; keep the figurine; CC0 props are fine; the THz filter is shown as in your paper.

**Built (in `prototype/v6/`, a copy of v5 so v5 stays to compare)**
- **Files:** `v6/lab.js` (new); hooks in `frame.js` (camera, labels, scope), `layouts.js` (tap) and `ui.js` (the Open my lab button); markup and CSS in `body.html` and `extra.css`.
- **Build:** `python3 assemble6.py` writes `living-lab-v6.html`, and `python3 mktest6.py` writes `test-v6.html`. Test with `node tools/lab.js test-v6.html shots/v6-lab desk|phone`.
- **The room:** a greybox with a back bench, left and right benches, the top shelf with three acrylic cases, a window, a pegboard, a whiteboard, lamps, plants, a stool and the figurine. Each project stands where the plan puts it. Nephele 3.0 is a white S-curve body with a green-eyed tablet face. WaterBot sits in a glass tank and the skimmer in a sunk channel. The THz filter has a microscope and plot monitor, the O-RAN radio a spectrum monitor, and DEMS a laptop running the Yocto build.
- **Entry:** the hero stays, with an **Open my lab** button; scrolling also enters. The hero's text now fades out completely, so none of it floats over the room.
- **Explore (camera-controls 3.1.2, driven by our own input so the page still scrolls):**
  - Desktop: drag to look round, click the floor or a bench top to walk there (a ring marks the spot), ctrl + scroll or the +/− buttons to zoom.
  - Keys: ← → turn, ↑ ↓ walk once exploring (before that they scroll the tour), + − zoom. WASD isn't used because S opens Settings.
  - Phone: a sideways swipe turns, pinch zooms, and a tap walks or selects. Vertical swipes still scroll the tour.
  - Limits: the camera stays inside the room.
- **Tour (scroll):** 12 stops in label order: the room, 01–09, the shelf (10–12), and a step back before the flight path. Any scroll after exploring hands the camera back to the tour where the page is.
- **Labels:** all numbered in the wide views. Close-ups show just the project in front, with "Overview →". While exploring, the projects near you are labelled and the one under the pointer is highlighted.
- **Overview panel:** clicking a project, its label, a chip or the toolbar grid flies the camera to it. The panel shows the photo, tags, Built / Result / My part, a media strip (it opens the lightbox), recognition and proof links, **Open case study →**, and previous / next. It slides in on the right on desktop and is a bottom sheet on phone. Esc closes it and focus returns.
- **Toolbar:** All projects (a grid of photos), Tour (back to the tour, or on to the next stop), − +, Reset view, and a hint. On desktop it sits at the bottom; on phone, under the header.
- **Checks:**
  - Desktop and phone: every tour stop, drag, walk, the grid, the panel with next and Esc, scroll back to the tour, label click, and opening the case study all work, with no errors.
  - Reduced motion with 3D chosen: works, with focus handled.
- **Draw calls:** close-ups 16–40, wide views 210–300 (over the 150 budget; merging the static room in stage 6 brings this down).

**Open after stage 1**
- Everything is a greybox: the models arrive in stage 3, the lighting and visual effects in stage 2.
- On phone, after a tap-select the tour position under the camera can read a little off (for example 1.78 instead of 2). It's harmless while exploring, and the next scroll corrects it.
- Clicking a thin object can miss it (it walks instead); stage 3's real meshes and an invisible pick box per object will fix that.
- The case study still opens with its v5 animation (stage 5).

## Stage 2 result: the Blender lab, baked into v7 (2026-10-21)
Feedback on stage 1 was that it looked basic and old-school. The approved fix: build the whole lab in Blender and light it like a film set. Then render a look-dev still, model and animate Bird's AI as the quality bar, build every other project the same way, and bake it all into the web page. Stage 1's navigation stays as it was.

**Blender (`design/blender/`, every model built in code, so it rebuilds the same every time)**
- `build.py` builds the whole scene into `lab.blend` and `render.py` renders one camera. Run them with `Blender -b -P build.py`, then `Blender -b lab.blend -P render.py -- cam_hero out.png 160`.
- `lib.py` holds the mesh, material and light helpers. `palette.py` holds the shared materials, `room.py` the room, benches, wall dressing and props, and `projects.py` the nine projects, modelled from your photos. `anim.py` holds the hand-shaped motion.
- **Look:**
  - Cycles with AgX (Medium High Contrast) and soft bloom.
  - Dusk light through the window, warm pendants, and a cool rim light.
  - Teal accent wall, oak benches, a rug, a pegboard, shelves, posters and a whiteboard.
  - Stills are in `prototype/shots/v7-look/`.
- **Bird's AI take-off** (5 s loop): props spool up, the drone squats (anticipation), lifts with an overshoot, hovers with a lazy bob and drift, then lands with a small squash and spins down. The preview is `prototype/shots/v7-look/ba-takeoff.mp4`.
- **Bake** (`bake.py`, about 15 minutes on the Mac's GPU; run `Blender -b lab.blend -P bake.py -- out 128 1.0`, then copy `out/lab.glb` and `out/lab.json` to `prototype/models/`):
  - Joins the scene into 11 units (room, furniture, one per project) plus one mesh per moving part.
  - Bakes Cycles lighting into one atlas per unit and exports `lab.glb` (WebP textures, Draco) plus `lab.json` (where each project is and which way it faces).
  - Glass and water aren't baked; the page draws them live.

**Web (`prototype/v7/`, a copy of v6)**
- `lab.js` loads `models/lab.glb`. Baked surfaces draw unlit (the light is in the textures), so the page looks like the render on any GPU.
- The tour stops, close-ups, labels and pick boxes now come from `lab.json`. Moving the model in Blender moves them too.
- **Idle life:**
  - Bird's AI plays its take-off while it has your attention and finishes the loop back on its pad.
  - The Nephele heads look round and turn to you when you come close.
  - The boats bob, the swarm circles its mast, and the Solar Sailor halo pulses.
  - None of this runs with reduced motion.
- **Build:** `python3 assemble7.py` then `python3 mktest7.py`. **Test** (a local server is needed for the model): `python3 -m http.server 8765` in `prototype/`, then `node tools/lab.js http://127.0.0.1:8765/test-v7.html shots/v7-lab desk|phone`.
- **Fixed on the way:**
  - The swarm and Solar Sailor moved outside the room (their new empties were parented before Blender updated them).
  - Glass shaded the tank floor black in the bake.
  - The pick boxes were inside out (Blender's y flips into three's z).
  - On phone, the lab card now shrinks to its title during the tour, and the close-up cameras stand higher so they look over Nephele.
  - Pendant shades blocked the Bird's AI and WaterBot close-ups, so those cameras now sit below them.
  - On phone the picture rose 44% of the screen to clear the tall card; during the tour it rises 16%.
- **Checks:**
  - Desktop and phone: all 12 tour stops, drag, walk, grid, panel with next and Esc, scroll back to the tour, label click, and opening the case study, with no errors.
  - The model is 5.1 MB (11 atlases; WebP and Draco).
  - Draw calls: wide views 41 (stage 1: 210–300), close-ups 7–23.

**Open after stage 2**
- Baked surfaces lose live reflections. An environment-map gloss layer on screens and metal would add them back.
- The case-study bays still use the v5 models (stage 5). The hero's fly-in to Bird's AI still uses the old drone.
- On phone, the O-RAN stop still has the Nephele heads in the lower half (the radio and monitor read clearly), and the WaterBot panel's bottom sheet covers the tank.
- Atlases spend some texels on faces nobody sees (the slab underside, the floor under the rug). Culling those would sharpen the rest.

## Stage 3 result: v7 polish, bays and performance (2026-10-22)
**Lab**
- The tour opens on the overview by itself, and the grid closes on an outside click or a scroll back to the hero.
- On phone, the O-RAN stop frames the radio and monitor, and the overview sheet no longer covers the tank.
- **Reflections:** baked surfaces carry a gloss layer (strength, metal and roughness per corner) and the page adds a live reflection of the room on screens, metal and lacquer.
- The hero's drone flies in to the Blender Bird's AI.

**Case-study bays** (`v7/bays-blender.js`, models from `design/blender/export_bays.py`)
- Bird's AI, Nephele, O-RAN, DEMS, Solar Sailor and WaterBot use their Blender models; the swarm flies the Blender quadcopter in a dark finish.
- Sewer Skimmer and the THz filter keep their drawn models: the first carries a CAD-dimension claim and the second is traced from the paper.
- Every bay assembles itself as the photo dissolves: its parts drop in from a loose cloud, bottom first, with a little overshoot. Scrolling back to the photo re-arms it.

**Bake**
- Faces nobody sees (the slab underside, the floor under the rug, the bottoms of props) are culled. They move to an occluder mesh that still blocks light in the bake but gets no atlas space and isn't exported.
- The first culled bakes came out with an all-black furniture atlas and a white DEMS atlas. Unwrapping only the visible faces (by selection) had left most faces on their old overlapping UVs. The occluder split unwraps whole meshes again.
- The bake saves `out/lab_baked.blend` with its atlases packed in. The culled bake culls 20,026 of 129,705 faces; `lab.glb` is 4.9 MB (was 5.1).

**Performance** (aimed at a OnePlus Nord 4: 45–70 fps)
- Phones load `models/lab-phone.glb`: KTX2 (ETC1S) at half size, 3.2 MB, about an eighth of the GPU memory of the WebP set. It is made with `tools/ktx2.py <in.glb> <out.glb> phone`, which needs KTX-Software's `ktx` tool. Desktop keeps WebP (a UASTC desktop set came out at 28 MB).
- The hero loads first. The lab starts when the page is idle, and its textures are uploaded and shaders compiled while the hero still covers the screen.
- **Dynamic resolution:** the pixel ratio is capped at 1.5 on phone and 2 on desktop. It drops in 0.15 steps when frames run over about 21 ms and climbs back after a calm spell. `?res=0` pins it.
- Labels write their position and opacity only when they change. Leaving a case study frees its bay's GPU memory.
- **Measured** (`node tools/perf.js <url> 4`: phone viewport, CPU slowed 4×, the Mac's GPU): 120 fps at every tour stop, at 6–41 draw calls. The GPU can't be throttled, so this checks the CPU side; a real phone over USB is the remaining test.
- **On a OnePlus Nord 4** (Adreno 732, Chrome 155, 354×696 CSS px at 3.5×; `node tools/perf-device.js <url>` over adb): a locked 60 fps at every tour stop (Chrome's frame rate there; p95 16.7 ms, no dropped frames). The hero runs at 57 fps while the lab loads behind it, the lab is ready 3.8 s after load, and the JS heap is 54 MB. It loads the KTX2 set at pixel ratio 1.5, and dynamic resolution never had to step down.
- The phone showed the lab toolbar spilling off both edges at 354px. Below 400px the zoom buttons now go (a pinch zooms), so the bar fits.
- **More fixes at 354px, checked on the Nord 4:**
  - Labels behind the toolbar's band hide instead of peeking out under it.
  - The intro card's project chips are one row you swipe, so the card is 221px tall instead of about 470. Swiping the row scrolls it without turning the camera.
  - The overview picture rises only as far as the shorter card needs, so the lab fills the space above it.
  - Still 60 fps at every stop.
- **Sharpness on phone:**
  - It looked blurry because `scene.js` set the pixel ratio to 1.5 and dynamic resolution never applied its own cap (fixed). Phones also got half-size textures.
  - **Now:** phones render at up to 3× and step down 15% at a time when frames run long. Phones that report 6 GB or more load full-size KTX2 atlases (`models/lab-phone-full.glb`, 8.2 MB, `ktx2.py ... phonefull`); others load the 3.2 MB half-size set.
  - **On the Nord 4:** 60 fps at every stop, at 3× with the full set, over two back-to-back passes with no throttling. A fresh tab uses 14 MB of JS heap.
  - Measuring overrides: `?dpr=2.25`, `?glb=lab-phone`, `?res=0`. `tools/mem-device.js` reads memory on the phone.
- **Still soft at 3×; the bake was the limit.** Native 3.5× and uncompressed WebP looked the same as 3× with KTX2: the pegboard holes stayed soft while model edges were crisp.
  - The furniture atlas is now 8192 and the room 6144 (`SIZES` in `bake.py`); the bake takes about 45 minutes.
  - At that size the 256-sample grain showed, so `denoise.py` runs Open Image Denoise (Blender's compositor) on those two atlases inside the bake. Colours stay within 1/255 and edges are kept. It also shrinks the files, since grain compresses badly.
  - The project atlases aren't denoised: they carry screens and printed text.
  - **Sets:**
    - Desktop `models/lab.glb` is 4.0 MB, with big atlases capped at 4096 WebP (`ktx2.py ... web4k`; an 8192 WebP atlas is about 340 MB of GPU memory).
    - Phones with 6 GB or more get `lab-phone-full.glb` (10.2 MB, 8192/6144). Others get `lab-phone.glb` (4.1 MB, 4096/3072).
    - `tools/glb_swap.py` swaps atlases into an exported model.
- **The hero hitch on phone:** `tools/profile-device.js` (a CPU profile over adb) found it.
  - The reflection capture (`addGloss`) rendered the room before the atlases were uploaded. That uploaded each one in a single call (about 110 ms for a 4096), and the banded upload then uploaded them all again.
  - The atlases now go up first, in about 1 MB bands, one band per frame (`uploadInBands` in `lab.js`), and only once. The worst frame while the lab loads went from 265 ms to 83 ms.
  - Phones skip three's shader-log readback (`checkShaderErrors`).
  - The one long frame left is the first frame at page start.
  - The device tools disable Chrome's cache: the local server sends no cache headers, and the phone had been serving a stale page.
- **Case studies at 354px** (from a Nord 4 screenshot; checked headless on all nine with `tools/case-narrow.js <url> <dir> <id>`):
  - The lab toolbar stayed on over the case study (only the lab's frame turned it off). It is now hidden whenever a case study is open.
  - The header wrapped "← Lab" onto two lines. Below 400px the back pill shows only its arrow (named "Back to the lab") and pills don't wrap.
  - The wrong chip was lit: on phone the chapter was `round(progress)`, so the next chip lit while half the current section was on screen. On phone it now changes when a section's top reaches the reading line.
  - The chip row puts the lit chip in the middle and fades at its ends, so it reads as scrollable.
  - On phones under 760px tall the 3D frame is 32% of the height (was 38%), so the cards get about 60% of the screen. Cards slide under the chip plate through a short fade.
  - **Not checked yet:** the jagged 3D edges in the screenshot. It may have been a stale cached page; check the pixel ratio in a case study on the phone.
- **Nord 4 pass (2026-10-23):**
  - **Test page:** test the phone on `test-v7.html`. `living-lab-v7.html` has no viewport tag, because the artifact host adds one, so on a phone it lays out 980px wide. That had made one memory reading look like 450 MB.
  - **Resolution:** phones now render at their own pixel ratio, up to 3.5× (was 3×). On the Nord 4 that's 1240×2436 with no upscale, and it holds 60 fps at every stop.
  - **Memory:**
    - The page's renderer uses 175 MB, and all of Chrome adds about 250 MB for the lab.
    - The room gets its own Draco and KTX2 decoders (KTX2 limited to 2 workers), and both are disposed once the atlases are uploaded. The bays keep the shared Draco decoder.
    - `tools/mem-device.js` reads each Chrome process's PSS through adb.
  - **Stop panel (compact):** its 172px cap clipped the project title. The cap is now 240px; it sizes to its content.
  - **Expanded panel:** the safe-area padding moved into the sticky footer, so content no longer shows below the buttons. A fade sits above the buttons.
  - **Shelf:** three "Coming soon" tags didn't fit, so 11 was culled. Below 400px the crate tags show only their number (the crates are labelled).
  - **All projects grid:** on phone it runs down to the bottom edge, and the intro card no longer shows through (`body.grid-open`).
  - **Tools:**
    - `tools/tour-device.js` captures every stop.
    - `tools/views-device.js` captures the grid, the expanded panel and a case study.
  - **Tests:** headless tests use 127.0.0.1, because `localhost` on the Mac resolves to another server on IPv6.
- **Hero stutter and case-study edges (2026-10-23, Nord 4):**
  - **Atlases were BC7.** three 0.160's KTX2Loader sorts its format list in place for UASTC too, so ETC1S picked BC7 (16 bytes a block) on any phone with BPTC. The Nord 4 has it. `lab.js` now turns BC7 and BC1 off when ETC2 is there. ETC2 holds ETC1S exactly at half the bytes, and the GPU process at lab ready went from about 372 to about 275 MB.
  - **Upload stalls:** one band a frame still outran the GPU process. About every 270 ms a band call (even a 16×16 mip) blocked for 30–50 ms while Chrome's transfer buffer drained. The next band now waits on a fence until the GPU has taken the one before last.
  - **Reflection capture:** `addGloss` was one task of 65–90 ms. It now runs a step a frame:
    - the room's and PMREM's shaders compile in parallel (`compileAsync`);
    - uniform lists are read one program a frame;
    - vertex buffers go up about 1 MB a frame;
    - one cube face renders per frame.
  - **Smaller main-thread costs:** `detectSupport`'s six first-time `getExtension` calls run one a frame. The GLB is fetched whole, because `FileLoader`'s progress stream copied it chunk by chunk.
  - **Measured** (`tools/hero-device.js`: every frame from 1 s after load to lab-ready, three runs each, back to back on a warm phone):
    - before: 49–51 fps, worst frame 133–216 ms, lab ready at 5.5–5.7 s;
    - after: 55.5–56.4 fps, worst frame 50–66 ms, lab ready at 3.8 s.
    - On a cool phone, several runs had no frame over 34 ms.
    - The tour is still 60 fps at every stop.
  - **Still left:** a few 50–66 ms frames while PMREM blurs and right after the last band. The main thread is idle in them: the GPU process is busy. The room is static, so baking the reflection map offline would remove the capture altogether.
  - **Jagged case-study edges** (`tools/case-device.js` over adb: Bird's AI, Nephele, Sewer Skimmer):
    - Opening a case study dropped dynamic resolution from 3.5× to 2.98× within 0.75 s, and it climbed back 0.1 every 6 s.
    - The cause was a single load frame. Frame times fed the average uncapped, so one 200 ms frame tripped a drop. Each frame now counts as at most 33 ms, so a drop takes about six slow frames in a row.
    - Even at 3.5× edges stair-stepped without antialiasing. Phones now get 4× MSAA. The Nord 4 holds 60 fps at every stop and in the case studies with no measurable memory cost (the tiled GPU resolves on chip). `?aa=0` / `?aa=1` force it.
    - Captures: `shots/v7-nord-case/compare-*.png`.
  - **Headless phone test:** SwiftShader does MSAA on the CPU (about 220 ms a frame against 150), and `lab.js`'s fixed waits fell behind. Its phone run adds `?aa=0` unless the URL sets it.
  - **Not checked on the phone with MSAA:** touch (swipe, pinch, tap).
- **Reflection map baked offline (2026-10-23):**
  - The room is static, so its reflection map is no longer captured on each visit. `node tools/envbake.js` bakes `models/lab-env.webp`:
    - it opens the page in its `?envbake` mode on desktop, which runs the old capture (cube from the room's middle at 256, then PMREM);
    - it reads the PMREM target back as sRGB 8-bit lossless WebP: 768×1024, 219 KB, rows bottom-up as the GPU holds them.
    - The brightest value is 1.0, so 8-bit loses nothing at the top.
  - **Re-bake it whenever the room is re-baked**, and publish it with the models.
  - The page decodes it off the main thread (`ImageBitmapLoader`) while the room loads, as a `CubeUVReflectionMapping` texture. If it fails to load, the page captures the map itself, as before.
  - **Matches the live capture:** headless desktop at four stops, against `?envbake`. One stop differs by at most 1/255; at the others only animated parts differ (boat, robot heads).
  - **Freed by dropping the capture:** the page now compiles the room against the real scene, reads each program's uniforms one a frame, and uploads vertex buffers about 1 MB a frame. Each slice is drawn into a tiny target and put back within one task, with the lights left on.
  - **Fewer extension checks:** the KTX2 formats come from `getSupportedExtensions()` instead of `detectSupport`'s six `getExtension` calls. Only ETC2 gets enabled, at the first upload.
  - **Measured** (`hero-device.js`, four runs each, interleaved, warm phone), previous build against baked:
    - lab ready: 3.6–3.7 s → 3.3–3.45 s;
    - worst frame: 66 ms → 33–50 ms;
    - fps: 56.2–57.2 → 56.8–59.8.
    - One baked run had no frame over 34 ms. The tour is 60 fps at every stop.
  - **Left:** an occasional 50 ms frame at the tail of the atlas upload, with the main thread idle (the GPU process is busy).
  - Chrome on the Nord 4 has no `KHR_parallel_shader_compile`, so `compileAsync` there compiles in the foreground.
  - `profile-device.js` always shows a long frame where its window ends; that's the profiler stopping, not the page.

## Answered before stage 1
1. **Nephele 3.0:** one exhibit with 2.0 (one case study covering both), or its own project and case study?
2. **THz filter pattern:** the fractal resonator in your paper's figure will read as a swastika to many international visitors. Show it exactly as in the paper, or show the filter from an angle and distance where the pattern isn't the focus (the paper figure stays in the case study)?
3. **Figurine** from your reference image: keep it or leave it out?
4. **CC0 props and HDRI** from Poly Haven: okay?
