# Builds rebuild-plan.html from template.html: inlines the Switzer font (fetched from Fontshare at build
# time, never committed: its licence bars redistribution through a public repo) and four prototype photos.
# Run from this folder: python3 build.py   (needs Pillow and network access to api.fontshare.com)
import base64, io, re, time, urllib.request
from PIL import Image

IMG = '../prototype/img/'

def fetch(u, tries=4):
    for i in range(tries):
        try:
            return urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'}), timeout=30).read()
        except OSError:
            if i == tries - 1:
                raise
            time.sleep(2 ** i)

def img(name, w):
    im = Image.open(IMG + name)
    im.thumbnail((w, w * 2))
    b = io.BytesIO()
    im.convert('RGB').save(b, 'WEBP', quality=72)
    return 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()

css = fetch('https://api.fontshare.com/v2/css?f[]=switzer@400,600&display=swap').decode()
woff = {w: 'https:' + u for u, w in re.findall(r"url\('?(//[^)']+\.woff2)'?\).*?font-weight:\s*(\d+)", css, re.S)}
t = open('template.html').read()
rep = {
    '{{SW400}}': base64.b64encode(fetch(woff['400'])).decode(),
    '{{SW600}}': base64.b64encode(fetch(woff['600'])).decode(),
    '{{IMG_PHOTO}}': img('photo.webp', 480), '{{IMG_DRONE}}': img('ba-drone.webp', 520),
    '{{IMG_NE}}': img('ne-hero.webp', 520), '{{IMG_OR}}': img('or-usrp.webp', 520),
}
for k, v in rep.items():
    t = t.replace(k, v)
open('rebuild-plan.html', 'w').write(t)
print('wrote rebuild-plan.html', len(t))
