// evaluates settings.js's THEMES + tokens() and checks every text pair at 4.5:1
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const code = src.slice(0, src.indexOf('const themeVars'));
const { THEMES, tokens } = new Function(code + '; return { THEMES, tokens };')();
const lum = (h) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const cr = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const pairs = [['ink', 'bg'], ['sub', 'bg'], ['mute', 'bg'], ['mute', 'tile'], ['mute', 'solid'], ['acc', 'bg'], ['acc', 'solid'], ['acc', 'tile'], ['ai', 'ac'], ['ink', 'tile'], ['solid', 'ink']];
let fails = 0;
for (const th of THEMES) for (const dark of [0, 1]) {
  const k = tokens(th, dark); const bad = pairs.map(([f, b]) => [f, b, cr(k[f], k[b])]).filter((p) => p[2] < 4.5);
  const low = Math.min(...pairs.map(([f, b]) => cr(k[f], k[b])));
  console.log(`${th.id.padEnd(9)} ${dark ? 'dark ' : 'light'} lowest ${low.toFixed(2)}${bad.length ? '  FAIL ' + bad.map(([f, b, c]) => `${f}/${b} ${c.toFixed(2)}`).join(', ') : ''}`);
  fails += bad.length;
}
console.log(fails ? `${fails} failing pairs` : 'all text pairs at least 4.5:1');
