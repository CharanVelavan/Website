// node shot-device.js <url> <stop> <out.png>: open url on the phone, go to a tour stop, wait, screen-capture through adb
const { chromium } = require('playwright'); const { execSync } = require('child_process'); const fs = require('fs');
const [url, k, out] = process.argv.slice(2);
(async () => {
  const b = await chromium.connectOverCDP('http://127.0.0.1:9222'), c = b.contexts()[0];
  const p = c.pages().find((x) => x.url().includes('8765')) || await c.newPage();
  await (await c.newCDPSession(p)).send('Network.setCacheDisabled', { cacheDisabled: true }); // the local server sends no cache headers
  await p.goto(url, { waitUntil: 'load' }); await p.waitForFunction(() => document.body.classList.contains('lab-ready'), null, { timeout: 90000 });
  await p.evaluate((k) => { const el = document.getElementById('stops').children[k]; scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2); }, +k);
  await p.waitForTimeout(4500); await p.bringToFront();
  console.log(out, await p.evaluate(() => __renderer.getPixelRatio()), performance.now | 0);
  fs.writeFileSync(out, execSync('adb exec-out screencap -p', { maxBuffer: 1 << 26 })); await b.close();
})();
