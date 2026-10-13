// One strip chart: a room over a day. Each panel moves one or two things and the chart is drawn again.

import { fillRange, q } from '../util';
import { chartSvg, simulate, type Setup } from '../../lib/thermostat';

const BASE: Setup = { outside: 5, set: 20, band: 2, leak: 0.1, lag: 0 };

interface Control {
  /** The data attribute of the slider, such as loop-set. */
  name: string;
  /** Which part of the setup it changes. */
  key: keyof Setup;
  /** How to write its value next to the label. */
  show: (v: number) => string;
}

export function initStrip(root: HTMLElement, id: string, start: Partial<Setup>, controls: Control[], say: (s: Setup, r: ReturnType<typeof simulate>) => string) {
  const tool = root.querySelector<HTMLElement>(`[data-${id}-tool]`);
  if (!tool) return;
  const g = q(tool, `[data-${id}-g]`);
  const status = q<HTMLElement>(tool, `[data-${id}-status]`);
  const sliders = controls.map((c) => ({ c, el: q<HTMLInputElement>(tool, `[data-${c.name}]`), out: q(tool, `[data-${c.name}-out]`) }));
  const setup: Setup = { ...BASE, ...start };

  function draw() {
    for (const { c, el, out } of sliders) {
      setup[c.key] = Number(el.value);
      fillRange(el);
      out.textContent = c.show(Number(el.value));
    }
    const run = simulate(setup);
    g.innerHTML = chartSvg(setup, run);
    status.textContent = say(setup, run);
  }
  for (const { el } of sliders) el.addEventListener('input', draw);
  draw();
}

export const pct = (x: number) => Math.round(x * 100);

export function summary(_s: Setup, r: ReturnType<typeof simulate>): string {
  return `The room stayed between ${r.min.toFixed(1)} and ${r.max.toFixed(1)} degrees. The heater switched ${r.switches} time${r.switches === 1 ? '' : 's'} and was on ${pct(r.onShare)} per cent of the day.${r.needed > 1 ? ' It was too small to hold the set point, so the room fell short.' : ''}`;
}
