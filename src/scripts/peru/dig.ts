// The Peru page: a dig. This file starts each tool and the sound switch.

import { initSoundButton } from '../soundButton';
import { initGauge } from './gauge';
import { initBrush } from './brush';
import { initWall } from './wall';
import { initMarks } from './marks';
import { initPeel } from './peel';
import { initTrade } from './trade';
import { initLab } from './lab';
import { initRuler } from './ruler';

const root = document.querySelector<HTMLElement>('[data-dig]');

if (root) {
  initGauge(root);
  initBrush(root);
  initWall(root);
  initMarks(root);
  initPeel(root);
  initTrade(root);
  initLab(root);
  initRuler(root);
  initSoundButton(root);
}
