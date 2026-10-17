// Maths and drawings for the sound page: sine waves, how they add up and what beats are.
// The drawings are made here, so the same strings are used when the page is built and in the browser.

const f1 = (n: number) => Math.round(n * 10) / 10;

export const A4 = 440;
const NAMES = ['C', 'C sharp', 'D', 'D sharp', 'E', 'F', 'F sharp', 'G', 'G sharp', 'A', 'A sharp', 'B'];

/** The nearest note of the piano, for a frequency in hertz, and how far off it is in cents. */
export function nearestNote(freq: number): { name: string; cents: number } {
  const midi = 69 + 12 * Math.log2(freq / A4);
  const n = Math.round(midi);
  const octave = Math.floor(n / 12) - 1;
  return { name: `${NAMES[((n % 12) + 12) % 12]} ${octave}`, cents: Math.round((midi - n) * 100) || 0 };
}

export const HARMONICS = 8;

/** Heights of the first eight harmonics, from 0 to 1. */
export const recipes: Record<string, { name: string; amps: number[]; signs?: number[] }> = {
  sine: { name: 'Sine', amps: [1, 0, 0, 0, 0, 0, 0, 0] },
  square: { name: 'Square', amps: [1, 0, 1 / 3, 0, 1 / 5, 0, 1 / 7, 0] },
  saw: { name: 'Sawtooth', amps: [1, 1 / 2, 1 / 3, 1 / 4, 1 / 5, 1 / 6, 1 / 7, 1 / 8] },
  triangle: { name: 'Triangle', amps: [1, 0, 1 / 9, 0, 1 / 25, 0, 1 / 49, 0], signs: [1, 1, -1, 1, 1, 1, -1, 1] },
};

/** Toy recipes for the sound of an instrument. Real instruments change from moment to moment. */
export const voices: Record<string, { name: string; amps: number[]; note: string }> = {
  flute: { name: 'Flute-like', amps: [1, 0.2, 0.05, 0.02, 0, 0, 0, 0], note: 'Almost a pure sine wave, so a soft, clear sound.' },
  clarinet: { name: 'Clarinet-like', amps: [1, 0.04, 0.7, 0.04, 0.45, 0.03, 0.25, 0.02], note: 'Mostly the odd harmonics, which gives a hollow sound.' },
  violin: { name: 'Violin-like', amps: [1, 0.7, 0.55, 0.45, 0.35, 0.3, 0.2, 0.15], note: 'Many harmonics that fade slowly, which gives a bright, buzzing sound.' },
  organ: { name: 'Organ-like', amps: [1, 0.8, 0, 0.6, 0, 0.4, 0, 0.3], note: 'A few strong harmonics, which gives a full, steady sound.' },
};

/** The wave made by adding sines. A sign of -1 turns that harmonic upside down, which the triangle needs. */
export function sumWave(amps: number[], signs: number[] = []): (t: number) => number {
  return (t) => amps.reduce((s, a, i) => s + a * (signs[i] ?? 1) * Math.sin((i + 1) * t), 0);
}

export function peak(amps: number[], signs: number[] = []): number {
  const w = sumWave(amps, signs);
  let m = 0;
  for (let k = 0; k < 400; k++) m = Math.max(m, Math.abs(w((k / 400) * Math.PI * 2)));
  return m || 1;
}

/** The scope screen: a wave drawn as a line, with a middle line. `cycles` is how many cycles fit across the screen. */
export function scopeSvg(fn: (t: number) => number, cycles: number, scale = 1, w = 290, h = 110): string {
  const [x0, mid] = [5, h / 2 + 5];
  let d = '';
  const n = 360;
  for (let k = 0; k <= n; k++) {
    const x = x0 + (w * k) / n;
    const y = mid - (h / 2 - 8) * Math.max(-1, Math.min(1, fn((k / n) * cycles * Math.PI * 2) * scale));
    d += `${k === 0 ? 'M' : 'L'}${f1(x)} ${f1(y)}`;
  }
  const grid = [0.25, 0.5, 0.75].map((p) => `<line class="grid" x1="${x0 + w * p}" y1="5" x2="${x0 + w * p}" y2="${h + 5}"/>`).join('');
  return `${grid}<line class="mid" x1="${x0}" y1="${mid}" x2="${x0 + w}" y2="${mid}"/><path class="trace" d="${d}"/>`;
}

export function sineWave(amp = 1): (t: number) => number {
  return (t) => amp * Math.sin(t);
}

/** Two close notes added together, drawn with the beat shown at a slower speed. */
export function beatsSvg(f1hz: number, f2hz: number, seconds = 1): string {
  const [x0, w, h] = [5, 290, 110];
  const mid = h / 2 + 5;
  const diff = Math.abs(f2hz - f1hz);
  // The pitch (fast wiggle) is shown at a slower speed so that it can be seen. The envelope is exact.
  const wiggles = 40;
  let d = '';
  let env = '';
  let env2 = '';
  const n = 480;
  for (let k = 0; k <= n; k++) {
    const t = (k / n) * seconds;
    const e = Math.abs(Math.cos(Math.PI * diff * t));
    const y = mid - (h / 2 - 8) * e * Math.sin(2 * Math.PI * wiggles * (k / n));
    const x = x0 + (w * k) / n;
    d += `${k === 0 ? 'M' : 'L'}${f1(x)} ${f1(y)}`;
    env += `${k === 0 ? 'M' : 'L'}${f1(x)} ${f1(mid - (h / 2 - 8) * e)}`;
    env2 += `${k === 0 ? 'M' : 'L'}${f1(x)} ${f1(mid + (h / 2 - 8) * e)}`;
  }
  return `<line class="mid" x1="${x0}" y1="${mid}" x2="${x0 + w}" y2="${mid}"/><path class="trace" d="${d}"/><path class="envelope" d="${env}"/><path class="envelope" d="${env2}"/>`;
}

export function beatStatus(f1hz: number, f2hz: number): string {
  const d = Math.abs(f2hz - f1hz);
  if (d < 0.05) return `Both tones are ${f1hz} Hz. They match, so there are no beats.`;
  const per = d.toFixed(d % 1 ? 1 : 0);
  return `${f1hz} Hz and ${f2hz} Hz differ by ${per} Hz, so the sound gets louder and softer ${per} times a second. When the beats slow down and stop, the two notes match. That is how a piano tuner works.`;
}
