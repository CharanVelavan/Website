// node stop.js url out desk|phone k [k...] : screenshot tour stops
const { chromium } = require('/Users/CharanVelavan/Charan/Projects/Personal/Website/design/prototype/tools/node_modules/playwright');
const [url, out, vp, ...ks] = process.argv.slice(2), phone = vp === 'phone';
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const c = await b.newContext({ viewport: phone ? { width: 412, height: 915 } : { width: 1440, height: 900 }, isMobile: phone, hasTouch: phone });
  const p = await c.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text().slice(0, 600)); });
  await p.goto(url); await p.waitForFunction(() => document.body.classList.contains('lab-ready'), null, { timeout: 90000 });
  for (const k of ks) { await p.evaluate((k) => { const el = document.getElementById('stops').children[k]; scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2); }, +k); await p.waitForTimeout(2800); await p.screenshot({ path: `${out}/${vp}-stop${k}.png` }); }
  console.log(errs.join('\n') || 'ok'); await b.close();
})();
