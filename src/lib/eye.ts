// Maths for the eye page: where the blind spot is, how big the pupil is, what an afterimage looks like, and how sharp the side of vision is.
// Several of these are toys, and the page says so. The facts come from the sources.

const rad = (d: number) => (d * Math.PI) / 180;
const f1 = (n: number) => Math.round(n * 10) / 10;

export const BLIND_SPOT_ANGLE = 15; // degrees to the side of where you look, about
export const PX_PER_CM = 37.8; // a CSS pixel is about a 96th of an inch. On most screens that is close.

/** How far the dot must be from the cross for the blind spot to catch it, at a distance from the screen. */
export function dotOffsetCm(distanceCm: number): number {
  return distanceCm * Math.tan(rad(BLIND_SPOT_ANGLE));
}

/** The picture for the blind spot test: a cross on the left and a dot to its right. */
export function blindSvg(offsetPx: number, width = 300): string {
  const x0 = 24;
  const x1 = Math.min(width - 16, x0 + offsetPx);
  return `<line class="cross" x1="${x0 - 9}" y1="40" x2="${x0 + 9}" y2="40"/><line class="cross" x1="${x0}" y1="31" x2="${x0}" y2="49"/><circle class="dot" cx="${f1(x1)}" cy="40" r="9"/>`;
}

/** Toy: the pupil goes from 8 mm in the dark to 2 mm in bright light, in a straight line against the brightness set. */
export function pupilMm(bright: number): number {
  return 8 - (6 * bright) / 100;
}

export function lightRatio(mm: number): number {
  return (mm / 2) ** 2;
}

export function eyeSvg(mm: number): string {
  const r = (mm / 8) * 44;
  return `<circle class="sclera" cx="100" cy="70" r="66"/><circle class="iris" cx="100" cy="70" r="46"/><circle class="pupil" cx="100" cy="70" r="${f1(r)}"/><circle class="glint" cx="${f1(100 + r * 0.45)}" cy="${f1(70 - r * 0.45)}" r="${f1(Math.max(3, r * 0.16))}"/>`;
}

export const colours = [
  { id: 'red', name: 'Red', css: '#d9382f', after: 'green', afterCss: '#34b36b' },
  { id: 'green', name: 'Green', css: '#2fae5e', after: 'red', afterCss: '#d8504a' },
  { id: 'blue', name: 'Blue', css: '#2f6bd9', after: 'yellow', afterCss: '#e0b927' },
  { id: 'yellow', name: 'Yellow', css: '#e0b927', after: 'blue', afterCss: '#3b6fd0' },
];

/** Toy: about 33 pixels for each degree of sight, when the screen is about 50 cm away. */
export const PX_PER_DEGREE = 33;

/** Toy: the smallest letter that can be read grows in a straight line with the angle from the middle of sight. */
export function readableDegrees(angle: number): number {
  return 0.1 + 0.1 * angle;
}

export function letterPx(angle: number): number {
  return Math.round(readableDegrees(angle) * PX_PER_DEGREE);
}

export function pxFromAngle(angle: number): number {
  return Math.round(angle * PX_PER_DEGREE);
}
