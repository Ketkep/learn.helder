// The battery page: four benches. This file starts each one.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { CELL, cellSvg, cellsSvg, fmtHours, layouts, loads, pack, pileSvg, pileVolts, runtimeHours, steps } from '../../lib/battery';

const root = document.querySelector<HTMLElement>('[data-cell]');

function press(buttons: NodeListOf<HTMLElement>, on: HTMLElement) {
  buttons.forEach((b) => b.setAttribute('aria-pressed', b === on ? 'true' : 'false'));
}

if (root) {
  // Bench 1: the pile
  const pile = root.querySelector<HTMLElement>('[data-pile-tool]');
  if (pile) {
    const range = q<HTMLInputElement>(pile, '[data-pile-range]');
    const draw = () => {
      fillRange(range);
      const n = Number(range.value);
      q(pile, '[data-pile-out]').textContent = String(n);
      q(pile, '[data-pile-g]').innerHTML = pileSvg(n);
      q(pile, '[data-pile-status]').textContent = `${n} pair${n === 1 ? '' : 's'} of discs give about ${pileVolts(n).toFixed(1)} volts in this toy, at 1.1 volts a pair.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Bench 2: one cell
  const cell = root.querySelector<HTMLElement>('[data-cell-tool]');
  if (cell) {
    let step = 0;
    const draw = () => {
      q(cell, '[data-cell-g]').innerHTML = cellSvg(step);
      q(cell, '[data-cell-status]').textContent = `Step ${step + 1} of ${steps.length}: ${steps[step].title}. ${steps[step].text}`;
    };
    q(cell, '[data-cell-next]').addEventListener('click', () => {
      step = Math.min(step + 1, steps.length - 1);
      sound.play('tick', 0.4);
      draw();
    });
    q(cell, '[data-cell-reset]').addEventListener('click', () => {
      step = 0;
      draw();
    });
    draw();
  }

  // Bench 3: series and parallel
  const wire = root.querySelector<HTMLElement>('[data-wire-tool]');
  if (wire) {
    const picks = wire.querySelectorAll<HTMLElement>('[data-wire-pick]');
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        const l = layouts.find((x) => x.id === b.getAttribute('data-wire-pick')) || layouts[0];
        const p = pack(l);
        press(picks, b);
        q(wire, '[data-wire-g]').innerHTML = cellsSvg(l);
        q(wire, '[data-wire-status]').textContent = `${l.name}: ${p.volts} volts, ${p.mAh.toLocaleString('en-US')} milliamp hours, and ${p.wh} watt hours of energy.`;
      }),
    );
  }

  // Bench 4: how long it lasts
  const last = root.querySelector<HTMLElement>('[data-last-tool]');
  if (last) {
    const picks = last.querySelectorAll<HTMLElement>('[data-last-pick]');
    const range = q<HTMLInputElement>(last, '[data-last-range]');
    let load = loads[1];
    const draw = () => {
      fillRange(range);
      const n = Number(range.value);
      q(last, '[data-last-out]').textContent = String(n);
      const wh = (CELL.volts * CELL.mAh * n) / 1000;
      const h = fmtHours(runtimeHours(wh, load.watts));
      q(last, '[data-last-big]').textContent = h;
      q(last, '[data-last-status]').textContent = `${n} cell${n === 1 ? '' : 's'} hold ${wh} watt hours. ${load.name} uses ${load.watts} watt${load.watts === 1 ? '' : 's'}, so they last about ${h}. Real batteries give less when they are drained fast.`;
    };
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        load = loads.find((x) => x.id === b.getAttribute('data-last-pick')) || load;
        press(picks, b);
        draw();
      }),
    );
    range.addEventListener('input', draw);
    draw();
  }
}
