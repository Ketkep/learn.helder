// Maths and drawings for the noise cancelling page. A steady tone is cancelled by adding the same tone turned upside down. If the
// upside down copy is late by a time, the two no longer match, and what is left is 2 times the sine of half the phase error, as a share
// of the noise. This is a simple model made for the page. Real headphones use many tricks, and the sources say the method works best on
// steady, low sounds. The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

/** What is left of a tone, as a share of its size, when the upside down copy is late by `ms` milliseconds. 1 means no change. */
export const left = (hz: number, ms: number) => 2 * Math.abs(Math.sin(Math.PI * hz * (ms / 1000)));

/** The same in decibels of reduction: positive is quieter, negative is louder. Capped at 60. */
export function reduction(share: number): number {
  if (share < 1e-3) return 60;
  return -20 * Math.log10(share);
}

/** The lateness, in degrees of the wave, for a tone and a delay. */
export const phase = (hz: number, ms: number) => ((hz * ms) / 1000) * 360;

/** A phase error in degrees, and what is left. */
export const leftFromPhase = (deg: number) => 2 * Math.abs(Math.sin((deg * Math.PI) / 360));

/** The time in microseconds that a phase error takes at a frequency. */
export const micro = (deg: number, hz: number) => (deg / 360 / hz) * 1e6;

/** Three rows: the noise, the late upside down copy, and the sum, over three periods of the tone. */
export function wavesSvg(hz: number, ms: number): string {
  const W = 276;
  const X0 = 12;
  const shift = ms / 1000;
  const T = 1 / hz;
  const span = 3 * T;
  const row = (y: number, fn: (t: number) => number, cls: string, amp: number) => {
    let d = '';
    for (let i = 0; i <= 276; i++) {
      const t = (i / 276) * span;
      d += `${i ? 'L' : 'M'}${f1(X0 + (i / 276) * W)} ${f1(y - amp * fn(t))} `;
    }
    return `<path class="${cls}" d="${d}"/>`;
  };
  const noise = (t: number) => Math.sin(2 * Math.PI * hz * t);
  const anti = (t: number) => -Math.sin(2 * Math.PI * hz * (t - shift));
  let o = `<rect class="panel" x="1" y="1" width="298" height="198" rx="8"/>`;
  o += row(38, noise, 'wn', 16);
  o += row(86, anti, 'wa', 16);
  o += row(150, (t) => noise(t) + anti(t), 'ws', 16);
  o += `<text class="lab small" x="12" y="14">The noise</text><text class="lab small" x="12" y="62">The anti-noise, turned upside down and ${fmt(ms, 2)} ms late</text><text class="lab small" x="12" y="112">What is left when they meet (same scale)</text>`;
  o += `<text class="lab small" x="12" y="195">Three periods of a ${fmt(hz)} Hz tone</text>`;
  return o;
}

/** What is left against frequency for a fixed delay, on a log scale, with the line of no change. */
export function graphSvg(ms: number): string {
  const gx = (f: number) => 20 + ((Math.log10(f) - Math.log10(50)) / (Math.log10(4000) - Math.log10(50))) * 262;
  const gy = (s: number) => 130 - (Math.min(s, 2) / 2) * 100;
  let d = '';
  for (let k = 0; k <= 120; k++) {
    const f = 50 * Math.pow(4000 / 50, k / 120);
    d += `${k ? 'L' : 'M'}${f1(gx(f))} ${f1(gy(left(f, ms)))} `;
  }
  let o = `<rect class="panel" x="1" y="1" width="298" height="168" rx="8"/>`;
  o += `<line class="axis" x1="20" y1="130" x2="282" y2="130"/>`;
  o += `<line class="same" x1="20" y1="${gy(1)}" x2="282" y2="${gy(1)}"/><text class="lab small" x="24" y="${gy(1) - 4}">No change. Below the line is quieter.</text>`;
  for (const f of [100, 1000]) o += `<line class="tick" x1="${f1(gx(f))}" y1="130" x2="${f1(gx(f))}" y2="135"/><text class="lab small mid" x="${f1(gx(f))}" y="148">${fmt(f)} Hz</text>`;
  o += `<path class="curve" d="${d}"/>`;
  o += `<text class="lab" x="12" y="18">What is left of the noise, by pitch</text>`;
  return o;
}
