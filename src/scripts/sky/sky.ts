// The Sky page: four windows. This file starts each one.

import { initWaves } from './waves';
import { initSun } from './sun';
import { initViolet } from './violet';
import { initCloud } from './cloud';

const root = document.querySelector<HTMLElement>('[data-sky]');

if (root) {
  initWaves(root);
  initSun(root);
  initViolet(root);
  initCloud(root);
}
