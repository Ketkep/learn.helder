// Growth maths for the compound growth page. Used by the page at build time and by the scripts in the browser.
// Money here is always "coins", made up for the page. Nothing here is advice, and real rates change and can be negative.

/** Amount after t years with simple growth: the same amount is added each year. rate is a fraction such as 0.05. */
export const simple = (start: number, rate: number, years: number) => start * (1 + rate * years);

/** Amount after t years when each year's growth is added to the amount, so it grows too. */
export const compound = (start: number, rate: number, years: number) => start * (1 + rate) ** years;

/** Amount when growth is added n times a year. n of 0 means all the time (continuous growth). */
export const compoundN = (start: number, rate: number, years: number, n: number) => (n === 0 ? start * Math.exp(rate * years) : start * (1 + rate / n) ** (n * years));

/** Years to double, exactly, at a yearly rate. */
export const doubleExact = (rate: number) => Math.log(2) / Math.log(1 + rate);

/** The rule of 72: divide 72 by the rate in per cent. */
export const rule72 = (ratePct: number) => 72 / ratePct;

/** The purchasing power factor after t years, when money grows at a rate and prices grow at an inflation rate. */
export const realFactor = (rate: number, inflation: number, years: number) => ((1 + rate) / (1 + inflation)) ** years;

export const fmt = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)} million` : Math.round(n).toLocaleString('en-US'));

export interface Series {
  name: string;
  cls: string;
  values: number[];
}

const f1 = (n: number) => Math.round(n * 10) / 10;

/** A line chart as SVG text. Each series has one value for each year from 0. */
export function chartSvg(series: Series[], years: number, floor = 0): string {
  const [x0, x1, y0, y1] = [44, 292, 14, 140];
  const top = Math.max(...series.flatMap((s) => s.values)) * 1.05;
  const X = (i: number) => f1(x0 + ((x1 - x0) * i) / years);
  const Y = (v: number) => f1(y1 - ((y1 - y0) * (v - floor)) / (top - floor));
  const grid = [0, 0.25, 0.5, 0.75, 1].map((k) => `<line class="grid" x1="${x0}" y1="${Y(floor + k * (top - floor))}" x2="${x1}" y2="${Y(floor + k * (top - floor))}"/>`).join('');
  const labY = [0, 0.5, 1].map((k) => `<text class="lab" x="${x0 - 5}" y="${Number(Y(floor + k * (top - floor))) + 4}" text-anchor="end">${fmt(floor + k * (top - floor))}</text>`).join('');
  const step = years <= 10 ? 2 : years <= 20 ? 5 : 10;
  const labX = Array.from({ length: Math.floor(years / step) + 1 }, (_, k) => k * step).map((t) => `<text class="lab" x="${X(t)}" y="${y1 + 14}" text-anchor="middle">${t}</text>`).join('');
  const lines = series.map((s) => `<path class="${s.cls}" d="${s.values.map((v, i) => `${i === 0 ? 'M' : 'L'}${X(i)} ${Y(v)}`).join('')}"/>`).join('');
  return `${grid}${labY}${labX}${lines}<text class="lab" x="${(x0 + x1) / 2}" y="${y1 + 28}" text-anchor="middle">years</text>`;
}

export const years = (n: number) => Array.from({ length: n + 1 }, (_, i) => i);
