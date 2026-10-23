// node motion-strip.js <page.html> <outDir> [desk|phone]: captures frames through the five main moves
// (hero to lab, lab to flight path, opening a case study, going back, switching theme) and stitches each into a strip.
const { chromium } = require('playwright');
const path = require('path'); const { execFileSync } = require('child_process');
const [file, out, vp = 'desk'] = process.argv.slice(2);
const phone = vp === 'phone';
(async () => {
  const b = await chromium.launch({ headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--allow-file-access-from-files'] });
  const ctx = await b.newContext({ viewport: phone ? { width: 412, height: 915 } : { width: 1440, height: 900 }, isMobile: phone, hasTouch: phone });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file://' + path.resolve(file), { waitUntil: 'load' }); await p.waitForTimeout(3500);
  const toSec = (id) => p.evaluate((id) => { const el = document.getElementById(id); scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight * 0.5 - innerHeight / 2); }, id);
  async function capture(name, act, n = 8, gap = 110) {
    await act(); const files = [];
    for (let i = 0; i < n; i++) { const f = `${out}/${name}-${i}.png`; await p.screenshot({ path: f }); files.push(f); await p.waitForTimeout(gap); }
    execFileSync('python3', ['-c', `import sys\nfrom PIL import Image\nfs=sys.argv[2:];ims=[Image.open(f) for f in fs];w=ims[0].width//4;h=ims[0].height//4\nc=Image.new('RGB',(w*len(ims)+6*(len(ims)-1),h),'white')\nfor i,im in enumerate(ims): c.paste(im.resize((w,h)),(i*(w+6),0))\nc.save(sys.argv[1])`, `${out}/strip-${name}.png`, ...files]);
    files.forEach((f) => require('fs').unlinkSync(f));
  }
  await capture('1-hero-to-lab', () => toSec('lab'));
  await p.waitForTimeout(1500);
  await capture('2-lab-to-flight', () => toSec('timeline'));
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(2500);
  await capture('3-open-case', () => p.click('.cell[data-id="ba"]'), 8, 90);
  await p.waitForTimeout(1500);
  await capture('4-back', () => p.keyboard.press('Escape'), 8, 70);
  await p.waitForTimeout(1500); await toSec('lab'); await p.waitForTimeout(2500);
  await capture('5-theme', async () => { await p.click('#setBtn'); await p.waitForTimeout(300); await p.click('[data-theme-id="sienna"]'); }, 6, 60);
  await b.close(); console.log(errs.join('\n') || 'ok');
})();
