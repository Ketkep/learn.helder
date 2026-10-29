// Maths and drawings for the music box page. The note frequencies are the equal tempered ones with A at 440 Hz.
// A tooth rings at a pitch that grows with its thickness and falls with the square of its length (a springy bar fixed at one end).
// The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);
export const fmt = (n: number, d = 0) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export const NOTES = [
  { name: 'C', semis: 0 },
  { name: 'D', semis: 2 },
  { name: 'E', semis: 4 },
  { name: 'F', semis: 5 },
  { name: 'G', semis: 7 },
  { name: 'A', semis: 9 },
  { name: 'B', semis: 11 },
  { name: 'C', semis: 12 },
];

/** Frequency in hertz of the note this many semitones above middle C, with A at 440. */
export const freqOf = (semis: number) => 440 * Math.pow(2, (semis - 9) / 12);

export const noteFreq = (i: number) => freqOf(NOTES[i].semis);

// ---------- Part 1: the teeth ----------

/** Length of the tooth for note i, as a share of the shortest tooth (the top note), if all the teeth are equally thick: length goes as one over the square root of the pitch. */
export const lengthOf = (i: number) => Math.sqrt(noteFreq(7) / noteFreq(i));

/** How the pitch changes with the length and thickness of a tooth, both as multiples of the first tooth. */
export const pitchRatio = (length: number, thickness: number) => thickness / (length * length);

/** Semitones up (or down) for a pitch ratio. */
export const semitones = (ratio: number) => 12 * Math.log2(ratio);

export function combSvg(on: number): string {
  let s = '<rect class="base" x="14" y="20" width="26" height="140" rx="4"/>';
  for (let i = 0; i < 8; i++) {
    const len = 200 * (lengthOf(i) / lengthOf(0));
    const y = 28 + i * 16;
    s += `<rect class="tooth${i === on ? ' on' : ''}" x="40" y="${y}" width="${f1(len)}" height="9" rx="2"/><text class="lab" x="${f1(46 + len)}" y="${y + 8}">${NOTES[i].name}</text>`;
  }
  s += '<text class="lab" x="14" y="176">fixed end</text><text class="lab" x="286" y="176" text-anchor="end">free end, plucked by a pin</text>';
  return s;
}

// ---------- Part 2: the pins ----------

export const COLS = 16;

/** Twinkle, twinkle, little star: the notes (0 is C, 4 is G, 5 is A) in 16 steps, with -1 for a rest. */
export const TUNE = [0, 0, 4, 4, 5, 5, 4, -1, 3, 3, 2, 2, 1, 1, 0, -1];

/** The pins as a grid: one row for each note, one column for each step, from the top note down to the bottom one. */
export function grid(tune: number[]): boolean[][] {
  return Array.from({ length: 8 }, (_, row) => tune.map((n) => n === 7 - row));
}

export function pinsSvg(g: boolean[][], at: number): string {
  const x0 = 34;
  const w = 15.5;
  let s = '';
  for (let r = 0; r < 8; r++) {
    const y = 18 + r * 17;
    s += `<line class="row" x1="${x0}" y1="${y + 6}" x2="${x0 + COLS * w}" y2="${y + 6}"/><text class="lab" x="8" y="${y + 10}">${NOTES[7 - r].name}</text>`;
    for (let c = 0; c < COLS; c++) {
      if (g[r][c]) s += `<circle class="pin${c === at ? ' hit' : ''}" cx="${f1(x0 + c * w + w / 2)}" cy="${y + 6}" r="5"/>`;
    }
  }
  if (at >= 0) s += `<rect class="head" x="${f1(x0 + at * w)}" y="12" width="${w}" height="142" rx="3"/>`;
  s += `<text class="lab" x="${x0}" y="170">the cylinder, rolled flat: one turn from left to right</text>`;
  return s;
}

/** Pins that sound at a step: the notes of the rows that have a pin there. */
export function notesAt(g: boolean[][], c: number): number[] {
  const out: number[] = [];
  for (let r = 0; r < 8; r++) if (g[r][c]) out.push(7 - r);
  return out;
}

// ---------- Part 3: what changes the pitch ----------

export const CHANGES = [
  { id: 'shorter', name: 'Make the tooth shorter', result: 'Higher', why: 'A shorter tooth is stiffer and swings faster. Half the length makes the pitch four times as high.' },
  { id: 'thicker', name: 'Make the tooth thicker', result: 'Higher', why: 'A thicker tooth is stiffer. Twice as thick makes the pitch twice as high.' },
  { id: 'weight', name: 'Add a drop of weight to the tip', result: 'Lower', why: 'More weight at the free end makes the tooth swing more slowly. Makers solder a little metal on to lower a note.' },
  { id: 'thinbase', name: 'Grind metal off near the fixed end', result: 'Lower', why: 'A thinner root makes the tooth springier, so it swings more slowly. Makers file the underside to lower a note.' },
];
