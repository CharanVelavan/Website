// node settings-check.js <page.html> <outDir>: opens Settings, cycles every theme in light and dark,
// checks the page and the 3D world change together, and screenshots the sheet on desktop and phone.
const { chromium } = require('playwright');
const path = require('path');
const [file, out] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] });
  const errs = [];
  for (const phone of [false, true]) {
    const ctx = await b.newContext({ viewport: phone ? { width: 412, height: 915 } : { width: 1440, height: 900 }, isMobile: phone, hasTouch: phone });
    const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    await p.goto('file://' + path.resolve(file), { waitUntil: 'load' }); await p.waitForTimeout(3000);
    await p.evaluate(() => { const el = document.getElementById('lab'); scrollTo(0, el.offsetTop); }); await p.waitForTimeout(2500);
    await p.click('#setBtn'); await p.waitForTimeout(400);
    await p.screenshot({ path: `${out}/settings-${phone ? 'phone' : 'desk'}.png` });
    if (!phone) {
      const rows = [];
      for (const mode of ['light', 'dark']) {
        await p.click(`[data-set="mode:${mode}"]`);
        for (const id of await p.$$eval('[data-theme-id]', (bs) => bs.map((x) => x.dataset.themeId))) {
          await p.click(`[data-theme-id="${id}"]`); await p.waitForTimeout(450);
          rows.push(await p.evaluate(([id, mode]) => ({ id, mode, bg: getComputedStyle(document.body).backgroundColor, sky: '#' + (window.__scene ? window.__scene.background.getHexString() : "?"), meta: document.querySelector('meta[name=theme-color]').content }), [id, mode]));
        }
      }
      console.log(rows.map((r) => `${r.mode.padEnd(5)} ${r.id.padEnd(9)} page ${r.bg.padEnd(18)} 3D ${r.sky} meta ${r.meta}`).join('\n'));
      await p.click('[data-theme-id="bottle"]'); await p.click('[data-set="mode:auto"]');
      await p.keyboard.press('Escape'); await p.waitForTimeout(200);
      console.log('closed on Escape:', await p.$eval('#settings', (s) => s.hidden), '| focus back on button:', await p.evaluate(() => document.activeElement.id));
      await p.keyboard.press('s'); console.log('S opens instantly:', await p.$eval('#settings', (s) => !s.hidden && s.classList.contains('instant')));
      const small = await p.$$eval('#settings button', (bs) => bs.filter((x) => x.getBoundingClientRect().height < 40).map((x) => x.textContent.trim()));
      console.log('controls under 40px tall:', small.length ? small : 'none');
    }
    await ctx.close();
  }
  await b.close(); console.log(errs.join('\n') || 'no errors');
})();
