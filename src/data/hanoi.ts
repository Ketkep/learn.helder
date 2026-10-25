// Everything the "The Towers of Hanoi" page says, in one place.
// A temple of four altars and four things to try: play the puzzle, watch the best solution, count the moves, and see which disk moves when.
// The numbers are computed on the page. The sources give the history and the legend.

export interface Panel {
  id: string;
  num: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Sixty four golden disks',
  paras: [
    'There are three pegs. On the first peg sits a stack of disks, the biggest at the bottom. Move the whole stack to the last peg. You may move one disk at a time, and you may never put a bigger disk on a smaller one. The puzzle was sold in 1883 under the name N. Claus de Siam, which is an anagram of Lucas d’Amiens. It was made by the French mathematician Édouard Lucas.',
    'A story came with it. In a temple, priests move 64 golden disks, and when they finish, the world ends. Four altars to try. Play the puzzle yourself. Watch the best solution. Count the moves for any number of disks. And see which disk moves on each move. The numbers are worked out by the page. Without a script each altar shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'play',
    num: '1',
    kicker: 'First altar',
    title: 'Play it',
    paras: [
      'Choose the number of disks. Press a peg to pick up its top disk, then press the peg where it should go. The page counts your moves and tells you the fewest possible.',
      'Start with three disks. Seven moves is the fewest, and most people find it in a few tries.',
    ],
  },
  {
    id: 'watch',
    num: '2',
    kicker: 'Second altar',
    title: 'Watch the best way',
    paras: [
      'There is a short rule that solves any size. To move a stack of n disks: first move the n minus 1 disks above the biggest out of the way, then move the biggest, then move the n minus 1 disks back on top of it. To move those, use the same rule again with one disk fewer. The rule calls itself, which is called recursion.',
      'Step through the best solution. The biggest disk moves only once, in the middle.',
    ],
  },
  {
    id: 'count',
    num: '3',
    kicker: 'Third altar',
    title: 'Count the moves',
    paras: [
      'Each extra disk doubles the work. To move n disks you move n minus 1 disks twice and the biggest disk once, so the fewest moves is two times the fewest for one disk less, plus one. That makes 2 to the power n, minus 1. Three disks need 7 moves, ten need 1,023 and twenty need 1,048,575.',
      'Slide the number of disks. The page shows how long it would take at one move a second. For 64 disks that is about 585 billion years, many times the age of the universe.',
    ],
  },
  {
    id: 'ruler',
    num: '4',
    kicker: 'Fourth altar',
    title: 'Which disk moves',
    paras: [
      'The best solution has a pattern. Write the move number in binary. The disk that moves is given by the position of the lowest 1. The smallest disk moves on every other move, the next on every fourth move, the next on every eighth, and so on. Disk number k moves 2 to the power n minus k times. This is connected to the Gray code, a way of counting that changes one bit at a time, as one disk moves at a time.',
      'Slide through the moves of a puzzle with four disks and see the pattern.',
    ],
  },
];

export const takeaways = [
  'The Towers of Hanoi was sold in 1883 under the name N. Claus de Siam, an anagram of Lucas d’Amiens, Édouard Lucas.',
  'To move n disks you need at least 2 to the n minus 1 moves. Each extra disk doubles the work.',
  'The best way is recursive: move the pile above the biggest disk away, move the biggest, move the pile back.',
  '64 disks need 18,446,744,073,709,551,615 moves, about 585 billion years at one move a second.',
  'The disk that moves is given by the lowest 1 in the move number written in binary, which links the puzzle to counting and the Gray code.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. Lucas presenting the puzzle in 1883 as N. Claus de Siam, the anagram of Lucas d’Amiens, the legend of the temple with 64 golden disks (it is not clear whether Lucas invented it or was inspired by it), the fewest moves of 2 to the n minus 1, the 18,446,744,073,709,551,615 moves for 64 disks and the figure of about 585 billion years at one move a second, the recurrence of twice the fewest for one disk less plus one, and the link with binary counting and the Gray code each appeared in at least two places. Sources differ on the details of the legend, and one gives a different figure for the years, which is wrong by the arithmetic. The page does not say where the temple is. The counts and the times are computed on the page and the best solution is checked move by move by the page’s own code.';

export const sources = [
  { label: 'Wikipedia: Tower of Hanoi', url: 'https://en.wikipedia.org/wiki/Tower_of_Hanoi', for: 'History, legend, the rule and the move count.' },
  { label: 'MacTutor: the Towers of Hanoi', url: 'https://mathshistory.st-andrews.ac.uk/Extras/Hanoi/', for: 'Lucas and the legend.' },
  { label: 'ProofWiki: Tower of Hanoi', url: 'https://proofwiki.org/wiki/Tower_of_Hanoi', for: 'The fewest moves and a proof.' },
  { label: 'ProofWiki: historical note', url: 'https://proofwiki.org/wiki/Tower_of_Hanoi/Historical_Note', for: 'The story of the disks and the years.' },
  { label: 'Scientific American: the Tower of Hanoi', url: 'https://www.scientificamerican.com/article/the-tower-of-hanoi/', for: 'The puzzle and where to start.' },
  { label: 'Runestone Academy: Tower of Hanoi', url: 'https://runestone.academy/ns/books/published/pswadsup/recursion_tower-of-recursion_hanoi.html', for: 'The recursive rule.' },
  { label: 'University of Arizona: Hanoi notes', url: 'https://www2.cs.arizona.edu/classes/cs227/spring14/hanoi.pdf', for: 'The recurrence for the move count.' },
  { label: 'arXiv: Fibonacci-like sequences, graphs and Gray codes', url: 'https://arxiv.org/pdf/2206.03047', for: 'Binary labels and the disk that moves.' },
  { label: 'arXiv: optimality proofs and multi-peg bounds', url: 'https://arxiv.org/html/2511.07501v1', for: 'Why the biggest disk moves once.' },
];
