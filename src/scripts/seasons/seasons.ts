// The Seasons page: a wall of four instruments. This file starts each one and the sound switch.

import { initSoundButton } from '../soundButton';
import { initOrbit } from './orbit';
import { initTilt } from './tilt';
import { initDay } from './day';
import { initShadow } from './shadow';

const root = document.querySelector<HTMLElement>('[data-sky]');

if (root) {
  initOrbit(root);
  initTilt(root);
  initDay(root);
  initShadow(root);
  initSoundButton(root);
}
