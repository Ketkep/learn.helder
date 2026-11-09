// The braille page: three spreads. This file starts each one. Nothing is saved or sent anywhere.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { q } from '../util';
import { meaning, rowsSvg, say, writeSvg } from '../../lib/braille';

const root = document.querySelector<HTMLElement>('[data-braille]');

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

  // Spread 1: one cell
  const ce = root.querySelector<HTMLElement>('[data-cell-tool]');
  if (ce) {
    const grid = q(ce, '[data-cell-grid]');
    const status = q(ce, '[data-cell-status]');
    const up = [false, false, false, false, false, false];
    const buttons: HTMLButtonElement[] = [];
    const draw = () => {
      const dots = [1, 2, 3, 4, 5, 6].filter((d) => up[d - 1]);
      buttons.forEach((b, i) => b.setAttribute('aria-pressed', up[i] ? 'true' : 'false'));
      status.textContent = `${say(dots).replace(/^./, (c) => c.toUpperCase())}. ${meaning(dots)}`;
    };
    // Left column down, then right column down, but laid out in two columns of three
    [1, 4, 2, 5, 3, 6].forEach((d) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'dot-btn';
      b.innerHTML = `<span class="dot-n">${d}</span>`;
      b.setAttribute('aria-label', `Dot ${d}`);
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', () => {
        up[d - 1] = !up[d - 1];
        draw();
        sound.play('tick', up[d - 1] ? 0.35 : 0.2);
      });
      grid.appendChild(b);
      buttons[d - 1] = b;
    });
    q(ce, '[data-cell-clear]').addEventListener('click', () => {
      up.fill(false);
      draw();
    });
  }

  // Spread 2: the alphabet in three rows
  const ro = root.querySelector<HTMLElement>('[data-rows-tool]');
  if (ro) {
    const names = ['A to J', 'K to T', 'U to Z'];
    const notes = [
      'A to J use only the top four dots: 1, 2, 4 and 5. Ten shapes, and everything else is built from them.',
      'K to T are the shapes of A to J again, with dot 3 added. K is A with dot 3, L is B with dot 3, and so on to T, which is J with dot 3.',
      'U, V, X, Y and Z are the shapes of A to E with dots 3 and 6 added. W is out of order: it is J with dot 6, added later because French had no W.',
    ];
    picks(q(ro, '[data-rows-picks]'), names, '', (v) => {
      const i = names.indexOf(v);
      q(ro, '[data-rows-g]').innerHTML = rowsSvg(i);
      q(ro, '[data-rows-status]').textContent = notes[i];
    });
    ro.querySelectorAll('[data-rows-picks] button').forEach((b) => b.setAttribute('aria-pressed', 'false'));
  }

  // Spread 3: write in dots
  const wr = root.querySelector<HTMLElement>('[data-write-tool]');
  if (wr) {
    const input = q<HTMLInputElement>(wr, '[data-write-text]');
    const draw = () => {
      const d = writeSvg(input.value);
      q(wr, '[data-write-g]').innerHTML = d.svg;
      q(wr, '[data-write-svg]').setAttribute('viewBox', `0 0 420 ${d.h}`);
      q(wr, '[data-write-svg]').setAttribute('aria-label', `${input.value || 'Nothing'} written in braille cells.`);
      q(wr, '[data-write-status]').textContent = d.count
        ? `${d.count} ${d.count === 1 ? 'cell' : 'cells'}. A capital letter has a capital sign in front, and a run of numbers has a number sign in front. Characters other than letters, numbers and spaces are skipped.`
        : 'Type some letters or numbers.';
    };
    input.addEventListener('input', draw);
    draw();
  }
}
