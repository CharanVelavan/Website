"""Bake the rendered lighting into texture atlases and export lab.glb for the web.

  Blender -b lab.blend -P bake.py -- <out_dir> [samples] [scale]

Each bake group (room, furniture, one per project) gets one atlas. Moving parts (drone, robot heads,
boats, the swarm fleet) stay separate meshes under their animated empties but share their project's atlas.
Glass and water are not baked: they export with a material named glass_* and the page draws them.
Writes lab.glb and lab.json (anchors, in three.js axes).
"""
import bpy, bmesh, os, sys, json, math, time, subprocess
import numpy as np
from mathutils import Vector, Matrix

D = bpy.data
a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = os.path.abspath(a[0]) if a else os.path.join(os.path.dirname(bpy.data.filepath), 'out')
SAMPLES = int(a[1]) if len(a) > 1 else 256
SCALE = float(a[2]) if len(a) > 2 else 1.0
os.makedirs(OUT, exist_ok=True)
sc = bpy.context.scene
sc.frame_set(0)

GLASS_MATS = {'glass', 'acrylic', 'tank_glass', 'water', 'pet'}
DYNAMIC = ['ba_drone', 'ba_prop', 'ne2_head', 'ne3_head', 'wb_boat', 'wb_flap', 'ss_boat', 'tz_holder', 'sw_fleet', 'sa_halo']
SIZES = {'room': 6144, 'furniture': 8192}  # the wide views and close-ups see these most; 4096 read soft on a 3.5x phone
PROJ_SIZE = 2048
DENOISE = {'room', 'furniture'}
HERE = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------- prep
# the swarm fleet: gather drones, LEDs and links under one empty pivoting on the mast
sw = D.objects['proj_sw']
fleet = D.objects.new('sw_fleet', None)
for c in sw.users_collection:
    c.objects.link(fleet)
fleet.parent = sw
bpy.context.view_layer.update()  # the empty's world matrix must be live before children are moved under it
for o in list(sw.children):
    if o.name.startswith(('sw_drone', 'sw_led', 'sw_link', 'sw_uplink')):
        mw = o.matrix_world.copy()
        o.parent = fleet
        o.matrix_world = mw
# the Solar Sailor halo rings get their own empty so they can pulse
echo = D.objects['sa_echo']
halo = D.objects.new('sa_halo', None)
for c in echo.users_collection:
    c.objects.link(halo)
halo.parent = echo
bpy.context.view_layer.update()
for o in list(echo.children):
    if o.name.startswith('sa_halo') and o is not halo:
        mw = o.matrix_world.copy()
        o.parent = halo
        o.matrix_world = mw

bpy.context.view_layer.update()


def is_glass(o):
    ms = [s.material.name for s in o.material_slots if s.material]
    return bool(ms) and all(m.split('.')[0] in GLASS_MATS for m in ms)


def group_of(o):
    p = o
    while p.parent:
        p = p.parent
    if p.name.startswith('proj_'):
        return p.name[5:]
    cols = {c.name for c in o.users_collection}
    if cols & {'room', 'outside'}:
        return 'room'
    return 'furniture'


def unit_of(o):
    """Nearest dynamic ancestor empty, or None for static."""
    p = o.parent
    while p:
        base = p.name.split('.')[0]
        if p.type == 'EMPTY' and base in DYNAMIC:
            return p
        p = p.parent
    return None


# make every renderable object a single-user mesh with modifiers applied
bpy.ops.object.select_all(action='DESELECT')
cands = [o for o in sc.objects if o.type in ('MESH', 'CURVE', 'FONT') and not o.hide_render]
for o in cands:
    if o.data.users > 1:
        o.data = o.data.copy()
    o.select_set(True)
bpy.context.view_layer.objects.active = cands[0]
bpy.ops.object.convert(target='MESH')
meshes = [o for o in sc.objects if o.type == 'MESH' and not o.hide_render]
print('meshes', len(meshes))

# lights and the outside backdrop are baked; glass is drawn live
glass = [o for o in meshes if is_glass(o)]
bakeable = [o for o in meshes if not is_glass(o)]
groups = {}
for o in bakeable:
    groups.setdefault(group_of(o), []).append(o)
print({k: len(v) for k, v in groups.items()})

# image nodes need their original UVs once a second map exists
for ma in D.materials:
    if not ma.node_tree:
        continue
    for n in ma.node_tree.nodes:
        if n.type == 'TEX_IMAGE' and not n.inputs['Vector'].is_linked:
            uv = ma.node_tree.nodes.new('ShaderNodeUVMap')
            uv.uv_map = 'UVMap'
            ma.node_tree.links.new(uv.outputs['UV'], n.inputs['Vector'])
        elif n.type == 'TEX_COORD':
            # TexCoord UV outputs feed crop mappings
            for l in list(n.outputs['UV'].links):
                uv = ma.node_tree.nodes.new('ShaderNodeUVMap')
                uv.uv_map = 'UVMap'
                ma.node_tree.links.new(uv.outputs['UV'], l.to_socket)
for o in bakeable:
    if 'UVMap' not in o.data.uv_layers:
        o.data.uv_layers.new(name='UVMap')


def join(objs, name, parent):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        mw = o.matrix_world.copy()
        o.parent = None
        o.matrix_world = mw
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    if len(objs) > 1:
        bpy.ops.object.join()
    j = bpy.context.view_layer.objects.active
    j.name = name
    if parent:
        mw = j.matrix_world.copy()
        j.parent = parent
        j.matrix_world = mw
    return j


# join each group into one static mesh plus one mesh per moving part (few objects = fast bakes)
units = {}
for name, objs in groups.items():
    by_unit = {}
    for o in objs:
        by_unit.setdefault(unit_of(o), []).append(o)
    joined = []
    for u, os_ in by_unit.items():
        if u is None:
            joined.append(join(os_, '%s_static' % name, D.objects.get('proj_' + name)))
        else:
            joined.append(join(os_, u.name + '_mesh', u))
    groups[name] = joined
print('joined', {k: len(v) for k, v in groups.items()}, flush=True)
for objs in groups.values():
    for o in objs:
        bl = o.data.uv_layers.new(name='bake')
        o.data.uv_layers.active = bl

# ---------------------------------------------------------------- hidden faces
# Faces nobody can see get no atlas space and are dropped from the export: anything facing down below the
# floor (the slab underside), and any face covered within CONTACT by another surface (the floor under the
# rug, the bottoms of props on the benches, frames against the wall). They stay in the scene while baking
# so they still block light; only their UVs collapse to a point, so the bake never writes to them.
CONTACT = 0.012
from mathutils.bvhtree import BVHTree

# the floor is one big quad: split large flat faces so the part under the rug can go on its own
for o in groups.get('room', []):
    bm = bmesh.new()
    bm.from_mesh(o.data)
    big = [f for f in bm.faces if f.calc_area() > 1.0 and abs(f.normal.z) > 0.9]
    if big:
        es = list({e for f in big for e in f.edges})
        bmesh.ops.subdivide_edges(bm, edges=es, cuts=24, use_grid_fill=True)
    bm.to_mesh(o.data)
    bm.free()

# moving parts leave their resting spots, so only static meshes cover anything, and only static faces go
all_joined = [o for objs in groups.values() for o in objs if o.name.endswith('_static')]
wv, wp = [], []
for o in all_joined:
    mw = o.matrix_world
    base = len(wv)
    wv += [mw @ v.co for v in o.data.vertices]
    wp += [[base + i for i in p.vertices] for p in o.data.polygons]
bvh = BVHTree.FromPolygons(wv, wp)


def hidden(c, n, pts):
    if n.z < -0.5 and c.z < -0.004:
        return True
    for p in pts:
        hit = bvh.ray_cast(p + n * 2e-4, n, CONTACT)
        # only a surface lying face to face counts (bevels near a contact stay)
        if hit[0] is None or hit[1].dot(n) > -0.8:
            return False
    return True


n_cull = n_all = 0
for o in all_joined:
    me = o.data
    mw = o.matrix_world
    nm = mw.inverted_safe().transposed().to_3x3()
    att = me.attributes.get('cull') or me.attributes.new('cull', 'INT', 'FACE')
    vals = [0] * len(me.polygons)
    for p in me.polygons:
        c = mw @ p.center
        n = (nm @ p.normal).normalized()
        pts = [c] + [c.lerp(mw @ me.vertices[i].co, 0.8) for i in p.vertices]
        if hidden(c, n, pts):
            vals[p.index] = 1
    att.data.foreach_set('value', vals)
    n_cull += sum(vals)
    n_all += len(vals)
print('culled %d of %d faces' % (n_cull, n_all), flush=True)


def cull_flags(me):
    att = me.attributes.get('cull')
    vals = [0] * len(me.polygons)
    if att:
        att.data.foreach_get('value', vals)
    return vals


def drop_faces(me, keep_flag):
    flags = cull_flags(me)
    bm = bmesh.new()
    bm.from_mesh(me)
    bm.faces.ensure_lookup_table()
    bmesh.ops.delete(bm, geom=[f for f in bm.faces if flags[f.index] != keep_flag], context='FACES')
    bm.to_mesh(me)
    bm.free()


# the hidden faces move to an occluder of their own: it still blocks light in the bake but gets no atlas space and
# isn't exported. (Unwrapping only the visible faces of a mesh, by selection, left most of it on its old UVs.)
occluders = []
for o in all_joined:
    if not any(cull_flags(o.data)):
        continue
    occ = o.copy()
    occ.data = o.data.copy()
    occ.name = o.name + '_occ'
    for c in o.users_collection:
        c.objects.link(occ)
    drop_faces(occ.data, 1)
    drop_faces(o.data, 0)
    for me in (o.data, occ.data):
        me.attributes.remove(me.attributes['cull'])
    occluders.append(occ)
for o in all_joined:
    if 'cull' in o.data.attributes:
        o.data.attributes.remove(o.data.attributes['cull'])
print('occluders', len(occluders), flush=True)

# ---------------------------------------------------------------- bake setup
prefs = bpy.context.preferences.addons['cycles'].preferences
prefs.compute_device_type = 'METAL'
prefs.get_devices()
for d in prefs.devices:
    d.use = True
sc.cycles.device = 'GPU'
sc.render.engine = 'CYCLES'
sc.cycles.samples = SAMPLES
sc.cycles.use_denoising = False
bk = sc.render.bake
bk.margin = 12
bk.margin_type = 'EXTEND'
bk.use_pass_direct = bk.use_pass_indirect = True
bk.use_pass_diffuse = bk.use_pass_emit = bk.use_pass_transmission = True
bk.use_pass_glossy = False
bk.use_clear = True


def unwrap(objs, margin):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=math.radians(60), island_margin=margin, area_weight=0.0, scale_to_bounds=False)
    bpy.ops.uv.select_all(action='SELECT')
    bpy.ops.uv.pack_islands(rotate=True, margin=margin)
    bpy.ops.object.mode_set(mode='OBJECT')


def target_image(name, size):
    return D.images.new('bake_' + name, size, size, alpha=False, float_buffer=True)


def point_materials(objs, img):
    for ma in {s.material for o in objs for s in o.material_slots if s.material}:
        nt = ma.node_tree
        n = nt.nodes.get('BAKE_TARGET') or nt.nodes.new('ShaderNodeTexImage')
        n.name = 'BAKE_TARGET'
        n.image = img
        uv = nt.nodes.get('BAKE_UV') or nt.nodes.new('ShaderNodeUVMap')
        uv.name = 'BAKE_UV'
        uv.uv_map = 'bake'
        if not n.inputs['Vector'].is_linked:
            nt.links.new(uv.outputs['UV'], n.inputs['Vector'])
        for x in nt.nodes:
            x.select = False
        n.select = True
        nt.nodes.active = n


baked = {}
t0 = time.time()
# glass is drawn live, so it must not shade what sits behind it (caustics are off: it would bake the tank floor black)
for o in glass:
    o.hide_render = True
for name, objs in groups.items():
    size = int((SIZES.get(name, PROJ_SIZE)) * SCALE)
    t = time.time()
    unwrap(objs, 0.004 if size >= 4096 else 0.006)
    img = target_image(name, size)
    point_materials(objs, img)
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    path = os.path.join(OUT, 'bake_%s.png' % name)
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_depth = '8'
    # the GPU bake now and then comes back flat (all black, or blown to white); check, and bake again on the CPU
    for dev in ('GPU', 'CPU'):
        sc.cycles.device = dev
        bpy.ops.object.bake(type='COMBINED')
        img.save_render(path, scene=sc)       # applies the AgX grade used for the renders
        im = D.images.load(path, check_existing=False)
        px = np.empty(len(im.pixels), np.float32)
        im.pixels.foreach_get(px)
        px = px.reshape(-1, 4)[::97, :3]
        sd, mean = float(px.std()), float(px.mean())
        if sd > 0.04 and 0.02 < mean < 0.95:
            break
        print('FLAT %s on %s (mean %.3f, sd %.3f), baking again' % (name, dev, mean, sd), flush=True)
        D.images.remove(im)
    sc.cycles.device = 'GPU'
    # the big atlases show the bake's grain at this size: denoise them (denoise.py). The project atlases keep theirs,
    # since they carry screens and printed text a denoiser would soften
    if name in DENOISE:
        subprocess.run([bpy.app.binary_path, '-b', '--factory-startup', '-P', os.path.join(HERE, 'denoise.py'), '--', path, path], check=True, capture_output=True)
        D.images.remove(im)
        im = D.images.load(path, check_existing=False)
    baked[name] = im
    print('BAKED %s %dpx %d objs in %.0fs' % (name, size, len(objs), time.time() - t), flush=True)
print('all bakes %.0fs' % (time.time() - t0))
for o in glass:
    o.hide_render = False

# ---------------------------------------------------------------- join + swap to baked materials


def baked_material(name, img):
    ma = D.materials.new('baked_' + name)
    ma.use_nodes = True
    b = ma.node_tree.nodes['Principled BSDF']
    tx = ma.node_tree.nodes.new('ShaderNodeTexImage')
    tx.image = img
    ma.node_tree.links.new(tx.outputs['Color'], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = 1.0
    return ma


# the bake leaves out glossy light (it depends on where you stand), so each corner carries how its original surface
# reflects: r strength, g metallic, b roughness. The page adds a live reflection of the room with it.
NO_GLOSS = ('led', 'bulb', 'sky', 'city')


def smooth(e0, e1, x):
    t = min(1.0, max(0.0, (x - e0) / (e1 - e0)))
    return t * t * (3 - 2 * t)


def gloss_of(ma):
    if ma is None or not ma.node_tree or ma.name.split('.')[0].startswith(NO_GLOSS):
        return (0.0, 0.0, 1.0, 1.0)
    b = next((n for n in ma.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
    if b is None:
        return (0.0, 0.0, 1.0, 1.0)
    v = lambda k, d=0.0: b.inputs[k].default_value if k in b.inputs else d
    r, m, c, cr = v('Roughness', 0.5), v('Metallic'), v('Coat Weight'), v('Coat Roughness', 0.1)
    spec = smooth(0.55, 0.06, r)
    coat = c * smooth(0.4, 0.05, cr)
    if v('Emission Strength') > 0.5:  # a lit screen: a faint sheen on its glass
        return (0.35, 0.0, 0.08, 1.0)
    return (max(spec * (0.5 + 0.5 * m), coat), m, min(r, cr) if c > 0.3 else r, 1.0)


def write_gloss(me):
    vals = [gloss_of(me.materials[p.material_index] if me.materials else None) for p in me.polygons]
    ca = me.color_attributes.new('gloss', 'FLOAT_COLOR', 'CORNER')
    flat = [0.0] * (len(me.loops) * 4)
    for p in me.polygons:
        g = vals[p.index]
        for li in p.loop_indices:
            flat[li * 4:li * 4 + 4] = g
    ca.data.foreach_set('color', flat)


export = []
for name, objs in groups.items():
    ma = baked_material(name, baked[name])
    for j in objs:
        me = j.data
        write_gloss(me)
        for l in [l for l in me.uv_layers if l.name != 'bake']:
            me.uv_layers.remove(l)
        me.materials.clear()
        me.materials.append(ma)
        export.append(j)

for o in occluders:
    D.objects.remove(o)

gm = {}
for o in glass:
    base = o.material_slots[0].material.name.split('.')[0]
    if base not in gm:
        g = D.materials.new('glass_' + base)
        g.use_nodes = True
        bsdf = g.node_tree.nodes['Principled BSDF']
        bsdf.inputs['Base Color'].default_value = {'water': (0.55, 0.85, 0.88, 1)}.get(base, (0.9, 0.95, 1, 1))
        bsdf.inputs['Alpha'].default_value = {'water': 0.45, 'pet': 0.35}.get(base, 0.12)
        bsdf.inputs['Roughness'].default_value = 0.05
        gm[base] = g
    o.data.materials.clear()
    o.data.materials.append(gm[base])
    for l in [l for l in o.data.uv_layers]:
        o.data.uv_layers.remove(l)
    export.append(o)

# ---------------------------------------------------------------- export
keep = set(export)
for o in export:
    p = o.parent
    while p:
        keep.add(p)
        p = p.parent
bpy.ops.object.select_all(action='DESELECT')
for o in keep:
    o.select_set(True)
glb = os.path.join(OUT, 'lab.glb')
bpy.ops.export_scene.gltf(filepath=glb, export_format='GLB', use_selection=True, export_apply=True,
                          export_animations=True, export_image_format='WEBP', export_image_quality=82,
                          export_draco_mesh_compression_enable=True, export_yup=True, export_lights=False,
                          export_cameras=False, export_extras=False, export_texcoords=True, export_normals=True,
                          export_vertex_color='NAME', export_vertex_color_name='gloss',
                          export_draco_normal_quantization=8, export_draco_color_quantization=8)
print('EXPORTED', glb, os.path.getsize(glb) // 1024, 'KB')


def three(v):
    return [round(v.x, 4), round(v.z, 4), round(-v.y, 4)]


meta = {'projects': {}, 'cameras': {}}
for o in D.objects:
    if o.name.startswith('proj_') and o.type == 'EMPTY':
        pid = o.name[5:]
        # bounds of everything under the project, in world space
        pts = []
        for c in o.children_recursive:
            if c.type == 'MESH':
                pts += [c.matrix_world @ Vector(b) for b in c.bound_box]
        lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
        hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
        fwd = o.matrix_world.to_3x3() @ Vector((0, -1, 0))
        meta['projects'][pid] = {'pos': three(o.matrix_world.translation), 'center': three((lo + hi) / 2), 'min': three(lo), 'max': three(hi),
                                 'facing': three(fwd)}
for o in D.objects:
    if o.type == 'CAMERA':
        look = o.matrix_world @ Vector((0, 0, -1))
        meta['cameras'][o.name] = {'pos': three(o.matrix_world.translation), 'look': three(look), 'fov': round(math.degrees(o.data.angle_y), 2)}
json.dump(meta, open(os.path.join(OUT, 'lab.json'), 'w'), indent=1)
print('META ok')

# keep the baked scene too, with its atlases packed in, so it opens anywhere
bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'lab_baked.blend'))
print('SAVED baked scene')
