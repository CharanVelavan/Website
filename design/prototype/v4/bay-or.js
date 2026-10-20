
// ===================== 5G O-RAN testbed: a desk with the radio, the stack above it, where to split it, the RIC =====================
const OR_DESK = 0.77;
// protocol layers bottom to top, the unit each one lives in, and the splits between them
const OR_LAYERS = [['RF', 'ru'], ['Low PHY', 'ru'], ['High PHY', 'du'], ['MAC', 'du'], ['RLC', 'du'], ['PDCP', 'cu'], ['SDAP · RRC', 'cu']];
const OR_UNIT = { ru: [0xb8bcc4, 'RU · radio unit', 'USRP B210'], du: [0xd8c3a5, 'DU · distributed unit', 'High PHY · MAC · RLC'], cu: [0xc98a5e, 'CU · central unit', 'PDCP · SDAP · RRC'] };
const OR_SPLITS = [['Split 8', 'RF | PHY — the RU only does radio', 1], ['Split 7.2x', 'Low | High PHY — the O-RAN choice', 2], ['Split 6', 'PHY | MAC', 3], ['Split 2', 'RLC | PDCP — the CU / DU split', 5]];
BAYS.or = {
  objs: [],
  build() {
    const root = new THREE.Group(); root.position.copy(STUDIO); this.root = root; this.objs.push(root);
    // the desk, the RAN + core PC, the radio, a monitor of logs and a phone as the UE
    root.add(at(box(1.7, 0.04, 0.85, M.wood, 0.006), 0, OR_DESK - 0.02, 0));
    [[-0.8, -0.38], [0.8, -0.38], [-0.8, 0.38], [0.8, 0.38]].forEach(([x, z]) => root.add(at(box(0.04, OR_DESK - 0.04, 0.04, M.metal), x, (OR_DESK - 0.04) / 2, z)));
    const plate = textTex(256, 1024, (g, w, h) => { g.fillStyle = '#f2f1ee'; g.fillRect(0, 0, w, h); g.save(); g.translate(w * 0.55, h * 0.62); g.rotate(-Math.PI / 2); g.fillStyle = '#5b2a86'; g.font = '700 92px Geist, Arial, sans-serif'; g.fillText('TechPhosis', 0, 0); g.restore(); });
    const pc = new THREE.Group(); pc.position.set(-0.32, OR_DESK, -0.12); pc.add(at(box(0.2, 0.44, 0.42, M.blackPlastic, 0.008), 0, 0.22, 0)); pc.add(at(plane(0.12, 0.4, new THREE.MeshStandardMaterial({ map: plate, roughness: 0.6 })), 0.04, 0.22, 0.2105)); root.add(pc); this.pc = pc;
    const usrp = new THREE.Group(); usrp.position.set(0.12, OR_DESK, 0.08);
    usrp.add(at(box(0.165, 0.042, 0.1, physMat(0xe8e9ec, { roughness: 0.35, clearcoat: 0.6 }), 0.006), 0, 0.021, 0));
    usrp.add(at(box(0.15, 0.003, 0.088, M.pcbGreen), 0, 0.044, 0), at(box(0.03, 0.004, 0.03, M.chip), -0.02, 0.047, 0.01), at(box(0.04, 0.012, 0.012, M.silver), 0.055, 0.05, -0.03));
    const ants = new THREE.Group(); [-0.045, 0.045].forEach((x, k) => { const a = new THREE.Group(); a.position.set(x, 0.042, -0.045); a.add(at(cyl(0.006, 0.006, 0.012, M.silver, 10), 0, 0.006, 0), at(cyl(0.006, 0.0075, 0.17, M.blackPlastic, 12), 0, 0.097, 0)); a.rotation.z = k ? -0.12 : 0.12; ants.add(a); }); usrp.add(ants);
    usrp.add(at(sphere(0.004, ledGreen), -0.07, 0.03, 0.051));
    root.add(usrp); this.usrp = usrp; this.ants = ants;
    const logs = textTex(512, 300, (g, w, h) => { g.fillStyle = '#1b1426'; g.fillRect(0, 0, w, h); g.font = '13px "Geist Mono", monospace'; const L = ['$ sudo gnb -c gnb.conf', '==== gNodeB started ===', 'Cell pci=1, bw=10 MHz, dl_arfcn=368500', 'RRC Setup  rnti=0x4601', 'Initial UE message → AMF', 'PDU session established  (imsi 001010000000001)', '$ sudo open5gs-amfd', '[amf] NG setup with gNB-ID 0x19b', '[upf] GTP-U tunnel up', 'iperf: DL 32.1 Mbit/s']; L.forEach((s, i) => { g.fillStyle = s.startsWith('$') ? '#e0b396' : s.includes('established') || s.includes('up') ? '#8ccb9b' : '#e8e3d9'; g.fillText(s, 14, 26 + i * 26); }); });
    const lm = new THREE.MeshStandardMaterial({ map: logs, emissive: 0xffffff, emissiveMap: logs, emissiveIntensity: 0.9 }); glowMats.push(lm);
    const mon = new THREE.Group(); mon.position.set(-0.05, OR_DESK, -0.3); mon.rotation.y = 0.08; mon.add(at(box(0.56, 0.34, 0.025, M.blackPlastic, 0.008), 0, 0.27, 0), at(plane(0.53, 0.31, lm), 0, 0.27, 0.0131), at(box(0.04, 0.1, 0.02, M.blackPlastic), 0, 0.05, -0.01), at(box(0.2, 0.012, 0.14, M.blackPlastic, 0.004), 0, 0.006, 0)); root.add(mon); this.mon = mon;
    const scr = textTex(128, 256, (g, w, h) => { g.fillStyle = '#10131a'; g.fillRect(0, 0, w, h); g.fillStyle = '#e8e3d9'; g.font = '700 30px Geist, Arial'; g.fillText('5G', 12, 44); g.fillStyle = '#8ccb9b'; [10, 16, 22, 28].forEach((bh, i) => g.fillRect(66 + i * 12, 46 - bh, 8, bh)); g.font = '14px Geist Mono, monospace'; g.fillStyle = '#c9c4ba'; g.fillText('PDU session', 12, 90); g.fillText('up', 12, 110); });
    const phone = new THREE.Group(); phone.position.set(0.5, OR_DESK, 0.18); phone.rotation.y = -0.4; phone.add(at(box(0.075, 0.008, 0.155, M.blackPlastic, 0.006), 0, 0.004, 0)); const ps = plane(0.068, 0.145, new THREE.MeshBasicMaterial({ map: scr, toneMapped: false })); ps.rotation.x = -Math.PI / 2; ps.position.y = 0.0085; phone.add(ps); root.add(phone); this.phone = phone;
    shadowAll(root);
    // radio waves from the antennas to the phone
    this.waves = [0, 1, 2].map(() => { const r = new THREE.Mesh(new THREE.TorusGeometry(1, 0.004, 6, 64, Math.PI * 0.5), new THREE.MeshBasicMaterial({ color: 0xd9733a, transparent: true, opacity: 0 })); root.add(r); return r; });
    // the stack: seven protocol layers, grouped into RU, DU and CU, with the 5G core on top
    const stack = new THREE.Group(); stack.position.set(0, 1.25, -0.05); root.add(stack); this.stack = stack;
    this.slices = OR_LAYERS.map(([n, u]) => { const s = new THREE.Group(); s.add(box(1.1, 0.07, 0.62, physMat(OR_UNIT[u][0], { roughness: 0.45, clearcoat: 0.3 }), 0.02)); stack.add(s); return { s, n, u, el: mkTag(`<b>${n}</b>`) }; });
    const core = new THREE.Group(); core.add(box(1.2, 0.16, 0.7, physMat(0x2b2d33, { roughness: 0.4, clearcoat: 0.3 }), 0.03)); [-0.4, -0.2, 0, 0.2, 0.4].forEach((x) => core.add(at(box(0.15, 0.02, 0.005, ledGreen), x, 0.03, 0.352))); stack.add(core); this.core = core;
    this.unitTags = Object.fromEntries(Object.entries(OR_UNIT).map(([k, [, n, s]]) => [k, mkTag(`<b>${n}</b> <i>${s}</i>`)]));
    this.coreTag = mkTag('<b>5G core · Open5GS</b> <i>AMF · SMF · UPF · UDM · UDR</i>');
    this.ifTags = [mkTag('<b>Fronthaul</b> <i>RU ↔ DU</i>'), mkTag('<b>F1</b> <i>DU ↔ CU</i>'), mkTag('<b>NG</b> <i>CU ↔ core</i>')];
    const cut = new THREE.Group(); cut.add(new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.95), new THREE.MeshBasicMaterial({ color: 0xd9733a, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false })).rotateX(-Math.PI / 2));
    cut.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.5, 0.95).rotateX(-Math.PI / 2)), new THREE.LineBasicMaterial({ color: 0xd9733a })));
    stack.add(cut); this.cut = cut; this.splitTag = mkTag('<b class="st">Split 7.2x</b> <i class="si">Low | High PHY</i>'); this.splitTag.classList.add('hot');
    // packets climbing the stack, and out to the phone
    const flow = makeFlow(); this.flow = flow;
    const antW = () => this.ants.children[0].localToWorld(V3(0, 0.18, 0)), sl = (k) => () => this.slices[k].s.getWorldPosition(V3()).add(V3(0.6, 0, 0.2)), coreW = () => this.core.getWorldPosition(V3()).add(V3(0.62, 0, 0.2));
    flow.add(root, antW, sl(0), 0.15); flow.add(root, sl(1), sl(2), 0.05); flow.add(root, sl(4), sl(5), 0.05); flow.add(root, sl(6), coreW, 0.05); flow.add(root, antW, () => this.phone.localToWorld(V3(0, 0.02, 0)), 0.2);
    // O-RAN: SMO with the Non-RT RIC, the Near-RT RIC with xApps, steering the stack over O1 and E2
    const oran = new THREE.Group(); oran.position.set(1.55, 1.55, -0.2); root.add(oran); this.oran = oran;
    const mkBox = (w, h, d, c) => box(w, h, d, physMat(c, { roughness: 0.45, clearcoat: 0.3 }), 0.03);
    this.smo = at(mkBox(0.9, 0.34, 0.5, 0x3a3d45), 0, 1.0, 0); this.nonrt = at(mkBox(0.5, 0.14, 0.3, 0xd8c3a5), 0, 1.0, 0.13); this.nearrt = at(mkBox(0.8, 0.26, 0.45, 0xf2efe9), 0, 0.35, 0);
    oran.add(this.smo, this.nonrt, this.nearrt);
    this.xapps = [0, 1, 2, 3].map((k) => { const x = at(box(0.09, 0.09, 0.09, mat(0x9a4e25), 0.015), 0, 0.35, 0); oran.add(x); return x; });
    shadowAll(oran);
    const flow2 = makeFlow(0x5d6fb8); this.flow2 = flow2;
    const nearW = () => this.nearrt.getWorldPosition(V3()).add(V3(-0.42, -0.05, 0)), smoW = () => this.smo.getWorldPosition(V3()).add(V3(-0.46, 0, 0));
    flow2.add(root, nearW, sl(4), 0.2); flow2.add(root, smoW, sl(6), 0.3); flow2.add(root, () => this.nonrt.getWorldPosition(V3()), () => this.nearrt.getWorldPosition(V3()).add(V3(0, 0.13, 0)), 0.05, 2, 0.015);
    this.oranTags = [mkTag('<b>SMO</b> <i>orchestration · O1</i>'), mkTag('<b>Non-RT RIC</b> <i>rApps · policies</i>'), mkTag('<b>Near-RT RIC</b> <i>xApps · 10 ms – 1 s</i>'), mkTag('<b>E2</b> <i>control</i>'), mkTag('<b>O1</b> <i>management</i>')];
    this.partTags = [['usrp', '<b>USRP B210</b> <i>70 MHz – 6 GHz · 2×2 MIMO</i>', () => this.usrp.localToWorld(V3(0, 0.06, 0.05))], ['ant', '<b>Antennas</b> <i>Tx / Rx</i>', () => this.ants.children[1].localToWorld(V3(0, 0.19, 0))], ['pc', '<b>RAN + core PC</b> <i>srsRAN · Open5GS</i>', () => this.pc.localToWorld(V3(0, 0.47, 0))], ['mon', '<b>Traces</b> <i>logs and call flows</i>', () => this.mon.localToWorld(V3(-0.2, 0.47, 0))]].map(([k, h, f]) => ({ k, f, el: mkTag(h) }));
    this.ueTag = mkTag('<b>UE · phone</b> <i>PDU session up</i>');
  },
  key(i, tt) {
    switch (i) {
      case 0: return { pos: S(0.62, OR_DESK + 0.3, 0.72), look: S(-0.05, OR_DESK + 0.12, -0.05) };
      case 1: return { pos: S(1.45, 1.75, 2.2), look: S(0, 1.05, 0) };
      case 2: return { pos: S(0.62, OR_DESK + 0.3, 0.7), look: S(0.1, OR_DESK + 0.07, 0.02) };
      case 3: return { pos: S(2.0, 2.15, 3.2), look: S(0, 1.65, 0) };
      case 4: return { pos: S(2.0, 2.2, 3.1), look: S(0, 1.8, 0) };
      case 5: return { pos: S(-0.3, 2.35, 4.1), look: S(0.7, 1.8, -0.1) };
      case 6: return { pos: S(-1.3, 1.45, 1.7), look: S(0, 0.95, 0) };
      default: return { pos: S(1.7, 1.15, 1.9), look: S(0, 0.95, 0) };
    }
  },
  near(sp) { return sp > 1.5 && sp < 2.5 ? 0.01 : 0.03; },
  update(dt, t, sp) {
    // the stack appears above the desk for the stack, split and O-RAN chapters
    const st = win(sp, 2.75, 5.3, 0.35); this.st = st; this.stack.visible = st > 0.01; this.stack.scale.setScalar(0.4 + 0.6 * ease(st));
    // stack: units grouped with gaps; splits: layers spread evenly with a cut plane moving between them
    const sp4 = win(sp, 3.7, 4.3, 0.3); this.sp4 = sp4;
    let y = 0; this.slices.forEach((s, k) => { const gap = k && this.slices[k - 1].u !== s.u ? 0.16 : 0.012; y += k ? gap * (1 - sp4) + 0.1 * sp4 + 0.07 : 0; s.s.position.y = y; s.s.scale.setScalar(hotNode === s.u ? 1.06 : 1); });
    this.core.position.y = y + 0.26; this.core.scale.setScalar(hotNode === 'core' ? 1.06 : 1);
    const si = Math.min(3, Math.floor(clamp01((sp - 3.55) / 0.9) * 4)); this.si = si; const L = OR_SPLITS[si][2];
    const cy = (this.slices[L - 1].s.position.y + this.slices[L].s.position.y) / 2; this.cut.position.y += (cy - this.cut.position.y) * Math.min(1, dt * 6); this.cut.visible = sp4 > 0.05; this.cut.scale.setScalar(0.6 + 0.4 * sp4);
    this.flow.update(t, Math.max(win(sp, 0.8, 1.4, 0.3) * 0.8, st), 0.35);
    // O-RAN boxes rise in; xApps orbit the Near-RT RIC
    const ro = win(sp, 4.7, 5.3, 0.3); this.ro = ro; this.oran.visible = ro > 0.01; this.oran.scale.setScalar(0.5 + 0.5 * ease(ro));
    this.xapps.forEach((x, k) => { const a = t * 0.8 + k * Math.PI / 2; x.position.set(Math.cos(a) * 0.55, 0.35 + Math.sin(a * 2) * 0.04, Math.sin(a) * 0.32); x.rotation.y = a; });
    this.flow2.update(t, ro, 0.3);
    // waves leave the antennas in the overview and radio chapters
    const wv = Math.max(win(sp, 0.7, 2.3, 0.3), 0) * (reduced ? 0 : 1); this.wv = wv;
    this.waves.forEach((w, k) => { const ph = (t * 0.5 + k / 3) % 1; w.position.copy(this.usrp.position).add(V3(0, 0.2, 0)); w.rotation.set(0, -0.6, Math.PI * 0.25); w.scale.setScalar(0.05 + ph * 0.5); w.material.opacity = wv * 0.6 * (1 - ph); });
    this.usrp.scale.setScalar(hotPart === 'usrp' ? 1.15 : 1); this.ants.scale.setScalar(hotPart === 'ant' ? 1.15 : 1); this.pc.scale.setScalar(hotPart === 'pc' ? 1.06 : 1); this.mon.scale.setScalar(hotPart === 'mon' ? 1.06 : 1);
  },
  overlay(t, sp) {
    const radio = win(sp, 1.7, 2.3, 0.25) > 0.85;
    this.partTags.forEach((p) => { place(p.el, p.f(), radio || (p.k === 'usrp' && win(sp, 0.8, 1.3) > 0.9)); p.el.classList.toggle('hot', hotPart === p.k); });
    place(this.ueTag, this.phone.localToWorld(V3(0, 0.03, 0)), radio || win(sp, 0.8, 1.3) > 0.9);
    const stk = this.st > 0.85 && this.sp4 < 0.2, spl = this.sp4 > 0.85;
    Object.entries(this.unitTags).forEach(([u, el]) => { const ks = this.slices.filter((s) => s.u === u), mid = ks[Math.floor(ks.length / 2)].s; place(el, mid.localToWorld(V3(-0.56, 0.05, 0.3)), stk); el.classList.toggle('hot', hotNode === u); });
    place(this.coreTag, this.core.localToWorld(V3(0, 0.1, 0.35)), this.st > 0.85 && this.ro < 0.5); this.coreTag.classList.toggle('hot', hotNode === 'core');
    const mids = [[1, 2], [4, 5], [6, -1]];
    this.ifTags.forEach((el, k) => { const [a, b] = mids[k], ya = this.slices[a].s.position.y, yb = b < 0 ? this.core.position.y : this.slices[b].s.position.y; place(el, this.stack.localToWorld(V3(0.62, (ya + yb) / 2 + 0.02, 0.32)), stk); });
    this.slices.forEach((s) => place(s.el, s.s.localToWorld(V3(-0.58, 0.04, 0.32)), spl));
    const sx = OR_SPLITS[this.si];
    if (this.splitTag.dataset.k !== String(this.si)) { this.splitTag.dataset.k = this.si; this.splitTag.querySelector('.st').textContent = sx[0]; this.splitTag.querySelector('.si').textContent = sx[1]; this.splitTag._w = 0; }
    place(this.splitTag, this.cut.localToWorld(V3(0.7, 0.02, 0.45)), spl);
    const ro = this.ro > 0.85;
    place(this.oranTags[0], this.smo.localToWorld(V3(0, 0.2, 0.2)), ro); place(this.oranTags[1], this.nonrt.localToWorld(V3(0, 0.1, 0.15)), ro && !narrow()); place(this.oranTags[2], this.nearrt.localToWorld(V3(0, 0.16, 0.2)), ro);
    place(this.oranTags[3], this.stack.localToWorld(V3(0.75, this.slices[4].s.position.y + 0.2, 0.2)), ro); place(this.oranTags[4], this.stack.localToWorld(V3(0.75, this.slices[6].s.position.y + 0.3, 0.2)), ro);
    ['smo', 'nonrt', 'nearrt'].forEach((k, i) => this.oranTags[i].classList.toggle('hot', hotNode === k));
  },
  audio(sp) { return { hum: 0.1, pitch: 0.7, ticks: Math.max(this.st, this.wv * 0.5) }; }
};
