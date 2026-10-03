// Small helpers shared by the interactive topic pages.

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Colors the filled part of a slider (the browsers differ, so a variable carries the position). */
export function fillRange(input: HTMLInputElement) {
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  input.style.setProperty('--p', `${((Number(input.value) - min) / (max - min)) * 100}%`);
}

/** Finds an element or stops with a clear message, so a typo in a selector is easy to spot. */
export function q<T extends Element>(root: ParentNode, selector: string): T {
  const node = root.querySelector<T>(selector);
  if (!node) throw new Error(`Missing ${selector}`);
  return node;
}

/** Calls back when an element comes into view or leaves it, so animations can rest off screen. */
export function watchVisible(el: Element, callback: (visible: boolean) => void) {
  if (!('IntersectionObserver' in window)) {
    callback(true);
    return;
  }
  new IntersectionObserver(
    (entries) => callback(entries[entries.length - 1].isIntersecting),
    { threshold: 0.01 },
  ).observe(el);
}

/** A number as text with thousands separators: 5200 becomes "5,200". */
export const group = (n: number) => Math.round(n).toLocaleString('en-US');

/** Removes everything inside an element. (Older phones do not have replaceChildren.) */
export function clear(el: Element) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

/** Listens for a media query changing. Older phones only know the long way to do it. */
export function onMedia(mq: MediaQueryList, callback: () => void) {
  if (mq.addEventListener) mq.addEventListener('change', callback);
  else mq.addListener(callback);
}
