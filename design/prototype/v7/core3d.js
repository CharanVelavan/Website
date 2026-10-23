
// ===================== labels in the world =====================
const tagsEl = document.getElementById('tags');
const mkTag = (html, cls = 'tag') => { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; d.style.opacity = 0; tagsEl.appendChild(d); return d; };
const tmpV = new THREE.Vector3();
let view = { x: 0, y: 0, w: innerWidth, h: innerHeight };
function project(v) { tmpV.copy(v).project(camera); const x = view.x + (tmpV.x * 0.5 + 0.5) * view.w, y = view.y + (-tmpV.y * 0.5 + 0.5) * view.h; return { x, y, vis: tmpV.z < 1 && tmpV.z > -1 && x > view.x && x < view.x + view.w && y > view.y && y < view.y + view.h }; }
// a label's opacity and position are written only when they change: dozens of labels, every frame, add up on a phone
const tagOp = (el, o) => { if (el._o !== o) { el._o = o; el.style.opacity = o; } };
// labels stay fully on screen and clear of the header bar
function place(el, v, show) {
  const p = show ? project(v) : null, ok = show && p.vis && p.y > (narrow() ? 74 : 0);
  tagOp(el, ok ? 1 : 0); if (!ok) return;
  const w = el._w || (el._w = el.offsetWidth), h = el._h || (el._h = el.offsetHeight), x = Math.min(Math.max(p.x, 8 + w / 2), innerWidth - 8 - w / 2);
  const tx = Math.round(x * 2) / 2, ty = Math.round(p.y * 2) / 2;
  if (el._x !== tx || el._y !== ty) { el._x = tx; el._y = ty; el.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -100%)`; }
  placed.push({ el, l: x - w / 2, r: x + w / 2, t: p.y - h, b: p.y });
}
// when labels collide, the earlier (or hovered) one wins and the other hides
let placed = [];
// on a phone the lab toolbar sits under the header: labels behind that band hide (its bottom is read once per resize)
let barBottom = -1;
addEventListener('resize', () => { barBottom = -1; });
function cullTags() {
  const keep = [], bar = narrow() && document.getElementById('labbar');
  if (bar && bar.classList.contains('on')) {
    if (barBottom < 0) barBottom = bar.offsetTop + bar.offsetHeight;
    keep.push({ l: -1e4, r: 1e4, t: -1e4, b: barBottom });
  }
  placed.sort((a, b) => b.el.classList.contains('hot') - a.el.classList.contains('hot')).forEach((t) => {
    if (keep.some((k) => t.l < k.r + 4 && t.r > k.l - 4 && t.t < k.b + 4 && t.b > k.t - 4)) tagOp(t.el, 0); else keep.push(t);
  });
  placed = [];
}
addEventListener('resize', () => { tagsEl.querySelectorAll('.tag').forEach((el) => { el._w = el._h = 0; }); });
const hideTags = () => tagsEl.querySelectorAll('.tag, .det').forEach((el) => { el.style.opacity = 0; el._o = 0; el._pe = undefined; el.style.pointerEvents = ''; });

// ===================== shared pieces for the project bays =====================
const ease = (x) => x * x * (3 - 2 * x);
const clamp01 = (x) => Math.min(1, Math.max(0, x));
// frame-rate-independent smoothing: the share of the gap closed in dt seconds at rate k (same feel at 60Hz and 120Hz)
const damp = (k, dt) => 1 - Math.exp(-k * dt);
// between two chapters the camera rests for the first and last 20%, so each chapter holds still in its middle 40%
const hold = (x) => ease(clamp01((x - 0.2) / 0.6));
const win = (sp, a, b, f = 0.25) => clamp01(Math.min((sp - a) / f + 1, (b - sp) / f + 1)); // 0 → 1 inside [a, b], with soft edges
const smoothstep = THREE.MathUtils.smoothstep;
// the cleared, flat ground beside the field: one bay at a time stands here
const STUDIO = PAD.clone();
const S = (x, y, z) => STUDIO.clone().add(V3(x, y, z));
const lerpV = (a, b, k) => a.clone().lerp(b, k);
const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.55, ...o });
const physMat = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.45, ...o });
const sphere = (r, m, ws = 20, hs = 14) => new THREE.Mesh(new THREE.SphereGeometry(r, ws, hs), m);
const plane = (w, h, m) => new THREE.Mesh(new THREE.PlaneGeometry(w, h), m);
// a label texture for screens and panels
function textTex(w, h, draw) { const t = canvasTex(w, h, draw); t.anisotropy = 8; return t; }
function addTo(group, ...objs) { objs.forEach((o) => group.add(o)); return group; }
// a turntable plinth: dark disc with a thin copper edge
function makePlinth(r = 0.9) {
  const g = new THREE.Group();
  g.add(at(cyl(r, r + 0.03, 0.08, mat(0x2a2b30, { roughness: 0.4, metalness: 0.3 }), 64), 0, 0.04, 0));
  g.add(at(new THREE.Mesh(new THREE.TorusGeometry(r + 0.012, 0.006, 8, 96), M.copper), 0, 0.082, 0).rotateX(Math.PI / 2));
  g.add(at(cyl(r - 0.04, r - 0.04, 0.004, mat(0x36373d, { roughness: 0.7 }), 64), 0, 0.083, 0));
  shadowAll(g); return g;
}
// links and packets between points, used by architecture chapters
function makeFlow(color = SLOT.link) {
  const lm = new THREE.LineDashedMaterial({ color, dashSize: 0.06, gapSize: 0.04, transparent: true, opacity: 0 });
  const pm = new THREE.MeshBasicMaterial({ color: SLOT.packet, transparent: true, opacity: 0 });
  const items = [];
  return {
    lm, pm, items,
    add(parent, fa, fb, lift, n = 2, r = 0.02) {
      const curve = new THREE.QuadraticBezierCurve3(V3(), V3(), V3()), line = new THREE.Line(new THREE.BufferGeometry(), lm); parent.add(line);
      const pk = []; for (let i = 0; i < n; i++) { const s = sphere(r, pm, 10, 8); s.userData.off = i / n; parent.add(s); pk.push(s); }
      items.push({ curve, line, pk, fa, fb, lift }); return items.length - 1;
    },
    update(t, on, speed = 0.4) {
      lm.opacity = on; pm.opacity = on;
      items.forEach((it) => {
        const show = on > 0.02; it.line.visible = show; it.pk.forEach((s) => { s.visible = show; });
        if (!show) return;
        const a = it.fa(), b = it.fb(); it.curve.v0.copy(a); it.curve.v2.copy(b); it.curve.v1.copy(a).lerp(b, 0.5); it.curve.v1.y += it.lift;
        it.line.geometry.setFromPoints(it.curve.getPoints(32)); it.line.computeLineDistances();
        it.pk.forEach((s) => s.position.copy(it.curve.getPoint((s.userData.off + t * speed) % 1)));
      });
    }
  };
}
// a person, for crowds and visitors
function makePerson(i, s = 0.75) {
  const p = new THREE.Group();
  p.add(at(new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.9, 4, 8), mat([0x2b3a8c, 0x9a3b2e, 0x3b4a3e, 0x5a4a6a, 0x8a6a3a][i % 5], { roughness: 0.7 })), 0, 0.65, 0), at(sphere(0.13, mat([0x6b4a33, 0x8a6446, 0x4a3426][i % 3]), 12, 8), 0, 1.32, 0));
  p.scale.setScalar(s); shadowAll(p); return p;
}
const BAYS = {};
