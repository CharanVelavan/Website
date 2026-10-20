import json,sys,colorsys
def lum(h):
    h=h.lstrip('#'); r,g,b=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    f=lambda c: c/12.92 if c<=0.03928 else ((c+0.055)/1.055)**2.4
    return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)
def cr(a,b):
    la,lb=sorted([lum(a),lum(b)],reverse=True); return (la+0.05)/(lb+0.05)
lib={p['id']:p for p in json.load(open(sys.argv[1]))}
pairs=[l.split() for l in sys.argv[2:]]
for light,dark in pairs:
    for m,i in (('L',light),('D',dark)):
        p=lib[i]
        print(f"{m} {i:<24} ink {cr(p['ink'],p['bg']):5.1f}  muted {cr(p['muted'],p['bg']):4.1f}  muted/surf {cr(p['muted'],p['surface']):4.1f}  accent-as-text {cr(p['accent'],p['bg']):4.1f}  button {cr(p['accentInk'],p['accent']):4.1f}")
    print()
