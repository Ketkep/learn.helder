// Sky colour maths for the sky page. Used by the page at build time and by the scripts in the browser.
// These are toy models with typical numbers, made for this page. They show the ideas, not an exact sky.

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Rough colour of light at a wavelength in nm, from violet to red (a common piecewise fit). */
export function wavelengthColour(nm: number): [number, number, number] {
  let r = 0;
  let g = 0;
  let b = 0;
  if (nm < 440) [r, g, b] = [-(nm - 440) / 60, 0, 1];
  else if (nm < 490) [r, g, b] = [0, (nm - 440) / 50, 1];
  else if (nm < 510) [r, g, b] = [0, 1, -(nm - 510) / 20];
  else if (nm < 580) [r, g, b] = [(nm - 510) / 70, 1, 0];
  else if (nm < 645) [r, g, b] = [1, -(nm - 645) / 65, 0];
  else [r, g, b] = [1, 0, 0];
  const edge = nm < 420 ? 0.3 + (0.7 * (nm - 380)) / 40 : nm > 700 ? 0.3 + (0.7 * (780 - nm)) / 80 : 1;
  return [r, g, b].map((c) => Math.round(255 * Math.pow(clamp(c * edge, 0, 1), 0.8))) as [number, number, number];
}

export const rgb = (c: number[]) => `rgb(${c.map((x) => Math.round(clamp(x, 0, 255))).join(', ')})`;

/** How many times more strongly air scatters light of this wavelength than red light at 700 nm (1 over wavelength to the fourth). */
export const scatterVsRed = (nm: number) => (700 / nm) ** 4;

export function colourName(nm: number): string {
  if (nm < 450) return 'violet';
  if (nm < 495) return 'blue';
  if (nm < 570) return 'green';
  if (nm < 590) return 'yellow';
  if (nm < 620) return 'orange';
  return 'red';
}

// ---- Window 2: the sun and the sky ----
// Three colours stand in for the spectrum: red 650 nm, green 550 nm and blue 450 nm.
const CHANNELS = [650, 550, 450];
const TAU_550 = 0.1;
const tau = (nm: number) => TAU_550 * (nm / 550) ** -4;

/** Air the light passes through, compared with straight overhead. It is capped, because the atmosphere is not flat near the horizon. */
export const airMass = (elevation: number) => Math.min(38, 1 / Math.sin((Math.max(elevation, 1) * Math.PI) / 180));

/** The colour of the sun's light after it has crossed the air, and of the scattered light you see as sky. */
export function skyColours(elevation: number): { sun: [number, number, number]; sky: [number, number, number]; mass: number } {
  const m = airMass(elevation);
  const through = CHANNELS.map((nm) => Math.exp(-tau(nm) * m));
  const scattered = CHANNELS.map((nm) => 1 - Math.exp(-tau(nm)));
  const sunMax = Math.max(...through);
  const skyMax = Math.max(...scattered);
  const fade = clamp(Math.sin((elevation * Math.PI) / 180) * 3, 0.15, 1);
  const sun = through.map((t) => Math.pow(t / sunMax, 0.6) * 255) as [number, number, number];
  const sky = scattered.map((s) => Math.pow(s / skyMax, 0.8) * 200 * fade + 30 * (1 - fade)) as [number, number, number];
  return { sun, sky, mass: m };
}

// ---- Window 3: why not violet ----
const H = 6.626e-34;
const C = 2.998e8;
const K = 1.381e-23;
/** Light the sun gives out at a wavelength, as a blackbody at 5772 kelvin (relative). */
export const sunlight = (nm: number) => {
  const l = nm * 1e-9;
  return (2 * H * C * C) / l ** 5 / (Math.exp((H * C) / (l * K * 5772)) - 1);
};
/** How sensitive a human eye is by day at a wavelength (a one-hump fit, 1 at its peak). */
export const eye = (nm: number) => 1.019 * Math.exp(-285.4 * (nm / 1000 - 0.559) ** 2);

export const WAVES = Array.from({ length: 36 }, (_, i) => 400 + i * 10);

export interface Mix {
  scatter: boolean;
  sun: boolean;
  eye: boolean;
}

/** The strength of each wavelength in the sky, scaled so the strongest is 1, for the effects that are switched on. */
export function skyShare(mix: Mix): number[] {
  const raw = WAVES.map((nm) => (mix.scatter ? scatterVsRed(nm) : 1) * (mix.sun ? sunlight(nm) : 1) * (mix.eye ? eye(nm) : 1));
  const max = Math.max(...raw);
  return raw.map((v) => v / max);
}

export const BANDS: [string, number, number][] = [
  ['violet', 400, 450],
  ['blue', 450, 495],
  ['green and yellow', 495, 590],
  ['orange and red', 590, 710],
];

/** The share (0 to 1) of the light in each colour band, for the effects that are switched on. */
export function bandShares(mix: Mix): number[] {
  const share = skyShare(mix);
  const total = share.reduce((a, b) => a + b, 0);
  return BANDS.map(([, lo, hi]) => WAVES.reduce((sum, nm, i) => (nm >= lo && nm < hi ? sum + share[i] : sum), 0) / total);
}

// ---- Window 4: clouds ----
/** How fast scattering falls with wavelength for a particle of this radius in micrometres: 4 for gas molecules, 0 for cloud droplets. */
export function exponent(radiusUm: number): number {
  const x = (Math.log10(radiusUm) - Math.log10(0.01)) / (Math.log10(1) - Math.log10(0.01));
  return 4 * (1 - clamp(x, 0, 1));
}

export function scatterColour(radiusUm: number): [number, number, number] {
  const n = exponent(radiusUm);
  const v = CHANNELS.map((nm) => (550 / nm) ** n);
  const max = Math.max(...v);
  return v.map((x) => Math.round(255 * Math.pow(x / max, 0.7))) as [number, number, number];
}
