
// ===================== DEMS: the STM32 board on a pedestal, and the pipeline from face to feeling =====================
const DE_TOP = 0.9, DE_EMO = [['angry', 0x9a3b2e], ['happy', 0xd9a441], ['sad', 0x5d6fb8], ['neutral', 0x8a8f98]];
// what the board's screen shows: the live result
function demsScreen(k, conf) {
  return (g, w, h) => {
    g.fillStyle = '#0d1520'; g.fillRect(0, 0, w, h); g.fillStyle = '#1a2636'; g.fillRect(0, 0, w, 34);
    g.fillStyle = '#e8e3d9'; g.font = '600 18px Switzer, Arial'; g.fillText('DEMS · emotion monitor', 14, 23);
    g.fillStyle = '#ff5a4e'; g.beginPath(); g.arc(w - 20, 17, 6, 0, 7); g.fill();
    g.fillStyle = '#25384d'; g.fillRect(14, 48, 150, 150); g.fillStyle = '#e8c9a8'; g.beginPath(); g.ellipse(89, 120, 44, 54, 0, 0, 7); g.fill();
    g.fillStyle = '#2a2a2a'; g.beginPath(); g.arc(73, 110, 5, 0, 7); g.arc(105, 110, 5, 0, 7); g.fill(); g.strokeStyle = '#2a2a2a'; g.lineWidth = 4; g.beginPath(); if (k === 1) g.arc(89, 132, 16, 0.2, Math.PI - 0.2); else if (k === 2) g.arc(89, 152, 16, Math.PI + 0.3, -0.3); else { g.moveTo(75, 140); g.lineTo(103, 140); } g.stroke();
    g.strokeStyle = '#8ccb9b'; g.lineWidth = 3; g.strokeRect(40, 60, 98, 124);
    g.fillStyle = '#e8e3d9'; g.font = '600 34px Switzer, Arial'; g.fillText(DE_EMO[k][0].toUpperCase(), 182, 96); g.font = '16px ui-monospace, Menlo, monospace'; g.fillStyle = '#9aa4b2'; g.fillText('confidence ' + conf.toFixed(2), 184, 124);
    DE_EMO.forEach(([n], i) => { g.fillStyle = '#25384d'; g.fillRect(184, 142 + i * 14, 140, 8); g.fillStyle = i === k ? '#d9a441' : '#5b6b80'; g.fillRect(184, 142 + i * 14, 140 * (i === k ? conf : (1 - conf) / 3), 8); });
  };
}
BAYS.de = {
  objs: [],
  build() {
    const root = new THREE.Group(); root.position.copy(STUDIO); this.root = root; this.objs.push(root);
    root.add(at(box(0.8, DE_TOP, 0.6, physMat(0xefece6, { roughness: 0.6 }), 0.02), 0, DE_TOP / 2, 0));
    // the board, at four times real size so it reads on a phone
    const B = new THREE.Group(); B.position.set(-0.05, DE_TOP, 0); B.scale.setScalar(4); root.add(B); this.board = B;
    B.add(at(box(0.155, 0.006, 0.105, mat(0x1a1d24, { roughness: 0.5 }), 0.002), 0, 0.008, 0));
    [[-0.07, -0.045], [0.07, -0.045], [-0.07, 0.045], [0.07, 0.045]].forEach(([x, z]) => B.add(at(cyl(0.003, 0.003, 0.008, M.silver, 8), x, 0.004, z)));
    this.scrK = -1; this.scrTex = textTex(512, 300, demsScreen(1, 0.87));
    const lcd = new THREE.Group(); lcd.position.set(0, 0.0125, 0.004); lcd.add(box(0.112, 0.004, 0.072, M.blackPlastic, 0.002));
    const sm = new THREE.MeshStandardMaterial({ map: this.scrTex, emissive: 0xffffff, emissiveMap: this.scrTex, emissiveIntensity: 0.9 }); glowMats.push(sm);
    const scr = plane(0.098, 0.058, sm); scr.rotation.x = -Math.PI / 2; scr.position.y = 0.0022; lcd.add(scr); B.add(lcd);
    const ports = new THREE.Group(); ports.add(at(box(0.016, 0.013, 0.017, M.silver), -0.06, 0.016, -0.05), at(box(0.016, 0.013, 0.017, M.silver), -0.04, 0.016, -0.05), at(box(0.014, 0.007, 0.012, M.silver), -0.015, 0.013, -0.05), at(box(0.014, 0.007, 0.012, M.silver), 0.005, 0.013, -0.05));
    [0.03, 0.045, 0.06].forEach((x, i) => ports.add(at(cyl(0.003, 0.003, 0.003, mat([0x3a6fd9, 0x15161a, 0x15161a][i]), 10), x, 0.0125, 0.05))); B.add(ports);
    const sd = at(box(0.015, 0.0015, 0.011, mat(0x3a6fd9)), 0.082, 0.009, 0.02); B.add(sd);
    this.P = { board: B.children[0], lcd, sd, ports };
    // the HP webcam on a clip, looking at the visitor
    const cam = new THREE.Group(); cam.position.set(0.3, DE_TOP, -0.12); cam.add(at(box(0.05, 0.03, 0.05, M.blackPlastic, 0.006), 0, 0.015, 0), at(cyl(0.006, 0.006, 0.09, M.metal, 8), 0, 0.075, 0));
    const head = new THREE.Group(); head.position.y = 0.135; head.add(box(0.1, 0.035, 0.035, M.blackPlastic, 0.012)); const lens = cyl(0.011, 0.011, 0.006, M.glass, 20); lens.rotation.x = Math.PI / 2; lens.position.z = 0.019; head.add(lens); head.add(at(sphere(0.003, ledGreen), 0.03, 0.006, 0.018)); cam.add(head); cam.rotation.y = -0.35; root.add(cam); this.P.cam = cam;
    shadowAll(root);
    // the pipeline floating above: frame → face crop → TFLite → emotion → log
    const pipe = new THREE.Group(); pipe.position.set(0, 1.45, -0.35); root.add(pipe); this.pipe = pipe;
    const loader = new THREE.TextureLoader(), img = (f) => { const t = loader.load(`img/${f}.webp`); t.colorSpace = THREE.SRGBColorSpace; return t; };
    const card = (w, h, map) => { const g = new THREE.Group(); g.add(box(w + 0.04, h + 0.04, 0.02, mat(0x15161a), 0.01)); g.add(at(plane(w, h, new THREE.MeshBasicMaterial({ map, toneMapped: false })), 0, 0, 0.011)); return g; };
    const frame = card(0.5, 0.28, img('de-face')); frame.position.set(-1.25, 0.15, 0); pipe.add(frame);
    const crop = card(0.22, 0.22, textTex(48, 48, (g) => { for (let y = 0; y < 48; y++) for (let x = 0; x < 48; x++) { const d = Math.hypot((x - 24) / 17, (y - 25) / 21), v = d < 1 ? 150 + 40 * Math.sin(x * 0.4) * Math.cos(y * 0.3) - (Math.hypot(x - 18, y - 21) < 3 || Math.hypot(x - 30, y - 21) < 3 ? 110 : 0) - (Math.abs(y - 33) < 2 && Math.abs(x - 24) < 7 ? 80 : 0) : 40 + y; g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(x, y, 1, 1); } }));
    crop.children[1].material.map.magFilter = THREE.NearestFilter; crop.position.set(-0.62, 0.15, 0); pipe.add(crop);
    const net = new THREE.Group(); net.position.set(0, 0.15, 0); [0.26, 0.22, 0.18, 0.14, 0.1, 0.07].forEach((s, i) => net.add(at(box(0.05, s, s, physMat([0xc98a5e, 0xd8c3a5][i % 2], { roughness: 0.45 }), 0.006), -0.15 + i * 0.065, 0, 0))); pipe.add(net); this.net = net;
    const bars = new THREE.Group(); bars.position.set(0.55, -0.05, 0); this.bars = DE_EMO.map(([n, c], i) => { const b = at(box(0.07, 1, 0.07, mat(c, { roughness: 0.5 }), 0.008), i * 0.1, 0.5, 0); bars.add(b); return b; }); pipe.add(bars);
    const log = card(0.42, 0.2, img('de-anal')); log.position.set(1.2, 0.15, 0); pipe.add(log);
    this.cards = { cam: frame, crop, tfl: net, emo: bars, log };
    const flow = makeFlow(); this.flow = flow;
    const pw = (o, x) => () => o.localToWorld(V3(x, 0, 0));
    flow.add(root, () => head.localToWorld(V3(0, 0, 0.03)), pw(frame, -0.2), 0.3); flow.add(root, pw(frame, 0.27), pw(crop, -0.13), 0.06); flow.add(root, pw(crop, 0.13), pw(net, -0.2), 0.06); flow.add(root, pw(net, 0.2), () => bars.localToWorld(V3(-0.05, 0.15, 0)), 0.06); flow.add(root, () => bars.localToWorld(V3(0.35, 0.15, 0)), pw(log, -0.23), 0.06);
    this.pipeTags = [['cam', 'Webcam frame', '720p'], ['crop', 'Face crop', 'grayscale'], ['tfl', 'TensorFlow Lite', 'on the Cortex-A7'], ['emo', 'Emotion', 'four classes'], ['log', 'Logged for the doctor', 'SD card → dashboard']].map(([k, n, s]) => ({ k, el: mkTag(`<b>${n}</b> <i>${s}</i>`) }));
    this.emoTags = DE_EMO.map(([n]) => mkTag(`<b>${n}</b> <i class="v">0%</i>`));
    this.partTags = [['board', '<b>STM32MP135F-DK</b> <i>Cortex-A7 · 1 GHz</i>', () => B.localToWorld(V3(-0.07, 0.012, -0.05))], ['lcd', '<b>4.3" touch display</b> <i>live result</i>', () => B.localToWorld(V3(0.0, 0.016, -0.03))], ['cam', '<b>HP W100 webcam</b> <i>720p</i>', () => head.localToWorld(V3(0, 0.03, 0))], ['sd', '<b>64 GB SD card</b> <i>patient history</i>', () => B.localToWorld(V3(0.085, 0.012, 0.02))]].map(([k, h, f]) => ({ k, f, el: mkTag(h) }));
  },
  key(i, tt) {
    switch (i) {
      case 0: return { pos: S(-0.05, DE_TOP + 0.62, 0.42), look: S(-0.05, DE_TOP + 0.02, 0.01) };
      case 1: return { pos: S(0.95, DE_TOP + 0.65, 1.45), look: S(0, DE_TOP + 0.12, 0) };
      case 2: return { pos: S(0.45, DE_TOP + 0.38, 0.58), look: S(0, DE_TOP + 0.03, 0) };
      case 3: return { pos: S(0.1, 2.0, 3.9), look: S(0.05, 1.5, -0.35) };
      case 4: return { pos: S(0.95, 1.7, 1.55), look: S(0.65, 1.4, -0.35) };
      case 5: return { pos: S(-1.0, 1.45, 1.3), look: S(0, DE_TOP + 0.1, 0) };
      default: return { pos: S(1.3, 1.25, 1.6), look: S(0, DE_TOP + 0.1, 0) };
    }
  },
  near(sp) { return sp < 2.6 ? 0.01 : 0.03; },
  update(dt, t, sp) {
    // the emotion cycles every few seconds; the screen and the bars follow
    const k = [1, 3, 1, 2, 1, 0][Math.floor(t / 2.6) % 6], conf = 0.78 + 0.16 * hash(Math.floor(t / 2.6), 3);
    if (this.scrK !== k) { this.scrK = k; this.conf = conf; const g = this.scrTex.image.getContext('2d'); demsScreen(k, conf)(g, 512, 300); this.scrTex.needsUpdate = true; }
    this.emoV = DE_EMO.map((_, i) => (i === this.scrK ? this.conf : (1 - this.conf) / 3));
    const pl = win(sp, 2.75, 4.3, 0.35); this.pl = pl;
    this.pipe.visible = pl > 0.01; this.pipe.scale.setScalar(0.6 + 0.4 * ease(pl));
    this.bars.forEach((b, i) => { const h = Math.max(0.01, this.emoV[i] * 0.45); b.scale.y += (h - b.scale.y) * Math.min(1, dt * 5); b.position.y = b.scale.y / 2; });
    this.net.children.forEach((c, i) => { c.scale.x = 1 + (reduced ? 0 : 0.25 * Math.max(0, Math.sin(t * 5 - i * 0.7))); });
    this.flow.update(t, pl, 0.5);
    Object.entries(this.cards).forEach(([key, o]) => o.scale.setScalar(hotNode === key ? 1.12 : 1));
    Object.entries(this.P).forEach(([key, o]) => { if (o.scale) o.scale.setScalar(hotPart === key ? 1.12 : 1); });
  },
  overlay(t, sp) {
    const brd = win(sp, 1.75, 2.3, 0.25) > 0.85;
    this.partTags.forEach((p) => { place(p.el, p.f(), brd || (p.k === 'board' && win(sp, 0.8, 1.3) > 0.9)); p.el.classList.toggle('hot', hotPart === p.k); });
    const pipeOn = win(sp, 2.8, 3.25, 0.25) > 0.85, res = win(sp, 3.75, 4.3, 0.25) > 0.85;
    this.pipeTags.forEach((p) => { const o = this.cards[p.k]; place(p.el, o.localToWorld(V3(0, p.k === 'emo' ? 0.6 : 0.26, 0)), pipeOn); p.el.classList.toggle('hot', hotNode === p.k); });
    this.emoTags.forEach((el, i) => { const b = this.bars[i]; place(el, b.localToWorld(V3(0, 0.55, 0)), res); const v = el.querySelector('.v'), s = Math.round(this.emoV[i] * 100) + '%'; if (v.textContent !== s) v.textContent = s; el.classList.toggle('hot', i === this.scrK); });
  },
  audio(sp) { return { hum: 0, ticks: this.pl * 0.6 }; }
};
