// Stop 4: a drop's trail through the places of the water cycle.

import * as sound from '../sound';
import { q } from '../util';
import { type Place, nextPlace, placeById, stay, words } from './journey';

interface Visit {
  place: Place;
  years: number;
}

export function initDrop(root: HTMLElement) {
  const tool = root.querySelector<HTMLElement>('[data-drop-tool]');
  if (!tool) return;
  const trail = q<HTMLOListElement>(tool, '[data-drop-trail]');
  const status = q<HTMLElement>(tool, '[data-drop-status]');
  let visits: Visit[] = [];
  let at: Place = placeById('sea');

  function draw() {
    while (trail.firstChild) trail.removeChild(trail.firstChild);
    for (const v of visits) {
      const li = document.createElement('li');
      li.textContent = `${v.place.name}: ${words(v.years)}`;
      trail.appendChild(li);
    }
    const total = visits.reduce((sum, v) => sum + v.years, 0);
    if (!visits.length) {
      status.textContent = 'A drop starts in the sea. Press Send the drop on to move it.';
      return;
    }
    const seaYears = visits.filter((v) => v.place.id === 'sea').reduce((sum, v) => sum + v.years, 0);
    const share = total ? Math.round((seaYears / total) * 100) : 0;
    status.textContent = `After ${visits.length} stop${visits.length === 1 ? '' : 's'} the drop has travelled for ${words(total)}${seaYears ? `, and ${share} per cent of that time was spent in the sea` : ''}. It is now in ${at.name.toLowerCase()}.`;
  }

  function step() {
    // The drop stays where it is for a while, then moves on to the next place
    visits.push({ place: at, years: stay(at) });
    at = nextPlace(at);
    draw();
    sound.play(at.id === 'air' ? 'whoosh' : at.id === 'sea' ? 'thud' : 'tick', 0.4);
  }

  q<HTMLButtonElement>(tool, '[data-drop-step]').addEventListener('click', step);
  q<HTMLButtonElement>(tool, '[data-drop-run]').addEventListener('click', () => {
    for (let i = 0; i < 10; i++) step();
  });
  q<HTMLButtonElement>(tool, '[data-drop-reset]').addEventListener('click', () => {
    visits = [];
    at = placeById('sea');
    draw();
    sound.play('pop');
  });
  draw();
}
