// ===================== content =====================
const PROJECTS = [
  { id: 'ba', n: '01', name: "Bird's AI", tags: 'Drone · Firmware · Edge AI · 5G', d: ['emb', 'ai', 'rob', 'net'], story: 'Built the drone, its firmware, the detection model and the 5G link.', proof: "NBUC '24 1st · SIH '23 finalist", img: 'ba-field', live: '5G · 95% detection' },
  { id: 'ne', n: '02', name: 'Nephele 2.0', tags: 'Robotics · Vision · Voice AI', d: ['emb', 'ai', 'rob'], story: 'Led v1 → v3: body, motors, face recognition, AWS voice.', proof: '3-robot fleet · 500+ chats', img: 'ne-pair', pos: '50% 28%' },
  { id: 'sw', n: '03', name: '300-UAV swarm network', tags: '6G · Edge AI · UAV', d: ['ai', 'rob', 'net'], story: 'Edge AI switches unicast, multicast and broadcast — up to 98% bandwidth saved.', proof: 'ITU Buildathon 2nd' },
  { id: 'tz', n: '04', name: 'THz bandpass filter', tags: 'RF · Research', d: ['rf'], story: 'Fractal resonator, 8 × 8 µm², 38 dB return loss.', proof: 'Springer J. Optics', img: 'tz-current', live: '3.88 THz' },
  { id: 'or', n: '05', name: '5G O-RAN testbed', tags: '5G · SDR', d: ['net', 'rf'], story: 'CU/DU split RAN and 5G core on a USRP B210.', proof: 'Techphosis · PEP 5G', img: 'or-usrp', pos: '72% 50%' },
  { id: 'de', n: '06', name: 'DEMS', tags: 'STM32 · Edge AI', d: ['emb', 'ai'], story: 'TensorFlow Lite emotion detection on an STM32MP135F.', proof: "Inventors '23 winner", img: 'de-board', live: 'emotion → happy' },
  { id: 'wb', n: '07', name: 'WaterBot', tags: 'Robotics · LoRa', d: ['emb', 'rob', 'net'], story: 'Led six engineers to build a solar trash-harvesting boat.', proof: "SIH '22 finalist", img: 'wb-build', pos: '50% 40%' }
];
const LAYERS = [['rob', 'Robotics & UAV', 'drones, robots, boats'], ['ai', 'Edge AI', 'detection, TFLite, ML'], ['emb', 'Embedded & firmware', 'STM32, Pi, Arduino'], ['net', 'Wireless', '5G, 6G, LoRa'], ['rf', 'RF & EM', 'THz filters, SDR']];
// what I actually did in each layer, and where to see it
const SKILLS = {
  rob: [['ba', 'explode', 'Built and tuned the drone airframe and flight logic'], ['ne', 'inside', 'Designed Nephele’s body and its stepper-motor drive'], ['wb', 'build', 'Hull, propulsion and ramp of a trash-collecting boat'], ['sw', 'overview', 'Digital twin of a 150–300 UAV swarm']],
  ai: [['ba', 'silicon', 'YOLOv8 on a Hailo-8L, 95% survivor detection'], ['ne', 'sensors', 'Real-time face recognition on a Raspberry Pi 5'], ['sw', 'edge', 'Edge classifier that picks unicast, multicast or broadcast'], ['de', 'pipeline', 'TensorFlow Lite emotion model on an STM32MP135F']],
  emb: [['ba', 'explode', 'Pixhawk 2.4.8 + Raspberry Pi 5 on-board firmware'], ['ne', 'inside', 'Stepper control and hardware integration on a Pi 5'], ['de', 'board', 'Brought up the STM32MP135F-DK with a webcam and SD logging'], ['wb', 'link', 'Arduino Uno + LoRa remote, brushless motors and ESC']],
  net: [['ba', 'arch', '5G link from the drone to a ground station'], ['sw', 'unicast', '6G unicast, 5G eMBMS multicast and ATSC 3.0 broadcast'], ['or', 'stack', 'CU/DU RAN and 5G core with srsRAN and Open5GS'], ['wb', 'link', 'LoRa control link from the shore']],
  rf: [['tz', 'results', 'THz fractal filter: 38.32 dB return loss at 3.88 THz'], ['or', 'radio', 'USRP B210 software-defined radio as the 5G RU']]
};
const TAILOR = { embedded: 'emb', firmware: 'emb', ai: 'ai', wireless: 'net', rf: 'rf', robotics: 'rob' };
const PROOFS = ["NBUC '24 — 1st place", 'ITU Buildathon 4.0 — 2nd place', "Inventors Challenge '23 — Winner", "Smart India Hackathon '23 — National finalist", "Smart India Hackathon '22 — National finalist", 'Springer · Journal of Optics', 'IEEE ICOEI 2025', 'ITU document FG-AINN-I-215'];
const TIMELINE = [['2022', "SIH '22 · WaterBot", 'national finalist', 'wb'], ['2023', "Inventors Challenge '23", 'DEMS · winner', 'de'], ['2023', "SIH '23 · Bird's AI", 'national finalist', 'ba'], ['2024', "NBUC '24 · Bird's AI", '1st place', 'ba'], ['2024', 'Techphosis · PEP 5G', '5G O-RAN internship', 'or'], ['2025', 'IEEE ICOEI 2025', "Bird's AI paper", 'ba'], ['2026', 'ITU Buildathon 4.0', '2nd place', 'sw'], ['Now', 'M.E. Communication Systems, SSN', 'Echo telemetry · FSS research', null]];
const SITE = 'https://www.charanvelavan.com';
// clips ship as H.264 and VP9; use whichever this browser plays
const VEXT = document.createElement('video').canPlayType('video/mp4; codecs="avc1.42E01E"') ? 'mp4' : 'webm';
const CV_URL = SITE + '/resume.pdf';

// ---------- building blocks shared by every case study ----------
const H = {
  hl: (s) => `<h3 class="hl">${s}</h3>`,
  by: (s, note) => `<p class="by">${s}</p>` + (note ? `<p class="note">${note}</p>` : ''),
  tldr: (c) => `<dl class="tldr"><div><dt>Built</dt><dd>${c.quick[0]}</dd></div><div><dt>Result</dt><dd>${c.quick[1]}</dd></div><div><dt>My part</dt><dd>${c.quick[2]}</dd></div></dl>`,
  facts: (rows) => '<div class="facts">' + rows.map(([v, l]) => `<div class="fact"><strong>${v}</strong><span>${l}</span></div>`).join('') + '</div>',
  assoc: (c) => (c.assoc || []).length ? `<div class="assoc"><small>Associated with</small>${c.assoc.map(([logo, name, dk]) => logo ? `<span class="logo${dk ? ' dk' : ''}"><img src="img/${logo}" alt="${name}"></span>` : `<span class="logo txt">${name}</span>`).join('')}<span class="t">${c.assocLine}</span></div>` : '',
  list: (items) => '<ol class="blist">' + items.map((s, i) => `<li><b>${String(i + 1).padStart(2, '0')}</b><span>${s}</span></li>`).join('') + '</ol>',
  parts: (title, rows) => `<h4 class="sub">${title}</h4><div class="bom">` + rows.map(([n, r, k]) => `<button type="button" data-part="${k || n}"><b>${n}</b><span>${r}</span></button>`).join('') + '</div>',
  flow: (rows, note) => '<div class="flow">' + rows.map(([k, n, s], i) => (i ? '<i class="arr" aria-hidden="true">↓</i>' : '') + `<button type="button" data-node="${k}"><b>${n}</b><small>${s}</small></button>`).join('') + '</div>' + (note ? `<p class="note">${note}</p>` : ''),
  kpis: (rows) => '<div class="kpis">' + rows.map(([v, l]) => `<div><strong>${v}</strong><span>${l}</span></div>`).join('') + '</div>',
  dl: (rows) => '<ul class="dl">' + rows.map(([b, s]) => `<li><b>${b}</b><span>${s}</span></li>`).join('') + '</ul>',
  media: (rows) => '<div class="media">' + rows.map(([f, cap, w]) => f.endsWith('.mp4')
    ? `<button type="button" class="${w || ''} vid" data-lb="media/${f.replace('.mp4', '.' + VEXT)}" data-cap="${cap}"><video src="media/${f.replace('.mp4', '.' + VEXT)}" poster="img/${f.replace('-clip.mp4', '-vposter')}.webp" muted loop playsinline preload="none" aria-hidden="true"></video><span>▶ ${cap}</span></button>`
    : `<button type="button" class="${w || ''}" data-lb="img/${f}.webp" data-cap="${cap}"><img src="img/${f}.webp" alt="${cap}" loading="lazy"><span>${cap}</span></button>`).join('') + '</div>',
  recog: (rows) => '<ul class="recog">' + rows.map(([ic, t, s, u]) => `<li><span class="ic">${ic}</span><span><b>${t}</b><small>${s}</small></span>${u ? `<a href="${u}" target="_blank" rel="noopener" data-track="proof">Details ↗</a>` : '<span></span>'}</li>`).join('') + '</ul>',
  proofs: (c) => (c.proofs || []).length ? '<h4 class="sub">Proof</h4><div class="proofl">' + c.proofs.map(([k, t, u]) => `<a href="${u}" target="_blank" rel="noopener" data-track="proof"><small>${k}</small><b>${t}</b><i>↗</i></a>`).join('') + '</div>' : '',
  hard: (c) => c.hard ? `<div class="hard"><small>What went wrong${c.hard[2] ? ' <em class="draft">draft — confirm</em>' : ''}</small><p><b>Problem.</b> ${c.hard[0]}</p><p><b>Fix.</b> ${c.hard[1]}</p></div>` : '',
  explore: (c) => `<div class="actions"><button class="btn primary" type="button" data-explore>Explore in 3D ↓</button><span class="note">or just scroll</span></div>`,
  code: (label, s) => `<pre class="code" aria-label="${label}">${s}</pre>`,
  end: (c) => { const nx = CASES[c.next]; return `<div class="ends"><button class="endc" type="button" data-next><img src="img/${nx.photo || nx.thumb}.webp" alt="" style="object-position:${nx.pos || '50% 30%'}"><span><small>Next project</small><b>${nx.name} →</b></span></button><button class="btn" type="button" data-backlab>← Back to the lab</button></div>`; }
};

// ---------- the seven case studies ----------
// each section is one scroll chapter; `tab` is the rail tab it belongs to; `spin` chapters can be dragged to turn
const CASES = {
  ba: {
    slug: 'Birds-AI', name: "Bird's AI", photo: 'ba-main', pos: '50% 42%', day: true,
    tg: '01 · Drone · Firmware · Edge AI · 5G', sub: '5G search-and-rescue drone · 2023–2024 · with Nokia',
    quick: ['A drone that finds survivors from the air and reports them over 5G.', "1st place at NBUC '24 (Nokia) · 95% detection accuracy.", 'Airframe, firmware, detection model, flight logic and the 5G link — with my team.'],
    tabs: [['overview', 'Overview'], ['build', 'Build'], ['arch', 'Architecture'], ['results', 'Results'], ['media', 'Media'], ['recog', 'Recognition']],
    secs: [
      { id: 'cs', tab: 'overview', h: 100 },
      { id: 'overview', tab: 'overview', title: 'Eyes <em>from the sky.</em>', line: 'The drone lifts off the photo. It sweeps an area from at least 50 m up and marks survivors in real time, so rescue teams know where to go.' },
      { id: 'silicon', tab: 'build', h: 95, title: 'Down to <em>the chip.</em>', line: 'The Hailo-8L accelerator on the Raspberry Pi 5 runs YOLOv8 on the drone at 15–20 frames per second, with no server in the loop.' },
      { id: 'explode', tab: 'build', h: 140, spin: true, title: 'Take it <em>apart.</em>', line: 'Every part of the airframe. Drag to turn it; hover a part in the list to find it.' },
      { id: 'arch', tab: 'arch', title: 'Drone to operator, <em>over 5G.</em>', line: 'The proposed architecture, end to end. Hover a block to find it in the scene.' },
      { id: 'results', tab: 'results', title: 'Finds people <em>at 95%.</em>', line: 'The real camera feed plays beside the drone: YOLOv8 marking survivors from 25 m up.' },
      { id: 'media', tab: 'media', title: 'In <em>the field.</em>', line: 'The detection run, test flights, the build, and the demo at the NBUC finals.' },
      { id: 'recog', tab: 'recog', h: 125, title: 'First place <em>at NBUC ’24.</em>', line: 'The Nokia Bangalore University Collaboration ideathon.' }
    ],
    assoc: [['nokia.png', 'Nokia']], assocLine: 'NBUC ideathon — Nokia Bangalore University Collaboration',
    proofs: [['Paper · IEEE ICOEI 2025', '5G and Edge Computing Enabled Search and Rescue Drones', 'https://doi.org/10.1109/ICOEI65986.2025.11013465'], ['PDF', 'Read the full paper', SITE + '/papers/5G_and_Edge_Computing_Enabled_Search_and_Rescue_Drones.pdf']],
    hard: ['YOLOv8 on the Raspberry Pi 5’s CPU alone was too slow to keep up with a sweeping drone.', 'Compiled the model for the Hailo-8L accelerator with hailomz — 15–20 FPS on board, no server in the loop.', true],
    tick: ["NBUC '24 — 1st place · Nokia", "Smart India Hackathon '23 — National finalist", 'YOLOv8 on Hailo-8L · 15–20 FPS', 'Pixhawk 2.4.8 · Raspberry Pi 5', '4,588 training images', 'IEEE ICOEI 2025 paper'],
    next: 'ne'
  },
  ne: {
    slug: 'nephele-community-robot', name: 'Nephele 2.0', photo: 'ne-hero', pos: '50% 30%',
    tg: '02 · Robotics · Vision · Voice AI', sub: 'Conference interaction robot · v1.0 → v3.0 · AWS Cloud Club',
    quick: ['A conference robot that recognises faces, talks by voice and greets people by name.', '3-robot fleet · 500+ conversations at live events.', 'Project lead: body design, stepper drive, face recognition and hardware integration.'],
    tabs: [['overview', 'Overview'], ['build', 'Build'], ['arch', 'Architecture'], ['results', 'Results'], ['media', 'Media'], ['recog', 'Impact']],
    secs: [
      { id: 'cs', tab: 'overview', h: 100 },
      { id: 'overview', tab: 'overview', spin: true, title: 'Meet <em>Nephele 2.0.</em>', line: 'The photo turns into the robot. It recognises faces, answers questions by voice and keeps attendance at conferences.' },
      { id: 'sensors', tab: 'build', spin: true, title: 'Sees, hears, <em>speaks.</em>', line: 'A camera for faces and gestures, a LiDAR for the room, a mic and speaker for voice, and a display for its eyes.' },
      { id: 'inside', tab: 'build', h: 140, spin: true, title: 'Inside <em>the drum.</em>', line: 'The shell lifts off: a Raspberry Pi 5, stepper motors and drivers on a round chassis. Drag to turn it.' },
      { id: 'arch', tab: 'arch', title: 'Voice, <em>through AWS.</em>', line: 'ROS2 on the robot; Transcribe hears, Bedrock answers, Polly speaks and Rekognition knows the face.' },
      { id: 'fleet', tab: 'results', h: 125, title: 'Three robots, <em>500+ chats.</em>', line: 'From version 1.0 to 3.0, the fleet worked live conference floors.' },
      { id: 'media', tab: 'media', title: 'On <em>the floor.</em>', line: 'Events, the build and the team.' },
      { id: 'recog', tab: 'recog', h: 125, title: 'Built with <em>AWS Cloud Club.</em>', line: 'A student robotics and cloud project at St. Joseph’s.' }
    ],
    assoc: [['lg-aws.png', 'AWS Cloud Club']], assocLine: 'AWS Cloud Club · St. Joseph’s College of Engineering',
    proofs: [['Live demo', 'Talk with Nephele', SITE + '/nephele-launch'], ['Video', 'Nephele at a live conference', SITE + '/videos/nephele%20video.mp4']],
    hard: ['A crowded event hall is hard on a robot: many faces at once, constant noise, hours of running.', 'Iterated from 1.0 to 3.0 — a new body and stepper drive, on-board face recognition, and cloud speech through AWS.', true],
    tick: ['Project lead · v1.0 → v3.0', '3-robot fleet', '500+ conversations', '8+ interaction modes', 'Raspberry Pi 5 · stepper drive', 'AWS Transcribe · Bedrock · Polly · Rekognition'],
    next: 'sw'
  },
  sw: {
    slug: 'ai-native-network-uav', name: '300-UAV swarm network', photo: 'sw-dash', pos: '50% 20%', short: 'UAV swarm',
    tg: '03 · 6G · Edge AI · UAV', sub: 'AI-native converged 6G network · Jan–Feb 2026 · Team NVK',
    quick: ['An edge AI server that picks unicast, multicast or broadcast for every message to a drone swarm.', "2nd place at ITU Buildathon 4.0 · up to 98% less bandwidth · ITU document FG-AINN-I-215.", 'System architect: the edge classifier on a Pi 5, the 300-UAV simulator and the dashboard (with Yogender Raju).'],
    tabs: [['overview', 'Overview'], ['modes', 'Modes'], ['edge', 'Edge AI'], ['results', 'Results'], ['media', 'Media'], ['recog', 'Recognition']],
    secs: [
      { id: 'cs', tab: 'overview', h: 100 },
      { id: 'overview', tab: 'overview', title: '300 drones, <em>one network.</em>', line: 'A digital twin of 150–300 UAVs over a smart city, all coordinated by one edge server.' },
      { id: 'unicast', tab: 'modes', title: 'Unicast: <em>one at a time.</em>', line: '6G unicast for latency-critical control — every drone gets its own stream. Fast, but it doesn’t scale.' },
      { id: 'multicast', tab: 'modes', title: 'Multicast: <em>a group.</em>', line: '5G eMBMS sends one stream to a cluster of drones on the same mission.' },
      { id: 'broadcast', tab: 'modes', title: 'Broadcast: <em>everyone.</em>', line: 'ATSC 3.0 sends mission data to the whole swarm in one transmission.' },
      { id: 'edge', tab: 'edge', title: 'The Pi <em>decides.</em>', line: 'A classifier on a Raspberry Pi 5 reads swarm size, payload, priority and congestion, and picks the mode in under 100 ms.' },
      { id: 'results', tab: 'results', title: 'Up to 98% <em>less bandwidth.</em>', line: 'Against a unicast-only network, with critical traffic still under 50 ms.' },
      { id: 'media', tab: 'media', title: 'Mission <em>control.</em>', line: 'The Streamlit dashboard: live map, AI decisions and bandwidth saved.' },
      { id: 'recog', tab: 'recog', h: 125, title: '2nd at <em>ITU Buildathon 4.0.</em>', line: 'And an official input document to the ITU focus group on AI-native networks.' }
    ],
    assoc: [['lg-itu.png', 'ITU'], ['lg-freestream.png', 'FreeStream'], ['lg-ssn.png', 'SSN']], assocLine: 'ITU × FreeStream Buildathon 4.0 · SSN College of Engineering',
    proofs: [['ITU input document', 'FG-AINN-I-215 — full PoC and results', SITE + '/papers/buildathon-itu-fgainn-215.pdf']],
    hard: ['Plain multicast made it worse: over 40% congestion and unstable latency at 200 UAVs.', 'A classifier picks the mode per message, with a rule-based fallback when its confidence is low — 32–33% congestion and ~147 MB saved.', false],
    tick: ['ITU Buildathon 4.0 — 2nd place', 'ITU FG-AINN-I-215', '150–300 UAVs', 'Up to 98% bandwidth saved', '<100 ms inference on a Pi 5', '6G · 5G eMBMS · ATSC 3.0'],
    next: 'tz'
  },
  tz: {
    slug: 'thz-bandpass-filter', name: 'THz bandpass filter', photo: 'tz-current', pos: '50% 50%',
    tg: '04 · RF · Research', sub: 'Miniaturised dual-mode terahertz filter · Springer Journal of Optics, 2025',
    quick: ['A terahertz bandpass filter, 8 × 8 µm², using Swastik fractal slots.', '38.32 dB return loss at 3.88 THz · published in Journal of Optics (Springer).', 'Co-author: CST simulations, gap and perturbation tuning, S-parameter analysis.'],
    tabs: [['overview', 'Overview'], ['design', 'Design'], ['physics', 'Physics'], ['results', 'Results'], ['media', 'Media'], ['recog', 'Publication']],
    secs: [
      { id: 'cs', tab: 'overview', h: 100 },
      { id: 'overview', tab: 'overview', spin: true, title: '8 × 8 µm, <em>blown up.</em>', line: 'The surface-current plot becomes the filter itself, scaled up about a hundred thousand times.' },
      { id: 'layers', tab: 'design', spin: true, title: 'Three <em>layers.</em>', line: 'A metal patch on RT/Duroid 6010 (εr = 10.7), with a metal ground plane underneath.' },
      { id: 'fractal', tab: 'design', h: 140, title: 'Fractal <em>slots.</em>', line: 'Three iterations of Swastik slots shrink the patch by 25.93% without hurting the response.' },
      { id: 'currents', tab: 'physics', h: 150, title: 'Where the current <em>flows.</em>', line: 'Surface current at 2.86, 3.88 and 5.14 THz — the passband and its two transmission zeros.' },
      { id: 'results', tab: 'results', title: '38 dB at <em>3.88 THz.</em>', line: 'S11 and S21 of the final design: a deep match at the centre and sharp zeros on both edges.' },
      { id: 'media', tab: 'media', title: 'From <em>CST.</em>', line: 'The model, the iterations and the measured response.' },
      { id: 'recog', tab: 'recog', h: 125, title: 'Published in <em>Journal of Optics.</em>', line: 'Springer, 2025 — S. Karthie and V. Charan.' }
    ],
    assoc: [['lg-ssn.png', 'SSN']], assocLine: 'SSN College of Engineering · St. Joseph’s College of Engineering',
    proofs: [['Paper · Journal of Optics', 'Miniaturized dual-mode THz bandpass filter', 'https://doi.org/10.1007/s12596-025-02915-0'], ['PDF', 'Read the paper', SITE + '/papers/SSN%20PAPER.pdf']],
    hard: ['The plain square patch (iteration 0) was too large for the target footprint, with weak selectivity.', 'Three iterations of Swastik fractal slots plus a 45° perturbation for dual mode — 25.93% smaller, with two transmission zeros.', false],
    tick: ['Journal of Optics · Springer 2025', '3.88 THz centre', '38.32 dB return loss', '1.63 dB insertion loss', '8 × 8 µm²', '25.93% smaller patch'],
    next: 'or'
  },
  or: {
    slug: '5g-network-implementation', name: '5G O-RAN testbed', photo: 'or-usrp', pos: '62% 50%',
    tg: '05 · 5G · SDR', sub: '5G RAN and core on open source · Mar–May 2024 · Techphosis × PEP 5G',
    quick: ['A working 5G network — RAN and core — on a USRP B210 with srsRAN and Open5GS.', 'End-to-end call flows validated, with traces captured at each interface.', 'Intern: deployed the RAN and core, traced the interfaces, modified and rebuilt the source.'],
    tabs: [['overview', 'Overview'], ['radio', 'Radio'], ['stack', 'Stack'], ['oran', 'O-RAN'], ['media', 'Media'], ['recog', 'Internship']],
    secs: [
      { id: 'cs', tab: 'overview', h: 100 },
      { id: 'overview', tab: 'overview', title: 'A 5G network <em>on a desk.</em>', line: 'A USRP B210 radio and a PC running srsRAN and Open5GS — a full 5G RAN and core.' },
      { id: 'radio', tab: 'radio', spin: true, title: 'The radio: <em>USRP B210.</em>', line: 'A software-defined radio, 70 MHz to 6 GHz, 2×2 MIMO — the radio unit of the network.' },
      { id: 'stack', tab: 'stack', h: 130, title: 'Radio to core, <em>layer by layer.</em>', line: 'RU → DU (PHY, MAC, RLC) → CU (PDCP, SDAP, RRC) → 5G core (AMF, SMF, UPF, UDM, UDR).' },
      { id: 'splits', tab: 'stack', h: 130, title: 'Where to <em>split it.</em>', line: 'Splits 2, 6, 7.2x and 8 move the cut between CU, DU and RU — each trades fronthaul for latency.' },
      { id: 'oran', tab: 'oran', title: 'Open RAN, <em>with a brain.</em>', line: 'SMO, the Non-RT and Near-RT RIC, rApps and xApps steer the RAN over O1 and E2.' },
      { id: 'media', tab: 'media', title: 'In <em>the lab.</em>', line: 'The CU and DU running, the radio, and the architecture.' },
      { id: 'recog', tab: 'recog', h: 125, title: 'Techphosis <em>× PEP 5G.</em>', line: '5G network engineer intern, March–May 2024.' }
    ],
    assoc: [['lg-techphosis.png', 'Techphosis', 1], ['lg-pep5g.png', 'PEP 5G']], assocLine: '5G network engineer internship, Mar–May 2024',
    proofs: [],
    hard: ['5G interfaces are hard to reason about from diagrams alone — splits, F1, E1, NG all blur together.', 'Captured protocol traces at each interface, modified and recompiled the components, and validated end-to-end call flows.', true],
    tick: ['Techphosis × PEP 5G internship', 'USRP B210 · 70 MHz – 6 GHz', 'srsRAN · Open5GS', 'CU / DU split', 'NG · Xn · F1 · E1 · E2 · O1', 'SMO · Non-RT RIC · Near-RT RIC'],
    next: 'de'
  },
  de: {
    slug: 'emotion-monitoring-system', name: 'DEMS', photo: 'de-board', pos: '50% 50%',
    tg: '06 · STM32 · Edge AI', sub: 'Domestic Emotion Monitoring System · Team Ravagers · St. Joseph’s',
    quick: ['A board that reads emotions from a face in real time, to help psychiatrists track patients.', "Winner, Inventors Challenge '23 · validated by a rehabilitation-science expert.", 'Team lead: the STM32 build, the TensorFlow Lite model and the web app (team of 5).'],
    tabs: [['overview', 'Overview'], ['board', 'Board'], ['pipeline', 'Pipeline'], ['results', 'Results'], ['media', 'Media'], ['recog', 'Recognition']],
    secs: [
      { id: 'cs', tab: 'overview', h: 100 },
      { id: 'overview', tab: 'overview', title: 'Emotions, <em>on the board.</em>', line: 'A webcam, an STM32MP135F board and a TensorFlow Lite model that reads a face in real time.' },
      { id: 'board', tab: 'board', spin: true, title: 'STM32MP135F-DK.', line: 'Arm Cortex-A7 at 1 GHz, a 4.3-inch touch display and a 64 GB SD card for patient history. Drag to turn it.' },
      { id: 'pipeline', tab: 'pipeline', h: 140, title: 'Face in, <em>feeling out.</em>', line: 'Webcam frame → face crop → TFLite model → angry, happy, sad or neutral → logged for the doctor.' },
      { id: 'results', tab: 'results', title: 'Four emotions, <em>live.</em>', line: 'Real time on a ₹15,000 budget, with web and mobile apps for the doctor.' },
      { id: 'media', tab: 'media', title: 'The <em>dashboards.</em>', line: 'The board at work, doctor login, emotion logs and trends.' },
      { id: 'recog', tab: 'recog', h: 125, title: 'Winner, <em>Inventors Challenge ’23.</em>', line: 'Validated by Dr. A. Turin Martina, Department of Rehabilitation Science.' }
    ],
    assoc: [['', 'St. Joseph’s CoE']], assocLine: 'Team Ravagers · aligned with UN SDG 3, good health and well-being',
    proofs: [['Demo video', 'DEMS product demonstration', 'https://drive.google.com/file/d/1iBJ43BQU1Wp7gb67GP0Ilq6eSw1Zdu48/view?usp=sharing']],
    hard: ['A full emotion model doesn’t fit the memory and power budget of a Cortex-A7 board.', 'Converted and optimised it with TensorFlow Lite for the STM32MP135F — real-time inference on the board itself.', false],
    tick: ["Inventors Challenge '23 — Winner", 'STM32MP135F-DK · Cortex-A7 1 GHz', 'TensorFlow Lite', '4 emotions · real time', 'Web + mobile apps', '₹15,000 budget'],
    next: 'wb'
  },
  wb: {
    slug: 'waterbot', name: 'WaterBot', photo: 'wb-front', pos: '50% 60%',
    tg: '07 · Robotics · LoRa', sub: 'Solar trash-harvesting boat · SIH 2022 · NMCG, Ministry of Jal Shakti',
    quick: ['A solar-powered robot boat that scoops floating trash out of urban drains.', "National finalist, Smart India Hackathon '22 (problem BV800, NMCG).", 'Team leader of six: system architecture, LoRa remote, motors and sensors.'],
    tabs: [['overview', 'Overview'], ['build', 'Build'], ['system', 'System'], ['results', 'Results'], ['media', 'Media'], ['recog', 'Recognition']],
    secs: [
      { id: 'cs', tab: 'overview', h: 100 },
      { id: 'overview', tab: 'overview', title: 'A boat that <em>eats trash.</em>', line: 'A solar robot boat that scoops floating waste from urban drains, for the National Mission for Clean Ganga.' },
      { id: 'build', tab: 'build', h: 130, spin: true, title: 'Foam, acrylic <em>and a mesh ramp.</em>', line: 'Hull, mesh ramp, brushless motors, batteries, solar wings and the control board. Drag to turn it.' },
      { id: 'link', tab: 'system', title: 'Steered <em>over LoRa.</em>', line: 'An Arduino Uno with a LoRa module takes commands from the shore; Bluetooth for short-range tests.' },
      { id: 'sense', tab: 'system', title: 'A swimming <em>lab.</em>', line: 'Probes read pH, salinity and dissolved oxygen as it goes.' },
      { id: 'collect', tab: 'results', h: 140, title: 'Scoop, <em>repeat.</em>', line: 'It drives forward and the ramp lifts floating trash into the bin.' },
      { id: 'full', tab: 'results', title: 'The full-scale <em>design.</em>', line: 'LiDAR, a depth sounder, a P4 multispectral camera and RTK GPS for AI-driven autonomy.' },
      { id: 'media', tab: 'media', title: 'The <em>build.</em>', line: 'Five days at the Grand Finale: hull, motors, LoRa and the team.' },
      { id: 'recog', tab: 'recog', h: 125, title: 'National finalist, <em>SIH ’22.</em>', line: 'Problem statement BV800 from NMCG, Ministry of Jal Shakti.' }
    ],
    assoc: [['', 'NMCG'], ['', 'Smart India Hackathon']], assocLine: 'National Mission for Clean Ganga · Ministry of Jal Shakti',
    proofs: [['SIH submission', 'WaterBot — SIH 2022 write-up', SITE + '/sih22/docs/sih22-submission.pdf']],
    hard: ['Five days was not enough to fit the whole autonomy stack — LiDAR, RTK and the multispectral camera.', 'Shipped the core that works — hull, ramp, LoRa control and water sensors — and kept the rest in the full-scale design.', true],
    tick: ["SIH '22 — National finalist", 'Problem BV800 · NMCG', 'Solar + battery', 'Arduino Uno + LoRa', 'pH · salinity · dissolved oxygen', 'Team of 6 · 5 disciplines'],
    next: 'ba'
  }
};
Object.entries(CASES).forEach(([id, c]) => { c.id = id; c.route = '#/projects/' + c.slug; c.n = PROJECTS.find((p) => p.id === id).n; c.secs.forEach((s, i) => { s.n = String(Math.max(1, c.tabs.findIndex((t) => t[0] === s.tab) + 1)).padStart(2, '0'); }); });

// ---------- tab panels (desktop rail, lite page and print) and chapter cards (phone) ----------
const BA_BOM = [['Pixhawk 2.4.8', 'flight controller · dual IMU'], ['Raspberry Pi 5', 'edge computer'], ['AI HAT+ (Hailo-8L)', 'YOLOv8 at 15–20 FPS'], ['5G dongle', 'air interface to the gateway'], ['Camera + mount', 'survivor video feed'], ['DJI motors + ESC', 'propulsion · prop guards', 'Motor 1'], ['GPS', 'position for drop points'], ['Landing gear', 'tall gear to clear the camera']];
const BA_FLOW = [
  ['dongle', 'Drone · on-board units', 'Pixhawk 2.4.8 · ESC · Raspberry Pi 5 with 5G dongle · Hailo AI kit (YOLOv8 + inference script) · camera'],
  ['gateway', 'IoT / 5G gateway', 'air interface between the drone and the network'],
  ['rru', '4×4 MIMO · RRU / RRH', 'radio head on the 5G site'],
  ['bbu', '5G RAN · BBU', 'baseband unit'],
  ['core', '5G core · AMF / UPF', 'access management and user plane'],
  ['cloud', 'Cloud infrastructure', 'AWS S3 storage · annotated video feed · flight logs · Pushbullet notifications'],
  ['gs', 'Ground station', 'control console · operator']
];
const ARCH = BA_FLOW.map(([k, n, s]) => [k, n.replace('Drone · on-board units', '5G dongle'), s]);
const T = {};
T.ba = {
  overview: H.hl('A drone that finds people in disaster zones and reports them over 5G.') + H.by('Built the drone · wrote the firmware · trained the model · flight logic · 5G link', 'Built along with my team members for the Nokia–NBUC ideathon.') + H.facts([['95%', 'detection accuracy'], ['15–20 FPS', 'on the Hailo accelerator'], ['50 m+', 'search altitude'], ['5G', 'URLLC control · eMBB video']]),
  build: H.list(['Built and tuned the airframe, motors and power system', 'Wrote the on-board firmware that runs survivor detection', 'Trained the detection model to 95% accuracy', 'Programmed the flight logic that sweeps a search area', 'Brought up the 5G link that streams detections to the ground']) + H.parts('Parts — hover to find it on the drone', BA_BOM) + H.code('Compiling the model for the Hailo accelerator', `<span class="c"># YOLOv8 → Hailo-8L executable (HEF)</span>
<span class="k">hailomz</span> parse    --hw-arch hailo8l --ckpt ./best.onnx yolov8n
<span class="k">hailomz</span> optimize --hw-arch hailo8l --har ./yolov8n.har yolov8n
<span class="k">hailomz</span> compile  yolov8n --hw-arch hailo8l --har ./yolov8n.har`),
  arch: '<p>A 5G dongle on the drone reaches an IoT/5G gateway, then the 5G radio, baseband and core, and on to the cloud and the ground station.</p>' + H.flow(BA_FLOW, 'URLLC carries real-time control; eMBB carries the live annotated video.'),
  results: H.kpis([['95%', 'detection accuracy'], ['15–20', 'FPS on the Hailo-8L'], ['4,588', 'training images'], ['300', 'epochs in 127.5 min']]) + H.dl([['Dataset', 'SAR + COCO from IEEE DataPort — 4,588 training and 228 validation images at 640 × 640.'], ['Training', 'YOLOv8, 300 epochs in 127.5 minutes on an RTX 4060.'], ['On the drone', 'Compiled for the Hailo-8L with hailomz and run by the on-board inference script.']]),
  media: H.media([['ba-clip.mp4', 'Survivor detection from 25 m — the real run', 'wide'], ['ba-main', "Bird's AI on the test field", 'wide'], ['ba-drone', 'Pixhawk, Pi 5 + AI HAT and the camera mount'], ['ba-detect', 'YOLOv8 marking survivors from the air'], ['ba-crowd', "Live demo at the NBUC '24 finals"], ['aw-nbuc', "Presenting Bird's AI at NBUC '24"]]),
  recog: H.recog([['★', 'NBUC ’24 — 1st place', 'Nokia Bangalore University Collaboration ideathon', SITE + '/achievements/nbuc-24-first-place'], ['★', 'Smart India Hackathon ’23', 'National finalist', SITE + '/achievements/sih-23-finalist'], ['¶', 'IEEE ICOEI 2025', '5G and Edge Computing Enabled Search and Rescue Drones', 'https://doi.org/10.1109/ICOEI65986.2025.11013465']])
};
const NE_PARTS = [['Camera', 'face recognition · gestures', 'cam'], ['Display', 'eyes and on-screen answers', 'display'], ['Mic + speaker', 'voice in and out', 'mic'], ['LiDAR', 'room and obstacle scan', 'lidar'], ['Raspberry Pi 5', 'perception · motion · voice', 'pi'], ['Stepper motors ×2', 'drive wheels, precise moves', 'motors'], ['Motor drivers', 'stepper drivers', 'drivers'], ['Battery pack', 'hours on the floor', 'battery']];
const NE_FLOW = [['robot', 'Nephele · on board', 'Raspberry Pi 5 · ROS2 nodes for perception, motion and voice'], ['transcribe', 'AWS Transcribe', 'speech → text'], ['bedrock', 'Amazon Bedrock', 'understands the question, writes the answer'], ['polly', 'AWS Polly', 'text → natural voice'], ['rekognition', 'AWS Rekognition', 'faces → names, for greetings and attendance']];
T.ne = {
  overview: H.hl('A robot that greets you by name, answers your questions and takes attendance — at live conferences.') + H.by('Project lead · body design · stepper drive · face recognition · hardware integration', 'Built with the AWS Cloud Club team; I led it from version 1.0 to 3.0.') + H.facts([['1.0 → 3.0', 'versions led'], ['8+', 'interaction modes'], ['500+', 'conversations'], ['3', 'robots in the fleet']]),
  build: H.list(['Designed the complete mechanical and industrial body', 'Implemented stepper-motor control and motor mapping on a Raspberry Pi 5', 'Integrated motors, drivers, camera, display and power', 'Trained and optimised models for real-time face detection and recognition', 'Ran hardware testing, calibration and live deployment at events']) + H.parts('Parts — hover to find it on the robot', NE_PARTS),
  arch: '<p>The robot handles perception and motion on board; speech and language run in AWS. 5G connectivity concepts link the robots as a fleet.</p>' + H.flow(NE_FLOW, 'I contributed the AWS speech and vision integration alongside the cloud team.'),
  results: H.kpis([['500+', 'conversations'], ['3', 'robots at once'], ['8+', 'interaction modes'], ['3.0', 'versions shipped']]) + H.dl([['Modes', 'Face recognition, gestures, voice commands, FAQs, selfies and QR attendance.'], ['Where', 'Live conference floors and campus events.'], ['Iteration', 'Nephele 1.0 → 2.0 → 3.0 on one modular architecture.']]),
  media: H.media([['ne-clip.mp4', 'Nephele 2.0 at a live event', 'wide'], ['ne-hero', 'Nephele 2.0 and 3.0 side by side'], ['ne-event', 'With the team and the 3.0 body'], ['ne-inside', 'Inside: Pi 5, stepper motors and drivers'], ['ne-chat', 'Face recognition and voice in action'], ['ne-booth', 'At a conference booth'], ['ne-team', 'The team with Nephele 2.0'], ['ne-pi', 'Raspberry Pi 5 and the wiring harness'], ['ne-poster', 'The Nephele 2.0 launch poster'], ['ne-arch', 'System architecture', 'wide']]),
  recog: H.recog([['◆', 'AWS Cloud Club', 'Student cloud and robotics community', null], ['◆', 'Live deployments', '3-robot fleet at conferences and open houses', null]])
};
T.sw = {
  overview: H.hl('An AI server at the network edge that decides how to talk to every drone in a 300-drone swarm.') + H.by('System architect · edge classifier · 300-UAV simulator · Streamlit dashboard', 'Team NVK — with Yogender Raju, SSN College of Engineering.') + H.facts([['98%', 'bandwidth saved, best case'], ['<50 ms', 'critical unicast latency'], ['<100 ms', 'AI decision on a Pi 5'], ['300', 'UAVs simulated']]),
  modes: '<p>Each message goes the cheapest way that still meets its deadline.</p><div class="modes" role="group" aria-label="Delivery mode">' + [['uni', '6G unicast', 'unicast'], ['multi', '5G eMBMS multicast', 'multicast'], ['broad', 'ATSC 3.0 broadcast', 'broadcast']].map(([m, n, s]) => `<button type="button" data-mode="${m}" data-goto-sec="${s}" aria-pressed="false">${n}</button>`).join('') + '</div><p class="meter">Streams for 300 drones: <b class="bw">300</b></p>' + H.dl([['Unicast', 'Latency-critical commands and telemetry feedback — one stream per drone.'], ['Multicast', 'Targeted group missions — one stream per cluster.'], ['Broadcast', 'Mass mission data to the whole swarm in one transmission.']]),
  edge: H.flow([['tele', 'UAV telemetry', 'swarm size · payload · priority · density · congestion · latency need · packet loss'], ['pi', 'Edge AI server · Raspberry Pi 5', 'trained classifier, under 100 ms per decision'], ['conf', 'Confidence check', 'high → apply · low → rule-based fallback'], ['mode', 'Delivery mode', '6G unicast · 5G eMBMS · ATSC 3.0'], ['dash', 'Mission control dashboard', 'decisions, bandwidth and congestion, live']], 'The fallback keeps the swarm safe when the model is unsure or the Pi is busy.'),
  results: H.kpis([['~98%', 'bandwidth saved'], ['~147 MB', 'saved per operation'], ['32–33%', 'congestion, AI mode'], ['<50 ms', 'critical latency']]) + H.dl([['Pure unicast', '220–230 ms average latency, 30% congestion at 200 UAVs.'], ['Plain multicast', 'Over 40% congestion and unstable latency.'], ['AI mixed mode', 'Comparable latency, ~96–98% less bandwidth, 32–33% congestion.']]),
  media: H.media([['sw-dash', 'Mission control dashboard', 'wide'], ['sw-track', 'Live UAV tracking and decision analytics', 'wide'], ['sw-perf', 'Latency, congestion and bandwidth over time'], ['sw-3d', '3D UAV altitude view'], ['sw-test', 'Manual test panel and predictive analytics'], ['sw-seq', 'Sequence: telemetry → decision → delivery']]),
  recog: H.recog([['★', 'ITU Buildathon 4.0 — 2nd place', 'AI Native Networks & Applications · ITU × FreeStream · Feb 2026', null], ['¶', 'ITU input document FG-AINN-I-215', 'Focus Group on AI Native Networks, 2025–2028', SITE + '/papers/buildathon-itu-fgainn-215.pdf']])
};
T.tz = {
  overview: H.hl('A terahertz bandpass filter that is 25.93% smaller, thanks to fractal slots.') + H.by('Co-author · CST Microwave Studio simulation · tuning · S-parameter analysis', 'With Dr. S. Karthie, SSN College of Engineering.') + H.facts([['3.88 THz', 'centre frequency'], ['38.32 dB', 'return loss'], ['1.63 dB', 'insertion loss'], ['8 × 8 µm²', 'footprint']]),
  design: H.list(['Square-patch perturbed microstrip resonator on RT/Duroid 6010 (εr = 10.7)', 'Swastik fractal slots added over three iterations for miniaturisation', 'Square perturbation at 45° to the 50 Ω feedlines for dual mode', 'Tuned perturbation (2 µm) and gap (0.1 µm) for return loss and selectivity', 'Simulated full-wave in CST Microwave Studio']) + H.parts('Layers — hover to find it on the filter', [['Front metal', 'patch, fractal slots, feedlines', 'front'], ['Substrate', 'RT/Duroid 6010, εr = 10.7', 'sub'], ['Back metal', 'ground plane', 'back'], ['Perturbation', '45° corner square → dual mode', 'pert']]),
  physics: '<p>Current concentrates where the filter resonates. At the two transmission zeros it is pushed out of the patch; at 3.88 THz it fills the fractal slots.</p>' + H.media([['tz-286', 'Surface current at 2.86 THz (left zero)'], ['tz-current', 'Surface current at 3.88 THz (centre)'], ['tz-514', 'Surface current at 5.14 THz (right zero)']]),
  results: H.kpis([['38.32 dB', 'return loss'], ['1.63 dB', 'insertion loss'], ['0.788 THz', '3-dB bandwidth (20.3%)'], ['0.8 ps', 'group delay']]) + H.dl([['Transmission zeros', '2.86 THz (33.10 dB) and 5.14 THz (24.63 dB) on the passband edges.'], ['Transmittance', '70% at resonance.'], ['Size', '25.93% smaller patch than the conventional design.']]),
  media: H.media([['tz-cst', '3D model of the filter in CST', 'wide'], ['tz-struct', 'Geometry and fractal iterations'], ['tz-final', 'S-parameters of the final design'], ['tz-sparam', 'S-parameters across four iterations'], ['tz-smdm', 'Single mode vs dual mode'], ['tz-trans', 'Transmittance']]),
  recog: H.recog([['¶', 'Journal of Optics · Springer', 'Design and implementation of miniaturized dual-mode terahertz bandpass filter based on Swastik slotted fractals · 2025', 'https://doi.org/10.1007/s12596-025-02915-0']])
};
T.or = {
  overview: H.hl('A full 5G network — radio, RAN and core — built from open source on a desk.') + H.by('Intern · deployment · interface tracing · source changes · call-flow validation', 'Techphosis and PEP 5G, March–May 2024.') + H.facts([['B210', 'USRP software radio'], ['srsRAN', '5G RAN'], ['Open5GS', '5G core'], ['8', 'interfaces traced']]),
  radio: H.parts('The testbed — hover to find it', [['USRP B210', '70 MHz – 6 GHz · 2×2 MIMO', 'usrp'], ['Antennas', 'Tx / Rx', 'ant'], ['RAN + core PC', 'srsRAN · Open5GS · Linux', 'pc'], ['Monitor', 'traces and logs', 'mon']]) + H.list(['Deployed the 5G RAN and core with open-source tools', 'Captured and analysed protocol traces at each interface', 'Modified the source, recompiled and validated call flows']),
  stack: H.flow([['ru', 'RU · radio unit', 'USRP B210 · RF and low PHY'], ['du', 'DU · distributed unit', 'high PHY · MAC · RLC'], ['cu', 'CU · central unit', 'PDCP · SDAP · RRC · RRM · OAM'], ['core', '5G core', 'AMF · SMF · UPF · UDM · UDR']], 'Interfaces: F1 (CU–DU), E1 (CU-CP–CU-UP), NG (RAN–core), Xn / X2 (between nodes), FAPI.') + H.dl([['Split 8', 'All PHY in the DU — the RU is just RF. Huge fronthaul.'], ['Split 7.2x', 'Low PHY in the RU — the O-RAN choice.'], ['Split 6', 'MAC–PHY boundary.'], ['Split 2', 'PDCP–RLC: the CU/DU split.']]),
  oran: H.flow([['smo', 'SMO', 'service management and orchestration'], ['nonrt', 'Non-RT RIC · rApps', 'policies over seconds and longer'], ['nearrt', 'Near-RT RIC · xApps', 'control loops in 10 ms – 1 s, over E2'], ['ran', 'O-CU / O-DU / O-RU', 'managed over O1']]),
  media: H.media([['or-usrp', 'The USRP B210 radio beside the RAN PC', 'wide'], ['or-cudu', 'CU and DU running'], ['or-arch', 'Network architecture']]),
  recog: H.recog([['◆', '5G Network Engineer Intern', 'Techphosis × PEP 5G · Mar–May 2024', null]])
};
T.de = {
  overview: H.hl('A board that reads emotions from a face, so psychiatrists get data instead of guesswork.') + H.by('Team lead · embedded AI · TFLite model · Streamlit web app', 'Team Ravagers, five members, St. Joseph’s College of Engineering.') + H.facts([['4', 'emotions'], ['1 GHz', 'Cortex-A7'], ['Real time', 'on the board'], ['₹15,000', 'budget']]),
  board: H.parts('Hardware — hover to find it', [['STM32MP135F-DK', 'Arm Cortex-A7 · 1 GHz', 'board'], ['4.3" touch display', 'live result', 'lcd'], ['HP W100 webcam', '720p face capture', 'cam'], ['64 GB SD card', 'patient emotion history', 'sd']]) + H.list(['Architected the embedded AI system on the STM32MP135F-DK', 'Optimised TensorFlow Lite models for the board', 'Integrated the webcam and SD-card logging', 'Built the Streamlit web app; coordinated the MIT App Inventor mobile app']),
  pipeline: H.flow([['cam', 'Webcam frame', 'HP W100 · 720p'], ['crop', 'Face crop', 'detect and normalise'], ['tfl', 'TensorFlow Lite model', 'on the Cortex-A7'], ['emo', 'Emotion', 'angry · happy · sad · neutral'], ['log', 'Log + dashboard', 'SD card → web and mobile apps for the doctor']]),
  results: H.kpis([['4', 'emotion classes'], ['Real time', 'on the board'], ['₹15,000', 'total budget'], ['2', 'apps: web + mobile']]) + H.dl([['Validated', 'By Dr. A. Turin Martina, Head of P.G. and Research, Rehabilitation Science.'], ['Purpose', 'Insights for doctors before consultation — speeding up diagnosis.']]),
  media: H.media([['de-env', 'The board in its working setup', 'wide'], ['de-board', 'STM32MP135F-DK'], ['de-face', 'Face recognition'], ['de-login', 'Doctor login'], ['de-logs', 'Emotion logs of a patient'], ['de-pred', 'Emotion prediction'], ['de-anal', 'Emotion analysis over time']]),
  recog: H.recog([['★', "Inventors Challenge '23 — Winner", 'DEMS', SITE + '/achievements/inventors-challenge-23']])
};
T.wb = {
  overview: H.hl('A solar robot boat that scoops floating trash out of urban drains.') + H.by('Team leader · system architecture · LoRa remote · propulsion · sensors', 'Team THREADRIPPERZS — six engineers across five disciplines.') + H.facts([['Solar', '+ battery backup'], ['LoRa', 'remote control'], ['3', 'water sensors'], ['6', 'engineers led']]),
  build: H.parts('Parts — hover to find it on the boat', [['Hull', 'foam board and acrylic', 'hull'], ['Mesh ramp', 'scoops floating debris', 'ramp'], ['Brushless motors + ESC', 'propulsion', 'motors'], ['Batteries', 'lead-acid backup', 'batt'], ['Solar wings', 'sustained power', 'solar'], ['Arduino Uno + LoRa', 'control and telemetry', 'ctrl']]) + H.list(['Architected the full boat — hull, propulsion, electronics, sensors, link', 'Designed and built the LoRa remote (Arduino Uno + LoRa, 19200 baud)', 'Integrated brushless motors with the ESC and batteries', 'Led water-quality sensor integration']),
  system: H.flow([['shore', 'Shore remote', 'Arduino + LoRa · Bluetooth for short range'], ['lora', 'LoRa link', '19200 baud, long range'], ['boat', 'Boat controller', 'Arduino Uno · ESC · motors'], ['probes', 'Water probes', 'pH · salinity · dissolved oxygen']]),
  results: H.kpis([['5 days', 'to a working prototype'], ['3', 'live water readings'], ['Solar', 'and battery power'], ['BV800', 'NMCG problem statement']]) + H.dl([['Full-scale design', 'LiDAR for obstacles, a depth sounder, a P4 multispectral camera for trash detection and RTK GPS — with an AI-OPS pipeline for autonomy.'], ['After SIH', 'Extended into an MSME pitch for urban drain cleaning.']]),
  media: H.media([['wb-clip.mp4', 'The full-scale design in 3D', 'wide'], ['wb-front', 'Front: the mesh ramp and hull'], ['wb-angle', 'Inside: batteries and wiring'], ['wb-powered', 'Powered on, Arduino and sensors live'], ['wb-display', 'On display at the Grand Finale'], ['wb-lora', 'Arduino Uno + LoRa remote circuit'], ['wb-motor', 'Wiring the brushless motor and ESC'], ['wb-hull', 'Assembling the foam hull'], ['wb-team', 'Team THREADRIPPERZS', 'wide']]),
  recog: H.recog([['★', "Smart India Hackathon '22 — National finalist", 'Hardware edition · problem BV800 · NMCG', SITE + '/achievements/sih-22-finalist']])
};
// every case: the 10-second answer and associated-with up top, proof links and the hard part where they belong
Object.entries(CASES).forEach(([id, c]) => {
  const t = T[id], tabs = c.tabs.map((x) => x[0]);
  c.html = {};
  tabs.forEach((k) => { c.html[k] = t[k] || ''; });
  c.html.overview = H.tldr(c) + c.html.overview + H.assoc(c) + H.explore(c);
  c.html[tabs[3]] += H.hard(c);
  c.html.recog += H.proofs(c) + H.assoc(c) + H.end(c);
  // the phone card under each chapter: the matching slice of the panel
  const firstOf = {}; c.secs.forEach((s) => { if (s.id !== 'cs' && !firstOf[s.tab]) firstOf[s.tab] = s.id; });
  c.phone = {};
  c.secs.forEach((s) => { if (s.id === 'cs') return; c.phone[s.id] = firstOf[s.tab] === s.id ? (s.tab === 'overview' ? t.overview.slice(t.overview.indexOf('<div class="facts">')) : c.html[s.tab]) : ''; });
});
