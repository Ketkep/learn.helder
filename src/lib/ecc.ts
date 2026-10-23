// Maths and drawings for the error correcting codes page. Everything is computed here, and the Hamming code is checked against every single flip by the page's own test run.
// The same text is made at build time (Astro) and in the browser.

export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
export const pct = (p: number, d = 1) => `${(p * 100).toFixed(d)}%`;

/** The seven bit pattern of a letter, then padded to eight with a leading zero. */
export const bitsOf = (ch: string): number[] => ch.charCodeAt(0).toString(2).padStart(8, '0').split('').map(Number);

/** The letter for eight bits, or a question mark if it is not a printable character. */
export function letterOf(bits: number[]): string {
  const n = bits.reduce((a, b) => a * 2 + b, 0);
  return n >= 32 && n < 127 ? String.fromCharCode(n) : '?';
}

// ---------- Station 1: noise ----------

/** The chance that all eight bits arrive unchanged when each is flipped with chance p. */
export const intact = (p: number, n = 8) => (1 - p) ** n;

export function flipSome(bits: number[], p: number, rnd: () => number = Math.random): { out: number[]; hit: boolean[] } {
  const hit = bits.map(() => rnd() < p);
  return { out: bits.map((b, i) => (hit[i] ? 1 - b : b)), hit };
}

// ---------- Station 2: say it three times ----------

/** The chance that majority voting over three copies gets one bit wrong: at least two of three flipped. */
export const tripleWrong = (p: number) => 3 * p * p * (1 - p) + p ** 3;

export const majority = (a: number, b: number, c: number) => (a + b + c >= 2 ? 1 : 0);

// ---------- Station 3: a check bit ----------

export const parityOf = (bits: number[]) => bits.reduce((a, b) => a + b, 0) % 2;

// ---------- Station 4: the circles (Hamming 7,4) ----------

/** The seven places in the order p1 p2 d1 p3 d2 d3 d4, as in the usual layout. Place numbers are 1 to 7. */
export const NAMES = ['p1', 'p2', 'd1', 'p3', 'd2', 'd3', 'd4'];

/** The three checks: each one lists the places it covers (numbers from 1). */
export const CHECKS: number[][] = [
  [1, 3, 5, 7],
  [2, 3, 6, 7],
  [4, 5, 6, 7],
];

/** Four data bits go in, seven bits come out. Each check bit makes its circle hold an even number of ones. */
export function encode(d: number[]): number[] {
  const [d1, d2, d3, d4] = d;
  const p1 = (d1 + d2 + d4) % 2;
  const p2 = (d1 + d3 + d4) % 2;
  const p3 = (d2 + d3 + d4) % 2;
  return [p1, p2, d1, p3, d2, d3, d4];
}

/** Which checks fail, as three bits (1 for a failed check). */
export const syndrome = (w: number[]): number[] => CHECKS.map((c) => c.reduce((a, pos) => a + w[pos - 1], 0) % 2);

/** The place that the failed checks point at: 0 if none failed, else the place number from 1 to 7. */
export const pointsAt = (s: number[]) => s[0] * 1 + s[1] * 2 + s[2] * 4;

export function decode(w: number[]): { fixed: number[]; at: number; data: number[] } {
  const at = pointsAt(syndrome(w));
  const fixed = w.slice();
  if (at) fixed[at - 1] = 1 - fixed[at - 1];
  return { fixed, at, data: [fixed[2], fixed[4], fixed[5], fixed[6]] };
}

/** Checks the code for every message and every single flip. Returns how many cases were tried and how many were put right. */
export function selfTest() {
  let tried = 0;
  let right = 0;
  let twoTried = 0;
  let twoRight = 0;
  for (let m = 0; m < 16; m++) {
    const d = [3, 2, 1, 0].map((s) => (m >> s) & 1);
    const w = encode(d);
    for (let i = 0; i < 7; i++) {
      const bad = w.slice();
      bad[i] = 1 - bad[i];
      tried++;
      if (decode(bad).data.join('') === d.join('')) right++;
      for (let j = i + 1; j < 7; j++) {
        const worse = bad.slice();
        worse[j] = 1 - worse[j];
        twoTried++;
        if (decode(worse).data.join('') === d.join('')) twoRight++;
      }
    }
  }
  return { tried, right, twoTried, twoRight };
}

/** Where each place sits in the drawing of three circles. */
export const SPOT: Record<number, [number, number]> = {
  1: [76, 60], // p1 only
  2: [224, 60], // p2 only
  3: [150, 52], // d1: p1 and p2
  4: [150, 190], // p3 only
  5: [112, 122], // d2: p1 and p3
  6: [188, 122], // d3: p2 and p3
  7: [150, 102], // d4: all three
};

/** The three circles and the seven bits. `bad` marks the checks that fail, and `flipped` the place that was changed. */
export function circlesSvg(w: number[], s: number[], flipped: number[]): string {
  const centres = [[110, 78], [190, 78], [150, 148]];
  let out = '';
  centres.forEach(([cx, cy], i) => {
    out += `<circle class="circ c${i + 1}${s[i] ? ' bad' : ''}" cx="${cx}" cy="${cy}" r="64"/>`;
  });
  [1, 2, 3, 4, 5, 6, 7].forEach((pos) => {
    const [x, y] = SPOT[pos];
    out += `<g class="place${flipped.includes(pos) ? ' flipped' : ''}"><circle cx="${x}" cy="${y}" r="13"/><text x="${x}" y="${y + 5}" text-anchor="middle">${w[pos - 1]}</text><text class="nm" x="${x}" y="${y - 17}" text-anchor="middle">${NAMES[pos - 1]}</text></g>`;
  });
  return out;
}
