// node hero-device.js <url> [runs=3]: on the phone, every frame from load to lab-ready: fps, p95 and worst (from 1 s, past the
// page-start frame), the frames over 34 ms with their start times, and when the lab was ready. Each run is a fresh page
const { chromium } = require('playwright');
const [url, runs = '3'] = process.argv.slice(2);
(async () => {
  const b = await chromium.connectOverCDP('http://127.0.0.1:9222'), c = b.contexts()[0];
  const p = c.pages().find((x) => x.url().includes('8765')) || await c.newPage();
  await (await c.newCDPSession(p)).send('Network.setCacheDisabled', { cacheDisabled: true });
  await p.addInitScript(() => { window.__ft = []; let last = 0; const f = (now) => { if (last) window.__ft.push([now, now - last]); last = now; if (!window.__rd) requestAnimationFrame(f); };
    requestAnimationFrame(f); const chk = () => { if (document.body && document.body.classList.contains('lab-ready')) window.__rd = performance.now(); else setTimeout(chk, 20); }; chk(); });
  for (let i = 0; i < +runs; i++) {
    await p.goto('about:blank'); await p.waitForTimeout(1500);
    await p.goto(url, { waitUntil: 'load' });
    await p.waitForFunction(() => window.__rd, null, { timeout: 60000 });
    const { ft, rd } = await p.evaluate(() => ({ ft: window.__ft, rd: window.__rd }));
    const t = ft.filter(([n]) => n > 1000).map(([, d]) => d); // from 1 s: past page start (its own long first frame)
    const s = [...t].sort((a, b) => a - b), q = (k) => s[Math.min(s.length - 1, Math.floor(s.length * k))];
    console.log(JSON.stringify({ ready: Math.round(rd), fps: +(1000 * t.length / t.reduce((a, b) => a + b, 0)).toFixed(1), p95: +q(0.95).toFixed(1), worst: +s[s.length - 1].toFixed(1), over34: ft.filter(([, d]) => d > 34).map(([n, d]) => [Math.round(n - d), Math.round(d)]) }));
  }
  await b.close();
})();
