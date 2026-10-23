import sys,glob
from PIL import Image
d=sys.argv[1]; order=sys.argv[3:]
ims=[Image.open(f'{d}/seq-{o.replace(":","-")}.png') for o in order]
c=Image.new('RGB',(sum(i.width for i in ims)+10*len(ims),ims[0].height),'white');x=0
for i in ims: c.paste(i,(x,0)); x+=i.width+10
c.save(sys.argv[2])
