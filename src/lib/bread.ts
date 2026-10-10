// Bread maths and pictures for the bread page. Used by the page at build time and by the scripts in the browser.
// These are toy models with typical numbers, made for this page. Real doughs vary a lot.

import { seeded } from './rand';

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const f1 = (n: number) => Math.round(n * 10) / 10;

// ---- Stop 1: the rise ----
/** How fast yeast works at a dough temperature in degrees C, from 0 (dead) to 1 (best). */
export function yeastRate(t: number): number {
  if (t >= 55) return 0;
  if (t > 40) return 0.7 * ((55 - t) / 15);
  if (t > 32) return 1 - 0.3 * ((t - 32) / 8);
  if (t <= 4) return 0.05;
  return 0.05 + 0.95 * ((t - 4) / 28) ** 1.6;
}

/** Minutes for a dough to double in size. Infinity when the yeast is dead. */
export const doubleMinutes = (t: number) => (yeastRate(t) > 0 ? 80 / yeastRate(t) : Infinity);

/** How many times bigger the dough is after some hours. */
export function growth(t: number, hours: number): number {
  const d = doubleMinutes(t);
  return d === Infinity ? 1 : Math.min(4, 2 ** ((hours * 60) / d));
}

export function fmtDuration(minutes: number): string {
  if (minutes === Infinity) return 'never';
  if (minutes < 90) return `${Math.round(minutes)} minutes`;
  if (minutes < 2880) return `${f1(minutes / 60)} hours`;
  return `${Math.round(minutes / 1440)} days`;
}

/** The jar: dough in a glass jar with a band at the starting level. */
export function jarSvg(times: number): string {
  const base = 190;
  const h = clamp(44 * times, 0, 176);
  const bubbles = seeded(7);
  let dots = '';
  for (let i = 0; i < Math.round(8 + times * 14); i++) dots += `<circle cx="${f1(30 + bubbles() * 100)}" cy="${f1(base - 6 - bubbles() * Math.max(6, h - 12))}" r="${f1(2 + bubbles() * 3.5)}" class="dot"/>`;
  return `<rect class="dough" x="22" y="${f1(base - h)}" width="116" height="${f1(h)}"/>${dots}<line class="band" x1="14" y1="${base - 44}" x2="146" y2="${base - 44}"/>`;
}

// ---- Stop 2: the gluten net ----
export const glutenStrength = (minutes: number) => 1 - Math.exp(-minutes / 4);
/** Share of the gas the dough holds on to. Even dough that was barely kneaded holds some. */
export const gasKept = (strength: number) => 0.35 + 0.65 * strength;

export function netSvg(strength: number): string {
  const r = seeded(11);
  const n = Math.round(6 + 34 * strength);
  const burst = Math.round((1 - strength) * n * 0.5);
  let out = '';
  for (let i = 0; i < n; i++) {
    const rad = (16 - 10 * strength) * (0.7 + r() * 0.6);
    const x = 24 + r() * 252;
    const y = 24 + r() * 132;
    out += i < burst ? `<circle class="burst" cx="${f1(x)}" cy="${f1(y)}" r="${f1(rad * 1.2)}"/>` : `<circle class="bubble" cx="${f1(x)}" cy="${f1(y)}" r="${f1(rad)}"/>`;
  }
  return out;
}

// ---- Stop 3: oven spring ----
export const SET_AT = 76;
export const YEAST_DIES = 58;

/** How much room the gas takes at a core temperature, compared with 30 degrees. It stops growing once the loaf sets. */
export function gasRatio(core: number): number {
  const t = Math.min(core, SET_AT);
  return (273.15 + t) / (273.15 + 30);
}

export function loafSvg(core: number): string {
  const k = Math.cbrt(gasRatio(core)) ;
  const w = 90 * k;
  const h = 56 * k;
  const set = core >= SET_AT;
  return `<path class="loaf${set ? ' set' : ''}" d="M${f1(150 - w)} 150C${f1(150 - w)} ${f1(150 - h * 2.1)} ${f1(150 + w)} ${f1(150 - h * 2.1)} ${f1(150 + w)} 150Z"/><line class="tray" x1="30" y1="150" x2="270" y2="150"/>`;
}

// ---- Stop 4: crust ----
const stops: [number, [number, number, number]][] = [
  [100, [241, 221, 180]],
  [130, [227, 182, 107]],
  [160, [201, 138, 62]],
  [190, [142, 82, 34]],
  [225, [62, 35, 18]],
];

/** Crust colour at a surface temperature. Below 100 degrees the dough stays pale. */
export function crustColour(t: number): string {
  const x = clamp(t, 100, 225);
  let i = 0;
  while (i < stops.length - 2 && x > stops[i + 1][0]) i++;
  const [a, b] = [stops[i], stops[i + 1]];
  const k = (x - a[0]) / (b[0] - a[0]);
  return `rgb(${[0, 1, 2].map((c) => Math.round(a[1][c] + (b[1][c] - a[1][c]) * k)).join(', ')})`;
}

export function sliceSvg(surface: number): string {
  const band = 5 + Math.max(0, surface - 100) / 9;
  const colour = crustColour(surface);
  return `<ellipse cx="150" cy="95" rx="116" ry="64" fill="${colour}" stroke="#2b1c10" stroke-width="3"/><ellipse class="crumb" cx="150" cy="95" rx="${f1(116 - band)}" ry="${f1(64 - band)}"/>`;
}
