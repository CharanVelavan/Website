import base64, os, re, sys, time, urllib.parse, urllib.request
# Switzer is inlined at build time from Fontshare and cached in .fontcache/; its licence bars committing it to a
# public repo, so the built pages (living-lab-v5.html, test-v5.html) and the cache are git-ignored.
CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.fontcache')
def fetch(u, tries=4):
    for i in range(tries):
        try: return urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'}), timeout=30).read()
        except OSError:
            if i == tries - 1: raise
            time.sleep(2 ** i)
def switzer():
    os.makedirs(CACHE, exist_ok=True); faces = ''
    for w in ('400', '600'):
        p = os.path.join(CACHE, f'switzer-{w}.woff2')
        if not os.path.exists(p):
            css = fetch('https://api.fontshare.com/v2/css?f[]=switzer@400,600&display=swap').decode()
            urls = {wt: 'https:' + u for u, wt in re.findall(r"url\('?(//[^)']+\.woff2)'?\).*?font-weight:\s*(\d+)", css, re.S)}
            open(p, 'wb').write(fetch(urls[w]))
        faces += "@font-face{font-family:'Switzer';font-weight:%s;font-style:normal;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2')}\n" % (w, base64.b64encode(open(p, 'rb').read()).decode())
    return faces
# the Tamil name lockup: Anek Tamil 600 (OFL), subset by Google Fonts to just the letters of the name, inlined so it never flashes a fallback
TAMIL = 'சரண் வேலவன்'
def anek():
    p = os.path.join(CACHE, 'anek-tamil-name.woff2')
    if not os.path.exists(p):
        css = urllib.request.urlopen(urllib.request.Request('https://fonts.googleapis.com/css2?family=Anek+Tamil:wght@600&display=block&text=' + urllib.parse.quote(TAMIL), headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'}), timeout=30).read().decode()
        open(p, 'wb').write(fetch(re.search(r"url\((https://[^)]+)\)", css).group(1)))
    return "@font-face{font-family:'Anek Tamil';font-weight:600;font-style:normal;font-display:block;src:url(data:font/woff2;base64,%s) format('woff2')}\n" % base64.b64encode(open(p, 'rb').read()).decode()
os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/v5')
R = lambda f: open(f).read()
bays = [f for f in ['bay-ba.js', 'bay-ne.js', 'bay-sw.js', 'bay-tz.js', 'bay-or.js', 'bay-de.js', 'bay-wb.js', 'bay-ss.js', 'bay-sa.js'] if os.path.exists(f)]
head = '''<title>Living Lab 3D</title>
<meta name="description" content="Charan Velavan — Embedded and firmware engineer. Nine projects, from circuit board to 5G link, in a 3D lab.">
<meta property="og:title" content="Charan Velavan — Embedded &amp; Firmware Engineer">
<meta property="og:description" content="Drones, robots, 5G, THz filters and an Alexa skill: nine projects in a 3D lab.">
<meta property="og:image" content="og/home.png">
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="theme-color" content="#F7F7F7">
<link rel="modulepreload" href="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js">
'''
out = head + '<style>\n' + switzer() + anek() + R('base.css') + R('proj.css') + R('extra.css') + '@media (max-width: 860px) {\n' + R('proj-phone.css') + '}\n</style>\n' + R('body.html') + '''<script type="importmap">
{ "imports": {
  "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
  "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
} }
</script>
<script type="module">
''' + R('cases.js') + R('ui.js').replace('// ===================== Lite stops here', R('settings.js') + '\n// ===================== Lite stops here') + R('scene.js') + R('core3d.js') + R('ring.js') + R('layouts.js') + ''.join(R(b) for b in bays) + R('frame.js') + '</script>\n'
open('../living-lab-v5.html', 'w').write(out)
print(len(out), bays)
