// Everything the "Gambits in chess" page says, in one place.
// Moves are written in standard notation without move numbers. They are checked by a chess
// program when the site is built, so a typo here stops the build instead of reaching the page.

import type { Square } from 'chess.js';

export type Row = 'm' | 'c' | 'k';

/** A short comment shown on the screen when a move is played. */
export interface Note {
  text: string;
  /** Marker arrows, drawn from the first square to the second. */
  arrows?: [Square, Square][];
  /** Squares to circle. */
  marks?: Square[];
}

export interface LineDef {
  moves: string[];
  /** The side that gives the pawn. The ledger numbers are positive when they are good for it. */
  side?: 'w' | 'b';
  /** Whose king the "king in danger" number is about. */
  kingOf?: 'w' | 'b';
  /** Notes by ply: 1 is White's first move, 2 is Black's first reply, and so on. */
  notes?: Record<number, Note>;
}

export interface Verdict {
  text: string;
  tone: 'good' | 'bad' | 'plain';
}

export interface Option {
  /** What the button says. */
  label: string;
  /** The key of a line in `lines`. The whole game from the start, including the shared first moves. */
  line: string;
  verdict: Verdict;
  /** A second question after this line has played. */
  then?: Choice;
}

export interface Choice {
  prompt: string;
  options: Option[];
}

export type Flow =
  | {
      /** The film plays a game. The reader can scrub through it. */
      type: 'replay';
      line: string;
      from: 'start' | 'end';
      /** Start on the last position and run backwards to the first. */
      rewind?: boolean;
      autoplay?: boolean;
      /** What the subtitle says when the scene opens. */
      caption: string;
      /** What it says after the rewind. */
      captionAfter?: string;
    }
  | {
      /** The reader makes one move on the board, then the film plays the reply. */
      type: 'try';
      line: string;
      /** How many moves are played for the reader before they take over. */
      setup: number;
      /** The ply the reader plays. */
      expect: number;
      prompt: string;
      showMe: string;
    }
  | {
      /** The reader picks one of a few moves and sees where it leads. */
      type: 'choose';
      base: string;
      setup: number;
      first: Choice;
    };

export interface Scene {
  id: string;
  kicker: string;
  title: string;
  paras: string[];
  fact?: { label: string; text: string };
  ledger?: { rows: Row[]; range: Partial<Record<Row, number>>; kLabel?: string };
  flow: Flow;
}

// ---------------------------------------------------------------- the games

const immortalMoves = (
  'e4 e5 f4 exf4 Bc4 Qh4+ Kf1 b5 Bxb5 Nf6 Nf3 Qh6 d3 Nh5 Nh4 Qg5 Nf5 c6 g4 Nf6 Rg1 cxb5 h4 Qg6 h5 Qg5 ' +
  'Qf3 Ng8 Bxf4 Qf6 Nc3 Bc5 Nd5 Qxb2 Bd6 Bxg1 e5 Qxa1+ Ke2 Na6 Nxg7+ Kd8 Qf6+ Nxf6 Be7#'
).split(' ');

const trapBase = ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nd4'];

export const lines: Record<string, LineDef> = {
  'kg-intro': {
    moves: ['e4', 'e5', 'f4', 'exf4'],
    notes: {
      3: { text: "White offers the f-pawn. This is the King's Gambit.", marks: ['f4'] },
      4: { text: 'Black takes it. White is a pawn down, and chose to be.', marks: ['f4'] },
    },
  },

  'qg-accepted': {
    moves: ['d4', 'd5', 'c4', 'dxc4', 'Nf3', 'Nf6', 'e3', 'e6', 'Bxc4', 'c5', 'O-O', 'a6'],
    notes: {
      3: { text: "White offers the c-pawn. This is the Queen's Gambit.", marks: ['c4'] },
      4: { text: 'Black takes it. Black is a pawn up.', marks: ['c4'] },
      9: { text: 'The bishop takes the pawn back. The pawn count is level again.', marks: ['c4'] },
    },
  },
  'qg-declined': {
    moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'e3', 'O-O', 'Nf3', 'Nbd7'],
    notes: {
      3: { text: "White offers the c-pawn. This is the Queen's Gambit.", marks: ['c4'] },
      4: { text: 'Black says no thanks. No pawn changes hands.' },
    },
  },

  immortal: {
    moves: immortalMoves,
    side: 'w',
    kingOf: 'b',
    notes: {
      3: { text: "White offers the f-pawn. This is the King's Gambit.", marks: ['f4'] },
      4: { text: 'Black takes it. White is a pawn down.', marks: ['f4'] },
      5: { text: "The bishop eyes f7, the square next to Black's king.", arrows: [['c4', 'f7']], marks: ['f7'] },
      6: { text: 'Check from the queen. White answers with the king and can no longer castle.' },
      8: { text: 'Black offers a pawn too. If the bishop takes it, it leaves the diagonal that points at f7.', marks: ['b5'] },
      9: { text: 'White takes the bait.', marks: ['b5'] },
      17: { text: 'The knight lands on f5 and eyes g7.', arrows: [['f5', 'g7']] },
      19: { text: "Another pawn goes forward, this time to chase Black's knight.", arrows: [['g4', 'h5']] },
      21: { text: 'The rook comes to the g-file, behind the pawn.' },
      22: { text: 'Black takes the bishop. White is three points down.', marks: ['b5'] },
      29: { text: 'At last White wins back the pawn from move 2.', marks: ['f4'] },
      33: { text: "A knight jumps into the middle and attacks Black's queen.", arrows: [['d5', 'f6']] },
      34: { text: 'The queen runs, grabbing a pawn on the way. Now it eyes the rook on a1.', arrows: [['b2', 'a1']] },
      35: { text: 'The famous quiet move. White leaves both rooks hanging.', marks: ['g1', 'a1'] },
      36: { text: 'Black takes the first rook. White is eight points down.', marks: ['g1'] },
      38: { text: 'Black takes the second rook, with check. Thirteen points down.', marks: ['a1'] },
      41: { text: 'A knight takes a pawn, with check.', marks: ['g7'] },
      43: { text: 'Now the queen goes too.', arrows: [['f3', 'f6']] },
      44: { text: 'Black has to take it. White is twenty-one points down.', marks: ['f6'] },
      45: { text: 'Checkmate. A bishop and two knights are enough.', marks: ['d8'] },
    },
  },

  'trap-safe': {
    moves: [...trapBase, 'Nxd4', 'exd4', 'O-O', 'Nf6'],
    side: 'w',
    kingOf: 'w',
    notes: {
      6: { text: "Black's knight leaves the pawn on e5 with nothing guarding it.", marks: ['e5'] },
      7: { text: 'White takes the knight instead. Black takes back.', marks: ['d4'] },
      9: { text: 'White castles and keeps the better position.' },
    },
  },
  'trap-grab': {
    moves: [...trapBase, 'Nxe5', 'Qg5'],
    side: 'w',
    kingOf: 'w',
    notes: {
      7: { text: 'White takes the pawn. White is a pawn up.', marks: ['e5'] },
      8: { text: 'Black attacks the knight on e5 and the pawn on g2 with one move.', arrows: [['g5', 'e5'], ['g5', 'g2']] },
    },
  },
  'trap-castle': {
    moves: [...trapBase, 'Nxe5', 'Qg5', 'O-O'],
    side: 'w',
    kingOf: 'w',
    notes: {
      7: { text: 'White takes the pawn. White is a pawn up.', marks: ['e5'] },
      8: { text: 'Black attacks the knight on e5 and the pawn on g2 with one move.', arrows: [['g5', 'e5'], ['g5', 'g2']] },
      9: { text: 'White castles and the king is safe.' },
    },
  },
  'trap-greedy': {
    moves: [...trapBase, 'Nxe5', 'Qg5', 'Nxf7', 'Qxg2', 'Rf1', 'Qxe4+', 'Be2', 'Nf3#'],
    side: 'w',
    kingOf: 'w',
    notes: {
      7: { text: 'White takes the pawn. White is a pawn up.', marks: ['e5'] },
      8: { text: 'Black attacks the knight on e5 and the pawn on g2 with one move.', arrows: [['g5', 'e5'], ['g5', 'g2']] },
      9: { text: 'The knight takes f7 and forks the queen and the rook.', arrows: [['f7', 'g5'], ['f7', 'h8']] },
      10: { text: 'Black ignores the fork. The queen takes g2 and now eyes the rook on h1.', arrows: [['g2', 'h1']] },
      11: { text: 'White saves the rook.' },
      12: { text: 'Check. The queen takes the pawn on e4.', marks: ['e1'] },
      13: { text: 'White blocks with the bishop.' },
      14: { text: "Checkmate. White's own pieces fill every square around the king.", marks: ['e1'] },
    },
  },

  spassky: {
    moves: ['e4', 'e5', 'f4', 'exf4', 'Nf3', 'g5', 'h4', 'g4', 'Ne5', 'Nf6'],
    notes: {
      3: { text: "Spassky offers the f-pawn, just like in the Immortal Game.", marks: ['f4'] },
      7: { text: 'White attacks the pawn that holds the gambit pawn.', arrows: [['h4', 'g5']] },
      9: { text: 'The knight jumps into the middle.', marks: ['e5'] },
    },
  },
};

// ---------------------------------------------------------------- the scenes

export const scenes: Scene[] = [
  {
    id: 'london',
    kicker: 'Scene one',
    title: 'London, 1851',
    paras: [
      'Adolf Anderssen has just won a game of chess. Look at the board.',
      'White has a king, a bishop and two knights. Black has a queen, two rooks, two bishops and two knights. And it is Black who is checkmated.',
      'White gave up a queen, two rooks and a bishop on purpose. It all began with one pawn. Let us go back to the start.',
    ],
    flow: {
      type: 'replay',
      line: 'immortal',
      from: 'end',
      rewind: true,
      caption: '21 June 1851, London. Checkmate.',
      captionAfter: 'It began with one pawn. Press play, or just keep scrolling.',
    },
  },
  {
    id: 'trip',
    kicker: 'Scene two',
    title: 'A trip',
    paras: [
      'The word gambit comes from an Italian word for a wrestling trip. In chess you trip your opponent by giving something up.',
      "Try it. You are White, and this is the King's Gambit. Tap the glowing pawn, then the glowing square.",
      "Black takes the pawn. Now you are a pawn down, and you chose that. Look at the ledger on the screen. The first number shows the cost. The second shows what you got for it: Black's pawn has left the middle of the board, and you hold more of it.",
    ],
    fact: {
      label: 'Old news',
      text: "The King's Gambit is in one of the oldest printed chess books, written by Luis Ramírez de Lucena in 1497.",
    },
    ledger: { rows: ['m', 'c'], range: { m: 3, c: 3 } },
    flow: {
      type: 'try',
      line: 'kg-intro',
      setup: 2,
      expect: 3,
      prompt: 'Your move. Push the f-pawn two squares.',
      showMe: 'Show me',
    },
  },
  {
    id: 'refuse',
    kicker: 'Scene three',
    title: 'Take it or leave it',
    paras: [
      "Now you play Black. White has offered the c-pawn. This is the Queen's Gambit, the most famous one.",
      'You can take the pawn or leave it. Both are normal moves. Pick one and watch the ledger.',
    ],
    fact: {
      label: 'Fair warning',
      text: "The Queen's Gambit is one of the oldest openings, and people still play it a lot today.",
    },
    ledger: { rows: ['m', 'c'], range: { m: 3, c: 3 } },
    flow: {
      type: 'choose',
      base: 'qg-accepted',
      setup: 3,
      first: {
        prompt: 'You are Black. White offers the c-pawn. Do you take it?',
        options: [
          {
            label: 'Take the pawn',
            line: 'qg-accepted',
            verdict: {
              tone: 'plain',
              text: 'You took it, and for a few moves you were a pawn up. Then the bishop took it back. Black cannot keep the pawn without paying for it, so many players say the Queen\'s Gambit is not a real gambit.',
            },
          },
          {
            label: 'Leave it',
            line: 'qg-declined',
            verdict: {
              tone: 'plain',
              text: 'You left it. Nobody is down a pawn. White gave nothing up, and holds more of the centre.',
            },
          },
        ],
      },
    },
  },
  {
    id: 'all-in',
    kicker: 'Scene four',
    title: 'All in',
    paras: [
      'Back to London. Anderssen played the King\'s Gambit, and Black took the pawn, just like in your game. Press play, or drag the knob to move through it yourself.',
      "Watch the two numbers. The first one falls until White is 21 points behind. The second one climbs: more and more of the squares around Black's king are under attack.",
      'White did not win back the pawn from move 2 until move 15. By the end he had given up a bishop, both rooks and the queen. A bishop and two knights finished the job.',
    ],
    fact: {
      label: 'Just a casual game',
      text: 'It was played beside the first international tournament, not in it. Ernst Falkbeer gave it the name "immortal" in 1855.',
    },
    ledger: { rows: ['m', 'k'], range: { m: 22, k: 5 }, kLabel: 'Black king in danger' },
    flow: { type: 'replay', line: 'immortal', from: 'start', autoplay: true, caption: 'Press play to watch the game.' },
  },
  {
    id: 'bait',
    kicker: 'Scene five',
    title: 'The bait',
    paras: [
      'A gambit can also be a trap. Now you are White. Black has just moved a knight to d4, and the pawn on e5 hangs for nothing.',
      'Is it really for nothing? Look at the board before you choose.',
    ],
    fact: {
      label: 'Said to be',
      text: 'This is called the Blackburne Shilling Gambit. The story goes that Joseph Henry Blackburne won shillings with it in cafes.',
    },
    ledger: { rows: ['m', 'k'], range: { m: 3, k: 5 }, kLabel: 'Your king in danger' },
    flow: {
      type: 'choose',
      base: 'trap-grab',
      setup: 6,
      first: {
        prompt: 'You are White. The e5 pawn hangs. What do you do?',
        options: [
          {
            label: 'Take the knight',
            line: 'trap-safe',
            verdict: {
              tone: 'good',
              text: 'Safe. You ignored the pawn and took the knight. A chess engine says White is better by about a pawn.',
            },
          },
          {
            label: 'Take the pawn',
            line: 'trap-grab',
            verdict: { tone: 'plain', text: 'You took the pawn. Black replied with the queen, and now there is another pawn to grab.' },
            then: {
              prompt: 'The queen attacks your knight and the g2 pawn. Your knight can fork the queen and the rook on f7.',
              options: [
                {
                  label: 'Fork them',
                  line: 'trap-greedy',
                  verdict: {
                    tone: 'bad',
                    text: 'Checkmate. Your own pieces filled every square around your king. This is called a smothered mate.',
                  },
                },
                {
                  label: 'Castle',
                  line: 'trap-castle',
                  verdict: {
                    tone: 'plain',
                    text: 'No mate this time. But an engine thinks Black is a little better here, so the safest moment to say no was one move earlier.',
                  },
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    id: 'bet',
    kicker: 'Scene six',
    title: 'A good deal?',
    paras: [
      "So is a pawn worth it? Sometimes. In 1960, at Mar del Plata, Boris Spassky beat Bobby Fischer with the King's Gambit. The board shows the first moves of that game.",
      'Fischer took it hard. In 1961 he wrote an article called "A Bust to the King\'s Gambit". He wrote: "In my opinion the King\'s Gambit is busted. It loses by force." His own answer was 3...d6, a move that keeps the pawn.',
      'Not every gambit is sound. Strong players call the Englund Gambit (1.d4 e5) weak, yet it has traps that win games fast. A gambit is a bet. It pays if the other side does not know what to do with the gift.',
    ],
    flow: { type: 'replay', line: 'spassky', from: 'start', autoplay: true, caption: 'Spassky against Fischer, 1960.' },
  },
];

// ---------------------------------------------------------------- the field guide

export interface Gambit {
  name: string;
  moves: string[];
  /** Who gives the pawn. */
  by: 'White' | 'Black';
  gives: string;
  idea: string;
  note?: string;
}

export const guide: Gambit[] = [
  {
    name: "Queen's Gambit",
    moves: ['d4', 'd5', 'c4'],
    by: 'White',
    gives: 'The c-pawn',
    idea: 'If Black takes it, White gets the pawn back and keeps a big centre. That is why it is hardly a real gambit.',
  },
  {
    name: "King's Gambit",
    moves: ['e4', 'e5', 'f4'],
    by: 'White',
    gives: 'The f-pawn',
    idea: "Pulls Black's e-pawn away from the centre and opens the f-file for White's rook.",
    note: 'Spassky beat Fischer with it in 1960.',
  },
  {
    name: 'Evans Gambit',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'b4'],
    by: 'White',
    gives: 'The b-pawn',
    idea: "The pawn pulls Black's bishop off its square, so White can build a big centre.",
    note: 'Named after Captain William Davies Evans, who also designed night lights for ships.',
  },
  {
    name: 'Danish Gambit',
    moves: ['e4', 'e5', 'd4', 'exd4', 'c3'],
    by: 'White',
    gives: 'One or two pawns',
    idea: "White gives up pawns to bring pieces out fast and aim them at Black's king.",
  },
  {
    name: 'Smith-Morra Gambit',
    moves: ['e4', 'c5', 'd4', 'cxd4', 'c3'],
    by: 'White',
    gives: 'One pawn',
    idea: 'White gets pieces out fast and a pawn in the centre, while Black is a pawn up.',
  },
  {
    name: 'Englund Gambit',
    moves: ['d4', 'e5'],
    by: 'Black',
    gives: 'The e-pawn',
    idea: 'Black gives up a pawn on move one and hopes for traps. Strong players call it unsound.',
  },
  {
    name: 'Budapest Gambit',
    moves: ['d4', 'Nf6', 'c4', 'e5'],
    by: 'Black',
    gives: 'The e-pawn',
    idea: 'Black offers the pawn at once, to get active pieces quickly.',
    note: 'First known game: Adler against Maróczy, Budapest, 1896.',
  },
  {
    name: 'Blackburne Shilling Gambit',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nd4'],
    by: 'Black',
    gives: 'The e-pawn',
    idea: 'A trap. If White grabs the pawn, and then the one on f7, Black has a smothered mate.',
  },
];

// ---------------------------------------------------------------- the end of the page

export const takeaways = [
  'A gambit gives up a pawn on purpose, early in the game.',
  'You are paying for something: speed, space or open lines. If you get none of them, the pawn is just lost.',
  "Some gambits are loans. In the Queen's Gambit, White usually gets the pawn back.",
  'Some gambits are bait. A player who grabs every pawn can walk into a trap, like the smothered mate on the board.',
  "Even famous gambits are argued about. Fischer called the King's Gambit busted, and Spassky still beat him with it.",
];

export interface Source {
  label: string;
  url: string;
  /** What this source was used for. */
  for: string;
}

export const sources: Source[] = [
  { label: 'Merriam-Webster: gambit', url: 'https://www.merriam-webster.com/dictionary/gambit', for: 'Where the word comes from, and when it first appears in English.' },
  { label: "Wikipedia: King's Gambit", url: 'https://en.wikipedia.org/wiki/King%27s_Gambit', for: "The moves, the idea, and the 1497 Lucena book." },
  { label: "Wikipedia: Queen's Gambit", url: 'https://en.wikipedia.org/wiki/Queen%27s_Gambit', for: 'Why it is not a true gambit, and how old it is.' },
  { label: 'Wikipedia: Evans Gambit', url: 'https://en.wikipedia.org/wiki/Evans_Gambit', for: 'The idea, and the first game with it, in London in 1827.' },
  { label: 'Wikipedia: William Davies Evans', url: 'https://en.wikipedia.org/wiki/William_Davies_Evans', for: "The captain's life and his night lights for ships." },
  { label: 'Wikipedia: Immortal Game', url: 'https://en.wikipedia.org/wiki/Immortal_Game', for: 'The date, the place and the name.' },
  { label: 'ChessBase: Anderssen\'s Immortal Game', url: 'https://en.chessbase.com/post/175-years-anderssen-immortal', for: 'The story of the game.' },
  { label: "Wikipedia: King's Gambit, Fischer Defense", url: "https://en.wikipedia.org/wiki/King's_Gambit,_Fischer_Defense", for: 'Spassky against Fischer in 1960, and the 3...d6 defence.' },
  { label: 'Wikipedia: Blackburne Shilling Gambit', url: 'https://en.wikipedia.org/wiki/Blackburne_Shilling_Gambit', for: 'The trap, and the story behind the name.' },
  { label: 'Wikipedia: Englund Gambit', url: 'https://en.wikipedia.org/wiki/Englund_Gambit', for: 'Why strong players call it weak.' },
  { label: 'Wikipedia: Smith-Morra Gambit', url: 'https://en.wikipedia.org/wiki/Smith%E2%80%93Morra_Gambit', for: 'The idea of the gambit.' },
  { label: 'Wikipedia: Danish Gambit', url: 'https://en.wikipedia.org/wiki/Danish_Gambit', for: 'The idea of the gambit.' },
  { label: 'Wikipedia: Budapest Gambit', url: 'https://en.wikipedia.org/wiki/Budapest_Gambit', for: 'The first known game.' },
];
