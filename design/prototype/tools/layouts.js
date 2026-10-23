// node layouts.js <page.html> <outDir> desk|phone [layout...]: each lab layout at the overview, three stops and the flight path,
// then a click on the front object (it should open that case study) and, for the carousel, a drag
const { chromium } = require('playwright'); const path = require('path');
const [file, out, vp = 'desk', ...only] = process.argv.slice(2);
const LAYS = only.length ? only : ['ring', 'bench', 'carousel', 'tower', 'shelves', 'sites'];
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] }); const errs = [];
  const phone = vp === 'phone';
  for (const L of LAYS) {
    const c = await b.newContext({ viewport: phone ? { width: 412, height: 915 } : { width: 1440, height: 900 }, isMobile: phone, hasTouch: phone });
    await c.addInitScript((L) => localStorage.setItem('lab-layout', L), L);
    const p = await c.newPage(); p.on('pageerror', (e) => errs.push(L + ': ' + e.message));
    await p.goto('file://' + path.resolve(file), { waitUntil: 'load' }); await p.waitForTimeout(3500);
    const go = async (fn, name) => { await p.evaluate(fn); await p.waitForTimeout(3200); await p.screenshot({ path: `${out}/${L}-${vp}-${name}.png` }); };
    await go(() => scrollTo(0, innerHeight * 0.85), 'over');
    for (const k of [0, 2, 8]) await go(`(() => { const el = document.getElementById('stops').children[${k}]; scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2); })()`, 'stop' + k);
    await go(() => { const el = document.getElementById('timeline'); scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2); }, 'timeline');
    // back to stop 2, then drag (carousel) and click the front object
    await p.evaluate(() => { const el = document.getElementById('stops').children[2]; scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2); }); await p.waitForTimeout(3000);
    const tag = await p.evaluate(() => { const t = [...document.querySelectorAll('.tag.front')].find((e) => e.style.opacity === '1'); if (!t) return null; const r = t.getBoundingClientRect(); return { name: t.querySelector('b').textContent, x: r.left + r.width / 2, y: r.bottom + 40 }; });
    let dragged = '';
    const frontName = () => p.evaluate(() => { const t = [...document.querySelectorAll('.tag.front')].find((e) => e.style.opacity === '1'); return t ? t.querySelector('b').textContent : null; });
    if (L === 'carousel') {
      // a slow drag of about one plinth to the left should bring the next project round; then a hard flick, which may turn at most three
      const W = phone ? 412 : 1440, y = phone ? 300 : 600, x0 = W * 0.6;
      const drag = async (dx, steps, wait) => {
        if (phone) { const s = await p.context().newCDPSession(p); const tp = (type, x) => s.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }] }); await tp('touchStart', x0); for (let i = 1; i <= steps; i++) { await tp('touchMove', x0 + dx * i / steps); await p.waitForTimeout(wait); } await tp('touchEnd'); await s.detach(); }
        else { await p.mouse.move(x0, y); await p.mouse.down(); for (let i = 1; i <= steps; i++) { await p.mouse.move(x0 + dx * i / steps, y); await p.waitForTimeout(wait); } await p.mouse.up(); }
      };
      await drag(-95, 12, 40); await p.waitForTimeout(1500);
      dragged = ` · after slow drag, front: ${await frontName()}`; await p.screenshot({ path: `${out}/${L}-${vp}-dragged.png` });
      await drag(-300, 6, 8); const t0 = Date.now(); let fl = null; while (!fl && Date.now() - t0 < 4000) { await p.waitForTimeout(100); fl = await frontName(); }
      dragged += ` · after flick, front: ${fl} (label in ${Date.now() - t0}ms)`;
      await drag(300, 6, 8); await p.waitForTimeout(1800); await drag(-95, 12, 40); await p.waitForTimeout(1800);
      dragged += ` · back + one: ${await frontName()}`;
      if (phone) {
        // a two-finger spread should zoom in (zoomT falls) without scrolling the page; a horizontal drag should not scroll it either
        const y0 = await p.evaluate(() => scrollY), z0 = await p.evaluate(() => __car.zoomT), s = await p.context().newCDPSession(p);
        const two = (type, d) => s.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x: 206 - d, y: 330, id: 1 }, { x: 206 + d, y: 330, id: 2 }] });
        await two('touchStart', 40); for (let i = 1; i <= 8; i++) { await two('touchMove', 40 + i * 10); await p.waitForTimeout(30); } await two('touchEnd'); await s.detach(); await p.waitForTimeout(800);
        dragged += ` · pinch zoomT ${z0.toFixed(2)}→${(await p.evaluate(() => __car.zoomT)).toFixed(2)} · scroll moved ${(await p.evaluate(() => scrollY)) - y0}px`;
        await p.evaluate(() => { __car.zoomT = 1; }); await p.waitForTimeout(600);
        const zr = await p.evaluate(() => { const r = document.getElementById('zoomctl').getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom].map(Math.round).join(','); });
        dragged += ` · zoom buttons at ${zr}`;
      }
      await p.click('#zoomctl [data-z="0.8"]'); await p.click('#zoomctl [data-z="0.8"]'); await p.waitForTimeout(1200); await p.screenshot({ path: `${out}/${L}-${vp}-zoomed.png` });
      dragged += ` · zoomT ${(await p.evaluate(() => window.__car && __car.zoomT.toFixed(2)))}`;
    }
    const front = await p.evaluate(() => { const t = [...document.querySelectorAll('.tag.front')].find((e) => e.style.opacity === '1'); if (!t) return null; const r = t.getBoundingClientRect(); return { name: t.querySelector('b').textContent, x: r.left + r.width / 2, y: r.bottom + 50 }; });
    let opened = 'no front label';
    // click the object under its label; a thin object (antennas) can leave a gap, so try a little lower before calling it a miss
    if (front) for (const dy of [0, 80, 160, 240]) { await p.mouse.click(front.x, front.y + dy); await p.waitForTimeout(1500); opened = await p.evaluate(() => location.hash || 'nothing'); if (opened !== 'nothing') { if (dy) opened += ` (+${dy}px)`; break; } }
    console.log(`${L} ${vp}: front ${tag && tag.name}${dragged} · click below "${front && front.name}" → ${opened}`);
    await c.close();
  }
  await b.close(); console.log(errs.join('\n') || 'no errors');
})();
