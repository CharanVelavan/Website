// node tour-device.js <url> <outDir>: one load on the phone, then a screen capture (adb) of the hero, each tour stop, and
// each stop's panel opened, so the 3D and the cards can be checked at the phone's real resolution
const { chromium } = require('playwright'); const { execSync } = require('child_process'); const fs = require('fs');
const [url, out] = process.argv.slice(2);
const cap = (f) => fs.writeFileSync(`${out}/${f}.png`, execSync('adb exec-out screencap -p', { maxBuffer: 1 << 26 }));
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.connectOverCDP('http://127.0.0.1:9222'), c = b.contexts()[0];
  const p = c.pages().find((x) => x.url().includes('8765')) || await c.newPage(); await p.bringToFront();
  await (await c.newCDPSession(p)).send('Network.setCacheDisabled', { cacheDisabled: true });
  await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(2500); cap('hero');
  await p.waitForFunction(() => document.body.classList.contains('lab-ready'), null, { timeout: 120000 });
  const names = ['over', 'ba', 'ne', 'sw', 'tz', 'or', 'de', 'wb', 'ss', 'sa', 'shelf'];
  for (const [k, n] of names.entries()) {
    await p.evaluate((k) => { const el = document.getElementById('stops').children[k]; scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2); }, k);
    await p.waitForTimeout(3500); cap(`stop-${n}`); console.log(n, await p.evaluate(() => __renderer.getPixelRatio()));
  }
  await b.close();
})();
