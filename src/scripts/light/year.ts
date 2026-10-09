// Call 4: the trip to Proxima Centauri at four speeds.

import { q } from '../util';
import { LY_KM, fmtKm, fmtTime } from '../../lib/light';
import { send } from './beam';

const YEAR_S = 365.25 * 86400;

export function initYear(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-year-tool]');
  if (!tool) return;
  const status = q<HTMLElement>(tool, '[data-year-status]');
  const picks = [...tool.querySelectorAll<HTMLButtonElement>('[data-year-pick]')];
  const km = 4.24 * LY_KM;

  for (const b of picks) {
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      const kmS = Number(b.dataset.kms);
      const name = b.textContent!.trim();
      for (const o of picks) o.setAttribute('aria-pressed', String(o === b));
      send({
        name: `Proxima Centauri (${name})`,
        km,
        kmS,
        done: (total) => {
          const year = kmS * YEAR_S;
          const share = kmS > 299000 ? 'Light covers exactly one light-year in a year.' : `In one year that is ${fmtKm(year)}, about 1 part in ${Math.round(LY_KM / year).toLocaleString('en-US')} of a light-year.`;
          status.textContent = `${name}: ${fmtTime(total)} to Proxima Centauri. ${share}`;
        },
      });
    });
  }
}
