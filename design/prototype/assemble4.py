import os, sys
os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/v4')
R = lambda f: open(f).read()
bays = [f for f in ['bay-ba.js', 'bay-ne.js', 'bay-sw.js', 'bay-tz.js', 'bay-or.js', 'bay-de.js', 'bay-wb.js'] if os.path.exists(f)]
head = '''<title>Living Lab 3D</title>
<meta name="description" content="Charan Velavan — Embedded &amp; Firmware Engineer. Seven projects, from circuit board to 5G link, in a 3D lab.">
<meta property="og:title" content="Charan Velavan — Embedded &amp; Firmware Engineer">
<meta property="og:description" content="Drones, robots, 5G and THz filters — seven projects in a 3D lab.">
<meta property="og:image" content="og/home.png">
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@600;700&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap">
<link rel="modulepreload" href="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js">
'''
out = head + '<style>\n' + R('base.css') + R('proj.css') + R('extra.css') + '@media (max-width: 860px) {\n' + R('proj-phone.css') + '}\n</style>\n' + R('body.html') + '''<script type="importmap">
{ "imports": {
  "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
  "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
} }
</script>
<script type="module">
''' + R('cases.js') + R('ui.js').replace('// ===================== Lite stops here', R('palette.js') + '\n// ===================== Lite stops here') + R('scene.js') + R('core3d.js') + ''.join(R(b) for b in bays) + R('frame.js') + '</script>\n'
open('../living-lab-3d.html', 'w').write(out)
print(len(out), bays)
