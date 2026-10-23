// node shot.js <page.html> <outDir> desk:lab phone:flight:dark ...
// Each item is viewport:sectionId[:dark]. AT=0..1 picks the scroll point inside the section (default 0.5).
const { chromium } = require('playwright');
const path = require('path');
const [file, out, ...items] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] });
  const errs = [];
  for (const it of items) {
    const [vp, sec, scheme = 'light'] = it.split(':'); const phone = vp === 'phone';
    const ctx = await b.newContext({ viewport: phone ? { width: 412, height: 915 } : { width: 1440, height: 900 }, isMobile: phone, hasTouch: phone, deviceScaleFactor: 1, colorScheme: scheme });
    const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(it + ': ' + e.message));
    await p.goto('file://' + path.resolve(file), { waitUntil: 'load', timeout: 90000 }); await p.waitForTimeout(3000);
    await p.evaluate(([s, at]) => { const el = document.getElementById(s); scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight * at - innerHeight / 2); }, [sec, +(process.env.AT || 0.5)]);
    await p.waitForTimeout(4500);
    await p.screenshot({ path: `${out}/${it.replaceAll(':', '-')}.png` }); await ctx.close();
  }
  await b.close(); console.log(errs.join('\n') || 'ok');
})();
