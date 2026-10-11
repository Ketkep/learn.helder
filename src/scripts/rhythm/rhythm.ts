// The Rhythm page: four boards of a drum machine. This file starts each board and the sound switch.

import { initSoundButton } from '../soundButton';
import { initBeat } from './beat';
import { initGrid } from './grid';
import { initEuclid } from './euclid';
import { initPoly } from './poly';

const root = document.querySelector<HTMLElement>('[data-rhythm]');

if (root) {
  initBeat(root);
  initGrid(root);
  initEuclid(root);
  initPoly(root);
  initSoundButton(root);
}
