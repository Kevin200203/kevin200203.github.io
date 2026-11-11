import * as THREE from './vendor/three.module.min.js?v=20261112-7';

// An illustrative memory table, not a visualization of learned model weights.
// Integer x/y/z indices keep every pulse on two or three adjacent table entries.
let renderer, scene, camera, grid, dots, wires, pulses;
let width = 0, height = 0, columns, rows, depth, nodes = [], routes = [];
let ink = new THREE.Color('#171717'), accent = new THREE.Color('#b4232c');
let active = false, visible = true, frame = 0, last = 0, elapsed = 0, scroll = 0;
let pointer = new THREE.Vector2(9, 9), targetScroll = 0;
const projected = new THREE.Vector3();
const vertexShader = `
  attribute float strength;
  varying float vStrength;
  uniform float pixelRatio;
  void main() {
    vStrength = strength;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp((4.2 + strength * 3.0) * pixelRatio * 12.0 / -mv.z, 2.0, 10.0);
  }`;
const fragmentShader = `
  uniform vec3 ink; uniform vec3 accent;
  varying float vStrength;
  void main() {
    float radius = length(gl_PointCoord - .5);
    float edge = 1.0 - smoothstep(.30, .50, radius);
    if (edge <= .0) discard;
    gl_FragColor = vec4(mix(ink, accent, vStrength), edge * (.42 + vStrength * .48));
    #include <colorspace_fragment>
  }`;
function disposeGrid() {
  if (!grid) return;
  grid.traverse(object => { object.geometry?.dispose(); object.material?.dispose(); });
  scene.remove(grid);
}
function rebuild() {
  disposeGrid();
  const small = width < 700;
  columns = small ? 9 : 21; rows = small ? 13 : 17; depth = small ? 2 : 3;
  grid = new THREE.Group(); scene.add(grid); nodes = []; routes = [];
  const spacing = small ? .95 : .8, points = [], lines = [];
  const index = (x, y, z) => (z * rows + y) * columns + x;
  for (let z = 0; z < depth; z++) for (let y = 0; y < rows; y++) for (let x = 0; x < columns; x++) {
    const p = new THREE.Vector3((x - (columns - 1) / 2) * spacing, (y - (rows - 1) / 2) * spacing, -z * 1.3);
    nodes.push(p); points.push(p.x, p.y, p.z);
    for (const j of [x ? index(x - 1, y, z) : -1, y ? index(x, y - 1, z) : -1, z ? index(x, y, z - 1) : -1]) {
      if (j >= 0) { const q = nodes[j]; lines.push(p.x,p.y,p.z,q.x,q.y,q.z); }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  geometry.setAttribute('strength', new THREE.BufferAttribute(new Float32Array(nodes.length), 1));
  dots = new THREE.Points(geometry, new THREE.ShaderMaterial({
    uniforms: { ink: { value: ink }, accent: { value: accent }, pixelRatio: { value: renderer.getPixelRatio() } },
    vertexShader, fragmentShader, transparent: true, depthWrite: false
  })); grid.add(dots);
  const wireGeometry = new THREE.BufferGeometry();
  wireGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
  wires = new THREE.LineSegments(wireGeometry, new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: .085, depthWrite: false }));
  grid.add(wires);
  // Alternating horizontal bigrams and vertical trigrams; staggered recalls.
  for (let i = 0; i < (small ? 3 : 6); i++) {
    const count = i % 2 ? 3 : 2, x = (i * 7 + 3) % (columns - 2), y = (i * 5 + 2) % (rows - 2), z = i % depth;
    routes.push(Array.from({ length: count }, (_, j) => index(x + (i % 2 ? 0 : j), y + (i % 2 ? j : 0), z)));
  }
  pulses = routes.map(() => {
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(9), 3));
    const line = new THREE.Line(g, new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0, depthWrite: false }));
    grid.add(line); return line;
  });
  camera.aspect = width / height; camera.updateProjectionMatrix();
  camera.position.z = small ? 16 : 14;
  grid.rotation.set(.22, -.32, -.09);
}
function schedule() { if (!frame && active && visible && renderer && width) frame = requestAnimationFrame(draw); }
function render() {
  if (!renderer || !width || !visible) return;
  grid.rotation.y = -.32 + Math.sin(elapsed * .06) * .025;
  grid.position.y = Math.sin(scroll * .00022) * .7;
  grid.rotation.x = .22 + Math.sin(scroll * .00013) * .04;
  grid.updateMatrixWorld(); camera.updateMatrixWorld();
  const strength = dots.geometry.attributes.strength;
  strength.array.fill(0);
  for (let i = 0; i < nodes.length; i++) {
    projected.copy(nodes[i]).applyMatrix4(grid.matrixWorld).project(camera);
    const d = Math.hypot((projected.x - pointer.x) * width / height, projected.y - pointer.y);
    if (d < .17) strength.array[i] = (1 - d / .17) * .8;
  }
  routes.forEach((route, i) => {
    const phase = (elapsed + i * 2.1) % 11, progress = phase / 3.8;
    const envelope = progress < 1 ? Math.sin(progress * Math.PI) : 0;
    const line = pulses[i]; line.material.opacity = envelope * .65;
    const position = line.geometry.attributes.position;
    route.forEach((node, j) => {
      const q = nodes[node]; position.setXYZ(j, q.x, q.y, q.z);
      const wave = Math.max(0, 1 - Math.abs(progress * (route.length + 1) - j - .5));
      strength.array[node] = Math.max(strength.array[node], wave * envelope);
    });
    line.geometry.setDrawRange(0, route.length); position.needsUpdate = true;
  });
  strength.needsUpdate = true; renderer.render(scene, camera);
}
function draw(time) {
  frame = 0; if (!active || !visible) return;
  if (last && time - last < 48) { schedule(); return; } // At most 20 fps.
  if (last) elapsed += Math.min(time - last, 100) / 1000;
  last = time; scroll += (targetScroll - scroll) * .08;
  render(); schedule();
}
function fail() { cancelAnimationFrame(frame); renderer?.dispose(); self.postMessage({ type: 'failed' }); self.close(); }
self.onmessage = ({ data }) => {
  try {
    if (data.type === 'init') {
      renderer = new THREE.WebGLRenderer({ canvas: data.canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
      renderer.setClearColor(0, 0); scene = new THREE.Scene(); camera = new THREE.PerspectiveCamera(52, 1, .1, 100);
      data.canvas.addEventListener('webglcontextlost', fail);
    } else if (data.type === 'resize') {
      width = data.width; height = data.height; renderer.setPixelRatio(Math.min(data.dpr, 1.5)); renderer.setSize(width, height, false);
      rebuild(); render(); self.postMessage({ type: 'ready' }); schedule();
    } else if (data.type === 'theme') {
      ink.set(data.ink); accent.set(data.accent); wires?.material.color.copy(ink); pulses?.forEach(line => line.material.color.copy(accent)); render();
    } else if (data.type === 'state') {
      active = data.active; visible = data.visible;
      if (!active) { cancelAnimationFrame(frame); frame = 0; last = 0; } else schedule();
    } else if (data.type === 'scroll') targetScroll = data.value;
    else if (data.type === 'pointer') pointer.set(data.x, data.y);
  } catch { fail(); }
};
