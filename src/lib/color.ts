// Picks readable text for a colored cover: cream on dark colors, near-black on light ones.

export const CREAM = '#fff3dc';
export const DARK = '#121315';

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** The text color (cream or near-black) that reads best on this hex color. */
export function readableInk(hex: string): string {
  return contrast(hex, CREAM) >= contrast(hex, DARK) ? CREAM : DARK;
}

// ---------------------------------------------------------------------------
// Mixing colors at build time. The same maths as CSS color-mix(in oklab, ...).
// Older phones do not know color-mix(), so the site never asks the browser to do it.

type Rgb = [number, number, number];

const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const fromLinear = (v: number) => (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055);

function parse(hex: string): Rgb {
  const h = hex === 'black' ? '#000000' : hex === 'white' ? '#ffffff' : hex;
  return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as Rgb;
}

function toOklab([r, g, b]: Rgb): Rgb {
  const [lr, lg, lb] = [r, g, b].map(toLinear);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function fromOklab([L, a, b]: Rgb): Rgb {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => Math.min(1, Math.max(0, fromLinear(v)))) as Rgb;
}

/** `aPercent` of color a mixed with the rest of color b. Both are hex colors, "black" or "white". */
export function mix(a: string, b: string, aPercent: number): string {
  const t = aPercent / 100;
  const [x, y] = [toOklab(parse(a)), toOklab(parse(b))];
  const out = fromOklab([0, 1, 2].map((i) => x[i] * t + y[i] * (1 - t)) as Rgb);
  return '#' + out.map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
}

/** The inline style that gives a cover its colors, including the two softer shades drawings can use. */
export function coverVars(accent: string, ink = readableInk(accent)): string {
  return [
    `--cover: ${accent}`,
    `--on-cover: ${ink}`,
    `--cover-b: ${mix(accent, ink, 45)}`,
    `--cover-c: ${mix(accent, ink, 84)}`,
  ].join('; ') + ';';
}
