import * as THREE from './vendor/three.module.min.js';
import { inside, random, palette as frameColors } from './portrait-network.js?v=20261112-1';
import { outline } from './portrait-outline.js?v=20261112-1';

// The photograph is one permanent collection of textured fragments. No photo crossfade.
let renderer, camera, group, photoMaterial, photoMesh, lineMaterial, nodeMaterial;
let lineGeometry, nodeGeometry, contour, linePositions, lineColors, lineStrengths, nodePositions, nodeColors, nodeStrengths;
let visible = false, playing = true, initialized = false, announced = false;
let frame = 0, previous = 0, elapsed = 0, phase = 0;
let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
let arrivalContext, arrivalCanvas, arrivalParticles = [], arrivalDone = false;
let viewportWidth = 0, viewportHeight = 0, heroLeft = 0, heroTop = 0, heroWidth = 0, heroHeight = 0;
let arrivalColor = '#b4232c';
const scene = new THREE.Scene(), duration = 5800, lanes = 3, segments = 100, beads = 10;
const bodyColumns = 22, bodyRows = 8, bodyCount = bodyColumns * bodyRows;
const bodyPositions = new Float32Array(bodyCount * 3), bodyStrengths = new Float32Array(bodyCount), bodyEdges = [];
for (let row = 0; row < bodyRows; row++) for (let col = 0; col < bodyColumns; col++) {
  const i = row * bodyColumns + col;
  if (col) bodyEdges.push([i - 1, i]);
  if (row) bodyEdges.push([i - bodyColumns, i]);
  if (row && col && random(i) > .25) bodyEdges.push([i - bodyColumns - 1, i]);
}
const projected = new THREE.Vector3(), point = new THREE.Vector3(), tangent = new THREE.Vector3();
const laneColors = [0, 1, 3].map(i => new THREE.Color(frameColors[i]).convertLinearToSRGB());
function schedule() { if (!frame && initialized && visible) frame = requestAnimationFrame(render); }
function stop() { cancelAnimationFrame(frame); frame = 0; previous = 0; }
function resize(width, height, data = {}) {
  if (!renderer || !width || !height) return;
  heroWidth = width; heroHeight = height;
  heroLeft = data.left ?? heroLeft; heroTop = data.top ?? heroTop;
  viewportWidth = data.viewportWidth ?? viewportWidth; viewportHeight = data.viewportHeight ?? viewportHeight;
  if (arrivalCanvas && !arrivalDone) { arrivalCanvas.width = viewportWidth; arrivalCanvas.height = viewportHeight; }
  camera.aspect = width / height; camera.position.z = width < 500 ? 7.7 : 8.4;
  camera.updateProjectionMatrix(); camera.updateMatrixWorld(); renderer.setSize(width, height, false); schedule();
}
function palette(value) {
  arrivalColor = value.accent;
  if (!lineMaterial) return;
  const paper = new THREE.Color(value.paper), dark = paper.r + paper.g + paper.b < 1;
  lineMaterial.uniforms.dark.value = nodeMaterial.uniforms.dark.value = dark ? 1 : 0;
  schedule();
}
function dismissArrival() {
  if (arrivalDone) return;
  arrivalDone = true; arrivalContext?.clearRect(0, 0, viewportWidth, viewportHeight);
  if (arrivalCanvas) { arrivalCanvas.width = 1; arrivalCanvas.height = 1; }
  arrivalParticles = []; postMessage({ type: 'arrival-complete' });
}
function renderArrival() {
  if (arrivalDone) return;
  if (!arrivalContext || elapsed >= 3800) { dismissArrival(); return; }
  const progress = elapsed / 3800, ctx = arrivalContext;
  ctx.clearRect(0, 0, viewportWidth, viewportHeight);
  const positions = arrivalParticles.map(particle => {
    const local = Math.max(0, Math.min(1, (progress - particle.delay) / (1 - particle.delay)));
    const ease = local * local * (3 - 2 * local);
    projected.fromArray(particle.target).project(camera);
    return { x: particle.x * viewportWidth * (1 - ease) + (heroLeft + (projected.x * .5 + .5) * heroWidth) * ease,
      y: particle.y * viewportHeight * (1 - ease) + (heroTop + (-projected.y * .5 + .5) * heroHeight) * ease,
      alpha: Math.min(1, progress * 6) * (1 - ease * ease) * .35 };
  });
  ctx.strokeStyle = arrivalColor; ctx.fillStyle = arrivalColor; ctx.lineWidth = .6;
  positions.forEach((p, i) => {
    const next = positions[i + 1];
    if (next && Math.hypot(p.x - next.x, p.y - next.y) < 150) {
      ctx.globalAlpha = p.alpha * .45; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(next.x, next.y); ctx.stroke();
    }
    ctx.globalAlpha = p.alpha; ctx.beginPath(); ctx.arc(p.x, p.y, 1.2 + random(i) * .6, 0, Math.PI * 2); ctx.fill();
  });
}
function contourPoint(u, lane, out) {
  u = (u % 1 + 1) % 1;
  contour.getPointAt(u, point); contour.getTangentAt(u, tangent);
  const offset = .055 + lane * .065 + Math.sin(u * Math.PI * 10 - phase * 1.2 + lane) * .035;
  out.set(point.x + tangent.y * offset, point.y - tangent.x * offset, .04 + Math.sin(u * 12 + phase) * .025);
  return out;
}
const a = new THREE.Vector3(), b = new THREE.Vector3();
function updateFrame(progress) {
  const show = THREE.MathUtils.smoothstep(progress, .6, 1);
  let lineIndex = 0, nodeIndex = 0;
  for (let lane = 0; lane < lanes; lane++) {
    const color = laneColors[lane];
    for (let i = 0; i < segments; i++) {
      const u = i / segments;
      contourPoint(u, lane, a); contourPoint((i + 1) / segments, lane, b);
      const opening = THREE.MathUtils.smoothstep(Math.sin(u * Math.PI * 6 - phase * .65 + lane * 1.8), -.4, .1);
      const pulse = Math.pow(.5 + .5 * Math.sin(u * Math.PI * 8 - phase * 2.2 + lane), 8);
      for (const p of [a, b]) {
        p.toArray(linePositions, lineIndex * 3); color.toArray(lineColors, lineIndex * 3);
        lineStrengths[lineIndex++] = show * opening * (.28 + pulse * .44);
      }
    }
    for (let i = 0; i < beads; i++) {
      const u = i / beads + phase * (.021 + lane * .004) + lane * .05;
      contourPoint(u, lane, a);
      a.toArray(nodePositions, nodeIndex * 3); color.toArray(nodeColors, nodeIndex * 3);
      nodeStrengths[nodeIndex++] = show * (.6 + .3 * Math.sin(i * 2 + phase) ** 2);
    }
  }
  // A curved network continues the lower torso into the page, concealing the crop.
  for (let row = 0; row < bodyRows; row++) for (let col = 0; col < bodyColumns; col++) {
    const i = row * bodyColumns + col, u = col / (bodyColumns - 1), v = row / (bodyRows - 1);
    const jitter = (random(i + 91) - .5) * .055;
    const x = (u - .5) * 2.7 + Math.sin(v * Math.PI + phase * .3) * .12 + jitter;
    const y = -1.61 + (v - .5) * .96 + Math.sin(u * Math.PI * 2 + phase * .35) * .14 + (u - .5) * .15;
    const z = .24 + Math.cos(u * Math.PI * 2 + v * 2 + phase * .4) * .11;
    bodyPositions.set([x,y,z], i * 3);
    bodyStrengths[i] = show * Math.pow(Math.max(0, Math.sin(u * Math.PI) * Math.sin(v * Math.PI)), .55);
    nodePositions.set([x,y,z], nodeIndex * 3); laneColors[col % 3 === 0 ? 2 : 1].toArray(nodeColors, nodeIndex * 3);
    nodeStrengths[nodeIndex++] = bodyStrengths[i] * (.5 + .3 * Math.sin(phase - u * 9) ** 8);
  }
  for (const pair of bodyEdges) for (const i of pair) {
    linePositions.set(bodyPositions.subarray(i * 3, i * 3 + 3), lineIndex * 3);
    laneColors[i % 4 === 0 ? 2 : 1].toArray(lineColors, lineIndex * 3);
    lineStrengths[lineIndex++] = bodyStrengths[i] * (.32 + .22 * Math.sin(phase - i * .12) ** 8);
  }
  for (const geometry of [lineGeometry, nodeGeometry]) for (const attribute of Object.values(geometry.attributes)) attribute.needsUpdate = true;
}
function render(time) {
  frame = 0; if (!visible) { previous = 0; return; }
  if (previous && time - previous < 30) { schedule(); return; }
  const delta = previous ? Math.min(time - previous, 40) : 0; previous = time;
  if (playing) { elapsed = Math.min(duration, elapsed + delta); phase += delta * .0005; }
  currentX += (targetX - currentX) * .1; currentY += (targetY - currentY) * .1;
  const progress = elapsed / duration;
  group.rotation.set(-currentY * .09, currentX * .16, 0);
  photoMaterial.uniforms.progress.value = progress;
  updateFrame(progress); renderer.render(scene, camera); renderArrival();
  if (!announced) { announced = true; postMessage({ type: 'ready' }); }
  if (playing || Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > .001) schedule();
  else previous = 0;
}
async function initialize(data) {
  const context = data.canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
  if (!context) throw Error('WebGL unavailable');
  renderer = new THREE.WebGLRenderer({ canvas: data.canvas, context, alpha: true, antialias: true });
  renderer.setPixelRatio(data.dpr); renderer.setClearColor(0, 0);
  camera = new THREE.PerspectiveCamera(34, 1, .1, 30); group = new THREE.Group(); scene.add(group);
  const response = await fetch(data.portrait); if (!response.ok) throw Error('Portrait unavailable');
  const bitmap = await createImageBitmap(await response.blob(), { imageOrientation: 'flipY' });
  const texture = new THREE.Texture(bitmap); texture.needsUpdate = true;
  // A procedural contour mask clips each fragment; the photograph itself is unmodified.
  const maskCanvas = new OffscreenCanvas(530, 690), maskContext = maskCanvas.getContext('2d');
  maskContext.fillStyle = '#000'; maskContext.fillRect(0, 0, 530, 690); maskContext.fillStyle = '#fff'; maskContext.beginPath();
  outline.forEach(([x,y],i) => i ? maskContext.lineTo(x,y) : maskContext.moveTo(x,y)); maskContext.closePath(); maskContext.fill();
  const maskBitmap = await createImageBitmap(maskCanvas, { imageOrientation: 'flipY' });
  const maskTexture = new THREE.Texture(maskBitmap); maskTexture.needsUpdate = true;
  const step = data.width < 500 ? 9 : 6, targets = [], seeds = [], centers = [];
  for (let y = 0; y < 690; y += step) for (let x = 0; x < 530; x += step) {
    if (![[x,y],[x+step,y],[x,y+step],[x+step,y+step],[x+step/2,y+step/2]].some(([px,py])=>inside(px,py))) continue;
    const cx=x+step/2,cy=y+step/2;
    targets.push((cx/530-.5)*3.1,(.5-cy/690)*4.03,0); centers.push(cx/530,1-cy/690); seeds.push(random(x*13+y*17));
  }
  const tile = new THREE.PlaneGeometry(1, 1), geometry = new THREE.InstancedBufferGeometry();
  geometry.index = tile.index; geometry.attributes.position = tile.attributes.position; geometry.attributes.uv = tile.attributes.uv;
  geometry.setAttribute('target',new THREE.InstancedBufferAttribute(new Float32Array(targets),3));
  geometry.setAttribute('center',new THREE.InstancedBufferAttribute(new Float32Array(centers),2));
  geometry.setAttribute('seed',new THREE.InstancedBufferAttribute(new Float32Array(seeds),1)); geometry.instanceCount=seeds.length;
  photoMaterial = new THREE.RawShaderMaterial({
    uniforms:{image:{value:texture},mask:{value:maskTexture},progress:{value:0}}, transparent:true,depthTest:false,depthWrite:false,
    vertexShader:`precision highp float; attribute vec3 position; attribute vec2 uv; attribute vec3 target; attribute vec2 center; attribute float seed;
      uniform mat4 modelViewMatrix; uniform mat4 projectionMatrix; uniform float progress;
      varying vec2 vUv; varying vec2 vLocal; varying float vArrived;
      void main(){
        float delay=.04+seed*.22+(1.0-center.y)*.08;
        float t=smoothstep(delay,.85+seed*.14,progress);vArrived=t;vLocal=uv-.5;
        vec3 start=vec3((fract(seed*23.7)-.5)*9.0,(seed-.5)*7.0,(fract(seed*41.3)-.5)*2.0);
        vec3 p=mix(start,target,t);
        float size=.13+.87*smoothstep(.2,1.0,t);
        p.xy+=position.xy*vec2(${(step/530*3.1*1.003).toFixed(6)},${(step/690*4.03*1.003).toFixed(6)})*size;
        vUv=center+(uv-.5)*vec2(${(step/530).toFixed(6)},${(step/690).toFixed(6)});
        gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
      }`,
    fragmentShader:`precision mediump float;uniform sampler2D image;uniform sampler2D mask;varying vec2 vUv;varying vec2 vLocal;varying float vArrived;
      void main(){
        float radius=mix(.22,.78,smoothstep(.3,1.0,vArrived));
        float shape=1.0-smoothstep(radius-.025,radius+.025,length(vLocal));
        float silhouette=texture2D(mask,vUv).r;float base=smoothstep(0.0,.24,vUv.y);
        gl_FragColor=vec4(texture2D(image,vUv).rgb,shape*silhouette*base);
      }`
  });
  photoMesh = new THREE.Mesh(geometry,photoMaterial); photoMesh.frustumCulled=false;photoMesh.renderOrder=0;group.add(photoMesh);
  // Three interrupted flowing paths replace the dense stationary mesh halo.
  contour = new THREE.CatmullRomCurve3(outline.filter((_,i)=>i%3===0).map(([x,y])=>new THREE.Vector3((x/530-.5)*3.1,(.5-y/690)*4.03,0)),true,'catmullrom',.4);
  contour.arcLengthDivisions=600;contour.updateArcLengths();
  linePositions=new Float32Array((lanes*segments*2+bodyEdges.length*2)*3);lineColors=new Float32Array(linePositions.length);lineStrengths=new Float32Array(linePositions.length/3);
  nodePositions=new Float32Array((lanes*beads+bodyCount)*3);nodeColors=new Float32Array(nodePositions.length);nodeStrengths=new Float32Array(nodePositions.length/3);
  function streamGeometry(positions,colors,strengths){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));g.setAttribute('color',new THREE.BufferAttribute(colors,3).setUsage(THREE.DynamicDrawUsage));g.setAttribute('strength',new THREE.BufferAttribute(strengths,1).setUsage(THREE.DynamicDrawUsage));return g;}
  function streamMaterial(points){return new THREE.RawShaderMaterial({uniforms:{dark:{value:0}},transparent:true,depthTest:false,depthWrite:false,
    vertexShader:`precision mediump float;attribute vec3 position;attribute vec3 color;attribute float strength;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;varying vec3 vColor;varying float vStrength;
      void main(){vColor=color;vStrength=strength*smoothstep(-2.04,-1.5,position.y);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_PointSize=${(3.2*data.dpr).toFixed(1)};}`,
    fragmentShader:`precision mediump float;uniform float dark;varying vec3 vColor;varying float vStrength;void main(){float opacity=vStrength;${points?'opacity*=1.0-smoothstep(.15,.5,distance(gl_PointCoord,vec2(.5)));':''}vec3 color=mix(vColor,min(vec3(.95),vColor*1.2+.06),dark);gl_FragColor=vec4(color,opacity);}`});}
  lineGeometry=streamGeometry(linePositions,lineColors,lineStrengths);nodeGeometry=streamGeometry(nodePositions,nodeColors,nodeStrengths);
  lineMaterial=streamMaterial(false);nodeMaterial=streamMaterial(true);
  const lines=new THREE.LineSegments(lineGeometry,lineMaterial),nodes=new THREE.Points(nodeGeometry,nodeMaterial);lines.frustumCulled=nodes.frustumCulled=false;lines.renderOrder=2;nodes.renderOrder=3;group.add(lines,nodes);
  arrivalCanvas=data.arrival;try{arrivalContext=arrivalCanvas.getContext('2d',{alpha:true});}catch{}
  const columns=data.width<500?6:12,rows=8;
  arrivalParticles=Array.from({length:columns*rows},(_,i)=>({x:(i%columns+.15+random(i)*.7)/columns,y:(Math.floor(i/columns)+.15+random(i+21)*.7)/rows,delay:random(i+2)*.22,target:targets.slice(Math.floor(random(i+43)*seeds.length)*3,Math.floor(random(i+43)*seeds.length)*3+3)}));
  palette(data.colors);resize(data.width,data.height,data);
  data.canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();stop();postMessage({type:'error'});});initialized=true;schedule();
}
self.onmessage=({data})=>{
  if(data.type==='init'){initialize(data).catch(()=>{stop();postMessage({type:'error'});});return;}
  if(data.type==='visible'){visible=data.value;if(visible)schedule();else stop();}
  else if(data.type==='resize')resize(data.width,data.height,data);
  else if(data.type==='dismiss-arrival')dismissArrival();
  else if(data.type==='colors')palette(data.value);
  else if(data.type==='pointer'){targetX=data.x;targetY=data.y;schedule();}
  else if(data.type==='play'){playing=data.value;schedule();}
};
