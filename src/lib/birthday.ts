// Small sums and drawings for the birthday page. With n people and 365 equally likely birthdays, the chance that all birthdays differ is
// (365/365) x (364/365) x ... x ((365 - n + 1)/365), and the chance of at least one shared birthday is 1 minus that. The chance that someone
// shares one chosen birthday with n other people is 1 minus (364/365) to the power n. Leap days and the uneven spread of real birthdays are
// left out, as the sources do. The same text is made at build time (Astro) and in the browser.

import { seeded } from './rand';

export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
export const DAYS = 365;

/** The chance that at least two of n people share a birthday. */
export function pAny(n: number) {
  let none = 1;
  for (let i = 0; i < n; i++) none *= (DAYS - i) / DAYS;
  return 1 - none;
}

/** The chance that at least one of n other people has one chosen birthday. */
export const pYou = (n: number) => 1 - Math.pow((DAYS - 1) / DAYS, n);

/** The number of pairs among n people. */
export const pairs = (n: number) => (n * (n - 1)) / 2;

/** The percentage with one decimal, and words at the two ends where rounding would say 0 or 100. */
export const pct = (p: number) => (p <= 0 ? '0%' : p > 0.999 ? 'above 99.9%' : p < 0.001 ? 'below 0.1%' : `${fmt(p * 100, 1)}%`);

/** The smallest group where a chance reaches a level. */
export function groupFor(level: number, f: (n: number) => number) {
  let n = 1;
  while (f(n) < level && n < 5000) n++;
  return n;
}

const W = 420;
const COLS = 28;
const CELL = W / COLS;

/** The year as 365 small squares, with each guest's day filled in and a day with two or more guests marked. */
export function yearSvg(days: number[]) {
  const count: Record<number, number> = {};
  days.forEach((d) => (count[d] = (count[d] || 0) + 1));
  let s = '';
  for (let d = 0; d < DAYS; d++) {
    const x = (d % COLS) * CELL;
    const y = Math.floor(d / COLS) * CELL;
    const c = count[d] || 0;
    s += `<rect class="day${c === 1 ? ' one' : c > 1 ? ' two' : ''}" x="${x + 1}" y="${y + 1}" width="${CELL - 2}" height="${CELL - 2}" rx="2"/>`;
  }
  return { svg: s, h: Math.ceil(DAYS / COLS) * CELL };
}

/** A room of n guests from a seed, and the number of days that have two or more of them. */
export function room(n: number, seed: number) {
  const r = seeded(seed);
  const days: number[] = [];
  for (let i = 0; i < n; i++) days.push(Math.floor(r() * DAYS));
  const seen: Record<number, number> = {};
  days.forEach((d) => (seen[d] = (seen[d] || 0) + 1));
  return { days, shared: Object.keys(seen).filter((k) => seen[Number(k)] > 1).length };
}

/** A chart of the chance against the number of people in the room, with a mark at n. Gives the curves for "any pair" and for "one of the others has my birthday". */
export function chartSvg(max: number, n: number, which: ('any' | 'you')[]) {
  const L = 34;
  const T = 10;
  const w = W - L - 10;
  const h = 150;
  const X = (v: number) => L + (v / max) * w;
  const Y = (p: number) => T + (1 - p) * h;
  let s = '';
  [0, 0.25, 0.5, 0.75, 1].forEach((p) => {
    s += `<path class="grid" d="M${L} ${Y(p)} H${L + w}"/><text class="lab small" x="${L - 4}" y="${Y(p) + 4}" text-anchor="end">${p * 100}%</text>`;
  });
  const ticks = max > 100 ? [0, 100, 200, 300] : [0, 25, 50, 75, 100];
  ticks.forEach((t) => (s += `<text class="lab small mid" x="${X(t)}" y="${T + h + 16}">${t}</text>`));
  s += `<text class="lab small mid" x="${L + w / 2}" y="${T + h + 32}">People</text>`;
  const curve = (f: (v: number) => number, cls: string) => {
    let d = '';
    for (let v = 0; v <= max; v++) d += `${v ? 'L' : 'M'}${X(v).toFixed(1)} ${Y(f(v)).toFixed(1)}`;
    return `<path class="${cls}" d="${d}"/>`;
  };
  if (which.indexOf('you') >= 0) s += curve((v) => pYou(Math.max(0, v - 1)), 'curve you');
  if (which.indexOf('any') >= 0) s += curve(pAny, 'curve any');
  s += `<path class="mark" d="M${X(n)} ${T} V${T + h}"/>`;
  which.forEach((k) => {
    const p = k === 'any' ? pAny(n) : pYou(n - 1);
    s += `<circle class="pt ${k}" cx="${X(n)}" cy="${Y(p)}" r="5"/>`;
  });
  return { svg: s, h: T + h + 40 };
}
