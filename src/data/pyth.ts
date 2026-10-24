// Everything the "Why Pythagoras' theorem works" page says, in one place.
// A patio of four paving slabs, and four things to try: squares on the sides, moving four triangles, whole number triples, and checking a corner.
// Every number is computed on the page. The sources give the history.

export interface Panel {
  id: string;
  num: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'The square on the long side',
  paras: [
    'Take a triangle with one square corner. Draw a square on each of its three sides. The theorem says the two smaller squares together have exactly the same area as the biggest one. If the short sides are a and b and the long side is c, then a × a + b × b = c × c.',
    'Four slabs to try. Draw the three squares and watch the areas. Move four triangles about and see why the areas must match. Hunt for triangles whose sides are whole numbers. And check whether a corner is square, the way a builder does. Every number is worked out by the page. Without a script each slab shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'squares',
    num: '1',
    kicker: 'Slab one',
    title: 'Three squares',
    paras: [
      'Pick the two short sides of a right triangle. The page draws a square on each side and writes the area in it. The square on the long side, the hypotenuse, always has an area equal to the other two added. When the long side comes out as a whole number, the three sides are called a Pythagorean triple.',
      'Slide the short sides. Notice that 3, 4 and 5 give a whole number, and most other pairs do not.',
    ],
  },
  {
    id: 'move',
    num: '2',
    kicker: 'Slab two',
    title: 'Move four triangles',
    paras: [
      'This is a classic way to see why it is true. Draw a big square with side a + b. Put four copies of the triangle in its corners so that a tilted square is left in the middle. That square has side c, so its area is c × c. Now slide the same four triangles into two rectangles. What is left is a square on a and a square on b. The triangles did not change, so the space left over did not change either.',
      'The page uses the 3, 4, 5 triangle. Slide from the first picture to the second.',
    ],
    tags: [{ label: 'Many proofs', text: 'There are hundreds of proofs. The collector Elisha Loomis put about 370 in a book, and sources give slightly different counts. James Garfield, later a US president, found one in 1876 using a trapezoid, when he was a congressman.' }],
  },
  {
    id: 'triples',
    num: '3',
    kicker: 'Slab three',
    title: 'Whole number triangles',
    paras: [
      'A clay tablet from Babylon, called Plimpton 322 and written around 1800 BC, lists sets of whole numbers like these, over a thousand years before Pythagoras. How the Babylonians used them is argued. Euclid’s formula makes triples from two numbers m and n, with m larger: the sides are m × m minus n × n, 2 × m × n, and m × m plus n × n.',
      'Slide m and n and the page works out the triangle. Below the sliders the page lists every triple with a long side up to 100, found by trying every pair of short sides. A triple that is not a multiple of a smaller one is called primitive.',
    ],
  },
  {
    id: 'corner',
    num: '4',
    kicker: 'Slab four',
    title: 'Is the corner square?',
    paras: [
      'The theorem also works backwards. If the squares on two sides add up to exactly the square on the third, the corner between those two sides is a right angle. Builders have used this for a very long time. A rope with 12 equal spaces, knotted to make a triangle of 3, 4 and 5 spaces, gives a square corner. If the two smaller squares add up to more than the biggest, the corner is sharper than a right angle. If they add up to less, it is wider.',
      'Slide the three sides. The page sorts them, compares the squares and names the triangle.',
    ],
    tags: [{ label: 'Rope', text: 'It is often said that the ancient Egyptians used a knotted rope this way. The claim is popular but the sources checked here do not back it with a find, so treat it as a story.' }],
  },
];

export const takeaways = [
  'In a triangle with a square corner, the square on the long side has the same area as the two other squares together: a × a + b × b = c × c.',
  'Four triangles can be moved about inside a square of side a + b. What is left over is either one square on c or two squares on a and b, so the areas match.',
  'A set of three whole numbers that fit is a Pythagorean triple. 3, 4, 5 is the smallest. There are 52 triples with a long side up to 100, and 16 of them are primitive.',
  'Sets of such numbers were written down in Babylon about 1800 BC. The theorem carries the name of Pythagoras, but that is more than a thousand years earlier.',
  'The converse holds: if a × a + b × b = c × c, the corner opposite c is square. Larger sum means a sharper corner, smaller sum means a wider one.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The Babylonian tablet Plimpton 322 from about 1800 BC and its triples, Euclid’s formula with its conditions, Loomis’s book of proofs (sources give 367, 370 or 371), Garfield’s proof of 1876, the Chinese text Zhoubi Suanjing treating the 3, 4, 5 case and the name gougu theorem each appeared in at least two places. Sources differ on the date of the tablet (1900 to 1600 BC), on what the tablet was for, and on the count of Loomis’s proofs, which the page says. The Egyptian rope story is marked as popular and not backed by a find. The areas, the triples, the counts of 52 and 16 and the classification of the corners are all computed on the page.';

export const sources = [
  { label: 'Wikipedia: Pythagorean theorem', url: 'https://en.wikipedia.org/wiki/Pythagorean_theorem', for: 'The theorem, its history and its converse.' },
  { label: 'Wikipedia: Plimpton 322', url: 'https://en.wikipedia.org/wiki/Plimpton_322', for: 'The Babylonian tablet and the argument about it.' },
  { label: 'ISAW: Plimpton 322', url: 'https://isaw.nyu.edu/exhibitions/before-pythagoras/items/plimpton-322/', for: 'The tablet and its date.' },
  { label: 'arXiv: the Plimpton 322 tablet and Babylonian triples', url: 'https://arxiv.org/pdf/1004.0025', for: 'Generating triples.' },
  { label: 'Wikipedia: Garfield’s proof', url: 'https://en.wikipedia.org/wiki/Garfield%27s_proof_of_the_Pythagorean_theorem', for: 'The trapezoid proof of 1876.' },
  { label: 'Missouri S&T: the Pythagorean theorem', url: 'https://web.mst.edu/_disabled/lmhall/1-Pythagorean.pdf', for: 'Loomis’s proofs and a dissection proof.' },
  { label: 'Brilliant: Pythagorean triples', url: 'https://brilliant.org/wiki/pythagorean-triples/', for: 'Euclid’s formula.' },
  { label: 'ProofWiki: solutions of the Pythagorean equation', url: 'https://proofwiki.org/wiki/Solutions_of_Pythagorean_Equation/Primitive', for: 'Primitive triples and their conditions.' },
  { label: 'MAA: Zhoubi Suanjing', url: 'https://www.maa.org/book/export/html/116902', for: 'The Chinese gougu theorem.' },
];
