// Thermostat maths for the thermostat page. Used by the page at build time and by the scripts in the browser.
// These are toy models with typical numbers, made for this page. A real room and heater are more complicated.

export interface Setup {
  /** Temperature outside, in degrees C. */
  outside: number;
  /** The temperature you ask for, in degrees C. */
  set: number;
  /** The gap between switch on and switch off, in degrees C. The heater comes on half the gap below the set point and goes off half the gap above it. */
  band: number;
  /** How fast the room loses heat for each degree it is warmer than outside, per hour. A well insulated room has a small number. */
  leak: number;
  /** How slowly the heater warms up and cools down, in hours. 0 is at once. */
  lag: number;
}

export const POWER = 3;
export const HOURS = 24;

export interface Run {
  temps: number[];
  on: boolean[];
  min: number;
  max: number;
  switches: number;
  onShare: number;
  /** The share of time the heater would need to be on to hold the set point. Above 1 the heater is too small. */
  needed: number;
}

/** Simulate a day with a thermostat that switches the heater on and off. One step is a minute. */
export function simulate(s: Setup): Run {
  const dt = 1 / 60;
  const steps = HOURS * 60;
  let t = s.set;
  let heat = 0;
  let on = false;
  const temps: number[] = [];
  const flags: boolean[] = [];
  let switches = 0;
  for (let i = 0; i <= steps; i++) {
    const was: boolean = on;
    if (t <= s.set - s.band / 2) on = true;
    else if (t >= s.set + s.band / 2) on = false;
    if (on !== was) switches++;
    const target = on ? 1 : 0;
    heat += s.lag > 0 ? ((target - heat) / s.lag) * dt : target - heat;
    t += (POWER * heat - s.leak * (t - s.outside)) * dt;
    temps.push(t);
    flags.push(on);
  }
  const settled = temps.slice(Math.round(2 * 60));
  return {
    temps,
    on: flags,
    min: Math.min(...settled),
    max: Math.max(...settled),
    switches,
    onShare: flags.filter(Boolean).length / flags.length,
    needed: (s.leak * (s.set - s.outside)) / POWER,
  };
}

const f1 = (n: number) => Math.round(n * 10) / 10;

/** The chart of a run as SVG text: the heater being on, the set point and band, and the room temperature. */
export function chartSvg(s: Setup, r: Run): string {
  const [x0, x1, y0, y1] = [34, 292, 14, 138];
  const [lo, hi] = [Math.min(10, s.set - 6), Math.max(26, s.set + 6)];
  const X = (h: number) => f1(x0 + ((x1 - x0) * h) / HOURS);
  const Y = (v: number) => f1(y1 - ((y1 - y0) * (Math.min(hi, Math.max(lo, v)) - lo)) / (hi - lo));
  let bands = '';
  let start = -1;
  r.on.forEach((o, i) => {
    if (o && start < 0) start = i;
    if ((!o || i === r.on.length - 1) && start >= 0) {
      bands += `<rect class="heat" x="${X(start / 60)}" y="${y1 - 8}" width="${Math.max(0.6, f1(X(i / 60) - X(start / 60)))}" height="8"/>`;
      start = -1;
    }
  });
  const line = r.temps.map((v, i) => `${i === 0 ? 'M' : 'L'}${X(i / 60)} ${Y(v)}`).filter((_, i) => i % 3 === 0).join('');
  const grid = [0, 6, 12, 18, 24].map((h) => `<line class="grid" x1="${X(h)}" y1="${y0}" x2="${X(h)}" y2="${y1}"/><text class="lab" x="${X(h)}" y="${y1 + 14}" text-anchor="middle">${h}</text>`).join('');
  const ticks = [lo, (lo + hi) / 2, hi].map((v) => `<text class="lab" x="${x0 - 5}" y="${Number(Y(v)) + 4}" text-anchor="end">${Math.round(v)}</text>`).join('');
  return (
    grid +
    ticks +
    `<rect class="bandbox" x="${x0}" y="${Y(s.set + s.band / 2)}" width="${x1 - x0}" height="${f1(Math.max(1, Number(Y(s.set - s.band / 2)) - Number(Y(s.set + s.band / 2))))}"/>` +
    `<line class="setline" x1="${x0}" y1="${Y(s.set)}" x2="${x1}" y2="${Y(s.set)}"/>` +
    `<line class="outline" x1="${x0}" y1="${Y(s.outside)}" x2="${x1}" y2="${Y(s.outside)}"/>` +
    bands +
    `<path class="temp" d="${line}"/>` +
    `<text class="lab" x="${(x0 + x1) / 2}" y="${y1 + 28}" text-anchor="middle">hours</text>`
  );
}
