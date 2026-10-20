const { chromium } = require('playwright');
const pals = (process.env.PALS || 'clay,cobalt,moss,amber,wine,teal').split(',');
(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] });
  const errs = [];
  for (const p of pals) for (const mode of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript(([p, m]) => { localStorage.setItem('lab-palette', p); localStorage.setItem('lab-theme', m); }, [p, mode]);
    const page = await ctx.newPage(); page.on('pageerror', (e) => errs.push(e.message));
    await page.goto('file://' + process.cwd() + '/test.html', { waitUntil: 'networkidle' }); await page.waitForTimeout(1500);
    await page.screenshot({ path: `shots/pal-${p}-${mode}-hero.png` });
    await page.evaluate(() => { const el = document.getElementById('lab'); scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2); });
    await page.waitForTimeout(3500);
    await page.screenshot({ path: `shots/pal-${p}-${mode}-lab.png` });
    if (p === 'cobalt' && mode === 'light') { await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(800); await page.click('#palBtn'); await page.waitForTimeout(500); await page.screenshot({ path: 'shots/pal-panel.png' }); }
    await ctx.close();
  }
  await browser.close(); console.log(errs.join('\n') || 'ok');
})();
