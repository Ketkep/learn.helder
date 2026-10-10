// Bench 4: how many keys a lock can have.

import { fillRange, q } from '../util';
import { keyspace } from '../../lib/lock';

const group = (n: number) => n.toLocaleString('en-US');

export function initCount(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-count-tool]');
  if (!tool) return;
  const pins = q<HTMLInputElement>(tool, '[data-count-pins]');
  const depths = q<HTMLInputElement>(tool, '[data-count-depths]');
  const macs = q<HTMLInputElement>(tool, '[data-count-macs]');
  const status = q<HTMLElement>(tool, '[data-count-status]');

  function draw() {
    const [p, d] = [Number(pins.value), Number(depths.value)];
    const m = Math.min(Number(macs.value), d - 1);
    for (const r of [pins, depths, macs]) fillRange(r);
    q(tool!, '[data-count-pins-out]').textContent = String(p);
    q(tool!, '[data-count-depths-out]').textContent = String(d);
    q(tool!, '[data-count-macs-out]').textContent = String(m);
    const { raw, allowed } = keyspace(p, d, m);
    const sum = `${Array(p).fill(d).join(' × ')} = ${group(raw)}`;
    status.textContent = `${p} pins with ${d} depths make ${sum} keys. ${m >= d - 1 ? 'Allowing any neighbouring cuts leaves all of them.' : `Keeping neighbouring cuts at most ${m} step${m === 1 ? '' : 's'} apart leaves ${group(allowed)} of them, which is ${group(raw - allowed)} fewer.`}`;
  }
  for (const r of [pins, depths, macs]) r.addEventListener('input', draw);
  draw();
}
