// Everything the "Why tic-tac-toe is always a draw" page says, in one place.
// A school slate and four things to try: play the machine, choose the first move, count every game, and find the best move.
// The counts are computed by the page from the rules. They match the figures in the sources.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A game with a known ending',
  paras: [
    'Tic-tac-toe is called noughts and crosses in Britain. Two players take turns to mark a square on a grid of three by three. The first to make a line of three wins. If the grid fills with no line, it is a draw.',
    'The game is small enough that a computer can look at every position. It finds that if both players make no mistakes, the game is always a draw. Four things to try. Play a machine that never errs. See which first moves are safe. Count every game that can be played. Find the best move in a position. Without a script each part shows one picture.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'play',
    kicker: 'Slate one',
    title: 'Play the machine',
    paras: [
      'This machine looks ahead to the end of the game from every position, so it never makes a mistake. Choose to play first or second and try to beat it. You can only win if the machine errs, and it does not.',
      'The machine picks at random among its equally good moves, so the games differ. The score below counts your games on this page only.',
    ],
  },
  {
    id: 'opening',
    kicker: 'Slate two',
    title: 'The first moves',
    paras: [
      'Cross moves first. Pick a square for the cross and see what each reply of the nought leads to, if both play perfectly after that. A square marked draw keeps the game level. A square marked loss hands the win to cross.',
      'Many people think the centre is the only good first move. With perfect play every first move still gives a draw. What changes is how many replies hold it. After a corner, the nought has one safe reply. After the centre or an edge, four.',
    ],
    tags: [{ label: 'Why it matters', text: 'Against a player who sometimes errs, the corner is the best start for cross, because seven of the eight replies of the nought lose. The corner makes errors easy to make.' }],
  },
  {
    id: 'count',
    kicker: 'Slate three',
    title: 'Count every game',
    paras: [
      'The game has nine squares and ends after at most nine moves. A game ends when a line is made or the grid is full. Counting all the ways to play gives 255,168 different games. They end in 131,184 wins for cross, 77,904 wins for nought and 46,080 draws.',
      'Many of the positions in these games are the same position reached in different orders, and many are turned or mirrored copies of each other. There are 5,478 positions that can arise, and 765 when turned and mirrored copies count as one. Slide the number of moves to see how many games end there.',
    ],
    tags: [{ label: 'Worked out here', text: 'This page counts the games itself, with the rules, when it loads. The numbers it shows match published counts.' }],
  },
  {
    id: 'best',
    kicker: 'Slate four',
    title: 'Find the best move',
    paras: [
      'Perfect play is one idea: for each move, ask what the other player can do next, and choose the move whose worst case is best. Computers do this by looking at every continuation, which is called minimax.',
      'Five positions, from easy to hard. Pick a square. The page says whether that move wins, draws or loses with perfect play after it. A move that makes two threats at once is called a fork, and the last two need one.',
    ],
  },
];

export const takeaways = [
  'If both players make no mistakes, tic-tac-toe is always a draw.',
  'There are 255,168 different games, and 5,478 positions that can arise. Counting turned and mirrored copies as one leaves 765.',
  'Cross wins 131,184 of the games, nought 77,904, and 46,080 are draws. These count every possible game once. They say nothing about who wins in real play.',
  'Every first move gives a draw with perfect play. The corner is the best try against a player who errs, because most replies lose.',
  'A computer plays perfectly by looking at every continuation and choosing the move with the best worst case.',
];

export const sourcesNote =
  'Most of these sites could not be opened while this page was written, so the facts were checked through search results that quote them. That the game is a draw with perfect play, 255,168 games, 5,478 positions, 765 positions up to turning and mirroring, the split of 131,184 wins for cross, 77,904 for nought and 46,080 draws, and the idea of minimax each appeared in at least two places. The page also computes the counts itself from the rules and they match. Sources disagree on the number of games up to turning and mirroring, so the page gives no such figure. The advice about which opening to choose is a general observation, not a rule, and the page says what it counts.';

export const sources = [
  { label: 'Wikipedia: tic-tac-toe', url: 'https://en.wikipedia.org/wiki/Tic-tac-toe', for: 'The rules, the game counts and the draw with perfect play.' },
  { label: 'Wikipedia: game complexity', url: 'https://en.wikipedia.org/wiki/Game_complexity', for: 'Size of the game tree and the positions.' },
  { label: 'Wikipedia: minimax', url: 'https://en.wikipedia.org/wiki/Minimax', for: 'How a perfect player chooses a move.' },
  { label: 'Wikipedia: solved game', url: 'https://en.wikipedia.org/wiki/Solved_game', for: 'What it means that a game is solved.' },
  { label: 'Brilliant: tic-tac-toe', url: 'https://brilliant.org/wiki/tic-tac-toe/', for: 'Strategy and the opening moves.' },
  { label: 'Stack Overflow: how many tic-tac-toe games', url: 'https://stackoverflow.com/questions/25649925/how-many-possible-tic-tac-toe-games', for: 'The count of 255,168 games and 5,478 positions.' },
  { label: 'Cornell: games and strategy notes', url: 'https://www.cs.cornell.edu/courses/cs312/2002sp/lectures/rec21.htm', for: 'Minimax search and scoring, with Gomoku as the example.' },
  { label: 'Wikipedia: noughts and crosses', url: 'https://en.wikipedia.org/wiki/Noughts_and_crosses', for: 'The British name and history of the game.' },
];
