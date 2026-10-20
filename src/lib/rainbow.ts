// Maths and drawings for the rainbow page: a ray through a spherical drop, the colours, where the bow sits in the sky, and the second bow.
// The same strings are used when the page is built and in the browser.

const f1 = (n: number) => Math.round(n * 10) / 10;
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** The refractive index of water for a wavelength in nanometres, from a fitted formula: about 1.330 at 700 nm and 1.343 at 400 nm. */
export function indexOf(nm: number): number {
  return 1.32403 + 3080 / (nm * nm);
}

/** Total turn of a ray, in degrees, that enters a drop, reflects k times inside and leaves. b is how far from the middle it hits, from 0 to 1. */
export function deviation(b: number, n: number, k: number): number {
  const i = Math.asin(b);
  const r = Math.asin(b / n);
  return k * 180 + 2 * deg(i) - 2 * (k + 1) * deg(r);
}

/** The rays pile up where the turn is smallest (k = 1) or where it is closest to the straight line back (k = 2). */
export function minDeviation(n: number, k: number): { b: number; d: number } {
  let best = { b: 0, d: Infinity };
  for (let s = 1; s < 4000; s++) {
    const b = s / 4000;
    const d = deviation(b, n, k);
    const score = k === 1 ? d : Math.abs(d - 180) * 1 + 0;
    const bestScore = k === 1 ? best.d : Math.abs(best.d - 180);
    if (best.d === Infinity || (k === 1 ? score < bestScore : score < bestScore)) best = { b, d };
  }
  return best;
}

/** The angle from the point opposite the Sun where the bow appears. */
export function bowAngle(n: number, k: number): number {
  const m = minDeviation(n, k);
  return k % 2 === 1 ? 180 - m.d : m.d - 180;
}

export const colours = [
  { name: 'Red', nm: 700, css: '#e8412f' },
  { name: 'Orange', nm: 610, css: '#f08a2c' },
  { name: 'Yellow', nm: 580, css: '#f0d12c' },
  { name: 'Green', nm: 530, css: '#3fb55a' },
  { name: 'Blue', nm: 470, css: '#3a78e0' },
  { name: 'Violet', nm: 400, css: '#8a4fd0' },
];

/** The path of a ray in a drop, drawn on a circle of radius 62. */
export function dropSvg(b: number, n: number, k: number): string {
  const [cx, cy, R] = [150, 80, 62];
  const i = Math.asin(b);
  const r = Math.asin(b / n);
  const ex = cx - R * Math.sqrt(1 - b * b);
  const ey = cy - R * b;
  const pts: [number, number][] = [[ex, ey]];
  let d = i - r;
  const chord = 2 * R * Math.cos(r);
  for (let j = 0; j <= k; j++) {
    const [px, py] = pts[pts.length - 1];
    pts.push([px + chord * Math.cos(d), py + chord * Math.sin(d)]);
    d += Math.PI - 2 * r;
  }
  // The last chord ends at the exit point. Undo the extra turn, then add the turn at the exit.
  d -= Math.PI - 2 * r;
  const out = d + (i - r);
  const [lx, ly] = pts[pts.length - 1];
  const path = pts.map(([x, y], idx) => `${idx ? 'L' : 'M'}${f1(x)} ${f1(y)}`).join('');
  const incoming = `<line class="ray" x1="8" y1="${f1(ey)}" x2="${f1(ex)}" y2="${f1(ey)}"/>`;
  const outgoing = `<line class="ray out" x1="${f1(lx)}" y1="${f1(ly)}" x2="${f1(lx + 70 * Math.cos(out))}" y2="${f1(ly + 70 * Math.sin(out))}"/>`;
  return `<circle class="drop" cx="${cx}" cy="${cy}" r="${R}"/>${incoming}<path class="ray in" d="${path}"/>${outgoing}`;
}

/** The curve of the turn against where the ray hits, with a mark at b. */
export function curveSvg(b: number, n: number): string {
  const [x0, w, top, h] = [14, 270, 10, 70];
  const [lo, hi] = [136, 182];
  const X = (v: number) => x0 + w * v;
  const Y = (d: number) => top + h - (h * (d - lo)) / (hi - lo);
  let line = '';
  for (let s = 1; s <= 200; s++) {
    const v = s / 200;
    line += `${s === 1 ? 'M' : 'L'}${f1(X(v))} ${f1(Y(deviation(v * 0.999, n, 1)))}`;
  }
  const m = minDeviation(n, 1);
  const here = deviation(b, n, 1);
  return `<path class="curve" d="${line}"/><circle class="min" cx="${f1(X(m.b))}" cy="${f1(Y(m.d))}" r="4"/><circle class="here" cx="${f1(X(b))}" cy="${f1(Y(here))}" r="5"/><text class="lab" x="${x0}" y="${top + h + 14}">hits the middle</text><text class="lab" x="${x0 + w}" y="${top + h + 14}" text-anchor="end">hits the edge</text>`;
}

/** The sky: the horizon, the point opposite the Sun and the bows. The bands are drawn wider than they are, so that the colours can be seen. */
export function skySvg(sunAlt: number, second: boolean): string {
  const [horizon, s] = [104, 1.55];
  const cx = 150;
  const cy = horizon + sunAlt * s;
  const ring = (radius: number, colour: string) => `<circle class="arc" cx="${cx}" cy="${f1(cy)}" r="${f1(radius)}" stroke="${colour}"/>`;
  // Red is on the outside of the first bow and on the inside of the second
  const prim = colours.map((c, i) => ring(41.2 * s + (colours.length - 1 - i) * 2.6, c.css)).join('');
  const sec = second ? colours.map((c, i) => ring(50.2 * s + i * 2.6, c.css)).join('') : '';
  const ground = `<rect class="ground" x="2" y="${horizon}" width="296" height="24"/>`;
  const anti = sunAlt < 14 ? `<circle class="anti" cx="${cx}" cy="${f1(cy)}" r="3"/>` : '';
  return `<clipPath id="skyclip"><rect x="2" y="2" width="296" height="${horizon - 2}"/></clipPath><g clip-path="url(#skyclip)">${prim}${sec}</g>${ground}<line class="hor" x1="2" y1="${horizon}" x2="298" y2="${horizon}"/>${anti}`;
}

export function topOfBow(sunAlt: number, angle: number): number {
  return angle - sunAlt;
}
