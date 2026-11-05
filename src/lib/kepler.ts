// Maths and drawings for the moon page. Kepler's third law: for things that go round the Sun, the square of the time of one orbit,
// in years, equals the cube of the distance, in astronomical units. Newton's form gives the mass of the thing in the middle from the
// time and distance of something going round it. The orbit numbers come from the sources. The same text is made at build time (Astro)
// and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
export const sci = (n: number, d = 3) => {
  const e = Math.floor(Math.log10(n));
  return `${(n / 10 ** e).toFixed(d)} × 10^${e}`;
};

const G = 6.6743e-11;
const YEAR = 365.25;
const DAY = 86400;

export interface Planet {
  name: string;
  au: number;
  days: number;
}

export const PLANETS: Planet[] = [
  { name: 'Mercury', au: 0.387, days: 87.97 },
  { name: 'Venus', au: 0.723, days: 224.7 },
  { name: 'Earth', au: 1, days: 365.25 },
  { name: 'Mars', au: 1.524, days: 686.98 },
  { name: 'Jupiter', au: 5.203, days: 4332.59 },
];

/** Years for one orbit at a distance in astronomical units, from the law for the Sun. */
export const years = (au: number) => Math.pow(au, 1.5);

/** Period squared over distance cubed, in years and astronomical units. It should be close to 1. */
export const ratio = (p: Planet) => (p.days / YEAR) ** 2 / p.au ** 3;

export interface Moon {
  name: string;
  planet: string;
  km: number;
  days: number;
  known: number; // accepted mass of the planet in kilograms
}

export const MOONS: Moon[] = [
  { name: 'The Moon', planet: 'Earth', km: 384400, days: 27.32, known: 5.972e24 },
  { name: 'Ganymede', planet: 'Jupiter', km: 1070400, days: 7.1546, known: 1.898e27 },
  { name: 'Callisto', planet: 'Jupiter', km: 1882700, days: 16.689, known: 1.898e27 },
];

/** Mass of the planet in kilograms from the distance in kilometres and the time in days of a moon. */
export const massOf = (km: number, days: number) => (4 * Math.PI * Math.PI * (km * 1000) ** 3) / (G * (days * DAY) ** 2);

/** Days for one orbit at 384,400 km round a planet of a given mass in Earth masses. */
export const daysAround = (earths: number) => (2 * Math.PI * Math.sqrt((384400e3) ** 3 / (G * earths * 5.972e24))) / DAY;

export const EARTH_KG = 5.972e24;

// ---------- Drawings ----------

/** Time against distance on log scales: the five planets and a marker. */
export function lawSvg(au: number): string {
  const gx = (a: number) => 30 + ((Math.log10(a) + 0.5) / 1.5) * 250;
  const gy = (t: number) => 140 - ((Math.log10(t) + 1) / 2.5) * 110;
  let o = `<rect class="board" x="1" y="1" width="298" height="168" rx="8"/>`;
  o += `<line class="chalk faint" x1="${f1(gx(0.3))}" y1="${f1(gy(years(0.3)))}" x2="${f1(gx(10))}" y2="${f1(gy(years(10)))}"/>`;
  PLANETS.forEach((p) => {
    o += `<circle class="dot" cx="${f1(gx(p.au))}" cy="${f1(gy(p.days / YEAR))}" r="4"/><text class="lab small" x="${f1(gx(p.au) + 6)}" y="${f1(gy(p.days / YEAR) + 12)}">${p.name}</text>`;
  });
  o += `<circle class="mark" cx="${f1(gx(au))}" cy="${f1(gy(years(au)))}" r="6"/>`;
  o += `<text class="lab" x="12" y="18">Years for one orbit against distance, both on log scales</text>`;
  o += `<text class="lab small" x="12" y="162">Distance from the Sun, in astronomical units</text>`;
  return o;
}

/** A planet with a moon round it. */
export function moonSvg(name: string, planet: string, km: number): string {
  let o = `<rect class="board" x="1" y="1" width="298" height="168" rx="8"/>`;
  const r = 20 + Math.min(34, Math.log10(km / 300000) * 40);
  o += `<circle class="orbit" cx="150" cy="95" r="${f1(r + 28)}"/>`;
  o += `<circle class="planetdisc" cx="150" cy="95" r="${planet === 'Jupiter' ? 20 : 11}"/>`;
  o += `<circle class="mark" cx="${f1(150 + r + 28)}" cy="95" r="${name === 'The Moon' ? 3.5 : 5}"/>`;
  o += `<text class="lab" x="12" y="18">${name} going round ${planet === 'Earth' ? 'the Earth' : planet}</text>`;
  o += `<text class="lab small" x="12" y="162">Not to scale</text>`;
  return o;
}

/** Days for one orbit against the mass of the planet, with a marker. */
export function massSvg(earths: number): string {
  const gx = (m: number) => 22 + ((Math.log10(m) + 1) / 3.5) * 256;
  const gy = (d: number) => 134 - ((Math.log10(d) + 0.5) / 2.2) * 100;
  let d = '';
  for (let k = 0; k <= 60; k++) {
    const m = 10 ** (-1 + (k / 60) * 3.5);
    d += `${k ? 'L' : 'M'}${f1(gx(m))} ${f1(gy(daysAround(m)))} `;
  }
  let o = `<rect class="board" x="1" y="1" width="298" height="168" rx="8"/>`;
  o += `<path class="curve" d="${d}"/>`;
  for (const [m, label] of [[1, 'Earth'], [317.8, 'Jupiter']] as [number, string][]) o += `<line class="chalk faint" x1="${f1(gx(m))}" y1="140" x2="${f1(gx(m))}" y2="30"/><text class="lab small mid" x="${f1(gx(m))}" y="156">${label}</text>`;
  o += `<circle class="mark" cx="${f1(gx(earths))}" cy="${f1(gy(daysAround(earths)))}" r="6"/>`;
  o += `<text class="lab" x="12" y="18">Days for one orbit at 384,400 km, by mass of the planet</text>`;
  return o;
}
