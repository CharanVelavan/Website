# python3 glb_swap.py <in.glb> <out.glb> <image name>=<file.png> ...: replace images in a GLB (by their glTF image name,
# e.g. bake_room) with new pictures, encoded as WebP like the Blender export (quality 82)
import io, json, struct, sys
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
src, dst, *swaps = sys.argv[1:]
swaps = dict(s.split('=', 1) for s in swaps)
b = open(src, 'rb').read()
jlen = struct.unpack('<I', b[12:16])[0]
J = json.loads(b[20:20 + jlen])
B = b[20 + jlen + 8:]
views = [bytes(B[v.get('byteOffset', 0):v.get('byteOffset', 0) + v['byteLength']]) for v in J['bufferViews']]
for im in J['images']:
    f = swaps.pop(im.get('name'), None)
    if not f:
        continue
    buf = io.BytesIO()
    Image.open(f).convert('RGB').save(buf, 'WEBP', quality=82, method=6)
    views[im['bufferView']] = buf.getvalue()
    im['mimeType'] = 'image/webp'
    print(im['name'], len(views[im['bufferView']]) // 1024, 'KB')
if swaps:
    sys.exit('no image named: ' + ', '.join(swaps))
out = bytearray()
for v, data in zip(J['bufferViews'], views):
    out += b'\0' * (-len(out) % 4)
    v['byteOffset'], v['byteLength'] = len(out), len(data)
    out += data
out += b'\0' * (-len(out) % 4)
J['buffers'][0]['byteLength'] = len(out)
js = json.dumps(J, separators=(',', ':')).encode()
js += b' ' * (-len(js) % 4)
glb = struct.pack('<III', 0x46546C67, 2, 12 + 8 + len(js) + 8 + len(out)) + struct.pack('<II', len(js), 0x4E4F534A) + js + struct.pack('<II', len(out), 0x004E4942) + bytes(out)
open(dst, 'wb').write(glb)
print('%s: %d KB' % (dst, len(glb) // 1024))
