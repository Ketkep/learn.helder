// Reading 1: the byte as a number. Add the place value of every switch that is on.

import * as sound from '../sound';
import { q } from '../util';
import { getByte, setByte, watch } from './byte';

export function initNumber(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-number-tool]');
  if (!tool) return;
  const places = [...tool.querySelectorAll<HTMLElement>('[data-place]')];
  const sum = q<HTMLElement>(tool, '[data-number-sum]');
  const status = q<HTMLElement>(tool, '[data-number-status]');
  const input = q<HTMLInputElement>(tool, '[data-number-input]');

  watch(() => {
    const v = getByte();
    const on = places.map((p) => Number(p.dataset.place)).filter((p) => (v & p) !== 0);
    places.forEach((p) => p.classList.toggle('on', (v & Number(p.dataset.place)) !== 0));
    sum.textContent = on.length ? `${on.join(' + ')} = ${v}` : '0';
    if (document.activeElement !== input) input.value = String(v);
    status.textContent = on.length
      ? `The switches worth ${on.join(', ')} are on. ${on.join(' + ')}${on.length > 1 ? ` = ${v}` : ''}.${v === 255 ? ' This is the biggest number a byte can hold.' : ''}`
      : 'Every switch is off, so the number is 0.';
  });

  input.addEventListener('input', () => {
    if (input.value !== '') setByte(Number(input.value));
  });
  for (const b of tool.querySelectorAll<HTMLButtonElement>('[data-number-jump]')) {
    b.addEventListener('click', () => {
      setByte(Number(b.dataset.numberJump));
      sound.play('pop');
    });
  }
}
