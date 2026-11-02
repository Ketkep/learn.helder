// Everything the "How Conway's Game of Life grows" page says, in one place.
// A sheet of graph paper with three things to try: the one rule that decides a cell, patterns that stay, blink or walk, and a random
// soup that settles. The rule, the history and the patterns come from the sources. The soups are drawn from fixed seeds.

export interface Sheet {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'One rule, and a world that grows by itself',
  paras: [
    'The Game of Life is not a game with players. It is a sheet of squares, each one alive or empty. You set the squares, press a button and watch what happens. One rule, the same for every square, decides who is alive in the next round. The mathematician John Conway made it in 1970, and it reached many readers through Martin Gardner’s column in Scientific American that October.',
    'Three sheets to try. On the first, test the rule on one square and its neighbours. On the second, watch patterns that stay, blink or walk across the sheet. On the third, scatter a random soup and see what is left after a hundred rounds. Without a script each sheet shows one picture.',
  ],
};

export const sheets: Sheet[] = [
  {
    id: 'rule',
    kicker: 'First sheet',
    title: 'The rule for one square',
    paras: [
      'Each square has up to eight neighbours: the squares touching it, even at the corners. Count the live ones. A live square with two or three live neighbours stays alive. A live square with fewer than two dies of loneliness, and with more than three it dies of crowding. An empty square with exactly three live neighbours comes alive. Every other square is empty.',
      'Click squares to switch them on and off. The middle square is marked, and the page tells you how many live neighbours it has and what happens to it. Press Next round to apply the rule to every square at once. The squares beyond the edge of this small sheet count as empty.',
    ],
    tags: [
      { label: 'In short', text: 'The rule is written B3/S23: a square is Born with 3 neighbours and Survives with 2 or 3.' },
    ],
  },
  {
    id: 'patterns',
    kicker: 'Second sheet',
    title: 'Patterns that stay, blink or walk',
    paras: [
      'Some small patterns never change. They are called still lifes, such as the block and the beehive. Some repeat after a few rounds, and are called oscillators, such as the blinker and the toad. And some move: a glider, five squares in the shape of a small arrow, walks one square diagonally every four rounds.',
      'Pick a pattern and press Next round or Run. You can click squares to change it. The sheet wraps round at the edges, so what leaves on the right comes back on the left. The R-pentomino has only five squares, yet in an endless sheet it changes for 1103 rounds before it settles. Here it will meet itself before that.',
    ],
    tags: [
      { label: 'History', text: 'The glider gun, a pattern that makes a new glider every thirty rounds, was found at the end of 1970 by the MIT group around Bill Gosper. With it, Life can grow without limit.' },
    ],
  },
  {
    id: 'soup',
    kicker: 'Third sheet',
    title: 'A soup of random squares',
    paras: [
      'Now fill the sheet with random squares, a soup, and let the rule run. The first rounds are wild. Crowded squares die and gaps fill. Then things settle. Most of the soup ends up as still lifes and blinkers, with a few gliders that wander off, but no one can tell from the start which squares will make it.',
      'Pick how full the soup is, press Another soup, then Jump 100 rounds. The graph shows the number of live squares round by round. The page tells you if the sheet has settled into patterns that stay or repeat every two rounds, and when. Sheets that settle into longer repeats keep changing, and the page will say so.',
    ],
  },
];

export const takeaways = [
  'Each square is alive or empty. A live square with 2 or 3 live neighbours stays alive, an empty square with exactly 3 comes alive, and every other square is empty next round.',
  'The rule is the same for every square and does nothing clever. There are no moves to choose.',
  'Simple patterns stay (still lifes), repeat (oscillators) or walk (spaceships such as the glider).',
  'A tiny pattern can change for a very long time. The R-pentomino has five squares and takes 1103 rounds in an endless sheet.',
  'You can know the rule and still not know what a pattern will do without running it.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. The rule (born with exactly 3 neighbours, survive with 2 or 3, written B3/S23), Conway’s invention in 1970, Gardner’s column in the October 1970 issue of Scientific American, the still lifes and oscillators, the glider moving one square diagonally every four rounds, the R-pentomino settling at round 1103, and the glider gun found at the end of 1970 by the MIT group around Gosper each appeared in at least two places. Sources differ on the details of who first saw the glider gun, so the page says only that the MIT group found it. The page does not say that Life is as powerful as a computer, because the search gave this only in general terms. The board on the page wraps round at the edges, so patterns that grow forever on an endless sheet behave differently there. The soups come from fixed seeds. The number of live squares in the graphs is counted by the page. Nothing here is advice.';

export const sources = [
  { label: 'Wikipedia: Conway’s Game of Life', url: 'https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life', for: 'The rule, the history and the patterns.' },
  { label: 'Scholarpedia: Game of Life', url: 'http://www.scholarpedia.org/article/Game_of_Life', for: 'Rules, still lifes and the R-pentomino.' },
  { label: 'Scientific American, October 1970 (mirror at ibiblio)', url: 'https://www.ibiblio.org/lifepatterns/october1970.html', for: 'Gardner’s column, still lifes and oscillators.' },
  { label: 'LifeWiki: R-pentomino', url: 'https://conwaylife.com/wiki/R-pentomino', for: 'The R-pentomino and round 1103.' },
  { label: 'Wikipedia: Glider (Conway’s Game of Life)', url: 'https://en.wikipedia.org/wiki/Glider_(Conway%27s_Game_of_Life)', for: 'How fast the glider walks.' },
  { label: 'Beltoforion: John Conway’s Game of Life', url: 'https://beltoforion.de/en/game_of_life/', for: 'An introduction to cellular automata.' },
  { label: 'Wolfram MathWorld: Game of Life', url: 'https://mathworld.wolfram.com/GameofLife.html', for: 'The rule and the patterns.' },
  { label: 'Cornell Mathematics: Conway’s Game of Life', url: 'https://pi.math.cornell.edu/~lipa/mec/lesson6.html', for: 'The rule written out.' },
  { label: 'Stanford: the fantastic combinations of John Conway’s new solitaire game', url: 'https://web.stanford.edu/class/sts145/Library/life.pdf', for: 'The 1970 column.' },
  { label: 'Alan Zucconi: Conway’s Game of Life', url: 'https://www.alanzucconi.com/2020/10/13/conways-game-of-life/', for: 'The rule and some patterns.' },
  { label: 'LifeWiki: Lifeline volume 1', url: 'https://conwaylife.com/wiki/Lifeline_Volume_1', for: 'The glider gun found by the MIT group.' },
  { label: 'Programming for Lovers: the Game of Life', url: 'https://programmingforlovers.com/chapter-3-building-a-self-replicating-cellular-automaton-with-top-down-programming/chapter-3-core-text/the-game-of-life/', for: 'The rule in a program.' },
];
