// Lock maths for the lock page. Used by the page at build time and by the scripts in the browser.
// Pictures are drawn in SVG units with y going down. The shear line is the gap between the housing and the plug.

export const PINS = 5;
export const SHEAR = 100;
export const SPACING = 36;
export const FIRST_X = 80;
export const STEP = 7;
export const BASE = 14;
export const DEPTHS = 10;
/** Where the pins rest when no key is in: the deepest cut just reaches it. */
export const REST = SHEAR + BASE + (DEPTHS - 1) * STEP;
export const DRIVER = 26;
export const INSERT = 210;
/** The secret cuts of the right key, one depth (0 to 9) for each pin. A deeper cut needs a longer key pin. */
export const SECRET = [3, 6, 2, 7, 4];

export const keys = {
  right: { name: 'Key A', cuts: SECRET },
  two: { name: 'Key B', cuts: [3, 5, 4, 7, 1] },
  near: { name: 'Key C', cuts: [3, 6, 2, 7, 5] },
  blank: { name: 'Key D', cuts: [0, 0, 0, 0, 0] },
};

export const pinX = (i: number) => FIRST_X + i * SPACING;
const keyPinLength = (i: number) => BASE + SECRET[i] * STEP;

/** The top edge of a key with these cuts, as points along the blade. u is the distance from the shoulder. */
function profile(cuts: number[]): [number, number][] {
  const pts: [number, number][] = [[-70, SHEAR + BASE]];
  pts.push([-14, SHEAR + BASE]);
  cuts.forEach((c, i) => {
    const u = i * SPACING;
    const y = SHEAR + BASE + c * STEP;
    pts.push([u - 10, SHEAR + BASE], [u - 5, y], [u + 5, y], [u + 10, SHEAR + BASE]);
  });
  pts.push([4 * SPACING + 26, SHEAR + BASE], [4 * SPACING + 40, REST + 12]);
  return pts;
}

/** How far the key has moved in from the left: 0 is out, 1 is all the way in. */
export const keyShift = (t: number) => FIRST_X - (1 - t) * INSERT;

/** Height (as SVG y) of whatever lies under a pin: the key's top edge, or the empty keyway. */
function surface(cuts: number[], t: number, x: number): number {
  const u = x - keyShift(t);
  const pts = profile(cuts);
  if (u < pts[0][0]) return REST;
  const last = pts[pts.length - 1];
  if (u > last[0]) return REST;
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, b] = [pts[i], pts[i + 1]];
    if (u >= a[0] && u <= b[0]) return b[0] === a[0] ? b[1] : a[1] + ((b[1] - a[1]) * (u - a[0])) / (b[0] - a[0]);
  }
  return REST;
}

export type PinState = 'ok' | 'high' | 'low';

export interface PinView {
  x: number;
  /** Top of the key pin and of the driver pin, bottom of the key pin (SVG y). */
  keyTop: number;
  keyBottom: number;
  driverTop: number;
  /** Does this pin split at the shear line? 'high' means the key pin pokes into the housing, 'low' means the driver pin reaches into the plug. */
  state: PinState;
}

export function pinViews(cuts: number[], t: number): PinView[] {
  return Array.from({ length: PINS }, (_, i) => {
    const bottom = Math.min(REST, surface(cuts, t, pinX(i)));
    const top = bottom - keyPinLength(i);
    const diff = top - SHEAR;
    const state: PinState = Math.abs(diff) < STEP / 2 ? 'ok' : diff < 0 ? 'high' : 'low';
    return { x: pinX(i), keyTop: top, keyBottom: bottom, driverTop: top - DRIVER, state };
  });
}

/** True when the key is all the way in and every pin splits at the shear line. */
export function opens(cuts: number[], t: number): boolean {
  return t >= 0.999 && pinViews(cuts, 1).every((p) => p.state === 'ok');
}

const f1 = (n: number) => Math.round(n * 10) / 10;

/** The key as a closed shape: shoulder and blade. The bow (the part you hold) is drawn separately. */
export function keyPath(cuts: number[]): string {
  const pts = profile(cuts);
  const bottom = REST + 40;
  const top = pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L');
  const last = pts[pts.length - 1];
  return `M${top}L${f1(last[0])} ${bottom}L${f1(pts[0][0])} ${bottom}Z`;
}

/** A zig zag spring between two heights. */
export function springPath(x: number, y1: number, y2: number, coils = 5): string {
  const parts = [`M${f1(x)} ${f1(y1)}`];
  for (let i = 1; i <= coils * 2; i++) parts.push(`L${f1(x + (i % 2 ? -6 : 6))} ${f1(y1 + ((y2 - y1) * i) / (coils * 2 + 1))}`);
  parts.push(`L${f1(x)} ${f1(y2)}`);
  return parts.join('');
}

/** How many different keys a lock can have: depths to the power of pins, with and without a limit on neighbouring cuts. */
export function keyspace(pins: number, depths: number, macs: number): { raw: number; allowed: number } {
  const raw = depths ** pins;
  // Count the sequences where neighbouring cuts differ by at most macs, one pin at a time
  let counts = Array.from({ length: depths }, () => 1);
  for (let p = 1; p < pins; p++) counts = counts.map((_, d) => counts.reduce((sum, c, e) => sum + (Math.abs(d - e) <= macs ? c : 0), 0));
  return { raw, allowed: counts.reduce((a, b) => a + b, 0) };
}

// ---- The old wooden lock ----
export const WOOD_HOLES = 3;
export const WOOD_X = 120;
export const WOOD_GAP = 46;
export const holeX = (i: number) => WOOD_X + i * WOOD_GAP;

export const woodKeys = {
  right: { name: 'Key A', gap: WOOD_GAP, prongs: 3 },
  wide: { name: 'Key B', gap: WOOD_GAP + 14, prongs: 3 },
  short: { name: 'Key C', gap: WOOD_GAP, prongs: 2 },
};

/** Which pegs are lifted when the key is pushed in by t (0 to 1)? A peg lifts when a prong is under its hole. */
export function pegsLifted(key: { gap: number; prongs: number }, t: number): boolean[] {
  const start = WOOD_X - 150 + t * 150;
  const prongs = Array.from({ length: key.prongs }, (_, j) => start + j * key.gap);
  return Array.from({ length: WOOD_HOLES }, (_, i) => prongs.some((p) => Math.abs(p - holeX(i)) < 7));
}
