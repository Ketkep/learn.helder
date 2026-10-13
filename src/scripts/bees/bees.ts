// The Bees page: four looks into the hive. This file starts each one.

import { initRead } from './read';
import { initSend } from './send';
import { initSun } from './sun';
import { initNoise } from './noise';

const root = document.querySelector<HTMLElement>('[data-bees]');

if (root) {
  initRead(root);
  initSend(root);
  initSun(root);
  initNoise(root);
}
