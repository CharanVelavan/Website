// node heroshot.js url out desk|phone : the hero → lab transition, at a few scroll points
const { chromium } = require('playwright');
const [url, out, vp] = process.argv.slice(2), phone = vp === 'phone';
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const c = await b.newContext({ viewport: phone ? { width: 412, height: 915 } : { width: 1440, height: 900 }, isMobile: phone, hasTouch: phone });
  const p = await c.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(url); await p.waitForFunction(() => document.body.classList.contains('lab-ready'), null, { timeout: 90000 }); await p.waitForTimeout(800);
  const y = await p.evaluate(() => { const el = document.getElementById('stops').children[0]; return el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2; });
  for (const f of [0.25, 0.45, 0.65, 0.85]) { await p.evaluate((v) => scrollTo(0, v), y * f); await p.waitForTimeout(2200); await p.screenshot({ path: `${out}/${vp}-hero-${Math.round(f * 100)}.png` }); }
  console.log(errs.join('\n') || 'ok'); await b.close();
})();
