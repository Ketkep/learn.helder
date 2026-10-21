// Maths for the tic-tac-toe page: every position, its value under perfect play, the counts of games, and the best moves.
// A board is nine characters: a space, X or O. X always moves first.

export type Board = string;
export const EMPTY: Board = '         ';

const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

export function winner(b: Board): 'X' | 'O' | '' {
  for (const [a, c, d] of LINES) if (b[a] !== ' ' && b[a] === b[c] && b[a] === b[d]) return b[a] as 'X' | 'O';
  return '';
}

export const full = (b: Board) => !b.includes(' ');
export const over = (b: Board) => winner(b) !== '' || full(b);

export function turn(b: Board): 'X' | 'O' {
  return [...b].filter((c) => c === 'X').length === [...b].filter((c) => c === 'O').length ? 'X' : 'O';
}

export function movesOf(b: Board): number[] {
  return [...b].map((c, i) => (c === ' ' ? i : -1)).filter((i) => i >= 0);
}

export function play(b: Board, i: number): Board {
  return b.slice(0, i) + turn(b) + b.slice(i + 1);
}

const memo = new Map<Board, number>();

/** The result with perfect play from here: 1 if X wins, 0 for a draw, -1 if O wins. */
export function value(b: Board): number {
  const hit = memo.get(b);
  if (hit !== undefined) return hit;
  const w = winner(b);
  let v: number;
  if (w) v = w === 'X' ? 1 : -1;
  else if (full(b)) v = 0;
  else {
    const vs = movesOf(b).map((i) => value(play(b, i)));
    v = turn(b) === 'X' ? Math.max(...vs) : Math.min(...vs);
  }
  memo.set(b, v);
  return v;
}

/** What each move leads to for the player who makes it: 'win', 'draw' or 'lose', with perfect play after it. */
export function judge(b: Board, i: number): 'win' | 'draw' | 'lose' {
  const v = value(play(b, i));
  const me = turn(b) === 'X' ? 1 : -1;
  return v === me ? 'win' : v === 0 ? 'draw' : 'lose';
}

export function bestMoves(b: Board): number[] {
  const ms = movesOf(b);
  const rank = { win: 2, draw: 1, lose: 0 };
  const top = Math.max(...ms.map((i) => rank[judge(b, i)]));
  return ms.filter((i) => rank[judge(b, i)] === top);
}

export const WORD = { win: 'wins', draw: 'draws', lose: 'loses' } as const;

/** Every game, every position, and how they split by the number of moves. */
export function count() {
  const positions = new Set<Board>();
  const atPly: number[] = Array(10).fill(0);
  const endedAt: number[] = Array(10).fill(0);
  let games = 0;
  let xWins = 0;
  let oWins = 0;
  let draws = 0;
  const seen: Set<Board>[] = Array.from({ length: 10 }, () => new Set());
  const walk = (b: Board, ply: number) => {
    positions.add(b);
    seen[ply].add(b);
    if (over(b)) {
      games++;
      endedAt[ply]++;
      const w = winner(b);
      if (w === 'X') xWins++;
      else if (w === 'O') oWins++;
      else draws++;
      return;
    }
    for (const i of movesOf(b)) walk(play(b, i), ply + 1);
  };
  walk(EMPTY, 0);
  seen.forEach((s, k) => (atPly[k] = s.size));
  return { positions: positions.size, games, xWins, oWins, draws, atPly, endedAt, canonical: canonicalCount(positions) };
}

const SYMS: number[][] = (() => {
  const rot = [6, 3, 0, 7, 4, 1, 8, 5, 2];
  const flip = [2, 1, 0, 5, 4, 3, 8, 7, 6];
  const out: number[][] = [];
  let p = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  for (let r = 0; r < 4; r++) {
    out.push(p);
    out.push(p.map((i) => flip[i]));
    p = p.map((i) => rot[i]);
  }
  return out;
})();

function canonicalCount(all: Set<Board>): number {
  const s = new Set<Board>();
  for (const b of all) s.add(SYMS.map((m) => m.map((i) => b[i]).join('')).sort()[0]);
  return s.size;
}

let cached: ReturnType<typeof count> | undefined;

/** The counts, worked out once. The page script calls count() itself to show that it can. */
export const counts = () => (cached ??= count());

/** Positions to practise on: X or O to move, and one or more best moves. */
export const puzzles: Board[] = ['XOXOX O  ', 'XOXO X   ', 'XOX      ', 'XO X  O  ', 'XOX   O  '];

export const SQUARE = ['top left', 'top middle', 'top right', 'middle left', 'centre', 'middle right', 'bottom left', 'bottom middle', 'bottom right'];
