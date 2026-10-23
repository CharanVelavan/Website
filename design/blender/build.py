"""Build the whole lab and save lab.blend.

  /Applications/Blender.app/Contents/MacOS/Blender -b -P build.py
"""
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy
from mathutils import Vector
import lib
from lib import D, rad, collection, light, aim, empty
import palette
from palette import M

# fresh scene
for ob in list(D.objects):
    D.objects.remove(ob)
for c in list(D.collections):
    D.collections.remove(c)
for blk in (D.meshes, D.materials, D.lights, D.cameras, D.curves, D.images):
    for x in list(blk):
        blk.remove(x)

palette.build()
import room
import projects

room.shell()
room.benches()
room.build_props()
room.pegboard(-1.0, 0.75, 1.35, 2.2)
sh = room.shelf(1.15, 3.4, 1.72)
room.books(sh, -1.05, 12)
room.figurine('figurine', (2.0, room.Y1 - 0.14, 1.72 + 0.0175), rad(-15))
room.coming_soon(2.48, 1.72 + 0.0175)
room.whiteboard(-1.45, 0.25, 1.3, 2.2)
room.frame('poster_ba', 'ba-vposter.webp', 0.8, 0.45, (-2.5, room.Y1 - 0.02, 1.85), 0)
room.frame('poster_ne', 'ne-poster.webp', 0.55, 0.55, (room.X1 - 0.02, 1.3, 1.75), rad(-90))
room.frame('poster_wb', 'wb-vposter.webp', 0.6, 0.385, (room.X0 + 0.02, -1.55, 1.7), rad(90))
room.rug(0.0, 0.3, 1.2)
room.beams()
room.tool_chest('tool_chest', (room.X0 + 0.45, -2.05, 0), rad(90))
roots = projects.build_all()

# ---------- lighting ----------
collection('lights')
wy0, wy1, wz0, wz1 = -0.2, 1.7, 1.2, 2.45
win = light('window_light', 'AREA', (room.X0 - 0.25, (wy0 + wy1) / 2, (wz0 + wz1) / 2), 550, (0.55, 0.68, 1.0), size=wy1 - wy0, size_y=wz1 - wz0)
win.visible_camera = False
win.visible_transmission = False
win.visible_glossy = False
aim(win, (0.0, (wy0 + wy1) / 2, 0.6))
fill = light('ceiling_fill', 'AREA', (0, 0, 4.6), 170, (1.0, 0.88, 0.74), size=6, size_y=4.5)
fill.visible_camera = False
key = light('key', 'AREA', (3.8, -3.8, 4.2), 150, (1.0, 0.82, 0.64), size=2.0)
key.visible_camera = False
aim(key, (-0.5, 1.0, 0.8))
rim = light('rim', 'AREA', (-2.8, 3.8, 4.0), 160, (0.6, 0.72, 1.0), size=2.0)
rim.visible_camera = False
aim(rim, (0.5, 0.0, 0.8))
for pid, tgt in (('ba', (room.X0 + 0.42, 0.95, 1.0)), ('wb', (room.X1 - 0.42, 0.85, 1.1))):
    s = light('accent_' + pid, 'SPOT', (tgt[0] * 0.55, tgt[1] - 0.8, 2.9), 90, (1.0, 0.85, 0.7), size=0.15, spot=28, blend=0.5)
    aim(s, tgt)

# ---------- world ----------
w = D.worlds.get('World') or D.worlds.new('World')
bpy.context.scene.world = w
try:
    w.use_nodes = True
except Exception:
    pass
bg = w.node_tree.nodes.get('Background')
bg.inputs['Color'].default_value = (0.010, 0.012, 0.018, 1)
bg.inputs['Strength'].default_value = 1.0

# ---------- cameras ----------
collection('cameras')


def camera(name, loc, look, lens=30, fstop=None, focus=None):
    cd = D.cameras.new(name)
    cd.lens = lens
    cd.sensor_width = 36
    if fstop:
        cd.dof.use_dof = True
        cd.dof.aperture_fstop = fstop
        cd.dof.focus_distance = focus or (Vector(look) - Vector(loc)).length
    ob = D.objects.new(name, cd)
    lib._link(ob)
    ob.location = loc
    aim(ob, look)
    return ob


cam = camera('cam_overview', (3.3, -5.9, 4.0), (-0.25, 0.7, 0.75), lens=26, fstop=8, focus=7.0)
camera('cam_hero', (1.7, -3.5, 1.85), (-0.5, 1.0, 1.0), lens=30, fstop=4, focus=4.2)
camera('cam_ba', (room.X0 + 1.3, 0.2, 1.3), (room.X0 + 0.42, 0.95, 1.06), lens=50, fstop=2.8)
camera('cam_ne', (0.25, -2.0, 1.25), (0.0, 0.3, 0.95), lens=40, fstop=2.8)
camera('cam_wb', (room.X1 - 1.4, 0.05, 1.45), (room.X1 - 0.42, 0.85, 1.15), lens=50, fstop=2.8)
camera('cam_back', (0.1, 0.2, 1.6), (-0.3, room.Y1 - 0.4, 1.1), lens=28, fstop=4)
camera('cam_ba_anim', (room.X0 + 1.95, -0.35, 1.5), (room.X0 + 0.42, 0.95, 1.22), lens=36, fstop=4)
bpy.context.scene.camera = cam

import anim
anim.apply()

# ---------- render settings ----------
sc = bpy.context.scene
sc.render.engine = 'CYCLES'
sc.cycles.samples = 128
sc.cycles.use_adaptive_sampling = True
sc.cycles.use_denoising = True
sc.cycles.max_bounces = 8
sc.cycles.transmission_bounces = 8
sc.cycles.caustics_reflective = False
sc.cycles.caustics_refractive = False
sc.render.resolution_x, sc.render.resolution_y = 1600, 900
try:
    sc.view_settings.view_transform = 'AgX'
    sc.view_settings.look = 'AgX - Medium High Contrast'
except Exception as e:
    print('view transform:', e)
sc.view_settings.exposure = 0.0

# ---------- compositor: soft bloom on lamps and screens ----------
ng = D.node_groups.new('Comp', 'CompositorNodeTree')
ng.interface.new_socket('Image', in_out='OUTPUT', socket_type='NodeSocketColor')
rl = ng.nodes.new('CompositorNodeRLayers')
gl = ng.nodes.new('CompositorNodeGlare')
gl.inputs['Type'].default_value = 'Bloom'
gl.inputs['Quality'].default_value = 'High'
gl.inputs['Threshold'].default_value = 1.2
gl.inputs['Strength'].default_value = 0.35
gl.inputs['Size'].default_value = 0.6
go = ng.nodes.new('NodeGroupOutput')
ng.links.new(rl.outputs['Image'], gl.inputs['Image'])
ng.links.new(gl.outputs['Image'], go.inputs[0])
sc.compositing_node_group = ng

out = os.path.join(lib.ROOT, 'lab.blend')
bpy.ops.file.pack_all()  # photos and fonts travel inside the file
bpy.ops.wm.save_as_mainfile(filepath=out)
print('SAVED', out, len(D.objects), 'objects')
