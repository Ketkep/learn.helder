// Bench 2: push a key into the pin lock.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { keys, opens, pinViews } from '../../lib/lock';
import { blockers, drawPins, setBolt } from './pins';

type KeyId = keyof typeof keys;

export function initInsert(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-pins-tool]');
  if (!tool) return;
  const svg = q<SVGElement>(tool, '[data-pinlock]');
  const range = q<HTMLInputElement>(tool, '[data-pins-range]');
  const out = q<HTMLOutputElement>(tool, '[data-pins-out]');
  const status = q<HTMLElement>(tool, '[data-pins-status]');
  const picks = [...tool.querySelectorAll<HTMLButtonElement>('[data-pins-key]')];
  let keyId: KeyId = 'right';

  const t = () => Number(range.value) / 100;
  function draw() {
    fillRange(range);
    out.textContent = t() >= 1 ? 'all the way' : `${Math.round(t() * 100)} per cent`;
    const views = drawPins(svg, keys[keyId].cuts, t());
    setBolt(svg, false);
    if (t() < 1) status.textContent = 'Watch the pins ride up and down over the cuts as the key moves in.';
    else if (opens(keys[keyId].cuts, 1)) status.textContent = `${keys[keyId].name} is the right key. Every pair of pins splits exactly at the shear line, so the plug is free to turn.`;
    else status.textContent = `${keys[keyId].name} is not the right key: ${blockers(views)}. A pair that does not split at the shear line stops the plug.`;
  }
  range.addEventListener('input', draw);
  for (const b of picks) {
    b.addEventListener('click', () => {
      keyId = b.dataset.pinsKey as KeyId;
      for (const o of picks) {
        o.setAttribute('aria-pressed', String(o === b));
        o.classList.toggle('fill', o === b);
      }
      sound.play('tick', 0.4);
      draw();
    });
  }
  q(tool, '[data-pins-turn]').addEventListener('click', () => {
    if (t() < 1) {
      status.textContent = 'Push the key all the way in first.';
      return;
    }
    const views = pinViews(keys[keyId].cuts, 1);
    if (opens(keys[keyId].cuts, 1)) {
      setBolt(svg, true);
      status.textContent = 'The plug turns and the bolt pulls back. The door is open.';
      sound.play('snap', 0.6);
    } else {
      status.textContent = `The plug will not turn: ${blockers(views)}.`;
      sound.play('thud', 0.5);
    }
  });
  draw();
}
