// Maths and drawings for the parallax page. The star distances come from the sources. The drawing sizes are magnified and the page says so.
// The same text is made at build time (Astro) and in the browser.

import { seeded } from './rand';

export const LY_PER_PC = 3.26156;
export const AU_KM = 149597870.7;
export const C_KM_S = 299792.458;

/** Distance in light years from a parallax in arcseconds: one over the parallax is parsecs. */
export const lyOf = (p: number) => LY_PER_PC / p;
export const parallaxOf = (ly: number) => LY_PER_PC / ly;

export interface Star { id: string; name: string; ly: number; note: string }

/** Distances as the sources give them. The parallax is worked out from them. */
export const stars: Star[] = [
  { id: 'proxima', name: 'Proxima Centauri', ly: 4.24, note: 'The nearest star to the Sun.' },
  { id: 'alpha', name: 'Alpha Centauri', ly: 4.37, note: 'The system next to Proxima, the third brightest star in the sky.' },
  { id: 'barnard', name: 'Barnard’s Star', ly: 5.9, note: 'A faint red star.' },
  { id: 'sirius', name: 'Sirius', ly: 8.6, note: 'The brightest star in the night sky.' },
  { id: 'cygni', name: '61 Cygni', ly: 11.4, note: 'The first star with a measured parallax, by Bessel in 1838.' },
];

export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

/** Three significant figures for a small number. */
export const sig = (n: number) => (n >= 100 ? fmt(n) : n >= 10 ? n.toFixed(1) : n >= 1 ? n.toFixed(2) : n >= 0.01 ? n.toFixed(3) : String(Number(n.toPrecision(2))));

// ---------- Plate 1: the shift ----------

export const SCALE = 120; // pixels per arcsecond, much magnified

/** Slider 0 to 100 for 4 to 1000 light years, on a log scale. */
export const lyFromSlider = (i: number) => 4 * 250 ** (i / 100);

const dots = (() => {
  const r = seeded(31);
  return Array.from({ length: 46 }, () => ({ x: 8 + r() * 284, y: 8 + r() * 184, r: 0.8 + r() * 1.2 }));
})();

/** The sky window: fixed far stars, the path of the near star and the near star at a month of the year. */
export function shiftSvg(ly: number, month: number): string {
  const p = parallaxOf(ly);
  const rad = p * SCALE;
  const a = (month / 12) * 2 * Math.PI;
  const x = 150 + Math.cos(a) * rad;
  const y = 100 + Math.sin(a) * rad;
  let s = dots.map((d) => `<circle class="far" cx="${d.x.toFixed(1)}" cy="${d.y.toFixed(1)}" r="${d.r.toFixed(1)}"/>`).join('');
  s += `<circle class="path" cx="150" cy="100" r="${Math.max(rad, 0.5).toFixed(1)}"/>`;
  s += `<line class="rule" x1="150" y1="100" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`;
  s += `<circle class="near" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5"/>`;
  return s;
}

export function shiftText(ly: number): string {
  const p = parallaxOf(ly);
  const size = p * 2;
  return `At ${sig(ly)} light years the parallax is ${sig(p)} arcseconds, so the star swings across ${sig(size)} arcseconds from one side of the orbit to the other. The drawing is magnified.`;
}

// ---------- Plate 2: angle to distance ----------

/** Slider 0 to 100 for a parallax from 0.001 to 1 arcsecond, on a log scale. */
export const parallaxFromSlider = (i: number) => 10 ** (-3 + (3 * i) / 100);
export const sliderFromParallax = (p: number) => Math.round(((Math.log10(p) + 3) / 3) * 100);

/** Where a distance sits on a log bar from 3 to 3,300 light years, as a share from 0 to 1. */
export const barShare = (ly: number) => Math.min(1, Math.max(0, (Math.log10(ly) - Math.log10(3)) / (Math.log10(3300) - Math.log10(3))));

// ---------- Plate 3: the smallest angle ----------

export const COIN_MM = 23.25; // a one euro coin

/** How far away a one euro coin is when it spans this many arcseconds, in kilometres. */
export const coinKm = (arcsec: number) => COIN_MM / 1e6 / (arcsec * (Math.PI / 648000));

export interface Tool { id: string; name: string; precision: number; note: string }

export const tools: Tool[] = [
  { id: 'bessel', name: 'Bessel, 1838', precision: 0.02, note: 'A heliometer at Königsberg. His error was about 0.02 arcseconds.' },
  { id: 'ground', name: 'Telescopes on the ground', precision: 0.01, note: 'The air blurs the star, so about 0.01 arcseconds is the floor.' },
  { id: 'hipparcos', name: 'Hipparcos, launched 1989', precision: 0.001, note: 'A satellite above the air, good to about 0.001 arcseconds.' },
  { id: 'gaia', name: 'Gaia, launched 2013', precision: 0.000025, note: 'Aimed at 25 microarcseconds for its brightest stars.' },
];

/** Slider 0 to 100 for 0.00001 to 1 arcsecond, on a log scale. */
export const angleFromSlider = (i: number) => 10 ** (-5 + (5 * i) / 100);
export const sliderFromAngle = (a: number) => Math.round(((Math.log10(a) + 5) / 5) * 100);

/** How far a smallest measurable parallax reaches, in light years. A rough reach, not a good distance. */
export const reachLy = (precision: number) => lyOf(precision);

// ---------- Plate 4: old light ----------

/** Seconds for light to cross a distance in light years, shown in the clearest unit. */
export const SUN_MIN = AU_KM / C_KM_S / 60;
