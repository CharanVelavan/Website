// node perf.js <url> [cpu throttle = 4] [gpu = metal|swiftshader]: frame rate at each tour stop on a phone-sized page,
// with the CPU slowed down (CDP throttling) to stand in for a mid-range phone. The GPU can't be throttled, so the
// numbers read best as a CPU-side budget plus a check that the dynamic resolution settles where it should.
const { chromium } = require('playwright');
const [url, rate = '4', gpu = 'metal'] = process.argv.slice(2);
const args = gpu === 'metal' ? ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] : ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'];
const stop = (k) => `(() => { const el = document.getElementById('stops').children[${k}]; scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2); })()`;
// frame intervals over `ms`, measured with rAF in the page
const sample = (ms) => `new Promise((res) => { const t = []; let last = performance.now(); const end = last + ${ms};
  const f = (now) => { t.push(now - last); last = now; if (now < end) requestAnimationFrame(f); else res(t); }; requestAnimationFrame(f); })`;
const stats = (t) => { const s = [...t].sort((a, b) => a - b), q = (k) => s[Math.min(s.length - 1, Math.floor(s.length * k))];
  return { fps: +(1000 * t.length / t.reduce((a, b) => a + b, 0)).toFixed(1), p50: +q(0.5).toFixed(1), p95: +q(0.95).toFixed(1), worst: +s[s.length - 1].toFixed(1) }; };
(async () => {
  const b = await chromium.launch({ args }); const errs = [];
  const c = await b.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2.6, isMobile: true, hasTouch: true });
  const p = await c.newPage(); p.on('pageerror', (e) => errs.push(e.message));
  const cdp = await c.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: +rate });
  const t0 = Date.now(); await p.goto(url, { waitUntil: 'load' });
  console.log('gpu', await p.evaluate(() => { const g = document.createElement('canvas').getContext('webgl2'), e = g.getExtension('WEBGL_debug_renderer_info'); return e ? g.getParameter(e.UNMASKED_RENDERER_WEBGL) : '?'; }));
  console.log('load', Date.now() - t0, 'ms; cpu x' + rate);
  const hero = stats(await p.evaluate(sample(3000))); console.log('hero      ', JSON.stringify(hero));
  await p.waitForFunction(() => document.body.classList.contains('lab-ready'), null, { timeout: 120000 }).catch(() => errs.push('lab never ready'));
  console.log('lab ready', Date.now() - t0, 'ms');
  const names = ['over', 'ba', 'ne', 'sw', 'tz', 'or', 'de', 'wb', 'ss', 'sa', 'shelf'], rows = [];
  for (const [k, n] of names.entries()) {
    await p.evaluate(stop(k)); await p.waitForTimeout(2500);
    const s = stats(await p.evaluate(sample(4000))); s.dpr = await p.evaluate(() => +(window.__dpr || devicePixelRatio).toFixed(2)); s.calls = await p.evaluate(() => window.__calls);
    rows.push(s); console.log(n.padEnd(10), JSON.stringify(s));
  }
  const all = rows.map((r) => r.fps); console.log('tour fps min', Math.min(...all), 'mean', (all.reduce((a, b) => a + b) / all.length).toFixed(1));
  console.log(errs.length ? errs.join('\n') : 'no errors'); await b.close();
})();
