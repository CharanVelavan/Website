// renders 1200×630 link-preview cards for the home page and each case study
const { chromium } = require('playwright');
const cards = [
  ['home', 'photo', '50% 22%', 'Charan Velavan', 'Embedded & Firmware Engineer · M.E. Communication Systems, SSN', ['7 projects', 'NBUC ’24 1st', 'ITU Buildathon 2nd', 'Springer · IEEE'], 'charanvelavan.com'],
  ['Birds-AI', 'ba-main', '50% 42%', 'Bird’s AI', '5G search-and-rescue drone with on-board YOLOv8', ['NBUC ’24 · 1st place', '95% detection', 'with Nokia'], 'charanvelavan.com/projects/Birds-AI'],
  ['nephele-community-robot', 'ne-hero', '50% 30%', 'Nephele 2.0', 'Conference robot: faces, voice and AWS', ['3-robot fleet', '500+ conversations', 'v1.0 → v3.0'], 'charanvelavan.com/projects/nephele-community-robot'],
  ['ai-native-network-uav', 'sw-dash', '50% 20%', '300-UAV swarm network', 'Edge AI picks unicast, multicast or broadcast', ['ITU Buildathon 4.0 · 2nd', 'up to 98% less bandwidth', 'FG-AINN-I-215'], 'charanvelavan.com/projects/ai-native-network-uav'],
  ['thz-bandpass-filter', 'tz-current', '50% 50%', 'THz bandpass filter', 'Swastik-fractal dual-mode filter, 8 × 8 µm²', ['Journal of Optics · Springer', '38.32 dB at 3.88 THz', '25.93% smaller'], 'charanvelavan.com/projects/thz-bandpass-filter'],
  ['5g-network-implementation', 'or-usrp', '62% 50%', '5G O-RAN testbed', 'RAN and core on a USRP B210 with srsRAN and Open5GS', ['Techphosis × PEP 5G', 'CU / DU split', 'call flows traced'], 'charanvelavan.com/projects/5g-network-implementation'],
  ['emotion-monitoring-system', 'de-board', '50% 50%', 'DEMS', 'Real-time emotion detection on an STM32MP135F', ['Inventors Challenge ’23 · winner', 'TensorFlow Lite', '4 emotions'], 'charanvelavan.com/projects/emotion-monitoring-system'],
  ['waterbot', 'wb-front', '50% 60%', 'WaterBot', 'Solar robot boat that scoops trash from drains', ['SIH ’22 · national finalist', 'LoRa remote', 'team of 6'], 'charanvelavan.com/projects/waterbot']
];
const html = ([, img, pos, name, line, chips, url]) => `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@700&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400&display=swap"><style>
*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#EEEAE2;font-family:Geist,system-ui,sans-serif;color:#15161A;display:grid;grid-template-columns:520px 1fr;gap:0}
.ph{position:relative;margin:28px 0 28px 28px;border-radius:26px;overflow:hidden;background:#ddd}.ph img{width:100%;height:100%;object-fit:cover;object-position:${pos}}
.tx{padding:56px 56px 44px 48px;display:flex;flex-direction:column;gap:18px}
.mk{display:flex;align-items:center;gap:12px;font-weight:600;font-size:22px}.mk span{width:44px;height:44px;border-radius:11px;background:#15161A;color:#F4F2ED;display:grid;place-items:center;font:16px 'Geist Mono',monospace}
h1{font:700 ${name.length > 16 ? 78 : 96}px/.92 'Archivo Narrow',sans-serif;margin:18px 0 0;letter-spacing:-.01em}
p{margin:0;font-size:27px;line-height:1.3;color:#2E3036}
.ch{display:flex;flex-wrap:wrap;gap:10px;margin-top:auto}.ch b{font:500 19px Geist;border:1.5px solid rgba(21,22,26,.18);border-radius:999px;padding:8px 16px}.ch b:first-child{background:#15161A;color:#F4F2ED;border-color:#15161A}
.u{font:18px 'Geist Mono',monospace;color:#9A4E25}</style></head><body><div class="ph"><img src="data:image/webp;base64,${require("fs").readFileSync("img/" + img + ".webp").toString("base64")}"></div><div class="tx"><div class="mk"><span>CV</span>Charan Velavan</div><h1>${name}</h1><p>${line}</p><div class="ch">${chips.map((c) => `<b>${c}</b>`).join('')}</div><div class="u">${url}</div></div></body></html>`;
(async () => {
  const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  for (const c of cards) { await p.setContent(html(c), { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); await p.screenshot({ path: `og/${c[0] === 'home' ? 'home' : c[0]}.png` }); }
  await b.close(); console.log('ok');
})();
