// Maths and drawings for the Pythagoras page. Every number is computed here. The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

type P = [number, number];

// ---------- Slab 1: squares on the sides ----------

/** A right triangle with legs a and b, and a square on each side, in a 300 by 190 box. */
export function squaresSvg(a: number, b: number): string {
  // Maths coordinates with y up: the right angle at the origin, leg a along x, leg b along y.
  const sqA: P[] = [[0, 0], [a, 0], [a, -a], [0, -a]];
  const sqB: P[] = [[0, 0], [0, b], [-b, b], [-b, 0]];
  const sqC: P[] = [[a, 0], [0, b], [b, a + b], [a + b, a]];
  const all = [...sqA, ...sqB, ...sqC];
  const minX = Math.min(...all.map((p) => p[0]));
  const maxX = Math.max(...all.map((p) => p[0]));
  const minY = Math.min(...all.map((p) => p[1]));
  const maxY = Math.max(...all.map((p) => p[1]));
  const s = Math.min(280 / (maxX - minX), 170 / (maxY - minY));
  const ox = 150 - ((minX + maxX) / 2) * s;
  const oy = 95 + ((minY + maxY) / 2) * s;
  const X = (x: number) => f1(ox + x * s);
  const Y = (y: number) => f1(oy - y * s);
  const poly = (pts: P[], cls: string) => `<polygon class="${cls}" points="${pts.map((p) => `${X(p[0])},${Y(p[1])}`).join(' ')}"/>`;
  const tri = poly([[0, 0], [a, 0], [0, b]], 'tri');
  const txt = (x: number, y: number, t: string) => `<text class="num" x="${X(x)}" y="${f1(Number(Y(y)) + 5)}" text-anchor="middle">${t}</text>`;
  const m = Math.min(a, b) * 0.28;
  const mark = `<path class="mark" d="M${X(m)},${Y(0)} L${X(m)},${Y(m)} L${X(0)},${Y(m)}"/>`;
  return poly(sqA, 'sq a') + poly(sqB, 'sq b') + poly(sqC, 'sq c') + tri + mark + txt(a / 2, -a / 2, String(a * a)) + txt(-b / 2, b / 2, String(b * b)) + txt((a + b) / 2, (a + b) / 2, fmt(a * a + b * b, 0));
}

export const hyp = (a: number, b: number) => Math.sqrt(a * a + b * b);
export const isTriple = (a: number, b: number) => Number.isInteger(hyp(a, b));

// ---------- Slab 2: move the triangles ----------

// Triangles as (right angle, end of the 4 leg, end of the 3 leg). Layout A has a tilted square in the middle. Layout B has two squares.
const LAY_A: P[][] = [
  [[7, 7], [3, 7], [7, 4]],
  [[7, 0], [7, 4], [4, 0]],
  [[0, 0], [4, 0], [0, 3]],
  [[0, 7], [0, 3], [3, 7]],
];
const LAY_B: P[][] = [
  [[7, 7], [3, 7], [7, 4]], // bottom right, lower triangle
  [[3, 0], [3, 4], [0, 0]], // top left rectangle, upper triangle
  [[0, 4], [0, 0], [3, 4]], // top left rectangle, lower triangle
  [[3, 4], [7, 4], [3, 7]], // bottom right rectangle, upper triangle
];
const PAIRS = [1, 2, 3, 0]; // which triangle of A goes to which of B (index into LAY_B)

const COLOURS = ['t1', 't2', 't3', 't4'];

/** The four triangles at a point t from 0 (tilted square) to 1 (two squares), each turned and slid without bending. */
export function moveSvg(t: number): string {
  const S = 22;
  const OX = 73;
  const OY = 18;
  let out = '';
  LAY_A.forEach((tri, i) => {
    const target = LAY_B[PAIRS[i]];
    const [r0, l40] = [tri[0], tri[1]];
    const [r1, l41] = [target[0], target[1]];
    const a0 = Math.atan2(l40[1] - r0[1], l40[0] - r0[0]);
    const a1 = Math.atan2(l41[1] - r1[1], l41[0] - r1[0]);
    let d = a1 - a0;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    const ang = d * t;
    const rx = r0[0] + (r1[0] - r0[0]) * t;
    const ry = r0[1] + (r1[1] - r0[1]) * t;
    const pts = tri.map((p) => {
      const vx = p[0] - r0[0];
      const vy = p[1] - r0[1];
      const x = rx + vx * Math.cos(ang) - vy * Math.sin(ang);
      const y = ry + vx * Math.sin(ang) + vy * Math.cos(ang);
      return `${f1(OX + x * S)},${f1(OY + y * S)}`;
    });
    out += `<polygon class="tri ${COLOURS[i]}" points="${pts.join(' ')}"/>`;
  });
  const frame = `<rect class="frame" x="${OX}" y="${OY}" width="${7 * S}" height="${7 * S}"/>`;
  return frame + out;
}

export function moveText(t: number): string {
  if (t < 0.02) return 'Four copies of a triangle with sides 3, 4 and 5 sit in the corners of a square with side 3 + 4 = 7. The space left in the middle is a tilted square with side 5, so its area is 5 × 5 = 25.';
  if (t > 0.98) return 'The same four triangles now sit in two rectangles. The space left is a square with side 3 and a square with side 4. Their areas are 3 × 3 = 9 and 4 × 4 = 16, and 9 + 16 = 25.';
  return 'The triangles are sliding and turning. They keep their shape and size, so the space left in the big square keeps the same area, 49 − 4 × 6 = 25.';
}

// ---------- Slab 3: triples ----------

/** Euclid's formula: for m larger than n, the sides are m squared minus n squared, 2mn and m squared plus n squared. */
export function euclid(m: number, n: number): [number, number, number] {
  return [m * m - n * n, 2 * m * n, m * m + n * n];
}

const gcd = (x: number, y: number): number => (y ? gcd(y, x % y) : x);

/** Every right triangle with whole number sides and a hypotenuse up to a limit, found by trying every pair of legs. */
export function allTriples(limit: number): { a: number; b: number; c: number; primitive: boolean }[] {
  const out: { a: number; b: number; c: number; primitive: boolean }[] = [];
  for (let a = 1; a < limit; a++) {
    for (let b = a; b < limit; b++) {
      const c2 = a * a + b * b;
      const c = Math.round(Math.sqrt(c2));
      if (c <= limit && c * c === c2) out.push({ a, b, c, primitive: gcd(gcd(a, b), c) === 1 });
    }
  }
  return out.sort((p, q) => p.c - q.c || p.a - q.a);
}

// ---------- Slab 4: is it square? ----------

export type Kind = 'right' | 'acute' | 'obtuse' | 'none';

/** Given three sides: no triangle, or right, acute or obtuse, from comparing the squares. */
export function kindOf(x: number, y: number, z: number): { kind: Kind; sides: number[]; angle: number } {
  const s = [x, y, z].sort((p, q) => p - q);
  if (s[0] + s[1] <= s[2]) return { kind: 'none', sides: s, angle: 0 };
  const lhs = s[0] * s[0] + s[1] * s[1];
  const rhs = s[2] * s[2];
  const angle = (Math.acos((s[0] * s[0] + s[1] * s[1] - s[2] * s[2]) / (2 * s[0] * s[1])) * 180) / Math.PI;
  return { kind: lhs === rhs ? 'right' : lhs > rhs ? 'acute' : 'obtuse', sides: s, angle };
}

/** The triangle with its longest side along the bottom, and a small square at the corner that sits opposite the longest side if it is right. */
export function cornerSvg(x: number, y: number, z: number): string {
  const { kind, sides } = kindOf(x, y, z);
  if (kind === 'none') return `<text class="num" x="150" y="100" text-anchor="middle">These sides cannot make a triangle</text>`;
  const [a, b, c] = sides;
  // Base from (0,0) to (c,0); apex from the two other sides.
  const px = (a * a - b * b + c * c) / (2 * c);
  const py = Math.sqrt(Math.max(0, a * a - px * px));
  const s = Math.min(270 / c, 150 / py);
  const ox = 150 - (c / 2) * s;
  const X = (u: number) => f1(ox + u * s);
  const Y = (v: number) => f1(165 - v * s);
  const tri = `<polygon class="tri t1" points="${X(0)},${Y(0)} ${X(c)},${Y(0)} ${X(px)},${Y(py)}"/>`;
  const labels = `<text class="num" x="${f1((Number(X(0)) + Number(X(px))) / 2 - 10)}" y="${f1((Number(Y(0)) + Number(Y(py))) / 2)}" text-anchor="end">${b}</text><text class="num" x="${f1((Number(X(c)) + Number(X(px))) / 2 + 10)}" y="${f1((Number(Y(0)) + Number(Y(py))) / 2)}">${a}</text><text class="num" x="150" y="184" text-anchor="middle">${c}</text>`;
  let mark = '';
  if (kind === 'right') {
    const m = 14;
    const ux = (0 - px) / b;
    const uy = (0 - py) / b;
    const vx = (c - px) / a;
    const vy = (0 - py) / a;
    const q = (dx: number, dy: number) => `${f1(Number(X(px)) + dx)},${f1(Number(Y(py)) - dy)}`;
    mark = `<path class="mark" d="M${q(ux * m * 1, uy * m * 1)} L${q((ux + vx) * m, (uy + vy) * m)} L${q(vx * m, vy * m)}"/>`;
  }
  return tri + labels + mark;
}
