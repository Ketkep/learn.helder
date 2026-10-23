// Everything the "How the alphabet was born" page says, in one place.
// A museum cabinet with four drawers and four things to try: an ox head turning into an A, what the letter names meant, how many letters alphabets have, and the chain from hieroglyphs to English.
// The history and counts come from the sources. The turning letter is our own drawing, and the page says so.

export interface Panel {
  id: string;
  label: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Twenty six signs for every sound',
  paras: [
    'Most writing systems in the world began with hundreds of signs. The alphabet did something different: one sign for each sound. It was invented once, a long time ago, and almost every alphabet today comes from that first one. Our letter A began as a picture of an ox.',
    'Open four drawers. Turn an ox head into an A. Find what the old letter names meant. Count the letters of some alphabets. And follow the chain of alphabets from Egyptian pictures to English. The turning letter is our own drawing and not a copy of an ancient sign. Where scholars disagree, the page says so. Without a script each drawer shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'ox',
    label: 'Drawer one',
    title: 'Turn the ox',
    paras: [
      'The idea is called acrophony. Take a picture of a thing, and use it for the first sound of the thing’s name. A picture of a house, in a Semitic language bayt, stood for the sound b. A picture of an ox, aleph, stood for the first sound of that word. Over time the pictures were simplified until they were hardly pictures at all.',
      'Slide to turn the ox head upside down in four steps. The drawing is made for this page, and shows the idea and not the real signs.',
    ],
    tags: [{ label: 'Egypt or Canaan?', text: 'Scholars argue about where the first alphabet was made. Two short inscriptions at Wadi el-Hol in Egypt have been dated to about 1900 to 1800 BC. Most of the others come from Sinai, and some date them as late as 1550 BC.' }],
  },
  {
    id: 'names',
    label: 'Drawer two',
    title: 'What the names meant',
    paras: [
      'The letters had names, and the names were ordinary words. Aleph meant ox and beth meant house. The Greeks kept the names, though in Greek they meant nothing. The word alphabet comes from the first two, alpha and beta.',
      'Pick a letter to see what it meant, what the Greeks called it and which of our letters it became. Not all of the meanings are certain, and the page says which are less so.',
    ],
  },
  {
    id: 'count',
    label: 'Drawer three',
    title: 'How many letters',
    paras: [
      'Alphabets do not all have 26 letters. The number depends on how many sounds the language needs a sign for and on how people count, since some count signs that others call marks. Rotokas, in Papua New Guinea, has the smallest alphabet in use today, with 12 letters. Russian has 33.',
      'Pick an alphabet. The page shows the bar and a note. Counts differ between sources for some alphabets, so only well agreed ones are here.',
    ],
  },
  {
    id: 'chain',
    label: 'Drawer four',
    title: 'From hieroglyphs to English',
    paras: [
      'Each alphabet in the chain was a copy of the one before, changed to fit a new language. The Phoenicians had no vowel letters. The Greeks used some letters for vowels. The Etruscans passed the Greek alphabet to the Romans. Much later, English added three more letters to the Latin ones.',
      'Press next to step along the chain. Dates are about, and some are argued.',
    ],
  },
];

export const takeaways = [
  'An alphabet has one sign for each sound. It was made once, about 3,500 years ago or earlier, and most alphabets descend from it.',
  'The first signs were pictures, used for the first sound of their name. Aleph, an ox, became our A.',
  'The Phoenician alphabet had 22 consonants and was written right to left. The Greeks added vowels and the Romans took the alphabet from the Etruscans.',
  'The Latin alphabet had 23 letters. J, U and W were added in the Middle Ages to make the English 26.',
  'Alphabets differ in size, from 12 letters in Rotokas to 33 in Russian.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The origin from Egyptian hieroglyphs by the acrophonic principle, the Proto-Sinaitic inscriptions at Serabit el-Khadim and Wadi el-Hol and the argument between a date near 1850 BC and one near 1550 BC, the 22 consonant letters of Phoenician written right to left, aleph as ox and beth as house, the adoption by the Greeks around the 8th century BC with vowels added, the passing through the Etruscans to the Romans with 21 letters taken first, the 23 letters of Latin and the later J, U and W, and the counts of 12, 13, 22, 24, 28 and 33 letters each appeared in at least two places. Sources differ on the date of the Greek adoption, on the meaning of gimel (camel or throwing stick) and nun (fish or snake), on the number of Etruscan letters and on when J, U and W became separate letters. Counts for some alphabets, such as Khmer and Georgian, differ so much between sources that they are left out. The drawing of the ox head turning into an A is our own and is not an ancient sign. The page gives no date for the first Phoenician inscriptions, which the sources checked here did not give.';

export const sources = [
  { label: 'Wikipedia: Proto-Sinaitic script', url: 'https://en.wikipedia.org/wiki/Proto-Sinaitic_script', for: 'The first alphabet, its date and the argument about its origin.' },
  { label: 'Wikipedia: Wadi el-Hol inscriptions', url: 'https://en.wikipedia.org/wiki/Wadi_el-Hol', for: 'The two Egyptian inscriptions.' },
  { label: 'The Collector: the Proto-Sinaitic puzzle', url: 'https://www.thecollector.com/first-alphabet-proto-sinaitic/', for: 'Egypt or Canaan.' },
  { label: 'World History Encyclopedia: the Phoenician alphabet', url: 'https://www.worldhistory.org/article/17/the-phoenician-alphabet--language/', for: '22 letters, right to left.' },
  { label: 'Duolingo: history of the alphabet', url: 'https://blog.duolingo.com/history-of-the-alphabet', for: 'Letter names and their meanings.' },
  { label: 'Wikipedia: mem', url: 'https://en.wikipedia.org/wiki/Mem', for: 'The water sign.' },
  { label: 'Wikipedia: nun', url: 'https://en.wikipedia.org/wiki/Nun_(letter)', for: 'Fish or snake.' },
  { label: 'University of Denver: the Latin alphabet', url: 'https://mysite.du.edu/~etuttle/classics/latalph.htm', for: 'From Greek through Etruscan to Latin.' },
  { label: 'Wikipedia: Rotokas alphabet', url: 'https://en.wikipedia.org/wiki/Rotokas_alphabet', for: 'The smallest alphabet.' },
  { label: 'Berlitz: how alphabets vary', url: 'https://berlitz.com/en-ca/blog/you-may-not-believe-how-alphabets-vary', for: 'Letter counts of several alphabets.' },
];
