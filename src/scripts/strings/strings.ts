// The Strings page: five strings stretched across the screen. This file starts each tool and the sound switch.

import { initSoundButton } from '../soundButton';
import { initLength } from './length';
import { initWave } from './wave';
import { initTight } from './tight';
import { initRatio } from './ratio';
import { initSound } from './build';

const root = document.querySelector<HTMLElement>('[data-strings]');

if (root) {
  initLength(root);
  initWave(root);
  initTight(root);
  initRatio(root);
  initSound(root);
  initSoundButton(root);
}
