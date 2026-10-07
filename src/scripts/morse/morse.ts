// The Morse page: a strip of tape with four messages. This file starts each tool and the sound switch.

import { initSoundButton } from '../soundButton';
import { initKey } from './key';
import { initTree } from './tree';
import { initCommon } from './common';
import { initPlay } from './play';

const root = document.querySelector<HTMLElement>('[data-morse]');

if (root) {
  initKey(root);
  initTree(root);
  initCommon(root);
  initPlay(root);
  initSoundButton(root);
}
