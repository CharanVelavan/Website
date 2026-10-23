// node case-device.js <url> <outDir> [ids=ba,ne,ss]: case studies on the phone, opened as a visitor would (tour stop,
// panel, Open case study). For each: the pixel ratio dynamic resolution is at every 250 ms while the photo dissolves and
// the bay assembles, the canvas's drawing-buffer size against its CSS size, fps once it settles, and adb screen captures
// (full resolution) of the case study's top, and once scrolled into the 3D
const { chromium } = require('playwright'); const { execSync } = require('child_process'); const fs = require('fs');
const [url, out, ids = 'ba,ne,ss'] = process.argv.slice(2);
const STOPS = ['over', 'ba', 'ne', 'sw', 'tz', 'or', 'de', 'wb', 'ss', 'sa'];
const cap = (f) => fs.writeFileSync(`${out}/${f}.png`, execSync('adb exec-out screencap -p', { maxBuffer: 1 << 26 }));
const stop = (k) => `(() => { const el = document.getElementById('stops').children[${k}]; scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2); })()`;
const sample = (ms) => `new Promise((res) => { const t = []; let last = performance.now(); const end = last + ${ms};
  const f = (now) => { t.push(now - last); last = now; if (now < end) requestAnimationFrame(f); else res(t); }; requestAnimationFrame(f); })`;
const fps = (t) => +(1000 * t.length / t.reduce((a, b) => a + b, 0)).toFixed(1);
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.connectOverCDP('http://127.0.0.1:9222'), c = b.contexts()[0];
  const p = c.pages().find((x) => x.url().includes('8765')) || await c.newPage(); await p.bringToFront();
  await (await c.newCDPSession(p)).send('Network.setCacheDisabled', { cacheDisabled: true }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  for (const id of ids.split(',')) {
    await p.goto(url, { waitUntil: 'load' }); await p.waitForFunction(() => document.body.classList.contains('lab-ready'), null, { timeout: 120000 });
    await p.evaluate(stop(STOPS.indexOf(id))); await p.waitForTimeout(3500);
    // the pixel ratio from the click on, while the case study opens and its bay loads
    await p.evaluate(() => { window.__dprLog = []; const t0 = performance.now(); window.__dprT = setInterval(() => window.__dprLog.push([Math.round(performance.now() - t0), +(window.__dpr || 0).toFixed(2)]), 250); });
    await p.click('#lpanel [data-lp-go]'); await p.waitForTimeout(3500); cap(`${id}-0-top`);
    // into the 3D: the photo dissolves as the first section scrolls up
    await p.evaluate(() => scrollBy(0, innerHeight * 0.9)); await p.waitForTimeout(4000); cap(`${id}-1-3d`);
    const f = fps(await p.evaluate(sample(4000)));
    await p.evaluate(() => scrollBy(0, innerHeight * 0.9)); await p.waitForTimeout(3000); cap(`${id}-2-3d`);
    const info = await p.evaluate(() => { clearInterval(window.__dprT); const cv = document.getElementById('stage'), gl = cv.getContext('webgl2');
      return { log: window.__dprLog, dpr: window.__dpr, devicePixelRatio, buffer: [gl.drawingBufferWidth, gl.drawingBufferHeight], css: [cv.clientWidth, cv.clientHeight], antialias: gl.getContextAttributes().antialias, samples: gl.getParameter(gl.SAMPLES), hash: location.hash }; });
    const drops = info.log.filter(([, d], i, a) => i && d !== a[i - 1][1]);
    console.log(id, JSON.stringify({ fps: f, dpr: info.dpr, devicePixelRatio: info.devicePixelRatio, buffer: info.buffer, css: info.css, antialias: info.antialias, samples: info.samples, hash: info.hash }));
    console.log('   dpr changes [ms after click, dpr]:', JSON.stringify(drops), 'min', Math.min(...info.log.map(([, d]) => d)));
  }
  console.log(errs.length ? errs.join('\n') : 'no errors'); await b.close();
})();
