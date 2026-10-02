// Turns a list of moves into everything the page needs, once, at build time:
// the board after every move, how each piece moved, and the numbers for the ledger.
// The browser never runs a chess engine. It only plays back what is computed here.
import { Chess, type Color, type PieceSymbol, type Square } from 'chess.js';

export interface Ply {
  san: string;
  from: Square;
  to: Square;
  piece: PieceSymbol;
  color: Color;
  /** The piece that was taken, and the square it stood on (differs from `to` for en passant). */
  cap?: { sq: Square; piece: PieceSymbol; color: Color };
  /** For castling: where the rook went. */
  rook?: { from: Square; to: Square };
  promo?: PieceSymbol;
  check: boolean;
  mate: boolean;
  /** The board after this move. */
  fen: string;
}

export interface Ledger {
  /** Material: pawn 1, knight 3, bishop 3, rook 5, queen 9. */
  m: number[];
  /** How many of d4, e4, d5, e5 a side holds (stands on or attacks). */
  c: number[];
  /** Squares around a king (and its own) that the other side attacks. */
  k: number[];
}

export interface LineData {
  start: string;
  plies: Ply[];
  /** One entry per position: index 0 is the start, index n is after move n. */
  ledger: Ledger;
}

export interface LineOptions {
  /** The side that gives the pawn. Numbers are positive when they are good for this side. */
  side?: Color;
  /** Whose king the `k` number is about. */
  kingOf?: Color;
}

const VALUE: Record<PieceSymbol, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const CENTRE: Square[] = ['d4', 'e4', 'd5', 'e5'];
const FILES = 'abcdefgh';

function neighbours(sq: Square): Square[] {
  const f = FILES.indexOf(sq[0]);
  const r = Number(sq[1]);
  const out: Square[] = [];
  for (let df = -1; df <= 1; df++) {
    for (let dr = -1; dr <= 1; dr++) {
      const nf = f + df;
      const nr = r + dr;
      if (nf >= 0 && nf < 8 && nr >= 1 && nr <= 8) out.push((FILES[nf] + nr) as Square);
    }
  }
  return out;
}

function material(game: Chess, color: Color): number {
  let sum = 0;
  for (const row of game.board()) {
    for (const p of row) if (p && p.color === color) sum += VALUE[p.type];
  }
  return sum;
}

function centreHeld(game: Chess, color: Color): number {
  let n = 0;
  for (const sq of CENTRE) {
    const here = game.get(sq);
    if ((here && here.color === color) || game.attackers(sq, color).length > 0) n++;
  }
  return n;
}

function kingSquare(game: Chess, color: Color): Square | null {
  for (const row of game.board()) {
    for (const p of row) if (p && p.type === 'k' && p.color === color) return p.square;
  }
  return null;
}

function kingDanger(game: Chess, color: Color): number {
  const ks = kingSquare(game, color);
  if (!ks) return 0;
  const other: Color = color === 'w' ? 'b' : 'w';
  return neighbours(ks).filter((sq) => game.attackers(sq, other).length > 0).length;
}

function snapshot(game: Chess, side: Color, kingOf: Color) {
  const sign = side === 'w' ? 1 : -1;
  const other: Color = side === 'w' ? 'b' : 'w';
  const danger = kingDanger(game, kingOf);
  return {
    m: material(game, side) - material(game, other),
    c: centreHeld(game, side) - centreHeld(game, other),
    // Danger to the other side's king is good for us. Danger to our own king is bad.
    k: kingOf === side ? -danger : danger,
    sign,
  };
}

/** Plays `moves` (standard notation, no move numbers) from `start` and records every step. */
export function analyzeLine(moves: string[], opts: LineOptions = {}, start?: string): LineData {
  const side: Color = opts.side ?? 'w';
  const kingOf: Color = opts.kingOf ?? (side === 'w' ? 'b' : 'w');
  const game = start ? new Chess(start) : new Chess();
  const startFen = game.fen();
  const ledger: Ledger = { m: [], c: [], k: [] };
  const push = () => {
    const s = snapshot(game, side, kingOf);
    ledger.m.push(s.m);
    ledger.c.push(s.c);
    ledger.k.push(s.k);
  };
  push();

  const plies: Ply[] = [];
  for (const san of moves) {
    let move;
    try {
      move = game.move(san);
    } catch {
      throw new Error(`Illegal move "${san}" after ${plies.map((p) => p.san).join(' ') || 'the start'}`);
    }
    const ply: Ply = {
      san: move.san,
      from: move.from,
      to: move.to,
      piece: move.piece,
      color: move.color,
      check: game.inCheck(),
      mate: game.isCheckmate(),
      fen: game.fen(),
    };
    if (move.captured) {
      const sq = move.isEnPassant() ? (`${move.to[0]}${move.from[1]}` as Square) : move.to;
      ply.cap = { sq, piece: move.captured, color: move.color === 'w' ? 'b' : 'w' };
    }
    if (move.isKingsideCastle()) ply.rook = move.color === 'w' ? { from: 'h1', to: 'f1' } : { from: 'h8', to: 'f8' };
    if (move.isQueensideCastle()) ply.rook = move.color === 'w' ? { from: 'a1', to: 'd1' } : { from: 'a8', to: 'd8' };
    if (move.promotion) ply.promo = move.promotion;
    plies.push(ply);
    push();
  }
  return { start: startFen, plies, ledger };
}

/** Every legal move in a position, as { from: [to, ...] }. Used where the reader makes a move. */
export function legalMap(fen: string): Record<string, string[]> {
  const game = new Chess(fen);
  const out: Record<string, string[]> = {};
  for (const m of game.moves({ verbose: true })) (out[m.from] ??= []).push(m.to);
  return out;
}

/** The position after a list of moves, as a FEN string. */
export function fenAfter(moves: string[]): string {
  const game = new Chess();
  for (const m of moves) game.move(m);
  return game.fen();
}
