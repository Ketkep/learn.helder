// The Leaves page: three panels. This file starts each one.

import { initMix } from './mix';
import { initPaper } from './paper';
import { initSeason } from './season';

const root = document.querySelector<HTMLElement>('[data-leaves]');

if (root) {
  initMix(root);
  initPaper(root);
  initSeason(root);
}
