// Everything the "How files shrink" page says, in one place.
// A packing table with four things to try: runs, repeats, short codes, and what cannot shrink.
// The sizes come from small toy versions of each idea, counted in bits. Real formats mix these ideas and add more.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Packing a suitcase',
  paras: [
    'A file is a long row of bits, which are zeros and ones. To shrink it without losing anything, you find a way to write the same row in fewer bits, so that the original can be built back exactly. This is lossless compression, and it is what a zip file does.',
    'Three ideas do most of the work. Write a long run of the same thing once, with a count. Write a piece that has appeared before as a pointer back to it. Give common letters short codes. Try each on a small example. Then see why nothing can shrink everything. The sizes are counted by small toy versions, not by a real zip program. Without a script each part shows one table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'runs',
    kicker: 'Pack one',
    title: 'Runs of the same',
    paras: [
      'A row of black and white dots can be written as a count of each run: 8 black, 8 white, and so on. A row with long runs gets short. Click the dots to change the row, or pick a row.',
      'In this toy a plain row costs 1 bit a dot, and the run version costs 1 bit for the first colour plus 6 bits for each run. Try the checker row. Counting runs makes it much longer than the plain row.',
    ],
  },
  {
    id: 'repeats',
    kicker: 'Pack two',
    title: 'Say it once, point back',
    paras: [
      'Text repeats itself. When a piece has appeared before, the compressor writes where it was and how long it is, instead of writing it again. Two numbers stand in for the whole piece. This idea is called LZ77, and it is one half of what a zip file does.',
      'Pick a text or type one. Letters in the output are kept as they are. A pointer is shown as how far back to go and how many letters to copy. A letter costs 9 bits in this toy and a pointer costs 13.',
    ],
  },
  {
    id: 'codes',
    kicker: 'Pack three',
    title: 'Short codes for common letters',
    paras: [
      'A plain letter takes 8 bits. But some letters are far more common than others. Give the common ones short codes and the rare ones long codes, and the text gets shorter. David Huffman found the best way to do this in 1952. The two rarest letters are joined first, and joined again and again until one tree is left.',
      'The codes are made so that no code is the start of another one, so a row of bits can be read without gaps. Type a text and see the table. The table must be stored too, so a tiny text does not shrink.',
    ],
  },
  {
    id: 'limits',
    kicker: 'Pack four',
    title: 'What cannot shrink',
    paras: [
      'No method shrinks everything. There are only so many short messages. If you could shrink every message of 10 bits, you would need 1,024 different shorter messages, but there are only 1,023 of them. Two messages would have to share one, and then you could not tell them apart.',
      'So compressors work by finding patterns. Pick a text and compare the three ideas with the plain size. Text with no pattern, like random letters, does not shrink, and the table can even make it bigger.',
    ],
    tags: [{ label: 'Lossy is different', text: 'A JPEG photo or an MP3 song is smaller because it throws away detail that people are unlikely to notice. That cannot be undone. A zip file or a PNG image is lossless: the original comes back exactly.' }],
  },
];

export const takeaways = [
  'Lossless compression writes the same data in fewer bits, so that the original can be built back exactly.',
  'A run of the same thing can be written once with a count. This helps only when there are long runs.',
  'A piece of text that has appeared before can be replaced by a pointer back to it.',
  'Common letters can get short codes and rare letters long ones. The codes must not start with each other.',
  'Nothing shrinks every file. Data with no pattern does not shrink, and the sizes on this page come from toy versions.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. Huffman coding as a lossless method that gives common symbols shorter codes, the prefix property, the tree built by joining the two rarest symbols, David Huffman’s 1952 paper from his time at MIT, DEFLATE as a mix of LZ77 repeats and Huffman codes in ZIP and PNG, and the difference between lossless (ZIP, PNG) and lossy (JPEG) compression each appeared in at least two places. Sources differ on whether Huffman was a doctoral student working for an Sc.D. or a Ph.D., so the page only says MIT. The bit counts (1 bit and 6 bits for runs, 9 and 13 bits for repeats, 12 bits for each entry of the code table) and the example texts are made up for the toy, and the page counts what its own toy gives. Real programs differ.';

export const sources = [
  { label: 'Wikipedia: Huffman coding', url: 'https://en.wikipedia.org/wiki/Huffman_coding', for: 'The method, the tree and the 1952 paper.' },
  { label: 'Huffman: a method for minimum redundancy codes (1952)', url: 'https://www.csd.uoc.gr/~hy474/bibliography/Huffman.pdf', for: 'The original paper.' },
  { label: 'Moffat: Huffman coding (University of Melbourne)', url: 'https://people.eng.unimelb.edu.au/ammoffat/abstracts/compsurv19moffat.pdf', for: 'A survey of the method.' },
  { label: 'PlanetCalc: Huffman coding', url: 'https://planetcalc.com/2481/?thanks=1', for: 'The prefix property and the tree.' },
  { label: 'Essential books: Huffman coding', url: 'https://essential-books.onrender.com/essential/algorithms/huffman-coding-7956c785647f4a9e84beb0c435b63abf.html', for: 'Building the codes.' },
  { label: 'DEV: lossless and lossy compression', url: 'https://dev.to/uglypeardata/lossless-vs-lossy-compression-the-core-difference-explained-40dg', for: 'DEFLATE and the two kinds of compression.' },
  { label: 'GIS Geography: lossless and lossy compression', url: 'https://gisgeography.com/lossless-compression-vs-lossy-compression/', for: 'ZIP and PNG against JPEG.' },
  { label: 'University of Utah: compression (slides)', url: 'https://www.math.utah.edu/~gustafso/s2018/2270/projects-2017/bradyJacobsonSamuelTeare/GroupProjectCompression.pdf', for: 'Repeats and sliding windows.' },
];
