// The Antikythera page: four parts. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { ageAfterYears, earthSvg, fmt, gearsSvg, MONTH, metonicDays, moonAge, moonSvg, phaseName, ratio, sarosDays, sarosShift, sunSvg, TARGET, yearsDays, YEAR } from '../../lib/antikythera';

const root = document.querySelector<HTMLElement>('[data-anti]');

if (root) {
  initSoundButton(root);

  // Front face: the crank and the Moon
  const mo = root.querySelector<HTMLElement>('[data-moon-tool]');
  if (mo) {
    const range = q<HTMLInputElement>(mo, '[data-moon-range]');
    let lastPhase = '';
    const draw = () => {
      fillRange(range);
      const days = Number(range.value);
      const age = moonAge(days);
      q(mo, '[data-moon-out]').textContent = String(days);
      q(mo, '[data-moon-moon]').innerHTML = moonSvg(age);
      q(mo, '[data-moon-sun]').innerHTML = sunSvg(days);
      const phase = phaseName(age);
      q(mo, '[data-moon-status]').textContent = `After ${days} days the Moon is ${fmt(age, 1)} days old, a ${phase}. The Sun has gone ${Math.round(((days % YEAR) / YEAR) * 100)} per cent of the way round the year. A month is ${MONTH} days.`;
      if (phase !== lastPhase) sound.play('tick', 0.25);
      lastPhase = phase;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Back face: nineteen years
  const me = root.querySelector<HTMLElement>('[data-metonic-tool]');
  if (me) {
    const range = q<HTMLInputElement>(me, '[data-metonic-range]');
    const draw = () => {
      fillRange(range);
      const y = Number(range.value);
      q(me, '[data-metonic-out]').textContent = String(y);
      const age = ageAfterYears(y);
      const text = y === 19
        ? `After 19 years the Moon is ${fmt(age, 1)} days old on the same date, so it is about ${fmt((MONTH - age) * 24, 0)} hours short of new again. 19 years is ${fmt(19 * YEAR, 2)} days and 235 months is ${fmt(metonicDays, 2)} days.`
        : `After ${y} year${y === 1 ? '' : 's'} the Moon is ${fmt(age, 1)} days old on the same date, a ${phaseName(age)}. Only after 19 years does it come back to new.`;
      q(me, '[data-metonic-status]').textContent = text;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Back face: the eclipse cycle
  const sa = root.querySelector<HTMLElement>('[data-saros-tool]');
  if (sa) {
    const range = q<HTMLInputElement>(sa, '[data-saros-range]');
    const draw = () => {
      fillRange(range);
      const n = Number(range.value);
      q(sa, '[data-saros-out]').textContent = String(n);
      q(sa, '[data-saros-g]').innerHTML = earthSvg(n);
      const deg = Math.round(sarosShift(n));
      q(sa, '[data-saros-status]').textContent = n === 0
        ? 'An eclipse. The shadow falls at the mark at the top of the Earth.'
        : `${n} Saros period${n === 1 ? ' is' : 's are'} ${fmt(sarosDays * n)} days, which is ${yearsDays(sarosDays * n)}. The shadow has moved about ${deg} degrees west${deg > 300 ? ', a few degrees short of a full turn' : ''}.`;
    };
    range.addEventListener('input', draw);
    draw();
  }

  // Inside: gear it
  const ge = root.querySelector<HTMLElement>('[data-gears-tool]');
  if (ge) {
    const keys = ['a', 'b', 'c', 'd'] as const;
    const inputs = keys.map((k) => q<HTMLInputElement>(ge, `[data-gears-${k}]`));
    const turn = q<HTMLInputElement>(ge, '[data-gears-turn]');
    let hit = false;
    const draw = () => {
      [...inputs, turn].forEach(fillRange);
      const [a, b, c, d] = inputs.map((i) => Number(i.value));
      keys.forEach((k, i) => (q(ge, `[data-gears-out-${k}]`).textContent = inputs[i].value));
      q(ge, '[data-gears-out-turn]').textContent = turn.value;
      q(ge, '[data-gears-g]').innerHTML = gearsSvg(a, b, c, d, Number(turn.value));
      const r = ratio(a, b, c, d);
      const off = Math.abs(r - TARGET) / TARGET;
      const verdict = off < 1e-9 ? 'That is spot on.' : off < 0.001 ? `That is within one part in a thousand (off by ${(off * 100).toFixed(3)} per cent). Good.` : `That is off by ${(off * 100).toFixed(1)} per cent.`;
      q(ge, '[data-gears-status]').textContent = `Gears ${a}, ${b}, ${c} and ${d} make ${fmt(r, 4)} turns of the last gear for one turn of the first. The target is 235 over 19, which is ${fmt(TARGET, 4)}. ${verdict}`;
      const ok = off < 0.001;
      if (ok && !hit) sound.play('good', 0.4);
      hit = ok;
    };
    [...inputs, turn].forEach((i) => i.addEventListener('input', draw));
    draw();
  }
}
