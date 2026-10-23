// node perf-device.js <url> [query]: the perf.js tour on a real Android phone. Needs Chrome open on the phone and
//   adb reverse tcp:8765 tcp:8765; adb forward tcp:9222 localabstract:chrome_devtools_remote
// Reports fps and frame-time percentiles at each tour stop, the pixel ratio dynamic resolution settled on, and draw calls.
const { chromium } = require('playwright');
const [url] = process.argv.slice(2);
const stop = (k) => `(() => { const el = document.getElementById('stops').children[${k}]; scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2); })()`;
const sample = (ms) => `new Promise((res) => { const t = []; let last = performance.now(); const end = last + ${ms};
  const f = (now) => { t.push(now - last); last = now; if (now < end) requestAnimationFrame(f); else res(t); }; requestAnimationFrame(f); })`;
const stats = (t) => { const s = [...t].sort((a, b) => a - b), q = (k) => s[Math.min(s.length - 1, Math.floor(s.length * k))];
  return { fps: +(1000 * t.length / t.reduce((a, b) => a + b, 0)).toFixed(1), p50: +q(0.5).toFixed(1), p95: +q(0.95).toFixed(1), worst: +s[s.length - 1].toFixed(1) }; };
(async () => {
  const b = await chromium.connectOverCDP('http://127.0.0.1:9222'); const errs = [];
  const c = b.contexts()[0]; const p = c.pages().find((x) => x.url().includes('8765')) || await c.newPage();
  await (await c.newCDPSession(p)).send('Network.setCacheDisabled', { cacheDisabled: true }); // the local server sends no cache headers
  p.on('pageerror', (e) => errs.push(e.message));
  const t0 = Date.now(); await p.goto(url, { waitUntil: 'load' });
  console.log('gpu', await p.evaluate(() => { const g = document.createElement('canvas').getContext('webgl2'), e = g.getExtension('WEBGL_debug_renderer_info'); return e ? g.getParameter(e.UNMASKED_RENDERER_WEBGL) : '?'; }),
    await p.evaluate(() => `${innerWidth}x${innerHeight} @${devicePixelRatio}`));
  console.log('load', Date.now() - t0, 'ms');
  console.log('hero      ', JSON.stringify(stats(await p.evaluate(sample(3000)))));
  await p.waitForFunction(() => document.body.classList.contains('lab-ready'), null, { timeout: 120000 }).catch(() => errs.push('lab never ready'));
  console.log('lab ready', Date.now() - t0, 'ms');
  const names = ['over', 'ba', 'ne', 'sw', 'tz', 'or', 'de', 'wb', 'ss', 'sa', 'shelf'], rows = [];
  for (const [k, n] of names.entries()) {
    await p.evaluate(stop(k)); await p.waitForTimeout(3000);
    const s = stats(await p.evaluate(sample(5000))); s.dpr = await p.evaluate(() => +(window.__dpr || 0).toFixed(2)); s.calls = await p.evaluate(() => window.__calls);
    rows.push(s); console.log(n.padEnd(10), JSON.stringify(s));
  }
  const all = rows.map((r) => r.fps); console.log('tour fps min', Math.min(...all), 'mean', (all.reduce((a, b) => a + b) / all.length).toFixed(1));
  console.log('memory', await p.evaluate(() => performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1e6) + ' MB JS heap' : '?'));
  console.log(errs.length ? errs.join('\n') : 'no errors'); await b.close();
})();
