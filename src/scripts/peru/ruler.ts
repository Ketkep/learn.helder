// Shot 7: the year line. Drag the year to see which of these places and buildings were around.

import * as sound from '../sound';
import { clamp, fillRange, q, sayYear } from './util';

export function initRuler(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-ruler-tool]');
  if (!tool) return;
  const min = Number(tool.dataset.min);
  const max = Number(tool.dataset.max);
  const range = q<HTMLInputElement>(root, '[data-ruler-range]');
  const out = q<HTMLOutputElement>(root, '[data-ruler-out]');
  const now = q<HTMLElement>(tool, '[data-now]');
  const plot = q<HTMLElement>(tool, '[data-ruler-plot]');
  const status = q<HTMLElement>(root, '[data-ruler-status]');
  const rows = [...tool.querySelectorAll<HTMLElement>('[data-span]')];
  const notes = new Map<string, string>([
    ['caral', 'People live in the pyramid city of Caral.'],
    ['giza', 'In Egypt, the Great Pyramid of Giza is being built.'],
    ['moche', 'The Moche are building their huge adobe pyramids.'],
    ['lima', 'The Lima culture is building its adobe pyramid in what is now the city of Lima.'],
    ['inca', 'The Inca empire is growing. Machu Picchu is built around 1450.'],
  ]);
  let lastKey = '';

  function set(year: number, quiet = false) {
    const y = clamp(Math.round(year / 10) * 10, min, max);
    range.value = String(y);
    fillRange(range);
    out.textContent = y >= 2000 ? 'Today' : sayYear(y);
    now.style.left = `${((y - min) / (max - min)) * 100}%`;

    const live: string[] = [];
    for (const row of rows) {
      const on = y >= Number(row.dataset.from) && y <= Number(row.dataset.to);
      row.classList.toggle('live', on);
      if (on) live.push(notes.get(row.dataset.span!) ?? '');
    }

    if (y >= 2000) status.textContent = 'Today. None of these are still going, but you can visit what they built.';
    else if (live.length) status.textContent = `${sayYear(y)}. ${live.join(' ')}`;
    else status.textContent = `${sayYear(y)}. Nothing on this list is happening in this year. Drag on.`;

    const key = live.join('|');
    if (!quiet && key !== lastKey) sound.play('tick');
    lastKey = key;
  }

  range.addEventListener('input', () => set(Number(range.value)));
  for (const b of root.querySelectorAll<HTMLButtonElement>('[data-year]')) {
    b.addEventListener('click', () => {
      set(Number(b.dataset.year));
      sound.play('pop');
    });
  }

  // Dragging on the picture moves the year too
  let dragging = false;
  const fromPointer = (e: PointerEvent) => {
    const box = plot.getBoundingClientRect();
    set(min + clamp((e.clientX - box.left) / box.width, 0, 1) * (max - min));
  };
  tool.addEventListener('pointerdown', (e) => {
    dragging = true;
    tool.setPointerCapture(e.pointerId);
    fromPointer(e);
  });
  tool.addEventListener('pointermove', (e) => {
    if (dragging) fromPointer(e);
  });
  const stop = () => {
    dragging = false;
  };
  tool.addEventListener('pointerup', stop);
  tool.addEventListener('pointercancel', stop);

  set(max, true);
}
