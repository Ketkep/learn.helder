// Maths and drawings for the Towers of Hanoi page. Everything is computed here. The same text is made at build time (Astro) and in the browser.

export type Pegs = number[][];

const f1 = (n: number) => n.toFixed(1);

export const NAMES = ['A', 'B', 'C'];

export const start = (n: number): Pegs => [Array.from({ length: n }, (_, i) => n - i), [], []];

export const clone = (p: Pegs): Pegs => p.map((x) => x.slice());

/** A disk can go on an empty peg or on a bigger disk. */
export function legal(p: Pegs, from: number, to: number): boolean {
  if (from === to || !p[from].length) return false;
  const d = p[from][p[from].length - 1];
  const top = p[to][p[to].length - 1];
  return top === undefined || d < top;
}

export function move(p: Pegs, from: number, to: number): Pegs {
  const q = clone(p);
  q[to].push(q[from].pop() as number);
  return q;
}

/** The fewest moves for n disks: 2 to the n minus 1. */
export const fewest = (n: number) => 2 ** n - 1;

/** The best solution as a list of [from, to] pegs, found by the rule: move the pile above the biggest disk out of the way, move the biggest, then put the pile back on top. */
export function solution(n: number, from = 0, to = 2, via = 1): [number, number][] {
  if (n === 0) return [];
  return [...solution(n - 1, from, via, to), [from, to] as [number, number], ...solution(n - 1, via, to, from)];
}

export const solved = (p: Pegs, n: number) => p[2].length === n;

/** The pegs, with disks in shades of gold. Disk 1 is the smallest. */
export function boardSvg(p: Pegs, n: number, lifted = -1): string {
  const base = 168;
  const dh = Math.min(16, 120 / Math.max(n, 3));
  const wMax = 80;
  const wMin = 18;
  let s = `<rect class="floor" x="8" y="${base}" width="284" height="8" rx="3"/>`;
  [50, 150, 250].forEach((cx, i) => {
    s += `<rect class="peg${lifted === i ? ' on' : ''}" x="${cx - 3}" y="40" width="6" height="${base - 40}" rx="3"/>`;
    p[i].forEach((d, k) => {
      const w = wMin + ((wMax - wMin) * (d - 1)) / Math.max(n - 1, 1);
      const top = k === p[i].length - 1;
      const y = lifted === i && top ? 18 : base - (k + 1) * dh;
      s += `<rect class="disk d${(d - 1) % 7}" x="${f1(cx - w / 2)}" y="${f1(y)}" width="${f1(w)}" height="${f1(dh - 2)}" rx="4"/>`;
    });
    s += `<text class="lab" x="${cx}" y="188" text-anchor="middle">${NAMES[i]}</text>`;
  });
  return s;
}

// ---------- Counting ----------

export const movesText = (n: number) => (2n ** BigInt(n) - 1n).toLocaleString('en-US');

const SECONDS_PER_YEAR = 365.25 * 24 * 3600;

/** Years needed at one move a second, as words. */
export function yearsText(n: number): string {
  const secs = Number(2n ** BigInt(n) - 1n);
  const y = secs / SECONDS_PER_YEAR;
  if (secs < 60) return `${Math.round(secs)} second${secs === 1 ? '' : 's'}`;
  if (y < 1 / 365.25) return `${(secs / 60).toFixed(secs < 600 ? 1 : 0)} minutes`;
  if (y < 1) return `${(secs / 86400).toFixed(secs / 86400 < 10 ? 1 : 0)} days`;
  if (y < 1e3) return `${y.toFixed(y < 10 ? 1 : 0)} years`;
  if (y < 1e6) return `${(y / 1e3).toFixed(1)} thousand years`;
  if (y < 1e9) return `${(y / 1e6).toFixed(1)} million years`;
  return `${(y / 1e9).toFixed(0)} billion years`;
}

// ---------- The ruler ----------

/** Which disk moves on move number k (counting from 1): the smallest disk on odd moves, the next on every fourth, and so on. This is the position of the lowest 1 in k written in binary. */
export function diskOnMove(k: number): number {
  let d = 1;
  let x = k;
  while (x % 2 === 0) {
    x /= 2;
    d++;
  }
  return d;
}

export const binary = (k: number, width: number) => k.toString(2).padStart(width, '0');

/** How many times disk d moves in a solution for n disks. */
export const timesMoved = (n: number, d: number) => 2 ** (n - d);
