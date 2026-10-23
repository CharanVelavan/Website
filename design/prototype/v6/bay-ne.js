
// ===================== Nephele 2.0: the robot on a turntable, its sensors, its insides, its voice loop, the fleet =====================
// a black drum on a white skirt, a white head with a screen for eyes (from the event photos and the build video)
function buildNepheleBot(v3) {
  const R = new THREE.Group(), P = {};
  const shell = new THREE.Group(); R.add(shell);
  shell.add(at(cyl(0.27, 0.285, 0.07, M.white, 48), 0, 0.035, 0));
  if (v3) {
    // 3.0: a white pedestal that pinches at the waist
    const pts = [[0.24, 0.07], [0.25, 0.12], [0.2, 0.35], [0.15, 0.6], [0.17, 0.82], [0.2, 0.9], [0.19, 0.95], [0, 0.96]].map(([r, y]) => new THREE.Vector2(r, y));
    shell.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 64), physMat(0xeeeeea, { roughness: 0.35, clearcoat: 0.5 })));
  } else {
    const name = textTex(2048, 512, (g, w, h) => {
      g.fillStyle = '#1c1d21'; g.fillRect(0, 0, w, h); g.fillStyle = '#26272c'; for (let y = 0; y < h; y += 6) g.fillRect(0, y, w, 1);
      g.fillStyle = '#f2f2ee'; g.textAlign = 'center'; g.font = '600 118px Switzer, Arial, sans-serif'; g.fillText('NEPHELE', w / 2, h * 0.47); g.font = '600 104px Switzer, Arial, sans-serif'; g.fillText('2.0', w / 2, h * 0.72);
    });
    const body = cyl(0.205, 0.255, 0.78, physMat(0xffffff, { map: name, roughness: 0.38, clearcoat: 0.6, clearcoatRoughness: 0.3 }), 72); body.position.y = 0.46; body.rotation.y = Math.PI; shell.add(body);
    shell.add(at(cyl(0.2, 0.205, 0.03, physMat(0x111215, { roughness: 0.3, clearcoat: 0.8 }), 72), 0, 0.865, 0));
    // the LiDAR slot: a dark band at the waist with the scanner peeking out at the front
    shell.add(at(cyl(0.247, 0.25, 0.05, mat(0x0c0c0e, { roughness: 0.8 }), 72), 0, 0.17, 0));
  }
  const lidar = new THREE.Group(); lidar.position.set(0, 0.17, 0.2); lidar.add(cyl(0.045, 0.045, 0.03, mat(0x2a2b30, { metalness: 0.4 }), 32));
  const lidarTop = at(cyl(0.035, 0.035, 0.022, M.blackPlastic, 24), 0, 0.026, 0); lidarTop.add(at(box(0.016, 0.012, 0.004, M.glass), 0, 0, 0.034)); lidar.add(lidarTop); R.add(lidar);
  P.lidar = lidar; P.lidarTop = lidarTop;
  // head: neck, white box, a black screen with two eyes, the camera on top
  const head = new THREE.Group(); head.position.y = v3 ? 0.96 : 0.88; R.add(head);
  head.add(at(cyl(0.05, 0.055, 0.12, M.white, 24), 0, 0.06, 0));
  const hb = new THREE.Group(); hb.position.y = 0.25; head.add(hb);
  hb.add(box(0.34, 0.26, 0.2, physMat(0xf4f4f0, { roughness: 0.4, clearcoat: 0.4 }), 0.03));
  hb.add(at(box(0.27, 0.17, 0.01, M.glass, 0.012), 0, -0.005, 0.1));
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0a2a24, emissive: 0x52f2c6, emissiveIntensity: 1.2 }); glowMats.push(eyeMat);
  const eyes = [-0.055, 0.055].map((x) => { const e = at(box(0.05, 0.045, 0.004, eyeMat, 0.012), x, 0.0, 0.106); hb.add(e); return e; });
  const cam = new THREE.Group(); cam.position.set(0, 0.145, 0.04); cam.add(box(0.06, 0.028, 0.04, M.blackPlastic, 0.008)); const lens = cyl(0.009, 0.009, 0.006, M.glass, 16); lens.rotation.x = Math.PI / 2; lens.position.z = 0.022; cam.add(lens); hb.add(cam);
  const mic = new THREE.Group(); [-0.12, 0.12].forEach((x) => { const g = cyl(0.014, 0.014, 0.004, mat(0x3a3b40), 16); g.rotation.z = Math.PI / 2; g.position.set(x > 0 ? 0.171 : -0.171, 0, 0); mic.add(g); }); hb.add(mic);
  P.head = head; P.cam = cam; P.display = hb.children[1]; P.mic = mic; P.eyes = eyes; P.shell = shell;
  shadowAll(R); return { R, P };
}
// the inside of the drum, from the build photo: a round wooden chassis, two steppers, drivers, a Pi 5 and a battery
function buildNepheleGuts() {
  const G = new THREE.Group(), P = {};
  G.add(at(cyl(0.235, 0.235, 0.018, M.wood, 48), 0, 0.085, 0));
  const motors = new THREE.Group();
  [-1, 1].forEach((s) => {
    const m = new THREE.Group(); m.position.set(s * 0.12, 0.055, 0);
    m.add(box(0.042, 0.042, 0.042, M.blackPlastic, 0.003)); m.add(at(box(0.044, 0.012, 0.044, M.silver), 0, 0.02, 0).rotateZ(0));
    const shaft = cyl(0.004, 0.004, 0.04, M.silver, 8); shaft.rotation.z = Math.PI / 2; shaft.position.x = s * 0.035; m.add(shaft);
    const wheel = cyl(0.05, 0.05, 0.026, mat(0x151515, { roughness: 0.9 }), 32); wheel.rotation.z = Math.PI / 2; wheel.position.set(s * 0.065, -0.005, 0); wheel.name = 'wheel'; m.add(wheel);
    motors.add(m);
  });
  G.add(motors); P.motors = motors;
  [0.17, -0.17].forEach((z) => G.add(at(sphere(0.018, M.silver), 0, 0.02, z)));
  const drivers = new THREE.Group(); [-0.06, 0.06].forEach((x) => { const d = new THREE.Group(); d.position.set(x, 0.1, -0.12); d.add(box(0.05, 0.004, 0.035, mat(0x5b2a86, { roughness: 0.5 }))); d.add(at(box(0.02, 0.012, 0.02, M.silver), 0, 0.008, 0)); drivers.add(d); }); G.add(drivers); P.drivers = drivers;
  const pi = new THREE.Group(); pi.position.set(0, 0.112, 0.06); pi.add(box(0.085, 0.003, 0.056, M.pcbGreen, 0.001)); pi.add(at(cyl(0.017, 0.017, 0.014, mat(0x22252b, { metalness: 0.5 }), 20), -0.008, 0.009, 0.004)); [0.036].forEach((x) => { pi.add(at(box(0.017, 0.016, 0.014, M.silver), x, 0.009, -0.016), at(box(0.017, 0.016, 0.014, M.silver), x, 0.009, 0.002)); }); G.add(pi); P.pi = pi;
  const batt = at(box(0.14, 0.06, 0.07, mat(0x2b2c30, { roughness: 0.6 }), 0.006), 0, 0.125, -0.04); batt.add(at(box(0.05, 0.002, 0.03, mat(SLOT.packet)), 0.03, 0.031, 0)); G.add(batt); P.battery = batt;
  const red = mat(0xb32424), blk = mat(0x111111);
  G.add(tube([[0.12, 0.08, 0], [0.08, 0.12, -0.08], [0.03, 0.15, -0.04]], 0.0025, red), tube([[-0.12, 0.08, 0], [-0.07, 0.12, -0.1], [-0.02, 0.15, -0.05]], 0.0025, blk), tube([[0.0, 0.12, 0.06], [0.05, 0.16, 0.0], [0.06, 0.1, -0.12]], 0.002, mat(0x3a6fd9)));
  shadowAll(G); return { G, P };
}

BAYS.ne = {
  objs: [],
  build() {
    const root = new THREE.Group(); root.position.copy(STUDIO); this.root = root; this.objs.push(root);
    root.add(makePlinth(0.95));
    const turn = new THREE.Group(); turn.position.y = 0.084; root.add(turn); this.turn = turn;
    const { R, P } = buildNepheleBot(false); turn.add(R); this.P = P;
    const guts = buildNepheleGuts(); turn.add(guts.G); Object.assign(this.P, guts.P);
    // the shell turns see-through as it lifts, so the insides show
    this.shellMats = []; P.shell.traverse((c) => { if (c.isMesh) { c.material = c.material.clone(); c.material.transparent = true; this.shellMats.push(c.material); } });
    // sensors: a visitor, the camera's view cone, and the LiDAR's sweep of the room
    const visitor = makePerson(1, 0.78); visitor.position.set(-0.6, 0, 1.3); visitor.rotation.y = Math.PI + 0.45; root.add(visitor); this.visitor = visitor;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.2, 32, 1, true), new THREE.MeshBasicMaterial({ color: SLOT.packet, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
    cone.geometry.translate(0, -0.6, 0); cone.geometry.rotateX(-Math.PI / 2); root.add(cone); this.cone = cone;
    const pts = []; const room = (a) => { const c = Math.cos(a), s = Math.sin(a), tx = c ? 2.6 / Math.abs(c) : 1e9, tz = s ? 2.1 / Math.abs(s) : 1e9; return Math.min(tx, tz); };
    for (let k = 0; k < 720; k++) { const a = (k / 720) * Math.PI * 2; let d = room(a) * (0.98 + Math.random() * 0.04); const vx = -0.6, vz = 1.3; const va = Math.atan2(vz, vx), vd = Math.hypot(vx, vz); if (Math.abs(wrapPi(a - va)) < 0.09) d = vd - 0.1; if (k % 97 < 4) d *= 0.55 + (k % 7) * 0.03; pts.push(Math.cos(a) * d, 0.2, Math.sin(a) * d); }
    const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const lidarPts = new THREE.Points(lg, new THREE.PointsMaterial({ color: SLOT.packet, size: 0.035, transparent: true, opacity: 0 })); root.add(lidarPts); this.lidarPts = lidarPts;
    const beam = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.01), new THREE.MeshBasicMaterial({ color: SLOT.packet, transparent: true, opacity: 0 })); beam.geometry.translate(1.3, 0, 0); beam.rotation.x = -Math.PI / 2; beam.position.y = 0.254; root.add(beam); this.beam = beam;
    // the voice loop through AWS: four services floating above, linked to the robot
    const svc = [['transcribe', 'AWS Transcribe', 'speech → text', V3(-1.05, 1.95, -0.2)], ['bedrock', 'Amazon Bedrock', 'the answer', V3(-0.35, 2.35, -0.5)], ['polly', 'AWS Polly', 'text → voice', V3(0.45, 2.3, -0.45)], ['rekognition', 'AWS Rekognition', 'faces → names', V3(1.1, 1.85, -0.15)]];
    this.svc = {}; const cloud = new THREE.Group(); root.add(cloud); this.cloud = cloud;
    svc.forEach(([k, n, s, p]) => { const b = new THREE.Group(); b.position.copy(p); b.add(box(0.36, 0.2, 0.06, physMat(0xf6f3ee, { roughness: 0.5 }), 0.03), at(box(0.36, 0.02, 0.062, mat(SLOT.link)), 0, -0.09, 0)); cloud.add(b); this.svc[k] = { b, el: mkTag(`<b>${n}</b> <i>${s}</i>`) }; });
    shadowAll(cloud);
    const flow = makeFlow(); this.flow = flow;
    const headW = () => wpos(this.P.cam), svcW = (k) => () => wpos(this.svc[k].b);
    flow.add(root, headW, svcW('transcribe'), 0.3); flow.add(root, svcW('transcribe'), svcW('bedrock'), 0.15); flow.add(root, svcW('bedrock'), svcW('polly'), 0.15); flow.add(root, svcW('polly'), () => wpos(this.P.mic), 0.3); flow.add(root, headW, svcW('rekognition'), 0.3, 2);
    this.rosTag = mkTag('<b>ROS2 on a Raspberry Pi 5</b> <i>perception · motion · voice</i>');
    // the fleet: another 2.0 and a 3.0, and a crowd
    const fleet = new THREE.Group(); root.add(fleet); this.fleet = fleet;
    const b2 = buildNepheleBot(false).R; b2.position.set(-1.45, 0, -0.7); b2.rotation.y = 0.5; fleet.add(b2);
    const b3 = buildNepheleBot(true).R; b3.position.set(1.5, 0, -0.6); b3.rotation.y = -0.45; fleet.add(b3);
    this.crowd = [[-0.6, 1.5], [0.7, 1.6], [-1.9, 0.6], [-2.2, -0.3], [2.1, 0.7], [2.4, -0.2], [-1.1, 1.1], [1.4, 1.2], [0.1, 2.1], [-0.9, -1.6]].map(([x, z], i) => { const p = makePerson(i + 2, 0.74); p.position.set(x, 0, z); p.lookAt(V3(STUDIO.x + x * 0.3, 0, STUDIO.z + z * 0.3).sub(STUDIO)); p.rotation.y = Math.atan2(-x, -z); fleet.add(p); return p; });
    this.bubbles = [['“Where’s hall B?”', 0], ['“Can I get a selfie?”', 1], ['“Hi Nephele!”', 4], ['attendance ✓', 7]].map(([s, i]) => ({ i, el: mkTag(`<b>${s}</b>`) }));
    this.fleetTag = mkTag('<b>3 robots</b> <i>500+ conversations</i>');
    this.partTags = NE_PARTS.map(([n, s, k]) => ({ k, el: mkTag(`<b>${n}</b> <i>${s}</i>`) }));
    this.faceTag = mkTag('<span>face · known · 0.96</span>', 'det');
  },
  key(i, tt) {
    switch (i) {
      case 0: return { pos: S(0.35, 1.05, 2.7), look: S(0, 0.78, 0) };
      case 1: return { pos: S(1.0, 1.15, 2.15), look: S(0, 0.72, 0) };
      case 2: return { pos: S(1.9, 1.75, 2.0), look: S(-0.15, 0.6, 0.4) };
      case 3: return { pos: S(0.62, 0.62, 0.78), look: S(0, 0.3, 0) };
      case 4: return { pos: S(0.35, 1.75, 3.9), look: S(0, 1.45, 0) };
      case 5: return { pos: S(1.9, 2.4, 5.2), look: S(-0.1, 0.65, 0) };
      case 6: return { pos: S(0.5, 1.4, 1.65), look: S(0, 1.08, 0) };
      default: return { pos: S(-1.3, 0.9, 2.5), look: S(0, 0.8, 0) };
    }
  },
  update(dt, t, sp) {
    const P = this.P;
    // turntable in the overview
    const spinOn = win(sp, 0.6, 1.4, 0.3);
    this.turnA = (this.turnA || 0) + dt * 0.5 * spinOn * (reduced ? 0 : 1);
    if (spinOn < 0.01) this.turnA *= 1 - Math.min(1, dt * 3);
    this.turn.rotation.y = this.turnA;
    // blink, look around, the LiDAR spins
    const blink = (t % 3.6) < 0.12 ? 0.15 : 1; P.eyes.forEach((e) => { e.scale.y = blink; });
    P.head.rotation.y = reduced ? 0 : Math.sin(t * 0.5) * 0.2 * (1 - win(sp, 1.6, 2.4));
    P.lidarTop.rotation.y += dt * (reduced ? 0 : 12);
    // inside: the shell lifts and fades, the head rises with it
    const open = win(sp, 2.75, 3.3, 0.3); this.open = open;
    P.shell.position.y = open * 0.95; P.head.position.y = 0.88 + open * 1.1; P.lidar.position.y = 0.17 + open * 0.95;
    this.shellMats.forEach((m) => { m.opacity = 1 - open * 0.82; m.depthWrite = open < 0.5; });
    this.P.motors.children.forEach((m) => { const w = m.getObjectByName('wheel'); if (w) w.rotation.x += dt * 4 * open; });
    // hover a part in the list to find it
    ['cam', 'display', 'mic', 'lidar', 'pi', 'motors', 'drivers', 'battery'].forEach((k) => { if (P[k]) P[k].scale.setScalar(hotPart === k ? 1.2 + Math.sin(t * 6) * 0.05 : 1); });
    // sensors
    const sens = win(sp, 1.75, 2.3, 0.3); this.sens = sens;
    this.visitor.visible = sens > 0.01 || win(sp, 4.6, 5.4) > 0;
    this.cone.material.opacity = sens * 0.14;
    if (sens > 0.01) { const a = wpos(P.cam).sub(STUDIO), b = this.visitor.position.clone().add(V3(0, 1.0, 0)); this.cone.position.copy(a); this.cone.lookAt(b.clone().add(STUDIO)); this.cone.scale.set(1, 1, a.distanceTo(b) / 1.2); }
    const sweep = reduced ? 1 : ((t * 0.35) % 1); this.lidarPts.material.opacity = sens; this.lidarPts.geometry.setDrawRange(0, Math.floor(720 * (sens < 1 ? sens : 1) * (0.25 + 0.75 * sweep)) || 0);
    this.beam.material.opacity = sens * 0.8; this.beam.rotation.z = -sweep * Math.PI * 2;
    // the voice loop
    const loop = win(sp, 3.75, 4.3, 0.3); this.loop = loop;
    this.cloud.visible = loop > 0.01; this.cloud.scale.setScalar(0.6 + 0.4 * ease(loop));
    Object.entries(this.svc).forEach(([k, s]) => { s.b.scale.setScalar(hotNode === k ? 1.15 : 1); s.b.position.y += Math.sin(t * 1.3 + s.b.position.x * 3) * 0.0006; });
    this.flow.update(t, loop, 0.45);
    // fleet
    const fl = win(sp, 4.7, 5.4, 0.3); this.fl = fl;
    this.fleet.visible = fl > 0.01; this.fleet.children.forEach((c, i) => { c.scale.setScalar(Math.max(0.001, ease(clamp01(fl * 1.6 - i * 0.05))) * (c.userData.s || (c.userData.s = c.scale.x || 1))); });
  },
  overlay(t, sp) {
    const P = this.P, S2 = this.sens, o = this.open;
    const at2 = { cam: () => wpos(P.cam, V3(0, 0.05, 0)), display: () => wpos(P.display, V3(-0.12, -0.02, 0.02)), mic: () => wpos(P.mic.children[1], V3(0.02, 0, 0)), lidar: () => wpos(P.lidar, V3(0, 0.03, 0)), pi: () => wpos(P.pi, V3(0, 0.02, 0)), motors: () => wpos(P.motors.children[1], V3(0.05, 0.03, 0)), drivers: () => wpos(P.drivers.children[0], V3(0, 0.02, 0)), battery: () => wpos(P.battery, V3(-0.04, 0.04, 0)) };
    this.partTags.forEach(({ k, el }) => { const isIn = ['pi', 'motors', 'drivers', 'battery'].includes(k); place(el, at2[k](), isIn ? o > 0.8 : S2 > 0.8); el.classList.toggle('hot', hotPart === k); });
    const fc = project(this.visitor.position.clone().add(STUDIO).add(V3(0, 0.98, 0))), fh = project(this.visitor.position.clone().add(STUDIO).add(V3(0, 1.17, 0))), h = Math.max(10, fc.y - fh.y) * 1.6;
    const fe = this.faceTag; fe.style.width = h * 0.8 + 'px'; fe.style.height = h + 'px'; fe.style.transform = `translate(${fc.x}px, ${fc.y + h * 0.35}px) translate(-50%, -100%)`; fe.style.opacity = S2 > 0.8 && fc.vis ? 1 : 0;
    Object.entries(this.svc).forEach(([k, s]) => { place(s.el, wpos(s.b, V3(0, 0.13, 0)), this.loop > 0.8); s.el.classList.toggle('hot', hotNode === k); });
    place(this.rosTag, wpos(P.head, V3(0, 0.45, 0)), this.loop > 0.8);
    this.bubbles.forEach((b) => place(b.el, wpos(this.crowd[b.i], V3(0, 1.15, 0)), this.fl > 0.85));
    place(this.fleetTag, wpos(P.head, V3(0, 0.5, 0)), this.fl > 0.85);
  },
  audio(sp) { return { hum: 0.18 * win(sp, 0.6, 1.4) + 0.25 * this.open, pitch: 2.4, ticks: this.loop + this.sens * 0.3 }; }
};
