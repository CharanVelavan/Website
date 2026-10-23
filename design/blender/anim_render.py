"""Render the animation range of lab.blend to a PNG sequence.

  Blender -b lab.blend -P anim_render.py -- <camera> <out_dir> [engine EEVEE|CYCLES] [samples] [percent] [start] [end]
"""
import sys, os
import bpy

a = sys.argv[sys.argv.index('--') + 1:]
cam, out = a[0], a[1]
engine = a[2] if len(a) > 2 else 'EEVEE'
samples = int(a[3]) if len(a) > 3 else 64
pct = int(a[4]) if len(a) > 4 else 50
sc = bpy.context.scene
if len(a) > 6:
    sc.frame_start, sc.frame_end = int(a[5]), int(a[6])
sc.camera = bpy.data.objects[cam]
sc.render.resolution_percentage = pct
sc.render.use_motion_blur = True
sc.render.motion_blur_shutter = 0.5
if engine == 'EEVEE':
    sc.render.engine = 'BLENDER_EEVEE'
    sc.eevee.taa_render_samples = samples
    try:
        sc.eevee.use_raytracing = True
        sc.eevee.use_shadows = True
    except Exception as e:
        print('eevee opt', e)
else:
    prefs = bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type = 'METAL'
    prefs.get_devices()
    for d in prefs.devices:
        d.use = True
    sc.cycles.device = 'GPU'
    sc.cycles.samples = samples
os.makedirs(out, exist_ok=True)
sc.render.filepath = os.path.join(out, 'f_')
sc.render.image_settings.file_format = 'PNG'
bpy.ops.render.render(animation=True)
print('DONE', out)
