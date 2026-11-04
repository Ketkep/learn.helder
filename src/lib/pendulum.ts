// Maths and drawings for the pendulum page. For a small swing the time of one full swing is 2 pi times the square root of the length
// over the pull of gravity, and the weight of the bob does not matter. For a big swing the page uses the exact period, worked out with
// the arithmetic-geometric mean. The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export const PLACES = [
  { name: 'Earth', g: 9.81 },
  { name: 'Mars', g: 3.71 },
  { name: 'Moon', g: 1.62 },
];

/** Seconds for one full swing there and back, for a small swing. */
export const period = (length: number, g: number) => 2 * Math.PI * Math.sqrt(length / g);

/** The exact period for a swing of a given starting angle in degrees. */
export function exactPeriod(length: number, g: number, deg: number): number {
  const k = Math.cos((deg * Math.PI) / 360);
  let a = 1;
  let b = k;
  for (let i = 0; i < 12; i++) [a, b] = [(a + b) / 2, Math.sqrt(a * b)];
  return period(length, g) / a;
}

/** The length that gives a chosen period for a small swing. */
export const lengthFor = (seconds: number, g: number) => (g * seconds * seconds) / (4 * Math.PI * Math.PI);

/** Seconds a clock gains or loses in a day if its swing takes `real` seconds instead of `wanted`. */
export const driftPerDay = (wanted: number, real: number) => (wanted / real - 1) * 86400;

const PX = 52; // pixels for one metre in the drawing

/** The pendulum at an angle, hanging from the top of the drawing. */
export function pendulumSvg(length: number, deg: number, mass: number, tag: string): string {
  const px = 18 + length * PX;
  const a = (deg * Math.PI) / 180;
  const x = 150 + px * Math.sin(a);
  const y = 14 + px * Math.cos(a);
  const r = 5 + Math.cbrt(mass) * 7;
  let o = `<rect class="wall" x="1" y="1" width="298" height="198" rx="8"/>`;
  o += `<line class="top" x1="110" y1="14" x2="190" y2="14"/>`;
  o += `<line class="rest" x1="150" y1="14" x2="150" y2="${f1(14 + px)}"/>`;
  o += `<line class="rod" x1="150" y1="14" x2="${f1(x)}" y2="${f1(y)}"/>`;
  o += `<circle class="bob" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/>`;
  o += `<circle class="pivot" cx="150" cy="14" r="3.5"/>`;
  o += `<text class="lab small" x="10" y="192">${tag}</text>`;
  return o;
}
