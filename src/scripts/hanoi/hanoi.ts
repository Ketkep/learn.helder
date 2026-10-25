// The Towers of Hanoi page: four altars. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { binary, boardSvg, clone, diskOnMove, fewest, legal, move, movesText, NAMES, type Pegs, solution, solved, start, timesMoved, yearsText } from '../../lib/hanoi';

const root = document.querySelector<HTMLElement>('[data-hanoi]');

if (root) {
  initSoundButton(root);

  // Altar 1: play it
  const pl = root.querySelector<HTMLElement>('[data-play-tool]');
  if (pl) {
    const range = q<HTMLInputElement>(pl, '[data-play-range]');
    const pegs = pl.querySelectorAll<HTMLElement>('[data-play-peg]');
    let n = 3;
    let state: Pegs = start(n);
    let from = -1;
    let moves = 0;
    let said = '';
    const draw = () => {
      fillRange(range);
      q(pl, '[data-play-n]').textContent = String(n);
      q(pl, '[data-play-g]').innerHTML = boardSvg(state, n, from);
      pegs.forEach((b, i) => b.setAttribute('aria-pressed', from === i ? 'true' : 'false'));
      q(pl, '[data-play-status]').textContent = said;
    };
    const reset = (text?: string) => {
      state = start(n);
      from = -1;
      moves = 0;
      said = text ?? `${n} disks on peg A. Move them all to peg C. The fewest moves is ${fewest(n)}.`;
      draw();
    };
    pegs.forEach((b) =>
      b.addEventListener('click', () => {
        const i = Number(b.getAttribute('data-play-peg'));
        if (solved(state, n)) return;
        if (from < 0) {
          if (!state[i].length) {
            said = `Peg ${NAMES[i]} is empty. Pick a peg with a disk.`;
          } else {
            from = i;
            said = `Picked up the top disk of peg ${NAMES[i]}. Press the peg where it should go.`;
          }
        } else if (from === i) {
          from = -1;
          said = 'Put it back. Pick a peg.';
        } else if (!legal(state, from, i)) {
          said = 'A bigger disk cannot go on a smaller one. Try another peg.';
          sound.play('bad', 0.3);
        } else {
          state = move(state, from, i);
          moves++;
          from = -1;
          sound.play('tick', 0.4);
          if (solved(state, n)) {
            said = `Solved in ${moves} moves. The fewest possible is ${fewest(n)}. ${moves === fewest(n) ? 'You found the best way.' : `That is ${moves - fewest(n)} more than needed.`}`;
            sound.play('good', 0.5);
          } else said = `${moves} move${moves === 1 ? '' : 's'} so far. The fewest possible is ${fewest(n)}.`;
        }
        draw();
      }),
    );
    range.addEventListener('input', () => {
      n = Number(range.value);
      reset();
    });
    q(pl, '[data-play-reset]').addEventListener('click', () => reset());
    reset();
  }

  // Altar 2: watch the best way
  const wa = root.querySelector<HTMLElement>('[data-watch-tool]');
  if (wa) {
    const range = q<HTMLInputElement>(wa, '[data-watch-range]');
    const log = q(wa, '[data-watch-log]');
    let n = 3;
    let list = solution(n);
    let i = 0;
    let state: Pegs = start(n);
    const draw = () => {
      fillRange(range);
      q(wa, '[data-watch-n]').textContent = String(n);
      q(wa, '[data-watch-g]').innerHTML = boardSvg(state, n);
      log.innerHTML = list.slice(0, i).map(([a, b]) => `<li>Peg ${NAMES[a]} to peg ${NAMES[b]}</li>`).join('');
      const mid = (list.length + 1) / 2;
      q(wa, '[data-watch-status]').textContent = i === 0
        ? `The best solution for ${n} disks has ${list.length} moves.`
        : i === list.length
          ? `Done in ${list.length} moves. The biggest disk moved once, on move ${mid}.`
          : `Move ${i} of ${list.length}: peg ${NAMES[list[i - 1][0]]} to peg ${NAMES[list[i - 1][1]]}.${i === mid ? ' This is the biggest disk, the only time it moves.' : ''}`;
    };
    const reset = () => {
      list = solution(n);
      i = 0;
      state = start(n);
      draw();
    };
    q(wa, '[data-watch-next]').addEventListener('click', () => {
      if (i >= list.length) return;
      const [a, b] = list[i];
      state = move(clone(state), a, b);
      i++;
      sound.play('tick', 0.3);
      draw();
    });
    q(wa, '[data-watch-reset]').addEventListener('click', reset);
    range.addEventListener('input', () => {
      n = Number(range.value);
      reset();
    });
    reset();
  }

  // Altar 3: count the moves
  const co = root.querySelector<HTMLElement>('[data-count-tool]');
  if (co) {
    const range = q<HTMLInputElement>(co, '[data-count-range]');
    const draw = () => {
      fillRange(range);
      const n = Number(range.value);
      q(co, '[data-count-out]').textContent = String(n);
      q(co, '[data-count-status]').textContent = `${n} disk${n === 1 ? '' : 's'} need${n === 1 ? 's' : ''} at least ${movesText(n)} move${n === 1 ? '' : 's'}. At one move a second that takes ${yearsText(n)}.${n === 64 ? ' That is the legend of the temple.' : ''}`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Altar 4: which disk moves
  const ru = root.querySelector<HTMLElement>('[data-ruler-tool]');
  if (ru) {
    const range = q<HTMLInputElement>(ru, '[data-ruler-range]');
    const body = q(ru, '[data-ruler-body]');
    const draw = () => {
      fillRange(range);
      const k = Number(range.value);
      q(ru, '[data-ruler-out]').textContent = String(k);
      const d = diskOnMove(k);
      body.querySelectorAll('tr').forEach((tr, i) => tr.classList.toggle('on', i === k - 1));
      q(ru, '[data-ruler-status]').textContent = `Move ${k} is ${binary(k, 4)} in binary. The lowest 1 is in place ${d}, so disk ${d} moves${d === 1 ? ', the smallest' : ''}. In a game of four disks, disk ${d} moves ${timesMoved(4, d)} time${timesMoved(4, d) === 1 ? '' : 's'} in all.`;
    };
    range.addEventListener('input', draw);
    draw();
  }
}
