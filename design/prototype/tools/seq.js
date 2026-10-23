// node seq.js <page.html> <outDir> <width> <height> lab:0.2 lab:0.6 ...  (one page, scrolled through the points in order)
const { chromium } = require('playwright');
const [file, out, w, h, ...pts] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] });
  const ctx = await b.newContext({ viewport: { width: +w, height: +h }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file://' + require('path').resolve(file), { waitUntil: 'load' }); await p.waitForTimeout(3000);
  for (const pt of pts) {
    const [sec, at] = pt.split(':');
    await p.evaluate(([s, a]) => { const el = document.getElementById(s); scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight * a - innerHeight / 2); }, [sec, +at]);
    await p.waitForTimeout(2500);
    await p.screenshot({ path: `${out}/seq-${sec}-${at}.png` });
  }
  await b.close(); console.log(errs.join('\n') || 'ok');
})();
