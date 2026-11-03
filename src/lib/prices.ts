// Maths and drawings for the inflation page. The sums are plain arithmetic. The prices, weights and pay on the page are made up,
// so they are marked as such. The same text is made at build time (Astro) and in the browser. Nothing here is money advice.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
export const euro = (n: number) => `€${fmt(n, 2)}`;

/** What a price becomes after some years of steady rises, in per cent a year. */
export const grow = (price: number, rate: number, years: number) => price * Math.pow(1 + rate / 100, years);

/** What the same money buys after some years, as a share of what it bought at the start. */
export const buys = (rate: number, years: number) => 1 / Math.pow(1 + rate / 100, years);

/** The price line over the years, with a marker. */
export function priceSvg(price: number, rate: number, years: number): string {
  const top = Math.max(grow(price, rate, 30), price * 1.5);
  const gx = (y: number) => 20 + (y / 30) * 250;
  const gy = (v: number) => 128 - ((v - price) / (top - price)) * 96;
  let d = '';
  for (let y = 0; y <= 30; y++) d += `${y ? 'L' : 'M'}${f1(gx(y))} ${f1(gy(grow(price, rate, y)))} `;
  let o = `<rect class="paper" x="1" y="1" width="298" height="168" rx="6"/>`;
  o += `<line class="axis" x1="14" y1="128" x2="280" y2="128"/>`;
  for (const y of [0, 10, 20, 30]) o += `<line class="tick" x1="${f1(gx(y))}" y1="128" x2="${f1(gx(y))}" y2="133"/><text class="lab small mid" x="${f1(gx(y))}" y="145">${y === 0 ? 'now' : `${y} yrs`}</text>`;
  o += `<path class="curve" d="${d}"/>`;
  o += `<circle class="dot" cx="${f1(gx(years))}" cy="${f1(gy(grow(price, rate, years)))}" r="5"/>`;
  o += `<text class="lab" x="12" y="20">Price of a loaf that costs ${euro(price)} now</text>`;
  return o;
}

// ---------- The basket ----------

export interface Item {
  name: string;
  weight: number; // share of spending, made up
  price: number; // made up
}

export const BASKET: Item[] = [
  { name: 'Rent', weight: 35, price: 900 },
  { name: 'Food', weight: 25, price: 320 },
  { name: 'Energy', weight: 15, price: 160 },
  { name: 'Travel', weight: 15, price: 120 },
  { name: 'Clothes', weight: 10, price: 60 },
];

export const START: number[] = [3, 5, 20, 4, -2];

/** The change of the whole basket, from the change of each item and its weight. */
export const basketChange = (changes: number[]) => BASKET.reduce((t, it, i) => t + (it.weight / 100) * changes[i], 0);

export function basketSvg(changes: number[]): string {
  let o = `<rect class="paper" x="1" y="1" width="298" height="168" rx="6"/>`;
  const zero = 150;
  o += `<line class="axis" x1="${zero}" y1="26" x2="${zero}" y2="148"/>`;
  BASKET.forEach((it, i) => {
    const y = 34 + i * 22;
    const w = Math.max(-1, Math.min(1, changes[i] / 30)) * 110;
    o += `<text class="lab small" x="8" y="${y + 9}">${it.name} (${it.weight}%)</text>`;
    o += `<rect class="${changes[i] >= 0 ? 'up' : 'down'}" x="${f1(w >= 0 ? zero : zero + w)}" y="${y}" width="${f1(Math.abs(w))}" height="14"/>`;
  });
  const t = basketChange(changes);
  o += `<text class="lab" x="12" y="20">Price change of each item, and the basket: ${t >= 0 ? '+' : ''}${fmt(t, 1)}%</text>`;
  return o;
}

// ---------- Pay and prices ----------

/** The change in what a pay packet buys, in per cent, when pay and prices both rise. */
export const realChange = (pay: number, prices: number) => ((1 + pay / 100) / (1 + prices / 100) - 1) * 100;

export function paySvg(pay: number, prices: number): string {
  const r = realChange(pay, prices);
  const bar = (v: number) => Math.max(2, (v / 12) * 220);
  let o = `<rect class="paper" x="1" y="1" width="298" height="148" rx="6"/>`;
  o += `<text class="lab small" x="12" y="40">Pay +${fmt(pay, 1)}%</text><rect class="up" x="12" y="46" width="${f1(bar(pay))}" height="16"/>`;
  o += `<text class="lab small" x="12" y="84">Prices +${fmt(prices, 1)}%</text><rect class="down" x="12" y="90" width="${f1(bar(prices))}" height="16"/>`;
  o += `<text class="lab" x="12" y="20">What the pay buys: ${r >= 0 ? '+' : ''}${fmt(r, 1)}%</text>`;
  o += `<text class="lab small" x="12" y="134">Made up numbers</text>`;
  return o;
}
