// The Cannon page: three panels. This file starts each one and the sound switch.

import { initSoundButton } from '../soundButton';
import { initFire } from './fire';
import { initSecond } from './second';
import { initHeights } from './heights';

const root = document.querySelector<HTMLElement>('[data-cannon]');

if (root) {
  initFire(root);
  initSecond(root);
  initHeights(root);
  initSoundButton(root);
}
