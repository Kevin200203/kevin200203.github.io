let canvas, ctx, width = 0, height = 0, dpr = 1, scroll = 0, rects = [], color = '#b4232c', dark = false;
let visible = true, playing = true, frame = 0, previous = 0, phase = 0;
function schedule() { if (!frame && visible && ctx && width) frame = requestAnimationFrame(draw); }
function draw(time) {
  frame = 0; if (!visible) return;
  // Slow background motion needs only ten frames per second.
  if (previous && time - previous < 95) { schedule(); return; }
  if (playing && previous) phase += Math.min(time - previous, 150) * .00012;
  previous = time;
  ctx.clearRect(0, 0, width, height);
  const narrow = width < 700, lanes = narrow ? 3 : 4, count = narrow ? 8 : 12;
  const centers = narrow ? [.035, .965, .51] : [.035, .965, .51, .79];
  const amplitude = narrow ? 27 : 66;
  const points = [];
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = .75;
  for (let lane = 0; lane < lanes; lane++) {
    const path = [];
    for (let i = 0; i < count; i++) {
      const y = i / (count - 1) * (height + 80) - 40;
      const x = width * centers[lane] + Math.sin(y / 180 + phase + lane * 1.7) * amplitude + Math.sin(y / 310 - phase * .7) * amplitude * .35;
      path.push({ x, y }); points.push({ x, y });
    }
    ctx.globalAlpha = dark ? .105 : .075;
    ctx.beginPath(); ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length - 1; i++) ctx.quadraticCurveTo(path[i].x, path[i].y, (path[i].x + path[i + 1].x) / 2, (path[i].y + path[i + 1].y) / 2);
    ctx.lineTo(path.at(-1).x, path.at(-1).y); ctx.stroke();
  }
  points.forEach((p, i) => {
    ctx.globalAlpha = dark ? .19 : .13; ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2); ctx.fill();
    for (let j = i + count - 1; j < Math.min(points.length, i + count + 2); j++) {
      const q = points[j]; if (!q || Math.hypot(p.x-q.x,p.y-q.y)>125) continue;
      ctx.globalAlpha = dark ? .07 : .045; ctx.beginPath(); ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();
    }
  });
  // Erase protected reading zones. Text never sits on the animated network.
  ctx.globalAlpha = 1;
  for (const r of rects) if (r.y + r.height > scroll && r.y < scroll + height) ctx.clearRect(r.x, r.y - scroll, r.width, r.height);
  if (playing) schedule(); else previous = 0;
}
self.onmessage = ({ data }) => {
  if (data.type === 'init') { canvas = data.canvas; dpr = data.dpr; ctx = canvas.getContext('2d', { alpha: true }); }
  else if (data.type === 'layout') {
    width = data.width; height = data.height; scroll = data.scroll; rects = data.rects; color = data.color; dark = data.dark;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr); ctx.setTransform(dpr,0,0,dpr,0,0); previous = 0; schedule();
  } else if (data.type === 'scroll') { scroll = data.value; schedule(); }
  else if (data.type === 'state') { visible = data.visible; playing = data.playing; if (!visible) { cancelAnimationFrame(frame); frame = 0; previous = 0; } else schedule(); }
};
