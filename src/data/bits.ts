// Everything the "How computers count" page says, in one place.
// The page has a row of eight switches fixed at the bottom of the screen. Four panels above it read the same
// eight switches in four ways.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Eight switches',
  paras: [
    'Inside a computer everything is stored as switches that are either on or off. One switch is called a bit. Eight switches together are called a byte. That is all a computer has: a very large number of switches. Numbers, letters, pictures and sound are all patterns of switches.',
    'The eight switches are fixed at the bottom of the screen. Flip them and read them in four ways: as a number, as a letter, as a counter and as a colour. Without a script, each panel shows one example.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'number',
    kicker: 'Reading one',
    title: 'As a number',
    paras: [
      'Each switch is worth double the one to its right: 1, 2, 4, 8, 16, 32, 64 and 128. To read the number, add up the value of every switch that is on. This way of counting with only two digits is called binary.',
      'Eight switches can make 256 different patterns, which are the numbers from 0 to 255. Flip the switches, or type a number, and watch the sum.',
    ],
    tags: [
      { label: 'Old idea', text: 'The philosopher Gottfried Leibniz wrote about counting with only 0 and 1 in 1703. The word “bit”, short for binary digit, was first printed in 1948 by Claude Shannon, who credited John Tukey with it.' },
    ],
  },
  {
    id: 'letter',
    kicker: 'Reading two',
    title: 'As a letter',
    paras: [
      'A computer has no letters, only numbers. So people agreed on a table that gives each letter a number. The table most used for English is called ASCII. In it a capital A is 65, B is 66, and so on up to Z, which is 90.',
      'The same eight switches that made a number now make a letter. Set 65 and you get A. Flip one switch and you get a different letter. The table only has 128 places, so the top switch is always off.',
    ],
    tags: [
      { label: 'One switch apart', text: 'A capital A is 65 (01000001) and a small a is 97 (01100001). They differ by one switch, the one worth 32. Flip it to change the case of any letter.' },
    ],
  },
  {
    id: 'count',
    kicker: 'Reading three',
    title: 'As a counter',
    paras: [
      'Add 1 to the switches and the pattern changes like the wheels of a car’s trip counter. When a switch is already on, adding turns it off and carries the 1 to the next switch on the left. Sometimes the carry runs all the way along.',
      'Eight switches stop at 255. Add 1 again and every switch turns off: the byte wraps round to 0, and the last carry is lost. Doubling a number just shifts every switch one place to the left.',
    ],
    tags: [
      { label: 'Why it matters', text: 'Computers use a fixed number of switches for each number, so numbers can wrap round. This is why a counter in an old game could suddenly go from its highest score back to zero.' },
    ],
  },
  {
    id: 'colour',
    kicker: 'Reading four',
    title: 'As a colour',
    paras: [
      'A colour on a screen is a mix of red, green and blue light. Each of the three gets one byte, so each can be anything from 0 (none) to 255 (all). Three bytes make 24 switches, and 256 times 256 times 256 is 16,777,216 colours.',
      'Your eight switches set the red. Use the two sliders for the green and the blue. The code under the colour is the same three bytes written in a short form that web pages use.',
    ],
  },
];

export const takeaways = [
  'A computer stores everything as switches that are on or off. One switch is a bit and eight switches are a byte.',
  'In binary each switch is worth double the one to its right (1, 2, 4, 8, 16, 32, 64, 128). Eight switches make 256 patterns, the numbers from 0 to 255.',
  'A letter is a number from an agreed table. In ASCII a capital A is 65 and a small a is 97, which is one switch apart.',
  'Adding 1 turns switches over and carries to the left. A byte wraps from 255 round to 0.',
  'A colour on a screen is three bytes, one each for red, green and blue: 16,777,216 colours.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The place values 128 to 1, the 256 patterns of a byte, A as 65 and a as 97 (one switch apart), the 16,777,216 colours of 24-bit colour, and the dates for Leibniz (1703) and for the word bit (a 1947 memo by Tukey, printed by Shannon in 1948) each appeared in at least two places. The sources disagree about exactly when Tukey first used the word, so only Shannon’s 1948 print is given. The panels are simple models made for this page.';

export const sources = [
  { label: 'Cognito: binary numbers (GCSE computer science)', url: 'https://cognito.org/courses/gcse/computer-science/ocr/notes/akZ5Ykx5c0U/2.4-binary-numbers', for: 'Place values and converting binary to decimal.' },
  { label: 'Oxford Revise: computer science answers, chapter 1 (PDF)', url: 'https://www.oxfordrevise.com/wp-content/uploads/2023/09/OCRB-Computer-Science-Answers_Chapter-1.pdf', for: 'Bits, bytes and binary numbers.' },
  { label: 'Wikipedia: bit', url: 'https://en.wikipedia.org/wiki/Bit', for: 'The bit, and Tukey and Shannon.' },
  { label: 'Word Origins: bit and byte', url: 'https://www.wordorigins.org/big-list-entries/bit-byte', for: 'Where the words bit and byte come from.' },
  { label: 'History of Information: Leibniz and binary arithmetic', url: 'https://www.historyofinformation.com/detail.php?id=395', for: 'Leibniz on counting with 0 and 1, 1703.' },
  { label: 'Computing History: Leibniz invents the binary system', url: 'https://computinghistory.org.uk/det/5913/Gottfried%20Wilhelm%20Leibniz%20invents%20the%20binary%20system', for: 'The same story, from a museum.' },
  { label: 'Dave Allen: 7-bit ASCII (course slides)', url: 'https://teaching.idallen.com/cst8110/97w/slides/tsld031.htm', for: 'Numbers for characters in ASCII.' },
  { label: 'Unicodefyi: ASCII', url: 'https://unicodefyi.com/glossary/ascii/', for: 'ASCII has 128 code points. A is 65 and a is 97.' },
  { label: 'Harvard CSCI E-12: colour depth', url: 'https://cscie12.dce.harvard.edu/lecture_notes/2024-fall/20241016/slide18.html', for: '24-bit colour: 256 levels for each of red, green and blue.' },
];
