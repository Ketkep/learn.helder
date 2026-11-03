// The honeycomb page: three cells. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { NAMES, SIDES, angle, around, fill, fmt, outline, tileSvg, wallSvg, wax, waxSvg } from '../../lib/comb';

const root = document.querySelector<HTMLElement>('[data-comb]');

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

  // Cell 1: which shapes fit together
  const ti = root.querySelector<HTMLElement>('[data-tile-tool]');
  if (ti) {
    const draw = (n: number) => {
      q(ti, '[data-tile-g]').innerHTML = tileSvg(n);
      const a = around(n);
      const ang = fmt(angle(n), 1).replace('.0', '');
      q(ti, '[data-tile-status]').textContent = a.tiles
        ? `${n === 8 ? 'An' : 'A'} ${NAMES[n].toLowerCase()} has corners of ${ang} degrees. ${a.k} fit round a point and ${a.k} times ${ang} is 360, so there is no gap.`
        : `${n === 8 ? 'An' : 'A'} ${NAMES[n].toLowerCase()} has corners of ${ang} degrees. ${a.k} fit round a point, which makes ${fmt(a.k * angle(n), 1).replace('.0', '')}, so a gap of ${fmt(a.gap, 1).replace('.0', '')} degrees is left. It does not tile.`;
    };
    picks(q(ti, '[data-tile-picks]'), SIDES.map((n) => NAMES[n]), 'Hexagon', (v) => draw(SIDES.filter((n) => NAMES[n] === v)[0]));
    draw(6);
  }

  // Cell 2: the same room with less wall
  const wa = root.querySelector<HTMLElement>('[data-wax-tool]');
  if (wa) {
    const range = q<HTMLInputElement>(wa, '[data-wax-range]');
    const draw = () => {
      fillRange(range);
      const c = Number(range.value);
      q(wa, '[data-wax-out]').textContent = String(c);
      q(wa, '[data-wax-g]').innerHTML = wallSvg(c);
      q(wa, '[data-wax-status]').textContent = `For ${c} cells the hexagon needs ${fmt(wax(6, c))} units of wall, the square ${fmt(wax(4, c))} and the triangle ${fmt(wax(3, c))}. The hexagon saves ${fmt((1 - outline(6) / outline(4)) * 100, 1)}% against the square.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Cell 3: round cells squeezed into hexagons
  const so = root.querySelector<HTMLElement>('[data-soft-tool]');
  if (so) {
    const range = q<HTMLInputElement>(so, '[data-soft-range]');
    const draw = () => {
      fillRange(range);
      const t = Number(range.value) / 100;
      q(so, '[data-soft-out]').textContent = range.value;
      q(so, '[data-soft-g]').innerHTML = waxSvg(t);
      const gap = (1 - fill(t)) * 100;
      q(so, '[data-soft-status]').textContent = `Squeezed ${range.value}% of the way: the gaps are ${fmt(gap, 1)}% of the space. ${t >= 1 ? 'The cells are hexagons and no space is wasted.' : 'This is a toy model.'}`;
    };
    range.addEventListener('input', draw);
    draw();
  }
}
