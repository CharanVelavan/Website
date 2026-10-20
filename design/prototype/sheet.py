import sys, glob, re
from PIL import Image
pre = sys.argv[1]; cols = int(sys.argv[2]) if len(sys.argv) > 2 else 3
fs = sorted(glob.glob(f'shots/{pre}-*.png'), key=lambda f: int(re.findall(r'-(\d+)\.png$', f)[0]))
ims = [Image.open(f) for f in fs]; w, h = ims[0].size; s = 480 / w if w > 600 else 260 / w
W, H = int(w * s), int(h * s); rows = (len(ims) + cols - 1) // cols
sh = Image.new('RGB', (W * cols, H * rows), 'white')
for i, im in enumerate(ims): sh.paste(im.resize((W, H)), ((i % cols) * W, (i // cols) * H))
sh.save(f'shots/sheet-{pre}.png'); print(len(ims), sh.size)
