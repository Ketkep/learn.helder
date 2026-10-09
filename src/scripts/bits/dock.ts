// The eight switches at the bottom of the page. Flipping one changes the byte that every panel reads.

import * as sound from '../sound';
import { q } from '../util';
import { bits, getByte, isOn, setByte, watch } from './byte';

export function initDock(root: HTMLElement) {
  const dock = root.querySelector<HTMLElement>('[data-dock]');
  if (!dock) return;
  const switches = [...dock.querySelectorAll<HTMLButtonElement>('[data-bit]')];
  const number = q<HTMLElement>(dock, '[data-dock-number]');
  const text = q<HTMLElement>(dock, '[data-dock-bits]');

  watch(() => {
    const v = getByte();
    for (const s of switches) {
      const on = isOn(v, Number(s.dataset.bit));
      s.setAttribute('aria-pressed', String(on));
      q<HTMLElement>(s, '[data-digit]').textContent = on ? '1' : '0';
    }
    number.textContent = String(v);
    text.textContent = bits(v);
  });
  for (const s of switches) {
    s.addEventListener('click', () => {
      setByte(getByte() ^ (1 << Number(s.dataset.bit)));
      sound.play('snap');
    });
  }
}
