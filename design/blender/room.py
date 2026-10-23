"""The room shell, U-shaped workbench, wall dressing and generic props.

World axes: x right, y into the room (back wall at y=3.2), z up, floor at z=0.
Bench tops are at z=BENCH. Benches: back (full width), left and right (open towards the camera).
"""
import math
from lib import (D, rng, rad, TAU, collection, empty, box, cyl, sphere, lathe, prism, plane, disk, torus,
                 cable, text, mat, img_mat, light, aim)
from palette import M

BENCH = 0.9
X0, X1, Y0, Y1, H = -3.5, 3.5, -2.6, 2.6, 2.8
T = 0.15  # wall thickness


# ---------- shell ----------

def shell():
    collection('room')
    box('slab', (X1 - X0 + 0.5, Y1 - Y0 + 0.4, 0.3), (0, (Y0 + Y1) / 2 + 0.05, -0.155), M.slab, bev=0.02)
    box('floor', (X1 - X0, Y1 - Y0, 0.02), (0, (Y0 + Y1) / 2, -0.01), M.floor, bev=0.0)
    # back wall (accent)
    box('wall_back', (X1 - X0 + 2 * T, T, H), (0, Y1 + T / 2, H / 2), M.wall_accent, bev=0.01)
    # right wall
    box('wall_right', (T, Y1 - Y0 + T, H), (X1 + T / 2, (Y0 + Y1 + T) / 2, H / 2), M.wall, bev=0.01)
    # left wall with a window
    wy0, wy1, wz0, wz1 = -0.2, 1.7, 1.2, 2.45
    lx = X0 - T / 2
    box('wall_left_a', (T, wy0 - Y0, H), (lx, (Y0 + wy0) / 2, H / 2), M.wall, bev=0.01)
    box('wall_left_b', (T, Y1 + T - wy1, H), (lx, (wy1 + Y1 + T) / 2, H / 2), M.wall, bev=0.01)
    box('wall_left_c', (T, wy1 - wy0, wz0), (lx, (wy0 + wy1) / 2, wz0 / 2), M.wall, bev=0.0)
    box('wall_left_d', (T, wy1 - wy0, H - wz1), (lx, (wy0 + wy1) / 2, (wz1 + H) / 2), M.wall, bev=0.0)
    # window frame, mullions and sill
    fr = M.matte_black
    for z in (wz0, wz1):
        box('win_h', (0.08, wy1 - wy0, 0.05), (X0 - 0.04, (wy0 + wy1) / 2, z), fr, bev=0.004)
    for y in (wy0, (wy0 + wy1) / 2, wy1):
        box('win_v', (0.08, 0.05, wz1 - wz0), (X0 - 0.04, y, (wz0 + wz1) / 2), fr, bev=0.004)
    box('win_mid', (0.06, wy1 - wy0, 0.035), (X0 - 0.05, (wy0 + wy1) / 2, wz0 + 0.95), fr, bev=0.003)
    box('win_sill', (0.22, wy1 - wy0 + 0.2, 0.04), (X0 + 0.03, (wy0 + wy1) / 2, wz0 - 0.02), M.wall_cap, bev=0.006)
    # skirting
    box('skirt_back', (X1 - X0, 0.02, 0.1), (0, Y1 - 0.01, 0.05), M.skirting, bev=0.002)
    box('skirt_left', (0.02, Y1 - Y0, 0.1), (X0 + 0.01, (Y0 + Y1) / 2, 0.05), M.skirting, bev=0.002)
    box('skirt_right', (0.02, Y1 - Y0, 0.1), (X1 - 0.01, (Y0 + Y1) / 2, 0.05), M.skirting, bev=0.002)
    outside(wy0, wy1, wz0, wz1)
    return dict(window=(wy0, wy1, wz0, wz1))


def outside(wy0, wy1, wz0, wz1):
    collection('outside')
    sky = D.materials.get('dusk')
    if not sky:
        sky = D.materials.new('dusk')
        try:
            sky.use_nodes = True
        except Exception:
            pass
        nt = sky.node_tree
        nt.nodes.remove(nt.nodes['Principled BSDF'])
        tc = nt.nodes.new('ShaderNodeTexCoord')
        sep = nt.nodes.new('ShaderNodeSeparateXYZ')
        cr = nt.nodes.new('ShaderNodeValToRGB')
        em = nt.nodes.new('ShaderNodeEmission')
        em.inputs['Strength'].default_value = 2.2
        el = cr.color_ramp.elements
        el[0].position, el[0].color = 0.0, (1.0, 0.45, 0.18, 1)
        el[1].position, el[1].color = 0.75, (0.05, 0.10, 0.32, 1)
        e = el.new(0.28)
        e.color = (0.85, 0.42, 0.42, 1)
        e = el.new(0.5)
        e.color = (0.22, 0.24, 0.55, 1)
        nt.links.new(tc.outputs['Generated'], sep.inputs['Vector'])
        nt.links.new(sep.outputs['Z'], cr.inputs['Fac'])
        nt.links.new(cr.outputs['Color'], em.inputs['Color'])
        nt.links.new(em.outputs['Emission'], nt.nodes['Material Output'].inputs['Surface'])
    # a small theatre backdrop right behind the window: hidden from above by the wall
    bx = X0 - T - 0.55
    box('sky', (0.02, wy1 - wy0 + 1.2, wz1 - wz0 + 0.3), (bx, (wy0 + wy1) / 2, (wz0 + wz1) / 2), sky, bev=0)
    for i in range(22):
        y = wy0 - 0.5 + i * (wy1 - wy0 + 1.0) / 21 + rng.uniform(-0.03, 0.03)
        h = rng.uniform(0.05, 0.42)
        w = rng.uniform(0.07, 0.16)
        x = bx + 0.03 + rng.uniform(0.0, 0.2)
        box('bldg', (0.02, w, h + 0.4), (x, y, wz0 - 0.4 + (h + 0.4) / 2), M.city, bev=0)
        for k in range(rng.randint(0, 3)):
            box('bwin', (0.004, 0.012, 0.01), (x + 0.012, y + rng.uniform(-w / 3, w / 3), wz0 + rng.uniform(0.02, max(0.03, h - 0.03))), M.city_win, bev=0)


# ---------- benches ----------

def bench(name, cx, cy, length, depth=0.8, rotz=0.0, drawers=(), legs_every=1.5):
    root = empty(name, (cx, cy, 0), (0, 0, rotz))
    L, d = length, depth
    box(name + '_top', (L, d, 0.05), (0, 0, BENCH - 0.025), M.oak, bev=0.014, seg=4, parent=root)
    box(name + '_apron', (L - 0.1, 0.03, 0.08), (0, -d / 2 + 0.06, BENCH - 0.09), M.steel, parent=root)
    n = max(2, int(L / legs_every) + 1)
    for i in range(n):
        x = -L / 2 + 0.06 + i * (L - 0.12) / (n - 1)
        for y in (-d / 2 + 0.06, d / 2 - 0.06):
            box(name + '_leg', (0.05, 0.05, BENCH - 0.05), (x, y, (BENCH - 0.05) / 2), M.steel, bev=0.004, parent=root)
        box(name + '_foot', (0.07, d - 0.06, 0.03), (x, 0, 0.015), M.steel, parent=root)
    box(name + '_shelf', (L - 0.1, d - 0.12, 0.025), (0, 0, 0.17), M.walnut, bev=0.004, parent=root)
    for x0 in drawers:
        box(name + '_drawers', (0.5, d - 0.1, 0.6), (x0, 0, BENCH - 0.05 - 0.3), M.dark_grey, bev=0.006, parent=root)
        for k in range(3):
            z = BENCH - 0.12 - k * 0.2
            box(name + '_dfront', (0.46, 0.015, 0.18), (x0, -d / 2 + 0.045, z - 0.03), M.grey, bev=0.004, parent=root)
            box(name + '_handle', (0.16, 0.02, 0.015), (x0, -d / 2 + 0.03, z), M.alu, bev=0.004, parent=root)
    return root


def bins(root, xs, d):
    cols = [M.orange, mat('bin_blue', (0.08, 0.25, 0.55), r=0.4), mat('bin_grey', (0.5, 0.5, 0.48), r=0.5), M.yellow]
    for i, x in enumerate(xs):
        c = cols[i % len(cols)]
        box('bin', (0.36, d - 0.25, 0.2), (x, 0.0, 0.29), c, bev=0.012, parent=root)
        box('bin_label', (0.12, 0.005, 0.05), (x, -(d - 0.25) / 2 - 0.002, 0.33), M.paper, bev=0, parent=root)


def benches():
    collection('benches')
    back = bench('bench_back', 0, Y1 - 0.4, X1 - X0, rotz=0, drawers=(-2.8, 2.8))
    bins(back, (-2.4, -1.3, -0.3, 0.9, 1.9), 0.8)
    left = bench('bench_left', X0 + 0.4, 0.4, 3.6, rotz=rad(90), drawers=(-1.4,))
    bins(left, (-0.5, 0.4, 1.3), 0.8)
    right = bench('bench_right', X1 - 0.4, 0.4, 3.6, rotz=rad(-90), drawers=(1.4,))
    bins(right, (-1.3, -0.4, 0.5), 0.8)
    # power rail along the back
    box('power_rail', (5.0, 0.06, 0.05), (0, Y1 - 0.05, BENCH + 0.03), M.grey, bev=0.006)
    for i in range(12):
        box('socket_led', (0.012, 0.004, 0.006), (-2.3 + i * 0.42, Y1 - 0.082, BENCH + 0.04), M.led_red if i % 3 else M.led_green, bev=0)


# ---------- wall dressing ----------

def frame(name, fname, w, h, loc, rotz, border=0.04):
    root = empty(name, loc, (0, 0, rotz))
    box(name + '_frame', (w + 2 * border + 0.04, 0.03, h + 2 * border + 0.04), (0, 0.0, 0), M.walnut, bev=0.006, parent=root)
    box(name + '_mat', (w + 2 * border, 0.032, h + 2 * border), (0, -0.002, 0), M.paper, bev=0, parent=root)
    plane(name + '_img', w, h, (0, -0.02, 0), img_mat('img_' + fname, fname, r=0.45), rot=(rad(90), 0, 0), parent=root)
    return root


def peg_mat():
    ma = D.materials.get('pegboard_holes')
    if ma:
        return ma
    ma = M.pegboard.copy()
    ma.name = 'pegboard_holes'
    nt = ma.node_tree
    b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord')
    sp = nt.nodes.new('ShaderNodeSeparateXYZ')
    cb = nt.nodes.new('ShaderNodeCombineXYZ')
    vo = nt.nodes.new('ShaderNodeTexVoronoi')
    vo.voronoi_dimensions = '2D'
    vo.inputs['Scale'].default_value = 20.0
    vo.inputs['Randomness'].default_value = 0.0
    lt = nt.nodes.new('ShaderNodeMath')
    lt.operation = 'LESS_THAN'
    lt.inputs[1].default_value = 0.16
    mx = nt.nodes.new('ShaderNodeMix')
    mx.data_type = 'RGBA'
    nt.links.new(tc.outputs['Object'], sp.inputs['Vector'])
    nt.links.new(sp.outputs['X'], cb.inputs['X'])
    nt.links.new(sp.outputs['Z'], cb.inputs['Y'])
    nt.links.new(cb.outputs['Vector'], vo.inputs['Vector'])
    nt.links.new(vo.outputs['Distance'], lt.inputs[0])
    nt.links.new(lt.outputs['Value'], mx.inputs['Factor'])
    mx.inputs[6].default_value = (0.62, 0.45, 0.28, 1)
    mx.inputs[7].default_value = (0.03, 0.02, 0.015, 1)
    nt.links.new(mx.outputs[2], b.inputs['Base Color'])
    return ma


def pegboard(x0, x1, z0, z1):
    collection('pegboard')
    y = Y1 - 0.02
    w, h = x1 - x0, z1 - z0
    root = empty('pegboard', ((x0 + x1) / 2, y, (z0 + z1) / 2))
    box('peg_board', (w, 0.02, h), (0, 0, 0), peg_mat(), bev=0.004, parent=root)
    # tools
    handles = [M.orange, M.red, M.yellow, mat('handle_blue', (0.1, 0.3, 0.8), r=0.4), M.black]
    for i in range(6):
        x = -w / 2 + 0.2 + i * 0.12
        cyl('sd_handle', 0.014, 0.09, (x, -0.04, h / 2 - 0.25), handles[i % 5], segs=12, parent=root)
        cyl('sd_shaft', 0.003, 0.12, (x, -0.04, h / 2 - 0.355), M.chrome, segs=8, parent=root)
    for i in range(3):
        x = 0.1 + i * 0.22
        pl = empty('pliers', (x, -0.03, 0.05), (rad(90), 0, 0), parent=root)
        for s in (-1, 1):
            prism('plier_grip', [(0, 0), (s * 0.03, -0.18), (s * 0.045, -0.18), (s * 0.012, 0)], 0.012, (0, 0, 0), handles[i], parent=pl)
        prism('plier_jaw', [(-0.012, 0), (0.012, 0), (0.004, 0.07), (-0.004, 0.07)], 0.01, (0, 0, 0), M.steel, parent=pl)
    for i, c in enumerate((M.cable_red, M.cable_blue, M.cable_yellow)):
        x = -w / 2 + 0.3 + i * 0.2
        lathe('spool', [(0.012, -0.03), (0.06, -0.03), (0.06, -0.026), (0.045, -0.026), (0.045, 0.026), (0.06, 0.026), (0.06, 0.03), (0.012, 0.03)],
              (x, -0.05, -h / 2 + 0.2), mat('spool_' + str(i), (0.12, 0.12, 0.13), r=0.4), segs=24, rot=(0, rad(90), 0), parent=root)
        cyl('spool_wire', 0.046, 0.05, (x, -0.05, -h / 2 + 0.2), c, segs=24, rot=(0, rad(90), 0), parent=root)
    # tape measure, multimeter
    box('multimeter', (0.09, 0.04, 0.17), (w / 2 - 0.2, -0.03, 0.0), M.yellow, bev=0.012, parent=root)
    box('mm_face', (0.07, 0.005, 0.05), (w / 2 - 0.2, -0.052, 0.04), M.screen_off, bev=0, parent=root)
    cyl('mm_knob', 0.022, 0.012, (w / 2 - 0.2, -0.055, -0.03), M.black, rot=(rad(90), 0, 0), parent=root)
    return root


def shelf(x0, x1, z, depth=0.28):
    collection('shelf')
    root = empty('shelf', ((x0 + x1) / 2, Y1 - depth / 2, z))
    L = x1 - x0
    box('shelf_board', (L, depth, 0.035), (0, 0, 0), M.walnut, bev=0.005, parent=root)
    for x in (-L / 2 + 0.25, L / 2 - 0.25):
        prism('shelf_bracket', [(0, 0), (0.0, -0.2), (0.025, -0.2), (0.22, -0.02), (0.22, 0.0)], 0.025, (x, depth / 2 - 0.005, -0.018), M.steel,
              plane='YZ', rot=(0, 0, rad(180)), parent=root)
    # warm LED strip underneath
    box('shelf_led', (L - 0.1, 0.012, 0.006), (0, -depth / 2 + 0.03, -0.02), M.led_warm, bev=0, parent=root)
    light('shelf_light', 'AREA', ((x0 + x1) / 2, Y1 - depth + 0.05, z - 0.04), 30, (1.0, 0.72, 0.45), size=L - 0.2, size_y=0.05)
    return root


def books(root, x0, n, z=0.0175, depth=0.2, lean_last=True):
    cols = [(0.55, 0.12, 0.08), (0.08, 0.2, 0.32), (0.85, 0.75, 0.55), (0.12, 0.3, 0.2), (0.75, 0.45, 0.1), (0.15, 0.15, 0.17), (0.9, 0.88, 0.82)]
    x = x0
    for i in range(n):
        t = rng.uniform(0.025, 0.05)
        h = rng.uniform(0.18, 0.27)
        d = rng.uniform(0.15, depth)
        c = mat('book_%d' % (i % len(cols)), cols[i % len(cols)], r=0.6)
        box('book', (t, d, h), (x + t / 2, 0, z + h / 2), c, bev=0.003, parent=root)
        box('book_band', (t + 0.001, d * 0.2, 0.012), (x + t / 2, -d / 2 + 0.01, z + h * 0.8), M.gold, bev=0, parent=root) if i % 3 == 0 else None
        x += t + 0.002
    if lean_last:
        t, h = 0.035, 0.24
        box('book_lean', (t, 0.18, h), (x + 0.07, 0, z + h / 2 - 0.012), mat('book_lean', (0.7, 0.2, 0.12), r=0.6), bev=0.003,
            rot=(0, rad(-18), 0), parent=root)
    return x


def whiteboard(y0, y1, z0, z1):
    collection('whiteboard')
    x = X1 - 0.02
    root = empty('whiteboard', (x, (y0 + y1) / 2, (z0 + z1) / 2), (0, 0, rad(-90)))
    w, h = y1 - y0, z1 - z0
    box('wb_frame', (w + 0.04, 0.03, h + 0.04), (0, 0, 0), M.alu, bev=0.006, parent=root)
    box('wb_face', (w, 0.032, h), (0, -0.001, 0), mat('wb_white', (0.93, 0.94, 0.95), r=0.12, coat=0.6), bev=0, parent=root)
    box('wb_tray', (w * 0.8, 0.06, 0.02), (0, -0.04, -h / 2 - 0.02), M.alu, bev=0.004, parent=root)
    for i, c in enumerate((M.cable_red, M.cable_blue, M.black)):
        cyl('marker', 0.009, 0.12, (-0.3 + i * 0.15, -0.05, -h / 2 - 0.003), c, rot=(0, rad(90), 0), parent=root)
    ink_b = mat('ink_blue', (0.05, 0.12, 0.6), r=0.3)
    ink_r = mat('ink_red', (0.7, 0.06, 0.05), r=0.3)
    ink_k = mat('ink_black', (0.03, 0.03, 0.04), r=0.3)
    yy = -0.018
    # a block diagram: three boxes and arrows
    def rect(cx, cz, rw, rh, m):
        p = [(cx - rw, yy, cz - rh), (cx + rw, yy, cz - rh), (cx + rw, yy, cz + rh), (cx - rw, yy, cz + rh), (cx - rw, yy, cz - rh)]
        c = cable('wb_box', p, 0.003, m, parent=root)
        for bp in c.data.splines[0].bezier_points:
            bp.handle_left_type = bp.handle_right_type = 'VECTOR'
    rect(-w / 2 + 0.3, 0.2, 0.15, 0.08, ink_b)
    rect(0.0, 0.2, 0.15, 0.08, ink_b)
    rect(w / 2 - 0.3, 0.2, 0.15, 0.08, ink_b)
    for a, b in ((-w / 2 + 0.45, -0.15), (0.15, w / 2 - 0.45)):
        cable('wb_arrow', [(a + 0.02, yy, 0.2), (b - 0.02, yy, 0.2)], 0.003, ink_k, parent=root, res=2)
        cable('wb_head', [(b - 0.05, yy, 0.225), (b - 0.02, yy, 0.2), (b - 0.05, yy, 0.175)], 0.003, ink_k, parent=root, res=2)
    # a sine sketch and a scribbled formula line
    pts = [(-w / 2 + 0.15 + i * 0.05, yy, -0.18 + 0.08 * math.sin(i * 0.9)) for i in range(int((w - 0.3) / 0.05))]
    cable('wb_sine', pts, 0.003, ink_r, parent=root)
    pts = [(-w / 2 + 0.15 + i * 0.03, yy, -0.38 + 0.015 * math.sin(i * 2.7) + rng.uniform(-0.006, 0.006)) for i in range(18)]
    cable('wb_scrawl', pts, 0.0025, ink_k, parent=root)
    text('wb_t', 'f = 3.88 THz', 0.06, (w / 2 - 0.35, yy, -0.38), (rad(90), 0, 0), ink_k, fname='Arial Rounded Bold.ttf', parent=root)
    for i in range(3):
        box('sticky', (0.07, 0.004, 0.07), (w / 2 - 0.12 - i * 0.09, -0.02, h / 2 - 0.08 - (i % 2) * 0.02),
            mat('sticky_%d' % i, [(1, 0.85, 0.2), (1, 0.5, 0.6), (0.5, 0.9, 0.6)][i], r=0.7), bev=0, rot=(0, rad(rng.uniform(-6, 6)), 0), parent=root)
    return root


def rug(cx, cy, r):
    collection('rug')
    cyl('rug', r, 0.012, (cx, cy, 0.006), M.rug, segs=96, bev=0.004)
    torus('rug_band', r - 0.12, 0.012, (cx, cy, 0.008), M.rug_edge, segs=96, rsegs=6, rot=(0, 0, 0)).scale = (1, 1, 0.3)


# ---------- props ----------

def desk_lamp(name, loc, rotz, reach=0.42, lift=0.45, energy=40):
    root = empty(name, loc, (0, 0, rotz))
    cyl(name + '_base', 0.08, 0.025, (0, 0, 0.0125), M.black, segs=40, bev=0.006, parent=root)
    a = (0, 0, 0.03)
    b = (0, -0.12, lift)
    c = (0, -reach, lift - 0.05)
    for p, q in ((a, b), (b, c)):
        cable(name + '_arm', [p, q], 0.008, M.black, parent=root, res=2)
        sphere(name + '_joint', 0.016, q, M.alu, segs=16, rings=8, parent=root)
    shade = empty(name + '_head', c, (rad(-35), 0, 0), parent=root)
    lathe(name + '_shade', [(0.012, 0.03), (0.03, 0.02), (0.075, -0.07), (0.072, -0.072), (0.028, 0.016), (0.0, 0.026)],
          (0, 0, 0), M.black, segs=40, parent=shade, bev=0)
    sphere(name + '_bulb', 0.025, (0, 0, -0.03), M.bulb, segs=16, rings=8, parent=shade)
    sp = light(name + '_light', 'SPOT', (0, 0, -0.04), energy, (1.0, 0.75, 0.48), size=0.04, spot=95, blend=0.6, parent=shade)
    return root


def monitor(name, loc, rotz, scr, w=0.56, h=0.32, tilt=-6):
    root = empty(name, loc, (0, 0, rotz))
    box(name + '_foot', (0.24, 0.17, 0.012), (0, 0.02, 0.006), M.alu, bev=0.005, parent=root)
    box(name + '_neck', (0.05, 0.02, 0.3), (0, 0.07, 0.17), M.alu, bev=0.006, parent=root)
    panel = empty(name + '_panel', (0, 0.05, 0.13 + h / 2 + 0.06), (rad(tilt), 0, 0), parent=root)
    box(name + '_bezel', (w + 0.02, 0.025, h + 0.03), (0, 0, 0), M.black, bev=0.006, parent=panel)
    box(name + '_back', (w * 0.5, 0.03, h * 0.5), (0, 0.025, 0), M.black, bev=0.01, parent=panel)
    plane(name + '_screen', w, h, (0, -0.0135, 0.003), scr, rot=(rad(90), 0, 0), parent=panel)
    return root


def snake_plant(name, loc, s=1.0):
    root = empty(name, loc)
    lathe(name + '_pot', [(0.0, 0.0), (0.09 * s, 0.0), (0.11 * s, 0.2 * s), (0.105 * s, 0.2 * s), (0.0, 0.2 * s)], (0, 0, 0), M.terracotta, segs=32, parent=root)
    cyl(name + '_soil', 0.1 * s, 0.01, (0, 0, 0.19 * s), M.soil, parent=root)
    for i in range(9):
        a = i / 9 * TAU + rng.uniform(-0.3, 0.3)
        hgt = rng.uniform(0.35, 0.6) * s
        wd = rng.uniform(0.035, 0.05) * s
        pts = [(-wd / 2, 0), (wd / 2, 0), (wd * 0.55, hgt * 0.6), (0.0, hgt), (-wd * 0.45, hgt * 0.55)]
        r = 0.03 * s
        prism(name + '_leaf', pts, 0.006, (r * math.cos(a), r * math.sin(a), 0.19 * s), M.leaf if i % 3 else M.leaf_light, plane='XZ',
              rot=(rng.uniform(-0.2, 0.2), rng.uniform(-0.25, 0.25), a + rad(90)), bev=0.002, parent=root)
    return root


def mug(name, loc, col):
    root = empty(name, loc)
    m = mat('mug_' + name, col, r=0.25, coat=0.5)
    lathe(name + '_body', [(0, 0.002), (0.04, 0.0), (0.042, 0.095), (0.037, 0.095), (0.035, 0.008), (0, 0.008)], (0, 0, 0), m, segs=32, parent=root)
    torus(name + '_handle', 0.026, 0.006, (0.045, 0, 0.05), m, segs=20, rsegs=8, rot=(rad(90), 0, 0), angle=math.pi, start=-math.pi / 2, parent=root)
    cyl(name + '_coffee', 0.035, 0.002, (0, 0, 0.08), mat('coffee', (0.06, 0.03, 0.015), r=0.1), parent=root)
    return root


def office_chair(name, loc, rotz):
    root = empty(name, loc, (0, 0, rotz))
    for i in range(5):
        a = i / 5 * TAU
        box(name + '_spoke', (0.3, 0.04, 0.03), (0.15 * math.cos(a), 0.15 * math.sin(a), 0.07), M.black, rot=(0, 0, a), bev=0.008, parent=root)
        sphere(name + '_caster', 0.028, (0.29 * math.cos(a), 0.29 * math.sin(a), 0.03), M.black, segs=16, rings=8, parent=root)
    cyl(name + '_gas', 0.025, 0.3, (0, 0, 0.22), M.chrome, parent=root)
    box(name + '_seat', (0.5, 0.48, 0.08), (0, 0, 0.44), M.fabric, bev=0.035, seg=4, parent=root)
    box(name + '_post', (0.06, 0.03, 0.3), (0, 0.25, 0.55), M.black, bev=0.008, parent=root)
    box(name + '_back', (0.46, 0.06, 0.5), (0, 0.27, 0.85), M.fabric, bev=0.03, seg=4, rot=(rad(-8), 0, 0), parent=root)
    return root


def stool(name, loc):
    root = empty(name, loc)
    cyl(name + '_seat', 0.18, 0.05, (0, 0, 0.66), M.walnut, segs=48, bev=0.012, parent=root)
    for i in range(4):
        a = i / 4 * TAU + 0.4
        p, q = (0.12 * math.cos(a), 0.12 * math.sin(a), 0.64), (0.2 * math.cos(a), 0.2 * math.sin(a), 0.0)
        cable(name + '_leg', [p, q], 0.013, M.black, parent=root, res=2)
    torus(name + '_ring', 0.16, 0.008, (0, 0, 0.24), M.black, segs=32, rsegs=6, parent=root)
    return root


def cardboard(name, size, loc, rotz=0.0, label=None):
    root = empty(name, loc, (0, 0, rotz))
    w, d, h = size
    box(name + '_box', size, (0, 0, h / 2), M.cardboard, bev=0.006, parent=root)
    box(name + '_tape', (w + 0.002, 0.05, 0.003), (0, 0, h + 0.0005), M.tape, bev=0, parent=root)
    box(name + '_tape2', (0.002, 0.05, h * 0.25), (w / 2 + 0.001, 0, h - h * 0.125), M.tape, bev=0, parent=root)
    if label:
        box(name + '_label', (w * 0.6, 0.002, h * 0.32), (0, -d / 2 - 0.001, h * 0.5), M.paper, bev=0, parent=root)
        text(name + '_t1', label[0], h * 0.12, (0, -d / 2 - 0.004, h * 0.56), (rad(90), 0, 0), M.black, parent=root)
        text(name + '_t2', label[1], h * 0.06, (0, -d / 2 - 0.004, h * 0.43), (rad(90), 0, 0), mat('label_red', (0.75, 0.1, 0.05), r=0.5),
             fname='Arial Rounded Bold.ttf', parent=root)
    return root


def oscilloscope(name, loc, rotz):
    root = empty(name, loc, (0, 0, rotz))
    box(name + '_body', (0.36, 0.16, 0.18), (0, 0, 0.09), M.grey, bev=0.012, parent=root)
    box(name + '_face', (0.36, 0.01, 0.17), (0, -0.081, 0.09), M.dark_grey, bev=0.004, parent=root)
    box(name + '_screen', (0.2, 0.004, 0.12), (-0.06, -0.087, 0.095), M.screen_off, bev=0, parent=root)
    pts = [(-0.155 + i * 0.004, -0.0895, 0.095 + 0.035 * math.sin(i * 0.35) * math.exp(-i * 0.006)) for i in range(48)]
    cable(name + '_trace', pts, 0.0012, M.led_yellow, parent=root)
    pts = [(-0.155 + i * 0.004, -0.0895, 0.07 + (0.02 if (i // 6) % 2 else -0.0)) for i in range(48)]
    c = cable(name + '_trace2', pts, 0.001, M.led_cyan, parent=root)
    for i in range(6):
        cyl(name + '_knob', 0.011, 0.015, (0.09 + (i % 2) * 0.05, -0.09, 0.14 - (i // 2) * 0.045), M.black, segs=16, rot=(rad(90), 0, 0), parent=root)
    for i in range(4):
        box(name + '_btn', (0.018, 0.008, 0.012), (-0.14 + i * 0.03, -0.088, 0.022), [M.yellow, M.led_cyan, M.red, M.grey][i], bev=0.002, parent=root)
    return root


def solder_station(name, loc, rotz):
    root = empty(name, loc, (0, 0, rotz))
    box(name + '_body', (0.16, 0.18, 0.1), (0, 0, 0.05), M.dark_grey, bev=0.01, parent=root)
    box(name + '_disp', (0.07, 0.004, 0.03), (0, -0.092, 0.07), M.led_red, bev=0, parent=root)
    cyl(name + '_knob', 0.02, 0.02, (0, -0.095, 0.03), M.grey, rot=(rad(90), 0, 0), parent=root)
    holder = empty(name + '_holder', (0.18, 0.02, 0), parent=root)
    cyl(name + '_hbase', 0.05, 0.02, (0, 0, 0.01), M.black, parent=holder)
    lathe(name + '_coil', [(0.022, 0.03), (0.028, 0.03), (0.018, 0.12), (0.014, 0.12)], (0, 0, 0), M.chrome, segs=24, rot=(rad(30), 0, 0), parent=holder)
    cyl(name + '_iron', 0.011, 0.17, (0, 0.03, 0.12), M.black, rot=(rad(30), 0, 0), parent=holder)
    cyl(name + '_tip', 0.003, 0.05, (0, -0.02, 0.2), M.chrome, rot=(rad(30), 0, 0), parent=holder)
    cable(name + '_cord', [(0.08, 0, 0.05), (0.12, 0.08, 0.01), (0.18, 0.12, 0.06)], 0.004, M.cable_black, parent=root)
    return root


def figurine(name, loc, rotz=0.0):
    """Small caped hero on a plinth (generic, no character likeness)."""
    root = empty(name, loc, (0, 0, rotz))
    cyl(name + '_plinth', 0.045, 0.015, (0, 0, 0.0075), M.black, bev=0.003, parent=root)
    suit = M.navy
    for s in (-1, 1):
        cyl(name + '_leg', 0.009, 0.06, (s * 0.012, 0, 0.045), suit, segs=12, rot=(0, rad(s * 6), 0), parent=root)
        sphere(name + '_boot', 0.011, (s * 0.014, -0.004, 0.018), M.cape, scale=(1, 1.3, 0.8), parent=root)
    sphere(name + '_torso', 0.025, (0, 0, 0.1), suit, scale=(1, 0.75, 1.25), parent=root)
    box(name + '_belt', (0.045, 0.034, 0.006), (0, 0, 0.078), M.yellow, bev=0.002, parent=root)
    sphere(name + '_head', 0.018, (0, 0, 0.148), M.skin, parent=root)
    sphere(name + '_hair', 0.0185, (0, 0.003, 0.153), M.matte_black, scale=(1, 1, 0.75), parent=root)
    for s in (-1, 1):
        cable(name + '_arm', [(s * 0.026, 0, 0.122), (s * 0.04, -0.005, 0.1), (s * 0.03, -0.01, 0.08)], 0.007, suit, parent=root)
    lathe(name + '_cape', [(0.022, 0.13), (0.03, 0.09), (0.05, 0.02)], (0, 0.004, 0), M.cape, segs=16, angle=rad(150), start=rad(15), parent=root)
    return root


def coming_soon(x0, z, n=3):
    collection('coming_soon')
    roots = []
    for i in range(n):
        r = cardboard('soon_%d' % (10 + i), (0.22, 0.2, 0.18 + 0.02 * (i % 2)), (x0 + i * 0.27, Y1 - 0.14, z), rad(rng.uniform(-6, 6)),
                      label=('%d' % (10 + i), 'COMING SOON'))
        roots.append(r)
    return roots


def build_props():
    collection('props')
    # lamps on benches
    desk_lamp('lamp_back_l', (-3.0, Y1 - 0.25, BENCH), rad(-20), energy=70)
    desk_lamp('lamp_back_r', (0.9, Y1 - 0.2, BENCH), rad(10), energy=70)
    desk_lamp('lamp_left', (X0 + 0.25, 1.95, BENCH), rad(-120), energy=70)
    desk_lamp('lamp_right', (X1 - 0.2, -1.25, BENCH), rad(110), energy=70)
    # plants
    snake_plant('plant_corner', (X0 + 0.3, Y1 - 0.3, BENCH), 0.8)
    snake_plant('plant_floor', (X1 - 0.3, -2.25, 0), 1.5)
    snake_plant('plant_floor2', (X0 + 0.3, -1.95, 0), 1.3)
    # workstation clutter
    oscilloscope('scope', (2.95, Y1 - 0.33, BENCH), rad(-8))
    solder_station('solder', (X1 - 0.45, 1.95, BENCH), rad(-80))
    mug('mug_a', (1.05, Y1 - 0.6, BENCH), (0.9, 0.9, 0.88))
    mug('mug_b', (X0 + 0.6, -1.25, BENCH), (0.1, 0.35, 0.6))
    for i in range(4):
        box('paper', (0.21, 0.297, 0.002 + 0.001 * i), (-0.95 + i * 0.01, Y1 - 0.6 + i * 0.005, BENCH + 0.001 + i * 0.002), M.paper, bev=0,
            rot=(0, 0, rad(rng.uniform(-10, 10))))
    office_chair('chair', (-0.35, 1.45, 0), rad(165))
    stool('stool', (2.55, 0.25, 0))
    cardboard('box_a', (0.5, 0.4, 0.35), (-1.75, Y1 - 0.4, 0.0), rad(4))
    cardboard('box_b', (0.4, 0.35, 0.28), (X1 - 0.4, 1.55, 0.0), rad(-6))
    cardboard('box_c', (0.35, 0.3, 0.22), (X1 - 0.4, 1.55, 0.28), rad(12))


def pendant(name, loc, drop=0.9, energy=60):
    root = empty(name, loc)
    cable(name + '_cord', [(0, 0, 0), (0, 0, -drop)], 0.004, M.cable_black, parent=root, res=2)
    lathe(name + '_shade', [(0.012, -drop), (0.03, -drop - 0.01), (0.16, -drop - 0.13), (0.158, -drop - 0.132), (0.028, -drop - 0.012), (0.0, -drop - 0.002)],
          (0, 0, 0), mat('pendant_shell', (0.04, 0.045, 0.05), r=0.35, m=0.5), segs=48, parent=root)
    lathe(name + '_inner', [(0.155, -drop - 0.131), (0.03, -drop - 0.015)], (0, 0, 0), mat('pendant_inner', (0.95, 0.9, 0.8), r=0.6, emis=(1.0, 0.8, 0.55), es=0.6),
          segs=48, parent=root)
    sphere(name + '_bulb', 0.035, (0, 0, -drop - 0.09), M.bulb, segs=20, rings=10, parent=root)
    s = light(name + '_light', 'SPOT', (0, 0, -drop - 0.1), energy, (1.0, 0.74, 0.46), size=0.06, spot=110, blend=0.8, parent=root)
    return root


def beams():
    collection('ceiling')
    for y in (0.75, 2.0):
        box('beam', (X1 - X0 + 2 * T, 0.07, 0.1), (0, y, H - 0.05), M.wall_cap, bev=0.006)
    for i, (x, y, d) in enumerate(((-2.5, 0.75, 0.95), (-0.9, 2.0, 0.95), (0.9, 2.0, 0.95), (2.5, 0.75, 0.95), (0.0, 0.75, 0.75))):
        pendant('pendant_%d' % i, (x, y, H - 0.1), drop=d, energy=110 if i < 4 else 80)


def tool_chest(name, loc, rotz):
    root = empty(name, loc, (0, 0, rotz))
    red = mat('chest_red', (0.62, 0.05, 0.04), r=0.28, coat=0.6, m=0.2)
    box(name + '_body', (0.68, 0.46, 0.82), (0, 0, 0.5), red, bev=0.012, parent=root)
    box(name + '_top', (0.7, 0.48, 0.03), (0, 0, 0.925), M.rubber, bev=0.006, parent=root)
    for k in range(6):
        z = 0.85 - k * 0.12 - (0.03 if k > 3 else 0)
        box(name + '_drawer', (0.64, 0.01, 0.1 if k < 4 else 0.14), (0, -0.233, z - 0.04), red, bev=0.003, parent=root)
        box(name + '_pull', (0.5, 0.025, 0.012), (0, -0.25, z - 0.005), M.alu, bev=0.004, parent=root)
    for sx in (-1, 1):
        for sy in (-1, 1):
            cyl(name + '_wheel', 0.04, 0.03, (sx * 0.28, sy * 0.18, 0.045), M.black, rot=(0, rad(90), 0), parent=root)
    cyl(name + '_handle', 0.012, 0.6, (0.38, 0, 0.8), M.chrome, rot=(rad(90), 0, 0), parent=root)
    box(name + '_drill', (0.08, 0.22, 0.16), (-0.12, 0.05, 1.02), mat('drill', (0.95, 0.55, 0.05), r=0.4), bev=0.02, parent=root)
    cyl(name + '_drill_batt', 0.045, 0.06, (-0.12, 0.08, 0.97), M.black, segs=24, parent=root)
    m = mug(name + '_mug', (0.18, -0.1, 0.94), (0.85, 0.85, 0.82))
    m.parent = root
    return root
