// Call 2: send the beam to any of nine places and read how old the light is.

import { q } from '../util';
import { fmtKm, fmtTime, seconds, targets } from '../../lib/light';
import { send } from './beam';

const extra: Record<string, string> = {
  moon: 'You see the Moon as it was just over a second ago.',
  sun: 'The Sun you see is eight minutes in the past.',
  voyager: 'A radio signal to it takes a whole day to arrive, and the answer takes another.',
  proxima: 'You see the star as it was more than four years ago.',
};

export function initLadder(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-ladder-tool]');
  if (!tool) return;
  const status = q<HTMLElement>(tool, '[data-ladder-status]');
  const picks = [...tool.querySelectorAll<HTMLButtonElement>('[data-ladder-pick]')];

  for (const b of picks) {
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      const t = targets.find((x) => x.id === b.dataset.ladderPick)!;
      for (const o of picks) o.setAttribute('aria-pressed', String(o === b));
      send({
        name: t.name,
        km: t.km,
        done: () => {
          status.textContent = `${t.name}: ${fmtKm(t.km)} away (${t.note}). Light takes ${fmtTime(seconds(t.km))} to arrive. ${extra[t.id] ?? `Light from there left ${fmtTime(seconds(t.km))} ago.`}`;
        },
      });
    });
  }
}
