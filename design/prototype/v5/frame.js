
// ===================== the engine: home chapters, and any project bay =====================
const homeOnly = [ring];
// where each grid tile flies to as the hero dissolves: its object on the ring (Bird's AI: the drone on the bench)
const OBJ = Object.fromEntries(plinths.filter((p) => CASES[p.id]).map((p) => [p.id, [p.holder, V3(0, p.top - p.h, 0)]])); OBJ.ba = [drone, V3(0, 0.2, 0)];
// one label, on the front plinth only: its name and the way in
const ringTags = plinths.map((p) => {
  const open = !!CASES[p.id], el = mkTag(`<b>${p.name}</b> <i>${open ? 'Open →' : p.soon ? 'Case study soon' : ''}</i>`, open ? 'tag link front' : 'tag front');
  if (open) { el.dataset.id = p.id; el.setAttribute('role', 'button'); el.addEventListener('click', () => openProject(p.id, el)); }
  return el;
});
const pinTags = TIMELINE.map(([y, a, b, id]) => { const el = mkTag(`${y}<b>${a}</b> <i>${b}${id ? ' →' : ''}</i>`, id ? 'tag link' : 'tag'); if (id) el.addEventListener('click', () => openProject(id, el)); return el; });
// scope: only the open project's things stay in the world
function ensureBay(id) { const B = BAYS[id]; if (B && !B.built) { B.build(); B.objs.forEach((o) => { if (!o.parent) scene.add(o); }); B.built = true; if (lookDay !== null) tintWorld(world3D(!lookDay)); } return B; }
function setScope() {
  homeOnly.forEach((o) => { o.visible = !route; }); arch.gateway.visible = route === 'ba';
  lab.visible = !route || route === 'ba'; drone.visible = !route || route === 'ba';
  Object.entries(BAYS).forEach(([id, B]) => B.objs.forEach((o) => { o.visible = route === id; }));
  terrainMat.uniforms.uField.value = route === 'ba' ? 1 : 0;
  people.forEach((p) => { p.visible = false; }); linkMat.opacity = 0; pktMat.opacity = 0; packets.forEach((s) => { s.visible = false; });
  hideTags(); setExplode(0);
}

// ===================== layout of the project view =====================
const homeSecs = [document.getElementById('top'), ...document.querySelectorAll('section.ch')];
// the camera's stops on the home page: the hero, one per plinth (in the lab chapter), the flight path and contact
const stopsEl = document.getElementById('stops'); stopsEl.innerHTML = plinths.map(() => '<i></i>').join('');
const homeStops = [homeSecs[0], ...stopsEl.children, document.getElementById('timeline'), document.getElementById('contact')];
const RN = plinths.length;
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
function layoutProject() { T0 = Math.round(60 + innerHeight * 0.36 + 6 + 52 + 14); document.documentElement.style.setProperty('--T0', T0 + 'px'); }
const tabName = (C, k) => C.tabs.find((x) => x[0] === k)[1];
const pcard = (C, s, body) => `<div class="pc"><h2>${s.title}</h2><p>${s.line}</p>${body || ''}</div>`;
function renderProject(C) {
  pphoto.querySelector('img').src = `img/${C.photo}.webp`; pphoto.querySelector('img').style.objectPosition = C.pos;
  pcap.querySelector('.tg').textContent = C.tg; pcap.querySelector('h1').textContent = C.name; pcap.querySelector('.sb').textContent = C.sub;
  document.getElementById('crumb').textContent = `Work / ${C.name}`;
  railEl.querySelector('[data-next]').textContent = `${CASES[C.next].short || CASES[C.next].name} →`; railEl.setAttribute('aria-label', `${C.name} case study`);
  const tabBtns = C.tabs.map(([k, n]) => `<button type="button" role="tab" id="tab-${k}" aria-controls="rbody" data-goto="${k}" aria-selected="${k === 'overview'}" tabindex="${k === 'overview' ? 0 : -1}">${n}</button>`).join('');
  document.getElementById('tabs').innerHTML = tabBtns; chipsEl.innerHTML = tabBtns.replace(/ role="tab" id="tab-\w+" aria-controls="rbody"/g, '');
  document.getElementById('ptick').innerHTML = C.tick.concat(C.tick).map((p) => `<span>${p}</span>`).join('');
  ptrack.innerHTML = C.secs.map((s) => `<section class="ps" id="ps-${s.id}" data-sec="${s.id}" style="--h:${s.h || 115}vh">${s.id === 'cs' ? `<div class="pintro">${H.tldr(C)}${H.assoc(C)}<div class="pcue">Scroll and the photo turns into 3D ↓</div></div>` : pcard(C, s, C.phone[s.id])}</section>`).join('');
  psecs = [...ptrack.querySelectorAll('.ps')]; armVideos(ptrack);
}
function open3D(id, fromEl, sec) {
  // only a tile's picture flies (measured now, before the grid is hidden); from a label or chip the case study simply appears
  const C = CASES[id], cell = fromEl && fromEl.closest && fromEl.closest('.cell'), from = cell && !reduced ? rectOf(cell.querySelector('.ph')) : null;
  const prevB = route && BAYS[route]; if (prevB && prevB.leave) prevB.leave();
  route = id; ensureBay(id); renderProject(C);
  document.body.classList.add('proj'); setScope(); layoutProject();
  help.hidden = true; selTab = 'overview'; shownTab = null; shownLabel = -1; shownHash = -1; spinYaw = 0; spinVel = 0;
  const i = sec ? C.secs.findIndex((s) => s.id === sec) : -1;
  scrollTo(0, i > 0 ? Math.max(0, secTarget(psecs[i])) : 0);
  readScroll(); smoothP = scrollP;
  if (BAYS[id].enter) BAYS[id].enter();
  if (from && from.w > 0) flyIn(from, C);
}
function close3D() {
  if (!route) return;
  const B = BAYS[route]; if (B.leave) B.leave();
  route = null; document.body.classList.remove('proj'); setScope(); snapDrone();
  canvas.style.clipPath = ''; spinHint.classList.remove('on'); ptrack.innerHTML = ''; psecs = [];
}
// FLIP: the picture sits at its destination and is moved there with transform, clipped to the source's shape on the way
function flyPhoto(C, from, to, dur, done) {
  const c = document.createElement('img'); c.src = `img/${C.photo}.webp`; c.alt = ''; c.className = 'flyimg'; c.style.objectPosition = C.pos; placeRect(c, to); document.body.appendChild(c);
  const s = Math.max(from.w / to.w, from.h / to.h), ix = (to.w - from.w / s) / 2, iy = (to.h - from.h / s) / 2;
  const dx = from.x + from.w / 2 - (to.x + to.w / 2), dy = from.y + from.h / 2 - (to.y + to.h / 2);
  const anim = c.animate([
    { transform: `translate(${dx}px, ${dy}px) scale(${s})`, clipPath: `inset(${iy}px ${ix}px round ${(from.r || 18) / s}px)` },
    { transform: 'none', clipPath: `inset(0px 0px round ${to.r || 16}px)` }
  ], { duration: dur, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'forwards' });
  let fin = false; const end = () => { if (fin) return; fin = true; c.remove(); if (done) done(); };
  anim.onfinish = end; anim.oncancel = end; setTimeout(end, dur + 300);
}
const rectOf = (el) => { const b = el.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height, r: parseFloat(getComputedStyle(el).borderTopLeftRadius) || 16 }; };
function flyIn(from, C) {
  const g = (narrow() ? geomPhone(0) : geomDesk(0)).photo, to = { x: g.x, y: g.y, w: g.w, h: g.h, r: g.rt };
  pphoto.style.visibility = 'hidden'; pcap.style.visibility = 'hidden';
  flyPhoto(C, from, to, 640, () => { pphoto.style.visibility = ''; pcap.style.visibility = ''; });
}
// going back plays the same path in reverse, faster, landing on the tile you came from
function flyBack(id, from) {
  const tile = bento.querySelector(`.cell[data-id="${id}"] .ph`); if (!tile) return;
  const to = rectOf(tile); if (to.y + to.h < 0 || to.y > innerHeight || to.w < 1) return;
  tile.style.visibility = 'hidden'; flyPhoto(CASES[id], from, to, 480, () => { tile.style.visibility = ''; });
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
  const secs = route ? psecs : homeStops, line = phone ? T0 : H * 0.5; let p = 0;
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
// camera keys: the whole ring from above the front, each plinth from outside the ring, the flight path from above, the bench
function ringCam(q) {
  const k = clamp01(q / Math.max(1, RN - 1)) * (RN - 1), k0 = Math.floor(Math.min(k, RN - 1.0001)), u = k - k0, ph = narrow();
  const a = ringAngle(k0) + (ringAngle(k0 + 1) - ringAngle(k0)) * u, top = plinths[k0].top + (plinths[Math.min(k0 + 1, RN - 1)].top - plinths[k0].top) * u;
  const out = ringOut(a), P = out.clone().multiplyScalar(RING_R), right = V3(Math.sin(a), 0, -Math.cos(a));
  const pos = out.clone().multiplyScalar(RING_R + (ph ? 4.4 : 3.7)).add(V3(0, ph ? 1.9 : 2.2, 0));
  // look a little toward the bench so it stays in the background; on desktop the plinth sits right of the card
  const look = P.clone().lerp(V3(0, 0, 0), 0.12).add(V3(0, Math.min(top, 1.1) * 0.7 + (ph ? 0.45 : 0), 0)).addScaledVector(right, ph ? 0 : -0.95);
  return { pos, look };
}
function homeKey(i) {
  const ph = narrow();
  // other lab layouts (layouts.js) bring their own overview, stops and flight-path shot; contact always ends at the bench
  if (layId !== 'ring' && i <= RN + 1) return i === 0 ? LAY.over() : i <= RN ? LAY.cam(i - 1) : LAY.tl ? LAY.tl() : LAY.pinsRing ? homeKeyRing(RN + 1, ph) : tlOver(ph);
  return homeKeyRing(i, ph);
}
function homeKeyRing(i, ph) {
  if (i === 0) { const o = ringOut(ringAngle(0) + 0.15); return { pos: o.clone().multiplyScalar(ph ? 11.5 : 9.5).add(V3(0, ph ? 6.2 : 4.6, 0)), look: V3(0, 0.6, 0) }; }
  if (i <= RN) return ringCam(i - 1);
  if (i === RN + 1) return ph ? { pos: V3(0.4, 15.5, 10.5), look: V3(0.1, 0, 0.6) } : { pos: V3(-0.2, 9.8, 10.6), look: V3(3.1, 0, 0.9) };
  return ph ? { pos: V3(1.0, 2.7, 5.0), look: V3(0.15, 0.85, 0) } : { pos: V3(0.5, 1.35, 1.5), look: V3(-0.45, 0.95, -0.15) };
}
// between two plinths the camera orbits round the ring (not across it), holding still on each one
function homeCam(sp) {
  const i = Math.min(Math.floor(sp), RN + 1), f = hold(sp - i);
  if (i >= 1 && i < RN) return layId === 'ring' ? ringCam(i - 1 + f) : LAY.cam(i - 1 + f);
  const a = homeKey(i), b = homeKey(i + 1); return { pos: lerpV(a.pos, b.pos, f), look: lerpV(a.look, b.look, f) };
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
const chCards = [...document.querySelectorAll('section.ch .card')];
let visible = true, tlT0 = -1;  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });
if (!reduced) document.body.classList.add('motion');

function homeFrame(dt, t, sp) {
  const phone = narrow(), line = innerHeight * 0.5;
  // chapter dots follow the four sections; the camera follows the finer stops
  let ch = 0; homeSecs.forEach((s, k) => { if (s.getBoundingClientRect().top <= line) ch = k; });
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
  drone.position.copy(DRONE_HOME); drone.rotation.set(0, -0.5, 0); setExplode(0);
  // chapter cards fade and rise as their chapter arrives and leave faster (on phone, before they run under the 3D frame above)
  chCards.forEach((c) => { const r = c.getBoundingClientRect(), H = innerHeight; c.classList.toggle('in', phone ? r.bottom > H * 0.5 && r.top < H * 0.96 : r.top < H * 0.82 && r.bottom > H * 0.18); });
  setView({ x: 0, y: 0, w: innerWidth, h: innerHeight }, 0, phone ? 60 : 38, phone ? innerHeight * 0.44 * clamp01((sp - 0.3) / 0.5) : 0);
  const cam = homeCam(sp);
  camera.position.copy(cam.pos); camera.lookAt(cam.look); camera.updateMatrixWorld();
  // the ring: the plinth in front lights its lip, lifts its object a little and gets the only label; only it moves on its own
  const q = sp - 1, inRing = sp > 0.75 && sp < RN + 0.35, qc = THREE.MathUtils.clamp(q, 0, RN - 1);
  const front = !inRing ? -1 : LAY.front ? LAY.front(qc) : LAY.order[Math.round(qc)];
  const settled = inRing && (LAY.settled ? LAY.settled(qc) : Math.abs(q - Math.round(q)) < 0.3);
  if (LAY.frame) LAY.frame(dt, t, sp, front);
  zoomEl.classList.toggle('on', !!LAY.draggable && inRing);
  plinths.forEach((p, k) => {
    const on = k === front ? 1 : 0;
    p.lift += (on - p.lift) * (reduced ? 1 : damp(10, dt)); p.holder.position.y = p.base + 0.04 * p.lift; p.lipMat.emissiveIntensity = 1.2 * p.lift;
    if (on && p.idle && !reduced) p.idle(t, dt);
    place(ringTags[k], wpos(p.g, V3(0, p.top + 0.04, 0)), on && settled);
    ringTags[k].style.pointerEvents = on && settled ? 'auto' : 'none'; ringTags[k].classList.toggle('hot', !!on);
  });
  spinProps(dt, front >= 0 && plinths[front].id === 'ba' && !reduced ? 0.06 : 0);
  // the track draws itself as the camera rises, then the pins come up in year order, 40ms apart
  const tlOn = sp > RN + 0.5 && sp < RN + 1.6, draw = reduced ? 1 : clamp01((sp - RN - 0.3) / 0.5);
  if (tlOn && tlT0 < 0) tlT0 = t; if (!tlOn) tlT0 = -1;
  tlLine.material.opacity = tlOn ? 1 : 0; tlLine.geometry.setDrawRange(0, Math.ceil(tlLine.geometry.attributes.position.count * draw));
  pins.forEach((p, k) => { const age = tlOn && draw > 0.98 ? t - tlT0 - k * 0.04 : -1, lit = reduced ? tlOn : age > 0; p.visible = lit; p.scale.setScalar(reduced ? 1 : 0.6 + 0.4 * (1 - Math.pow(1 - clamp01(age / 0.18), 3))); place(pinTags[k], wpos(p, V3(0, p.userData.top, 0)), lit && age > 0.1); pinTags[k].style.pointerEvents = lit ? 'auto' : 'none'; });
  sun.position.set(4, 8, 5); sun.target.position.set(0, 0, 0); sun.target.updateMatrixWorld();
  setLook(!darkTheme); scene.fog.near = 9; scene.fog.far = 70;
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
  if (phone) { chipsEl.style.top = g.chipsTop + 'px'; plate.style.height = g.chipsTop + 52 + 'px'; }
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
    const chip = chipsEl.querySelector(`[data-goto="${tab}"]`); if (chip && phone) chipsEl.scrollTo({ left: chip.offsetLeft - 16, behavior: 'smooth' });
  }
  if (!phone) {
    if (ch !== shownLabel && ch > 0) { shownLabel = ch; const s = secs[ch]; plabel.children[0].innerHTML = s.title; plabel.children[1].textContent = s.line; }
    plabel.style.opacity = ch > 0 ? clamp01((kG - 0.85) / 0.15) : 0;
  }
  if (ch !== shownHash) { shownHash = ch; try { history.replaceState(history.state, '', C.route + (ch > 0 ? '/' + secs[ch].id : '')); } catch (e) {} if (ch > 0) track('chapter', { id: route, sec: secs[ch].id }); }

  const ctx = { m, kG, phone, ch };
  B.update(dt, t, sp, ctx);
  // camera: holds the photo's angle until the photo has dissolved
  const i = Math.min(Math.floor(sp), n - 2);
  let f = hold(sp - i);
  if (i === 0) f = ease(clamp01((m - 0.4) / 0.6));
  if (B.remap) f = B.remap(i, sp, f);
  const a = keyAt(B, i, sp - i, phone), b = keyAt(B, i + 1, 0, phone);
  camera.position.lerpVectors(a.pos, b.pos, f); const look = a.look.clone().lerp(b.look, f);
  // drag to turn: orbit the look point in chapters that allow it, easing back elsewhere
  const canSpin = !!secs[ch].spin && kG > 0.9;
  spinW += ((canSpin ? 1 : 0) - spinW) * damp(4, dt);
  // momentum after a drag: spinVel is radians per 60Hz frame, decayed the same at any refresh rate
  if (!dragging) { spinYaw += spinVel * dt * 60; spinVel *= Math.exp(-5 * dt); if (!canSpin) spinYaw *= 1 - damp(3, dt); }
  if (Math.abs(spinYaw * spinW) > 1e-4) camera.position.sub(look).applyAxisAngle(V3(0, 1, 0), spinYaw * spinW).add(look);
  spinHint.classList.toggle('on', canSpin && Math.abs(spinYaw) < 0.05 && !reduced);
  if (canSpin) { spinHint.style.left = r.x + (r.w - g.shift) / 2 + 'px'; spinHint.style.top = r.y + r.h - (phone ? 34 : 64) + 'px'; }
  canvas.classList.toggle('spin', canSpin);
  // phone tilt: a small parallax around the look point
  if (phone && (tiltX || tiltY) && !reduced && sp > 0.5) { const rgt = V3().subVectors(camera.position, look).cross(V3(0, 1, 0)).normalize(), d = camera.position.distanceTo(look); camera.position.addScaledVector(rgt, -tiltX * d * 0.06).add(V3(0, tiltY * d * 0.04, 0)); }
  setView(r, g.shift, phone ? 38 + 8 * kG : 38);
  camera.near = B.near ? B.near(sp) : 0.03; camera.updateProjectionMatrix();
  camera.lookAt(look); camera.updateMatrixWorld();
  if (!B.sunFollows) { sun.target.position.copy(STUDIO); sun.position.copy(STUDIO).add(V3(4, 7, 3)); sun.target.updateMatrixWorld(); }
  setLook(!!B.day || !darkTheme);
  scene.fog.near = B.fog ? B.fog[0] : 9; scene.fog.far = B.fog ? B.fog[1] : 70;
  B.overlay(t, sp, ctx);
  Sound.update(B.audio ? B.audio(sp) : {}, t);
}

function frame() {
  requestAnimationFrame(frame);
  if (!visible) return;
  const rawDt = clock.getDelta(), dt = Math.min(rawDt, 0.05), t = clock.elapsedTime;
  // the camera eases toward the scroll position from wherever it is (cuts with reduced motion)
  smoothP += (scrollP - smoothP) * (reduced ? 1 : damp(4, rawDt)); window.__p = smoothP;
  stepTweens(rawDt);
  if (route) projectFrame(dt, t, smoothP); else homeFrame(dt, t, smoothP);
  cullTags();
  // while the hero covers the whole screen there is nothing to draw
  if (!route && smoothP < 0.004 && scrollP < 0.004) return;
  renderer.render(scene, camera); window.__calls = renderer.info.render.calls;
}
const clock = new THREE.Clock();
themeHooks.push(applyTheme);
setScope();
worldReady = true;
{ const r = parseRoute(location.hash); if (r) openProject(r.id, null, r.sec, 'none'); else if (pendingOpen) openProject(...pendingOpen); }
snapDrone();
frame();
