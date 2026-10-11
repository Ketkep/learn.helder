// Window 3: why not violet. Three effects change how the light is shared between colour bands.

import { q } from '../util';
import { BANDS, bandShares, type Mix } from '../../lib/sky';

export function initViolet(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-violet-tool]');
  if (!tool) return;
  const status = q<HTMLElement>(tool, '[data-violet-status]');
  const mix: Mix = { scatter: true, sun: true, eye: true };
  const buttons = [...tool.querySelectorAll<HTMLButtonElement>('[data-violet-fx]')];

  function draw() {
    const s = bandShares(mix);
    BANDS.forEach((_, i) => {
      q<HTMLElement>(tool!, `[data-violet-bar="${i}"]`).style.width = `${Math.round(s[i] * 100)}%`;
      q(tool!, `[data-violet-val="${i}"]`).textContent = s[i] < 0.01 ? '<1%' : `${Math.round(s[i] * 100)}%`;
    });
    const [v, b] = [s[0], s[1]];
    const pct = (x: number) => (x < 0.01 ? 'under 1%' : `${Math.round(x * 100)}%`);
    const on = (['scatter', 'sun', 'eye'] as const).filter((k) => mix[k]).length;
    if (on === 0) {
      status.textContent = 'With no effect on, every wavelength counts the same, so a band gets a share only by how wide it is. Switch an effect on.';
      return;
    }
    const verdict = Math.abs(v - b) < 0.02 ? 'violet and blue are level' : v > b ? `violet is ahead of blue by a factor of ${(v / b).toFixed(1)}` : `blue is ahead of violet by a factor of ${Math.round(b / Math.max(v, 0.001))}`;
    status.textContent = `With ${on} effect${on === 1 ? '' : 's'} on, violet is ${pct(v)} of the brightness and blue is ${pct(b)}: ${verdict}.`;
  }

  for (const b of buttons) {
    b.addEventListener('click', () => {
      const k = b.dataset.violetFx as keyof Mix;
      mix[k] = !mix[k];
      b.setAttribute('aria-pressed', String(mix[k]));
      b.classList.toggle('fill', mix[k]);
      draw();
    });
  }
  draw();
}
