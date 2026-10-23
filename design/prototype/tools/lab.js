// node lab.js <page.html> <outDir> desk|phone: the v6 lab. Tour stops by scroll; then explore: drag, walk, select a project
// (its overview panel), Escape, and a scroll that hands the camera back to the tour
const { chromium } = require('playwright'); const path = require('path');
const [file, out, vp = 'desk'] = process.argv.slice(2), phone = vp === 'phone';
const stop = (k) => `(() => { const el = document.getElementById('stops').children[${k}]; scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2); })()`;
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] }); const errs = [];
  const c = await b.newContext({ viewport: phone ? { width: 412, height: 915 } : { width: 1440, height: 900 }, isMobile: phone, hasTouch: phone });
  const p = await c.newPage(); p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push('console: ' + m.text()));
  // phones antialias, which SwiftShader does on the CPU (about 220 ms a frame against 150): this script's fixed waits then
  // fall behind the camera, so the phone run renders without it unless the URL says otherwise. Real phones are checked over adb
  const url = (/^https?:/.test(file) ? file : 'file://' + path.resolve(file)) + (phone && !/[?&]aa=/.test(file) ? (file.includes('?') ? '&' : '?') + 'aa=0' : '');
  await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(3500);
  if (/v7/.test(file)) { const t0 = Date.now(); await p.waitForFunction(() => document.body.classList.contains('lab-ready'), null, { timeout: 90000 }).catch(() => errs.push('lab never ready')); console.log('lab ready after', Date.now() - t0, 'ms'); await p.waitForTimeout(1500); }
  const shot = (n) => p.screenshot({ path: `${out}/${vp}-${n}.png` });
  const state = () => p.evaluate(() => ({ p: +(window.__p || 0).toFixed(2), ex: window.__ex && __ex.on, focus: window.__ex && __ex.focus, panel: document.getElementById('lpanel').classList.contains('on') && document.getElementById('lpanel').dataset.id, tags: [...document.querySelectorAll('.labtag')].filter((e) => e.style.opacity === '1').map((e) => e.querySelector('b').textContent).join(', '), calls: window.__calls }));
  await shot('hero');
  const stops = { over: 0, ba: 1, ne: 2, sw: 3, tz: 4, or: 5, de: 6, wb: 7, ss: 8, sa: 9, shelf: 10, back: 11 };
  for (const [n, k] of Object.entries(stops)) { await p.evaluate(stop(k)); await p.waitForTimeout(2600); await shot('tour-' + n); console.log('tour', n.padEnd(5), JSON.stringify(await state())); }
  // explore from the overview: drag to look, click the floor to walk, click a project
  await p.evaluate(stop(0)); await p.waitForTimeout(2600);
  const W = phone ? 412 : 1440, H = phone ? 915 : 900;
  if (!phone) { await p.mouse.move(W * 0.62, H * 0.5); await p.mouse.down(); for (let i = 1; i <= 10; i++) { await p.mouse.move(W * 0.62 - i * 18, H * 0.5); await p.waitForTimeout(30); } await p.mouse.up(); }
  if (phone) {
    // touch: a sideways swipe turns, a two-finger spread zooms in, and the page does not scroll
    const s = await c.newCDPSession(p), y0 = await p.evaluate(() => scrollY), tp = (type, pts) => s.send('Input.dispatchTouchEvent', { type, touchPoints: pts });
    await tp('touchStart', [{ x: 300, y: 300, id: 1 }]); for (let i = 1; i <= 10; i++) { await tp('touchMove', [{ x: 300 - i * 16, y: 302, id: 1 }]); await p.waitForTimeout(30); } await tp('touchEnd', []);
    await p.waitForTimeout(600); const d0 = await p.evaluate(() => __cc.distance);
    await tp('touchStart', [{ x: 170, y: 300, id: 1 }, { x: 240, y: 300, id: 2 }]); for (let i = 1; i <= 8; i++) { await tp('touchMove', [{ x: 170 - i * 10, y: 300, id: 1 }, { x: 240 + i * 10, y: 300, id: 2 }]); await p.waitForTimeout(30); } await tp('touchEnd', []);
    await p.waitForTimeout(800); console.log(`touch: swipe → exploring ${await p.evaluate(() => __ex.on)}, pinch distance ${d0.toFixed(2)} → ${(await p.evaluate(() => __cc.distance)).toFixed(2)}, page scrolled ${(await p.evaluate(() => scrollY)) - y0}px`);
    await tp('touchStart', [{ x: 206, y: 330, id: 1 }]); await tp('touchEnd', []); await s.detach();
  }
  await p.waitForTimeout(1200); await shot('ex-drag'); console.log('after drag', JSON.stringify(await state()));
  if (!phone) await p.mouse.click(W * 0.45, H * 0.9); await p.waitForTimeout(2000); await shot('ex-walk'); console.log('after walk', JSON.stringify(await state()));
  // select from the toolbar grid, then the next project in the panel, then Escape
  await p.keyboard.press('Escape'); await p.waitForTimeout(500);
  await p.click('#labbar [data-bar="all"]'); await p.waitForTimeout(400); await shot('ex-grid');
  await p.click('#lgrid [data-lp="wb"]'); await p.waitForTimeout(2400); await shot('panel-wb'); console.log('select wb', JSON.stringify(await state()));
  await p.click('#lpanel [data-lp]:last-child'); await p.waitForTimeout(2400); await shot('panel-next'); console.log('next', JSON.stringify(await state()));
  await p.keyboard.press('Escape'); await p.waitForTimeout(600); console.log('escape', JSON.stringify(await state()));
  // a scroll hands the camera back to the tour
  await p.mouse.wheel(0, 300); await p.waitForTimeout(2500); await shot('scroll-back'); console.log('scrolled', JSON.stringify(await state()));
  // click a project in the 3D: the label of the one in front at its tour stop
  await p.evaluate(stop(4)); await p.waitForTimeout(2600);
  const t = await p.evaluate(() => { const e = [...document.querySelectorAll('.labtag')].find((x) => x.style.opacity === '1'); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  if (t) { await p.mouse.click(t.x, t.y); await p.waitForTimeout(2400); await shot('panel-label'); console.log('label click', JSON.stringify(await state())); }
  // the tour's overview: ← → step the stops; the grid closes on an outside click and when the lab scrolls away
  if (!phone) { await p.evaluate(stop(4)); await p.waitForTimeout(2600); await p.keyboard.press('Escape'); await p.waitForTimeout(400); }
  await p.evaluate(stop(5)); await p.waitForTimeout(2600); console.log('tour panel', JSON.stringify(await state()));
  if (phone) { await p.click('#lpanel h2'); await p.waitForTimeout(700); await shot('sheet-grown'); await p.click('#lpanel .lp-grab'); await p.waitForTimeout(500); }
  await p.click('#lpanel .lp-nav button:last-child'); await p.waitForTimeout(3200); console.log('tour → next', JSON.stringify(await state()));
  await p.click('#labbar [data-bar="all"]', { force: true }).catch(() => {}); await p.waitForTimeout(300);
  await p.evaluate(stop(0)); await p.waitForTimeout(2200); await p.click('#labbar [data-bar="all"]'); await p.waitForTimeout(300);
  await p.mouse.click(phone ? 30 : 60, phone ? 820 : 450); await p.waitForTimeout(300); console.log('grid after outside click hidden:', await p.evaluate(() => document.getElementById('lgrid').hidden));
  await p.click('#labbar [data-bar="all"]'); await p.waitForTimeout(300); await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(1500);
  console.log('grid after scrolling to hero hidden:', await p.evaluate(() => document.getElementById('lgrid').hidden)); await shot('hero-back');
  await p.evaluate(stop(4)); await p.waitForTimeout(2600);
  // open the case study from the panel
  const go = await p.$('#lpanel [data-lp-go]'); if (go) { await go.click(); await p.waitForTimeout(2500); console.log('case study', await p.evaluate(() => location.hash)); await shot('case'); }
  await b.close(); console.log(errs.join('\n') || 'no errors');
})();
