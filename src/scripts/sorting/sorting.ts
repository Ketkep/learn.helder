// The sorting page: three trays. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { clear, fillRange, q } from '../util';
import { METHODS, barsSvg, costSvg, countCompares, floorCompares, fmt, frames, inversions, quadratic, shuffled, type Frame, type Method } from '../../lib/sorting';

const root = document.querySelector<HTMLElement>('[data-sorting]');

/** A row of buttons, one of which is chosen. */
function picks(host: Element, labels: string[], start: string, on: (v: string) => void) {
  labels.forEach((l) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pick';
    b.textContent = l;
    b.setAttribute('aria-pressed', l === start ? 'true' : 'false');
    b.addEventListener('click', () => {
      host.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      on(l);
      sound.play('tick', 0.3);
    });
    host.appendChild(b);
  });
}

if (root) {
  initSoundButton(root);

  // Tray 1: sort a row by hand. The bars are buttons: pressing one swaps it with its right neighbour.
  const ha = root.querySelector<HTMLElement>('[data-hand-tool]');
  if (ha) {
    let seed = 1;
    let row = shuffled(8, seed);
    let best = inversions(row);
    let swaps = 0;
    const host = q(ha, '[data-hand-host]');
    const status = q(ha, '[data-hand-status]');
    const paint = (bars: HTMLButtonElement[]) => {
      row.forEach((v, i) => {
        bars[i].style.height = `${(v / 8) * 100}%`;
        bars[i].setAttribute('aria-label', `Bar ${i + 1} of 8, height ${v}. Press to swap with the bar on its right.`);
        bars[i].disabled = i === 7;
      });
    };
    const build = () => {
      clear(host);
      const wrap = document.createElement('div');
      wrap.className = 'bars';
      const bars: HTMLButtonElement[] = [];
      row.forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'barbtn';
        b.addEventListener('click', () => {
          [row[i], row[i + 1]] = [row[i + 1], row[i]];
          swaps += 1;
          paint(bars);
          sound.play('tick', 0.25);
          const left = inversions(row);
          status.textContent =
            left === 0
              ? `Sorted in ${swaps} ${swaps === 1 ? 'swap' : 'swaps'}. The fewest possible was ${best}. ${swaps === best ? 'You matched it.' : swaps > best ? `You used ${swaps - best} more than needed.` : ''}`
              : `${swaps} ${swaps === 1 ? 'swap' : 'swaps'} so far. ${left} wrong ${left === 1 ? 'pair' : 'pairs'} left, and the fewest swaps possible from the start was ${best}.`;
        });
        bars.push(b);
        wrap.appendChild(b);
      });
      host.appendChild(wrap);
      paint(bars);
    };
    const fresh = () => {
      seed += 1;
      row = shuffled(8, seed);
      best = inversions(row);
      swaps = 0;
      build();
      status.textContent = `This row has ${best} wrong ${best === 1 ? 'pair' : 'pairs'}, so at least ${best} ${best === 1 ? 'swap' : 'swaps'} of neighbours ${best === 1 ? 'is' : 'are'} needed.`;
    };
    q(ha, '[data-hand-new]').addEventListener('click', () => {
      fresh();
      sound.play('pop', 0.25);
    });
    seed = 0;
    fresh();
  }

  // Tray 2: three methods on one list
  const wa = root.querySelector<HTMLElement>('[data-watch-tool]');
  if (wa) {
    let method: Method = 'Bubble';
    let seed = 3;
    let list = shuffled(12, seed);
    let fr: Frame[] = [];
    let at = 0;
    let timer = 0;
    const run1 = q<HTMLButtonElement>(wa, '[data-watch-run]');
    const show = () => {
      const f = fr[at];
      q(wa, '[data-watch-g]').innerHTML = barsSvg(f.list, f.mark, `${method} sort: ${f.compares} comparisons, ${f.moves} moves`);
      q(wa, '[data-watch-status]').textContent = `${f.note} Step ${at} of ${fr.length - 1}.${at === fr.length - 1 ? ` Sorted with ${f.compares} comparisons and ${f.moves} moves.` : ''}`;
    };
    const stop = () => {
      window.clearInterval(timer);
      timer = 0;
      run1.textContent = 'Run';
      run1.setAttribute('aria-pressed', 'false');
    };
    const reset = () => {
      stop();
      fr = frames(method, list);
      at = 0;
      show();
    };
    const step = () => {
      if (at < fr.length - 1) {
        at += 1;
        show();
      } else stop();
    };
    picks(q(wa, '[data-watch-picks]'), METHODS.map((m) => `${m} sort`), 'Bubble sort', (v) => {
      method = v.split(' ')[0] as Method;
      reset();
    });
    q(wa, '[data-watch-step]').addEventListener('click', () => {
      stop();
      step();
    });
    run1.addEventListener('click', () => {
      if (timer) {
        stop();
        return;
      }
      run1.textContent = 'Stop';
      run1.setAttribute('aria-pressed', 'true');
      timer = window.setInterval(step, 140);
    });
    q(wa, '[data-watch-reset]').addEventListener('click', reset);
    q(wa, '[data-watch-new]').addEventListener('click', () => {
      seed += 1;
      list = shuffled(12, seed);
      reset();
      sound.play('pop', 0.25);
    });
    reset();
  }

  // Tray 3: how the work grows
  const gr = root.querySelector<HTMLElement>('[data-grow-tool]');
  if (gr) {
    const range = q<HTMLInputElement>(gr, '[data-grow-range]');
    const draw = () => {
      fillRange(range);
      const n = Number(range.value);
      q(gr, '[data-grow-out]').textContent = String(n);
      const list = shuffled(n, 5);
      const b = countCompares('Bubble', list);
      const i = countCompares('Insertion', list);
      const m = countCompares('Merge', list);
      q(gr, '[data-grow-g]').innerHTML = costSvg([
        { name: 'Bubble', value: b },
        { name: 'Insertion', value: i },
        { name: 'Merge', value: m },
      ]);
      q(gr, '[data-grow-status]').textContent = `On ${n} shuffled items merge sort makes ${fmt(m)} comparisons, insertion sort ${fmt(i)} and bubble sort ${fmt(b)}. Bubble or insertion sort can need up to ${fmt(quadratic(n))}. No comparing method can always do better than ${fmt(floorCompares(n))}.`;
    };
    range.addEventListener('input', draw);
    draw();
  }
}
