// The Nim page: four things to try. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { clear, fillRange, q, reducedMotion } from '../util';
import { anyMove, apply, bestMove, bits, classic, columns, type Heaps, nimSum, normalMove, puzzles, total } from '../../lib/nim';

const root = document.querySelector<HTMLElement>('[data-nim]');

function press(buttons: NodeListOf<HTMLElement>, on: HTMLElement) {
  buttons.forEach((b) => b.setAttribute('aria-pressed', b === on ? 'true' : 'false'));
}

/** Turn a picture of heaps into rows of buttons. Taking stick k takes it and all the sticks to its right. */
function drawHeaps(box: HTMLElement, heaps: Heaps, enabled: boolean, pick: (heap: number, take: number) => void) {
  box.querySelectorAll<HTMLElement>('[data-heap]').forEach((row) => {
    const i = Number(row.getAttribute('data-heap'));
    const wrap = q<HTMLElement>(row, '.sticks');
    clear(wrap);
    wrap.removeAttribute('role');
    wrap.removeAttribute('aria-label');
    for (let k = 1; k <= heaps[i]; k++) {
      const take = heaps[i] - k + 1;
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'stick';
      b.disabled = !enabled;
      b.setAttribute('aria-label', `Take ${take} stick${take === 1 ? '' : 's'} from heap ${i + 1}`);
      const mark = (on: boolean) => {
        const all = wrap.querySelectorAll('.stick');
        for (let j = k - 1; j < all.length; j++) all[j].classList.toggle('hot', on);
      };
      b.addEventListener('mouseenter', () => mark(true));
      b.addEventListener('mouseleave', () => mark(false));
      b.addEventListener('focus', () => mark(true));
      b.addEventListener('blur', () => mark(false));
      b.addEventListener('click', () => pick(i, take));
      wrap.appendChild(b);
    }
    if (!heaps[i]) {
      const e = document.createElement('span');
      e.className = 'empty';
      e.textContent = 'empty';
      wrap.appendChild(e);
    }
  });
}

const sticks = (n: number) => `${n} stick${n === 1 ? '' : 's'}`;

if (root) {
  initSoundButton(root);

  // Tries 1 and 4: play the machine
  root.querySelectorAll<HTMLElement>('[data-play-tool]').forEach((tool) => {
    const misere = tool.getAttribute('data-play-tool') === 'misere';
    const box = q<HTMLElement>(tool, '[data-heaps]');
    const status = q<HTMLElement>(tool, '[data-status]');
    const opts = tool.querySelectorAll<HTMLElement>('[data-opt]');
    let heaps: Heaps = classic.slice();
    let over = false;
    let busy = false;
    let machineFirst = false;
    let perfect = false;
    let seed = 7;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };

    const draw = () => drawHeaps(box, heaps, !over && !busy, play);
    const nimNote = () => (total(heaps) ? ` The nim-sum is now ${nimSum(heaps)}.` : '');

    const finish = (youTookLast: boolean) => {
      over = true;
      const youWin = misere ? !youTookLast : youTookLast;
      status.textContent = `${youTookLast ? 'You took' : 'The machine took'} the last stick, so ${youWin ? 'you win' : 'the machine wins'}. Press new game to play again.`;
      sound.play(youWin ? 'good' : 'thud', 0.5);
    };

    const machine = () => {
      busy = false;
      const m = (perfect ? bestMove(heaps, misere) : null) || anyMove(heaps, rnd());
      heaps = apply(heaps, m);
      draw();
      if (!total(heaps)) return finish(false);
      status.textContent = `The machine takes ${sticks(m.take)} from heap ${m.heap + 1}.${nimNote()} Your move.`;
      sound.play('tick', 0.4);
    };

    function play(heap: number, take: number) {
      if (over || busy) return;
      heaps = apply(heaps, { heap, take });
      sound.play('pop', 0.4);
      if (!total(heaps)) {
        draw();
        return finish(true);
      }
      busy = true;
      status.textContent = `You take ${sticks(take)} from heap ${heap + 1}.${nimNote()}`;
      draw();
      if (reducedMotion()) machine();
      else setTimeout(machine, 500);
    }

    const start = () => {
      heaps = classic.slice();
      over = false;
      busy = false;
      status.textContent = machineFirst ? '' : `Heaps of 1, 3, 5 and 7 sticks. ${misere ? 'The player who takes the last stick loses.' : 'Take the last stick to win.'} Your move.`;
      if (machineFirst) {
        busy = true;
        machine();
      } else draw();
    };

    opts.forEach((b) =>
      b.addEventListener('click', () => {
        const o = b.getAttribute('data-opt') || '';
        press(tool.querySelectorAll<HTMLElement>(`[data-opt^="${o.split('-')[0]}"]`), b);
        if (o.startsWith('first')) machineFirst = o === 'first-machine';
        else perfect = o === 'skill-perfect';
        start();
      }),
    );
    q(tool, '[data-new]').addEventListener('click', start);
    start();
  });

  // Try 2: add in binary
  const bin = root.querySelector<HTMLElement>('[data-binary-tool]');
  if (bin) {
    const ranges = bin.querySelectorAll<HTMLInputElement>('[data-binary-range]');
    const body = q(bin, '[data-binary-body]');
    const foot = q(bin, '[data-binary-foot]');
    const cell = (b: string) => `<td class="${b === '1' ? 'one' : 'zero'}">${b}</td>`;
    const draw = () => {
      const h = Array.from(ranges).map((r) => Number(r.value));
      ranges.forEach((r, i) => {
        fillRange(r);
        q(bin, `[data-binary-out="${i}"]`).textContent = String(h[i]);
      });
      body.innerHTML = h.map((n, i) => `<tr><th scope="row">${i + 1}</th><td>${n}</td>${bits(n).split('').map(cell).join('')}</tr>`).join('');
      foot.innerHTML = `<tr><th scope="row" colspan="2">Nim-sum</th>${columns(h).map((c) => cell(String(c % 2))).join('')}</tr>`;
      const s = nimSum(h);
      q(bin, '[data-binary-status]').textContent = `The heaps ${h.join(', ')} have a nim-sum of ${s}. ${
        !total(h) ? 'There are no sticks left.' : s === 0 ? 'With a nim-sum of zero, the player to move loses against perfect play.' : 'With a nim-sum that is not zero, the player to move can win by making it zero.'
      }`;
    };
    ranges.forEach((r) => r.addEventListener('input', draw));
    draw();
  }

  // Try 3: find the move
  const hunt = root.querySelector<HTMLElement>('[data-hunt-tool]');
  if (hunt) {
    const all = puzzles();
    let n = 0;
    let heap = 0;
    const take = q<HTMLInputElement>(hunt, '[data-hunt-take]');
    const picks = hunt.querySelectorAll<HTMLElement>('[data-hunt-heap]');
    const status = q<HTMLElement>(hunt, '[data-hunt-status]');
    const box = q<HTMLElement>(hunt, '[data-heaps]');
    const show = () => {
      const h = all[n];
      drawHeaps(box, h, false, () => {});
      take.max = String(Math.max(1, h[heap]));
      if (Number(take.value) > Number(take.max)) take.value = take.max;
      fillRange(take);
      q(hunt, '[data-hunt-out]').textContent = take.value;
    };
    const intro = () => {
      const h = all[n];
      status.textContent = `The heaps ${h.join(', ')} have a nim-sum of ${nimSum(h)}. In binary: ${h.map(bits).join(', ')}. Find a move that makes the nim-sum zero.`;
    };
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        heap = Number(b.getAttribute('data-hunt-heap'));
        press(picks, b);
        show();
      }),
    );
    take.addEventListener('input', show);
    q(hunt, '[data-hunt-check]').addEventListener('click', () => {
      const h = all[n];
      const t = Number(take.value);
      if (t > h[heap]) {
        status.textContent = `Heap ${heap + 1} has only ${sticks(h[heap])}.`;
        return;
      }
      const after = apply(h, { heap, take: t });
      const s = nimSum(after);
      const win = normalMove(h)!;
      if (s === 0) {
        status.textContent = `Yes. Taking ${sticks(t)} from heap ${heap + 1} leaves ${after.join(', ')}, and the nim-sum is zero. You are now the one who wins against perfect play.`;
        sound.play('good', 0.5);
      } else {
        status.textContent = `Not yet. That leaves ${after.join(', ')}, and the nim-sum is ${s}, not zero. Try again. Hint: the winning move is in heap ${win.heap + 1}.`;
        sound.play('thud', 0.4);
      }
    });
    q(hunt, '[data-hunt-next]').addEventListener('click', () => {
      n = (n + 1) % all.length;
      heap = 0;
      press(picks, picks[0]);
      take.value = '1';
      show();
      intro();
    });
    show();
  }
}
