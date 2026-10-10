// Stop 2 (the rise): dough in a jar, with the temperature and the hours to move.

import { fillRange, q } from '../util';
import { doubleMinutes, fmtDuration, growth, jarSvg, yeastRate } from '../../lib/bread';

export function initRise(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-rise-tool]');
  if (!tool) return;
  const temp = q<HTMLInputElement>(tool, '[data-rise-temp]');
  const hours = q<HTMLInputElement>(tool, '[data-rise-hours]');
  const dough = q(tool, '[data-rise-dough]');
  const status = q<HTMLElement>(tool, '[data-rise-status]');

  function draw() {
    const [t, h] = [Number(temp.value), Number(hours.value)];
    fillRange(temp);
    fillRange(hours);
    q(tool!, '[data-rise-temp-out]').textContent = `${t} degrees`;
    q(tool!, '[data-rise-hours-out]').textContent = `${h} hours`;
    const g = growth(t, h);
    dough.innerHTML = jarSvg(g);
    const rate = yeastRate(t);
    const words = rate === 0 ? `At ${t} degrees the yeast is dead, so the dough does not rise.` : `At ${t} degrees the dough doubles in about ${fmtDuration(doubleMinutes(t))}${t <= 8 ? ', which is slow but not stopped' : t > 40 ? ', slower than at 32 degrees because it is too hot' : ''}.`;
    const size = rate === 0 ? 'It stays at its first size.' : g >= 4 ? `After ${h} hours it has grown 4 times or more, and a real dough would have collapsed by now.` : `After ${h} hours it is ${g.toFixed(1)} times its first size.`;
    status.textContent = `${words} ${size}`;
  }
  temp.addEventListener('input', draw);
  hours.addEventListener('input', draw);
  draw();
}
