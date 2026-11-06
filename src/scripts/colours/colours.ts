// The four colours page: three tables. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { COLOURS, COLOUR_NAMES, PAINT, clashes, fewest, greedy, island, mapSvg, order, search, used, wheel, type Layout } from '../../lib/colours';

const root = document.querySelector<HTMLElement>('[data-colours]');

/** Which regions are in a clash. */
function clashing(l: Layout, col: number[]): number[] {
  const out = new Set<number>();
  l.edges.forEach(([a, b]) => {
    if (col[a] >= 0 && col[a] === col[b]) {
      out.add(a);
      out.add(b);
    }
  });
  return [...out];
}

if (root) {
  initSoundButton(root);

  // Table 1: colour a map by hand. The regions are buttons in the picture.
  const ha = root.querySelector<HTMLElement>('[data-hand-tool]');
  if (ha) {
    const l = island();
    let col = l.regions.map(() => -1);
    let pen = 0;
    const g = q(ha, '[data-hand-g]');
    const status = q(ha, '[data-hand-status]');
    const say = () => {
      const n = clashes(l, col);
      const done = col.every((c) => c >= 0);
      status.textContent = done
        ? n === 0
          ? `All 11 regions are coloured with ${used(col)} colours and no two neighbours match. Well done.`
          : `All regions are coloured, but ${n} ${n === 1 ? 'pair of neighbours has' : 'pairs of neighbours have'} the same colour. They have a dark outline.`
        : `${col.filter((c) => c >= 0).length} of 11 regions coloured. ${n} ${n === 1 ? 'clash' : 'clashes'} so far. Pick a colour, then press a region.`;
    };
    const draw = () => {
      g.innerHTML = mapSvg(l, col, clashing(l, col), true);
      say();
    };
    const first = (i: number) => {
      draw();
      const el = g.querySelector<SVGElement>(`[data-i="${i}"]`);
      if (el) el.focus();
    };
    const set = (i: number) => {
      col[i] = col[i] === pen ? -1 : pen;
      sound.play('tick', 0.25);
      first(i);
    };
    g.addEventListener('click', (e) => {
      const t = (e.target as Element).closest('[data-i]');
      if (t) set(Number(t.getAttribute('data-i')));
    });
    g.addEventListener('keydown', (e) => {
      const ev = e as KeyboardEvent;
      if (ev.key !== 'Enter' && ev.key !== ' ') return;
      const t = (ev.target as Element).closest('[data-i]');
      if (!t) return;
      ev.preventDefault();
      set(Number(t.getAttribute('data-i')));
    });
    const sw = q(ha, '[data-hand-swatches]');
    COLOURS.slice(0, PAINT).forEach((c, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'swatch';
      b.style.background = c;
      b.textContent = String(i + 1);
      b.setAttribute('aria-label', `Colour ${i + 1}, ${COLOUR_NAMES[i]}`);
      b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      b.addEventListener('click', () => {
        pen = i;
        sw.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
        sound.play('tick', 0.2);
      });
      sw.appendChild(b);
    });
    q(ha, '[data-hand-clear]').addEventListener('click', () => {
      col = l.regions.map(() => -1);
      draw();
    });
    draw();
  }

  // Table 2: why three is sometimes not enough
  const wh = root.querySelector<HTMLElement>('[data-wheel-tool]');
  if (wh) {
    const range = q<HTMLInputElement>(wh, '[data-wheel-range]');
    const g = q(wh, '[data-wheel-g]');
    const status = q(wh, '[data-wheel-status]');
    const blank = () => {
      fillRange(range);
      const n = Number(range.value);
      q(wh, '[data-wheel-out]').textContent = String(n);
      const l = wheel(n);
      g.innerHTML = mapSvg(l, l.regions.map(() => -1));
      status.textContent = `A hub with ${n} ring regions needs ${fewest(l)} colours. Press Try three colours to see.`;
    };
    const run = (k: number) => {
      const n = Number(range.value);
      const l = wheel(n);
      const col = search(l, k);
      g.innerHTML = mapSvg(l, col ?? l.regions.map(() => -1));
      status.textContent = col
        ? `With ${k} colours the search found a colouring for the hub and ${n} ring regions.`
        : `With ${k} colours the search found no colouring at all, for the hub and ${n} ring regions. The ring has an odd number of regions, so it needs three colours by itself, and the hub needs a fourth.`;
      sound.play(col ? 'pop' : 'tick', 0.3);
    };
    range.addEventListener('input', blank);
    q(wh, '[data-wheel-three]').addEventListener('click', () => run(3));
    q(wh, '[data-wheel-four]').addEventListener('click', () => run(4));
    run(4);
  }

  // Table 3: a quick rule can waste colours
  const gr = root.querySelector<HTMLElement>('[data-greedy-tool]');
  if (gr) {
    const l = island();
    let seed = 1;
    const g = q(gr, '[data-greedy-g]');
    const status = q(gr, '[data-greedy-status]');
    const show = () => {
      const col = greedy(l, order(11, seed));
      const n = used(col);
      g.innerHTML = mapSvg(l, col);
      status.textContent = `On order ${seed} the quick rule used ${n} colours. ${n > 4 ? 'That is more than needed: four are always enough.' : 'That is the fewest possible for this map.'}`;
    };
    q(gr, '[data-greedy-new]').addEventListener('click', () => {
      seed += 1;
      show();
      sound.play('pop', 0.25);
    });
    q(gr, '[data-greedy-best]').addEventListener('click', () => {
      const col = search(l, fewest(l)) as number[];
      g.innerHTML = mapSvg(l, col);
      status.textContent = `A full search found a colouring with ${used(col)} colours, the fewest possible for this map. The quick rule can need more.`;
      sound.play('pop', 0.3);
    });
    show();
  }
}
