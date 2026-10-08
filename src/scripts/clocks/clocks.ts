// The Clocks page: a movement taken apart into four plates. This file starts each tool and the sound switch.

import { initSoundButton } from '../soundButton';
import { initPendulum } from './pendulum';
import { initEscapement } from './escapement';
import { initGears } from './gears';
import { initQuartz } from './quartz';

const root = document.querySelector<HTMLElement>('[data-clocks]');

if (root) {
  initPendulum(root);
  initEscapement(root);
  initGears(root);
  initQuartz(root);
  initSoundButton(root);
}
