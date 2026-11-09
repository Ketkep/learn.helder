// Everything the "How braille turns dots into letters" page says, in one place.
// A book with three spreads: raise the dots of one cell and see what it means, see how the alphabet is built in three rows, and write your
// own text in dots. The letters are English braille grade 1. Short forms for common words are not shown. The history comes from the sources,
// which differ a little on Louis Braille's age.

export interface Spread {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Six places, sixty-four patterns',
  paras: [
    'Braille is a way to read with your fingertips. Letters are made of small raised dots on paper. The dots are grouped in cells. A cell has six places, in two columns of three. Each place is either raised or flat.',
    'Three spreads in this book. In the first, raise the dots of one cell and see what it means. In the second, see how the alphabet is built in three rows. In the third, write your own text in dots. Without a script each spread shows one picture or table.',
  ],
};

export const spreads: Spread[] = [
  {
    id: 'cell',
    kicker: 'First spread',
    title: 'One cell',
    paras: [
      'The places are numbered 1, 2, 3 down the left and 4, 5, 6 down the right. Press a place to raise or flatten that dot. The page says which letter, sign or space you made.',
      'Each of the six places has two states, so the number of patterns is two times itself six times: 64. One of them has no raised dots at all. It is the space between words. That leaves 63 patterns with at least one dot.',
      'The cell is small on purpose. A fingertip can feel one whole cell with one touch. The code that Louis Braille cut down from had twelve dots in a cell, and that is too many for one touch.',
    ],
    tags: [{ label: 'Try this', text: 'Raise only dot 1, then dots 1 and 2, then dots 1 and 4. You have made A, B and C.' }],
  },
  {
    id: 'rows',
    kicker: 'Second spread',
    title: 'The alphabet in three rows',
    paras: [
      'The letters are not in a random order. The first ten, A to J, use only the top four dots: 1, 2, 4 and 5. The next ten, K to T, are the same ten shapes with dot 3 added. The last letters, U, V, X, Y and Z, are the first five shapes with dots 3 and 6 added.',
      'So you only learn ten shapes, and two small rules. W is the odd one out. French, the language Braille wrote in, had no W in its alphabet at the time, so W was added afterwards. It is the shape of J with dot 6 added.',
      'Choose a row. The dots that are new in that row are marked.',
    ],
  },
  {
    id: 'write',
    kicker: 'Third spread',
    title: 'Write in dots',
    paras: [
      'Type some letters and numbers. The page shows each cell. A capital letter has a capital sign in front of it, which is dot 6 alone. A number has a number sign in front of it, which is dots 3, 4, 5 and 6, and then the numbers 1 to 9 and 0 are written with the letters A to J.',
      'This page shows only letters, numbers and spaces. Real braille also has signs for punctuation, and many short forms for common words, so that a book takes up less room. Those are not shown here.',
      'The code you see is the one for English. Other languages use other patterns for some of the signs.',
    ],
  },
];

export const takeaways = [
  'A braille cell has six places, each raised or flat. That gives 64 patterns, or 63 if the empty cell is left out.',
  'Louis Braille, a blind French teenager, built the code from 1824. He began with a code of twelve dots that was made for soldiers and cut it down to six.',
  'The letters A to J use dots 1, 2, 4 and 5. K to T add dot 3. U, V, X, Y and Z add dots 3 and 6. W was added later.',
  'A capital sign (dot 6) comes before a capital letter. A number sign (dots 3, 4, 5, 6) comes before a number, and the numbers use the shapes of A to J.',
  'Braille was taught in the school in Paris in 1854, two years after Louis Braille died.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. The six place cell, the numbering of the dots, and the cut down from the twelve dot night writing of Charles Barbier each appeared in several places. The sources differ on the age at which Louis Braille began his changes to Barbier code, giving 15 in 1824 in most places and 11 in one, so the page says the code was built from 1824. The count of 63 patterns with at least one dot, or 64 with the empty cell, appeared in two forms and is also simply two to the power six, which was worked out here. The letter patterns, the rule that K to T add dot 3 and that U, V, X, Y and Z add dots 3 and 6, the reason that W is out of order, the capital sign of dot 6 and the number sign of dots 3 to 6 appeared in the search results of several braille guides. The adoption in 1854 at the school in Paris, two years after the death of Louis Braille, appeared in several places. The claim that a fingertip can feel one whole cell with one touch appeared in search results. Other facts such as the size of a cell and signs for punctuation are not on this page because they were not confirmed. Nothing here is advice.';

export const sources = [
  { label: 'Wikipedia: Braille', url: 'https://en.wikipedia.org/wiki/Braille', for: 'The cell and the letters.' },
  { label: 'Encyclopaedia Britannica: Braille', url: 'https://www.britannica.com/print/article/77257', for: 'The history and the 63 characters.' },
  { label: 'Wikipedia: 1829 braille', url: 'https://en.wikipedia.org/wiki/1829_braille', for: 'The first form of the code.' },
  { label: 'Braille Authority of North America: Braille basics', url: 'https://www.brailleauthority.org/alphabet/alphabet.pdf', for: 'The letters and why W is out of order.' },
  { label: 'Library of Congress: about braille', url: 'https://www.loc.gov/nls/services-and-resources/informational-publications/about-braille/', for: 'How the rows are built.' },
  { label: 'American Foundation for the Blind: what is braille', url: 'https://www.afb.org/node/16296', for: 'The code and its history.' },
  { label: 'New World Encyclopedia: Braille', url: 'https://www.newworldencyclopedia.org/entry/Braille', for: 'The life of Louis Braille.' },
  { label: 'Paths to Literacy: Braille trail activity book', url: 'https://www.pathstoliteracy.org/wp-content/uploads/2022/06/Braille-Trail-Activity-Book.pdf', for: 'The number sign and the capital sign.' },
  { label: 'Wikipedia: international uniformity of braille alphabets', url: 'https://en.wikipedia.org/wiki/International_uniformity_of_braille_alphabets', for: 'Other languages use other patterns.' },
  { label: 'Duxbury Systems: Braille 1829 introduction', url: 'https://duxburysystems.org/downloads/library/history/lb_1829/nfb_intro.htm', for: 'Braille\'s own publication of 1829.' },
  { label: 'History of Information: the braille system', url: 'https://historyofinformation.com/detail.php?id=457', for: 'The dates.' },
];
