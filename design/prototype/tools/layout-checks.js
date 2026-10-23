// node layout-checks.js <page.html> [layout...]: per lab layout, the draw calls at the overview, a stop and the flight path; the flight path's
// pins on screen; reduced motion (3D chosen in Settings) settling at once; and keyboard focus never landing on something hidden
const { chromium } = require('playwright'); const path = require('path');
const [file, ...only] = process.argv.slice(2);
const LAYS = only.length ? only : ['ring', 'bench', 'carousel', 'tower', 'shelves', 'sites'];
const to = (sel, k) => `(() => { const el = ${k == null ? `document.getElementById('${sel}')` : `document.getElementById('${sel}').children[${k}]`}; scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2); })()`;
const frontName = () => `(() => { const t = [...document.querySelectorAll('.tag.front')].find((e) => e.style.opacity === '1'); return t ? t.querySelector('b').textContent : null; })()`;
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] }); const errs = [];
  for (const L of LAYS) {
    // normal motion: draw calls, flight path, keyboard
    let c = await b.newContext({ viewport: { width: 1440, height: 900 } });
    await c.addInitScript((L) => localStorage.setItem('lab-layout', L), L);
    let p = await c.newPage(); p.on('pageerror', (e) => errs.push(L + ': ' + e.message));
    await p.goto('file://' + path.resolve(file), { waitUntil: 'load' }); await p.waitForTimeout(3000);
    const calls = {};
    await p.evaluate(() => scrollTo(0, innerHeight * 0.85)); await p.waitForTimeout(2500); calls.over = await p.evaluate(() => window.__calls);
    await p.evaluate(to('stops', 2)); await p.waitForTimeout(2500); calls.stop = await p.evaluate(() => window.__calls);
    // keyboard from the chapter card: twenty tabs, none may land on something invisible
    await p.focus('section.ch .card button, section.ch .card a').catch(() => {});
    const badFocus = new Set();
    for (let i = 0; i < 20; i++) {
      await p.keyboard.press('Tab'); await p.waitForTimeout(450);
      const f = await p.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; let o = 1; for (let n = e; n && n.nodeType === 1; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.visibility === 'hidden' || cs.display === 'none') o = 0; o *= +cs.opacity; } const r = e.getBoundingClientRect(); return { k: (e.id || e.className || e.tagName) + ' ' + (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 20), hidden: o < 0.05 || r.width === 0 }; });
      if (f && f.hidden) badFocus.add(f.k);
    }
    // the zoom buttons must leave the tab order whenever they are not shown
    const zoomTab = await p.evaluate(() => { const z = document.getElementById('zoomctl'); return z.classList.contains('on') ? 'shown' : getComputedStyle(z).visibility === 'hidden' ? 'hidden, out of tab order' : 'invisible but focusable'; });
    if (!/shown|out of/.test(zoomTab)) badFocus.add('zoomctl ' + zoomTab);
    await p.evaluate(to('timeline')); await p.waitForTimeout(3500); calls.tl = await p.evaluate(() => window.__calls);
    const tl = await p.evaluate(() => { const ts = [...document.querySelectorAll('.tag')].filter((e) => /^\s*(\d{4}|Now)/.test(e.textContent) && e.style.opacity === '1'); const total = [...document.querySelectorAll('.tag')].filter((e) => /^\s*(\d{4}|Now)/.test(e.textContent)).length; return ts.length + '/' + total; });
    await c.close();
    // reduced motion with 3D chosen: the front label shows at once, the carousel snaps without a glide, the pins are all up
    c = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await c.addInitScript((L) => { localStorage.setItem('lab-layout', L); localStorage.setItem('lab-mode', '3d'); }, L);
    p = await c.newPage(); p.on('pageerror', (e) => errs.push(L + ' reduced: ' + e.message));
    await p.goto('file://' + path.resolve(file), { waitUntil: 'load' }); await p.waitForTimeout(2500);
    const lite = await p.evaluate(() => document.body.classList.contains('lite'));
    let rm = lite ? 'lite (3D not kept)' : '';
    if (!lite) {
      await p.evaluate(to('stops', 2)); await p.waitForTimeout(900); rm = `front ${await p.evaluate(frontName())}`;
      if (L === 'carousel') { await p.mouse.move(860, 600); await p.mouse.down(); for (let i = 1; i <= 12; i++) { await p.mouse.move(860 - i * 8, 600); await p.waitForTimeout(30); } await p.mouse.up(); await p.waitForTimeout(250); rm += ` · 250ms after drag: ${await p.evaluate(frontName())}`; }
      await p.evaluate(to('timeline')); await p.waitForTimeout(2500);
      rm += ` · pins ${await p.evaluate(() => { const ts = [...document.querySelectorAll('.tag')].filter((e) => /^\s*(\d{4}|Now)/.test(e.textContent)); return ts.filter((e) => e.style.opacity === '1').length + '/' + ts.length; })}`;
    }
    await c.close();
    console.log(`${L.padEnd(8)} calls over ${calls.over} · stop ${calls.stop} · flight ${calls.tl} | flight pins ${tl} | hidden focus: ${[...badFocus].join(' | ') || 'none'} | reduced: ${rm}`);
  }
  await b.close(); console.log(errs.join('\n') || 'no errors');
})();
