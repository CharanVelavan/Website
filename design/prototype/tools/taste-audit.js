// node taste-audit.js <page.html> [route]: a local stand-in for Taste's inspector. Checks the rules v5 stage 3 targets
// at 1440, 768 and 412px, on the hero and on each 3D chapter, plus reduced motion on the first screen.
const { chromium } = require('playwright');
const path = require('path');
const [file, route = ''] = process.argv.slice(2);
const CHECK = () => {
  const out = {}; const add = (k, v) => { (out[k] = out[k] || []).push(v); };
  const vis = (el) => { const s = getComputedStyle(el), b = el.getBoundingClientRect(); return s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05 && b.width > 0 && b.height > 0 && b.bottom > 0 && b.top < innerHeight && b.right > 0 && b.left < innerWidth; };
  const inDialog = (el) => el.closest('#settings, .panel, #lightbox, #toast, #term');
  const fams = new Set(), sizes = new Set(); const textEls = [];
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
  while ((n = tw.nextNode())) {
    const t = n.textContent.trim(); if (!t) continue; const el = n.parentElement; if (!el || !vis(el) || inDialog(el) || el.closest('#tags')) continue;
    const s = getComputedStyle(el), fam = s.fontFamily.split(',')[0].replace(/["']/g, '').trim(), fs = parseFloat(s.fontSize);
    const code = !!el.closest('pre, code, #term');
    if (!code) { fams.add(fam); sizes.add(fs); if (/mono|menlo|courier/i.test(s.fontFamily.split(',')[0])) add('mono', t.slice(0, 24)); }
    if (fs < 13) add('small-text', `${fs}px "${t.slice(0, 20)}"`);
    if (/^0\d$/.test(t)) add('numbering', t);
    if (/\p{Extended_Pictographic}/u.test(t)) add('emoji', t.slice(0, 20));
    if (t.includes('—')) add('em-dash', t.slice(0, 40));
    if (s.textTransform === 'uppercase' && t.length > 2) add('uppercase-label', t.slice(0, 24));
    textEls.push(el);
  }
  document.querySelectorAll('h1, h2, h3').forEach((h) => { if (!vis(h)) return; const p = h.previousElementSibling; if (p && vis(p) && p.textContent.trim().length < 50 && parseFloat(getComputedStyle(p).fontSize) <= parseFloat(getComputedStyle(h).fontSize) * 0.6 && !p.matches('img, .profile, .ph')) add('eyebrow', `"${p.textContent.trim().slice(0, 30)}" above "${h.textContent.trim().slice(0, 30)}"`); });
  document.querySelectorAll('body *').forEach((el) => {
    if (!vis(el) || el.closest('#tags')) return; const s = getComputedStyle(el), b = el.getBoundingClientRect();
    const name = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.classList[0] ? '.' + el.classList[0] : '');
    if (s.backdropFilter && s.backdropFilter !== 'none' && !el.matches('header, header *')) add('glass', name);
    if (s.boxShadow !== 'none' && !inDialog(el) && /\d+px \d+px [1-9]/.test(s.boxShadow) && !/inset/.test(s.boxShadow)) add('shadow', name);
    const w = ['Top', 'Right', 'Bottom', 'Left'].map((k) => (s['border' + k + 'Style'] !== 'none' ? parseFloat(s['border' + k + 'Width']) : 0));
    if (['Top', 'Right', 'Bottom', 'Left'].some((k) => /dashed|dotted/.test(s['border' + k + 'Style']))) add('dashed', name);
    if (!el.closest('.det, .sw, #term') && w.every((x) => x >= 0.5 && x < 3)) add('outlined-box', name);
    else if (!el.closest('.det') && w.some((x) => x >= 0.5 && x < 2) && Math.max(b.width, b.height) > 100) add('hairline', name);
  });
  const h1 = [...document.querySelectorAll('h1')].find(vis); if (!h1 && scrollY < 50) add('no-title', 'no visible h1 on the first screen');
  if (innerWidth < 500) {
    let L = 1e9, R = 1e9; textEls.forEach((el) => { if (el.closest('.stack, .marquee, #tlList, .tl, #chips, .tabs')) return; const b = el.getBoundingClientRect(); L = Math.min(L, b.left); R = Math.min(R, innerWidth - b.right); if (b.left < 15.5 || innerWidth - b.right < 15.5) add('edge-text', `"${el.textContent.trim().slice(0, 20)}" ${Math.round(Math.min(b.left, innerWidth - b.right))}px`); });
    if (Math.abs(L - R) > 8 && L < 1e8) add('off-centre', `left ${Math.round(L)}px, right ${Math.round(R)}px`);
    document.querySelectorAll('a, button, [role=tab], input, summary').forEach((el) => { if (!vis(el) || inDialog(el) || el.closest('#tags')) return; const b = el.getBoundingClientRect(); if (b.height < 43.5 || b.width < 43.5) add('target<44', `${el.tagName.toLowerCase()}${el.className ? '.' + String(el.className).split(' ')[0] : ''} ${Math.round(b.width)}x${Math.round(b.height)} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 16)}"`); });
  }
  out['font-count'] = [...fams]; out['size-count'] = [...sizes].sort((a, b) => a - b);
  return out;
};
const FAIL = ['eyebrow', 'mono', 'numbering', 'emoji', 'shadow', 'hairline', 'outlined-box', 'small-text', 'no-title', 'off-centre', 'em-dash', 'target<44', 'reduced-hidden'];
(async () => {
  const b = await chromium.launch({ headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] });
  let fails = 0;
  for (const [w, h] of [[1440, 900], [768, 1024], [412, 915]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 500, hasTouch: w < 500 });
    const p = await ctx.newPage(); await p.goto('file://' + path.resolve(file) + route, { waitUntil: 'load' }); await p.waitForTimeout(2500);
    const spots = route ? [null] : [null, 'lab', 'timeline', 'contact'];
    const all = {};
    for (const s of spots) {
      if (s) { await p.evaluate((id) => { const el = document.getElementById(id); scrollTo(0, el.offsetTop + el.offsetHeight * 0.45 - innerHeight / 2); }, s); await p.waitForTimeout(1800); }
      const r = await p.evaluate(CHECK);
      for (const [k, v] of Object.entries(r)) { all[k] = all[k] || new Set(); v.forEach((x) => all[k].add(typeof x === 'number' ? x : (s ? s + ': ' : '') + x)); }
    }
    await ctx.close();
    const rc = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce', isMobile: w < 500 });
    const rp = await rc.newPage(); await rp.goto('file://' + path.resolve(file) + route, { waitUntil: 'load' }); await rp.waitForTimeout(1500);
    const hidden = await rp.evaluate(() => { const r = []; const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = tw.nextNode())) { const el = n.parentElement; if (!n.textContent.trim() || !el) continue; const b = el.getBoundingClientRect(), s = getComputedStyle(el); if (b.top < innerHeight && b.bottom > 0 && b.width > 0 && s.display !== 'none' && s.visibility !== 'hidden') { let o = 1, e = el; while (e) { o *= +getComputedStyle(e).opacity; e = e.parentElement; } if (o < 0.05 && !el.closest('#tags, [hidden], #proj, #litedoc')) r.push(n.textContent.trim().slice(0, 30)); } } return r; });
    if (hidden.length) all['reduced-hidden'] = new Set(hidden);
    await rc.close();
    console.log(`\n== ${w}px`);
    for (const [k, v] of Object.entries(all)) {
      const arr = [...v]; const lvl = FAIL.includes(k) ? 'FAIL' : 'info';
      if (k === 'font-count' || k === 'size-count') { console.log(`info ${k}: ${arr.join(', ')}`); continue; }
      if (lvl === 'FAIL') fails += arr.length; console.log(`${lvl} ${k} (${arr.length}): ${arr.slice(0, 6).join(' | ')}`);
    }
  }
  await b.close(); console.log(`\n${fails} fail item(s)`);
})();
