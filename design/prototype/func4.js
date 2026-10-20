const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'], proxy: { server: process.env.HTTPS_PROXY } });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
  const url = 'file://' + process.cwd() + '/test.html';
  await page.goto(url, { waitUntil: 'networkidle' }); await page.waitForTimeout(2500);
  const ok = (name, v) => console.log((v ? 'PASS ' : 'FAIL ') + name);
  // bento → case study
  await page.click('.cell[data-id="ne"]'); await page.waitForTimeout(1500);
  ok('tile opens Nephele route', (await page.evaluate(() => location.hash)).startsWith('#/projects/nephele-community-robot'));
  ok('rail shows Nephele tabs', (await page.textContent('#tabs')).includes('Impact'));
  ok('10-second answer present', await page.isVisible('#rbody .tldr'));
  // keyboard tabs
  await page.focus('#tabs [role=tab][aria-selected=true]'); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(400);
  ok('arrow key moves to Build tab', (await page.getAttribute('#tabs [role=tab][aria-selected=true]', 'data-goto')) === 'build');
  // next project
  await page.click('#rail [data-next]'); await page.waitForTimeout(1500);
  ok('next → swarm', (await page.evaluate(() => location.hash)).startsWith('#/projects/ai-native-network-uav'));
  ok('crumb updated', (await page.textContent('#crumb')).includes('swarm'));
  // print: the plain case study fills the print view
  await page.evaluate(() => dispatchEvent(new Event('beforeprint'))); await page.emulateMedia({ media: 'print' });
  ok('print doc filled', (await page.evaluate(() => document.querySelectorAll('#litedoc .dsec').length)) === 6);
  await page.pdf({ path: 'shots/print-sw.pdf', format: 'A4', printBackground: true });
  await page.emulateMedia({ media: 'screen' }); await page.evaluate(() => dispatchEvent(new Event('afterprint')));
  // sound on/off
  await page.click('#soundBtn'); await page.waitForTimeout(300); ok('sound toggles on', (await page.getAttribute('#soundBtn', 'aria-pressed')) === 'true'); await page.click('#soundBtn');
  // esc → home, then back/forward
  await page.keyboard.press('Escape'); await page.waitForTimeout(1200);
  ok('esc leaves to home', !(await page.evaluate(() => location.hash)).startsWith('#/projects'));
  await page.goForward(); await page.waitForTimeout(1500);
  ok('forward reopens a project', (await page.evaluate(() => location.hash)).startsWith('#/projects'));
  await page.goBack(); await page.waitForTimeout(1200);
  ok('back closes it', !(await page.evaluate(() => document.body.classList.contains('proj'))));
  // skills map
  await page.evaluate(() => scrollTo(0, 0)); await page.click('.layer[data-layer="rf"]'); await page.waitForTimeout(300);
  ok('skills panel lists RF work', (await page.textContent('#skills')).includes('38.32 dB'));
  await page.click('#skills button[data-open="tz"]'); await page.waitForTimeout(2500);
  ok('skill line opens THz at results', (await page.evaluate(() => location.hash)) === '#/projects/thz-bandpass-filter/results');
  await page.keyboard.press('Escape'); await page.waitForTimeout(1200);
  // lab chips and timeline list
  ok('lab chips: 7', (await page.locator('#labChips button').count()) === 7);
  ok('timeline buttons: 7', (await page.locator('#tlList button').count()) === 7);
  // terminal
  await page.keyboard.press('`'); await page.fill('#termIn', 'stats'); await page.keyboard.press('Enter'); await page.waitForTimeout(200);
  ok('terminal stats logs events', (await page.textContent('#termOut')).includes('open_project'));
  await page.fill('#termIn', 'open waterbot'); await page.keyboard.press('Enter'); await page.waitForTimeout(1500);
  ok('terminal opens WaterBot', (await page.evaluate(() => location.hash)).startsWith('#/projects/waterbot'));
  await page.keyboard.press('Escape'); await page.waitForTimeout(1000);
  // Lite switch reloads into Lite
  await page.click('#liteBtn'); await page.waitForLoadState('networkidle'); await page.waitForTimeout(800);
  ok('lite mode on after switch', await page.evaluate(() => document.body.classList.contains('lite')));
  await page.click('#labChips button[data-open="de"]'); await page.waitForTimeout(500);
  ok('lite opens DEMS as a page', (await page.evaluate(() => document.querySelectorAll('#litedoc .dsec').length)) === 6 && await page.isVisible('#litedoc'));
  await page.click('#liteBtn'); await page.waitForLoadState('networkidle');
  console.log(errs.join('\n') || 'no console errors');
  await browser.close();
})();
