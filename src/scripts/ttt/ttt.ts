// The tic-tac-toe page: four slates. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { bestMoves, count, EMPTY, judge, movesOf, over, play, puzzles, SQUARE, turn, winner, WORD, type Board } from '../../lib/ttt';
import { boardHtml, type Mark } from '../../lib/tttview';

const root = document.querySelector<HTMLElement>('[data-ttt]');
const f = (n: number) => n.toLocaleString('en-US');
const name = (c: string) => (c === 'X' ? 'cross' : 'nought');

function press(buttons: NodeListOf<HTMLElement>, on: HTMLElement) {
  buttons.forEach((b) => b.setAttribute('aria-pressed', b === on ? 'true' : 'false'));
}

/** Moves of the player to move, marked with what they lead to. */
function marksOf(b: Board): Record<number, Mark> {
  const m: Record<number, Mark> = {};
  movesOf(b).forEach((i) => (m[i] = judge(b, i)));
  return m;
}

if (root) {
  initSoundButton(root);

  // Slate 1: play the machine
  const pl = root.querySelector<HTMLElement>('[data-play-tool]');
  if (pl) {
    const board = q(pl, '[data-play-board]');
    const status = q(pl, '[data-play-status]');
    const score = { won: 0, drawn: 0, lost: 0 };
    let b: Board = EMPTY;
    let me = 'X';
    let busy = false;
    let last = -1;

    const draw = () => {
      const live = !over(b) && !busy;
      board.innerHTML = boardHtml(b, { press: live ? movesOf(b) : [], last });
      if (over(b)) {
        const w = winner(b);
        const result = w === me ? 'won' : w ? 'lost' : 'drawn';
        score[result]++;
        status.textContent = w ? `${name(w)[0].toUpperCase()}${name(w).slice(1)} made a line. ${w === me ? 'You won, which the machine should not allow.' : 'The machine won.'} Press a button to play again.` : 'The grid is full and nobody made a line. A draw is the best you can get against this machine. Press a button to play again.';
        q(pl, '[data-play-score]').textContent = `Your games: ${score.won} won, ${score.drawn} drawn, ${score.lost} lost.`;
        sound.play(w === me ? 'good' : w ? 'bad' : 'pop', 0.5);
      }
    };

    const machine = () => {
      busy = true;
      draw();
      const best = bestMoves(b);
      const i = best[Math.floor(Math.random() * best.length)];
      window.setTimeout(() => {
        b = play(b, i);
        last = i;
        busy = false;
        sound.play('tick', 0.5);
        if (!over(b)) status.textContent = `The machine played the ${SQUARE[i]}. Your move.`;
        draw();
        board.querySelector<HTMLElement>('button')?.focus();
      }, 350);
    };

    board.addEventListener('click', (e) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cell]');
      if (!t || busy || over(b) || turn(b) !== me) return;
      const i = Number(t.getAttribute('data-cell'));
      b = play(b, i);
      last = i;
      sound.play('move', 0.5);
      if (over(b)) draw();
      else machine();
    });

    pl.querySelectorAll<HTMLElement>('[data-play-new]').forEach((btn) =>
      btn.addEventListener('click', () => {
        me = btn.getAttribute('data-play-new') || 'X';
        b = EMPTY;
        last = -1;
        busy = false;
        status.textContent = me === 'X' ? 'You are cross and you move first. Press a square.' : 'You are nought. The machine is cross and has moved first.';
        if (me === 'O') machine();
        else draw();
        board.querySelector<HTMLElement>('button')?.focus();
      }),
    );
  }

  // Slate 2: the first moves
  const op = root.querySelector<HTMLElement>('[data-opening-tool]');
  if (op) {
    const board = q(op, '[data-opening-board]');
    const status = q(op, '[data-opening-status]');
    const show = (o: number) => {
      const b = play(EMPTY, o);
      const marks = marksOf(b);
      const all = Object.values(marks);
      const d = all.filter((m) => m === 'draw').length;
      board.innerHTML = boardHtml(b, { marks, press: [0, 1, 2, 3, 4, 5, 6, 7, 8], last: o, attr: 'data-open' });
      const kind = o === 4 ? 'the centre' : o % 2 === 0 ? `the ${SQUARE[o]} corner` : `the ${SQUARE[o]} edge`;
      status.textContent = `Cross opens in ${kind}. The nought has ${d} ${d === 1 ? 'reply that draws' : 'replies that draw'} and ${all.length - d} that lose.`;
    };
    board.addEventListener('click', (e) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-open]');
      if (!t) return;
      const i = Number(t.getAttribute('data-open'));
      show(i);
      sound.play('tick', 0.4);
      q<HTMLElement>(board, `[data-open="${i}"]`).focus();
    });
    show(0);
  }

  // Slate 3: count every game
  const ct = root.querySelector<HTMLElement>('[data-count-tool]');
  if (ct) {
    const ends: number[] = JSON.parse(ct.getAttribute('data-ends') || '[]');
    const total = Number(ct.getAttribute('data-total'));
    const range = q<HTMLInputElement>(ct, '[data-count-range]');
    const draw = () => {
      fillRange(range);
      const k = Number(range.value);
      q(ct, '[data-count-out]').textContent = String(k);
      ct.querySelectorAll<HTMLElement>('[data-bar]').forEach((li) => li.classList.toggle('on', Number(li.getAttribute('data-bar')) === k));
      q(ct, '[data-count-status]').textContent = `${f(ends[k])} of the ${f(total)} games end on move ${k}, which is ${((ends[k] / total) * 100).toFixed(1)} in every 100. ${k === 9 ? 'These are the games that fill the grid, some with a line on the last move.' : 'Move ' + k + ' is the move that makes the line.'}`;
    };
    range.addEventListener('input', draw);
    q(ct, '[data-count-run]').addEventListener('click', () => {
      const t0 = performance.now();
      const c = count();
      const ms = Math.round(performance.now() - t0);
      q(ct, '[data-count-result]').textContent = `Your browser played out ${f(c.games)} games in ${ms} milliseconds and found ${f(c.positions)} positions, ${f(c.canonical)} when turned and mirrored copies count as one. ${c.games === total ? 'The numbers match.' : 'The numbers differ.'}`;
      sound.play('pop', 0.5);
    });
    draw();
  }

  // Slate 4: find the best move
  const be = root.querySelector<HTMLElement>('[data-best-tool]');
  if (be) {
    const board = q(be, '[data-best-board]');
    const status = q(be, '[data-best-status]');
    const picks = be.querySelectorAll<HTMLElement>('[data-best-pick]');
    let i = 0;
    let shown: Record<number, Mark> = {};
    let said = '';
    const intro = () => `${name(turn(puzzles[i]))[0].toUpperCase()}${name(turn(puzzles[i])).slice(1)} to move. Press the square you would play.`;
    const draw = () => {
      board.innerHTML = boardHtml(puzzles[i], { press: movesOf(puzzles[i]), marks: shown, attr: 'data-try' });
      status.textContent = said || intro();
    };
    const select = (n: number) => {
      i = n;
      shown = {};
      said = '';
      draw();
    };
    picks.forEach((p) =>
      p.addEventListener('click', () => {
        press(picks, p);
        select(Number(p.getAttribute('data-best-pick')));
      }),
    );
    board.addEventListener('click', (e) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-try]');
      if (!t) return;
      const m = Number(t.getAttribute('data-try'));
      const b = puzzles[i];
      const r = judge(b, m);
      shown = { ...shown, [m]: r };
      const best = bestMoves(b);
      said = `The ${SQUARE[m]}: it ${WORD[r]} with perfect play after it. ${best.includes(m) ? (best.length === 1 ? 'That is the only best move.' : 'That is one of the best moves.') : `A better move is the ${SQUARE[best[0]]}.`}`;
      draw();
      sound.play(best.includes(m) ? 'good' : 'bad', 0.4);
      q<HTMLElement>(board, `[data-try="${m}"]`).focus();
    });
    q(be, '[data-best-show]').addEventListener('click', () => {
      shown = marksOf(puzzles[i]);
      said = `Every move marked. Best: ${bestMoves(puzzles[i]).map((m) => SQUARE[m]).join(', ')}.`;
      draw();
    });
    select(0);
  }
}

