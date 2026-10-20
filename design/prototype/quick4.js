// node quick4.js desk|phone ba/explode ne home-lab ...   (DARK=1 for dark mode, LITE=1 for lite)
const { chromium } = require('playwright');
const SLUG = { ba: 'Birds-AI', ne: 'nephele-community-robot', sw: 'ai-native-network-uav', tz: 'thz-bandpass-filter', or: '5g-network-implementation', de: 'emotion-monitoring-system', wb: 'waterbot' };
const [vpName, ...items] = process.argv.slice(2);
(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required', '--allow-file-access-from-files'], proxy: { server: process.env.HTTPS_PROXY } });
  const vp = vpName === 'phone' ? { width: 412, height: 915 } : { width: 1440, height: 900 };
  const errs = [];
  for (const it of items) {
    const ctx = await browser.newContext({ viewport: vp, hasTouch: vpName === 'phone', isMobile: vpName === 'phone', colorScheme: process.env.DARK ? 'dark' : 'light', reducedMotion: 'no-preference' });
    if (process.env.LITE) await ctx.addInitScript(() => localStorage.setItem('lab-mode', 'lite'));
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errs.push(it + ': ' + e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(it + ': ' + m.text().slice(0, 200)); });
    const home = it.startsWith('home-');
    const [id, sec] = it.split('/');
    await page.goto('file://' + process.cwd() + '/test.html' + (home ? '' : '#/projects/' + SLUG[id] + (sec ? '/' + sec : '')), { waitUntil: 'networkidle', timeout: 90000 });
    if (home) { await page.waitForTimeout(2500); await page.evaluate((s) => { const el = document.getElementById(s); window.scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2); }, it.slice(5)); }
    await page.waitForTimeout(+(process.env.WAIT || 5000));
    console.log(it, (await page.evaluate(() => window.__p)) ?? '-');
    await page.screenshot({ path: `shots/v4-${vpName}${process.env.DARK ? '-dark' : ''}${process.env.LITE ? '-lite' : ''}-${it.replace('/', '-')}.png`, fullPage: !!process.env.FULL });
    await ctx.close();
  }
  await browser.close(); console.log(errs.join('\n') || 'ok');
})();
