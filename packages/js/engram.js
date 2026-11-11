// Optional enhancement: static CSS grid and all content remain if any step fails.
export function enhanceMemory() {
  const field = document.querySelector('.memory-field');
  const button = document.querySelector('.motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  if (!field || !window.Worker || !HTMLCanvasElement.prototype.transferControlToOffscreen) return;
  let worker, canvas, ready = false, failed = false, paused = false, timer, scheduled = 0;
  try { paused = localStorage.getItem('portfolio-motion') === 'paused'; } catch {}
  function send(data) { worker?.postMessage(data); }
  function appearance() {
    const css = getComputedStyle(document.documentElement);
    send({ type: 'theme', ink: css.getPropertyValue('--ink').trim(), accent: css.getPropertyValue('--accent').trim() });
  }
  function layout() {
    scheduled = 0;
    send({ type: 'resize', width: innerWidth, height: innerHeight, dpr: Math.min(devicePixelRatio || 1, 1.5) });
  }
  function state() {
    const running = !paused && !reduced.matches;
    button.textContent = paused ? 'Resume motion' : 'Pause motion';
    button.setAttribute('aria-pressed', String(paused));
    button.hidden = !ready || reduced.matches;
    field.classList.toggle('is-live', ready && !reduced.matches);
    send({ type: 'state', active: running && !document.hidden, visible: !document.hidden && !reduced.matches });
  }
  function fallback() {
    clearTimeout(timer); worker?.terminate(); worker = null;
    canvas?.remove(); ready = false; failed = true;
    field.classList.remove('is-live'); button.hidden = true;
  }
  function start() {
    if (worker || failed || reduced.matches || document.hidden) return;
    try {
      canvas = document.createElement('canvas'); canvas.setAttribute('aria-hidden', 'true');
      field.append(canvas);
      worker = new Worker(new URL('./engram-worker.js?v=20261112-6', import.meta.url), { type: 'module' });
      worker.addEventListener('error', fallback);
      worker.addEventListener('message', ({ data }) => {
        if (data.type === 'ready') { clearTimeout(timer); ready = true; state(); }
        if (data.type === 'failed') fallback();
      });
      const offscreen = canvas.transferControlToOffscreen();
      worker.postMessage({ type: 'init', canvas: offscreen }, [offscreen]);
      layout(); appearance(); send({ type: 'scroll', value: scrollY }); state();
      timer = setTimeout(fallback, 12000);
    } catch { fallback(); }
  }
  button.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('portfolio-motion', paused ? 'paused' : 'playing'); } catch {}
    state();
  });
  window.addEventListener('resize', () => { if (!scheduled) scheduled = requestAnimationFrame(layout); }, { passive: true });
  window.addEventListener('scroll', () => send({ type: 'scroll', value: scrollY }), { passive: true });
  window.addEventListener('pointermove', event => {
    if (finePointer.matches && event.pointerType !== 'touch' && !paused && !reduced.matches) {
      send({ type: 'pointer', x: event.clientX / innerWidth * 2 - 1, y: 1 - event.clientY / innerHeight * 2 });
    }
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => send({ type: 'pointer', x: 9, y: 9 }));
  window.addEventListener('portfolio:theme', appearance);
  document.addEventListener('visibilitychange', () => { start(); state(); });
  reduced.addEventListener('change', () => { start(); state(); });
  start();
}
