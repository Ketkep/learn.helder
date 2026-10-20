// Maths and drawings for the printing press page: the steps from punch to page, type set in a line, hand copying against printing, and the numbers of the spread.
// The drawings are made here, so the same strings are used when the page is built and in the browser.

const f1 = (n: number) => Math.round(n * 10) / 10;

export interface Step {
  title: string;
  text: string;
}

export const steps: Step[] = [
  { title: 'A steel punch', text: 'A letter is cut, backwards, on the end of a steel bar. This is the punch. One punch is needed for each different letter.' },
  { title: 'A matrix', text: 'The punch is struck into a block of softer metal, such as copper. That leaves a hollow in the shape of the letter, called the matrix.' },
  { title: 'Cast the type', text: 'The matrix is fitted in a mould and melted metal is poured in. The metal is an alloy of lead, tin and antimony, which melts at a fairly low temperature and wears well. Out comes a piece of type, and the same mould can make as many identical letters as are needed.' },
  { title: 'Set the type', text: 'The printer picks letters out of a case and sets them in a frame, line after line, to make a page. The letters stand backwards, so that the print will read the right way round.' },
  { title: 'Ink the type', text: 'The face of the type is covered with ink. The ink has to be oil based, because ink made with water does not stick to metal.' },
  { title: 'Press', text: 'A sheet of paper is laid on the type and pressed down. Gutenberg took the idea from the wine press, which gives an even push over a large surface.' },
  { title: 'Lift the page', text: 'The printed sheet is lifted off and hung to dry. The same frame of type prints the same page again, as many times as are wanted. Then the type is taken apart and used for the next page.' },
];

/** A picture for each step. */
export function stepSvg(i: number): string {
  const mirror = (txt: string, x: number, y: number, size = 40) => `<g transform="translate(${2 * x} 0) scale(-1 1)"><text class="glyph" x="${x}" y="${y}" font-size="${size}" text-anchor="middle">${txt}</text></g>`;
  switch (i) {
    case 0:
      return `<rect class="steel" x="130" y="20" width="40" height="70"/><rect class="steel dark" x="130" y="88" width="40" height="22"/>${mirror('R', 150, 108, 24)}<text class="lab" x="150" y="136" text-anchor="middle">punch</text>`;
    case 1:
      return `<rect class="copper" x="90" y="70" width="120" height="44" rx="4"/><path class="hollow" d="M135 76h30v32h-30z"/>${mirror('R', 150, 104, 24)}<text class="lab" x="150" y="136" text-anchor="middle">matrix</text>`;
    case 2:
      return `<rect class="mould" x="100" y="36" width="100" height="70" rx="4"/><path class="melt" d="M140 14h20v26h-20z"/><rect class="type" x="138" y="62" width="24" height="44"/><text class="lab" x="150" y="136" text-anchor="middle">mould and melted metal</text>`;
    case 3:
      return `<rect class="frame" x="40" y="46" width="220" height="52" rx="4"/>${['P', 'R', 'E', 'S', 'S'].reverse().map((c, k) => `<rect class="type" x="${58 + k * 40}" y="56" width="32" height="32"/>${mirror(c, 74 + k * 40, 82, 26)}`).join('')}<text class="lab" x="150" y="126" text-anchor="middle">set backwards in a frame</text>`;
    case 4:
      return `<rect class="frame" x="40" y="60" width="220" height="40" rx="4"/><rect class="inkblock" x="52" y="68" width="196" height="24" rx="3"/><circle class="dabber" cx="150" cy="40" r="18"/><text class="lab" x="150" y="126" text-anchor="middle">oil based ink</text>`;
    case 5:
      return `<rect class="steel" x="130" y="12" width="40" height="14"/><rect class="steel" x="144" y="26" width="12" height="40"/><rect class="plate" x="60" y="66" width="180" height="12"/><rect class="paper" x="70" y="78" width="160" height="8"/><rect class="frame" x="60" y="86" width="180" height="26" rx="3"/><text class="lab" x="150" y="134" text-anchor="middle">pressed flat</text>`;
    default:
      return `<rect class="paper big" x="90" y="16" width="120" height="100" rx="3"/><text class="glyph" x="150" y="74" font-size="30" text-anchor="middle">PRESS</text><text class="lab" x="150" y="136" text-anchor="middle">reads the right way round</text>`;
  }
}

export function letterCounts(text: string): { ch: string; n: number }[] {
  const m = new Map<string, number>();
  for (const c of text.toLowerCase()) if (/[a-z]/.test(c)) m.set(c, (m.get(c) || 0) + 1);
  return [...m.entries()].map(([ch, n]) => ({ ch, n })).sort((a, b) => b.n - a.n || (a.ch < b.ch ? -1 : 1));
}

export const sample = 'a printer needs many pieces of the same letter to set a page';

/** The text, backwards, as the type stands in the frame, and forwards, as it prints. */
export function lineSvg(text: string): string {
  const t = text.slice(0, 24);
  const step = Math.min(24, 270 / Math.max(1, t.length));
  // In the frame the letters run from right to left as well
  const framed = [...t].reverse().join('');
  const rev = (y: number) =>
    [...framed]
      .map((c, k) => {
        const x = 14 + k * step + step / 2;
        const g = c === ' ' ? '' : `<g transform="translate(${2 * x} 0) scale(-1 1)"><text class="glyph" x="${x}" y="${y + step * 0.75}" font-size="${f1(step * 0.9)}" text-anchor="middle">${c}</text></g>`;
        return `<rect class="type" x="${f1(14 + k * step)}" y="${y}" width="${f1(step - 1)}" height="${f1(step)}"/>${g}`;
      })
      .join('');
  return `<text class="lab" x="14" y="18">In the frame</text>${rev(24)}<text class="lab" x="14" y="${f1(24 + step + 22)}">On the paper</text>${[...t]
    .map((c, k) => `<text class="glyph print" x="${f1(14 + k * step + step / 2)}" y="${f1(24 + step + 22 + step * 0.95)}" font-size="${f1(step * 0.9)}" text-anchor="middle">${c}</text>`)
    .join('')}`;
}

export const HAND_PAGES_PER_DAY = 7; // one source for a skilled copyist
export const LETTERS_PER_HOUR = 1000; // one source for a typesetter
export const LETTERS_PER_PAGE = 1800; // made up
export const SHEETS_PER_HOUR = 250; // made up
export const HOURS_PER_DAY = 8; // made up

export function handDays(pages: number, copies: number): number {
  return (pages * copies) / HAND_PAGES_PER_DAY;
}

export function pressDays(pages: number, copies: number): number {
  const set = (pages * LETTERS_PER_PAGE) / LETTERS_PER_HOUR / HOURS_PER_DAY;
  const print = (pages * copies) / SHEETS_PER_HOUR / HOURS_PER_DAY;
  return set + print;
}

export function fmtDays(d: number): string {
  if (d < 1) return `${Math.max(1, Math.round(d * HOURS_PER_DAY))} hours`;
  if (d < 400) return `${d < 10 ? d.toFixed(1) : Math.round(d)} days`;
  return `${(d / 365).toFixed(1)} years`;
}

export const numbers = [
  { id: 'cities', name: 'Towns with a press by 1500', real: 282, text: 'By 1500 presses were set up in 282 towns, in about 20 modern countries.' },
  { id: 'editions', name: 'Different editions printed before 1501', real: 30000, text: 'About 30,000 different editions printed before 1501 are known, and at least 20,000 more are thought to be lost.' },
  { id: 'copies', name: 'Copies from before 1501 that survive', real: 550000, text: 'About 550,000 copies from before 1501 survive, of about 27,500 works.' },
];

export function guessFromSlider(v: number): number {
  return Math.round(10 ** (1 + (v / 100) * 5.2));
}

export function timesOff(guess: number, real: number): number {
  return guess > real ? guess / real : real / guess;
}
