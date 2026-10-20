// ===================== 3D world =====================
const canvas = document.getElementById('stage');
const mobile = narrow() || (navigator.hardwareConcurrency || 8) <= 4;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = !mobile; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 1, 0.005, 400);
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(renderer), 0.04).texture;
const hemi = new THREE.HemisphereLight(0xffffff, 0x8a7f72, 0.55); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff1e0, 2.2); sun.position.set(4, 8, 5); sun.castShadow = !mobile;
sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = -3; sun.shadow.camera.right = 3; sun.shadow.camera.top = 3; sun.shadow.camera.bottom = -3; sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.01; scene.add(sun, sun.target);
const glowMats = []; let terrainMat = null;
const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
let darkTheme = false, lookDay = null;
function applyTheme() { darkTheme = new THREE.Color(css('--bg')).getHSL({}).l < 0.3; lookDay = null; }
// the world's palette: daylight for photo-matched scenes, a dim studio in dark mode
function setLook(day) {
  if (day === lookDay) return; lookDay = day; const t = day ? PAL.L : PAL.D;
  const bg = new THREE.Color(t.bg); scene.background = bg; scene.fog = new THREE.Fog(bg, 9, 70);
  hemi.intensity = day ? 0.55 : 0.4; sun.intensity = day ? 2.2 : 1.1; renderer.toneMappingExposure = day ? 1 : 0.95;
  glowMats.forEach((m) => { m.emissiveIntensity = day ? 0.9 : 1.8; });
  terrainMat.uniforms.uBase.value.set(t.tb); terrainMat.uniforms.uLine.value.set(t.tl); terrainMat.uniforms.uFog.value.copy(bg);
  M.concrete.color.set(day ? 0xcfc8bb : 0x3b3d43);
  tintWorld(t);
}
// every accent-coloured material in the world follows the palette (matched by its original copper)
const ACC_KEYS = [[0x9a4e25, 'a3'], [0xd9733a, 'a3l']];
const accKey = (hex) => { const k = ACC_KEYS.find(([h]) => Math.abs((h >> 16) - (hex >> 16)) < 3 && Math.abs(((h >> 8) & 255) - ((hex >> 8) & 255)) < 3 && Math.abs((h & 255) - (hex & 255)) < 3); return k && k[1]; };
function tintWorld(t) {
  scene.traverse((o) => { (Array.isArray(o.material) ? o.material : o.material ? [o.material] : []).forEach((m) => {
    if (m.userData.ok === undefined) { m.userData.ok = m.color ? accKey(m.color.getHex()) : null; m.userData.ek = m.emissive ? accKey(m.emissive.getHex()) : null; }
    if (m.userData.ok) m.color.set(t[m.userData.ok]); if (m.userData.ek) m.emissive.set(t[m.userData.ek]);
  }); });
}
const M = {
  red: new THREE.MeshPhysicalMaterial({ color: 0xc42a1f, roughness: 0.45, clearcoat: 0.3 }), blackPlastic: new THREE.MeshPhysicalMaterial({ color: 0x18191c, roughness: 0.55 }),
  carbon: new THREE.MeshStandardMaterial({ color: 0x111214, roughness: 0.35, metalness: 0.2 }), white: new THREE.MeshPhysicalMaterial({ color: 0xf2f2ee, roughness: 0.5, clearcoat: 0.2 }),
  pcbGreen: new THREE.MeshStandardMaterial({ color: 0x2f8a4a, roughness: 0.5 }), pcbDark: new THREE.MeshStandardMaterial({ color: 0x2a2620, roughness: 0.6, metalness: 0.2 }),
  chip: new THREE.MeshStandardMaterial({ color: 0x15161a, roughness: 0.4 }), silver: new THREE.MeshStandardMaterial({ color: 0xc8ccd1, roughness: 0.25, metalness: 1 }),
  cyan: new THREE.MeshStandardMaterial({ color: 0x36b6c8, roughness: 0.6 }), blue: new THREE.MeshStandardMaterial({ color: 0x2c5fd0, roughness: 0.5 }),
  copper: new THREE.MeshStandardMaterial({ color: 0xb8733e, roughness: 0.3, metalness: 1 }), glass: new THREE.MeshPhysicalMaterial({ color: 0x0a0c10, roughness: 0.05, metalness: 0.2, clearcoat: 1 }),
  metal: new THREE.MeshStandardMaterial({ color: 0x2b2c30, roughness: 0.5, metalness: 0.6 }), concrete: new THREE.MeshStandardMaterial({ color: 0xcfc8bb, roughness: 0.95 })
};
const hotMat = new THREE.MeshStandardMaterial({ color: 0x9a4e25, emissive: 0xd9733a, emissiveIntensity: 0.6 });
const ledGreen = new THREE.MeshStandardMaterial({ color: 0x103018, emissive: 0x2cff6a, emissiveIntensity: 0.9 }); glowMats.push(ledGreen);
const ledBlue = new THREE.MeshStandardMaterial({ color: 0x0b1530, emissive: 0x3a7bff, emissiveIntensity: 0.9 }); glowMats.push(ledBlue);
function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
M.wood = new THREE.MeshStandardMaterial({ roughness: 0.55, map: canvasTex(1024, 512, (g, w, h) => { g.fillStyle = '#9b6b43'; g.fillRect(0, 0, w, h); for (let i = 0; i < 260; i++) { const y = Math.random() * h; g.strokeStyle = `rgba(${60 + Math.random() * 40},${35 + Math.random() * 20},15,${0.08 + Math.random() * 0.12})`; g.lineWidth = 1 + Math.random() * 3; g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= w; x += 32) g.lineTo(x, y + Math.sin(x * 0.01 + i) * 4); g.stroke(); } }) });
const box = (w, h, d, mat, r = 0) => new THREE.Mesh(r ? new RoundedBoxGeometry(w, h, d, 3, r) : new THREE.BoxGeometry(w, h, d), mat);
const cyl = (rt, rb, h, mat, seg = 24) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
const tube = (pts, r, mat, seg = 40) => new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), seg, r, 8), mat);
const at = (m, x, y, z) => { m.position.set(x, y, z); return m; };
const shadowAll = (o) => o.traverse((c) => { if (c.isMesh) { c.castShadow = !mobile; c.receiveShadow = !mobile; } });

// ---------- Bird's AI drone (photos + NBUC deck) ----------
function buildDrone() {
  const root = new THREE.Group(); const P = {};
  const part = (name, obj, dir) => { const g = new THREE.Group(); g.add(obj); g.userData.dir = new THREE.Vector3(...dir); root.add(g); P[name] = g; return g; };
  const plateGeo = new RoundedBoxGeometry(0.15, 0.003, 0.15, 2, 0.001);
  const bottom = new THREE.Group(); const bp = new THREE.Mesh(plateGeo, M.pcbDark); bp.rotation.y = Math.PI / 4; bottom.add(bp);
  const buck = new THREE.Group(); buck.add(box(0.045, 0.004, 0.022, M.blue)); const tor = new THREE.Mesh(new THREE.TorusGeometry(0.006, 0.0025, 8, 16), M.copper); tor.rotation.x = Math.PI / 2; tor.position.y = 0.004; buck.add(tor); buck.position.set(0, -0.008, 0.03); bottom.add(buck);
  part('Power + buck converter', bottom, [0, -0.6, 0]);
  const topG = new THREE.Group(); const tp = new THREE.Mesh(plateGeo, M.pcbDark); tp.rotation.y = Math.PI / 4; tp.position.y = 0.032; topG.add(tp); part('Frame plates', topG, [0, 0.15, 0]);
  const armShape = new THREE.Shape(); armShape.moveTo(0, -0.012); armShape.lineTo(0.2, -0.008); armShape.lineTo(0.2, 0.012); armShape.lineTo(0, 0.016); armShape.closePath();
  const armGeo = new THREE.ExtrudeGeometry(armShape, { depth: 0.03, bevelEnabled: true, bevelSize: 0.002, bevelThickness: 0.002, bevelSegments: 1 }); armGeo.translate(0, 0, -0.015);
  [[1, 1], [-1, 1], [-1, -1], [1, -1]].forEach(([sx, sz], i) => {
    const ang = Math.atan2(sz, sx), dir = [Math.cos(ang), 0, Math.sin(ang)];
    const arm = new THREE.Mesh(armGeo, sz > 0 ? M.red : M.blackPlastic); arm.position.set(0.035 * dir[0], 0.016, 0.035 * dir[2]); arm.rotation.y = -ang; part('Arm ' + (i + 1), arm, [dir[0] * 0.5, 0, dir[2] * 0.5]);
    const mg = new THREE.Group(); mg.position.set(0.225 * dir[0], 0.03, 0.225 * dir[2]);
    mg.add(at(cyl(0.016, 0.016, 0.012, M.blackPlastic), 0, 0.006, 0), at(cyl(0.0145, 0.0145, 0.02, M.red), 0, 0.022, 0), at(cyl(0.0148, 0.0148, 0.004, M.blackPlastic), 0, 0.03, 0), at(new THREE.Mesh(new THREE.ConeGeometry(0.006, 0.016, 16), M.silver), 0, 0.044, 0));
    const prop = new THREE.Group(); prop.position.y = 0.038; prop.name = 'prop';
    [1, -1].forEach((s) => { const b = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 8), M.carbon); b.scale.set(0.062, 0.002, 0.012); b.position.x = s * 0.062; b.rotation.x = s * 0.12; prop.add(b); }); prop.rotation.y = i * 0.8; mg.add(prop);
    const guard = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.004, 8, 64), M.white); guard.rotation.x = Math.PI / 2; guard.position.set(0.02 * dir[0], 0.03, 0.02 * dir[2]); mg.add(guard);
    for (let k = 0; k < 3; k++) { const a = ang + (k - 1) * 1.1; const sp = box(0.12, 0.004, 0.006, M.white); sp.position.set(Math.cos(a) * 0.075 + 0.02 * dir[0], 0.03, Math.sin(a) * 0.075 + 0.02 * dir[2]); sp.rotation.y = -a; mg.add(sp); }
    part('Motor ' + (i + 1), mg, [dir[0] * 0.9, 0.25, dir[2] * 0.9]);
  });
  const px = new THREE.Group(); [[1, 1], [-1, 1], [-1, -1], [1, -1]].forEach(([a, b]) => px.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.006, 12, 8), M.cyan), a * 0.032, 0.04, b * 0.018)));
  px.add(at(box(0.082, 0.016, 0.05, M.chip, 0.004), 0, 0.054, 0)); const pxLed = at(new THREE.Mesh(new THREE.SphereGeometry(0.003, 8, 6), ledBlue), 0, 0.0625, 0); pxLed.name = 'pxLed'; px.add(pxLed);
  part('Pixhawk 2.4.8', px, [0, 0.9, 0]);
  const gps = new THREE.Group(); gps.add(at(cyl(0.002, 0.002, 0.05, M.blackPlastic, 8), 0.05, 0.06, -0.05), at(cyl(0.026, 0.028, 0.012, M.blackPlastic, 32), 0.05, 0.09, -0.05)); part('GPS', gps, [0.4, 1.2, -0.4]);
  const pi = new THREE.Group(); pi.position.set(0, 0.105, 0);
  pi.add(box(0.085, 0.0016, 0.056, M.pcbGreen, 0.0007), at(box(0.014, 0.0016, 0.014, M.chip), -0.008, 0.0016, 0.004), at(box(0.012, 0.0013, 0.01, M.chip), 0.012, 0.0014, 0.006), at(box(0.017, 0.016, 0.014, M.silver), 0.036, 0.009, -0.016), at(box(0.017, 0.016, 0.014, M.silver), 0.036, 0.009, 0.002), at(box(0.02, 0.014, 0.016, M.silver), 0.034, 0.008, 0.02), at(box(0.05, 0.008, 0.005, M.chip), -0.008, 0.005, -0.025));
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b]) => pi.add(at(cyl(0.0022, 0.0022, 0.03, M.silver, 8), a * 0.0375, -0.016, b * 0.024)));
  pi.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.0015, 6, 4), ledGreen), -0.04, 0.002, 0.02));
  part('Raspberry Pi 5', pi, [0, 2.0, 0]);
  const dongle = new THREE.Group(); dongle.add(at(box(0.024, 0.009, 0.014, M.white, 0.003), 0.058, 0.114, -0.016)); part('5G dongle', dongle, [1.4, 1.9, -0.3]);
  const hat = new THREE.Group(); hat.position.set(0, 0.125, 0); hat.add(box(0.07, 0.0016, 0.056, M.pcbGreen, 0.0007), at(box(0.022, 0.003, 0.03, M.silver), -0.004, 0.0025, 0.004), at(box(0.012, 0.0005, 0.012, M.chip), -0.004, 0.0043, 0.004));
  const flex = box(0.012, 0.0008, 0.022, new THREE.MeshStandardMaterial({ color: 0xd98a2b, roughness: 0.6 })); flex.position.set(-0.035, 0.002, -0.012); flex.rotation.z = 0.5; hat.add(flex);
  part('AI HAT+ (Hailo-8L)', hat, [0, 2.8, 0]);
  const cam = new THREE.Group(); cam.add(at(box(0.05, 0.006, 0.03, new THREE.MeshStandardMaterial({ color: 0xc8a171, roughness: 0.8 })), 0, -0.03, 0.06));
  const body = cyl(0.017, 0.017, 0.055, M.blackPlastic, 28); body.rotation.x = Math.PI / 2; body.position.set(0, -0.012, 0.075); cam.add(body);
  const lens = cyl(0.011, 0.011, 0.002, M.glass, 24); lens.rotation.x = Math.PI / 2; lens.position.set(0, -0.012, 0.103); cam.add(lens); cam.rotation.x = 0.25;
  part('Camera + mount', cam, [0, -0.3, 1.0]);
  const gear = new THREE.Group();
  [-1, 1].forEach((sx) => { [-1, 1].forEach((sz) => gear.add(tube([[sx * 0.035, 0, sz * 0.035], [sx * 0.07, -0.06, sz * 0.05], [sx * 0.105, -0.16, sz * 0.07], [sx * 0.11, -0.215, sz * 0.075]], 0.0045, M.carbon, 24)));
    const skid = cyl(0.005, 0.005, 0.24, M.carbon, 12); skid.rotation.x = Math.PI / 2; skid.position.set(sx * 0.11, -0.218, 0); gear.add(skid);
    [-1, 1].forEach((sz) => { const f = cyl(0.008, 0.008, 0.05, M.blackPlastic, 12); f.rotation.x = Math.PI / 2; f.position.set(sx * 0.11, -0.218, sz * 0.1); gear.add(f); const r = cyl(0.0085, 0.0085, 0.006, M.blue, 12); r.rotation.x = Math.PI / 2; r.position.set(sx * 0.11, -0.218, sz * 0.08); gear.add(r); }); });
  part('Landing gear', gear, [0, -1.0, 0]);
  const wires = new THREE.Group(); wires.add(tube([[0.03, 0.035, 0.02], [0.06, 0.06, 0.04], [0.12, 0.03, 0.12], [0.2, 0.03, 0.2]], 0.0016, new THREE.MeshStandardMaterial({ color: 0xc02020, roughness: 0.5 })), tube([[-0.03, 0.035, 0.02], [-0.07, 0.05, 0.05], [-0.13, 0.03, 0.13], [-0.2, 0.03, 0.2]], 0.0016, M.blue));
  const coil = []; for (let t = 0; t < 1; t += 0.01) coil.push([-0.06 + Math.cos(t * 30) * 0.012, t * 0.03, 0.05 + Math.sin(t * 30) * 0.012]); wires.add(tube(coil, 0.0012, new THREE.MeshStandardMaterial({ color: 0xe8e2d4, roughness: 0.6 }), 200));
  part('Wiring', wires, [0, 0, 0]);
  root.userData.parts = P; shadowAll(root); return root;
}

// ---------- lab bench ----------
const lab = new THREE.Group(); scene.add(lab);
const DESK_Y = 0.75;
lab.add(at(box(2.0, 0.04, 0.8, M.wood, 0.006), 0, DESK_Y - 0.02, 0));
[[-0.95, -0.35], [0.95, -0.35], [-0.95, 0.35], [0.95, 0.35]].forEach(([x, z]) => lab.add(at(box(0.04, DESK_Y - 0.04, 0.04, M.metal), x, (DESK_Y - 0.04) / 2, z)));
lab.add(at(new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.6, 0.06, 64), M.concrete), 0, -0.03, 0));
const screenTex = canvasTex(512, 300, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#1c2433'); gr.addColorStop(1, '#2d3b52'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = '#e9edf2'; g.fillRect(30, 30, 300, 200); g.fillStyle = '#2b2f36'; g.fillRect(30, 30, 300, 16); g.strokeStyle = '#c2410c'; g.lineWidth = 2; [[60, 110], [140, 80], [220, 150], [270, 100]].forEach(([x, y]) => g.strokeRect(x, y, 18, 36)); g.fillStyle = '#ddd'; g.font = '12px monospace'; ['GROUND STATION', 'survivors: 4', 'control: URLLC', 'video: eMBB'].forEach((s, i) => g.fillText(s, 350, 60 + i * 24)); });
const screenMat = new THREE.MeshStandardMaterial({ map: screenTex, emissive: 0xffffff, emissiveMap: screenTex, emissiveIntensity: 0.9 }); glowMats.push(screenMat);
const monitor = new THREE.Group(); monitor.add(at(box(0.56, 0.34, 0.025, M.blackPlastic, 0.008), 0, 0.25, 0), at(new THREE.Mesh(new THREE.PlaneGeometry(0.53, 0.31), screenMat), 0, 0.25, 0.0131), at(box(0.04, 0.12, 0.02, M.blackPlastic), 0, 0.06, -0.01), at(box(0.2, 0.012, 0.14, M.blackPlastic, 0.004), 0, 0.006, 0));
monitor.position.set(-0.6, DESK_Y, -0.18); monitor.rotation.y = 0.15; lab.add(monitor);
lab.add(at(box(0.44, 0.018, 0.14, M.blackPlastic, 0.004), -0.6, DESK_Y + 0.009, 0.15));
const pc = new THREE.Group(); pc.add(at(box(0.1, 0.32, 0.3, M.blackPlastic, 0.006), 0, 0.16, 0)); pc.position.set(-0.12, DESK_Y, -0.12); lab.add(pc);
const usrp = new THREE.Group(); usrp.add(at(box(0.16, 0.045, 0.1, M.white, 0.006), 0, 0.0225, 0)); [-0.04, 0.04].forEach((x) => { const a = cyl(0.005, 0.006, 0.17, M.blackPlastic, 10); a.position.set(x, 0.13, -0.035); a.rotation.z = x > 0 ? -0.08 : 0.08; usrp.add(a); }); usrp.position.set(0.12, DESK_Y, 0.12); lab.add(usrp);
const tx = new THREE.Group(); tx.add(at(box(0.18, 0.06, 0.12, M.blackPlastic, 0.015), 0, 0.03, 0), at(box(0.07, 0.002, 0.03, ledBlue), 0, 0.061, 0.03)); [-0.045, 0.045].forEach((x) => tx.add(at(cyl(0.003, 0.003, 0.03, M.silver, 8), x, 0.075, 0))); tx.position.set(0.35, DESK_Y, 0.25); tx.rotation.y = -0.4; lab.add(tx);
const demsTex = canvasTex(256, 160, (g, w, h) => { g.fillStyle = '#0d1b2a'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffd166'; g.beginPath(); g.arc(128, 80, 46, 0, 7); g.fill(); g.fillStyle = '#0d1b2a'; g.beginPath(); g.arc(110, 68, 6, 0, 7); g.arc(146, 68, 6, 0, 7); g.fill(); g.lineWidth = 6; g.strokeStyle = '#0d1b2a'; g.beginPath(); g.arc(128, 84, 24, 0.2, Math.PI - 0.2); g.stroke(); });
const demsMat = new THREE.MeshStandardMaterial({ map: demsTex, emissive: 0xffffff, emissiveMap: demsTex, emissiveIntensity: 0.9 }); glowMats.push(demsMat);
const dems = new THREE.Group(); dems.add(box(0.14, 0.004, 0.1, M.chip, 0.002)); const dsc = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.05), demsMat); dsc.rotation.x = -Math.PI / 2; dsc.position.y = 0.0045; dems.add(dsc); dems.position.set(-0.25, DESK_Y + 0.01, 0.28); dems.rotation.y = 0.2; lab.add(dems);
const thzTex = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#1b1d22'; g.fillRect(0, 0, w, h); g.fillStyle = '#d9a441'; const sq = (x, y, s, d) => { g.fillRect(x - s / 2, y - s / 2, s, s); if (d > 0) { g.fillStyle = '#1b1d22'; g.fillRect(x - s / 6, y - s / 2, s / 3, s); g.fillRect(x - s / 2, y - s / 6, s, s / 3); g.fillStyle = '#d9a441'; [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b]) => sq(x + a * s / 3, y + b * s / 3, s / 3.4, d - 1)); } }; sq(128, 128, 170, 2); });
const thz = new THREE.Group(); thz.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.003, 0.06), [M.chip, M.chip, new THREE.MeshStandardMaterial({ map: thzTex, metalness: 0.6, roughness: 0.35 }), M.chip, M.chip, M.chip]), 0, 0.0015, 0), tube([[0.08, 0, -0.04], [0.08, 0.16, -0.04], [0.03, 0.22, 0]], 0.004, M.metal));
const mag = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.004, 8, 32), M.metal); mag.position.y = 0.2; mag.rotation.x = Math.PI / 2; thz.add(mag); thz.position.set(-0.86, DESK_Y, -0.2); lab.add(thz);
const neFace = canvasTex(256, 160, (g, w, h) => { g.fillStyle = '#0a0a0a'; g.fillRect(0, 0, w, h); g.fillStyle = '#e8f2ff'; g.beginPath(); g.ellipse(90, 80, 22, 34, 0, 0, 7); g.ellipse(166, 80, 22, 34, 0, 0, 7); g.fill(); g.fillStyle = '#0a0a0a'; g.beginPath(); g.arc(90, 88, 12, 0, 7); g.arc(166, 88, 12, 0, 7); g.fill(); });
const neFaceMat = new THREE.MeshStandardMaterial({ map: neFace, emissive: 0xffffff, emissiveMap: neFace, emissiveIntensity: 0.8 }); glowMats.push(neFaceMat);
const nephele = new THREE.Group(); nephele.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.26, 0.95, 40), M.blackPlastic), 0, 0.475, 0)); const nfront = box(0.3, 0.6, 0.06, M.white, 0.02); nfront.position.set(0, 0.62, 0.17); nfront.rotation.x = -0.06; nephele.add(nfront);
const nhead = new THREE.Group(); nhead.position.y = 1.08; nhead.add(box(0.24, 0.17, 0.16, M.white, 0.02), at(new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.11), neFaceMat), 0, 0, 0.081)); nephele.add(nhead); nephele.position.set(-1.45, 0, -0.1); nephele.rotation.y = 0.5; lab.add(nephele);
const waterbot = new THREE.Group();
waterbot.add(at(new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.18, 0.6), new THREE.MeshPhysicalMaterial({ color: 0xcfe6ee, transparent: true, opacity: 0.35, roughness: 0.1 })), 0, 0.09, 0));
const water = new THREE.Mesh(new THREE.PlaneGeometry(0.98, 0.58, 40, 24), new THREE.MeshPhysicalMaterial({ color: 0x2a6f86, roughness: 0.15, transparent: true, opacity: 0.85 })); water.rotation.x = -Math.PI / 2; water.position.y = 0.14; waterbot.add(water);
const hullL = at(box(0.08, 0.07, 0.42, M.white, 0.02), -0.11, 0.16, 0), hullR = at(box(0.08, 0.07, 0.42, M.white, 0.02), 0.11, 0.16, 0); waterbot.add(hullL, hullR);
waterbot.add(at(box(0.3, 0.012, 0.3, new THREE.MeshStandardMaterial({ color: 0x8fb8d8, roughness: 0.4 })), 0, 0.2, 0));
const solar = box(0.28, 0.008, 0.2, new THREE.MeshPhysicalMaterial({ color: 0x14254a, roughness: 0.15, clearcoat: 1 })); solar.position.set(0, 0.26, -0.02); solar.rotation.x = -0.2; waterbot.add(solar);
waterbot.position.set(1.55, 0, 0.6); waterbot.rotation.y = -0.6; lab.add(waterbot);
const holo = new THREE.Group(); { const hm = new THREE.MeshBasicMaterial({ color: 0x9a4e25 }); for (let i = 0; i < 40; i++) holo.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.008, 6, 4), hm), (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.12, (Math.random() - 0.5) * 0.2)); }
holo.position.set(-0.6, DESK_Y + 0.68, -0.18); lab.add(holo);
shadowAll(lab);
const drone = buildDrone(); scene.add(drone); drone.rotation.order = 'YXZ';
const DRONE_HOME = new THREE.Vector3(0.62, DESK_Y + 0.222, -0.05); drone.position.copy(DRONE_HOME); drone.rotation.y = -0.5;

// ---------- the test field, painted into the terrain, that the field photo dissolves into ----------
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const PAD = V3(4.2, 0, 4.6);
// the photo was taken looking along one of the red front arms
const CAM_FWD = V3(1, 0, -1).normalize(), CAM_RIGHT = V3(1, 0, 1).normalize();
const FIELD_U = CAM_RIGHT.clone().addScaledVector(CAM_FWD, -0.7).normalize(), FIELD_V = V3(FIELD_U.z, 0, -FIELD_U.x);
const FIELD_C = PAD.clone().addScaledVector(CAM_FWD, 1.8), LINE_A = PAD.clone().addScaledVector(CAM_FWD, 2.0), LINE_B = PAD.clone().addScaledVector(CAM_FWD, 3.1).addScaledVector(FIELD_U, -2.6);
const turfTex = canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = '#2f62cf'; g.fillRect(0, 0, w, h);
  for (let y = 0; y < 17; y++) for (let x = 0; x < 17; x++) {
    const cx = (x + (y % 2) * 0.5) * (w / 16), cy = y * (h / 16);
    g.fillStyle = 'rgba(16,46,150,.8)'; g.beginPath(); g.arc(cx, cy, 3.4, 0, 7); g.fill();
    g.fillStyle = 'rgba(130,175,255,.25)'; g.fillRect(cx + 4, cy - 1, 6, 2);
  }
});
turfTex.wrapS = turfTex.wrapT = THREE.RepeatWrapping; turfTex.anisotropy = 8;


// ---------- terrain ----------
function hash(x, y) { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); }
function vnoise(x, y) { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; }
function fbm(x, y) { let f = 0, a = 0.5; for (let i = 0; i < 4; i++) { f += a * vnoise(x, y); x *= 2.03; y *= 2.03; a *= 0.5; } return f; }
function heightAt(x, z) { return (fbm(x * 0.06 + 3, z * 0.06 + 7) - 0.35) * 9 * THREE.MathUtils.smoothstep(Math.hypot(x, z), 4, 9) * THREE.MathUtils.smoothstep(Math.hypot(x - 5.5, z - 3.3), 9, 14) * THREE.MathUtils.smoothstep(Math.hypot((x + 1) * 0.8, z + 24), 11, 17) - 0.06; }
{
  const seg = mobile ? 140 : 220; const g = new THREE.PlaneGeometry(140, 140, seg, seg); g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position; for (let i = 0; i < pos.count; i++) pos.setY(i, heightAt(pos.getX(i), pos.getZ(i))); g.computeVertexNormals();
  terrainMat = new THREE.ShaderMaterial({
    uniforms: {
      uBase: { value: new THREE.Color(0xd9d2c3) }, uLine: { value: new THREE.Color(0xb59d82) }, uFog: { value: new THREE.Color(0xeeeae2) }, uSun: { value: new THREE.Vector3(4, 8, 5).normalize() },
      uTurf: { value: turfTex }, uField: { value: 0 }, uC: { value: new THREE.Vector2(FIELD_C.x, FIELD_C.z) }, uU: { value: new THREE.Vector2(FIELD_U.x, FIELD_U.z) }, uV: { value: new THREE.Vector2(FIELD_V.x, FIELD_V.z) },
      uA: { value: new THREE.Vector2(LINE_A.x, LINE_A.z) }, uB: { value: new THREE.Vector2(LINE_B.x, LINE_B.z) }, uBlob: { value: new THREE.Vector4(0, 0, 0, 0) }
    },
    vertexShader: 'varying float vH; varying vec3 vN; varying float vD; varying vec2 vW; void main(){ vH = position.y; vN = normal; vW = position.xz; vec4 mv = modelViewMatrix * vec4(position,1.0); vD = -mv.z; gl_Position = projectionMatrix * mv; }',
    fragmentShader: `uniform vec3 uBase; uniform vec3 uLine; uniform vec3 uFog; uniform vec3 uSun; uniform sampler2D uTurf; uniform float uField; uniform vec2 uC; uniform vec2 uU; uniform vec2 uV; uniform vec2 uA; uniform vec2 uB; uniform vec4 uBlob;
      varying float vH; varying vec3 vN; varying float vD; varying vec2 vW;
      float stripe(float d, float w){ float f = max(fwidth(d), 1e-4); return 1.0 - smoothstep(w - f, w + f, abs(d)); }
      void main(){
        float l = max(dot(normalize(vN), uSun), 0.0) * 0.55 + 0.55; float h = vH * 2.2;
        float line = 1.0 - min(abs(fract(h - 0.5) - 0.5) / max(fwidth(h), 1e-4), 1.0); float major = 1.0 - min(abs(fract(vH * 0.55 - 0.5) - 0.5) / max(fwidth(vH * 0.55), 1e-4), 1.0);
        vec3 c = mix(uBase * l, uLine, line * 0.55 + major * 0.35);
        if (uField > 0.5) {
          vec2 q = vW - uC; vec2 loc = vec2(dot(q, uU), dot(q, uV));
          float inF = 1.0 - smoothstep(5.6, 6.0, max(abs(loc.x), abs(loc.y)));
          vec3 turf = pow(texture2D(uTurf, vec2(dot(vW, uU), dot(vW, uV)) * 6.25).rgb, vec3(0.4545));
          float w = max(stripe(dot(vW - uA, uV), 0.045), stripe(dot(vW - uB, uU), 0.045) * step(0.0, dot(vW - uB, uV)));
          turf = mix(turf, vec3(0.93, 0.94, 0.96), w);
          float b = uBlob.w * (1.0 - smoothstep(0.0, uBlob.z, length(vW - uBlob.xy)));
          turf *= 1.0 - b;
          c = mix(c, turf * (0.92 + 0.1 * l), inF);
        }
        gl_FragColor = vec4(mix(c, uFog, smoothstep(14.0, 70.0, vD)), 1.0);
      }`
  });
  scene.add(at(new THREE.Mesh(g, terrainMat), 0, -0.065, 0));
}
const people = [];
[[6, -9], [7.2, -10.5], [8.4, -9.4], [11, -12.5], [5, -13], [9.5, -15]].forEach(([x, z], i) => {
  const p = new THREE.Group(); p.add(at(new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.9, 4, 8), new THREE.MeshStandardMaterial({ color: i % 2 ? 0x2b3a8c : 0x9a3b2e, roughness: 0.7 })), 0, 0.65, 0), at(new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 8), new THREE.MeshStandardMaterial({ color: 0x6b4a33 })), 0, 1.32, 0));
  p.scale.setScalar(0.75); p.position.set(x, heightAt(x, z) - 0.06, z); p.visible = false; shadowAll(p); scene.add(p); people.push(p);
});

// ---------- the 5G system architecture, placed in the world ----------
const arch = {};
{
  const gw = new THREE.Group(); gw.add(at(cyl(0.02, 0.02, 1.4, M.metal, 8), 0, 0.7, 0), at(cyl(0.09, 0.09, 0.26, M.white, 32), 0, 1.53, 0), at(cyl(0.07, 0.07, 0.01, M.chip, 32), 0, 1.665, 0));
  gw.position.set(1.8, 0, -1.3); scene.add(gw); arch.gateway = gw;
  const site = new THREE.Group(); site.position.set(-4.6, heightAt(-4.6, -4.2), -4.2);
  site.add(at(cyl(0.08, 0.14, 6.5, M.metal, 10), 0, 3.25, 0));
  const panel = new THREE.Group(); panel.position.set(0, 6.0, 0.2); panel.add(box(0.5, 1.0, 0.1, M.white, 0.02)); for (let k = 0; k < 4; k++) panel.add(at(box(0.42, 0.06, 0.012, M.chip), 0, 0.33 - k * 0.22, 0.056)); site.add(panel);
  const bbu = box(0.6, 0.9, 0.5, new THREE.MeshStandardMaterial({ color: 0xd8dade, roughness: 0.5, metalness: 0.3 }), 0.02); bbu.position.set(-1.0, 0.45, 0.5); site.add(bbu);
  const core = box(0.6, 1.2, 0.5, new THREE.MeshStandardMaterial({ color: 0x2b2d33, roughness: 0.5, metalness: 0.3 }), 0.02); core.position.set(1.2, 0.6, 0.5); site.add(core);
  site.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), ledGreen), 1.2, 1.05, 0.76));
  scene.add(site); shadowAll(site); arch.site = site; arch.rru = panel; arch.bbu = bbu; arch.core = core;
  const cloud = new THREE.Group(); const cm = new THREE.MeshStandardMaterial({ color: 0xf6f3ee, roughness: 0.9 });
  [[0, 0, 0, 0.55], [0.55, -0.1, 0.1, 0.42], [-0.55, -0.12, 0, 0.4], [0.25, 0.25, -0.1, 0.4], [-0.25, 0.2, 0.1, 0.38]].forEach(([x, y, z, r]) => cloud.add(at(new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), cm), x, y, z)));
  cloud.position.set(-1.6, 5.2, -5.2); scene.add(cloud); arch.cloud = cloud;
}
const wpos = (o, off) => { const v = new THREE.Vector3(); o.getWorldPosition(v); return off ? v.add(off) : v; };
const linkMat = new THREE.LineDashedMaterial({ color: 0x9a4e25, dashSize: 0.14, gapSize: 0.09, transparent: true, opacity: 0 });
const pktMat = new THREE.MeshBasicMaterial({ color: 0xd9733a, transparent: true, opacity: 0 });
const links = [], packets = [];
function makeLink(fa, fb, lift) {
  const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3());
  const line = new THREE.Line(new THREE.BufferGeometry(), linkMat); scene.add(line);
  for (let i = 0; i < 3; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), pktMat); s.userData = { curve, off: i / 3 }; s.visible = false; scene.add(s); packets.push(s); }
  links.push({ update() { const a = fa(), b = fb(); curve.v0.copy(a); curve.v2.copy(b); curve.v1.copy(a).lerp(b, 0.5); curve.v1.y += lift; line.geometry.setFromPoints(curve.getPoints(48)); line.computeLineDistances(); } });
}
const dongleW = () => wpos(drone.userData.parts['5G dongle'].children[0], new THREE.Vector3(0.058, 0.114, -0.016));
const gwW = () => wpos(arch.gateway, new THREE.Vector3(0, 1.6, 0)), rruW = () => wpos(arch.rru), bbuW = () => wpos(arch.bbu, new THREE.Vector3(0, 0.45, 0)), coreW = () => wpos(arch.core, new THREE.Vector3(0, 0.6, 0)), cloudW = () => wpos(arch.cloud), gsW = () => wpos(monitor, new THREE.Vector3(0, 0.45, 0));
makeLink(dongleW, gwW, 0.4); makeLink(gwW, rruW, 0.9); makeLink(rruW, bbuW, 0.1); makeLink(bbuW, coreW, 0.3); makeLink(coreW, cloudW, 1.2); makeLink(cloudW, gsW, 0.8); makeLink(coreW, gsW, 0.5);
// ---------- timeline pins ----------
const tlCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(3, 0, 2), new THREE.Vector3(8, 0, -2), new THREE.Vector3(10, 0, -8), new THREE.Vector3(6, 0, -13), new THREE.Vector3(0, 0, -12), new THREE.Vector3(-5, 0, -9), new THREE.Vector3(-9, 0, -3), new THREE.Vector3(-6, 0, 3)]);
const pins = TIMELINE.map((t, i) => { const p = tlCurve.getPoint(i / (TIMELINE.length - 1)); p.y = heightAt(p.x, p.z); const g = new THREE.Group(); g.add(at(cyl(0.03, 0.03, 1.2, M.metal, 8), 0, 0.6, 0), at(new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), hotMat), 0, 1.25, 0)); g.position.copy(p); g.visible = false; scene.add(g); return g; });
const tlLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(tlCurve.getPoints(200).map((p) => new THREE.Vector3(p.x, heightAt(p.x, p.z) + 0.08, p.z))), new THREE.LineDashedMaterial({ color: 0x9a4e25, dashSize: 0.3, gapSize: 0.2, transparent: true, opacity: 0 })); tlLine.computeLineDistances(); scene.add(tlLine);
