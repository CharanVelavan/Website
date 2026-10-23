
// ===================== WaterBot: a pond, the boat, LoRa from the shore, the probes, the trash it collects =====================
// the boat from the SIH build and its 3D model: white foam walls, an open front with a mesh ramp, solar wings, a rear deck
function buildBoat() {
  const R = new THREE.Group(), P = {};
  const foam = physMat(0xf1f0ec, { roughness: 0.75 });
  const hull = new THREE.Group();
  [-1, 1].forEach((s) => { hull.add(at(box(0.07, 0.3, 1.05, foam, 0.01), s * 0.38, 0.15, 0)); });
  hull.add(at(box(0.83, 0.3, 0.06, foam, 0.01), 0, 0.15, -0.5), at(box(0.83, 0.03, 0.5, foam, 0.01), 0, 0.3, -0.27), at(box(0.83, 0.04, 1.0, mat(0x2a2b30, { roughness: 0.8 }), 0.01), 0, 0.02, 0));
  R.add(hull); P.hull = hull;
  const meshTex = textTex(128, 128, (g, w) => { g.clearRect(0, 0, w, w); g.strokeStyle = '#ffffff'; g.lineWidth = 3; for (let k = 0; k <= w; k += 12) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, w); g.stroke(); g.beginPath(); g.moveTo(0, k); g.lineTo(w, k); g.stroke(); } });
  meshTex.wrapS = meshTex.wrapT = THREE.RepeatWrapping; meshTex.repeat.set(5, 4);
  const ramp = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.55), new THREE.MeshStandardMaterial({ color: 0x3a3d45, map: meshTex, alphaTest: 0.4, side: THREE.DoubleSide, metalness: 0.4, roughness: 0.5 }));
  ramp.rotation.x = -Math.PI / 2 + 0.42; ramp.position.set(0, 0.1, 0.32); R.add(ramp); P.ramp = ramp;
  const bin = new THREE.Group(); bin.position.set(0, 0.06, -0.08); bin.add(at(box(0.66, 0.12, 0.3, mat(0x3a3d45, { roughness: 0.6, transparent: true, opacity: 0.6 })), 0, 0.06, 0)); R.add(bin); P.bin = bin;
  const batt = new THREE.Group(); [-0.24, 0.24].forEach((x) => batt.add(at(box(0.12, 0.1, 0.17, mat(0x15161a), 0.008), x, 0.09, -0.32))); R.add(batt); P.batt = batt;
  const solar = new THREE.Group(); const sm = physMat(0x14254a, { roughness: 0.2, clearcoat: 1 });
  const cells = textTex(256, 128, (g, w, h) => { g.fillStyle = '#14254a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#3a4f78'; g.lineWidth = 2; for (let x = 0; x < w; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (let y = 0; y < h; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); } });
  [-1, 1].forEach((s) => { const wg = new THREE.Group(); wg.position.set(s * 0.41, 0.3, -0.05); const p = box(0.4, 0.015, 0.72, new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: cells, roughness: 0.2, clearcoat: 1 })); p.position.x = s * 0.2; wg.add(p); wg.rotation.z = s * 0.3; solar.add(wg); }); R.add(solar); P.solar = solar;
  const ctrl = new THREE.Group(); ctrl.position.set(0.12, 0.315, -0.3); ctrl.add(box(0.07, 0.004, 0.053, mat(0x1f6fb2)), at(box(0.04, 0.004, 0.03, M.pcbGreen), -0.1, 0, 0.0), at(box(0.06, 0.009, 0.04, mat(0xe9e6e0)), 0.0, 0.0, 0.07)); R.add(ctrl); P.ctrl = ctrl;
  const mast = new THREE.Group(); mast.position.set(-0.15, 0.32, -0.32); mast.add(at(cyl(0.006, 0.006, 0.42, M.blackPlastic, 8), 0, 0.21, 0), at(sphere(0.012, M.blackPlastic), 0, 0.43, 0)); R.add(mast); P.mast = mast;
  const motors = new THREE.Group(); [-0.26, 0.26].forEach((x) => { const m = new THREE.Group(); m.position.set(x, -0.04, -0.56); const pod = cyl(0.03, 0.03, 0.12, mat(0x2b4fb8), 16); pod.rotation.x = Math.PI / 2; m.add(pod); const prop = new THREE.Group(); prop.position.z = -0.07; prop.name = 'prop'; [0, 1, 2].forEach((k) => { const b = box(0.008, 0.07, 0.016, mat(0x2b4fb8)); b.position.y = 0.035; const h = new THREE.Group(); h.rotation.z = k * 2.1; h.add(b); prop.add(h); }); m.add(prop); motors.add(m); }); R.add(motors); P.motors = motors;
  // the full-scale design's extra sensors, shown as ghosts
  const ghost = new THREE.MeshStandardMaterial({ color: SLOT.packet, transparent: true, opacity: 0, emissive: SLOT.link, emissiveIntensity: 0.4, depthWrite: false });
  const full = { lidar: at(cyl(0.05, 0.05, 0.05, ghost, 24), -0.15, 0.78, -0.32), sounder: at(cyl(0.05, 0.03, 0.06, ghost, 16), 0, -0.04, -0.2), p4: at(box(0.12, 0.08, 0.08, ghost, 0.01), 0, 0.36, 0.5), rtk: at(cyl(0.06, 0.06, 0.02, ghost, 24), 0.25, 0.36, -0.42) };
  Object.values(full).forEach((o) => R.add(o)); P.full = full; P.ghost = ghost;
  // three probes that dip into the water
  const probes = new THREE.Group(); probes.position.set(0.43, 0.2, 0.15); [0, 1, 2].forEach((k) => { const p = new THREE.Group(); p.position.z = -k * 0.16; p.add(at(cyl(0.006, 0.006, 0.42, mat(0x3a3d45), 8), 0, -0.12, 0), at(cyl(0.013, 0.013, 0.05, mat([0x5d6fb8, 0x8a8f3a, 0x3f8f8a][k]), 12), 0, -0.32, 0)); probes.add(p); }); R.add(probes); P.probes = probes;
  shadowAll(R); return { R, P };
}
const WB_TRASH = 22;
BAYS.wb = {
  objs: [], fog: [12, 90],
  build() {
    const root = new THREE.Group(); root.position.copy(STUDIO); this.root = root; this.objs.push(root);
    // the pond: a soft-edged disc of moving water
    const alpha = textTex(256, 256, (g, w) => { const gr = g.createRadialGradient(w / 2, w / 2, w * 0.3, w / 2, w / 2, w * 0.5); gr.addColorStop(0, '#fff'); gr.addColorStop(1, '#000'); g.fillStyle = gr; g.fillRect(0, 0, w, w); });
    alpha.colorSpace = THREE.NoColorSpace;
    const wg = new THREE.PlaneGeometry(16, 16, 72, 72); wg.rotateX(-Math.PI / 2);
    this.water = new THREE.Mesh(wg, new THREE.MeshPhysicalMaterial({ color: 0x2e6b7c, roughness: 0.12, metalness: 0.05, clearcoat: 1, transparent: true, alphaMap: alpha, opacity: 0.95, depthWrite: false }));
    this.water.position.y = 0.02; this.water.receiveShadow = !mobile; root.add(this.water); this.wBase = Float32Array.from(wg.attributes.position.array);
    const { R, P } = buildBoat(); this.boat = R; this.P = P; root.add(R);
    // floating trash and duckweed
    const bottle = new THREE.CylinderGeometry(0.03, 0.03, 0.16, 12); bottle.rotateZ(Math.PI / 2);
    const kinds = [[bottle, physMat(0xbfe3ef, { roughness: 0.1, transparent: true, opacity: 0.7, clearcoat: 1 })], [new THREE.SphereGeometry(0.07, 10, 6).scale(1, 0.25, 0.8), mat(0xe9e6e0, { roughness: 0.9 })], [new THREE.CylinderGeometry(0.028, 0.028, 0.09, 12).rotateZ(Math.PI / 2), mat(0xb8bcc4, { metalness: 0.8, roughness: 0.3 })], [new THREE.CircleGeometry(0.12, 12).rotateX(-Math.PI / 2), mat(0x5f8a3a, { roughness: 0.9, side: THREE.DoubleSide })]];
    this.trash = Array.from({ length: WB_TRASH }, (_, i) => { const [g, m] = kinds[i % 4]; const o = new THREE.Mesh(g, m); root.add(o); const d = { o, x: (hash(i, 9) - 0.5) * 0.6, z: 0.9 + hash(i, 4) * 3.4, a: hash(i, 5) * 6, t: -1 }; o.position.set(d.x, 0.04, d.z); return d; });
    this.count = 0;
    // the shore: a little jetty with the LoRa remote on a tripod
    const shore = new THREE.Group(); shore.position.set(-2.2, 0, 1.9); shore.add(at(box(1.0, 0.08, 0.7, M.wood, 0.01), 0, 0.1, 0)); [[-0.4, -0.25], [0.4, -0.25], [-0.4, 0.25], [0.4, 0.25]].forEach(([x, z]) => shore.add(at(cyl(0.025, 0.025, 0.3, M.wood, 8), x, -0.02, z)));
    const tri = new THREE.Group(); tri.position.set(0.1, 0.14, 0); [0, 2.1, 4.2].forEach((a) => { const l = cyl(0.008, 0.008, 0.5, M.metal, 6); l.position.set(Math.cos(a) * 0.08, 0.23, Math.sin(a) * 0.08); l.rotation.set(Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3); tri.add(l); }); tri.add(at(box(0.14, 0.05, 0.1, mat(0x1f6fb2), 0.01), 0, 0.5, 0), at(cyl(0.005, 0.005, 0.22, M.blackPlastic, 8), 0.05, 0.63, 0)); shore.add(tri); root.add(shore); shadowAll(shore); this.shore = shore; this.tri = tri;
    const flow = makeFlow(); this.flow = flow;
    flow.add(root, () => this.tri.localToWorld(V3(0.05, 0.74, 0)), () => this.P.mast.localToWorld(V3(0, 0.44, 0)), 0.6, 4, 0.05);
    // labels
    const T2 = (h) => mkTag(h);
    this.partTags = [['hull', '<b>Hull</b> <i>foam board · acrylic</i>', () => this.boat.localToWorld(V3(-0.38, 0.34, 0.3))], ['ramp', '<b>Mesh ramp</b> <i>scoops debris</i>', () => this.boat.localToWorld(V3(0, 0.2, 0.5))], ['motors', '<b>BLDC motors + ESC</b>', () => this.boat.localToWorld(V3(0.26, 0.02, -0.62))], ['batt', '<b>Batteries</b> <i>lead-acid backup</i>', () => this.boat.localToWorld(V3(-0.24, 0.2, -0.32))], ['solar', '<b>Solar wings</b>', () => this.boat.localToWorld(V3(0.75, 0.52, 0))], ['ctrl', '<b>Arduino Uno + LoRa</b>', () => this.boat.localToWorld(V3(0.12, 0.34, -0.3))]].map(([k, h, f]) => ({ k, f, el: T2(h) }));
    this.loraTag = T2('<b>LoRa</b> <i>19200 baud · long range</i>'); this.shoreTag = T2('<b>Shore remote</b> <i>Arduino + LoRa</i>');
    this.probeTags = [['pH', 'acidity'], ['Salinity', 'dissolved salts'], ['Dissolved O₂', 'oxygen for life']].map(([n, s]) => T2(`<b>${n}</b> <i>${s}</i>`));
    this.countTag = T2('<b class="c">0 pieces</b> <i>collected</i>'); this.countTag.classList.add('hot');
    this.fullTags = [['lidar', 'LiDAR', 'obstacles'], ['sounder', 'Depth sounder', 'safe water'], ['p4', 'P4 multispectral camera', 'trash detection'], ['rtk', 'RTK GPS', 'centimetre position']].map(([k, n, s]) => ({ k, el: T2(`<b>${n}</b> <i>${s}</i>`) }));
  },
  key(i, tt) {
    switch (i) {
      case 0: return { pos: S(0.0, 0.62, 1.75), look: S(0, 0.2, 0) };
      case 1: return { pos: S(1.7, 1.25, 2.3), look: S(0, 0.22, 0.2) };
      case 2: return { pos: S(1.15, 0.95, 1.2), look: S(0, 0.22, 0) };
      case 3: return { pos: S(-0.3, 2.1, 4.4), look: S(-1.0, 0.3, 0.8) };
      case 4: return { pos: S(1.25, 0.5, 1.0), look: S(0.42, 0.02, 0.05) };
      case 5: return { pos: S(1.8, 1.45, 3.1), look: S(0, 0.1, 1.0) };
      case 6: return { pos: S(1.45, 1.15, 1.8), look: S(0, 0.42, 0) };
      case 7: return { pos: S(-1.6, 1.0, 1.9), look: S(0, 0.25, 0) };
      default: return { pos: S(2.3, 0.75, 2.6), look: S(0, 0.3, 0) };
    }
  },
  update(dt, t, sp) {
    // water moves; the boat bobs on it
    const pa = this.water.geometry.attributes.position, b0 = this.wBase;
    if (!reduced) { for (let k = 0; k < pa.count; k++) { const x = b0[k * 3], z = b0[k * 3 + 2]; pa.setY(k, Math.sin(x * 2.1 + t * 1.4) * 0.012 + Math.cos(z * 1.7 + t * 1.1) * 0.01); } pa.needsUpdate = true; }
    this.boat.position.y = reduced ? 0 : Math.sin(t * 1.3) * 0.012; this.boat.rotation.z = reduced ? 0 : Math.sin(t * 1.1) * 0.015; this.boat.rotation.x = reduced ? 0 : Math.sin(t * 0.9) * 0.012;
    const P = this.P;
    // collecting: the water flows past, trash meets the ramp, rides up into the bin
    const col = win(sp, 4.7, 5.3, 0.3); this.col = col;
    const flowV = col * (reduced ? 0 : 0.35);
    P.motors.children.forEach((m) => { m.children[1].rotation.z += dt * (6 + 40 * col); });
    this.trash.forEach((d, i) => {
      if (d.t >= 0) { d.t += dt * 1.2; const k = Math.min(1, d.t); d.o.position.set(d.x * (1 - k), 0.04 + k * 0.2, 0.5 - k * 0.55); d.o.scale.setScalar(1 - k * 0.6); if (k >= 1) { d.t = -1; d.z = 3.6 + hash(i, t) * 0.8; d.x = (hash(i, t + 1) - 0.5) * 0.6; d.o.scale.setScalar(1); } }
      else {
        d.z -= flowV * dt; d.a += dt * 0.3;
        if (d.z < 0.5 && Math.abs(d.x) < 0.32 && col > 0.5) { d.t = 0; this.count++; }
        if (d.z < -1) d.z = 3.8;
        d.o.position.set(d.x + Math.sin(d.a) * 0.03, 0.035 + Math.sin(t * 1.5 + i) * 0.008, d.z); d.o.rotation.y = d.a;
      }
      d.o.visible = d.z > -0.6 || d.t >= 0;
    });
    // the build: hover a part in the list to find it
    ['hull', 'ramp', 'motors', 'batt', 'solar', 'ctrl'].forEach((k) => { P[k].scale.setScalar(hotPart === k ? 1.06 : 1); });
    // LoRa and probes
    const lk = win(sp, 2.75, 3.3, 0.3); this.lk = lk; this.flow.update(t, lk, 0.35);
    const se = win(sp, 3.75, 4.3, 0.3); this.se = se; P.probes.position.y = 0.2 - 0.06 * ease(se);
    // the full-scale design
    const fu = win(sp, 5.7, 6.3, 0.3); this.fu = fu; P.ghost.opacity = 0.75 * fu; P.full.lidar.rotation.y += dt * 4;
    Object.values(P.full).forEach((o) => { o.visible = fu > 0.01; });
    this.shore.visible = lk > 0.01 || win(sp, 0.8, 1.5) > 0;
  },
  overlay(t, sp) {
    const bld = win(sp, 1.7, 2.35, 0.25) > 0.85;
    this.partTags.forEach((p) => { place(p.el, p.f(), bld); p.el.classList.toggle('hot', hotPart === p.k); });
    place(this.loraTag, this.flow.items[0].curve.getPoint(0.5).add(V3(0, 0.1, 0)), this.lk > 0.85);
    place(this.shoreTag, this.tri.localToWorld(V3(0, 0.8, 0)), this.lk > 0.85);
    this.probeTags.forEach((el, k) => place(el, this.P.probes.children[k].localToWorld(V3(0, 0.12, 0)), this.se > 0.85));
    const s = `${this.count} piece${this.count === 1 ? '' : 's'}`, c = this.countTag.querySelector('.c'); if (c.textContent !== s) { c.textContent = s; this.countTag._w = 0; }
    place(this.countTag, this.boat.localToWorld(V3(0, 0.62, -0.1)), this.col > 0.85);
    this.fullTags.forEach((f) => place(f.el, this.P.full[f.k].localToWorld(V3(0, f.k === 'sounder' ? -0.02 : 0.08, 0)), this.fu > 0.85));
  },
  audio(sp) { return { hum: 0.25 + 0.5 * this.col, pitch: 0.75, ticks: this.lk, water: 1 }; }
};
