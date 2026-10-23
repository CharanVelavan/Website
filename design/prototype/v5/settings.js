// ===================== themes: eight looks, each with a light and a dark version =====================
// Per mode: page (bg), surface (sf), ink, secondary text (mu), accent fill (ac), text on the accent (ai), accent text (at),
// and an optional second accent (a2) that the 3D links use. Cards, lines and the 3D ground are derived from these.
const THEMES = [
  { id: 'bottle', name: 'Bottle and yellow',
    L: { bg: '#F7F7F7', sf: '#EBEBEB', ink: '#0D2A1C', mu: '#5F6B64', ac: '#F6E016', ai: '#0D2A1C', at: '#0D2A1C' },
    D: { bg: '#10241A', sf: '#183223', ink: '#E8E6D8', mu: '#9FAE9F', ac: '#F4D96C', ai: '#10241A', at: '#F4D96C' } },
  { id: 'sienna', name: 'Burnt sienna',
    L: { bg: '#F5F5DC', sf: '#EBE8CB', ink: '#2B1D16', mu: '#6A5547', ac: '#A0522D', ai: '#FFFFFF', at: '#A0522D', a2: '#E35336' },
    D: { bg: '#1C1410', sf: '#281D17', ink: '#F5F5DC', mu: '#B5A58F', ac: '#F4A460', ai: '#1C1410', at: '#F4A460', a2: '#E35336' } },
  { id: 'burgundy', name: 'Burgundy, white and blue',
    L: { bg: '#FFFFFF', sf: '#F4F2F3', ink: '#1A1418', mu: '#675E63', ac: '#7B1E34', ai: '#FFFFFF', at: '#1F4FD1', a2: '#1F4FD1' },
    D: { bg: '#150E11', sf: '#21171B', ink: '#F4EFF1', mu: '#A3969C', ac: '#D0607A', ai: '#150E11', at: '#86A8FF', a2: '#86A8FF' } },
  { id: 'blueprint', name: 'Blueprint',
    L: { bg: '#DFDEDB', sf: '#D3D2CE', ink: '#26251E', mu: '#5A5850', ac: '#2456D6', ai: '#FFFFFF', at: '#214FC5' },
    D: { bg: '#0A0D14', sf: '#131824', ink: '#E9EDF3', mu: '#8891A1', ac: '#5A9BFC', ai: '#0A0D14', at: '#5A9BFC' } },
  { id: 'sheet', name: 'Sheet and biro',
    L: { bg: '#FFFFFF', sf: '#F4F4F4', ink: '#111111', mu: '#6B6B6B', ac: '#1A4BE0', ai: '#FFFFFF', at: '#1A4BE0' },
    D: { bg: '#111111', sf: '#1C1C1C', ink: '#F2F2F2', mu: '#8F8F8F', ac: '#6F95FF', ai: '#111111', at: '#6F95FF' } },
  { id: 'slate', name: 'Slate and teal',
    L: { bg: '#F7F9FA', sf: '#ECF0F2', ink: '#1F3038', mu: '#5D6B72', ac: '#0D7480', ai: '#FFFFFF', at: '#0D7480' },
    D: { bg: '#161C1A', sf: '#1F2725', ink: '#E3E2DA', mu: '#8E948D', ac: '#7CC4C9', ai: '#161C1A', at: '#7CC4C9' } },
  { id: 'sage', name: 'Stone and sage',
    L: { bg: '#EEECEA', sf: '#E4E1DD', ink: '#333231', mu: '#64605C', ac: '#5C6B54', ai: '#FFFFFF', at: '#586751' },
    D: { bg: '#1C1C1C', sf: '#262626', ink: '#F1F1EF', mu: '#9A9B96', ac: '#8FA68E', ai: '#1C1C1C', at: '#8FA68E' } },
  { id: 'signal', name: 'Signal',
    L: { bg: '#FFFFFF', sf: '#F2F2F2', ink: '#0A0A0A', mu: '#6B6B6B', ac: '#D92B21', ai: '#FFFFFF', at: '#D02920' },
    D: { bg: '#18191B', sf: '#222427', ink: '#EFF0F1', mu: '#9C9EA3', ac: '#FF4A1F', ai: '#18191B', at: '#FF4A1F' } }
];
const hexA = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const mixHex = (a, b, k) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const x = p(a), y = p(b); return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
// the full token set for one theme in one mode
function tokens(th, dark) {
  const t = dark ? th.D : th.L, solid = dark ? mixHex(t.bg, t.sf, 0.5) : mixHex(t.bg, '#ffffff', 0.6);
  const tb = dark ? mixHex(t.bg, t.ink, 0.2) : mixHex(t.bg, t.ink, 0.09);
  return { bg: t.bg, tile: t.sf, solid, ink: t.ink, sub: mixHex(t.ink, t.mu, 0.45), mute: t.mu, acc: t.at, ac: t.ac, ai: t.ai, accd: th.D.at,
    tb, tl: mixHex(tb, t.at, dark ? 0.45 : 0.35), link: t.a2 || t.at, packet: t.ac };
}
const themeVars = (th, dark) => { const k = tokens(th, dark); return `--bg:${k.bg};--ink:${k.ink};--sub:${k.sub};--mute:${k.mute};--line:${dark ? 'rgba(255,255,255,.1)' : hexA(k.ink, 0.12)};--tile:${k.tile};--card:${hexA(k.solid, dark ? 0.82 : 0.84)};--solid:${k.solid};--inv:${k.ink};--invfg:${k.solid};--acc:${k.acc};--ac:${k.ac};--ai:${k.ai};--accd:${k.accd};`; };
// appended last in the document so it wins over the base tokens wherever the page's own <style> ends up
const themeStyle = document.createElement('style'); themeStyle.id = 'theme'; document.body.appendChild(themeStyle);
const metaTheme = document.querySelector('meta[name="theme-color"]') || document.head.appendChild(Object.assign(document.createElement('meta'), { name: 'theme-color' }));
let THEME = THEMES.find((p) => p.id === store.get('lab-palette')) || THEMES[0];
let themeMode = store.get('lab-theme') || 'auto';
const themeHooks = [];
// a theme or mode change cross-fades the page's colours over 240ms (the 3D world follows in scene.js)
let themingT = 0;
function crossFade() { if (reduced || !document.body.classList.contains('ready')) return; document.documentElement.classList.add('theming'); clearTimeout(themingT); themingT = setTimeout(() => document.documentElement.classList.remove('theming'), 300); }
const isDark = () => themeMode === 'dark' || (themeMode === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
// the 3D world's colours for the current theme: ground, contour lines, link lines and packets
const world3D = (dark) => tokens(THEME, dark);
function syncThemeColor() { metaTheme.content = tokens(THEME, isDark()).bg; }
function applyThemeChoice(th) {
  crossFade(); THEME = th;
  themeStyle.textContent = `:root{${themeVars(th)}}@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${themeVars(th, 1)}color-scheme:dark}}:root[data-theme="dark"]{${themeVars(th, 1)}color-scheme:dark}`
    + `@media print{:root,:root[data-theme]{${themeVars(th)}--bg:#fff;color-scheme:light}}`;
  syncThemeColor(); themeHooks.forEach((f) => f());
}
function applyMode(m) {
  crossFade(); themeMode = m;
  if (m === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', m);
  syncThemeColor(); themeHooks.forEach((f) => f());
}
applyThemeChoice(THEME); if (themeMode !== 'auto') applyMode(themeMode);
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { crossFade(); syncThemeColor(); });
requestAnimationFrame(() => document.body.classList.add('ready'));

// ===================== Settings: theme, appearance, experience and sound in one sheet =====================
const setPanel = document.getElementById('settings'), setBtn = document.getElementById('setBtn');
// the lab layout is applied by the 3D code (layouts.js) once it has loaded
let onLabLayout = null;
const swatch = (t) => `<i style="background:${t.bg};border-color:${hexA(t.ink, 0.18)}"><b style="background:${t.ac}"></b></i>`;
function renderSettings() {
  setPanel.querySelector('.themes').innerHTML = THEMES.map((p, i) => `<button type="button" class="theme" data-theme-id="${p.id}" aria-pressed="${p === THEME}"><span class="sw" aria-hidden="true">${swatch(p.L)}${swatch(p.D)}</span><span class="tn">${p.name}${i === 0 ? '<small>Default</small>' : ''}</span></button>`).join('');
  const cur = { mode: themeMode, exp: LITE ? 'lite' : '3d', sound: Sound.on ? 'on' : 'off', lab: store.get('lab-layout') || 'ring' };
  setPanel.querySelectorAll('[data-set]').forEach((b) => { const [k, v] = b.dataset.set.split(':'); b.setAttribute('aria-pressed', String(cur[k] === v)); });
}
let closeT = 0;
function toggleSettings(open = setPanel.hidden || setPanel.classList.contains('closing'), viaKeys = false) {
  if (open === (!setPanel.hidden && !setPanel.classList.contains('closing'))) return;
  clearTimeout(closeT); setPanel.classList.remove('closing'); setPanel.classList.toggle('instant', viaKeys);
  setBtn.setAttribute('aria-expanded', String(open));
  // closing plays a short fade (180ms) before the sheet is hidden; from the keyboard it goes at once
  if (!open && !viaKeys && !reduced) { setPanel.classList.add('closing'); closeT = setTimeout(() => { setPanel.hidden = true; setPanel.classList.remove('closing'); }, 180); }
  else setPanel.hidden = !open;
  if (open) { renderSettings(); help.hidden = true; setPanel.querySelector('[aria-pressed="true"]').focus({ preventScroll: true }); }
  else if (setPanel.contains(document.activeElement) || document.activeElement === document.body) setBtn.focus({ preventScroll: true });
}
// a click that comes from Enter or Space has detail 0: the sheet then appears without animating
setBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleSettings(setPanel.hidden, e.detail === 0); });
setPanel.addEventListener('click', (e) => {
  e.stopPropagation();
  const th = e.target.closest('[data-theme-id]'), s = e.target.closest('[data-set]');
  if (th) { const p = THEMES.find((x) => x.id === th.dataset.themeId); applyThemeChoice(p); store.set('lab-palette', p.id); track('theme', { id: p.id }); }
  if (s) {
    const [k, v] = s.dataset.set.split(':');
    if (k === 'mode') { applyMode(v); store.set('lab-theme', v); track('mode', { mode: v }); }
    if (k === 'exp' && (v === 'lite') !== LITE) { store.set('lab-mode', v); track('experience', { to: v }); location.reload(); return; }
    if (k === 'sound' && (v === 'on') !== Sound.on) { Sound.toggle(); track('sound', { on: Sound.on }); }
    if (k === 'lab') { store.set('lab-layout', v); track('lab_layout', { to: v }); if (onLabLayout) onLabLayout(v); }
  }
  if (e.target.closest('[data-set-close]')) { toggleSettings(false); return; }
  if (th || s) { const id = (th || s).dataset.themeId || (th || s).dataset.set; renderSettings(); setPanel.querySelector(`[data-theme-id="${id}"], [data-set="${id}"]`).focus({ preventScroll: true }); }
});
document.addEventListener('click', () => { if (!setPanel.hidden) toggleSettings(false); });
addEventListener('keydown', (e) => {
  if (e.target.closest && e.target.closest('input, textarea')) return;
  if (e.key === 'Escape' && !setPanel.hidden) { toggleSettings(false, true); e.stopImmediatePropagation(); }
  else if ((e.key === 's' || e.key === 'S') && !e.metaKey && !e.ctrlKey && !e.altKey) toggleSettings(setPanel.hidden, true);
}, true);
