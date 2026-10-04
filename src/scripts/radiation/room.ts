// Scene 1: the room. Three buttons switch the picture and the words between a linac,
// an MR-linac and a source inside the body.

import * as sound from '../sound';
import { q } from '../util';

export function initRoom(root: HTMLElement) {
  const sec = root.querySelector<HTMLElement>('[data-scene="room"]');
  if (!sec) return;
  const art = q<SVGElement>(sec, '[data-room-art]');
  const buttons = [...sec.querySelectorAll<HTMLButtonElement>('[data-way-btn]')];
  const infos = [...sec.querySelectorAll<HTMLElement>('[data-way-info]')];

  const show = (id: string) => {
    art.setAttribute('data-way', id);
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.wayBtn === id)));
    infos.forEach((i) => {
      i.toggleAttribute('data-off', i.dataset.wayInfo !== id);
      i.setAttribute('aria-hidden', String(i.dataset.wayInfo !== id));
    });
  };

  buttons.forEach((b) =>
    b.addEventListener('click', () => {
      show(b.dataset.wayBtn ?? 'linac');
      sound.play(b.dataset.wayBtn === 'inside' ? 'pop' : 'beam');
    }),
  );
  show('linac');
}
