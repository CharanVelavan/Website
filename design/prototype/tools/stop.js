// node stop.js <page.html> <outDir> desk|phone k...: the lab chapter held on plinth k (0 = WaterBot, in year order)
const { chromium } = require('playwright'); const path = require('path');
const [file, out, vp, ...ks] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] }); const errs = [];
  const phone = vp === 'phone', c = await b.newContext({ viewport: phone ? { width: 412, height: 915 } : { width: 1440, height: 900 }, isMobile: phone, hasTouch: phone });
  const p = await c.newPage(); p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file://' + path.resolve(file), { waitUntil: 'load' }); await p.waitForTimeout(3500);
  for (const k of ks) {
    await p.evaluate((k) => { const el = document.getElementById('stops').children[k]; scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2); }, +k);
    await p.waitForTimeout(3500); await p.screenshot({ path: `${out}/stop-${vp}-${k}.png` });
  }
  await b.close(); console.log(errs.join('\n') || 'ok');
})();
