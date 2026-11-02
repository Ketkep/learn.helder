// The Game of Life page: three sheets. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { clear, q } from '../util';
import { PATTERNS, fate, make, neighbours, popSvg, population, run, soup, step, withPattern, type Board } from '../../lib/life';

const root = document.querySelector<HTMLElement>('[data-life]');

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

/** A sheet of squares you can click. The arrow keys move between squares. Returns a function that paints a board. */
function sheet(host: Element, w: number, h: number, label: string, flip: (x: number, y: number) => void, mid?: [number, number]) {
  clear(host);
  const grid = document.createElement('div');
  grid.className = 'grid';
  grid.setAttribute('role', 'group');
  grid.setAttribute('aria-label', label);
  grid.style.setProperty('--cols', String(w));
  const cells: HTMLButtonElement[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const c = document.createElement('button');
      c.type = 'button';
      c.className = 'cell' + (mid && mid[0] === x && mid[1] === y ? ' mid' : '');
      c.setAttribute('aria-label', `Row ${y + 1}, column ${x + 1}`);
      c.setAttribute('aria-pressed', 'false');
      c.tabIndex = x === 0 && y === 0 ? 0 : -1;
      c.addEventListener('click', () => {
        flip(x, y);
        sound.play('tick', 0.2);
      });
      c.addEventListener('keydown', (e) => {
        const d: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
        const m = d[e.key];
        if (!m) return;
        e.preventDefault();
        const nx = Math.max(0, Math.min(w - 1, x + m[0]));
        const ny = Math.max(0, Math.min(h - 1, y + m[1]));
        cells.forEach((k) => (k.tabIndex = -1));
        const t = cells[ny * w + nx];
        t.tabIndex = 0;
        t.focus();
      });
      cells.push(c);
      grid.appendChild(c);
    }
  }
  host.appendChild(grid);
  return (b: Board) => b.cells.forEach((v, i) => cells[i].setAttribute('aria-pressed', v ? 'true' : 'false'));
}

if (root) {
  initSoundButton(root);

  // Sheet 1: the rule for one square
  const ru = root.querySelector<HTMLElement>('[data-rule-tool]');
  if (ru) {
    let b = make(7, 7);
    [[2, 2], [4, 2], [3, 4], [3, 3]].forEach(([x, y]) => (b.cells[y * 7 + x] = 1));
    const status = q(ru, '[data-rule-status]');
    let after = '';
    const say = () => {
      const alive = b.cells[3 * 7 + 3] === 1;
      const n = neighbours(b, 3, 3, false);
      const f = fate(alive, n);
      status.textContent = `${after}The middle square is ${alive ? 'alive' : 'empty'} and has ${n} live ${n === 1 ? 'neighbour' : 'neighbours'}, so it ${f.why}.`;
      after = '';
    };
    const paint = sheet(q(ru, '[data-rule-host]'), 7, 7, 'A seven by seven sheet of squares. The marked square is in the middle.', (x, y) => {
      b.cells[y * 7 + x] ^= 1;
      paint(b);
      say();
    }, [3, 3]);
    q(ru, '[data-rule-next]').addEventListener('click', () => {
      b = step(b, false);
      paint(b);
      after = 'Next round. ';
      say();
      sound.play('pop', 0.25);
    });
    q(ru, '[data-rule-clear]').addEventListener('click', () => {
      b = make(7, 7);
      paint(b);
      say();
    });
    paint(b);
    say();
  }

  // Sheet 2: patterns that stay, blink or walk
  const pa = root.querySelector<HTMLElement>('[data-patterns-tool]');
  if (pa) {
    let cur = PATTERNS[4];
    let b = withPattern(cur, 24, 16);
    let gen = 0;
    let timer = 0;
    const run1 = q<HTMLButtonElement>(pa, '[data-patterns-run]');
    const say = () => {
      q(pa, '[data-patterns-status]').textContent = `${cur.name}: ${cur.words} Round ${gen}, ${population(b)} live squares.`;
    };
    const paint = sheet(q(pa, '[data-patterns-host]'), 24, 16, 'A sheet of squares, 24 across and 16 down, which wraps round at the edges.', (x, y) => {
      b.cells[y * 24 + x] ^= 1;
      paint(b);
      say();
    });
    const stop = () => {
      window.clearInterval(timer);
      timer = 0;
      run1.textContent = 'Run';
      run1.setAttribute('aria-pressed', 'false');
    };
    const next = () => {
      b = step(b, true);
      gen += 1;
      paint(b);
      say();
    };
    const reset = () => {
      stop();
      b = withPattern(cur, 24, 16);
      gen = 0;
      paint(b);
      say();
    };
    picks(q(pa, '[data-patterns-picks]'), PATTERNS.map((p) => p.name), cur.name, (n) => {
      cur = PATTERNS.filter((p) => p.name === n)[0];
      reset();
    });
    q(pa, '[data-patterns-next]').addEventListener('click', () => {
      stop();
      next();
    });
    run1.addEventListener('click', () => {
      if (timer) {
        stop();
        return;
      }
      run1.textContent = 'Stop';
      run1.setAttribute('aria-pressed', 'true');
      timer = window.setInterval(() => {
        next();
        if (gen >= 1500) stop();
      }, 140);
    });
    q(pa, '[data-patterns-reset]').addEventListener('click', reset);
    paint(b);
    say();
  }

  // Sheet 3: a soup of random squares
  const so = root.querySelector<HTMLElement>('[data-soup-tool]');
  if (so) {
    let share = 0.3;
    let seed = 1;
    let b = soup(24, 16, share, seed);
    let hist = [population(b)];
    let settled = -1;
    const status = q(so, '[data-soup-status]');
    const graph = q(so, '[data-soup-g]');
    const say = (extra: string) => {
      graph.innerHTML = popSvg(hist, Math.max(...hist));
      const last = hist.length - 1;
      status.textContent = `${extra}Round ${last}: ${hist[last]} live squares (it began with ${hist[0]}).${settled >= 0 ? ` From round ${settled} on, the sheet only has patterns that stay or repeat every two rounds.` : last >= 100 ? ' It is still changing: something is walking or repeating over a longer time.' : ''}`;
    };
    const paint = sheet(q(so, '[data-soup-host]'), 24, 16, 'A sheet of squares, 24 across and 16 down, which wraps round at the edges.', (x, y) => {
      b.cells[y * 24 + x] ^= 1;
      hist = [population(b)];
      settled = -1;
      paint(b);
      say('You changed the sheet. ');
    });
    const fresh = () => {
      b = soup(24, 16, share, seed);
      hist = [population(b)];
      settled = -1;
      paint(b);
    };
    picks(q(so, '[data-soup-picks]'), ['15%', '30%', '45%'], '30%', (v) => {
      share = Number(v.replace('%', '')) / 100;
      fresh();
      say('A new soup. ');
    });
    q(so, '[data-soup-new]').addEventListener('click', () => {
      seed += 1;
      fresh();
      say('Another soup. ');
      sound.play('pop', 0.25);
    });
    q(so, '[data-soup-step]').addEventListener('click', () => {
      b = step(b, true);
      hist.push(population(b));
      paint(b);
      say('');
    });
    q(so, '[data-soup-jump]').addEventListener('click', () => {
      const r = run(b, 100, true);
      const base = hist.length - 1;
      r.pop.slice(1).forEach((v) => hist.push(v));
      if (settled < 0 && r.settled >= 0) settled = base + r.settled;
      b = r.board;
      paint(b);
      say('');
      sound.play('pop', 0.3);
    });
    paint(b);
    say('');
  }
}
