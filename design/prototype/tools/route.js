// node route.js <page.html> <outDir> <#route> desk phone: screenshot a case study after it opens
const { chromium } = require('playwright'); const path = require('path');
const [file, out, route, ...vps] = process.argv.slice(2);
(async () => { const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] }); const errs = [];
  for (const vp of vps) { const phone = vp === 'phone'; const c = await b.newContext({ viewport: phone ? { width: 412, height: 915 } : { width: 1440, height: 900 }, isMobile: phone, hasTouch: phone });
    const p = await c.newPage(); p.on('pageerror', (e) => errs.push(e.message)); await p.goto('file://' + path.resolve(file) + route, { waitUntil: 'load' }); await p.waitForTimeout(5000);
    await p.screenshot({ path: `${out}/case-${vp}.png` }); await c.close(); }
  await b.close(); console.log(errs.join('\n') || 'ok'); })();
