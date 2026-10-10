// Bench 1: the wooden peg lock.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { WOOD_HOLES, WOOD_X, holeX, pegsLifted, woodKeys } from '../../lib/lock';

type KeyId = keyof typeof woodKeys;

export function initWood(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-wood-tool]');
  if (!tool) return;
  const svg = q<SVGElement>(tool, '[data-wood-svg]');
  const range = q<HTMLInputElement>(tool, '[data-wood-range]');
  const out = q<HTMLOutputElement>(tool, '[data-wood-out]');
  const status = q<HTMLElement>(tool, '[data-wood-status]');
  const picks = [...tool.querySelectorAll<HTMLButtonElement>('[data-wood-key-pick]')];
  const bolt = q<SVGElement>(svg, '[data-bolt]');
  let keyId: KeyId = 'right';
  let open = false;

  const note: Record<KeyId, string> = {
    right: 'Key A has three prongs, spaced like the three holes.',
    wide: 'Key B has three prongs, but they are spaced too far apart.',
    short: 'Key C has the right spacing but only two prongs.',
  };

  function draw(message = true) {
    const key = woodKeys[keyId];
    const t = Number(range.value) / 100;
    const lifted = pegsLifted(key, t);
    const all = lifted.every(Boolean);
    if (!all) open = false;
    fillRange(range);
    out.textContent = t >= 1 ? 'all the way' : `${Math.round(t * 100)} per cent`;
    q<SVGElement>(svg, '[data-wood-key]').style.transform = `translateX(${WOOD_X - 150 + t * 150}px)`;
    svg.querySelectorAll<SVGElement>('[data-bar]').forEach((b) => b.setAttribute('width', String((key.prongs - 1) * key.gap + 18)));
    const start = WOOD_X - 150 + t * 150;
    for (let j = 0; j < 3; j++) {
      const prong = q<SVGElement>(svg, `[data-prong="${j}"]`);
      const present = j < key.prongs;
      const under = present && Array.from({ length: WOOD_HOLES }, (_, i) => Math.abs(start + j * key.gap - holeX(i)) < 7).some(Boolean);
      prong.setAttribute('x', String(j * key.gap - 5));
      prong.setAttribute('y', under ? '66' : '102');
      prong.setAttribute('height', under ? '52' : '16');
      prong.style.display = present ? '' : 'none';
    }
    lifted.forEach((l, i) => q(svg, `[data-peg="${i}"]`).setAttribute('y', l ? '26' : '52'));
    bolt.style.transform = `translateX(${open ? -50 : 0}px)`;
    if (message) {
      const n = lifted.filter(Boolean).length;
      status.textContent = `${note[keyId]} ${n} of 3 pegs ${n === 1 ? 'is' : 'are'} lifted. ${all ? 'The bolt can slide.' : 'The pegs that are still down hold the bolt.'}`;
    }
  }

  range.addEventListener('input', () => draw());
  for (const b of picks) {
    b.addEventListener('click', () => {
      keyId = b.dataset.woodKeyPick as KeyId;
      open = false;
      for (const o of picks) {
        o.setAttribute('aria-pressed', String(o === b));
        o.classList.toggle('fill', o === b);
      }
      draw();
    });
  }
  q(tool, '[data-wood-bolt]').addEventListener('click', () => {
    const lifted = pegsLifted(woodKeys[keyId], Number(range.value) / 100);
    const down = lifted.filter((l) => !l).length;
    if (down === 0) {
      open = !open;
      draw(false);
      status.textContent = open ? 'The bolt slides back: the door is open.' : 'The bolt slides home: the door is locked.';
      sound.play(open ? 'snap' : 'thud', 0.5);
    } else {
      status.textContent = `The bolt does not move. ${down} peg${down === 1 ? ' is' : 's are'} still down in the holes.`;
      sound.play('thud', 0.4);
    }
  });
  draw();
}
