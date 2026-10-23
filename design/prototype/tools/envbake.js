// node envbake.js [url=http://127.0.0.1:8765/test-v7.html] [out=../models/lab-env.webp]: bakes the lab's reflection map.
// Opens the page in its ?envbake mode (desktop: the 4096 WebP room), where the room is captured from its middle and
// prefiltered by PMREM as the page used to do on every visit, and writes the PMREM target as sRGB 8-bit lossless WebP
// (rows bottom-up, as the GPU holds them; the page uploads it unflipped). Pillow encodes it: Chrome's WebP isn't lossless.
// Re-run it whenever the room is re-baked.
const { chromium } = require('playwright'); const path = require('path');
const [url = 'http://127.0.0.1:8765/test-v7.html', out = path.join(__dirname, '../models/lab-env.webp')] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(url + (url.includes('?') ? '&' : '?') + 'envbake', { waitUntil: 'load' });
  await p.waitForFunction(() => window.__envBake, null, { timeout: 180000 });
  // the page draws the pixels into a canvas and hands back a PNG
  const png = await p.evaluate(() => { const { w, h, px } = window.__envBake, cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    cv.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(px), w, h), 0, 0); return cv.toDataURL('image/png').split(',')[1]; });
  const { w, h, max } = await p.evaluate(() => window.__envBake);
  const fs = require('fs'), tmp = out + '.png'; fs.writeFileSync(tmp, Buffer.from(png, 'base64'));
  require('child_process').execFileSync('python3', ['-c', 'import sys; from PIL import Image; Image.open(sys.argv[1]).convert("RGB").save(sys.argv[2], lossless=True, method=6)', tmp, out]); fs.unlinkSync(tmp);
  console.log(`${out}: ${w}x${h}, ${Math.round(fs.statSync(out).size / 1024)} KB; brightest linear value ${max.toFixed(3)}${max > 1 ? ' (clipped to 1 in 8-bit)' : ''}`);
  console.log(errs.length ? errs.join('\n') : 'no errors'); await b.close();
})();
