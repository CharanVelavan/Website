
// ===================== Bird's AI: the field, the flight and the 5G architecture =====================
const PAD_DRONE = PAD.clone().add(V3(0, 0.1, 0)), PAD_HOVER = PAD_DRONE.clone().add(V3(0, 0.55, 0));
const YAW_PAD = 0;
const PHOTO_OFF = V3(-1.07, 0.77, 1.07), PHOTO_LOOK = V3(0, 0.03, 0);
const hailoWorld = () => wpos(drone.userData.parts['AI HAT+ (Hailo-8L)'].children[0], V3(-0.004, 0.006, 0.004));
// the flight is a function of scroll, so scrolling back always retraces it
const HOVER_P = V3(0.5, 2.4, 0.9), S0 = V3(8.2, 6.8, -11), S1 = V3(9.6, 6.8, -13.6);
const toArch = new THREE.CatmullRomCurve3([PAD_HOVER.clone(), PAD_HOVER.clone().add(V3(-0.2, 0.8, -0.3)), V3(1.6, 2.1, 1.9), HOVER_P.clone()]);
const toSearch = new THREE.CatmullRomCurve3([HOVER_P.clone(), V3(3, 4.5, -4), V3(6.5, 6.5, -8.5), S0.clone()]);
const toPad = new THREE.CatmullRomCurve3([S1.clone(), V3(7, 5.6, -4), V3(4.6, 2.6, 1.8), PAD_HOVER.clone()]);
function dronePosAt(sp) {
  if (sp < 0.45) return PAD_DRONE.clone();
  if (sp < 1.0) return PAD_DRONE.clone().lerp(PAD_HOVER, ease((sp - 0.45) / 0.55));
  if (sp < 3.45) return PAD_HOVER.clone();
  if (sp < 4.0) return toArch.getPoint(ease((sp - 3.45) / 0.55));
  if (sp < 4.45) return HOVER_P.clone();
  if (sp < 5.0) return toSearch.getPoint(ease((sp - 4.45) / 0.55));
  if (sp < 5.4) return S0.clone().lerp(S1, (sp - 5.0) / 0.4);
  if (sp < 5.8) return toPad.getPoint(ease((sp - 5.4) / 0.4));
  if (sp < 6.0) return PAD_HOVER.clone().lerp(PAD_DRONE, ease((sp - 5.8) / 0.2));
  return PAD_DRONE.clone();
}
// heading comes from horizontal travel only (never lookAt), so a vertical climb can't flip the drone
function yawTarget(sp) {
  const a = dronePosAt(sp), b = dronePosAt(sp + 0.015), dx = b.x - a.x, dz = b.z - a.z;
  if (dx * dx + dz * dz > 1e-7) return Math.atan2(dx, dz);
  return sp < 3.45 || sp > 5.75 ? YAW_PAD : null;
}
const wrapPi = (a) => Math.atan2(Math.sin(a), Math.cos(a));
let droneYaw = YAW_PAD, dronePitch = 0, droneRoll = 0; const prevD = PAD_DRONE.clone();
function snapDrone() { droneYaw = route === 'ba' ? YAW_PAD : -0.5; dronePitch = droneRoll = 0; prevD.copy(route === 'ba' ? dronePosAt(smoothP) : DRONE_HOME); }
function setExplode(x) { Object.values(drone.userData.parts).forEach((g) => g.position.copy(g.userData.dir).multiplyScalar(x * 0.11)); }
function spinProps(dt, spin) { drone.traverse((c) => { if (c.name === 'prop') c.rotation.y += dt * (reduced ? 0 : 60 * spin); }); }

BAYS.ba = {
  objs: [arch.gateway, arch.site, arch.cloud], day: true, phoneZoom: 1, linkOn: 0, airborne: 0,
  build() {
    this.partTags = Object.entries(drone.userData.parts).filter(([k]) => !/^Arm|^Motor [234]|Wiring|Frame/.test(k)).map(([k, g]) => ({ k, g, el: mkTag(`<b>${k.replace('Motor 1', 'DJI motor + prop guard')}</b>`) }));
    this.hailoTag = mkTag('<b>Hailo-8L accelerator</b> <i>AI HAT+ on Raspberry Pi 5</i>');
    this.detTags = people.map((p) => ({ p, el: mkTag(`<span>survivor ${(0.88 + hash(p.position.x, p.position.z) * 0.1).toFixed(2)}</span>`, 'det') }));
    this.archTags = Object.fromEntries(ARCH.map(([k, n, s]) => [k, mkTag(`<b>${n}</b> <i>${k === 'cloud' ? 'S3 · Pushbullet alerts' : k === 'dongle' ? 'Pi 5 + Hailo on the drone' : s}</i>`)]));
    // live detection replay: the real camera feed from the 25 m run, on a screen beside the drone
    const v = document.createElement('video'); v.src = 'media/ba-clip.' + VEXT; v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'none'; this.video = v;
    const vt = new THREE.VideoTexture(v); vt.colorSpace = THREE.SRGBColorSpace;
    const head = textTex(512, 48, (g, w, h) => { g.fillStyle = '#15161a'; g.fillRect(0, 0, w, h); g.fillStyle = '#ff5a4e'; g.beginPath(); g.arc(22, 24, 7, 0, 7); g.fill(); g.fillStyle = '#e8e3d9'; g.font = '20px ui-monospace, Menlo, monospace'; g.fillText('CAM 01 · LIVE  ·  YOLOv8 on Hailo-8L  ·  25 m', 40, 31); });
    const feed = new THREE.Group();
    feed.add(at(box(1.66, 1.02, 0.03, M.blackPlastic, 0.02), 0, 0, -0.02));
    feed.add(at(plane(1.6, 0.9, new THREE.MeshBasicMaterial({ map: vt, toneMapped: false })), 0, -0.04, 0));
    feed.add(at(plane(1.6, 0.09, new THREE.MeshBasicMaterial({ map: head, toneMapped: false })), 0, 0.455, 0.001));
    feed.visible = false; scene.add(feed); this.feed = feed;
  },
  enter() { snapDrone(); },
  leave() { this.video.pause(); this.feed.visible = false; },
  remap(i, sp, f) { return i === 5 ? ease(clamp01((sp - 5.4) / 0.5)) : f; },
  near(sp) { return sp > 1.4 && sp < 2.6 ? 0.005 : 0.03; },
  key(i, tt) {
    switch (i) {
      case 0: return { pos: PAD_DRONE.clone().add(PHOTO_OFF), look: PAD_DRONE.clone().add(PHOTO_LOOK) };
      case 1: return { pos: PAD_HOVER.clone().add(mobile ? V3(-1.5, 0.5, 1.9) : V3(-1.3, 0.42, 1.6)), look: PAD_HOVER.clone().add(V3(0, -0.06, 0)) };
      case 2: { const h = hailoWorld(); return { pos: h.clone().add(V3(-0.1, 0.075, 0.12)), look: h }; }
      case 3: { const D = drone.position, a = -0.75 + tt * 1.6, r = narrow() ? 1.75 : 1.2; return { pos: V3(D.x + Math.sin(a) * r, D.y + (narrow() ? 0.5 : 0.42), D.z + Math.cos(a) * r), look: D.clone().add(V3(0, narrow() ? 0.2 : 0.12, 0)) }; }
      case 4: return mobile ? { pos: V3(5.4, 4.6, 11.4), look: V3(-1.6, 2.6, -2.6) } : { pos: V3(5.2, 3.4, 8.4), look: V3(-1.6, 2.5, -2.6) };
      case 5: { const D = drone.position; return { pos: D.clone().add(V3(-3.2, 2.2, 4.2)), look: D.clone().add(V3(1.5, -2.5, -4)) }; }
      case 6: return { pos: PAD_DRONE.clone().add(mobile ? V3(-1.6, 1.0, 2.4) : V3(-1.25, 0.75, 1.95)), look: PAD_DRONE.clone().add(V3(0, 0.02, 0)) };
      default: return mobile ? { pos: V3(7.2, 3.6, 10.2), look: V3(1.0, 0.7, 1.2) } : { pos: V3(6.6, 2.8, 8.2), look: V3(1.2, 0.75, 1.3) };
    }
  },
  update(dt, t, sp, ctx) {
    // drone: position from the flight plan, heading from travel, gentle tilt from speed
    const explode = sp < 2.55 ? 0 : sp < 3.45 ? ease(Math.min(1, (sp - 2.55) / 0.4)) * (sp < 3.2 ? 1 : 1 - ease((sp - 3.2) / 0.25)) : 0;
    const D = dronePosAt(sp); if (!reduced && sp > 0.95 && sp < 5.8 && explode === 0) D.y += Math.sin(t * 1.6) * 0.015;
    drone.position.copy(D);
    const yt = yawTarget(sp), k = Math.min(1, dt * 5), prevYaw = droneYaw;
    if (yt !== null) droneYaw = wrapPi(droneYaw + wrapPi(yt - droneYaw) * k);
    const hs = Math.hypot(D.x - prevD.x, D.z - prevD.z) / Math.max(dt, 1e-3); prevD.copy(D);
    dronePitch += (Math.min(0.26, hs * 0.035) - dronePitch) * Math.min(1, dt * 4);
    droneRoll += (THREE.MathUtils.clamp(-wrapPi(droneYaw - prevYaw) / Math.max(dt, 1e-3) * 0.08, -0.3, 0.3) - droneRoll) * Math.min(1, dt * 4);
    drone.rotation.set(dronePitch, droneYaw, droneRoll + (reduced ? 0 : Math.sin(t * 1.3) * 0.02 * clamp01((sp - 0.9) * 4)));
    setExplode(explode); this.explode = explode;
    const airborne = sp > 0.45 && sp < 6.0, m = ctx.m;
    const spin = explode > 0 ? 0.25 : sp > 1.6 && sp < 2.5 ? 0.12 : airborne ? 1 : m < 1 ? 0.04 + 0.9 * smoothstep(m, 0.15, 0.45) : 0.03;
    spinProps(dt, spin); this.airborne = spin;
    const pxLed = drone.getObjectByName('pxLed'); if (pxLed) pxLed.visible = Math.sin(t * 6) > -0.2;
    Object.entries(drone.userData.parts).forEach(([key, gp]) => { gp.children[0].scale.setScalar(hotPart === key ? 1.25 + Math.sin(t * 6) * 0.05 : 1); });
    const ht = D.y - PAD_DRONE.y; terrainMat.uniforms.uBlob.value.set(D.x - 0.06 - ht * 0.15, D.z + 0.02, 0.3 + ht * 0.3, (0.62 - Math.min(0.2, ht * 0.3)) * clamp01(1 - ht / 2.5));
    // architecture: links and packets light up in that chapter
    const linkOn = clamp01(1 - Math.abs(sp - 4.2) * 1.8); this.linkOn = linkOn;
    if (linkOn > 0.01) links.forEach((l) => l.update());
    linkMat.opacity = linkOn; pktMat.opacity = linkOn;
    packets.forEach((s) => { s.visible = linkOn > 0.02; if (s.visible) s.position.copy(s.userData.curve.getPoint((s.userData.off + t * 0.35) % 1)); });
    ['gateway', 'rru', 'bbu', 'core', 'cloud'].forEach((key) => { arch[key].scale.setScalar(hotNode === key || (key === 'cloud' && hotNode === 'push') ? 1.15 + Math.sin(t * 6) * 0.04 : 1); });
    drone.userData.parts['5G dongle'].children[0].scale.setScalar(hotNode === 'dongle' || hotPart === '5G dongle' ? 2.2 : 1);
    monitor.scale.setScalar(hotNode === 'gs' ? 1.12 : 1);
    people.forEach((p) => { p.visible = sp > 4.7 && sp < 5.7; });
    // daylight that matches the photo, with the sun's shadow following the drone
    sun.target.position.copy(D).setY(0); sun.position.copy(sun.target.position).add(V3(5, 6.5, 0.6)); sun.target.updateMatrixWorld();
  },
  overlay(t, sp) {
    place(this.hailoTag, hailoWorld().add(V3(0, 0.006, 0)), sp > 1.7 && sp < 2.35);
    const showParts = this.explode > 0.6;
    this.partTags.forEach((p) => { const bb = new THREE.Box3().setFromObject(p.g), v = bb.getCenter(new THREE.Vector3()); v.y = bb.max.y + 0.01; place(p.el, v, showParts); p.el.classList.toggle('hot', hotPart === p.k); });
    const det = sp > 4.85 && sp < 5.55;
    this.detTags.forEach((d) => { const a2 = project(d.p.position), b2 = project(d.p.position.clone().add(V3(0, 1.1, 0))); const h = Math.max(8, a2.y - b2.y); d.el.style.width = Math.max(6, h * 0.45) + 'px'; d.el.style.height = h + 'px'; d.el.style.transform = `translate(${a2.x}px, ${a2.y}px) translate(-50%, -100%)`; d.el.style.opacity = det && a2.vis ? 1 : 0; });
    const right = V3().setFromMatrixColumn(camera.matrixWorld, 0), up = V3().setFromMatrixColumn(camera.matrixWorld, 1);
    const archPos = { dongle: () => drone.position.clone().add(V3(0, 0.22, 0)).add(right.clone().multiplyScalar(narrow() ? 0.3 : 0.9)), gateway: () => wpos(arch.gateway, V3(0, 1.75, 0)), rru: () => wpos(arch.rru, V3(0, 0.6, 0)), bbu: () => wpos(arch.bbu, V3(0, 0.5, 0)), core: () => wpos(arch.core, V3(0, 0.7, 0)), cloud: () => wpos(arch.cloud, V3(0, 0.7, 0)), gs: () => wpos(monitor, V3(0, 0.5, 0)) };
    Object.entries(this.archTags).forEach(([key, el]) => { place(el, archPos[key](), this.linkOn > 0.6); el.classList.toggle('hot', hotNode === key || (hotNode === 'push' && key === 'cloud')); });
    // the camera feed screen: beside the drone, facing the camera, only while searching
    const feedOn = sp > 4.75 && sp < 5.75, f = this.feed;
    f.visible = feedOn;
    if (feedOn) {
      const k = ease(clamp01(Math.min((sp - 4.75) / 0.2, (5.75 - sp) / 0.2)));
      f.position.copy(drone.position).add(right.multiplyScalar(narrow() ? 1.25 : -1.75)).add(up.multiplyScalar(narrow() ? 0.15 : 0.35)); f.quaternion.copy(camera.quaternion); f.scale.setScalar(k * (narrow() ? 0.85 : 1));
      if (this.video.paused) this.video.play().catch(() => {});
    } else if (!this.video.paused) this.video.pause();
  },
  audio(sp) { return { hum: this.airborne, pitch: 1.25, ticks: this.linkOn }; }
};
