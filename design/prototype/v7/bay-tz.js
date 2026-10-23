
// ===================== THz filter: the chip scaled up, its layers, its fractal iterations, its currents, its response =====================
// layout traced from the paper's surface-current plots (fractions of the substrate width, top-left origin)
const TZ_W = 1.6, TZ_Y = 1.0;
function tzMetalTex(iter) {
  return textTex(1024, 1024, (g, w) => {
    const F = (v) => v * w;
    g.fillStyle = '#ffffff';
    g.fillRect(F(0.33), F(0.333), F(0.338), F(0.34)); // patch
    g.fillRect(F(0.269), F(0.333), F(0.058), F(0.34)); g.fillRect(0, F(0.455), F(0.27), F(0.093)); // left coupling strip and port 1
    g.fillRect(F(0.33), F(0.677), F(0.338), F(0.054)); g.fillRect(F(0.455), F(0.73), F(0.093), F(0.27)); // bottom strip and port 2
    g.fillRect(F(0.666), F(0.247), F(0.09), F(0.088)); // the 45° perturbation corner
    g.globalCompositeOperation = 'destination-out'; g.strokeStyle = '#000'; g.lineCap = 'square';
    const sw = (cx, cy, s, lw) => { const h = s / 2; g.lineWidth = lw; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx, cy - h); g.lineTo(cx + h, cy - h); g.moveTo(cx, cy); g.lineTo(cx + h, cy); g.lineTo(cx + h, cy + h); g.moveTo(cx, cy); g.lineTo(cx, cy + h); g.lineTo(cx - h, cy + h); g.moveTo(cx, cy); g.lineTo(cx - h, cy); g.lineTo(cx - h, cy - h); g.stroke(); };
    const cx = F(0.499), cy = F(0.503), P = F(0.338);
    if (iter >= 1) sw(cx, cy, P * 0.8, P * 0.03);
    const q = P * 0.22;
    if (iter >= 2) [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => sw(cx + a * q, cy + b * q, P * 0.34, P * 0.018));
    if (iter >= 3) [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([c, d]) => sw(cx + a * q + c * q * 0.42, cy + b * q + d * q * 0.42, P * 0.11, P * 0.01)));
  });
}
// S-parameters: smooth curves that follow the published plot (centre 3.88 THz, zeros at 2.86 and 5.14 THz)
const tzS21 = (f) => -1.63 - 16 * clamp01((Math.abs(f - 3.88) - 0.42) / 0.9) - 31.4 * Math.exp(-(((f - 2.86) / 0.07) ** 2)) - 21.5 * Math.exp(-(((f - 5.14) / 0.08) ** 2)) + 3 * clamp01((Math.abs(f - 4.0) - 1.15) / 0.3);
const tzS11 = (f) => -0.6 - 37.7 * Math.exp(-(((f - 3.88) / 0.07) ** 2)) - 9 * Math.exp(-(((f - 3.6) / 0.14) ** 2)) - 6 * Math.exp(-(((f - 4.15) / 0.12) ** 2));
BAYS.tz = {
  objs: [],
  build() {
    const root = new THREE.Group(); root.position.copy(STUDIO); this.root = root; this.objs.push(root);
    root.add(makePlinth(0.8));
    root.add(at(cyl(0.05, 0.07, TZ_Y - 0.15, M.metal, 16), 0, (TZ_Y - 0.15) / 2 + 0.08, 0));
    const chip = new THREE.Group(); chip.position.y = TZ_Y; root.add(chip); this.chip = chip;
    const sub = box(TZ_W, 0.12, TZ_W, physMat(0xe6d2c0, { roughness: 0.6, clearcoat: 0.2 }), 0.01); chip.add(sub);
    const back = box(TZ_W, 0.014, TZ_W, new THREE.MeshStandardMaterial({ color: 0xc89b5a, metalness: 1, roughness: 0.32 })); back.position.y = -0.067; chip.add(back);
    this.tex = [0, 1, 2, 3].map(tzMetalTex);
    const front = new THREE.Mesh(new THREE.PlaneGeometry(TZ_W, TZ_W), new THREE.MeshStandardMaterial({ color: 0xd8ad62, metalness: 1, roughness: 0.28, map: this.tex[3], alphaTest: 0.5, side: THREE.DoubleSide }));
    front.rotation.x = -Math.PI / 2; front.position.y = 0.062; chip.add(front);
    // the metal has thickness: a slightly lower dark copy reads as an edge
    const edge = front.clone(); edge.material = new THREE.MeshStandardMaterial({ color: 0x7a5a2c, metalness: 1, roughness: 0.5, map: this.tex[3], alphaTest: 0.5 }); edge.position.y = 0.058; chip.add(edge);
    this.layers = { front, edge, sub, back };
    // the surface-current plots from CST, laid on top of the patch
    const loader = new THREE.TextureLoader();
    this.cur = ['tz-286', 'tz-current', 'tz-514'].map((f) => { const t = loader.load(`img/${f}.webp`); t.colorSpace = THREE.SRGBColorSpace; const m = new THREE.Mesh(new THREE.PlaneGeometry(TZ_W, TZ_W), new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity: 0, toneMapped: false, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.position.y = 0.068; chip.add(m); return m; });
    shadowAll(chip);
    // the response, as a 3D plot standing behind the chip
    const plot = new THREE.Group(); plot.position.set(0, 0.45, -1.35); root.add(plot); this.plot = plot;
    const PW = 3.0, PH = 2.0, fx = (f) => ((f - 2.4) / 3.0 - 0.5) * PW, dy = (d) => (d / 40 + 1) * PH;
    this.fx = fx; this.dy = dy;
    plot.add(at(box(PW + 0.2, PH + 0.2, 0.02, physMat(0xf6f3ee, { roughness: 0.7, transparent: true, opacity: 0.92 })), 0, PH / 2, -0.03));
    const gl = []; for (let f = 2.5; f <= 5.41; f += 0.5) gl.push(fx(f), 0, 0, fx(f), PH, 0); for (let d = 0; d >= -40; d -= 10) gl.push(-PW / 2, dy(d), 0, PW / 2, dy(d), 0);
    plot.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(gl, 3)), new THREE.LineBasicMaterial({ color: 0xb8b2a6 })));
    const curve = (fn) => new THREE.CatmullRomCurve3(Array.from({ length: 241 }, (_, k) => { const f = 2.4 + k * 3.0 / 240; return V3(fx(f), dy(Math.max(-40, fn(f))), 0.02); }));
    this.c11 = curve(tzS11); this.c21 = curve(tzS21);
    this.t11 = new THREE.Mesh(new THREE.TubeGeometry(this.c11, 480, 0.014, 8), mat(SLOT.link, { roughness: 0.4 })); this.t21 = new THREE.Mesh(new THREE.TubeGeometry(this.c21, 480, 0.014, 8), mat(0x2f7f78, { roughness: 0.4 }));
    plot.add(this.t11, this.t21);
    this.marker = new THREE.Group(); this.marker.add(at(box(0.01, PH, 0.01, mat(0x15161a)), 0, PH / 2, 0.03), at(sphere(0.045, mat(0x15161a)), 0, 0, 0.05)); plot.add(this.marker);
    this.full = this.t11.geometry.index.count;
    // labels
    this.layerTags = { front: mkTag('<b>Front metal</b> <i>patch · Swastik slots · feeds</i>'), sub: mkTag('<b>Substrate</b> <i>RT/Duroid 6010 · εr 10.7</i>'), back: mkTag('<b>Back metal</b> <i>ground plane</i>'), pert: mkTag('<b>Perturbation</b> <i>45° → dual mode</i>') };
    this.portTags = [mkTag('<b>Port 1</b> <i>50 Ω</i>'), mkTag('<b>Port 2</b> <i>50 Ω</i>')];
    this.iterTag = mkTag('<b class="it">Iteration 3</b> <i class="ii">25.93% smaller</i>'); this.iterTag.classList.add('hot');
    this.freqTag = mkTag('<b class="ft">3.88 THz</b> <i class="fi">centre · passband</i>'); this.freqTag.classList.add('hot');
    this.axTags = [mkTag('<b>S11</b> <i>return loss</i>'), mkTag('<b>S21</b> <i>transmission</i>'), mkTag('<b>−38.32 dB</b> <i>at 3.88 THz</i>'), mkTag('<b>2.86 THz</b> <i>−33.10 dB zero</i>'), mkTag('<b>5.14 THz</b> <i>−24.63 dB zero</i>'), mkTag('<i>shape traced from the paper’s plot</i>')];
    this.sizeTag = mkTag('<b>8 × 8 µm²</b> <i>shown ~100,000× larger</i>');
    // the chip stays traced from the paper's plots; its layers stack themselves as the photo dissolves
    this.asm = makeAssemble([back, sub, edge, front], { lift: 0.9, spread: 0.15 });
  },
  key(i, tt) {
    switch (i) {
      case 0: return { pos: S(0, TZ_Y + 2.55, 0.02), look: S(0, TZ_Y, 0) };
      case 1: return { pos: S(1.7, TZ_Y + 1.5, 2.3), look: S(0, TZ_Y - 0.05, 0) };
      case 2: return { pos: S(2.3, TZ_Y + 0.55, 1.9), look: S(0, TZ_Y - 0.02, 0) };
      case 3: return { pos: S(0.25, TZ_Y + 2.2, 1.05), look: S(0, TZ_Y, -0.02) };
      case 4: return { pos: S(0.15, TZ_Y + 2.45, 1.25), look: S(0, TZ_Y + 0.15, -0.35) };
      case 5: return { pos: S(0.4, TZ_Y + 1.3, 4.7), look: S(0, TZ_Y + 0.5, -1.3) };
      case 6: return { pos: S(-1.7, TZ_Y + 1.0, 2.2), look: S(0, TZ_Y, 0) };
      default: return { pos: S(2.1, TZ_Y + 0.4, 2.9), look: S(0, TZ_Y + 0.25, -0.5) };
    }
  },
  update(dt, t, sp, ctx) {
    // turntable in the overview only; the top-down chapters keep it square to the camera
    const spinOn = win(sp, 0.7, 1.35, 0.3);
    this.turnA = (this.turnA || 0) + dt * 0.35 * spinOn * (reduced ? 0 : 1); if (spinOn < 0.01) this.turnA *= 1 - Math.min(1, dt * 3);
    this.chip.rotation.y = this.turnA;
    // layers part
    const ex = win(sp, 1.8, 2.3, 0.3); this.ex = ex;
    const L = this.layers; L.front.position.y = 0.062 + ex * 0.42; L.edge.position.y = 0.058 + ex * 0.42; L.back.position.y = -0.067 - ex * 0.38;
    ['front', 'sub', 'back'].forEach((k) => { const o = L[k]; o.scale.setScalar(hotPart === k ? 1.03 : 1); }); L.edge.scale.copy(L.front.scale);
    // fractal iterations, one per quarter of the chapter
    const fr = sp >= 2.55 && sp < 3.5 ? Math.min(3, Math.floor((sp - 2.55) / 0.22)) : 3; this.fr = fr; this.frOn = win(sp, 2.8, 3.25, 0.25);
    if (this.shownIter !== fr) { this.shownIter = fr; L.front.material.map = L.edge.material.map = this.tex[fr]; L.front.material.needsUpdate = L.edge.material.needsUpdate = true; }
    // currents: the photo's own plot at the start, then 2.86 → 3.88 → 5.14 through the chapter
    let w = [0, 0, 0];
    if (sp < 0.9) w[1] = 1 - smoothstep(ctx.m, 0.5, 1) * (sp > 0.5 ? smoothstep(sp, 0.5, 0.9) : 0);
    const cu = win(sp, 3.6, 4.4, 0.25);
    if (cu > 0) { const k = clamp01((sp - 3.6) / 0.8) * 2; const a = Math.min(2, Math.floor(k + 0.5)); w = w.map((v, j) => Math.max(v, cu * clamp01(1 - Math.abs(k - j) * 1.6))); this.fq = [2.86, 3.88, 5.14][a]; this.fqF = 2.86 + (5.14 - 2.86) * clamp01(k / 2); }
    this.cur.forEach((m, j) => { m.material.opacity = w[j]; m.visible = w[j] > 0.01; });
    this.cuOn = cu;
    // the plot: draws itself in, with a marker at the current frequency
    const pl = win(sp, 4.62, 5.4, 0.3); this.plOn = pl;
    this.plot.visible = pl > 0.01; this.plot.scale.setScalar(0.85 + 0.15 * ease(pl));
    const draw = Math.floor(this.full * clamp01(ease(pl) * 1.05)); this.t11.geometry.setDrawRange(0, draw); this.t21.geometry.setDrawRange(0, draw);
    const mf = 3.88 + Math.sin(t * 0.5) * 0.04; this.marker.position.x = this.fx(mf); this.marker.visible = pl > 0.6;
  },
  overlay(t, sp) {
    const chipW = (x, y, z) => this.chip.localToWorld(V3(x, y, z)), u = (f) => (f - 0.5) * TZ_W;
    const ex = this.ex;
    place(this.layerTags.front, chipW(u(0.3), 0.08 + ex * 0.42, u(0.4)), ex > 0.8);
    place(this.layerTags.sub, chipW(u(0.95), 0.06, u(0.9)), ex > 0.8);
    place(this.layerTags.back, chipW(u(0.1), -0.07 - ex * 0.38, u(0.95)), ex > 0.8);
    place(this.layerTags.pert, chipW(u(0.71), 0.07 + ex * 0.42, u(0.29)), ex > 0.8 || this.frOn > 0.8);
    Object.entries(this.layerTags).forEach(([k, el]) => el.classList.toggle('hot', hotPart === k));
    place(this.portTags[0], chipW(u(0.06), 0.07, u(0.5)), this.frOn > 0.8 || win(sp, 0.8, 1.3) > 0.9);
    place(this.portTags[1], chipW(u(0.5), 0.07, u(0.95)), this.frOn > 0.8 || win(sp, 0.8, 1.3) > 0.9);
    place(this.sizeTag, chipW(0, 0.1, u(0.12)), win(sp, 0.8, 1.3) > 0.9);
    const it = [['Iteration 0', 'plain square patch'], ['Iteration 1', 'one Swastik slot'], ['Iteration 2', 'four more inside it'], ['Iteration 3', '25.93% smaller patch']][this.fr];
    if (this.iterTag.dataset.k !== String(this.fr)) { this.iterTag.dataset.k = this.fr; this.iterTag.querySelector('.it').textContent = it[0]; this.iterTag.querySelector('.ii').textContent = it[1]; this.iterTag._w = 0; }
    place(this.iterTag, chipW(0, 0.08, u(0.3)), this.frOn > 0.6);
    const fq = this.fq || 3.88, fl = { 2.86: 'left zero · current pushed out', 3.88: 'centre · current fills the slots', 5.14: 'right zero · current pushed out' }[fq];
    if (this.freqTag.dataset.f !== String(fq)) { this.freqTag.dataset.f = fq; this.freqTag.querySelector('.ft').textContent = fq.toFixed(2) + ' THz'; this.freqTag.querySelector('.fi').textContent = fl; this.freqTag._w = 0; }
    place(this.freqTag, chipW(0, 0.08, u(0.18)), this.cuOn > 0.8);
    const pw = (f, d) => this.plot.localToWorld(V3(this.fx(f), this.dy(d), 0.05)), res = win(sp, 4.6, 5.4, 0.3) > 0.85;
    place(this.axTags[0], pw(3.0, tzS11(3.0) + 1), res); place(this.axTags[1], pw(4.4, tzS21(4.4) + 1), res);
    place(this.axTags[2], pw(3.88, -38.3), res); place(this.axTags[3], pw(2.86, -33), res); place(this.axTags[4], pw(5.14, -24.6), res); place(this.axTags[5], pw(4.1, -3), res && !narrow());
  },
  audio(sp) { return { hum: 0.12 * win(sp, 0.7, 1.35), pitch: 3, ticks: this.cuOn * 0.5 }; }
};
