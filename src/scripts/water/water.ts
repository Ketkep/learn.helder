// The Water page: a river with four stops. This file starts each tool and the sound switch.

import { initSoundButton } from '../soundButton';
import { initWhere } from './where';
import { initAir } from './airtool';
import { initMountain } from './mountain';
import { initDrop } from './drop';

const root = document.querySelector<HTMLElement>('[data-water]');

if (root) {
  initWhere(root);
  initAir(root);
  initMountain(root);
  initDrop(root);
  initSoundButton(root);
}
