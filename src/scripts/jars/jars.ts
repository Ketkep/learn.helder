// The insurance page: four jars. This file starts each one.

import * as sound from '../sound';
import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { CHANCE, chancePaid, claimsRatio, fmt, sharedYears, spread, spreadSvg, yearsOfLosses, yearsSvg } from '../../lib/jars';

const root = document.querySelector<HTMLElement>('[data-jars]');

const sizeButtons = (host: HTMLElement, sizes: number[], start: number, on: (n: number) => void) => {
  sizes.forEach((n) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pick';
    b.textContent = `${fmt(n)} people`;
    b.setAttribute('aria-pressed', n === start ? 'true' : 'false');
    b.addEventListener('click', () => {
      host.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      on(n);
      sound.play('tick', 0.3);
    });
    host.appendChild(b);
  });
};

if (root) {
  initSoundButton(root);

  // Jar 1: twenty years of one village jar
  const po = root.querySelector<HTMLElement>('[data-pool-tool]');
  if (po) {
    let n = 1000;
    let seed = 1;
    const draw = () => {
      const ratios = yearsOfLosses(n, CHANCE, seed).map((k) => claimsRatio(k, n, CHANCE));
      q(po, '[data-pool-g]').innerHTML = yearsSvg(ratios);
      const lo = Math.min(...ratios) * 100;
      const hi = Math.max(...ratios) * 100;
      q(po, '[data-pool-status]').textContent = `A village of ${fmt(n)} collects 100 units from each person. Over twenty years the claims ran from ${fmt(lo)}% to ${fmt(hi)}% of what was collected.${hi > 300 ? ' Bars above 300% are cut off at the top and marked with an arrow.' : ''}`;
    };
    po.querySelectorAll<HTMLElement>('[data-pool-size]').forEach((b) =>
      b.addEventListener('click', () => {
        n = Number(b.getAttribute('data-pool-size'));
        po.querySelectorAll('[data-pool-size]').forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
        draw();
        sound.play('tick', 0.3);
      }),
    );
    q(po, '[data-pool-next]').addEventListener('click', () => {
      seed += 1;
      draw();
      sound.play('tick', 0.3);
    });
    draw();
  }

  // Jar 2: why a bigger pool is steadier
  const st = root.querySelector<HTMLElement>('[data-steady-tool]');
  if (st) {
    const range = q<HTMLInputElement>(st, '[data-steady-range]');
    let n = 1000;
    const draw = () => {
      fillRange(range);
      const p = Number(range.value) / 1000;
      q(st, '[data-steady-out]').textContent = (p * 100).toFixed(1);
      q(st, '[data-steady-g]').innerHTML = spreadSvg(p, n);
      const exp = n * p;
      q(st, '[data-steady-status]').textContent = `With a ${fmt(p * 100, 1)}% chance and ${fmt(n)} people, the usual swing is ${fmt(spread(n, p) * 100)}% of the expected ${fmt(exp, exp < 10 ? 1 : 0)} losses.`;
    };
    sizeButtons(q(st, '[data-steady-sizes]'), [100, 1000, 10000, 100000], n, (v) => {
      n = v;
      draw();
    });
    range.addEventListener('input', draw);
    draw();
  }

  // Jar 3: can the jar pay
  const pa = root.querySelector<HTMLElement>('[data-pay-tool]');
  if (pa) {
    const range = q<HTMLInputElement>(pa, '[data-pay-range]');
    let n = 1000;
    const draw = () => {
      fillRange(range);
      const m = Number(range.value) / 100;
      q(pa, '[data-pay-out]').textContent = range.value;
      const c = chancePaid(n, CHANCE, m);
      q<HTMLElement>(pa, '[data-pay-bar]').style.width = `${c * 100}%`;
      q(pa, '[data-pay-status]').textContent = `With a 1 in 100 chance, ${fmt(n)} people and ${range.value}% extra, the jar covers the claims in ${fmt(c * 100)}% of years.`;
    };
    sizeButtons(q(pa, '[data-pay-sizes]'), [100, 1000, 10000], n, (v) => {
      n = v;
      draw();
    });
    range.addEventListener('input', draw);
    draw();
  }

  // Jar 4: when everyone is hit together
  const to = root.querySelector<HTMLElement>('[data-together-tool]');
  if (to) {
    // Fixed seeds, chosen so that each draw of twenty years has at least one event
    const events = [1, 6, 13, 16, 23, 26, 27, 29];
    let round = 0;
    const draw = () => {
      const a = yearsOfLosses(1000, CHANCE, 3 + 2 * round).map((k) => claimsRatio(k, 1000, CHANCE));
      const sharedLosses = sharedYears(1000, CHANCE, events[round % events.length]);
      const b = sharedLosses.map((k) => claimsRatio(k, 1000, CHANCE));
      q(to, '[data-together-a]').innerHTML = yearsSvg(a);
      q(to, '[data-together-b]').innerHTML = yearsSvg(b);
      const hits = sharedLosses.filter((k) => k > 0).length;
      q(to, '[data-together-status]').textContent = `In the first village the claims ran from ${fmt(Math.min(...a) * 100)}% to ${fmt(Math.max(...a) * 100)}% of what was collected. In the second, ${hits === 0 ? 'there was no event in these twenty years, so no claims at all' : hits === 1 ? 'one year had the event, and it had about 100 times what was collected, far above the chart' : `${hits} years had the event, and each had about 100 times what was collected, far above the chart`}.`;
    };
    q(to, '[data-together-next]').addEventListener('click', () => {
      round += 1;
      draw();
      sound.play('tick', 0.3);
    });
    draw();
  }
}
