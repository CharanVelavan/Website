// ===================== the lab: one workshop room; walk round it freely, or scroll for the tour =====================
// The room is modelled and lit in Blender (design/blender) and baked: every surface carries its rendered light, so the page
// draws it unlit. LABMETA (written by bake.py) gives each project's place, size and facing in three.js axes.
// Drag to look round, click the floor to walk there, click a project for its overview; scrolling plays the tour.
const [{ default: CameraControls }, { GLTFLoader }, { DRACOLoader }] = await Promise.all([import('camera-controls'), import('three/addons/loaders/GLTFLoader.js'), import('three/addons/loaders/DRACOLoader.js')]);
CameraControls.install({ THREE });
const dracoLoader = new DRACOLoader(); dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/gltf/');
const LM = LABMETA.projects;
const SHELF_Y = 1.7375, SHELF_Z = -2.46;
// each project: P where it stands, F the point a close-up frames, out the way it faces, top its label height above P,
// dist how far back its close-up stands, box its pick box (the drone's grows upward so a hovering drone still picks)
const EXHIBITS = {};
Object.entries(LM).forEach(([id, m]) => {
  // Blender's y flips into three's z, so the exported min/max come out swapped on that axis
  [0, 1, 2].forEach((k) => { if (m.min[k] > m.max[k]) [m.min[k], m.max[k]] = [m.max[k], m.min[k]]; });
  const size = Math.max(m.max[0] - m.min[0], m.max[1] - m.min[1], m.max[2] - m.min[2]);
  EXHIBITS[id] = { P: m.pos, F: m.center, out: [m.facing[0], m.facing[2]], top: m.max[1] - m.pos[1], dist: 0.55 + size * 1.45, box: [m.min, id === 'ba' ? [m.max[0], m.max[1] + 0.42, m.max[2]] : m.max] };
});
EXHIBITS.ne.dist = 2.5; EXHIBITS.ss.dist *= 1.2;
// the side benches sit under pendant lamps: keep those cameras below the shades
['ba', 'wb'].forEach((id) => { EXHIBITS[id].lift = EXHIBITS[id].plift = 0.02; }); EXHIBITS.ne.F = [EXHIBITS.ne.F[0], 1.0, EXHIBITS.ne.F[2]];
EXHIBITS.ba.F = [EXHIBITS.ba.F[0], EXHIBITS.ba.F[1] + 0.12, EXHIBITS.ba.F[2]];
// phone, O-RAN: a portrait frame must stand far back, right over the Nephele heads; it stands off to the right instead,
// below the pendant shades, and looks across at the radio and monitor
EXHIBITS.or.phoneKey = [[1.55, 1.72, 0.1], [-0.12, 1.16, -2.2]];
['p10', 'p11', 'p12'].forEach((id, k) => {
  const x = 2.48 + k * 0.27;
  EXHIBITS[id] = { P: [x, SHELF_Y, SHELF_Z], F: [x, SHELF_Y + 0.1, SHELF_Z], out: [0, 1], top: 0.22, dist: 1.0, small: true, box: [[x - 0.12, SHELF_Y, SHELF_Z - 0.11], [x + 0.12, SHELF_Y + 0.21, SHELF_Z + 0.11]] };
});
const exV = (id, k) => { const a = EXHIBITS[id][k]; return a && V3(a[0], a[1], a[2]); };
const exOut = (id) => { const o = EXHIBITS[id].out; return V3(o[0], 0, o[1]).normalize(); };
// the tour, in the order of the numbers on the labels: the room, then each project, the shelf, and a step back
const TOUR = ['over', 'ba', 'ne', 'sw', 'tz', 'or', 'de', 'wb', 'ss', 'sa', 'shelf', 'back'];
const SHELF_IDS = ['p10', 'p11', 'p12'];
// a close-up of one project. tour: it sits right of the chapter card; panel: left of the overview panel; phone: centred
function keyFor(id, mode) {
  const e = EXHIBITS[id], ph = narrow(), out = exOut(id), right = V3(out.z, 0, -out.x);
  // a phone stands further back, so it looks down over Nephele; lift / plift set how steeply it looks down (desktop / phone) per exhibit
  if (ph && e.phoneKey) return { pos: V3(...e.phoneKey[0]), look: V3(...e.phoneKey[1]) };
  const F = exV(id, 'F'), dist = e.dist * (ph ? 1.45 : 1);
  const pos = F.clone().addScaledVector(out, dist).add(V3(0, 0.22 + dist * (ph ? e.plift ?? 0.36 : e.lift ?? 0.22), 0));
  const look = F.clone().addScaledVector(right, ph ? 0 : mode === 'panel' ? dist * 0.17 : -dist * 0.2);
  return { pos, look };
}
// the wide views match the Blender cameras the look was signed off from
function stopKey(name) {
  const ph = narrow();
  if (name === 'over') return ph ? { pos: V3(1.2, 8.6, 9.6), look: V3(0, 0.4, -0.4) } : { pos: V3(3.3, 4.0, 5.9), look: V3(-0.25, 0.75, -0.7) };
  if (name === 'back') return ph ? { pos: V3(-1.2, 8.4, 9.4), look: V3(0, 0.4, -0.4) } : { pos: V3(-3.4, 3.7, 5.6), look: V3(0.4, 0.8, -0.8) };
  if (name === 'shelf') return ph ? { pos: V3(2.75, 2.3, -0.3), look: V3(2.75, 1.82, SHELF_Z) } : { pos: V3(1.7, 1.95, -0.6), look: V3(2.45, 1.8, SHELF_Z) };
  // a project stop shows its overview, so the project stands beside the panel (above the sheet on a phone)
  return keyFor(name, CASES[name] ? 'panel' : 'tour');
}

// ---------- the room: the baked model, plus invisible stand-ins to pick, walk on and bump into ----------
const labRoom = { walls: [], walkables: [], picks: [], nodes: {}, ready: false, mixer: null, clipDur: 5, baT: 0, base: {} };
function buildRoom(g) {
  const inv = new THREE.MeshBasicMaterial({ visible: false });
  const proxy = (w, h, d, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), inv); m.position.set(x, y, z); g.add(m); return m; };
  labRoom.walkables = [proxy(7.0, 0.02, 5.2, 0, -0.01, 0), proxy(7.0, 0.02, 0.8, 0, 0.89, -2.2), proxy(0.8, 0.02, 3.6, -3.1, 0.89, -0.4), proxy(0.8, 0.02, 3.6, 3.1, 0.89, -0.4)];
  labRoom.walls = [proxy(7.3, 2.8, 0.15, 0, 1.4, -2.675), proxy(0.15, 2.8, 5.35, -3.575, 1.4, 0), proxy(0.15, 2.8, 5.35, 3.575, 1.4, 0)];
  Object.entries(EXHIBITS).forEach(([id, e]) => { const [a, b] = e.box; const m = proxy(b[0] - a[0] + 0.06, b[1] - a[1] + 0.04, b[2] - a[2] + 0.06, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2); m.userData.id = id; labRoom.picks.push(m); });
  // the room decodes with its own Draco and KTX2 workers, shut once it's on the GPU: their WebAssembly heaps grow to fit
  // the 8K atlases and never shrink (about 400 MB on a phone). The bays keep the shared Draco decoder
  const roomDraco = new DRACOLoader().setDecoderPath(dracoLoader.decoderPath);
  const loader = new GLTFLoader(); loader.setDRACOLoader(roomDraco);
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  // the hero paints first: the room is fetched once the page is idle. Phones get the KTX2 set (half size, GPU-compressed)
  const start = async () => {
    if (LAB_GLB.includes('-phone')) {
      const { KTX2Loader } = await import('three/addons/loaders/KTX2Loader.js');
      // the formats come from the context's extension list, read in the page. detectSupport would ask for six extensions,
      // and a first getExtension is a blocking round trip to the GPU process: 18-30 ms on a phone while the bays load. Only
      // the format used gets enabled, when the first atlas uploads. three 0.160's own pick is off too: it sorts its format
      // list in place for UASTC, so ETC1S took BC7 (16 bytes a block) on phones with it. The atlases are RGB, and ETC2
      // holds ETC1S exactly at half the bytes to upload and half the GPU memory, so the desktop formats count only without it
      const exts = renderer.getContext().getSupportedExtensions() || [], has = (e) => exts.includes(e), etc2 = has('WEBGL_compressed_texture_etc');
      const ktx2 = new KTX2Loader().setWorkerLimit(2).setTranscoderPath('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/basis/');
      ktx2.workerConfig = { astcSupported: has('WEBGL_compressed_texture_astc'), etc1Supported: false, etc2Supported: etc2, dxtSupported: !etc2 && has('WEBGL_compressed_texture_s3tc'), bptcSupported: !etc2 && has('EXT_texture_compression_bptc'), pvrtcSupported: false };
      loader.setKTX2Loader(ktx2);
    }
    // fetched whole rather than through loader.load, whose progress stream copies the 10 MB file chunk by chunk on the main thread
    fetch(LAB_GLB).then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
      .then((buf) => loader.parse(buf, THREE.LoaderUtils.extractUrlBase(LAB_GLB), onRoom, (err) => console.warn('lab model', err))).catch((err) => console.warn('lab model', err));
  };
  // the room's reflection map, baked offline (tools/envbake.js) and decoded off the main thread; null falls back to capturing it here
  let envP = Promise.resolve(null);
  (window.requestIdleCallback ? (f) => requestIdleCallback(f, { timeout: 1200 }) : (f) => setTimeout(f, 200))(() => { if (!ENV_BAKE) envP = loadEnv(); start(); });
  const onRoom = async (gltf) => {

    const glossy = [], glass = [];
    gltf.scene.traverse((o) => {
      labRoom.nodes[o.name] = o;
      if (!o.isMesh) return;
      const m = o.material, ga = o.geometry.attributes;
      if ((m.name || '').startsWith('glass_')) {
        if (!ga.normal) o.geometry.computeVertexNormals(); o.renderOrder = 2;
        o.material = new THREE.MeshPhysicalMaterial({ color: m.color, transparent: true, opacity: m.opacity, roughness: 0.04, metalness: 0, depthWrite: false, fog: false, envMapIntensity: 0.6 }); glass.push(o);
      } else {
        if (m.map) m.map.anisotropy = aniso; o.material = new THREE.MeshBasicMaterial({ map: m.map, toneMapped: false, fog: false });
        if (ga.color && ga.normal) { o.geometry.setAttribute('gloss', ga.color); o.geometry.deleteAttribute('color'); glossy.push(o); }
      }
    });
    // while the hero still covers the screen: upload the atlases (before anything draws the room, which would upload them
    // in one piece), then the reflection map, then the shaders and vertex buffers, so the first lab frame doesn't stall
    const maps = new Set(); gltf.scene.traverse((o) => { if (o.isMesh && o.material.map) maps.add(o.material.map); });
    for (const t of maps) { if (t.isCompressedTexture) await uploadInBands(t); else renderer.initTexture(t); }
    roomDraco.dispose(); if (loader.ktx2Loader) loader.ktx2Loader.dispose();
    let env = await envP;
    if (env) { await nextFrame(); renderer.initTexture(env); } else env = captureEnv(gltf.scene);
    addGloss(env, glossy, glass);
    g.add(gltf.scene);
    await warmRoom(gltf.scene);
    // the moving parts remember where they rest
    ['ne2_head', 'ne3_head', 'wb_boat', 'ss_boat', 'sw_fleet', 'sa_halo', 'tz_holder'].forEach((n) => { const o = labRoom.nodes[n]; if (o) labRoom.base[n] = { p: o.position.clone(), q: o.quaternion.clone(), s: o.scale.clone() }; });
    if (gltf.animations.length) {
      labRoom.mixer = new THREE.AnimationMixer(gltf.scene);
      gltf.animations.forEach((c) => { labRoom.clipDur = Math.max(1, c.duration); labRoom.mixer.clipAction(c).play(); });
      labRoom.mixer.setTime(0);
    }
    labRoom.ready = true; document.body.classList.add('lab-ready');
  };
}
// A compressed atlas goes to the GPU a band of rows at a time, about 1 MB a frame: in one piece a 4096 atlas held a
// phone's main thread for a quarter second while the hero played. The finished texture is handed to three as uploaded.
const BAND_BYTES = 1 << 20;
let glUtils = null;
// one band a frame can still outrun the GPU process: Chrome's transfer buffer fills and a later call blocks for 30-50 ms.
// So the next band waits (a frame at a time) until the GPU has taken the one before last, leaving two in flight
const bandFences = [];
async function bandDone(gl) {
  bandFences.push(gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0)); gl.flush();
  do {
    await new Promise(requestAnimationFrame);
    while (bandFences.length && gl.getSyncParameter(bandFences[0], gl.SYNC_STATUS) === gl.SIGNALED) gl.deleteSync(bandFences.shift());
  } while (bandFences.length > 1);
}
async function uploadInBands(t) {
  const gl = renderer.getContext(), mips = t.mipmaps;
  // block-compressed rows: each mip is whole rows of 4-pixel-high blocks, so a band of rows is one contiguous slice
  const ok = renderer.capabilities.isWebGL2 && mips && mips.length && mips.every((m) => m.data.byteLength % Math.ceil(m.height / 4) === 0);
  if (!ok) { renderer.initTexture(t); return; }
  glUtils = glUtils || new THREE.WebGLUtils(gl, renderer.extensions, renderer.capabilities);
  const fmt = glUtils.convert(t.format, t.colorSpace), tex = gl.createTexture();
  const bind = () => renderer.state.bindTexture(gl.TEXTURE_2D, tex);
  bind(); gl.texStorage2D(gl.TEXTURE_2D, mips.length, fmt, mips[0].width, mips[0].height);
  for (let i = 0; i < mips.length; i++) {
    const m = mips[i], rows = Math.ceil(m.height / 4), rowBytes = m.data.byteLength / rows, step = Math.max(1, Math.floor(BAND_BYTES / rowBytes));
    for (let r = 0; r < rows; r += step) {
      const n = Math.min(step, rows - r);
      bind(); gl.compressedTexSubImage2D(gl.TEXTURE_2D, i, 0, r * 4, m.width, Math.min(n * 4, m.height - r * 4), fmt, m.data.subarray(r * rowBytes, (r + n) * rowBytes));
      if (n * rowBytes >= BAND_BYTES / 2) await bandDone(gl);
    }
  }
  const wrap = { [THREE.RepeatWrapping]: gl.REPEAT, [THREE.ClampToEdgeWrapping]: gl.CLAMP_TO_EDGE, [THREE.MirroredRepeatWrapping]: gl.MIRRORED_REPEAT };
  bind();
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap[t.wrapS]); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap[t.wrapT]);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mips.length > 1 ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
  const af = renderer.extensions.get('EXT_texture_filter_anisotropic'); if (af && t.anisotropy > 1) gl.texParameterf(gl.TEXTURE_2D, af.TEXTURE_MAX_ANISOTROPY_EXT, t.anisotropy);
  const props = renderer.properties.get(t); props.__webglTexture = tex; props.__version = t.version;
  t.mipmaps = []; // the GPU has them; free the CPU copy
}
// reflections: the bake leaves out glossy light, since it changes with where you stand. Each vertex says how its surface
// reflects (r strength, g metallic, b roughness); the room as seen from its middle is prefiltered into an environment
// map (PMREM), and screens, metal, lacquer and the floor add their reflection of it, with Fresnel, on top of the baked light.
// The map is baked offline: the room is static, and capturing it here cost a phone 65-90 ms of frames while the hero played.
// node tools/envbake.js renders it with captureEnv below (the page's ?envbake mode) into models/lab-env.webp: the PMREM
// layout as it sits on the GPU, sRGB 8-bit, rows bottom-up. Re-bake it whenever the room is re-baked.
const LAB_ENV = 'models/lab-env.webp', ENV_BAKE = /[?&]envbake\b/.test(location.search);
const nextFrame = () => new Promise(requestAnimationFrame);
const glossU = { uGloss: { value: 1 } };
function loadEnv() {
  return new THREE.ImageBitmapLoader().setOptions({ imageOrientation: 'none', premultiplyAlpha: 'none', colorSpaceConversion: 'none' }).loadAsync(LAB_ENV).then((bmp) => {
    const t = new THREE.Texture(bmp, THREE.CubeUVReflectionMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter);
    t.colorSpace = THREE.SRGBColorSpace; t.flipY = false; t.generateMipmaps = false; t.needsUpdate = true; return t;
  }).catch((err) => { console.warn('lab reflections: capturing instead', err); return null; });
}
// the capture: the room from its middle into a cube, prefiltered by PMREM. Kept for the bake and as the fallback
function captureEnv(root) {
  const rt = new THREE.WebGLCubeRenderTarget(256, { type: THREE.HalfFloatType });
  const cube = new THREE.CubeCamera(0.05, 30, rt), tmp = new THREE.Scene(), parent = root.parent;
  tmp.add(root); cube.position.set(0, 1.3, 0.2); tmp.add(cube); cube.update(renderer, tmp); if (parent) parent.add(root);
  const pm = new THREE.PMREMGenerator(renderer), out = pm.fromCubemap(rt.texture); pm.dispose(); rt.dispose();
  if (ENV_BAKE) window.__envBake = envPixels(out);
  return out.texture;
}
// for the bake: the PMREM target's pixels, linear half floats on the GPU, as sRGB 8-bit RGBA (rows as read, bottom-up)
function envPixels(rtOut) {
  const { width: w, height: h } = rtOut, half = new Uint16Array(w * h * 4), px = new Uint8ClampedArray(w * h * 4); let max = 0;
  renderer.readRenderTargetPixels(rtOut, 0, 0, w, h, half);
  const c = new THREE.Color();
  for (let i = 0; i < w * h; i++) {
    c.setRGB(...[0, 1, 2].map((k) => THREE.DataUtils.fromHalfFloat(half[i * 4 + k])), THREE.LinearSRGBColorSpace);
    max = Math.max(max, c.r, c.g, c.b); c.convertLinearToSRGB();
    px[i * 4] = Math.round(c.r * 255); px[i * 4 + 1] = Math.round(c.g * 255); px[i * 4 + 2] = Math.round(c.b * 255); px[i * 4 + 3] = 255;
  }
  return { w, h, max, px: Array.from(px) };
}
function addGloss(env, glossy, glass) {
  labRoom.env = env;
  glass.forEach((o) => { o.material.envMap = env; });
  glossy.forEach((o) => {
    const m = o.material; m.envMap = env;
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uGloss = glossU.uGloss;
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute vec4 gloss; varying vec4 vGloss; varying vec3 vWPos; varying vec3 vWN;')
        .replace('#include <fog_vertex>', '#include <fog_vertex>\nvGloss = gloss; vWPos = (modelMatrix * vec4(transformed, 1.0)).xyz; vWN = normalize(mat3(modelMatrix) * objectNormal);');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\n#include <cube_uv_reflection_fragment>\nuniform float uGloss; varying vec4 vGloss; varying vec3 vWPos; varying vec3 vWN;')
        .replace('#include <envmap_fragment>', `if (vGloss.r > 0.004) {
          vec3 V = normalize(vWPos - cameraPosition), N = normalize(vWN);
          float fr = pow(1.0 - clamp(dot(-V, N), 0.0, 1.0), 5.0);
          float k = vGloss.r * mix(0.04 + 0.96 * fr, 1.0, vGloss.g) * uGloss;
          vec3 env = textureCubeUV(envMap, reflect(V, N), clamp(vGloss.b, 0.0, 1.0)).rgb;
          outgoingLight += env * mix(vec3(1.0), clamp(diffuseColor.rgb * 2.5, 0.0, 1.0), vGloss.g) * k;
        }`);
    };
    m.customProgramCacheKey = () => 'labgloss'; m.needsUpdate = true;
  });
}
// so the first lab frame doesn't stall, while the hero still covers the screen: the room's shaders compile in parallel,
// each program's uniform list is read back one a frame, and the vertex buffers go up about 1 MB a frame. The buffers are
// drawn into a tiny target with only that slice of the room showing (the lights stay, so the programs are the ones the
// page will use); each slice is drawn and put back within one task, so the page's own frame never sees it
async function warmRoom(root) {
  try { await renderer.compileAsync(root, camera, scene); } catch (e) {}
  const meshes = []; root.traverse((o) => { if (o.isMesh) meshes.push(o); });
  for (const pr of new Set(meshes.map((o) => renderer.properties.get(o.material).currentProgram).filter(Boolean))) { await nextFrame(); pr.getUniforms(); pr.getAttributes(); }
  const tiny = new THREE.WebGLRenderTarget(4, 4);
  const bytes = (o) => Object.values(o.geometry.attributes).reduce((a, b) => a + b.array.byteLength, o.geometry.index ? o.geometry.index.array.byteLength : 0);
  for (let k = 0; k < meshes.length;) {
    await nextFrame();
    const saved = [];
    const set = (o, v) => { saved.push([o, o.visible, o.frustumCulled]); o.visible = v; o.frustumCulled = false; };
    // everything off the path from the room up to the scene is hidden, but not the lights
    for (let o = root; o.parent; o = o.parent) { set(o, true); o.parent.children.forEach((c) => { if (c !== o && !c.isLight) set(c, false); }); }
    meshes.forEach((o) => set(o, false));
    for (let sum = 0; k < meshes.length && sum < BAND_BYTES; k++) { meshes[k].visible = true; sum += bytes(meshes[k]); }
    renderer.setRenderTarget(tiny); renderer.render(scene, camera); renderer.setRenderTarget(null);
    saved.reverse().forEach(([o, v, f]) => { o.visible = v; o.frustumCulled = f; });
  }
  tiny.dispose();
}
// idle life: the drone flies while it has your attention, the robots look round (and at you), the boats bob, the swarm circles
const qTmp = new THREE.Quaternion(), qYaw = new THREE.Quaternion(), UP = V3(0, 1, 0), vTmp = V3();
function labLife(dt, t, hot) {
  if (!labRoom.ready) return;
  const R = labRoom, n = R.nodes, still = reduced;
  if (R.mixer) {
    const want = hot === 'ba' && !still;
    if (want || R.baT > 0) { R.baT += dt; if (R.baT >= R.clipDur) R.baT = want ? R.baT % R.clipDur : 0; }
    R.mixer.setTime(R.baT);
  }
  if (still) return;
  const yawTo = (name, idle, look) => {
    const o = n[name], b = R.base[name]; if (!o) return;
    let yaw = idle;
    if (look) { o.getWorldPosition(vTmp); const d = camera.position.clone().sub(vTmp); yaw = THREE.MathUtils.clamp(Math.atan2(d.x, d.z) - Math.atan2(EXHIBITS.ne.out[0], EXHIBITS.ne.out[1]), -0.7, 0.7); }
    o.userData.yaw = THREE.MathUtils.lerp(o.userData.yaw || 0, yaw, damp(3, dt));
    o.quaternion.copy(qYaw.setFromAxisAngle(UP, o.userData.yaw)).multiply(b.q);
  };
  yawTo('ne2_head', 0.32 * Math.sin(t * 0.45), hot === 'ne');
  yawTo('ne3_head', 0.26 * Math.sin(t * 0.33 + 1.7), hot === 'ne');
  [['wb_boat', 1.3, 0.006], ['ss_boat', 1.7, 0.004]].forEach(([name, w, a]) => { const o = n[name], b = R.base[name]; if (!o) return; o.position.y = b.p.y + a * Math.sin(t * w); o.quaternion.copy(b.q).multiply(qTmp.setFromAxisAngle(V3(1, 0, 0), 0.025 * Math.sin(t * w * 0.8 + 1))); });
  if (n.sw_fleet) n.sw_fleet.quaternion.copy(R.base.sw_fleet.q).multiply(qTmp.setFromAxisAngle(UP, t * (hot === 'sw' ? 0.35 : 0.08)));
  if (n.sa_halo) n.sa_halo.scale.copy(R.base.sa_halo.s).multiplyScalar(1 + 0.08 * Math.sin(t * (hot === 'sa' ? 4 : 1.6)));
}

// ---------- the layout: the plinths hand their place to the baked exhibits ----------
LAYS.lab = {
  order: plinths.map((_, k) => k), ownTags: true,
  build: buildRoom,
  apply() {
    plinths.forEach((p) => {
      const e = EXHIBITS[p.id]; if (!e) return;
      const out = exOut(p.id); stand(p, exV(p.id, 'P'), Math.atan2(out.x, out.z), 0.01, false);
      p.top = e.top; p.g.visible = false;
    });
    lab.visible = false; drone.visible = false;
  },
  leave() { plinths.forEach((p) => { p.g.visible = true; }); lab.visible = true; drone.visible = true; EX.on = false; EX.w = 0; closePanel(); labTagsHide(); },
  scope(r) { lab.visible = drone.visible = r === 'ba'; },
  over() { const k = stopKey('over'); return { pos: k.pos.clone().sub(k.look).multiplyScalar(1.1).add(k.look), look: k.look }; },
  cam(q) {
    const k = clamp01(q / (TOUR.length - 1)) * (TOUR.length - 1), k0 = Math.floor(Math.min(k, TOUR.length - 1.0001)), u = k - k0;
    const a = stopKey(TOUR[k0]), b = stopKey(TOUR[k0 + 1]); return { pos: lerpV(a.pos, b.pos, u), look: lerpV(a.look, b.look, u) };
  },
  tl() { return narrow() ? { pos: V3(0.3, 11, 7.5), look: V3(0.3, 0, -0.6) } : { pos: V3(-1.2, 7.4, 7.2), look: V3(1.1, 0, -0.3) }; },
  front(q) { if (EX.on) { const id = hoverId || EX.focus; return id ? idxOf(id) : -1; } const id = TOUR[Math.round(q)]; return EXHIBITS[id] ? idxOf(id) : -1; },
  settled(q) { return EX.on || Math.abs(q - Math.round(q)) < 0.25; },
  pinAt(p, n) { const e = EXHIBITS[p.id] || EXHIBITS.p10, out = exOut(p.id in EXHIBITS ? p.id : 'p10'), P = V3(e.P[0], 0, e.P[2]).addScaledVector(out, e.small ? 0.8 : 0.75); return P.add(V3(out.z, 0, -out.x).multiplyScalar(n * 0.24)); },
  camera: labCamera,
  tap: labTap,
  frame: labFrame
};

// ---------- explore: one camera-controls rig, driven by our own input so the page can still scroll ----------
const cc = new CameraControls(camera);
cc.smoothTime = reduced ? 0.0001 : 0.32; cc.draggingSmoothTime = reduced ? 0.0001 : 0.1;
cc.minDistance = 0.35; cc.maxDistance = 10; cc.minPolarAngle = 0.15; cc.maxPolarAngle = 1.5;
cc.setBoundary(new THREE.Box3(V3(-3.2, 0.15, -2.4), V3(3.2, 2.4, 2.4)));
// EX.on: the visitor is driving; w: how much of the camera is theirs (it eases back to the tour when they scroll)
const EX = { on: false, w: 0, anchor: 0, focus: null };
// the page position explore started from: a real scroll moves it, a stale scroll reading (phones, right after a jump) does not
let hoverId = null, lastCam = { pos: V3(0, 5, 8), look: V3() };
const labRange = (sp) => !route && layId === 'lab' && sp > 0.75 && sp < RN_ + 0.35;
function enterExplore() {
  if (EX.on) return;
  cc.colliderMeshes = labRoom.walls || [];
  cc.setLookAt(lastCam.pos.x, lastCam.pos.y, lastCam.pos.z, lastCam.look.x, lastCam.look.y, lastCam.look.z, false); cc.update(0);
  EX.on = true; EX.w = 1; EX.anchor = scrollY; document.body.classList.add('exploring');
}
function leaveExplore() { if (!EX.on) return; EX.on = false; EX.focus = null; closePanel(); document.body.classList.remove('exploring'); }
const tmpP = V3(), tmpT = V3();
function labCamera(cam, dt, sp) {
  if (!labRange(sp) && EX.on) leaveExplore();
  // any scroll hands the camera back to the tour, from wherever the visitor walked
  if (EX.on && Math.abs(scrollY - EX.anchor) > 24) leaveExplore();
  let out = cam;
  if (EX.on || EX.w > 0.001) {
    cc.update(dt); cc.getPosition(tmpP, false); cc.getTarget(tmpT, false);
    if (!EX.on) { EX.w *= 1 - damp(reduced ? 60 : 4, dt); if (EX.w < 0.002) EX.w = 0; }
    const w = ease(EX.w); out = { pos: lerpV(cam.pos, tmpP, w), look: lerpV(cam.look, tmpT, w) };
  }
  lastCam = { pos: out.pos.clone(), look: out.look.clone() };
  return out;
}
// jump the page to a tour stop without the camera sweeping through the stops between
function syncScrollTo(stop) {
  const el = stopsEl.children[stop]; if (!el) return;
  scrollTo({ top: el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2, behavior: 'instant' });
  EX.anchor = scrollY; readScroll(); smoothP = scrollP;
  // a phone can report the old layout on the first frames after the jump; read it again once it has settled
  requestAnimationFrame(() => requestAnimationFrame(() => { readScroll(); smoothP = scrollP; }));
}
function scrollToStop(stop) { const el = stopsEl.children[stop]; if (el) scrollTo({ top: el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2, behavior: smooth() }); }
const tourStopOf = (id) => SHELF_IDS.includes(id) ? TOUR.indexOf('shelf') : TOUR.indexOf(id);
// a project: fly up to it, line the page up with its tour stop, and open its overview
function selectProject(id) {
  if (route || !EXHIBITS[id]) return;
  enterExplore(); syncScrollTo(tourStopOf(id));
  EX.focus = id; const k = keyFor(id, 'panel');
  cc.setLookAt(k.pos.x, k.pos.y, k.pos.z, k.look.x, k.look.y, k.look.z, !reduced);
  openPanel(id); track('lab_select', { id });
}
// walking: a click on the floor or a bench top moves the point you look round to there
const walkRay = new THREE.Raycaster(), walkNdc = new THREE.Vector2();
const marker = new THREE.Mesh(new THREE.RingGeometry(0.12, 0.16, 40), new THREE.MeshBasicMaterial({ color: SLOT.link, transparent: true, opacity: 0, depthWrite: false })); marker.rotation.x = -Math.PI / 2; scene.add(marker); let markerT = 9;
function walkTo(e) {
  walkNdc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); walkRay.setFromCamera(walkNdc, camera);
  const hit = walkRay.intersectObjects(labRoom.walkables || [], false).find((h) => h.face && h.face.normal.clone().transformDirection(h.object.matrixWorld).y > 0.6);
  if (!hit) return;
  enterExplore(); EX.focus = null; closePanel();
  const T = V3(THREE.MathUtils.clamp(hit.point.x, -3.1, 3.1), THREE.MathUtils.clamp(hit.point.y + 0.55, 0.55, 1.5), THREE.MathUtils.clamp(hit.point.z, -2.3, 2.3));
  cc.moveTo(T.x, T.y, T.z, !reduced); if (cc.distance > 3.6) cc.dollyTo(2.6, !reduced);
  marker.position.copy(hit.point).add(V3(0, 0.012, 0)); markerT = 0; track('lab_walk', {});
}
// what the pointer is over: any exhibit, the coming-soon crates included
function pickLab(e) {
  walkNdc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); walkRay.setFromCamera(walkNdc, camera);
  const hit = walkRay.intersectObjects(labRoom.picks, false)[0]; return hit ? hit.object.userData.id : null;
}
function labTap(e) { const id = pickLab(e); if (id) selectProject(id); else walkTo(e); }
// drag to look round, pinch or ctrl + scroll to zoom; a plain scroll still moves the page (the tour)
const lptr = new Map(); let ldrag = null, lpinch = 0;
canvas.addEventListener('pointerdown', (e) => {
  if (!labRange(window.__p || 0)) return; lptr.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (lptr.size === 2) { const [a, b] = [...lptr.values()]; lpinch = Math.hypot(a.x - b.x, a.y - b.y); ldrag = null; return; }
  ldrag = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: 0 };
});
addEventListener('pointermove', (e) => {
  if (lptr.has(e.pointerId)) lptr.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (lptr.size === 2 && lpinch) { const [a, b] = [...lptr.values()], d = Math.hypot(a.x - b.x, a.y - b.y); enterExplore(); cc.dolly((d - lpinch) * 0.012, false); lpinch = d; return; }
  if (ldrag && e.pointerId === ldrag.id) {
    const dx = e.clientX - ldrag.x, dy = e.clientY - ldrag.y; ldrag.x = e.clientX; ldrag.y = e.clientY; ldrag.moved += Math.abs(dx) + Math.abs(dy);
    if (ldrag.moved > 4) { enterExplore(); cc.rotate(-dx * 0.0038, -dy * 0.003, true); canvas.classList.add('grabbing'); }
    return;
  }
  if (!labRange(window.__p || 0)) return;
  if (e.target === canvas) { hoverId = pickLab(e); canvas.style.cursor = hoverId ? 'pointer' : 'grab'; } else hoverId = null;
});
const lend = (e) => { lptr.delete(e.pointerId); if (lptr.size < 2) lpinch = 0; if (ldrag && e.pointerId === ldrag.id) { ldrag = null; canvas.classList.remove('grabbing'); } };
addEventListener('pointerup', lend); addEventListener('pointercancel', lend);
canvas.addEventListener('wheel', (e) => { if (!labRange(window.__p || 0) || !e.ctrlKey) return; e.preventDefault(); enterExplore(); cc.dolly(-e.deltaY * 0.02, true); }, { passive: false });
// keys: ← → turn, and ↑ ↓ walk once you are exploring (before that they scroll the tour); + − zoom
addEventListener('keydown', (e) => {
  if (!labRange(window.__p || 0) || e.metaKey || e.ctrlKey || e.altKey || (e.target.closest && e.target.closest('input, textarea'))) return;
  if (e.key === 'Escape' && panelEl.classList.contains('on') && lightbox.hidden) { closePanel(true); return; }
  if (!EX.on && panelEl.dataset.tour && panelEl.classList.contains('on') && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { const s = TOUR.indexOf(panelEl.dataset.id) + (e.key === 'ArrowLeft' ? -1 : 1); if (s >= 0 && s < TOUR.length) { e.preventDefault(); scrollToStop(s); } return; }
  const turn = { ArrowLeft: 0.22, ArrowRight: -0.22 }[e.key], walk = { ArrowUp: 0.45, ArrowDown: -0.45 }[e.key], zoom = { '+': 0.6, '=': 0.6, '-': -0.6 }[e.key];
  if (turn) { e.preventDefault(); enterExplore(); cc.rotate(turn, 0, true); }
  else if (walk && EX.on) { e.preventDefault(); cc.forward(walk, true); }
  else if (zoom) { e.preventDefault(); enterExplore(); cc.dolly(zoom, true); }
});

// ---------- labels: every project numbered in the wide views, the one in front named in a close-up ----------
const NUM = { p10: '10', p11: '11', p12: '12' };
const labTags = Object.fromEntries(Object.keys(EXHIBITS).map((id) => {
  const P = PROJECTS.find((q) => q.id === id), soon = !P, el = mkTag(`<span class="no">${soon ? NUM[id] : P.n}</span><b>${soon ? 'Coming soon' : CASES[id].short || P.name}</b> <i>${soon ? '' : 'Overview →'}</i>`, soon ? 'tag link labtag soon' : 'tag link labtag');
  el.setAttribute('role', 'button'); el.addEventListener('click', () => selectProject(id)); return [id, el];
}));
function labTagsHide() { Object.values(labTags).forEach((el) => { tagOp(el, 0); el._pe = false; el.style.pointerEvents = 'none'; }); }
const anchorOf = (id) => { const e = EXHIBITS[id], d = id === 'ba' && labRoom.nodes.ba_drone; return d ? wpos(d, V3(0, 0.32, 0)) : V3(e.F[0], e.P[1] + e.top + 0.06, e.F[2]); };
function labFrame(dt, t, sp, front) {
  const inLab = labRange(sp), q = sp - 1, k = Math.round(q), stop = TOUR[k], near = Math.abs(q - k) < 0.25;
  const wide = !EX.on && near && (stop === 'over' || stop === 'back'), shelf = !EX.on && near && stop === 'shelf';
  const ctr = EX.on ? cc.getTarget(tmpT, false) : null, frontId = front >= 0 ? plinths[front].id : null;
  labLife(dt, t, inLab ? (EX.on ? hoverId || EX.focus : near ? frontId : null) : null);
  tourPanel(inLab && !EX.on && near && CASES[stop] ? stop : null, k);
  if (!inLab && !gridEl.hidden) toggleGrid(false);
  Object.entries(labTags).forEach(([id, el]) => {
    let show = false, hot = false;
    if (inLab) {
      if (EX.on) { hot = id === hoverId || id === EX.focus; show = hot || (!EX.focus && anchorOf(id).distanceTo(ctr) < 3.4); }
      else if (wide || (shelf && SHELF_IDS.includes(id))) show = true;
      else if (near && id === frontId) { show = true; hot = true; }
    }
    // class and style changes only when they change (a mini label is narrower, so its cached size is dropped)
    const mini = show && (!hot || panelEl.dataset.id === id && panelEl.classList.contains('on'));
    if (el._hot !== hot) { el._hot = hot; el.classList.toggle('hot', hot); el._w = 0; }
    if (el._mini !== mini) { el._mini = mini; el.classList.toggle('mini', mini); el._w = el._h = 0; }
    place(el, anchorOf(id), show); if (el._pe !== show) { el._pe = show; el.style.pointerEvents = show ? 'auto' : 'none'; }
  });
  // the walk marker fades as the camera arrives
  markerT += dt; marker.material.opacity = Math.max(0, 0.9 - markerT * 1.2) * (inLab ? 1 : 0);
  barEl.classList.toggle('on', inLab); document.body.classList.toggle('in-lab', inLab);
  if (!inLab && panelEl.classList.contains('on')) closePanel();
}

// the tour opens each project's overview as it arrives there and closes it as it moves on; one closed by hand stays
// closed until the tour leaves that stop. While exploring it opens only on a click.
let tourId = null, tourShut = -1;
function tourPanel(want, k) {
  if (tourShut >= 0 && k !== tourShut) tourShut = -1;
  if (want === tourId) return;
  if (tourId && panelEl.dataset.id === tourId && !EX.on) closePanel();
  tourId = null;
  if (want && k !== tourShut) { openPanel(want, true); tourId = want; }
}

// ---------- the overview panel: photos, media, what it is and what it won, then the full case study ----------
const panelEl = document.createElement('aside'); panelEl.id = 'lpanel'; panelEl.setAttribute('role', 'dialog'); panelEl.setAttribute('aria-labelledby', 'lpTitle'); document.body.appendChild(panelEl);
const tourIds = TOUR.filter((x) => EXHIBITS[x] && CASES[x]);
let panelFrom = null;
const shortName = (id) => CASES[id] ? CASES[id].short || PROJECTS.find((q) => q.id === id).name : { over: 'The whole lab', shelf: 'Coming soon', back: 'The whole lab' }[id];
function panelHTML(id, tour) {
  const C = CASES[id], P = PROJECTS.find((q) => q.id === id), i = tourIds.indexOf(id), s = TOUR.indexOf(id);
  // on the tour ← → are its previous and next stops; while exploring they step round the projects
  const prev = tour ? TOUR[s - 1] : tourIds[(i - 1 + tourIds.length) % tourIds.length], next = tour ? TOUR[s + 1] : tourIds[(i + 1) % tourIds.length];
  const nav = `<div class="lp-nav"><button type="button" class="pill sm" data-lp="${prev}" aria-label="Previous: ${shortName(prev)}">←<span class="nm"> ${shortName(prev)}</span></button><button type="button" class="pill sm" data-lp="${next}" aria-label="Next: ${shortName(next)}"><span class="nm">${shortName(next)} </span>→</button></div>`;
  if (!C) return `<div class="lp-top"><span class="lp-no">${NUM[id]}</span><button type="button" class="pill sm inv" data-lp-close aria-label="Close overview">✕ esc</button></div><div class="lp-body"><h2 id="lpTitle">Coming soon</h2><p class="lp-sub">Project ${NUM[id]} is being written up. It will open here when it is ready.</p></div>`;
  const tmp = document.createElement('div'); tmp.innerHTML = C.html.media || ''; const strip = [...tmp.querySelectorAll('.media > button')].slice(0, 8).map((b) => { b.className = ''; return b.outerHTML; }).join('');
  return `<button type="button" class="lp-grab" data-lp-grow aria-label="Show the full overview"></button><div class="lp-top"><span class="lp-no">${P.n}</span><span class="lp-tg">${C.tg}</span><button type="button" class="pill sm inv" data-lp-close aria-label="Close overview">✕ esc</button></div>
  <div class="lp-hero"><img src="img/${C.photo}.webp" alt="${C.name}" style="object-position:${C.pos || '50% 50%'}"></div>
  <div class="lp-body"><h2 id="lpTitle" tabindex="-1">${C.name}</h2><p class="lp-sub">${C.sub}</p>${H.tldr(C)}
  ${strip ? `<h4 class="sub">Photos and media</h4><div class="lp-strip media">${strip}</div>` : ''}
  <h4 class="sub">Recognition</h4>${C.html.recog || ''}${H.proofs(C)}</div>
  <div class="lp-foot"><button type="button" class="btn primary" data-open="${id}" data-lp-go>Open case study →</button>${nav}</div>`;
}
// auto: opened by the tour, so it leaves focus where it is (the page keeps scrolling with the keys)
function openPanel(id, auto) {
  if (!panelEl.classList.contains('on') && !auto) panelFrom = document.activeElement;
  panelEl.innerHTML = panelHTML(id, auto); panelEl.scrollTop = 0; panelEl.dataset.id = id; panelEl.dataset.tour = auto ? '1' : ''; armVideos(panelEl);
  // a phone gets a compact sheet (number, name, the way in) that grows to the full overview on a tap
  panelEl.classList.toggle('mini', narrow()); panelEl.classList.add('on'); document.body.classList.add('lp-open');
  const h = panelEl.querySelector('#lpTitle'); if (!auto && h && h.focus) setTimeout(() => h.focus({ preventScroll: true }), reduced ? 0 : 280);
}
function growPanel(on) { panelEl.classList.toggle('mini', !on); const g = panelEl.querySelector('.lp-grab'); if (g) g.setAttribute('aria-label', on ? 'Show less' : 'Show the full overview'); if (!on) panelEl.scrollTop = 0; }
function closePanel(refocus) {
  if (!panelEl.classList.contains('on')) return;
  panelEl.classList.remove('on'); document.body.classList.remove('lp-open'); EX.focus = null;
  if (refocus && tourId && !EX.on) tourShut = Math.round((window.__p || 1) - 1);
  // focus goes back where it came from, or to the toolbar when that is gone (the project grid closes behind you)
  if (refocus) { const back = panelFrom && panelFrom.isConnected && panelFrom.offsetParent ? panelFrom : barEl.querySelector('[data-bar="all"]'); back.focus({ preventScroll: true }); }
}
panelEl.addEventListener('click', (e) => {
  const b = e.target.closest('[data-lp],[data-lp-close],[data-lp-go],[data-lp-grow]');
  // the compact sheet grows on a tap anywhere but its buttons
  if (!b || b.hasAttribute('data-lp-grow')) { if (narrow() && (!b ? panelEl.classList.contains('mini') : true)) growPanel(panelEl.classList.contains('mini')); return; }
  if (b.dataset.lp) { if (!EX.on && panelEl.dataset.tour) scrollToStop(TOUR.indexOf(b.dataset.lp)); else selectProject(b.dataset.lp); }
  else if (b.hasAttribute('data-lp-close')) closePanel(true);
  // the case study opens from here; the lab hands the camera back to the tour, which already stands at this project
  else { panelEl.classList.remove('on'); document.body.classList.remove('lp-open'); EX.on = false; EX.w = 0; EX.focus = null; document.body.classList.remove('exploring'); }
});

// ---------- the toolbar: every project, the tour, zoom, and back to the whole room ----------
const barEl = document.createElement('div'); barEl.id = 'labbar'; barEl.setAttribute('role', 'toolbar'); barEl.setAttribute('aria-label', 'Lab controls');
barEl.innerHTML = `<button type="button" data-bar="all" aria-expanded="false" aria-controls="lgrid"><span aria-hidden="true">▦</span> All projects</button><button type="button" data-bar="tour"><span aria-hidden="true">▶</span> Tour</button><button type="button" data-bar="out" aria-label="Zoom out">−</button><button type="button" data-bar="in" aria-label="Zoom in">+</button><button type="button" data-bar="reset"><span aria-hidden="true">⟲</span> Reset view</button><span class="hint">Drag to look · Click the floor to walk · Click a project</span>`;
document.body.appendChild(barEl);
const gridEl = document.createElement('div'); gridEl.id = 'lgrid'; gridEl.hidden = true; gridEl.setAttribute('role', 'dialog'); gridEl.setAttribute('aria-label', 'All projects');
gridEl.innerHTML = Object.keys(EXHIBITS).filter((id) => !SHELF_IDS.includes(id)).sort((a, b) => tourStopOf(a) - tourStopOf(b)).map((id) => { const P = PROJECTS.find((q) => q.id === id); return `<button type="button" data-lp="${id}"><img src="img/${CASES[id].photo}.webp" alt=""><span><b>${P.n}</b> ${CASES[id].short || P.name}</span></button>`; }).join('') + '<p>10 – 12 · Coming soon, on the top shelf</p>';
document.body.appendChild(gridEl);
function toggleGrid(on) { gridEl.hidden = !on; document.body.classList.toggle('grid-open', on); barEl.querySelector('[data-bar="all"]').setAttribute('aria-expanded', String(on)); if (on) gridEl.querySelector('button').focus(); }
gridEl.addEventListener('click', (e) => { const b = e.target.closest('[data-lp]'); if (b) { toggleGrid(false); selectProject(b.dataset.lp); } });
// it closes on a click anywhere outside it (the toolbar's own button toggles it) and when the lab scrolls away (labFrame)
addEventListener('pointerdown', (e) => { if (!gridEl.hidden && !gridEl.contains(e.target) && !e.target.closest('[data-bar="all"]')) toggleGrid(false); }, true);
addEventListener('keydown', (e) => { if (e.key === 'Escape' && !gridEl.hidden) { toggleGrid(false); barEl.querySelector('[data-bar="all"]').focus(); } });
barEl.addEventListener('click', (e) => {
  const b = e.target.closest('[data-bar]'); if (!b) return; const a = b.dataset.bar;
  if (a === 'all') toggleGrid(gridEl.hidden);
  // Tour: back to the tour where you are, or on to its next stop
  else if (a === 'tour') { const cur = Math.max(0, Math.round((window.__p || 1) - 1)), was = EX.on; leaveExplore(); scrollToStop(Math.min(TOUR.length - 1, was ? cur : cur + 1)); }
  else if (a === 'in' || a === 'out') { enterExplore(); cc.dolly(a === 'in' ? 0.7 : -0.7, true); }
  else if (a === 'reset') { leaveExplore(); scrollToStop(0); }
});
// the card's project chips open the overview here instead of jumping straight into the case study
document.querySelectorAll('#labChips [data-open]').forEach((b) => { b.dataset.lp = b.dataset.open; delete b.dataset.open; });
document.getElementById('labChips').addEventListener('click', (e) => { const b = e.target.closest('[data-lp]'); if (b) selectProject(b.dataset.lp); });
applyLayout('lab');
