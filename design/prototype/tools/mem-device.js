// node mem-device.js <url>: memory on the phone after the lab loads and after a pass over every tour stop (fresh page).
// JS heap and three.js counts from the page, and each Chrome process's PSS from adb (the GPU process holds the textures)
const { chromium } = require('playwright'); const { execSync } = require('child_process');
const stop = (k) => `(() => { const el = document.getElementById('stops').children[${k}]; scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2); })()`;
const pss = () => {
  const s = execSync('adb shell dumpsys meminfo', { maxBuffer: 1 << 24 }).toString(), seen = {}, out = {};
  for (const m of s.matchAll(/^\s*([\d,]+)K: com\.android\.chrome(\S*) \(pid (\d+)/gm)) if (!seen[m[3]]) {
    seen[m[3]] = 1; const n = m[2].replace(/^:/, '').replace(/sandboxed_process\d+.*/, 'renderer').replace(/privileged_process\d+/, 'gpu') || 'browser';
    out[n] = (out[n] || 0) + Math.round(+m[1].replace(/,/g, '') / 1024);
  }
  return out;
};
// the page's own renderer: the Chrome sandboxed process with the largest RSS once the lab is up, then its App Summary
const renderers = () => execSync('adb shell ps -A -o PID,RSS,NAME').toString().split('\n').filter((l) => l.includes('sandboxed_process')).map((l) => l.trim().split(/\s+/).map((x, i) => i < 2 ? +x : x));
const summary = (pid) => { const s = execSync(`adb shell dumpsys meminfo ${pid}`).toString(), g = (k) => { const m = s.match(new RegExp(k + ':\\s+([\\d,]+)')); return m ? Math.round(+m[1].replace(/,/g, '') / 1024) : 0; };
  return { java: g('Java Heap'), native: g('Native Heap'), code: g('Code'), stack: g('Stack'), graphics: g('Graphics'), other: g('Private Other'), system: g('System'), total: g('TOTAL PSS') }; };
let rpid = 0;
(async () => {
  const b = await chromium.connectOverCDP('http://127.0.0.1:9222'), c = b.contexts()[0];
  for (const q of c.pages()) if (q.url().includes('8765')) await q.close();
  const p = await c.newPage(); await p.bringToFront(); const cdp = await c.newCDPSession(p); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true }); await cdp.send('Runtime.enable');
  const mem = async (label) => {
    await cdp.send('HeapProfiler.collectGarbage');
    const h = await cdp.send('Runtime.getHeapUsage'), m = { js: Math.round(h.usedSize / 1e6), buffers: Math.round((h.backingStorageSize || 0) / 1e6), dom: Math.round((h.embedderHeapUsedSize || 0) / 1e6) };
    const r = await p.evaluate(() => window.__renderer ? { geo: __renderer.info.memory.geometries, tex: __renderer.info.memory.textures, pr: +__renderer.getPixelRatio().toFixed(2), glb: window.LAB_GLB } : {});
    if (rpid) console.log('  renderer', rpid, JSON.stringify(summary(rpid)));
    const t = pss(); console.log(label.padEnd(12), JSON.stringify({ ...m, ...r }), 'PSS MB', JSON.stringify(t), 'sum', Object.values(t).reduce((a, b) => a + b, 0));
  };
  await mem('blank');
  await p.goto(process.argv[2], { waitUntil: 'load' }); await mem('loaded');
  await p.waitForFunction(() => document.body.classList.contains('lab-ready'), null, { timeout: 120000 }); await p.waitForTimeout(2000);
  rpid = renderers().sort((a, b) => b[1] - a[1])[0][0]; await mem('lab ready');
  for (let k = 0; k < 12; k++) { await p.evaluate(stop(k)); await p.waitForTimeout(1500); }
  await mem('after tour');
  await p.close(); await b.close();
})();
