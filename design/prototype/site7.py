# python3 design/prototype/site7.py: builds the v7 lab into the Next.js site, where / serves it (next.config.mjs).
# package.json runs it before `next build` and `next dev`. It writes public/lab.html and copies the lab's img/, media/,
# og/ and models/ into public/. Switzer is inlined here from Fontshare (assemble7.py), so all of that is git-ignored.
import os, shutil, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.join(HERE, '..', '..', 'public')
SITE = 'https://www.charanvelavan.com'
subprocess.run([sys.executable, os.path.join(HERE, 'assemble7.py')], check=True, stdout=subprocess.DEVNULL)
s = open(os.path.join(HERE, 'living-lab-v7.html')).read()
# the page is built for the artifact host, which wraps it in a document: here it gets its own, with the head tags in the head
swap = [
    ('<title>Living Lab 3D</title>', '<title>Charan Velavan — Embedded &amp; Firmware Engineer</title>'),
    ('<meta property="og:image" content="og/home.png">',
     f'<meta property="og:image" content="{SITE}/og/home.png">\n<meta property="og:url" content="{SITE}/">\n<meta property="og:type" content="website">\n'
     f'<meta name="twitter:card" content="summary_large_image">\n<link rel="canonical" href="{SITE}/">\n<link rel="icon" href="/favicon.ico">\n'
     # Search Console's verification, as the Next.js layout sets it for the other pages
     '<meta name="google-site-verification" content="aIhJxGy3N1L0rXQEaRRkv11wS61WEvDuu7UKT_gWVjk">'),
    ('<meta name="claude:viewport-fit-sides" content="cover">\n', ''),
]
for a, b in swap:
    assert a in s, a
    s = s.replace(a, b)
cut = s.index('<style>')
head, body = s[:cut], s[cut:]
page = ('<!doctype html><html lang="en"><head>\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
        + head + '<style>[hidden]{display:none!important}</style>\n</head><body>\n' + body + '</body></html>\n')
open(os.path.join(PUBLIC, 'lab.html'), 'w').write(page)
for d in ('img', 'media', 'og', 'models'):
    shutil.copytree(os.path.join(HERE, d), os.path.join(PUBLIC, d), dirs_exist_ok=True, ignore=shutil.ignore_patterns('*.json', '.DS_Store'))
print('lab built into public/lab.html')
