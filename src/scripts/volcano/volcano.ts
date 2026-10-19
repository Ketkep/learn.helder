// The volcano page: four vents. This file starts each one.

import { fillRange, q } from '../util';
import { bubbleSvg, coneSvg, explosiveness, fmtTimes, fmtViscosity, growth, magmaType, pressureMPa, settings, settingsSvg, style, tempC, veiRatio } from '../../lib/volcano';

const root = document.querySelector<HTMLElement>('[data-volcano]');

if (root) {
  // Vent 1: sticky or runny
  const pot = root.querySelector<HTMLElement>('[data-pot-tool]');
  if (pot) {
    const si = q<HTMLInputElement>(pot, '[data-pot-si]');
    const gas = q<HTMLInputElement>(pot, '[data-pot-gas]');
    const draw = () => {
      fillRange(si);
      fillRange(gas);
      const [s, g] = [Number(si.value), Number(gas.value)];
      const e = explosiveness(s, g);
      q(pot, '[data-pot-si-out]').textContent = `${s}%`;
      q(pot, '[data-pot-gas-out]').textContent = `${g}%`;
      q(pot, '[data-pot-g]').innerHTML = coneSvg(e);
      q(pot, '[data-pot-status]').textContent = `With ${s}% silica the magma is ${magmaType(s).name}, at about ${tempC(s)} degrees Celsius, and ${fmtViscosity(s)} thick. With ${g}% gas, the toy score gives ${style(e).name}. ${style(e).text}`;
    };
    si.addEventListener('input', draw);
    gas.addEventListener('input', draw);
    draw();
  }

  // Vent 2: a bubble on its way up
  const bubble = root.querySelector<HTMLElement>('[data-bubble-tool]');
  if (bubble) {
    const range = q<HTMLInputElement>(bubble, '[data-bubble-range]');
    const draw = () => {
      fillRange(range);
      const d = Number(range.value);
      q(bubble, '[data-bubble-out]').textContent = `${d} km`;
      q(bubble, '[data-bubble-g]').innerHTML = bubbleSvg(d);
      q(bubble, '[data-bubble-status]').textContent = `At ${d} km the rock above presses with about ${Math.round(pressureMPa(d))} megapascals. A bubble that starts there would be about ${Math.round(growth(d)).toLocaleString('en-US')} times bigger in volume at the surface. The picture shows its width, which is about ${Math.cbrt(growth(d)).toFixed(0)} times more.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Vent 3: where volcanoes form
  const where = root.querySelector<HTMLElement>('[data-where-tool]');
  if (where) {
    const picks = where.querySelectorAll<HTMLElement>('[data-where-pick]');
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        const s = settings.find((x) => x.id === b.getAttribute('data-where-pick')) || settings[0];
        picks.forEach((p) => p.setAttribute('aria-pressed', p === b ? 'true' : 'false'));
        q(where, '[data-where-g]').innerHTML = settingsSvg(s.id);
        q(where, '[data-where-status]').textContent = `${s.name}. ${s.magma} ${s.example}`;
      }),
    );
  }

  // Vent 4: the VEI scale
  const vei = root.querySelector<HTMLElement>('[data-vei-tool]');
  if (vei) {
    const range = q<HTMLInputElement>(vei, '[data-vei-range]');
    const draw = () => {
      fillRange(range);
      const v = Number(range.value);
      q(vei, '[data-vei-out]').textContent = String(v);
      q<HTMLElement>(vei, '[data-vei-bar]').style.width = `${Math.max(0.4, veiRatio(v, 8) * 100)}%`;
      q(vei, '[data-vei-status]').textContent = `A VEI of ${v} is ${fmtTimes(veiRatio(v))} a VEI of 2. The 1980 eruption of Mount St. Helens was a VEI of 5.`;
    };
    range.addEventListener('input', draw);
    draw();
  }
}
