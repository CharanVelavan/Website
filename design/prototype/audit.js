// read-only measurement: tap targets, rendered font sizes, contrast of text vs its bg
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] });
  for (const [name, vp, mob] of [['phone', { width: 412, height: 915 }, true], ['desk', { width: 1440, height: 900 }, false]]) {
    for (const route of ['', '#/projects/Birds-AI']) {
      const ctx = await browser.newContext({ viewport: vp, hasTouch: mob, isMobile: mob });
      const page = await ctx.newPage();
      await page.goto('file://' + process.cwd() + '/test.html' + route, { waitUntil: 'networkidle', timeout: 90000 });
      await page.waitForTimeout(4000);
      const r = await page.evaluate(() => {
        const vis = (el) => { const s = getComputedStyle(el), b = el.getBoundingClientRect(); return s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0 && b.width > 0 && b.height > 0 && b.bottom > 0 && b.top < innerHeight * 3; };
        const small = [];
        document.querySelectorAll('a,button,[role=tab],input,summary').forEach((el) => { if (!vis(el)) return; const b = el.getBoundingClientRect(); if (b.height < 44 || b.width < 44) small.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${[...el.classList].join('.')} ${Math.round(b.width)}x${Math.round(b.height)} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 18)}"`); });
        const sizes = {};
        const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let n; while ((n = tw.nextNode())) { if (!n.textContent.trim()) continue; const el = n.parentElement; if (!vis(el)) continue; const fs = getComputedStyle(el).fontSize; sizes[fs] = (sizes[fs] || 0) + 1; }
        return { small: small.slice(0, 40), nSmall: small.length, sizes };
      });
      console.log(`== ${name} ${route || 'home'}  targets<44: ${r.nSmall}`);
      console.log(r.small.join('\n'));
      console.log('font sizes:', Object.entries(r.sizes).sort((a, b) => parseFloat(a[0]) - parseFloat(b[0])).map(([k, v]) => k + '×' + v).join('  '));
      await ctx.close();
    }
  }
  await browser.close();
})();
