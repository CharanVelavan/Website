// ---------- the ring: one plinth per project around the bench, in year order ----------
// built from RING (cases.js), so adding a project adds a plinth; the front plinth's lip lights up and its object lifts a little
const RING_R = 3.2, RING_STEP = (Math.PI * 2) / Math.max(RING.length, 12), RING_A0 = Math.PI / 3;
const ringAngle = (k) => RING_A0 - k * RING_STEP;
const ringOut = (a) => V3(Math.cos(a), 0, Math.sin(a));
const ring = new THREE.Group(); scene.add(ring);
const plinthMat = new THREE.MeshStandardMaterial({ color: 0xe9e6df, roughness: 0.85 });
// Bird's AI's plinth: a patch of the test field with a survivor and the detection box the model draws around them
function buildField() {
  const g = new THREE.Group(); const tm = new THREE.MeshStandardMaterial({ map: turfTex.clone(), roughness: 0.9 }); tm.map.repeat.set(2, 2); tm.map.needsUpdate = true;
  g.add(at(box(0.56, 0.04, 0.56, tm, 0.01), 0, 0.02, 0));
  const p = new THREE.Group(); p.add(at(new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.12, 4, 8), new THREE.MeshStandardMaterial({ color: 0x9a3b2e, roughness: 0.7 })), 0, 0.12, 0), at(sphere(0.025, new THREE.MeshStandardMaterial({ color: 0x6b4a33 })), 0, 0.22, 0)); p.position.set(0.05, 0.04, 0.02); g.add(p);
  const det = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.14, 0.26, 0.14)), new THREE.LineBasicMaterial({ color: 0xd9342b })); det.position.set(0.05, 0.18, 0.02); g.add(det);
  shadowAll(g); return g;
}
// the 5G sewer skimmer: a catamaran (LOA 2768 mm, beam 1310 mm) with a 31° intake ramp, a draining basket and a bow gantry; 26% scale
function buildSkimmer() {
  const g = new THREE.Group(), hullM = physMat(0xe2672a, { roughness: 0.5, clearcoat: 0.3 }), grey = mat(0x3a3d44, { roughness: 0.6 });
  [-0.5, 0.5].forEach((x) => { const h = box(0.28, 0.3, 2.6, hullM, 0.08); h.position.set(x, 0.15, 0); g.add(h); const th = cyl(0.1, 0.1, 0.22, M.blackPlastic, 20); th.rotation.x = Math.PI / 2; th.position.set(x, 0.06, -1.36); g.add(th); });
  g.add(at(box(1.2, 0.04, 2.0, grey, 0.01), 0, 0.32, -0.1));
  const ramp = box(0.83, 0.02, 0.8, mat(0x8a8f98, { metalness: 0.6, roughness: 0.4 })); ramp.position.set(0, 0.22, 1.12); ramp.rotation.x = 0.54; g.add(ramp);
  const basket = box(0.74, 0.295, 0.83, new THREE.MeshStandardMaterial({ color: 0x2b2c30, transparent: true, opacity: 0.55, roughness: 0.6 })); basket.position.set(0, 0.49, 0.35); g.add(basket);
  [-0.42, 0.42].forEach((x) => g.add(at(box(0.04, 0.6, 0.04, M.metal), x, 0.62, 0.92))); g.add(at(box(0.9, 0.05, 0.06, M.metal), 0, 0.93, 0.92));
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.08, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), M.glass); dome.rotation.x = Math.PI; dome.position.set(0, 0.9, 0.96); g.add(dome);
  g.add(at(box(0.5, 0.03, 0.03, ledBlue), 0, 0.97, 0.96));
  g.add(at(cyl(0.012, 0.012, 0.5, M.blackPlastic, 8), 0.3, 0.6, -0.9), at(box(0.12, 0.08, 0.12, M.white, 0.02), 0.3, 0.87, -0.9));
  g.scale.setScalar(0.26); shadowAll(g); return g;
}
// Solar Sailor: an Alexa skill, shown as an Echo with its light ring
const echoRing = new THREE.MeshStandardMaterial({ color: SLOT.link, emissive: SLOT.packet, emissiveIntensity: 0.4 });
function buildEcho() {
  const g = new THREE.Group();
  g.add(at(cyl(0.05, 0.05, 0.14, mat(0x2c2e33, { roughness: 0.95 }), 40), 0, 0.07, 0), at(cyl(0.049, 0.05, 0.008, M.blackPlastic, 40), 0, 0.144, 0));
  const r = new THREE.Mesh(new THREE.TorusGeometry(0.046, 0.004, 8, 48), echoRing); r.rotation.x = Math.PI / 2; r.position.y = 0.149; g.add(r);
  g.scale.setScalar(2.4); shadowAll(g); return g;
}
// a placeholder: a closed crate until the write-up exists
function buildCrate() {
  const g = new THREE.Group(); g.add(at(box(0.42, 0.42, 0.42, M.wood, 0.01), 0, 0.21, 0));
  const slat = mat(0x6b4a2f, { roughness: 0.8 });
  [-0.22, 0.22].forEach((z) => [0.06, 0.36].forEach((y) => g.add(at(box(0.44, 0.04, 0.012, slat), 0, y, z))));
  shadowAll(g); return g;
}
// per project: the object, the plinth height, how high its label sits, and its idle motion when it is in front
const RING_OBJ = {
  wb: () => ({ o: waterbot, h: 0.42, top: 0.36, idle: (t) => { const wpA = water.geometry.attributes.position; for (let k = 0; k < wpA.count; k++) wpA.setZ(k, Math.sin(wpA.getX(k) * 14 + t * 2) * 0.004 + Math.cos(wpA.getY(k) * 11 + t * 1.6) * 0.003); wpA.needsUpdate = true; hullL.position.y = hullR.position.y = 0.16 + Math.sin(t * 1.4) * 0.006; } }),
  de: () => { dems.scale.setScalar(3.4); dems.rotation.x = 0.6; return { o: dems, h: 0.62, top: 0.26 }; },
  ba: () => ({ o: buildField(), h: 0.62, top: 0.4 }),
  ne: () => ({ o: nephele, h: 0.06, top: 1.32, idle: (t) => { nhead.rotation.y = Math.sin(t * 0.6) * 0.35; } }),
  or: () => { usrp.scale.setScalar(2.4); return { o: usrp, h: 0.62, top: 0.52 }; },
  // the filter alone (no probe arm), large and tilted toward the camera
  tz: () => { thz.children.slice(1).forEach((c) => { c.visible = false; }); thz.scale.setScalar(6); thz.rotation.x = 0.6; return { o: thz, h: 0.62, top: 0.24 }; },
  sw: () => { holo.scale.setScalar(1.6); holo.position.y = 0.32; return { o: holo, h: 0.62, top: 0.5, idle: (t, dt) => { holo.rotation.y += dt * 0.3; } }; },
  ss: () => ({ o: buildSkimmer(), h: 0.42, top: 0.36 }),
  sa: () => ({ o: buildEcho(), h: 0.62, top: 0.48, idle: (t) => { echoRing.emissiveIntensity = 0.5 + 0.4 * Math.sin(t * 2.4); } })
};
const plinths = RING.map((r, k) => {
  const a = ringAngle(k), spec = (RING_OBJ[r.id] || (() => ({ o: buildCrate(), h: 0.3, top: 0.56 })))();
  const g = new THREE.Group(); g.position.copy(ringOut(a).multiplyScalar(RING_R)); g.rotation.y = Math.atan2(Math.cos(a), Math.sin(a));
  const ped = cyl(0.34, 0.37, spec.h, plinthMat, 48); ped.position.y = spec.h / 2; g.add(ped);
  const lipMat = new THREE.MeshStandardMaterial({ color: SLOT.link, emissive: SLOT.packet, emissiveIntensity: 0 });
  const lip = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.008, 6, 64), lipMat); lip.rotation.x = Math.PI / 2; lip.position.y = spec.h + 0.002; g.add(lip);
  const holder = new THREE.Group(); holder.position.y = spec.h; holder.add(spec.o); g.add(holder);
  shadowAll(ped); ring.add(g);
  // base: where the object stands (the pedestal top, a shelf or the ground, set by the lab layout); objTop: its label height above that
  return { ...r, k, a, g, ped, lip, holder, lipMat, h: spec.h, base: spec.h, objTop: spec.top, top: spec.h + spec.top, idle: spec.idle, lift: 0 };
});
const plinthOf = (id) => plinths.find((p) => p.id === id);
// ---------- the flight path: a track around the outside of the ring, read in year order ----------
// each milestone's pin stands at the foot of its own project; a project with several sits them side by side;
// milestones without a project (Now) sit on the track between plinths
const TL_R = 4.15;
const pinAngles = (() => { const seen = {}; return TIMELINE.map(([, , , id]) => { const p = id && plinthOf(id); if (!p) { const s = plinths.find((q) => q.soon || q.placeholder); return s ? s.a + RING_STEP * 0.5 : ringAngle(RING.length - 0.5); } const n = seen[id] = (seen[id] || 0) + 1; return p.a + (n - 1) * 0.13; }); })();
const pins = TIMELINE.map((t, i) => { const p = ringOut(pinAngles[i]).multiplyScalar(TL_R); p.y = heightAt(p.x, p.z); const h = i % 2 ? 0.95 : 0.55; const g = new THREE.Group(); g.add(at(cyl(0.018, 0.018, h, M.metal, 8), 0, h / 2, 0), at(new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), hotMat), 0, h + 0.03, 0)); g.userData.top = h + 0.12; g.position.copy(p); g.visible = false; scene.add(g); return g; });
// the track starts just before the first milestone and runs once round the ring in the same direction as the years
const TL_A0 = pinAngles[0] + 0.2;
const tlLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 241 }, (_, j) => { const p = ringOut(TL_A0 - (j / 240) * Math.PI * 2).multiplyScalar(TL_R); p.y = heightAt(p.x, p.z) + 0.02; return p; })), new THREE.LineDashedMaterial({ color: SLOT.link, dashSize: 0.14, gapSize: 0.09, transparent: true, opacity: 0 })); tlLine.computeLineDistances(); scene.add(tlLine);
