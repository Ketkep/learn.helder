// Panel 3: the weeks of autumn, with sunny or dull weather and a hard frost.

import { fillRange, q } from '../util';
import { FROST_WEEK, colourWord, leafColour, rgb, season } from '../../lib/leaves';

export function initSeason(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-season-tool]');
  if (!tool) return;
  const range = q<HTMLInputElement>(tool, '[data-season-range]');
  const leaf = q<SVGElement>(tool, '[data-season-leaf]');
  const status = q<HTMLElement>(tool, '[data-season-status]');
  const sunnyBtn = q<HTMLButtonElement>(tool, '[data-season-sunny]');
  const frostBtn = q<HTMLButtonElement>(tool, '[data-season-frost]');
  const weather = { sunny: true, frost: false };

  function draw() {
    const wk = Number(range.value);
    fillRange(range);
    q(tool!, '[data-season-out]').textContent = String(wk);
    const p = season(wk, weather);
    const col = leafColour(p);
    leaf.style.fill = rgb(col);
    for (const key of ['chlorophyll', 'carotenoid', 'anthocyanin'] as const) q<HTMLElement>(tool!, `[data-season-bar="${key}"]`).style.width = `${Math.round(p[key] * 100)}%`;
    const word = colourWord(col);
    const note = weather.frost && wk > FROST_WEEK ? ' The frost came in week 4, so no more red is made.' : '';
    status.textContent = `In week ${wk} of a ${weather.sunny ? 'bright autumn with cool nights' : 'dull autumn'}${weather.frost ? ' with a hard frost' : ''}: chlorophyll ${Math.round(p.chlorophyll * 100)} per cent, carotenoids ${Math.round(p.carotenoid * 100)}, anthocyanins ${Math.round(p.anthocyanin * 100)}. The leaf is ${word}.${note}`;
  }

  range.addEventListener('input', draw);
  for (const [btn, key] of [[sunnyBtn, 'sunny'], [frostBtn, 'frost']] as const) {
    btn.addEventListener('click', () => {
      weather[key] = !weather[key];
      btn.setAttribute('aria-pressed', String(weather[key]));
      btn.classList.toggle('fill', weather[key]);
      draw();
    });
  }
  draw();
}
