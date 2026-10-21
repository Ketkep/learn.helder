// Drawing the board for the tic-tac-toe page. The same text is made at build time (Astro) and in the browser.

import type { Board } from './ttt';
import { SQUARE } from './ttt';

export type Mark = 'win' | 'draw' | 'lose';
export const MARK_TEXT: Record<Mark, string> = { win: 'win', draw: 'draw', lose: 'loss' };

const X = '<svg class="piece x" viewBox="0 0 40 40" aria-hidden="true"><path d="M8 7 L33 33 M33 8 L7 32" /></svg>';
const O = '<svg class="piece o" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 6 C29 5 35 12 34 21 C33 30 26 35 18 34 C10 33 5 27 6 19 C7 12 13 6 21 7" /></svg>';

export interface View {
  /** Cells that can be pressed. Without it, the board is a picture. */
  press?: number[];
  /** A word shown in a cell, by cell. */
  marks?: Record<number, Mark>;
  /** The cell that was last played. */
  last?: number;
  /** A name for the data attribute that the buttons carry. */
  attr?: string;
}

/** The nine cells as text. Pieces and marks always have a word as well as a colour. */
export function boardHtml(b: Board, v: View = {}): string {
  const attr = v.attr ?? 'data-cell';
  return [...b]
    .map((c, i) => {
      const mark = v.marks?.[i];
      const piece = c === 'X' ? X : c === 'O' ? O : '';
      const word = mark ? `<span class="mk ${mark}">${MARK_TEXT[mark]}</span>` : '';
      const name = `${SQUARE[i]}: ${c === ' ' ? 'empty' : c === 'X' ? 'cross' : 'nought'}${mark ? `, ${MARK_TEXT[mark]}` : ''}`;
      const cls = `cell${v.last === i ? ' last' : ''}${mark ? ` m-${mark}` : ''}`;
      const inner = piece + word;
      return v.press && v.press.includes(i)
        ? `<button type="button" class="${cls}" ${attr}="${i}" aria-label="${name}">${inner}</button>`
        : `<div class="${cls}" role="img" aria-label="${name}">${inner}</div>`;
    })
    .join('');
}
