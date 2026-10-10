// The Maps page: a globe and its flat copy in each panel. This file starts each panel and keeps the projection pickers together.

import { initCircles } from './circles';
import { initSize } from './size';
import { initRoute } from './route';
import { getId, setProjection, watch } from './state';

const root = document.querySelector<HTMLElement>('[data-maps]');

if (root) {
  const selects = [...root.querySelectorAll<HTMLSelectElement>('[data-proj-select]')];
  for (const s of selects) s.addEventListener('change', () => setProjection(s.value));
  watch(() => {
    for (const s of selects) s.value = getId();
  });
  initCircles(root);
  initSize(root);
  initRoute(root);
}
