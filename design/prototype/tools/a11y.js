// node a11y.js <page.html> <outDir>: keyboard only (tab order, visible focus, open with Enter, close with Escape) and reduced motion
const { chromium } = require('playwright'); const path = require('path');
const [file, out] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] }); const errs = [];
  const c = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await c.newPage(); p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file://' + path.resolve(file), { waitUntil: 'load' }); await p.waitForTimeout(3000);
  const seen = [], noRing = [];
  for (let i = 0; i < 60; i++) {
    await p.keyboard.press('Tab');
    const f = await p.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const cs = getComputedStyle(e), r = e.getBoundingClientRect(); return { k: e.tagName + (e.id ? '#' + e.id : '') + (e.dataset.id ? '[' + e.dataset.id + ']' : '') + ' ' + (e.textContent || '').trim().slice(0, 24), ring: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 || cs.boxShadow !== 'none', on: r.width > 0 && r.height > 0 }; });
    if (!f) continue; seen.push(f.k); if (!f.ring || !f.on) noRing.push(f.k);
  }
  console.log('focus stops', seen.length, '· without a visible ring', noRing.length ? noRing.join(' | ') : 'none');
  // open the Sewer Skimmer tile with Enter, close with Escape, focus comes back to the tile
  await p.focus('.cell[data-id="ss"]'); await p.keyboard.press('Enter'); await p.waitForTimeout(2500);
  const opened = await p.evaluate(() => location.hash); await p.keyboard.press('Escape'); await p.waitForTimeout(1500);
  const back = await p.evaluate(() => ({ hash: location.hash, focus: document.activeElement && (document.activeElement.dataset.id || document.activeElement.id || document.activeElement.tagName) }));
  console.log('Enter opened', opened, '· Escape →', JSON.stringify(back));
  await c.close();
  // reduced motion: Lite by default, everything still shows, a case study opens
  const r = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); const q = await r.newPage(); q.on('pageerror', (e) => errs.push('reduced: ' + e.message));
  await q.goto('file://' + path.resolve(file), { waitUntil: 'load' }); await q.waitForTimeout(2000);
  const rm = await q.evaluate(() => ({ lite: document.body.classList.contains('lite'), hidden: [...document.querySelectorAll('main *, .hero *')].filter((e) => getComputedStyle(e).opacity === '0' && e.offsetWidth > 0 && e.textContent.trim()).length }));
  await q.screenshot({ path: out + '/reduced-home.png' });
  await q.goto('file://' + path.resolve(file) + '#/projects/solar-sailor', { waitUntil: 'load' }); await q.waitForTimeout(2000);
  const rs = await q.evaluate(() => document.querySelectorAll('#litedoc .dsec').length); await q.screenshot({ path: out + '/reduced-case.png' });
  console.log('reduced motion: lite', rm.lite, '· text hidden at rest', rm.hidden, '· case sections', rs);
  await b.close(); console.log(errs.join('\n') || 'no errors');
})();
