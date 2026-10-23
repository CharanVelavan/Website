"""The nine projects, each under an empty named proj_<id>. Local axes: -y faces the visitor."""
import bpy, bmesh, math
from mathutils import Matrix, Vector
from lib import (D, rng, rad, TAU, collection, empty, obj, box, cyl, sphere, lathe, prism, plane, disk, torus,
                 cable, text, mat, img_mat, light, inst, _link)
from palette import M
from room import BENCH, X0, X1, Y1, monitor, desk_lamp


def font_to_mesh(ob):
    dg = bpy.context.evaluated_depsgraph_get()
    me = D.meshes.new_from_object(ob.evaluated_get(dg))
    new = D.objects.new(ob.name + '_m', me)
    for c in ob.users_collection:
        c.objects.link(new)
    new.parent = ob.parent
    new.location, new.rotation_euler, new.scale = ob.location, ob.rotation_euler, ob.scale
    D.objects.remove(ob)
    return new


def wrap_prism(ob, apothem, sides, lift=0.003):
    """Bend a flat text mesh (local z = outward) onto a regular prism whose front face is centred on x=0."""
    phis = [k * TAU / sides for k in range(-(sides // 4), sides // 4 + 1)]
    for v in ob.data.vertices:
        x = v.co.x
        zs = min((apothem - x * math.sin(p)) / math.cos(p) for p in phis)
        v.co.z = zs + lift + v.co.z


# ---------------------------------------------------------------- 01 Bird's AI

def birds_ai(root):
    pad = mat('pad', (0.05, 0.055, 0.06), r=0.7)
    cyl('ba_pad', 0.3, 0.012, (0, 0, 0.006), pad, segs=64, bev=0.003, parent=root)
    torus('ba_pad_ring', 0.255, 0.006, (0, 0, 0.012), M.white, segs=64, rsegs=6, parent=root).scale = (1, 1, 0.2)
    h = font_to_mesh(text('ba_pad_h', 'H', 0.2, (0, 0, 0.0125), (0, 0, 0), M.white, extrude=0.0006))
    h.parent = root
    d = empty('ba_drone', (0, 0, 0), parent=root)
    z_bot, z_top, z_arm = 0.14, 0.19, 0.165
    cyl('ba_plate_bot', 0.072, 0.003, (0, 0, z_bot), M.pcb_black, segs=8, bev=0.001, parent=d)
    cyl('ba_plate_top', 0.065, 0.003, (0, 0, z_top), M.pcb_black, segs=8, bev=0.001, parent=d)
    torus('ba_plate_edge', 0.07, 0.0016, (0, 0, z_bot), M.gold, segs=8, rsegs=4, start=rad(22.5), parent=d)
    arm_cols = {225: M.red, 315: M.red, 45: M.matte_black, 135: M.matte_black}
    for a, col in arm_cols.items():
        r_ = rad(a)
        ca, sa = math.cos(r_), math.sin(r_)
        prism('ba_arm', [(0.035, -0.02), (0.225, -0.012), (0.232, 0.0), (0.225, 0.012), (0.035, 0.02)], 0.028, (0, 0, z_arm), col,
              rot=(0, 0, r_), bev=0.004, parent=d)
        tip = (0.225 * ca, 0.225 * sa)
        m = empty('ba_motor', (tip[0], tip[1], z_arm + 0.014), parent=d)
        cyl('ba_stator', 0.0145, 0.01, (0, 0, 0.005), M.matte_black, segs=24, parent=m)
        lathe('ba_bell', [(0, 0.03), (0.011, 0.03), (0.0145, 0.026), (0.0145, 0.01), (0.0, 0.01)], (0, 0, 0), M.red, segs=32, parent=m, bev=0)
        cyl('ba_shaft', 0.003, 0.016, (0, 0, 0.036), M.chrome, segs=12, parent=m)
        lathe('ba_nut', [(0, 0.05), (0.004, 0.05), (0.006, 0.043), (0.006, 0.038), (0, 0.038)], (0, 0, 0), M.chrome, segs=6, parent=m, bev=0)
        prop = empty('ba_prop', (0, 0, 0.04), (0, 0, rng.uniform(0, math.pi)), parent=m)
        blade = [(0.0, -0.007), (0.03, -0.015), (0.09, -0.013), (0.124, -0.005), (0.127, 0.002), (0.09, 0.009), (0.03, 0.011), (0.0, 0.007)]
        for k in (0, 1):
            prism('ba_blade', blade, 0.0025, (0, 0, 0), M.black, rot=(rad(14), 0, k * math.pi), bev=0.0008, parent=prop)
        cyl('ba_hub', 0.009, 0.007, (0, 0, 0), M.black, segs=16, parent=prop)
        # white prop guard: an arc on the outside of the motor
        g = torus('ba_guard', 0.135, 0.005, (tip[0], tip[1], z_arm + 0.01), M.white, segs=40, rsegs=8, angle=rad(200), start=r_ - rad(100), parent=d)
        g.scale = (1, 1, 1.8)
        for s in (-1, 1):
            b = r_ + s * rad(100)
            p0 = (tip[0] + 0.135 * math.cos(b), tip[1] + 0.135 * math.sin(b), z_arm + 0.01)
            p1 = (0.13 * ca - s * 0.012 * sa, 0.13 * sa + s * 0.012 * ca, z_arm)
            cable('ba_guard_strut', [p0, p1], 0.004, M.white, parent=d, res=2)
        # ESC with yellow heat-shrink and wires
        box('ba_esc', (0.04, 0.016, 0.009), (0.12 * ca, 0.12 * sa, z_arm + 0.019), M.cable_yellow, rot=(0, 0, r_), bev=0.003, parent=d)
        for k, c in enumerate((M.cable_red, M.cable_black, M.cable_blue)):
            off = (k - 1) * 0.005
            cable('ba_wire', [(0.14 * ca - off * sa, 0.14 * sa + off * ca, z_arm + 0.02),
                              (0.18 * ca - off * sa, 0.18 * sa + off * ca, z_arm + 0.03 + 0.004 * k),
                              (tip[0] - 0.012 * ca, tip[1] - 0.012 * sa, z_arm + 0.022)], 0.0012, c, parent=d, res=6)
        cable('ba_power', [(0.1 * ca, 0.1 * sa, z_arm + 0.02), (0.06 * ca, 0.06 * sa, z_arm - 0.03), (0.03 * ca, 0.03 * sa, z_bot - 0.01)],
              0.0016, M.cable_red if a in (45, 225) else M.cable_black, parent=d)
    # landing gear (tall curved black legs between the arms)
    for a in (0, 90, 180, 270):
        r_ = rad(a)
        ca, sa = math.cos(r_), math.sin(r_)
        pts = [(0.045 * ca, 0.045 * sa, z_bot), (0.13 * ca, 0.13 * sa, z_bot - 0.01), (0.19 * ca, 0.19 * sa, 0.05), (0.2 * ca, 0.2 * sa, 0.006)]
        cable('ba_leg', pts, 0.0045, M.matte_black, parent=d, res=12)
        sphere('ba_foot', 0.008, (0.2 * ca, 0.2 * sa, 0.006), M.rubber, segs=12, rings=6, parent=d)
    # flight controller, standoffs, GPS mast
    box('ba_fc', (0.05, 0.05, 0.016), (0, 0, z_top + 0.012), M.black, bev=0.004, parent=d)
    sphere('ba_fc_led', 0.003, (0.018, -0.022, z_top + 0.021), M.led_green, segs=8, rings=4, parent=d)
    for sx in (-1, 1):
        for sy in (-1, 1):
            cyl('ba_standoff', 0.004, 0.012, (sx * 0.033, sy * 0.033, z_top + 0.008), M.blue, segs=6, parent=d)
    cyl('ba_gps_mast', 0.003, 0.11, (-0.03, 0.03, z_top + 0.06), M.matte_black, segs=8, parent=d)
    cyl('ba_gps', 0.028, 0.01, (-0.03, 0.03, z_top + 0.118), M.black, segs=24, bev=0.003, parent=d)
    for s in (-1, 1):
        cable('ba_ant', [(0.02 * s, 0.03, z_top + 0.01), (0.03 * s, 0.035, z_top + 0.12), (0.05 * s, 0.04, z_top + 0.24)], 0.0018, M.cable_black, parent=d)
    # the companion computer above the flight controller: a Raspberry Pi 5 with the AI HAT+ (Hailo-8L) and the 5G dongle
    pi = empty('ba_pi', (0.0, -0.022, z_top + 0.042), parent=d)
    for sx in (-1, 1):
        for sy in (-1, 1):
            cyl('ba_pi_standoff', 0.0022, 0.038, (sx * 0.0375, sy * 0.024, -0.02), M.alu, segs=6, parent=pi)
    box('ba_pi_board', (0.085, 0.056, 0.0016), (0, 0, 0), M.pcb_green, bev=0.0006, parent=pi)
    box('ba_pi_soc', (0.014, 0.014, 0.0016), (-0.008, 0.004, 0.0016), M.black, bev=0.0004, parent=pi)
    for k, y in enumerate((-0.016, 0.002)):
        box('ba_pi_usb', (0.017, 0.014, 0.016), (0.036, y, 0.009), M.alu, bev=0.001, parent=pi)
    box('ba_pi_eth', (0.02, 0.016, 0.014), (0.034, 0.02, 0.008), M.alu, bev=0.001, parent=pi)
    sphere('ba_pi_led', 0.0015, (-0.04, 0.022, 0.0018), M.led_green, segs=6, rings=4, parent=pi)
    hat = empty('ba_hat', (0, 0, 0.018), parent=pi)
    for sx in (-1, 1):
        for sy in (-1, 1):
            cyl('ba_hat_standoff', 0.002, 0.016, (sx * 0.029, sy * 0.024, -0.008), M.alu, segs=6, parent=hat)
    box('ba_hat_board', (0.065, 0.056, 0.0016), (-0.008, 0, 0), M.pcb_green, bev=0.0006, parent=hat)
    box('ba_hailo', (0.022, 0.03, 0.003), (-0.012, 0.004, 0.0024), M.alu, bev=0.0008, parent=hat)
    box('ba_hailo_die', (0.012, 0.012, 0.0006), (-0.012, 0.004, 0.0042), M.black, bev=0.0002, parent=hat)
    box('ba_hat_flex', (0.012, 0.022, 0.0008), (-0.043, -0.012, -0.004), mat('flex', (0.85, 0.5, 0.15), r=0.5), bev=0.0002, rot=(0, rad(-30), 0), parent=hat)
    dg = empty('ba_dongle', (0.058, -0.016, 0.009), parent=pi)
    box('ba_dongle_body', (0.03, 0.014, 0.009), (0.015, 0, 0), M.white, bev=0.003, parent=dg)
    box('ba_dongle_plug', (0.01, 0.012, 0.0045), (-0.003, 0, 0), M.alu, bev=0.0005, parent=dg)
    # battery underneath and the HP webcam at the front
    box('ba_battery', (0.11, 0.045, 0.032), (0, 0.025, z_bot - 0.022), M.dark_grey, bev=0.004, parent=d)
    box('ba_batt_label', (0.07, 0.046, 0.022), (0, 0.025, z_bot - 0.022), M.cable_yellow, bev=0.002, parent=d)
    box('ba_strap', (0.012, 0.05, 0.036), (0.03, 0.025, z_bot - 0.022), M.blue, bev=0.002, parent=d)
    box('ba_xt60', (0.016, 0.008, 0.008), (0.06, 0.0, z_bot - 0.01), M.yellow, bev=0.0015, parent=d)
    cam = empty('ba_cam', (0, -0.05, z_bot - 0.035), parent=d)
    cyl('ba_cam_body', 0.022, 0.05, (0, 0, 0), M.matte_black, segs=32, rot=(rad(90), 0, 0), bev=0.004, parent=cam)
    cyl('ba_cam_lens', 0.009, 0.004, (0, -0.026, 0.0), mat('lens', (0.01, 0.01, 0.03), r=0.05, coat=1.0), segs=24, rot=(rad(90), 0, 0), parent=cam)
    torus('ba_cam_ring', 0.011, 0.0015, (0, -0.0255, 0), M.chrome, segs=24, rsegs=6, rot=(rad(90), 0, 0), parent=cam)
    t = font_to_mesh(text('ba_cam_logo', 'hp', 0.008, (0.012, -0.0256, 0.0), (rad(90), 0, 0), M.white, extrude=0.0002))
    t.parent = cam
    box('ba_cam_mount', (0.05, 0.02, 0.02), (0, -0.045, z_bot - 0.012), M.cardboard, bev=0.002, parent=d)
    return d


# ---------------------------------------------------------------- 02 Nephele 2.0 + 3.0

def nephele(root):
    # --- 2.0: black faceted cylinder (right)
    n2 = empty('ne2', (0.42, 0, 0), parent=root)
    ring = mat('ne_ring', (0.55, 0.56, 0.57), r=0.35)
    cyl('ne2_base', 0.34, 0.09, (0, 0, 0.075), ring, segs=64, bev=0.01, parent=n2)
    cyl('ne2_base_dark', 0.31, 0.03, (0, 0, 0.015), M.dark_grey, segs=48, parent=n2)
    for k in range(3):
        a = k / 3 * TAU + 0.5
        sphere('ne2_caster', 0.022, (0.22 * math.cos(a), 0.22 * math.sin(a), 0.022), M.rubber, segs=16, rings=8, parent=n2)
    sides = 10
    start = -math.pi / 2 + math.pi / sides
    body = lathe('ne2_body', [(0.0, 0.12), (0.3, 0.12), (0.3, 1.02), (0.24, 1.14), (0.0, 1.17)], (0, 0, 0), M.matte_black,
                 segs=sides, start=start, smooth=True, bev=0.006, parent=n2)
    ap = 0.3 * math.cos(math.pi / sides)
    for body_text, size, z in (('NEPHELE', 0.075, 0.68), ('2.0', 0.075, 0.55)):
        t = font_to_mesh(text('ne2_t', body_text, size, (0, 0, 0), (0, 0, 0), M.white, extrude=0.0006, spacing=1.05))
        wrap_prism(t, ap, sides)
        t.parent = n2
        t.location, t.rotation_euler = (0, 0, z), (rad(90), 0, 0)
    # thin seam lines between panels
    for z in (0.35, 0.85):
        torus('ne2_seam', 0.301, 0.002, (0, 0, z), M.dark_grey, segs=sides, rsegs=4, start=start, parent=n2)
    cyl('ne2_neck', 0.028, 0.14, (0, 0, 1.22), ring, segs=24, parent=n2)
    head = empty('ne2_head', (0, 0, 1.38), (0, 0, rad(-8)), parent=n2)
    box('ne2_head_shell', (0.27, 0.07, 0.2), (0, 0, 0), M.white, bev=0.012, seg=4, parent=head)
    box('ne2_screen', (0.22, 0.01, 0.135), (0, -0.033, -0.005), M.screen_off, bev=0.008, parent=head)
    eye = mat('ne2_eye', (0.9, 0.95, 1.0), emis=(0.85, 0.92, 1.0), es=7)
    for s in (-1, 1):
        sphere('ne2_eye', 0.022, (s * 0.045, -0.039, -0.002), eye, scale=(0.85, 0.12, 1.25), parent=head)

    # --- 3.0: white S-curve body with tablet head (left)
    n3 = empty('ne3', (-0.42, 0.02, 0), (0, 0, rad(6)), parent=root)
    box('ne3_skirt', (0.46, 0.42, 0.03), (0, 0, 0.015), M.dark_grey, bev=0.006, parent=n3)
    box('ne3_base', (0.52, 0.46, 0.05), (0, 0, 0.055), M.white, bev=0.018, seg=4, parent=n3)
    n, z0, z1 = 24, 0.08, 1.2
    right, left = [], []
    for i in range(n + 1):
        t = i / n
        z = z0 + (z1 - z0) * t
        lean = 0.025 * math.sin(math.pi * t)
        right.append((lean + 0.165 + 0.05 * math.cos(TAU * t), z))
        left.append((lean - 0.165 - 0.045 * math.cos(TAU * t + 0.7), z))
    pts = right + [(0.0, z1 + 0.015)] + left[::-1]
    prism('ne3_body', pts, 0.22, (0, 0, 0), mat('ne3_white', (0.88, 0.88, 0.87), r=0.22, coat=0.6, m=0.05), plane='XZ',
          bev=0.035, seg=5, parent=n3)
    cyl('ne3_neck', 0.03, 0.12, (0.0, 0, 1.26), M.alu, segs=24, parent=n3)
    head = empty('ne3_head', (0.0, -0.01, 1.43), (rad(-4), rad(5), rad(10)), parent=n3)
    box('ne3_head_shell', (0.31, 0.06, 0.22), (0, 0, 0), M.white, bev=0.014, seg=4, parent=head)
    box('ne3_screen', (0.25, 0.01, 0.155), (0, -0.028, 0), M.screen_off, bev=0.01, parent=head)
    for s in (-1, 1):
        box('ne3_eye', (0.042, 0.006, 0.062), (s * 0.05, -0.034, 0.005), mat('ne3_eye', (0.2, 1.0, 0.4), emis=(0.25, 1.0, 0.45), es=3.0), bev=0.012, seg=4, parent=head)
    light('ne3_glow', 'POINT', (0, -0.15, 1.43), 2.5, (0.3, 1.0, 0.45), size=0.05, parent=n3)


# ---------------------------------------------------------------- 03 300-UAV swarm

def mini_drone_mesh():
    me = D.meshes.get('mini_drone')
    if me:
        return me
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1, matrix=Matrix.Diagonal((0.012, 0.012, 0.005, 1)))
    for a in (45, 135):
        m = Matrix.Rotation(rad(a), 4, 'Z') @ Matrix.Diagonal((0.05, 0.003, 0.003, 1))
        bmesh.ops.create_cube(bm, size=1, matrix=m)
    for a in (45, 135, 225, 315):
        p = Matrix.Translation((0.025 * math.cos(rad(a)), 0.025 * math.sin(rad(a)), 0.003))
        bmesh.ops.create_circle(bm, cap_ends=True, segments=12, radius=0.011, matrix=p)
    me = D.meshes.new('mini_drone')
    bm.to_mesh(me)
    bm.free()
    me.materials.append(M.white)
    return me


def swarm(root):
    base = mat('sw_base', (0.03, 0.035, 0.04), r=0.4)
    box('sw_base', (0.74, 0.5, 0.05), (0, 0, 0.025), base, bev=0.008, parent=root)
    W, Dp, Hh = 0.7, 0.46, 0.42
    for (sx, sy, sz, px, py) in ((W, 0.006, Hh, 0, -Dp / 2), (W, 0.006, Hh, 0, Dp / 2), (0.006, Dp, Hh, -W / 2, 0), (0.006, Dp, Hh, W / 2, 0)):
        box('sw_glass', (sx, sy, sz), (px, py, 0.05 + Hh / 2), M.acrylic, bev=0.001, parent=root)
    box('sw_glass_top', (W, Dp, 0.006), (0, 0, 0.05 + Hh), M.acrylic, bev=0.001, parent=root)
    plate = font_to_mesh(text('sw_plate', '300-UAV SWARM · 6G', 0.018, (0, -0.251, 0.025), (rad(90), 0, 0), M.gold, extrude=0.0005))
    plate.parent = root
    # city blocks with lit windows
    city = mat('sw_city', (0.12, 0.13, 0.15), r=0.6)
    for i in range(6):
        for j in range(4):
            if rng.random() < 0.15:
                continue
            h = rng.uniform(0.02, 0.12)
            x, y = -0.29 + i * 0.115, -0.16 + j * 0.105
            box('sw_block', (0.08, 0.07, h), (x, y, 0.05 + h / 2), city, bev=0.002, parent=root)
            if h > 0.05:
                box('sw_lit', (0.081, 0.004, 0.006), (x, y - 0.034, 0.05 + h * 0.7), M.led_warm, bev=0, parent=root)
    # ground station mast
    cyl('sw_mast', 0.004, 0.16, (0.0, 0.0, 0.05 + 0.08), M.alu, segs=8, parent=root)
    sphere('sw_beacon', 0.008, (0, 0, 0.215), M.led_red, segs=12, rings=6, parent=root)
    # drones in three layers
    me = mini_drone_mesh()
    pos = []
    for layer, z in enumerate((0.25, 0.32, 0.39)):
        for k in range(9 - layer * 2):
            p = (rng.uniform(-0.3, 0.3), rng.uniform(-0.18, 0.18), z + rng.uniform(-0.02, 0.02))
            if any((Vector(p) - Vector(q)).length < 0.08 for q in pos):
                continue
            pos.append(p)
    for i, p in enumerate(pos):
        o = D.objects.new('sw_drone', me)
        _link(o)
        o.location, o.rotation_euler, o.parent = p, (rng.uniform(-0.1, 0.1), rng.uniform(-0.1, 0.1), rng.uniform(0, TAU)), root
        sphere('sw_led', 0.004, (p[0], p[1], p[2] - 0.006), M.led_cyan if i % 4 else M.led_green, segs=8, rings=4, parent=root)
    # mesh links: each drone to its two nearest neighbours, plus a few to the mast
    link = mat('sw_link', (0.2, 0.8, 1.0), emis=(0.2, 0.75, 1.0), es=4)
    seen = set()
    for i, p in enumerate(pos):
        near = sorted(range(len(pos)), key=lambda j: (Vector(pos[j]) - Vector(p)).length)[1:3]
        for j in near:
            key = tuple(sorted((i, j)))
            if key in seen:
                continue
            seen.add(key)
            cable('sw_link', [p, pos[j]], 0.0007, link, parent=root, res=2)
    for p in pos[:4]:
        cable('sw_uplink', [(0, 0, 0.215), p], 0.0007, M.led_red, parent=root, res=2)


# ---------------------------------------------------------------- 04 THz filter

def fractal_cell(parent, cx, cy, c, slot, z):
    """One pinwheel-slotted unit cell as drawn in the paper (slots shown in substrate colour)."""
    w = c * 0.1
    arm = c * 0.36
    hook = c * 0.2
    for k in range(4):
        a = k * math.pi / 2
        ca, sa = math.cos(a), math.sin(a)
        mx, my = cx + ca * arm / 2, cy + sa * arm / 2
        box('tz_slot', (arm + w if k % 2 == 0 else w, w if k % 2 == 0 else arm + w, 0.0012), (mx, my, z), slot, bev=0, parent=parent)
        ex, ey = cx + ca * arm, cy + sa * arm
        hx, hy = ex - sa * hook / 2, ey + ca * hook / 2
        box('tz_hook', (w if k % 2 == 0 else hook + w, hook + w if k % 2 == 0 else w, 0.0012), (hx, hy, z), slot, bev=0, parent=parent)


def thz(root):
    scr = img_mat('scr_sparam', 'tz-sparam.webp', crop=(0.0, 0.18, 1.0, 0.71), emit=0.85)
    mon = monitor('tz_monitor', (0, 0, 0), 0, scr)
    mon.parent, mon.location, mon.rotation_euler = root, (-0.45, 0.16, 0), (0, 0, rad(10))
    # display stand holding a scaled-up filter
    box('tz_stand_base', (0.32, 0.2, 0.035), (0.12, -0.02, 0.0175), M.black, bev=0.006, parent=root)
    t = font_to_mesh(text('tz_plaque', 'THz BANDPASS · 3.88 THz · 38 dB', 0.0105, (0.12, -0.1205, 0.018), (rad(90), 0, 0), M.gold, extrude=0.0004))
    t.parent = root
    holder = empty('tz_holder', (0.12, 0.0, 0.2), (rad(70), 0, 0), parent=root)
    box('tz_acrylic', (0.29, 0.29, 0.008), (0, 0, -0.012), M.acrylic, bev=0.003, parent=holder)
    box('tz_sub', (0.24, 0.24, 0.02), (0, 0, 0.002), M.substrate, bev=0.003, parent=holder)
    box('tz_ground', (0.24, 0.24, 0.002), (0, 0, -0.009), M.gold, bev=0, parent=holder)
    zt = 0.0125
    box('tz_patch', (0.11, 0.11, 0.002), (0.0, 0.0, zt), M.gold, bev=0.0005, parent=holder)
    box('tz_feed1', (0.022, 0.065, 0.002), (0.0, -0.0875, zt), M.gold, bev=0.0005, parent=holder)
    box('tz_feed2', (0.065, 0.022, 0.002), (-0.0875, 0.02, zt), M.gold, bev=0.0005, parent=holder)
    box('tz_stub', (0.022, 0.022, 0.002), (0.07, 0.07, zt), M.gold, bev=0.0005, parent=holder)
    slot = mat('tz_slot', (0.7, 0.48, 0.44), r=0.6)
    for bi in (-1, 1):
        for bj in (-1, 1):
            for si in (-1, 1):
                for sj in (-1, 1):
                    fractal_cell(holder, bi * 0.0275 + si * 0.013, bj * 0.0275 + sj * 0.013, 0.024, slot, zt + 0.0007)
    for k, (lbl, p) in enumerate((('#1', (0.0, -0.105)), ('#2', (-0.105, 0.04)))):
        tt = font_to_mesh(text('tz_port', lbl, 0.012, (p[0], p[1], zt + 0.0015), (0, 0, 0), M.white, extrude=0.0003))
        tt.parent = holder
    # microscope
    ms = empty('tz_microscope', (0.55, 0.05, 0), (0, 0, rad(-25)), parent=root)
    W = M.white
    box('ms_base', (0.17, 0.22, 0.04), (0, 0, 0.02), W, bev=0.012, parent=ms)
    box('ms_pillar', (0.06, 0.06, 0.26), (0, 0.08, 0.16), W, bev=0.015, parent=ms)
    box('ms_arm', (0.06, 0.12, 0.06), (0, 0.04, 0.3), W, bev=0.015, rot=(rad(-10), 0, 0), parent=ms)
    box('ms_stage', (0.13, 0.12, 0.012), (0, -0.02, 0.15), M.black, bev=0.003, parent=ms)
    box('ms_slide', (0.075, 0.025, 0.002), (0, -0.02, 0.157), M.acrylic, bev=0, parent=ms)
    cyl('ms_turret', 0.03, 0.02, (0, -0.02, 0.26), M.black, segs=24, parent=ms)
    for k in range(3):
        a = k * TAU / 3
        cyl('ms_obj', 0.008, 0.045, (0.018 * math.cos(a), -0.02 + 0.018 * math.sin(a), 0.235), M.chrome, segs=12, parent=ms)
    cyl('ms_tube', 0.02, 0.14, (0, 0.0, 0.34), M.black, segs=24, rot=(rad(-35), 0, 0), parent=ms)
    for s in (-1, 1):
        cyl('ms_eyepiece', 0.011, 0.06, (s * 0.022, -0.04, 0.42), M.black, segs=16, rot=(rad(-40), 0, 0), parent=ms)
    for s in (-1, 1):
        cyl('ms_knob', 0.022, 0.012, (s * 0.04, 0.08, 0.13), M.black, segs=24, rot=(0, rad(90), 0), parent=ms)
    sphere('ms_light', 0.01, (0, -0.02, 0.135), M.led_white, segs=12, rings=6, parent=ms)


# ---------------------------------------------------------------- 05 O-RAN testbed

def oran(root):
    tw = empty('or_tower', (-0.36, 0.08, 0), (0, 0, rad(6)), parent=root)
    box('or_tower_body', (0.29, 0.1, 0.3), (0, 0, 0.15), M.black, bev=0.006, parent=tw)
    sticker = img_mat('or_sticker', 'or-usrp.webp', crop=(0.255, 0.0, 0.47, 0.74), r=0.4)
    plane('or_sticker', 0.12, 0.23, (-0.06, -0.0505, 0.155), sticker, rot=(rad(90), 0, 0), parent=tw)
    box('or_front', (0.006, 0.1, 0.3), (0.146, 0, 0.15), M.dark_grey, bev=0.002, parent=tw)
    for k in range(2):
        box('or_usb', (0.004, 0.014, 0.006), (0.149, -0.02 + k * 0.02, 0.25), M.cable_blue, bev=0, parent=tw)
    sphere('or_pwr', 0.004, (0.149, 0.03, 0.27), M.led_white, segs=8, rings=4, parent=tw)
    # USRP B210 with two whip antennas
    us = empty('or_usrp', (0.02, -0.05, 0), (0, 0, rad(-12)), parent=root)
    box('or_usrp_body', (0.17, 0.11, 0.04), (0, 0, 0.02), mat('usrp_white', (0.82, 0.83, 0.85), r=0.3, m=0.4), bev=0.005, parent=us)
    t = font_to_mesh(text('or_usrp_t', 'techphosis', 0.016, (0.0, 0.0, 0.0405), (0, 0, 0), mat('purple', (0.32, 0.12, 0.5), r=0.4), extrude=0.0002,
                          fname='Arial Rounded Bold.ttf'))
    t.parent = us
    sphere('or_usrp_led', 0.003, (-0.07, -0.056, 0.03), M.led_green, segs=8, rings=4, parent=us)
    for s in (-1, 1):
        a = empty('or_ant', (0.088, s * 0.03, 0.03), (rad(-s * 12), rad(-8), 0), parent=us)
        cyl('or_sma', 0.004, 0.012, (0.0, 0, 0), M.gold, segs=12, rot=(0, rad(90), 0), parent=a)
        cyl('or_ant_hinge', 0.007, 0.03, (0.01, 0, 0.012), M.black, segs=16, parent=a)
        cyl('or_ant_rod', 0.0055, 0.2, (0.01, 0, 0.125), M.black, segs=16, r2=0.0045, parent=a)
    cable('or_eth', [(-0.25, 0.1, 0.05), (-0.15, 0.08, 0.005), (-0.06, -0.02, 0.005), (0.0, -0.06, 0.02)], 0.0025, M.cable_blue, parent=root)
    scr = img_mat('scr_oran', 'or-arch.webp', crop=(0.07, 0.0, 0.93, 1.0), emit=0.8)
    mon = monitor('or_monitor', (0, 0, 0), 0, scr)
    mon.parent, mon.location, mon.rotation_euler = root, (0.36, 0.17, 0), (0, 0, rad(-8))
    kb = empty('or_kb', (0.32, -0.16, 0), (0, 0, rad(-6)), parent=root)
    box('kb_base', (0.38, 0.13, 0.018), (0, 0, 0.009), M.dark_grey, bev=0.004, parent=kb)
    key = mat('key', (0.05, 0.05, 0.055), r=0.55)
    for i in range(14):
        for j in range(4):
            box('kb_key', (0.021, 0.021, 0.006), (-0.17 + i * 0.026, -0.042 + j * 0.026, 0.02), key, bev=0.002, parent=kb)
    sphere('mouse', 0.03, (0.6, -0.15, 0.012), M.dark_grey, scale=(0.7, 1.1, 0.45), parent=root)


# ---------------------------------------------------------------- 06 DEMS

def dems(root):
    lp = empty('de_laptop', (-0.36, 0.0, 0), (0, 0, rad(18)), parent=root)
    box('lp_base', (0.33, 0.23, 0.014), (0, 0, 0.007), M.alu, bev=0.005, parent=lp)
    box('lp_deck', (0.29, 0.11, 0.002), (0, 0.035, 0.0145), M.dark_grey, bev=0, parent=lp)
    box('lp_pad', (0.1, 0.06, 0.001), (0, -0.065, 0.0145), mat('lp_pad', (0.6, 0.6, 0.62), r=0.3, m=0.6), bev=0, parent=lp)
    lid = empty('lp_lid', (0, 0.112, 0.012), (rad(105), 0, 0), parent=lp)
    box('lp_lid_shell', (0.33, 0.22, 0.007), (0, 0.11, -0.0035), M.alu, bev=0.004, parent=lid)
    scr = img_mat('scr_dems_logs', 'de-logs.webp', crop=(0.11, 0.0, 0.89, 1.0), emit=2.2)
    plane('lp_screen', 0.3, 0.19, (0, 0.11, 0.0002), scr, parent=lid)
    # STM32MP135F-DK on an acrylic easel
    st = empty('de_board', (0.06, -0.02, 0), (0, 0, rad(-6)), parent=root)
    box('de_easel_base', (0.17, 0.12, 0.008), (0, 0.02, 0.004), M.acrylic, bev=0.002, parent=st)
    brd = empty('de_pcb', (0, 0.0, 0.07), (rad(62), 0, 0), parent=st)
    box('de_pcb_board', (0.15, 0.11, 0.0016), (0, 0, 0), M.pcb_blue, bev=0.0006, parent=brd)
    box('de_lcd_frame', (0.118, 0.074, 0.006), (0, 0.012, 0.004), M.black, bev=0.0015, parent=brd)
    lcd = img_mat('scr_dems', 'de-board.webp', crop=(0.07, 0.02, 0.89, 0.63), emit=2.4)
    plane('de_lcd', 0.106, 0.06, (0, 0.012, 0.0072), lcd, parent=brd)
    for k in range(8):
        sphere('de_led', 0.0018, (-0.06 + k * 0.006, -0.035, 0.0015), M.led_red if k % 3 else M.led_green, segs=6, rings=4, parent=brd)
    for k in range(3):
        cyl('de_btn', 0.004, 0.004, (0.0 + k * 0.012, -0.04, 0.002), M.cable_blue if k != 1 else M.black, segs=12, parent=brd)
    box('de_dip', (0.018, 0.008, 0.004), (0.045, -0.04, 0.002), M.red, bev=0.0005, parent=brd)
    for s in (-1, 1):
        box('de_header', (0.004, 0.08, 0.006), (s * 0.07, 0.01, 0.0035), M.black, bev=0.0005, parent=brd)
    for k, c in enumerate((M.cable_black, M.cable_red)):
        cable('de_usb', [(0.075, 0.05 + k * 0.01, 0.07), (0.12, 0.06, 0.02), (0.2, 0.12, 0.004), (0.3, 0.2, 0.004)], 0.0022, c, parent=st)
    # Echo Dot with clock
    ec = empty('de_echo', (0.38, -0.02, 0), parent=root)
    sphere('echo_body', 0.05, (0, 0, 0.044), mat('echo_fabric', (0.14, 0.16, 0.19), r=0.85, sheen=0.7, bump=0.15, nscale=400), segs=48, rings=24,
           scale=(1, 1, 0.9), parent=ec)
    cyl('echo_top', 0.032, 0.004, (0, 0, 0.088), M.dark_grey, segs=32, parent=ec)
    torus('echo_ring', 0.04, 0.0025, (0, 0, 0.006), M.led_cyan, segs=40, rsegs=6, parent=ec)
    clock = mat('echo_clock', (1, 1, 1), emis=(0.95, 0.97, 1.0), es=8)
    t = font_to_mesh(text('echo_time', '12:23', 0.02, (0, -0.0505, 0.046), (rad(90), 0, 0), clock, extrude=0.0003, fname='Arial Rounded Bold.ttf'))
    t.parent = ec


# ---------------------------------------------------------------- 07 WaterBot (in a tank)

def waterbot(root):
    TW, TD, TH, base = 0.98, 0.52, 0.42, 0.025
    box('wb_tank_base', (TW + 0.01, TD + 0.01, base), (0, 0, base / 2), M.black, bev=0.004, parent=root)
    th = 0.008
    for (sx, sy, px, py) in ((TW, th, 0, -TD / 2), (TW, th, 0, TD / 2), (th, TD, -TW / 2, 0), (th, TD, TW / 2, 0)):
        box('wb_tank_glass', (sx, sy, TH), (px, py, base + TH / 2), mat('tank_glass', (0.96, 0.99, 1.0), r=0.01, trans=1.0, ior=1.15), bev=0.001, parent=root)
    for (sx, sy, px, py) in ((TW + 0.012, 0.014, 0, -TD / 2), (TW + 0.012, 0.014, 0, TD / 2), (0.014, TD, -TW / 2, 0), (0.014, TD, TW / 2, 0)):
        box('wb_tank_rim', (sx, sy, 0.012), (px, py, base + TH), M.black, bev=0.002, parent=root)
    wl = base + 0.25
    box('wb_water', (TW - 0.018, TD - 0.018, wl - base), (0, 0, (wl + base) / 2), M.water, bev=0.0, parent=root)
    box('wb_gravel', (TW - 0.018, TD - 0.018, 0.02), (0, 0, base + 0.01), mat('gravel', (0.55, 0.5, 0.42), r=0.9, bump=0.6, nscale=120, cvar=0.2), bev=0, parent=root)
    # floating debris near the intake
    for k, (c, p) in enumerate(((M.red, (-0.2, -0.17)), (M.cable_blue, (0.25, -0.2)), (M.yellow, (0.05, -0.21)), (M.white, (-0.33, -0.12)))):
        cyl('wb_cap', 0.014, 0.01, (p[0], p[1], wl), c, segs=16, rot=(rng.uniform(-0.3, 0.3), rng.uniform(-0.3, 0.3), 0), parent=root)
    cyl('wb_bottle', 0.02, 0.09, (0.33, -0.12, wl + 0.004), mat('pet', (0.75, 0.9, 0.95), r=0.05, trans=0.9), segs=20, rot=(0, rad(88), rad(30)), parent=root)
    # the boat: open foam-board box, intake facing the visitor
    bt = empty('wb_boat', (0.0, 0.06, wl - 0.055), (0, 0, rad(-4)), parent=root)
    L, Wd, Hh, t = 0.44, 0.26, 0.17, 0.008
    F = M.foam
    box('wb_floor', (L, Wd, t), (0, 0, t / 2), F, bev=0.002, parent=bt)
    box('wb_hull_blue', (L + 0.004, Wd + 0.004, 0.035), (0, 0, 0.017), mat('wb_blue', (0.08, 0.35, 0.65), r=0.6), bev=0.003, parent=bt)
    box('wb_back', (L, t, Hh), (0, Wd / 2 - t / 2, Hh / 2), F, bev=0.002, parent=bt)
    for s in (-1, 1):
        box('wb_side', (t, Wd, Hh), (s * (L / 2 - t / 2), 0, Hh / 2), F, bev=0.002, parent=bt)
    lid = empty('wb_lid', (0, 0, Hh), parent=bt)
    box('wb_lid_board', (L + 0.03, Wd + 0.04, t), (0, -0.01, t / 2), F, bev=0.002, parent=lid)
    for s in (-1, 1):
        box('wb_redtape', (0.012, 0.03, 0.012), (s * (L / 2 + 0.008), -Wd / 2 - 0.02, 0.0), M.redtape, bev=0.001, parent=lid)
        box('wb_redtape_side', (0.004, 0.012, 0.04), (s * (L / 2 + 0.001), -Wd / 2 + 0.01, -0.03), M.redtape, bev=0.0, parent=lid)
    box('wb_plate', (0.24, 0.13, 0.004), (0.02, 0.01, t + 0.002), M.black, bev=0.001, parent=lid)
    box('wb_uno', (0.069, 0.053, 0.0016), (-0.05, 0.0, t + 0.006), M.pcb_blue, bev=0.0005, parent=lid)
    box('wb_uno_usb', (0.016, 0.012, 0.011), (-0.078, 0.012, t + 0.012), M.alu, bev=0.001, parent=lid)
    box('wb_uno_jack', (0.013, 0.009, 0.011), (-0.078, -0.016, t + 0.012), M.black, bev=0.001, parent=lid)
    box('wb_uno_chip', (0.035, 0.008, 0.004), (-0.04, -0.01, t + 0.009), M.black, bev=0.0005, parent=lid)
    for s in (-1, 1):
        box('wb_uno_hdr', (0.05, 0.0025, 0.008), (-0.045, s * 0.024, t + 0.011), M.black, bev=0.0005, parent=lid)
    box('wb_lora', (0.04, 0.035, 0.0016), (0.04, 0.02, t + 0.006), M.pcb_black, bev=0.0005, parent=lid)
    box('wb_lora_can', (0.016, 0.016, 0.003), (0.04, 0.02, t + 0.008), M.alu, bev=0.0005, parent=lid)
    lathe('wb_lora_spring', [(0.004, 0.0), (0.004, 0.035)], (0.06, 0.035, t + 0.007), M.chrome, segs=8, parent=lid)
    cyl('wb_lora_ant', 0.003, 0.09, (0.06, 0.035, t + 0.05), M.matte_black, segs=10, parent=lid)
    box('wb_hc05', (0.028, 0.015, 0.0016), (0.1, -0.02, t + 0.006), M.pcb_blue, bev=0.0005, parent=lid)
    sphere('wb_hc05_led', 0.002, (0.11, -0.025, t + 0.008), M.led_red, segs=6, rings=4, parent=lid)
    box('wb_solar', (0.14, 0.09, 0.004), (0.0, 0.085, t + 0.02), mat('solar', (0.02, 0.04, 0.12), r=0.15, coat=0.8, m=0.3), bev=0.001,
        rot=(rad(-12), 0, 0), parent=lid)
    jw = (M.cable_red, M.cable_yellow, M.cable_blue, M.cable_black, mat('jw_green', (0.05, 0.5, 0.1), r=0.4))
    for k in range(6):
        a = (-0.03 + k * 0.006, 0.026, t + 0.012)
        b = (0.03 + (k % 3) * 0.01, 0.0 + (k // 3) * 0.03, t + 0.008)
        mid = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 0.01, t + 0.04 + k * 0.004)
        cable('wb_jumper', [a, mid, b], 0.0012, jw[k % len(jw)], parent=lid, res=8)
    # inside: two batteries and wiring
    for s in (-1, 1):
        box('wb_batt', (0.06, 0.05, 0.09), (s * 0.15, 0.06, 0.054), M.black, bev=0.003, parent=bt)
        box('wb_batt_term', (0.008, 0.006, 0.005), (s * 0.15 - 0.015, 0.06, 0.1015), M.red, bev=0.001, parent=bt)
        cable('wb_wire', [(s * 0.15 - 0.015, 0.06, 0.104), (s * 0.08, 0.02, 0.15), (s * 0.02, -0.02, 0.06), (0.0, -0.05, 0.012)], 0.0018,
              M.cable_red if s < 0 else M.cable_black, parent=bt)
    box('wb_motor', (0.05, 0.03, 0.03), (0.0, 0.08, 0.025), M.alu, bev=0.004, parent=bt)
    # mesh intake flap hinged at the front bottom edge
    flap = empty('wb_flap', (0, -Wd / 2, 0.01), (rad(-28), 0, 0), parent=bt)
    box('wb_flap_mesh', (L - 0.01, 0.13, 0.003), (0, -0.065, 0), mat('mesh', (0.45, 0.47, 0.5), r=0.35, m=0.7), bev=0.0005, parent=flap)
    box('wb_flap_edge', (L - 0.01, 0.01, 0.006), (0, -0.13, 0), M.alu, bev=0.001, parent=flap)


# ---------------------------------------------------------------- 08 Sewer skimmer

def skimmer(root):
    C = M.concrete
    box('ss_base', (0.72, 0.42, 0.05), (0, 0, 0.025), C, bev=0.006, parent=root)
    box('ss_backwall', (0.72, 0.04, 0.3), (0, 0.19, 0.2), C, bev=0.006, parent=root)
    box('ss_frontwall', (0.72, 0.04, 0.09), (0, -0.19, 0.095), C, bev=0.006, parent=root)
    algae = mat('algae', (0.08, 0.14, 0.07), r=0.7, cvar=0.3, nscale=30)
    box('ss_algae', (0.72, 0.002, 0.03), (0, 0.169, 0.13), algae, bev=0, parent=root)
    box('ss_water', (0.72, 0.34, 0.07), (0, 0, 0.085), M.murky, bev=0, parent=root)
    cyl('ss_pipe', 0.035, 0.03, (0.22, 0.16, 0.22), mat('pipe', (0.25, 0.26, 0.27), r=0.6), segs=24, rot=(rad(90), 0, 0), parent=root)
    cyl('ss_pipe_in', 0.028, 0.031, (0.22, 0.16, 0.22), M.black, segs=24, rot=(rad(90), 0, 0), parent=root)
    t = font_to_mesh(text('ss_plate', '5G SEWER SKIMMER', 0.014, (0, -0.2105, 0.025), (rad(90), 0, 0), M.gold, extrude=0.0004))
    t.parent = root
    # catamaran
    b = empty('ss_boat', (0.02, -0.01, 0.112), (0, 0, rad(4)), parent=root)
    hullm = mat('ss_hull', (0.62, 0.63, 0.64), r=0.4)
    for s in (-1, 1):
        box('ss_pontoon', (0.3, 0.04, 0.035), (0, s * 0.06, 0.0), hullm, bev=0.01, seg=4, parent=b)
        box('ss_float', (0.03, 0.045, 0.03), (-0.155, s * 0.06, 0.005), M.orange, bev=0.006, parent=b)
    box('ss_deck', (0.24, 0.16, 0.01), (0.01, 0, 0.022), mat('ss_deck', (0.78, 0.78, 0.78), r=0.5), bev=0.002, parent=b)
    for k in range(10):
        box('ss_slat', (0.012, 0.11, 0.004), (0.13 + k * 0.012, 0, 0.012 - k * 0.0045),
            M.dark_grey if k % 2 else mat('ss_slat_l', (0.6, 0.6, 0.6), r=0.5), bev=0, rot=(0, rad(22), 0), parent=b)
    box('ss_body', (0.11, 0.1, 0.045), (-0.02, 0, 0.05), M.teal, bev=0.008, parent=b)
    box('ss_window', (0.002, 0.07, 0.012), (0.036, 0, 0.055), M.led_white, bev=0, parent=b)
    sphere('ss_dome', 0.02, (-0.02, 0, 0.073), M.dark_grey, segs=24, rings=12, scale=(1, 1, 0.8), parent=b)
    cyl('ss_mast', 0.002, 0.08, (-0.08, 0.04, 0.09), M.alu, segs=8, parent=b)
    sphere('ss_mast_led', 0.005, (-0.08, 0.04, 0.132), M.led_cyan, segs=8, rings=4, parent=b)
    box('ss_cam', (0.012, 0.02, 0.012), (0.04, 0, 0.08), M.black, bev=0.002, parent=b)


# ---------------------------------------------------------------- 09 Solar Sailor (Alexa skill)

def solar_sailor(root):
    cyl('sa_table_base', 0.2, 0.022, (0, 0, 0.011), M.black, segs=48, bev=0.006, parent=root)
    cyl('sa_table_post', 0.025, 0.58, (0, 0, 0.31), M.black, segs=24, parent=root)
    cyl('sa_table_top', 0.32, 0.035, (0, 0, 0.6175), M.oak, segs=64, bev=0.008, parent=root)
    e = empty('sa_echo', (0, 0, 0.635), parent=root)
    cyl('sa_echo_body', 0.045, 0.15, (0, 0, 0.075), mat('sa_fabric', (0.06, 0.065, 0.07), r=0.85, sheen=0.6, bump=0.15, nscale=400), segs=48, bev=0.004, parent=e)
    cyl('sa_echo_cap', 0.043, 0.004, (0, 0, 0.152), M.dark_grey, segs=48, parent=e)
    ring = mat('sa_ring', (1.0, 0.85, 0.2), emis=(1.0, 0.82, 0.22), es=12)
    torus('sa_echo_ring', 0.042, 0.003, (0, 0, 0.152), ring, segs=48, rsegs=6, parent=e)
    halo = mat('sa_halo', (1.0, 0.85, 0.3), emis=(1.0, 0.82, 0.3), es=2.5)
    for k, r in enumerate((0.1, 0.16, 0.23)):
        torus('sa_halo', r, 0.0012, (0, 0, 0.16 + k * 0.006), halo, segs=64, rsegs=4, parent=e)
    light('sa_glow', 'POINT', (0, 0, 0.25), 3, (1.0, 0.8, 0.3), size=0.05, parent=e)
    # floor lamp beside it
    fl = empty('sa_lamp', (0.45, 0.25, 0), parent=root)
    cyl('fl_base', 0.15, 0.02, (0, 0, 0.01), M.black, segs=40, bev=0.005, parent=fl)
    cyl('fl_pole', 0.01, 1.45, (0, 0, 0.745), M.black, segs=12, parent=fl)
    shade = mat('lamp_shade', (0.95, 0.92, 0.85), r=0.8, sss=0.4, emis=(1.0, 0.8, 0.55), es=0.25)
    lathe('fl_shade', [(0.12, 1.38), (0.2, 1.62), (0.2, 1.621), (0.12, 1.381)], (0, 0, 0), shade, segs=48, parent=fl)
    light('fl_light', 'POINT', (0, 0, 1.5), 45, (1.0, 0.75, 0.48), size=0.1, parent=fl)


# ---------------------------------------------------------------- placement

PROJECTS = {
    # id: (builder, world location, rot z)
    'ba': (birds_ai, (X0 + 0.42, 0.95, BENCH), rad(90)),
    'sw': (swarm, (X0 + 0.42, -0.75, BENCH), rad(90)),
    'tz': (thz, (-2.05, Y1 - 0.42, BENCH), 0.0),
    'or': (oran, (-0.15, Y1 - 0.42, BENCH), 0.0),
    'de': (dems, (1.75, Y1 - 0.45, BENCH), 0.0),
    'wb': (waterbot, (X1 - 0.42, 0.85, BENCH), rad(-90)),
    'ss': (skimmer, (X1 - 0.42, -0.75, BENCH), rad(-90)),
    'ne': (nephele, (0.0, 0.3, 0.0), 0.0),
    'sa': (solar_sailor, (2.35, -1.7, 0.0), rad(-20)),
}


def build_all():
    roots = {}
    for pid, (fn, loc, rz) in PROJECTS.items():
        collection('proj_' + pid)
        r = empty('proj_' + pid, loc, (0, 0, rz))
        fn(r)
        roots[pid] = r
    return roots

