// node chapters.js <page.html> <outDir> <#route> desk|phone [dark]: a screenshot of every chapter of one case study
const { chromium } = require('playwright'); const path = require('path');
const [file, out, route, vp = 'desk', scheme = 'light'] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] }); const errs = [];
  const phone = vp === 'phone';
  const c = await b.newContext({ viewport: phone ? { width: 412, height: 915 } : { width: 1440, height: 900 }, isMobile: phone, hasTouch: phone, colorScheme: scheme });
  const p = await c.newPage(); p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await p.goto((/^http/.test(file) ? file : 'file://' + path.resolve(file)) + route, { waitUntil: 'load' }); await p.waitForTimeout(6000);
  const ids = await p.evaluate(() => [...document.querySelectorAll('#ptrack .ps')].map((s) => s.dataset.sec));
  for (const id of ids) {
    await p.evaluate((id) => { const s = document.getElementById('ps-' + id), top = s.getBoundingClientRect().top + scrollY; scrollTo(0, Math.max(0, innerWidth < 861 ? top - parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--T0')) : top - (innerHeight * 0.5 - s.offsetHeight * 0.5))); }, id);
    await p.waitForTimeout(2600);
    await p.screenshot({ path: `${out}/${vp}-${scheme}-${id}.png` });
  }
  const calls = await p.evaluate(() => window.__calls);
  await b.close(); console.log((errs.join('\n') || 'ok') + ' · draw calls ' + calls);
})();
