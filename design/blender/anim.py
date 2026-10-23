"""Hand-shaped motion. Every curve is sampled per frame so glTF export keeps it exactly.

Bird's AI take-off (5 s at 24 fps, loops): props spool up, the body squats (anticipation),
lifts with an overshoot, hovers with a lazy bob and drift, lands with a little squash, props spin down.
"""
import math
import bpy

D = bpy.data
FPS = 24


def smooth(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def ease_out_back(t, s=1.6):
    t = max(0.0, min(1.0, t)) - 1
    return 1 + t * t * ((s + 1) * t + s)


def ease_in_out(t):
    t = max(0.0, min(1.0, t))
    return 0.5 - 0.5 * math.cos(math.pi * t)


def seg(f, a, b):
    return (f - a) / (b - a)


def drone_pose(f):
    """Returns (dz, pitch, roll, yaw, prop_speed 0..1) for frame f of 0..120."""
    dz = pitch = roll = yaw = 0.0
    # prop speed envelope
    if f < 22:
        sp = ease_in_out(seg(f, 0, 22))
    elif f < 100:
        sp = 1.0
    else:
        sp = 1 - ease_in_out(seg(f, 100, 120))
    H = 0.34
    if f < 12:
        pass
    elif f < 22:                                  # anticipation: squat and tip back
        k = math.sin(math.pi * seg(f, 12, 22))
        dz = -0.007 * k
        pitch = math.radians(-2.5) * k
    elif f < 44:                                  # lift with overshoot
        t = seg(f, 22, 44)
        dz = H * ease_out_back(t, 1.9)
        pitch = math.radians(3.0) * math.sin(math.pi * t)
        roll = math.radians(1.5) * math.sin(2 * math.pi * t)
    elif f < 84:                                  # hover: bob + drift (secondary motion)
        t = (f - 44) / FPS
        dz = H + 0.012 * math.sin(2 * math.pi * 0.55 * t)
        pitch = math.radians(2.2) * math.sin(2 * math.pi * 0.35 * t + 0.8)
        roll = math.radians(2.8) * math.sin(2 * math.pi * 0.27 * t)
        yaw = math.radians(8) * math.sin(2 * math.pi * 0.2 * t)
    elif f < 100:                                 # descend, slowing before touchdown
        t = seg(f, 84, 100)
        start = H + 0.012 * math.sin(2 * math.pi * 0.55 * (40 / FPS))
        dz = start * (1 - smooth(t) ** 0.8)
        yaw = math.radians(8) * math.sin(2 * math.pi * 0.2 * (40 / FPS)) * (1 - smooth(t))
        pitch = math.radians(-2.0) * math.sin(math.pi * t)
    elif f < 108:                                 # touchdown squash and recover
        t = seg(f, 100, 108)
        dz = -0.006 * math.sin(math.pi * t) * (1 - t * 0.3)
    return dz, pitch, roll, yaw, sp


def animate_drone(frames=120):
    d = D.objects['ba_drone']
    props = [o for o in D.objects if o.name.startswith('ba_prop')]
    base = [p.rotation_euler.z for p in props]
    d.animation_data_clear()
    for p in props:
        p.animation_data_clear()
    ang = 0.0
    max_rps = 9.0  # rendered spin; fast enough to read as motion, slow enough to avoid strobing at 24 fps
    for f in range(frames + 1):
        dz, pitch, roll, yaw, sp = drone_pose(f)
        d.location = (0, 0, dz)
        d.rotation_euler = (pitch, roll, yaw)
        d.keyframe_insert('location', frame=f)
        d.keyframe_insert('rotation_euler', frame=f)
        ang += sp * max_rps * math.tau / FPS
        for i, p in enumerate(props):
            sgn = 1 if i % 2 == 0 else -1
            p.rotation_euler.z = base[i] + sgn * ang
            p.keyframe_insert('rotation_euler', index=2, frame=f)
    if d.animation_data and d.animation_data.action:
        d.animation_data.action.name = 'ba_takeoff'
    sc = bpy.context.scene
    sc.frame_start, sc.frame_end = 0, frames
    sc.render.fps = FPS


def apply():
    animate_drone()
