// The one byte that the whole page reads. Eight switches, a number from 0 to 255, and a list of listeners.

let value = 65;
const listeners: (() => void)[] = [];

export const getByte = () => value;

export function setByte(v: number) {
  value = Math.min(255, Math.max(0, Math.round(v)));
  for (const fn of listeners) fn();
}

/** Calls `fn` now and every time the byte changes. */
export function watch(fn: () => void) {
  listeners.push(fn);
  fn();
}

/** The byte as eight digits: 65 gives "01000001". */
export const bits = (v: number) => v.toString(2).padStart(8, '0');

/** Is switch `n` (0 is the right-hand one, worth 1) on? */
export const isOn = (v: number, n: number) => ((v >> n) & 1) === 1;
