// Maths and drawings for the Antikythera page. The cycle lengths are the standard values. The drawings are our own, not the machine's.
// The same text is made at build time (Astro) and in the browser.

export const MONTH = 29.53059; // days from new moon to new moon
export const YEAR = 365.2422; // days in a tropical year
export const METONIC_MONTHS = 235;
export const SAROS_MONTHS = 223;

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

/** The age of the Moon in days after a number of days, if the crank starts at a new moon. */
export const moonAge = (days: number) => ((days % MONTH) + MONTH) % MONTH;

export function phaseName(age: number): string {
  const f = age / MONTH;
  if (f < 0.03 || f > 0.97) return 'new moon';
  if (f < 0.22) return 'waxing crescent';
  if (f < 0.28) return 'first quarter';
  if (f < 0.47) return 'waxing gibbous';
  if (f < 0.53) return 'full moon';
  if (f < 0.72) return 'waning gibbous';
  if (f < 0.78) return 'last quarter';
  return 'waning crescent';
}

/** The Moon as the half dark, half pale ball of the machine, at an age in days. */
export function moonSvg(age: number): string {
  const f = age / MONTH;
  const waxing = f <= 0.5;
  const g = waxing ? f : 1 - f;
  const c = Math.cos(2 * Math.PI * g);
  const r = 40;
  const cx = 150;
  const cy = 70;
  const rx = Math.abs(c) * r;
  const lit = `M${cx},${cy - r} A${r},${r} 0 0 1 ${cx},${cy + r} A${f1(rx)},${r} 0 0 ${c > 0 ? 0 : 1} ${cx},${cy - r} Z`;
  const flip = waxing ? '' : ` transform="translate(${2 * cx} 0) scale(-1 1)"`;
  return `<circle class="ball" cx="${cx}" cy="${cy}" r="${r}"/><path class="lit" d="${lit}"${flip}/><circle class="rim" cx="${cx}" cy="${cy}" r="${r}"/>`;
}

/** A pointer on a ring: the Sun on the zodiac scale, at a number of days from the spring start. */
export function sunSvg(days: number): string {
  const a = ((days % YEAR) / YEAR) * 2 * Math.PI;
  const x = 150 + Math.sin(a) * 50;
  const y = 70 - Math.cos(a) * 50;
  return `<circle class="ring" cx="150" cy="70" r="50"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
    const t = (i / 12) * 2 * Math.PI;
    return `<line class="tick" x1="${f1(150 + Math.sin(t) * 46)}" y1="${f1(70 - Math.cos(t) * 46)}" x2="${f1(150 + Math.sin(t) * 54)}" y2="${f1(70 - Math.cos(t) * 54)}"/>`;
  }).join('')}<circle class="sun" cx="${f1(x)}" cy="${f1(y)}" r="6"/>`;
}

// ---------- Metonic ----------

export const metonicDays = METONIC_MONTHS * MONTH;

/** After a number of whole years the Moon's age on the same date, if it was new on the first one. */
export const ageAfterYears = (years: number) => moonAge(years * YEAR);

/** Hours between 19 years and 235 months. */
export const metonicGapHours = () => Math.abs(19 * YEAR - metonicDays) * 24;

// ---------- Saros ----------

export const sarosDays = SAROS_MONTHS * MONTH;

/** Eclipses come again a third of a day later, so the shadow falls about a third of the way round the Earth to the west. Degrees, 0 to 360. */
export function sarosShift(n: number): number {
  const frac = (sarosDays * n) % 1;
  return frac * 360;
}

/** A top view of the Earth with the place of an eclipse after n Saros periods. Each period it comes about 120 degrees farther west. */
export function earthSvg(n: number): string {
  let s = `<circle class="earth" cx="150" cy="70" r="46"/><line class="tick" x1="150" y1="14" x2="150" y2="30"/>`;
  for (let k = 0; k <= n; k++) {
    const a = (-sarosShift(k) * Math.PI) / 180; // west is anticlockwise seen from above the north pole
    const x = 150 + Math.sin(a) * 46;
    const y = 70 - Math.cos(a) * 46;
    s += `<circle class="${k === n ? 'shadow now' : 'shadow'}" cx="${f1(x)}" cy="${f1(y)}" r="${k === n ? 9 : 6}"/>`;
  }
  return s;
}

export function yearsDays(days: number): string {
  const y = Math.floor(days / YEAR);
  const d = Math.round(days - y * YEAR);
  return `${y} years and ${d} days`;
}

// ---------- Gears ----------

export const TARGET = METONIC_MONTHS / 19;

/** Turns of the last gear for one turn of the first, with two stages. */
export const ratio = (a: number, b: number, c: number, d: number) => (b / a) * (d / c);

/** Four gears in two stages. Gears 2 and 3 sit on one shaft, so they turn together. The crank turn is a number of degrees of the first gear. */
export function gearsSvg(a: number, b: number, c: number, d: number, degrees: number): string {
  const p = (t: number) => t * 0.5;
  const draw = (cx: number, cy: number, teeth: number, rot: number, cls: string) => {
    const r = p(teeth);
    const pts: string[] = [];
    for (let i = 0; i < teeth * 2; i++) {
      const ang = rot + (i / (teeth * 2)) * 2 * Math.PI;
      const rr = i % 2 ? r - 2.2 : r + 2.2;
      pts.push(`${f1(cx + Math.cos(ang) * rr)},${f1(cy + Math.sin(ang) * rr)}`);
    }
    return `<polygon class="gear ${cls}" points="${pts.join(' ')}"/><circle class="hub" cx="${f1(cx)}" cy="${cy}" r="2.5"/><text class="num" x="${f1(cx)}" y="${f1(cy - r - 7)}" text-anchor="middle">${teeth}</text>`;
  };
  const rotA = (degrees * Math.PI) / 180;
  const rotB = -rotA * (a / b);
  const rotC = rotB;
  const rotD = -rotC * (c / d);
  const w1 = p(a) + p(b);
  const x1 = 75 - w1 / 2;
  const w2 = p(c) + p(d);
  const x3 = 225 - w2 / 2;
  const y = 68;
  return (
    draw(x1, y, a, rotA, 'one') + draw(x1 + w1, y, b, rotB, 'two') +
    `<path class="shaft" d="M${f1(x1 + w1)},${y + p(b) + 6} Q${f1(x1 + w1)},128 ${f1((x1 + w1 + x3) / 2)},128 T${f1(x3)},${y + p(c) + 6}"/>` +
    draw(x3, y, c, rotC, 'three') + draw(x3 + w2, y, d, rotD, 'four') +
    `<text class="lab" x="75" y="12" text-anchor="middle">stage 1</text><text class="lab" x="225" y="12" text-anchor="middle">stage 2</text>`
  );
}
