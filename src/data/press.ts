// Everything the "How the printing press worked" page says, in one place.
// A printer's workshop and four things to try: the steps from punch to page, type set in a line, hand copying against printing, and the numbers of the spread.
// The facts come from the sources. The speeds of a press and the size of a page are made up and marked as such.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'The same letter, again and again',
  paras: [
    'Before printing, every copy of a book was written out by hand. Copying a book took almost as long as writing it. Around 1450 in Mainz in Germany, Johannes Gutenberg put together several old ideas into a way to print books in numbers. The key was movable type: single metal letters that can be set into a page, printed, taken apart and used again.',
    'Four things to try. Follow a letter from a steel punch to a printed page. Set a line of type and count how many of each letter you need. Compare the time to copy a book by hand with the time to print it, with some made up speeds. And guess the numbers of the spread of printing. The speeds are toys and the page says which numbers are facts. Without a script each part shows one picture.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'steps',
    kicker: 'Bench one',
    title: 'From punch to page',
    paras: [
      'The usual account of how type was made has seven steps. A steel punch is cut with a letter. It is struck into a softer metal to make a matrix. Melted metal poured into a mould fitted with the matrix makes a piece of type. The pieces are set in a frame, inked, and pressed on paper.',
      'Press next to go through the steps. Some scholars think the earliest type was cast another way, in moulds of sand. That is debated, and the page shows the usual account.',
    ],
    tags: [{ label: 'Debated', text: 'Researchers at Princeton found small differences between letters in the 1455 Bible that did not fit neat mass production. They suggested an earlier method with moulds that were broken after each use. Other scholars still describe the punch and matrix method as Gutenberg’s.' }],
  },
  {
    id: 'type',
    kicker: 'Bench two',
    title: 'Set a line',
    paras: [
      'The letters in the frame stand backwards, so that the print reads the right way round. They also run from right to left along the line. A printer needs many copies of the same letter. In English the letter e is used far more than the others, so a printer’s case holds more of them.',
      'Type some words. The page shows the line as it stands in the frame, and as it prints, and counts how many pieces of type of each letter the line needs.',
    ],
  },
  {
    id: 'time',
    kicker: 'Bench three',
    title: 'By hand or by press',
    paras: [
      'A skilled copyist might write about seven pages a day. A typesetter could set about 1,000 letters in an hour. Setting the type costs time once. After that, each copy is quick to print. So for one copy the scribe wins, and for many copies the press wins by a long way.',
      'Slide the number of copies of a book of 100 pages. The seven pages and the 1,000 letters come from sources. The size of a page, the printing speed and the length of a working day are made up.',
    ],
  },
  {
    id: 'spread',
    kicker: 'Bench four',
    title: 'How far it went',
    paras: [
      'Printing spread fast. Books printed before 1501 are called incunabula, which means cradle books. The cut off date is only a convention. The numbers are large, and they are known only from the books that survive.',
      'Pick a number to guess, slide to your guess and check. The scale is multiplying, so each step is ten times as far.',
    ],
  },
];

export const takeaways = [
  'Movable type is single metal letters that can be set into a page, printed and taken apart to use again.',
  'The usual account is steel punch, matrix, mould, type, frame, ink and press. How the very first type was cast is debated.',
  'The letters in the frame stand backwards and run from right to left, so the print reads the right way round.',
  'Setting type takes time once, and then each copy is quick. So the press wins for many copies, and a scribe for one.',
  'By 1500 there were presses in 282 towns, and about 30,000 different editions from before 1501 are known.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. Gutenberg’s work in Mainz around 1450, movable metal type cast from an alloy of lead, tin and antimony, the punch, matrix and mould account, the press taken from the wine press, an oil based ink, the 42-line Bible of the 1450s, hand copying taking months, a copyist writing about seven pages a day, a typesetter setting about 1,000 letters an hour, presses in 282 towns by 1500, about 30,000 different editions and about 550,000 surviving copies from before 1501 each appeared in at least two places. Sources differ on the date of the 42-line Bible (1454 to 1456) and on how many copies were printed (the page gives none), and the casting method is debated, which the page says. The size of a page (1,800 letters), the printing speed (250 sheets an hour) and the working day (8 hours) are made up for the toy, and the page counts what its own toy gives.';

export const sources = [
  { label: 'Princeton: Gutenberg’s role reviewed', url: 'https://www.princeton.edu/news/2001/02/08/gutenbergs-role-reviewed', for: 'The punch and matrix account and the debate.' },
  { label: 'The Demo Room: the Gutenberg press', url: 'https://thedemoroom.substack.com/p/the-gutenberg-press', for: 'Type metal, the press and the ink.' },
  { label: 'Wikipedia: Johannes Gutenberg', url: 'https://en.wikipedia.org/wiki/Johannes_Gutenberg', for: 'Gutenberg and the 42-line Bible.' },
  { label: 'ASME: Gutenberg and mass production', url: 'https://contentstaging12.asme.org/getmedia/4e9d6576-020f-4e74-a00c-27e11a250f09/Gutenberg-and-Mass-Production.pdf', for: 'Making type in numbers.' },
  { label: 'History of Information: 282 cities by 1500', url: 'https://historyofinformation.com/detail.php?id=27', for: 'The spread of presses.' },
  { label: 'Wikipedia: incunable', url: 'https://en.wikipedia.org/wiki/Incunable', for: 'Editions and surviving copies.' },
  { label: 'McCune Collection: the impact of printing', url: 'https://www.mccunecollection.org/Incunabula Impact of Printing', for: 'Printing and the cost of books.' },
  { label: 'The Electronic Labyrinth: from handwriting to print', url: 'https://www2.iath.virginia.edu/elab/hfl0263.html', for: 'Copying by hand and by press.' },
];
