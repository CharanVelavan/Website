// node case-narrow.js <url> <outDir> [id=ba] [width=354] [height=696]: a case study on a narrow phone, opened from the lab
// as a visitor would (tour stop, panel, Open case study), then scrolled through. At each step: a screenshot, whether the
// lab toolbar shows, the header pills' rows, which tab is lit against the section in view, what the fixed 3D area covers,
// and the pixel ratio the 3D is drawn at
const { chromium } = require('playwright'); const fs = require('fs');
const [url, out, id = 'ba', w = '354', h = '696'] = process.argv.slice(2);
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const errs = [];
  const c = await b.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 3.5, isMobile: true, hasTouch: true });
  const p = await c.newPage(); p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(url, { waitUntil: 'load' }); await p.waitForFunction(() => document.body.classList.contains('lab-ready'), null, { timeout: 90000 });
  // the lab's tour stops, in order
  const k = ['over', 'ba', 'ne', 'sw', 'tz', 'or', 'de', 'wb', 'ss', 'sa'].indexOf(id);
  await p.evaluate((k) => { const el = document.getElementById('stops').children[k]; scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2); }, k);
  await p.waitForTimeout(3000);
  await p.click('#lpanel [data-lp-go]'); await p.waitForTimeout(3000);
  const state = () => p.evaluate(() => {
    const vis = (el) => { if (!el) return false; const s = getComputedStyle(el), r = el.getBoundingClientRect(); return s.visibility !== 'hidden' && +s.opacity > 0.05 && r.width > 0 && r.bottom > 0 && r.top < innerHeight; };
    const bar = document.getElementById('labbar');
    const pills = [...document.querySelectorAll('header button, header a, nav button, nav a, .topbar button, .topbar a')].filter(vis).map((e) => { const r = e.getBoundingClientRect(); return `${e.textContent.trim().replace(/\s+/g, ' ')}@${Math.round(r.top)}h${Math.round(r.height)}`; });
    const lit = [...document.querySelectorAll('[aria-selected="true"], .tabs .on, .tabs [aria-current]')].filter(vis).map((e) => e.textContent.trim());
    // the sections' headings and where the first one in view starts
    const heads = [...document.querySelectorAll('.case h2, .case h3, section[data-tab] h2, [data-sec] h2')].map((e) => [e.textContent.trim().slice(0, 30), Math.round(e.getBoundingClientRect().top)]).filter(([, t]) => t > -400 && t < innerHeight);
    return { bar: vis(bar), pills, lit, heads, dpr: window.__renderer && __renderer.getPixelRatio(), y: Math.round(scrollY), hash: location.hash };
  });
  for (let i = 0; i < 6; i++) {
    await p.screenshot({ path: `${out}/case-${id}-${i}.png` }); console.log(i, JSON.stringify(await state()));
    await p.mouse.wheel(0, +h * 0.7); await p.waitForTimeout(1200);
  }
  console.log(errs.length ? errs.join('\n') : 'no errors'); await b.close();
})();
