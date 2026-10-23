"""Denoise a baked atlas with Open Image Denoise (Blender's compositor), keeping its colours.

  Blender -b --factory-startup -P denoise.py -- <in.png> <out.png>

A 256-sample bake leaves a fine grain that shows on the big atlases (room, furniture) at 6-8K and turns blotchy under
the phone set's ETC1S compression. The atlas is already graded, so it goes through the compositor untouched
(Standard view) apart from the denoise.
"""
import bpy, sys

src, dst = sys.argv[sys.argv.index('--') + 1:][:2]
sc = bpy.context.scene
img = bpy.data.images.load(src)
ng = bpy.data.node_groups.new('denoise', 'CompositorNodeTree')
ng.interface.new_socket('Image', in_out='OUTPUT', socket_type='NodeSocketColor')
n_img = ng.nodes.new('CompositorNodeImage')
n_img.image = img
n_dn = ng.nodes.new('CompositorNodeDenoise')
out = ng.nodes.new('NodeGroupOutput')
ng.links.new(n_img.outputs['Image'], n_dn.inputs['Image'])
ng.links.new(n_dn.outputs['Image'], out.inputs[0])
sc.compositing_node_group = ng
sc.render.resolution_x, sc.render.resolution_y = img.size
sc.render.resolution_percentage = 100
sc.render.image_settings.file_format = 'PNG'
sc.render.image_settings.color_depth = '8'
sc.view_settings.view_transform = 'Standard'
sc.view_settings.look = 'None'
sc.render.filepath = dst
bpy.ops.render.render(write_still=True)
print('DENOISED', dst, img.size[0])
