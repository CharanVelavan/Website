"""Shared helpers for building the lab in Blender (bpy + bmesh, no operators)."""
import bpy, bmesh, math, os, random
from mathutils import Vector, Matrix

D = bpy.data
ROOT = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.normpath(os.path.join(ROOT, '..', 'prototype', 'img'))
FONT_DIR = '/System/Library/Fonts/Supplemental'
rng = random.Random(7)
_coll = [None]
TAU = math.tau
rad = math.radians


# ---------- collections / objects ----------

def collection(name, parent=None):
    c = D.collections.get(name) or D.collections.new(name)
    p = parent or bpy.context.scene.collection
    if c.name not in p.children:
        p.children.link(c)
    _coll[0] = c
    return c


def _link(ob):
    (_coll[0] or bpy.context.scene.collection).objects.link(ob)


def empty(name, loc=(0, 0, 0), rot=(0, 0, 0), parent=None, size=0.2):
    ob = D.objects.new(name, None)
    _link(ob)
    ob.location, ob.rotation_euler, ob.empty_display_size = loc, rot, size
    if parent:
        ob.parent = parent
    return ob


def _mats(me, mats):
    for m in (mats if isinstance(mats, (list, tuple)) else [mats]):
        if m:
            me.materials.append(m)


def bevel(ob, w=0.004, seg=3, angle=35):
    if w <= 0:
        return ob
    md = ob.modifiers.new('Bevel', 'BEVEL')
    md.width, md.segments = w, seg
    md.limit_method = 'ANGLE'
    md.angle_limit = rad(angle)
    md.harden_normals = True
    return ob


def obj(name, bm, mats=None, loc=(0, 0, 0), rot=(0, 0, 0), parent=None, bev=0.004, seg=3, smooth=True, scale=(1, 1, 1)):
    me = D.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    _mats(me, mats)
    if smooth or bev > 0:
        me.shade_smooth()
    ob = D.objects.new(name, me)
    _link(ob)
    ob.location, ob.rotation_euler, ob.scale = loc, rot, scale
    if parent:
        ob.parent = parent
    bevel(ob, bev, seg)
    return ob


def inst(src, name, loc=(0, 0, 0), rot=(0, 0, 0), parent=None, scale=None):
    """Linked duplicate (shares mesh data and modifiers are copied)."""
    ob = src.copy()
    ob.name = name
    _link(ob)
    ob.location, ob.rotation_euler = loc, rot
    if scale:
        ob.scale = scale
    ob.parent = parent
    return ob


# ---------- mesh builders ----------

def box(name, size, loc=(0, 0, 0), mat=None, bev=0.004, rot=(0, 0, 0), parent=None, seg=3):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=size, verts=bm.verts)
    return obj(name, bm, mat, loc, rot, parent, bev, seg)


def cyl(name, r, h, loc=(0, 0, 0), mat=None, segs=32, r2=None, bev=0.002, rot=(0, 0, 0), parent=None, seg=2):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segs, radius1=r,
                          radius2=r if r2 is None else r2, depth=h)
    return obj(name, bm, mat, loc, rot, parent, bev, seg)


def sphere(name, r, loc=(0, 0, 0), mat=None, segs=32, rings=16, scale=(1, 1, 1), rot=(0, 0, 0), parent=None):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=segs, v_segments=rings, radius=r)
    return obj(name, bm, mat, loc, rot, parent, 0, smooth=True, scale=scale)


def lathe(name, prof, loc=(0, 0, 0), mat=None, segs=32, rot=(0, 0, 0), parent=None, bev=0.0, angle=TAU, start=0.0, smooth=True, seg=2):
    """Revolve a (r, z) profile around Z."""
    bm = bmesh.new()
    vs = [bm.verts.new((r * math.cos(start), r * math.sin(start), z)) for r, z in prof]
    es = [bm.edges.new((vs[i], vs[i + 1])) for i in range(len(vs) - 1)]
    bmesh.ops.spin(bm, geom=vs + es, cent=(0, 0, 0), axis=(0, 0, 1), angle=angle, steps=segs)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return obj(name, bm, mat, loc, rot, parent, bev, seg, smooth)


def prism(name, pts, depth, loc=(0, 0, 0), mat=None, plane='XY', bev=0.004, rot=(0, 0, 0), parent=None, seg=3):
    """Extrude a 2D polygon. plane XY extrudes along Z, XZ along Y, YZ along X; centred on depth."""
    bm = bmesh.new()
    vs = [bm.verts.new((x, y, -depth / 2)) for x, y in pts]
    f = bm.faces.new(vs)
    res = bmesh.ops.extrude_face_region(bm, geom=[f])
    nv = [e for e in res['geom'] if isinstance(e, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, vec=(0, 0, depth), verts=nv)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    if plane == 'XZ':
        bmesh.ops.rotate(bm, cent=(0, 0, 0), matrix=Matrix.Rotation(rad(90), 3, 'X'), verts=bm.verts)
    elif plane == 'YZ':
        bmesh.ops.rotate(bm, cent=(0, 0, 0), matrix=Matrix.Rotation(rad(90), 3, 'X'), verts=bm.verts)
        bmesh.ops.rotate(bm, cent=(0, 0, 0), matrix=Matrix.Rotation(rad(90), 3, 'Z'), verts=bm.verts)
    return obj(name, bm, mat, loc, rot, parent, bev, seg)


def plane(name, w, h, loc=(0, 0, 0), mat=None, rot=(0, 0, 0), parent=None):
    """Plane in XY facing +Z with 0..1 UVs. rot=(90deg,0,0) makes it face -Y with image upright."""
    bm = bmesh.new()
    vs = [bm.verts.new(p) for p in ((-w / 2, -h / 2, 0), (w / 2, -h / 2, 0), (w / 2, h / 2, 0), (-w / 2, h / 2, 0))]
    f = bm.faces.new(vs)
    uv = bm.loops.layers.uv.new()
    for loop, c in zip(f.loops, ((0, 0), (1, 0), (1, 1), (0, 1))):
        loop[uv].uv = c
    return obj(name, bm, mat, loc, rot, parent, 0, smooth=False)


def disk(name, r, loc=(0, 0, 0), mat=None, segs=32, rot=(0, 0, 0), parent=None, scale=(1, 1, 1)):
    bm = bmesh.new()
    bmesh.ops.create_circle(bm, cap_ends=True, segments=segs, radius=r)
    return obj(name, bm, mat, loc, rot, parent, 0, smooth=False, scale=scale)


def torus(name, R, r, loc=(0, 0, 0), mat=None, segs=48, rsegs=12, rot=(0, 0, 0), parent=None, angle=TAU, start=0.0):
    prof = [(R + r * math.cos(a), r * math.sin(a)) for a in [i / rsegs * TAU for i in range(rsegs + 1)]]
    return lathe(name, prof, loc, mat, segs, rot, parent, angle=angle, start=start)


def cable(name, pts, r=0.004, mat=None, parent=None, res=10, loc=(0, 0, 0)):
    cu = D.curves.new(name, 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth, cu.bevel_resolution, cu.resolution_u = r, 3, res
    cu.use_fill_caps = True
    sp = cu.splines.new('BEZIER')
    sp.bezier_points.add(len(pts) - 1)
    for bp, p in zip(sp.bezier_points, pts):
        bp.co = p
        bp.handle_left_type = bp.handle_right_type = 'AUTO'
    ob = D.objects.new(name, cu)
    _link(ob)
    ob.location = loc
    if mat:
        cu.materials.append(mat)
    if parent:
        ob.parent = parent
    return ob


_fonts = {}


def font(fname):
    if fname not in _fonts:
        _fonts[fname] = D.fonts.load(os.path.join(FONT_DIR, fname), check_existing=True)
    return _fonts[fname]


def text(name, body, size, loc=(0, 0, 0), rot=(0, 0, 0), mat=None, extrude=0.0, fname='Arial Bold.ttf', align='CENTER', parent=None, spacing=1.0):
    cu = D.curves.new(name, 'FONT')
    cu.body, cu.size, cu.extrude = body, size, extrude
    cu.align_x, cu.align_y = align, 'CENTER'
    cu.space_character = spacing
    cu.font = font(fname)
    ob = D.objects.new(name, cu)
    _link(ob)
    ob.location, ob.rotation_euler = loc, rot
    if mat:
        cu.materials.append(mat)
    if parent:
        ob.parent = parent
    return ob


# ---------- materials ----------

def _principled(ma):
    try:
        ma.use_nodes = True
    except Exception:
        pass
    return ma.node_tree.nodes.get('Principled BSDF')


def _set(b, key, val):
    if key in b.inputs:
        b.inputs[key].default_value = val


def mat(name, col, r=0.5, m=0.0, emis=None, es=0.0, coat=0.0, coat_r=0.08, trans=0.0, ior=1.45,
        var=0.0, cvar=0.0, bump=0.0, nscale=30.0, sheen=0.0, alpha=1.0, sss=0.0):
    if name in D.materials:
        return D.materials[name]
    ma = D.materials.new(name)
    b = _principled(ma)
    nt = ma.node_tree
    col4 = tuple(col) + (1.0,)
    _set(b, 'Base Color', col4)
    _set(b, 'Roughness', r)
    _set(b, 'Metallic', m)
    _set(b, 'IOR', ior)
    _set(b, 'Coat Weight', coat)
    _set(b, 'Coat Roughness', coat_r)
    _set(b, 'Transmission Weight', trans)
    _set(b, 'Sheen Weight', sheen)
    _set(b, 'Alpha', alpha)
    _set(b, 'Subsurface Weight', sss)
    if emis:
        _set(b, 'Emission Color', tuple(emis) + (1.0,))
        _set(b, 'Emission Strength', es)
    if var or cvar or bump:
        tc = nt.nodes.new('ShaderNodeTexCoord')
        nz = nt.nodes.new('ShaderNodeTexNoise')
        nz.inputs['Scale'].default_value = nscale
        nz.inputs['Detail'].default_value = 6.0
        nt.links.new(tc.outputs['Object'], nz.inputs['Vector'])
        if var:
            mr = nt.nodes.new('ShaderNodeMapRange')
            mr.inputs['To Min'].default_value = max(0.0, r - var)
            mr.inputs['To Max'].default_value = min(1.0, r + var)
            nt.links.new(nz.outputs['Fac'], mr.inputs['Value'])
            nt.links.new(mr.outputs['Result'], b.inputs['Roughness'])
        if cvar:
            cr = nt.nodes.new('ShaderNodeValToRGB')
            e0, e1 = cr.color_ramp.elements
            e0.position, e1.position = 0.3, 0.7
            e0.color = tuple(c * (1 - cvar) for c in col) + (1,)
            e1.color = tuple(min(1, c * (1 + cvar * 0.5)) for c in col) + (1,)
            nt.links.new(nz.outputs['Fac'], cr.inputs['Fac'])
            nt.links.new(cr.outputs['Color'], b.inputs['Base Color'])
        if bump:
            bp = nt.nodes.new('ShaderNodeBump')
            bp.inputs['Strength'].default_value = bump
            bp.inputs['Distance'].default_value = 0.002
            nt.links.new(nz.outputs['Fac'], bp.inputs['Height'])
            nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])
    ma.diffuse_color = col4
    return ma


def wood(name, c1, c2, scale=2.5, r=0.4, coat=0.3, axis='Y'):
    if name in D.materials:
        return D.materials[name]
    ma = D.materials.new(name)
    b = _principled(ma)
    nt = ma.node_tree
    tc = nt.nodes.new('ShaderNodeTexCoord')
    mp = nt.nodes.new('ShaderNodeMapping')
    mp.inputs['Scale'].default_value = (1.0, 1.0, 1.0)
    wv = nt.nodes.new('ShaderNodeTexWave')
    wv.wave_type = 'BANDS'
    wv.bands_direction = axis
    wv.inputs['Scale'].default_value = scale
    wv.inputs['Distortion'].default_value = 9.0
    wv.inputs['Detail'].default_value = 4.0
    wv.inputs['Detail Scale'].default_value = 1.5
    cr = nt.nodes.new('ShaderNodeValToRGB')
    e0, e1 = cr.color_ramp.elements
    e0.color, e1.color = tuple(c1) + (1,), tuple(c2) + (1,)
    nt.links.new(tc.outputs['Object'], mp.inputs['Vector'])
    nt.links.new(mp.outputs['Vector'], wv.inputs['Vector'])
    nt.links.new(wv.outputs['Fac'], cr.inputs['Fac'])
    nt.links.new(cr.outputs['Color'], b.inputs['Base Color'])
    bp = nt.nodes.new('ShaderNodeBump')
    bp.inputs['Strength'].default_value = 0.08
    nt.links.new(wv.outputs['Fac'], bp.inputs['Height'])
    nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])
    _set(b, 'Roughness', r)
    _set(b, 'Coat Weight', coat)
    _set(b, 'Coat Roughness', 0.15)
    ma.diffuse_color = tuple(c1) + (1,)
    return ma


def img_mat(name, fname, crop=None, emit=0.0, r=0.35, dark=(0.01, 0.01, 0.012)):
    """Image material; crop=(x0, y0, x1, y1) as fractions with y from the top. emit>0 makes a glowing screen."""
    if name in D.materials:
        return D.materials[name]
    ma = D.materials.new(name)
    b = _principled(ma)
    nt = ma.node_tree
    img = D.images.load(os.path.join(IMG, fname), check_existing=True)
    tx = nt.nodes.new('ShaderNodeTexImage')
    tx.image = img
    tx.interpolation = 'Cubic'
    tx.extension = 'EXTEND'
    if crop:
        x0, y0, x1, y1 = crop
        tc = nt.nodes.new('ShaderNodeTexCoord')
        mp = nt.nodes.new('ShaderNodeMapping')
        mp.inputs['Scale'].default_value = (x1 - x0, y1 - y0, 1)
        mp.inputs['Location'].default_value = (x0, 1 - y1, 0)
        nt.links.new(tc.outputs['UV'], mp.inputs['Vector'])
        nt.links.new(mp.outputs['Vector'], tx.inputs['Vector'])
    if emit:
        _set(b, 'Base Color', tuple(dark) + (1,))
        nt.links.new(tx.outputs['Color'], b.inputs['Emission Color'])
        _set(b, 'Emission Strength', emit)
        _set(b, 'Roughness', 0.12)
        _set(b, 'Coat Weight', 0.6)
    else:
        nt.links.new(tx.outputs['Color'], b.inputs['Base Color'])
        _set(b, 'Roughness', r)
    ma.diffuse_color = (0.5, 0.5, 0.5, 1)
    return ma


def light(name, kind, loc, energy, color=(1, 1, 1), size=0.5, size_y=None, rot=(0, 0, 0), spot=None, blend=0.3, parent=None, radius=None):
    ld = D.lights.new(name, kind)
    ld.energy, ld.color = energy, color
    if kind == 'AREA':
        ld.shape = 'RECTANGLE' if size_y else 'SQUARE'
        ld.size = size
        if size_y:
            ld.size_y = size_y
    elif kind in ('POINT', 'SPOT'):
        ld.shadow_soft_size = radius if radius is not None else size
        if kind == 'SPOT':
            ld.spot_size = rad(spot or 60)
            ld.spot_blend = blend
    ob = D.objects.new(name, ld)
    _link(ob)
    ob.location, ob.rotation_euler = loc, rot
    if parent:
        ob.parent = parent
    return ob


def aim(ob, target):
    """Point an object's -Z (lights, cameras) at target."""
    d = Vector(target) - ob.matrix_world.translation if ob.parent else Vector(target) - Vector(ob.location)
    ob.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
