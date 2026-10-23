# python3 grid.py <out.png> <cols> <width> img...: a contact sheet, in the order given
import sys
from PIL import Image
out, cols, w = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); fs = sys.argv[4:]
ims = [Image.open(f).convert('RGB') for f in fs]; ims = [i.resize((w, round(i.height * w / i.width))) for i in ims]
h = max(i.height for i in ims); rows = (len(ims) + cols - 1) // cols
c = Image.new('RGB', (cols * (w + 8), rows * (h + 8)), 'white')
for k, i in enumerate(ims): c.paste(i, ((k % cols) * (w + 8), (k // cols) * (h + 8)))
c.save(out)
