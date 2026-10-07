// The Bridges page: a river crossing with four spans. This file starts each tool and the sound switch.

import { initSoundButton } from '../soundButton';
import { initBeam } from './beam';
import { initArch } from './arch';
import { initFrame } from './frame';
import { initTruss } from './truss';

const root = document.querySelector<HTMLElement>('[data-bridges]');

if (root) {
  initBeam(root);
  initArch(root);
  initFrame(root);
  initTruss(root);
  initSoundButton(root);
}
