// The Bits page: eight switches and four ways to read them. This file starts each panel and the sound switch.

import { initSoundButton } from '../soundButton';
import { initDock } from './dock';
import { initNumber } from './number';
import { initLetter } from './letter';
import { initCount } from './count';
import { initColour } from './colour';

const root = document.querySelector<HTMLElement>('[data-bits]');

if (root) {
  initDock(root);
  initNumber(root);
  initLetter(root);
  initCount(root);
  initColour(root);
  initSoundButton(root);
}
