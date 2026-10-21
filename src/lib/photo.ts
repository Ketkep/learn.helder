// Maths and drawings for the photosynthesis page. The curves are toys that show an idea. The masses and the willow numbers are real.
// The same text is made at build time (Astro) and in the browser.

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const f1 = (n: number) => n.toFixed(1);

// ---------- 06:00 Colours ----------

/** A toy absorption curve for chlorophyll: peaks near 430 nm and 662 nm, low in the green. */
export function absorbs(nm: number): number {
  const peak = (c: number, w: number) => Math.exp(-(((nm - c) / w) ** 2));
  return clamp(0.08 + 0.92 * Math.max(peak(430, 24), 0.92 * peak(662, 20)), 0, 1);
}

/** The curve as a path, over 400 to 700 nm, in a 300 by 120 box. */
export function absorbPath(): string {
  const pts = Array.from({ length: 61 }, (_, i) => {
    const nm = 400 + i * 5;
    return `${f1(((nm - 400) / 300) * 280 + 10)},${f1(105 - absorbs(nm) * 90)}`;
  });
  return `M${pts.join(' L')}`;
}

// ---------- 09:00 Limits ----------

export interface Limits { light: number; co2: number; temp: number }

/** Each factor as a number from 0 (nothing gets done) to 1 (it is no limit). Toy shapes. */
export function terms(l: Limits) {
  const light = clamp(l.light / 50, 0, 1);
  const co2 = clamp((l.co2 - 50) / 650, 0, 1);
  const temp = clamp(Math.min(l.temp / 20, (45 - l.temp) / 15), 0, 1);
  return { light, co2, temp };
}

export function limiting(l: Limits): { rate: number; name: 'light' | 'carbon dioxide' | 'temperature' | 'nothing' } {
  const t = terms(l);
  const rate = Math.min(t.light, t.co2, t.temp);
  const name = rate > 0.999 ? 'nothing' : rate === t.light ? 'light' : rate === t.co2 ? 'carbon dioxide' : 'temperature';
  return { rate, name };
}

// ---------- 12:00 Grams in, grams out ----------

/** Molar masses in grams per mole, from the standard atomic masses (C 12.011, H 1.008, O 15.999). */
export const MOLAR = { co2: 44.009, water: 18.015, glucose: 180.156, oxygen: 31.998 };

/** Six CO2 and six H2O make one glucose and six O2. Given grams of CO2, give the rest. */
export function balance(gramsCo2: number) {
  const mol = gramsCo2 / MOLAR.co2 / 6; // moles of the whole reaction
  return { co2: gramsCo2, water: mol * 6 * MOLAR.water, glucose: mol * MOLAR.glucose, oxygen: mol * 6 * MOLAR.oxygen };
}

export const grams = (n: number) => Math.round(n).toLocaleString('en-US');

// ---------- 15:00 The willow ----------

export const WILLOW = { startLb: 5, endLb: 169, soilLb: 200, soilLostOz: 2, years: 5 };

/** Weight of the tree in pound after a number of years. Only the two ends are from the story. The curve between is made up. */
export function treeLb(year: number): number {
  const t = year / WILLOW.years;
  return WILLOW.startLb + (WILLOW.endLb - WILLOW.startLb) * t * t;
}

export const soilLb = (year: number) => WILLOW.soilLb - (WILLOW.soilLostOz / 16) * (year / WILLOW.years);

// ---------- 21:00 A whole day ----------

/** Sunlight over a day, 0 to 1: nothing before 6 or after 18, a hump at noon. */
export const sun = (h: number) => (h > 6 && h < 18 ? Math.sin(((h - 6) / 12) * Math.PI) : 0);

/** The leaf's photosynthesis, using the light curve of this page (full speed at half of the strongest sun). Toy. */
export const making = (h: number) => Math.min(1, sun(h) * 2);

/** What the leaf uses to breathe, all day and night. A made up steady number. */
export const BREATH = 0.12;

export const net = (h: number) => making(h) - BREATH;

export function dayPath(fn: (h: number) => number): string {
  const pts = Array.from({ length: 97 }, (_, i) => {
    const h = i / 4;
    return `${f1((h / 24) * 280 + 10)},${f1(70 - fn(h) * 55)}`;
  });
  return `M${pts.join(' L')}`;
}

/** The two hours when the leaf stops gaining: where the net crosses zero, found by stepping. */
export function crossings(): number[] {
  const out: number[] = [];
  for (let i = 0; i < 24 * 60; i++) {
    const a = net(i / 60);
    const b = net((i + 1) / 60);
    if (a < 0 !== b < 0) out.push((i + 1) / 60);
  }
  return out;
}

export function clock(h: number): string {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

/** A 24 hour dial for the margin: the day half lit, one hand at the hour. */
export function dialSvg(hour: number): string {
  const ang = (hour / 24) * 2 * Math.PI;
  const x = 30 + Math.sin(ang) * 20;
  const y = 30 - Math.cos(ang) * 20;
  const a6 = (6 / 24) * 2 * Math.PI;
  const day = `M${f1(30 + Math.sin(a6) * 24)},${f1(30 - Math.cos(a6) * 24)} A24 24 0 0 1 ${f1(30 + Math.sin(-a6) * 24)},${f1(30 - Math.cos(-a6) * 24)} Z`;
  return `<circle class="dial-face" cx="30" cy="30" r="26"/><path class="dial-day" d="${day}"/><line class="dial-hand" x1="30" y1="30" x2="${f1(x)}" y2="${f1(y)}"/><circle class="dial-pin" cx="30" cy="30" r="2.6"/>`;
}
