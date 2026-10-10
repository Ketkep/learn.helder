// Bench 3: cut your own key.

import * as sound from '../sound';
import { q } from '../util';
import { DEPTHS, SECRET, keys, opens, pinViews } from '../../lib/lock';
import { blockers, drawPins, setBolt } from './pins';

export function initCut(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-cut-tool]');
  if (!tool) return;
  const svg = q<SVGElement>(tool, '[data-pinlock]');
  const status = q<HTMLElement>(tool, '[data-cut-status]');
  const cuts = [...keys.near.cuts];

  function draw() {
    cuts.forEach((c, i) => (q(tool!, `[data-cut-value="${i}"]`).textContent = String(c)));
    const views = drawPins(svg, cuts, 1);
    setBolt(svg, false);
    const good = views.filter((v) => v.state === 'ok').length;
    status.textContent = `The cuts are ${cuts.join(', ')}. ${good} of 5 pairs of pins split at the shear line.${good < 5 ? ` ${blockers(views).replace(/^./, (c) => c.toUpperCase())}.` : ' The plug is free to turn.'}`;
  }
  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-cut-step]')) {
    b.addEventListener('click', () => {
      const [i, d] = b.dataset.cutStep!.split(',').map(Number);
      cuts[i] = Math.max(0, Math.min(DEPTHS - 1, cuts[i] + d));
      sound.play('tick', 0.3);
      draw();
    });
  }
  q(tool, '[data-cut-turn]').addEventListener('click', () => {
    if (opens(cuts, 1)) {
      setBolt(svg, true);
      status.textContent = `The plug turns and the bolt pulls back. You found the right cuts: ${SECRET.join(', ')}.`;
      sound.play('snap', 0.6);
    } else {
      status.textContent = `The plug will not turn: ${blockers(pinViews(cuts, 1))}.`;
      sound.play('thud', 0.5);
    }
  });
  q(tool, '[data-cut-reset]').addEventListener('click', () => {
    cuts.splice(0, cuts.length, ...keys.near.cuts);
    draw();
  });
  draw();
}
