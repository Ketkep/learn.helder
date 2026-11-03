// Maths and drawings for the honeycomb page. The shapes that tile and the honeycomb theorem come from the sources. The wall lengths are
// worked out from the area of a regular shape. The soft wax tool is a toy model of cells that start round and get squeezed.
// The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const rad = (d: number) => (d * Math.PI) / 180;

export const SIDES = [3, 4, 5, 6, 7, 8];
export const NAMES: Record<number, string> = { 3: 'Triangle', 4: 'Square', 5: 'Pentagon', 6: 'Hexagon', 7: 'Heptagon', 8: 'Octagon' };

/** The angle inside a regular shape with n sides. */
export const angle = (n: number) => 180 - 360 / n;

/** How many whole copies fit round a point, and how much is left over. */
export function around(n: number) {
  const a = angle(n);
  const k = Math.floor(360 / a + 1e-9);
  const gap = 360 - k * a;
  return { k, gap: gap < 1e-6 ? 0 : gap, tiles: gap < 1e-6 };
}

/** Copies of a shape round one corner, with the gap in a second colour. */
export function tileSvg(n: number): string {
  const { k, gap } = around(n);
  const a = angle(n);
  const s = n > 5 ? 38 : 46;
  const ox = 150;
  const oy = 100;
  let o = `<rect class="frame" x="1" y="1" width="298" height="198" rx="8"/>`;
  const pts = (start: number) => {
    let x = ox;
    let y = oy;
    let h = start;
    const out = [[x, y]];
    for (let i = 0; i < n - 1; i++) {
      x += s * Math.cos(rad(h));
      y -= s * Math.sin(rad(h));
      h -= 360 / n;
      out.push([x, y]);
    }
    return out;
  };
  for (let i = 0; i < k; i++) {
    const p = pts(90 - i * a - a);
    o += `<polygon class="cellshape" points="${p.map((q) => `${f1(q[0])},${f1(q[1])}`).join(' ')}"/>`;
  }
  if (gap > 0) {
    const a0 = 90 - k * a;
    const r = s * 1.1;
    const x1 = ox + r * Math.cos(rad(a0));
    const y1 = oy - r * Math.sin(rad(a0));
    const x2 = ox + r * Math.cos(rad(a0 - gap));
    const y2 = oy - r * Math.sin(rad(a0 - gap));
    o += `<path class="gapwedge" d="M${ox} ${oy} L${f1(x1)} ${f1(y1)} A${f1(r)} ${f1(r)} 0 ${gap > 180 ? 1 : 0} 1 ${f1(x2)} ${f1(y2)} Z"/>`;
  }
  o += `<circle class="corner" cx="${ox}" cy="${oy}" r="3.5"/>`;
  o += `<text class="lab" x="12" y="20">${NAMES[n]}s round one corner: ${k}${gap ? `, with a gap of ${fmt(gap, 1).replace('.0', '')}°` : ', with no gap'}</text>`;
  return o;
}

// ---------- Wall length for the same area ----------

/** Length of the outline of a regular shape with area 1. */
export const outline = (n: number) => 2 * Math.sqrt(n * Math.tan(Math.PI / n));
export const CIRCLE = 2 * Math.sqrt(Math.PI);

export const KINDS = [
  { name: 'Triangle', len: outline(3), tiles: true },
  { name: 'Square', len: outline(4), tiles: true },
  { name: 'Hexagon', len: outline(6), tiles: true },
  { name: 'Circle', len: CIRCLE, tiles: false },
];

export function wallSvg(cells: number): string {
  const max = outline(3);
  let o = `<rect class="frame" x="1" y="1" width="298" height="168" rx="8"/>`;
  KINDS.forEach((k, i) => {
    const y = 34 + i * 30;
    o += `<text class="lab small" x="12" y="${y + 11}">${k.name}</text>`;
    o += `<rect class="${k.name === 'Hexagon' ? 'best' : 'bar'}" x="80" y="${y}" width="${f1((k.len / max) * 190)}" height="16"/>`;
    o += `<text class="lab small" x="${f1(80 + (k.len / max) * 190 + 5)}" y="${y + 12}">${fmt(k.len, 2)}</text>`;
  });
  o += `<text class="lab" x="12" y="20">Outline around one unit of area, in units</text>`;
  void cells;
  return o;
}

/** The wax for a number of cells of area 1: each wall is shared by two cells, so it counts half. */
export const wax = (n: number, cells: number) => (outline(n) / 2) * cells;

// ---------- Soft wax ----------

const D = 44;
const A = D / 2;

/** Radius of a cell at an angle: a circle that touches its neighbours, squeezed towards a hexagon. */
function radius(theta: number, t: number): number {
  const m = ((((theta + Math.PI / 6) % (Math.PI / 3)) + Math.PI / 3) % (Math.PI / 3)) - Math.PI / 6;
  return A + (A / Math.cos(m) - A) * t;
}

/** The share of the space a cell fills, from 0 (round) to 1 (hexagon). */
export function fill(t: number): number {
  let area = 0;
  const steps = 720;
  for (let i = 0; i < steps; i++) {
    const r = radius(((i + 0.5) / steps) * Math.PI * 2, t);
    area += 0.5 * r * r * ((Math.PI * 2) / steps);
  }
  return area / (2 * Math.sqrt(3) * A * A);
}

export function waxSvg(t: number): string {
  let o = `<rect class="fieldbox" x="1" y="1" width="298" height="198" rx="8"/>`;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 6; c++) {
      const cx = 26 + c * D + (r % 2) * (D / 2);
      const cy = 32 + r * D * 0.866;
      let d = '';
      for (let i = 0; i < 72; i++) {
        const th = (i / 72) * Math.PI * 2;
        const rr = radius(th, t);
        d += `${i ? 'L' : 'M'}${f1(cx + rr * Math.cos(th))} ${f1(cy + rr * Math.sin(th))} `;
      }
      o += `<path class="waxcell" d="${d}Z"/>`;
    }
  }
  o += `<text class="lab small" x="12" y="192">Squeeze ${fmt(t * 100)}%: the gaps are ${fmt((1 - fill(t)) * 100, 1)}% of the space</text>`;
  return o;
}
