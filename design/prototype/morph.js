const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] });
  for (const vp of ['desk', 'phone']) {
    const ctx = await browser.newContext({ viewport: vp === 'phone' ? { width: 412, height: 915 } : { width: 1440, height: 900 }, isMobile: vp === 'phone', hasTouch: vp === 'phone', deviceScaleFactor: vp === 'phone' ? 2 : 1 });
    const page = await ctx.newPage();
    await page.goto('file://' + process.cwd() + '/test.html#/projects/Birds-AI', { waitUntil: 'networkidle' }); await page.waitForTimeout(2500);
    for (const m of [0, 0.25, 0.5, 0.75, 1]) {
      await page.evaluate((m) => {
        const secs = [...document.querySelectorAll('#ptrack .ps')], narrow = matchMedia('(max-width: 860px)').matches, H = innerHeight;
        const T0 = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--T0')) || 480, line = narrow ? T0 : H * 0.5;
        const tops = secs.map((s) => s.getBoundingClientRect().top + scrollY), hs = secs.map((s) => s.getBoundingClientRect().height);
        let best = 0, bd = 1e9;
        for (let y = 0; y < H * 3; y += 1) { let p = 0; tops.forEach((t, i) => { const top = t - y; if (top <= line + 0.5) p = i + Math.min(1, (line - top) / hs[i]); }); const sp = Math.max(0, narrow ? p : p - 0.5); if (Math.abs(sp - m) < bd) { bd = Math.abs(sp - m); best = y; } }
        scrollTo(0, best);
      }, m);
      await page.waitForTimeout(3500);
      await page.screenshot({ path: `boards/morph-${vp}-${String(m * 100).padStart(3, '0')}.png` });
      console.log(vp, m, await page.evaluate(() => window.__p.toFixed(3)));
    }
    await ctx.close();
  }
  await browser.close();
})();
