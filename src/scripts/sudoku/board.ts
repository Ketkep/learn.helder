// A sudoku board made of buttons, shared by the four puzzles. The page has a plain table for the same grid without a script.

import { clear } from '../util';
import type { Shape } from '../../lib/sudoku';

export interface CellView {
  text: string;
  marks?: number[];
  cls?: string[];
  label: string;
}

export interface Board {
  cells: HTMLButtonElement[];
  draw: (view: (i: number) => CellView) => void;
}

/** Fills the host with a grid of buttons. onPick runs on a click or on Enter. onKey gets typed digits and delete. */
export function makeBoard(host: HTMLElement, sh: Shape, onPick: (i: number) => void, onKey?: (i: number, key: string) => void): Board {
  clear(host);
  const grid = document.createElement('div');
  grid.className = `cells n${sh.n}`;
  const cells: HTMLButtonElement[] = [];
  let focus = 0;
  for (let i = 0; i < sh.n * sh.n; i++) {
    const r = Math.floor(i / sh.n);
    const c = i % sh.n;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'cell';
    if ((c + 1) % sh.bw === 0 && c + 1 < sh.n) b.classList.add('gapc');
    if ((r + 1) % sh.bh === 0 && r + 1 < sh.n) b.classList.add('gapr');
    b.tabIndex = i === 0 ? 0 : -1;
    b.addEventListener('click', () => onPick(i));
    b.addEventListener('focus', () => {
      cells[focus].tabIndex = -1;
      focus = i;
      b.tabIndex = 0;
    });
    b.addEventListener('keydown', (e) => {
      const move: Record<string, [number, number]> = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
      const m = move[e.key];
      if (m) {
        e.preventDefault();
        const nr = Math.min(sh.n - 1, Math.max(0, r + m[0]));
        const nc = Math.min(sh.n - 1, Math.max(0, c + m[1]));
        cells[nr * sh.n + nc].focus();
        return;
      }
      if (onKey && (/^[1-9]$/.test(e.key) || e.key === 'Backspace' || e.key === 'Delete' || e.key === ' ' || e.key === '0')) {
        if (e.key === ' ') e.preventDefault();
        onKey(i, e.key);
      }
    });
    grid.appendChild(b);
    cells.push(b);
  }
  host.appendChild(grid);
  const draw = (view: (i: number) => CellView) => {
    cells.forEach((b, i) => {
      const v = view(i);
      const keep = ['cell', 'gapc', 'gapr'].filter((k) => b.classList.contains(k));
      b.className = [...keep, ...(v.cls ?? [])].join(' ');
      clear(b);
      if (v.marks && v.marks.length) {
        const m = document.createElement('span');
        m.className = 'marks';
        for (let d = 1; d <= sh.n; d++) {
          const s = document.createElement('span');
          s.textContent = v.marks.includes(d) ? String(d) : '';
          m.appendChild(s);
        }
        b.appendChild(m);
      } else b.textContent = v.text;
      b.setAttribute('aria-label', v.label);
    });
  };
  return { cells, draw };
}
