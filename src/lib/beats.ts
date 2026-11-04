// Maths and drawings for the beats page. Two steady notes of nearly the same pitch swell and fade at a rate equal to the difference
// of their frequencies, and the note you hear sits at the average. The waves in the picture are drawn slowed down so they can be seen.
// The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

/** Swells per second for two notes. */
export const beatRate = (a: number, b: number) => Math.abs(a - b);

/** The pitch you hear: the average of the two. */
export const heard = (a: number, b: number) => (a + b) / 2;

/** Seconds between one swell and the next, in words. */
export function every(rate: number): string {
  if (rate < 0.05) return 'no swells';
  const s = 1 / rate;
  return s >= 1.5 ? `one swell every ${fmt(s, 1)} seconds` : rate >= 2.5 ? `${fmt(rate, 1).replace('.0', '')} swells a second` : `one swell every ${fmt(s, 2)} seconds`;
}

/** Two waves and their sum, over a window that holds two swells. */
export function addSvg(delta: number): string {
  const W = 276;
  const X0 = 12;
  const n = 30; // cycles of the lower wave in the window, a made up number for the picture
  const rows = [
    { y: 36, k: n, cls: 'wa' },
    { y: 84, k: n + (delta > 0 ? 2 : 0), cls: 'wb' },
  ];
  let o = `<rect class="sheet" x="1" y="1" width="298" height="218" rx="8"/>`;
  for (const r of rows) {
    let d = '';
    for (let i = 0; i <= 552; i++) d += `${i ? 'L' : 'M'}${f1(X0 + (i / 552) * W)} ${f1(r.y - 14 * Math.sin((2 * Math.PI * r.k * i) / 552))} `;
    o += `<path class="${r.cls}" d="${d}"/>`;
  }
  let d = '';
  for (let i = 0; i <= 552; i++) {
    const t = i / 552;
    const v = Math.sin(2 * Math.PI * n * t) + Math.sin(2 * Math.PI * (n + (delta > 0 ? 2 : 0)) * t);
    d += `${i ? 'L' : 'M'}${f1(X0 + t * W)} ${f1(160 - 17 * v)} `;
  }
  o += `<path class="wsum" d="${d}"/>`;
  o += `<text class="lab small" x="12" y="14">First note</text><text class="lab small" x="12" y="62">Second note</text><text class="lab small" x="12" y="118">Both together (what you hear)</text>`;
  o += `<text class="lab small" x="12" y="214">Drawn slowed down. The window holds ${delta > 0 ? 'two swells' : 'no swells'}.</text>`;
  return o;
}

/** A gauge from far below to far above the right pitch. */
export function gaugeSvg(diff: number, limit = 15): string {
  const x = 150 + (Math.max(-limit, Math.min(limit, diff)) / limit) * 120;
  let o = `<rect class="sheet" x="1" y="1" width="298" height="98" rx="8"/>`;
  o += `<line class="axis" x1="30" y1="54" x2="270" y2="54"/>`;
  o += `<line class="goal" x1="150" y1="34" x2="150" y2="74"/>`;
  o += `<circle class="pin ${Math.abs(diff) <= 0.25 ? 'ok' : ''}" cx="${f1(x)}" cy="54" r="9"/>`;
  o += `<text class="lab small" x="30" y="92">Too low</text><text class="lab small mid" x="150" y="92">In tune</text><text class="lab small end" x="270" y="92">Too high</text>`;
  o += `<text class="lab" x="12" y="20">The string against the reference note</text>`;
  return o;
}

/** A bar that shows how far apart two notes are, with the zones sources describe. */
export function zonesSvg(delta: number): string {
  const x = (d: number) => 20 + (d / 60) * 260;
  let o = `<rect class="sheet" x="1" y="1" width="298" height="118" rx="8"/>`;
  o += `<rect class="zone slow" x="${x(0)}" y="40" width="${x(10) - x(0)}" height="28"/>`;
  o += `<rect class="zone mid" x="${x(10)}" y="40" width="${x(20) - x(10)}" height="28"/>`;
  o += `<rect class="zone fast" x="${x(20)}" y="40" width="${x(60) - x(20)}" height="28"/>`;
  o += `<text class="lab small mid" x="${x(5)}" y="58">beats</text><text class="lab small mid" x="${x(15)}" y="58">flutter</text><text class="lab small mid" x="${x(40)}" y="58">rough, then two notes</text>`;
  o += `<line class="goal" x1="${f1(x(delta))}" y1="30" x2="${f1(x(delta))}" y2="80"/><circle class="pin" cx="${f1(x(delta))}" cy="80" r="6"/>`;
  o += `<text class="lab small mid" x="${x(0) + 2}" y="104">0</text><text class="lab small mid" x="${x(20)}" y="104">20</text><text class="lab small end" x="${x(60)}" y="104">60 Hz apart</text>`;
  o += `<text class="lab" x="12" y="20">Two notes ${fmt(delta)} Hz apart</text>`;
  return o;
}
