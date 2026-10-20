
// ===================== palettes: six looks, each tuned for light and dark =====================
// page tokens, plus the 3D world's ground (tb terrain, tl contour lines) and accent (a3 deep, a3l light)
const PALETTES = [
  { id: 'clay', name: 'Clay', note: 'Warm paper, burnt copper — the current look',
    L: { bg: '#EEEAE2', ink: '#15161A', sub: '#2E3036', mute: '#5A5D64', tile: '#E2DCD0', solid: '#F7F5F0', acc: '#9A4E25', accd: '#E9C2A6', tb: '#d9d2c3', tl: '#b59d82', a3: '#9a4e25', a3l: '#d9733a' },
    D: { bg: '#0F1012', ink: '#EDE9E2', sub: '#C9C4BA', mute: '#9A958B', tile: '#1B1C21', solid: '#17181B', acc: '#D39A72', accd: '#E9C2A6', tb: '#4c5059', tl: '#8a7360', a3: '#b86a3e', a3l: '#e39462' } },
  { id: 'cobalt', name: 'Cobalt', note: 'Cool slate with an engineering blue',
    L: { bg: '#ECEFF3', ink: '#111722', sub: '#2B3342', mute: '#566070', tile: '#DCE2EA', solid: '#F7F9FB', acc: '#2C56C8', accd: '#B9CBF6', tb: '#cfd6e0', tl: '#97a6bd', a3: '#2c56c8', a3l: '#5b84f0' },
    D: { bg: '#0C1016', ink: '#E6EBF2', sub: '#BCC5D3', mute: '#8A94A6', tile: '#171D27', solid: '#141A23', acc: '#86A6F2', accd: '#B9CBF6', tb: '#465063', tl: '#6d82a8', a3: '#4f78e0', a3l: '#8fb0ff' } },
  { id: 'moss', name: 'Moss', note: 'Field green on stone — calm and outdoorsy',
    L: { bg: '#EDEFE9', ink: '#141A16', sub: '#2D352F', mute: '#586159', tile: '#DDE2D8', solid: '#F6F7F3', acc: '#2E6A4C', accd: '#BFE0CC', tb: '#d3d8cb', tl: '#9eae96', a3: '#2e6a4c', a3l: '#4f9a72' },
    D: { bg: '#0D110F', ink: '#E5EBE6', sub: '#BDC6BF', mute: '#8B968E', tile: '#18201B', solid: '#151B17', acc: '#7FC4A0', accd: '#BFE0CC', tb: '#47524a', tl: '#6f8a78', a3: '#3f8a63', a3l: '#86d0a8' } },
  { id: 'amber', name: 'Graphite', note: 'Neutral greys with a signal amber',
    L: { bg: '#F1F0EE', ink: '#161616', sub: '#303030', mute: '#5C5C5C', tile: '#E3E1DD', solid: '#FAF9F7', acc: '#955800', accd: '#F2CE8E', tb: '#dcd8d0', tl: '#b3a58a', a3: '#a8650a', a3l: '#e0a040' },
    D: { bg: '#101010', ink: '#EEEEEC', sub: '#C8C8C4', mute: '#999993', tile: '#1C1C1C', solid: '#181818', acc: '#E3AA55', accd: '#F2CE8E', tb: '#4e4e4e', tl: '#8a7a58', a3: '#c4842a', a3l: '#f0b860' } },
  { id: 'wine', name: 'Oxblood', note: 'Rose paper with a deep wine accent',
    L: { bg: '#F2EDEB', ink: '#1A1415', sub: '#352C2D', mute: '#625759', tile: '#E6DCD9', solid: '#FAF6F5', acc: '#8A2E3B', accd: '#EBC0C6', tb: '#ddd2cd', tl: '#b8968f', a3: '#8a2e3b', a3l: '#c85a68' },
    D: { bg: '#110D0E', ink: '#EFE8E8', sub: '#CBBFC0', mute: '#9C8F91', tile: '#1E1718', solid: '#1A1415', acc: '#E0939C', accd: '#EBC0C6', tb: '#54494b', tl: '#8f6a70', a3: '#a8404e', a3l: '#e48a96' } },
  { id: 'teal', name: 'Harbour', note: 'Sea-glass greys and ink teal',
    L: { bg: '#EBF1F0', ink: '#10191A', sub: '#293536', mute: '#536162', tile: '#D9E3E2', solid: '#F6FAF9', acc: '#1D6A6D', accd: '#B5E0E0', tb: '#cad8d6', tl: '#8fadaa', a3: '#1d6a6d', a3l: '#3fa3a6' },
    D: { bg: '#0A1112', ink: '#E3EEEE', sub: '#B9C9C9', mute: '#879A9A', tile: '#142021', solid: '#121D1E', acc: '#6CC6C6', accd: '#B5E0E0', tb: '#435657', tl: '#5f8b8c', a3: '#2a8a8d', a3l: '#78d0d0' } }
];
const hexA = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const palVars = (t, dark) => `--bg:${t.bg};--ink:${t.ink};--sub:${t.sub};--mute:${t.mute};--line:${dark ? 'rgba(255,255,255,.1)' : hexA(t.ink, 0.12)};--tile:${t.tile};--card:${hexA(t.solid, dark ? 0.82 : 0.84)};--solid:${t.solid};--inv:${t.ink};--invfg:${t.solid};--acc:${t.acc};--accd:${t.accd};`;
// appended last in the document so it wins over the base tokens wherever the page's own <style> ends up
const palStyle = document.createElement('style'); palStyle.id = 'palette'; document.body.appendChild(palStyle);
let PAL = PALETTES.find((p) => p.id === store.get('lab-palette')) || PALETTES[0];
let themeMode = store.get('lab-theme') || 'auto';
const palHooks = [];
function applyPalette(p) {
  PAL = p;
  palStyle.textContent = `:root{${palVars(p.L)}}@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${palVars(p.D, 1)}color-scheme:dark}}:root[data-theme="dark"]{${palVars(p.D, 1)}color-scheme:dark}`
    + `@media print{:root,:root[data-theme]{${palVars(p.L)}--bg:#fff;color-scheme:light}}`;
  palHooks.forEach((f) => f());
}
function applyMode(m) {
  themeMode = m;
  if (m === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', m);
  palHooks.forEach((f) => f());
}
applyPalette(PAL); if (themeMode !== 'auto') applyMode(themeMode);

// the picker: a popover under the header (a sheet on phones)
const palPanel = document.getElementById('palPanel'), palBtn = document.getElementById('palBtn');
const mini = (t, dark) => `<span class="pm" style="background:${t.bg};border-color:${dark ? 'rgba(255,255,255,.12)' : hexA(t.ink, 0.14)}"><b style="color:${t.ink}">Aa</b><i style="background:${t.acc}"></i><em style="background:${t.tile}"></em><em style="background:${t.solid}"></em></span>`;
function renderPalPanel() {
  palPanel.querySelector('.pgrid').innerHTML = PALETTES.map((p) => `<button type="button" class="pcard" data-pal="${p.id}" aria-pressed="${p === PAL}"><span class="pms">${mini(p.L)}${mini(p.D, 1)}</span><span class="pn"><b>${p.name}</b><small>${p.note}</small></span></button>`).join('');
  palPanel.querySelectorAll('[data-mode-t]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.modeT === themeMode)));
}
function togglePal(open = palPanel.hidden) { palPanel.hidden = !open; palBtn.setAttribute('aria-expanded', String(open)); if (open) { renderPalPanel(); help.hidden = true; } }
palBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePal(); });
palPanel.addEventListener('click', (e) => {
  e.stopPropagation();
  const c = e.target.closest('[data-pal]'), m = e.target.closest('[data-mode-t]');
  if (c) { const p = PALETTES.find((x) => x.id === c.dataset.pal); applyPalette(p); store.set('lab-palette', p.id); track('palette', { id: p.id }); renderPalPanel(); }
  if (m) { applyMode(m.dataset.modeT); store.set('lab-theme', m.dataset.modeT); track('theme', { mode: m.dataset.modeT }); renderPalPanel(); }
  if (e.target.closest('[data-pal-close]')) togglePal(false);
});
document.addEventListener('click', () => { if (!palPanel.hidden) togglePal(false); });
addEventListener('keydown', (e) => {
  if (e.target.closest && e.target.closest('input, textarea')) return;
  if (e.key === 'Escape' && !palPanel.hidden) { togglePal(false); e.stopImmediatePropagation(); }
  else if ((e.key === 'p' || e.key === 'P') && !e.metaKey && !e.ctrlKey && !e.altKey) togglePal();
}, true);
