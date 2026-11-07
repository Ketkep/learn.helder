// Maths and drawings for the guitar fret page. The pitch of a string is inversely proportional to the length that vibrates, so halving it
// doubles the pitch. In equal temperament each fret raises the pitch by the same ratio, the twelfth root of 2, so the distance from the nut
// to fret n is the scale length times (1 minus 2 to the power minus n over 12). The strings are in the usual tuning, with the A above
// middle C at 440 hertz, as on the beats page. The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export const SEMITONE = Math.pow(2, 1 / 12);

/** Millimetres from the nut to fret n for a given scale length. */
export const fretAt = (scale: number, n: number) => scale * (1 - Math.pow(2, -n / 12));

/** Millimetres of string left to vibrate when a string is pressed at fret n. */
export const remaining = (scale: number, n: number) => scale - fretAt(scale, n);

export const SCALES = [
  { name: '648 mm (25.5 in)', mm: 648 },
  { name: '629 mm (24.75 in)', mm: 629 },
];

export const STRINGS = [
  { name: 'Low E', hz: 82.41 },
  { name: 'A', hz: 110 },
  { name: 'D', hz: 146.83 },
  { name: 'G', hz: 196 },
  { name: 'B', hz: 246.94 },
  { name: 'High E', hz: 329.63 },
];

const NOTES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const OPEN: Record<string, number> = { 'Low E': 4, A: 9, D: 2, G: 7, B: 11, 'High E': 4 };

/** The note name at a fret on a string. */
export const noteAt = (string: string, n: number) => NOTES[(OPEN[string] + n) % 12];

/** Frequency at a fret. */
export const hzAt = (open: number, n: number) => open * Math.pow(SEMITONE, n);

/** The size of a ratio in cents, a hundredth of a semitone. */
export const cents = (ratio: number) => 1200 * Math.log2(ratio);

export const INTERVALS = [
  { name: 'Octave', ratio: 2, fret: 12, simple: '2 to 1' },
  { name: 'Fifth', ratio: 3 / 2, fret: 7, simple: '3 to 2' },
  { name: 'Fourth', ratio: 4 / 3, fret: 5, simple: '4 to 3' },
  { name: 'Major third', ratio: 5 / 4, fret: 4, simple: '5 to 4' },
];

/** Where a fret would go for a whole number ratio: the string is shortened to 1 over the ratio. */
export const pureAt = (scale: number, ratio: number) => scale * (1 - 1 / ratio);

/** The neck with frets 1 to 12 and a marker at one fret. */
export function neckSvg(scale: number, mark: number): string {
  const k = 270 / fretAt(scale, 12);
  let o = `<rect class="neck" x="1" y="1" width="298" height="118" rx="8"/><rect class="board" x="12" y="30" width="276" height="60" rx="3"/>`;
  o += `<rect class="nut" x="10" y="28" width="4" height="64"/>`;
  for (let n = 1; n <= 12; n++) {
    const x = 12 + fretAt(scale, n) * k;
    o += `<line class="${n === mark ? 'fret hot' : 'fret'}" x1="${f1(x)}" y1="30" x2="${f1(x)}" y2="90"/>`;
    o += `<text class="lab small mid" x="${f1(x)}" y="106">${n}</text>`;
  }
  for (let s = 0; s < 6; s++) o += `<line class="str" x1="12" y1="${f1(36 + s * 9.6)}" x2="288" y2="${f1(36 + s * 9.6)}"/>`;
  if (mark > 0) {
    const x0 = 12 + fretAt(scale, mark - 1) * k;
    const x1 = 12 + fretAt(scale, mark) * k;
    o += `<circle class="dot" cx="${f1((x0 + x1) / 2)}" cy="60" r="5"/>`;
  }
  o += `<text class="lab" x="12" y="18">Frets 1 to 12 on a ${fmt(scale)} mm scale</text>`;
  return o;
}

/** Gap between each fret and the one before, as bars: they get smaller. */
export function gapsSvg(scale: number, mark: number): string {
  let o = `<rect class="neck" x="1" y="1" width="298" height="138" rx="8"/>`;
  const max = fretAt(scale, 1);
  for (let n = 1; n <= 12; n++) {
    const gap = fretAt(scale, n) - fretAt(scale, n - 1);
    const h = (gap / max) * 90;
    o += `<rect class="${n === mark ? 'gap hot' : 'gap'}" x="${f1(14 + (n - 1) * 22.5)}" y="${f1(112 - h)}" width="17" height="${f1(h)}"/>`;
    o += `<text class="lab small mid" x="${f1(22.5 + (n - 1) * 22.5)}" y="128">${n}</text>`;
  }
  o += `<text class="lab" x="12" y="18">Gap before each fret, in millimetres (the bars shrink)</text>`;
  return o;
}
