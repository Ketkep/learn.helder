// Maths and drawings for the sorting page. The three methods are plain bubble sort, insertion sort and top-down merge sort, written out
// so that each step can be shown and each comparison counted. The counts on the page come from running the methods on a list, and the
// bounds come from the formulas in the sources. The lists are drawn from fixed seeds. The same text is made at build time (Astro) and
// in the browser.

import { seeded } from './rand';

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export type Method = 'Bubble' | 'Insertion' | 'Merge';
export const METHODS: Method[] = ['Bubble', 'Insertion', 'Merge'];

/** A shuffled list of the numbers 1 to n, from a seed. */
export function shuffled(n: number, seed: number): number[] {
  const r = seeded(seed);
  const a = Array.from({ length: n }, (_, i) => i + 1);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pairs that are the wrong way round. The fewest swaps of neighbours that sort a list is exactly this number. */
export function inversions(a: number[]): number {
  let n = 0;
  for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (a[i] > a[j]) n++;
  return n;
}

export interface Frame {
  list: number[];
  mark: number[]; // positions just compared or moved
  compares: number;
  moves: number;
  note: string;
}

/** Every step of a method on a list, as a row of frames. */
export function frames(method: Method, start: number[]): Frame[] {
  const a = start.slice();
  const out: Frame[] = [];
  let compares = 0;
  let moves = 0;
  const snap = (mark: number[], note: string) => out.push({ list: a.slice(), mark, compares, moves, note });
  snap([], 'The list as it starts.');
  if (method === 'Bubble') {
    let swapped = true;
    for (let end = a.length - 1; end > 0 && swapped; end--) {
      swapped = false;
      for (let i = 0; i < end; i++) {
        compares++;
        if (a[i] > a[i + 1]) {
          [a[i], a[i + 1]] = [a[i + 1], a[i]];
          moves++;
          swapped = true;
          snap([i, i + 1], `${a[i + 1]} was bigger than ${a[i]}, so they swapped.`);
        } else snap([i, i + 1], `${a[i]} and ${a[i + 1]} are in order.`);
      }
    }
  } else if (method === 'Insertion') {
    for (let i = 1; i < a.length; i++) {
      let j = i;
      while (j > 0) {
        compares++;
        if (a[j - 1] > a[j]) {
          [a[j - 1], a[j]] = [a[j], a[j - 1]];
          moves++;
          snap([j - 1, j], `${a[j - 1]} moved left past ${a[j]}.`);
          j--;
        } else {
          snap([j - 1, j], `${a[j - 1]} and ${a[j]} are in order, so ${a[j]} stops here.`);
          break;
        }
      }
    }
  } else {
    const aux = a.slice();
    const sort = (lo: number, hi: number) => {
      if (hi - lo < 1) return;
      const mid = Math.floor((lo + hi) / 2);
      sort(lo, mid);
      sort(mid + 1, hi);
      for (let k = lo; k <= hi; k++) aux[k] = a[k];
      let i = lo;
      let j = mid + 1;
      for (let k = lo; k <= hi; k++) {
        if (i > mid) a[k] = aux[j++];
        else if (j > hi) a[k] = aux[i++];
        else {
          compares++;
          a[k] = aux[j] < aux[i] ? aux[j++] : aux[i++];
        }
        moves++;
        snap([k], `${a[k]} was the smaller of the two fronts, so it went into place ${k + 1}.`);
      }
    };
    sort(0, a.length - 1);
  }
  return out;
}

/** The number of comparisons a method makes on a list, without drawing anything. */
export function countCompares(method: Method, start: number[]): number {
  const a = start.slice();
  let c = 0;
  if (method === 'Bubble') {
    let swapped = true;
    for (let end = a.length - 1; end > 0 && swapped; end--) {
      swapped = false;
      for (let i = 0; i < end; i++) {
        c++;
        if (a[i] > a[i + 1]) {
          [a[i], a[i + 1]] = [a[i + 1], a[i]];
          swapped = true;
        }
      }
    }
  } else if (method === 'Insertion') {
    for (let i = 1; i < a.length; i++) {
      let j = i;
      while (j > 0) {
        c++;
        if (a[j - 1] > a[j]) {
          [a[j - 1], a[j]] = [a[j], a[j - 1]];
          j--;
        } else break;
      }
    }
  } else {
    const aux = a.slice();
    const sort = (lo: number, hi: number) => {
      if (hi - lo < 1) return;
      const mid = Math.floor((lo + hi) / 2);
      sort(lo, mid);
      sort(mid + 1, hi);
      for (let k = lo; k <= hi; k++) aux[k] = a[k];
      let i = lo;
      let j = mid + 1;
      for (let k = lo; k <= hi; k++) {
        if (i > mid) a[k] = aux[j++];
        else if (j > hi) a[k] = aux[i++];
        else {
          c++;
          a[k] = aux[j] < aux[i] ? aux[j++] : aux[i++];
        }
      }
    };
    sort(0, a.length - 1);
  }
  return c;
}

/** No method that only compares pairs can promise fewer comparisons than this: log2 of n factorial, rounded up. */
export function floorCompares(n: number): number {
  let s = 0;
  for (let i = 2; i <= n; i++) s += Math.log2(i);
  return Math.ceil(s);
}

/** The most comparisons plain bubble or insertion sort can need. */
export const quadratic = (n: number) => (n * (n - 1)) / 2;

/** Bars for a list, with the marked ones in a second colour. */
export function barsSvg(list: number[], mark: number[] = [], label = ''): string {
  const n = list.length;
  const w = 276 / n;
  let o = `<rect class="bed" x="1" y="1" width="298" height="168" rx="8"/>`;
  list.forEach((v, i) => {
    const h = (v / n) * 120;
    o += `<rect class="${mark.includes(i) ? 'bar hot' : 'bar'}" x="${f1(12 + i * w + 1)}" y="${f1(150 - h)}" width="${f1(Math.max(1, w - 2))}" height="${f1(h)}"/>`;
  });
  if (label) o += `<text class="lab" x="12" y="18">${label}</text>`;
  return o;
}

/** Bars for the cost of each method, drawn to the same scale. */
export function costSvg(rows: { name: string; value: number }[]): string {
  const max = Math.max(...rows.map((r) => r.value));
  let o = `<rect class="bed" x="1" y="1" width="298" height="168" rx="8"/>`;
  rows.forEach((r, i) => {
    const y = 30 + i * 32;
    const w = (r.value / max) * 170;
    o += `<text class="lab small" x="10" y="${y + 12}">${r.name}</text><rect class="${r.name === 'Merge' ? 'bar hot' : 'bar'}" x="100" y="${y}" width="${f1(Math.max(1.5, w))}" height="18"/>`;
    o += `<text class="lab small" x="${f1(104 + Math.max(1.5, w))}" y="${y + 13}">${fmt(r.value)}</text>`;
  });
  o += `<text class="lab" x="12" y="18">Comparisons, to the same scale</text>`;
  return o;
}
