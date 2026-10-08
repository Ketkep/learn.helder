// Experiment 3: the birthday problem. 365 equal days, no 29 February.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { dayName, pct, pick, sharedBirthday } from './stats';

export function initBirthday(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-bday-tool]');
  if (!tool) return;
  const x0 = Number(tool.dataset.x0);
  const x1 = Number(tool.dataset.x1);
  const y0 = Number(tool.dataset.y0);
  const y1 = Number(tool.dataset.y1);
  const range = q<HTMLInputElement>(tool, '[data-bday-range]');
  const out = q<HTMLOutputElement>(tool, '[data-bday-out]');
  const status = q<HTMLElement>(tool, '[data-bday-status]');
  const cursor = q<SVGLineElement>(tool, '[data-bday-cursor]');
  const dot = q<SVGCircleElement>(tool, '[data-bday-dot]');

  const px = (n: number) => x0 + ((x1 - x0) * (n - 1)) / 79;
  const py = (p: number) => y1 - (y1 - y0) * p;
  const people = () => Number(range.value);

  /** Fills one room and gives back the first shared birthday, or 0 if there is none. */
  function room(n: number) {
    const seen = new Set<number>();
    for (let i = 0; i < n; i++) {
      const d = pick(365);
      if (seen.has(d)) return d;
      seen.add(d);
    }
    return 0;
  }

  function update(note = '') {
    const n = people();
    const p = sharedBirthday(n);
    fillRange(range);
    out.textContent = String(n);
    cursor.setAttribute('x1', String(px(n)));
    cursor.setAttribute('x2', String(px(n)));
    dot.setAttribute('cx', String(px(n)));
    dot.setAttribute('cy', String(py(p)));
    const pairs = (n * (n - 1)) / 2;
    const chance = p > 0.9995 ? 'more than 99.9%' : `about ${pct(p)}`;
    status.textContent = `${note}With ${n} people there ${pairs === 1 ? 'is 1 pair' : `are ${pairs.toLocaleString('en-US')} pairs`}, and the chance that at least one pair shares a birthday is ${chance}.`.trim();
  }

  range.addEventListener('input', () => {
    update();
    sound.play('tick');
  });
  q<HTMLButtonElement>(tool, '[data-bday-fill]').addEventListener('click', () => {
    const d = room(people());
    update(d ? `This room: two people were born on ${dayName(d)}. ` : 'This room: no two people share a birthday. ');
    sound.play(d ? 'good' : 'pop');
  });
  q<HTMLButtonElement>(tool, '[data-bday-many]').addEventListener('click', () => {
    const n = people();
    let hits = 0;
    for (let i = 0; i < 1000; i++) if (room(n)) hits++;
    update(`In 1,000 rooms of ${n}, ${hits} had a shared birthday (${pct(hits / 1000)}). `);
    sound.play('whoosh', 0.5);
  });
  update();
}
