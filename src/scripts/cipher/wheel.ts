// Try 1: the cipher wheel.

import * as sound from '../sound';
import { fillRange, q } from '../util';
import { shift } from '../../lib/cipher';

export function initWheel(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-wheel-tool]');
  if (!tool) return;
  const turn = q<SVGElement>(tool, '[data-wheel-turn]');
  const text = q<HTMLTextAreaElement>(tool, '[data-wheel-text]');
  const key = q<HTMLInputElement>(tool, '[data-wheel-key]');
  const result = q<HTMLElement>(tool, '[data-wheel-result]');
  const status = q<HTMLElement>(tool, '[data-wheel-status]');
  const modes = [...tool.querySelectorAll<HTMLButtonElement>('[data-wheel-mode]')];
  let mode: 'hide' | 'read' = 'hide';

  function draw() {
    const k = Number(key.value);
    fillRange(key);
    q(tool!, '[data-wheel-out]').textContent = String(k);
    turn.style.transform = `rotate(${(-k * 360) / 26}deg)`;
    result.textContent = shift(text.value, mode === 'hide' ? k : -k);
    const a = shift('A', k);
    status.textContent = `With the wheel turned by ${k}, A ${mode === 'hide' ? 'becomes' : 'is read as'} ${mode === 'hide' ? a : shift('A', -k)}. ${k === 0 ? 'A shift of 0 changes nothing.' : k === 13 ? 'A shift of 13 is ROT13: doing it twice gets you back to where you began.' : ''}`;
  }

  text.addEventListener('input', draw);
  key.addEventListener('input', () => {
    draw();
    sound.play('tick', 0.3);
  });
  for (const b of modes) {
    b.addEventListener('click', () => {
      mode = b.dataset.wheelMode as 'hide' | 'read';
      for (const o of modes) {
        o.setAttribute('aria-pressed', String(o === b));
        o.classList.toggle('fill', o === b);
      }
      draw();
    });
  }
  q(tool, '[data-wheel-rot]').addEventListener('click', () => {
    key.value = '13';
    draw();
  });
  draw();
}
