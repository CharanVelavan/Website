
// ===================== the engine: home chapters, and any project bay =====================
const homeOnly = [nephele, waterbot, holo, thz, dems, usrp];
const OBJ = { ba: [drone, V3(0, 0.2, 0)], ne: [nephele, V3(0, 1.3, 0)], sw: [holo, V3(0, 0.1, 0)], tz: [thz, V3(0, 0.26, 0)], or: [usrp, V3(0, 0.24, 0)], de: [dems, V3(0, 0.05, 0)], wb: [waterbot, V3(0, 0.38, 0)] };
const projectTags = PROJECTS.map((p) => { const el = mkTag(`${p.n}<b>${p.name}</b> <i>open →</i>`, 'tag link'); el.dataset.id = p.id; el.setAttribute('role', 'button'); el.tabIndex = -1; el.addEventListener('click', () => openProject(p.id, el)); return { id: p.id, el }; });
const pinTags = TIMELINE.map(([y, a, b, id]) => { const el = mkTag(`${y}<b>${a}</b> <i>${b}${id ? ' →' : ''}</i>`, id ? 'tag link' : 'tag'); if (id) el.addEventListener('click', () => openProject(id, el)); return el; });
// scope: only the open project's things stay in the world
function ensureBay(id) { const B = BAYS[id]; if (B && !B.built) { B.build(); B.objs.forEach((o) => { if (!o.parent) scene.add(o); }); B.built = true; if (lookDay !== null) tintWorld(lookDay ? PAL.L : PAL.D); } return B; }
function setScope() {
  homeOnly.forEach((o) => { o.visible = !route; });
  lab.visible = !route || route === 'ba'; drone.visible = !route || route === 'ba';
  Object.entries(BAYS).forEach(([id, B]) => B.objs.forEach((o) => { o.visible = route === id; }));
  terrainMat.uniforms.uField.value = route === 'ba' ? 1 : 0;
  people.forEach((p) => { p.visible = false; }); linkMat.opacity = 0; pktMat.opacity = 0; packets.forEach((s) => { s.visible = false; });
  hideTags(); setExplode(0);
}

// ===================== layout of the project view =====================
const homeSecs = [document.getElementById('top'), ...document.querySelectorAll('section.ch')];
const dotsEl = document.getElementById('dots');
homeSecs.forEach((s, i) => { const b = document.createElement('button'); b.className = 'dot'; b.type = 'button'; b.setAttribute('aria-label', i ? 'Chapter ' + i : 'Overview'); b.addEventListener('click', () => go(s.id)); dotsEl.appendChild(b); });
const dots = [...dotsEl.children];
const pphoto = document.getElementById('pphoto'), pcap = document.getElementById('pcap'), railEl = document.getElementById('rail'), pcardEl = document.getElementById('pcard'), ptick = document.getElementById('pticker'), plabel = document.getElementById('plabel'), chipsEl = document.getElementById('chips'), plate = document.getElementById('pplate'), ptrack = document.getElementById('ptrack'), rbody = document.getElementById('rbody'), spinHint = document.getElementById('spinhint');
try { history.scrollRestoration = 'manual'; } catch (e) {}
let T0 = 480, morphK = 0, shownTab = null, shownLabel = -1, shownHash = -1, selTab = 'overview', psecs = [];
const geomPhone = (k) => {
  const W = innerWidth, H = innerHeight, a = { x: 16, y: 60, w: W - 32, h: Math.round(H * 0.36), rt: 20, rb: 20 }, b = { x: 0, y: 0, w: W, h: Math.round(H * 0.38), rt: 0, rb: 22 };
  const p = mixRect(a, b, k); return { photo: p, shift: 0, chipsTop: p.y + p.h + 6 };
};
function geomDesk(k) {
  const W = innerWidth, H = innerHeight, pw = Math.min(1240, W - 64), ph = Math.min(720, H - 140), px = (W - pw) / 2, py = 70, lw = Math.round(pw * 0.46);
  return {
    photo: mixRect({ x: px + 10, y: py + 10, w: lw - 10, h: ph - 20, rt: 16, rb: 16 }, { x: 0, y: 0, w: W, h: H, rt: 0, rb: 0 }, k),
    rail: mixRect({ x: px + lw + 12, y: py + 6, w: pw - lw - 18, h: ph - 12 }, { x: W - 444, y: 70, w: 428, h: H - 86 }, k),
    card: { x: px, y: py, w: pw, h: ph }, tickerY: py + ph + 16, shift: k * 460
  };
}
function mixRect(a, b, k) { const o = {}; for (const key in a) o[key] = a[key] + (b[key] - a[key]) * k; return o; }
const placeRect = (el, r) => { el.style.left = r.x + 'px'; el.style.top = r.y + 'px'; el.style.width = r.w + 'px'; el.style.height = r.h + 'px'; };
function layoutProject() { T0 = Math.round(60 + innerHeight * 0.36 + 6 + 44 + 14); document.documentElement.style.setProperty('--T0', T0 + 'px'); }
const tabName = (C, k) => C.tabs.find((x) => x[0] === k)[1];
const pcard = (C, s, body) => `<div class="pc"><span class="eyebrow">${s.n} · ${tabName(C, s.tab)}</span><h2>${s.title}</h2><p>${s.line}</p>${body || ''}</div>`;
function renderProject(C) {
  pphoto.querySelector('img').src = `img/${C.photo}.webp`; pphoto.querySelector('img').style.objectPosition = C.pos;
  pcap.querySelector('.tg').textContent = C.tg; pcap.querySelector('strong').textContent = C.name; pcap.querySelector('.sb').textContent = C.sub;
  document.getElementById('crumb').textContent = `Work / ${C.n} / ${C.name}`;
  railEl.querySelector('[data-next]').textContent = `${CASES[C.next].short || CASES[C.next].name} →`; railEl.setAttribute('aria-label', `${C.name} case study`);
  const tabBtns = C.tabs.map(([k, n]) => `<button type="button" role="tab" id="tab-${k}" aria-controls="rbody" data-goto="${k}" aria-selected="${k === 'overview'}" tabindex="${k === 'overview' ? 0 : -1}">${n}</button>`).join('');
  document.getElementById('tabs').innerHTML = tabBtns; chipsEl.innerHTML = tabBtns.replace(/ role="tab" id="tab-\w+" aria-controls="rbody"/g, '');
  document.getElementById('ptick').innerHTML = C.tick.concat(C.tick).map((p) => `<span>${p}</span>`).join('');
  ptrack.innerHTML = C.secs.map((s) => `<section class="ps" id="ps-${s.id}" data-sec="${s.id}" style="--h:${s.h || 115}vh">${s.id === 'cs' ? `<div class="pintro">${H.tldr(C)}${H.assoc(C)}<div class="pcue">Scroll — the photo turns into 3D ↓</div></div>` : pcard(C, s, C.phone[s.id])}</section>`).join('');
  psecs = [...ptrack.querySelectorAll('.ps')]; armVideos(ptrack);
}
function open3D(id, fromEl, sec) {
  const from = fromEl && fromEl.getBoundingClientRect(), C = CASES[id];
  const prevB = route && BAYS[route]; if (prevB && prevB.leave) prevB.leave();
  route = id; cursor.classList.remove('on'); ensureBay(id); renderProject(C);
  document.body.classList.add('proj'); setScope(); layoutProject();
  help.hidden = true; selTab = 'overview'; shownTab = null; shownLabel = -1; shownHash = -1; spinYaw = 0; spinVel = 0;
  const i = sec ? C.secs.findIndex((s) => s.id === sec) : -1;
  scrollTo(0, i > 0 ? Math.max(0, secTarget(psecs[i])) : 0);
  readScroll(); smoothP = scrollP;
  if (BAYS[id].enter) BAYS[id].enter();
  if (from && from.width > 0 && !reduced) flyIn(from, C);
}
function close3D() {
  if (!route) return;
  const B = BAYS[route]; if (B.leave) B.leave();
  route = null; document.body.classList.remove('proj'); setScope(); snapDrone();
  canvas.style.clipPath = ''; spinHint.classList.remove('on'); ptrack.innerHTML = ''; psecs = [];
}
function flyIn(from, C) {
  const to = (narrow() ? geomPhone(0) : geomDesk(0)).photo;
  const c = document.createElement('img'); c.src = `img/${C.photo}.webp`; c.alt = ''; c.className = 'flyimg'; c.style.objectPosition = C.pos; document.body.appendChild(c);
  pphoto.style.visibility = 'hidden'; pcap.style.visibility = 'hidden';
  const r = (x) => ({ left: x.x + 'px', top: x.y + 'px', width: x.w + 'px', height: x.h + 'px' });
  const anim = c.animate([r({ x: from.left, y: from.top, w: from.width, h: from.height }), r(to)], { duration: 640, easing: 'cubic-bezier(.32,.72,0,1)', fill: 'forwards' });
  const done = () => { pphoto.style.visibility = ''; pcap.style.visibility = ''; c.remove(); };
  anim.onfinish = done; setTimeout(done, 900);
}
const secTarget = (s) => { const top = s.getBoundingClientRect().top + scrollY; return narrow() ? top - T0 : top - (innerHeight * 0.5 - s.offsetHeight * 0.5); };
function scrollToSec(s, instant) { if (s) scrollTo({ top: Math.max(0, secTarget(s)), behavior: instant ? 'auto' : smooth() }); }
function gotoSec(id) { const i = CASES[route].secs.findIndex((s) => s.id === id); if (i > 0) scrollToSec(psecs[i]); }
function gotoTab(tab) {
  track('tab', { id: route, tab });
  if (!narrow() && morphK < 0.5) { selTab = tab; return; }
  const secs = CASES[route].secs; scrollToSec(psecs.find((s, i) => secs[i].tab === tab && secs[i].id !== 'cs'));
}
function chapterStep(d) { const cur = Math.round(scrollP); scrollToSec(psecs[Math.max(0, Math.min(psecs.length - 1, cur + d))]); }

// ===================== scroll → progress =====================
let scrollP = 0, smoothP = 0;
function readScroll() {
  const H = innerHeight, phone = route && narrow();
  const secs = route ? psecs : homeSecs, line = phone ? T0 : H * 0.5; let p = 0;
  secs.forEach((s, i) => { const r = s.getBoundingClientRect(); if (r.top <= line + 0.5) p = i + Math.min(1, (line - r.top) / r.height); });
  scrollP = THREE.MathUtils.clamp(phone ? p : p - 0.5, 0, Math.max(0, secs.length - 1));
  document.getElementById('progress').style.transform = `scaleX(${Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight))})`;
}
addEventListener('scroll', readScroll, { passive: true });
function resize() { renderer.setSize(innerWidth, innerHeight, false); if (route) layoutProject(); readScroll(); }
addEventListener('resize', resize); resize(); applyTheme();
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
new MutationObserver(applyTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

// ===================== drag to turn, and phone tilt =====================
let spinYaw = 0, spinVel = 0, spinW = 0, dragging = null, tiltX = 0, tiltY = 0, tilt0 = null;
canvas.addEventListener('pointerdown', (e) => { if (!route || spinW < 0.5) return; dragging = { x: e.clientX, id: e.pointerId }; spinVel = 0; canvas.classList.add('grabbing'); });
addEventListener('pointermove', (e) => { if (!dragging || e.pointerId !== dragging.id) return; const dx = e.clientX - dragging.x; dragging.x = e.clientX; spinVel = -dx * 0.009; spinYaw += spinVel; if (Math.abs(dx) > 2 && !dragging.told) { dragging.told = 1; track('spin', { id: route }); } });
const endDrag = () => { dragging = null; canvas.classList.remove('grabbing'); };
addEventListener('pointerup', endDrag); addEventListener('pointercancel', endDrag);
// phone tilt nudges the camera a little; Android sends it freely, iOS asks once on the first tap
addEventListener('deviceorientation', (e) => {
  if (e.gamma == null || !narrow()) return;
  if (!tilt0) tilt0 = { g: e.gamma, b: e.beta };
  tilt0.g += (e.gamma - tilt0.g) * 0.01; tilt0.b += (e.beta - tilt0.b) * 0.01; // slowly re-centre
  tiltX = THREE.MathUtils.clamp((e.gamma - tilt0.g) / 25, -1, 1); tiltY = THREE.MathUtils.clamp((e.beta - tilt0.b) / 25, -1, 1);
});
addEventListener('pointerdown', function askTilt() {
  removeEventListener('pointerdown', askTilt);
  if (window.DeviceOrientationEvent && DeviceOrientationEvent.requestPermission && narrow()) DeviceOrientationEvent.requestPermission().catch(() => {});
}, { once: true });

// ===================== home: the lab, the flight path, contact =====================
const LAB_FAR = mobile ? { pos: V3(1.4, 3.0, 6.2), look: V3(-0.1, 0.7, 0) } : { pos: V3(2.6, 2.4, 4.6), look: V3(-0.15, 0.8, 0) };
const LAB = mobile ? { pos: V3(0.9, 2.1, 4.4), look: V3(-0.1, 0.75, 0) } : { pos: V3(1.6, 1.75, 3.1), look: V3(-0.15, 0.8, 0) };
function homeKey(i) {
  if (narrow()) switch (i) {
    case 0: return { pos: V3(1.2, 3.4, 7.6), look: V3(0, 0.7, 0) };
    case 1: return { pos: V3(0.1, 3.3, 7.0), look: V3(0.05, 0.6, 0.2) };
    case 2: return { pos: V3(2, 34, 24), look: V3(0, 0, -5) };
    default: return { pos: V3(0.55, 2.1, 3.3), look: V3(-0.4, 0.9, -0.1) };
  }
  switch (i) {
    case 0: return { pos: LAB_FAR.pos.clone(), look: LAB_FAR.look.clone() };
    case 1: return { pos: LAB.pos.clone(), look: LAB.look.clone() };
    case 2: return { pos: V3(2, 26, 16), look: V3(0, 0, -5) };
    default: return mobile ? { pos: V3(0.2, 1.5, 1.9), look: V3(-0.4, 0.95, -0.1) } : { pos: V3(0.5, 1.35, 1.5), look: V3(-0.45, 0.95, -0.15) };
  }
}
// shift moves the picture's centre left (desktop rail); shiftY moves it up (phone chapter cards)
function setView(r, shift, fov, shiftY = 0) {
  view = r; const H = innerHeight;
  renderer.setViewport(r.x, H - r.y - r.h, r.w, r.h); renderer.setScissor(r.x, H - r.y - r.h, r.w, r.h); renderer.setScissorTest(true);
  // widen the lens with the vertical shift so the visible slice keeps the same field of view
  camera.fov = shiftY > 0.5 ? THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(fov / 2)) * (r.h + shiftY) / r.h)) : fov; camera.aspect = (r.w + shift) / (r.h + shiftY);
  if (shift > 0.5 || shiftY > 0.5) camera.setViewOffset(r.w + shift, r.h + shiftY, shift, shiftY, r.w, r.h); else camera.clearViewOffset();
  camera.updateProjectionMatrix();
}
const veil = document.getElementById('veil'), aside = document.querySelector('.aside');
let visible = true; document.addEventListener('visibilitychange', () => { visible = !document.hidden; });

function homeFrame(dt, t, sp) {
  const n = homeSecs.length, i = Math.min(Math.floor(sp), n - 2), f = ease(sp - i), ch = Math.round(sp);
  dots.forEach((d, k) => d.setAttribute('aria-current', String(k === ch)));
  // hero → lab: the veil lifts and each tile flies to its object
  const lift = THREE.MathUtils.clamp(sp / 0.9, 0, 1), e = ease(lift);
  veil.style.opacity = String(1 - e); aside.style.opacity = String(1 - e);
  bento.querySelectorAll('.cell').forEach((c) => {
    const id = c.dataset.id, o = OBJ[id], base = heroRects[id];
    if (lift < 0.01 || sp > 1.2 || !base) { c.style.transform = ''; c.style.opacity = ''; return; }
    if (!o) { c.style.opacity = String(1 - e); c.style.transform = `scale(${1 - 0.2 * e})`; return; }
    const target = project(wpos(o[0], o[1])), cy = base.y - scrollY;
    c.style.transform = `translate(${(target.x - base.x) * e}px, ${(target.y - cy) * e}px) scale(${1 - 0.86 * e})`; c.style.opacity = String(1 - e * e);
  });
  // the drone rests on the bench
  drone.position.copy(DRONE_HOME); drone.rotation.set(0, -0.5, 0); setExplode(0); spinProps(dt, 0.06);
  const phone = narrow();
  setView({ x: 0, y: 0, w: innerWidth, h: innerHeight }, 0, phone ? 60 : 38, phone ? innerHeight * 0.44 * clamp01((sp - 0.3) / 0.5) : 0);
  const a = homeKey(i), b = homeKey(i + 1);
  camera.position.lerpVectors(a.pos, b.pos, f); const look = a.look.clone().lerp(b.look, f);
  if (!reduced) camera.position.y += Math.sin(t * 0.4) * 0.01;
  camera.lookAt(look); camera.updateMatrixWorld();
  // ambient life on the bench
  nhead.rotation.y = Math.sin(t * 0.6) * 0.35; holo.rotation.y = t * 0.3;
  const wpA = water.geometry.attributes.position; for (let k = 0; k < wpA.count; k++) wpA.setZ(k, Math.sin(wpA.getX(k) * 14 + t * 2) * 0.004 + Math.cos(wpA.getY(k) * 11 + t * 1.6) * 0.003); wpA.needsUpdate = true;
  hullL.position.y = hullR.position.y = 0.16 + Math.sin(t * 1.4) * 0.006;
  // timeline: pins light up in order, and each one opens its project
  const tl = THREE.MathUtils.clamp((sp - 1.6) / 0.9, 0, 1), tlOn = sp > 1.5 && sp < 2.6;
  tlLine.material.opacity = tlOn ? 1 : 0;
  pins.forEach((p, k) => { const lit = tlOn && tl >= k / (pins.length - 1) - 0.02; p.visible = lit; place(pinTags[k], wpos(p, V3(0, 1.45, 0)), lit); pinTags[k].style.pointerEvents = lit ? 'auto' : 'none'; });
  // lab labels are the doors into each project
  const labTags = sp > 0.75 && sp < 1.45;
  projectTags.forEach((pt) => { const o = OBJ[pt.id]; place(pt.el, wpos(o[0], o[1]), labTags); pt.el.style.pointerEvents = labTags ? 'auto' : 'none'; });
  sun.position.set(4, 8, 5); sun.target.position.set(0, 0, 0); sun.target.updateMatrixWorld();
  setLook(!darkTheme);
  Sound.update({ hum: 0, ticks: 0, water: 0 }, t);
}

// ===================== a project: the case study morphs into its 3D bay =====================
function keyAt(B, i, tt, phone) {
  const k = B.key(i, tt);
  if (phone && (B.phoneZoom || 1.35) !== 1) k.pos = k.look.clone().add(k.pos.clone().sub(k.look).multiplyScalar(B.phoneZoom || 1.35));
  return k;
}
function projectFrame(dt, t, sp) {
  const C = CASES[route], B = BAYS[route], secs = C.secs, n = secs.length, ch = THREE.MathUtils.clamp(Math.round(sp), 0, n - 1), phone = narrow(), W = innerWidth, H = innerHeight;
  // morph: the case-study photo dissolves into the live scene, then the panel opens out
  const m = clamp01(sp), photoA = 1 - smoothstep(m, 0.1, 0.42);
  const kG = ease(clamp01(phone ? (m - 0.12) / 0.78 : (m - 0.3) / 0.6)); morphK = kG;
  const g = phone ? geomPhone(kG) : geomDesk(kG), r = g.photo;
  placeRect(pphoto, r); pphoto.style.borderRadius = `${r.rt}px ${r.rt}px ${r.rb}px ${r.rb}px`; pphoto.style.opacity = photoA;
  placeRect(pcap, r); pcap.style.borderRadius = pphoto.style.borderRadius; pcap.style.opacity = 1 - clamp01(kG * 2.6);
  canvas.style.clipPath = `inset(${r.y}px ${W - r.x - r.w}px ${H - r.y - r.h}px ${r.x}px round ${r.rt}px ${r.rt}px ${r.rb}px ${r.rb}px)`;
  if (phone) { chipsEl.style.top = g.chipsTop + 'px'; plate.style.height = g.chipsTop + 44 + 'px'; }
  else {
    placeRect(railEl, g.rail); railEl.style.setProperty('--ra', kG.toFixed(3));
    placeRect(pcardEl, g.card); pcardEl.style.opacity = 1 - clamp01(kG * 1.7);
    ptick.style.top = g.tickerY + 'px'; ptick.style.opacity = 1 - clamp01(kG * 3);
  }
  // tabs: picked by hand in the case study, driven by scroll once in 3D
  const tab = !phone && kG < 0.5 ? selTab : secs[ch].tab;
  if (tab !== shownTab) {
    shownTab = tab; rbody.innerHTML = C.html[tab]; rbody.scrollTop = 0; rbody.classList.remove('swap'); void rbody.offsetWidth; rbody.classList.add('swap'); armVideos(rbody);
    rbody.setAttribute('aria-labelledby', 'tab-' + tab);
    document.querySelectorAll('[data-goto]').forEach((b) => { const on = b.dataset.goto === tab; b.setAttribute('aria-selected', String(on)); if (b.getAttribute('role') === 'tab') b.tabIndex = on ? 0 : -1; });
    const chip = chipsEl.querySelector(`[data-goto="${tab}"]`); if (chip && phone) chipsEl.scrollTo({ left: chip.offsetLeft - 12, behavior: 'smooth' });
  }
  if (!phone) {
    if (ch !== shownLabel && ch > 0) { shownLabel = ch; const s = secs[ch]; plabel.children[0].textContent = `${s.n} · ${tabName(C, s.tab)}`; plabel.children[1].innerHTML = s.title; plabel.children[2].textContent = s.line; }
    plabel.style.opacity = ch > 0 ? clamp01((kG - 0.85) / 0.15) : 0;
  }
  if (ch !== shownHash) { shownHash = ch; try { history.replaceState(history.state, '', C.route + (ch > 0 ? '/' + secs[ch].id : '')); } catch (e) {} if (ch > 0) track('chapter', { id: route, sec: secs[ch].id }); }

  const ctx = { m, kG, phone, ch };
  B.update(dt, t, sp, ctx);
  // camera: holds the photo's angle until the photo has dissolved
  const i = Math.min(Math.floor(sp), n - 2);
  let f = ease(sp - i);
  if (i === 0) f = ease(clamp01((m - 0.4) / 0.6));
  if (B.remap) f = B.remap(i, sp, f);
  const a = keyAt(B, i, sp - i, phone), b = keyAt(B, i + 1, 0, phone);
  camera.position.lerpVectors(a.pos, b.pos, f); const look = a.look.clone().lerp(b.look, f);
  // drag to turn: orbit the look point in chapters that allow it, easing back elsewhere
  const canSpin = !!secs[ch].spin && kG > 0.9;
  spinW += ((canSpin ? 1 : 0) - spinW) * Math.min(1, dt * 4);
  if (!dragging) { spinYaw += spinVel; spinVel *= 0.92; if (!canSpin) spinYaw *= 1 - Math.min(1, dt * 3); }
  if (Math.abs(spinYaw * spinW) > 1e-4) camera.position.sub(look).applyAxisAngle(V3(0, 1, 0), spinYaw * spinW).add(look);
  spinHint.classList.toggle('on', canSpin && Math.abs(spinYaw) < 0.05 && !reduced);
  if (canSpin) { spinHint.style.left = r.x + (r.w - g.shift) / 2 + 'px'; spinHint.style.top = r.y + r.h - (phone ? 34 : 64) + 'px'; }
  canvas.classList.toggle('spin', canSpin);
  // phone tilt: a small parallax around the look point
  if (phone && (tiltX || tiltY) && !reduced && sp > 0.5) { const rgt = V3().subVectors(camera.position, look).cross(V3(0, 1, 0)).normalize(), d = camera.position.distanceTo(look); camera.position.addScaledVector(rgt, -tiltX * d * 0.06).add(V3(0, tiltY * d * 0.04, 0)); }
  if (!reduced && sp > 0.4) camera.position.y += Math.sin(t * 0.4) * 0.01;
  setView(r, g.shift, phone ? 38 + 8 * kG : 38);
  camera.near = B.near ? B.near(sp) : 0.03; camera.updateProjectionMatrix();
  camera.lookAt(look); camera.updateMatrixWorld();
  if (!B.sunFollows) { sun.target.position.copy(STUDIO); sun.position.copy(STUDIO).add(V3(4, 7, 3)); sun.target.updateMatrixWorld(); }
  setLook(!!B.day || !darkTheme);
  if (B.fog) { scene.fog.near = B.fog[0]; scene.fog.far = B.fog[1]; }
  B.overlay(t, sp, ctx);
  Sound.update(B.audio ? B.audio(sp) : {}, t);
}

function frame() {
  requestAnimationFrame(frame);
  if (!visible) return;
  const rawDt = clock.getDelta(), dt = Math.min(rawDt, 0.05), t = clock.elapsedTime;
  smoothP += (scrollP - smoothP) * (reduced ? 1 : Math.min(1, rawDt * 4)); window.__p = smoothP;
  if (route) projectFrame(dt, t, smoothP); else homeFrame(dt, t, smoothP);
  cullTags();
  renderer.render(scene, camera);
}
const clock = new THREE.Clock();
palHooks.push(applyTheme);
setScope();
worldReady = true;
{ const r = parseRoute(location.hash); if (r) openProject(r.id, null, r.sec, 'none'); else if (pendingOpen) openProject(...pendingOpen); }
snapDrone();
frame();
