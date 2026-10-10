// The Bread page: four stops through a day with one loaf. This file starts each stop.

import { initKnead } from './knead';
import { initRise } from './rise';
import { initSpring } from './spring';
import { initCrust } from './crust';

const root = document.querySelector<HTMLElement>('[data-bread]');

if (root) {
  initKnead(root);
  initRise(root);
  initSpring(root);
  initCrust(root);
}
