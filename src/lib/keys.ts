// Maths and drawings for the musical scale page. Everything is computed here. The same text is made at build time (Astro) and in the browser.

export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

/** Semitones counted from C4, the C below middle A. A4 is 9. */
export const freqOf = (fromC4: number) => 440 * 2 ** ((fromC4 - 9) / 12);

export const nameOf = (fromC4: number) => `${NOTES[((fromC4 % 12) + 12) % 12]}${4 + Math.floor(fromC4 / 12)}`;

// ---------- The scales ----------

export interface Kind { id: string; name: string; steps: number[] }

export const KINDS: Kind[] = [
  { id: 'major', name: 'Major', steps: [0, 2, 4, 5, 7, 9, 11] },
  { id: 'minor', name: 'Natural minor', steps: [0, 2, 3, 5, 7, 8, 10] },
  { id: 'majpent', name: 'Major pentatonic', steps: [0, 2, 4, 7, 9] },
  { id: 'minpent', name: 'Minor pentatonic', steps: [0, 3, 5, 7, 10] },
];

/** The scale from a root, including the octave on top. */
export const notesOf = (kind: Kind, root: number) => [...kind.steps.map((s) => root + s), root + 12];

/** The gaps between the notes: W for a whole step (2 semitones), H for a half step (1), or the number of semitones for bigger gaps. */
export function gaps(kind: Kind): string[] {
  const all = [...kind.steps, 12];
  return all.slice(1).map((s, i) => {
    const d = s - all[i];
    return d === 2 ? 'W' : d === 1 ? 'H' : String(d);
  });
}

// ---------- The keyboard ----------

const WHITE = [0, 2, 4, 5, 7, 9, 11];

/** Two octaves of keys, C4 to B5, with the notes of a scale lit. */
export function keysSvg(lit: number[], root: number): string {
  const kw = 300 / 14;
  let s = '';
  for (let i = 0; i < 14; i++) {
    const semi = WHITE[i % 7] + 12 * Math.floor(i / 7);
    const on = lit.includes(semi);
    s += `<rect class="wkey${on ? ' on' : ''}${semi === root ? ' root' : ''}" x="${f1(i * kw + 0.5)}" y="4" width="${f1(kw - 1)}" height="104" rx="3"/>`;
  }
  for (let i = 0; i < 14; i++) {
    const w = WHITE[i % 7];
    if ([0, 1, 3, 4, 5].includes(i % 7)) {
      const semi = w + 1 + 12 * Math.floor(i / 7);
      const on = lit.includes(semi);
      s += `<rect class="bkey${on ? ' on' : ''}${semi === root ? ' root' : ''}" x="${f1((i + 1) * kw - 6)}" y="4" width="12" height="64" rx="2"/>`;
    }
  }
  return s;
}

// ---------- Twelve semitones ----------

export const ratioAt = (semis: number) => 2 ** (semis / 12);
export const freqAt = (semis: number) => 440 * ratioAt(semis);

// ---------- Stacking fifths ----------

/** After n fifths up from C, the note name. */
export const fifthNote = (n: number) => NOTES[(n * 7) % 12];

/** A just fifth (3 to 2) stacked n times, folded back into one octave, in cents above the start. */
export function justCents(n: number): number {
  const c = n * 1200 * Math.log2(1.5);
  return c - 1200 * Math.floor(c / 1200);
}

/** The same note in equal temperament, in cents above the start. */
export const equalCents = (n: number) => (n * 700) % 1200;

/** How far the stack of just fifths has drifted from the equal note. At twelve fifths the note should be back at the start, and the gap is the Pythagorean comma. */
export function drift(n: number): number {
  let d = justCents(n) - equalCents(n);
  if (d > 600) d -= 1200;
  if (d < -600) d += 1200;
  return d;
}

export const COMMA = 12 * 1200 * Math.log2(1.5) - 7 * 1200;
