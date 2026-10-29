// The music box page: three compartments. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { clear, fillRange, q } from '../util';
import { CHANGES, COLS, combSvg, fmt, grid, lengthOf, noteFreq, NOTES, notesAt, pinsSvg, pitchRatio, semitones, TUNE } from '../../lib/musicbox';

const root = document.querySelector<HTMLElement>('[data-musicbox]');

const ring = (note: number) => sound.pluck(noteFreq(note), [1, 0.5, 0.25], 1.1);

if (root) {
  initSoundButton(root);

  // Compartment 1: the tuned teeth
  const te = root.querySelector<HTMLElement>('[data-teeth-tool]');
  if (te) {
    const keys = q(te, '[data-teeth-keys]');
    const drawComb = (on: number) => (q(te, '[data-teeth-g]').innerHTML = combSvg(on));
    NOTES.forEach((n, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pick';
      b.textContent = i === 7 ? 'C high' : n.name;
      b.setAttribute('aria-label', `Pluck the ${i === 7 ? 'high C' : n.name} tooth`);
      b.addEventListener('click', () => {
        sound.unlock();
        ring(i);
        drawComb(i);
        q(te, '[data-teeth-status]').textContent = `${n.name}${i === 7 ? ' (high)' : ''}: ${fmt(noteFreq(i), 1)} hertz, a tooth ${fmt(lengthOf(i), 2)} times as long as the shortest.`;
      });
      keys.appendChild(b);
    });
    const l = q<HTMLInputElement>(te, '[data-teeth-l]');
    const t = q<HTMLInputElement>(te, '[data-teeth-t]');
    const mix = () => {
      [l, t].forEach(fillRange);
      const L = Number(l.value) / 100;
      const T = Number(t.value) / 100;
      q(te, '[data-teeth-outl]').textContent = L.toFixed(2);
      q(te, '[data-teeth-outt]').textContent = T.toFixed(2);
      const r = pitchRatio(L, T);
      const s = semitones(r);
      q(te, '[data-teeth-status]').textContent = `A tooth ${L.toFixed(2)} times as long and ${T.toFixed(2)} times as thick rings at ${fmt(r, 2)} times the pitch of the first tooth, ${s >= 0 ? fmt(s, 1) + ' semitones higher' : fmt(-s, 1) + ' semitones lower'}.`;
    };
    l.addEventListener('input', mix);
    t.addEventListener('input', mix);
  }

  // Compartment 2: the pinned cylinder
  const pi = root.querySelector<HTMLElement>('[data-pins-tool]');
  if (pi) {
    let g = grid(TUNE);
    let at = -1;
    let timer = 0;
    const holder = q(pi, '[data-pins-grid]');
    const speed = q<HTMLInputElement>(pi, '[data-pins-speed]');
    const play = q<HTMLButtonElement>(pi, '[data-pins-play]');
    const status = q(pi, '[data-pins-status]');
    const draw = () => (q(pi, '[data-pins-g]').innerHTML = pinsSvg(g, at));
    const cells: HTMLButtonElement[][] = [];
    let focus: [number, number] = [0, 0];
    const mark = (r: number, c: number) => {
      const b = cells[r][c];
      b.setAttribute('aria-pressed', g[r][c] ? 'true' : 'false');
      b.classList.toggle('on', g[r][c]);
    };
    const build = () => {
      clear(holder);
      holder.setAttribute('role', 'group');
      holder.setAttribute('aria-label', 'Pins: a row for each note, a column for each step');
      for (let r = 0; r < 8; r++) {
        cells[r] = [];
        for (let c = 0; c < COLS; c++) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'cell';
          b.tabIndex = r === focus[0] && c === focus[1] ? 0 : -1;
          b.setAttribute('aria-label', `${NOTES[7 - r].name}${r === 0 ? ' high' : ''}, step ${c + 1}`);
          b.addEventListener('click', () => {
            g[r][c] = !g[r][c];
            mark(r, c);
            draw();
            if (g[r][c]) {
              sound.unlock();
              ring(7 - r);
            }
          });
          b.addEventListener('focus', () => {
            cells[focus[0]][focus[1]].tabIndex = -1;
            focus = [r, c];
            b.tabIndex = 0;
          });
          b.addEventListener('keydown', (e) => {
            const d: Record<string, [number, number]> = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
            const m = d[e.key];
            if (!m) return;
            e.preventDefault();
            const nr = Math.min(7, Math.max(0, r + m[0]));
            const nc = Math.min(COLS - 1, Math.max(0, c + m[1]));
            cells[nr][nc].focus();
          });
          holder.appendChild(b);
          cells[r][c] = b;
          mark(r, c);
        }
      }
    };
    const stop = () => {
      window.clearTimeout(timer);
      timer = 0;
      at = -1;
      play.textContent = 'Play';
      draw();
    };
    const step = () => {
      at = (at + 1) % COLS;
      notesAt(g, at).forEach(ring);
      draw();
      timer = window.setTimeout(step, 60000 / Number(speed.value));
    };
    play.addEventListener('click', () => {
      if (timer) {
        stop();
        status.textContent = 'Stopped.';
        return;
      }
      sound.unlock();
      play.textContent = 'Stop';
      status.textContent = `The cylinder turns: ${COLS} steps at ${speed.value} a minute, one turn in ${fmt((COLS * 60) / Number(speed.value), 1)} seconds.`;
      at = -1;
      step();
    });
    q(pi, '[data-pins-clear]').addEventListener('click', () => {
      g = grid(TUNE.map(() => -1));
      cells.forEach((row, r) => row.forEach((_, c) => mark(r, c)));
      draw();
      status.textContent = 'No pins. Click a spot to place one.';
    });
    q(pi, '[data-pins-reset]').addEventListener('click', () => {
      g = grid(TUNE);
      cells.forEach((row, r) => row.forEach((_, c) => mark(r, c)));
      draw();
      status.textContent = 'The pins for Twinkle, twinkle, little star.';
    });
    speed.addEventListener('input', () => {
      fillRange(speed);
      q(pi, '[data-pins-outs]').textContent = speed.value;
    });
    fillRange(speed);
    build();
    draw();
  }

  // Compartment 3: what changes a pitch
  const tu = root.querySelector<HTMLElement>('[data-tuning-tool]');
  if (tu) {
    const picks = tu.querySelectorAll<HTMLElement>('[data-tuning-pick]');
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        const c = CHANGES[Number(b.getAttribute('data-tuning-pick'))];
        picks.forEach((p) => p.setAttribute('aria-pressed', p === b ? 'true' : 'false'));
        q(tu, '[data-tuning-status]').textContent = `${c.name}: the note goes ${c.result.toLowerCase()}. ${c.why}`;
        sound.play('tick', 0.35);
      }),
    );
  }
}
