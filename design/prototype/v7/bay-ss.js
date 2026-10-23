// ===================== 5G Sewer Skimmer: a cut-away box sewer, the catamaran, the manhole relay, and what it does when the link drops =====================
// built to the CAD's dimensions at half scale: sewer 2400 × 2200 mm with 750 mm of flow, vessel LOA 2768 mm, beam 1310 mm
const SS_K = 0.5, SS_W = 2.4 * SS_K, SS_H = 2.2 * SS_K, SS_FLOW = 0.75 * SS_K, SS_LEN = 11, SS_SHAFT = 2.4;
function buildSkimmerParts() {
  const R = new THREE.Group(), P = {};
  const hullM = physMat(0xe2672a, { roughness: 0.5, clearcoat: 0.3 }), cream = physMat(0xe9e1cf, { roughness: 0.6 }), slate = mat(0x3a3d44, { roughness: 0.6 }), steel = mat(0x8a8f98, { metalness: 0.6, roughness: 0.4 });
  // two demihulls (brown below the water, cream freeboard, slate gunwale) tied by a cross-deck
  const hulls = new THREE.Group(); [-0.5, 0.5].forEach((x) => { hulls.add(at(box(0.28, 0.15, 2.5, mat(0x6b4a33, { roughness: 0.8 }), 0.05), x, 0.075, -0.05), at(box(0.28, 0.19, 2.6, cream, 0.03), x, 0.245, 0), at(box(0.3, 0.04, 2.62, slate, 0.01), x, 0.36, 0)); });
  hulls.add(at(box(1.2, 0.045, 1.78, slate, 0.01), 0, 0.4, -0.35)); [-0.25, 0.25].forEach((x) => hulls.add(at(box(0.4, 0.04, 0.4, cream, 0.02), x, 0.44, -0.9)));
  R.add(hulls); P.hulls = hulls;
  // twin ducted thrusters at the stern: a shroud and a three-blade hub each
  const thr = new THREE.Group(); P.props = [];
  [-0.5, 0.5].forEach((x) => { const d = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.16, 24, 1, true), mat(0x2b2c30, { side: THREE.DoubleSide })); d.rotation.x = Math.PI / 2; d.position.set(x, 0.04, -1.38); thr.add(d); const hub = new THREE.Group(); hub.position.set(x, 0.04, -1.38); [0, 1, 2].forEach((k) => { const b = box(0.012, 0.085, 0.03, steel); b.position.y = 0.043; const h = new THREE.Group(); h.rotation.z = k * 2.094; h.add(b); hub.add(h); }); thr.add(hub); P.props.push(hub); });
  R.add(thr); P.thr = thr;
  // the grated intake ramp at 31°, tip below the waterline, and the draining basket behind it
  const grate = textTex(128, 128, (g, w) => { g.clearRect(0, 0, w, w); g.fillStyle = '#fff'; for (let k = 0; k < 11; k++) g.fillRect(4 + k * 11.3, 0, 6, w); });
  grate.wrapS = grate.wrapT = THREE.RepeatWrapping;
  const ramp = new THREE.Mesh(new THREE.PlaneGeometry(0.83, 1.02), new THREE.MeshStandardMaterial({ color: 0x8a8f98, map: grate, alphaTest: 0.4, side: THREE.DoubleSide, metalness: 0.6, roughness: 0.4 }));
  ramp.rotation.x = -Math.PI / 2 + 0.54; ramp.position.set(0, 0.17, 0.95); R.add(ramp); P.ramp = ramp;
  const basket = new THREE.Group(); basket.position.set(0, 0.42, 0.18);
  const bm = new THREE.MeshStandardMaterial({ color: 0x2b2c30, transparent: true, opacity: 0.5, roughness: 0.6, side: THREE.DoubleSide, depthWrite: false });
  basket.add(at(box(0.83, 0.02, 0.74, bm), 0, 0, 0), at(box(0.02, 0.3, 0.74, bm), -0.415, 0.15, 0), at(box(0.02, 0.3, 0.74, bm), 0.415, 0.15, 0), at(box(0.83, 0.3, 0.02, bm), 0, 0.15, -0.37));
  R.add(basket); P.basket = basket;
  // the bow gantry: four legs, two beams, the sealed module, dome camera, GNSS puck, LED bar and side pods
  const gantry = new THREE.Group(); gantry.position.set(0, 0.42, 0.9);
  [[-0.42, -0.25], [0.42, -0.25], [-0.42, 0.25], [0.42, 0.25]].forEach(([x, z]) => gantry.add(at(box(0.04, 0.32, 0.04, steel), x, 0.16, z)));
  [-0.42, 0.42].forEach((x) => gantry.add(at(box(0.05, 0.05, 0.6, steel), x, 0.33, 0)));
  gantry.add(at(box(0.7, 0.17, 0.5, mat(0x7a7f87, { roughness: 0.5 }), 0.03), 0, 0.44, 0), at(box(0.64, 0.09, 0.44, mat(0x3f8f8a, { roughness: 0.5 }), 0.03), 0, 0.57, 0));
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.085, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.glass); dome.rotation.x = Math.PI; dome.position.set(0, 0.36, 0.2); gantry.add(dome); P.dome = dome;
  const gnss = at(cyl(0.08, 0.08, 0.04, M.white, 24), 0, 0.64, -0.05); gantry.add(gnss); P.gnss = gnss;
  const led = at(box(0.4, 0.035, 0.03, ledBlue), 0, 0.48, 0.26); gantry.add(led); P.led = led;
  const pods = [-0.38, 0.38].map((x) => at(box(0.06, 0.08, 0.12, M.blackPlastic, 0.015), x, 0.44, 0.05)); pods.forEach((p) => gantry.add(p)); P.pods = pods;
  R.add(gantry); P.gantry = gantry;
  // gas louvre in the starboard deck, the 625 mm whip, and the sonar on its pole under the keel
  const louvre = new THREE.Group(); louvre.position.set(0.25, 0.43, -0.3); for (let k = 0; k < 5; k++) { const s = box(0.3, 0.005, 0.03, steel); s.rotation.x = Math.PI / 4; s.position.z = -0.06 + k * 0.03; louvre.add(s); } R.add(louvre); P.louvre = louvre;
  const ant = new THREE.Group(); ant.position.set(-0.35, 0.42, -0.95); ant.add(at(cyl(0.03, 0.035, 0.04, steel, 16), 0, 0.02, 0), at(cyl(0.008, 0.008, 0.62, M.blackPlastic, 8), 0, 0.35, 0)); R.add(ant); P.ant = ant;
  const sonar = new THREE.Group(); sonar.position.set(0.5, 0, 0.4); sonar.add(at(cyl(0.022, 0.022, 0.3, steel, 10), 0, -0.05, 0), at(cyl(0.075, 0.075, 0.025, M.blackPlastic, 24), 0, -0.2, 0)); R.add(sonar); P.sonar = sonar;
  shadowAll(R); return { R, P };
}
const SS_TRASH = 18;
BAYS.ss = {
  objs: [], fog: [10, 60], phoneZoom: 1.3,
  build() {
    const root = new THREE.Group(); root.position.copy(STUDIO).add(V3(0, 0.01, 0)); this.root = root; this.objs.push(root);
    // the box sewer, cut away on the camera's side: floor, far wall, a ceiling slab with the manhole shaft, and the street on top
    const conc = mat(0x8b8780, { roughness: 0.95 }), concDark = mat(0x5e5b56, { roughness: 0.95 });
    const sewer = new THREE.Group(); root.add(sewer); this.sewer = sewer;
    sewer.add(at(box(SS_W + 0.3, 0.15, SS_LEN, concDark), 0, -0.075, 0), at(box(0.15, SS_H, SS_LEN, conc), -SS_W / 2 - 0.075, SS_H / 2, 0));
    // the ceiling stops short of the near edge so the camera can see in; it has a round hole for the shaft
    const slab = new THREE.Shape(); slab.moveTo(-2.6, -SS_LEN / 2); slab.lineTo(SS_W * 0.15, -SS_LEN / 2); slab.lineTo(SS_W * 0.15, SS_LEN / 2); slab.lineTo(-2.6, SS_LEN / 2); slab.closePath();
    const hole = new THREE.Path(); hole.absarc(-0.1, SS_SHAFT, 0.25, 0, Math.PI * 2, true); slab.holes.push(hole);
    const sg = new THREE.ExtrudeGeometry(slab, { depth: 0.15, bevelEnabled: false }); sg.rotateX(Math.PI / 2);
    const ceil = new THREE.Mesh(sg, conc); ceil.position.y = SS_H + 0.15; sewer.add(ceil);
    const STREET = SS_H + 0.15; this.street = STREET;
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.15, 32, 1, true), new THREE.MeshStandardMaterial({ color: 0x6f6b65, roughness: 0.95, side: THREE.DoubleSide })); shaft.position.set(-0.1, SS_H + 0.075, SS_SHAFT); sewer.add(shaft);
    const cover = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.03, 8, 40), M.metal); cover.rotation.x = Math.PI / 2; cover.position.set(-0.1, STREET + 0.01, SS_SHAFT); sewer.add(cover);
    // side inlets in the far wall, every couple of metres
    [-3.5, -0.5, 2.0].forEach((z) => { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.2, 20, 1, true), concDark); p.rotation.z = Math.PI / 2; p.position.set(-SS_W / 2 + 0.02, SS_FLOW + 0.25, z); sewer.add(p); });
    // the relay: a pole-mounted 5G CPE at the manhole with an antenna on a drop lead down the shaft
    const relay = new THREE.Group(); relay.position.set(-0.55, STREET, SS_SHAFT + 0.35); relay.add(at(cyl(0.025, 0.03, 1.3, M.metal, 10), 0, 0.65, 0), at(box(0.16, 0.22, 0.08, M.white, 0.02), 0, 1.2, 0.05), at(cyl(0.006, 0.006, 0.25, M.blackPlastic, 6), 0.05, 1.42, 0.05)); sewer.add(relay); this.relay = relay;
    const drop = new THREE.Group(); drop.position.set(-0.1, SS_H - 0.35, SS_SHAFT); drop.add(at(cyl(0.004, 0.004, 0.5, M.blackPlastic, 4), 0, 0.25, 0), at(cyl(0.02, 0.02, 0.14, M.white, 10), 0, -0.05, 0)); sewer.add(drop); this.drop = drop;
    // the edge server: a street cabinet down the road
    const cab = new THREE.Group(); cab.position.set(-1.9, STREET, SS_SHAFT - 0.6); cab.add(at(box(0.5, 0.75, 0.38, physMat(0xe9e6e0, { roughness: 0.45 }), 0.03), 0, 0.375, 0), at(box(0.34, 0.015, 0.004, ledBlue), 0, 0.62, 0.192)); sewer.add(cab); this.cab = cab;
    shadowAll(sewer);
    // the flow: a slow, murky surface that drifts past
    const wt = textTex(256, 256, (g, w) => { g.fillStyle = '#4b5a4a'; g.fillRect(0, 0, w, w); for (let k = 0; k < 220; k++) { g.fillStyle = `rgba(${200 + hash(k, 1) * 40},${210 + hash(k, 2) * 30},${180},${0.06 + hash(k, 3) * 0.1})`; g.fillRect(hash(k, 4) * w, hash(k, 5) * w, 2 + hash(k, 6) * 18, 1 + hash(k, 7) * 2); } });
    wt.wrapS = wt.wrapT = THREE.RepeatWrapping; wt.repeat.set(1.2, 8); this.wt = wt;
    this.water = new THREE.Mesh(new THREE.PlaneGeometry(SS_W, SS_LEN), new THREE.MeshPhysicalMaterial({ color: 0x8a9a86, map: wt, roughness: 0.25, clearcoat: 0.6, transparent: true, opacity: 0.92 }));
    this.water.rotation.x = -Math.PI / 2; this.water.position.y = SS_FLOW; root.add(this.water);
    // the vessel, at 150 mm draft
    const { R, P } = buildSkimmerParts(); R.scale.setScalar(SS_K); this.boat = R; this.P = P;
    this.home = V3(0.08, SS_FLOW - 0.15 * SS_K, -0.6); R.position.copy(this.home); root.add(R);
    this.check = new THREE.Mesh(new THREE.RingGeometry(0.16, 0.2, 32), new THREE.MeshBasicMaterial({ color: SLOT.packet, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })); this.check.rotation.x = -Math.PI / 2; this.check.position.set(0.08, SS_FLOW + 0.005, -3.2); root.add(this.check);
    // floating debris that rides up the ramp into the basket
    const kinds = [[new THREE.CylinderGeometry(0.025, 0.025, 0.12, 10).rotateZ(Math.PI / 2), physMat(0xbfe3ef, { roughness: 0.1, transparent: true, opacity: 0.7 })], [new THREE.SphereGeometry(0.05, 10, 6).scale(1, 0.3, 0.8), mat(0xe9e6e0, { roughness: 0.9 })], [new THREE.BoxGeometry(0.08, 0.02, 0.06), mat(0x9a6a3a, { roughness: 0.9 })]];
    this.trash = Array.from({ length: SS_TRASH }, (_, i) => { const [g, m] = kinds[i % 3]; const o = new THREE.Mesh(g, m); root.add(o); return { o, x: (hash(i, 9) - 0.5) * 0.36, z: 0.2 + hash(i, 4) * 4.5, a: hash(i, 5) * 6, t: -1 }; });
    this.count = 0;
    // sensing: a light cone from the bar, sonar pings under the keel, gas rising into the louvre
    this.beam = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.8, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0xcfe0ff, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide })); this.beam.rotation.x = -Math.PI / 2; root.add(this.beam);
    this.pings = [0, 1, 2].map(() => { const r = new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 40), new THREE.MeshBasicMaterial({ color: SLOT.packet, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })); r.rotation.x = -Math.PI / 2; root.add(r); return r; });
    this.gas = new THREE.InstancedMesh(new THREE.SphereGeometry(0.012, 6, 4), new THREE.MeshBasicMaterial({ color: 0xd8d27a, transparent: true, opacity: 0 }), 30); root.add(this.gas);
    // the link: robot → drop antenna → CPE → edge server
    const flow = makeFlow(); this.flow = flow;
    flow.add(root, () => this.P.ant.localToWorld(V3(0, 0.66, 0)), () => this.drop.localToWorld(V3(0, -0.1, 0)), 0.25, 3, 0.022);
    flow.add(root, () => this.drop.localToWorld(V3(0, 0.5, 0)), () => this.relay.localToWorld(V3(0, 1.32, 0.05)), 0.2, 2, 0.022);
    flow.add(root, () => this.relay.localToWorld(V3(0, 1.32, 0.05)), () => this.cab.localToWorld(V3(0, 0.8, 0)), 0.6, 3, 0.022);
    this.m = new THREE.Matrix4();
    // labels
    const T2 = (h) => mkTag(h);
    this.partTags = [['hulls', '<b>Twin hulls</b> <i>150 mm draft</i>', () => this.boat.localToWorld(V3(0.5, 0.42, 1.0))], ['thr', '<b>Ducted thrusters</b> <i>Ø200 mm · differential</i>', () => this.boat.localToWorld(V3(0.5, 0.2, -1.4))], ['ramp', '<b>Intake ramp</b> <i>31° · 11 slots</i>', () => this.boat.localToWorld(V3(0, 0.3, 1.35))], ['basket', '<b>Debris basket</b> <i>grated floor</i>', () => this.boat.localToWorld(V3(0, 0.8, 0.0))], ['gantry', '<b>Bow gantry</b> <i>sensor module</i>', () => this.boat.localToWorld(V3(0, 1.12, 0.9))], ['ant', '<b>5G whip</b> <i>625 mm</i>', () => this.boat.localToWorld(V3(-0.35, 1.1, -0.95))]].map(([k, h, f]) => ({ k, f, el: T2(h) }));
    this.senseTags = [['<b>Dome camera</b> <i>navigation · defects</i>', () => this.P.dome.getWorldPosition(V3()).add(V3(0, -0.06, 0))], ['<b>Sonar</b> <i>depth and silt</i>', () => this.P.sonar.localToWorld(V3(0, -0.2, 0))], ['<b>Gas louvre</b> <i>H₂S · CH₄</i>', () => this.P.louvre.getWorldPosition(V3()).add(V3(0, 0.05, 0))], ['<b>GNSS</b>', () => this.P.gnss.getWorldPosition(V3()).add(V3(0, 0.04, 0))]].map(([h, f]) => ({ f, el: T2(h) }));
    this.linkTags = [[T2('<b>720p · 15 fps</b> <i>about 2 Mbps</i>'), () => this.flow.items[0].curve.getPoint(0.5).add(V3(0, 0.08, 0))], [T2('<b>Manhole relay</b> <i>pole-mounted 5G CPE</i>'), () => this.relay.localToWorld(V3(0, 1.5, 0))], [T2('<b>Edge AI server</b> <i>inference off the robot</i>'), () => this.cab.localToWorld(V3(0, 0.95, 0))]];
    this.lossTag = T2('<b class="lt">Link lost</b> <i class="li">holding position</i>'); this.lossTag.classList.add('hot');
    this.countTag = T2('<b class="c">0 pieces</b> <i>in the basket</i>'); this.countTag.classList.add('hot');
    this.realTags = [[T2('<b>Real</b> <i>CAD geometry and dimensions</i>'), () => this.boat.localToWorld(V3(0, 1.25, 0.2))], [T2('<b>Modelled</b> <i>sewer to specification</i>'), () => this.sewer.localToWorld(V3(-SS_W / 2, SS_H * 0.8, 2.2))], [T2('<b>Calculated</b> <i>5G figures, not measured</i>'), () => this.relay.localToWorld(V3(0, 1.5, 0))]];
    // the vessel stays drawn to the CAD's dimensions (the lab's Blender skimmer is only a likeness); it gets the opening
    this.asm = makeAssemble([P.hulls, P.thr, P.ramp, P.basket, P.gantry, P.louvre, P.ant, P.sonar], { lift: 0.5, spread: 0.6 });
  },
  key(i, tt) {
    const b = () => this.boat.position.clone().add(STUDIO);
    switch (i) {
      case 0: return { pos: S(1.15, 0.7, 2.4), look: S(0.05, 0.42, -0.2) };
      case 1: return { pos: S(1.6, 0.95, 3.4), look: S(-0.1, 0.45, -0.4) };
      case 2: return { pos: S(1.5, 0.9, 0.6), look: S(0.05, 0.4, -0.6) };
      case 3: return { pos: S(1.0, 0.75, 1.4), look: S(0.0, 0.3, 0.1) };
      case 4: return { pos: S(1.25, 0.6, 0.9), look: S(0.0, 0.35, 0.0) };
      case 5: return { pos: S(4.6, 3.3, 2.1), look: S(-0.7, 0.75, 1.0) };
      case 6: { const p = b(); return { pos: p.clone().add(V3(1.6, 0.9, 1.6)), look: p.clone().add(V3(-0.1, 0.25, -0.6)) }; }
      case 7: return { pos: S(2.6, 2.4, 5.0), look: S(-0.4, 0.8, 0.8) };
      case 8: return { pos: S(1.4, 0.8, 2.8), look: S(0, 0.4, -0.3) };
      default: return { pos: S(2.6, 1.4, 3.6), look: S(-0.3, 0.7, 0.4) };
    }
  },
  update(dt, t, sp) {
    const P = this.P;
    // the flow drifts toward the bow's direction of travel (the vessel makes way against it)
    const run = 1 - win(sp, 5.6, 6.4, 0.3), flowV = (reduced ? 0 : 0.28) * run;
    this.wt.offset.y += flowV * dt * 0.7;
    P.props.forEach((h) => { h.rotation.z += dt * (4 + 26 * run); });
    // hover a part in the list to find it
    ['hulls', 'thr', 'ramp', 'basket', 'gantry', 'ant'].forEach((k) => { P[k].scale.setScalar(hotPart === k ? 1.05 : 1); });
    // debris: drifts down the channel, meets the ramp, rides up into the basket
    const skim = win(sp, 2.7, 3.3, 0.3); this.skim = skim;
    const bow = this.boat.position.z + 1.3 * SS_K;
    this.trash.forEach((d, i) => {
      if (d.t >= 0) { d.t += dt * 1.1; const k = Math.min(1, d.t); d.o.position.set(this.boat.position.x + d.x * (1 - k), SS_FLOW + 0.02 + k * 0.28, bow - k * 0.42); d.o.scale.setScalar(1 - k * 0.5); if (k >= 1) { d.t = -1; d.z = bow + 3.5 + hash(i, t) * 1.2; d.x = (hash(i, t + 1) - 0.5) * 0.36; d.o.scale.setScalar(1); } }
      else {
        d.z -= flowV * dt; d.a += dt * 0.25;
        if (d.z < bow && d.z > bow - 0.2 && Math.abs(d.x) < 0.22 && skim > 0.5) { d.t = 0; this.count++; }
        if (d.z < -SS_LEN / 2 + 0.3) d.z = SS_LEN / 2 - 0.3;
        d.o.position.set(this.boat.position.x + d.x + Math.sin(d.a) * 0.02, SS_FLOW + 0.012 + (reduced ? 0 : Math.sin(t * 1.4 + i) * 0.004), d.z); d.o.rotation.y = d.a;
      }
    });
    // sensing: light, sonar, gas
    const se = win(sp, 3.7, 4.3, 0.3); this.se = se;
    const dw = P.dome.getWorldPosition(V3()).sub(STUDIO); this.beam.position.set(dw.x, dw.y - 0.05, dw.z + 0.9); this.beam.material.opacity = 0.1 * se;
    const sw = P.sonar.localToWorld(V3(0, -0.2, 0)).sub(STUDIO);
    this.pings.forEach((r, k) => { const ph = ((t * 0.5 + k / 3) % 1); r.position.set(sw.x, sw.y - 0.02 - ph * 0.04, sw.z); r.scale.setScalar(0.04 + ph * 0.32); r.material.opacity = se * 0.7 * (1 - ph); });
    const lw = P.louvre.getWorldPosition(V3()).sub(STUDIO); this.gas.material.opacity = 0.75 * se;
    for (let k = 0; k < 30; k++) { const ph = reduced ? 0.5 : ((t * 0.25 + hash(k, 2)) % 1); this.m.makeTranslation(lw.x + (hash(k, 3) - 0.5) * 0.5 * (1 - ph), SS_FLOW + 0.05 + ph * (lw.y - SS_FLOW), lw.z + (hash(k, 4) - 0.5) * 0.4 * (1 - ph)); this.gas.setMatrixAt(k, this.m); }
    this.gas.instanceMatrix.needsUpdate = true; this.gas.visible = se > 0.01;
    // the link, then losing it: hold at 2 s, retry to 30 s, back to the last checkpoint
    const lk = win(sp, 4.7, 5.3, 0.3), loss = win(sp, 5.6, 6.4, 0.3); this.lk = lk; this.loss = loss;
    const u = clamp01((sp - 5.55) / 0.85); this.lossU = u;
    const back = ease(clamp01((u - 0.62) / 0.38));
    this.boat.position.z = this.home.z + (this.check.position.z - this.home.z) * back * loss;
    this.check.material.opacity = 0.9 * loss * clamp01((u - 0.5) / 0.1);
    this.flow.update(t, Math.max(lk, win(sp, 6.7, 7.3, 0.3)) * (loss > 0.5 ? 0 : 1), 0.45);
    // the boat bobs
    this.boat.position.y = this.home.y + (reduced ? 0 : Math.sin(t * 1.2) * 0.006); this.boat.rotation.z = reduced ? 0 : Math.sin(t * 0.9) * 0.012;
    P.led.visible = !reduced && loss > 0.5 ? Math.sin(t * 6) > 0 : true;
  },
  overlay(t, sp) {
    const bld = win(sp, 1.75, 2.3, 0.25) > 0.85;
    this.partTags.forEach((p) => { place(p.el, p.f(), bld || hotPart === p.k && win(sp, 1.7, 3.3) > 0.5); p.el.classList.toggle('hot', hotPart === p.k); });
    const s = `${this.count} piece${this.count === 1 ? '' : 's'}`, c = this.countTag.querySelector('.c'); if (c.textContent !== s) { c.textContent = s; this.countTag._w = 0; }
    place(this.countTag, this.boat.localToWorld(V3(0, 1.0, 0.1)), this.skim > 0.85);
    this.senseTags.forEach((x) => place(x.el, x.f(), this.se > 0.85));
    this.linkTags.forEach(([el, f]) => place(el, f(), this.lk > 0.85));
    // the link-loss steps follow the scroll through the chapter
    const u = this.lossU, st = u < 0.3 ? ['Link lost', 'holding position after 2 s'] : u < 0.62 ? ['Retrying', 'for up to 30 s'] : ['No link after 30 s', 'returning to the last checkpoint'];
    if (this.lossTag.dataset.s !== st[0]) { this.lossTag.dataset.s = st[0]; this.lossTag.querySelector('.lt').textContent = st[0]; this.lossTag.querySelector('.li').textContent = st[1]; this.lossTag._w = 0; }
    place(this.lossTag, this.boat.localToWorld(V3(0, 1.3, 0)), this.loss > 0.85);
    const real = win(sp, 6.7, 7.3, 0.3) > 0.85;
    this.realTags.forEach(([el, f]) => place(el, f(), real));
  },
  audio(sp) { return { hum: 0.3 + 0.4 * (1 - this.loss), pitch: 0.8, ticks: this.lk, water: 1 }; }
};
