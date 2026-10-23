// node profile-device.js <url> [secs] [minMs]: on the phone, a CPU profile of the first seconds after load (while the hero plays and the
// lab loads behind it), the long frames with their times, and what ran during each: the functions with the most self time
const { chromium } = require('playwright');
const [url, secs = '6', minMs = '100'] = process.argv.slice(2); // minMs: the shortest frame to break down
(async () => {
  const b = await chromium.connectOverCDP('http://127.0.0.1:9222'), c = b.contexts()[0];
  const p = c.pages().find((x) => x.url().includes('8765')) || await c.newPage();
  await p.goto('about:blank'); const cdp = await c.newCDPSession(p);
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true }); // the local server sends no cache headers
  await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 500 });
  // long frames, timed from navigation start, and when the lab's stages happen
  await p.addInitScript(() => {
    window.__long = []; let last = 0;
    const f = (now) => { if (last && now - last > 50) window.__long.push([Math.round(last), Math.round(now - last)]); last = now; requestAnimationFrame(f); };
    requestAnimationFrame(f);
  });
  await cdp.send('Profiler.start');
  await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(+secs * 1000);
  const { profile } = await cdp.send('Profiler.stop');
  const long = await p.evaluate(() => window.__long);
  const res = await p.evaluate(() => performance.getEntriesByType('resource').filter((r) => r.duration > 30 || /glb|wasm|basis|ktx/.test(r.name)).map((r) => [r.name.split('/').pop().slice(0, 40), Math.round(r.startTime), Math.round(r.responseEnd)]));
  const nav = await p.evaluate(() => performance.timeOrigin);
  console.log('long frames [start ms, length ms]:', JSON.stringify(long));
  console.log('resources [name, start, end]:'); res.forEach((r) => console.log('  ', JSON.stringify(r)));
  // samples → time; profile times are in µs on the monotonic clock, aligned to the page's timeOrigin
  const byId = new Map(profile.nodes.map((n) => [n.id, n])), t0 = profile.startTime;
  let t = t0; const times = profile.timeDeltas.map((d) => (t += d));
  // the page's navigation started after the profile did: find the offset from the first sample in the page's script
  const origin = await p.evaluate(() => performance.timeOrigin), shift = (origin * 1000) - 0; // timeOrigin in ms (epoch)
  void shift; void nav;
  const name = (n) => `${n.callFrame.functionName || '(anon)'} ${n.callFrame.url.split('/').pop().slice(0, 28)}:${n.callFrame.lineNumber + 1}`;
  // map each long frame into profile time: profile clock is monotonic µs; performance.now() 0 = navigation. Use the
  // last sample time minus the page's current performance.now() to align.
  const nowPage = await p.evaluate(() => performance.now()), endProf = times[times.length - 1] / 1000;
  const toProf = (ms) => (endProf - (nowPage - ms)) * 1000;
  for (const [s, len] of long.filter(([, l]) => l > +minMs)) {
    const a = toProf(s), z = toProf(s + len), self = new Map();
    profile.samples.forEach((id, i) => { if (times[i] >= a && times[i] <= z) { const k = name(byId.get(id)); self.set(k, (self.get(k) || 0) + (profile.timeDeltas[i] || 0) / 1000); } });
    console.log(`\nframe at ${s} ms, ${len} ms long; top self time:`);
    [...self.entries()].sort((x, y) => y[1] - x[1]).slice(0, 12).forEach(([k, v]) => console.log('  ', v.toFixed(1).padStart(6), 'ms', k));
  }
  await b.close();
})();
