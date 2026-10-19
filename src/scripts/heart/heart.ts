// The heart page: four beats. This file starts each one.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { beatsInLife, beatsPerDay, fmtBig, heartSvg, litresPerDay, output, phases, route, valvesSvg } from '../../lib/heart';

const root = document.querySelector<HTMLElement>('[data-heart]');

if (root) {
  // Beat 1: the route
  const rt = root.querySelector<HTMLElement>('[data-route-tool]');
  if (rt) {
    let step = 0;
    const draw = () => {
      q(rt, '[data-route-g]').innerHTML = heartSvg(step);
      q(rt, '[data-route-status]').textContent = `Step ${step + 1} of ${route.length}: ${route[step].name}. ${route[step].text}`;
    };
    q(rt, '[data-route-next]').addEventListener('click', () => {
      step = (step + 1) % route.length;
      sound.play('tick', 0.4);
      draw();
    });
    q(rt, '[data-route-reset]').addEventListener('click', () => {
      step = 0;
      draw();
    });
    draw();
  }

  // Beat 2: litres a minute
  const li = root.querySelector<HTMLElement>('[data-litres-tool]');
  if (li) {
    const hr = q<HTMLInputElement>(li, '[data-litres-hr]');
    const sv = q<HTMLInputElement>(li, '[data-litres-sv]');
    const draw = () => {
      fillRange(hr);
      fillRange(sv);
      const [h, s] = [Number(hr.value), Number(sv.value)];
      q(li, '[data-litres-hr-out]').textContent = String(h);
      q(li, '[data-litres-sv-out]').textContent = String(s);
      q(li, '[data-litres-big]').textContent = `${output(h, s).toFixed(1)} litres a minute`;
      q(li, '[data-litres-status]').textContent = `${h} beats a minute of ${s} millilitres each is ${output(h, s).toFixed(1)} litres a minute. In a day that is ${beatsPerDay(h).toLocaleString('en-US')} beats and ${Math.round(litresPerDay(h, s)).toLocaleString('en-US')} litres.`;
    };
    hr.addEventListener('input', draw);
    sv.addEventListener('input', draw);
    draw();
  }

  // Beat 3: a lifetime
  const life = root.querySelector<HTMLElement>('[data-life-tool]');
  if (life) {
    const age = q<HTMLInputElement>(life, '[data-life-age]');
    const hr = q<HTMLInputElement>(life, '[data-life-hr]');
    const draw = () => {
      fillRange(age);
      fillRange(hr);
      const [a, h] = [Number(age.value), Number(hr.value)];
      q(life, '[data-life-age-out]').textContent = String(a);
      q(life, '[data-life-hr-out]').textContent = String(h);
      q(life, '[data-life-big]').textContent = `${fmtBig(beatsInLife(h, a))} beats`;
      q(life, '[data-life-status]').textContent = `At ${h} beats a minute for ${a} year${a === 1 ? '' : 's'} the heart beats about ${fmtBig(beatsInLife(h, a))} times. That is only arithmetic and does not predict anything about anyone.`;
    };
    age.addEventListener('input', draw);
    hr.addEventListener('input', draw);
    draw();
  }

  // Beat 4: the valves
  const va = root.querySelector<HTMLElement>('[data-valves-tool]');
  if (va) {
    const picks = va.querySelectorAll<HTMLElement>('[data-valves-pick]');
    picks.forEach((b) =>
      b.addEventListener('click', () => {
        const p = phases.find((x) => x.id === b.getAttribute('data-valves-pick')) || phases[0];
        picks.forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
        q(va, '[data-valves-g]').innerHTML = valvesSvg(p);
        q(va, '[data-valves-status]').textContent = `${p.name}: ${p.text}`;
        sound.play('pop', 0.4);
      }),
    );
  }
}
