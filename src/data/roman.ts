// Everything the "How Roman numerals work" page says, in one place.
// A wall of carved stone with four things to try: convert, build a numeral, how long a numeral gets, and adding the old way.
// The rules and the sums are computed on the page. The sources give the history.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Seven letters and no zero',
  paras: [
    'Roman numerals write numbers with seven letters: I for 1, V for 5, X for 10, L for 50, C for 100, D for 500 and M for 1,000. There is no letter for zero. A numeral is read by adding the letters, except that a smaller letter in front of a bigger one is taken away. So VI is 6 but IV is 4.',
    'The system is old. Many think the signs began as notches cut in tally sticks: a single stroke for one, a bigger cut for five and another for ten. The system the Romans used was slightly changed in the Middle Ages into the one we use today. Four things to try. Convert numbers both ways. Build a numeral from tiles. See how long a numeral can get. And add two numerals the old way. All the sums are done by the page. Without a script each part shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'convert',
    kicker: 'First carving',
    title: 'Convert',
    paras: [
      'The usual rules are short. The letters I, X, C and M can be repeated up to three times in a row, and V, L and D are never repeated. Only six pairs with a smaller letter in front are used: IV, IX, XL, XC, CD and CM. With these rules the biggest number you can write is 3,999, which is MMMCMXCIX.',
      'Type a number from 1 to 3,999 or a numeral. The page converts it, and says if a numeral is not the standard way of writing its number.',
    ],
    tags: [{ label: 'On clocks', text: 'Many clock faces show 4 as IIII and not IV. Taking a letter away, as in IV, was rare in classical Rome and became usual later, and the clock keeps the older way.' }],
  },
  {
    id: 'build',
    kicker: 'Second carving',
    title: 'Build a numeral',
    paras: [
      'Add letters one at a time and watch the value. The page reads the row the way a reader would: a smaller letter before a bigger one is taken away. It also tells you the standard way of writing the same number, which is often shorter.',
      'Try IIII, then VIIII, then IC. They are all understood, but the standard forms are IV, IX and XCIX.',
    ],
  },
  {
    id: 'length',
    kicker: 'Third carving',
    title: 'How long can it get',
    paras: [
      'Numerals do not grow smoothly. Small numbers with plain letters like 8 (VIII) are long for their size, and numbers like 4 (IV) and 9 (IX) are short. The page tries every number from 1 to 3,999 and counts the letters. The longest takes 15 letters.',
      'Slide to a number and see its numeral and its length. The bars show how many numbers have each length.',
    ],
  },
  {
    id: 'add',
    kicker: 'Fourth carving',
    title: 'Adding the old way',
    paras: [
      'Roman numerals have no place value, so the column sums we learn at school do not work. Historians think that the Romans did their sums on a counting board or abacus, and used the numerals only to write the answer. Adding is still easy with letters. Write all the letters of both numbers together, sort them, and trade five of a kind for the next letter up. Multiplying needs much more care.',
      'Pick two numbers. The page shows each step of the addition. In Europe, the numerals we use now, with a zero, were brought in from 1202 by Fibonacci in his book Liber Abaci and took until about the 15th century to take over from Roman numerals.',
    ],
  },
];

export const takeaways = [
  'Roman numerals use seven letters: I, V, X, L, C, D and M, for 1, 5, 10, 50, 100, 500 and 1,000. There is no zero.',
  'A smaller letter in front of a bigger one is taken away, so IV is 4. Only IV, IX, XL, XC, CD and CM are used this way.',
  'With the usual rules the biggest number is 3,999, MMMCMXCIX. The longest numeral is 3,888, with 15 letters.',
  'Adding is easy by joining the letters and trading five of a kind for the next letter up. Without place value, long multiplication is hard.',
  'Fibonacci brought the modern numerals with a zero to Europe in 1202, and they replaced Roman numerals in daily use by about the 15th century.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. The seven letters and their values, repetition of I, X, C and M up to three times, no repeating of V, L and D, the six subtractive pairs, the limit of 3,999 and MMMCMXCIX as the biggest, the origin from tally sticks with the rival view that I, V and X copy hand gestures, the clock faces with IIII, the Romans calculating on a counting board or abacus and writing only the answer, and Fibonacci’s Liber Abaci of 1202 bringing the numerals with a zero to Europe each appeared in at least two places. Sources differ on when the subtractive forms became usual, and none explained why the clock has IIII, so the page only says that the clock keeps the older way. The date of about the 15th century for the full replacement is given by one source. The overline for thousands is not covered on the page, because the sources checked did not confirm its rule. Reports that Bede used a letter for zero around 725 were not confirmed by the search results and are left out. The conversions, the lengths and the sums are computed on the page.';

export const sources = [
  { label: 'Steve Morse: Roman numerals explained', url: 'https://www.stevemorse.org/hebrew/romannumerals.html', for: 'The rules and the letters.' },
  { label: 'Boxentriq: Roman numerals', url: 'https://www.boxentriq.com/math/roman-numerals', for: 'Subtractive pairs and the limit.' },
  { label: 'Wikipedia: Etruscan numerals', url: 'https://en.wikipedia.org/wiki/Etruscan_numerals', for: 'The older numerals and the tally stick theory.' },
  { label: 'Wikipedia: Roman numerals', url: 'https://solarspell-dls.sfis.asu.edu/mea/wikipedia/wp/r/Roman_numerals.htm', for: 'The history of the system.' },
  { label: 'Mathnasium: the history of Roman numerals', url: 'https://www.mathnasium.com/math-centers/castlehills/news/history-roman-numerals', for: 'A short history.' },
  { label: 'PIMS: how did the Romans calculate', url: 'https://pims.math.ca/~hoek/teanum/Rom', for: 'Counting boards.' },
  { label: 'CACM: how did the Romans calculate', url: 'https://cacm.acm.org/blogcacm/how-did-the-romans-calculate', for: 'The abacus and the record of the answer.' },
  { label: 'The Math Doctors: arithmetic with Roman numerals', url: 'https://www.themathdoctors.org/?p=11570', for: 'Adding and multiplying.' },
  { label: 'FactMyth: Fibonacci and the modern numerals', url: 'https://factmyth.com/factoids/fibonacci-introduced-the-modern-numeral-system-to-europe/', for: 'Liber Abaci of 1202.' },
];
