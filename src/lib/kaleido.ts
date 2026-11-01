// Maths and drawings for the kaleidoscope page. The mirror rule comes from the sources: two mirrors at an angle that divides 360 evenly
// give 360 over the angle copies of an object. The beads are drawn at random from a fixed seed. The same text is made at build time (Astro)
// and in the browser.

import { seeded } from './rand';

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

/** Angles between the mirrors that divide 360 degrees into an even number of wedges, so the pattern closes without a seam. */
export const ANGLES = [90, 60, 45, 36, 30];

/** Copies of an object, including the object itself. */
export const copies = (angle: number) => 360 / angle;

/** Images in the mirrors, not counting the object: the rule in the sources. */
export const images = (angle: number) => 360 / angle - 1;

/** Mirror lines through the centre of the pattern, and the turns that leave it unchanged (n over two of each, for n wedges). */
export const mirrorLines = (angle: number) => copies(angle) / 2;

export interface Bead {
  r: number; // distance from the centre, 0 to 1
  a: number; // angle inside the wedge, as a share of the wedge, 0 to 1
  hue: number;
  size: number;
}

export const COLOURS = ['#e0564e', '#f0b24a', '#4fd68a', '#5ab4e8', '#b07be0', '#f08fc0'];

/** Beads from a seed. */
export function beads(count: number, seed: number): Bead[] {
  const r = seeded(seed);
  return Array.from({ length: count }, () => ({ r: 0.2 + 0.75 * r(), a: 0.1 + 0.8 * r(), hue: Math.floor(r() * COLOURS.length), size: 0.04 + 0.05 * r() }));
}

/** Where a point of the wedge appears in each of the wedges around the centre. Wedge m is turned for even m and flipped and turned for odd m. */
export function placed(angle: number, b: { r: number; a: number }): { x: number; y: number }[] {
  const n = copies(angle);
  const phi = b.a * angle;
  const out: { x: number; y: number }[] = [];
  for (let m = 0; m < n; m++) {
    const deg = m % 2 === 0 ? phi + m * angle : (m + 1) * angle - phi;
    const rad = (deg * Math.PI) / 180;
    out.push({ x: b.r * Math.cos(rad), y: -b.r * Math.sin(rad) });
  }
  return out;
}

const CX = 150;
const CY = 100;
const R = 90;

/** The whole round view: the beads of the wedge copied into every wedge, with the mirror lines faint behind them. */
export function roseSvg(angle: number, list: Bead[]): string {
  let s = `<circle class="eye" cx="${CX}" cy="${CY}" r="${R}"/>`;
  const n = copies(angle);
  for (let m = 0; m < n; m++) {
    const rad = (m * angle * Math.PI) / 180;
    s += `<line class="seam" x1="${CX}" y1="${CY}" x2="${f1(CX + R * Math.cos(rad))}" y2="${f1(CY - R * Math.sin(rad))}"/>`;
  }
  for (const b of list) {
    for (const p of placed(angle, b)) {
      s += `<circle cx="${f1(CX + p.x * R)}" cy="${f1(CY + p.y * R)}" r="${f1(b.size * R)}" fill="${COLOURS[b.hue]}"/>`;
    }
  }
  return s;
}

/** The wedge with its beads, drawn alone, as the object cell sees it. */
export function wedgeSvg(angle: number, list: Bead[]): string {
  const x0 = 30;
  const y0 = 150;
  const L = 130;
  const rad = (angle * Math.PI) / 180;
  const ex = x0 + L * Math.cos(rad);
  const ey = y0 - L * Math.sin(rad);
  let s = `<path class="wedge" d="M${x0} ${y0} L${x0 + L} ${y0} A${L} ${L} 0 0 0 ${f1(ex)} ${f1(ey)} Z"/><line class="mirror" x1="${x0}" y1="${y0}" x2="${x0 + L}" y2="${y0}"/><line class="mirror" x1="${x0}" y1="${y0}" x2="${f1(ex)}" y2="${f1(ey)}"/>`;
  for (const b of list) {
    const a = ((b.a * angle) * Math.PI) / 180;
    s += `<circle cx="${f1(x0 + b.r * L * Math.cos(a))}" cy="${f1(y0 - b.r * L * Math.sin(a))}" r="${f1(b.size * L)}" fill="${COLOURS[b.hue]}"/>`;
  }
  return s;
}

/** One bead and all of its images, numbered around the circle, for a bead at a place in the wedge. */
export function imagesSvg(angle: number, a: number): string {
  const b = { r: 0.7, a };
  let s = `<circle class="eye" cx="${CX}" cy="${CY}" r="${R}"/>`;
  const n = copies(angle);
  for (let m = 0; m < n; m++) {
    const rad = (m * angle * Math.PI) / 180;
    s += `<line class="seam" x1="${CX}" y1="${CY}" x2="${f1(CX + R * Math.cos(rad))}" y2="${f1(CY - R * Math.sin(rad))}"/>`;
  }
  placed(angle, b).forEach((p, m) => {
    s += `<circle class="${m === 0 ? 'real' : 'image'}" cx="${f1(CX + p.x * R)}" cy="${f1(CY + p.y * R)}" r="7"/><text class="num" x="${f1(CX + p.x * R)}" y="${f1(CY + p.y * R + 3)}" text-anchor="middle">${m === 0 ? 'o' : m}</text>`;
  });
  return s;
}
