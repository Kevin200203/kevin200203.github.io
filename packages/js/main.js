const root = document.documentElement;
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const themeButton = document.querySelector('.theme-toggle');
let preference = root.dataset.theme || 'system';

function applyTheme() {
  if (preference === 'system') delete root.dataset.theme;
  else root.dataset.theme = preference;
  const actualTheme = preference === 'system' ? (systemTheme.matches ? 'dark' : 'light') : preference;
  const next = { system: 'light', light: 'dark', dark: 'system' }[preference];
  themeButton.querySelector('.theme-label').textContent = preference === 'system' ? 'Auto' : preference === 'light' ? 'Light' : 'Dark';
  themeButton.setAttribute('aria-label', `Color theme: ${preference}. Switch to ${next} theme`);
  themeButton.title = `Theme: ${preference} (switch to ${next})`;
  document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
    meta.content = actualTheme === 'dark' ? '#171717' : '#ffffff';
  });
  window.dispatchEvent(new Event('portfolio:theme'));
}
themeButton.hidden = false;
applyTheme();
themeButton.addEventListener('click', () => {
  preference = { system: 'light', light: 'dark', dark: 'system' }[preference];
  try {
    if (preference === 'system') localStorage.removeItem('portfolio-theme');
    else localStorage.setItem('portfolio-theme', preference);
  } catch { /* Theme selection still works when storage is unavailable. */ }
  applyTheme();
});
systemTheme.addEventListener('change', applyTheme);

const navigation = document.querySelector('.navigation');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const mobileNavigation = window.matchMedia('(max-width: 700px)');
navigation.classList.add('is-enhanced');
navToggle.hidden = false;
function closeNavigation(restoreFocus = false) {
  const wasOpen = navigation.classList.contains('is-open');
  navigation.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.querySelector('span').textContent = '+';
  if (restoreFocus && wasOpen) navToggle.focus();
}
navToggle.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.querySelector('span').textContent = isOpen ? '−' : '+';
});
navMenu.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link) return;
  closeNavigation();
  // Move focus with the in-page destination; never leave it in a hidden menu.
  const destination = document.querySelector(link.hash);
  destination?.setAttribute('tabindex', '-1');
  destination?.focus({ preventScroll: true });
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeNavigation(true);
});
document.addEventListener('click', event => {
  if (!navigation.contains(event.target)) closeNavigation();
});
mobileNavigation.addEventListener('change', () => closeNavigation());

const copyButton = document.querySelector('#copy-bibtex');
const citation = document.querySelector('#bibtex');
const copyStatus = document.querySelector('#copy-status');
copyButton.hidden = false;
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(citation.textContent.trim());
    copyStatus.textContent = 'BibTeX copied.';
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(citation);
    selection.removeAllRanges();
    selection.addRange(range);
    copyStatus.textContent = 'Copy unavailable. The citation is selected; copy it with your browser.';
  }
});

function loadBackground() {
  const load = () => import('./engram.js?v=20261112-3').then(module => module.enhanceMemory()).catch(() => {});
  if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 1800 }); else setTimeout(load, 100);
}
if (document.readyState === 'complete') loadBackground(); else window.addEventListener('load', loadBackground, { once: true });
