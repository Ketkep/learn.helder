// Words and checks for the punctuation page. The sentences are made up for the page, apart from the history, which comes from the sources.
// The same text is made at build time (Astro) and in the browser.

// ---------- Part 1: words run together ----------

export interface Puzzle {
  run: string; // the letters, as an ancient scribe would write them
  readings: string[];
}

export const PUZZLES: Puzzle[] = [
  { run: 'GODISNOWHERE', readings: ['GOD IS NOWHERE', 'GOD IS NOW HERE'] },
  { run: 'ITWASAVERYCOLDNIGHT', readings: ['IT WAS A VERY COLD NIGHT'] },
  { run: 'THEMONKSWROTEBYCANDLELIGHT', readings: ['THE MONKS WROTE BY CANDLELIGHT'] },
];

const tidy = (s: string) => s.toUpperCase().replace(/\s+/g, ' ').trim();
const letters = (s: string) => s.toUpperCase().replace(/[^A-Z]/g, '');

export type Verdict = { kind: 'letters' } | { kind: 'other'; spaces: number } | { kind: 'found'; index: number };

/** Does what was typed spell the same letters, and is it a reading the page knows? */
export function judge(p: Puzzle, typed: string): Verdict {
  if (letters(typed) !== p.run) return { kind: 'letters' };
  const t = tidy(typed);
  const i = p.readings.indexOf(t);
  if (i >= 0) return { kind: 'found', index: i };
  return { kind: 'other', spaces: t.split(' ').length - 1 };
}

// ---------- Part 2: a comma changes the meaning ----------

export interface CommaItem {
  words: string[];
  slots: number[]; // a comma may follow the word at each of these places
  ends: string;
  meanings: Record<string, string>; // key is 0 or 1 for each slot, in order
  more: string;
}

export const COMMAS: CommaItem[] = [
  {
    words: ['Let’s', 'eat', 'grandma'],
    slots: [1],
    ends: '.',
    meanings: { '0': 'Someone is about to eat grandma.', '1': 'Someone is telling grandma that it is time to eat.' },
    more: 'The comma marks where the speaker turns to talk to grandma.',
  },
  {
    words: ['I', 'dedicate', 'this', 'book', 'to', 'my', 'parents', 'Mia', 'and', 'Leo'],
    slots: [6, 7],
    ends: '.',
    meanings: {
      '00': 'My parents are Mia and Leo.',
      '10': 'The book is for my parents, and for Mia and Leo as well, or Mia and Leo are the names of my parents. It is not clear.',
      '01': 'This is an odd comma. It is not clear who the book is for.',
      '11': 'The book is for three: my parents, Mia and Leo.',
    },
    more: 'The last comma in a list is sometimes called the Oxford comma. Without it, a name after a group can read as the names of the group.',
  },
  {
    words: ['The', 'law', 'covers', 'packing', 'for', 'shipment', 'or', 'distribution', 'of', 'goods'],
    slots: [5],
    ends: '.',
    meanings: {
      '0': 'One activity: packing for shipment or for distribution.',
      '1': 'Two things: packing for shipment, or distribution itself.',
    },
    more: 'A real law in Maine listed activities in this way. Without a comma before “or distribution” a court found the sentence unclear in 2017, in a dispute about overtime pay for drivers.',
  },
];

/** The sentence with a comma after each chosen slot. `mask` has a 0 or 1 for each slot. */
export function sentence(item: CommaItem, mask: string): string {
  return item.words.map((w, i) => {
    const k = item.slots.indexOf(i);
    return k >= 0 && mask[k] === '1' ? `${w},` : w;
  }).join(' ') + item.ends;
}

export const meaningOf = (item: CommaItem, mask: string) => item.meanings[mask] ?? '';

// ---------- Part 3: a sentence through time ----------

export interface Stage {
  name: string;
  when: string;
  note: string;
  html: string;
}

export const STAGES: Stage[] = [
  {
    name: 'Letters run together',
    when: 'Ancient Greece and Rome',
    note: 'Late ancient writing has no spaces between words, no capitals and little or no punctuation. A reader had to work out the words.',
    html: 'ITWASCOLDSOTHEMONKSWROTEBYCANDLELIGHTWHOCOULDREADIT',
  },
  {
    name: 'Dots at three heights',
    when: 'Greek scholars, about the third century BC',
    note: 'Aristophanes of Byzantium is credited with dots placed high, in the middle and low after a stretch of writing. One source says the system was seldom used.',
    html: 'ITWASCOLD<span class="hi">·</span>SOTHEMONKSWROTEBYCANDLELIGHT<span class="mid">·</span>WHOCOULDREADIT<span class="low">·</span>',
  },
  {
    name: 'Spaces between words',
    when: 'Irish monks, from the seventh century',
    note: 'Scribes who did not speak Latin at home began to leave a space between words. It spread over the next centuries, and sources differ on when it became usual.',
    html: 'IT WAS COLD SO THE MONKS WROTE BY CANDLELIGHT WHO COULD READ IT',
  },
  {
    name: 'The marks we know',
    when: 'Printers, from the 1490s',
    note: 'Printers such as Aldus Manutius in Venice are credited with the modern comma, the semicolon and the full stop. Popular sources date the semicolon to 1494.',
    html: 'It was cold, so the monks wrote by candlelight. Who could read it?',
  },
];
