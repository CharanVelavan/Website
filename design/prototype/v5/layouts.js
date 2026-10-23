// ===================== lab layouts: the same plinths and objects, arranged five ways (Settings → Lab layout) =====================
// ring: a circle of plinths, the camera orbits it. carousel: the ring turns in front of a still camera; drag it, zoom it.
// tower: one floor per layer of the stack, with a lift. shelves: a workshop wall, one bay per project in year order.
// sites: each project out on the terrain where it works, joined by the flight path.
// bench: a workshop; the projects on an L of workbenches round the desk, the big ones on the floor beside.
// In every layout a click on an object (or the drone on the bench) opens its case study.
const LAYOUT_IDS = ['ring', 'bench', 'carousel', 'tower', 'shelves', 'sites'];
const RN_ = plinths.length, wrapA = (x) => Math.atan2(Math.sin(x), Math.cos(x));
const idxOf = (id) => plinths.findIndex((p) => p.id === id);
// where the ring layout keeps its pins and track, so other layouts can hand them back
const ringPins = pins.map((p) => p.position.clone()), ringTrack = Array.from({ length: tlLine.geometry.attributes.position.count }, (_, j) => V3().fromBufferAttribute(tlLine.geometry.attributes.position, j));
function stand(p, pos, rotY, base, ped) { p.g.position.copy(pos); p.g.rotation.y = rotY; p.base = base; p.top = base + p.objTop; p.ped.visible = p.lip.visible = ped; p.holder.position.y = base; }
const ringPlace = () => plinths.forEach((p) => { stand(p, ringOut(p.a).multiplyScalar(RING_R), Math.atan2(Math.cos(p.a), Math.sin(p.a)), p.h, true); });
const P_ = (p) => wpos(p.g);
// a camera that looks at one object; on desktop the object sits right of the chapter card
function lookAt(p, out, dist, up, ph) {
  const P = P_(p), right = V3(out.z, 0, -out.x), top = p.top;
  return { pos: P.clone().addScaledVector(out, dist).add(V3(0, up + top * 0.45, 0)), look: P.clone().add(V3(0, top * 0.7 + (ph ? 0.35 : 0), 0)).addScaledVector(right, ph ? 0 : -0.8) };
}
// stop k → the plinth for that stop, eased between two plinths
function camBetween(L, q) {
  const k = clamp01(q / Math.max(1, RN_ - 1)) * (RN_ - 1), k0 = Math.floor(Math.min(k, RN_ - 1.0001)), u = k - k0;
  const a = L.key(plinths[L.order[k0]]), b = L.key(plinths[L.order[Math.min(k0 + 1, RN_ - 1)]]);
  return { pos: lerpV(a.pos, b.pos, u), look: lerpV(a.look, b.look, u) };
}
// the flight path everywhere but the ring: a pin in front of each project, the track through them in year order
function pinsFrom(L) {
  const seen = {}, spare = plinths.find((q) => q.placeholder);
  return TIMELINE.map(([, , , id]) => { const p = id && plinths.find((q) => q.id === id); const n = id ? (seen[id] = (seen[id] || 0) + 1) - 1 : 1; return L.pinAt(p || spare, n); });
}
function tlFrom(pts) {
  const c = new THREE.CatmullRomCurve3(pts.map((p) => p.clone().add(V3(0, 0.02, 0))), false, 'centripetal');
  return c.getPoints(240);
}
// a wide shot over all the pins, for the flight-path chapter
function tlOver(ph) {
  const b = new THREE.Box3(); pins.forEach((p) => b.expandByPoint(p.position)); const c = b.getCenter(V3()), s = Math.max(4, b.getSize(V3()).length());
  return ph ? { pos: c.clone().add(V3(0, s * 0.9 + 4, s * 0.55 + 2)), look: c.clone().add(V3(0, 0, 0.4)) } : { pos: c.clone().add(V3(-s * 0.1, s * 0.5 + 3, s * 0.62 + 3)), look: c.clone().add(V3(s * 0.3, 0, 0)) };
}
const layGroup = (L) => { if (!L.grp) { L.grp = new THREE.Group(); scene.add(L.grp); if (L.build) L.build(L.grp); } return L.grp; };
const LAYS = {};

// ---------- ring: the camera orbits a still ring (frame.js keeps its original cameras) ----------
LAYS.ring = { order: plinths.map((_, k) => k), apply: ringPlace, pinsRing: true };

// ---------- carousel: a turntable; the camera stays put and the ring turns the next project to the front ----------
const ZOOM_MIN = 0.55, ZOOM_MAX = 1.6;
const car = { off: 0, vel: 0, snap: 0, zoom: 1, zoomT: 1, drag: null, theta: 0 };
// a throw lands where its momentum would carry it, rounded to a plinth and held to three plinths either way
function carRelease() { const from = Math.round(car.off / RING_STEP), to = Math.round((car.off + (reduced ? 0 : car.vel * 12)) / RING_STEP); car.snap = THREE.MathUtils.clamp(to, from - 3, from + 3) * RING_STEP; car.vel = 0; }
LAYS.carousel = {
  order: plinths.map((_, k) => k), pinsRing: true, draggable: true,
  build() {
    // the turntable lives in the ring group so it turns with the plinths
    const disc = new THREE.Group(); disc.add(at(cyl(RING_R + 0.7, RING_R + 0.76, 0.07, mat(0x2a2b30, { roughness: 0.45, metalness: 0.3 }), 96), 0, 0.035, 0), at(new THREE.Mesh(new THREE.TorusGeometry(RING_R + 0.72, 0.012, 8, 160), M.copper), 0, 0.072, 0).rotateX(Math.PI / 2));
    shadowAll(disc); this.disc = disc;
  },
  apply() { ringPlace(); plinths.forEach((p) => { p.g.position.y = 0.07; }); ring.add(this.disc); this.disc.visible = true; },
  leave() { this.disc.visible = false; ring.rotation.y = 0; },
  qEff: (q) => q - car.off / RING_STEP,
  front(q) { return ((Math.round(this.qEff(q)) % RN_) + RN_) % RN_; },
  settled(q) { const e = this.qEff(q); return !car.drag && Math.abs(car.snap - car.off) < RING_STEP * 0.12 && Math.abs(e - Math.round(e)) < 0.12; },
  // the front of the turntable faces the camera (+z); the plinth there sits right of the card on desktop
  cam(q) {
    const ph = narrow(), k = this.front(q), top = plinths[k].top + 0.07;
    const look = V3(ph ? 0 : -0.9, Math.min(top, 1.1) * 0.75 + (ph ? 0.4 : 0), RING_R - 0.2), pos = V3(0, ph ? 1.9 : 1.5, RING_R + (ph ? 4.3 : 3.0));
    // zoom about the front object, so it holds its place on screen (beside the card) as the camera closes in
    const O = V3(0, Math.min(top, 1.1) * 0.6, RING_R), z = (v) => O.clone().add(v.sub(O).multiplyScalar(car.zoom));
    return { pos: z(pos), look: z(look) };
  },
  over() { const ph = narrow(); return { pos: V3(0, ph ? 7.5 : 5.2, RING_R + (ph ? 10 : 7.5)), look: V3(0, 0.6, 0.4) }; },
  frame(dt, t, sp) {
    // the turn follows the scroll, plus whatever the visitor dragged; it eases back to rest for the flight path
    if (!car.drag) car.off += (car.snap - car.off) * (reduced ? 1 : damp(6, dt));
    car.zoom += (car.zoomT - car.zoom) * damp(10, dt);
    const i = Math.min(Math.floor(sp), RN_ + 1), f = hold(sp - i), q = i < 1 ? 0 : i < RN_ ? i - 1 + f : RN_ - 1, rest = i < RN_ ? 0 : i === RN_ ? f : 1;
    const th = wrapA(ringAngle(this.qEff(q)) - Math.PI / 2) * (1 - rest);
    car.theta = th; ring.rotation.y = th;
    // only the front half of the turntable is drawn while it is in close-up
    const close = sp > 0.75 && sp < RN_ + 0.4;
    plinths.forEach((p) => { p.g.visible = !close || Math.abs(wrapA(p.a - th - Math.PI / 2)) < 1.9; });
  }
};

// ---------- tower: RF at the bottom, robotics at the top; each project on the floor of its main layer ----------
const TOWER_C = V3(0, 0, -4.6), FLOOR_H = 1.8; // far enough back that the ground-floor camera stands behind the bench, not in it
const TOWER = [['RF & EM', ['tz', 'or']], ['Wireless', ['sw', 'ss']], ['Embedded & firmware', ['de', 'wb', 'p12']], ['Edge AI', ['ne', 'sa', 'p11']], ['Robotics & UAV', ['ba', 'p10']]];
const floorOf = {}; TOWER.forEach(([, ids], f) => ids.forEach((id) => { floorOf[id] = f; }));
LAYS.tower = {
  order: TOWER.flatMap(([, ids]) => ids.map(idxOf)),
  build(g) {
    g.position.copy(TOWER_C);
    const slabM = mat(0xd9d5cc, { roughness: 0.85 }), edge = mat(0x3a3d44, { roughness: 0.6 });
    for (let f = 0; f <= TOWER.length; f++) { g.add(at(box(5.2, 0.1, 2.6, slabM, 0.02), 0, f * FLOOR_H + 0.0, 0), at(box(5.2, 0.04, 0.04, edge), 0, f * FLOOR_H + 0.07, 1.3)); }
    [[-2.55, -1.25], [2.55, -1.25], [-2.55, 1.25], [2.55, 1.25]].forEach(([x, z]) => g.add(at(box(0.1, TOWER.length * FLOOR_H, 0.1, edge), x, TOWER.length * FLOOR_H / 2, z)));
    g.add(at(box(5.2, TOWER.length * FLOOR_H, 0.06, mat(0xe9e6df, { roughness: 0.9 })), 0, TOWER.length * FLOOR_H / 2, -1.3));
    // the lift: a glass shaft on the right with a car that rides to the floor in view
    g.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, TOWER.length * FLOOR_H, 32, 1, true), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.16, roughness: 0.05, side: THREE.DoubleSide, depthWrite: false })), 3.05, TOWER.length * FLOOR_H / 2, 0.4));
    this.car = at(box(0.6, 0.9, 0.6, physMat(0x3f8f8a, { roughness: 0.4 }), 0.05), 3.05, 0.5, 0.4); g.add(this.car);
    shadowAll(g);
    this.tags = TOWER.map(([n], f) => mkTag(`<b>${n}</b> <i>floor ${f + 1}</i>`));
  },
  apply() { TOWER.forEach(([, ids], f) => ids.forEach((id, j) => { const p = plinths[idxOf(id)]; stand(p, TOWER_C.clone().add(V3((j - (ids.length - 1) / 2) * 1.45, f * FLOOR_H + 0.05, 0.25)), 0, p.h, true); })); },
  leave() { this.tags.forEach((el) => { el.style.opacity = 0; }); },
  key(p) { const ph = narrow(); return lookAt(p, V3(0, 0, 1), ph ? 3.6 : 2.6, ph ? 0.35 : 0.3, ph); },
  cam(q) { return camBetween(this, q); },
  over() { const ph = narrow(); return { pos: TOWER_C.clone().add(V3(ph ? 3 : 6.5, ph ? 7 : 6.2, ph ? 15 : 11)), look: TOWER_C.clone().add(V3(0, 4, 0)) }; },
  pinAt(p, n) { const P = P_(p); return V3(P.x + n * 0.24, P.y, TOWER_C.z + 1.12); },
  // the flight path climbs the tower, so look at it square on rather than from above (on desktop, left of the card)
  tl() { return narrow() ? { pos: TOWER_C.clone().add(V3(1.5, 6, 17.5)), look: TOWER_C.clone().add(V3(0, 4.4, 0)) } : { pos: TOWER_C.clone().add(V3(-2, 5.5, 15)), look: TOWER_C.clone().add(V3(3.2, 4.4, 0)) }; },
  frame(dt, t, sp, front) {
    const fl = front >= 0 ? floorOf[plinths[front].id] : 0, y = fl * FLOOR_H + 0.5;
    this.car.position.y += (y - this.car.position.y) * (reduced ? 1 : damp(5, dt));
    // in close-up the floor's name hangs on the back wall, between the card and the project in view; from afar each floor gets its own on the left
    const inLab = sp > 0.75 && sp < RN_ + 0.35, fx = front >= 0 ? P_(plinths[front]).x - TOWER_C.x - 0.7 : 0;
    this.tags.forEach((el, f) => place(el, TOWER_C.clone().add(inLab ? V3(fx, f * FLOOR_H + 1.25, -1.2) : V3(-2.45, f * FLOOR_H + 1.5, 1.3)), inLab ? f === fl : sp > 0.25 && sp < 0.75));
  }
};

// ---------- shelves: a workshop wall; each project in its own bay, in year order ----------
const SH_Z = -3.3, SH_Y = 0.84, BAY = 1.02;
LAYS.shelves = {
  order: plinths.map((_, k) => k),
  build(g) {
    const W = BAY * RN_ + 0.2, wood = M.wood, frameM = mat(0x2f3136, { roughness: 0.6 });
    const peg = textTex(256, 256, (c, w) => { c.fillStyle = '#d8cdb8'; c.fillRect(0, 0, w, w); c.fillStyle = 'rgba(60,40,20,.35)'; for (let x = 8; x < w; x += 16) for (let y = 8; y < w; y += 16) { c.beginPath(); c.arc(x, y, 2.2, 0, 7); c.fill(); } });
    peg.wrapS = peg.wrapT = THREE.RepeatWrapping; peg.repeat.set(RN_ * 2, 5);
    g.add(at(box(W, 2.5, 0.05, new THREE.MeshStandardMaterial({ map: peg, roughness: 0.9 })), 0, 1.25, SH_Z - 0.34));
    g.add(at(box(W, SH_Y - 0.05, 0.66, mat(0x5a5d62, { roughness: 0.7 }), 0.01), 0, (SH_Y - 0.05) / 2, SH_Z), at(box(W, 0.05, 0.7, wood, 0.01), 0, SH_Y - 0.025, SH_Z), at(box(W, 0.04, 0.5, wood, 0.01), 0, 2.32, SH_Z - 0.1));
    for (let k = 0; k <= RN_; k++) g.add(at(box(0.04, 2.5 - SH_Y, 0.6, frameM), (k - RN_ / 2) * BAY, SH_Y + (2.5 - SH_Y) / 2, SH_Z - 0.06));
    g.add(at(box(W + 1.2, 0.04, 3.2, M.concrete), 0, -0.02, SH_Z + 1.1));
    shadowAll(g);
  },
  apply() { plinths.forEach((p, k) => { stand(p, V3((k - (RN_ - 1) / 2) * BAY, SH_Y, SH_Z), 0, 0.01, false); }); },
  key(p) { const ph = narrow(); return lookAt(p, V3(0, 0, 1), ph ? 3.4 : 2.3, ph ? 0.8 : 0.65, ph); },
  cam(q) { return camBetween(this, q); },
  over() { const ph = narrow(); return { pos: V3(0, ph ? 5 : 3.6, ph ? 11 : 7.2), look: V3(0, 1.1, SH_Z) }; },
  pinAt(p, n) { const P = P_(p); return V3(P.x + n * 0.22 - 0.2, 0, SH_Z + 0.75); }
};

// ---------- sites: each project out on the terrain where it works, the route running between them ----------
const SITE_R = 6.3, SITE_A0 = -2.5, SITE_STEP = 0.43;
const SITE_KIND = { wb: 'water', ss: 'water', ba: 'turf', ne: 'wood', sa: 'wood' };
LAYS.sites = {
  order: plinths.map((_, k) => k),
  spot(k) { const a = SITE_A0 + k * SITE_STEP, x = Math.cos(a) * SITE_R, z = Math.sin(a) * SITE_R; return { a, P: V3(x, heightAt(x, z), z) }; },
  build(g) {
    const kinds = { water: physMat(0x3e6f78, { roughness: 0.15, clearcoat: 1 }), turf: new THREE.MeshStandardMaterial({ map: turfTex, roughness: 0.9 }), wood: M.wood, concrete: M.concrete };
    this.pads = plinths.map((p, k) => { const { P } = this.spot(k), pad = at(cyl(0.78, 0.84, 0.5, [M.concrete, kinds[SITE_KIND[p.id] || 'concrete'], M.concrete], 40), P.x, P.y - 0.2, P.z); g.add(pad); return pad; });
    // the route between the sites, always drawn faintly; the flight-path chapter draws its own over it
    const pts = new THREE.CatmullRomCurve3(plinths.map((_, k) => this.spot(k).P.add(V3(0, 0.08, 0))), false, 'centripetal').getPoints(200);
    pts.forEach((v) => { v.y = Math.max(v.y, heightAt(v.x, v.z) + 0.05); });
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineDashedMaterial({ color: SLOT.link, dashSize: 0.18, gapSize: 0.12, transparent: true, opacity: 0.55 })); line.computeLineDistances(); g.add(line);
    shadowAll(g);
  },
  apply() { plinths.forEach((p, k) => { const { a, P } = this.spot(k); stand(p, P.clone().add(V3(0, 0.06, 0)), Math.atan2(-Math.cos(a), -Math.sin(a)), 0, false); }); },
  // from the clear ground inside the route, looking out at the site with the hills behind
  key(p) { const ph = narrow(), { a } = this.spot(p.k), out = V3(Math.cos(a), 0, Math.sin(a)); const k = lookAt(p, out.clone().negate(), ph ? 3.6 : 2.7, ph ? 0.7 : 0.5, ph); k.pos.y = Math.max(k.pos.y, heightAt(k.pos.x, k.pos.z) + 0.8); return k; },
  cam(q) { return camBetween(this, q); },
  over() { const ph = narrow(); return { pos: V3(0, ph ? 17 : 12.5, ph ? 15 : 12.5), look: V3(0, 0, 0.5) }; },
  pinAt(p, n) { const { a, P } = this.spot(p.k), x = P.x - Math.cos(a) * 1.0 + n * 0.25, z = P.z - Math.sin(a) * 1.0; return V3(x, heightAt(x, z), z); }
};

// ---------- bench: the lab as a workshop; the projects sit on an L of workbenches round the desk, the big ones on the floor beside ----------
const BENCH_Y = 0.9, BACK_Z = -2.4, SIDE_X = 3.3;
// back: along the back bench (x); side: along the right-hand bench (z); x, z, y: on the floor; out: the way the camera looks from
const BENCH_AT = {
  ne: { x: -3.7, z: -2.2, y: 0, out: [0, 1] }, tz: { x: -2.5 }, de: { x: -1.5 }, or: { x: -0.5 }, sw: { x: 0.5 }, sa: { x: 1.5 }, ba: { x: 2.5 },
  wb: { side: -1.3 }, ss: { side: -0.1 }, p10: { side: 1.1 },
  p11: { x: 2.95, z: 2.35, y: 0, out: [-1, 0] }, p12: { x: 3.0, z: 2.3, y: 0.42, out: [-1, 0], rot: -1.3 }
};
function benchSpot(id) {
  const s = BENCH_AT[id] || { x: 0 };
  const P = s.side != null ? V3(SIDE_X, BENCH_Y, s.side) : s.y != null ? V3(s.x, s.y, s.z) : V3(s.x, BENCH_Y, BACK_Z);
  const out = s.out ? V3(s.out[0], 0, s.out[1]) : s.side != null ? V3(-1, 0, 0) : V3(0, 0, 1);
  return { P, out, rot: s.rot != null ? s.rot : Math.atan2(out.x, out.z) };
}
LAYS.bench = {
  // left to right along the back bench, then down the side bench, so the camera pans rather than jumps
  order: ['ne', 'tz', 'de', 'or', 'sw', 'sa', 'ba', 'wb', 'ss', 'p10', 'p11', 'p12'].map(idxOf).filter((k) => k >= 0),
  build(g) {
    const wood = M.wood, leg = M.metal, shelfM = mat(0x5a5d62, { roughness: 0.7 });
    const peg = textTex(256, 256, (c, w) => { c.fillStyle = '#d8cdb8'; c.fillRect(0, 0, w, w); c.fillStyle = 'rgba(60,40,20,.35)'; for (let x = 8; x < w; x += 16) for (let y = 8; y < w; y += 16) { c.beginPath(); c.arc(x, y, 2.2, 0, 7); c.fill(); } });
    peg.wrapS = peg.wrapT = THREE.RepeatWrapping; peg.repeat.set(12, 3);
    // a bench: top, four legs and a low shelf, long along x (or z when turned)
    const bench = (cx, cz, len, alongZ) => {
      const b = new THREE.Group(); b.position.set(cx, 0, cz); if (alongZ) b.rotation.y = Math.PI / 2;
      b.add(at(box(len, 0.05, 0.7, wood, 0.01), 0, BENCH_Y - 0.025, 0), at(box(len - 0.1, 0.03, 0.6, shelfM, 0.005), 0, 0.22, 0));
      [-1, 1].forEach((sx) => [-1, 1].forEach((sz) => b.add(at(box(0.05, BENCH_Y - 0.05, 0.05, leg), sx * (len / 2 - 0.06), (BENCH_Y - 0.05) / 2, sz * 0.3))));
      g.add(b); return b;
    };
    bench(0, BACK_Z, 6.0, false); bench(SIDE_X, -0.2, 3.7, true);
    g.add(at(box(6.0, 1.5, 0.04, new THREE.MeshStandardMaterial({ map: peg, roughness: 0.9 })), 0, BENCH_Y + 0.75, BACK_Z - 0.38));
    // a stool in front of the back bench, so it reads as worked at
    const stool = new THREE.Group(); stool.add(at(cyl(0.18, 0.18, 0.05, M.blackPlastic, 24), 0, 0.62, 0), at(cyl(0.025, 0.025, 0.6, leg, 8), 0, 0.3, 0), at(cyl(0.2, 0.22, 0.03, leg, 24), 0, 0.015, 0));
    stool.position.set(-1.0, 0, BACK_Z + 0.85); g.add(stool);
    shadowAll(g);
  },
  apply() { plinths.forEach((p) => { const { P, rot } = benchSpot(p.id); stand(p, P, rot, 0.01, false); p.benchOut = benchSpot(p.id).out; }); },
  // a little above the bench, looking down onto its top; a tall object (Nephele) gets more room
  key(p) { const ph = narrow(), far = Math.max(0, p.top - 0.6) * 1.3; return lookAt(p, p.benchOut, (ph ? 2.3 : 1.9) + far, (ph ? 0.75 : 0.55) - far * 0.3, ph); },
  cam(q) { return camBetween(this, q); },
  over() { const ph = narrow(); return ph ? { pos: V3(0, 6.5, 9), look: V3(0, 0.8, -0.8) } : { pos: V3(-2.2, 3.6, 5.8), look: V3(0.6, 0.9, -1.2) }; },
  tl() { return narrow() ? { pos: V3(0.3, 10, 6.5), look: V3(0.3, 0, -2.4) } : { pos: V3(-1.2, 5.6, 6.8), look: V3(2.5, 0.3, -0.5) }; },
  pinAt(p, n) { const P = P_(p), o = p.benchOut, x = P.x + o.x * 0.75 + o.z * n * 0.24, z = P.z + o.z * 0.75 - o.x * n * 0.24; return V3(x, heightAt(x, z), z); }
};

// ---------- switching ----------
let LAY = LAYS.ring, layId = 'ring';
function applyLayout(id) {
  if (!LAYS[id]) id = 'ring';
  if (LAY && LAY.leave) LAY.leave();
  Object.values(LAYS).forEach((L) => { if (L.grp) L.grp.visible = false; });
  LAY = LAYS[id]; layId = id; layGroup(LAY).visible = true; ring.rotation.y = 0; car.off = car.snap = 0; car.vel = 0; car.zoom = car.zoomT = 1;
  plinths.forEach((p) => { p.g.visible = true; });
  LAY.apply(); scene.updateMatrixWorld(true);
  // the flight path follows the layout
  const pts = LAY.pinsRing ? ringPins : pinsFrom(LAY);
  pins.forEach((p, i) => p.position.copy(pts[i]));
  const track = LAY.pinsRing ? ringTrack : tlFrom(pts);
  tlLine.geometry.dispose(); tlLine.geometry = new THREE.BufferGeometry().setFromPoints(track); tlLine.computeLineDistances();
  LAYOUT_IDS.forEach((x) => document.body.classList.toggle('lay-' + x, x === id));
  hideTags();
}
onLabLayout = (id) => applyLayout(id);

// ---------- click an object to open it; in the carousel, drag to turn and pinch or use the buttons to zoom ----------
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
const pickables = () => [drone, ...plinths.filter((p) => p.g.visible).map((p) => p.g)];
function pick(e) {
  ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera);
  const hit = ray.intersectObjects(pickables(), true)[0]; if (!hit) return null;
  for (let o = hit.object; o; o = o.parent) { if (o === drone) return 'ba'; const p = plinths.find((q) => q.g === o); if (p) return CASES[p.id] ? p.id : null; }
  return null;
}
const homeOn = () => !route && (window.__p || 0) > 0.6 && (window.__p || 0) < RN_ + 1.6;
const ptrs = new Map(); let pinch0 = 0, zoom0 = 1, hoverT = 0;
canvas.addEventListener('pointerdown', (e) => {
  if (!homeOn()) return; ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (ptrs.size === 2 && LAY.draggable) { const [a, b] = [...ptrs.values()]; pinch0 = Math.hypot(a.x - b.x, a.y - b.y); zoom0 = car.zoomT; if (car.drag) { car.vel = 0; carRelease(); } car.drag = null; return; }
  car.drag = { x: e.clientX, t: e.timeStamp, x0: e.clientX, y0: e.clientY, id: e.pointerId, moved: 0 }; car.vel = 0;
});
addEventListener('pointermove', (e) => {
  if (ptrs.has(e.pointerId)) ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (ptrs.size === 2 && pinch0 && LAY.draggable) { const [a, b] = [...ptrs.values()]; car.zoomT = THREE.MathUtils.clamp(zoom0 * pinch0 / Math.max(20, Math.hypot(a.x - b.x, a.y - b.y)), ZOOM_MIN, ZOOM_MAX); return; }
  const d = car.drag;
  if (d && e.pointerId === d.id) {
    const dx = e.clientX - d.x, dt = Math.max(8, e.timeStamp - d.t); d.x = e.clientX; d.t = e.timeStamp; d.moved = Math.max(d.moved, Math.hypot(e.clientX - d.x0, e.clientY - d.y0));
    // the turn follows the finger; the throw speed is kept per 60fps frame and smoothed over the last few moves
    if (LAY.draggable && d.moved > 4) { car.off += dx * 0.006; car.vel = car.vel * 0.6 + THREE.MathUtils.clamp(dx * 0.006 * 16.7 / dt, -0.15, 0.15) * 0.4; canvas.classList.add('grabbing'); }
    return;
  }
  // hover: the pointer shows which objects open something
  if (e.target === canvas && homeOn() && performance.now() - hoverT > 60) { hoverT = performance.now(); canvas.style.cursor = pick(e) ? 'pointer' : LAY.draggable ? 'grab' : ''; }
});
const endPtr = (e) => {
  ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch0 = 0;
  const d = car.drag; if (!d || e.pointerId !== d.id) return; car.drag = null; canvas.classList.remove('grabbing'); carRelease();
  if (d.moved <= 4 && e.type === 'pointerup') { const id = pick(e); if (id) { track('open_from_3d', { id, layout: layId }); openProject(id, null); } }
};
addEventListener('pointerup', endPtr); addEventListener('pointercancel', endPtr);
// a trackpad pinch arrives as a wheel event with ctrl held; a plain wheel still scrolls the page
canvas.addEventListener('wheel', (e) => { if (!LAY.draggable || !homeOn() || !e.ctrlKey) return; e.preventDefault(); car.zoomT = THREE.MathUtils.clamp(car.zoomT * Math.exp(e.deltaY * 0.01), ZOOM_MIN, ZOOM_MAX); }, { passive: false });
const zoomEl = document.createElement('div'); zoomEl.id = 'zoomctl'; zoomEl.innerHTML = '<button type="button" data-z="0.8" aria-label="Zoom in">+</button><button type="button" data-z="1.25" aria-label="Zoom out">−</button><span>Drag to turn</span>';
document.body.appendChild(zoomEl);
zoomEl.addEventListener('click', (e) => { const b = e.target.closest('[data-z]'); if (b) car.zoomT = THREE.MathUtils.clamp(car.zoomT * +b.dataset.z, ZOOM_MIN, ZOOM_MAX); });
applyLayout(store.get('lab-layout') || 'ring');
