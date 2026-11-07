// The ice page: three layers. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { FLUIDS, ICE, ICE_VOLUME, STAGES, below, bottleSvg, floatSvg, fmt, lakeSvg } from '../../lib/ice';

const root = document.querySelector<HTMLElement>('[data-ice]');

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

  // Layer 1: why things float, and how deep
  const fl = root.querySelector<HTMLElement>('[data-float-tool]');
  if (fl) {
    let fluid = FLUIDS[1];
    const range = q<HTMLInputElement>(fl, '[data-float-range]');
    const draw = () => {
      fillRange(range);
      const d = Number(range.value);
      q(fl, '[data-float-out]').textContent = String(d);
      q(fl, '[data-float-g]').innerHTML = floatSvg(d, fluid.rho);
      const r = below(d, fluid.rho);
      q(fl, '[data-float-status]').textContent = `A block of ${d} kilograms per cubic metre in ${fluid.name.toLowerCase()} (${fluid.rho}): ${r >= 1 ? 'it is heavier than the water and sinks.' : `it floats with ${fmt(r * 100, 1)}% of it under the surface.`}${d === ICE ? ' That is the density of ice.' : ''}`;
    };
    picks(q(fl, '[data-float-picks]'), FLUIDS.map((f) => f.name), FLUIDS[1].name, (v) => {
      fluid = FLUIDS.filter((f) => f.name === v)[0];
      draw();
    });
    range.addEventListener('input', draw);
    draw();
  }

  // Layer 2: a lake from summer to ice
  const la = root.querySelector<HTMLElement>('[data-lake-tool]');
  if (la) {
    picks(q(la, '[data-lake-picks]'), STAGES.map((s) => s.name), STAGES[3].name, (v) => {
      const i = STAGES.findIndex((s) => s.name === v);
      q(la, '[data-lake-g]').innerHTML = lakeSvg(i);
      q(la, '[data-lake-status]').textContent = STAGES[i].says;
    });
  }

  // Layer 3: water takes more room as ice
  const bo = root.querySelector<HTMLElement>('[data-bottle-tool]');
  if (bo) {
    const range = q<HTMLInputElement>(bo, '[data-bottle-range]');
    const draw = () => {
      fillRange(range);
      const f = Number(range.value);
      q(bo, '[data-bottle-out]').textContent = String(f);
      q(bo, '[data-bottle-g]').innerHTML = bottleSvg(f);
      const ice = f * ICE_VOLUME;
      q(bo, '[data-bottle-status]').textContent = `${f}% full of water becomes ${fmt(ice, 1)}% of the bottle as ice${ice > 100 ? ', which is too much. The ice has no room.' : ', which fits.'} 1000 millilitres of water make about ${fmt(1000 * ICE_VOLUME)} millilitres of ice.`;
    };
    range.addEventListener('input', draw);
    draw();
  }
}
