// The inflation page: three lines of a receipt. This file starts each one.

import { initSoundButton } from '../soundButton';
import { fillRange, q } from '../util';
import { BASKET, START, basketChange, basketSvg, buys, euro, fmt, grow, paySvg, priceSvg, realChange } from '../../lib/prices';

const root = document.querySelector<HTMLElement>('[data-prices]');

if (root) {
  initSoundButton(root);

  // Line 1: steady rises add up
  const ye = root.querySelector<HTMLElement>('[data-years-tool]');
  if (ye) {
    const rate = q<HTMLInputElement>(ye, '[data-years-rate]');
    const years = q<HTMLInputElement>(ye, '[data-years-range]');
    const draw = () => {
      [rate, years].forEach(fillRange);
      const r = Number(rate.value);
      const y = Number(years.value);
      q(ye, '[data-years-rate-out]').textContent = fmt(r, 1).replace('.0', '');
      q(ye, '[data-years-out]').textContent = String(y);
      q(ye, '[data-years-g]').innerHTML = priceSvg(2, r, y);
      q(ye, '[data-years-status]').textContent = `At ${fmt(r, 1).replace('.0', '')}% a year the made-up loaf costs ${euro(grow(2, r, y))} after ${y} ${y === 1 ? 'year' : 'years'}, and 100 euros then buys only what ${fmt(buys(r, y) * 100)} euros buys now.`;
    };
    [rate, years].forEach((i) => i.addEventListener('input', draw));
    draw();
  }

  // Line 2: a basket gives one number
  const ba = root.querySelector<HTMLElement>('[data-basket-tool]');
  if (ba) {
    const changes = START.slice();
    const host = q(ba, '[data-basket-sliders]');
    const outs: HTMLOutputElement[] = [];
    const inputs: HTMLInputElement[] = [];
    const draw = () => {
      q(ba, '[data-basket-g]').innerHTML = basketSvg(changes);
      const t = basketChange(changes);
      const big = BASKET.map((it, i) => ({ it, move: Math.abs(it.weight * changes[i]) })).sort((a, b) => b.move - a.move)[0];
      q(ba, '[data-basket-status]').textContent = `With these changes the basket costs ${fmt(Math.abs(t), 1)}% ${t >= 0 ? 'more' : 'less'}. ${big.move > 0 ? `${big.it.name} moves the figure most, because ${big.it.weight}% of spending goes on it.` : ''}`;
    };
    BASKET.forEach((it, i) => {
      const label = document.createElement('label');
      label.className = 'field';
      const span = document.createElement('span');
      const out = document.createElement('output');
      out.textContent = String(changes[i]);
      span.append(`${it.name} `, out, '%');
      const input = document.createElement('input');
      input.className = 'range';
      input.type = 'range';
      input.min = '-10';
      input.max = '30';
      input.step = '1';
      input.value = String(changes[i]);
      input.setAttribute('aria-label', `Price change of ${it.name.toLowerCase()} in per cent`);
      input.addEventListener('input', () => {
        changes[i] = Number(input.value);
        out.textContent = input.value;
        fillRange(input);
        draw();
      });
      label.append(span, input);
      host.appendChild(label);
      outs.push(out);
      inputs.push(input);
      fillRange(input);
    });
    draw();
  }

  // Line 3: a pay rise that buys less
  const pa = root.querySelector<HTMLElement>('[data-pay-tool]');
  if (pa) {
    const pay = q<HTMLInputElement>(pa, '[data-pay-range]');
    const prices = q<HTMLInputElement>(pa, '[data-prices-range]');
    const draw = () => {
      [pay, prices].forEach(fillRange);
      const a = Number(pay.value);
      const b = Number(prices.value);
      q(pa, '[data-pay-out]').textContent = fmt(a, 1).replace('.0', '');
      q(pa, '[data-prices-out]').textContent = fmt(b, 1).replace('.0', '');
      q(pa, '[data-pay-g]').innerHTML = paySvg(a, b);
      const r = realChange(a, b);
      q(pa, '[data-pay-status]').textContent = `Pay rose ${fmt(a, 1).replace('.0', '')}% and prices rose ${fmt(b, 1).replace('.0', '')}%, so the pay buys ${Math.abs(r) < 0.05 ? 'the same as before' : `about ${fmt(Math.abs(r), 1)}% ${r > 0 ? 'more' : 'less'}`}.`;
    };
    [pay, prices].forEach((i) => i.addEventListener('input', draw));
    draw();
  }
}
