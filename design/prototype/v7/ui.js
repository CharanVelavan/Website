// ===================== 3D or Lite =====================
const BASE_TITLE = document.title;
const narrow = () => matchMedia('(max-width: 860px)').matches;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
function hasWebGL() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }
// Lite is the plain case-study site: picked by hand, or automatically for no WebGL, reduced motion, data saver or a low-memory phone
const liteWhy = !hasWebGL() ? 'no WebGL' : store.get('lab-mode') === 'lite' ? 'chosen' : store.get('lab-mode') === '3d' ? null
  : reduced ? 'reduced motion' : navigator.connection && navigator.connection.saveData ? 'data saver' : navigator.deviceMemory && navigator.deviceMemory <= 2 ? 'low memory' : null;
const LITE = !!liteWhy;
document.body.classList.toggle('lite', LITE);
// the 3D/Lite choice lives in Settings (settings.js); switching reloads the page
['cvBtn', 'cvBtn2'].forEach((id) => { document.getElementById(id).href = CV_URL; });

// ===================== analytics: a tiny local event log (Plausible or Vercel Analytics in the real site) =====================
function track(name, props = {}) {
  const e = { name, ...props, t: Date.now() };
  try { const a = JSON.parse(store.get('lab-events') || '[]'); a.push(e); store.set('lab-events', JSON.stringify(a.slice(-400))); } catch (err) {}
  try { if (window.plausible) window.plausible(name, { props }); } catch (err) {}
}
document.addEventListener('click', (e) => { const a = e.target.closest && e.target.closest('[data-track]'); if (a) track(a.dataset.track, { href: a.getAttribute('href'), project: route }); });

// ===================== sound: off by default; a propeller hum, radio ticks and water, all synthesised =====================
const Sound = (() => {
  let ac = null, on = false, master, humF, humG, waterG, noise, oscs = [], nextTick = 0;
  function init() {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain(); master.gain.value = 0.9; master.connect(ac.destination);
    humF = ac.createBiquadFilter(); humF.type = 'lowpass'; humF.frequency.value = 650; humG = ac.createGain(); humG.gain.value = 0; humF.connect(humG); humG.connect(master);
    oscs = ['sawtooth', 'sawtooth', 'triangle'].map((type) => { const o = ac.createOscillator(); o.type = type; o.connect(humF); o.start(); return o; });
    noise = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate); const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const w = ac.createBufferSource(); w.buffer = noise; w.loop = true; const wf = ac.createBiquadFilter(); wf.type = 'lowpass'; wf.frequency.value = 360; waterG = ac.createGain(); waterG.gain.value = 0; w.connect(wf); wf.connect(waterG); waterG.connect(master); w.start();
  }
  function tick(gain) {
    const s = ac.createBufferSource(); s.buffer = noise; const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1700 + Math.random() * 1800; f.Q.value = 5;
    const g = ac.createGain(), t = ac.currentTime; g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    s.connect(f); f.connect(g); g.connect(master); s.start(t, Math.random(), 0.06);
  }
  return {
    get on() { return on; },
    toggle() { if (!ac) init(); on = !on; if (on && ac.state === 'suspended') ac.resume(); if (!on) { humG.gain.setTargetAtTime(0, ac.currentTime, 0.05); waterG.gain.setTargetAtTime(0, ac.currentTime, 0.05); } return on; },
    // a = { hum 0..1, pitch, ticks 0..1, water 0..1 }, set every frame by the open scene
    update(a, now) {
      if (!ac || !on) return; const t = ac.currentTime, h = a.hum || 0, p = (a.pitch || 1) * (0.85 + 0.3 * h);
      oscs[0].frequency.setTargetAtTime(96 * p, t, 0.2); oscs[1].frequency.setTargetAtTime(97.6 * p, t, 0.2); oscs[2].frequency.setTargetAtTime(192 * p, t, 0.2);
      humG.gain.setTargetAtTime(0.045 * h, t, 0.15); waterG.gain.setTargetAtTime(0.09 * (a.water || 0), t, 0.3);
      if ((a.ticks || 0) > 0.05 && now > nextTick) { tick(0.06 * a.ticks); nextTick = now + 0.1 + Math.random() * 0.4 / a.ticks; }
    }
  };
})();

// ===================== hero DOM =====================
const bento = document.getElementById('bento');
// a tile is a picture with its caption below it (never on top of the photo)
const tileHTML = (p) => `<span class="ph">${p.img ? `<img src="img/${p.img}.webp" alt="" style="object-position:${p.pos || '50% 50%'}">` : '<span class="swarmdots" aria-hidden="true">' + '<i></i>'.repeat(50) + '</span>'}${p.live ? `<span class="live">${p.live}</span>` : ''}</span><span class="cap"><span class="nm">${p.name}</span><span class="tg">${p.tags}</span><span class="st">${p.story}</span></span>`;
function renderBento() {
  const rows = narrow() ? [['ba'], ['ne', 'sw'], ['tz', 'or'], ['de', 'wb'], ['ss', 'sa'], ['now']] : [['ba', 'ne', 'sw'], ['tz', 'or', 'de', 'ss'], ['wb', 'sa', 'now', 'st']];
  bento.innerHTML = rows.map((g, ri) => `<div class="row r${ri}">${g.map((id) => {
    const p = PROJECTS.find((x) => x.id === id);
    if (p) return `<a class="cell ${id === 'ba' ? 'big' : ''} ${id === 'wb' ? 'wb' : ''}" data-id="${id}" href="${CASES[id].route}" aria-label="${p.name}: ${p.story}">${tileHTML(p)}</a>`;
    if (id === 'aw') return `<a class="cell" data-id="aw" href="#timeline"><span class="ph"><img src="img/de-win.webp" alt=""></span><span class="cap"><span class="nm">6 wins and national finals</span><span class="tg">See the flight path</span></span></a>`;
    if (id === 'now') return `<a class="cell nowc now" data-id="now" href="#timeline"><span class="cp"><strong>Now building</strong><span>Echo telemetry and FSS research. Write-up soon.</span></span></a>`;
    return `<div class="cell dark st" data-id="st"><div class="stats"><div><strong>${PROJECTS.length}</strong><span>projects</span></div><div><strong>5</strong><span>domains</span></div><div><strong>3</strong><span>papers</span></div><div><strong>6</strong><span>awards</span></div></div></div>`;
  }).join('')}</div>`).join('');
  bento.querySelectorAll('a.cell').forEach((c) => {
    c.addEventListener('click', (e) => {
      const id = c.dataset.id;
      if (!CASES[id]) return;
      e.preventDefault(); openProject(id, c);
    });
  });
  applyFilter(); cacheRects();
}
const stackEl = document.getElementById('stack'), skillsEl = document.getElementById('skills');
stackEl.innerHTML = LAYERS.map(([id, name, tools], i) => `<button class="layer" type="button" data-layer="${id}" aria-pressed="false"><small>0${5 - i}</small><span><b>${name}</b><i>${tools}</i></span><em>${PROJECTS.filter((p) => p.d.includes(id)).length} / ${PROJECTS.length}</em></button>`).join('');
let lock = TAILOR[(location.hash || '').slice(1).toLowerCase()] || null, hoverLayer = null;
function applyFilter() {
  const dom = hoverLayer || lock;
  bento.querySelectorAll('.cell[data-id]').forEach((c) => { const p = PROJECTS.find((x) => x.id === c.dataset.id); c.classList.toggle('dim', !!(dom && p && !p.d.includes(dom))); });
  stackEl.querySelectorAll('.layer').forEach((b) => { b.classList.toggle('on', b.dataset.layer === dom); b.setAttribute('aria-pressed', String(b.dataset.layer === lock)); });
  const name = dom && LAYERS.find((l) => l[0] === dom)[1];
  document.getElementById('summary').textContent = dom ? `${name} runs through ${PROJECTS.filter((p) => p.d.includes(dom)).length} of ${PROJECTS.length} projects` : `${PROJECTS.length} projects across 5 layers of the stack`;
}
// skills → proof: a locked layer lists exactly what I did in it, each line opening the chapter that shows it
function renderSkills() {
  const k = lock; skillsEl.classList.toggle('on', !!k); document.querySelector('.aside').classList.toggle('sk', !!k);
  skillsEl.innerHTML = k ? `<small>${LAYERS.find((l) => l[0] === k)[1]}: what I did</small><ul>${SKILLS[k].map(([id, sec, s]) => `<li><button type="button" data-open="${id}" data-sec="${sec}"><span>${s}</span><b>${CASES[id].short || CASES[id].name} →</b></button></li>`).join('')}</ul>` : '';
}
stackEl.addEventListener('pointerover', (e) => { const b = e.target.closest('.layer'); if (b && !narrow()) { hoverLayer = b.dataset.layer; applyFilter(); } });
stackEl.addEventListener('pointerleave', () => { hoverLayer = null; applyFilter(); });
stackEl.addEventListener('click', (e) => { const b = e.target.closest('.layer'); if (!b) return; lock = lock === b.dataset.layer ? null : b.dataset.layer; applyFilter(); renderSkills(); if (lock) track('skill', { layer: lock }); });
document.getElementById('marq').innerHTML = PROOFS.concat(PROOFS).map((p) => `<span>${p}</span>`).join('');
// the tickers run only while on screen (and pause under the pointer)
if ('IntersectionObserver' in window) { const mio = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('off', !e.isIntersecting))); document.querySelectorAll('.marquee, #pticker').forEach((m) => mio.observe(m)); }
document.getElementById('labChips').innerHTML = PROJECTS.map((p) => `<button type="button" data-open="${p.id}">${CASES[p.id].short || p.name}</button>`).join('');
document.getElementById('tlList').innerHTML = TIMELINE.map(([y, a, b, id]) => `<li>${id ? `<button type="button" data-open="${id}">` : '<span>'}<small>${y}</small><b>${a}</b><i>${b}</i>${id ? '</button>' : '</span>'}</li>`).join('');
// tile centres in page coordinates, measured untransformed (used for the fly-to-object transition)
const heroRects = {};
function cacheRects() { bento.querySelectorAll('.cell').forEach((c) => { const prev = c.style.transform; c.style.transform = ''; const r = c.getBoundingClientRect(); heroRects[c.dataset.id] = { x: r.left + r.width / 2, y: r.top + r.height / 2 + scrollY }; c.style.transform = prev; }); }
let route = null;
renderBento(); renderSkills();
let wasNarrow = narrow(); addEventListener('resize', () => { if (narrow() !== wasNarrow) { wasNarrow = narrow(); renderBento(); } else if (!route) cacheRects(); });
bento.addEventListener('transitionend', (e) => { if (!route && (e.propertyName === 'flex-grow' || e.propertyName === 'height')) cacheRects(); });
// the portrait card tilts toward the pointer
const profile = document.getElementById('profile');
if (matchMedia('(hover: hover) and (pointer: fine)').matches && !reduced) {
  profile.addEventListener('pointermove', (e) => { const r = profile.getBoundingClientRect(); const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5; profile.style.setProperty('--ry', (nx * 16).toFixed(1) + 'deg'); profile.style.setProperty('--rx', (-ny * 14).toFixed(1) + 'deg'); });
  profile.addEventListener('pointerleave', () => { profile.style.setProperty('--ry', '0deg'); profile.style.setProperty('--rx', '0deg'); });
}
const toastEl = document.getElementById('toast'); let tt;
const toast = (m) => { toastEl.textContent = m; toastEl.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove('on'), 3200); };
document.getElementById('copy').addEventListener('click', () => { const t = 'Charanvelavan12@gmail.com'; track('copy_email'); const sel = () => { getSelection().selectAllChildren(document.getElementById('email')); toast('Selected. Press Ctrl or ⌘ + C to copy.'); }; if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => toast('Email copied: ' + t), sel); else sel(); });
const clockEl = document.getElementById('clock');
const tickClock = () => { try { clockEl.textContent = 'Chennai · ' + new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }).format(new Date()) + ' IST'; } catch (e) {} };
tickClock(); setInterval(tickClock, 30000);
if (!LITE && navigator.getBattery) navigator.getBattery().then((b) => { if (!b.charging && b.level < 0.2) toast('Battery low. Choose Lite in Settings for the lighter version.'); }).catch(() => {});

// ===================== keyboard, help, terminal =====================
const homeIds = ['top', ...[...document.querySelectorAll('section.ch')].map((s) => s.id)];
const help = document.getElementById('help'), term = document.getElementById('term'), termOut = document.getElementById('termOut'), termIn = document.getElementById('termIn');
const smooth = () => (reduced ? 'auto' : 'smooth');
const go = (id) => document.getElementById(id).scrollIntoView({ behavior: smooth() });
document.getElementById('enterLab').addEventListener('click', () => go('lab'));
const currentIndex = () => { let k = 0; homeIds.forEach((id, i) => { if (document.getElementById(id).getBoundingClientRect().top < innerHeight * 0.5) k = i; }); return k; };
document.getElementById('helpBtn').addEventListener('click', () => { help.hidden = !help.hidden; });
const termPrint = (s) => { termOut.textContent += s + '\n'; termOut.scrollTop = termOut.scrollHeight; };
function openTerm() { term.hidden = false; help.hidden = true; if (!termOut.textContent) termPrint("Living Lab shell. Type 'help'."); termIn.focus(); }
document.getElementById('termBtn').addEventListener('click', openTerm);
const CMDS = {
  help: () => 'help · whoami · ls · open <project> · goto <chapter> · stack · cv · stats · contact · clear · exit',
  whoami: () => 'Charan Velavan, embedded and firmware engineer. M.E. Communication Systems, SSN.',
  ls: () => PROJECTS.map((p) => `${p.name.padEnd(24)} ${p.tags}`).join('\n'),
  stack: () => LAYERS.map(([, n, t]) => `${n.padEnd(22)} ${t}`).join('\n'),
  cv: () => { open(CV_URL, '_blank', 'noopener'); return CV_URL; },
  stats: () => { let a = []; try { a = JSON.parse(store.get('lab-events') || '[]'); } catch (e) {} const c = {}; a.forEach((e) => { const k = e.name + (e.id ? ' · ' + e.id : ''); c[k] = (c[k] || 0) + 1; }); return a.length ? 'this browser’s events:\n' + Object.entries(c).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${String(v).padStart(4)}  ${k}`).join('\n') : 'no events yet'; },
  contact: () => 'Charanvelavan12@gmail.com',
  clear: () => { termOut.textContent = ''; return null; },
  exit: () => { term.hidden = true; return null; }
};
document.getElementById('termForm').addEventListener('submit', (e) => {
  e.preventDefault(); const raw = termIn.value.trim(); termIn.value = ''; if (!raw) return; termPrint('charan@lab:~$ ' + raw);
  const [cmd, ...args] = raw.split(/\s+/); const a = args.join(' ').toLowerCase();
  if (cmd === 'open' || cmd === 'goto') {
    const p = a && PROJECTS.find((x) => x.name.toLowerCase().includes(a) || x.id === a || CASES[x.id].slug.toLowerCase() === a);
    if (p) { term.hidden = true; if (route && route !== p.id) switchProject(p.id); else if (!route) openProject(p.id); termPrint('→ ' + p.name); return; }
    const c = CASES[route || 'ba'], sec = c.secs.find((s) => s.id === a && s.id !== 'cs');
    if (sec) { term.hidden = true; if (!route) openProject('ba', null, sec.id); else gotoSec(sec.id); termPrint(`→ ${c.name} · ${sec.id}`); return; }
    if (homeIds.includes(a)) { term.hidden = true; if (route) leaveProject(a); else go(a); termPrint('→ ' + a); return; }
    termPrint('not found: ' + a + "   (try: ls, open nephele, goto lab | timeline | contact, goto build | arch | results)"); return;
  }
  const f = CMDS[cmd]; const out = f ? f() : `command not found: ${cmd}`; if (out) termPrint(out);
});
addEventListener('keydown', (e) => {
  if (e.target.closest && e.target.closest('input, textarea')) { if (e.key === 'Escape') term.hidden = true; return; }
  if (e.key === '`') { e.preventDefault(); if (term.hidden) openTerm(); else term.hidden = true; return; }
  if (e.key === '?') { help.hidden = !help.hidden; return; }
  if (e.key === 'Escape') { if (!lightbox.hidden) { closeLightbox(); return; } if (!help.hidden || !term.hidden) { help.hidden = true; term.hidden = true; return; } if (route) leaveProject(); return; }
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key.toLowerCase();
  if (route) {
    if (k === 'g') leaveProject('top');
    if (k === 'j' || k === 'k') { if (LITE) liteStep(k === 'j' ? 1 : -1); else chapterStep(k === 'j' ? 1 : -1); }
    return;
  }
  if (k === 'j') go(homeIds[Math.min(homeIds.length - 1, currentIndex() + 1)]);
  if (k === 'k') go(homeIds[Math.max(0, currentIndex() - 1)]);
  if (k === 'g') go('top');
});
// tabs: arrow keys move between them (WAI-ARIA tabs pattern with a roving tab stop)
const tabsEl = document.getElementById('tabs');
tabsEl.addEventListener('keydown', (e) => {
  const btns = [...tabsEl.querySelectorAll('[role="tab"]')], i = btns.indexOf(document.activeElement); if (i < 0) return;
  const j = e.key === 'ArrowRight' ? (i + 1) % btns.length : e.key === 'ArrowLeft' ? (i - 1 + btns.length) % btns.length : e.key === 'Home' ? 0 : e.key === 'End' ? btns.length - 1 : -1;
  if (j < 0) return; e.preventDefault(); btns[j].focus(); btns[j].click();
});

// ===================== opening and closing a project (3D or Lite), and the URL =====================
const lightbox = document.getElementById('lightbox'), litedoc = document.getElementById('litedoc');
let homeY = 0, opener = null, pushed = false, afterLeave = null, worldReady = false, pendingOpen = null;
const parseRoute = (h) => { const m = /^#\/projects\/([^/]+)(?:\/([^/]+))?$/.exec(h || ''); if (!m) return null; const id = Object.keys(CASES).find((k) => CASES[k].slug.toLowerCase() === decodeURIComponent(m[1]).toLowerCase()); return id ? { id, sec: m[2] || null } : null; };
function navTo(mode, url) { try { if (mode === 'push') { history.pushState({ p: 1 }, '', url); pushed = true; } else if (mode === 'replace') history.replaceState(history.state, '', url); } catch (e) { pushed = false; } }
function openProject(id, fromEl, sec, mode = 'push') {
  if (!CASES[id] || route === id) return;
  if (route) { switchProject(id, sec); return; }
  if (!LITE && !worldReady) { pendingOpen = [id, fromEl, sec, mode]; toast('Loading the 3D lab…'); return; }
  homeY = scrollY; opener = fromEl && fromEl.focus ? fromEl : null; navTo(mode, CASES[id].route + (sec ? '/' + sec : ''));
  track('open_project', { id, sec, lite: LITE });
  document.title = `${CASES[id].name} · Charan Velavan`;
  if (LITE) openLite(id, sec); else open3D(id, fromEl, sec);
}
function closeProject() {
  if (!route) return;
  const id = route, back = !LITE && !reduced && morphK < 0.2 && homeY < innerHeight * 0.5 ? rectOf(pphoto) : null;
  track('leave_project', { id });
  lightbox.hidden = true; pushed = false; document.title = BASE_TITLE;
  if (LITE) closeLite(); else close3D();
  renderBento(); scrollTo(0, homeY); if (!LITE) { readScroll(); smoothP = scrollP; }
  if (back) flyBack(id, back);
  // focus goes back where it came from: the label or chip that opened it, or the project's tile (the grid was just rebuilt)
  const f = opener && opener.isConnected ? opener : bento.querySelector(`.cell[data-id="${id}"]`); opener = null;
  if (f) f.focus({ preventScroll: true });
}
// from one case study straight to another, keeping one history entry for the pair
function switchProject(id, sec, mode = 'replace') {
  if (!CASES[id]) return;
  const keep = homeY; navTo(mode, CASES[id].route + (sec ? '/' + sec : ''));
  if (LITE) closeLite(); else close3D();
  track('open_project', { id, sec, from: 'next', lite: LITE }); document.title = `${CASES[id].name} · Charan Velavan`;
  if (LITE) openLite(id, sec); else open3D(id, null, sec);
  homeY = keep;
}
function leaveProject(target) {
  afterLeave = target || null;
  if (pushed) { pushed = false; history.back(); return; }
  try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  closeProject(); runAfterLeave();
}
function runAfterLeave() { const t = afterLeave; afterLeave = null; if (t) requestAnimationFrame(() => { document.getElementById(t).scrollIntoView({ behavior: 'auto' }); if (!LITE) { readScroll(); smoothP = scrollP; } }); }
addEventListener('popstate', () => {
  const r = parseRoute(location.hash);
  if (r && r.id !== route) { if (route) switchProject(r.id, r.sec, 'none'); else openProject(r.id, null, r.sec, 'none'); }
  else if (!r && route) { closeProject(); runAfterLeave(); }
});

// ---------- Lite: the case study as a plain page (also what prints) ----------
const docHTML = (C) => `<article class="doc" aria-label="${C.name} case study"><figure class="dhero"><img src="img/${C.photo}.webp" alt="${C.name}" style="object-position:${C.pos}"><figcaption><strong>${C.name}</strong><span>${C.sub}</span><span class="tg">${C.tg}</span></figcaption></figure>`
  + C.tabs.map(([k, n]) => `<section class="dsec" id="doc-${k}" aria-label="${n}"><h3 class="dh">${n}</h3>${C.html[k]}</section>`).join('') + '</article>';
function openLite(id, sec) {
  route = id; document.body.classList.add('proj');
  litedoc.innerHTML = docHTML(CASES[id]); armVideos(litedoc);
  scrollTo(0, 0);
  const s = sec && CASES[id].secs.find((x) => x.id === sec); if (s) { const el = document.getElementById('doc-' + s.tab); if (el) el.scrollIntoView(); }
}
function closeLite() { route = null; document.body.classList.remove('proj'); litedoc.innerHTML = ''; }
function liteStep(d) { const secs = [...litedoc.querySelectorAll('.dsec')]; let k = 0; secs.forEach((s, i) => { if (s.getBoundingClientRect().top < 120) k = i; }); const t = secs[Math.max(0, Math.min(secs.length - 1, k + d))]; if (t) t.scrollIntoView({ behavior: smooth() }); }
// print or save as PDF: the plain version of whichever case study is open
function fillPrint() { if (route && !LITE) litedoc.innerHTML = docHTML(CASES[route]); litedoc.querySelectorAll('img[loading]').forEach((i) => { i.loading = 'eager'; }); }
addEventListener('beforeprint', fillPrint);
addEventListener('afterprint', () => { if (!LITE) litedoc.innerHTML = ''; });
function printCase() { track('print', { id: route }); fillPrint(); try { print(); } catch (e) { toast('Use your browser’s Print to save this case study as a PDF.'); } }

// ---------- media: clips play only while on screen; the lightbox takes photos and video ----------
const vio = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => { const v = e.target; if (e.isIntersecting && !reduced) { v.preload = 'auto'; v.play().catch(() => {}); } else v.pause(); }), { threshold: 0.4 }) : null;
function armVideos(root) { if (vio) root.querySelectorAll('video').forEach((v) => vio.observe(v)); }
function openLightbox(src, cap) {
  const img = lightbox.querySelector('img'), vid = lightbox.querySelector('video'), isV = /\.(mp4|webm)$/.test(src);
  img.hidden = isV; vid.hidden = !isV;
  if (isV) { vid.src = src; vid.play().catch(() => {}); } else { img.src = src; img.alt = cap; }
  lightbox.querySelector('figcaption').textContent = cap; lightbox.hidden = false; track('media', { src, project: route });
}
function closeLightbox() { const v = lightbox.querySelector('video'); v.pause(); v.removeAttribute('src'); lightbox.hidden = true; }
lightbox.addEventListener('click', (e) => { if (e.target.tagName !== 'VIDEO') closeLightbox(); });

// ---------- every button in the case studies and on the home page ----------
let hotPart = null, hotNode = null, swMode = null;
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-goto],[data-goto-sec],[data-explore],[data-next],[data-backlab],[data-close],[data-lb],[data-open],[data-print],#backBtn');
  if (!el) return;
  if (el.dataset.mode) { swMode = el.dataset.mode; if (route && !LITE) gotoSec(el.dataset.gotoSec); return; }
  if (el.dataset.goto) gotoTab(el.dataset.goto);
  else if (el.dataset.gotoSec) { if (!LITE) gotoSec(el.dataset.gotoSec); }
  else if (el.hasAttribute('data-explore')) { if (!LITE) scrollToSec(psecs[1]); }
  else if (el.hasAttribute('data-next')) switchProject(CASES[route].next);
  else if (el.hasAttribute('data-backlab')) leaveProject('lab');
  else if (el.hasAttribute('data-close') || el.id === 'backBtn') leaveProject();
  else if (el.hasAttribute('data-print')) printCase();
  else if (el.dataset.lb) openLightbox(el.dataset.lb, el.dataset.cap);
  else if (el.dataset.open) { if (route && route !== el.dataset.open) switchProject(el.dataset.open, el.dataset.sec); else openProject(el.dataset.open, el, el.dataset.sec); }
});
const hoverAt = (t) => { const p = t.closest && t.closest('[data-part]'), n = t.closest && t.closest('[data-node]'); hotPart = p ? p.dataset.part : null; hotNode = n ? n.dataset.node : null; };
document.addEventListener('pointerover', (e) => hoverAt(e.target));
document.addEventListener('focusin', (e) => hoverAt(e.target));

// ===================== Lite stops here; otherwise the 3D world loads once the page has painted =====================
if (LITE) {
  const r = parseRoute(location.hash); if (r) openProject(r.id, null, r.sec, 'none');
  await new Promise(() => {});
}
if (!parseRoute(location.hash)) await new Promise((r) => (window.requestIdleCallback ? requestIdleCallback(r, { timeout: 900 }) : setTimeout(r, 250)));
// the 3D screens draw their text into canvases, so Switzer has to be ready first (it is inlined, so this is quick)
const [THREE, { RoomEnvironment }, { RoundedBoxGeometry }] = await Promise.all([import('three'), import('three/addons/environments/RoomEnvironment.js'), import('three/addons/geometries/RoundedBoxGeometry.js'), document.fonts.load('600 32px Switzer'), document.fonts.load('32px Switzer')]);
