import { outline } from './portrait-outline.js?v=20261112-6';

// The neural geometry follows the pose outline; source pixels are only used by the separate photo reveal.
export const palette = ['#b4232c', '#cc5565', '#9e4a72', '#75658e', '#af7682', '#d28d7d'];
export const random = n => { const f = Math.sin(n * 127.1 + 311.7) * 43758.5453; return f - Math.floor(f); };
export function inside(x, y) {
  let hit = false;
  for (let i = 0, j = outline.length - 1; i < outline.length; j = i++) {
    const a = outline[i], b = outline[j];
    if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) hit = !hit;
  }
  return hit;
}
