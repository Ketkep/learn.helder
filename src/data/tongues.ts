// Everything the "How languages are related" page says, in one place.
// A desk of word cards and four things to try: compare words, build a family tree, apply a sound shift, and guess loanwords.
// Comparing spelling is a toy for how alike languages are. The real facts come from the sources.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Why Dutch looks like English',
  paras: [
    'Some words look alike in different languages. Water is water in English and Dutch. Hand is hand in English, Dutch and German. This is not luck. Languages that come from the same older language keep a family likeness, the way cousins share a nose.',
    'Four things to try with word cards. Compare the same words in five languages. Build a family tree from the differences. Apply a sound change that turns Latin words into English ones. And guess English words that came from Dutch. Comparing spelling is a toy. Real linguists compare sounds and history. Without a script each part shows one table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'match',
    kicker: 'Card one',
    title: 'The same word five times',
    paras: [
      'Each card is one meaning with its word in English, Dutch, German, French and Spanish. The bars show how alike each word is to the English one, counted by how many letters you would have to change.',
      'Pick a word. Then look at the average over all twelve words. English, Dutch and German look much more alike than any of them look to French or Spanish.',
    ],
  },
  {
    id: 'tree',
    kicker: 'Card two',
    title: 'A family tree from differences',
    paras: [
      'Take the two languages that are least different and join them. Then compare that group with the others, using the average difference, and join the next closest. Keep going until one tree is left. This is a simple way to draw a tree from a table of differences.',
      'Press the button to make each join. The tree that comes out has the Germanic languages on one branch and the Romance languages on the other, which is also what linguists find.',
    ],
    tags: [{ label: 'Only a toy', text: 'This tree is made from spelling. Real trees are made from sound changes and history. By those, English is closest to Frisian, which is not on this card. Dutch and German are on other branches of the West Germanic family. The sources say that the tree is only a rough sketch.' }],
  },
  {
    id: 'shift',
    kicker: 'Card three',
    title: 'A sound that changed',
    paras: [
      'Long ago the sounds of the Germanic languages changed in a regular way. Latin kept the older sounds. So where Latin has p, English has f. Latin t is th in English and d in Dutch and German. Latin c, said as k, is h in English. This is called Grimm’s law, after Jacob Grimm.',
      'Pick a Latin word and apply the shift to its first sound. Then see the real words. The change only describes the first sound, and there are exceptions.',
    ],
  },
  {
    id: 'loans',
    kicker: 'Card four',
    title: 'Words that moved',
    paras: [
      'Languages also borrow words from each other. About 1 per cent of English words come from Dutch, which is on the order of 1,500 words. Many came through the sea, trade and art in the days of the Dutch Golden Age.',
      'Here is a Dutch word. Pick the English word that came from it. Spellings changed on the way: oe turned into oo, and aa turned into o.',
    ],
  },
];

export const takeaways = [
  'Languages from the same older language keep a family likeness. English, Dutch and German look more alike than any of them look to French or Spanish.',
  'A family tree can be drawn from a table of differences by joining the two closest groups again and again.',
  'Sound changes are regular. Where Latin has p, English has f, as in pater and father.',
  'Words also move between languages. About 1 per cent of English words, roughly 1,500, come from Dutch.',
  'Comparing spelling is a toy. Real linguists compare sounds and history, and this page is only a sketch.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. West Germanic as a group with English, Dutch and German in separate branches and English closest to Frisian, the regular sound changes of Grimm’s law with the examples pater and father, tres and three, and centum and hundred, and about 1 per cent of English words (about 1,500) coming from Dutch with the spellings koekje to cookie and baas to boss, each appeared in at least two places. The words for the cards are common basic words from general knowledge of the languages, and the similarity score, the tree made from it and the choice of twelve words are made up for the toy. No source gave similarity percentages, so the page counts what its own toy gives. The page says that spelling is not how real linguists measure how alike languages are.';

export const sources = [
  { label: 'Wikipedia: West Germanic languages', url: 'https://en.wikipedia.org/wiki/West_Germanic_languages', for: 'The three groups of West Germanic.' },
  { label: 'University of Groningen: Germanic language boundaries', url: 'https://www.let.rug.nl/gooskens/pdf/publ_boundaries_2004.pdf', for: 'The tree as a rough division.' },
  { label: 'University of Vermont: Grimm’s law examples', url: 'https://www.uvm.edu/~jbailly/courses/clas22/additional%20notes/grimm\'sLawNOTESEXAMPLES.html', for: 'Latin and English word pairs.' },
  { label: 'Dickinson College Commentaries: Grimm’s law', url: 'https://dcc.dickinson.edu/node/26550', for: 'The shift of the mutes.' },
  { label: 'Socratica: Grimm’s law', url: 'https://learn.socratica.com/en/topic/grimm\'s-law', for: 'The three shifts.' },
  { label: 'Wikipedia: English words of Dutch origin', url: 'https://en.wikipedia.org/wiki/List_of_English_words_of_Dutch_origin', for: 'The 1 per cent and the word list.' },
  { label: 'Polyglottist Language Academy: Dutch and English', url: 'https://www.polyglottistlanguageacademy.com/language-culture-travelling-blog/2025/10/13/how-the-dutch-language-influenced-english-and-vice-versa', for: 'Dutch loanwords and spelling changes.' },
  { label: 'Multilingual: much of your English is Dutch', url: 'https://multilingual.com/bet-you-didnt-know-that-much-of-your-english-is-actually-dutch/', for: 'About 1,500 borrowed words.' },
];
