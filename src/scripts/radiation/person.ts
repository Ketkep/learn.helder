// Scene 8: the person. Three body areas show the complaints that are common there, and a button
// hangs up streamers for the last session.

import * as sound from '../sound';
import { q } from '../util';
import { lastSession } from '../../data/radiation';

export function initPerson(root: HTMLElement) {
  const sec = root.querySelector<HTMLElement>('[data-scene="person"]');
  if (!sec) return;
  const art = q<SVGElement>(sec, '[data-person-art]');
  const buttons = [...sec.querySelectorAll<HTMLButtonElement>('[data-area-btn]')];
  const infos = [...sec.querySelectorAll<HTMLElement>('[data-area-info]')];
  const spots = [...sec.querySelectorAll<SVGElement>('[data-spot]')];
  const last = q<HTMLButtonElement>(sec, '[data-last-btn]');
  const status = q<HTMLElement>(sec, '[data-pe-status]');

  const show = (id: string) => {
    art.setAttribute('data-area', id);
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.areaBtn === id)));
    infos.forEach((i) => {
      i.toggleAttribute('data-off', i.dataset.areaInfo !== id);
      i.setAttribute('aria-hidden', String(i.dataset.areaInfo !== id));
    });
  };

  buttons.forEach((b) =>
    b.addEventListener('click', () => {
      show(b.dataset.areaBtn ?? 'head');
      sound.play('pop');
    }),
  );
  spots.forEach((s) =>
    s.addEventListener('click', () => {
      show(s.dataset.spot ?? 'head');
      sound.play('pop');
    }),
  );
  last.addEventListener('click', () => {
    const on = art.getAttribute('data-last') !== 'on';
    art.setAttribute('data-last', on ? 'on' : 'off');
    last.setAttribute('aria-pressed', String(on));
    status.textContent = on ? lastSession : '';
    if (on) sound.play('good');
  });

  show('head');
}
