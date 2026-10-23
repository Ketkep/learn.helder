// Data and drawings for the alphabet page. The history and the counts come from the sources. The drawing of the letter A turning is our own, not a copy of an ancient sign.
// The same text is made at build time (Astro) and in the browser.

const f1 = (n: number) => n.toFixed(1);

// ---------- Drawer 1: turn the ox ----------

export interface Stage { name: string; text: string }

export const STAGES: Stage[] = [
  { name: 'Ox head, Proto-Sinaitic', text: 'Between about 1850 and 1550 BC, in Egypt and Sinai, a Semitic speaking people used Egyptian looking pictures for sounds. A picture of an ox head stood for the first sound of their word for ox.' },
  { name: 'Aleph, Phoenician', text: 'The Phoenician alphabet had 22 letters and only consonants. It was written from right to left. The first letter was called aleph, which meant ox. The picture had turned on its side and lost its detail.' },
  { name: 'Alpha, Greek', text: 'The Greeks took the alphabet over around the 8th century BC. They kept the names and the order, and used the aleph for a vowel, the sound a. Alpha means nothing in Greek.' },
  { name: 'A, Latin', text: 'The Romans got the alphabet from the Etruscans, who had it from the Greeks. The ox head ended up upside down, with the horns as the feet of the A.' },
];

export const stageOf = (t: number) => Math.min(3, Math.round(t * 3));

/** The ox head turning into an A: one drawing, turned through 180 degrees, with the horns fading out and the bar fading in. */
export function glyphSvg(t: number): string {
  const angle = 180 * t;
  const horns = Math.max(0, 1 - t * 2.2);
  const bar = Math.max(0, t * 2.2 - 1.2);
  return `<g transform="translate(150 70) scale(0.78) rotate(${f1(angle)}) translate(-150 -70)"><path class="stroke" d="M150,118 L116,24 M150,118 L184,24"/><path class="stroke horn" style="opacity:${f1(horns)}" d="M116,24 C100,24 98,8 108,2 M184,24 C200,24 202,8 192,2"/><path class="stroke bar" style="opacity:${f1(bar)}" d="M133,72 L167,72"/></g>`;
}

// ---------- Drawer 2: what the names meant ----------

export interface Letter { name: string; meaning: string; greek: string; latin: string; note: string }

export const LETTERS: Letter[] = [
  { name: 'aleph', meaning: 'ox', greek: 'alpha', latin: 'A', note: 'The best known of all.' },
  { name: 'beth', meaning: 'house', greek: 'beta', latin: 'B', note: 'The word alphabet comes from alpha and beta, the first two Greek letters.' },
  { name: 'gimel', meaning: 'camel', greek: 'gamma', latin: 'C and G', note: 'Not every scholar accepts camel. Some give throwing stick.' },
  { name: 'daleth', meaning: 'door', greek: 'delta', latin: 'D', note: 'Daleth is the fourth letter, as the Greek delta is.' },
  { name: 'mem', meaning: 'water', greek: 'mu', latin: 'M', note: 'It comes from the Egyptian sign for water, a wavy line.' },
  { name: 'nun', meaning: 'fish', greek: 'nu', latin: 'N', note: 'Less settled. The sign may come from a word for snake instead.' },
];

// ---------- Drawer 3: how many letters ----------

export const ALPHABETS: { name: string; letters: number; note: string }[] = [
  { name: 'Rotokas', letters: 12, note: 'The smallest alphabet in use today, in Papua New Guinea.' },
  { name: 'Hawaiian', letters: 13, note: 'Five vowels and eight consonants, one of them the okina.' },
  { name: 'Hebrew', letters: 22, note: 'The same number as Phoenician. No capitals.' },
  { name: 'Greek', letters: 24, note: 'Seven of them are vowels.' },
  { name: 'English', letters: 26, note: 'The Latin alphabet, with J, U and W added in the Middle Ages.' },
  { name: 'Arabic', letters: 28, note: 'Letters change shape in the word.' },
  { name: 'Russian', letters: 33, note: 'Twenty consonants, ten vowels and three other signs.' },
];

// ---------- Drawer 4: the chain ----------

export interface Step { name: string; when: string; letters: string; text: string }

export const STEPS: Step[] = [
  { name: 'Egyptian hieroglyphs', when: 'before 1850 BC', letters: 'hundreds of signs', text: 'The signs were pictures. Some stood for single sounds. This gave the idea to a Semitic speaking people.' },
  { name: 'Proto-Sinaitic', when: 'about 1850 to 1550 BC', letters: 'about 30 signs', text: 'A script of about 40 known inscriptions, most at Serabit el-Khadim in Sinai and two at Wadi el-Hol in Egypt. The date and the place of the origin are still argued. It is also the ancestor of the Ancient South Arabian script.' },
  { name: 'Phoenician', when: 'first thousand years BC', letters: '22 letters', text: 'Only consonants, written right to left. Traders took it round the Mediterranean.' },
  { name: 'Greek', when: 'about the 8th century BC', letters: '24 letters in the later alphabet', text: 'The Greeks used some letters for vowels, so every sound had a sign. Early Greek also ran right to left, and by about 500 BC the direction settled as left to right.' },
  { name: 'Etruscan', when: 'from the 8th century BC', letters: 'about 26 letters in the early form', text: 'The Etruscans, in Italy, adapted a Greek alphabet. The Romans took 21 of their letters at first.' },
  { name: 'Latin', when: 'from the 7th century BC', letters: '23 letters', text: 'The Romans added Y and Z from Greek and used 23 letters for Latin.' },
  { name: 'English', when: 'J, U and W added in the Middle Ages', letters: '26 letters', text: 'J split off from I, and U split off from V. W began as a doubled V. Printers made J a separate letter by the 16th and 17th centuries.' },
];
