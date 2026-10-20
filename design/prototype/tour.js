// node tour.js desk|phone ne [sw ...] — screenshot every chapter of each project into one sheet per project
const { chromium } = require('playwright');
const SLUG = { ba: 'Birds-AI', ne: 'nephele-community-robot', sw: 'ai-native-network-uav', tz: 'thz-bandpass-filter', or: '5g-network-implementation', de: 'emotion-monitoring-system', wb: 'waterbot' };
const [vpName, ...ids] = process.argv.slice(2);
(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required', '--allow-file-access-from-files'], proxy: { server: process.env.HTTPS_PROXY } });
  const vp = vpName === 'phone' ? { width: 412, height: 915 } : { width: 1440, height: 900 };
  const errs = [];
  for (const id of ids) {
    const ctx = await browser.newContext({ viewport: vp, hasTouch: vpName === 'phone', isMobile: vpName === 'phone', colorScheme: process.env.DARK ? 'dark' : 'light', reducedMotion: 'no-preference' });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errs.push(id + ': ' + e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(id + ': ' + m.text().slice(0, 200)); });
    await page.goto('file://' + process.cwd() + '/test.html#/projects/' + SLUG[id], { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForTimeout(2500);
    const n = await page.evaluate(() => document.querySelectorAll('#ptrack .ps').length);
    const only = process.env.ONLY ? process.env.ONLY.split(',').map(Number) : null;
    for (let i = 0; i < n; i++) {
      if (only && !only.includes(i)) continue;
      await page.evaluate((i) => { const s = document.querySelectorAll('#ptrack .ps')[i]; const narrow = matchMedia('(max-width: 860px)').matches; const T0 = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--T0')) || 480; const top = s.getBoundingClientRect().top + scrollY; scrollTo(0, Math.max(0, narrow ? top - T0 : top - (innerHeight * 0.5 - s.offsetHeight * 0.5))); }, i);
      await page.waitForTimeout(+(process.env.WAIT || 3200));
      await page.screenshot({ path: `shots/t-${vpName}${process.env.DARK ? '-dark' : ''}-${id}-${i}.png` });
    }
    console.log(id, n, 'chapters');
    await ctx.close();
  }
  await browser.close(); console.log(errs.slice(0, 20).join('\n') || 'ok');
})();
