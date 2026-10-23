// ===================== the case-study bays use the lab's Blender models =====================
// Each project's model is exported on its own with live materials (design/blender/export_bays.py) and loaded the first
// time its case study opens. Until it arrives the bay shows its drawn stand-in; then the model takes its place and,
// as the photo dissolves, assembles itself: its pieces drop in from a loose cloud, bottom first, with a little overshoot.
const bayLoader = new GLTFLoader(); bayLoader.setDRACOLoader(dracoLoader);
const bayModels = {};
function bayModel(id) {
  return bayModels[id] || (bayModels[id] = new Promise((res) => bayLoader.load(`models/bays/${id}.glb`, (g) => res(prepBay(g.scene)), undefined, (e) => { console.warn('bay model', id, e); res(null); })));
}
function prepBay(root) {
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = o.receiveShadow = !mobile;
    // glass: see-through without the cost of transmission
    const m = o.material; if (m.transmission > 0) { m.transmission = 0; m.transparent = true; m.opacity = 0.28; m.depthWrite = false; o.renderOrder = 2; }
  });
  root.updateMatrixWorld(true);
  return root;
}
// three drops the dots from Blender names ('ba_arm.001' → 'ba_arm001')
const bnode = (root, n) => root.getObjectByName(n.replace(/\./g, ''));
// where a node sits in its model's frame, read before anything is moved
const relOf = (root, o) => new THREE.Matrix4().copy(root.matrixWorld).invert().multiply(o.matrixWorld);
// move a node into `frame` (a group standing for the model's own axes), at the pose `rel` it had in the model
function graft(frame, o, rel) { o.removeFromParent(); rel.decompose(o.position, o.quaternion, o.scale); frame.add(o); return o; }
// a group in `parent` that carries the model's axes, scaled and placed
function modelFrame(parent, s = 1, x = 0, y = 0, z = 0, ry = 0) { const f = new THREE.Group(); f.scale.setScalar(s); f.position.set(x, y, z); f.rotation.y = ry; parent.add(f); return f; }
// hide a drawn stand-in, keeping its groups (and the labels and animation that hang off them)
const hideDrawn = (...objs) => objs.forEach((o) => o && o.traverse((c) => { if (c.isMesh || c.isPoints) c.visible = false; }));
const freeDrawn = (o) => o.traverse((c) => { if (c.isMesh) c.geometry.dispose(); });

const easeOutBack = (x) => { const c = 1.6; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2; };
// the opening: `pieces` fly in from above and outward. Time-driven once the photo starts to dissolve; scrolling back
// to the photo re-arms it, so every visit builds it anew. While armed the model stands whole, in case the photo is missing
function makeAssemble(pieces, { lift = 0.6, spread = 0.5, dur = 1.6 } = {}) {
  pieces.forEach((p) => p.updateWorldMatrix(true, true));
  const box3 = new THREE.Box3(); pieces.forEach((p) => box3.expandByObject(p));
  const c = box3.getCenter(V3()), size = box3.getSize(V3()), r = Math.max(size.x, size.y, size.z, 0.05);
  const items = pieces.map((o) => {
    const w = new THREE.Box3().setFromObject(o).getCenter(V3());
    const out = V3(w.x - c.x, 0, w.z - c.z); if (out.lengthSq() < 1e-6) out.set(hash(w.x, w.z) - 0.5, 0, hash(w.z, w.x) - 0.5);
    out.normalize().multiplyScalar(r * spread * (0.6 + hash(w.x * 9, w.y * 7))).add(V3(0, r * lift * (0.7 + 0.6 * hash(w.y, w.x)), 0));
    // the world offset, in the piece's parent space
    const pw = o.parent.localToWorld(o.position.clone()), off = o.parent.worldToLocal(pw.clone().add(out)).sub(o.position);
    return { o, rest: o.position.clone(), off, spin: (hash(w.z, w.y) - 0.5) * 1.2, q: o.quaternion.clone(), delay: clamp01((w.y - box3.min.y) / Math.max(size.y, 1e-3)) * 0.5 + hash(w.x, w.y) * 0.15 };
  });
  const qa = new THREE.Quaternion(), ax = V3(0, 1, 0);
  // wall-clock time, so a slow first frame (shaders compiling) doesn't stretch it
  const A = { t: 0, t0: 0, done: true,
    set(k) { items.forEach((it) => { const e = k >= 1 ? 1 : easeOutBack(clamp01((k * 1.65 - it.delay) / 1)); it.o.position.copy(it.rest).addScaledVector(it.off, 1 - e); it.o.quaternion.copy(it.q).multiply(qa.setFromAxisAngle(ax, it.spin * (1 - e))); }); },
    step(dt, m) {
      if (m < 0.02) { if (A.t !== 0 || A.done) { A.t = 0; A.done = false; A.set(1); } return; }
      if (A.done || m < 0.1) return;
      const now = performance.now() / 1000; if (!A.t) A.t0 = now;
      A.t = reduced ? dur : Math.min(dur, Math.max(1e-4, now - A.t0)); A.set(A.t / dur); if (A.t >= dur) { A.done = true; A.set(1); }
    },
  };
  return A;
}

// ---------- Bird's AI: the drone is rebuilt from the Blender model, in the same named parts the bay explodes ----------
// part, how to find its nodes among ba_drone's children, and which way it flies out
const BA_PARTS = [
  ['Power + buck converter', /^ba_(power|plate_bot|plate_edge|battery|batt_label|strap|xt60)/, [0, -0.6, 0]],
  ['Frame plates', /^ba_(plate_top|standoff)/, [0, 0.15, 0]],
  ['Pixhawk 2.4.8', /^ba_fc/, [0, 0.9, 0]],
  ['GPS', /^ba_gps/, [0.4, 1.2, -0.4]],
  ['Raspberry Pi 5', /^ba_pi$/, [0, 2.0, 0]],
  ['5G dongle', /^ba_dongle$/, [1.4, 1.9, -0.3]],
  ['AI HAT+ (Hailo-8L)', /^ba_hat$/, [0, 2.8, 0]],
  ['Camera + mount', /^ba_cam/, [0, -0.3, 1.0]],
  ['Landing gear', /^ba_(leg|foot)/, [0, -1.0, 0]],
  ['Wiring', /^ba_(wire|ant)/, [0, 0, 0]],
];
// the arms and motors go by quadrant, in the drawn drone's order
const BA_Q = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
const BA_FEET = 0.222; // the drone's origin stands this far above its feet
function blenderDrone(src) {
  const bd = bnode(src, 'ba_drone'); if (!bd) return;
  const hat = bnode(src, 'ba_hat'), dongle = bnode(src, 'ba_dongle');
  const nodes = [...bd.children, hat, dongle], rel = new Map(nodes.map((o) => [o, relOf(bd, o)]));
  // out with the drawn parts
  [...drone.children].forEach((c) => { freeDrawn(c); drone.remove(c); });
  const P = {}, at2 = (o) => new THREE.Box3().setFromObject(o).getCenter(V3());
  const part = (name, dir) => { const g = new THREE.Group(); g.userData.dir = V3(...dir); const inner = new THREE.Group(); g.add(inner); drone.add(g); P[name] = g; g.userData.list = []; return g; };
  BA_PARTS.forEach(([n, , d]) => part(n, d));
  BA_Q.forEach(([sx, sz], i) => { part('Arm ' + (i + 1), [sx * 0.35, 0, sz * 0.35]); part('Motor ' + (i + 1), [sx * 0.64, 0.25, sz * 0.64]); });
  const quad = (o) => { const v = at2(o); return BA_Q.findIndex(([sx, sz]) => Math.sign(v.x || 1) === sx && Math.sign(v.z || 1) === sz); };
  nodes.forEach((o) => {
    const n = o.name; let key = null;
    if (o === hat) key = 'AI HAT+ (Hailo-8L)'; else if (o === dongle) key = '5G dongle';
    else if (/^ba_(arm|esc)/.test(n)) key = 'Arm ' + (quad(o) + 1);
    else if (/^ba_(motor|guard)/.test(n)) key = 'Motor ' + (quad(o) + 1);
    else { const p = BA_PARTS.find(([, re]) => re.test(n)); key = p ? p[0] : 'Wiring'; }
    P[key].userData.list.push(o);
  });
  // each part's pieces hang off an inner group at the part's centre, so a hovered part grows about its middle
  Object.values(P).forEach((g) => {
    const inner = g.children[0], list = g.userData.list; delete g.userData.list;
    const tmp = new THREE.Group(); list.forEach((o) => graft(tmp, o, rel.get(o)));
    const c = new THREE.Box3().setFromObject(tmp).getCenter(V3()); if (!list.length) c.set(0, 0, 0);
    inner.position.set(c.x, c.y - BA_FEET, c.z);
    [...tmp.children].forEach((o) => { o.position.sub(c); inner.add(o); });
  });
  drone.traverse((o) => { if (/^ba_prop/.test(o.name)) o.name = 'prop'; if (o.name === 'ba_fc_led') o.name = 'pxLed'; });
  drone.userData.parts = P; drone.userData.hailo = bnode(drone, 'ba_hailo_die'); drone.userData.dongle = bnode(drone, 'ba_dongle_body');
  drone.userData.blender = true;
  if (BAYS.ba.built) BAYS.ba.partTags.forEach((p) => { p.g = P[p.k]; });
  BAYS.ba.asm = makeAssemble(Object.values(P).map((g) => g.children[0]), { lift: 0.9, spread: 0.7 });
}
bayModel('ba').then((s) => s && blenderDrone(s));
