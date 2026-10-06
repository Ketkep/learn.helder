// Everything the "Prime numbers" page says, in one place.
// The page is a cabinet of five drawers. Each drawer holds one idea and one tool.

export interface Drawer {
  id: string;
  kicker: string;
  title: string;
  /** One line on the closed drawer front. */
  teaser: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Contents',
  paras: [
    'This cabinet has five drawers. Each one holds a single idea about prime numbers and one thing to try. Pull the drawers open in any order.',
    'A prime number is a whole number bigger than 1 that can only be divided by 1 and by itself. 7 is prime. 8 is not, because 2 times 4 is 8.',
  ],
};

export const drawers: Drawer[] = [
  {
    id: 'sieve',
    kicker: 'Drawer one',
    title: 'Strike out',
    teaser: 'Find every prime below 100 by crossing out the rest.',
    paras: [
      'More than 2,000 years ago a Greek scholar called Eratosthenes described a way to find primes without dividing anything. Write the numbers down. Take the smallest one that is not crossed out and circle it. Cross out all of its multiples. Repeat.',
      'Click the smallest number that is not struck out. Four rounds are enough. You can stop at 7: the next prime is 11, and 11 times 11 is 121, which is already past 100. Any number below 100 that can be split has a factor of 2, 3, 5 or 7.',
    ],
    tags: [
      { label: 'What about 1?', text: '1 is not prime. If it were, 12 could be written as 2 × 2 × 3 and also as 1 × 2 × 2 × 3, and the next drawer would not work.' },
      { label: 'The count', text: 'There are 25 primes below 100.' },
    ],
  },
  {
    id: 'rect',
    kicker: 'Drawer two',
    title: 'Rectangles',
    teaser: 'Lay out dots in a rectangle and see which numbers only make one.',
    paras: [
      'Take 12 dots. You can lay them out as a rectangle in three ways: 1 by 12, 2 by 6 and 3 by 4. Take 13 dots and there is only one way: a single row.',
      'That is what prime means. A prime number of dots makes only the single row. Every other number above 1 makes at least two rectangles, and is called composite.',
      'Keep splitting the sides until nothing splits any more and you are left with primes: 12 is 2 × 2 × 3. Every whole number above 1 gets exactly one such list, apart from the order. This is why 1 does not count as a prime.',
    ],
    tags: [{ label: 'Building blocks', text: 'The rule that every whole number above 1 splits into primes in exactly one way is called the fundamental theorem of arithmetic.' }],
  },
  {
    id: 'euclid',
    kicker: 'Drawer three',
    title: 'No last prime',
    teaser: 'Build a number that your list of primes cannot hold.',
    paras: [
      'Do the primes ever stop? Euclid showed that they do not, in a proof that is more than 2,000 years old. Take any list of primes. Multiply them all together and add 1.',
      'Divide the new number by any prime on your list and you always get a remainder of 1, so none of them divides it. So the new number is a prime that is not on your list, or it splits into primes that are not on your list. Either way your list was missing something.',
      'Pick a list and see what turns up.',
    ],
    tags: [
      { label: 'Not always prime', text: 'The new number is not always prime itself. 2 × 3 × 5 × 7 × 11 × 13 + 1 is 30,031, which is 59 × 509. Neither 59 nor 509 is on the list, which is all the proof needs.' },
    ],
  },
  {
    id: 'density',
    kicker: 'Drawer four',
    title: 'Thinning out',
    teaser: 'Slide up the number line and watch the primes get rarer.',
    paras: [
      'There are 25 primes below 100, so about 1 number in 4 is prime. Below 1,000 there are 168 (about 1 in 6). Below a million there are 78,498 (about 1 in 13).',
      'Primes get rarer as you climb, but slowly, and they never stop. Near a number n, about 1 number in ln(n) is prime. Here ln is the natural logarithm, a key on most calculators. This is the prime number theorem, and it describes an average: the real primes do not follow a timetable.',
      'Slide up the number line. The window shows the 100 numbers that end at your number. Primes are lit.',
    ],
    tags: [{ label: 'The biggest known', text: 'The largest known prime has 41,024,320 digits. It is 2 multiplied by itself 136,279,841 times, minus 1. It was found on 12 October 2024 by the volunteer search GIMPS.' }],
  },
  {
    id: 'lock',
    kicker: 'Drawer five',
    title: 'Easy one way',
    teaser: 'Multiply two primes in a blink, then try to undo it.',
    paras: [
      'Multiplying two primes is quick, even when they are big. Going back is the hard part: given the answer, find the two primes. The plainest method is to try dividing by 2, then 3, then 5 and so on.',
      'Make a number below, then ask your browser to split it again. Watch how the number of tries grows.',
      'Each time the number gets 2 digits longer, the tries grow about 10 times. Some of the codes that protect data online rely on this gap. They use primes with hundreds of digits. A 2048-bit number of this kind (called RSA-2048) has 617 digits, and trying every divisor would take about 10 to the power 308 tries (a number with 309 digits). Faster methods exist, but this number has never been split.',
    ],
    tags: [{ label: 'A toy', text: 'This drawer shows the idea with small numbers and the plainest method. It is not how real systems are built and it is not security advice.' }],
  },
];

export const takeaways = [
  'A prime is a whole number above 1 that only divides by 1 and itself. 1 is not prime.',
  'Every whole number above 1 splits into primes in exactly one way, apart from the order.',
  'There is no last prime. Euclid’s trick builds a new one from any list.',
  'Primes thin out as numbers grow: near n, about 1 number in ln(n) is prime. This is an average, not a timetable.',
  'Multiplying primes is easy and splitting the product is hard. Codes that protect data online lean on that gap.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The counts of primes (25, 168, 1,229, 9,592, 78,498), the 30,031 example, the 41,024,320 digit prime and the 617 digits of RSA-2048 each appeared in at least two places. The tools are toys made for this page, and nothing on it is security advice.';

export const sources = [
  { label: 'The Prime Pages: how many primes are there?', url: 'https://t5k.org/howmany.html', for: 'The number of primes below 100, 1,000 and up to a million, and how they thin out.' },
  { label: 'The Prime Pages: sieve of Eratosthenes', url: 'https://t5k.org/glossary/xpage/SieveOfEratosthenes.html', for: 'Strike out the multiples of primes up to the square root.' },
  { label: 'The Prime Pages: prime number theorem', url: 'https://t5k.org/glossary/xpage/PrimeNumberThm.html', for: 'About 1 number in ln(n) is prime near n.' },
  { label: 'University of York: Euclid’s proof', url: 'https://www-users.york.ac.uk/~ss44/cyc/p/primeprf.htm', for: 'The proof, and the 30,031 = 59 × 509 example.' },
  { label: 'Encyclopedia.com: sieve of Eratosthenes', url: 'https://www.encyclopedia.com/science/encyclopedias-almanacs-transcripts-and-maps/sieve-eratosthenes-0', for: 'The history of the sieve and the square root rule.' },
  { label: 'GIMPS: M136279841', url: 'https://mersenne.org/primes/press/M136279841.html', for: 'The largest known prime, found in October 2024.' },
  { label: 'Smithsonian Magazine: the new largest prime', url: 'https://www.smithsonianmag.com/smart-news/amateur-mathematician-discovers-the-largest-known-prime-number-with-more-than-41-million-digits-180985321/', for: 'Its 41 million digits and who found it.' },
  { label: 'Wikipedia: RSA numbers', url: 'https://en.wikipedia.org/wiki/RSA_numbers', for: 'RSA-2048 has 617 digits and has not been factored.' },
  { label: 'Wikipedia: prime number theorem', url: 'https://en.wikipedia.org/wiki/Prime_number_theorem', for: 'The prime number theorem and the 1 in ln(n) rule.' },
  { label: 'arXiv: are there infinitely many primes?', url: 'https://arxiv.org/pdf/0710.2123', for: 'Different proofs that the primes never end.' },
];
