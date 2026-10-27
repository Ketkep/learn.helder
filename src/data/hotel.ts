// Everything the "Hilbert's hotel" page says, in one place.
// A hotel with rooms numbered 1, 2, 3 and so on without end, as four floors with four things to try:
// one more guest, a bus with infinitely many seats, counting the fractions, and a list that always misses.
// The maths is computed on the page. The history comes from the sources.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A hotel with no last room',
  paras: [
    'Picture a hotel with a room for every counting number: room 1, room 2, room 3, and so on for ever. Tonight every room is full. A new guest arrives. Is there a room?',
    'There is, and finding it shows how infinity behaves. Four floors to try. Move everyone along to fit one more guest. Fit a whole bus with infinitely many seats. Count the fractions. Then see why one kind of infinity cannot be counted at all. Without a script each floor shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'shift',
    kicker: 'First floor',
    title: 'One more guest',
    paras: [
      'The hotel is full, but it has no last room. So the manager asks each guest to move one door along: the guest in room 1 goes to room 2, the guest in room 2 goes to room 3, and in general the guest in room n goes to room n plus 1. Nobody is left without a room, because there is always a next room. Room 1 is now empty.',
      'Slide the number of new guests. For k new guests, everyone moves k doors along and rooms 1 to k are free. For a finite hotel this trick fails, because the last guest would have nowhere to go. That is the difference.',
    ],
    tags: [
      { label: 'History', text: 'Hilbert is said to have told the story in a lecture in January 1924 that he did not publish. George Gamow made it well known in a book of 1947. A paper on the history of the story says so.' },
    ],
  },
  {
    id: 'bus',
    kicker: 'Second floor',
    title: 'A bus with infinitely many seats',
    paras: [
      'Now a bus arrives with a passenger for every counting number, seat 1, seat 2, seat 3 and on. Moving everyone one door along does not help. So the manager asks each guest to double their room number: the guest in room n moves to room 2n. Every guest still has a room, and now only the even rooms are taken. All the odd rooms are free.',
      'Passenger m on the bus takes room 2m minus 1, so seat 1 gets room 1, seat 2 gets room 3, seat 3 gets room 5. Everyone fits. Pick a step, and type a number to see where that guest or passenger ends up.',
    ],
    tags: [
      { label: 'Idea', text: 'The even numbers look like half of the counting numbers. But pairing n with 2n matches every counting number with exactly one even number. Galileo noticed the same about squares in 1638, and Dedekind later used this property to define what an infinite set is.' },
    ],
  },
  {
    id: 'fractions',
    kicker: 'Third floor',
    title: 'Counting the fractions',
    paras: [
      'Between any two fractions there is another one, so it seems there are far too many to count. But they can be lined up. Write the fractions p over q in a staircase, where p plus q is 2 in the first row, 3 in the next, and so on. Walk along the rows in order, and skip any fraction that is not in lowest terms, such as 2 over 4, because it is the same number as 1 over 2. Every positive fraction gets a place on the list, exactly once.',
      'Slide to walk the list, or ask for the place of a fraction. Counting this way, the fractions fit in the hotel as well. The same walk, with p and q read as a room and a floor, shows that infinitely many buses of infinitely many seats would fit too.',
    ],
    tags: [
      { label: 'History', text: 'Cantor showed that the fractions can be counted. His first proof that the real numbers cannot be counted dates from 1874, and he gave a second one in 1891.' },
    ],
  },
  {
    id: 'list',
    kicker: 'Fourth floor',
    title: 'A list that always misses',
    paras: [
      'Not every infinite collection fits in the hotel. Take all the endless strings of 0 and 1. Suppose someone writes them in a list, line 1, line 2, line 3, and claims it has them all. Make a new string like this: at place 1 write the opposite of line 1’s first digit, at place 2 the opposite of line 2’s second digit, and so on down the diagonal. The new string differs from line 1 at place 1, from line 2 at place 2, and from every line k at place k. So it is on no line. Any list misses something.',
      'This is Cantor’s diagonal argument. The picture shows only eight lines of eight digits, so it is a small copy of the idea. The real argument has endless lines and endless digits. Click a digit to flip it, or make a new list. The new string always escapes.',
    ],
    tags: [
      { label: 'Check', text: 'The endless strings of 0 and 1 stand for the real numbers between 0 and 1, which also cannot be listed. So there is more than one size of infinity.' },
    ],
  },
];

export const takeaways = [
  'A hotel with a room for every counting number can take one more guest: everyone moves one door along.',
  'It can take a bus with infinitely many seats too: everyone doubles their room number, and the odd rooms are free.',
  'The positive fractions can be listed one after another, so they can be counted as well.',
  'The endless strings of 0 and 1 cannot be listed. For any list, the diagonal gives a string that is missing from it.',
  'So some infinities are bigger than others. This is Cantor’s result, and the hotel is a way to feel the difference.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. The hotel with a room for each counting number, the shift by one door, the doubling to even rooms with odd rooms for the bus, Hilbert telling it in a lecture of January 1924 that he did not publish, Gamow popularising it in 1947, the zigzag count of the fractions skipping those not in lowest terms, Cantor’s first proof of 1874 that the real numbers cannot be counted and the diagonal argument of 1891, Galileo’s squares of 1638 and Dedekind’s definition of 1888 each appeared in at least two places. Sources differ a little on the date of the lecture and of Cantor’s proofs, and the page gives the dates most of them agree on. The page does not use the name aleph-null, which the sources checked did not give. The drawing of the list is only eight by eight, so it is a small copy of the endless argument. Every sum is computed on the page.';

export const sources = [
  { label: 'Wikipedia: Hilbert’s paradox of the Grand Hotel', url: 'https://en.wikipedia.org/wiki/Hilbert%27s_paradox_of_the_Grand_Hotel', for: 'The hotel, the shift and the doubling.' },
  { label: 'Helge Kragh: the history of Hilbert’s hotel (arXiv)', url: 'https://arxiv.org/pdf/1403.0059', for: 'The lecture of January 1924 and Gamow in 1947.' },
  { label: 'Knowino: Hilbert’s hotel', url: 'https://www.tau.ac.il/~tsirel/dump/Static/knowino.org/wiki/Hilbert%27s_hotel.html', for: 'Infinite subsets as big as the set.' },
  { label: 'Wikipedia: Cantor’s diagonal argument', url: 'https://en.wikipedia.org/wiki/Cantor%27s_diagonal_argument', for: 'The argument and its date.' },
  { label: 'MacTutor: Georg Cantor', url: 'https://mathshistory.st-andrews.ac.uk/SH/cantor_sh.pdf', for: 'Cantor’s work on counting.' },
  { label: 'UBC: uncountability', url: 'https://personal.math.ubc.ca/~PLP/book/sec_uncount.html', for: 'The proofs of 1873 and 1891.' },
  { label: 'UCLA: Cantor’s theorem', url: 'https://www.math.ucla.edu/~biskup/131ah.1.23w/PDFs/ch13.pdf', for: 'The diagonal theorem.' },
  { label: 'Open Logic Project: the zig zag', url: 'https://builds.openlogicproject.org/content/sets-functions-relations/size-of-sets/zig-zag.pdf', for: 'Counting the fractions.' },
  { label: 'Wikipedia: Dedekind-infinite set', url: 'https://en.wikipedia.org/wiki/Dedekind-infinite_set', for: 'Dedekind’s definition of 1888.' },
  { label: 'ProofWiki: Galileo’s paradox', url: 'https://proofwiki.org/wiki/Galileo%27s_Paradox', for: 'The counting numbers and their squares.' },
];
