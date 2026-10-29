// The sudoku page: four puzzles. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { q } from '../util';
import { BIG, candidates, clashes, countSolutions, GRIDS_4, hiddenSingles, nakedSingles, parse, peers, PUZZLE4, PUZZLE9, SMALL, SOLVED4, solve } from '../../lib/sudoku';
import { makeBoard } from './board';

const root = document.querySelector<HTMLElement>('[data-sudoku]');

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);
const spot = (i: number, n: number) => `row ${Math.floor(i / n) + 1}, column ${(i % n) + 1}`;

if (root) {
  initSoundButton(root);

  // Puzzle 1: the one rule
  const ru = root.querySelector<HTMLElement>('[data-rule-tool]');
  if (ru) {
    const given = parse(PUZZLE4);
    let g = given.slice();
    let hint = -1;
    const status = q(ru, '[data-rule-status]');
    const board = makeBoard(q(ru, '[data-board]'), SMALL, (i) => {
      if (given[i]) return;
      g[i] = (g[i] + 1) % 5;
      hint = -1;
      draw();
      sound.play('tick', 0.3);
    }, (i, key) => {
      if (given[i]) return;
      g[i] = /^[1-4]$/.test(key) ? Number(key) : 0;
      hint = -1;
      draw();
    });
    const draw = () => {
      const bad = clashes(g, SMALL);
      board.draw((i) => ({
        text: g[i] ? String(g[i]) : '',
        cls: [given[i] ? 'given' : 'mine', bad.has(i) ? 'clash' : '', i === hint ? 'hint' : ''].filter(Boolean),
        label: `${spot(i, 4)}, ${g[i] ? 'digit ' + g[i] : 'empty'}${given[i] ? ', given' : ''}${bad.has(i) ? ', repeats in its row, column or box' : ''}`,
      }));
      const empty = g.filter((v) => v === 0).length;
      if (bad.size) status.textContent = `${bad.size} ${plural(bad.size, 'digit repeats', 'digits repeat')} in a row, column or box. They are shown in red.`;
      else if (!empty) {
        status.textContent = 'Solved. Every row, column and box has 1 to 4 once.';
        sound.play('good', 0.5);
      } else status.textContent = `${empty} ${plural(empty, 'cell is', 'cells are')} still empty. No digit repeats yet.`;
    };
    q(ru, '[data-rule-reset]').addEventListener('click', () => {
      g = given.slice();
      hint = -1;
      draw();
    });
    q(ru, '[data-rule-hint]').addEventListener('click', () => {
      const answer = solve(given, SMALL);
      if (!answer) return;
      const wrong = g.findIndex((v, i) => v !== 0 && v !== answer[i]);
      const target = wrong >= 0 ? wrong : g.findIndex((v) => v === 0);
      if (target < 0) return;
      g[target] = answer[target];
      hint = target;
      draw();
      if (g.some((v) => v === 0) || clashes(g, SMALL).size) status.textContent = `Hint: ${spot(target, 4)} is ${answer[target]}.`;
    });
    draw();
  }

  // Puzzle 2: what can go here
  const ca = root.querySelector<HTMLElement>('[data-cands-tool]');
  if (ca) {
    const given = parse(PUZZLE9);
    let g = given.slice();
    let sel = -1;
    let marks = false;
    let single = -1;
    const status = q(ca, '[data-cands-status]');
    const board = makeBoard(q(ca, '[data-board]'), BIG, (i) => {
      sel = i;
      single = -1;
      draw();
      const c = candidates(g, i, BIG);
      status.textContent = g[i] ? `${spot(i, 9)} already holds ${g[i]}.` : c.length === 1 ? `${spot(i, 9)}: only ${c[0]} can go here. That is a naked single.` : `${spot(i, 9)}: the digits that can go here are ${c.join(', ')}.`;
    });
    const draw = () => {
      const near = sel >= 0 ? new Set(peers(sel, BIG)) : new Set<number>();
      board.draw((i) => ({
        text: g[i] ? String(g[i]) : '',
        marks: marks && !g[i] ? candidates(g, i, BIG) : undefined,
        cls: [given[i] ? 'given' : g[i] ? 'mine' : '', i === sel ? 'sel' : near.has(i) ? 'peer' : '', i === single ? 'single' : ''].filter(Boolean),
        label: `${spot(i, 9)}, ${g[i] ? 'digit ' + g[i] : 'empty, candidates ' + candidates(g, i, BIG).join(' ')}`,
      }));
    };
    const marksBtn = q(ca, '[data-cands-marks]');
    marksBtn.addEventListener('click', () => {
      marks = !marks;
      marksBtn.setAttribute('aria-pressed', marks ? 'true' : 'false');
      draw();
    });
    q(ca, '[data-cands-find]').addEventListener('click', () => {
      const s = nakedSingles(g, BIG);
      if (!s.length) {
        single = -1;
        draw();
        status.textContent = 'No cell has only one candidate now. Try the next puzzle: hidden singles.';
        return;
      }
      const next = s.find((x) => x.cell > single) ?? s[0];
      single = next.cell;
      sel = next.cell;
      draw();
      status.textContent = `${spot(next.cell, 9)} has only one candidate: ${next.digit}. There ${plural(s.length, 'is', 'are')} ${s.length} ${plural(s.length, 'cell', 'cells')} like it now.`;
      sound.play('tick', 0.3);
    });
    q(ca, '[data-cands-place]').addEventListener('click', () => {
      if (single < 0) {
        status.textContent = 'Press Find a single first.';
        return;
      }
      const d = candidates(g, single, BIG)[0];
      g[single] = d;
      status.textContent = `Placed ${d} in ${spot(single, 9)}. Other cells may now have a single candidate.`;
      single = -1;
      draw();
      sound.play('good', 0.4);
    });
    q(ca, '[data-cands-reset]').addEventListener('click', () => {
      g = given.slice();
      sel = -1;
      single = -1;
      draw();
      status.textContent = 'Click a cell to see which digits can go in it.';
    });
    draw();
  }

  // Puzzle 3: where can this digit go
  const hi = root.querySelector<HTMLElement>('[data-hidden-tool]');
  if (hi) {
    const g = parse(PUZZLE9);
    let d = 0;
    const status = q(hi, '[data-hidden-status]');
    const digits = q(hi, '[data-hidden-digits]');
    const board = makeBoard(q(hi, '[data-board]'), BIG, () => {});
    const draw = () => {
      const singles = d ? hiddenSingles(g, d, BIG) : [];
      const only = new Set(singles.map((s) => s.cell));
      const blocked = new Set<number>();
      if (d) g.forEach((v, i) => v === d && peers(i, BIG).forEach((j) => g[j] === 0 && blocked.add(j)));
      board.draw((i) => ({
        text: g[i] ? String(g[i]) : '',
        cls: [g[i] ? 'given' : '', d && g[i] === d ? 'same' : '', d && blocked.has(i) ? 'blocked' : '', only.has(i) ? 'single' : ''].filter(Boolean),
        label: `${spot(i, 9)}, ${g[i] ? 'digit ' + g[i] : d && blocked.has(i) ? 'empty, ' + d + ' cannot go here' : 'empty'}${only.has(i) ? ', hidden single for ' + d : ''}`,
      }));
      if (!d) return;
      if (!singles.length) status.textContent = `For ${d}: no row, column or box has only one cell left for it right now.`;
      else status.textContent = `For ${d}: ${singles.map((s) => `in ${s.house.kind} ${s.house.index + 1} it can only go in ${spot(s.cell, 9)}`).join('; ')}.`;
    };
    for (let k = 1; k <= 9; k++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pick';
      b.textContent = String(k);
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', `Show where ${k} can go`);
      b.addEventListener('click', () => {
        d = k;
        digits.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
        draw();
        sound.play('tick', 0.3);
      });
      digits.appendChild(b);
    }
    draw();
  }

  // Puzzle 4: how many solutions
  const co = root.querySelector<HTMLElement>('[data-count-tool]');
  if (co) {
    const full = parse(SOLVED4);
    let g = full.slice();
    const status = q(co, '[data-count-status]');
    const board = makeBoard(q(co, '[data-board]'), SMALL, (i) => {
      g[i] = g[i] ? 0 : full[i];
      draw();
      sound.play('tick', 0.3);
    });
    const say = () => {
      const n = countSolutions(g, SMALL);
      const clues = g.filter(Boolean).length;
      status.textContent =
        n === 1
          ? `${clues} ${plural(clues, 'digit is', 'digits are')} given, and there is exactly one way to finish the grid.`
          : `${clues} ${plural(clues, 'digit is', 'digits are')} given, and there are ${n} ways to finish the grid. A good puzzle has one.`;
    };
    const draw = () => {
      board.draw((i) => ({ text: g[i] ? String(g[i]) : '', cls: [g[i] ? 'given' : 'blank'], label: `${spot(i, 4)}, ${g[i] ? 'digit ' + g[i] + '. Click to take it away' : 'empty. Click to put it back'}` }));
      say();
    };
    q(co, '[data-count-reset]').addEventListener('click', () => {
      g = full.slice();
      draw();
    });
    q(co, '[data-count-least]').addEventListener('click', () => {
      g = full.slice();
      for (const i of [5, 10, 0, 15, 6, 9, 3, 12, 1, 14, 2, 13, 4, 11, 7, 8]) {
        const t = g.slice();
        t[i] = 0;
        if (countSolutions(t, SMALL, 2) === 1) g = t;
      }
      draw();
      status.textContent = `${g.filter(Boolean).length} digits are enough to leave one solution with this order of taking them away. Take one more away and there would be more than one.`;
    });
    q(co, '[data-count-all]').addEventListener('click', () => {
      g = new Array(16).fill(0);
      draw();
      status.textContent = `With no digits given the page finds ${countSolutions(g, SMALL)} ways to fill the 4 by 4 grid. That is every valid grid, and it matches the table (${GRIDS_4}).`;
      sound.play('good', 0.4);
    });
    draw();
  }

}
