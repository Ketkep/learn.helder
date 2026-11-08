// Small sums and drawings for the reaction time page. The test itself runs in the browser and nothing is saved or sent anywhere.
// Distance is speed times time. A ruler that falls for a time t drops half of the pull of gravity times t squared. The typical times come
// from the sources, which disagree a little. The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

/** Metres travelled in a time in milliseconds at a speed in kilometres an hour. */
export const metres = (kmh: number, ms: number) => (kmh / 3.6) * (ms / 1000);

/** Centimetres that a ruler falls in a time in milliseconds, from rest. */
export const ruler = (ms: number) => 0.5 * 9.81 * (ms / 1000) ** 2 * 100;

export const SPEEDS = [
  { name: 'Walking', kmh: 5 },
  { name: 'Cycling', kmh: 20 },
  { name: 'A fast sprinter', kmh: 36 },
  { name: 'A car in town', kmh: 50 },
  { name: 'A car on a motorway', kmh: 100 },
];

/** The average of a list, or 0. */
export const mean = (list: number[]) => (list.length ? list.reduce((a, b) => a + b, 0) / list.length : 0);

/** A row of dots for the tries, filled once a time is in. */
export function triesSvg(times: number[], total = 5): string {
  const max = Math.max(400, ...times);
  let o = `<rect class="pad" x="1" y="1" width="298" height="118" rx="8"/>`;
  for (let i = 0; i < total; i++) {
    const t = times[i];
    const h = t ? (t / max) * 62 : 0;
    o += `<rect class="slot" x="${f1(20 + i * 54)}" y="38" width="40" height="64" rx="3"/>`;
    if (t) o += `<rect class="fill" x="${f1(20 + i * 54)}" y="${f1(102 - h)}" width="40" height="${f1(h)}" rx="3"/><text class="lab small mid" x="${f1(40 + i * 54)}" y="${f1(98 - h)}">${fmt(t)}</text>`;
  }
  o += `<text class="lab" x="12" y="16">Your times in milliseconds</text>`;
  return o;
}

/** A line with two marks for how far something travels. */
export function distanceSvg(kmh: number, ms: number): string {
  const m = metres(kmh, ms);
  const w = Math.min(260, 20 + m * 4);
  let o = `<rect class="pad" x="1" y="1" width="298" height="98" rx="8"/>`;
  o += `<line class="road" x1="20" y1="56" x2="280" y2="56"/>`;
  o += `<rect class="travel" x="20" y="44" width="${f1(w)}" height="24" rx="4"/>`;
  o += `<text class="lab" x="12" y="20">${fmt(m, 1)} metres in ${fmt(ms)} milliseconds</text>`;
  o += `<text class="lab small" x="12" y="90">Each 10 metres is 40 pixels, up to the edge of the picture</text>`;
  return o;
}
