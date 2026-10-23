// ===================== Solar Sailor: one spoken question, from the Echo through the checks and the budget to the model and back =====================
const SA_CHECKS = ['Signature', 'Certificate chain', 'Skill', 'Owner', '7 s deadline', 'Not a repeat'];
BAYS.sa = {
  objs: [], fog: [10, 70],
  build() {
    const root = new THREE.Group(); root.position.copy(STUDIO); this.root = root; this.objs.push(root);
    // a side table with the Echo on it, a lamp and the AC on the wall behind
    const room = new THREE.Group(); room.position.set(-1.7, 0, 0); root.add(room); this.room = room;
    room.add(at(cyl(0.32, 0.32, 0.03, M.wood, 40), 0, 0.5, 0), at(cyl(0.025, 0.025, 0.5, M.metal, 10), 0, 0.25, 0), at(cyl(0.18, 0.18, 0.02, M.metal, 30), 0, 0.01, 0));
    const ringMat = new THREE.MeshStandardMaterial({ color: SLOT.link, emissive: SLOT.packet, emissiveIntensity: 0.2 }); this.ringMat = ringMat;
    const echo = new THREE.Group(); echo.position.y = 0.515;
    echo.add(at(cyl(0.05, 0.05, 0.14, mat(0x2c2e33, { roughness: 0.95 }), 40), 0, 0.07, 0), at(cyl(0.049, 0.05, 0.008, M.blackPlastic, 40), 0, 0.144, 0));
    const lr = new THREE.Mesh(new THREE.TorusGeometry(0.046, 0.005, 8, 48), ringMat); lr.rotation.x = Math.PI / 2; lr.position.y = 0.149; echo.add(lr);
    echo.scale.setScalar(1.6); room.add(echo); this.echo = echo;
    const wall = at(box(1.6, 1.6, 0.06, mat(0xe9e6df, { roughness: 0.9 })), 0.1, 0.8, -0.7); room.add(wall);
    this.acMat = new THREE.MeshStandardMaterial({ color: 0x0b1530, emissive: 0x3a7bff, emissiveIntensity: 0 });
    const ac = new THREE.Group(); ac.position.set(0.3, 1.3, -0.62); ac.add(box(0.7, 0.2, 0.14, M.white, 0.04), at(box(0.08, 0.012, 0.004, this.acMat), 0.25, 0.04, 0.072)); room.add(ac); this.ac = ac;
    this.lampMat = new THREE.MeshStandardMaterial({ color: 0xf2e6c8, emissive: 0xffd58a, emissiveIntensity: 0, side: THREE.DoubleSide });
    const lamp = new THREE.Group(); lamp.position.set(-0.55, 0, -0.35); lamp.add(at(cyl(0.12, 0.12, 0.02, M.metal, 24), 0, 0.01, 0), at(cyl(0.012, 0.012, 1.1, M.metal, 8), 0, 0.56, 0), at(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.17, 0.2, 24, 1, true), this.lampMat), 0, 1.15, 0)); room.add(lamp); this.lamp = lamp;
    this.lampLight = new THREE.PointLight(0xffd58a, 0, 2.2); this.lampLight.position.set(-0.55, 1.1, -0.35); room.add(this.lampLight);
    shadowAll(room);
    // speech: rings that leave the Echo when you speak and when it answers
    this.waves = [0, 1, 2].map(() => { const r = new THREE.Mesh(new THREE.TorusGeometry(1, 0.012, 6, 48), new THREE.MeshBasicMaterial({ color: SLOT.packet, transparent: true, opacity: 0, depthWrite: false })); r.rotation.x = Math.PI / 2; root.add(r); return r; });
    // the stations, left to right: Alexa, the Worker with its six check lights, the budget ledger, the model
    const st = (x) => { const g = new THREE.Group(); g.position.set(x, 0, 0); g.add(makePlinth(0.32)); root.add(g); return g; };
    this.alexa = st(-0.55); [[0, 0.62, 0, 0.17], [-0.16, 0.56, 0.02, 0.12], [0.16, 0.57, -0.02, 0.13], [0.05, 0.72, 0.03, 0.11]].forEach(([x, y, z, r]) => this.alexa.add(at(sphere(r, physMat(0xdfe8f2, { roughness: 0.6 }), 20, 14), x, y, z)));
    this.worker = st(0.55); this.worker.add(at(box(0.46, 0.46, 0.46, physMat(0x2a2b30, { roughness: 0.35, clearcoat: 0.6 }), 0.05), 0, 0.33, 0));
    this.checkMats = SA_CHECKS.map(() => new THREE.MeshStandardMaterial({ color: 0x202226, emissive: 0x2cff6a, emissiveIntensity: 0 }));
    this.checkMats.forEach((m, k) => this.worker.add(at(sphere(0.026, m, 12, 8), -0.15 + (k % 3) * 0.15, 0.42 - Math.floor(k / 3) * 0.14, 0.235)));
    this.ledger = st(1.6);
    this.tank = at(new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.8, 32, 1, true), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.18, roughness: 0.05, side: THREE.DoubleSide, depthWrite: false })), 0, 0.5, 0); this.ledger.add(this.tank);
    this.fill = at(cyl(0.165, 0.165, 1, mat(SLOT.link, { roughness: 0.4 }), 32), 0, 0.1, 0); this.ledger.add(this.fill);
    this.resv = at(cyl(0.168, 0.168, 1, new THREE.MeshStandardMaterial({ color: SLOT.packet, emissive: SLOT.packet, emissiveIntensity: 0.5, transparent: true, opacity: 0.9 }), 32), 0, 0.1, 0); this.ledger.add(this.resv);
    this.model = st(2.65);
    this.core = at(sphere(0.12, new THREE.MeshStandardMaterial({ color: SLOT.link, emissive: SLOT.packet, emissiveIntensity: 0.6 }), 24, 16), 0, 0.55, 0); this.model.add(this.core);
    this.cage = at(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.26, 1)), new THREE.LineBasicMaterial({ color: SLOT.link, transparent: true, opacity: 0.7 })), 0, 0.55, 0); this.model.add(this.cage);
    // the tests: 202 squares on a board behind the Worker
    this.tests = new THREE.InstancedMesh(new THREE.BoxGeometry(0.05, 0.05, 0.01), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }), 202);
    const tm = new THREE.Matrix4(); for (let k = 0; k < 202; k++) { tm.makeTranslation(0.55 + ((k % 17) - 8) * 0.065, 0.55 + Math.floor(k / 17) * 0.065, -0.95); this.tests.setMatrixAt(k, tm); this.tests.setColorAt(k, new THREE.Color(0x3a3d44)); }
    root.add(this.tests); this.testBoard = at(box(1.2, 0.86, 0.02, mat(0x1d1f23, { roughness: 0.8 })), 0.55, 0.91, -0.965); root.add(this.testBoard);
    // the question's path out along the stations, and the answer's arc back to the Echo
    this.pathOut = () => new THREE.CatmullRomCurve3([this.echo.localToWorld(V3(0, 0.16, 0)), this.alexa.localToWorld(V3(0, 0.95, 0)), this.worker.localToWorld(V3(0, 0.75, 0)), this.ledger.localToWorld(V3(0, 1.05, 0)), this.model.localToWorld(V3(0, 0.95, 0))]);
    this.pathBack = () => new THREE.CatmullRomCurve3([this.model.localToWorld(V3(0, 0.95, 0)), this.model.localToWorld(V3(-1.4, 1.75, 0.4)), this.alexa.localToWorld(V3(0.3, 1.6, 0.3)), this.echo.localToWorld(V3(0, 0.3, 0))]);
    const lm = new THREE.LineDashedMaterial({ color: SLOT.link, dashSize: 0.05, gapSize: 0.035, transparent: true, opacity: 0 }); this.lm = lm;
    this.lineOut = new THREE.Line(new THREE.BufferGeometry(), lm); this.lineBack = new THREE.Line(new THREE.BufferGeometry(), lm); this.objs.push(this.lineOut, this.lineBack);
    this.pk = sphere(0.035, new THREE.MeshBasicMaterial({ color: SLOT.packet, transparent: true, opacity: 0 }), 12, 8); this.objs.push(this.pk);
    // labels
    const T2 = (h) => mkTag(h);
    this.stTags = [[T2('<b>You</b> <i>“Alexa, open Solar Sailor”</i>'), () => this.echo.localToWorld(V3(0, 0.3, 0))], [T2('<b>Alexa</b> <i>signed request</i>'), () => this.alexa.localToWorld(V3(0, 0.95, 0))], [T2('<b>Cloudflare Worker</b> <i>TypeScript</i>'), () => this.worker.localToWorld(V3(0, 0.7, 0))], [T2('<b>Budget ledger</b> <i>SQLite</i>'), () => this.ledger.localToWorld(V3(0, 1.0, 0))], [T2('<b>OpenAI model</b>'), () => this.model.localToWorld(V3(0, 0.95, 0))]];
    this.checkTags = SA_CHECKS.map((n, k) => ({ k, el: T2(`<b>${n}</b>`) }));
    this.budTag = T2('<b class="bt">$2.00 this month</b> <i class="bi">reserve, then settle</i>'); this.budTag.classList.add('hot');
    this.homeTags = [[T2('<b>Lights</b> <i>on at 7 pm</i>'), () => this.lamp.localToWorld(V3(0, this.lampY || 1.35, 0))], [T2('<b>AC</b> <i>off at 6 am</i>'), () => this.ac.localToWorld(V3(0, 0.2, 0))]];
    this.testTag = T2('<b class="tt">0 / 202</b> <i>tests passing</i>'); this.testTag.classList.add('hot');
    this.c = new THREE.Color();
    bayModel('sa').then((s) => s && this.useModel(s));
  },
  // the Blender side table, Echo and floor lamp. The Echo keeps its drawn size (× 1.6) so it reads from across the room;
  // its light ring and the lamp's shade take the materials the story lights up. The lamp keeps its drawn spot, out of the overview's way
  useModel(src) {
    const room = this.room, echo = this.echo, lamp = this.lamp, nodes = ['sa_table_base', 'sa_table_post', 'sa_table_top'].map((n) => bnode(src, n));
    const se = bnode(src, 'sa_echo'), sl = bnode(src, 'sa_lamp'), rel = new Map([...nodes, se, sl].map((o) => [o, relOf(src, o)]));
    hideDrawn(...room.children.filter((c) => c.isMesh), echo, lamp);
    const tf = modelFrame(room, 1); nodes.forEach((o) => graft(tf, o, rel.get(o)));
    echo.position.y = se.position.y; [...se.children].forEach((o) => { const m = o.matrix.clone(); graft(echo, o, m); });
    se.removeFromParent();
    echo.traverse((o) => { if (/^sa_halo/.test(o.name)) o.visible = false; if (o.name === 'sa_echo_ring') o.material = this.ringMat; });
    [...sl.children].forEach((o) => graft(lamp, o, o.matrix.clone()));
    const shade = bnode(lamp, 'fl_shade'); if (shade) shade.material = this.lampMat;
    this.lampLight.position.set(lamp.position.x, 1.42, lamp.position.z); this.lampY = 1.75;
    this.asm = makeAssemble([...nodes, ...echo.children.filter((c) => /^sa_/.test(c.name) && c.visible), ...lamp.children.filter((c) => c.name.startsWith('fl_'))], { lift: 0.5, spread: 0.5 });
  },
  key(i, tt) {
    switch (i) {
      case 0: return { pos: S(-1.2, 1.07, 1.05), look: S(-1.7, 0.78, 0) };
      case 1: return { pos: S(-0.95, 1.17, 1.45), look: S(-1.65, 0.8, 0) };
      case 2: return { pos: S(0.5, 2.0, 4.2), look: S(0.45, 0.65, 0) };
      case 3: return { pos: S(1.45, 1.1, 2.3), look: S(0.85, 0.5, 0) };
      case 4: return { pos: S(2.35, 1.25, 2.4), look: S(1.6, 0.6, 0) };
      case 5: return { pos: S(0.4, 1.9, 3.8), look: S(0.0, 0.8, 0) };
      case 6: return { pos: S(-1.0, 1.25, 2.0), look: S(-1.95, 0.8, -0.4) };
      case 7: return { pos: S(0.55, 1.05, 1.0), look: S(0.55, 0.9, -0.95) };
      default: return { pos: S(0.6, 2.2, 4.8), look: S(0.45, 0.6, 0) };
    }
  },
  update(dt, t, sp) {
    // the question travels out through the stations, then the answer arcs back
    const out = win(sp, 1.6, 4.4, 0.3), back = win(sp, 4.6, 5.4, 0.3); this.out = out; this.back = back;
    const cO = this.pathOut(), cB = this.pathBack();
    const show = Math.max(out, back);
    this.lm.opacity = 0.8 * show; this.lineOut.visible = out > 0.02; this.lineBack.visible = back > 0.02;
    if (out > 0.02) { this.lineOut.geometry.setFromPoints(cO.getPoints(80)); this.lineOut.computeLineDistances(); }
    if (back > 0.02) { this.lineBack.geometry.setFromPoints(cB.getPoints(60)); this.lineBack.computeLineDistances(); }
    // where the packet is: looping in the overview chapter, held at each station in the chapter about it
    const ch = Math.round(sp), loop = reduced ? 0.5 : (t * 0.22) % 1;
    const u = ch === 3 ? 0.5 : ch === 4 ? 0.75 : loop;
    this.pk.material.opacity = show; this.pk.position.copy(back > out ? cB.getPoint(reduced ? 0.5 : (t * 0.3) % 1) : cO.getPoint(u));
    // speech rings: when you ask (overview) and when it answers
    const talk = Math.max(win(sp, 0.7, 1.3, 0.3), back), ep = this.echo.localToWorld(V3(0, 0.15, 0)).sub(STUDIO);
    this.waves.forEach((r, k) => { const ph = ((t * 0.6 + k / 3) % 1); r.position.copy(ep).add(V3(0, ph * 0.08, 0)); r.scale.setScalar(0.09 + ph * 0.35); r.material.opacity = reduced ? 0 : talk * 0.6 * (1 - ph); });
    this.ringMat.emissiveIntensity = 0.2 + (reduced ? 0.6 : 0.5 + 0.4 * Math.sin(t * 4)) * talk;
    // the checks light one by one through the chapter
    const ck = win(sp, 2.7, 3.3, 0.3), cu = clamp01((sp - 2.6) / 0.6); this.ck = ck;
    this.checkMats.forEach((m, k) => { m.emissiveIntensity = (ck > 0.1 ? (cu * 6 > k ? 0.9 : 0.05) : 0.25); });
    // the ledger: a month's $2, a slice held in reserve, then settled at the real cost
    const bu = win(sp, 3.7, 4.3, 0.3), bp = clamp01((sp - 3.6) / 0.7); this.bu = bu; this.bp = bp;
    const left = 0.62, resH = 0.12 * (1 - ease(clamp01((bp - 0.55) / 0.3))) + 0.03 * ease(clamp01((bp - 0.55) / 0.3));
    const fillH = 0.78 * left, r = bu > 0.02 ? Math.max(0.001, resH * ease(clamp01(bp / 0.3))) : 0;
    this.resv.visible = r > 0.001; this.resv.scale.y = Math.max(0.001, r); this.resv.position.y = 0.1 + fillH - r / 2;
    this.fill.scale.y = fillH - r; this.fill.position.y = 0.1 + (fillH - r) / 2;
    // the model thinks
    if (!reduced) { this.cage.rotation.y += dt * (0.3 + 1.2 * win(sp, 3.6, 4.6)); this.cage.rotation.x += dt * 0.15; }
    // smart home: the lamp and the AC come on
    const hm = win(sp, 5.7, 6.3, 0.3); this.hm = hm;
    this.lampMat.emissiveIntensity = 0.9 * hm; this.lampLight.intensity = 1.2 * hm; this.acMat.emissiveIntensity = 0.9 * hm;
    // tests: the board fills green
    const te = win(sp, 6.7, 7.3, 0.3), tp = reduced ? 1 : clamp01((sp - 6.55) / 0.5); this.te = te; this.passed = Math.round(202 * tp * (te > 0.5 ? 1 : 0));
    if (this.shownPassed !== this.passed) { this.shownPassed = this.passed; for (let k = 0; k < 202; k++) this.tests.setColorAt(k, this.c.set(k < this.passed ? 0x2f9a55 : 0x3a3d44)); this.tests.instanceColor.needsUpdate = true; }
  },
  overlay(t, sp) {
    const wide = win(sp, 1.7, 2.3, 0.25) > 0.85;
    this.stTags.forEach(([el, f], k) => place(el, f(), wide || (k === 0 && win(sp, 0.75, 1.3, 0.2) > 0.85)));
    this.checkTags.forEach((c) => { const k = c.k, p = this.worker.localToWorld(V3(0.5, 0.86 - k * 0.12, 0.1)); place(c.el, p, this.ck > 0.85); c.el.classList.toggle('hot', clamp01((sp - 2.6) / 0.6) * 6 > k); });
    const spent = this.bp < 0.55 ? 'reserving the worst case' : 'settled at the real cost';
    if (this.budTag.dataset.s !== spent) { this.budTag.dataset.s = spent; this.budTag.querySelector('.bi').textContent = spent; this.budTag._w = 0; }
    place(this.budTag, this.ledger.localToWorld(V3(0, 1.05, 0)), this.bu > 0.85);
    this.homeTags.forEach(([el, f]) => place(el, f(), this.hm > 0.85));
    const s = `${this.passed} / 202`, c = this.testTag.querySelector('.tt'); if (c.textContent !== s) { c.textContent = s; this.testTag._w = 0; }
    place(this.testTag, V3(0.55, 1.45, -0.95).add(STUDIO), this.te > 0.85);
  },
  audio(sp) { return { hum: 0.15 + 0.3 * this.out, pitch: 1.4, ticks: this.ck }; }
};
