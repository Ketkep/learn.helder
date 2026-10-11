// Try 4: find a walk over every bridge of the town built in the last panel.

import * as sound from '../sound';
import { q, reducedMotion } from '../util';
import { type Land, bridges, landsOn, oddLands, verdict, walk } from '../../lib/konigsberg';
import { bridgeEl, toggle } from './map';
import { describe, getTown, onTown, paintTown } from './build';

export function initRoute(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-route-tool]');
  if (!tool) return;
  const svg = q<SVGElement>(tool, '[data-town]');
  const status = q<HTMLElement>(tool, '[data-route-status]');
  const starts = [...tool.querySelectorAll<HTMLButtonElement>('[data-route-start]')];
  let timer = 0;
  let chosen: Land | null = null;

  function clearMarks() {
    window.clearTimeout(timer);
    for (const b of bridges) {
      const el = bridgeEl(svg, b.id);
      toggle(el, 'walked', false);
      el.querySelector('.num')!.textContent = String(b.id);
    }
  }

  function show(start: Land) {
    clearMarks();
    const ids = getTown();
    const route = walk(ids, start);
    if (!route) {
      const odd = oddLands(ids);
      status.textContent =
        verdict(ids) === 'none'
          ? `There is no walk over every bridge in this town. ${describe(ids)}`
          : `There is no walk over every bridge from ${start}. ${odd.length === 2 ? `Start at ${odd[0]} or ${odd[1]}, the two lands with an odd number of bridges.` : ''}`;
      sound.play('thud', 0.5);
      return;
    }
    const trail = landsOn(route, start);
    const text = `A walk from ${start}: ${trail.join(' to ')}. It crosses bridges ${route.join(', ')} in that order and ends on ${trail[trail.length - 1]}.`;
    const mark = (i: number) => {
      const el = bridgeEl(svg, route[i]);
      toggle(el, 'walked', true);
      el.querySelector('.num')!.textContent = String(i + 1);
    };
    if (reducedMotion()) {
      route.forEach((_, i) => mark(i));
      status.textContent = `${text} The numbers on the bridges show the order.`;
      return;
    }
    status.textContent = 'Walking...';
    let i = 0;
    const step = () => {
      mark(i);
      sound.play('tick', 0.4);
      i++;
      if (i < route.length) timer = window.setTimeout(step, 450);
      else status.textContent = `${text} The numbers on the bridges show the order.`;
    };
    step();
  }

  for (const b of starts) {
    b.addEventListener('click', () => {
      chosen = b.dataset.routeStart as Land;
      for (const o of starts) o.setAttribute('aria-pressed', String(o === b));
      show(chosen);
    });
  }
  onTown(() => {
    paintTown(svg);
    clearMarks();
    status.textContent = chosen ? 'The town changed. Press a start again to find a walk.' : status.textContent;
  });
  paintTown(svg);
}
