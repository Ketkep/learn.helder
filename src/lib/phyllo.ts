// Maths and drawings for the sunflower page. The seed model is Vogel's: seed number n sits at distance proportional to the square
// root of n and is turned by the same angle from the one before. The golden angle and the Fibonacci counts come from the sources.
// The gap measure is a toy measure made for this page. The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

/** The golden angle in degrees: 360 divided by the golden ratio squared. */
export const GOLDEN = 180 * (3 - Math.sqrt(5));

export const FIB = [5, 8, 13, 21, 34, 55];

const R = 140;

/** The positions of seeds, number 1 at the middle. */
export function seeds(angle: number, n: number): [number, number][] {
  const c = R / Math.sqrt(n);
  const out: [number, number][] = [];
  for (let i = 1; i <= n; i++) {
    const a = (i * angle * Math.PI) / 180;
    out.push([c * Math.sqrt(i) * Math.cos(a), c * Math.sqrt(i) * Math.sin(a)]);
  }
  return out;
}

/** A drawing of the head. With `arms`, seeds are coloured by their number modulo `arms`, which shows that many spiral arms. */
export function headSvg(angle: number, n: number, arms = 0): string {
  const c = R / Math.sqrt(n);
  const r = Math.max(1.3, c * 0.5);
  let o = `<rect class="field" x="1" y="1" width="298" height="298" rx="8"/><circle class="disc" cx="150" cy="150" r="${R + 6}"/>`;
  seeds(angle, n).forEach(([x, y], i) => {
    const cls = arms ? (i % arms === 0 ? 'seed hot' : (i % arms) % 2 ? 'seed a' : 'seed b') : 'seed';
    o += `<circle class="${cls}" cx="${f1(150 + x)}" cy="${f1(150 + y)}" r="${f1(r)}"/>`;
  });
  return o;
}

/** How many straight rays a turn of this angle gives, if it is close to a fraction of the circle with a small bottom number. */
export function rays(angle: number): number {
  for (let q = 1; q <= 13; q++) {
    for (let p = 1; p < q; p++) {
      if (Math.abs(angle - (360 * p) / q) < 0.15) return q;
    }
  }
  return 0;
}

/** A toy measure of gaps: the biggest empty circle in the head, as a share of the average seed spacing. */
export function gap(angle: number, n: number): number {
  const pts = seeds(angle, n);
  const spacing = R / Math.sqrt(n);
  let worst = 0;
  const step = 5;
  for (let gx = -R + step; gx < R - step; gx += step) {
    for (let gy = -R + step; gy < R - step; gy += step) {
      if (gx * gx + gy * gy > (R - 2 * spacing) ** 2) continue;
      let best = Infinity;
      for (const [x, y] of pts) {
        const d = (x - gx) * (x - gx) + (y - gy) * (y - gy);
        if (d < best) best = d;
      }
      worst = Math.max(worst, Math.sqrt(best));
    }
  }
  return worst / spacing;
}

/** The gap measure for many angles, 300 seeds, one every degree from 100 to 180. */
export const landscape = (() => {
  let cache: [number, number][] | null = null;
  return () => {
    if (!cache) {
      cache = [];
      for (let a = 100; a <= 180; a += 1) cache.push([a, gap(a, 300)]);
    }
    return cache;
  };
})();

/** A graph of the gap measure against the angle, with a marker. The graph is capped so the good angles can be told apart. */
export function landscapeSvg(angle: number): string {
  const cap = 12;
  const gx = (a: number) => 14 + ((a - 100) / 80) * 272;
  const gy = (g: number) => 130 - (Math.min(g, cap) / cap) * 100;
  let d = '';
  landscape().forEach(([a, g], i) => (d += `${i ? 'L' : 'M'}${f1(gx(a))} ${f1(gy(g))} `));
  let o = `<rect class="field" x="1" y="1" width="298" height="168" rx="8"/>`;
  o += `<line class="axis" x1="14" y1="130" x2="286" y2="130"/>`;
  for (const a of [100, 120, 140, 160, 180]) o += `<line class="tick" x1="${f1(gx(a))}" y1="130" x2="${f1(gx(a))}" y2="135"/><text class="lab small mid" x="${f1(gx(a))}" y="148">${a}°</text>`;
  o += `<path class="curve" d="${d}"/>`;
  o += `<line class="goldline" x1="${f1(gx(GOLDEN))}" y1="30" x2="${f1(gx(GOLDEN))}" y2="130"/>`;
  o += `<circle class="dot" cx="${f1(gx(angle))}" cy="${f1(gy(gap(angle, 300)))}" r="5"/>`;
  o += `<text class="lab small" x="12" y="164">Dashed green line: the golden angle</text>`;
  o += `<text class="lab" x="12" y="20">Biggest gap by angle, 300 seeds (lower is better)</text>`;
  return o;
}
