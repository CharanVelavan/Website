// ===================== the lab: one workshop room; walk round it freely, or scroll for the tour =====================
// Every project stands where it would on a real bench. Drag to look round, click the floor to walk there, click a project for
// its overview. Scrolling plays the tour stop by stop, and takes the camera back from wherever the visitor walked.
const { default: CameraControls } = await import('camera-controls'); CameraControls.install({ THREE });
const LAB_Y = 0.9, SHELF_Y = 1.79;
// each project: P where it stands, out the way its close-up looks from, dist how far back that close-up stands,
// top its label height above P, rot its own facing when it is not toward the camera, F the point the camera frames (default P)
const EXHIBITS = {
  ba: { P: [DRONE_HOME.x, DESK_Y, DRONE_HOME.z], out: [0.25, 1], dist: 1.5, top: 0.42 },
  ne: { P: [-3.55, 0, 0.85], out: [1, 0.35], dist: 3.1, top: 1.45, F: [-3.55, 0.75, 1.25] },
  sw: { P: [-3.95, 1.0, -1.3], out: [1, 0], dist: 1.9, top: 0.72 },
  tz: { P: [-2.3, LAB_Y, -3.0], out: [0, 1], dist: 1.35, top: 0.32 },
  or: { P: [-0.25, LAB_Y, -3.0], out: [0, 1], dist: 1.6, top: 0.56 },
  de: { P: [1.75, LAB_Y, -3.0], out: [0, 1], dist: 1.4, top: 0.32 },
  wb: { P: [3.95, LAB_Y, -1.55], out: [-1, 0], dist: 1.9, top: 0.55 },
  ss: { P: [3.95, 0.84, 0.45], out: [-1, 0], dist: 1.7, top: 0.42, rot: 0, up: 0.35 },
  sa: { P: [1.95, 0.74, 1.35], out: [0, 1], dist: 1.3, top: 0.4 },
  p10: { P: [-1.6, SHELF_Y, -3.38], out: [0, 1], dist: 1.2, top: 0.36, small: true },
  p11: { P: [0, SHELF_Y, -3.38], out: [0, 1], dist: 1.2, top: 0.36, small: true },
  p12: { P: [1.6, SHELF_Y, -3.38], out: [0, 1], dist: 1.2, top: 0.36, small: true }
};
const exV = (id, k) => { const a = EXHIBITS[id][k]; return a && V3(a[0], a[1], a[2]); };
const exOut = (id) => { const o = EXHIBITS[id].out; return V3(o[0], 0, o[1]).normalize(); };
// the tour, in the order of the numbers on the labels: the room, then round the benches, the shelf, and a step back
const TOUR = ['over', 'ba', 'ne', 'sw', 'tz', 'or', 'de', 'wb', 'ss', 'sa', 'shelf', 'back'];
const SHELF_IDS = ['p10', 'p11', 'p12'];
// a close-up of one project. tour: it sits right of the chapter card; panel: left of the overview panel; phone: centred
function keyFor(id, mode) {
  const e = EXHIBITS[id], ph = narrow(), out = exOut(id), right = V3(out.z, 0, -out.x);
  const F = exV(id, 'F') || exV(id, 'P').add(V3(0, e.top * 0.55, 0)), dist = e.dist * (ph ? 1.4 : 1);
  const pos = F.clone().addScaledVector(out, dist).add(V3(0, 0.3 + dist * 0.2 + (e.up || 0), 0));
  const look = F.clone().addScaledVector(right, ph ? 0 : mode === 'panel' ? dist * 0.17 : -dist * 0.2);
  return { pos, look };
}
function stopKey(name) {
  const ph = narrow();
  if (name === 'over') return ph ? { pos: V3(0, 12.5, 11.5), look: V3(0, 0.2, -1.1) } : { pos: V3(-1.6, 5.8, 8.0), look: V3(-2.6, 0.4, -0.9) };
  if (name === 'back') return ph ? { pos: V3(0.4, 12.5, 10.5), look: V3(0.2, 0.2, -1.1) } : { pos: V3(1.2, 6.2, 7.6), look: V3(-0.6, 0.3, -0.8) };
  if (name === 'shelf') return ph ? { pos: V3(0, 2.3, 2.6), look: V3(0, 2.0, -3.4) } : { pos: V3(-0.6, 2.2, 1.6), look: V3(-1.35, 1.95, -3.4) };
  return keyFor(name, 'tour');
}

// ---------- the room ----------
const labRoom = {};
function buildRoom(g) {
  const wallM = mat(0xefe9df, { roughness: 0.95 }), floorM = mat(0xc7a57e, { roughness: 0.8 }), cabM = mat(0x666a70, { roughness: 0.6 }), dark = mat(0x2b2d31, { roughness: 0.6 });
  const glassM = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.16, roughness: 0.05, depthWrite: false, side: THREE.DoubleSide });
  const add = (m, x, y, z) => { g.add(at(m, x, y, z)); return m; };
  // floor and walls; the front is open to the camera
  add(box(9.0, 0.04, 6.95, floorM), 0, -0.016, -0.225);
  const walls = [add(box(9.0, 3.4, 0.1, wallM), 0, 1.7, -3.7), add(box(0.1, 3.4, 6.95, wallM), 4.5, 1.7, -0.225)];
  // the left wall has a window over the swarm bench
  [[0, 1.15, -3.7, 3.25], [2.65, 3.4, -3.7, 3.25], [1.15, 2.65, -3.7, -2.4], [1.15, 2.65, -0.2, 3.25]].forEach(([y0, y1, z0, z1]) => walls.push(add(box(0.1, y1 - y0, z1 - z0, wallM), -4.5, (y0 + y1) / 2, (z0 + z1) / 2)));
  add(new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.5), new THREE.MeshStandardMaterial({ color: 0xdcebf2, emissive: 0xcfe4ee, emissiveIntensity: 0.7 })), -4.47, 1.9, -1.3).rotation.y = Math.PI / 2;
  [[1.9, 2.2, 0.05], [1.15, 0.05, 2.2], [2.65, 0.05, 2.2]].forEach(([y, h, w]) => add(box(0.06, h > 1 ? 1.5 : h, w > 1 ? 2.2 : 0.05, mat(0xf4f1ea)), -4.44, y, -1.3));
  walls.forEach((w) => { w.castShadow = false; });
  labRoom.walls = walls;
  // benches: a long one on the back wall, one down each side; cabinets under the tops
  const bench = (x, z, w, d) => { add(box(w, 0.05, d, M.wood, 0.01), x, LAB_Y - 0.025, z); add(box(w - 0.04, LAB_Y - 0.06, d - 0.06, cabM, 0.01), x, (LAB_Y - 0.06) / 2, z - 0.01); };
  bench(0, -3.05, 8.8, 0.7); bench(-3.95, -1.1, 0.7, 3.2); bench(3.95, -0.7, 0.7, 4.0);
  labRoom.surfaces = [];
  // the shelf of things to come: three acrylic cases
  add(box(6.2, 0.04, 0.42, M.wood, 0.005), 0, SHELF_Y - 0.02, -3.42);
  SHELF_IDS.forEach((id) => add(box(0.62, 0.42, 0.38, glassM), EXHIBITS[id].P[0], SHELF_Y + 0.21, -3.38));
  [[-2.75, 0x8a4b3a], [-2.6, 0x2f5d8a], [-2.47, 0xd2b04c], [-2.33, 0x3f6f55], [-2.2, 0x6b6e75]].forEach(([x, c]) => add(box(0.11, 0.34, 0.26, mat(c, { roughness: 0.7 })), x, SHELF_Y + 0.17, -3.42));
  // the figurine on the shelf: a small caped figure
  const fig = new THREE.Group(), figM = mat(0x1d2433, { roughness: 0.5 });
  fig.add(at(new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.08, 4, 10), figM), 0, 0.09, 0), at(sphere(0.032, figM), 0, 0.185, 0), at(new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.15, 12, 1, true), mat(0x232c44, { side: THREE.DoubleSide })), 0, 0.08, -0.01), at(new THREE.Mesh(new THREE.ConeGeometry(0.008, 0.03, 6), figM), -0.015, 0.22, 0), at(new THREE.Mesh(new THREE.ConeGeometry(0.008, 0.03, 6), figM), 0.015, 0.22, 0));
  fig.position.set(2.75, SHELF_Y, -3.36); g.add(fig);
  // the swarm's diorama and the WaterBot tank and the skimmer's channel
  add(box(0.62, 0.1, 1.1, mat(0x8fa58a, { roughness: 0.9 }), 0.02), -3.95, LAB_Y + 0.05, -1.3);
  [[-4.05, -1.55, 0.12], [-3.85, -1.05, 0.09], [-4.1, -1.0, 0.07]].forEach(([x, z, h]) => add(new THREE.Mesh(new THREE.ConeGeometry(h * 1.4, h, 7), mat(0x7c9474, { roughness: 0.9 })), x, LAB_Y + 0.1 + h / 2, z));
  add(box(0.6, 0.46, 1.1, glassM), 3.95, LAB_Y + 0.23, -1.55);
  add(box(0.56, 0.02, 1.06, physMat(0x3e7f88, { roughness: 0.1, transparent: true, opacity: 0.55 })), 3.95, LAB_Y + 0.12, -1.55);
  [[-0.27, 0], [0.27, 0]].forEach(([dx]) => add(box(0.04, 0.12, 1.7, dark), 3.95 + dx, LAB_Y + 0.03, 0.45));
  add(box(0.58, 0.12, 0.04, dark), 3.95, LAB_Y + 0.03, -0.4); add(box(0.5, 0.01, 1.66, physMat(0x24302f, { roughness: 0.15 })), 3.95, LAB_Y - 0.04, 0.45);
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.3, 20, 1, true), mat(0x3a3d42, { side: THREE.DoubleSide })), 3.95, LAB_Y + 0.06, -0.33).rotation.x = Math.PI / 2;
  // Nephele 3.0 beside 2.0: a white S-curve body and a tablet face
  const n3 = new THREE.Group(), whiteM = physMat(0xeeeeec, { roughness: 0.4, clearcoat: 0.3 });
  const s = new THREE.Shape(); const prof = (y) => 0.1 * Math.sin(y * 3.1);
  s.moveTo(prof(0) - 0.09, 0); for (let y = 0.1; y <= 1.21; y += 0.1) s.lineTo(prof(y) - 0.09, y); for (let y = 1.2; y >= -0.01; y -= 0.1) s.lineTo(prof(y) + 0.09, Math.max(0, y));
  const body = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.46, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2, curveSegments: 8 }), whiteM);
  body.rotation.y = Math.PI / 2; body.position.set(-0.23, 0.04, 0); n3.add(body);
  n3.add(at(box(0.62, 0.04, 0.5, whiteM, 0.01), 0, 0.02, 0));
  const face = canvasTex(256, 180, (c, w, h) => { c.fillStyle = '#111'; c.fillRect(0, 0, w, h); c.fillStyle = '#5ce07a'; [[70, 45], [150, 45]].forEach(([x, y]) => { c.beginPath(); c.roundRect(x, y, 38, 70, 16); c.fill(); }); });
  const head = new THREE.Group(); head.add(box(0.46, 0.32, 0.05, whiteM, 0.01), at(new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.27), new THREE.MeshStandardMaterial({ map: face, emissive: 0xffffff, emissiveMap: face, emissiveIntensity: 0.6 })), 0, 0, 0.027));
  head.position.set(0, 1.42, 0.02); n3.add(head, at(box(0.06, 0.18, 0.06, whiteM), 0, 1.24, 0));
  n3.position.set(-3.55, 0, 1.68); n3.rotation.y = Math.atan2(1, 0.35); g.add(n3);
  // the bench kit around each project: the THz microscope and its plot, the radio's spectrum, the DEMS laptop
  const screen = (w, h, draw) => new THREE.Mesh(new THREE.PlaneGeometry(w, h), (() => { const t = canvasTex(256, Math.round(256 * h / w), draw); return new THREE.MeshStandardMaterial({ map: t, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: 0.55 }); })());
  const monitor = (x, z, ry, draw) => { const m = new THREE.Group(); m.add(at(box(0.56, 0.34, 0.025, M.blackPlastic, 0.006), 0, 0.3, 0), at(screen(0.53, 0.31, draw), 0, 0.3, 0.0135), at(box(0.04, 0.13, 0.03, M.blackPlastic), 0, 0.07, -0.02), at(box(0.2, 0.012, 0.14, M.blackPlastic), 0, 0.006, -0.01)); m.position.set(x, LAB_Y, z); m.rotation.y = ry; g.add(m); return m; };
  monitor(-1.65, -3.2, -0.15, (c, w, h) => { c.fillStyle = '#0d1420'; c.fillRect(0, 0, w, h); c.strokeStyle = '#6fd3ff'; c.lineWidth = 3; c.beginPath(); for (let x = 0; x <= w; x += 4) { const u = x / w, y = h * 0.85 - h * 0.65 * Math.exp(-((u - 0.5) ** 2) / 0.01); x ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); });
  monitor(0.45, -3.2, -0.12, (c, w, h) => { c.fillStyle = '#0b1220'; c.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 6) { const v = Math.abs(Math.sin(x * 0.05) * Math.cos(x * 0.013)) * h * 0.7 + 6; c.fillStyle = '#35c2e0'; c.fillRect(x, h - v, 4, v); } });
  const lap = new THREE.Group(); lap.add(box(0.36, 0.018, 0.25, M.blackPlastic, 0.004)); const lid = screen(0.34, 0.22, (c, w, h) => { c.fillStyle = '#300a24'; c.fillRect(0, 0, w, h); c.fillStyle = '#e8e8e8'; c.font = '12px monospace'; ['$ bitbake st-image-weston', 'MACHINE = stm32mp135f-dk', 'DISTRO = openstlinux-weston', 'Build Configuration ...'].forEach((l, i) => c.fillText(l, 8, 20 + i * 18)); });
  lid.position.set(0, 0.12, -0.12); lid.rotation.x = -0.25; lap.add(lid); lap.position.set(2.55, LAB_Y + 0.01, -3.0); lap.rotation.y = -0.35; g.add(lap);
  const scope = new THREE.Group(); scope.add(at(box(0.2, 0.03, 0.22, M.white, 0.01), 0, 0.015, 0), at(cyl(0.02, 0.02, 0.32, M.white, 12), 0, 0.17, -0.07), at(box(0.09, 0.08, 0.16, M.white, 0.01), 0, 0.3, -0.01), at(cyl(0.022, 0.016, 0.1, M.blackPlastic, 12), 0, 0.24, 0.03));
  scope.position.set(-2.85, LAB_Y, -3.05); scope.rotation.y = 0.4; g.add(scope);
  // the Echo's side table, the stool, lamps and plants
  add(box(0.7, 0.04, 0.5, M.wood, 0.01), 1.95, 0.72, 1.35); [[-0.3, -0.2], [0.3, -0.2], [-0.3, 0.2], [0.3, 0.2]].forEach(([x, z]) => add(box(0.035, 0.7, 0.035, M.metal), 1.95 + x, 0.35, 1.35 + z));
  const tab = add(screen(0.22, 0.15, (c, w, h) => { c.fillStyle = '#0a1726'; c.fillRect(0, 0, w, h); c.strokeStyle = '#4fb6ff'; c.lineWidth = 3; c.beginPath(); for (let x = 0; x <= w; x += 3) { const y = h / 2 + Math.sin(x * 0.2) * Math.sin(x * 0.03) * h * 0.3; x ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); }), 2.17, 0.82, 1.3); tab.rotation.set(-0.35, -0.25, 0);
  const stool = new THREE.Group(); stool.add(at(cyl(0.18, 0.18, 0.05, M.blackPlastic, 24), 0, 0.62, 0), at(cyl(0.025, 0.025, 0.6, M.metal, 8), 0, 0.3, 0), at(cyl(0.2, 0.22, 0.03, M.metal, 24), 0, 0.015, 0)); stool.position.set(-2.9, 0, -0.55); g.add(stool);
  [[-1.15, 0.3], [1.15, -0.3]].forEach(([x, ry]) => { const l = new THREE.Group(); l.add(at(cyl(0.07, 0.08, 0.03, dark, 16), 0, 0.015, 0), at(cyl(0.012, 0.012, 0.42, dark, 8), 0, 0.22, 0), at(new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.12, 18, 1, true), mat(0x2b2d31, { side: THREE.DoubleSide })), 0.05, 0.43, 0.05), at(sphere(0.03, new THREE.MeshStandardMaterial({ color: 0xfff1d0, emissive: 0xffd99a, emissiveIntensity: 1.2 })), 0.05, 0.4, 0.05)); l.position.set(x, LAB_Y, -3.25); l.rotation.y = ry; g.add(l); });
  const leafM = mat(0x5f8f55, { roughness: 0.8 }), potM = mat(0xc96f4a, { roughness: 0.8 });
  [[-4.05, 0, 2.75, 1], [4.05, 0, 2.55, 0.85], [-4.1, LAB_Y, -3.2, 0.45], [3.3, LAB_Y, -3.25, 0.4]].forEach(([x, y, z, s]) => { const p = new THREE.Group(); p.add(at(cyl(0.16, 0.12, 0.3, potM, 16), 0, 0.15, 0), at(new THREE.Mesh(new THREE.IcosahedronGeometry(0.32, 1), leafM), 0, 0.55, 0)); p.scale.setScalar(s); p.position.set(x, y, z); g.add(p); });
  // the whiteboard and pegboard
  const wb = add(screen(1.6, 1.0, (c, w, h) => { c.fillStyle = '#fbfbf8'; c.fillRect(0, 0, w, h); c.fillStyle = '#2b3a55'; c.font = '600 22px Switzer, sans-serif'; ['Build', 'Learn', 'Solve', 'Repeat'].forEach((t, i) => c.fillText(t, 150, 40 + i * 30)); c.strokeStyle = '#2b3a55'; c.strokeRect(20, 30, 90, 60); c.beginPath(); c.moveTo(110, 60); c.lineTo(140, 60); c.stroke(); }), 4.44, 1.6, 2.35); wb.rotation.y = -Math.PI / 2; wb.scale.setScalar(0.7); wb.material.emissiveIntensity = 0.15;
  add(box(1.5, 0.9, 0.03, mat(0xd8cdb8, { roughness: 0.9 })), 3.5, 1.6, -3.64);
  shadowAll(g); walls.forEach((w) => { w.castShadow = false; });
  // what a click can land on to walk: the floor and the bench tops
  labRoom.walkables = g.children.filter((c) => c.isMesh && c.geometry.type === 'BoxGeometry' && c.position.y < 1);
}

// ---------- the layout: the plinths become exhibits in the room ----------
const groundDisc = lab.children.find((c) => c.geometry && c.geometry.parameters && c.geometry.parameters.radiusTop === 4.7);
LAYS.lab = {
  order: plinths.map((_, k) => k), ownTags: true,
  build: buildRoom,
  apply() {
    plinths.forEach((p) => {
      const e = EXHIBITS[p.id]; if (!e) return;
      const out = exOut(p.id); stand(p, exV(p.id, 'P'), e.rot != null ? e.rot : Math.atan2(out.x, out.z), 0.01, false);
      p.top = e.top; p.holder.visible = p.id !== 'ba'; p.holder.scale.setScalar(e.small ? 0.55 : 1);
    });
    if (groundDisc) groundDisc.visible = false;
  },
  leave() { plinths.forEach((p) => { p.holder.visible = true; p.holder.scale.setScalar(1); }); if (groundDisc) groundDisc.visible = true; EX.on = false; EX.w = 0; closePanel(); labTagsHide(); },
  scope(r) { if (groundDisc) groundDisc.visible = !!r; },
  over() { const k = stopKey('over'); return { pos: k.pos.clone().multiplyScalar(1.12), look: k.look }; },
  cam(q) {
    const k = clamp01(q / (TOUR.length - 1)) * (TOUR.length - 1), k0 = Math.floor(Math.min(k, TOUR.length - 1.0001)), u = k - k0;
    const a = stopKey(TOUR[k0]), b = stopKey(TOUR[k0 + 1]); return { pos: lerpV(a.pos, b.pos, u), look: lerpV(a.look, b.look, u) };
  },
  tl() { return narrow() ? { pos: V3(0.3, 11, 6.5), look: V3(0.3, 0, -1.2) } : { pos: V3(-1.2, 7.4, 6.6), look: V3(1.1, 0, -0.5) }; },
  front(q) { if (EX.on) { const id = hoverId || EX.focus; return id ? idxOf(id) : -1; } const id = TOUR[Math.round(q)]; return EXHIBITS[id] ? idxOf(id) : -1; },
  settled(q) { return EX.on || Math.abs(q - Math.round(q)) < 0.25; },
  pinAt(p, n) { const e = EXHIBITS[p.id] || EXHIBITS.p10, out = exOut(p.id in EXHIBITS ? p.id : 'p10'), P = V3(e.P[0], 0, e.P[2]).addScaledVector(out, e.small ? 0.8 : 0.75); return P.add(V3(out.z, 0, -out.x).multiplyScalar(n * 0.24)); },
  camera: labCamera,
  tap: labTap,
  frame: labFrame
};

// ---------- explore: one camera-controls rig, driven by our own input so the page can still scroll ----------
const cc = new CameraControls(camera);
cc.smoothTime = reduced ? 0.0001 : 0.32; cc.draggingSmoothTime = reduced ? 0.0001 : 0.1;
cc.minDistance = 0.45; cc.maxDistance = 13; cc.minPolarAngle = 0.15; cc.maxPolarAngle = 1.48;
cc.setBoundary(new THREE.Box3(V3(-4.1, 0.15, -3.35), V3(4.1, 2.6, 3.0)));
// EX.on: the visitor is driving; w: how much of the camera is theirs (it eases back to the tour when they scroll)
const EX = { on: false, w: 0, anchor: 0, focus: null };
// the page position explore started from: a real scroll moves it, a stale scroll reading (phones, right after a jump) does not
let hoverId = null, lastCam = { pos: V3(0, 5, 8), look: V3() };
const labRange = (sp) => !route && layId === 'lab' && sp > 0.75 && sp < RN_ + 0.35;
function enterExplore() {
  if (EX.on) return;
  cc.colliderMeshes = labRoom.walls || [];
  cc.setLookAt(lastCam.pos.x, lastCam.pos.y, lastCam.pos.z, lastCam.look.x, lastCam.look.y, lastCam.look.z, false); cc.update(0);
  EX.on = true; EX.w = 1; EX.anchor = scrollY; document.body.classList.add('exploring');
}
function leaveExplore() { if (!EX.on) return; EX.on = false; EX.focus = null; closePanel(); document.body.classList.remove('exploring'); }
const tmpP = V3(), tmpT = V3();
function labCamera(cam, dt, sp) {
  if (!labRange(sp) && EX.on) leaveExplore();
  // any scroll hands the camera back to the tour, from wherever the visitor walked
  if (EX.on && Math.abs(scrollY - EX.anchor) > 24) leaveExplore();
  let out = cam;
  if (EX.on || EX.w > 0.001) {
    cc.update(dt); cc.getPosition(tmpP, false); cc.getTarget(tmpT, false);
    if (!EX.on) { EX.w *= 1 - damp(reduced ? 60 : 4, dt); if (EX.w < 0.002) EX.w = 0; }
    const w = ease(EX.w); out = { pos: lerpV(cam.pos, tmpP, w), look: lerpV(cam.look, tmpT, w) };
  }
  lastCam = { pos: out.pos.clone(), look: out.look.clone() };
  return out;
}
// jump the page to a tour stop without the camera sweeping through the stops between
function syncScrollTo(stop) {
  const el = stopsEl.children[stop]; if (!el) return;
  scrollTo({ top: el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2, behavior: 'instant' });
  EX.anchor = scrollY; readScroll(); smoothP = scrollP;
  // a phone can report the old layout on the first frames after the jump; read it again once it has settled
  requestAnimationFrame(() => requestAnimationFrame(() => { readScroll(); smoothP = scrollP; }));
}
function scrollToStop(stop) { const el = stopsEl.children[stop]; if (el) scrollTo({ top: el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2, behavior: smooth() }); }
const tourStopOf = (id) => SHELF_IDS.includes(id) ? TOUR.indexOf('shelf') : TOUR.indexOf(id);
// a project: fly up to it, line the page up with its tour stop, and open its overview
function selectProject(id) {
  if (route || !EXHIBITS[id]) return;
  enterExplore(); syncScrollTo(tourStopOf(id));
  EX.focus = id; const k = keyFor(id, 'panel');
  cc.setLookAt(k.pos.x, k.pos.y, k.pos.z, k.look.x, k.look.y, k.look.z, !reduced);
  openPanel(id); track('lab_select', { id });
}
// walking: a click on the floor or a bench top moves the point you look round to there
const walkRay = new THREE.Raycaster(), walkNdc = new THREE.Vector2();
const marker = new THREE.Mesh(new THREE.RingGeometry(0.12, 0.16, 40), new THREE.MeshBasicMaterial({ color: SLOT.link, transparent: true, opacity: 0, depthWrite: false })); marker.rotation.x = -Math.PI / 2; scene.add(marker); let markerT = 9;
function walkTo(e) {
  walkNdc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); walkRay.setFromCamera(walkNdc, camera);
  const hit = walkRay.intersectObjects(labRoom.walkables || [], false).find((h) => h.face && h.face.normal.clone().transformDirection(h.object.matrixWorld).y > 0.6);
  if (!hit) return;
  enterExplore(); EX.focus = null; closePanel();
  const T = V3(THREE.MathUtils.clamp(hit.point.x, -3.9, 3.9), THREE.MathUtils.clamp(hit.point.y + 0.55, 0.55, 1.5), THREE.MathUtils.clamp(hit.point.z, -3.2, 2.8));
  cc.moveTo(T.x, T.y, T.z, !reduced); if (cc.distance > 4.5) cc.dollyTo(3.4, !reduced);
  marker.position.copy(hit.point).add(V3(0, 0.012, 0)); markerT = 0; track('lab_walk', {});
}
// what the pointer is over: any exhibit, the coming-soon crates included
function pickLab(e) {
  walkNdc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); walkRay.setFromCamera(walkNdc, camera);
  const hit = walkRay.intersectObjects([drone, ...plinths.filter((p) => EXHIBITS[p.id]).map((p) => p.g)], true)[0]; if (!hit) return null;
  for (let o = hit.object; o; o = o.parent) { if (o === drone) return 'ba'; const p = plinths.find((q) => q.g === o); if (p) return p.id; }
  return null;
}
function labTap(e) { const id = pickLab(e); if (id) selectProject(id); else walkTo(e); }
// drag to look round, pinch or ctrl + scroll to zoom; a plain scroll still moves the page (the tour)
const lptr = new Map(); let ldrag = null, lpinch = 0;
canvas.addEventListener('pointerdown', (e) => {
  if (!labRange(window.__p || 0)) return; lptr.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (lptr.size === 2) { const [a, b] = [...lptr.values()]; lpinch = Math.hypot(a.x - b.x, a.y - b.y); ldrag = null; return; }
  ldrag = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: 0 };
});
addEventListener('pointermove', (e) => {
  if (lptr.has(e.pointerId)) lptr.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (lptr.size === 2 && lpinch) { const [a, b] = [...lptr.values()], d = Math.hypot(a.x - b.x, a.y - b.y); enterExplore(); cc.dolly((d - lpinch) * 0.012, false); lpinch = d; return; }
  if (ldrag && e.pointerId === ldrag.id) {
    const dx = e.clientX - ldrag.x, dy = e.clientY - ldrag.y; ldrag.x = e.clientX; ldrag.y = e.clientY; ldrag.moved += Math.abs(dx) + Math.abs(dy);
    if (ldrag.moved > 4) { enterExplore(); cc.rotate(-dx * 0.0038, -dy * 0.003, true); canvas.classList.add('grabbing'); }
    return;
  }
  if (!labRange(window.__p || 0)) return;
  if (e.target === canvas) { hoverId = pickLab(e); canvas.style.cursor = hoverId ? 'pointer' : 'grab'; } else hoverId = null;
});
const lend = (e) => { lptr.delete(e.pointerId); if (lptr.size < 2) lpinch = 0; if (ldrag && e.pointerId === ldrag.id) { ldrag = null; canvas.classList.remove('grabbing'); } };
addEventListener('pointerup', lend); addEventListener('pointercancel', lend);
canvas.addEventListener('wheel', (e) => { if (!labRange(window.__p || 0) || !e.ctrlKey) return; e.preventDefault(); enterExplore(); cc.dolly(-e.deltaY * 0.02, true); }, { passive: false });
// keys: ← → turn, and ↑ ↓ walk once you are exploring (before that they scroll the tour); + − zoom
addEventListener('keydown', (e) => {
  if (!labRange(window.__p || 0) || e.metaKey || e.ctrlKey || e.altKey || (e.target.closest && e.target.closest('input, textarea'))) return;
  if (e.key === 'Escape' && panelEl.classList.contains('on') && lightbox.hidden) { closePanel(true); return; }
  const turn = { ArrowLeft: 0.22, ArrowRight: -0.22 }[e.key], walk = { ArrowUp: 0.45, ArrowDown: -0.45 }[e.key], zoom = { '+': 0.6, '=': 0.6, '-': -0.6 }[e.key];
  if (turn) { e.preventDefault(); enterExplore(); cc.rotate(turn, 0, true); }
  else if (walk && EX.on) { e.preventDefault(); cc.forward(walk, true); }
  else if (zoom) { e.preventDefault(); enterExplore(); cc.dolly(zoom, true); }
});

// ---------- labels: every project numbered in the wide views, the one in front named in a close-up ----------
const NUM = { p10: '10', p11: '11', p12: '12' };
const labTags = Object.fromEntries(Object.keys(EXHIBITS).map((id) => {
  const P = PROJECTS.find((q) => q.id === id), soon = !P, el = mkTag(`<span class="no">${soon ? NUM[id] : P.n}</span><b>${soon ? 'Coming soon' : CASES[id].short || P.name}</b> <i>${soon ? '' : 'Overview →'}</i>`, 'tag link labtag');
  el.setAttribute('role', 'button'); el.addEventListener('click', () => selectProject(id)); return [id, el];
}));
function labTagsHide() { Object.values(labTags).forEach((el) => { el.style.opacity = 0; el.style.pointerEvents = 'none'; }); }
const anchorOf = (id) => id === 'ba' ? wpos(drone, V3(0, 0.3, 0)) : wpos(plinths[idxOf(id)].g, V3(0, EXHIBITS[id].top + 0.06, 0));
function labFrame(dt, t, sp, front) {
  const inLab = labRange(sp), q = sp - 1, k = Math.round(q), stop = TOUR[k], near = Math.abs(q - k) < 0.25;
  const wide = !EX.on && near && (stop === 'over' || stop === 'back'), shelf = !EX.on && near && stop === 'shelf';
  const ctr = EX.on ? cc.getTarget(tmpT, false) : null, frontId = front >= 0 ? plinths[front].id : null;
  Object.entries(labTags).forEach(([id, el]) => {
    let show = false, hot = false;
    if (inLab) {
      if (EX.on) { hot = id === hoverId || id === EX.focus; show = hot || (!EX.focus && anchorOf(id).distanceTo(ctr) < 4.2); }
      else if (wide || (shelf && SHELF_IDS.includes(id))) show = true;
      else if (near && id === frontId) { show = true; hot = true; }
    }
    el.classList.toggle('hot', hot); el.classList.toggle('mini', show && !hot);
    place(el, anchorOf(id), show); el.style.pointerEvents = show ? 'auto' : 'none';
  });
  // the walk marker fades as the camera arrives
  markerT += dt; marker.material.opacity = Math.max(0, 0.9 - markerT * 1.2) * (inLab ? 1 : 0);
  barEl.classList.toggle('on', inLab); document.body.classList.toggle('in-lab', inLab);
  if (!inLab && panelEl.classList.contains('on')) closePanel();
}

// ---------- the overview panel: photos, media, what it is and what it won, then the full case study ----------
const panelEl = document.createElement('aside'); panelEl.id = 'lpanel'; panelEl.setAttribute('role', 'dialog'); panelEl.setAttribute('aria-labelledby', 'lpTitle'); document.body.appendChild(panelEl);
const tourIds = TOUR.filter((x) => EXHIBITS[x] && CASES[x]);
let panelFrom = null;
function panelHTML(id) {
  const C = CASES[id], P = PROJECTS.find((q) => q.id === id), i = tourIds.indexOf(id);
  const nav = `<div class="lp-nav"><button type="button" class="pill sm" data-lp="${tourIds[(i - 1 + tourIds.length) % tourIds.length]}">← ${CASES[tourIds[(i - 1 + tourIds.length) % tourIds.length]].short || PROJECTS.find((q) => q.id === tourIds[(i - 1 + tourIds.length) % tourIds.length]).name}</button><button type="button" class="pill sm" data-lp="${tourIds[(i + 1) % tourIds.length]}">${CASES[tourIds[(i + 1) % tourIds.length]].short || PROJECTS.find((q) => q.id === tourIds[(i + 1) % tourIds.length]).name} →</button></div>`;
  if (!C) return `<div class="lp-top"><span class="lp-no">${NUM[id]}</span><button type="button" class="pill sm inv" data-lp-close aria-label="Close overview">✕ esc</button></div><div class="lp-body"><h2 id="lpTitle">Coming soon</h2><p class="lp-sub">Project ${NUM[id]} is being written up. It will open here when it is ready.</p></div>`;
  const tmp = document.createElement('div'); tmp.innerHTML = C.html.media || ''; const strip = [...tmp.querySelectorAll('.media > button')].slice(0, 8).map((b) => { b.className = ''; return b.outerHTML; }).join('');
  return `<div class="lp-top"><span class="lp-no">${P.n}</span><span class="lp-tg">${C.tg}</span><button type="button" class="pill sm inv" data-lp-close aria-label="Close overview">✕ esc</button></div>
  <div class="lp-hero"><img src="img/${C.photo}.webp" alt="${C.name}" style="object-position:${C.pos || '50% 50%'}"></div>
  <div class="lp-body"><h2 id="lpTitle" tabindex="-1">${C.name}</h2><p class="lp-sub">${C.sub}</p>${H.tldr(C)}
  ${strip ? `<h4 class="sub">Photos and media</h4><div class="lp-strip media">${strip}</div>` : ''}
  <h4 class="sub">Recognition</h4>${C.html.recog || ''}${H.proofs(C)}</div>
  <div class="lp-foot"><button type="button" class="btn primary" data-open="${id}" data-lp-go>Open case study →</button>${nav}</div>`;
}
function openPanel(id) {
  if (!panelEl.classList.contains('on')) panelFrom = document.activeElement;
  panelEl.innerHTML = panelHTML(id); panelEl.scrollTop = 0; panelEl.dataset.id = id; armVideos(panelEl);
  panelEl.classList.add('on'); document.body.classList.add('lp-open');
  const h = panelEl.querySelector('#lpTitle'); if (h && h.focus) setTimeout(() => h.focus({ preventScroll: true }), reduced ? 0 : 280);
}
function closePanel(refocus) {
  if (!panelEl.classList.contains('on')) return;
  panelEl.classList.remove('on'); document.body.classList.remove('lp-open'); EX.focus = null;
  // focus goes back where it came from, or to the toolbar when that is gone (the project grid closes behind you)
  if (refocus) { const back = panelFrom && panelFrom.isConnected && panelFrom.offsetParent ? panelFrom : barEl.querySelector('[data-bar="all"]'); back.focus({ preventScroll: true }); }
}
panelEl.addEventListener('click', (e) => {
  const b = e.target.closest('[data-lp],[data-lp-close],[data-lp-go]'); if (!b) return;
  if (b.dataset.lp) selectProject(b.dataset.lp);
  else if (b.hasAttribute('data-lp-close')) closePanel(true);
  // the case study opens from here; the lab hands the camera back to the tour, which already stands at this project
  else { panelEl.classList.remove('on'); document.body.classList.remove('lp-open'); EX.on = false; EX.w = 0; EX.focus = null; document.body.classList.remove('exploring'); }
});

// ---------- the toolbar: every project, the tour, zoom, and back to the whole room ----------
const barEl = document.createElement('div'); barEl.id = 'labbar'; barEl.setAttribute('role', 'toolbar'); barEl.setAttribute('aria-label', 'Lab controls');
barEl.innerHTML = `<button type="button" data-bar="all" aria-expanded="false" aria-controls="lgrid"><span aria-hidden="true">▦</span> All projects</button><button type="button" data-bar="tour"><span aria-hidden="true">▶</span> Tour</button><button type="button" data-bar="out" aria-label="Zoom out">−</button><button type="button" data-bar="in" aria-label="Zoom in">+</button><button type="button" data-bar="reset"><span aria-hidden="true">⟲</span> Reset view</button><span class="hint">Drag to look · Click the floor to walk · Click a project</span>`;
document.body.appendChild(barEl);
const gridEl = document.createElement('div'); gridEl.id = 'lgrid'; gridEl.hidden = true; gridEl.setAttribute('role', 'dialog'); gridEl.setAttribute('aria-label', 'All projects');
gridEl.innerHTML = Object.keys(EXHIBITS).filter((id) => !SHELF_IDS.includes(id)).sort((a, b) => tourStopOf(a) - tourStopOf(b)).map((id) => { const P = PROJECTS.find((q) => q.id === id); return `<button type="button" data-lp="${id}"><img src="img/${CASES[id].photo}.webp" alt=""><span><b>${P.n}</b> ${CASES[id].short || P.name}</span></button>`; }).join('') + '<p>10 – 12 · Coming soon, on the top shelf</p>';
document.body.appendChild(gridEl);
const toggleGrid = (on) => { gridEl.hidden = !on; barEl.querySelector('[data-bar="all"]').setAttribute('aria-expanded', String(on)); if (on) gridEl.querySelector('button').focus(); };
gridEl.addEventListener('click', (e) => { const b = e.target.closest('[data-lp]'); if (b) { toggleGrid(false); selectProject(b.dataset.lp); } });
addEventListener('keydown', (e) => { if (e.key === 'Escape' && !gridEl.hidden) { toggleGrid(false); barEl.querySelector('[data-bar="all"]').focus(); } });
barEl.addEventListener('click', (e) => {
  const b = e.target.closest('[data-bar]'); if (!b) return; const a = b.dataset.bar;
  if (a === 'all') toggleGrid(gridEl.hidden);
  // Tour: back to the tour where you are, or on to its next stop
  else if (a === 'tour') { const cur = Math.max(0, Math.round((window.__p || 1) - 1)), was = EX.on; leaveExplore(); scrollToStop(Math.min(TOUR.length - 1, was ? cur : cur + 1)); }
  else if (a === 'in' || a === 'out') { enterExplore(); cc.dolly(a === 'in' ? 0.7 : -0.7, true); }
  else if (a === 'reset') { leaveExplore(); scrollToStop(0); }
});
// the card's project chips open the overview here instead of jumping straight into the case study
document.querySelectorAll('#labChips [data-open]').forEach((b) => { b.dataset.lp = b.dataset.open; delete b.dataset.open; });
document.getElementById('labChips').addEventListener('click', (e) => { const b = e.target.closest('[data-lp]'); if (b) selectProject(b.dataset.lp); });
applyLayout('lab');
