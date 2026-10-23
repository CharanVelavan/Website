// node lite.js <page.html> <outDir> <#route>...: each case study in Lite mode (full page) and as a PDF from the 3D page's print view
const { chromium } = require('playwright'); const path = require('path');
const [file, out, ...routes] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] }); const errs = [];
  for (const r of routes) {
    const name = r.split('/').pop();
    const c = await b.newContext({ viewport: { width: 1440, height: 900 } }); await c.addInitScript(() => localStorage.setItem('lab-mode', 'lite'));
    const p = await c.newPage(); p.on('pageerror', (e) => errs.push(name + ': ' + e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.goto('file://' + path.resolve(file) + r, { waitUntil: 'load' }); await p.waitForTimeout(2500);
    const lite = await p.evaluate(() => document.body.classList.contains('lite') && document.querySelectorAll('#litedoc .dsec').length);
    await p.screenshot({ path: `${out}/lite-${name}.png`, fullPage: true }); await c.close();
    const c2 = await b.newContext({ viewport: { width: 1440, height: 900 } }); const q = await c2.newPage(); q.on('pageerror', (e) => errs.push(name + ' print: ' + e.message));
    await q.goto('file://' + path.resolve(file) + r, { waitUntil: 'load' }); await q.waitForTimeout(3000);
    await q.evaluate(() => dispatchEvent(new Event('beforeprint'))); await q.waitForTimeout(800); await q.pdf({ path: `${out}/print-${name}.pdf`, format: 'A4' });
    const pages = await q.evaluate(() => document.querySelectorAll('#litedoc .dsec').length); await c2.close();
    console.log(name, 'lite sections', lite, '· print sections', pages);
  }
  await b.close(); console.log(errs.join('\n') || 'ok');
})();
