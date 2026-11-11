// Two lightweight views share a worker: a brief viewport arrival, then the hero portrait.
export async function enhanceHero(container) {
  if (!('Worker' in window) || !('transferControlToOffscreen' in HTMLCanvasElement.prototype)) return;
  const canvas = document.createElement('canvas');
  const arrival = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true'); arrival.setAttribute('aria-hidden', 'true');
  arrival.className = 'signal-arrival';
  const control = container.querySelector('.figure-control');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const worker = new Worker(new URL('./hero-worker.js?v=20261112-1', import.meta.url), { type: 'module' });
  let ready = false, failed = false, visible = false, playing = true;
  let x = 0, y = 0;
  const send = message => { if (!failed) worker.postMessage(message); };
  function colors() {
    const style = getComputedStyle(container);
    return Object.fromEntries(['ink', 'accent', 'paper'].map(key => [key, style.getPropertyValue(`--${key}`).trim()]));
  }
  function dimensions() {
    const box = container.getBoundingClientRect();
    return { width: box.width, height: box.height, left: box.left, top: box.top, viewportWidth: innerWidth, viewportHeight: innerHeight };
  }
  function visibility() {
    const active = visible && !document.hidden && !motion.matches;
    arrival.hidden = !active;
    send({ type: 'visible', value: active });
  }
  function fail() {
    failed = true; ready = false; worker.terminate(); arrival.remove(); canvas.remove();
    container.classList.remove('is-webgl', 'is-preparing'); control.hidden = true;
  }
  function pause() {
    playing = !playing;
    control.setAttribute('aria-pressed', String(!playing));
    control.setAttribute('aria-label', playing ? 'Pause page animations' : 'Resume page animations');
    send({ type: 'play', value: playing });
    window.dispatchEvent(new CustomEvent('portfolio:motion', { detail: { playing } }));
  }
  function move(event) {
    const box = container.getBoundingClientRect();
    x = Math.max(-1, Math.min(1, (event.clientX - box.left) / box.width * 2 - 1));
    y = Math.max(-1, Math.min(1, (event.clientY - box.top) / box.height * 2 - 1));
    send({ type: 'pointer', x, y });
  }
  function reset() { x = 0; y = 0; send({ type: 'pointer', x, y }); }
  worker.addEventListener('error', fail);
  worker.addEventListener('message', ({ data }) => {
    if (data.type === 'arrival-complete') { arrival.remove(); return; }
    if (data.type === 'error') { fail(); return; }
    if (data.type === 'ready') {
      ready = true; container.classList.remove('is-preparing');
      send({ type: 'colors', value: colors() });
      container.classList.toggle('is-webgl', !motion.matches); control.hidden = motion.matches;
    }
  });
  const offscreen = canvas.transferControlToOffscreen();
  const arrivalOffscreen = arrival.transferControlToOffscreen();
  container.prepend(canvas); document.body.prepend(arrival); container.classList.add('is-preparing');
  worker.postMessage({ type: 'init', canvas: offscreen, arrival: arrivalOffscreen, ...dimensions(), dpr: Math.min(devicePixelRatio || 1, 2), colors: colors(), portrait: new URL('../images/portrait.webp', import.meta.url).href }, [offscreen, arrivalOffscreen]);
  control.addEventListener('pointermove', move, { passive: true });
  control.addEventListener('pointerdown', move, { passive: true });
  control.addEventListener('pointerleave', reset);
  control.addEventListener('pointercancel', reset);
  control.addEventListener('click', pause);
  control.addEventListener('blur', reset);
  control.addEventListener('keydown', event => {
    // Native Enter/Space activates the invisible figure control, including pause.
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'Escape'].includes(event.key)) return;
    event.preventDefault();
    if (['Home', 'Escape'].includes(event.key)) { reset(); return; }
    if (event.key === 'ArrowUp') y -= .2;
    else if (event.key === 'ArrowDown') y += .2;
    else x += event.key === 'ArrowLeft' ? -.2 : .2;
    x = Math.max(-1, Math.min(1, x)); y = Math.max(-1, Math.min(1, y));
    send({ type: 'pointer', x, y });
  });
  window.addEventListener('portfolio:theme', () => send({ type: 'colors', value: colors() }));
  document.addEventListener('visibilitychange', visibility);
  motion.addEventListener('change', () => {
    container.classList.toggle('is-webgl', ready && !motion.matches);
    control.hidden = motion.matches || !ready; visibility();
  });
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visibility(); }).observe(container);
  const resize = () => send({ type: 'resize', ...dimensions() });
  new ResizeObserver(resize).observe(container);
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('scroll', () => {
    // Scrolling into the content dismisses the viewport introduction immediately.
    arrival.remove(); send({ type: 'dismiss-arrival' });
  }, { passive: true, once: true });
}
