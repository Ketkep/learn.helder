// Everything the "The logic of sudoku" page says, in one place.
// A newspaper puzzle page with four boxed puzzles and four things to try: the one rule, what can go in a cell,
// where a digit can go, and how many solutions a puzzle has. The count of grids and the history come from the sources.
// Everything else is worked out on the page.

export interface Panel {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  tags?: { label: string; text: string }[];
}

export const intro = {
  title: 'A puzzle with one rule and no arithmetic',
  paras: [
    'In a sudoku the digits are only symbols. You could use letters or colours and the puzzle would be the same. The rule is short. Every row, every column and every box must hold each digit once. Nothing is added up. A good puzzle also has exactly one solution, so every move can be reasoned out and nobody has to guess.',
    'Four boxed puzzles to try. Play the rule on a small grid. See which digits can go in a cell. Find the place where a digit has only one home. And count how many solutions a puzzle has as you take clues away. The page works all of this out for you in the browser. Without a script each puzzle shows one grid or table.',
  ],
};

export const panels: Panel[] = [
  {
    id: 'rule',
    kicker: 'First puzzle',
    title: 'The one rule',
    paras: [
      'Start small. This grid has 4 rows, 4 columns and four boxes of 2 by 2, and the digits are 1 to 4. Each row, column and box needs all four digits, once. The grey digits are given. Fill in the rest.',
      'Click a cell and type a digit from 1 to 4, or press the space bar or delete to clear it. A digit that repeats in its row, column or box turns red. When the grid is full and no digit repeats, it is solved.',
    ],
  },
  {
    id: 'cands',
    kicker: 'Second puzzle',
    title: 'What can go here',
    paras: [
      'In a 9 by 9 sudoku, a cell can take a digit only if that digit is not already in its row, its column or its box. The digits left are the candidates. When only one candidate is left, that is the answer. It is called a naked single.',
      'Click a cell to see its row, column and box, and the digits that can go there. Turn on the pencil marks to see the candidates of every cell. Press the button to find a cell with only one candidate.',
    ],
  },
  {
    id: 'hidden',
    kicker: 'Third puzzle',
    title: 'Where can this digit go',
    paras: [
      'You can also look at it from the other side. Take a digit and a row, a column or a box. If that digit can go in only one cell of it, it must go there, even if that cell has other candidates too. This is a hidden single.',
      'Pick a digit. Cells that hold it are marked. Cells that it cannot go in, because of a copy in the same row, column or box, are shaded. If a box, row or column has only one free cell left for the digit, the page marks it.',
    ],
  },
  {
    id: 'count',
    kicker: 'Fourth puzzle',
    title: 'How many solutions',
    paras: [
      'A finished small grid is a set of clues you can take away. Click a digit to remove it and the page counts every way to finish the grid. While the count is 1, the puzzle has one solution. Take away too much, and there are many.',
      'The page can also count all the 4 by 4 grids by trying every digit, and finds 288. For the usual 9 by 9 there are 6,670,903,752,021,072,936,960 grids by the count in the sources. Checking one a second would take about 211 trillion years.',
    ],
    tags: [
      { label: 'History', text: 'The puzzle is credited to Howard Garns, who published it as Number Place in a Dell magazine in 1979. Maki Kaji brought it to Japan in 1984 and shortened the name to sudoku. The Times in London began printing it in November 2004. Sources disagree on some dates and details.' },
      { label: 'Check', text: 'One source says a puzzle with only one solution needs at least 17 clues, and the page does not give who proved it. The count of grids was found by Felgenhauer and Jarvis in 2005, and the sources do not agree on the exact month.' },
    ],
  },
];

export const takeaways = [
  'The rule of sudoku is that every row, column and box holds each digit once. The digits are only symbols.',
  'The candidates of a cell are the digits not yet in its row, column or box. With one candidate left, that digit is the answer.',
  'A digit that has only one cell it can go in, in a row, column or box, goes there. That is a hidden single.',
  'A good puzzle has exactly one solution. Taking clues away can make it have many.',
  'There are more than 6 sextillion valid 9 by 9 grids, and 288 of the 4 by 4 kind.',
];

export const sourcesNote =
  'Some of these sites could not be opened while this page was written, so some facts were checked through search results that quote them. The rule of every row, column and box holding each digit once, naked singles and hidden singles as the first techniques, the count of 6,670,903,752,021,072,936,960 grids by Felgenhauer and Jarvis, Howard Garns and Number Place in a Dell magazine in 1979, Maki Kaji bringing it to Japan in 1984 and The Times beginning to print it in November 2004 each appeared in at least two places. Sources differ on the month of the count and on some dates in the history, and the page gives the years most agree on. One source says a puzzle with a single solution needs at least 17 clues, without naming who proved it, and the page says so and does not name a person. The count of 288 grids of 4 by 4, the candidates, the singles, the solution counts and the 211 trillion years (the 9 by 9 count in seconds, divided by the seconds in a year) are computed on the page. The 9 by 9 puzzle was made for this page and checked to have one solution.';

export const sources = [
  { label: 'Wikipedia: Sudoku', url: 'https://en.wikipedia.org/wiki/Sudoku', for: 'The rule and the history.' },
  { label: 'Wikipedia: mathematics of Sudoku', url: 'https://www.wikipedia.com/wiki/Mathematics_of_sudoku', for: 'The number of grids.' },
  { label: 'Sudoku.com blog: how many sudokus are there', url: 'https://thesudoku.com/blog/2026/03/31/how-many-sudokus-are-there/', for: 'The count of grids.' },
  { label: 'Mu Alpha Theta: sudoku', url: 'https://mualphatheta.org/upload-files/pdf/sudoku.pdf', for: 'The maths of the grids.' },
  { label: 'Counting, symmetries and equivalence classes of Sudoku grids (arXiv)', url: 'https://arxiv.org/pdf/2607.20669', for: 'The count of Felgenhauer and Jarvis.' },
  { label: 'Sudoku.com blog: the secret history of sudoku', url: 'https://thesudoku.com/blog/2026/02/04/the-secret-history-of-sudoku-from-18th-century-swiss-math-to-global-phenomenon/', for: 'Garns, Kaji and The Times.' },
  { label: 'Nippon.com: Kaji Maki, the father of sudoku', url: 'https://www.nippon.com/es/japan-topics/g01191/', for: 'Kaji and the name.' },
  { label: 'HoDoKu: singles', url: 'https://hodoku.sourceforge.net/en/tech_singles.php', for: 'Naked and hidden singles.' },
  { label: 'Sudoku Pulse: hidden single', url: 'https://sudokupulse.pages.dev/techniques/hidden-single', for: 'Hidden singles.' },
  { label: 'Sudoku Bliss: naked singles', url: 'https://sudokubliss.com/guides/naked-singles-technique', for: 'Naked singles.' },
];
