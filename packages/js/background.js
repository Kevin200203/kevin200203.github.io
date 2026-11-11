// Decorative sine-wave network, kept away from readable content.
export function enhanceBackground() {
  if (!('Worker' in window) || !('transferControlToOffscreen' in HTMLCanvasElement.prototype)) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'neural-background'; canvas.setAttribute('aria-hidden', 'true');
  const worker = new Worker(new URL('./background-worker.js?v=20261111-14', import.meta.url), { type: 'module' });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let failed = false, playing = true, scheduled = 0;
  const send = data => { if (!failed) worker.postMessage(data); };
  function measurements() {
    const style = getComputedStyle(document.body);
    const rects = [...document.querySelectorAll('h1,h2,h3,p,a,button,.contact-content,.hero-links,.secondary-links,.paper-links,.margin-note,.citation,.certification-list,.navigation,.site-footer,.hero-art')].map(el => {
      const box = el.getBoundingClientRect(); return { x: box.left - 10, y: box.top + scrollY - 10, width: box.width + 20, height: box.height + 20 };
    });
    send({ type: 'layout', width: innerWidth, height: innerHeight, scroll: scrollY, rects, color: style.getPropertyValue('--accent').trim(), dark: style.backgroundColor !== 'rgb(255, 255, 255)' });
  }
  function scheduleMeasurements() { if (!scheduled) scheduled = requestAnimationFrame(() => { scheduled = 0; measurements(); }); }
  function state() { send({ type: 'state', visible: !document.hidden, playing: playing && !reduced.matches }); }
  worker.addEventListener('error', () => { failed = true; canvas.remove(); worker.terminate(); });
  const offscreen = canvas.transferControlToOffscreen(); document.body.prepend(canvas);
  worker.postMessage({ type: 'init', canvas: offscreen, dpr: Math.min(devicePixelRatio || 1, 1.25) }, [offscreen]);
  measurements(); state();
  new ResizeObserver(scheduleMeasurements).observe(document.body);
  window.addEventListener('resize', scheduleMeasurements, { passive: true });
  window.addEventListener('scroll', () => send({ type: 'scroll', value: scrollY }), { passive: true });
  window.addEventListener('portfolio:theme', measurements);
  window.addEventListener('portfolio:motion', event => { playing = event.detail.playing; state(); });
  document.addEventListener('visibilitychange', state);
  reduced.addEventListener('change', state);
}
