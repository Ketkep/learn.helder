// A toy model of where radiation lands in a slice of a body. It is only meant to show the
// idea: X-rays lose strength with depth, protons stop at a set depth, and beams from several
// angles add up. Real treatment plans use far better physics, made for each person.
//
// Lengths are in centimetres. The tumour sits at (0, 0). x goes right, y goes down, so an angle
// of 0 degrees means a beam coming from the front (the top of the picture), and 90 from the right.

export type Kind = 'photon' | 'proton';

/** The slice of body: an ellipse, a little off to the side so that the tumour is in the middle of the picture. */
export const BODY = { cx: -1.5, cy: 0.5, rx: 17, ry: 11 };
export const TUMOUR = { r: 2.2 };
/** Half the width of a beam where it passes the tumour: the tumour plus a small margin. */
export const FIELD = 3;
/** Healthy tissue starts this far from the middle: the tumour, the margin and a little more. */
export const HEALTHY_FROM = 4;
/** The grid covers this many centimetres across. */
export const SPAN = 48;
export const GRID = 160;

const SOURCE = 40;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

const inBody = (x: number, y: number) => ((x - BODY.cx) / BODY.rx) ** 2 + ((y - BODY.cy) / BODY.ry) ** 2 <= 1;

/** X-rays: a quick build-up under the skin, then the dose fades as the beam goes deeper. */
function photonDepth(s: number) {
  return s < 1.5 ? 0.55 + 0.45 * (s / 1.5) : Math.exp(-0.047 * (s - 1.5));
}

/** Protons: a lower dose on the way in, a high flat part across the tumour, then nothing. */
function protonDepth(s: number, near: number, far: number, tumourDepth: number) {
  const entrance = 0.42 + 0.1 * clamp(s / tumourDepth, 0, 1);
  const rise = smooth(near - 0.7, near, s);
  const fall = 1 - smooth(far, far + 0.5, s);
  return (entrance + (1 - entrance) * rise) * fall;
}

/** How a beam fades toward its edges: a bit of blur for X-rays, sharper for protons. */
function sideways(u: number, blur: number) {
  const a = FIELD - blur / 2;
  if (u <= a) return 1;
  if (u >= a + blur) return 0;
  return 0.5 * (1 + Math.cos((Math.PI * (u - a)) / blur));
}

export interface Result {
  /** Dose at every point, as a share of the dose the plan wants in the tumour. */
  dose: Float32Array;
  /** Average dose in the tumour, in percent. */
  tumour: number;
  /** The highest dose anywhere in the healthy tissue, in percent. */
  hot: number;
  /** The share of healthy tissue in the slice that gets more than a tenth of the tumour dose, in percent. */
  exposed: number;
}

export function computeDose(angles: number[], kind: Kind, energyShift = 0): Result {
  const dose = new Float32Array(GRID * GRID);
  const n = angles.length;
  const cell = SPAN / GRID;

  for (const angle of angles) {
    const a = (angle * Math.PI) / 180;
    const hx = SOURCE * Math.sin(a);
    const hy = -SOURCE * Math.cos(a);
    const dx = -Math.sin(a);
    const dy = Math.cos(a);

    // Where the beam enters the body: the first point of the ray inside the ellipse
    const ox = hx - BODY.cx;
    const oy = hy - BODY.cy;
    const A = (dx / BODY.rx) ** 2 + (dy / BODY.ry) ** 2;
    const B = 2 * ((ox * dx) / BODY.rx ** 2 + (oy * dy) / BODY.ry ** 2);
    const C = (ox / BODY.rx) ** 2 + (oy / BODY.ry) ** 2 - 1;
    const disc = B * B - 4 * A * C;
    if (disc < 0) continue;
    const entry = (-B - Math.sqrt(disc)) / (2 * A);
    const tumourDepth = SOURCE - entry;
    const norm = photonDepth(tumourDepth);

    for (let j = 0; j < GRID; j++) {
      const y = (j + 0.5) * cell - SPAN / 2;
      for (let i = 0; i < GRID; i++) {
        const x = (i + 0.5) * cell - SPAN / 2;
        if (!inBody(x, y)) continue;
        const along = (x - hx) * dx + (y - hy) * dy;
        const s = along - entry;
        if (s < 0) continue;
        const u = Math.abs((x - hx) * dy - (y - hy) * dx);
        let value: number;
        if (kind === 'photon') {
          value = (photonDepth(s) / norm) * sideways(u, 1.2);
        } else {
          value = protonDepth(s, tumourDepth - TUMOUR.r + energyShift, tumourDepth + TUMOUR.r + energyShift, tumourDepth) * sideways(u, 0.5);
        }
        dose[j * GRID + i] += value / n;
      }
    }
  }

  // The numbers
  let tSum = 0;
  let tCount = 0;
  let hot = 0;
  let healthy = 0;
  let exposed = 0;
  for (let j = 0; j < GRID; j++) {
    const y = (j + 0.5) * cell - SPAN / 2;
    for (let i = 0; i < GRID; i++) {
      const x = (i + 0.5) * cell - SPAN / 2;
      const d = dose[j * GRID + i];
      const r = Math.hypot(x, y);
      if (r < TUMOUR.r) {
        tSum += d;
        tCount++;
      } else if (r > HEALTHY_FROM && inBody(x, y)) {
        healthy++;
        if (d > hot) hot = d;
        if (d > 0.1) exposed++;
      }
    }
  }
  return {
    dose,
    tumour: tCount ? (tSum / tCount) * 100 : 0,
    hot: hot * 100,
    exposed: healthy ? (exposed / healthy) * 100 : 0,
  };
}

/** A colour for a dose, like the dose pictures in hospitals: blue is a little, red is the full dose. */
export function colour(d: number): [number, number, number, number] {
  if (d < 0.06) return [0, 0, 0, 0];
  const stops: [number, [number, number, number, number]][] = [
    [0.06, [40, 70, 255, 0]],
    [0.15, [40, 90, 255, 120]],
    [0.35, [30, 200, 255, 150]],
    [0.55, [60, 230, 120, 165]],
    [0.8, [250, 230, 60, 185]],
    [1, [255, 90, 30, 210]],
    [1.4, [255, 255, 255, 235]],
  ];
  for (let k = 1; k < stops.length; k++) {
    if (d <= stops[k][0]) {
      const [d0, c0] = stops[k - 1];
      const [d1, c1] = stops[k];
      const t = (d - d0) / (d1 - d0);
      return [0, 1, 2, 3].map((q) => Math.round(c0[q] + (c1[q] - c0[q]) * t)) as [number, number, number, number];
    }
  }
  return stops[stops.length - 1][1];
}
