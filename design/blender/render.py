"""Render one camera of lab.blend.

  Blender -b lab.blend -P render.py -- <camera> <out.png> [samples] [percent]
"""
import sys
import bpy

argv = sys.argv[sys.argv.index('--') + 1:]
cam, out = argv[0], argv[1]
samples = int(argv[2]) if len(argv) > 2 else 128
pct = int(argv[3]) if len(argv) > 3 else 100

sc = bpy.context.scene
prefs = bpy.context.preferences.addons['cycles'].preferences
prefs.compute_device_type = 'METAL'
prefs.get_devices()
for d in prefs.devices:
    d.use = True
sc.cycles.device = 'GPU'
sc.camera = bpy.data.objects[cam]
sc.cycles.samples = samples
sc.render.resolution_percentage = pct
sc.render.filepath = out
sc.render.image_settings.file_format = 'PNG'
bpy.ops.render.render(write_still=True)
print('RENDERED', out)
