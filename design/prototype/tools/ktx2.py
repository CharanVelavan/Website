# python3 ktx2.py <in.glb> <out.glb> desk|phone|phonefull|web4k: re-encode every image in a GLB as KTX2 (KHR_texture_basisu)
#   web4k: stays WebP, with any image over 4096 brought down to 4096 (the desktop set: an 8192 atlas uncompressed is 340 MB of GPU memory)
#   desk:  full size, UASTC with RDO + zstd (about 42 dB; transcodes to BC7 / ASTC, 8 bits a pixel on the GPU)
#   phone: half size, ETC1S (about 39 dB; transcodes to ETC2 / ASTC, a quarter of the desk set's memory)
#   phonefull: full size, ETC1S at a higher quality (sharper, four times the phone set's GPU memory)
# Needs KTX-Software's `ktx` tool: on PATH, or KTX_BIN pointing at it (with its libktx beside it in ../lib).
import io, json, os, shutil, struct, subprocess, sys, tempfile
from PIL import Image

src, dst, tier = sys.argv[1], sys.argv[2], sys.argv[3]
KTX = os.environ.get('KTX_BIN') or shutil.which('ktx') or (tier == 'web4k' and 'none') or sys.exit('ktx tool not found: set KTX_BIN')
env = dict(os.environ, DYLD_LIBRARY_PATH=os.path.join(os.path.dirname(os.path.dirname(KTX)), 'lib'))
ENC = {'web4k': [], 'desk': ['--encode', 'uastc', '--uastc-quality', '2', '--uastc-rdo', '--uastc-rdo-l', '3', '--zstd', '18'],
       'phone': ['--encode', 'basis-lz', '--clevel', '4', '--qlevel', '192'],
       'phonefull': ['--encode', 'basis-lz', '--clevel', '4', '--qlevel', '255']}[tier]

b = open(src, 'rb').read()
jlen = struct.unpack('<I', b[12:16])[0]
J = json.loads(b[20:20 + jlen])
B = b[20 + jlen + 8:]
views = [bytes(B[v.get('byteOffset', 0):v.get('byteOffset', 0) + v['byteLength']]) for v in J['bufferViews']]

tmp = tempfile.mkdtemp()
for i, im in enumerate(J['images']):
    pic = Image.open(io.BytesIO(views[im['bufferView']]))
    if tier == 'web4k':
        if max(pic.size) > 4096:
            pic = pic.resize((pic.width * 4096 // max(pic.size), pic.height * 4096 // max(pic.size)), Image.LANCZOS)
            buf = io.BytesIO(); pic.save(buf, 'WEBP', quality=82, method=6); views[im['bufferView']] = buf.getvalue()
        print(im.get('name', i), pic.size, len(views[im['bufferView']]) // 1024, 'KB', flush=True)
        continue
    alpha = pic.mode in ('RGBA', 'LA') or 'transparency' in pic.info
    pic = pic.convert('RGBA' if alpha else 'RGB')
    if tier == 'phone' and max(pic.size) > 512:
        pic = pic.resize((pic.width // 2, pic.height // 2), Image.LANCZOS)
    p, k = os.path.join(tmp, '%d.png' % i), os.path.join(tmp, '%d.ktx2' % i)
    pic.save(p)
    subprocess.run([KTX, 'create', '--format', 'R8G8B8A8_SRGB' if alpha else 'R8G8B8_SRGB', '--assign-tf', 'srgb', *ENC, '--generate-mipmap', p, k], check=True, env=env, capture_output=True)
    views[im['bufferView']] = open(k, 'rb').read()
    im['mimeType'] = 'image/ktx2'
    print(im.get('name', i), pic.size, len(views[im['bufferView']]) // 1024, 'KB', flush=True)
shutil.rmtree(tmp)

# textures point at their image through KHR_texture_basisu
for t in ([] if tier == 'web4k' else J['textures']):
    ext = t.setdefault('extensions', {})
    s = ext.pop('EXT_texture_webp', {}).get('source', t.get('source'))
    t.pop('source', None)
    ext['KHR_texture_basisu'] = {'source': s}
used = J.get('extensionsUsed', []) if tier == 'web4k' else [e for e in J.get('extensionsUsed', []) if e != 'EXT_texture_webp'] + ['KHR_texture_basisu']
J['extensionsUsed'] = used
if tier != 'web4k':
    J['extensionsRequired'] = [e for e in J.get('extensionsRequired', []) if e != 'EXT_texture_webp'] + ['KHR_texture_basisu']

# one buffer again, every view 4-byte aligned
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
