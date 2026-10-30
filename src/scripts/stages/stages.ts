// The rocket stages page: three blueprint sheets. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { ENGINES, exhaust, fmt, fromFuel, fuelNeeded, fuelSvg, NEED, oneStage, stageGains, stagesSvg, total } from '../../lib/stages';

const root = document.querySelector<HTMLElement>('[data-stages]');

if (root) {
  initSoundButton(root);

  const pickEngine = (tool: HTMLElement, attr: string, on: (i: number) => void) => {
    const picks = tool.querySelectorAll<HTMLElement>(`[${attr}]`);
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        picks.forEach((p) => p.setAttribute('aria-pressed', p === b ? 'true' : 'false'));
        on(Number(b.getAttribute(attr)));
        sound.play('tick', 0.3);
      }),
    );
  };

  // Sheet 1: fuel buys speed
  const fu = root.querySelector<HTMLElement>('[data-fuel-tool]');
  if (fu) {
    const range = q<HTMLInputElement>(fu, '[data-fuel-range]');
    let e = 0;
    const draw = () => {
      fillRange(range);
      const share = Number(range.value) / 100;
      const ve = exhaust(ENGINES[e].isp);
      q(fu, '[data-fuel-out]').textContent = range.value;
      q(fu, '[data-fuel-g]').innerHTML = fuelSvg(ve, share);
      q(fu, '[data-fuel-status]').textContent = `With ${range.value}% propellant and an exhaust speed of ${fmt(ve, 1)} km/s, the gain in speed is ${fmt(fromFuel(ve, share), 1)} km/s. To reach ${NEED} with no structure at all, ${fmt(fuelNeeded(ve, NEED) * 100, 1)}% of the rocket would have to be propellant.`;
    };
    pickEngine(fu, 'data-fuel-pick', (i) => {
      e = i;
      draw();
    });
    range.addEventListener('input', draw);
    draw();
  }

  // Sheet 2: what one stage can do
  const si = root.querySelector<HTMLElement>('[data-single-tool]');
  if (si) {
    const range = q<HTMLInputElement>(si, '[data-single-range]');
    let e = 0;
    const draw = () => {
      fillRange(range);
      const s = Number(range.value) / 100;
      const ve = exhaust(ENGINES[e].isp);
      const dv = oneStage(ve, s, 0.02);
      q(si, '[data-single-out]').textContent = range.value;
      const x = (v: number) => 24 + (v / 16) * 250;
      q(si, '[data-single-g]').innerHTML = `<rect class="seg s0" x="24" y="34" width="${x(dv) - 24}" height="34" rx="3"/><line class="need" x1="${x(NEED)}" y1="20" x2="${x(NEED)}" y2="80"/><text class="lab" x="${x(NEED)}" y="14" text-anchor="middle">${NEED} km/s</text><text class="lab" x="24" y="92">${fmt(dv, 1)} km/s</text>`;
      q(si, '[data-single-status]').textContent = `One stage with ${range.value}% structure and 2% payload, burning ${ENGINES[e].name.toLowerCase()}, gains ${fmt(dv, 1)} km/s. The speed needed is ${NEED}. ${dv >= NEED ? 'It gets there, in this toy.' : `It falls short by ${fmt(NEED - dv, 1)} km/s.`}`;
    };
    pickEngine(si, 'data-single-pick', (i) => {
      e = i;
      draw();
    });
    range.addEventListener('input', draw);
    draw();
  }

  // Sheet 3: drop the empty tanks
  const st = root.querySelector<HTMLElement>('[data-stages-tool]');
  if (st) {
    const n = q<HTMLInputElement>(st, '[data-stages-n]');
    const s = q<HTMLInputElement>(st, '[data-stages-s]');
    let e = 0;
    const draw = () => {
      [n, s].forEach(fillRange);
      const ve = exhaust(ENGINES[e].isp);
      const g = stageGains(ve, Number(n.value), Number(s.value) / 100, 0.02);
      q(st, '[data-stages-outn]').textContent = n.value;
      q(st, '[data-stages-outs]').textContent = s.value;
      q(st, '[data-stages-g]').innerHTML = stagesSvg(g);
      const t = total(g);
      q(st, '[data-stages-status]').textContent = `${n.value} ${n.value === '1' ? 'stage' : 'stages'} with ${s.value}% structure each, burning ${ENGINES[e].name.toLowerCase()}, gain ${fmt(t, 1)} km/s in all. The speed needed is ${NEED}. ${t >= NEED ? 'That is enough, in this toy.' : `That falls short by ${fmt(NEED - t, 1)} km/s.`}`;
    };
    pickEngine(st, 'data-stages-pick', (i) => {
      e = i;
      draw();
    });
    n.addEventListener('input', draw);
    s.addEventListener('input', draw);
    draw();
  }
}
