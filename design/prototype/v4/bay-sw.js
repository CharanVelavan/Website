
// ===================== the 300-UAV swarm: a city, a tower with an edge server, three ways to talk =====================
const SWC = V3(-1, 0, -24);
const SW = (x, y, z) => SWC.clone().add(V3(x, y, z));
const SW_N = 300, SW_COLS = 20;
const SW_GROUP_COL = [0xd9733a, 0x3f8f8a, 0x5d6fb8, 0x8a8f3a, 0x9a5a8a, 0xc9a25a];
BAYS.sw = {
  objs: [], phoneZoom: 1.25, fog: [30, 170], sunFollows: true,
  build() {
    const root = new THREE.Group(); this.root = root; this.objs.push(root);
    // the city: a street grid of blocks
    root.add(at(box(24, 0.04, 18, mat(0x8c8a86, { roughness: 0.95 })), SWC.x + 0.5, 0.0, SWC.z + 0.2));
    const blocks = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), mat(0xffffff, { roughness: 0.8 }), 160); let bi = 0; const mtx = new THREE.Matrix4();
    const tint = new THREE.Color();
    for (let gx = 0; gx < 13; gx++) for (let gz = 0; gz < 10; gz++) {
      if (bi >= 160 || hash(gx, gz) < 0.12) continue;
      const h = 0.3 + Math.pow(hash(gx + 7, gz + 3), 2.5) * 1.9, x = SWC.x - 9 + gx * 1.6, z = SWC.z - 7 + gz * 1.6;
      mtx.compose(V3(x, h / 2, z), new THREE.Quaternion(), V3(1.0, h, 1.0)); blocks.setMatrixAt(bi, mtx); blocks.setColorAt(bi++, tint.setHSL(0.08, 0.08, 0.72 + hash(gx, gz + 9) * 0.16));
    }
    blocks.count = bi; blocks.castShadow = blocks.receiveShadow = !mobile; root.add(blocks);
    // the swarm: four instanced parts, with an LED that takes the colour of its delivery group
    const armA = new THREE.BoxGeometry(0.55, 0.05, 0.07); armA.rotateY(Math.PI / 4); const armB = new THREE.BoxGeometry(0.55, 0.05, 0.07); armB.rotateY(-Math.PI / 4);
    const dm = mat(0x1c1d21, { roughness: 0.5 });
    this.parts = [armA, armB, new THREE.BoxGeometry(0.16, 0.08, 0.16)].map((g) => { const m = new THREE.InstancedMesh(g, dm, SW_N); root.add(m); return m; });
    this.leds = new THREE.InstancedMesh(new THREE.SphereGeometry(0.07, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }), SW_N); root.add(this.leds);
    this.pos = []; this.group = [];
    for (let i = 0; i < SW_N; i++) {
      const gx = i % SW_COLS, gz = Math.floor(i / SW_COLS);
      this.pos.push(SW((gx - 9.5) * 1.15 + (hash(i, 1) - 0.5) * 0.6, 6.2 + hash(i, 2) * 2.6, (gz - 7) * 1.1 + (hash(i, 3) - 0.5) * 0.6));
      this.group.push(Math.floor(gx / 7) + 3 * Math.floor(gz / 8));
    }
    this.centroid = SW_GROUP_COL.map((_, g) => { const c = V3(); let n = 0; this.pos.forEach((p, i) => { if (this.group[i] === g) { c.add(p); n++; } }); return c.multiplyScalar(1 / Math.max(1, n)); });
    // the tower: a lattice mast with sector panels and a broadcast antenna; the edge server at its foot
    const T = new THREE.Group(); T.position.copy(SW(-13, 0, 5)); root.add(T); this.tower = T;
    T.add(at(cyl(0.12, 0.34, 10, M.metal, 8), 0, 5, 0));
    for (let k = 0; k < 3; k++) { const a = k * 2.1, p = box(0.45, 1.2, 0.08, M.white, 0.02); p.position.set(Math.cos(a) * 0.32, 8.6, Math.sin(a) * 0.32); p.rotation.y = -a + Math.PI / 2; T.add(p); }
    T.add(at(cyl(0.05, 0.05, 1.6, M.white, 12), 0, 10.8, 0), at(sphere(0.09, ledGreen), 0, 11.65, 0));
    const cab = new THREE.Group(); cab.position.set(-1.0, 0, 1.0); cab.add(at(box(0.7, 1.1, 0.55, physMat(0xe9e6e0, { roughness: 0.45 }), 0.03), 0, 0.55, 0));
    cab.add(at(box(0.5, 0.02, 0.004, ledBlue), 0, 0.95, 0.277), at(box(0.32, 0.22, 0.004, M.glass, 0.01), 0, 0.62, 0.277));
    const pi = new THREE.Group(); pi.position.set(0, 0.62, 0.285); pi.add(box(0.17, 0.11, 0.01, M.pcbGreen, 0.004)); pi.add(at(cyl(0.03, 0.03, 0.02, mat(0x22252b, { metalness: 0.5 }), 20).rotateX(Math.PI / 2), -0.02, 0, 0.012)); cab.add(pi);
    T.add(cab); this.cab = cab; shadowAll(T);
    this.top = () => T.localToWorld(V3(0, 8.6, 0));
    // unicast: a line to every drone; multicast: a line to each group, then a fan; broadcast: rings
    const lm = (op) => new THREE.LineBasicMaterial({ color: 0xd9733a, transparent: true, opacity: op, depthWrite: false });
    this.uni = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(SW_N * 6), 3)), lm(0)); this.uni.renderOrder = 2; root.add(this.uni);
    this.multi = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array((SW_N + 6) * 6), 3)), lm(0)); root.add(this.multi);
    this.rings = [0, 1, 2].map(() => { const r = new THREE.Mesh(new THREE.RingGeometry(0.96, 1, 128), new THREE.MeshBasicMaterial({ color: 0xd9733a, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })); r.rotation.x = -Math.PI / 2; root.add(r); return r; });
    // results: bandwidth bars beside the tower
    const bars = new THREE.Group(); bars.position.copy(SW(-9.5, 0, 11)); root.add(bars); this.bars = bars;
    bars.add(at(box(3.2, 0.06, 1.3, mat(0x2a2b30)), 0, 0.03, 0));
    this.barU = at(box(0.8, 1, 0.8, mat(0x5a5d64, { roughness: 0.5 })), -0.7, 0.5, 0); this.barA = at(box(0.8, 1, 0.8, mat(0x9a4e25, { roughness: 0.5 })), 0.7, 0.5, 0); bars.add(this.barU, this.barA); shadowAll(bars);
    // labels
    this.towerTag = mkTag('<b>6G · 5G eMBMS · ATSC 3.0</b> <i>base station</i>');
    this.modeTag = mkTag('<b class="mt">6G unicast</b> <i class="mi">300 streams</i>'); this.modeTag.classList.add('hot');
    this.cabTag = mkTag('<b>Edge AI server</b> <i>Raspberry Pi 5 · &lt;100 ms</i>');
    this.feat = ['swarm size', 'payload', 'priority', 'density', 'congestion', 'latency need', 'packet loss'].map((n, i) => ({ n, i, el: mkTag(`<b>${n}</b>`) }));
    this.decTag = mkTag('<b class="dt">→ broadcast</b> <i class="di">confidence 0.91</i>'); this.decTag.classList.add('hot');
    this.barTags = [mkTag('<b>Unicast only</b> <i>100% · 220–230 ms</i>'), mkTag('<b>AI mixed</b> <i>up to 98% less · &lt;50 ms critical</i>')];
    this.swarmTag = mkTag('<b>300 UAVs</b> <i>digital twin over a smart city</i>');
    this.mode = 'uni'; this.m = new THREE.Matrix4(); this.q = new THREE.Quaternion(); this.c = new THREE.Color();
  },
  key(i, tt) {
    switch (i) {
      case 0: return { pos: SW(17, 12, 22), look: SW(-1, 5, 0) };
      case 1: return { pos: SW(15, 10, 20), look: SW(-1, 5.5, 0) };
      case 2: return { pos: SW(4, 12, 23), look: SW(-4.5, 6, 0) };
      case 3: return { pos: SW(9, 15, 19), look: SW(-1, 6, -1) };
      case 4: return { pos: SW(3, 25, 25), look: SW(-3, 5, -1) };
      case 5: { const c = this.cab.getWorldPosition(V3()); return { pos: c.clone().add(V3(0.9, 1.5, 3.1)), look: c.clone().add(V3(0, 0.75, 0)) }; }
      case 6: return { pos: SW(-5.5, 2.6, 18.5), look: SW(-9.5, 1.0, 11) };
      case 7: return { pos: SW(13, 6, 17), look: SW(-1, 6.5, 0) };
      default: return { pos: SW(-3, 4, 19), look: SW(-10, 7, 2) };
    }
  },
  update(dt, t, sp) {
    // which mode: the chapter decides; a mode button overrides until the chapter changes
    const ch = Math.round(sp), auto = ch <= 2 ? 'uni' : ch === 3 ? 'multi' : 'broad';
    if (this.lastCh !== ch) { this.lastCh = ch; swMode = null; }
    const mode = swMode || auto; this.mode = mode;
    if (this.shownMode !== mode) { this.shownMode = mode; document.querySelectorAll('[data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode))); document.querySelectorAll('.bw').forEach((b) => { b.textContent = { uni: '300', multi: '6', broad: '1' }[mode]; }); }
    // drones bob; LEDs take the colour of their group in multicast
    const P = this.parts, top = this.top();
    for (let i = 0; i < SW_N; i++) {
      const p = this.pos[i], y = p.y + (reduced ? 0 : Math.sin(t * 1.3 + i) * 0.08);
      this.m.compose(V3(p.x, y, p.z), this.q.setFromAxisAngle(V3(0, 1, 0), i * 0.7), V3(1, 1, 1));
      P.forEach((mm) => mm.setMatrixAt(i, this.m)); this.m.compose(V3(p.x, y + 0.06, p.z), this.q, V3(1, 1, 1)); this.leds.setMatrixAt(i, this.m);
      this.leds.setColorAt(i, this.c.set(mode === 'multi' ? SW_GROUP_COL[this.group[i]] : mode === 'broad' ? 0xe9c2a6 : 0xd9733a));
    }
    P.forEach((mm) => { mm.instanceMatrix.needsUpdate = true; }); this.leds.instanceMatrix.needsUpdate = true; this.leds.instanceColor.needsUpdate = true;
    // the delivery picture, only in the mode chapters
    const show = win(sp, 1.7, 4.3, 0.3); this.show = show;
    const ua = this.uni.geometry.attributes.position, ma = this.multi.geometry.attributes.position;
    this.uni.material.opacity = mode === 'uni' ? 0.42 * show : 0; this.multi.material.opacity = mode === 'multi' ? 0.6 * show : 0;
    if (mode === 'uni' && show > 0) { for (let i = 0; i < SW_N; i++) { const p = this.pos[i]; ua.setXYZ(i * 2, top.x, top.y, top.z); ua.setXYZ(i * 2 + 1, p.x, p.y + (reduced ? 0 : Math.sin(t * 1.3 + i) * 0.08), p.z); } ua.needsUpdate = true; }
    if (mode === 'multi' && show > 0) { this.centroid.forEach((c, g) => { ma.setXYZ(g * 2, top.x, top.y, top.z); ma.setXYZ(g * 2 + 1, c.x, c.y + 1.2, c.z); }); for (let i = 0; i < SW_N; i++) { const c = this.centroid[this.group[i]], p = this.pos[i]; ma.setXYZ(12 + i * 2, c.x, c.y + 1.2, c.z); ma.setXYZ(12 + i * 2 + 1, p.x, p.y, p.z); } ma.needsUpdate = true; }
    this.rings.forEach((r, k) => { const ph = ((t * 0.28 + k / 3) % 1); r.position.set(top.x, top.y - 1.5 - ph * 1.5, top.z); r.scale.setScalar(0.5 + ph * 24); r.material.opacity = mode === 'broad' ? show * 0.55 * (1 - ph) : 0; });
    // results bars grow in
    const res = win(sp, 5.7, 6.3, 0.3); this.res = res;
    this.bars.visible = res > 0.01; this.barU.scale.y = Math.max(0.01, 2.2 * ease(res)); this.barU.position.y = this.barU.scale.y / 2 + 0.06; this.barA.scale.y = Math.max(0.01, 0.03 * 2.2 * ease(res)); this.barA.position.y = this.barA.scale.y / 2 + 0.06;
    this.cab.children[1].visible = Math.sin(t * 8) > -0.3;
    sun.target.position.copy(SWC); sun.position.copy(SWC).add(V3(6, 14, 8)); sun.target.updateMatrixWorld();
  },
  overlay(t, sp) {
    place(this.swarmTag, SW(2, 10.6, -2), win(sp, 0.8, 1.3, 0.2) > 0.9);
    place(this.towerTag, this.tower.localToWorld(V3(0, 11.9, 0)), this.show > 0.9 || win(sp, 7.7, 8.2) > 0.9);
    const mt = { uni: ['6G unicast', '300 streams · one per drone'], multi: ['5G eMBMS multicast', '6 streams · one per group'], broad: ['ATSC 3.0 broadcast', '1 transmission · the whole swarm'] }[this.mode];
    if (this.modeTag.dataset.m !== this.mode) { this.modeTag.dataset.m = this.mode; this.modeTag.querySelector('.mt').textContent = mt[0]; this.modeTag.querySelector('.mi').textContent = mt[1]; this.modeTag._w = 0; }
    place(this.modeTag, SW(-1, 11.2, -1), this.show > 0.9);
    // edge AI: features float into the server, a decision comes out
    const edge = win(sp, 4.75, 5.3, 0.25), c = this.cab.getWorldPosition(V3());
    place(this.cabTag, c.clone().add(V3(0, 1.35, 0)), edge > 0.9);
    this.feat.forEach((f) => { const ph = reduced ? 0.5 : ((t * 0.18 + f.i / 7) % 1), a = (f.i / 7) * Math.PI * 1.2 - 0.6; const from = c.clone().add(V3(-1.6 + Math.cos(a) * 0.4, 0.4 + f.i * 0.22, 0.5 + Math.sin(a) * 0.4)); place(f.el, from.lerp(c.clone().add(V3(0, 0.7, 0.3)), ph * 0.8), edge > 0.9 && ph < 0.85); });
    const k = Math.floor(t / 2.2) % 4, dec = [['→ broadcast', 'confidence 0.91'], ['→ multicast', 'confidence 0.84'], ['→ unicast', 'priority: control'], ['→ rule fallback', 'confidence 0.41 · too low']][k];
    if (this.decTag.dataset.k !== String(k)) { this.decTag.dataset.k = k; this.decTag.querySelector('.dt').textContent = dec[0]; this.decTag.querySelector('.di').textContent = dec[1]; this.decTag._w = 0; }
    place(this.decTag, c.clone().add(V3(0.9, 1.15, 0.4)), edge > 0.9);
    place(this.barTags[0], this.barU.getWorldPosition(V3()).add(V3(0, this.barU.scale.y / 2 + 0.15, 0)), this.res > 0.9);
    place(this.barTags[1], this.barA.getWorldPosition(V3()).add(V3(0, this.barA.scale.y / 2 + 0.15, 0)), this.res > 0.9);
  },
  audio(sp) { return { hum: 0.5 + 0.3 * win(sp, 0.6, 1.4), pitch: 1.9, ticks: this.show * (this.mode === 'uni' ? 1 : this.mode === 'multi' ? 0.5 : 0.2) }; }
};
