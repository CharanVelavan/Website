// node views-device.js <url> <outDir>: on the phone (adb screen captures), the views made of cards and tiles: the
// All projects grid (top and scrolled), a stop's panel grown to full, and a case study (top, two scrolls down)
const { chromium } = require('playwright'); const { execSync } = require('child_process'); const fs = require('fs');
const [url, out] = process.argv.slice(2);
const cap = (f) => fs.writeFileSync(`${out}/${f}.png`, execSync('adb exec-out screencap -p', { maxBuffer: 1 << 26 }));
const stop = (k) => `(() => { const el = document.getElementById('stops').children[${k}]; scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2); })()`;
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.connectOverCDP('http://127.0.0.1:9222'), c = b.contexts()[0];
  const p = c.pages().find((x) => x.url().includes('8765')) || await c.newPage(); await p.bringToFront();
  await (await c.newCDPSession(p)).send('Network.setCacheDisabled', { cacheDisabled: true }); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(url, { waitUntil: 'load' }); await p.waitForFunction(() => document.body.classList.contains('lab-ready'), null, { timeout: 120000 });
  await p.evaluate(stop(0)); await p.waitForTimeout(3000);
  await p.click('[data-bar="all"]'); await p.waitForTimeout(1200); cap('grid');
  await p.evaluate(() => { const g = document.getElementById('lgrid'); g.scrollTop = g.scrollHeight; }); await p.waitForTimeout(800); cap('grid-end');
  await p.keyboard.press('Escape'); await p.evaluate(() => { const g = document.getElementById('lgrid'); if (!g.hidden) g.hidden = true; });
  await p.evaluate(stop(2)); await p.waitForTimeout(3500);
  await p.click('#lpanel [data-lp-grow]'); await p.waitForTimeout(1200); cap('panel-full');
  await p.evaluate(() => { const l = document.getElementById('lpanel'); l.scrollTop = l.scrollHeight; }); await p.waitForTimeout(800); cap('panel-full-end');
  await p.click('#lpanel [data-lp-go]'); await p.waitForTimeout(3500); cap('case-0');
  for (let i = 1; i < 4; i++) { await p.evaluate(() => scrollBy(0, innerHeight * 0.8)); await p.waitForTimeout(1500); cap(`case-${i}`); }
  console.log(errs.length ? errs.join('\n') : 'no errors'); await b.close();
})();
