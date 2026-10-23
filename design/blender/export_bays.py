"""Export each project on its own, with live (unbaked) PBR materials, for the case-study bays.

  Blender -b lab.blend -P export_bays.py -- <out_dir>

Writes <out_dir>/<id>.glb for the nine projects, each with its root at the origin (local axes: -y faces the
visitor, so +z in three.js). The empties stay as named nodes, so the page can move a head, a lid or a drone.
Noise and wave textures don't survive glTF, so every procedural material is flattened to its plain colour,
roughness, metal and coat first; image materials (screens, stickers) keep their pictures.
"""
import bpy, os, sys
from mathutils import Matrix

D = bpy.data
a = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = os.path.abspath(a[0]) if a else os.path.join(os.path.dirname(bpy.data.filepath), 'out', 'bays')
os.makedirs(OUT, exist_ok=True)


def flatten(ma):
    if not ma or not ma.node_tree:
        return
    nt = ma.node_tree
    b = next((n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED'), None)
    if b is None or any(n.type == 'TEX_IMAGE' for n in nt.nodes):
        return
    for k in ('Base Color', 'Roughness', 'Normal'):
        for l in list(b.inputs[k].links):
            src = l.from_node
            # a colour ramp (wood grain, colour variation): use the middle of its two colours
            if k == 'Base Color' and src.type == 'VALTORGB':
                e = src.color_ramp.elements
                b.inputs[k].default_value = tuple((e[0].color[i] + e[-1].color[i]) / 2 for i in range(3)) + (1,)
            elif k == 'Roughness' and src.type == 'MAP_RANGE':
                b.inputs[k].default_value = (src.inputs['To Min'].default_value + src.inputs['To Max'].default_value) / 2
            nt.links.remove(l)


for ma in D.materials:
    flatten(ma)

sc = bpy.context.scene
roots = [o for o in D.objects if o.name.startswith('proj_') and o.type == 'EMPTY']
for r in roots:
    pid = r.name[5:]
    keep = r.matrix_world.copy()
    r.matrix_world = Matrix.Identity(4)
    bpy.context.view_layer.update()
    bpy.ops.object.select_all(action='DESELECT')
    for o in [r] + list(r.children_recursive):
        if o.type != 'LIGHT' and not o.hide_render:
            o.select_set(True)
    path = os.path.join(OUT, pid + '.glb')
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True, export_apply=True,
                              export_image_format='WEBP', export_image_quality=82, export_draco_mesh_compression_enable=True,
                              export_yup=True, export_lights=False, export_cameras=False, export_extras=False,
                              export_animations=False, export_texcoords=True, export_normals=True)
    r.matrix_world = keep
    print('BAY', pid, os.path.getsize(path) // 1024, 'KB', flush=True)
