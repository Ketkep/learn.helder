// Everything the "The game of Nim" page says, in one place.
// A table with matchsticks and four things to try: play the machine, add in binary, find the move, and play with the last stick losing.
// The game is solved, so the maths is exact. The history comes from the sources.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'Take the last stick',
  paras: [
    'Nim is a game for two. There are heaps of sticks. On your turn you take as many sticks as you like from one heap, at least one. Whoever takes the last stick wins.',
    'It looks like luck and guessing. It is not. Nim has a rule that tells the player whose turn it is whether they can win, and which move to make. The rule uses numbers written in binary. Four things to try: play a machine, add heaps in binary, find the winning move yourself, and play the twist where the last stick loses. Without a script each part shows one picture or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'play',
    kicker: 'Try one',
    title: 'Play the machine',
    paras: [
      'The classic game has four heaps of 1, 3, 5 and 7 sticks. Click a stick to take it and all the sticks to its right in the same heap. The machine answers at once.',
      'Start with the machine playing at random, and win. Then switch it to perfect play and try again. The classic start is a position that the player who moves first cannot win against perfect play. Let the machine start and you have a chance.',
    ],
  },
  {
    id: 'binary',
    kicker: 'Try two',
    title: 'Add in binary',
    paras: [
      'Write each heap size in binary. Then add each column without carrying: if the column has an odd number of ones, write 1, and if it has an even number, write 0. The result is the nim-sum. This is the operation called XOR.',
      'The rule: if the nim-sum is zero when it is your turn, you lose against perfect play. If it is not zero, you can win. Move the sliders and watch the columns.',
    ],
    tags: [{ label: 'Why it works', text: 'From a position with nim-sum zero, every move changes one heap, so the nim-sum cannot stay zero. From a position with nim-sum not zero, there is always a move that makes it zero. So the winner keeps handing the other player a zero.' }],
  },
  {
    id: 'hunt',
    kicker: 'Try three',
    title: 'Find the move',
    paras: [
      'Each position has a winning move, a move that leaves a nim-sum of zero. To find it, take the nim-sum. Then look for a heap that gets smaller when you combine it with the nim-sum using XOR, and cut that heap down to the new size.',
      'Choose a heap and how many sticks to take, then check. The sum is shown for every try.',
    ],
  },
  {
    id: 'misere',
    kicker: 'Try four',
    title: 'The last stick loses',
    paras: [
      'Change one rule: the player who takes the last stick loses. This is called misere play. You might expect the whole strategy to flip. It does not. The winner plays exactly as before, until the moment when every heap has at most one stick. Then the winner makes sure an odd number of single sticks is left.',
      'Play the machine in this version. When many heaps are big, the nim-sum still decides the game.',
    ],
    tags: [{ label: 'A small change, a different game', text: 'For plain Nim the theory covers every kind of game of this type. In misere play it does not, and it is much harder. Nim is the lucky case.' }],
  },
];

export const takeaways = [
  'Nim is solved. From any position, the player to move either has a winning move or none at all, and the nim-sum says which.',
  'The nim-sum is the XOR of the heap sizes: add in binary with no carrying. If it is zero on your turn, you lose against perfect play.',
  'The winning move cuts one heap so that the nim-sum becomes zero.',
  'The classic start of 1, 3, 5 and 7 has nim-sum zero, so the first player loses against perfect play.',
  'If the last stick loses, the strategy is the same until only heaps of one stick are left. Then the winner leaves an odd number of them.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. The rule of the game, the nim-sum as XOR of the heap sizes, a zero nim-sum meaning a lost position for the player to move, the winning move of cutting a heap to heap XOR nim-sum, the nim-sum of zero for heaps of 1, 3, 5 and 7, the change of strategy at the end in misere play, and Charles Bouton’s complete theory of 1901 each appeared in at least two places. The Nimatron, a Nim machine shown by Westinghouse at the New York World’s Fair of 1939 to 1940, is described with different dates in different sources, so the page leaves the year out. The strategy on the page was also checked by computer against every position of up to four heaps of at most five sticks, in both versions of the game. The machine in the game uses that strategy, or a random move.';

export const sources = [
  { label: 'Wikipedia: Nim', url: 'https://en.wikipedia.org/wiki/Nim', for: 'The rules, the nim-sum and Bouton’s theory.' },
  { label: 'University of Alberta: Nim notes', url: 'https://webdocs.cs.ualberta.ca/~hayward/355/nim.pdf', for: 'The nim-sum and the winning strategy.' },
  { label: 'Brilliant: Nim', url: 'https://brilliant.org/wiki/nim/', for: 'The strategy and a worked example.' },
  { label: 'Plus Maths: Nim', url: 'https://plus.maths.org/content/comment/5618', for: 'Binary and the game.' },
  { label: 'CodeProject: the Nim game', url: 'https://www.codeproject.com/articles/19938/the-nim-game', for: 'Finding the move.' },
  { label: 'Wikipedia: Nimatron', url: 'https://en.wikipedia.org/wiki/Nimatron', for: 'The Nim machine of 1940.' },
  { label: 'History of Information: Nimatron', url: 'https://historyofinformation.com/detail.php?id=4012', for: 'An early machine to play Nim.' },
  { label: 'COMSOL: Edward Condon', url: 'https://www.comsol.com/blogs/happy-birthday-edward-condon', for: 'The person behind the Nimatron.' },
];
